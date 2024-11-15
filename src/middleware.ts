import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(() => {
  return NextResponse.next();
});

export const config = {
  matcher: '/((?!_next|api|favicon.ico).*)', // Aplica o middleware em todas as rotas, exceto as especificadas
};
