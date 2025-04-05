/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["localhost"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dfocogmzz/**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**"
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "**"
      }
    ]
  }
}

export default nextConfig
