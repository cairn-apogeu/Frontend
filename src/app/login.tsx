// src/app/login/page.tsx
'use client';

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';
import { useSignIn, useClerk  } from '@clerk/nextjs';
import Image from 'next/image';
import Mountains from '../../public/Mountains-darkmode.png'
import LogoFull from '../../public/logo-full.svg'

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isSignedIn, isLoaded, userId, sessionId } = useAuth();
  // console.log(`USER ID ANTES: ${userId}\nIS SIGNED IN ANTES: ${isSignedIn}`);
  
  useEffect(() => {
    if (isSignedIn) {
      console.log(`Usuário logado: ${userId}`);
    }
  }, [isSignedIn, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!signIn) {
        throw new Error('Serviço de autenticação não disponível');
      }
      const response = await signIn.create({
        identifier,
        password,
        strategy: 'password',
      });

      if (response.status === 'complete') {
        console.log("LOGIN FEITO");
        console.log(`USER ID DEPOIS: ${userId}\nIS SIGNED IN DEPOIS: ${isSignedIn}`);
        await setActive({ session: response.createdSessionId });
      } else {
        
        setError('Autenticação incompleta. Verifique suas credenciais.');
      }
    } catch (err: any) {

      console.log(`------- ERRO --------\n\n${err}\n\n------------------------`);

        setError(err.errors?.[0]?.longMessage || 'Erro ao fazer login')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#141414]">
      <Image src={Mountains} fill className='absolute z-0' alt="montain" />
      <div className="flex flex-col justify-around items-center w-1/2 p-10 z-10 bg-[#1b1b1b] rounded-r-3xl shadow-2xl">
        <Image src={LogoFull} className='w-60' alt="logo-full"/>
        <form className="flex flex-col gap-5 w-96  " onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor="login" className="text-xl font-fustat text-[#eeee]">Login</label>
            <input
              type="text"
              id="login"
              className="px-5 text-black rounded-xl border shadow-inner outline-none bg-[#D9D8D8] h-[4rem]"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="login" className="text-xl font-fustat text-[#eeee]">Senha</label>
            <input
              type="password"
              id="password"
              className="px-5 text-black rounded-xl border shadow-inner outline-none bg-[#D9D8D8] h-[4rem]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-5 py-3 w-full bg-[#4DB8FF] text-white hover:bg-[#0070bb] font-fustat font-semibold transition-all rounded-xl text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
