// src/utils/auth.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client"; // Importation de l'Enum UserRole générée par Prisma

// Configuration du secret JWT (à définir dans votre .env)
const JWT_SECRET =
  process.env.JWT_SECRET || "DEV_SECRET_NE_PAS_UTILISER_EN_PROD";

// --- Fonctions de Sécurité ---

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- Fonctions OTP ---

export function generateOTP(): string {
  // Génère un code numérique aléatoire à 6 chiffres
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
  email: string,
  otp: string
): Promise<void> {
  // TODO: Remplacer ceci par votre implémentation Resend/SendGrid/etc.
  console.log(`[EMAIL SIMULÉ] Envoi de l'OTP ${otp} à ${email}`);
  // L'intégration de ton service d'email se fera ici.
}

// --- Fonction de Token (JWT) ---

export function generateToken(userId: string, role: UserRole): string {
  // Stocke l'ID de l'utilisateur et son rôle dans le jeton pour l'autorisation future
  return jwt.sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: "30d" });
}
