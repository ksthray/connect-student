// Dans le fichier app/api/user/me/route.ts

import { candidateAuthMiddleware } from "@/lib/candidateMiddleware";
import { prisma } from "@/lib/prisma";
import { calculateProfileCompletion } from "@/utils/profileScore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. RÉCUPÉRATION SÉCURISÉE DE L'ID UTILISATEUR
  const authUser = candidateAuthMiddleware(request);

  if (!authUser) {
    // Si pas de token ou token invalide, refuser l'accès
    return NextResponse.json(
      { error: "Non autorisé ou token manquant." },
      { status: 401 }
    );
  }

  const userId = authUser.id;

  const user = await prisma.user.findUnique({
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

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // 2. Calcul du score
  const score = calculateProfileCompletion({
    user: {
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
    },
    candidateProfile: {
      level: user.candidateProfile?.level || "",
      sectors: user.candidateProfile?.sectors || [],
      university: user.candidateProfile?.university || null,
      skills: user.candidateProfile?.skills || [],
      cvUrl: user.candidateProfile?.cvUrl || null,
      about: user.candidateProfile?.about || null,
    },
  });

  // 3. Réponse au Frontend
  return Response.json({
    ...user,
    profileCompletionScore: score,
  });
}
