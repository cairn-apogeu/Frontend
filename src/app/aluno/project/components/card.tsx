import { useEffect, useState } from "react";
import { IoHourglassOutline, IoPricetagsOutline } from "react-icons/io5";
import axios from "axios";

interface CardData {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  tempo_estimado?: number;
  tempo?: number;
  assigned?: string;
  sprint?: number;
  dod: string[];
  dor: string[];
  xp_frontend?: number;
  xp_backend?: number;
  xp_negocios?: number;
  xp_arquitetura?: number;
  xp_design?: number;
  xp_datalytics?: number;
  tipo: string;
  indicacao_conteudo?: string;
}

interface CardProps {
  idAluno: string;
  idCard: number;
  onDragStart: (e: React.DragEvent) => void;
}

interface UserData {
  name: string;
  profileImageUrl: string;
}

const Card: React.FC<CardProps> = ({ idAluno, idCard, onDragStart }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [maxXp, setMaxXp] = useState<{ area: string; value: number } | null>(null);

  const calculateMaxXp = (card: CardData) => {
    const xpAreas = [
      { area: "Frontend", value: card.xp_frontend ?? 0 },
      { area: "Backend", value: card.xp_backend ?? 0 },
      { area: "Negocios", value: card.xp_negocios ?? 0 },
      { area: "Arquitetura", value: card.xp_arquitetura ?? 0 },
      { area: "Design", value: card.xp_design ?? 0 },
      { area: "Data Analytics", value: card.xp_datalytics ?? 0 },
    ];

    const validXpAreas = xpAreas.filter((xp) => xp.value > 0);
    return validXpAreas.length
      ? validXpAreas.reduce((prev, current) => (current.value > prev.value ? current : prev))
      : { area: "Nenhum XP", value: 0 };
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/getUser?userId=${idAluno}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    fetchUserData();
  }, [idAluno]);

  useEffect(() => {
    async function fetchCardData() {
      try {
        const response = await axios.get<CardData>(`http://localhost:3333/cards/${idCard}`);
        const card = response.data;

        setCardData(card);
        setMaxXp(calculateMaxXp(card));
      } catch (error) {
        console.error("Erro ao buscar dados do card:", error);
      }
    }

    fetchCardData();
  }, [idCard]);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="w-[360px] h-[152px] bg-[#2D2D2D] rounded-lg shadow-md p-4 flex flex-col justify-between self-center mb-4"
    >
      <div className="flex justify-between items-center">
        <span className="text-white text-sm">16/11/2024</span>
        <div className="flex items-center space-x-2">
          <img
            className="w-8 h-8 rounded-full"
            src={userData?.profileImageUrl}
            alt={`Foto de ${userData?.name}`}
          />
          <span className="text-white text-sm">{userData?.name}</span>
        </div>
      </div>
      <div>
        <h2 className="text-white text-lg font-semibold">{cardData?.titulo}</h2>
      </div>
      <div className="flex justify-around">
        <div className="flex items-center space-x-1 px-2 py-1 bg-[#2D2D2D] border border-[#F1C946] text-[#F1C946] rounded-lg text-sm">
          <IoHourglassOutline />
          <span>{cardData?.tempo_estimado || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-[#2D2D2D] border border-[#51F146] text-[#51F146] rounded-lg text-sm">
          <span className="font-bold">XP</span>
          <span>{maxXp?.value || 0}</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-[#2D2D2D] border border-[#0070BB] text-[#0070BB] rounded-lg text-sm">
          <IoPricetagsOutline />
          <span>{maxXp?.area || "Sem tipo"}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
