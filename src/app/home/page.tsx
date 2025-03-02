"use client";
import { useEffect, useState } from "react";
import SideNav from "../components/sideNav";
import DoingCard from "./components/DoingCards";
import DadosUsuario from "./components/userData";
import { useAuth } from "@clerk/nextjs";
import axiosInstance from "../api/axiosInstance";
import RadarComponent from "../components/radarChart";
import axios from "axios";
import { Card, UserData } from "../components/graphsTypes";
import TotalTroughputCard from "./components/statistics/totalTroughputCard";
import AverageDailyTroughputCard from "./components/statistics/averageDailyTroughputCard";
import DeltaTimePredictCard from "./components/statistics/deltaTimePredictCard";
import ProjectCards from "./components/projetosUsuario";
import Objetivos from "./components/Objetivos";

export default function Project() {
  const { userId } = useAuth();
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [userData, setUserData] = useState<UserData | undefined>();

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
    <div className="flex min-h-screen w-full bg-[#141414]">
      <SideNav />
      <div className="flex flex-col gap-11 w-full h-fit ml-16 p-4 md:p-14">
        <h1 className="text-2xl font-fustat font-semibold">{userData?.name}</h1>

        <div className="flex flex-wrap w-full justify-center md:justify-between">
          <div className="flex flex-wrap md:flex-row gap-4">
            <div className="md:w-[192px] h-[400px]">
              <DadosUsuario />
            </div>
            <div className="flex w-[120px] md:w-[192px] h-[400px]">
              <div className="flex flex-col md:w-fit">
                <TotalTroughputCard userId={userId || ""} />
                <AverageDailyTroughputCard userId={userId || ""} />
                <DeltaTimePredictCard userId={userId || ""} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#1b1b1b] rounded-md shadow-xl mt-4 p-4 overflow-hidden max-h-[400px] md:w-[400px] w-72">
            <RadarComponent
              AllCards={userCards.filter((card) => card.status === "done")}
              usersData={userData ? [userData] : []}
              showLegend={false}
            />
          </div>
          <div className="m-w-screen md:w-[350px] mt-4">
          <DoingCard />
          </div>
        </div>

        <div className="flex min-w-full h-[1px] bg-[#eee] opacity-10" />

          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-10">
            <ProjectCards userId={userId || ""} />
            </div>
            <div className="flex justify-center">
            <Objetivos />
            </div>
          </div>
      </div>
    </div>
  );
}
