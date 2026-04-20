import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/constants/site";
import { CartProvider } from "@/contexts/cart-context";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}