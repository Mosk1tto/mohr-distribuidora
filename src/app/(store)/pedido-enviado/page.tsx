import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CheckCircle } from "lucide-react";

export default function PedidoEnviadoPage() {
  return (
    <main className="min-h-[70vh] flex items-center">
      <Container className="flex flex-col items-center text-center gap-6 py-20">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>

        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">
            Pedido enviado com sucesso!
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Sua mensagem foi preparada para o WhatsApp. Assim que enviada,
            entraremos em contato para confirmar seu pedido e combinar a entrega.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 max-w-sm w-full">
          <p className="text-sm font-semibold text-slate-700 mb-1">Próximos passos</p>
          <ol className="text-sm text-slate-600 space-y-1 text-left list-decimal list-inside">
            <li>Envie a mensagem que apareceu no WhatsApp</li>
            <li>Aguarde nossa confirmação</li>
            <li>Combine a entrega ou retirada</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Continuar comprando
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Voltar ao início
          </Link>
        </div>

      </Container>
    </main>
  );
}