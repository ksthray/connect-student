
"use client";

import { useQueryState } from "nuqs";
import { useJobOpportunities } from "@/hooks/useJobOpportunities";
import { JobCard } from "@/components/ui/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SearchFilter from "../../offres/components/search-filter";

const SearchPage = () => {
    const [words, setWords] = useQueryState("words", { defaultValue: "" });
    const [type, setType] = useQueryState("type", { defaultValue: "" });
    const [page, setPage] = useQueryState("page", {
        defaultValue: "1",
        parse: (value) => value,
    });

    const currentPage = parseInt(page) || 1;

    const { jobs, isLoading, isError, pagination } = useJobOpportunities({
        page: currentPage,
        words: words || undefined,
        type: type || undefined,
    });

    return (
        <div>
            <SearchFilter />

            <section className="py-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Résultats de recherche {words && `pour "${words}"`}
                        </h2>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={type === "" ? "default" : "outline"}
                                onClick={() => setType(null)} // Clear filter
                                size="sm">
                                Tout
                            </Button>
                            <Button
                                variant={type === "job" ? "default" : "outline"}
                                onClick={() => setType("job")}
                                size="sm">
                                Emploi
                            </Button>
                            <Button
                                variant={type === "internship" ? "default" : "outline"}
                                onClick={() => setType("internship")}
                                size="sm">
                                Stage
                            </Button>
                            <Button
                                variant={type === "training" ? "default" : "outline"}
                                onClick={() => setType("training")}
                                size="sm">
                                Formation
                            </Button>
                            <Button
                                variant={type === "event" ? "default" : "outline"}
                                onClick={() => setType("event")}
                                size="sm">
                                Événement
                            </Button>
                        </div>
                    </div>

                    {isError && (
                        <div className="text-center text-red-500 py-10">
                            Une erreur est survenue lors de la recherche.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
                        {isLoading ? (
                            [1, 2, 3, 4, 5, 6].map((_, index) => (
                                <Skeleton key={index} className="w-full h-72" />
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map((offer, index) => <JobCard key={index} offer={offer} />)
                        ) : (
                            <div className="col-span-full text-center py-10 text-muted-foreground">
                                Aucune offre trouvée correspondant à vos critères.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <Button
                                onClick={() => setPage(String(Math.max(1, currentPage - 1)))}
                                disabled={!pagination.hasPrevPage || isLoading}
                                variant="outline"
                                size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {pagination.currentPage} sur {pagination.totalPages}
                            </span>
                            <Button
                                onClick={() => setPage(String(currentPage + 1))}
                                disabled={!pagination.hasNextPage || isLoading}
                                variant="outline"
                                size="sm">
                                Suivant <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default SearchPage;