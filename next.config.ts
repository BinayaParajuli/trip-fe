import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Trip photos are uploaded through the Django admin and served from its /media/ URL.
const apiUrl = new URL(process.env.NEXT_PUBLIC_BASEURL ?? "http://127.0.0.1:8000/api/");
const isLocalApi = ["localhost", "127.0.0.1"].includes(apiUrl.hostname);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.1.185:3000"],
  // 👇 THIS FIXES THE ERROR
  turbopack: {},
  images: {
    remotePatterns: [new URL(`${apiUrl.origin}/media/**`)],
    // Next blocks optimising images from private IPs; allow it only for a local dev API.
    dangerouslyAllowLocalIP: isLocalApi,
  },
};

export default withNextIntl(
  withPWA({
    dest: "public",
  })(nextConfig),
);
