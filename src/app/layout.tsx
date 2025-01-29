// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const fustat = localFont({
  src: "./fonts/Fustat.woff",
  variable: "--font-fustat",
  weight: "100 200 300 400 500 600 700 800 900",
});


export const metadata: Metadata = {
  title: "Apogeu - Desenvolvimento de Software",
  description: "Apogeu é uma plataforma inovadora que conecta alunos a projetos de desenvolvimento de software, oferecendo aprendizado prático e capacitação de gestores. Junte-se a nós para transformar sua carreira e levar seu projeto ao próximo nível.",
  keywords: ["desenvolvimento de software", "capacitação de gestores", "aprendizado prático", "projetos de tecnologia", "software house", "educação em tecnologia", "gestão de projetos"],
  openGraph: {
    type: "website",
    url: "https://www.apogeu.org",
    title: "Apogeu - Desenvolvimento de Software e Capacitação de Gestores",
    description: "Aprenda e se desenvolva em projetos reais, seja um gestor ou desenvolvedor, com a Apogeu. Conectamos pessoas a oportunidades de crescimento profissional.",
    siteName: "Apogeu",
    images: [
      {
        url: "/public/og-image.jpg",
        alt: "Imagem de Apogeu",
      }
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fustat.variable} w-full`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
