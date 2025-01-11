import React, { useEffect, useState } from "react";
import RadarComponent from "@/app/components/radarChart";
import { UserData, Card } from "./graphsTypes";
import axiosInstance from "@/app/api/axiosInstance";

interface RadarChartSectionProps {
  userId: string;
}

const RadarChartSection: React.FC<RadarChartSectionProps> = ({ userId }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cardsProject, setCardsProject] = useState<Card[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentUserId = userId;

        if (!userId) {
          const currentUserResponse = await axiosInstance.get(`/users/me`);
          setUserData(currentUserResponse.data);
          currentUserId = currentUserResponse.data.id;
        } else {
          const userResponse = await axiosInstance.get(`/users/${userId}`);
          setUserData(userResponse.data);
        }

        const cardsResponse = await axiosInstance.get(`/cards/assigned/${currentUserId}`);
        setCardsProject(cardsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute -top-60 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center bg-[#1b1b1b] shadow-md h-60 w-80 p-1">
          <div className="flex justify-end w-full">
            <RadarComponent usersData={userData ? [userData] : []} AllCards={cardsProject} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChartSection;