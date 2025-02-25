"use client";

import { useEffect, useState } from "react";
import { useSignIn, useClerk, useAuth } from "@clerk/nextjs";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Mountains from "../../../public/Dark-Montain-SVG.svg";
import LogoFull from "../../../public/logo-full.svg";
import axiosInstance from "../api/axiosInstance";

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { setActive, client } = useClerk();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = "/home";
    }
  }, [isSignedIn]);

  async function fetchUserType(userId: string) {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data.tipo_perfil;
    } catch (err) {
      console.error("Erro ao buscar o tipo de perfil do usuário:", err);
      return null;
    }
  }

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
        const session = client.sessions.find(
          (session) => session.id === response.createdSessionId
        );

        if (session) {
          const userId = session.user?.id;
          if (userId) {
            const userType = await fetchUserType(userId);
            setCookie("userId", JSON.stringify({ id: userId, type: userType }), {
              httpOnly: false,
              secure: true,
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            });
          } else {
            throw new Error("ID do usuário não encontrado na sessão.");
          }
        } else {
          throw new Error("Sessão não encontrada.");
        }
        window.location.href = "/home";
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
    <div className="flex flex-col md:flex-row h-screen bg-[#141414]">
      <Image
        src={Mountains}
        className="w-full absolute bottom-0 z-0"
        alt="montain"
      />
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-10 z-10 bg-[#1b1b1b] rounded-none md:rounded-r-3xl shadow-2xl">
        <Image src={LogoFull} className="w-40 md:w-60" alt="logo-full" />
        <form className="flex flex-col gap-5 w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="login" className="text-lg md:text-xl text-[#eeee]">
              Login
            </label>
            <input
              type="text"
              id="login"
              className="px-4 py-2 text-black rounded-xl border shadow-inner outline-none bg-[#D9D8D8]"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-lg md:text-xl text-[#eeee]">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="px-4 py-2 text-black rounded-xl border shadow-inner outline-none bg-[#D9D8D8]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}

          <button
            type="submit"
            className="mt-5 py-2 md:py-3 w-full bg-[#4DB8FF] text-white hover:bg-[#0070bb] font-semibold transition-all rounded-xl text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}