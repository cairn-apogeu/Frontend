"use client";

import { useState } from "react";
import SideNav from "@/app/components/sideNav";
import Timeline from "./components/timeline";
import { IoChevronBack } from "react-icons/io5";
import Card from "./components/card";
import axiosInstance from "@/app/api/axiosInstance";

interface CardType {
  id: number;
  idAluno: string;
}

interface ColumnsType {
  todo: CardType[];
  doing: CardType[];
  done: CardType[];
  prevented: CardType[];
}

export default function Kanban() {
  const [sprintSelected, setSprintSelected] = useState<number>(2);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);

  const [columns, setColumns] = useState<ColumnsType>({
    todo: [
      { id: 1, idAluno: "user_2pPbWrKiNVfCPZEjIU8RL3zwA1e" },
      { id: 2, idAluno: "user_2pPbWrKiNVfCPZEjIU8RL3zwA1e" },
      { id: 3, idAluno: "user_2pPbWrKiNVfCPZEjIU8RL3zwA1e" },
      { id: 4, idAluno: "user_2pPbWrKiNVfCPZEjIU8RL3zwA1e" },
      { id: 5, idAluno: "user_2pPbWrKiNVfCPZEjIU8RL3zwA1e" },
    ],
    doing: [],
    done: [],
    prevented: [],
  });

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

      if (!columns[columnName as keyof ColumnsType]) {
        console.error("Invalid column:", columnName);
        return;
      }

      if (columnName === targetColumn) {
        console.log("Card dropped in the same column. No changes made.");
        return;
      }

      const cardToMove = columns[columnName as keyof ColumnsType].find(
        (card) => card.id === cardId
      );

      if (!cardToMove) {
        console.error("Card not found:", cardId);
        return;
      }

      setColumns((prev) => {
        const updatedColumns = { ...prev };
        updatedColumns[columnName as keyof ColumnsType] = prev[
          columnName as keyof ColumnsType
        ].filter((card) => card.id !== cardId);
        updatedColumns[targetColumn as keyof ColumnsType] = [
          ...prev[targetColumn as keyof ColumnsType],
          cardToMove,
        ];
        return updatedColumns;
      });

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

      const updatedCard = response.data;
      console.log("Card successfully updated:", updatedCard);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const columnConfigs = {
    prevented: { title: "Prevented", bgColor: "bg-[#F14646]" },
    todo: { title: "To do", bgColor: "bg-[#F17C46]" },
    doing: { title: "Doing", bgColor: "bg-[#F1C946]" },
    done: { title: "Done", bgColor: "bg-[#51F146]" },
  };

  const renderColumn = (columnName: keyof ColumnsType) => {
    const config = columnConfigs[columnName];
    const isPrevented = columnName === "prevented";

    return (
      <div
        className={`flex ${
          isPrevented ? "flex-wrap gap-4" : "flex-col"
        } w-full min-h-64 h-fit bg-[#1B1B1B] rounded-xl shadow-md p-4 
          ${
            draggedOverColumn === columnName ? "border-2 border-[#4DB8FF]" : ""
          }`}
        onDragOver={(e) => handleDragOver(e, columnName)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, columnName)}
      > 
        <div className={`flex w-full ${isPrevented ? "items-start justify-start": "justify-center"}`}>
          <div
            className={`flex ${
              config.bgColor
            } rounded-md shadow-md self-start 
              justify-center items-center text-xl px-8 py-2 font-fustat mb-4 text-white `}
          >
            {config.title}
          </div>
        </div>
        {columns[columnName].map((card) => (
          <Card
            key={card.id}
            idAluno={card.idAluno}
            idCard={card.id}
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
        <div className="flex flex-col mt-6 w-full items-center">
          {renderColumn("prevented")}
          <div className="w-full flex justify-center gap-9 h-fit align-middle mt-9">
            {renderColumn("todo")}
            {renderColumn("doing")}
            {renderColumn("done")}
          </div>
        </div>
      </div>
    </div>
  );
}
