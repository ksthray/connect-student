/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

import { companyUpdateSchema } from "@/schemas/admin/company";
import { hashPassword } from "@/utils/auth";

type Params = { params: Promise<{ id: string }> };

// Méthode PUT pour modifier une catégorie
export async function PUT(
  request: Request,
  { params }: Params // Récupération de l'ID via les paramètres d'URL
) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  const companyProfileId = (await params).id;

  // 2. Validation Zod
  const body = await request.json();
  const validation = companyUpdateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const { password, email, fullname, phone, ...profileData } = validation.data; // Séparer les données User et Profile

  try {
    const existingProfile = await prisma.companyProfile.findUnique({
      where: { id: companyProfileId },
      select: { userId: true },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { state: false, error: "Profil d'entreprise non trouvé." },
        { status: 404 }
      );
    }
    const userId = existingProfile.userId;
    let hashedPassword;

    // 4. Préparer les données de mise à jour
    const userUpdateData: any = {};
    if (email) userUpdateData.email = email;
    if (fullname) userUpdateData.fullname = fullname;
    if (phone) userUpdateData.phone = phone;

    if (password) {
      hashedPassword = await hashPassword(password);
      userUpdateData.password = hashedPassword;
    }

    // 5. Exécuter la mise à jour dans une transaction (User et CompanyProfile)
    await prisma.$transaction(async (tx) => {
      // A. Mise à jour de l'utilisateur (si des données User sont fournies)
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // B. Mise à jour du profil de l'entreprise (si des données Profile sont fournies)
      if (Object.keys(profileData).length > 0) {
        await tx.companyProfile.update({
          where: { id: companyProfileId },
          data: profileData,
        });
      }
    });

    // 6. Réponse
    return NextResponse.json(
      {
        state: true,
        message: "Compte entreprise mis à jour avec succès.",
        data: { id: companyProfileId },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Gérer le cas où l'ID de la catégorie n'existe pas
    if (error.code === "P2025") {
      return NextResponse.json(
        { state: false, error: "Secteur non trouvé." },
        { status: 404 }
      );
    }
    console.error(
      "Erreur serveur lors de la mise à jour de la catégorie:",
      error
    );
    return NextResponse.json(
      { state: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const companyProfileId = (await params).id;

  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    const existingProfile = await prisma.companyProfile.findUnique({
      where: { id: companyProfileId },
      select: { userId: true },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { state: false, error: "Profil d'entreprise non trouvé." },
        { status: 404 }
      );
    }
    const userId = existingProfile.userId;

    await prisma.$transaction(async (tx) => {
      // A. Supprimer toutes les offres d'abord (si non géré par CASCADE sur JobOffer)
      // Ceci est CRUCIAL car les JobOffers pointent vers le CompanyProfile
      await tx.jobOffer.deleteMany({
        where: { companyId: companyProfileId },
      });

      // B. Supprimer le CompanyProfile (ce qui est la cible principale de l'Admin)
      await tx.companyProfile.delete({
        where: { id: companyProfileId },
      });

      // C. Supprimer le User (dernière étape, enlève le compte de connexion)
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json(
      {
        state: true,
        message:
          "Compte entreprise et données associées supprimés avec succès.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Gérer le cas où l'ID de la catégorie n'existe pas
    if (error.code === "P2025") {
      return NextResponse.json(
        { state: false, error: "Catégorie non trouvée." },
        { status: 404 }
      );
    }
    console.error(
      "Erreur serveur lors de la suppression de la catégorie:",
      error
    );
    return NextResponse.json(
      { state: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}
