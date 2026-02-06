import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
      pending: stats.find((s) => s.status === "PENDING")?._count.status || 0,
      reviewing:
        stats.find((s) => s.status === "REVIEWING")?._count.status || 0,
      accepted: stats.find((s) => s.status === "ACCEPTED")?._count.status || 0,
      rejected: stats.find((s) => s.status === "REJECTED")?._count.status || 0,
    };

    const applications = await prisma.application.findMany({
      where: { candidateId: candidateProfileId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        jobOffer: {
          select: {
            title: true,
            slug: true,
            description: true,
            location: true,
            deadline: true,
            type: true,
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
        message: "Candidatures récupérées.",
        data: {
          stats: statsData,
          applications: applications,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return NextResponse.json(
      {
        state: false,
        message: "Erreur interne lors de la récupération des données.",
      },
      { status: 500 }
    );
  }
}
