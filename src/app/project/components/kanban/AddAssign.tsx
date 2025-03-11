"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";

interface Participante {
  id: string;
  name: string;
  profileImageUrl: string;
}

interface ParticipantsModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedParticipant: string | null) => void;
  assign: string | null;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onSave,
  assign,
}) => {
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(assign);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/users/project/${projectId}`);
        const usersData: Participante[] = [];

        for (const user of response.data) {
          if (user.user_clerk_id && !usersData.some((u) => u.id === user.user_clerk_id)) {
            const userResponse = await fetch(`/api/getUser?userId=${user.user_clerk_id}`);
            const data = await userResponse.json();
            usersData.push(data);
          }
        }

        setParticipants(usersData);
      } catch (err) {
        console.error("Erro ao buscar participantes:", err);
        setError("Erro ao carregar participantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [projectId, isOpen]);

  const toggleSelection = (participantId: string) => {
    setSelectedParticipant((prev) => (prev === participantId ? null : participantId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1B1B1B] text-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-lg font-semibold text-[#EEEEEE] mb-4">Selecionar Participante</h2>

        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-[#2D2D2D] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={participant.profileImageUrl}
                    alt={participant.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-gray-700"
                  />
                  <span className="text-[#EEE]">{participant.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedParticipant === participant.id}
                  onChange={() => toggleSelection(participant.id)}
                  className="w-5 h-5 rounded-md border border-gray-500 bg-[#333] checked:bg-[#51F146] transition-all cursor-pointer"
                />
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#444] text-white rounded-md hover:bg-[#666] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(selectedParticipant)}
            className="px-4 py-2 bg-[#0070bb] text-[#EEE] font-semibold rounded-md hover:bg-[#4DB8FF] transition-all"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;
