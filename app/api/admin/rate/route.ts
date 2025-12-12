import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware"; //
import { paymentRateSchema } from "@/schemas/admin/rate";

// GET: Récupérer le taux de change ACTUEL (le plus récent)
export async function GET() {
  // Cette route peut être publique ou protégée selon vos besoins.
  // Ici, on la laisse accessible pour que le frontend puisse convertir les prix.

  try {
    const currentRate = await prisma.paymentRate.findFirst({
      orderBy: { createdAt: "desc" }, // On prend le dernier créé
    });

    if (!currentRate) {
      return NextResponse.json(
        { state: false, error: "Aucun taux de change configuré." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        state: true,
        data: {
          ...currentRate,
          rate: currentRate.rate.toNumber(), // Convertir Decimal Prisma en Number JS pour le frontend
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur lors de la récupération du taux.",
      },
      { status: 500 }
    );
  }
}

// POST: Définir un NOUVEAU taux (Historisation)
// Plutôt que de modifier l'ancien, on en crée un nouveau pour garder l'historique des taux.
export async function POST(request: Request) {
  const { isValid, response } = await authenticate(request);
  if (!isValid) return response;

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
    const newRate = await prisma.paymentRate.create({
      data: {
        rate: rate, // Prisma gère la conversion vers Decimal
      },
    });

    return NextResponse.json(
      {
        state: true,
        message: "Nouveau taux de change appliqué.",
        data: {
          ...newRate,
          rate: newRate.rate.toNumber(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur lors de la création du taux." },
      { status: 500 }
    );
  }
}
