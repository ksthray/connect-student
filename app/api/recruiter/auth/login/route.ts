// app/api/recruiter/auth/login/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/utils/auth"; // Import de comparePassword et generateToken
import { loginRecruiterSchema } from "@/schemas/recruiter/aurh";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  const body = await request.json();
  const validation = loginRecruiterSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { state: false, error: "Données de connexion invalides." },
      { status: 400 }
    );
  }

  const { email, password } = validation.data;

  try {
    // 1. Trouver l'utilisateur, obtenir le hash du mot de passe et le rôle
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullname: true,
        password: true, // Le hash est requis pour la comparaison
        phone: true,
        role: true,
      },
    });

    // 2. Vérifier si l'utilisateur existe et s'il a le rôle COMPANY
    if (!user || user.role !== "COMPANY") {
      // Réponse générique pour des raisons de sécurité (ne pas révéler si l'email ou le rôle est incorrect)
      return NextResponse.json(
        {
          state: false,
          error: "Identifiants invalides ou accès non autorisé.",
        },
        { status: 401 }
      );
    }

    // 3. Comparer le mot de passe fourni avec le hash stocké
    const passwordValid = await comparePassword(
      password,
      user.password as string
    );
    if (!passwordValid) {
      return NextResponse.json(
        { state: false, error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    // 4. Générer le Token JWT
    const token = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      message: "Connexion réussie",
      token,
      data: user,
      state: true,
    });

    response.cookies.set("connect-student-token", token, {
      httpOnly: true, // Sécurise le token
      secure: process.env.NODE_ENV === "production", // En HTTPS en prod
      maxAge: 604800, // Expire après 1h
      path: "/recruiter", // Accessible que dans le panel
    });

    return response;
  } catch (error) {
    console.error("Login COMPANY Error:", error);
    return NextResponse.json(
      { state: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
