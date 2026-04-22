"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartBadge } from "@/components/ui/cart-badge";

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  const links = [
    { href: "/", label: "Início" },
    { href: "/products", label: "Produtos" },
    { href: "/admin/login", label: "Admin" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
          {/* Ícone simples como logo */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-bold">
            M
          </div>
          <span className="hidden min-[400px]:block text-lg md:text-xl">
            Mohr Distribuidora
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-slate-900 ${
                pathname === link.href ? "text-slate-900 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <CartBadge />
        </nav>

        {/* Mobile: carrinho + hamburguer */}
        <div className="flex items-center gap-2 md:hidden">
          <CartBadge />
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              // X
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              // Hamburguer
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile expandido */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-50 ${
                  pathname === link.href
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}