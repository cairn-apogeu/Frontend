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

interface Project {
  id: number; 
  id_cliente: string; 
  id_gestor: string;
  nome: string; 
  valor: number; 
  status: string; 
  dia_inicio: Date; 
  dia_fim: Date; 

}


interface AverageDailyTroughputCard {
  userId: string;
}

const AverageDailyTroughputCard: React.FC<AverageDailyTroughputCard> = ({ userId }) => {
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequiredData = async () => {
      try {
        setLoading(true);
        setError(null);

        // const response = await axiosInstance.get(`/cards/assigned/${userId}`);
        // const projetos: Project[] = response.data;

        const projetos: Project[] = [
          {
            id: 1,
            id_cliente: "clerk_12345",
            id_gestor: "clerk_67890",
            nome: "Desenvolvimento de Aplicativo Mobile",
            valor: 15000,
            status: "Concluído",
            dia_inicio: new Date("2023-01-01"),
            dia_fim: new Date("2023-01-06"),
            
          },
          {
            id: 2,
            id_cliente: "clerk_54321",
            id_gestor: "clerk_98765",
            nome: "Plataforma de E-commerce",
            valor: 30000,
            status: "Em Andamento",
            dia_inicio: new Date("2025-01-01"),
            dia_fim: new Date("2025-01-30"),
           
          },
          {
            id: 3,
            id_cliente: "clerk_11111",
            id_gestor: "clerk_22222",
            nome: "Sistema de Gerenciamento Escolar",
            valor: 20000,
            status: "Concluído",
            dia_inicio: new Date("2023-01-01"),
            dia_fim: new Date("2023-01-02"),
            
          },
        ];

        const calcularDiasTrabalhados = (projetos: Project[]): number => {
          return projetos.reduce((totalDias, projeto) => {
            const dataInicio = new Date(projeto.dia_inicio);
            const dataFim = projeto.status === "Concluído" ? new Date(projeto.dia_fim) : new Date();
            const diasTrabalhados = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
            return totalDias + diasTrabalhados;
          }, 0);
        };
        
        const diasTotaisTrabalhados = calcularDiasTrabalhados(projetos);
        
        console.log(`Total de dias trabalhados: ${diasTotaisTrabalhados}`);
        
        const response = await axiosInstance.get(`/cards/assigned/${userId}`);
        const cards: Card[] = response.data;

        const total = cards.reduce((sum, card) => sum + card.tempo, 0);

        const mediaTempoTrabalhado = total/diasTotaisTrabalhados;

        setTotalTime(mediaTempoTrabalhado.toFixed(2));
      } catch (err) {
        console.log(err);
        setError('Erro ao carregar os dados dos cartões.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequiredData();
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
      Average Daily Troughput
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

export default AverageDailyTroughputCard;
