import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { QueryProvider } from "@/context/QueryProvider";

export const metadata: Metadata = {
  title: "FashionFit – Build Outfits from Any Store",
  description: "Mix and match clothing from Zara, H&M, ASOS, Shein, Nike and more into one outfit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <header>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          <QueryProvider>{children}</QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
