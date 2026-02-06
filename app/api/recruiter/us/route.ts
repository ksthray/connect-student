// Dans le fichier app/api/recruiter/us/route.ts

import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. RÉCUPÉRATION SÉCURISÉE DE L'ID UTILISATEUR
  const { isAuthenticated, user } = userAuthMiddleware(request);

  if (!isAuthenticated || user?.role !== "COMPANY") {
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
        companyProfile: {
          select: {
            id: true,
            companyName: true,
            description: true,
            location: true,
            logo: true,
            industry: true,
          },
        },
      },
    });

    if (!getUser) {
      return new Response("User not found", { status: 404 });
    }
    // 3. Réponse au Frontend
    return Response.json({
      state: true,
      data: getUser,
      message: "Récupération du profil réussi !",
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
