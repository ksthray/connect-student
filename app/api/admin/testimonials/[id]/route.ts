// api/admin/testimonials/[id]/route.ts

import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// 🔹 GET : Récupérer un avis par ID
export async function GET(req: Request, { params }: Params) {
  try {
    const { isValid, response } = await authenticate(req);

    if (!isValid) {
      return response; // Stop ici si token invalide
    }

    const testimonyId = (await params).id;

    const avis = await prisma.testimony.findUnique({
      where: { id: testimonyId },
    });

    if (!avis)
      return NextResponse.json({ message: "Avis non trouvé" }, { status: 404 });
    return NextResponse.json({ state: true, data: avis });
  } catch (error) {
    console.error("[GET_AVIS_ERROR]", error);
    return NextResponse.json(
      { state: false, message: "Erreur lors de la récupération de l'avis" },
      { status: 500 }
    );
  }
}

// 🔹 PUT : Mettre à jour un avis
export async function PUT(req: Request, { params }: Params) {
  try {
    const { isValid, response } = await authenticate(req);

    if (!isValid) {
      return response; // Stop ici si token invalide
    }

    const testimonyId = (await params).id;

    const { fullname, photo, post, email, stars, comment } = await req.json();

    const updatedAvis = await prisma.testimony.update({
      where: { id: testimonyId },
      data: {
        fullname,
        photo,
        post,
        email,
        stars,
        comment,
      }, // ⚠️ body doit contenir uniquement les champs à mettre à jour
    });

    return NextResponse.json({
      state: true,
      data: updatedAvis,
      message: "Avis modifié avec succès",
    });
  } catch (error) {
    console.error("[PUT_AVIS_ERROR]", error);
    return NextResponse.json(
      { state: false, message: "Erreur lors de la mise à jour de l'avis" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE : Supprimer un avis
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { isValid, response } = await authenticate(req);

    if (!isValid) {
      return response; // Stop ici si token invalide
    }

    const testimonyId = (await params).id;

    await prisma.testimony.delete({
      where: { id: testimonyId },
    });
    return NextResponse.json({
      state: true,
      message: "Avis supprimé avec succès",
    });
  } catch (error) {
    console.error("[DELETE_AVIS_ERROR]", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'avis" },
      { status: 500 }
    );
  }
}
