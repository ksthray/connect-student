import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 2. Logique Prisma : Récupération de toutes les catégories
    const sectors = await prisma.sector.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });

    // 3. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        data: sectors,
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
