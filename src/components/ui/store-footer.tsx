import Link from "next/link";
import { Container } from "@/components/ui/container";

export function StoreFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Mohr Distribuidora
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Produtos de limpeza para casa e negócio, com atendimento prático e pedido facilitado.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Contato
            </h3>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <a
                href="https://wa.me/5546999218016"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition"
              >
                WhatsApp
              </a>
              <a
                href="mailto:marco.mohr36@gmail.com"
                className="hover:text-emerald-600 transition"
              >
                marco.mohr36@gmail.com
              </a>
              <p>Clevelândia - PR</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Informações
            </h3>
            <nav className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/privacidade" className="hover:text-emerald-600 transition">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="hover:text-emerald-600 transition">
                Termos de Uso
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© 2026 Mohr Distribuidora. Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}