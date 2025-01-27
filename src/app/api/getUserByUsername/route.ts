import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function GET(req: NextRequest) {
  try {
    // Obtemos os parâmetros da URL
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    // Verificação do parâmetro username
    if (!username) {
      return NextResponse.json(
        { error: 'Parâmetro username é obrigatório' },
        { status: 400 }
      );
    }

    // Busca o usuário pelo Clerk
    const usersResponse = await clerkClient.users.getUserList({
      username: [username],
    });

    // Acessa a lista de usuários
    const users = usersResponse.data;

    // Se o usuário não for encontrado
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Retorna os dados do usuário
    return NextResponse.json({
      userId: user.id,
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