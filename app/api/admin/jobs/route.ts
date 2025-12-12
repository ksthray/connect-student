/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobCreateSchema } from "@/schemas/job";
import { authenticate } from "@/lib/authMiddleware";
import slugify from "slugify";

export async function POST(request: Request) {
  // 1. VÉRIFICATION RBAC : Autoriser ADMIN ou COMPANY
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  const body = await request.json();
  const validation = jobCreateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  if (!data.companyId) {
    return NextResponse.json(
      { state: false, error: "L'ID de l'entreprise est requis." },
      { status: 400 }
    );
  }

  const companyExists = await prisma.companyProfile.findUnique({
    where: { id: data.companyId },
  });
  if (!companyExists) {
    return NextResponse.json(
      { state: false, error: "L'ID de l'entreprise spécifié n'existe pas." },
      { status: 404 }
    );
  }

  const slugJob = slugify(data.title, {
    lower: true,
    strict: true,
  });

  // 4. Logique Prisma : Création de l'offre
  try {
    const newJobOffer = await prisma.jobOffer.create({
      data: {
        title: data.title,
        slug: slugJob,
        detail: data.detail,
        description: data.description,
        coverImage: data.coverImage,
        location: data.location,
        requirements: data.requirements,
        type: data.type,
        sectors: data.sectors
          ? {
              connect: data.sectors.map((sectorId: string) => ({
                id: sectorId,
              })),
            }
          : undefined,
        deadline: new Date(data.deadline), // Conversion de la chaîne ISO en Date
        companyId: data.companyId,
        // viewCount est à 0 par défaut grâce à Prisma
        active: true, // L'offre est active par défaut
        visibility: true,
      },
      select: {
        id: true,
        title: true,
        location: true,

        type: true,
      },
    });

    // 5. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        data: newJobOffer,
        message: "Offre d'emploi créée avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur serveur lors de la création de l'offre:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur interne du serveur lors de la création de l'offre.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. Logique Prisma : Récupération de toutes les catégories
    const jobs = await prisma.jobOffer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        companyId: true,
        description: true,
        deadline: true,
        location: true,
        active: true,
        visibility: true,
        viewCount: true,
        type: true,
        createdAt: true,

        // L'agrégation est bien demandée au niveau racine de 'select'
        _count: {
          select: {
            // Ces noms sont corrects si vous avez bien mis à jour le schema M:N
            applications: true,
          },
        },

        company: {
          select: {
            companyName: true,
          },
        },
      },
    });

    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      slug: job.slug,
      description: job.description,
      companyId: job.companyId,
      deadline: job.deadline,
      companyName: job.company.companyName,
      location: job.location,
      active: job.active,
      visibility: job.visibility,
      viewCount: job.viewCount,
      type: job.type,
      createdAt: job.createdAt,
      totalApplications: job._count.applications,
    }));

    // 3. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        data: formattedJobs,
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
