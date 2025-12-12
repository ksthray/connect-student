"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Briefcase, Clock, GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchFilter() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Discover Your Next{" "}
            <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
              Opportunity
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Browse thousands of job offers, internships, and training programs
            curated just for you. Find the role that matches your skills and
            career goals.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-border sticky top-20 z-40">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by job title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-2 rounded-lg focus:border-secondary"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "all"
                  ? "linear-premiere text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}>
              All Opportunities
            </Button>
            <button
              onClick={() => setActiveTab("job")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "job"
                  ? "bg-linear-to-r from-primary to-secondary text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}>
              <Briefcase className="w-4 h-4" />
              Jobs
            </button>
            <button
              onClick={() => setActiveTab("internship")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "internship"
                  ? "bg-linear-to-r from-primary to-secondary text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}>
              <GraduationCap className="w-4 h-4" />
              Internships
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "training"
                  ? "bg-linear-to-r from-primary to-secondary text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}>
              <Clock className="w-4 h-4" />
              Training
            </button>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            Showing {"10"} of {"78"} opportunities
          </p>
        </div>
      </section>
    </>
  );
}
