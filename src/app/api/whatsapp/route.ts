import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildWhatsAppMessage } from "@/lib/utils/whatsapp";
import type { CartItem, CartProduct } from "@/types/cart";

const DISTRIBUTOR_PHONE = "5546999327638";

type WhatsAppRequestBody = {
  items?: CartItem[];
  mode?: "cart" | "checkout";
  customerName?: string;
  customerPhone?: string;
  notes?: string;
};

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  image_url: string | null;
  stock_quantity: number;
  category: { name: string } | { name: string }[] | null;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as WhatsAppRequestBody;
  const items = body.items ?? [];
  const mode = body.mode ?? "cart";

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ items: [], url: null });
  }

  const supabase = await createClient();

  const ids = items.map((item) => item.productId);

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        price,
        image_url,
        stock_quantity,
        category:categories (
          name
        )
      `
    )
    .in("id", ids)
    .eq("is_active", true);

  if (error) {
    return NextResponse.json(
      { message: "Erro ao buscar produtos do carrinho." },
      { status: 500 }
    );
  }

  const products = (data ?? []) as ProductRow[];

  const mappedItems = products.map((product): CartProduct | null => {
    const cartItem = items.find((item) => item.productId === product.id);

    if (!cartItem) return null;

    const safeQuantity = Math.min(cartItem.quantity, product.stock_quantity);

    const categoryName = Array.isArray(product.category)
      ? product.category[0]?.name
      : product.category?.name;

    return {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: safeQuantity,
      imageUrl: product.image_url,
      stockQuantity: product.stock_quantity,
      categoryName,
    };
  });

  const normalizedItems = mappedItems.filter(
    (item): item is CartProduct => item !== null
  );

  if (mode === "cart") {
    return NextResponse.json({ items: normalizedItems });
  }

  if (!body.customerName?.trim() || !body.customerPhone?.trim()) {
    return NextResponse.json(
      { message: "Nome e telefone são obrigatórios para finalizar." },
      { status: 400 }
    );
  }

  const message = buildWhatsAppMessage(normalizedItems, {
    customerName: body.customerName.trim(),
    customerPhone: body.customerPhone.trim(),
    notes: body.notes?.trim() ?? "",
  });

  const url = `https://wa.me/${DISTRIBUTOR_PHONE}?text=${encodeURIComponent(message)}`;

  return NextResponse.json({
    items: normalizedItems,
    url,
  });
}