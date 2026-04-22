import { AdminHeader } from "@/components/ui/admin-header";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900">
      <AdminHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {children}
      </div>
    </div>
  );
}