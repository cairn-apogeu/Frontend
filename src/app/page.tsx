// src/app/login/page.tsx
"use client";

import RadarComponent from "./components/radarChart";

export default function InitialPage() {
  return (
    <div className="flex h-screen white">
      <div>
        <button
          type="submit"
          className="mt-5 py-3 px-10 bg-[#4DB8FF] text-white hover:bg-[#0070bb] font-fustat font-semibold transition-all rounded-xl text-lg"
        >
          Login
        </button>
      </div>
      <RadarComponent />
    </div>
  );
}
