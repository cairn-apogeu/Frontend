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
  const [userData, setUserData] = useState<Record<string, number>>({});
  const [equipeData, setEquipeData] = useState<number>(0);

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
            acc[card.assigned] = 0;
          }
          acc[card.assigned] -= card.tempo_estimado || 0;
          acc[card.assigned] += card.tempo || 0;

          acc.equipe -= card.tempo_estimado || 0;
          acc.equipe += card.tempo || 0;

          return acc;
        },
        { equipe: 0 } as Record<string, number>
      );

      setUserData(usersTime);
      setEquipeData(usersTime.equipe);
    })
    .catch((error) => {
      console.error("Erro ao buscar cards:", error);
    });

  const labels = Object.keys(userData).filter((key) => key !== "equipe");
  const realData = labels.map((user) => userData[user]);

  const data = {
    labels: [...labels, "Equipe"],
    datasets: [
      {
        label: "Delta tempo",
        data: [...realData, equipeData],
        backgroundColor: [...realData, equipeData].map((value) =>
          value < 0 ? "rgba(255,0,0,0.6)" : "rgba(30,100,255,0.6)"
        ),
        borderColor: [...realData, equipeData].map((value) =>
          value < 0 ? "rgba(255,0,0,1)" : "rgba(30,100,255,1)"
        ),
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.5,
      },
    ],
  };

  return (
    <div style={{ width: "500px" }}>
      <Bar data={data}></Bar>
    </div>
  );
};

export default BarChartComponent;
