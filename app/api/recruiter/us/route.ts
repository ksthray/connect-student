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
      { status: 401 },
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
            website: true,
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
      { status: 500 },
    );
  }
}

import { z } from "zod";
import bcrypt from "bcrypt";

const updateRecruiterProfileSchema = z.object({
  fullname: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { isAuthenticated, user } = userAuthMiddleware(request);

    if (!isAuthenticated || user?.role !== "COMPANY") {
      return NextResponse.json(
        { state: false, message: "Accès refusé. Non authentifié." },
        { status: 401 },
      );
    }

    const userId = user.id;

    const body = await request.json();
    const parsed = updateRecruiterProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
          state: false,
        },
        { status: 400 },
      );
    }

    const {
      fullname,
      email,
      phone,
      currentPassword,
      newPassword,
      companyName,
      industry,
      website,
      location,
      description,
      logo,
    } = parsed.data;

    let passwordHash: string | undefined;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            state: false,
            message: "Le mot de passe actuel est requis pour le modifier.",
          },
          { status: 400 },
        );
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!currentUser?.password) {
        return NextResponse.json(
          { state: false, message: "Operation non autorisée." },
          { status: 400 },
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { state: false, message: "Mot de passe actuel incorrect." },
          { status: 400 },
        );
      }

      passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update USER
      const userUpdateData: any = {};
      if (fullname) userUpdateData.fullname = fullname;
      if (email) userUpdateData.email = email;
      if (phone) userUpdateData.phone = phone;
      if (passwordHash) userUpdateData.password = passwordHash;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // 2. Update COMPANY PROFILE
      const companyUpdateData: any = {};
      if (companyName) companyUpdateData.companyName = companyName;
      if (industry) companyUpdateData.industry = industry;
      if (website) companyUpdateData.website = website;
      if (location) companyUpdateData.location = location;
      if (description) companyUpdateData.description = description;
      if (logo) companyUpdateData.logo = logo;

      if (Object.keys(companyUpdateData).length > 0) {
        await tx.companyProfile.update({
          where: { userId },
          data: companyUpdateData,
        });
      }

      // Return updated profile
      return await tx.user.findUnique({
        where: { id: userId },
        select: {
          fullname: true,
          email: true,
          phone: true,
          role: true,
          companyProfile: {
            select: {
              companyName: true,
              description: true,
              location: true,
              logo: true,
              industry: true,
              website: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès !",
      data: result,
      state: true,
    });
  } catch (error) {
    console.error("UPDATE_RECRUITER_PROFILE_ERROR", error);
    return NextResponse.json(
      { state: false, message: "Erreur serveur interne." },
      { status: 500 },
    );
  }
}
