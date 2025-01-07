import React, { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";

interface Card {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  tempo_estimado?: number;
  tempo?: number;
  assigned?: string;
  sprint?: number;
  projeto?: number;
  dod?: string[];
  dor?: string[];
  xp_frontend?: number;
  xp_backend?: number;
  xp_negocios?: number;
  xp_arquitetura?: number;
  xp_design?: number;
  xp_datalytics?: number;
  indicacao_conteudo?: string;
  data_criacao?: string;
}

interface UserXP {
  userId: string;
  xp: number;
  github?: string;
}

interface TopUsersByXPProps {
  area?: string;
  showTotalXP?: boolean;
}

const TopUsersByXP: React.FC<TopUsersByXPProps> = ({ area, showTotalXP = false }) => {
  const [topUsersTotal, setTopUsersTotal] = useState<UserXP[]>([]);
  const [topUsersArea, setTopUsersArea] = useState<UserXP[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axiosInstance.get("/cards");
        const cards: Card[] = response.data;

        const userXPMapTotal: Record<string, number> = {};
        const userXPMapArea: Record<string, number> = {};

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
            if (!userXPMapTotal[card.assigned]) {
              userXPMapTotal[card.assigned] = 0;
            }
            userXPMapTotal[card.assigned] += totalXP;
          }

          if (area) {
            const xp = card[`xp_${area.toLowerCase()}` as keyof Card] as number | undefined;
            if (xp && card.assigned) {
              if (!userXPMapArea[card.assigned]) {
                userXPMapArea[card.assigned] = 0;
              }
              userXPMapArea[card.assigned] += xp;
            }
          }
        });

        const sortedUsersTotal = Object.entries(userXPMapTotal)
          .map(([userId, xp]) => ({ userId, xp }))
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 3);

        const sortedUsersArea = Object.entries(userXPMapArea)
          .map(([userId, xp]) => ({ userId, xp }))
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 3);

        const userDetailsPromisesTotal = sortedUsersTotal.map(async (user) => {
          const userResponse = await axiosInstance.get(`/users/${user.userId}`);
          return { ...user, github: userResponse.data.github };
        });

        const userDetailsPromisesArea = sortedUsersArea.map(async (user) => {
          const userResponse = await axiosInstance.get(`/users/${user.userId}`);
          return { ...user, github: userResponse.data.github };
        });

        const usersWithDetailsTotal = await Promise.all(userDetailsPromisesTotal);
        const usersWithDetailsArea = await Promise.all(userDetailsPromisesArea);

        setTopUsersTotal(usersWithDetailsTotal);
        setTopUsersArea(usersWithDetailsArea);
      } catch (err) {
        setError("Erro ao buscar os dados dos cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [area]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {showTotalXP ? (
        <>
          <h2>Top 3 Usuários com mais XP Total</h2>
          <ul>
            {topUsersTotal.map((user) => (
              <li key={user.userId}>
                Usuário: {user.github} - XP Total: {user.xp}
              </li>
            ))}
          </ul>
        </>
      ) : (
        area && (
          <>
            <h2>Top 3 Usuários com mais XP em {area}</h2>
            <ul>
              {topUsersArea.map((user) => (
                <li key={user.userId}>
                  Usuário: {user.github} - XP em {area}: {user.xp}
                </li>
              ))}
            </ul>
          </>
        )
      )}
    </div>
  );
};

export default TopUsersByXP;