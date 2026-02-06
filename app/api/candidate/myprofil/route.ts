/* eslint-disable @typescript-eslint/no-explicit-any */
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { updateCandidateProfileSchema } from "@/schemas/candidate/profile";

export async function PATCH(req: NextRequest) {
  try {
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

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateCandidateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullname, email, skills, image, sectors, ...candidateData } =
      parsed.data;

    // 🔁 Transaction pour cohérence
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Update USER
      if (fullname || email) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...(fullname && { fullname }),
            ...(email && { email }),
            ...(image && { image }),
          },
        });
      }

      // 2️⃣ Update CANDIDATE PROFILE
      const profile = await tx.candidateProfile.update({
        where: { userId },
        data: {
          ...candidateData,

          // Replace skills (add / remove)
          ...(skills && { skills }),

          // Replace sectors (relation)
          ...(sectors && {
            sectors: {
              set: sectors.map((sector: any) => ({ id: sector })),
            },
          }),
        },
      });

      return profile;
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      data: result,
      state: true,
    });
  } catch (error) {
    console.error("UPDATE_CANDIDATE_PROFILE_ERROR", error);

    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

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
        id: true,
        fullname: true,
        email: true,
        phone: true,
        image: true,
        emailVerified: true,
        role: true,
        candidateProfile: {
          select: {
            level: true,
            sectors: true,
            university: true,
            skills: true,
            cvUrl: true,
            about: true,
            city: true,
            commune: true,
            address: true,
            birthday: true,
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
