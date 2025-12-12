import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { authenticate } from "@/lib/authMiddleware";
import { calculateProfileCompletion } from "@/utils/profileScore";

export async function GET(request: Request) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  try {
    // 2. LOGIQUE PRISMA : Récupérer tous les utilisateurs ayant le rôle CANDIDATE
    const candidates = await prisma.user.findMany({
      where: {
        role: UserRole.CANDIDATE,
      },
      orderBy: {
        createdAt: "desc", // Trie les plus récents en premier
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        phone: true,
        createdAt: true, // Join Date
        emailVerified: true,

        candidateProfile: {
          select: {
            id: true,
            level: true,
            university: true,
            cvUrl: true,
            about: true,
            sectors: true,
            skills: true,
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
    });

    // 3. NORMALISATION ET FORMATAGE DES DONNÉES
    const formattedCandidates = candidates.map((candidate) => ({
      id: candidate.id,
      user: candidate.fullname,
      email: candidate.email,
      joinDate: candidate.createdAt,

      // Type (Student/Graduate)
      type: candidate.candidateProfile?.level || "N/A",

      // Status (Verified/Unverified)
      status: candidate.emailVerified ? "Verifié" : "Non verifier",

      // Nombre de candidatures (Applications)
      applicationsCount: candidate.candidateProfile?._count.applications,
      score: calculateProfileCompletion({
        user: {
          fullname: candidate.fullname,
          email: candidate.email,
          phone: candidate.phone,
        },
        candidateProfile: {
          level: candidate.candidateProfile?.level as string,
          university: candidate.candidateProfile?.university as string,
          cvUrl: candidate.candidateProfile?.cvUrl as string,
          about: candidate.candidateProfile?.about as string,
          sectors: candidate.candidateProfile?.sectors || [],
          skills: candidate.candidateProfile?.skills || [],
        },
      }),
    }));

    // 4. RÉPONSE
    return NextResponse.json(
      {
        state: true,
        data: formattedCandidates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur lors du listing des candidats:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur interne lors du listing des candidats.",
      },
      { status: 500 }
    );
  }
}
