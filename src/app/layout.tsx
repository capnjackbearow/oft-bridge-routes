import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OFT Bridge Routes",
  description: "Discover bridging routes for Omnichain Fungible Tokens via LayerZero & Stargate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
