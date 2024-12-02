// src/app/login/page.tsx
'use client';

import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";




export default function InitialPage() {
  const { isSignedIn, userId} = useAuth();
  
  useEffect(() => {
    if (isSignedIn) {
      console.log(`Usuário logado: ${userId}`);
      document.cookie = `user=${userId}; path=/; max-age=86400; secure; samesite=strict`;

    }
  }, [isSignedIn, userId]);
  return (
    <div className="flex h-screen bg-[#141414]">

        <div>
          <button
            type="submit"
            className="mt-5 py-3 px-10 bg-[#4DB8FF] text-white hover:bg-[#0070bb] font-fustat font-semibold transition-all rounded-xl text-lg"
          >
          Login
          </button>
        </div>
    </div>
  );
}
