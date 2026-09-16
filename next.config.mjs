/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "33mb", // Adjust limit as needed (e.g., '5mb', '10mb')
    },
  },
};

export default nextConfig;
