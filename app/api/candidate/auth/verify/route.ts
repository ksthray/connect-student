import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { verifyOtpSchema } from "@/schemas/candidate/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = verifyOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { state: false, error: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, otp } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      user.otpCode !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { message: "Code invalide ou expiré.", state: false },
        { status: 401 },
      );
    }

    //verified user
    let verifiedUser = user.emailVerified;

    // Authentifié, nettoyer OTP
    await prisma.user.update({
      where: { email },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    if (!verifiedUser) {
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
      },
      JWT_SECRET,
      { expiresIn: "30d" },
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
      path: "/user", // Accessible que dans le panel
    });

    return response;
  } catch (error) {
    console.error("[OTP_AUTH]", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion ", state: false },
      { status: 500 },
    );
  }
}
