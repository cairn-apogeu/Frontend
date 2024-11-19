"use client";

import { useState } from "react";
import SideNav from "@/app/components/sideNav";
import Timeline from "./components/timeline";
import { IoChevronBack } from "react-icons/io5";

export default function Kanban() {
  const [sprintSelected, setSprintSelected] = useState<number>(2); // Estado inicial igual ao currentSprint

  return (
    <div className="flex min-h-screen min-w-screen bg-[#141414]">
      <SideNav />
      <div className="flex flex-col gap-11 w-full h-screen ml-16 p-14">
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
      </div>
    </div>
  );
}
