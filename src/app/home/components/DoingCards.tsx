"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { useAuth } from "@clerk/nextjs";
import Card from "@/app/aluno/project/components/kanban/card";
import { Card as CardType } from "@/app/components/graphsTypes";


export default function DoingCard() {
  const { userId } = useAuth();
  const [userCards, setUserCards] = useState<CardType[]>([]);

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const response = await axiosInstance.get(`cards/assigned/${userId}`);
        setUserCards(response.data.filter((card: any) => card.status === "doing"));
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
    <div className="flex flex-col items-center max-w-full">
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
