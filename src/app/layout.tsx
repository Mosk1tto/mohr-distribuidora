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
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=bricolage-grotesque@400,500,600,700&f[]=general-sans@400,500,600&display=swap"
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