import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

interface Card {
  id: number;
  titulo: string;
  status: string;
  tempo_estimado: number;
  tempo: number;
  assigned: string;
  sprint: number;
  projeto: number;
  dod: string[];
  dor: string[];
  xp_frontend: number;
  xp_backend: number;
  xp_negocios: number;
  xp_arquitetura: number;
  xp_design: number;
  xp_datalytics: number;
  indicacao_conteudo: string;
}

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

const RadarComponent = () => {
  const [cardsData, setCardsData] = useState<Card[]>([]);
  const [userData, setUserData] = useState<Record<string, number[]>>({});
  const xpEquipe = [0, 0, 0, 0, 0, 0];
  console.log(cardsData)
  useEffect(() => {
    axios
      .get<Card[]>(`${apiUrl}/cards`)
      .then((response) => {
        setCardsData(response.data);
        const filteredCards = response.data.filter(
          (card) => card.status === "done" && card.projeto === 1
        );

        const conglomeradoData = filteredCards.reduce((acc, card) => {
          if (!acc[card.assigned]) {
            acc[card.assigned] = [0, 0, 0, 0, 0, 0];
          }

          acc[card.assigned][0] += card.xp_arquitetura || 0;
          acc[card.assigned][1] += card.xp_backend || 0;
          acc[card.assigned][2] += card.xp_datalytics || 0;
          acc[card.assigned][3] += card.xp_design || 0;
          acc[card.assigned][4] += card.xp_frontend || 0;
          acc[card.assigned][5] += card.xp_negocios || 0;

          xpEquipe[0] += card.xp_arquitetura || 0;
          xpEquipe[1] += card.xp_backend || 0;
          xpEquipe[2] += card.xp_datalytics || 0;
          xpEquipe[3] += card.xp_design || 0;
          xpEquipe[4] += card.xp_frontend || 0;
          xpEquipe[5] += card.xp_negocios || 0;

          return acc;
        }, {} as Record<string, number[]>);

        setCardsData(filteredCards);
        setUserData(conglomeradoData);
      })
      .catch((error) => {
        console.error("Erro ao buscar Cards:", error);
      });
  }, [userData, cardsData, xpEquipe]);

  const datasets = [
    ...Object.entries(userData).map(([user, xpData], index) => ({
      label: user,
      data: xpData,
      fill: true,
      backgroundColor: `rgba(${index * 100}, 60, 300, 0.5)`,
      borderColor: `rgba(${index * 100}, 60, 300, 1)`,
      pointRadius: 4,
      tension: 0,
    })),
    {
      label: "Equipe",
      data: xpEquipe,
      fill: true,
      backgroundColor: `rgba(236, 240, 38, 0.5)`,
      borderColor: `rgba(236, 240, 38, 1)`,
      pointRadius: 4,
      tension: 0,
    },
  ];

  const data = {
    labels: [
      "Arquitetura",
      "Backend",
      "Data Analytics",
      "Design",
      "Frontend",
      "Negócios",
    ],
    datasets,
  };

  return (
    <div style={{ width: "500px" }}>
      <Radar data={data}></Radar>
    </div>
  );
};

export default RadarComponent;
