/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Search,
  Plus,
  Loader2,
} from "lucide-react"; // Ajout d'icônes pour la démo

import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/services/query";
import { toast } from "sonner";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import {
  JobOfferType,
  PlanSubscriptionType,
  SectorType,
} from "@/entities/types";
import Link from "next/link";

// --- Types adaptés à votre code BDD ---

// Adaptez ces types pour correspondre à vos modèles Prisma/API
type UserLevelType = "STUDENT" | "GRADUATE" | "PROFESSIONAL";

type Step = 1 | 2 | 3;

type FormValues = {
  role: UserLevelType | ""; // "" pour initialisation
  domain: string[]; // id sector(s);
  fullName: string;
  email: string;
  cv?: FileList;
};

type DataPost = {
  fullname: string;
  email: string;
  cvUrl?: string;
  level: UserLevelType;
  sectors: string[];
};

// --- Composant Onboarding ---

export default function OnboardingConvert({
  open,
  setopen,
}: {
  open: boolean;
  setopen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Récupération des données ---

  // 1. Get Sectors
  const { data: sectorsData, isLoading: isLoadingSectors } = useFetch({
    route: "/candidate/sectors",
    query: "sectors",
  });
  const sectors: SectorType[] = sectorsData?.data || [];

  // 2. Get Subscriptions Tiers (Plans)
  const { data: subsData, isLoading: isLoadingSubscriptions } = useFetch({
    route: "/candidate/subscriptions/tiers", // Utilisation de la route Admin que vous avez créée
    query: "subscription-tiers",
  });
  const subscriptions: PlanSubscriptionType[] = subsData?.data || [];
  const standardPlan = subscriptions.find((p) => p.name === "STANDARD");

  // 3. Get Jobs en fonction des secteurs sélectionnés
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      role: "",
      domain: [], // Correction: Initialisé à tableau vide
      fullName: "",
      email: "",
    },
  });

  const watchRole = watch("role");
  const watchDomain = watch("domain");
  const watchCv = watch("cv");

  // Création de la chaîne d'ID pour la requête Jobs
  const sectorIdsQuery = watchDomain.join(",");

  // --- NOUVEL ÉTAT POUR LE FETCH NATIF ---
  const [jobsMatched, setJobsMatched] = useState<JobOfferType[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Requête Jobs DÉPENDANTE de watchDomain
  useEffect(() => {
    // 1. Condition : Ne rien faire si aucun secteur n'est sélectionné
    if (watchDomain.length === 0) {
      setJobsMatched([]);
      setIsLoadingJobs(false);
      return;
    }

    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      // Supposons que votre backend est accessible via `/api`
      const url = `/api/candidate/jobs?sectorIds=${sectorIdsQuery}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Assurez-vous que la structure 'data.data.jobs' correspond à votre API
        if (data.state && data.data?.jobs) {
          setJobsMatched(data.data.jobs as JobOfferType[]);
        } else {
          setJobsMatched([]);
        }
      } catch (error) {
        console.error("Erreur lors du fetch des jobs:", error);
        toast.error("Impossible de charger les offres correspondantes.");
        setJobsMatched([]);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();

    // Le tableau de dépendances garantit que le fetch est déclenché
    // uniquement lorsque sectorIdsQuery change.
  }, [sectorIdsQuery, watchDomain.length]);
  // --- Logique du formulaire et du composant ---

  const progressValue = (step / 3) * 100;

  // Toggle Secteur sélectionné (Gestion du tableau d'IDs)
  const toggleSector = (id: string) => {
    const currentDomains = watchDomain;
    if (currentDomains.includes(id)) {
      setValue(
        "domain",
        currentDomains.filter((d) => d !== id)
      );
    } else {
      setValue("domain", [...currentDomains, id]);
    }
  };

  // Upload CV (Inclus dans le composant pour simplifier la démo, mais peut être extrait)
  const uploadToCvUrlCloudinary = async (
    pdfFile: File
  ): Promise<string | null> => {
    const toastId = toast.loading(`Chargement de "${pdfFile.name}"...`);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("upload_preset", "connect");

      // Pour les PDF, Cloudinary accepte souvent l'endpoint /image/upload,
      // mais /auto/upload est plus sûr pour détecter le format.
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drarsensj/auto/upload",
        formData
      );

      // Cloudinary renvoie les données directement dans response.data
      if (response.data && response.data.secure_url) {
        toast.success(`"${pdfFile.name}" téléchargé avec succès !`, {
          id: toastId,
        });

        // On retourne l'URL sécurisée fournie par Cloudinary
        return response.data.secure_url;
      } else {
        toast.error(`Erreur inattendue lors de l'envoi de "${pdfFile.name}"`, {
          id: toastId,
        });
        return null;
      }
    } catch (error) {
      console.error("Erreur d'upload:", error);
      toast.error(`Erreur d'upload pour "${pdfFile.name}"`, { id: toastId });
      return null;
    }
  };

  // Mutation pour la création de l'utilisateur/profil
  const createUserMutation = useMutation({
    mutationFn: (state: DataPost) => {
      // NOTE: L'API devrait gérer l'authentification et la création de session ici
      return api.post("/candidate/onboarding", state);
    },
    onSuccess: (res) => {
      // Si la création est réussie, passer à l'étape 3
      if (res.data.state) {
        toast.success(res.data.message || "Profil créé avec succès.", {
          duration: 6000,
        });
        setStep(3);
        // Invalider les requêtes si l'utilisateur est maintenant connecté
        queryClient.invalidateQueries({ queryKey: ["user-data"] });
      } else {
        toast.error(res.data.message || "Erreur de création de profil.");
      }
    },
    onError: (error: any) => {
      // Utilisez un type d'erreur plus précis si défini
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Erreur serveur interne.";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Gestion des étapes
  const closeAll = () => {
    setopen(false);
    setTimeout(() => {
      setStep(1);
      reset();
    }, 300);
  };

  const onNextFromStep1 = () => {
    if (!watchRole || watchDomain.length === 0) return;
    setStep(2);
  };

  const onSubmitStep2: SubmitHandler<FormValues> = async (formData) => {
    setIsSubmitting(true);
    let finalCvUrl: string | undefined = undefined;

    // 1. UPLOAD CV
    if (formData.cv && formData.cv.length > 0) {
      const url = await uploadToCvUrlCloudinary(formData.cv[0]);
      if (url) {
        finalCvUrl = url;
      } else {
        setIsSubmitting(false);
        // Si l'upload échoue, on arrête la soumission du profil
        return;
      }
    }

    // 2. MUTATION (Création du profil)
    const dataToPost: DataPost = {
      fullname: formData.fullName,
      email: formData.email,
      cvUrl: finalCvUrl,
      level: formData.role as UserLevelType, // Le rôle doit être un UserLevelType
      sectors: formData.domain,
    };

    createUserMutation.mutate(dataToPost);
  };

  const onSubscribe = () => {
    // Logique de redirection vers le paiement du plan Standard
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Ici, implémenter la redirection vers la page de paiement (ex: FlexPay, Stripe)
      toast.success("Redirection vers le paiement...");
      setopen(false);
    }, 900);
  };

  const onContinueFree = () => {
    // Logique de fin d'onboarding pour le FREE
    setopen(false);
    toast("Compte gratuit créé. Bonne recherche !", {
      description:
        "Vous pouvez toujours passer au plan Standard dans les paramètres.",
    });
    // Si l'utilisateur est créé, on le redirige ou recharge
    // window.location.reload();
  };

  // Animation variants
  const slideAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  };

  // Rendu : Afficher les 2 offres matcheés si disponibles
  const offersPreview = jobsMatched.slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={setopen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[550px] md:max-w-[40vw] p-0 flex flex-col h-full border-l shadow-2xl">
        {/* --- HEADER --- */}
        <div className="px-6 pt-6 pb-2 bg-background z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -ml-2"
                  onClick={() => setStep((s) => (s - 1) as Step)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold tracking-tight">
                {step === 1
                  ? "Personnalisation"
                  : step === 2
                    ? "Crée ton Profil"
                    : "Boost ta carrière"}
              </h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              Étape {step} sur 3
            </span>
          </div>
          <Progress
            value={progressValue}
            className="h-1.5 w-full bg-secondary"
          />
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <ScrollArea className="flex-1 px-6 pt-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ÉTAPE 1 : SELECTION */}
            {step === 1 && (
              <motion.div key="step1" {...slideAnimation} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Quel est ton statut actuel ?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    On adaptera les offres selon ta réponse.
                  </p>
                  <div className="w-full flex flex-wrap gap-4">
                    {["STUDENT", "GRADUATE", "PROFESSIONAL"].map((role) => {
                      const label =
                        role === "STUDENT"
                          ? "Étudiant"
                          : role === "GRADUATE"
                            ? "Diplômé"
                            : "Professionnel";
                      const Icon =
                        role === "STUDENT" ? GraduationCap : Briefcase;

                      return (
                        <div
                          key={role}
                          onClick={() =>
                            setValue("role", role as UserLevelType)
                          }
                          className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:border-primary/50 flex flex-col items-center justify-center text-center gap-2 ${watchRole === role
                            ? "border-premiere bg-white shadow-md text-premiere"
                            : "border-border bg-card"
                            }`}>
                          <Icon
                            className={`w-5 h-5 ${watchRole === role
                              ? "text-premiere"
                              : "text-primary"
                              } `}
                          />
                          <span className="font-semibold text-sm">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Ton domaine de prédilection ?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choisis au moins un secteur qui t&apos;intéresse.
                  </p>
                  <div className="w-full flex flex-wrap gap-3">
                    {isLoadingSectors ? (
                      <p>Chargement des secteurs...</p>
                    ) : sectors.length > 0 ? (
                      sectors.map((sector) => {
                        const isSelected = watchDomain.includes(sector.id);
                        return (
                          <div
                            key={sector.id}
                            onClick={() => toggleSector(sector.id)} // Utilisation de toggleSector
                            className={`w-max cursor-pointer border rounded-lg p-3 transition-all hover:shadow-sm flex items-center gap-2 ${isSelected
                              ? "border-premiere bg-white "
                              : "border-border bg-card"
                              }`}>
                            <span className="text-sm font-medium line-clamp-1">
                              {sector.name}
                            </span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-premiere shrink-0 ml-auto" />
                            ) : (
                              <Plus className="w-4 h-4 text-muted-foreground shrink-0 ml-auto" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="col-span-3 text-muted-foreground">
                        Aucun secteur disponible pour le moment.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 2 : PROFIL & TEASING */}
            {step === 2 && (
              <motion.div key="step2" {...slideAnimation} className="space-y-6">
                {offersPreview.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
                    <div className="bg-premiere rounded-full p-1 mt-0.5 shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-premiere">
                        {offersPreview.length} offre(s) matche(nt) !
                      </h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Complète ton profil pour débloquer l&apos;accès à ces
                        opportunités chez **
                        {offersPreview
                          .map((o) => o.companyName)
                          .join(", ")
                          .slice(0, 50)}
                        ...**
                      </p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(onSubmitStep2)}
                  className="space-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      {...register("fullName", {
                        required: "Le nom est requis.",
                      })}
                      placeholder="Ton nom et prénom"
                      className="bg-secondary/30"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      Email professionnel / étudiant
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "L'email est requis.",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Format d'email invalide.",
                        },
                      })}
                      placeholder="ton.email@universite.cd"
                      className="bg-secondary/30"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label>CV (Optionnel pour le moment)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-secondary/20 transition cursor-pointer relative">
                      <Input
                        type="file"
                        accept=".pdf"
                        {...register("cv")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-2 rounded-full mb-2">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {watchCv && watchCv.length > 0
                            ? watchCv[0].name
                            : "Glisse ton CV (PDF) ou clique ici"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PDF, jusqu&apos;à 5Mo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TEASING OFFERS */}
                  <div className="pt-4 opacity-75 grayscale-[0.3] pointer-events-none select-none">
                    <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Search className="w-3 h-3" /> Aperçu des résultats
                    </h5>
                    <div className="space-y-2">
                      {offersPreview.length > 0 ? (
                        offersPreview.map((o) => (
                          <div
                            key={o.id}
                            className="border p-3 rounded-lg flex justify-between items-center bg-card">
                            <div>
                              <div className="font-bold text-sm">{o.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {o.company.companyName} • {o.company.location}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-[10px]">
                              Match
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-sm text-muted-foreground p-4">
                          Aucune offre correspondant aux secteurs sélectionnés.
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ÉTAPE 3 : PRICING / UPSELL */}
            {step === 3 && (
              <motion.div
                key="step3"
                {...slideAnimation}
                className="space-y-6 pb-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Maximise tes chances</h2>
                  <p className="text-muted-foreground text-sm">
                    Les profils &quot;Standard&quot; décrochent un emploi 3x
                    plus vite grâce aux alertes illimitées.
                  </p>
                </div>

                {/* CARTE ABONNEMENT STANDARD (Dynamique) */}
                {isLoadingSubscriptions ? (
                  <p className="text-center">Chargement des plans...</p>
                ) : standardPlan ? (
                  <div className="relative border-2 border-premiere rounded-xl p-5 bg-blue-50/50 shadow-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-premiere text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Recommandé
                    </div>

                    <div className="flex justify-between items-end mb-4 border-b border-blue-200 pb-4">
                      <div>
                        <h3 className="font-bold text-lg text-premiere">
                          {standardPlan.name}
                        </h3>
                        <p className="text-xs text-premiere">
                          Pour les étudiants sérieux
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-premiere">
                          {standardPlan.priceUSD}$
                        </span>
                        <span className="text-xs text-premiere">/mois</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-2">
                      {standardPlan.benefits.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-premiere shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center text-red-500">
                    Plan Standard non configuré.
                  </div>
                )}

                {/* COMPARAISON GRATUIT */}
                <div className="border rounded-xl p-4 bg-gray-50/50 opacity-80">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-700">Gratuit</h3>
                    <span className="text-sm font-bold">0 $</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="w-3 h-3 text-gray-400" />
                      Accès aux offres
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="w-3 h-3 text-gray-400" />
                      Limité à 2 candidatures
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="w-3 h-3 text-gray-400" />
                      Pas de notifications prioritaires
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* --- FOOTER (STICKY BOTTOM) --- */}
        <SheetFooter className="p-6 border-t bg-background mt-auto sm:justify-between flex-col-reverse sm:flex-row gap-3">
          {step === 3 ? (
            <div className="w-full space-y-3">
              <Button
                className="w-full bg-premiere hover:bg-premiere-foreground text-lg py-6 shadow-lg shadow-blue-200"
                // onClick={onSubscribe}
                onClick={() => toast('Fonctionnalité pas encore disponible', {
                  action: <Button variant={'secondary'} onClick={onContinueFree}>Retourner à l'accueil</Button>
                })}
                // disabled={isSubmitting || !standardPlan}
                disabled={true}
              >
                {isSubmitting
                  ? "Activation..."
                  : `Passer au Standard (${standardPlan?.priceUSD || "X"}$)`}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <Link onClick={onContinueFree} href="/connexion">Se connecter à mon compte</Link>
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={closeAll}>
                Passer
              </Button>
              <Button
                onClick={() => {
                  // Pour l'étape 2, on déclenche le formulaire via handleSubmit
                  if (step === 1) {
                    onNextFromStep1();
                  } else if (step === 2) {
                    handleSubmit(onSubmitStep2)(); // Appel de handleSubmit ici
                  }
                }}
                disabled={
                  (step === 1 && (!watchRole || watchDomain.length === 0)) ||
                  (step === 2 && isSubmitting) ||
                  createUserMutation.isPending
                }
                className="w-full sm:w-auto px-8">
                {isSubmitting || createUserMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Continuer"
                )}
                {!(isSubmitting || createUserMutation.isPending) && (
                  <ChevronRight className="ml-2 w-4 h-4" />
                )}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// NOTE: Le composant nécessite un hook useQueryClient pour le useMutation.
// Assurez-vous d'avoir un <QueryClientProvider> englobant votre application.
