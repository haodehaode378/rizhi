/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@daily-book/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img2.doubanio.com",
      },
      {
        protocol: "https",
        hostname: "img1.doubanio.com",
      },
      {
        protocol: "https",
        hostname: "img9.doubanio.com",
      },
    ],
  },
};

export default nextConfig;
