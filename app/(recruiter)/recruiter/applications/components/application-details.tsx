"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Phone,
    Briefcase,
    CalendarCheck,
    CheckCircle2,
    Clock,
    XCircle,
    LucideIcon,
    FileText
} from "lucide-react";
import { frDate, returnNameOfJobType, returnBadgeColorOfJobType } from "@/services/helpers";
import { Separator } from "@/components/ui/separator";

interface ApplicationType {
    id: string;
    status: string;
    createdAt: Date;
    jobOffer: {
        title: string;
        type: string;
    };
    candidate: {
        id: string;
        user: {
            fullname: string;
            email: string;
            phone: string;
        };
    };
    cvUrl: string;
    coverLetter: string;
}

type Props = {
    application: ApplicationType | null;
    open: boolean;
    onClose: () => void;
};

const getStatusDetails = (status: string): { color: string; icon: LucideIcon; label: string } => {
    switch (status.toLowerCase()) {
        case "new":
        case "pending":
            return { color: "text-blue-600 bg-blue-100", icon: Clock, label: "Nouveau" };
        case "reviewing":
            return { color: "text-yellow-600 bg-yellow-100", icon: Clock, label: "En cours d'examen" };
        case "shortlisted":
            return { color: "text-purple-600 bg-purple-100", icon: CheckCircle2, label: "Préselectionné" };
        case "accepted":
            return { color: "text-green-600 bg-green-100", icon: CheckCircle2, label: "Accepté" };
        case "rejected":
            return { color: "text-red-600 bg-red-100", icon: XCircle, label: "Refusé" };
        default:
            return { color: "text-slate-600 bg-slate-100", icon: Clock, label: status };
    }
};

export function ApplicationDetailsDialog({ application, open, onClose }: Props) {
    if (!application) return null;

    const statusConfig = getStatusDetails(application.status);
    const StatusIcon = statusConfig.icon;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0">
                <div className="relative w-full h-24 bg-linear-to-r from-blue-500/10 to-indigo-500/10 flex items-center justify-center overflow-hidden">
                </div>

                <div className="px-6 pb-6 mt-[-40px] relative z-10">
                    {/* Header Info */}
                    <div className="flex items-end gap-4 mb-6">
                        <div className="shrink-0 p-3 rounded-full border border-border shadow-sm bg-white flex items-center justify-center text-primary">
                            <User className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="flex-1 pb-2">
                            <DialogTitle className="text-2xl font-bold leading-tight mb-1 text-foreground">
                                {application.candidate.user.fullname}
                            </DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`flex items-center gap-1.5 ${statusConfig.color} border-0 font-medium px-2.5 py-0.5`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {statusConfig.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Candidature Info */}
                    <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Détails de la candidature
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50 p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <Briefcase className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{application.jobOffer.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Offre appliquée</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CalendarCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{frDate(application.createdAt)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Date de candidature</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Contact
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50 p-3">
                                <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-foreground truncate" title={application.candidate.user.email}>
                                        {application.candidate.user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50 p-3">
                                <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {application.candidate.user.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="mt-6 mb-6" />

                    {/* Documents Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Documents joints
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {application.cvUrl && (
                                <a
                                    href={application.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors flex-1"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span className="font-medium text-sm">Voir le CV</span>
                                </a>
                            )}
                            {application.coverLetter && (
                                <a
                                    href={application.coverLetter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors flex-1"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span className="font-medium text-sm">Lettre de motivation</span>
                                </a>
                            )}
                            {(!application.cvUrl && !application.coverLetter) && (
                                <p className="text-sm text-slate-500 italic">Aucun document joint n'a été fourni.</p>
                            )}
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
