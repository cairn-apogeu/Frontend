import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import React from "react";

const upload = multer();

export const config = {
  api: {
    bodyParser: false, // Necessário para processar multipart/form-data
  },
};

export async function POST(req: NextRequest, context: any) {
  try {
    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        { message: "Nenhum userId fornecido na rota." },
        { status: 400 }
      );
    }

    const uploadedFile = await new Promise((resolve, reject) => {
      upload.single("file")(req as any, {} as any, (err: any) => {
        if (err) return reject(err);
        resolve((req as any).file);
      });
    });

    if (!uploadedFile) {
      return NextResponse.json(
        { message: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const fileBuffer = (uploadedFile as any).buffer;
    const fileMimeType = (uploadedFile as any).mimetype;
    const fileOriginalName = (uploadedFile as any).originalname;

    const file = new File([fileBuffer], fileOriginalName, {
      type: fileMimeType,
    });

    const updatedUser = await clerkClient.users.updateUserProfileImage(userId, {
      file,
    });

    return NextResponse.json({
      message: "Imagem de perfil atualizada com sucesso!",
      newProfileImageUrl: updatedUser.imageUrl,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar a imagem:", error);
    return NextResponse.json(
      { message: "Erro interno ao atualizar a imagem.", error: error.message },
      { status: 500 }
    );
  }
}
