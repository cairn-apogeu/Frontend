import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Define um limite de tamanho para o upload de fotos
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido. Use POST." });
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const file = req.body;

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    // Converta o arquivo recebido para base64
    const fileBuffer = Buffer.from(file, "base64");

    // Use a API do Clerk para atualizar a foto do perfil
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`, // Certifique-se de definir sua chave no .env.local
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profile_image: `data:image/jpeg;base64,${fileBuffer.toString(
          "base64"
        )}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erro ao atualizar a foto no Clerk."
      );
    }

    const updatedUser = await response.json();

    return res.status(200).json({
      message: "Foto de perfil atualizada com sucesso!",
      newProfileImageUrl: updatedUser.profile_image_url,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar a foto:", error.message);
    return res
      .status(500)
      .json({ message: error.message || "Erro interno do servidor." });
  }
}
