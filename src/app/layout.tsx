import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastContainer } from "@/components/ui/toast-container";

export const metadata = {
  title: "Mohr Distribuidora",
  description: "Produtos de limpeza para casa e negócio. Pedido fácil pelo WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden">
        <CartProvider>
          <ToastProvider>
            <ToastContainer />
            {children}
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}