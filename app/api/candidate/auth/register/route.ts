// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/schemas/candidate/auth";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/utils/auth";
import { addMinutes } from "date-fns";
import {
  sendAccountCreatedEmail,
  sendOtpEmail,
} from "@/components/emails/send-emails";

export async function POST(req: NextRequest) {
  try {
    console.log("GO");
    // 1. Validation des données du corps de la requête
    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      // Retourne une erreur 400 avec les détails de validation
      return NextResponse.json(
        {
          state: false,
          message: "Données de formulaire invalides.",
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { fullname, email, phone } = validatedData.data;

    // 2. Vérification de l'existence de l'utilisateur (Email)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Retourne une erreur 409 (Conflict) si l'email est déjà utilisé
      return NextResponse.json(
        {
          state: false,
          message: "Un compte avec cette adresse e-mail existe déjà.",
        },
        { status: 409 },
      );
    }

    // 3. (Optionnel) Vérification de l'existence de l'utilisateur (Téléphone)
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      // Retourne une erreur 409 (Conflict) si le téléphone est déjà utilisé
      return NextResponse.json(
        {
          state: false,
          message: "Un compte avec ce numéro de téléphone existe déjà.",
        },
        { status: 409 },
      );
    }

    const otpCode = generateOTP();
    const expiresAt = addMinutes(new Date(), 10); // expire dans 10 min

    console.log("otp:", otpCode);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        fullname: fullname,
        phone: phone,
        // Le rôle par défaut est CANDIDATE selon votre schéma
        role: "CANDIDATE",
        otpCode: otpCode,
        otpExpiresAt: expiresAt,
      },
    });

    // 5. Création du profil candidat associé (essentiel pour la candidature)
    await prisma.candidateProfile.create({
      data: {
        userId: newUser.id,
      },
    });

    await sendAccountCreatedEmail(email, newUser.fullname!, otpCode);
    // Si vous souhaitez que cette route retourne directement l'email pour le step OTP :
    return NextResponse.json(
      {
        state: true,
        message: "Inscription réussie. Veuillez vérifier votre adresse e-mail.",
        email: newUser.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      {
        state: false,
        message: "Une erreur interne du serveur s'est produite.",
      },
      { status: 500 },
    );
  }
}
