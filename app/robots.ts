import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://connect-student.com";

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

  const allUrls = routes.map((route) => `${baseUrl}${route}`);

  return {
    rules: {
      userAgent: "*",
      allow: allUrls,
      disallow: [
        "/panel-admin",
        "/panel-admin/*",
        "/user",
        "/user/*",
        "/recruiter",
        "/recruiter/*",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_API}/sitemap.xml`,
    host: baseUrl,
  };
}
