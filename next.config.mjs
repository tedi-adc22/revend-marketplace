/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // prev experimental.middlewareClientMaxBodySize: "30mb"
    proxyClientMaxBodySize: "30mb", // <-- Moved inside experimental
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
