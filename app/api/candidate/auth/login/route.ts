import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendOtpSchema } from "@/schemas/candidate/auth";
import { generateOTP } from "@/utils/auth";
import { sendOtpEmail } from "@/components/emails/send-emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = sendOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { state: false, error: validation.error.issues },
        { status: 400 },
      );
    }

    const { email } = validation.data;
    const otpCode = generateOTP();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email introuvable." },
        { status: 404 },
      );
    }

    const expiresAt = addMinutes(new Date(), 10); // expire dans 10 min

    await prisma.user.update({
      where: { email },
      data: {
        otpCode: otpCode,
        otpExpiresAt: expiresAt,
      },
    });

    console.log("otp:", otpCode);

    // await sendOtpEmail(email, user.fullname!, otpCode);

    return NextResponse.json({
      message: "Code OTP envoyé à votre email.",
      state: true,
    });
  } catch (error) {
    console.error("[OTP_AUTH]", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion ", state: false },
      { status: 500 },
    );
  }
}
