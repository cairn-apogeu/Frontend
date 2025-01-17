// src/app/api/getUser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function GET(req: NextRequest) {
  try {
    // Obtemos os parâmetros da URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Verificação do parâmetro userId
    if (!userId) {
      return NextResponse.json(
        { error: 'Parâmetro userId é obrigatório' },
        { status: 400 }
      );
    }

    // Busca o usuário pelo Clerk
    const user = await clerkClient.users.getUser(userId);

    // Se o usuário não for encontrado
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Retorna os dados do usuário
    return NextResponse.json({
      id: userId,
      name: `${user.firstName} ${user.lastName}`,
      profileImageUrl: user.imageUrl,
      
    });
  } catch (error) {
    console.error('Erro interno no servidor:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
