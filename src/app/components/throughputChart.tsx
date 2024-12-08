import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card, paramsGraphsProps } from "./graphsTypes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

const ThroughputComponent: React.FC<paramsGraphsProps> = ({ AllCards }) => {
  const [userData, setUserData] = useState<Record<string, number>>({});

  useEffect(() => {
    const usersTime = AllCards.reduce<Record<string, number>>((acc, card) => {
      if (!acc[card.assigned]) {
        acc[card.assigned] = 0;
      }
      acc[card.assigned] += card.tempo || 0;
      return acc;
    }, {});

    setUserData(usersTime);
  }, [AllCards]);

  const labels = Object.keys(userData).filter((key) => key !== "equipe");
  const realData = labels.map((user) => userData[user]);

  const data = {
    labels: [...labels],
    datasets: [
      {
        label: "Individual ThroughPut",
        data: [...realData],
        backgroundColor: "rgba(30,100,255,0.6)",
        borderColor: "rgba(30,100,255,1)",
        borderWidth: 1,
        barPercentage: 0.5,
        categoryPercentage: 0.9,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="h-[80%]">
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default ThroughputComponent;
