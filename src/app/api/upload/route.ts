import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "product-images";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Arquivo inválido." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeInBytes = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Formato inválido. Use JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { message: "A imagem deve ter no máximo 2MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { message: "Erro ao fazer upload da imagem." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      imageUrl: data.publicUrl,
      path: filePath,
    });
  } catch {
    return NextResponse.json(
      { message: "Erro interno no upload." },
      { status: 500 }
    );
  }
}