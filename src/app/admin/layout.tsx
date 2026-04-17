import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-300 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-xl font-bold tracking-tight">
            Painel Admin
          </Link>

          <nav className="flex items-center gap-4 text-sm text-slate-200">
            <Link href="/admin">Início</Link>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/login">Login</Link>
            <Link href="/">Loja</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}