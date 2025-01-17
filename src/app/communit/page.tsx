"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TopUsersByXP from "./components/TopUsersByXP";
import SideNav from "@/app/components/sideNav";
import SearchBar from "./components/SearchBar";
import axiosInstance from "@/app/api/axiosInstance";
import { useAuth } from "@clerk/nextjs";

interface UserXP {
  userId: string;
  xp: number;
  name?: string;
  profileImageUrl?: string;
  rank?: number;
}

const FinalPage: React.FC = () => {
  const { userId } = useAuth();
  const [topUsersTotal, setTopUsersTotal] = useState<UserXP[]>([]);
  const [topUsersArea, setTopUsersArea] = useState<UserXP[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userTotalRank, setUserTotalRank] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/cards");
        const cards = response.data;

        const userXPMapTotal: Record<string, number> = {};
        const userXPMapArea: Record<string, number> = {};

        cards.forEach((card: any) => {
          const xpAreas = [
            card.xp_frontend,
            card.xp_backend,
            card.xp_negocios,
            card.xp_arquitetura,
            card.xp_design,
            card.xp_datalytics,
          ];

          const totalXP = xpAreas.reduce((acc: number, xp) => acc + (xp || 0), 0);

          if (totalXP && card.assigned) {
            if (!userXPMapTotal[card.assigned]) {
              userXPMapTotal[card.assigned] = 0;
            }
            userXPMapTotal[card.assigned] += totalXP;
          }

          const areas = ["frontend", "backend", "negocios", "arquitetura", "design", "datalytics"];
          areas.forEach((area) => {
            const xp = card[`xp_${area.toLowerCase()}` as keyof typeof card] as number | undefined;
            if (xp && card.assigned) {
              if (!userXPMapArea[card.assigned]) {
                userXPMapArea[card.assigned] = 0;
              }
              userXPMapArea[card.assigned] += xp;
            }
          });
        });

        const sortedUsersTotal = Object.entries(userXPMapTotal)
          .map(([userId, xp]) => ({ userId, xp }))
          .sort((a, b) => b.xp - a.xp);

        const sortedUsersArea = Object.entries(userXPMapArea)
          .map(([userId, xp]) => ({ userId, xp }))
          .sort((a, b) => b.xp - a.xp);

        const userDetailsPromisesTotal = sortedUsersTotal.map(async (user, index) => {
          const userResponse = await fetch(`/api/getUser?userId=${user.userId}`);
          const userData = await userResponse.json();
          return {
            ...user,
            name: userData.name,
            profileImageUrl: userData.profileImageUrl,
            rank: index + 1,
          };
        });

        const userDetailsPromisesArea = sortedUsersArea.map(async (user, index) => {
          const userResponse = await fetch(`/api/getUser?userId=${user.userId}`);
          const userData = await userResponse.json();
          return {
            ...user,
            name: userData.name,
            profileImageUrl: userData.profileImageUrl,
            rank: index + 1,
          };
        });

        const usersWithDetailsTotal = await Promise.all(userDetailsPromisesTotal);
        const usersWithDetailsArea = await Promise.all(userDetailsPromisesArea);

        // Adiciona o usuário atual se ele não estiver na lista
        if (userId && !usersWithDetailsTotal.some(user => user.userId === userId) || userId && !usersWithDetailsArea.some(user => user.userId === userId)) {
          const currentUserResponse = await fetch(`/api/getUser?userId=${userId}`);
          const currentUserData = await currentUserResponse.json();
          usersWithDetailsTotal.push({
            userId,
            xp: 0,
            name: currentUserData.name,
            profileImageUrl: currentUserData.profileImageUrl,
            rank: usersWithDetailsTotal.length + 1,
          });
          usersWithDetailsArea.push({
            userId,
            xp: 0,
            name: currentUserData.name,
            profileImageUrl: currentUserData.profileImageUrl,
            rank: usersWithDetailsArea.length + 1,
          });
        }

        setTopUsersTotal(usersWithDetailsTotal.slice(0, 3));
        setTopUsersArea(usersWithDetailsArea.slice(0, 3));

        const currentUserArea = usersWithDetailsArea.find((user) => user.userId === userId);
        const currentUserTotal = usersWithDetailsTotal.find((user) => user.userId === userId);

        setUserRank(currentUserArea?.rank || null);
        setUserTotalRank(currentUserTotal?.rank || null);
      } catch (err) {
        setError("Erro ao buscar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <SideNav />
      <div className="flex flex-col items-center">
        <SearchBar onSearch={(username) => console.log(username)} />
        <TopUsersByXP
          showTotalXP={true}
          topUsersTotal={topUsersTotal}
          topUsersArea={topUsersArea}
          userRank={userRank}
          userTotalRank={userTotalRank}
        />
        <TopUsersByXP
          area="backend"
          topUsersTotal={topUsersTotal}
          topUsersArea={topUsersArea}
          userRank={userRank}
          userTotalRank={userTotalRank}
        />
        <TopUsersByXP
          area="frontend"
          topUsersTotal={topUsersTotal}
          topUsersArea={topUsersArea}
          userRank={userRank}
          userTotalRank={userTotalRank}
        />
        <TopUsersByXP
          area="frontend"
          topUsersTotal={topUsersTotal}
          topUsersArea={topUsersArea}
          userRank={userRank}
          userTotalRank={userTotalRank}
        />
        <TopUsersByXP
          area="frontend"
          topUsersTotal={topUsersTotal}
          topUsersArea={topUsersArea}
          userRank={userRank}
          userTotalRank={userTotalRank}
        />
        <TopUsersByXP
          area="frontend"
          topUsersTotal={topUsersTotal}
          topUsersArea={topUsersArea}
          userRank={userRank}
          userTotalRank={userTotalRank}
        />
      </div>
    </div>
  );
};

export default FinalPage;