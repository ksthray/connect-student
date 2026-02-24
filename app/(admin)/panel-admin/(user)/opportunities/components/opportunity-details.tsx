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

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {offer.company?.logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={offer.company.logo}
                                alt={offer.companyName}
                                className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-xl leading-tight">
                                {offer.title}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-1.5 mt-1 text-sm">
                                <Building2 className="w-3.5 h-3.5 shrink-0" />
                                {offer.companyName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                    <Badge
                        className={`${returnBadgeColorOfJobType(offer.type)}`}>
                        {returnNameOfJobType(offer.type)}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={
                            offer.visibility
                                ? "border-green-500 text-green-700"
                                : "border-red-400 text-red-600"
                        }>
                        {offer.visibility ? "Visible" : "Masquée"}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={
                            offer.active
                                ? "border-emerald-500 text-emerald-700"
                                : "border-gray-400 text-gray-600"
                        }>
                        {offer.active ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <Separator />

                {/* Key stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg gap-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">{offer.viewCount}</span>
                        <span className="text-xs text-muted-foreground">Vues</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">{offer.totalApplications}</span>
                        <span className="text-xs text-muted-foreground">Candidatures</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg gap-1">
                        <CalendarCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-center">
                            {frDate(offer.createdAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">Publiée</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg gap-1">
                        <CalendarClock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-center">
                            {offer.deadline ? frDate(offer.deadline) : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">Clôture</span>
                    </div>
                </div>

                <Separator />

                {/* Location & requirements */}
                <div className="space-y-4">
                    {offer.location && (
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span>{offer.location}</span>
                        </div>
                    )}

                    {offer.requirements && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                Prérequis
                            </div>
                            <p className="text-sm text-muted-foreground pl-6 whitespace-pre-line">
                                {offer.requirements}
                            </p>
                        </div>
                    )}

                    {offer.description && (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                Description
                            </div>
                            <p className="text-sm text-muted-foreground pl-6 whitespace-pre-line line-clamp-6">
                                {offer.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sectors */}
                {offer.sectors && offer.sectors.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <span className="text-sm font-semibold">Secteurs</span>
                            <div className="flex flex-wrap gap-2">
                                {offer.sectors.map((s: { id: string; name?: string }) => (
                                    <Badge key={s.id} variant="secondary">
                                        {(s as { id: string; name?: string; label?: string }).name ??
                                            (s as { id: string; name?: string; label?: string }).label ??
                                            s.id}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
