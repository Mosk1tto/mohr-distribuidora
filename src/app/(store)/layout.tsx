import { StoreHeader } from "@/components/ui/store-header";
import { StoreFooter } from "@/components/ui/store-footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <StoreHeader />
      <div className="flex-1">{children}</div>
      <StoreFooter />
    </div>
  );
}