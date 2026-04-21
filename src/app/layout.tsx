import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastContainer } from "@/components/ui/toast-container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
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