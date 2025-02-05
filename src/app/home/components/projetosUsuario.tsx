"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

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
  id: string;
  name: string;
  profileImageUrl: string;
}

const ProjectCards = ({ userId }: { userId: string }) => {
  const [projects, setProjects] = useState<Projeto[]>([]); // Inicializado como array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantsByProject, setParticipantsByProject] = useState<{
    [projectId: number]: Participante[];
  }>({});
  const [clientLogos, setClientLogos] = useState<{
    [clientId: string]: string;
  }>({}); // Mapeia id_cliente para profileImageUrl

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
      const responseUserType = await axiosInstance.get(`/users/${userId}`)
      const url = "/projetos"
      console.log("tipo de usuário: ",responseUserType.data.tipo_perfil, ", url: ", url);

      const response = await axiosInstance.get(url);
      console.log(response);
      
      const usersData: Participante[] = [];

      for (const card of response.data) {
        if (
          card.user_clerk_id &&
          !usersData.some((user) => user.id === card.user_clerk_id)
        ) {
          const userResponse = await fetch(
            `/api/getUser?userId=${card.user_clerk_id}`
          );
          const data = await userResponse.json();
          usersData.push(data);
        }
      }

      setParticipantsByProject((prevState) => ({
        ...prevState,
        [projectId]: usersData,
      }));
    } catch (err) {
      console.error(
        `Erro ao buscar participantes do projeto ${projectId}:`,
        err
      );
    }
  };

  // Função para buscar a logo do cliente
  const fetchClientLogo = async (clientId: string) => {
    try {
      const response = await axios.get(`/api/getUser?userId=${clientId}`);
      return response.data.profileImageUrl;
    } catch (err) {
      console.error(`Erro ao buscar logo do cliente ${clientId}:`, err);
      return "https://via.placeholder.com/40"; // Placeholder em caso de erro
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/projetos/aluno/${userId}`);

        if (Array.isArray(response.data)) {
          setProjects(response.data);

          // Para cada projeto, busca os participantes e a logo do cliente
          response.data.forEach(async (project: Projeto) => {
            fetchParticipants(project.id);
            const logoUrl = await fetchClientLogo(project.id_cliente);
            setClientLogos((prevState) => ({
              ...prevState,
              [project.id_cliente]: logoUrl,
            }));
          });
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
    <div className="flex flex-col w-96 gap-6">
      {projects.map((project) => (
        <Link
          href={`/project/${project.id}`}
          key={project.id}
          className="flex flex-row bg-[#1B1B1B] text-white py-4 px-6 gap-6 rounded-xl shadow-xl min-w-full "
        >
          {/* Div para a logo */}
          <div className="min-w-16 h-16 rounded-full flex items-center justify-center">
            <Image
              src={
                clientLogos[project.id_cliente] ||
                "https://via.placeholder.com/40"
              }
              alt="Logo"
              width={64}
              height={64}
              className="rounded-full w-16 h-16"
            />
          </div>
          <div className="flex flex-col w-full items-end">
            <div className="flex flex-row w-full justify-between items-start ">
              {/* Div para o nome do projeto e progresso */}
              <div className="flex-1 flex justify-between items-start">
                <span className="text-2xl font-fustat font-semibold">
                  {project.nome}
                </span>
                <span
                  className="text-lg font-light text-[#eeee]"
                  style={{ fontFamily: "Fustat" }}
                >
                  {Math.round(
                    calculateProgress(project.dia_inicio, project.dia_fim)
                  )}
                  %
                </span>
              </div>
            </div>
            {/* Div para os avatares e informações dos participantes */}
            <div className="flex flex-row items-end -space-x-2">
              {(participantsByProject[project.id] || []).map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-2"
                >
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
        </Link>
      ))}
    </div>
  );
};

export default ProjectCards;
