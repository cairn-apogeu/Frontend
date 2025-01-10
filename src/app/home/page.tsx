"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
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
  data_criacao: string;
}

export default function UserCardPage() {
  const { userId } = useAuth();
  const [userCards, setUserCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const response = await axiosInstance.get(`/cards/user/${userId}`);
        setUserCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar cards do usuário logado:", error);
      }
    }

    if (userId) {
      fetchUserCards();
    }
  }, [userId]);

  // Separar os cards com status "Doing" (exemplo)
  const doingCards = userCards.filter((card) => card.status === "Doing");

  return (
    <div className="flex min-h-screen min-w-screen bg-[#141414] relative">
      <SideNav />
      <div className="flex flex-col w-full p-8">
        
      <div className="absolute top-28 right-16 w-[300px] space-y-4">
          <div className="bg-yellow-500 font-bold text-center  py-2 ml-24 rounded w-[100px]">
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
