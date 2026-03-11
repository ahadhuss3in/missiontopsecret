import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/context/QueryProvider";

export const metadata: Metadata = {
  title: "FashionFit – Build Outfits from Any Store",
  description: "Mix and match clothing from Zara, H&M, ASOS, Shein, Nike and more into one outfit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
