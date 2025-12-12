/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/categories/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/schemas/admin/category";
import { authenticate } from "@/lib/authMiddleware";

import slugify from "slugify";

export async function POST(request: Request) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  // 2. Validation Zod
  const body = await request.json();
  const validation = createCategorySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  const slugSector = slugify(data.name, {
    lower: true,
    strict: true,
  });

  // 3. Logique Prisma : Création
  try {
    const existing = await prisma.sector.findUnique({
      where: { slug: slugSector },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Cette catégorie existe déjà." },
        { status: 409 }
      );
    }

    const newSector = await prisma.sector.create({
      data: {
        name: data.name,
        slug: slugSector,
      },
    });

    // 4. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        data: newSector,
        message: "Secteur créé avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur lors de la création de la catégorie.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. Logique Prisma : Récupération de toutes les catégories
    const sectors = await prisma.sector.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,

        // L'agrégation est bien demandée au niveau racine de 'select'
        _count: {
          select: {
            // Ces noms sont corrects si vous avez bien mis à jour le schema M:N
            jobOffers: true,
            candidateProfiles: true,
          },
        },
      },
    });

    const formattedSectors = sectors.map((sector: any) => ({
      id: sector.id,
      name: sector.name,
      slug: sector.slug,
      createdAt: sector.createdAt,
      totalOpportunities: sector._count.jobOffers,
      totalCandidates: sector._count.candidateProfiles,
    }));

    // 3. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        data: formattedSectors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur lors de la récupération des catégories.",
      },
      { status: 500 }
    );
  }
}
