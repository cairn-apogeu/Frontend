import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { useAuth } from "@clerk/nextjs";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 1) Extrai cabeçalhos da requisição

    // 2) Usa getAuth(...) com esses cabeçalhos para obter userId

    const userId = params.userId; // Vem diretamente do nome da pasta: [userId]
    if (!userId) {
      return NextResponse.json(
        { message: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // 3) Lê o body da requisição (JSON), onde esperamos { file: base64String }
    const body = await req.json();
    const base64File = body?.file;

    if (!base64File) {
      return NextResponse.json(
        { message: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    // 4) Converte a string base64 em Buffer
    const fileBuffer = Buffer.from(base64File, "base64");

    // 5) Faz a requisição para a API do Clerk atualizando a foto
    const clerkResponse = await fetch(
      `https://api.clerk.dev/v1/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Clerk espera um Data URL em `profile_image`
          profile_image: `data:image/jpeg;base64,${fileBuffer.toString(
            "base64"
          )}`,
        }),
      }
    );

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.json();
      throw new Error(
        errorData.message || "Erro ao atualizar a foto no Clerk."
      );
    }

    const updatedUser = await clerkResponse.json();

    // 6) Retorna sucesso ao front-end
    return NextResponse.json({
      message: "Foto de perfil atualizada com sucesso!",
      newProfileImageUrl: updatedUser.profile_image_url,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar a foto:", error);
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
