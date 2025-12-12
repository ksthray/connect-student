import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";
import { adminRegisterSchema } from "@/schemas/admin/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { isValid, response } = await authenticate(request);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }

  const body = await request.json();

  const validation = adminRegisterSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { fullname, email, password, phone } = validation.data;

  const { id } = params;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the admin user
    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: {
        fullname,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        data: updatedAdmin,
        state: true,
        message: "Opération effectuée avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_UPDATE]", error);
    return NextResponse.json(
      { message: "Erreur serveur.", state: false },
      { status: 500 }
    );
  }
}
