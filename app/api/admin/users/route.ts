// app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(request: Request) {
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }
  try {
    // 2. Logique Prisma : Récupération de tous les utilisateurs avec leurs profils
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }, // Les plus récents en premier
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        // Inclure les profils conditionnellement
        companyProfile: {
          select: { companyName: true, location: true },
        },
        candidateProfile: {
          // Assumez que vous avez un modèle StudentProfile
          select: { university: true, cvUrl: true },
        },
      },
    });

    // 3. Formater les données pour une meilleure lisibilité
    const formattedUsers = users.map((user) => {
      let displayName = user.email; // Nom par défaut
      let profileDetails = {};

      if (user.role === UserRole.COMPANY && user.companyProfile) {
        displayName = user.companyProfile.companyName;
        profileDetails = { location: user.companyProfile.location };
      } else if (user.role === UserRole.CANDIDATE && user.candidateProfile) {
        displayName = `${user.fullname}`;
        profileDetails = { university: user.candidateProfile.university };
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: displayName,
        verified: user.emailVerified,
        createdAt: user.createdAt,
        ...profileDetails,
      };
    });

    // 4. Réponse
    return NextResponse.json(
      {
        state: true,
        data: formattedUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur lors du listing des utilisateurs:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur interne lors du listing des utilisateurs.",
      },
      { status: 500 }
    );
  }
}
