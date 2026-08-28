import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { SJHeader } from "@/components/SJHeader";
import { SJFooter } from "@/components/SJFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Storm & Johnson Limited",
  description:
    "Premium energy-efficient lighting products in Nigeria — Pololux, Qiming & Liton.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${body.className} ${display.variable}`}>
        <SJHeader />
        <main>{children}</main>
        <SJFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

