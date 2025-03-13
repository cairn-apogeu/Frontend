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
import { paramsGraphsProps, UserData } from "./graphsTypes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartComponent: React.FC<paramsGraphsProps> = ({ AllCards, usersData }) => {
  const [userData, setUserData] = useState<Record<string, number>>({});

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
    const getUserName = (userId: string): string => {
      // Verificar se usersData está disponível e se não está vazio
      if (!usersData || usersData.length === 0) {
        return "Usuário não encontrado";
      }
  
      const user = usersData.find((user: UserData) => user.id === userId);
      return user ? user.name : "Usuário não encontrado"; // Retorna o nome ou uma mensagem padrão
    };
    console.log("UserData: ", usersData);

    const usersTime = AllCards.reduce(
      (acc, card) => {
        
        if (!acc[getUserName(card.assigned)]) {
          acc[getUserName(card.assigned)] = 0;
        }
        acc[getUserName(card.assigned)] -= card.tempo_estimado || 0;
        acc[getUserName(card.assigned)] += card.tempo || 0;

        return acc;
      },
      { equipe: 0 } as Record<string, number>
    );
    
    
    setUserData(usersTime);

  }, [AllCards, usersData]); // Adicionando usersData na lista de dependências


  useEffect(() => console.log(userData), [userData])
  // Mapeia os IDs dos usuários para os nomes
  // const labels = Object.keys(userData).map((userId) => getUserName(userId));
  // const realData = labels.map((user) => userData[user]);

  const data = {
    datasets: [
      {
        label: "Delta tempo",
        data: userData,
        backgroundColor: usersData.map((value) =>
          userData[getUserName(value.id)] > 0 ? "rgba(255,0,0,0.6)" : "rgba(30,100,255,0.6)"
        ),
        borderColor: usersData.map((value) =>{
          console.log(userData[getUserName(value.id)], userData[getUserName(value.id)] < 0)
          
         return userData[getUserName(value.id)] > 0 ? "rgba(255,0,0,0.6)" : "rgba(30,100,255,0.6)"
        }
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
        display: true, // Exibindo a legenda
      },
    },
  };

  return (
    <div className="h-autp">
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default BarChartComponent;
