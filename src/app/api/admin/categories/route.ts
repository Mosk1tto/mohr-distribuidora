import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CategoryRequestBody = {
  id?: string;
  name?: string;
  slug?: string;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as CategoryRequestBody;

    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("categories").insert({
      name: body.name.trim(),
      slug: body.slug.trim(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { message: "Erro ao criar categoria." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Category POST error:", err);
    return NextResponse.json(
      { message: "Erro interno ao criar categoria." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as CategoryRequestBody;

    if (!body.id || !body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json(
        { message: "Dados inválidos para atualização." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name: body.name.trim(),
        slug: body.slug.trim(),
      })
      .eq("id", body.id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { message: "Erro ao atualizar categoria." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Category PUT error:", err);
    return NextResponse.json(
      { message: "Erro interno ao atualizar categoria." },
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
        { message: "ID da categoria não informado." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", body.id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { message: "Erro ao excluir categoria." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Category DELETE error:", err);
    return NextResponse.json(
      { message: "Erro interno ao excluir categoria." },
      { status: 500 }
    );
  }
}