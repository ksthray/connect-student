import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";

/**
 * Route GET pour le tableau de bord Recruteur/Entreprise.
 * URL: /api/recruiter/dashboard
 */
export async function GET(req: NextRequest) {
  // 1. VÉRIFICATION DE L'AUTHENTIFICATION
  const { isAuthenticated, user } = userAuthMiddleware(req);

  if (!isAuthenticated || user?.role !== "COMPANY") {
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
    // 2. RÉCUPÉRATION DU PROFIL RECRUTEUR / ENTREPRISE
    // On cherche l'ID de l'entreprise associée à ce recruteur
    const recruiterProfile = await prisma.companyProfile.findUnique({
      where: { userId: userId },
      select: {
        id: true,
      },
    });

    if (!recruiterProfile || !recruiterProfile.id) {
      return NextResponse.json(
        { state: false, message: "Profil entreprise introuvable." },
        { status: 404 }
      );
    }

    const companyId = recruiterProfile.id;

    // 3. RÉCUPÉRATION DES DONNÉES EN PARALLÈLE (Optimisation)
    const [totalOffers, totalApplications, recentApplications] =
      await Promise.all([
        // A. Total des opportunités soumises par l'entreprise
        prisma.jobOffer.count({
          where: { companyId: companyId },
        }),

        // B. Total de candidatures reçues pour toutes les offres de l'entreprise
        prisma.application.count({
          where: {
            jobOffer: {
              companyId: companyId,
            },
          },
        }),

        // C. Les 5 candidatures les plus récentes
        prisma.application.findMany({
          where: {
            jobOffer: {
              companyId: companyId,
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            status: true,
            createdAt: true,
            cvUrl: true,
            // Informations sur l'offre concernée
            jobOffer: {
              select: {
                title: true,
              },
            },
            // Informations sur le candidat (Profil et User)
            candidate: {
              select: {
                user: {
                  select: {
                    fullname: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
      ]);

    // 4. RÉPONSE
    return NextResponse.json(
      {
        state: true,
        message: "Données du tableau de bord recruteur récupérées.",
        data: {
          stats: {
            totalOffers,
            totalApplications,
          },
          recentApplications: recentApplications,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur Dashboard Recruteur:", error);
    return NextResponse.json(
      {
        state: false,
        message: "Erreur interne lors de la récupération des statistiques.",
      },
      { status: 500 }
    );
  }
}
