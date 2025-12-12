// app/api/admin/jobs/analytics/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(request: Request) {
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. Liste des offres avec le nombre de candidatures et de vues (via l'agrégation)
    const allJobsWithCounts = await prisma.jobOffer.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        viewCount: true,
        company: {
          select: { companyName: true },
        },
        _count: {
          select: { applications: true }, // Compte le nombre de candidatures
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Préparer les listes Top 10 (basées sur les données récupérées)
    const topByApplications = [...allJobsWithCounts]
      .sort((a, b) => b._count.applications - a._count.applications)
      .slice(0, 10);

    const topByViews = [...allJobsWithCounts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);

    // 4. Liste Activité Récente (les 10 dernières applications)
    const recentApplications = await prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        jobOffer: {
          select: { title: true, company: { select: { companyName: true } } },
        },

        candidate: {
          select: { user: { select: { fullname: true, email: true } } },
        },
      },
    });

    // 5. Réponse
    return NextResponse.json(
      {
        state: true,
        data: {
          jobList: allJobsWithCounts.map((job) => ({
            ...job,
            applicationCount: job._count.applications,
            _count: undefined, // Nettoyer l'objet avant envoi
          })),
          topByApplications: topByApplications,
          topByViews: topByViews,
          recentActivity: recentApplications,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur lors de l'analyse des offres:", error);
    return NextResponse.json(
      {
        state: false,
        error:
          "Erreur serveur interne lors de la récupération des données analytiques.",
      },
      { status: 500 }
    );
  }
}
