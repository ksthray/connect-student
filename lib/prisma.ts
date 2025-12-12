// /lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// 1. Initialiser une variable globale pour éviter de recréer l'instance à chaud (hot reload)
// Cette technique est nécessaire dans Next.js (environnement Serverless)
// pour garantir qu'il n'y a qu'une seule instance de PrismaClient.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Utiliser l'instance globale si elle existe (en développement)
// ou créer une nouvelle instance.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Optionnel : afficher les logs des requêtes SQL en développement
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// 3. En mode développement, attacher l'instance à la variable globale
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
