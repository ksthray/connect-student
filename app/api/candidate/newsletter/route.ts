import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "L'adresse e-mail est requis.", state: false },
        { status: 400 }
      );
    }

    const isExisting = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (isExisting) {
      return NextResponse.json(
        { message: "Cette adresse e-mail est déjà inscrite.", state: false },
        { status: 400 }
      );
    }

    const subscription = await prisma.newsletter.create({
      data: {
        email,
      },
    });

    // await sendNewsletterConfirmationEmail({ to: email, email });

    return NextResponse.json(
      {
        message: "Vous venez de souscrire à notre newsletter.",
        data: subscription,
        state: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NEWSLETTER_CREATE]", error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout au newsletter'.", state: false },
      { status: 500 }
    );
  }
}
