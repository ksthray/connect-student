"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone } from "lucide-react";
import React from "react";

interface ContactModalRhProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ContactModalRh = ({ open, onOpenChange }: ContactModalRhProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Contactez le service RH
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Les demandes d&apos;accompagnement RH se font exclusivement par e-mail.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-6">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center gap-2 text-center">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                            <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Envoyez votre demande à
                            </p>
                            <p className="text-lg font-bold text-foreground overflow-hidden text-ellipsis">
                                contact@connect-student.com
                            </p>
                        </div>
                        <Button
                            className="w-full mt-2"
                            onClick={() =>
                                (window.location.href = "mailto:contact@connect-student.com")
                            }
                        >
                            Envoyer un e-mail
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">
                            Délai de réponse
                        </p>
                        <p>24 à 48 heures ouvrables</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ContactModalRh;
