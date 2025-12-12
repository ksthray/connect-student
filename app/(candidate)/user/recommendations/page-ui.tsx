"use client";

import { Button } from "@/components/ui/button";

export default function CandidateRecommendations() {
  const recommendedOpportunities = [
    {
      id: 1,
      position: "Backend Developer",
      company: "Tech Innovators Inc.",
      type: "Job Offer",
      salary: "$100k - $130k",
      match: "92%",
    },
    {
      id: 2,
      position: "Product Design Internship",
      company: "Design Studio Co.",
      type: "Internship",
      salary: "Unpaid",
      match: "88%",
    },
    {
      id: 3,
      position: "Marketing Training Program",
      company: "Marketing Academy",
      type: "Training",
      salary: "$2,500",
      match: "85%",
    },
  ];

  return (
    <div className="space-y-8 p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Our Recommendations
        </h1>
        <p className="text-muted-foreground">
          Create and manage your professional profile to attract opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {opp.position}
                </p>
                <p className="text-xs text-muted-foreground">{opp.company}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {opp.match}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{opp.type}</span>
                <span className="font-semibold text-foreground">
                  {opp.salary}
                </span>
              </div>
            </div>

            <Button className="w-full bg-linear-to-r from-primary to-secondary text-white text-xs h-8">
              Apply Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
