// Dans le fichier app/api/candidate/me/route.ts

import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma";
import { calculateProfileCompletion } from "@/utils/profileScore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. RÉCUPÉRATION SÉCURISÉE DE L'ID UTILISATEUR
  const { isAuthenticated, user } = userAuthMiddleware(request);

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
    const getUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullname: true,
        email: true,
        phone: true,
        role: true,
        candidateProfile: {
          select: {
            level: true,
            sectors: true,
            university: true,
            skills: true,
            cvUrl: true,
            about: true,
          },
        },
      },
    });

    if (!getUser) {
      return new Response("User not found", { status: 404 });
    }

    const candidateProfileData = getUser.candidateProfile;

    // 2. Calcul du score
    const score = calculateProfileCompletion({
      user: {
        fullname: getUser.fullname,
        email: getUser.email,
        phone: getUser.phone,
      },
      candidateProfile: {
        level: candidateProfileData?.level || null,
        sectors: candidateProfileData?.sectors || null,
        university: candidateProfileData?.university || null,
        skills: candidateProfileData?.skills || [],
        cvUrl: candidateProfileData?.cvUrl || null,
        about: candidateProfileData?.about || null,
      },
    });

    // 3. Réponse au Frontend
    return Response.json({
      ...user,
      profileCompletionScore: score,
    });
  } catch (error) {
    console.error("Erreur lors du user:", error);
    return NextResponse.json(
      {
        state: false,
        message: "Erreur interne lors de la récupération des données.",
      },
      { status: 500 }
    );
  }
}
