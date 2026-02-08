"use client";

import { useEffect } from "react";
import { trackJobView } from "@/utils/viewTracker";

interface ViewCounterProps {
    jobSlug: string;
}

const ViewCounter = ({ jobSlug }: ViewCounterProps) => {
    useEffect(() => {
        if (jobSlug) {
            trackJobView(jobSlug);
        }
    }, [jobSlug]);

    return null; // Ce composant est invisible
};

export default ViewCounter;