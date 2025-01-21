import React, { useEffect, useState } from 'react';
import axiosInstance from "@/app/api/axiosInstance";

interface Card {
    id: number;
    titulo: string;
    descricao?: string;
    status: "toDo" | "doing" | "done" | "prevented";
    tempo_estimado?: number;
    tempo: number;
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

interface TotalTroughputCard {
  userId: string;
}

const TotalTroughputCard: React.FC<TotalTroughputCard> = ({ userId }) => {
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

        const total = cards.filter(card => card.status === "done").reduce((sum, card) => sum + card.tempo, 0);
        console.log(cards);
        
        setTotalTime(total);
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
      Total Throughput
    </h3>
    <p
      style={{
        margin: '8px 0 0',
        fontSize: '28px',
        fontWeight: 'bold',
      }}
    >
      {totalTime !== null ? `${totalTime} min` : 'No data'}
    </p>
  </div>
  
  );
};

export default TotalTroughputCard;
