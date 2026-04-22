"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  const links = [
    { href: "/admin", label: "Início" },
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Produtos" },
    { href: "/", label: "Loja" },
  ];

  return (
    <header className="border-b border-slate-300 bg-slate-900 text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/admin" className="text-lg font-bold tracking-tight md:text-xl">
          Painel Admin
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-white ${
                pathname === link.href ? "text-white font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </nav>

        {/* Mobile: hamburguer */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white transition hover:bg-slate-700"
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
        <div className="border-t border-slate-700 bg-slate-800 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-slate-700 ${
                  pathname === link.href
                    ? "bg-slate-700 text-white font-semibold"
                    : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-700 pt-2 mt-2">
              <LogoutButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}