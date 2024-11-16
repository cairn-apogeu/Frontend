// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useSignIn, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

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
        await setActive({ session: response.createdSessionId });
        router.push('/page2');
      } else {
        
        setError('Autenticação incompleta. Verifique suas credenciais.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 bg-[#f2f2f2] p-10">
        <Image src="/apogeu-logo.png" alt="Apogeu Brand Book Logo" width={180} height={150} />
        <h1 className="text-center mt-8 mb-12 text-2xl font-bold text-black">
          Acesse, estude e transforme suas ideias!
        </h1>
        <form className="flex flex-col gap-4 w-3/4 mt-6" onSubmit={handleSubmit}>
          <label htmlFor="login" className="text-md font-bold text-black">Login</label>
          <input
            type="text"
            id="login"
            className="p-2 rounded-3xl border shadow-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#D9D8D8] h-[4rem] mb-3"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label htmlFor="password" className="text-md font-bold">Senha</label>
          <input
            type="password"
            id="password"
            className="p-2 border shadow-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#D9D8D8] h-[4rem] rounded-3xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between text-lg mt-2 ml-4">
            <label className="flex items-center text-black">
              <input
                type="checkbox"
                className="mr-1 bg-[#D9D8D8] font-bold"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Lembrar
            </label>
            <a href="/senha" className="text-black underline">Esqueci minha senha</a>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-20 p-3 bg-[#405F73] border border-gray-300 text-white hover:bg-blue-600 h-[4rem] rounded-3xl text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Acessando...' : 'Acessar'}
          </button>
        </form>
      </div>

      <div className="relative w-1/2 bg-black">
        <Image src="/direita-login.png" alt="Climbers on a mountain" fill style={{ objectFit: 'cover' }} />
      </div>
    </div>
  );
}
