// app/api/jobs/[id]/view/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Importation de l'API cookies de Next.js
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const jobId = params.id;
  const cookieStore = cookies();

  // Clé du cookie pour cette offre spécifique (ex: viewed_job_clx5t...123)
  const cookieName = `viewed_job_${jobId}`;

  // Durée d'expiration du cookie (24 heures en secondes)
  const COOKIE_MAX_AGE = 60 * 60 * 24;

  try {
    // 1. VÉRIFICATION DU COOKIE (Anti-triche)
    const hasViewed = (await cookieStore).get(cookieName);

    if (hasViewed) {
      // Si le cookie existe, nous avons déjà compté cette vue récemment.
      return NextResponse.json(
        {
          state: true,
          message: "Vue déjà comptée pour cette offre récemment.",
        },
        { status: 200 }
      );
    }

    // 2. INCÉMENTATION DANS PRISMA (Vue valide)
    const updatedJob = await prisma.jobOffer.update({
      where: { id: jobId },
      data: {
        viewCount: {
          increment: 1, // Incrémente le compteur de 1
        },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    // 3. ENREGISTREMENT DU COOKIE
    // Définir le cookie pour empêcher le comptage répété pendant 24 heures
    (
      await // 3. ENREGISTREMENT DU COOKIE
      // Définir le cookie pour empêcher le comptage répété pendant 24 heures
      cookieStore
    ).set(cookieName, "true", {
      httpOnly: true, // Le cookie n'est pas accessible via JavaScript (sécurité)
      secure: process.env.NODE_ENV === "production", // Seulement via HTTPS en production
      maxAge: COOKIE_MAX_AGE,
      path: "/", // Accessible sur tout le site
      sameSite: "lax",
    });

    // 4. Réponse
    return NextResponse.json(
      {
        state: true,
        data: {
          id: updatedJob.id,
          viewCount: updatedJob.viewCount,
        },
        message: "Vue enregistrée avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur serveur lors de l'incrémentation du compteur de vues:",
      error
    );
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur interne lors du comptage de la vue.",
      },
      { status: 500 }
    );
  }
}
