import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "img.freepik.com",
      },
      {
        hostname: "isobarscience-1bfd8.kxcdn.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "scontent.cdninstagram.com",
      },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
