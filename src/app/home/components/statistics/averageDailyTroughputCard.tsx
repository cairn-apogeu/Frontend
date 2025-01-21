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
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    }}
    className='font-fustat'
  >
    <h3
      style={{
        margin: '0',
        fontSize: '14px',
        color: '#ccc',
      }}
      className='font-light'
    >
      Average Daily
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

export default AverageDailyTroughputCard;
