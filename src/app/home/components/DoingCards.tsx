"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { useAuth } from "@clerk/nextjs";
import Card from "@/app/aluno/project/components/kanban/card";

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
    dod?: string;
    dor?: string;
    xp_frontend?: number;
    xp_backend?: number;
    xp_negocios?: number;
    xp_arquitetura?: number;
    xp_design?: number;
    xp_datalytics?: number;
    indicacao_conteudo?: string;
  }
export default function DoingCard() {
  const { userId } = useAuth();
  const [userCards, setUserCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const response = await axiosInstance.get(`cards/assigned/${userId}`);
        setUserCards(response.data.filter(card => card.status === "doing"));
      } catch (error) {
        console.error("Erro ao buscar cards do usuário logado:", error);
      }
    }

    if (userId) {
      fetchUserCards();
    }
  }, [userId]);

  // Separar os cards com status "Doing" (exemplo)

  return (
    <div className="flex flex-col items-center w-96">
      <div className="flex bg-[#F1C946] items-center mb-8 py-2 px-8 rounded-md">
        Doing
      </div>

      <div className="flex flex-col overflow-y-auto max-h-64 min-w-full">
        {userCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
