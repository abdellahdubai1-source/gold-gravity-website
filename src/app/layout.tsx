import type { Metadata } from "next";

// Root layout is intentionally minimal — middleware redirects every
// request to a locale-prefixed route (/en or /ar), where
// src/app/[locale]/layout.tsx provides the real <html>/<body> shell,
// fonts, header, footer and JSON-LD. Next.js still requires a root
// layout file to exist, so this one simply passes children through.

export const metadata: Metadata = {
  title: "Gold Gravity Trading LLC",
  description: "UAE food & consumer products trading and distribution.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
