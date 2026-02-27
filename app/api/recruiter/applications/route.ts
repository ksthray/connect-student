import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userAuthMiddleware } from "@/lib/userAuthMiddleware";

/**
 * Route GET pour récupérer toutes les candidatures liées à une entreprise.
 * URL: /api/recruiter/applications/all?page=1&limit=10
 */
export async function GET(req: NextRequest) {
  // 1. AUTHENTIFICATION
  const { isAuthenticated, user } = userAuthMiddleware(req);

  if (!isAuthenticated || user?.role !== "COMPANY") {
    return NextResponse.json(
      { state: false, message: "Accès refusé." },
      { status: 401 },
    );
  }

  try {
    // 2. RÉCUPÉRATION DE L'ID DE L'ENTREPRISE
    const recruiterProfile = await prisma.companyProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!recruiterProfile?.id) {
      return NextResponse.json(
        { state: false, message: "Profil entreprise introuvable." },
        { status: 404 },
      );
    }

    const companyId = recruiterProfile.id;

    // 3. PARAMÈTRES DE PAGINATION
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // 4. RÉCUPÉRATION DES CANDIDATURES
    const [applications, totalCount] = await Promise.all([
      prisma.application.findMany({
        where: {
          jobOffer: {
            companyId: companyId, // Filtrer par les offres de cette entreprise
          },
        },
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Les plus récentes d'abord
        select: {
          id: true,
          status: true,
          createdAt: true, // Date de la candidature
          cvUrl: true,
          coverLetter: true,
          // Informations sur l'offre (Titre et Type)
          jobOffer: {
            select: {
              title: true,
              type: true,
            },
          },
          // Informations sur le candidat
          candidate: {
            select: {
              id: true,
              user: {
                select: {
                  fullname: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      prisma.application.count({
        where: {
          jobOffer: { companyId: companyId },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // 5. RÉPONSE
    return NextResponse.json(
      {
        state: true,
        message: "Candidatures récupérées avec succès.",
        data: applications,
        pagination: {
          totalItems: totalCount,
          totalPages: totalPages,
          currentPage: page,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return NextResponse.json(
      { state: false, message: "Erreur interne du serveur." },
      { status: 500 },
    );
  }
}
