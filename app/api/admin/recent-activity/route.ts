/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

// Interface pour le type d'activité après normalisation
type ActivityType = "application" | "posting" | "user_joined";

interface RecentActivity {
  id: string;
  type: ActivityType;
  date: Date;
  message: string;
  relatedEntity: string; // Nom de l'entreprise/candidat/offre
}

export async function GET(request: Request) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé (adapter si besoin)
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. Logique Prisma : Récupérer les 10 dernières candidatures et les 10 dernières offres.
    // Nous récupérons un peu plus que 10 pour s'assurer d'avoir 10 après la combinaison/tri.
    const limit = 10;

    // A. Récupérer les candidatures récentes
    const recentApplications = await prisma.application.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        jobOffer: {
          select: { title: true },
        },
        candidate: {
          select: {
            user: { select: { fullname: true } },
          },
        },
      },
    });

    // B. Récupérer les offres d'emploi récentes
    const recentJobOffers = await prisma.jobOffer.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        title: true,
        company: {
          select: { companyName: true },
        },
      },
    });

    // 3. Normalisation et Combinaison des Activités
    const normalizedApplications: RecentActivity[] = recentApplications.map(
      (app: any) => ({
        id: app.id,
        type: "application",
        date: app.createdAt,
        relatedEntity: app.candidate.user.fullname || "Candidat inconnu",
        message: `A postulé à : ${app.jobOffer.title || "Offre supprimée"}`,
      })
    );

    const normalizedJobOffers: RecentActivity[] = recentJobOffers.map(
      (offer: any) => ({
        id: offer.id,
        type: "posting",
        date: offer.createdAt,
        relatedEntity: offer.company?.companyName || "Entreprise inconnue",
        message: `A publié l'offre : ${offer.title}`,
      })
    );

    // 4. Tri et Limitation
    const combinedActivities = [
      ...normalizedApplications,
      ...normalizedJobOffers,
    ];

    combinedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Limiter aux 10 activités les plus récentes
    const top10Activities = combinedActivities.slice(0, 10);

    // 5. Réponse
    return NextResponse.json(
      {
        state: true,
        data: top10Activities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur serveur lors de la récupération des activités récentes:",
      error
    );

    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur interne lors de la récupération des activités.",
      },
      { status: 500 }
    );
  }
}
