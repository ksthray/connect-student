/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/candidate/recommendations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma";

/**
 * Route GET pour les offres d'emploi recommandées au candidat.
 * URL: /api/candidate/recommendations
 */
export async function GET(req: NextRequest) {
  // 1. VÉRIFICATION DE L'AUTHENTIFICATION
  const { isAuthenticated, user } = userAuthMiddleware(req);

  if (!isAuthenticated || user?.role !== "CANDIDATE") {
    return NextResponse.json(
      {
        state: false,
        message: "Accès refusé. Non authentifié ou rôle incorrect.",
      },
      { status: 401 }
    );
  }

  const userId = user.id;

  try {
    // 2. RÉCUPÉRATION DU PROFIL CANDIDAT (pour les centres d'intérêt)
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: userId },
      select: {
        // Assurez-vous que ce champ contient un tableau de strings des secteurs d'intérêt
        sectors: true,
      },
    });

    if (!candidateProfile) {
      return NextResponse.json(
        {
          state: false,
          message:
            "Profil Candidat introuvable. Impossible de générer des recommandations.",
        },
        { status: 404 }
      );
    }

    const interestSectors = candidateProfile.sectors || [];

    if (interestSectors.length === 0) {
      // Retourne un tableau vide si aucun secteur n'est défini
      return NextResponse.json(
        { state: true, message: "Aucun secteur d'intérêt défini.", data: [] },
        { status: 200 }
      );
    }

    // 3. RECHERCHE DES OFFRES RECOMMANDÉES
    const recommendedJobs = await prisma.jobOffer.findMany({
      where: {
        // Recherche des offres dont le champ 'sectors' contient au moins un des secteurs d'intérêt du candidat
        sectors: {
          some: {
            name: {
              in: interestSectors.map((sec: any) => sec.name),
            },
          },
        },
        visibility: true, // Ne recommander que les offres actives
      },
      orderBy: {
        createdAt: "desc", // Priorité aux offres les plus récentes
      },
      take: 6, // Limiter à un nombre raisonnable
      select: {
        slug: true,
        title: true,
        type: true,
        description: true,
        deadline: true,
        location: true,
        coverImage: true,
        company: {
          select: {
            companyName: true,
          },
        },
      },
    });

    // 5. ENVOI DE LA RÉPONSE
    return NextResponse.json(
      {
        state: true,
        message: "Recommandations d'offres d'emploi récupérées.",
        data: recommendedJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations:", error);
    return NextResponse.json(
      {
        state: false,
        message: "Erreur interne lors de la récupération des recommandations.",
      },
      { status: 500 }
    );
  }
}
