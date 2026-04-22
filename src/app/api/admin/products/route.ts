import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProductRequestBody = {
  id?: string;
  name?: string;
  slug?: string;
  price?: number;
  stockQuantity?: number;
  categoryId?: string;
  imageUrl?: string | null;
  description?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as ProductRequestBody;

    if (
      !body.name?.trim() ||
      !body.slug?.trim() ||
      typeof body.price !== "number" ||
      typeof body.stockQuantity !== "number" ||
      !body.categoryId?.trim()
    ) {
      return NextResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("products").insert({
      name: body.name.trim(),
      slug: body.slug.trim(),
      price: body.price,
      stock_quantity: body.stockQuantity,
      category_id: body.categoryId,
      image_url: body.imageUrl ?? null,
      description: body.description ?? null,
      is_active: true,
    });

    if (error) {
      return NextResponse.json(
        { message: "Erro ao criar produto." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Erro interno ao criar produto." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as ProductRequestBody;

    if (
      !body.id ||
      !body.name?.trim() ||
      !body.slug?.trim() ||
      typeof body.price !== "number" ||
      typeof body.stockQuantity !== "number" ||
      !body.categoryId?.trim()
    ) {
      return NextResponse.json(
        { message: "Dados inválidos para atualização." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: body.name.trim(),
        slug: body.slug.trim(),
        price: body.price,
        stock_quantity: body.stockQuantity,
        category_id: body.categoryId,
        image_url: body.imageUrl ?? null,
        description: body.description ?? null,
      })
      .eq("id", body.id);

    if (error) {
      return NextResponse.json(
        { message: "Erro ao atualizar produto." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Erro interno ao atualizar produto." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as { id: string };

    if (!body.id?.trim()) {
      return NextResponse.json(
        { message: "ID do produto não informado." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", body.id);

    if (error) {
      return NextResponse.json(
        { message: "Erro ao excluir produto." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Erro interno ao excluir produto." },
      { status: 500 }
    );
  }
}