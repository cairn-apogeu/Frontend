import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { userId } = getAuth(req);

  // Verifica se o usuário está autenticado
  if (!userId && !req.nextUrl.pathname.startsWith("/login")) {
    // Redireciona o usuário para a página de login se não estiver autenticado
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Permite o acesso se o usuário estiver autenticado
  return NextResponse.next();
}

// Configuração para aplicar o middleware em todas as rotas, exceto as internas
export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|_next/image|api/webhooks).*)",
  ],
};
