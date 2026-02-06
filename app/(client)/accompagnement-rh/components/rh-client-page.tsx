"use client";

import React, { useState } from "react";
import ContactModalRh from "./contact-modal-rh";
import HeroRh from "./hero-rh";
import WhyRh from "./why-rh";
import ProcessRh from "./process-rh";
import DetailsRh from "./details-rh";
import FaqRh from "./faq-rh";
import ContactRh from "./contact-rh";

const RhClientPage = () => {

    return (
        <main className="min-h-screen bg-slate-50/10">
            <HeroRh />
            <WhyRh />
            <ProcessRh />
            <DetailsRh />
            <FaqRh />
            <ContactRh />
        </main>
    );
};

export default RhClientPage;
