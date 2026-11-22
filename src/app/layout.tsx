import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NovaChat ES/CA — LQA & LLM Evaluation Dashboard",
  description:
    "Interactive audit dashboard for NovaChat ES/CA: 28 MQM localization defects, 72 recorded answers across 4 LLMs, bilingual human review, and calibrated LLM-as-a-judge evaluation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
