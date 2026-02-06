import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobActiveSchema } from "@/schemas/job";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { isAuthenticated, user } = await userAuthMiddleware(request);

  if (!isAuthenticated || user?.role !== "COMPANY") {
    return NextResponse.json(
      { state: false, message: "Accès refusé." },
      { status: 401 }
    );
  }

  const jobId = (await params).id;

  // 2. Validation Zod
  const body = await request.json();
  const validation = jobActiveSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const { active } = validation.data;

  try {
    // 3. Logique Prisma : Mise à jour du champ visibility
    const updatedJob = await prisma.jobOffer.update({
      where: { id: jobId },
      data: {
        active: active, // Nouvelle valeur de visibilité
      },
      select: {
        id: true,
        title: true,
        active: true,
      },
    });

    // 4. Réponse
    return NextResponse.json(
      {
        state: true,
        data: updatedJob,
        message: `Visibilité de l'offre '${updatedJob.title}' mise à jour à ${active}.`,
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
