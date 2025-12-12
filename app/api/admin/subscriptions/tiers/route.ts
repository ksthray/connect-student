import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";
import { subscriptionTierSchema } from "@/schemas/admin/subscription";

// GET: Lister tous les plans configurés
export async function GET(request: Request) {
  const { isValid, response } = await authenticate(request);
  if (!isValid) return response;

  try {
    const tiers = await prisma.subscriptionTier.findMany({
      orderBy: { priceUSD: "asc" },
    });

    return NextResponse.json({ state: true, data: tiers }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { state: false, error: "Erreur lors de la récupération des plans." },
      { status: 500 }
    );
  }
}

// POST: Créer un nouveau plan (ex: Initialiser le plan PREMIUM)
export async function POST(request: Request) {
  const { isValid, response } = await authenticate(request);
  if (!isValid) return response;

  const body = await request.json();
  const validation = subscriptionTierSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  try {
    // Vérifier si ce plan existe déjà (Unicité de l'Enum)
    const existing = await prisma.subscriptionTier.findUnique({
      where: { name: data.name as "FREE" | "STANDARD" | "PREMIUM" },
    });

    if (existing) {
      return NextResponse.json(
        {
          state: false,
          error: `Le plan ${data.name} existe déjà. Utilisez PUT pour le modifier.`,
        },
        { status: 409 }
      );
    }

    const newTier = await prisma.subscriptionTier.create({
      data: {
        name: data.name as "FREE" | "STANDARD" | "PREMIUM",
        priceUSD: data.priceUSD,
        benefits: data.benefits,
        applicationLimit: data.applicationLimit,
        notifiedLimit: data.notifiedLimit,
      },
    });

    return NextResponse.json(
      { state: true, message: "Plan créé avec succès.", data: newTier },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur lors de la création." },
      { status: 500 }
    );
  }
}
