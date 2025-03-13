"use client";

import { useEffect, useState } from "react";
import SideNav from "@/app/components/sideNav";

import Timeline from "../components/timeline";
import { IoChevronBack } from "react-icons/io5";
import Kanban from "../components/kanban/kanban";
import Estatisticas from "../components/estatistica/estatistica";

import axiosInstance from "@/app/api/axiosInstance";
import { useParams } from "next/navigation";
import Descricao from "../components/descricao";
import { Card } from "@/app/components/graphsTypes";

interface Sprint {
  id: number;
  objetivo: string;
  numero: number;
}

export default function Project() {
  const { projectId } = useParams();
  const [viewSelected, setViewSelected] = useState<string>("Kanban");
  const [cards, setCards] = useState<Card[]>([]);
  const [sprintCards, setSprintCards] = useState<Card[]>([]);
  const [statusChanged, setStatusChanged] = useState<boolean>(true);
  const [sprints, setSprints] = useState<any>([]);
  const [project, setProject] = useState<any>([]);
  const [currentSprint, setCurrentSprint] = useState<Sprint>({
    numero: 0,
    id: 0,
    objetivo: "",
  });
  const [sprintSelected, setSprintSelected] = useState<Sprint>({
    numero: 0,
    id: 0,
    objetivo: "",
  });
  const [currentSprintPercentage, setCurrentSprintPercentage] =
    useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<string>(
    sprintSelected?.objetivo
  );

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await axiosInstance.get(`/cards/project/${projectId}`);
        setCards(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar cards:", error);
      }
    }

    fetchCards();
  }, [statusChanged, projectId]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await axiosInstance.get(`/projetos/${projectId}`);
        setSprints(response.data.sprints);
        setProject(response.data);

        // Encontrar a sprint atual
        const hoje = new Date();
        const sprintAtual = response.data.sprints.find((sprint: any) => {
          const diaInicio = new Date(sprint.dia_inicio);
          const diaFim = new Date(sprint.dia_fim);
          return hoje >= diaInicio && hoje <= diaFim;
        });

        if (sprintAtual) {
          console.log(sprintAtual);

          setCurrentSprint(sprintAtual);

          // Calcular a porcentagem concluída da sprint atual
          const diaInicio = new Date(sprintAtual.dia_inicio);
          const diaFim = new Date(sprintAtual.dia_fim);
          const duracaoTotal = diaFim.getTime() - diaInicio.getTime();
          const duracaoAtual = hoje.getTime() - diaInicio.getTime();
          const progresso = duracaoAtual / duracaoTotal;
          console.log(Math.min(100, Math.max(0, progresso)));

          setCurrentSprintPercentage(Math.min(100, Math.max(0, progresso)));
        } else {
          setCurrentSprintPercentage(0);
        }
      } catch (error) {
        console.error("Erro ao buscar projeto:", error);
      }
    }

    fetchProject();
  }, [projectId, newObjective]);

  useEffect(() => {
    setSprintCards(
      cards.filter((card) => {
        if (sprintSelected?.numero !== 0) {
          return card.sprint === sprintSelected?.numero;
        }
        return true;
      })
    );
  }, [sprintSelected, cards]);

  useEffect(() => {
    console.log(currentSprint, " ", currentSprintPercentage);
  }, [currentSprint, currentSprintPercentage]);

  useEffect(() => {
    setNewObjective(sprintSelected.objetivo)
  }, [sprintSelected])

  const saveObjective = async () => {
    try {
      console.log(sprintSelected?.id);

      await axiosInstance.put(`/sprints/${sprintSelected?.id}`, {
        objetivo: newObjective,
      });
      console.log("Objetivo atualizado com sucesso");
      setIsEditing(false); // Fecha o modo de edição após salvar
    } catch (error) {
      console.error("Erro ao atualizar o objetivo:", error);
    }
  };

  return (
    <div className="flex w-full h-full bg-[#141414]">
      <SideNav />
      <div className="flex flex-col gap-11 w-full ml-16 p-10">
        {/* Header */}
        <div className="flex  items-center gap-5">
          <button onClick={() => window.history.back()}>
            <IoChevronBack size={28} />
          </button>

          <p className="font-fustat text-[#eee] text-2xl">{project.nome}</p>
        </div>
        {/* Timeline Section */}
        <div className="flex flex-col gap-6 rounded-xl shadow-md items-center px-10 py-5 w-full bg-[#1B1B1B]">
          {sprintSelected.numero !== 0 ? (
            <p className="self-start text-lg font-extralight">
              {" "}
              <span className="font-semibold">Objetivo: </span>
              {isEditing ? (
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onBlur={saveObjective} // Salva ao perder o foco
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveObjective(); // Salva ao pressionar Enter
                  }}
                  className="bg-[#2D2D2D] text-white border-none outline-none p-1 rounded"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditing(true)} // Entra no modo de edição ao clicar no texto
                  className="cursor-pointer hover:underline"
                >
                  {newObjective || "Sem Objetivo"}
                </span>
              )}
            </p>
          ) : (
            <p className="self-start text-lg font-semibold">Todas as Sprints</p>
          )}
          <Timeline
            totalSprints={sprints.length}
            currentSprint={currentSprint.numero}
            sprintProgress={currentSprintPercentage}
            sprintSelected={sprintSelected?.numero}
            setSprintSelected={(e) => {
              console.log("aaa ", currentSprint);

              setSprintSelected(
                sprints.filter((sprint: Sprint) => {
                  return sprint.numero === e;
                })[0] || { numero: 0, id: 0, objetivo: "" }
              );
            }}
          />

          <div className="hidden md:flex w-full justify-around">
            {["Kanban", "Descrição", "Estatísticas"].map((btnLabel, index) => (
              <button
                key={index}
                onClick={() => setViewSelected(btnLabel)}
                className={`${
                  viewSelected === btnLabel ? "bg-[#4DB8FF]" : "bg-[#2D2D2D]"
                } font-light rounded-md font-fustat shadow-xl text-[#eee] px-6 py-2 hover:bg-[#4DB8FF]`}
              >
                {btnLabel}
              </button>
            ))}
          </div>
          <div className="flex w-full justify-around md:hidden">
            <select
              value={viewSelected}
              onChange={(e) => setViewSelected(e.target.value)}
              className="bg-[#2D2D2D] font-light rounded-md font-fustat shadow-xl text-[#eee] px-6 py-2 hover:bg-[#4DB8FF]"
            >
              {["Kanban", "Descrição", "Estatísticas"].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {viewSelected === "Kanban" && (
          <Kanban
            statusChanged={() => setStatusChanged(!statusChanged)}
            cards={sprintCards}
            sprint={sprintSelected?.numero}
            project={Number(projectId)}
          />
        )}
        {viewSelected === "Estatísticas" && (
          <Estatisticas
            cardsProject={sprintCards.filter((card) => card.status === "done")}
          />
        )}
        {viewSelected === "Descrição" && <Descricao id={Number(projectId)} />}{" "}
        {/* passar o id do projeto aqui */}
      </div>
    </div>
  );
}
