"use client";

import { Mail, Clock, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const ContactRh = () => {
    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Contact – Accompagnement RH</h2>
                    <p className="text-muted-foreground">Notre équipe est à votre disposition</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-premiere">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <a href="mailto:contact@connect-student.com" className="text-premiere hover:underline">
                            contact@connect-student.com
                        </a>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-premiere">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-2">Téléphone</h3>
                        <Link href={'tel:+243989281540'} className="text-premiere hover:underline">
                            +243 989 281 540
                        </Link>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-premiere">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold mb-2">Délai de réponse</h3>
                        <p className="text-muted-foreground">
                            24 à 48 heures ouvrables
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactRh;
