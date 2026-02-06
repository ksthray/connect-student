/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/jobs/[id]/route.ts (Méthode PUT)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobUpdateSchema } from "@/schemas/job";
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
  const validation = jobUpdateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;
  const updateData: any = { ...data };

  try {
    // Si la deadline est fournie, la convertir en Date
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    // 3. VÉRIFICATION D'AUTORISATION (L'offre existe et appartient à l'utilisateur)
    const job = await prisma.jobOffer.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json(
        { state: false, error: "Offre d'emploi non trouvée." },
        { status: 404 }
      );
    }

    // 4. Logique Prisma : Mise à jour
    const updatedJob = await prisma.jobOffer.update({
      where: { id: jobId },
      data: updateData,
    });

    // 5. Réponse
    return NextResponse.json(
      { state: true, data: updatedJob },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { state: false, error: "Offre non trouvée." },
        { status: 404 }
      );
    }
    console.error("Erreur mise à jour offre:", error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { isAuthenticated, user } = await userAuthMiddleware(request);

  if (!isAuthenticated || user?.role !== "COMPANY") {
    return NextResponse.json(
      { state: false, message: "Accès refusé." },
      { status: 401 }
    );
  }

  const jobId = (await params).id;

  try {
    const applicationsCount = await prisma.application.count({
      where: { jobOfferId: jobId },
    });

    // Si des candidatures existent, bloquer la suppression
    if (applicationsCount > 0) {
      // Utilisez le statut 409 Conflict pour indiquer qu'une ressource liée empêche l'opération.
      return NextResponse.json(
        {
          state: false,
          error: `Cette offre ne peut pas être supprimée car elle a ${applicationsCount} candidature(s) associée(s). Veuillez la désactiver à la place.`,
        },
        { status: 409 } // 409 Conflict
      );
    }
    // 2. Logique Prisma : Suppression
    const deletedJob = await prisma.jobOffer.delete({
      where: { id: jobId },
    });

    // 3. Réponse
    return NextResponse.json(
      {
        state: true,
        data: {
          message: `L'offre '${deletedJob.title}' a été définitivement supprimée.`,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { state: false, error: "Offre non trouvée." },
        { status: 404 }
      );
    }
    console.error("Erreur suppression offre:", error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}
