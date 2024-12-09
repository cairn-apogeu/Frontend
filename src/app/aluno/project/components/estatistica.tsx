import React, { useEffect, useState } from "react";

import RadarComponent from "@/app/components/radarChart";
import BarChartComponent from "@/app/components/barChart";
import ThroughputComponent from "@/app/components/throughputChart";

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

interface StatisticProps {
  cardsProject: Card[];
}

const Estatisticas: React.FC<StatisticProps> = ({ cardsProject }) => {
  const [throughput, setThroughput] = useState<number>(0);
  const [numUsers, setNumUsers] = useState<number>(0);
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const usersData: any[] = [];

        for (const card of cardsProject) {
          if (card.assigned && !usersData.some(user => user.id === card.assigned)) {
            const response = await fetch(`/api/getUser?userId=${card.assigned}`);
            const data = await response.json();
            usersData.push(data);
          }
        }

        setUserData(usersData);
        
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    if (cardsProject.length > 0) {
      fetchUserData();
    }
  }, [cardsProject]); // Remover a dependência de 'usersData' aqui

  useEffect(() => {
    if (cardsProject.length > 0) {
      let mequeinha = 0;
      const users: string[] = [];

      cardsProject.forEach((card) => {
        mequeinha += card.tempo || 0;

        if (card.assigned && !users.includes(card.assigned)) {
          users.push(card.assigned);
        }
      });

      setNumUsers(users.length);
      setThroughput(mequeinha);
      console.log(users);
    }
  }, [cardsProject]); // Dependência em cardsProject



  const capacity = numUsers * 960;
  const averageThroughput = throughput / numUsers;

  return (
    <div className="bg-[#141414] font-fustat flex-col ml-10 mr-10 h-[100vh] overflow-hidden">
      <div className="flex items-stretch overflow-hidden h-[50%]">
        <div className="flex-[1.5] grid grid-rows-3 gap-[1%] items-start justify-between mt-4 ml-[1%] mr-[-1%] h-min-full overflow-hidden">
          <div className="bg-[#1b1b1b] p-3 rounded-md shadow-md h-min-ful">
            <p className="text-sm font-extralight">Capacity</p>
            <p className="text-3xl font-semibold"> {capacity}min </p>
          </div>
          <div className="bg-[#1b1b1b] p-3 rounded-md shadow-md h-min-ful">
            <p className="text-sm font-extralight">Throughput</p>
            <p className="text-3xl font-semibold"> {throughput}min</p>
          </div>
          <div className="bg-[#1b1b1b] p-3 rounded-md shadow-md h-min-ful">
            <p className="text-sm font-extralight whitespace-nowrap">
              Average ThroughPut
            </p>
            <p className="text-3xl font-semibold">{averageThroughput}min</p>
          </div>
        </div>

        <div className="flex-[8] bg-[#1b1b1b] rounded-md shadow-md m-4 w-full h-min-full p-4 overflow-hidden">
          <p className="text-sm font-extralight mb-3">Individual Throughput</p>
          <ThroughputComponent usersData={userData} AllCards={cardsProject} />
        </div>
      </div>

      <div className="flex overflow-hidden h-[50%]">
        <div className="flex-[1.8] bg-[#1b1b1b] rounded-md shadow-md m-4 w-full h-min-full p-4 overflow-hidden">
          <p className="text-sm font-extralight mb-3">Delta Time Predict</p>
          <BarChartComponent usersData={userData} AllCards={cardsProject} />
        </div>

        <div className="flex-[1.2] flex-row bg-[#1b1b1b] rounded-md shadow-md m-4 w-full p-4 overflow-hidden">
          <p className="text-sm font-extralight ">Skills</p>
          <RadarComponent usersData={userData} AllCards={cardsProject} />
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;
