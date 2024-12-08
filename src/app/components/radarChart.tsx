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
import { ChartOptions } from "chart.js";
import { Radar } from "react-chartjs-2";
import axios from "axios";
import { Card, paramsGraphsProps } from "./graphsTypes";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

const RadarComponent: React.FC<paramsGraphsProps> = ({ AllCards }) => {
  const [userData, setUserData] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const conglomeradoData = AllCards.reduce((acc, card) => {
      if (!acc[card.assigned]) {
        acc[card.assigned] = [0, 0, 0, 0, 0, 0];
      }

      acc[card.assigned][0] += card.xp_arquitetura || 0;
      acc[card.assigned][1] += card.xp_backend || 0;
      acc[card.assigned][2] += card.xp_datalytics || 0;
      acc[card.assigned][3] += card.xp_design || 0;
      acc[card.assigned][4] += card.xp_frontend || 0;
      acc[card.assigned][5] += card.xp_negocios || 0;

      return acc;
    }, {} as Record<string, number[]>);

    setUserData(conglomeradoData);
  }, [AllCards]);

  const datasets = [
    ...Object.entries(userData).map(([user, xpData], index) => ({
      label: user,
      data: xpData,
      fill: true,
      backgroundColor: `rgba(${index * 100}, 60, 300, 0.5)`,
      borderColor: `rgba(${index * 100}, 60, 300, 0.5)`,
      pointRadius: 0,
      tension: 0,
    })),
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

  const options: ChartOptions<"radar"> = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      r: {
        angleLines: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        pointLabels: {
          color: "gray",
          font: {
            size: 10,
          },
        },
        ticks: {
          backdropColor: "rgba(30, 30, 30, 0.8)",
          color: "gray",
          font: {
            size: 10,
          },
          showLabelBackdrop: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 5,
        },
      },
    },
  };

  return (
    <div className="h-[90%]">
      <Radar data={data} options={options}></Radar>
    </div>
  );
};

export default RadarComponent;
