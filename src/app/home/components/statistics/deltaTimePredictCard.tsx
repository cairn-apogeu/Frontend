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
    <div
    style={{
      paddingLeft: '30px',
      marginLeft: '30px',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'left',
      width: '180px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: "'Arial', sans-serif",
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    }}
  >
    <h3
      style={{
        margin: '0',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#ccc',
      }}
    >
      Delta Time Predict
    </h3>
    <p
      style={{
        margin: '4px 0 0',
        fontSize: '28px',
        fontWeight: 'bold',
      }}
    >
      {totalTime !== null ? `${totalTime} min` : 'No data'}
    </p>
  </div>
  );
};

export default DeltaTimePredictCard;
