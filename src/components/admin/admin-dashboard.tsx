"use client";

import { useState } from "react";
import { AdminProductsView } from "@/components/admin/admin-products-view";
import { AdminCategoriesView } from "@/components/admin/admin-categories-view";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

type AdminDashboardProps = {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
};

type Tab = "products" | "categories";

export function AdminDashboard({
  products,
  categories,
  initialQuery = "",
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="space-y-6">
      {/* Abas */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "products"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Produtos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "categories"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Categorias ({categories.length})
        </button>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "products" && (
        <AdminProductsView
          products={products}
          categories={categories}
          initialQuery={initialQuery}
        />
      )}

      {activeTab === "categories" && (
        <AdminCategoriesView categories={categories} />
      )}
    </div>
  );
}