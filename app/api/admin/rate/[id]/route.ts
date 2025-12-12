/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";
import { paymentRateSchema } from "@/schemas/admin/rate";

type Params = { params: Promise<{ id: string }> };

// PUT: Corriger un taux spécifique
export async function PUT(request: Request, { params }: Params) {
  const { isValid, response } = await authenticate(request);
  if (!isValid) return response;

  const rateId = (await params).id;

  const body = await request.json();
  const validation = paymentRateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const { rate } = validation.data;

  try {
    const updatedRate = await prisma.paymentRate.update({
      where: { id: rateId },
      data: {
        rate: rate,
      },
    });

    return NextResponse.json(
      {
        state: true,
        message: "Taux corrigé avec succès.",
        data: {
          ...updatedRate,
          rate: updatedRate.rate.toNumber(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { state: false, error: "ID de taux introuvable." },
        { status: 404 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur lors de la modification." },
      { status: 500 }
    );
  }
}
