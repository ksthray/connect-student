"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CandidateUserType } from "@/entities/types";
import {
    User,
    Mail,
    Calendar,
    Briefcase,
    Award,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { frDate } from "@/services/helpers";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function typeLabel(type: string) {
    switch (type) {
        case "STUDENT":
            return "Étudiant";
        case "GRADUATE":
            return "Diplômé";
        case "PROFESSIONAL":
            return "Professionnel";
        default:
            return type || "N/A";
    }
}

function typeColor(type: string) {
    switch (type) {
        case "STUDENT":
            return "bg-blue-100 text-blue-800";
        case "GRADUATE":
            return "bg-purple-100 text-purple-800";
        case "PROFESSIONAL":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
type Props = {
    candidate: CandidateUserType | null;
    open: boolean;
    onClose: () => void;
};

export function CandidateDetailsSheet({ candidate, open, onClose }: Props) {
    if (!candidate) return null;

    const isVerified = candidate.status === "Verifié";

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-full sm:max-w-md overflow-y-auto">
                {/* Header */}
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl capitalize">{candidate.user}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        {candidate.email}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                {/* Info grid */}
                <div className="space-y-5">
                    {/* Type */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            Profil
                        </div>
                        <Badge className={`${typeColor(candidate.type)}`}>
                            {typeLabel(candidate.type)}
                        </Badge>
                    </div>

                    {/* Statut */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {isVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            Statut
                        </div>
                        <span
                            className={`text-sm font-medium ${isVerified ? "text-green-600" : "text-red-500"}`}>
                            {candidate.status}
                        </span>
                    </div>

                    {/* Date d'inscription */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Inscription
                        </div>
                        <span className="text-sm font-medium">
                            {frDate(candidate.joinDate)}
                        </span>
                    </div>

                    {/* Candidatures */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            Candidatures
                        </div>
                        <span className="text-sm font-semibold">
                            {candidate.applicationsCount}
                        </span>
                    </div>

                    {/* Score de profil */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Award className="w-4 h-4" />
                                Complétude du profil
                            </div>
                            <span className="text-sm font-semibold">{candidate.score}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full linear-premiere rounded-full transition-all duration-500"
                                style={{ width: `${candidate.score}%` }}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
