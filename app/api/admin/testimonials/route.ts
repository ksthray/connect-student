import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🔹 GET : Récupérer tous les avis
export async function GET(req: Request) {
  try {
    const { isValid, response } = await authenticate(req);

    if (!isValid) {
      return response; // Stop ici si token invalide
    }
    const avis = await prisma.testimony.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ state: true, data: avis });
  } catch (error) {
    console.error("[GET_AVIS_LIST_ERROR]", error);
    return NextResponse.json(
      { state: false, message: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

// 🔹 POST : Créer un nouvel avis
export async function POST(req: Request) {
  try {
    const { isValid, response } = await authenticate(req);

    if (!isValid) {
      return response; // Stop ici si token invalide
    }

    const body = await req.json();
    const { fullname, photo, post, email, stars, comment } = body;

    const newAvis = await prisma.testimony.create({
      data: {
        fullname,
        photo,
        post,
        email,
        stars,
        comment,
      },
    });

    return NextResponse.json(
      { state: true, data: newAvis, message: "Temoignange ajouté avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AVIS_POST_ERROR]", error);
    return NextResponse.json(
      { state: false, message: "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}
