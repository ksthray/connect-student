// app/api/candidate/register/route.ts

import { NextResponse } from "next/server";
import { candidateRegisterSchema } from "@/schemas/candidate/register";
import { prisma } from "@/lib/prisma";

// const sendVerificationEmail = (email: string, token: string) => {
//   const verificationUrl = `${process.env.NEXT_PUBLIC_API}/verify?token=${token}`;
//   console.log(
//     `[EMAIL SIMULÉ] Lien de vérification pour ${email}: ${verificationUrl}`
//   );
//   // Ici, vous intégreriez votre service d'envoi d'emails (SendGrid, Postmark, etc.)
// };

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
      return NextResponse.json(
        { state: false, error: "Un compte avec cet email existe déjà." },
        { status: 409 } // 409 Conflict
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
    });

    return NextResponse.json({ state: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur interne du serveur lors de la création de l'etudiant." },
      { status: 500 }
    );
  }
}
