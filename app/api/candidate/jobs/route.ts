/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobSearchSchema } from "@/schemas/job";
import { authenticate } from "@/lib/authMiddleware"; // <-- Assurez-vous d'importer votre middleware

export async function GET(request: Request) {
  // 1. Récupération des paramètres d'URL
  const { searchParams } = new URL(request.url);

  // 1b. Vérification de l'authentification
  // Nous récupérons l'état d'authentification SANS exiger d'être connecté.
  const { isValid: isAuthenticated } = await authenticate(request);

  // Constante de limite pour les non-connectés
  const GUEST_LIMIT = 3;

  // Conversion des searchParams en objet simple pour Zod
  const rawParams = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    sectorIds: searchParams.get("sectorIds"),
  };

  // 2. Validation Zod
  const validation = jobSearchSchema.safeParse(rawParams);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  // 3. Application de la logique de limite conditionnelle
  let { page, limit } = validation.data;
  const { sectorIds } = validation.data;

  // SI l'utilisateur n'est PAS connecté, la limite est FORCÉE à 3.
  if (!isAuthenticated) {
    limit = GUEST_LIMIT;
    // On force aussi la page à 1 pour les non-connectés (pas de pagination)
    page = 1;
  }

  const skip = (page - 1) * limit;

  // 4. Construction de la Clause WHERE dynamique (Reste inchangée)
  const where: any = {
    active: true,
    visibility: true,
  };

  if (sectorIds && sectorIds.length > 0) {
    const idsArray = sectorIds.split(",");

    where.sectors = {
      some: {
        id: { in: idsArray },
      },
    };
  }

  try {
    // 5. Exécution de la requête (Transaction pour données + compteur total)
    const [jobs, totalCount] = await prisma.$transaction([
      // A. Récupérer les offres
      prisma.jobOffer.findMany({
        where: where,
        skip: skip,
        take: limit, // <-- La limite est maintenant GUEST_LIMIT si non connecté
        orderBy: { createdAt: "desc" },
        select: {
          title: true,
          coverImage: true,
          description: true,
          slug: true,
          type: true,
          deadline: true,
          createdAt: true,
          company: {
            select: {
              companyName: true,
              logo: true,
              location: true,
            },
          },
          sectors: {
            select: { name: true, slug: true },
          },
        },
      }),

      // B. Compter le nombre total de résultats (pour la pagination complète)
      // NOTE: Le comptage total doit rester sur la limite complète
      // si vous affichez un message du genre "Voir les X autres offres en vous connectant"
      prisma.jobOffer.count({ where: where }),
    ]);

    // 6. Calcul des métadonnées de pagination
    // La pagination doit refléter la limite APPLIQUÉE (limit)
    const totalPages = Math.ceil(totalCount / limit);

    // 7. Réponse
    return NextResponse.json(
      {
        state: true,
        data: {
          jobs: jobs,
          // Vous pouvez ajouter une indication si la liste est limitée
          isLimited: !isAuthenticated && totalCount > GUEST_LIMIT,
          pagination: {
            total: totalCount,
            currentPage: page,
            perPage: limit,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur listing jobs:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur lors de la récupération des offres.",
      },
      { status: 500 }
    );
  }
}
