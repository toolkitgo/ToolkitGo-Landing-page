import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#0F1940",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ToolkitGO - Simplifying Everyday Services",
  description:
    "ToolkitGo connects customers with skilled professionals for household repairs, business maintenance and large-scale service needs.",
  keywords: [
    "ToolkitGO",
    "on-demand technician",
    "home repairs",
    "household services",
    "corporate maintenance",
    "contract services",
    "verified professionals",
  ],
  authors: [{ name: "ToolkitGO Technologies" }],
  openGraph: {
    title: "ToolkitGO - Simplifying Everyday Services",
    description:
      "Connect with skilled, verified independent service partners for household repairs, business maintenance and contract services.",
    siteName: "ToolkitGO",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-navy font-sans selection:bg-orange selection:text-navy">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
