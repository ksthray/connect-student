"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SectorType } from "@/entities/types";
import { Briefcase, CalendarCheck, Users, TrendingUp } from "lucide-react";
import { formatNumber, frDate } from "@/services/helpers";
import { Separator } from "@/components/ui/separator";

type Props = {
    sector: SectorType | null;
    open: boolean;
    onClose: () => void;
};

export function SectorDetailsDialog({ sector, open, onClose }: Props) {
    if (!sector) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
                {/* Header Section */}
                <div className="relative w-full h-24 bg-linear-to-r from-blue-500/80 to-indigo-500/80 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-white/90 to-transparent dark:from-background" />
                </div>

                <div className="px-6 pb-6 mt-[-30px] relative z-10">
                    {/* Header Info */}
                    <div className="flex items-end gap-4 mb-6">
                        <div className="shrink-0 p-3 rounded-xl border border-border shadow-sm flex items-center justify-center text-primary bg-white dark:bg-card">
                            <Briefcase className="w-10 h-10" />
                        </div>
                        <div className="flex-1 pb-1">
                            <DialogTitle className="text-2xl font-bold leading-tight mb-1 text-foreground capitalize">
                                {sector.name}
                            </DialogTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <span>Détails du secteur d&apos;activité</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg shrink-0">
                                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                                    Opportunités
                                </p>
                                <p className="text-lg font-bold">
                                    {formatNumber(sector.totalOpportunities || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg shrink-0">
                                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                                    Candidats
                                </p>
                                <p className="text-lg font-bold">
                                    {formatNumber(sector.totalCandidates || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50 sm:col-span-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg shrink-0">
                                <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 flex justify-between items-center">
                                <p className="text-sm font-semibold">Date de création</p>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {frDate(sector.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
