import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  type: z.string(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, type, subject, message } = messageSchema.parse(body);

    const newMessage = await prisma.message.create({
      data: {
        fullname: name,
        email,
        type,
        subject,
        message,
        // phone is optional in the schema now, so we can omit it
      },
    });

    return NextResponse.json(
      { data: newMessage, state: true, message: "Message envoyé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { data: null, state: false, message: "Failed to send message" },
      { status: 500 },
    );
  }
}
