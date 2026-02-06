import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";
import { jobCreateSchema } from "@/schemas/job";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const { isAuthenticated, user } = userAuthMiddleware(req);

  if (!isAuthenticated || user?.role !== "COMPANY") {
    return NextResponse.json(
      { state: false, message: "Accès refusé." },
      { status: 401 }
    );
  }

  try {
    const recruiterProfile = await prisma.companyProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!recruiterProfile?.id) {
      return NextResponse.json(
        { state: false, message: "Entreprise non trouvée." },
        { status: 404 }
      );
    }

    const companyId = recruiterProfile.id;

    // Pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Récupération avec statistiques
    const [jobs, totalCount] = await Promise.all([
      prisma.jobOffer.findMany({
        where: { companyId: companyId },
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          type: true,
          location: true,
          visibility: true,
          active: true,
          deadline: true,
          createdAt: true,
          detail: true,
          description: true,
          requirements: true,
          coverImage: true,
          sectors: true,
          viewCount: true,
          // 2. Récupération du nombre de candidatures via agrégation
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.jobOffer.count({
        where: { companyId: companyId },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        state: true,
        data: jobs,
        pagination: {
          totalItems: totalCount,
          totalPages: totalPages,
          currentPage: page,
          limit: limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { state: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // 1. VÉRIFICATION RBAC : Autoriser ADMIN ou COMPANY
  const { isAuthenticated, user } = await userAuthMiddleware(request);

  if (!isAuthenticated || user?.role !== "COMPANY") {
    return NextResponse.json(
      { state: false, message: "Accès refusé." },
      { status: 401 }
    );
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
        type: data.type as
          | "INTERNSHIP"
          | "FULL_TIME"
          | "PART_TIME"
          | "EVENT"
          | "CONFERENCE"
          | "TRAINING",
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
