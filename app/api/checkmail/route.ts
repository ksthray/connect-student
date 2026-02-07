import {
  // sendAccountCreatedEmail,
  sendOtpEmail,
} from "@/components/emails/send-emails";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await sendOtpEmail("ksthray@gmail.com", "Camille Test", "0234");
    // await sendAccountCreatedEmail("ksthray@gmail.com", "Camille Test", "1234");

    return NextResponse.json({ state: true, data: "test" }, { status: 201 });
  } catch (error) {
    console.error("Erreur CHECK MAIL :", error);
    return NextResponse.json(
      { message: "Erreur du testage du mail" },
      { status: 500 },
    );
  }
}
