/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.service-market.com.ua"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dfocogmzz/**",
      },
    ],
  },
};

export default nextConfig;
