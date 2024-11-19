// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import LoginPage from "./login";

const fustat = localFont({
  src: "./fonts/Fustat.woff",
  variable: "--font-fustat",
  weight: "100 200 300 400 500 600 700 800 900",
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fustat.variable}`}
      >
        <ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <SignedOut>
            <LoginPage />
          </SignedOut>
          <SignedIn>
            {/* <UserButton /> */}
            {children}
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
