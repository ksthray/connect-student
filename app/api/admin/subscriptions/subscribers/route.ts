/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(request: Request) {
  // 1. Authentification Admin
  const { isValid, response } = await authenticate(request);
  if (!isValid) return response;

  try {
    // 2. Récupérer tous les abonnements actifs (ou tous, selon besoin)
    // On inclut les infos du User et du Plan (Tier)
    const subscriptions = await prisma.userSubscription.findMany({
      orderBy: { startDate: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            image: true,
          },
        },
        tier: {
          select: {
            name: true,
            priceUSD: true,
          },
        },
      },
    });

    // 3. Calculer le "Total Spent" pour ces utilisateurs
    // On récupère la liste des IDs utilisateurs concernés
    const userIds = subscriptions.map((sub: any) => sub.userId);

    // On fait une agrégation sur la table Transaction pour ces utilisateurs
    const transactionsSum = await prisma.transaction.groupBy({
      by: ["userId"],
      _sum: {
        amount: true,
      },
      where: {
        userId: { in: userIds },
        // Optionnel : Ajouter un filtre sur le statut si vous gérez 'FAILED' ou 'SUCCESS'
        // status: 'SUCCESS'
      },
    });

    // On transforme le tableau d'agrégation en Map pour un accès rapide (O(1))
    // Map<UserId, TotalAmount>
    const spendingMap = new Map<string, number>();
    transactionsSum.forEach((t: any) => {
      spendingMap.set(t.userId, t._sum.amount || 0);
    });

    // 4. Formater les données pour le frontend
    const formattedSubscribers = subscriptions.map((sub: any) => {
      const totalSpent = spendingMap.get(sub.userId) || 0;

      return {
        id: sub.id, // ID de l'abonnement
        user: {
          id: sub.user.id,
          name: sub.user.fullname || "Inconnu",
          email: sub.user.email,
          image: sub.user.image,
        },
        plan: sub.tier.name, // FREE, STANDARD, PREMIUM
        status: sub.status, // ACTIVE, EXPIRED, etc.
        startDate: sub.startDate,
        renewalDate: sub.endDate, // C'est la date de fin qui sert de date de renouvellement
        totalSpent: totalSpent, // Le montant total dépensé par cet utilisateur à vie
        currency: "USD", // Devise par défaut des transactions
      };
    });

    return NextResponse.json(
      { state: true, data: formattedSubscribers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur listing abonnés:", error);
    return NextResponse.json(
      { state: false, error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}
