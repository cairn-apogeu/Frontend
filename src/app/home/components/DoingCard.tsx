"use client";

import { useEffect, useState } from "react";
import SideNav from "@/app/components/sideNav";
import Card from "../aluno/project/components/kanban/card";
import axiosInstance from "@/app/api/axiosInstance";

interface CardData {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  tempo_estimado?: number;
  tempo?: number;
  assigned?: string;
  sprint?: number;
  projeto?: number;
  dod?: string[];
  dor?: string[];
  xp_frontend?: number;
  xp_backend?: number;
  xp_negocios?: number;
  xp_arquitetura?: number;
  xp_design?: number;
  xp_datalytics?: number;
  indicacao_conteudo?: string;
  data_criacao: string; // Adicione o campo data_criacao
}

export default function DoingCardPage() {
  const [doingCards, setDoingCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function fetchDoingCards() {
      try {
        const response = await axiosInstance.get(`/cards/project/1`);
        const cards = response.data.filter((card: CardData) => card.status === "doing");
        setDoingCards(cards);
      } catch (error) {
        console.error("Erro ao buscar cards:", error);
      }
    }
    fetchDoingCards();
  }, []);

  return (
    <div className="flex min-h-screen min-w-screen bg-[#141414] relative">
      <SideNav />
      <div className="flex flex-col w-full p-8">
        
        <div className="absolute top-36 right-16 w-[300px] space-y-4">
          <div className="bg-yellow-500 font-bold text-center py-2 rounded">
            Doing
          </div>
          {userCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
        </div>
      </div>
    </div>
  );
}
