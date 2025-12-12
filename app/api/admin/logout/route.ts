import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Suppression du token en le rendant expiré
  response.cookies.set("connect-student-token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/panel-admin",
  });

  return response;
}
