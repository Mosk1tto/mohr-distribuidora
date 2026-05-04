import { StoreHeader } from "@/components/ui/store-header";
import { StoreFooter } from "@/components/ui/store-footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}>
      <StoreHeader />
      <div className="flex-1">{children}</div>
      <StoreFooter />
    </div>
  );
}