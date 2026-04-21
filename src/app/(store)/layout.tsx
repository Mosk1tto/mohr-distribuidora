import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CartBadge } from "@/components/ui/cart-badge";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Mohr Distribuidora
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/">Início</Link>
            <Link href="/products">Produtos</Link>
            <CartBadge />
            <Link href="/admin/login">Admin</Link>
          </nav>
        </Container>
      </header>

      {children}
    </div>
  );
}