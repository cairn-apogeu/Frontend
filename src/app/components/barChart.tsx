import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card, paramsGraphsProps } from "./graphsTypes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

const BarChartComponent: React.FC<paramsGraphsProps> = ({ AllCards }) => {
  const [userData, setUserData] = useState<Record<string, number>>({});

  useEffect(() => {
    const usersTime = AllCards.reduce(
      (acc, card) => {
        if (!acc[card.assigned]) {
          acc[card.assigned] = 0;
        }
        acc[card.assigned] -= card.tempo_estimado || 0;
        acc[card.assigned] += card.tempo || 0;

        return acc;
      },
      { equipe: 0 } as Record<string, number>
    );

    setUserData(usersTime);
  }, [AllCards]);

  const labels = Object.keys(userData);
  const realData = labels.map((user) => userData[user]);

  const data = {
    labels: [...labels],
    datasets: [
      {
        label: "Delta tempo",
        data: [...realData],
        backgroundColor: [...realData].map((value) =>
          value < 0 ? "rgba(255,0,0,0.6)" : "rgba(30,100,255,0.6)"
        ),
        borderColor: [...realData].map((value) =>
          value < 0 ? "rgba(255,0,0,1)" : "rgba(30,100,255,1)"
        ),
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
    },
  };

  return (
    <div className="h-[80%]">
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default BarChartComponent;
