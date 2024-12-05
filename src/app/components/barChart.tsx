import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card } from "./radarChart";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

const BarChartComponent = () => {
  const [cardsData, setCardsData] = useState<Card[]>([]);
  const [userData, setUserData] = useState<Record<string, number[]>>({});
  const [equipeData, setEquipeData] = useState<number[]>([0, 0]);

  axios
    .get<Card[]>(`${apiUrl}/cards`)
    .then((response) => {
      setCardsData(response.data);

      const filteredCards = response.data.filter(
        (card) =>
          card.status === "done" && card.projeto === 1 && card.sprint === 1
      );

      const usersTime = filteredCards.reduce(
        (acc, card) => {
          if (!acc[card.assigned]) {
            acc[card.assigned] = [0, 0];
          }
          acc[card.assigned][0] += card.tempo_estimado || 0;
          acc[card.assigned][1] += card.tempo || 0;

          acc.equipe[0] += card.tempo_estimado || 0;
          acc.equipe[1] += card.tempo || 0;

          return acc;
        },
        { equipe: [0, 0] } as Record<string, number[]>
      );

      setUserData(usersTime);
      setEquipeData(usersTime.equipe);
    })
    .catch((error) => {
      console.error("Erro ao buscar cards:", error);
    });

  const labels = Object.keys(userData).filter((key) => key !== "equipe");
  const estimatedData = labels.map((user) => userData[user][0]);
  const realData = labels.map((user) => userData[user][1]);

  const data = {
    labels: [...labels, "Equipe"],
    datasets: [
      {
        label: "Tempo estimado",
        data: [...estimatedData, equipeData[0]],
        backgroundColor: "rgba(30,100,255,255)",
        borderColor: "rgba(30,100,255,255)",
        borderWidth: 1,
      },
      {
        label: "Tempo real",
        data: [...realData, equipeData[1]],
        backgroundColor: "rgba(77,184,255,255)",
        borderColor: "rgba(77,184,255,255)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "1000px" }}>
      <Bar data={data}></Bar>
    </div>
  );
};

export default BarChartComponent;
