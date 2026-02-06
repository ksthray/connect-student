/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/jobs/[jobId]/apply/route.ts
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint POST pour soumettre une candidature à une offre spécifique.
 * URL: /api/jobs/[jobId]/apply
 * Méthode: POST
 */
type Params = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const slug = (await params).slug;

  const { coverLetter, cvUrl } = (await req.json()) as {
    coverLetter: string;
    cvUrl: string;
  };

  if (!slug) {
    return NextResponse.json(
      {
        state: false,
        message: "Slug manquant dans la requête.",
      },
      { status: 400 }
    );
  }

  if (!cvUrl) {
    return NextResponse.json(
      {
        state: false,
        message: "L'URL du CV est manquante. Veuillez soumettre un CV.",
      },
      { status: 400 }
    );
  }

  // 1. VÉRIFICATION DE L'AUTHENTIFICATION ET RÔLE
  const { isAuthenticated, user } = userAuthMiddleware(req);

  if (!isAuthenticated || user?.role !== "CANDIDATE") {
    return NextResponse.json(
      {
        state: false,
        message:
          "Accès refusé. Vous devez être connecté en tant que Candidat pour postuler.",
      },
      { status: 401 }
    );
  }

  const candidateId = user.id; // L'ID du candidat postulant

  // 2. CORRECTION DE LA REQUÊTE PRISMA
  // On trouve le CandidateProfile, puis on inclut l'User, puis l'UserSubscription, puis le SubscriptionTier.
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId: candidateId }, // Le CandidateProfile est lié par userId
    select: {
      cvUrl: true,
      id: true,
      // INCLUSION CORRIGÉE pour atteindre applicationLimit
      user: {
        select: {
          subscription: {
            select: {
              tier: {
                select: {
                  applicationLimit: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!candidateProfile) {
    return NextResponse.json(
      {
        state: false,
        message:
          "Profil Candidat introuvable. Veuillez compléter votre profil.",
      },
      { status: 404 }
    );
  }

  // Renommons la variable pour plus de clarté
  const candidateProfileId = candidateProfile.id;

  // 4. CRÉATION DE LA CANDIDATURE (Reste inchangé)

  const jobOffer = await prisma.jobOffer.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
    },
  });

  if (!jobOffer) {
    return NextResponse.json(
      {
        state: false,
        message: "Offre d'emploi non trouvée.",
      },
      { status: 404 }
    );
  }

  try {
    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobOfferId: {
          candidateId: candidateProfileId,
          jobOfferId: jobOffer.id,
        },
      },
      select: { id: true },
    });

    if (existingApplication) {
      return NextResponse.json(
        { state: false, message: "Vous avez déjà postulé à cette offre." },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobOfferId: jobOffer.id,
        candidateId: candidateProfileId,
        status: "PENDING",
        cvUrl: cvUrl,
        coverLetter: coverLetter || null,
      },
    });

    return NextResponse.json(
      {
        state: true,
        message: "Candidature soumise avec succès !",
        data: application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { state: false, message: "Vous avez déjà postulé à cette offre." },
        { status: 409 }
      );
    }

    console.error(
      `Erreur lors de la candidature à l'offre ${jobOffer.id}:`,
      error
    );
    return NextResponse.json(
      {
        state: false,
        message:
          "Erreur interne du serveur lors de la soumission de la candidature.",
      },
      { status: 500 }
    );
  }
}
