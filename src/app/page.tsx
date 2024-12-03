// src/app/login/page.tsx
"use client";

export default function InitialPage() {
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
