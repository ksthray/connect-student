import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { isValid, response } = await authenticate(req);

  if (!isValid) {
    return response; // Stop ici si token invalide
  }
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: messages, state: true });
  } catch (error) {
    console.error("[MESSAGE_GET_ALL]", error);
    return NextResponse.json(
      { message: "Erreur serveur.", state: false },
      { status: 500 }
    );
  }
}
