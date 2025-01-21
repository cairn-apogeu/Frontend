"use client";
import { useEffect, useState } from "react";
import SideNav from "../components/sideNav";
import DoingCard from "./components/DoingCards";
import DadosUsuario from "./components/userData";
import { useAuth } from "@clerk/nextjs";
import axiosInstance from "../api/axiosInstance";
import RadarComponent from "../components/radarChart";
import axios from "axios";
import { UserData } from "../components/graphsTypes";

interface CardData {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  tempo_estimado?: number;
  tempo?: number;
  assigned?: string;
  sprint?: number;
  projeto?: number;
  dod?: string;
  dor?: string;
  xp_frontend?: number;
  xp_backend?: number;
  xp_negocios?: number;
  xp_arquitetura?: number;
  xp_design?: number;
  xp_datalytics?: number;
  indicacao_conteudo?: string;
}

export default function Project() {
  const { userId } = useAuth();
  const [userCards, setUserCards] = useState<CardData[]>([]);
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const response = await axiosInstance.get(`cards/assigned/${userId}`);
        const userResponse = await axios.get(`/api/getUser/?userId=${userId}`);
        setUserData(userResponse.data);
        setUserCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar cards do usuário logado:", error);
      }
    }

    if (userId) {
      fetchUserCards();
    }
  }, [userId]);
  return (
    <div className="flex min-h-screen min-w-screen bg-[#141414]">
      <SideNav />
      <div className="flex flex-col gap-11 w-full h-fit ml-16 p-14">
        <div className="flex flex-row w-full justify-between">
          <DadosUsuario />
          <div className="flex items-center justify-center bg-[#1b1b1b] rounded-md shadow-xl m-4 p-4 overflow-hidden">
            <RadarComponent
              AllCards={userCards.filter((card) => card.status === "done")}
              usersData={[userData]}
              showLegend={false}
            />
          </div>
          <DoingCard />
        </div>
      </div>
    </div>
  );
}
