/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-www.bluestacks.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;