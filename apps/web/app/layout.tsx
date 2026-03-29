import type { Metadata, Viewport } from "next";
import "../src/index.css";

// Server-rendered metadata replaces the old client-side head mutations and
// gives crawlers a stable source for previews and indexing.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.carlsdaleescalo.com"),
  title: "Carls Dale Escalo | Full Stack Developer",
  description:
    "Portfolio of Carls Dale Escalo, a full stack developer building polished web experiences with React, TypeScript, and modern frontend tooling.",
  keywords: [
    "Carls Dale Escalo",
    "full stack developer",
    "React developer",
    "TypeScript portfolio",
    "web developer Philippines",
  ],
  authors: [{ name: "Carls Dale Escalo" }],
  creator: "Carls Dale Escalo",
  publisher: "Carls Dale Escalo",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Carls Dale Escalo | Full Stack Developer",
    description:
      "Explore selected projects, creative work, technical skills, and contact details for Carls Dale Escalo.",
    url: "/",
    siteName: "Carls Dale Escalo",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Carls Dale Escalo portfolio preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carls Dale Escalo | Full Stack Developer",
    description:
      "Portfolio of Carls Dale Escalo featuring selected projects, technical experience, and contact information.",
    images: ["/portfolio.png"],
  },
  icons: {
    icon: "/cde.png",
    shortcut: "/cde.png",
    apple: "/cde.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
