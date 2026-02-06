// src/app/api/jobs/[slug]/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Récupère les détails d'une offre d'emploi par son slug.
 * * URL: /api/jobs/[slug]
 * Méthode: GET
 */
type Params = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const slug = (await params).slug;

  if (!slug) {
    return NextResponse.json(
      {
        state: false,
        message: "Slug manquant dans la requête.",
      },
      { status: 400 }
    );
  }

  try {
    // 1. Récupération des informations d'authentification (pour un usage futur)
    // const { isAuthenticated, user, subscriptionPlan } = getAuth(req);
    // Dans cet exemple simple, nous allons permettre l'accès public pour la visibilité

    // 2. Requête Prisma pour récupérer l'offre
    const jobOffer = await prisma.jobOffer.findUnique({
      where: {
        slug: slug,
        visibility: true,
      },
      select: {
        title: true,
        description: true,
        coverImage: true,
        type: true,
        slug: true,
        location: true,
        detail: true,
        requirements: true,
        deadline: true,
        createdAt: true,
        // Ajoutez tous les champs que le candidat doit voir

        // Inclusion des relations nécessaires
        company: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            description: true,
          },
        },
        sectors: {
          select: {
            id: true,
            name: true,
          },
        },
        // Autres relations (Ex: skills, requirements, etc.)
      },
    });

    // 3. Vérification de l'existence de l'offre
    if (!jobOffer) {
      return NextResponse.json(
        {
          state: false,
          message: "Offre non trouvée ou non publiée.",
        },
        { status: 404 }
      );
    }

    // 5. Réponse Succès
    return NextResponse.json(
      {
        state: true,
        message: "Détails de l'offre récupérés avec succès.",
        data: jobOffer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'offre ${slug}:`, error);
    return NextResponse.json(
      {
        state: false,
        message:
          "Erreur interne du serveur lors de la récupération de l'offre.",
      },
      { status: 500 }
    );
  }
}
