// src/lib/auth.ts
import { UserAdmin } from "@/entities/types"; // Importez le type UserAdmin qui englobe CandidateType
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server"; // Utiliser NextRequest pour les Routes API

const JWT_SECRET = process.env.JWT_SECRET as string;

// Type des données que l'on retourne
interface AuthData {
  id: string;
  role: "ADMIN" | "CANDIDATE" | "COMPANY";
  // Vous pouvez ajouter d'autres champs utiles ici (ex: email, subscription)
}

interface AuthResult {
  isAuthenticated: boolean;
  user: AuthData | null;
}

/**
 * Extrait et vérifie le token JWT de la requête pour obtenir les données utilisateur.
 */
export function userAuthMiddleware(request: NextRequest): AuthResult {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isAuthenticated: false, user: null };
  }

  const token = authHeader.split(" ")[1];

  try {
    // Le type decoded devrait correspondre au contenu de votre token (UserAdmin/CandidateType)
    const decoded = jwt.verify(token, JWT_SECRET) as UserAdmin & JwtPayload;

    // Vérification minimale des champs essentiels
    if (decoded.id && decoded.role) {
      return {
        isAuthenticated: true,
        user: {
          id: decoded.id,
          role: decoded.role,
          // Si vous stockez des infos d'abonnement dans le token, ajoutez-les ici
        },
      };
    }
    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error("Erreur de vérification du token JWT:", error);
    // Token expiré ou invalide
    return { isAuthenticated: false, user: null };
  }
}
