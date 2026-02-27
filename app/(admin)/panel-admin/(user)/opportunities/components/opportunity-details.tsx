"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobOfferType } from "@/entities/types";
import {
    Building2,
    MapPin,
    Eye,
    Users,
    CalendarClock,
    CalendarCheck,
    FileText,
    CheckCircle,
    XCircle,
} from "lucide-react";
import {
    returnBadgeColorOfJobType,
    returnNameOfJobType,
    frDate,
} from "@/services/helpers";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
type Props = {
    offer: JobOfferType | null;
    open: boolean;
    onClose: () => void;
};

export function OpportunityDetailsDialog({ offer, open, onClose }: Props) {
    if (!offer) return null;

    const today = new Date();
    // Reset time to midnight to compare just dates if needed, or keep accurate time
    const isExpired = offer.deadline ? new Date(offer.deadline) < today : false;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[650px] h-[70vh] p-0 overflow-hidden border-0">
                {/* Cover & Header Section */}
                <div className="relative w-full h-32 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {offer.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <Image
                            src={offer.coverImage}
                            alt="Cover"
                            width={400}
                            height={400}
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-r from-blue-500/20 to-purple-500/20" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-white/90 to-transparent dark:from-background" />
                </div>

                <div className="px-6 pb-6 mt-[-40px] relative z-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Header Info */}
                    <div className="flex items-end gap-5 mb-4">
                        <div className="shrink-0 bg-white dark:bg-card p-1.5 rounded-xl border border-border shadow-sm">
                            {(offer.company?.logo || offer.companyName) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={offer.company?.logo || "/placeholder-logo.svg"}
                                    alt={offer.companyName}
                                    className="w-20 h-20 rounded-lg object-contain bg-slate-50"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Building2 className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pb-1">
                            <h2 className="text-2xl font-bold leading-tight mb-1 text-foreground">
                                {offer.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <Building2 className="w-4 h-4 shrink-0 text-primary" />
                                <span>{offer.companyName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Expiration warning */}
                    {isExpired && (
                        <div className="mb-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Offre clôturée</h4>
                                <p className="text-sm text-red-600 dark:text-red-400/80 mt-0.5">
                                    La date limite de candidature pour cette offre est dépassée depuis le {frDate(offer.deadline!)}.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge className={`px-3 py-1 ${returnBadgeColorOfJobType(offer.type)}`}>
                            {returnNameOfJobType(offer.type)}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={
                                offer.visibility
                                    ? "border-green-500/50 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                    : "border-gray-300 text-gray-500"
                            }>
                            {offer.visibility ? "Visible" : "Masquée"}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={
                                offer.active
                                    ? "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                    : "border-gray-300 text-gray-500"
                            }>
                            {offer.active ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    <Separator className="mb-6" />

                    {/* Key stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                            <Eye className="w-5 h-5 text-blue-500 mb-1" />
                            <span className="text-lg font-bold">{offer.viewCount}</span>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Vues</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                            <Users className="w-5 h-5 text-indigo-500 mb-1" />
                            <span className="text-lg font-bold">{offer.totalApplications}</span>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Candidatures</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                            <CalendarCheck className="w-5 h-5 text-emerald-500 mb-1" />
                            <span className="text-sm font-bold text-center mt-0.5">
                                {frDate(offer.createdAt)}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">Publiée le</span>
                        </div>
                        <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${isExpired ? 'bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-900/50 border-border/50'}`}>
                            <CalendarClock className={`w-5 h-5 mb-1 ${isExpired ? 'text-red-500' : 'text-orange-500'}`} />
                            <span className={`text-sm font-bold text-center mt-0.5 ${isExpired ? 'text-red-700 dark:text-red-400' : ''}`}>
                                {offer.deadline ? frDate(offer.deadline) : "—"}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">Date limite</span>
                        </div>
                    </div>

                    {/* Sectors */}
                    {offer.sectors && offer.sectors.length > 0 && (
                        <div className="mb-6 space-y-2.5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Secteurs visés</h3>
                            <div className="flex flex-wrap gap-2">
                                {offer.sectors.map((s: { id: string; name?: string; label?: string }) => (
                                    <Badge key={s.id} variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 transition-colors py-1.5 px-3">
                                        {s.name ?? s.label ?? s.id}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator className="mb-6" />

                    {/* Details section */}
                    <div className="space-y-6">
                        {offer.location && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0">
                                    <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div className="mt-1">
                                    <h4 className="text-sm font-semibold mb-0.5">Lieu</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{offer.location}</p>
                                </div>
                            </div>
                        )}

                        {offer.requirements && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full shrink-0">
                                    <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="mt-1 flex-1">
                                    <h4 className="text-sm font-semibold mb-1">Prérequis</h4>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-border/50 whitespace-pre-line">
                                        {offer.requirements}
                                    </div>
                                </div>
                            </div>
                        )}

                        {offer.description && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full shrink-0">
                                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="mt-1 flex-1">
                                    <h4 className="text-sm font-semibold mb-1">Description du poste</h4>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                        {offer.description}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
