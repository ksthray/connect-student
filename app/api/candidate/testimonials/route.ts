export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const testimonies = await prisma.testimony.findMany({
      select: {
        fullname: true,
        photo: true,
        post: true,
        comment: true,
        stars: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ state: true, data: testimonies });
  } catch (error) {
    console.error("[GET_AVIS_LIST_ERROR]", error);
    return NextResponse.json(
      { state: false, message: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}
