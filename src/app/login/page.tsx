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
    <div className="flex flex-col h-screen bg-[#141414] relative justify-start items-center">
        <Image src={LogoFull} className="w-32 md:w-60 mt-10" alt="logo-full" />
      <Image
        src={Mountains}
        className="hidden md:block w-full absolute bottom-0 z-0 opacity-60 object-cover h-full md:h-auto"
        alt="montain"
      />
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col justify-center items-center w-full max-w-sm p-6 bg-[#1b1b1b] rounded-xl shadow-2xl z-10">
          <form className="flex flex-col gap-6 w-full bg-[#222222] p-6 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="login" className="text-lg md:text-xl text-[#eeee] font-semibold">
                Login
              </label>
              <input
                type="text"
                id="login"
                className="px-4 py-3 text-black rounded-lg border border-gray-600 shadow-inner outline-none bg-[#D9D8D8] focus:ring-2 focus:ring-blue-500"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-lg md:text-xl text-[#eeee] font-semibold">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="px-4 py-3 text-black rounded-lg border border-gray-600 shadow-inner outline-none bg-[#D9D8D8] focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm md:text-base text-center">{error}</p>}

            <button
              type="submit"
              className="mt-5 py-3 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 font-semibold transition-all rounded-lg text-lg shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <div className=" fixed -bottom-10 w-full h-1/3 bg-gradient-to-t from-[#4DB8FF]/20 to-transparent blur-2xl rounded-t-full md:hidden"></div>

      </div>
    </div>
  );
}