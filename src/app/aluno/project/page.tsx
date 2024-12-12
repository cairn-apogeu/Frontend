"use client";

import { useEffect, useState } from "react";
import SideNav from "@/app/components/sideNav";
import Timeline from "./components/timeline";
import { IoChevronBack } from "react-icons/io5";
import Kanban from "./components/kanban/kanban";
import Estatisticas from "./components/estatistica";

import axiosInstance from "@/app/api/axiosInstance";

interface Card {
  id: number;
  titulo: string;
  descricao?: string;
  status: "toDo" | "doing" | "done" | "prevented";
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
}

export default function Project() {
  const [sprintSelected, setSprintSelected] = useState<number>(2);
  const [viewSelected, setViewSelected] = useState<string>("Kanban");
  const [cards, setCards] = useState<Card[]>([]);
  const [sprintCards, setSprintCards] = useState<Card[]>([])
  const [statusChanged, setStatusChanged] = useState<boolean>(true)

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await axiosInstance.get(`/cards/project/1`);
        console.log (response.data)
        setCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar cards:", error);
      }
    }
    fetchCards()

  }, [statusChanged]);

  useEffect(() => {
    setSprintCards(cards && cards.filter((card) => {
      if(sprintSelected !== 0) {
        return card.sprint === sprintSelected
      } else {
        return true
      }

    }))
  }, [sprintSelected, cards])

  return (
    <div className="flex min-h-screen min-w-screen bg-[#141414]">
      <SideNav />
      <div className="flex flex-col gap-11 w-full h-fit ml-16 p-14">
        {/* Header */}
        <div className="flex items-center gap-5">
          <IoChevronBack size={28} />
          <p className="font-fustat text-[#eee] text-2xl">Project Name</p>
        </div>

        {/* Timeline Section */}
        <div className="flex flex-col rounded-xl shadow-md items-center px-10 py-5 w-full bg-[#1B1B1B]">
          <Timeline
            totalSprints={5}
            currentSprint={4}
            sprintProgress={0.3}
            sprintSelected={sprintSelected}
            setSprintSelected={setSprintSelected}
          />

          <div className="flex mt-12 w-full justify-between">
            {["Kanban", "Descrição", "Estatísticas", "Chat AI"].map(
              (btnLabel, index) => (
                <button
                  key={index}
                  onClick={() => setViewSelected(btnLabel)}
                  className={`${
                    viewSelected === btnLabel ? "bg-[#4DB8FF]" : "bg-[#2D2D2D]"
                  } font-light rounded-md font-fustat shadow-xl text-[#eee] px-6 py-2 hover:bg-[#4DB8FF]`}
                >
                  {btnLabel}
                </button>
              )
            )}
          </div>
        </div>

        {viewSelected === "Kanban" && <Kanban statusChanged={() => setStatusChanged(!statusChanged)} cards={sprintCards} />}
        {viewSelected === "Estatísticas" && <Estatisticas cardsProject={sprintCards.filter((card) => card.status === "done")} />}
      </div>
    </div>
  );
}
