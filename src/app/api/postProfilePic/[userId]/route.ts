import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Exemplo de rota:
 * POST /api/postProfilePic/[userId]
 * Body esperado: { "file": "<stringBase64>" }
 */
export async function POST(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    // 1) Pegar o userId dos parâmetros da rota [userId]
    const { userId } = context.params;
    if (!userId) {
      return NextResponse.json(
        { message: "Nenhum userId fornecido na rota." },
        { status: 400 }
      );
    }

    // 2) Ler o JSON do body
    // Exemplo de body: { file: "<stringBase64>" }
    const body = await req.json();
    const base64File = body?.file;
    if (!base64File) {
      return NextResponse.json(
        { message: "Nenhum arquivo enviado (file base64)." },
        { status: 400 }
      );
    }

    // 3) Converter a string base64 em Data URL
    //    O Clerk espera o formato "data:image/jpeg;base64,SUQz..." em `profile_image`.
    //    Se você quiser suportar PNG, verifique o "data:image/png;..." conforme o caso.
    const dataUrl = `data:image/jpeg;base64,${base64File}`;

    // 4) Atualizar o usuário via Clerk Client
    //    (em vez de fazer manualmente fetch para a API do Clerk)
    const clientClerk = clerkClient();
    const updatedUser = await (
      await clientClerk
    ).users.updateUser(userId, {
      profile_image_url: dataUrl,
    });

    // 5) Retornar sucesso ao front-end
    return NextResponse.json({
      message: "Foto de perfil atualizada com sucesso!",
      newProfileImageUrl: updatedUser.profile_image_url,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar a foto no Clerk:", error);
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
