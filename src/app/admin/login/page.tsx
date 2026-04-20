import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Mohr Distribuidora
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Entrar no admin
          </h1>
          <p className="mt-2 text-slate-600">
            Acesso restrito para gerenciamento do catálogo.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}