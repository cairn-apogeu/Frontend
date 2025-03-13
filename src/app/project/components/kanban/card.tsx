"use client";

import { Card as CardType } from "@/app/components/graphsTypes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoHourglassOutline, IoPricetagsOutline } from "react-icons/io5";
interface CardProps {
  card: CardType;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, cardId: number) => void;
}

interface UserData {
  name: string;
  profileImageUrl: string;
  tipo_perfil: string;
}

const Card: React.FC<CardProps> = ({
  card,
  draggable = false,
  onDragStart,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [maxXp, setMaxXp] = useState<{ area: string; value: number } | null>(
    null
  );

  // Função para calcular o maior XP
  function calculateMaxXp(card: CardType) {
    const xpAreas = [
      { area: "Frontend", value: card.xp_frontend ?? 0 },
      { area: "Backend", value: card.xp_backend ?? 0 },
      { area: "Negocios", value: card.xp_negocios ?? 0 },
      { area: "Arquitetura", value: card.xp_arquitetura ?? 0 },
      { area: "Design", value: card.xp_design ?? 0 },
      { area: "Data Analytics", value: card.xp_datalytics ?? 0 },
    ];

    const validXpAreas = xpAreas.filter((xp) => xp.value > 0);

    if (validXpAreas.length === 0) {
      return { area: "Nenhum XP", value: 0 };
    }

    return validXpAreas.reduce((prev, current) =>
      current.value > prev.value ? current : prev
    );
  }

  useEffect(() => {
    setMaxXp(calculateMaxXp(card));
  }, [card]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/getUser?userId=${card.assigned}`);
        const data = await response.json();
        console.log(response);
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    if (card.assigned) {
      fetchUserData();
    }
  }, [card]);

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, card.id);
    }
  };

  return (
    <div
      className={` bg-[#2D2D2D] w-[90%] gap-3 rounded-lg shadow-md p-4 flex flex-col justify-between self-center mb-4`}

      draggable={draggable}
      onDragStart={handleDragStart}
    >
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <span className="text-white text-sm">{new Date(card.data_criacao).toLocaleDateString('pt-BR').replace(/\//g, '/').slice(0, 10)}</span>
        <div className="flex items-center space-x-2">
          {userData?.profileImageUrl && (
            <Image
              width={24}
              height={24}
              className="rounded-full"
              src={userData.profileImageUrl}
              alt={`Foto de ${userData.name}`}
            />
          )}
          <span className="text-white text-sm">
          {userData?.name ? `${userData.name.split(" ")[0]} ${userData.name.split(" ").slice(-1)}` : "Usuário"}
          </span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex w-full">
        <h2 className="text-white text-lg font-semibold">{card.titulo}</h2>
      </div>

      {/* Bottom Section */}
      <div className="flex gap-2 justify-around">
        {/* Time Badge */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-[#2D2D2D] border border-[#F1C946] text-[#F1C946] rounded-lg text-sm">
          <IoHourglassOutline />
          <span>{card.tempo_estimado || "N/A"}</span>
        </div>

        {/* XP Badge */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-[#2D2D2D] border border-[#51F146] text-[#51F146] rounded-lg text-sm">
          <span className="font-bold">XP</span>
          <span>{maxXp?.value || 0}</span>
        </div>

        {/* Tag Badge */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-[#2D2D2D] border border-[#0070BB] text-[#0070BB] rounded-lg text-sm">
          <IoPricetagsOutline />
          <span>{maxXp?.area || "Sem tipo"}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
