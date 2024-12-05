// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useSignIn, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Mountains from "../../../public/Mountains-darkmode.png";
import LogoFull from "../../../public/logo-full.svg";
import BarChartComponent from "../components/barChart";

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!signIn) {
        throw new Error("Serviço de autenticação não disponível");
      }
      const response = await signIn.create({
        identifier,
        password,
        strategy: "password",
      });

      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
      } else {
        setError("Autenticação incompleta. Verifique suas credenciais.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#141414]">
      <BarChartComponent />
    </div>
  );
}
