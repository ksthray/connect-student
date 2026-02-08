import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // actus
  const jobs = await prisma.jobOffer.findMany({
    select: {
      slug: true,
      createdAt: true,
    },
  });

  const postEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `https://www.connect-student.com/offres/${job.slug}`,
    lastModified: new Date(job.createdAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const baseUrl = "https://www.connect-student.com";

  const routes = [
    "/",
    "/a-propos",
    "/accompagnement-rh",
    "/contact",
    "/offres",
    "/entreprises",
    "/entreprise",
    "/connexion",
  ];

  const pages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));
  const allPages = [...pages, ...postEntries];

  return allPages;
}
