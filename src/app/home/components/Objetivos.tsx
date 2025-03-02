"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { useAuth } from "@clerk/nextjs";

interface User {
  [key: string]: any; // Use um índice de string se as propriedades forem dinâmicas
  objetivo_curto?: string;
  objetivo_medio?: string;
  objetivo_longo?: string;
}

export default function Objetivos() {
  const { userId } = useAuth();
  const [user, setUser] = useState<User>();
  const [objetivoSelected, setObjetivoSelected] = useState<"curto" | "medio" | "longo">("curto");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const response = await axiosInstance.get(`users/${userId}`);
        setUser(response.data);
        if (response.data) {
          setEditedText(response.data[`objetivo_${objetivoSelected}`] || "");
        }
      } catch (error) {
        console.error("Erro ao buscar cards do usuário logado:", error);
      }
    }

    if (userId) {
      fetchUserCards();
    }
  }, [userId, objetivoSelected]);

  useEffect(() => {
    if (user) {
      setEditedText(user[`objetivo_${objetivoSelected}`] || "");
    }
  }, [objetivoSelected, user]);

  const handleSave = async () => {
    try {
      await axiosInstance.put(`users/${userId}`, {
        [`objetivo_${objetivoSelected}`]: editedText,
      });
      setUser((prev) => ({
        ...prev,
        [`objetivo_${objetivoSelected}`]: editedText,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar o objetivo:", error);
    }
  };

  return (
    <div className="flex flex-col font-fustats gap-11 text-[#eee] items-center w-60 md:w-[1000px]">
      <div className="flex flex-row min-w-full justify-center md:justify-between">
        <button
          onClick={() => setObjetivoSelected("curto")}
          className={`flex shadow-xl py-2 px-6 bg-[${objetivoSelected === "curto" ? "#4DB8FF" : "#2d2d2d"}] rounded-md font-extralight`}
        >
          Objetivo de Curto Prazo
        </button>
        <button
          onClick={() => setObjetivoSelected("medio")}
          className={`flex shadow-xl py-2 px-6 bg-[${objetivoSelected === "medio" ? "#4DB8FF" : "#2d2d2d"}] rounded-md font-extralight`}
        >
          Objetivo de Médio Prazo
        </button>
        <button
          onClick={() => setObjetivoSelected("longo")}
          className={`flex shadow-xl py-2 px-6 bg-[${objetivoSelected === "longo" ? "#4DB8FF" : "#2d2d2d"}] rounded-md font-extralight`}
        >
          Objetivo de Longo Prazo
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto max-h-64 min-w-full">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 rounded-md bg-[#1b1b1b] shadow-inner decoration-0 border-0"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:underline"
          >
            {user && user[`objetivo_${objetivoSelected}`]
              ? user[`objetivo_${objetivoSelected}`]
              : "Clique para adicionar um objetivo"}
          </p>
        )}
      </div>
    </div>
  );
}
