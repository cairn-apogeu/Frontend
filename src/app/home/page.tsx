"use client";
import { useState } from "react";
import SideNav from "@/app/components/sideNav";
import RadarChartSection from "@/app/components/RadarChartSection";

export default function Project() {
  const [userId, setUserId] = useState<string>("");

  const handleSearch = () => {
    // Atualiza o estado userId, RadarChartSection fará a busca
  };

  return (
    <div className="bg-[#141414]">
      <SideNav />
      <div className="flex flex-2 flex-col p-64">
        <div className="flex mb-16">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Digite o ID do usuário"
            className="p-2 rounded-md bg-[#2D2D2D] text-[#eee]"
          />
          <button
            onClick={handleSearch}
            className="ml-2 p-2 rounded-md bg-[#4DB8FF] text-[#141414]"
          >
            Buscar
          </button>
        </div>
        <RadarChartSection userId={userId} />
      </div>
    </div>
  );
}