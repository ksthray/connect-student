// src/app/api/candidate/dashboard/route.ts

import { NextRequest, NextResponse } from "next/server";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma"; // Assurez-vous d'importer votre instance prisma

/**
 * Route GET agrégée pour le tableau de bord du candidat.
 * URL: /api/candidate/dashboard
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
        id: true,
      },
    });

    if (!candidateProfile) {
      return NextResponse.json(
        { state: false, message: "Profil Candidat introuvable." },
        { status: 404 }
      );
    }

    const candidateProfileId = candidateProfile.id;

    // --- A. STATISTIQUES DES CANDIDATURES (candidate-stat.png) ---
    const stats = await prisma.application.groupBy({
      by: ["status"],
      where: { candidateId: candidateProfileId },
      _count: {
        status: true,
      },
    });

    const totalApplications = stats.reduce(
      (acc, s) => acc + s._count.status,
      0
    );

    // Mappage des stats dans un format facile à consommer côté client
    const statsData = {
      applicationsSent: totalApplications,
      accepted: stats.find((s) => s.status === "ACCEPTED")?._count.status || 0,
      rejected: stats.find((s) => s.status === "REJECTED")?._count.status || 0,
    };

    // --- B. CANDIDATURES RÉCENTES (candidate-recent.png) ---
    const recentApplications = await prisma.application.findMany({
      where: { candidateId: candidateProfileId },
      orderBy: { createdAt: "desc" },
      take: 4, // Limiter à 4 ou 5 comme dans votre capture d'écran
      select: {
        id: true,
        status: true,
        createdAt: true,
        jobOffer: {
          select: {
            title: true,
            description: true,
            deadline: true,
            company: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        state: true,
        message: "Statistiques et candidatures récentes récupérées.",
        data: {
          stats: statsData,
          recentApplications: recentApplications,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du tableau de bord:", error);
    return NextResponse.json(
      {
        state: false,
        message: "Erreur interne lors de la récupération des données.",
      },
      { status: 500 }
    );
  }
}

// ... (Catch error inchangé) ...
