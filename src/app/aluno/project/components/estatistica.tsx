import React, { useEffect, useState } from "react";

import RadarComponent from "@/app/components/radarChart";
import BarChartComponent from "@/app/components/barChart";
import ThroughputComponent from "@/app/components/throughputChart";

import axios from "axios";
import { Card } from "@/app/components/graphsTypes";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

const Estatisticas = () => {
  const sprint = 1;
  const projeto = 1;
  const [cardsProject, setCardsProject] = useState<Card[]>([]);
  const [throughput, setThroughput] = useState<number>(0);
  const [numUsers, setNumUsers] = useState<number>(0);

  useEffect(() => {
    axios
      .get<Card[]>(`${apiUrl}/cards/project/${projeto}`)
      .then((response) => {
        const allCards = response.data.filter(
          (card) => card.status === "done" && card.sprint === sprint
        );
        setCardsProject(allCards);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
      });
  }, [sprint]);

  useEffect(() => {
    if (cardsProject.length > 0) {
      let mequeinha = 0;
      const users: string[] = [];

      cardsProject.forEach((card) => {
        mequeinha += card.tempo;

        if (!users.includes(card.assigned)) {
          users.push(card.assigned);
        }
      });

      setNumUsers(users.length);
      setThroughput(mequeinha);
      console.log(users);
    }
  }, [cardsProject]);

  const capacity = numUsers * 960;
  const averageThroughput = throughput / numUsers;

  return (
    <div className="bg-[#141414] font-fustat flex-col ml-10 mr-10 h-[100vh] overflow-hidden">
      <div className="flex items-stretch overflow-hidden h-[50%]">
        <div className="flex-[1.5] grid grid-rows-3 gap-[1%] items-start justify-between mt-4 ml-[1%] mr-[-1%] h-min-full overflow-hidden">
          <div className="bg-[#1b1b1b] p-3 rounded-md shadow-md h-min-ful">
            <p className="text-sm font-extralight">Capacity</p>
            <p className="text-3xl font-semibold"> {capacity}min </p>
          </div>
          <div className="bg-[#1b1b1b] p-3 rounded-md shadow-md h-min-ful">
            <p className="text-sm font-extralight">Throughput</p>
            <p className="text-3xl font-semibold"> {throughput}min</p>
          </div>
          <div className="bg-[#1b1b1b] p-3 rounded-md shadow-md h-min-ful">
            <p className="text-sm font-extralight whitespace-nowrap">
              Average ThroughPut
            </p>
            <p className="text-3xl font-semibold">{averageThroughput}min</p>
          </div>
        </div>

        <div className="flex-[8] bg-[#1b1b1b] rounded-md shadow-md m-4 w-full h-min-full p-4 overflow-hidden">
          <p className="text-sm font-extralight mb-3">Individual Throughput</p>
          <ThroughputComponent AllCards={cardsProject} />
        </div>
      </div>

      <div className="flex overflow-hidden h-[50%]">
        <div className="flex-[1.8] bg-[#1b1b1b] rounded-md shadow-md m-4 w-full h-min-full p-4 overflow-hidden">
          <p className="text-sm font-extralight mb-3">Delta Time Predict</p>
          <BarChartComponent AllCards={cardsProject} />
        </div>

        <div className="flex-[1.2] flex-row bg-[#1b1b1b] rounded-md shadow-md m-4 w-full p-4 overflow-hidden">
          <p className="text-sm font-extralight ">Skills</p>
          <RadarComponent AllCards={cardsProject} />
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;
