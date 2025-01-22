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
import { paramsGraphsProps, UserData } from "./graphsTypes";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

const RadarComponent: React.FC<paramsGraphsProps> = ({ AllCards, usersData, showLegend }) => {
  const [userData, setUserData] = useState<Record<string, number[]>>({});

  // Função para buscar o nome do usuário com base no ID
  const getUserName = (userId: string): string => {
    // Verificar se usersData está disponível e se não está vazio
    if (!usersData || usersData.length === 0) {
      return "Usuário não encontrado";
    }

    const user = usersData.find((user: UserData) => user.id === userId);
    return user ? user.name : "Usuário não encontrado"; // Retorna o nome ou uma mensagem padrão
  };

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

  // Mapeia os IDs dos usuários para os nomes
  const datasets = Object.entries(userData).map(([userId, xpData], index) => ({
    label: getUserName(userId), // Usa o nome do usuário ao invés do ID
    data: xpData,
    fill: true,
    backgroundColor: `rgba(${index * 50}, 100, 200, 0.5)`, // Valores RGBA corrigidos
    borderColor: `rgba(${index * 50}, 100, 200, 1)`,
    pointRadius: 3,
    tension: 0,
  }));

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
        display: showLegend
      },
    },
  };

  return (
    <div className="h-[90%]">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarComponent;
