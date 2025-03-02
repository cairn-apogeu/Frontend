import React, { useEffect, useState } from 'react';
import axiosInstance from "@/app/api/axiosInstance";

interface Card {
    id: number;
    titulo: string;
    descricao?: string;
    status: "toDo" | "doing" | "done" | "prevented";
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
  }

interface DeltaTimePredictCard {
  userId: string;
}

const DeltaTimePredictCard: React.FC<DeltaTimePredictCard> = ({ userId }) => {
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(`/cards/assigned/${userId}`);
        const cards: Card[] = response.data;

        const total = cards.reduce((sum, card) => sum + (card?.tempo || 0), 0);
        const totalPredicted = cards.reduce((sum, card) => sum + (card?.tempo_estimado || 0), 0);
        const deltaTime = total - totalPredicted;

        setTotalTime(deltaTime);
      } catch (err) {
        console.log(err);
        setError('Erro ao carregar os dados dos cartões.');
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [userId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pl-8 rounded-lg p-4 text-left w-45 bg-[#1A1A1A] text-white font-sans shadow-lg mb-2 md:mb-6">
      <h3 className="m-0 text-sm font-normal text-gray-400">
        Delta Time Predict
      </h3>
      <p className="mt-1 text-2xl font-bold">
        {totalTime !== null ? `${totalTime} min` : 'No data'}
      </p>
    </div>
  );
};

export default DeltaTimePredictCard;
