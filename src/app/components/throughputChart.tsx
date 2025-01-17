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
import { paramsGraphsProps, UserData } from "./graphsTypes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ThroughputComponent: React.FC<paramsGraphsProps> = ({ AllCards, usersData }) => {
  const [userData, setUserData] = useState<Record<string, number>>({});

  // Função para buscar o nome do usuário com base no ID
  const getUserName = (userId: string): string => {
    if (!usersData || usersData.length === 0) {
      return "Usuário não encontrado";
    }

    const user = usersData.find((user: UserData) => user.id === userId);
    return user ? user.name : "Usuário não encontrado";
  };

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

  // Labels agora usando o nome do usuário, mas mantendo o ID para os dados
  const labels = Object.keys(userData)
    .filter((key) => key !== "equipe")
    .map((userId) => getUserName(userId)); // Usando getUserName para pegar o nome
  const realData = Object.keys(userData)
    .filter((key) => key !== "equipe")
    .map((userId) => userData[userId]); // Dados mantidos com o ID original

  const data = {
    labels: [...labels], // Usando os nomes na legenda
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
