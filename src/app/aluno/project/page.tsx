"use client";

import { useEffect, useState } from "react";
import SideNav from "@/app/components/sideNav";
import Timeline from "./components/timeline";
import { IoChevronBack } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
import Card from "./components/card";
import axios from "axios";

interface Card {
  id: number;
  titulo: string;
  descricao?: string;
  status: "to do" | "doing" | "done" | "prevented";
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






export default function Kanban() {
  const [sprintSelected, setSprintSelected] = useState<number>(2); // Estado inicial igual ao currentSprint
  const [cards, setCards] = useState<any[]>([]); // Estado para armazenar os cards
  const [filteredCards, setFilteredCards] = useState<{
    toDo: Card[];
    doing: Card[];
    done: Card[];
    prevented: Card[];
  }>({
    toDo: [],
    doing: [],
    done: [],
    prevented: [],
  });
  

  // Função para buscar os cards da sprint selecionada
  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await axios.get(`http://0.0.0.0:3333/cards/project/1`);
        setCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar cards:", error);
      }
    }

    if (sprintSelected) {
      fetchCards();
    }
  });

  // Filtra os cards por status
  useEffect(() => {
    const toDo = cards.filter((card) => card.status === "to do");
    const doing = cards.filter((card) => card.status === "doing");
    const done = cards.filter((card) => card.status === "done");
    const prevented = cards.filter((card) => card.status === "prevented");

    setFilteredCards({ toDo, doing, done, prevented });
  }, [cards]);






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
            currentSprint={4} // Atualize conforme o sprint atual
            sprintProgress={0.3}
            sprintSelected={sprintSelected} // Passa o estado atual da sprint selecionada
            setSprintSelected={setSprintSelected} // Passa o método para alterar o estado
          />

          {/* Sprint Labels */}
          <div className="w-full flex justify-between mt-4">
            {["All", "1", "2", "3", "4", "5", "Fim"].map((label, index) => (
              <p key={index} className="font-fustat w-4 text-center text-[#eee]">
                {label}
              </p>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex mt-12 w-full justify-between">
            {["Kanban", "Descrição", "Estatísticas", "Chat AI"].map((btnLabel, index) => (
              <button
                key={index}
                className="bg-[#2D2D2D] font-light rounded-md font-fustat shadow-xl text-[#eee] px-6 py-2 hover:bg-[#4DB8FF]"
              >
                {btnLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Section */}
        <div className="flex flex-col mt-6 w-full items-center">

            {/* Prevented */}
            <div className="flex flex-col w-full bg-[#1B1B1B] h-64 rounded-xl shadow-md">
              <div className="flex w-full">
                <div className="flex items-center justify-center w-32 h-12 bg-[#F14646] mt-4 ml-4 rounded-md shadow-md text-white text-2xl font-fustat">
                  Prevented
                </div>

              </div>
              <div className="flex-1 overflow-x-scroll">
                {/* Conteúdo da área scrollável */}
                {/* CARDS IRÃO AQUI */}
              {filteredCards.prevented.map((card) => (
                <Card key={card.id} {...card} />
              ))}

              </div>
            </div>

            <div className="w-full flex justify-center h-fit align-middle mt-9">
              {/* To do */}
              <div className=" flex flex-col w-full min-h-64 h-fit mr-9 bg-[#1B1B1B] rounded-xl shadow-md p-4 justify-center">
                <div className="flex w-32 h-12 bg-[#F17C46] rounded-md shadow-md self-center justify-center items-center text-2xl font-fustat mb-4">
                To do
                </div>
                  {/* CARDS IRÃO AQUI */}

              {filteredCards.toDo.map((card) => (
                <Card card={}/>
              ))}
                
                <div className="flex items-center justify-center w-full" >
                  <button >
                    <IoAddCircleOutline size={36}  />
                  </button>
                </div>







              </div >
              {/* Doing */}
              <div className="flex flex-col w-full min-h-64 h-fit bg-[#1B1B1B] rounded-xl shadow-md p-4">
                <div className="flex w-32 h-12 bg-[#F1C946] rounded-md shadow-md self-center justify-center items-center text-2xl font-fustat mb-4">
                Doing
                </div>
                  {/* CARDS IRÃO AQUI */}
              {filteredCards.doing.map((card) => (
                <Card key={card.id} {...card} />
              ))}

              </div>
              {/* Done */}
              <div className="flex flex-col w-full min-h-64 h-fit ml-9 bg-[#1B1B1B] rounded-xl shadow-md p-4">
                <div className="flex w-32 h-12 bg-[#51F146] rounded-md shadow-md self-center justify-center items-center text-2xl font-fustat mb-4">
                Done
                </div>
                  {/* CARDS IRÃO AQUI */}
              {filteredCards.done.map((card) => (
                <Card key={card.id} {...card} />
              ))}
              </div>

            </div>
        </div>
      </div>
    </div>
  );
}
