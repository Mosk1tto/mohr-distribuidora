"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CartBadge } from "@/components/ui/cart-badge";

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Início" },
    { href: "/products", label: "Produtos" },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6ded0] bg-[#f7f2e9]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Marca */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Ir para a página inicial"
          className="group shrink-0"
        >
          <div className="flex flex-col leading-none">
            <span className="text-[1.15rem] font-black tracking-[0.12em] text-[#345441] transition group-hover:text-[#284233]">
              MOHR
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a7f6d]">
              distribuidora
            </span>
          </div>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#e4dbcd] bg-white/80 p-1 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#e8f0e8] text-[#345441]"
                    : "text-slate-600 hover:bg-[#f6f1e8] hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Carrinho desktop */}
        <div className="hidden md:flex items-center">
          <div className="rounded-full border border-[#ddd3c4] bg-white p-1.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <CartBadge />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="rounded-full border border-[#ddd3c4] bg-white p-1.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <CartBadge />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd3c4] bg-white text-slate-700 transition hover:bg-[#f4efe6]"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="border-t border-[#e6ded0] bg-[#f7f2e9] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#e8f0e8] text-[#345441]"
                      : "bg-white text-slate-700 hover:bg-[#f4efe6]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}