import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthUser {
  id: string;
}

export function candidateAuthMiddleware(request: Request): AuthUser | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Assurez-vous que les champs 'id' et 'role' existent et correspondent à vos types
    if (decoded.id && decoded.role) {
      return {
        id: decoded.id as string,
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur de vérification du token JWT:", error);
    // Token expiré ou invalide
    return null;
  }
}
