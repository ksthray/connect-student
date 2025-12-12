// app/api/auth/admin/register/route.ts

import { NextResponse } from "next/server";
import { adminRegisterSchema } from "@/schemas/admin/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/auth";
import { authenticate } from "@/lib/authMiddleware";

export async function POST(request: Request) {
  const body = await request.json();
  const validation = adminRegisterSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { fullname, email, password, phone } = validation.data;

  try {
    const hashedPassword = await hashPassword(password);

    const newAdmin = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phone,
        role: "ADMIN", // <-- ESSENTIEL : Définir le rôle Administrateur
        emailVerified: true,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ state: true, data: newAdmin }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erreur interne du serveur lors de la création de l'admin." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN"],
        },
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ state: true, data: admins });
  } catch (error) {
    console.error("[ADMIN_GET_ALL]", error);
    return NextResponse.json(
      { message: "Erreur serveur.", state: false },
      { status: 500 }
    );
  }
}
