"use client";

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import LoginPage from "./login/page";
import { usePathname } from "next/navigation";

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get current path

  const isPublicPage = ["/", "/login", "/aluno"].includes(pathname); // Define public pages

  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedOut>
        {isPublicPage ? (
          children
        ) : (
          <LoginPage /> // Redirect non-authenticated users to login page
        )}
      </SignedOut>
      <SignedIn>
        {
          children
        }
      </SignedIn>
    </ClerkProvider>
  );
}
