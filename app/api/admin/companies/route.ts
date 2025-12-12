// app/api/admin/companies/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { companyCreateSchema } from "@/schemas/admin/company";
import { UserRole } from "@prisma/client";
import { authenticate } from "@/lib/authMiddleware";
import { hashPassword } from "@/utils/auth";

export async function POST(request: Request) {
  // 1. VÉRIFICATION RBAC : Seul l'ADMIN est autorisé
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  // 2. Validation Zod
  const body = await request.json();
  const validation = companyCreateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  try {
    // 3. VÉRIFICATION MANUELLE DE CONFLIT (Email ou Nom d'entreprise)
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { state: false, error: "Un utilisateur avec cet email existe déjà." },
        { status: 409 }
      );
    }

    // Vérifier si le nom d'entreprise existe déjà (dans CompanyProfile)
    const existingCompanyProfile = await prisma.companyProfile.findFirst({
      where: { companyName: data.companyName },
    });
    if (existingCompanyProfile) {
      return NextResponse.json(
        { state: false, error: "Ce nom d'entreprise est déjà enregistré." },
        { status: 409 }
      );
    }

    // 4. Logique Prisma : Création de l'utilisateur et du profil en une seule transaction
    const hashedPassword = await hashPassword(data.password);

    // Utiliser une transaction pour garantir que User ET CompanyProfile sont créés ensemble
    const newCompanyTransaction = await prisma.$transaction(async (tx) => {
      // A. Création du User (rôle COMPANY)
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          phone: data.phone || null,
          fullname: data.fullname,
          role: UserRole.COMPANY,
          emailVerified: true, // Créé par Admin, donc vérifié
        },
      });

      // B. Création du CompanyProfile associé
      const newCompanyProfile = await tx.companyProfile.create({
        data: {
          userId: newUser.id,
          companyName: data.companyName,
          description: data.description,
          website: data.website || null,
          location: data.location,
          logo: data.logo || null,
          industry: data.industry || null,
        },
      });

      return { user: newUser, profile: newCompanyProfile };
    });

    // 5. Réponse au format demandé
    return NextResponse.json(
      {
        state: true,
        message: "Compte entreprise créé avec succès.",
        data: {
          id: newCompanyTransaction.user.id,
          companyName: newCompanyTransaction.profile.companyName,
          email: newCompanyTransaction.user.email,
          // Nous n'envoyons pas le password hash
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur serveur lors de la création de l'entreprise:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur interne lors de la création du compte.",
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
    // Récupérer tous les CompanyProfile avec les données User associées
    const companies = await prisma.companyProfile.findMany({
      orderBy: { companyName: "asc" },
      select: {
        id: true,
        companyName: true,
        location: true,
        description: true,
        website: true,
        logo: true,
        industry: true,
        user: {
          select: {
            id: true,
            email: true,
            fullname: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    // Le mapping est souvent nécessaire pour aplatir les données pour le frontend
    const formattedCompanies = companies.map((company) => ({
      id: company.id,
      fullname: company.user.fullname,
      companyName: company.companyName,
      email: company.user.email,
      location: company.location,
      website: company.website,
      logo: company.logo,
      industry: company.industry,
      description: company.description,
      phone: company.user.phone,
      createdAt: company.user.createdAt,
    }));

    // Retourne la liste des entreprises au format demandé
    return NextResponse.json(
      {
        state: true,
        data: formattedCompanies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur lors du listing des entreprises:", error);
    return NextResponse.json(
      {
        state: false,
        error: "Erreur serveur interne lors du listing des entreprises.",
      },
      { status: 500 }
    );
  }
}
