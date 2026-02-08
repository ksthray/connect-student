// app/api/candidate/register/route.ts

import { NextResponse } from "next/server";
import { candidateRegisterSchema } from "@/schemas/candidate/register";
import { prisma } from "@/lib/prisma";
import { sendAccountCreatedEmail } from "@/components/emails/send-emails";

export async function POST(request: Request) {
  const body = await request.json();
  const validation = candidateRegisterSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { fullname, email, sectors, level, cvUrl } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Idempotent: si l'utilisateur existe déjà, on renvoie une réponse positive
      // pour ne pas bloquer le flux (ex: "Connexion réussie" implicite ou "Compte déjà existant")
      return NextResponse.json(
        { state: true, message: "Compte existant, connexion en cours..." },
        { status: 200 },
      );
    }

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        role: "CANDIDATE",
        candidateProfile: {
          create: {
            sectors: {
              connect: sectors?.map((id) => ({ id })) || [],
            },
            level: level,
            cvUrl,
          },
        },
      },
      select: {
        fullname: true,
        email: true,
        role: true,
      },
      // Pas d'OTP, le compte est créé directement (emailVerified: false par défaut, à voir selon règles métier)
    });

    // Envoi de l'email de confirmation de création de compte (SANS OTP)
    await sendAccountCreatedEmail(email, fullname || "");

    return NextResponse.json({ state: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur interne du serveur lors de la création de l'etudiant." },
      { status: 500 },
    );
  }
}
