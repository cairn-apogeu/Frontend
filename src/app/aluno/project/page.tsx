"use client";

import { useEffect, useState } from "react";
import SideNav from "@/app/components/sideNav";
import Timeline from "./components/timeline";
import { IoChevronBack } from "react-icons/io5";
import Card from "./components/card";
import axiosInstance from "@/app/api/axiosInstance";

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
  const [cards, setCards] = useState<Card[]>([]); // Estado para armazenar os cards
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);
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
        const response = await axiosInstance.get(`http://0.0.0.0:3333/cards/project/1`);
        setCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar cards:", error);
      }
    }

    if (sprintSelected) {
      fetchCards();
    }
  }, [sprintSelected]);

  // Filtra os cards por status
  useEffect(() => {
    const toDo = cards.filter((card) => card.status === "to do");
    const doing = cards.filter((card) => card.status === "doing");
    const done = cards.filter((card) => card.status === "done");
    const prevented = cards.filter((card) => card.status === "prevented");

    setFilteredCards({ toDo, doing, done, prevented });
  }, [cards]);

  const handleDragStart = (
    e: React.DragEvent,
    columnName: string,
    cardId: number
  ) => {
    const data = JSON.stringify({ columnName, cardId });
    e.dataTransfer.setData("text/plain", data);
  };

  const handleDragOver = (e: React.DragEvent, columnName: string) => {
    e.preventDefault();
    setDraggedOverColumn(columnName);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    setDraggedOverColumn(null);

    try {
      const draggedData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { columnName, cardId } = draggedData;

      if (columnName === targetColumn) {
        console.log("Card dropped in the same column. No changes made.");
        return;
      }

      const cardToMove = cards.find((card) => card.id === cardId);

      if (!cardToMove) {
        console.error("Card not found:", cardId);
        return;
      }

      const updatedCards = cards.map((card) =>
        card.id === cardId ? { ...card, status: targetColumn } : card
      );

      setCards(updatedCards);

      await updateCardColumn(cardId, targetColumn);
    } catch (error) {
      console.error("Error processing drop:", error);
    }
  };

  const updateCardColumn = async (cardId: number, targetColumn: string) => {
    try {
      const response = await axiosInstance.put(`/cards/${cardId}`, {
        status: targetColumn,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update card");
      }

      console.log("Card successfully updated:", response.data);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const columnConfigs = {
    prevented: { title: "Prevented", bgColor: "bg-[#F14646]" },
    toDo: { title: "To do", bgColor: "bg-[#F17C46]" },
    doing: { title: "Doing", bgColor: "bg-[#F1C946]" },
    done: { title: "Done", bgColor: "bg-[#51F146]" },
  };

  const renderColumn = (columnName: keyof typeof filteredCards) => {
    const config = columnConfigs[columnName];

    return (
      <div
        className={`flex flex-col w-full min-h-64 h-fit bg-[#1B1B1B] rounded-xl shadow-md p-4 
          ${draggedOverColumn === columnName ? "border-2 border-[#4DB8FF]" : ""}`}
        onDragOver={(e) => handleDragOver(e, columnName)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, columnName)}
      >
        <div className={`flex w-full justify-center`}>
          <div
            className={`flex ${config.bgColor} rounded-md shadow-md justify-center items-center text-xl px-8 py-2 font-fustat mb-4 text-white `}
          >
            {config.title}
          </div>
        </div>
        {filteredCards[columnName].map((card) => (
          <Card
            key={card.id}
            {...card}
            draggable
            onDragStart={(e) => handleDragStart(e, columnName, card.id)}
          />
        ))}
      </div>
    );
  };

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
          <div className="w-full flex justify-between mt-4">
            {["All", "1", "2", "3", "4", "5", "Fim"].map((label, index) => (
              <p
                key={index}
                className="font-fustat w-4 text-center text-[#eee]"
              >
                {label}
              </p>
            ))}
          </div>
          <div className="flex mt-12 w-full justify-between">
            {["Kanban", "Descrição", "Estatísticas", "Chat AI"].map(
              (btnLabel, index) => (
                <button
                  key={index}
                  className="bg-[#2D2D2D] font-light rounded-md font-fustat shadow-xl text-[#eee] px-6 py-2 hover:bg-[#4DB8FF]"
                >
                  {btnLabel}
                </button>
              )
            )}
          </div>
        </div>

        {/* Kanban Section */}
        <div className="flex flex-col mt-6 w-full items-center gap-9">
          {renderColumn("prevented")}
          <div className="w-full flex justify-center gap-9 h-fit align-middle mt-9">
            {renderColumn("toDo")}
            {renderColumn("doing")}
            {renderColumn("done")}
          </div>
        </div>
      </div>
    </div>
  );
}