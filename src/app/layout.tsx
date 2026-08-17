import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { getMetadataBase } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Sami's iPhone | Premium iPhones",
    template: "%s | Sami's iPhone",
  },
  description:
    "Browse new and used iPhones with transparent pricing, battery health and condition details. Contact Sami directly through WhatsApp.",
  keywords: [
    "iPhone",
    "used iPhone",
    "refurbished iPhone",
    "Sami's iPhone",
    "buy iPhone Pakistan",
  ],
  openGraph: {
    type: "website",
    title: "Sami's iPhone | Premium iPhones",
    description:
      "Quality iPhones with transparent pricing, battery health and condition details. Buy directly via WhatsApp.",
    siteName: "Sami's iPhone",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sami's iPhone | Premium iPhones",
    description:
      "Quality iPhones with transparent pricing, battery health and condition. Buy via WhatsApp.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
