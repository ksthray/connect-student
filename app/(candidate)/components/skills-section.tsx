"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type SkillsSectionProps = {
    initialSkills: string[];
    token: string;
};

export default function SkillsSection({
    initialSkills = [],
    token,
}: SkillsSectionProps) {
    const [skills, setSkills] = useState<string[]>(initialSkills);
    const [newSkill, setNewSkill] = useState("");

    const updateSkills = async (updatedSkills: string[]) => {
        // Optimistic update
        setSkills(updatedSkills);

        try {
            await api.patch(
                "/candidate/myprofil",
                { skills: updatedSkills },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Compétences mises à jour");
        } catch {
            toast.error("Erreur lors de la mise à jour des compétences");
            // Revert optimization on error if needed, but for now simplistic approach
            setSkills(skills);
        }
    };

    const addSkill = () => {
        if (!newSkill.trim()) return;
        if (skills.includes(newSkill)) return;

        updateSkills([...skills, newSkill]);
        setNewSkill("");
    };

    const removeSkill = (skill: string) => {
        updateSkills(skills.filter((s) => s !== skill));
    };

    useEffect(() => {
        if (initialSkills) {
            setSkills(initialSkills);
        }
    }, [initialSkills]);

    return (
        <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5" />
                <h2 className="text-xl font-bold">Compétences</h2>
            </div>

            <div className="flex gap-2 mb-4">
                <Input
                    placeholder="Nouvelle compétence"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button onClick={addSkill}>Ajouter</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skill) => (
                    <div
                        key={skill}
                        className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{skill}</span>
                        <button onClick={() => removeSkill(skill)} className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
