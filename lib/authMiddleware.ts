import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function authenticate(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return {
      isValid: false,
      response: NextResponse.json(
        { state: false, message: "Token manquant" },
        { status: 403 }
      ),
    };
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return {
      isValid: true,
      payload: decoded,
    };
  } catch (error) {
    console.error(error);
    return {
      isValid: false,
      response: NextResponse.json(
        {
          state: false,
          message: "Token invalide ou expiré - Veuillez vous reconnecter",
        },
        { status: 401 }
      ),
    };
  }
}
