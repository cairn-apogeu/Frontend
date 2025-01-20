import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware para processar o upload com multer
const processUpload = (req: any): Promise<any> =>
  new Promise((resolve, reject) => {
    upload.single("file")(req, {}, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(req.file);
      }
    });
  });

export async function POST(req: any, res: any) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return res.status(400).json({ message: "Nenhum userId fornecido." });
    }

    const file = await processUpload(req);

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const updatedUser = await clerkClient.users.updateUserProfileImage(userId, {
      file: file.buffer, // Enviar apenas o buffer
    });

    return res.status(200).json({
      message: "Imagem de perfil atualizada com sucesso!",
      newProfileImageUrl: updatedUser.imageUrl,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar a imagem:", error);
    return res.status(500).json({
      message: "Erro interno ao atualizar a imagem.",
      error: error.message,
    });
  }
}
