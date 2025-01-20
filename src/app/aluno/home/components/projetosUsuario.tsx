"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";

// Define o tipo Projeto conforme o modelo retornado pela API
interface Projeto {
  id: number;
  id_cliente: string;
  id_gestor: string;
  nome: string;
  valor: number;
  status: string;
  dia_inicio: string; // Mantemos como string para trabalhar com datas
  dia_fim: string;
}

// Define o tipo Participante baseado na tabela users
interface Participante {
  id: string,
  name: string,
  profileImageUrl: string,
}

const ProjectCards = ({ userId }: { userId: string }) => {
  const [projects, setProjects] = useState<Projeto[]>([]); // Inicializado como array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participante[] >([]); // Participantes por projeto

  // Função para calcular o progresso com base em dia_inicio e dia_fim
  const calculateProgress = (diaInicio: string, diaFim: string): number => {
    const hoje = new Date(); // Data atual
    const inicio = new Date(diaInicio);
    const fim = new Date(diaFim);

    if (hoje < inicio) return 0; // Antes do início, progresso é 0%
    if (hoje > fim) return 100; // Após o término, progresso é 100%

    const total = fim.getTime() - inicio.getTime(); // Duração total do projeto em ms
    const atual = hoje.getTime() - inicio.getTime(); // Duração atual em ms
    return Math.min(100, Math.max(0, (atual / total) * 100)); // Calcula progresso entre 0 e 100
  };

  // Função para buscar os participantes de um projeto
  const fetchParticipants = async (projectId: number) => {
    try {
      const response = await axiosInstance.get(`/users/project/${projectId}`);
      const usersData: any[] = [];
      for (const card of response.data) {
        if (card.user_clerk_id && !usersData.some(user => user.id === card.user_clerk_id)) {
          const response = await fetch(`/api/getUser?userId=${card.user_clerk_id}`);
          const data = await response.json();
          usersData.push(data);
        }
      }
      console.log(usersData);
      
      
      setParticipants(usersData);
    } catch (err) {
      console.error(`Erro ao buscar participantes do projeto ${projectId}:`, err);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/projetos/aluno/${userId}`);

        if (Array.isArray(response.data)) {
          setProjects(response.data);

          // Para cada projeto, busca os participantes
          response.data.forEach((project: Projeto) => fetchParticipants(project.id));
        } else {
          throw new Error("Dados inválidos recebidos da API.");
        }
      } catch (err) {
        console.error(err); // Log para depuração
        setError("Erro ao buscar projetos do usuário."); // Define a mensagem de erro
      } finally {
        setLoading(false); // Desativa o estado de carregamento
      }
    };

    fetchProjects();
  }, [userId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  if (!Array.isArray(projects) || projects.length === 0) {
    return <div>Nenhum projeto encontrado.</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="relative bg-[#1B1B1B] text-white p-4 rounded-xl shadow-lg w-[350px]"
        >
          {/* Div para a logo */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-500 to-teal-600 flex items-center justify-center">
              <Image
                src="https://via.placeholder.com/40" // Substitua pela URL do logo
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full w-10 h-10"
              />
            </div>

            {/* Div para o nome do projeto e progresso */}
            <div className="flex-1 flex justify-between items-start">
              <span
                className="text-xl"
                style={{ fontFamily: "Fustat" }}
              >
                {project.nome}
              </span>
              <span
                className="text-sm text-gray-300"
                style={{ fontFamily: "Fustat" }}
              >
                {/* Calcula o progresso com base nas datas */}
                {Math.round(calculateProgress(project.dia_inicio, project.dia_fim))}%
              </span>
            </div>
          </div>

          {/* Div para os avatares e informações dos participantes */}
          <div className="absolute bottom-2 right-4 flex flex-row items-end -space-x-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2">
                {/* Avatar */}
                <Image
                  src={participant.profileImageUrl}
                  alt={participant.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-[#1B1B1B]"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCards;
