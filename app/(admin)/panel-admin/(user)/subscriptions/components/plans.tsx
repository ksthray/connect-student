"use client";

import React, { useState } from "react";
import { Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanSubscriptionType } from "@/entities/types";

const Plans = ({ plans }: { plans: PlanSubscriptionType[] }) => {
  const getColorsPlans = ["bg-green-700", "bg-blue-500", "bg-purple-600"];
  const describePlan = [
    "Formule gratuite idéale pour découvrir la plateforme avec un accès limité.",
    "Formule abordable offrant des candidatures illimitées et des fonctionnalités avancées.",
    "Formule complète avec un accompagnement personnalisé et un accès illimité à toutes les opportunités.",
  ];
  return (
    <div>
      <div className="space-y-6">
        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border-2 border-border overflow-hidden hover:shadow-lg transition-shadow">
              {/* Plan Header */}
              <div className={`${getColorsPlans[index]} p-6 text-white`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm opacity-90">{describePlan[index]}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.priceUSD}</span>
                  {plan.priceUSD > 0 && (
                    <span className="text-sm opacity-75">/mois</span>
                  )}
                  {plan.priceUSD === 0 && (
                    <span className="text-sm opacity-75">Pour toujours</span>
                  )}
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-6">
                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    Avantages
                  </h4>
                  <ul className="space-y-2">
                    {plan.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">
                    Limites
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Candidatures:{" "}
                      {plan.applicationLimit === -1
                        ? "Illimité"
                        : plan.applicationLimit}
                    </p>
                    <p>
                      Notifications:{" "}
                      {plan.notifiedLimit === -1
                        ? "Illimité"
                        : plan.notifiedLimit}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={() => {}}
                  variant="outline"
                  className="w-full flex-1 border-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;
