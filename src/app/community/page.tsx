"use client";
import React, { useEffect, useState, useCallback } from "react";
import TopUsersByXP from "./components/TopUsersByXP";
import SideNav from "@/app/components/sideNav";
import SearchBar from "./components/SearchBar";
import axiosInstance from "@/app/api/axiosInstance";
import { useAuth } from "@clerk/nextjs";
import { UserData } from "../components/graphsTypes";
import UserProfile from "./components/UserProfile";

interface UserXP {
  userId: string;
  xp: number;
  name?: string;
  profileImageUrl?: string;
  rank?: number;
}

interface Project {
  id: number;
  id_cliente: string;
  id_gestor: string;
  nome: string;
  valor: number;
  status: string;
  dia_inicio: Date;
  dia_fim: Date;
}

const FinalPage: React.FC = () => {
  const { userId } = useAuth();
  const [topUsersTotal, setTopUsersTotal] = useState<UserXP[]>([]);
  const [topUsersArea, setTopUsersArea] = useState<UserXP[]>([]);
  const [topUsersThroughput, setTopUsersThroughput] = useState<UserXP[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userTotalRank, setUserTotalRank] = useState<number | null>(null);
  const [userThroughputRank, setUserThroughputRank] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [usersResult, setUsersResult] = useState<UserData[]>([]);

  const calcularDiasTrabalhados = (projetos: Project[]): number => {
    const diasUteis = new Set<string>();
    const isDiaUtil = (data: Date): boolean => {
      const diaSemana = data.getDay();
      return diaSemana !== 0 && diaSemana !== 6;
    };

    projetos.forEach((projeto) => {
      const dataInicio = new Date(projeto.dia_inicio);
      const dataFim =
        projeto.status === "Concluído" ? new Date(projeto.dia_fim) : new Date();

      for (
        let data = dataInicio;
        data <= dataFim;
        data.setDate(data.getDate() + 1)
      ) {
        if (isDiaUtil(data)) {
          diasUteis.add(data.toISOString().split("T")[0]);
        }
      }
    });

    return diasUteis.size;
  };

  const processCards = useCallback(async (cards: any[], diasTotaisTrabalhados: number) => {
    const userXPMapTotal: Record<string, number> = {};
    const userXPMapArea: Record<string, number> = {};
    const userThroughputMap: Record<string, number> = {};

    cards.forEach((card) => {
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
        userXPMapTotal[card.assigned] =
          (userXPMapTotal[card.assigned] || 0) + totalXP;
      }

      const areas = [
        "frontend",
        "backend",
        "negocios",
        "arquitetura",
        "design",
        "datalytics",
      ];
      areas.forEach((area) => {
        const xp = card[`xp_${area}`] || 0;
        if (card.assigned) {
          userXPMapArea[card.assigned] =
            (userXPMapArea[card.assigned] || 0) + xp;
        }
      });

      const totalTime = card.tempo || 0;
      if (card.assigned) {
        userThroughputMap[card.assigned] =
          (userThroughputMap[card.assigned] || 0) + totalTime;
      }
    });

    const sortedUsersTotal = Object.entries(userXPMapTotal)
      .map(([userId, xp]) => ({ userId, xp }))
      .sort((a, b) => b.xp - a.xp);

    const sortedUsersArea = Object.entries(userXPMapArea)
      .map(([userId, xp]) => ({ userId, xp }))
      .sort((a, b) => b.xp - a.xp);

    const sortedUsersThroughput = Object.entries(userThroughputMap)
      .map(([userId, totalTime]) => ({
        userId,
        xp: totalTime / diasTotaisTrabalhados,
      }))
      .sort((a, b) => b.xp - a.xp);

    const userDetailsPromisesTotal = sortedUsersTotal.map(
      async (user, index) => {
        const userResponse = await fetch(`/api/getUser?userId=${user.userId}`);
        const userData = await userResponse.json();
        return {
          ...user,
          name: userData.name,
          profileImageUrl: userData.profileImageUrl,
          rank: index + 1,
        };
      }
    );

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

    const userDetailsPromisesThroughput = sortedUsersThroughput.map(
      async (user, index) => {
        const userResponse = await fetch(`/api/getUser?userId=${user.userId}`);
        const userData = await userResponse.json();
        return {
          ...user,
          name: userData.name,
          profileImageUrl: userData.profileImageUrl,
          rank: index + 1,
        };
      }
    );

    const usersWithDetailsTotal = await Promise.all(userDetailsPromisesTotal);
    const usersWithDetailsArea = await Promise.all(userDetailsPromisesArea);
    const usersWithDetailsThroughput = await Promise.all(
      userDetailsPromisesThroughput
    );

    // Adiciona o usuário atual se ele não estiver na lista
    if (
      (userId &&
        !usersWithDetailsTotal.some((user) => user.userId === userId)) ||
      (userId &&
        !usersWithDetailsArea.some((user) => user.userId === userId)) ||
      (userId &&
        !usersWithDetailsThroughput.some((user) => user.userId === userId))
    ) {
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
      usersWithDetailsThroughput.push({
        userId,
        xp: 0,
        name: currentUserData.name,
        profileImageUrl: currentUserData.profileImageUrl,
        rank: usersWithDetailsThroughput.length + 1,
      });
    }

    return {
      usersWithDetailsTotal,
      usersWithDetailsArea,
      usersWithDetailsThroughput,
    };
  }, [userId])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsResponse, cardsResponse] = await Promise.all([
        axiosInstance.get(`/projetos/aluno/${userId}`),
        axiosInstance.get("/cards"),
      ]);

      const projetos: Project[] = projectsResponse.data;
      const cards = cardsResponse.data;

      const diasTotaisTrabalhados = calcularDiasTrabalhados(projetos);

      const {
        usersWithDetailsTotal,
        usersWithDetailsArea,
        usersWithDetailsThroughput,
      } = await processCards(cards, diasTotaisTrabalhados);

      setTopUsersTotal(usersWithDetailsTotal.slice(0, 3));
      setTopUsersArea(usersWithDetailsArea.slice(0, 3));
      setTopUsersThroughput(usersWithDetailsThroughput.slice(0, 3));

      // Define ranks para o usuário atual
      const currentUserTotal = usersWithDetailsTotal.find(
        (user) => user.userId === userId
      );
      const currentUserArea = usersWithDetailsArea.find(
        (user) => user.userId === userId
      );
      const currentUserThroughput = usersWithDetailsThroughput.find(
        (user) => user.userId === userId
      );

      setUserTotalRank(currentUserTotal?.rank || null);
      setUserRank(currentUserArea?.rank || null);
      setUserThroughputRank(currentUserThroughput?.rank || null);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar os dados.");
    } finally {
      setLoading(false);
    }
  }, [userId, processCards]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <SideNav />
      <div className="flex flex-col items-center">
        <SearchBar
          onSearch={(username) => {
            setUserName(username);
            setUsersResult(
              users.filter((user) => user.name.includes(username))
            );
          }}
          onFetch={(users) => setUsers(users)}
        />

        {userName === "" ? (
          <>
            <TopUsersByXP
              userId={userId || ""}
              area="Throughput Diário"
              topUsersTotal={topUsersThroughput}
              topUsersArea={topUsersThroughput}
              userRank={userThroughputRank}
              userTotalRank={userThroughputRank}
            />
            <TopUsersByXP
              userId={userId || ""}
              area="frontend"
              topUsersTotal={topUsersTotal}
              topUsersArea={topUsersArea}
              userRank={userRank}
              userTotalRank={userTotalRank}
            />
            <TopUsersByXP
              userId={userId || ""}
              area="backend"
              topUsersTotal={topUsersTotal}
              topUsersArea={topUsersArea}
              userRank={userRank}
              userTotalRank={userTotalRank}
            />
            <TopUsersByXP
              userId={userId || ""}
              area="arquitetura"
              topUsersTotal={topUsersTotal}
              topUsersArea={topUsersArea}
              userRank={userRank}
              userTotalRank={userTotalRank}
            />
            <TopUsersByXP
              userId={userId || ""}
              area="design"
              topUsersTotal={topUsersTotal}
              topUsersArea={topUsersArea}
              userRank={userRank}
              userTotalRank={userTotalRank}
            />
            <TopUsersByXP
              userId={userId || ""}
              area="negocios"
              topUsersTotal={topUsersTotal}
              topUsersArea={topUsersArea}
              userRank={userRank}
              userTotalRank={userTotalRank}
            />
            <TopUsersByXP
              userId={userId || ""}
              area="datalytics"
              topUsersTotal={topUsersTotal}
              topUsersArea={topUsersArea}
              userRank={userRank}
              userTotalRank={userTotalRank}
            />
          </>
        ) : (
          <div className="flex flex-row gap-4 flex-wrap">
            {usersResult.map((user) => (
              <UserProfile key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalPage;
