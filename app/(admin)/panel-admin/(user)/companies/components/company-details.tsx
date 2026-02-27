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
import { CompanyType } from "@/entities/types";
import {
    Building2,
    MapPin,
    Mail,
    Phone,
    Briefcase,
    Globe,
    FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Props = {
    company: CompanyType | null;
    open: boolean;
    onClose: () => void;
};

export function CompanyDetailsDialog({ company, open, onClose }: Props) {
    if (!company) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-0">
                {/* Cover & Header Section */}
                <div className="relative w-full h-32 bg-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-linear-to-r from-blue-500/20 to-teal-500/20" />
                    <div className="absolute inset-0 bg-linear-to-t from-white/90 to-transparent dark:from-background" />
                </div>

                <div className="px-6 pb-6 mt-[-40px] relative z-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Header Info */}
                    <div className="flex items-end gap-5 mb-4">
                        <div className="shrink-0 bg-white dark:bg-card p-1.5 rounded-xl border border-border shadow-sm">
                            {company.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <Image
                                    src={company.logo}
                                    alt={company.companyName}
                                    width={400}
                                    height={400}
                                    className="w-20 h-20 rounded-lg object-contain bg-slate-50"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
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
                                {company.companyName}
                            </h2>
                            {company.industry && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                    <Briefcase className="w-4 h-4 shrink-0 text-primary" />
                                    <span>{company.industry}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Key contact stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {company.email && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                        Email
                                    </p>
                                    <p className="text-sm font-medium">{company.email}</p>
                                </div>
                            </div>
                        )}
                        {company.phone && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                        Téléphone
                                    </p>
                                    <p className="text-sm font-medium">{company.phone}</p>
                                </div>
                            </div>
                        )}
                        {company.location && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                        Localisation
                                    </p>
                                    <p className="text-sm font-medium">{company.location}</p>
                                </div>
                            </div>
                        )}
                        {company.website && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/50">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                                    <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                        Site Web
                                    </p>
                                    <Link
                                        href={company.website}
                                        target="_blank"
                                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
                                        Visiter le site
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator className="mb-6" />

                    {/* Details section */}
                    <div className="space-y-6">
                        {company.description && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0">
                                    <FileText className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div className="mt-1 flex-1">
                                    <h4 className="text-sm font-semibold mb-2">
                                        À propos de l&apos;entreprise
                                    </h4>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-border/50">
                                        {company.description}
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
