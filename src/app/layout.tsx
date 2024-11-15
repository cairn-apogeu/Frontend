import React, { ReactNode } from 'react';
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import '../app/globals.css';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          <SignedIn>
            <UserButton />
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
