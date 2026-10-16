import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;

















// import type { NextConfig } from "next";

// type RemotePattern = NonNullable<
//   NonNullable<NextConfig["images"]>["remotePatterns"]
// >[number];

// const isProd = process.env.NODE_ENV === "production";

// // Storage URL (.env se) -> remote image pattern
// function getStoragePattern(): RemotePattern | null {
//   const raw = process.env.NEXT_PUBLIC_STORAGE_URL;
//   if (!raw) return null;

//   try {
//     const url = new URL(raw);
//     return {
//       protocol: url.protocol.replace(":", "") as "http" | "https",
//       hostname: url.hostname,
//       port: url.port, // default port par '' hota hai
//       pathname: `${url.pathname.replace(/\/$/, "")}/**`,
//     };
//   } catch {
//     console.warn("Invalid NEXT_PUBLIC_STORAGE_URL:", raw);
//     return null;
//   }
// }

// const storagePattern = getStoragePattern();

// const remotePatterns: RemotePattern[] = [
//   {
//     protocol: "https",
//     hostname: "images.unsplash.com",
//     port: "",
//     pathname: "/**",
//   },
//   {
//     protocol: "https",
//     hostname: "plus.unsplash.com",
//     port: "",
//     pathname: "/**",
//   },
//   // Production / current env ka storage
//   ...(storagePattern ? [storagePattern] : []),
//   // Local development ke liye sirf dev mode mein
//   ...(!isProd
//     ? ([
//         {
//           protocol: "http",
//           hostname: "127.0.0.1",
//           port: "8000",
//           pathname: "/storage/**",
//         },
//         {
//           protocol: "http",
//           hostname: "localhost",
//           port: "8000",
//           pathname: "/storage/**",
//         },
//       ] as RemotePattern[])
//     : []),
// ];

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   poweredByHeader: false,
//   compress: true,
//   output: "standalone", // chhota deploy bundle (Node.js hosting / VPS ke liye)

//   images: {
//     remotePatterns,
//     formats: ["image/avif", "image/webp"],
//   },
// };

// export default nextConfig;

