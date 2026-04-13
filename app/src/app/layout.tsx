import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crowdshield.xyz"),
  title: "CrowdShield - Insurance for the Chaos Era",
  description: "Collect Shield Cards. Protect against real-world events. Instant payouts on Solana when disasters strike.",
  openGraph: {
    title: "CrowdShield - Insurance for the Chaos Era",
    description: "Collect Shield Cards. Protect against real-world events. Instant payouts on Solana when disasters strike.",
    siteName: "CrowdShield",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdShield - Insurance for the Chaos Era",
    description: "Collect Shield Cards. Protect against real-world events. Instant payouts on Solana.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
