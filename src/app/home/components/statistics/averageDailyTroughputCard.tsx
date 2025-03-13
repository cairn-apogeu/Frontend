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

        const responseProject = await axiosInstance.get(`/projetos/aluno/${userId}`);
        const projetos: Project[] = responseProject.data;

        const calcularDiasTrabalhados = (projetos: Project[]): number => {
          const diasUteis = new Set<string>();
        
          const isDiaUtil = (data: Date): boolean => {
            const diaSemana = data.getDay();
            // 0 = Domingo, 6 = Sábado
            return diaSemana !== 0 && diaSemana !== 6;
          };
        
          projetos.forEach((projeto) => {
            const dataInicio = new Date(projeto.dia_inicio);
            const dataFim = projeto.status === "Concluído" ? new Date(projeto.dia_fim) : new Date();
        
            for (
              let data = dataInicio;
              data <= dataFim;
              data.setDate(data.getDate() + 1) // Incrementa 1 dia
            ) {
              if (isDiaUtil(data)) {
                diasUteis.add(data.toISOString().split("T")[0]); // Adiciona apenas a data no formato YYYY-MM-DD
              }
            }
          });
        
          return diasUteis.size;
        };
        
        const diasTotaisTrabalhados = calcularDiasTrabalhados(projetos);
        
        console.log(`Total de dias trabalhados: ${diasTotaisTrabalhados}`);
        
        const response = await axiosInstance.get(`/cards/assigned/${userId}`);
        const cards: Card[] = response.data;

        const total = cards.reduce((sum, card) => sum + (card.tempo || 0), 0);

        const mediaTempoTrabalhado = total/diasTotaisTrabalhados;

        setTotalTime(parseFloat(mediaTempoTrabalhado.toFixed(2)));

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
    <div className="pl-8 rounded-lg p-4 text-left w-45 bg-[#1A1A1A] text-white shadow-lg font-fustat mb-2  md:mb-6">
      <h3 className="m-0 text-sm text-gray-400 font-light">
        Average Daily
      </h3>
      <p className="mt-1 text-2xl font-bold">
        {totalTime !== null ? `${totalTime} min` : 'No data'}
      </p>
    </div>
  );
};

export default AverageDailyTroughputCard;
