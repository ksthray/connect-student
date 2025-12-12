// app/api/admin/stats/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(request: Request) {
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. Logique Prisma : Récupération de tous les compteurs
    const [
      totalUsers,
      totalStudents,
      totalCompanies,
      totalOffers,
      activeOffers,
      totalApplications, // Assumez que le modèle Application est créé
    ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.user.count({ where: { role: "COMPANY" } }),
      prisma.jobOffer.count(),
      prisma.jobOffer.count({ where: { active: true, visibility: true } }),
      prisma.application.count(), // Compte total des candidatures
    ]);

    // 3. Construction de l'objet de statistiques
    const stats = {
      totalUsers: totalUsers,
      totalStudents: totalStudents,
      totalCompanies: totalCompanies,

      totalOpportunities: totalOffers,
      activeListings: activeOffers,
      totalApplications: totalApplications,

      // Un exemple simple de Taux de Placement (Taux de conversion vue/offre)
      // Vous devrez affiner ce calcul en fonction de données réelles (ex: applications acceptées)
      placementRateExample:
        totalApplications > 0
          ? (activeOffers / totalApplications).toFixed(2)
          : 0,
    };

    // 4. Réponse
    return NextResponse.json(
      {
        state: true,
        data: stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur serveur lors de la récupération des statistiques:",
      error
    );
    return NextResponse.json(
      {
        state: false,
        error:
          "Erreur serveur interne lors de la récupération des statistiques.",
      },
      { status: 500 }
    );
  }
}
