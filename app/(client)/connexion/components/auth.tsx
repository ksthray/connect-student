/* eslint-disable react-hooks/set-state-in-effect */
// src/app/connexion/AuthPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Ajout de useCallback
import { useRouter, useSearchParams } from "next/navigation";

// Composants Enfants (Vérifiez les chemins d'importation)
import { Login } from "./login"; // Chemin corrigé (supposé)
import { Register } from "./register"; // Chemin corrigé (supposé)
import { VerifyOTP } from "./verify-otp"; // Chemin corrigé (supposé)

// Composants Shadcn/UI/Custom
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
// Les autres imports Shadcn/UI (Form, Input, Button) ne sont pas nécessaires ici mais sont OK.

// Types pour l'état des onglets et étapes
type AuthTab = "login" | "account";
type AuthStep = "form" | "otp";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  // --- 1. Gestion des États et URL ---

  // CORRECTION 1: Initialisation correcte de l'onglet:
  // Si URL est /connexion?tab=account, alors c'est 'register'. Sinon, c'est 'login'.
  const initialTab =
    searchParams.get("tab") === "account" ? "account" : "login";

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [step, setStep] = useState<AuthStep>("form");
  const [currentEmail, setCurrentEmail] = useState("");
  // La variable `loading` est gérée dans VerifyOTP/Login/Register, on peut la retirer ici si elle ne sert qu'à l'OTP
  // const [loading, setLoading] = useState(false);

  // Synchroniser l'état local si l'URL change
  useEffect(() => {
    const tabParam = searchParams.get("tab");

    // CORRECTION 2: Comparaison de la valeur du paramètre de recherche
    if (tabParam === "account" && activeTab !== "account") {
      setActiveTab("account");
    } else if (!tabParam && activeTab !== "login") {
      // Si le paramètre est absent (juste /connexion)
      setActiveTab("login");
    }
    setStep("form");
  }, [activeTab, searchParams]);

  // CORRECTION 3: Définition de la fonction de succès pour les composants enfants
  const handleAuthSuccess = useCallback((email: string) => {
    setCurrentEmail(email);
    setStep("otp");
  }, []); // Dépendances vides pour la stabilité

  const getTitle = () => {
    if (step === "otp") return "Vérification Requise";
    if (activeTab === "login") return "Bienvenue 👋";
    return "Créer votre compte";
  };

  const getDescription = () => {
    if (step === "otp") return `Un code a été envoyé à ${currentEmail}`;
    if (activeTab === "login")
      return "Connecte-toi avec ton adresse e-mail pour recevoir ton code OTP";
    return "Rejoins la communauté en quelques secondes.";
  };

  return (
    <div className="w-full container mx-auto h-screen px-4 flex justify-center items-center">
      <div
        // style={{ backgroundImage: "url(/images/login.jpg)" }}
        className="w-full md:bg-[url(/images/login.jpg)] bg-center bg-cover h-full md:h-[80%] rounded-2xl ">
        <div className="w-full h-full flex justify-center items-center rounded-2xl md:bg-black/30">
          <Card className=" shadow-2xl w-full max-w-sm">
            <CardContent className="p-8">
              {/* Tab Switcher - Visible seulement à l'étape du formulaire */}
              {step === "form" && (
                <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      router.replace("/connexion");
                    }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "login"
                        ? "bg-white shadow text-gray-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    Se connecter
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("account");
                      router.replace("/connexion?tab=account");
                    }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "account"
                        ? "bg-white shadow text-gray-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    Créer un compte
                  </button>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {getTitle()}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{getDescription()}</p>
              </div>

              {/* --- ÉTAPE OTP --- */}
              {step === "otp" ? (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}>
                  {/* CORRECTION 4: S'assurer que le nom du composant est correct et les props correspondent */}
                  <VerifyOTP
                    email={currentEmail}
                    setstep={setStep}
                    returnTo={returnTo}
                  />

                  <p
                    className="text-xs text-gray-500 text-center mt-4 cursor-pointer hover:underline"
                    onClick={() => {
                      setStep("form");
                    }}>
                    Retour au formulaire
                  </p>
                </motion.div>
              ) : (
                // --- ÉTAPE FORMULAIRE (LOGIN/REGISTER) ---
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}>
                  {activeTab === "login" ? (
                    <Login onSuccess={handleAuthSuccess} />
                  ) : (
                    <Register onSuccess={handleAuthSuccess} />
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
