import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/api/:path*', // Aplica o middleware em todas as rotas da API
    '/((?!_next|favicon.ico).*)',
  ],
};