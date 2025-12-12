// app/api/admin/jobs/[id]/visibility/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobVisibilitySchema } from "@/schemas/job";
import { authenticate } from "@/lib/authMiddleware";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  const jobId = (await params).id;

  // 2. Validation Zod
  const body = await request.json();
  const validation = jobVisibilitySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const { visibility } = validation.data;

  try {
    // 3. Logique Prisma : Mise à jour du champ visibility
    const updatedJob = await prisma.jobOffer.update({
      where: { id: jobId },
      data: {
        visibility: visibility, // Nouvelle valeur de visibilité
      },
      select: {
        id: true,
        title: true,
        active: true,
        visibility: true,
      },
    });

    // 4. Réponse
    return NextResponse.json(
      {
        state: true,
        data: updatedJob,
        message: `Visibilité de l'offre '${updatedJob.title}' mise à jour à ${visibility}.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur mise à jour visibilité:", error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}
