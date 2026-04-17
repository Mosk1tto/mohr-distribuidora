import Link from "next/link";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Mohr Distribuidora
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/">Início</Link>
            <Link href="/products">Produtos</Link>
            <Link href="/cart">Carrinho</Link>
            <Link href="/admin/login">Admin</Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}