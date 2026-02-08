/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobSearchSchema } from "@/schemas/job";
import { authenticate } from "@/lib/authMiddleware";
import { JobType } from "@prisma/client";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";

// Mapping des mots-clés vers les Types d'offres
const TYPE_MAPPING: Record<string, JobType> = {
  stage: "INTERNSHIP",
  stages: "INTERNSHIP",
  emploi: "FULL_TIME", // ou PART_TIME, mais souvent implicite pour emploi
  emplois: "FULL_TIME",
  travail: "FULL_TIME",
  job: "FULL_TIME",
  jobs: "FULL_TIME",
  formation: "TRAINING",
  formations: "TRAINING",
  evenement: "EVENT",
  événement: "EVENT",
  conference: "CONFERENCE",
  conférence: "CONFERENCE",
};

export async function GET(request: NextRequest) {
  // 1. Récupération des paramètres d'URL
  const { searchParams } = new URL(request.url);

  const { isAuthenticated } = userAuthMiddleware(request);

  // Constante de limite pour les non-connectés
  const GUEST_LIMIT = 3;

  // Conversion des searchParams pour Zod
  const rawParams = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    sectorIds: searchParams.get("sectorIds"),
    words: searchParams.get("words"),
    type: searchParams.get("type"),
  };

  // 2. Validation Zod
  const validation = jobSearchSchema.safeParse(rawParams);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 },
    );
  }

  let { page, limit } = validation.data;
  const { sectorIds, words, type } = validation.data;

  // SI l'utilisateur n'est PAS connecté, la limite est FORCÉE
  if (!isAuthenticated) {
    limit = GUEST_LIMIT;
    page = 1; // page forcée
  }

  const skip = (page - 1) * limit;

  // 4. Construction de la Clause WHERE dynamique
  const where: any = {
    active: true,
    visibility: true,
  };

  // --- LOGIQUE DE RECHERCHE INTELLIGENTE ---
  let searchTerms = words ? words.trim() : "";
  let finalType = type as JobType | undefined | null;

  // Si on a des mots-clés, on tente de déduire le type si aucun type n'est fourni
  if (searchTerms) {
    const lowerWords = searchTerms.toLowerCase();

    // Vérifie si le mot entier correspond à une clé (ex: "stage")
    if (TYPE_MAPPING[lowerWords] && !finalType) {
      finalType = TYPE_MAPPING[lowerWords];
      // Si c'est un match EXACT de type (ex: "stage"), on NE cherche PAS le texte "stage" dans le titre
      // car l'utilisateur veut probablement TOUTES les offres de stage.
      searchTerms = "";
    }
  }

  // Application du filtre Type
  if (finalType) {
    where.type = finalType;
  }

  // Application de la recherche textuelle (si non vide)
  if (searchTerms) {
    where.OR = [
      { title: { contains: searchTerms, mode: "insensitive" } },
      { description: { contains: searchTerms, mode: "insensitive" } },
      // On peut ajouter la recherche par entreprise
      {
        company: {
          companyName: { contains: searchTerms, mode: "insensitive" },
        },
      },
    ];
  }

  // Application du filtre Secteurs
  if (sectorIds && sectorIds.length > 0) {
    const idsArray = sectorIds.split(",");
    where.sectors = {
      some: {
        id: { in: idsArray },
      },
    };
  }

  try {
    // 5. Exécution de la requête
    const [jobs, totalCount] = await prisma.$transaction([
      prisma.jobOffer.findMany({
        where: where,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
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
      prisma.jobOffer.count({ where: where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        state: true,
        data: {
          jobs: jobs,
          isLimited: !isAuthenticated && totalCount > GUEST_LIMIT,
          pagination: {
            total: totalCount,
            currentPage: page,
            perPage: limit,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            // Debug info
            detectedType: finalType,
            searchTerms: searchTerms,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur recherche jobs:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur lors de la recherche.",
      },
      { status: 500 },
    );
  }
}
