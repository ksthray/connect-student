"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const Login = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleVerify = () => {
    if (!otp) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  return (
    <div className="w-full container mx-auto h-screen flex justify-center items-center">
      <div
        style={{ backgroundImage: "url(/images/login.jpg)" }}
        className="w-full bg-center bg-cover flex justify-center items-center h-[80%] rounded-2xl">
        <Card className=" shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {step === "email" ? "Bienvenue 👋" : "Vérification"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {step === "email"
                  ? "Connecte-toi avec ton adresse e-mail pour recevoir ton code OTP"
                  : `Un code a été envoyé à ${email}`}
              </p>
            </div>

            {step === "email" ? (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <div className="mb-4">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleSendCode}
                  disabled={loading || !email}
                  className="w-full bg-linear-to-r from-blue-500 to-indigo-500 text-white">
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Envoyer le code"
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <div className="mb-4">
                  <Label htmlFor="otp">Code OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Entrez le code à 6 chiffres"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="mt-1 text-center tracking-[0.3em]"
                  />
                </div>
                <Button
                  onClick={handleVerify}
                  disabled={loading || otp.length < 6}
                  className="w-full bg-linear-to-r from-green-500 to-emerald-500 text-white">
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>

                <p
                  className="text-xs text-gray-500 text-center mt-4 cursor-pointer hover:underline"
                  onClick={() => setStep("email")}>
                  Modifier l&apos;adresse e-mail
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
