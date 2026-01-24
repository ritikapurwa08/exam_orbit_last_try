import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
};

// Exporting with PWA config caused build issues with Next.js 16/Turbopack in this environment.
// Uncomment the line below and comment out 'export default nextConfig' to try enabling PWA if environment allows.
// export default withPWAConfig(nextConfig);

export default nextConfig;
