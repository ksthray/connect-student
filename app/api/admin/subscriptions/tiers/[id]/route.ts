/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";
import { subscriptionTierSchema } from "@/schemas/admin/subscription";

interface Params {
  params: { id: string };
}

// PUT: Mettre à jour un plan existant
export async function PUT(request: Request, { params }: Params) {
  const { isValid, response } = await authenticate(request);
  if (!isValid) return response;

  const tierId = params.id;
  const body = await request.json();

  // Validation (On réutilise le schéma, même si 'name' ne changera pas l'ID reste la clé)
  const validation = subscriptionTierSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  try {
    const updatedTier = await prisma.subscriptionTier.update({
      where: { id: tierId },
      data: {
        priceUSD: data.priceUSD,
        benefits: data.benefits,
        applicationLimit: data.applicationLimit,
        notifiedLimit: data.notifiedLimit,
      },
    });

    return NextResponse.json(
      { state: true, message: "Plan mis à jour.", data: updatedTier },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { state: false, error: "Plan introuvable." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { state: false, error: "Erreur serveur lors de la mise à jour." },
      { status: 500 }
    );
  }
}
