/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateCategorySchema } from "@/schemas/admin/category";
import { authenticate } from "@/lib/authMiddleware";

import slugify from "slugify";

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

  const sectorId = (await params).id;

  // 2. Validation Zod
  const body = await request.json();
  const validation = updateCategorySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
    updateData.slug = slugify(data.name, {
      lower: true,
      strict: true,
    });
  }

  try {
    // 3. VÉRIFICATION DE CONFLIT (Slug)
    if (updateData.slug) {
      const existingWithSameSlug = await prisma.sector.findUnique({
        where: { slug: updateData.slug },
      });

      // Si le slug existe et n'appartient PAS à la catégorie que nous modifions
      if (existingWithSameSlug && existingWithSameSlug.id !== sectorId) {
        return NextResponse.json(
          { state: false, error: "Un autre catégorie utilise déjà ce slug." },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // 4. Logique Prisma : Mise à jour
    const updatedSector = await prisma.sector.update({
      where: { id: sectorId },
      data: updateData,
    });

    // 5. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        message: "Secteur mise à jour avec succès.",
        data: updatedSector,
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
  const sectorId = (await params).id;

  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. VÉRIFICATION DE SÉCURITÉ : Est-ce que la catégorie est utilisée par des offres d'emploi ?
    const jobsCount = await prisma.jobOffer.count({
      where: { sectors: { some: { id: sectorId } } },
    });

    if (jobsCount > 0) {
      return NextResponse.json(
        {
          state: false,
          error: `Impossible de supprimer. ${jobsCount} offre(s) d'emploi utilise(nt) encore cette catégorie.`,
        },
        { status: 409 }
      ); // 409 Conflict
    }

    // 3. Logique Prisma : Suppression
    const deletedCategory = await prisma.sector.delete({
      where: { id: sectorId },
    });

    // 4. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        message: `Le secteur '${deletedCategory.name}' a été supprimé avec succès.`,
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
