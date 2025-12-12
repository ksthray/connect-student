import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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
