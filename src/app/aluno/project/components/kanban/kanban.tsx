"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { IoAddCircleOutline } from "react-icons/io5";
import ModalCard from "@/app/aluno/project/components/kanban/Modalcard";
import Card from "./card";

interface CardType {
  id: number;
  titulo: string;
  descricao?: string;
  status: "toDo" | "doing" | "done" | "prevented";
  tempo_estimado?: number;
  tempo?: number;
  assigned?: string;
  sprint?: number;
  projeto?: number;
  dod?: string;
  dor?: string;
  xp_frontend?: number;
  xp_backend?: number;
  xp_negocios?: number;
  xp_arquitetura?: number;
  xp_design?: number;
  xp_datalytics?: number;
  indicacao_conteudo?: string;
}

interface KanbanProps {
  cards: CardType[];
  statusChanged: () => void;
  sprint: number;
  project: number;
}

const Kanban: React.FC<KanbanProps> = ({
  cards,
  statusChanged,
  sprint,
  project,
}) => {
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(
    null
  );
  const [filteredCards, setFilteredCards] = useState<{
    toDo: CardType[];
    doing: CardType[];
    done: CardType[];
    prevented: CardType[];
  }>({
    toDo: [],
    doing: [],
    done: [],
    prevented: [],
  });
  const [modalCardIsVisible, setModalCardIsVisible] = useState<boolean>(false);
  const [cardSelected, setCardSelected] = useState<CardType | null>();

  // Filtra os cards por status
  useEffect(() => {
    const toDo = cards.filter((card) => card.status === "toDo");
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

  const handleDrop = async (
    e: React.DragEvent,
    targetColumn: "toDo" | "doing" | "done" | "prevented"
  ) => {
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
      
      cards = updatedCards;
      if (
        !cardToMove.dod ||
        !cardToMove.assigned ||
        !cardToMove.tempo_estimado
      ) {
        console.warn("Card move canceled: missing required fields.");
        alert("Cannot move the card. Please complete all required fields.");
        return;
      }

      if (
        targetColumn === "done" && !cardToMove.tempo
      ) {
        console.warn("Card move canceled: missing required fields.");
        alert("Cannot move the card. Please complete all required fields.");
        return;
      }
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

      statusChanged();
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
          ${
            draggedOverColumn === columnName ? "border-2 border-[#4DB8FF]" : ""
          }`}
        onDragOver={(e) => handleDragOver(e, columnName)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, columnName)}
      >
        <div className={`flex w-full justify-center`}>
          <div
            className={`flex ${config.bgColor} gap-3 rounded-md shadow-md justify-center items-center text-xl px-8 py-2 font-fustat mb-4 text-white `}
          >
            {config.title}{" "}
            {columnName === "toDo" && (
              <button
                onClick={() => setModalCardIsVisible(true)}
                className="hover:opacity-70"
              >
                <IoAddCircleOutline className="w-7 h-7" />
              </button>
            )}
          </div>
        </div>
        {filteredCards[columnName].map((card: CardType) => (
          <button
            key={card.id}
            onClick={() => {
              setCardSelected(card);
              setModalCardIsVisible(true);
            }}
            className="flex w-full items-center justify-center"
          >
            <Card
              card={card}
              draggable
              onDragStart={(e) => handleDragStart(e, columnName, card.id)}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-6 w-full items-center gap-9">
      {renderColumn("prevented")}
      <div className="w-full flex justify-center gap-9 h-fit align-middle mt-9">
        {renderColumn("toDo")}
        {renderColumn("doing")}
        {renderColumn("done")}
      </div>
      {modalCardIsVisible && (
        <ModalCard
          initialData={cardSelected ? cardSelected : {}}
          onClose={() => {
            setModalCardIsVisible(false);
            setCardSelected(null);
          }}
          onSaveSuccess={() => {
            setCardSelected(null);
            return statusChanged;
          }}
          sprint={sprint}
          project={project}
        />
      )}
    </div>
  );
};
export default Kanban;
