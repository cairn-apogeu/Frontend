"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  IoHourglassOutline,
  IoLinkOutline,
  IoTrashOutline,
} from "react-icons/io5";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";

interface FormData {
  [key: string]: string | number | readonly string[] | undefined;
  status?: string;
  titulo: string;
  descricao: string;
  tempo: string | number | readonly string[] | undefined;
  conteudoDeApoio: string;
  xp_negocios: number;
  xp_arquitetura: number;
  xp_frontend: number;
  xp_backend: number;
  xp_design: number;
  xp_datalytics: number;
  dod: string;
  dor: string;
  projeto: number;
  sprint: number;
  id?: number;
  indicacao_conteudo?: string;
  tempo_estimado?: number;
  prova_pr?: string;
  data_criacao: string;
  assigned?: string;
}

interface UserData {
  id: string;
  name: string;
  profileImageUrl: string;
}

interface ModalCardProps {
  initialData: Partial<FormData>;
  onClose: () => void;
  onSaveSuccess: () => void;
  sprint: number;
  project: number;
}

const ModalCard: React.FC<ModalCardProps> = ({
  initialData,
  sprint,
  project,
  onClose,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: initialData.id,
    status: initialData.status || "toDo",
    titulo: initialData.titulo || "Nome do Card",
    descricao: initialData.descricao || "",
    tempo: initialData.tempo || 0,
    conteudoDeApoio:
      initialData.indicacao_conteudo || initialData.conteudoDeApoio || "",
    xp_negocios: initialData.xp_negocios || 0,
    xp_arquitetura: initialData.xp_arquitetura || 0,
    xp_frontend: initialData.xp_frontend || 0,
    xp_backend: initialData.xp_backend || 0,
    xp_design: initialData.xp_design || 0,
    xp_datalytics: initialData.xp_datalytics || 0,
    dod: initialData.dod || "",
    dor: initialData.dor || "",
    projeto: initialData.projeto || project,
    sprint: initialData.sprint || sprint,
    indicacao_conteudo: initialData.indicacao_conteudo || "",
    tempo_estimado: initialData.tempo_estimado || 0,
    prova_pr: initialData.prova_pr || "",
    data_criacao: initialData.data_criacao || `${new Date()}`,
    assigned: initialData.assigned || "",
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "xp_negocios",
      "xp_arquitetura",
      "xp_frontend",
      "xp_backend",
      "xp_design",
      "xp_dataAnalytics",
      "tempo",
      "tempo_estimado",
    ];

    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) || 0 : value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const { name, value } = e.currentTarget;
      setFormData({
        ...formData,
        [name]: value + "\n- ",
      });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    if (value === "") {
      setFormData({
        ...formData,
        [name]: "- ",
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, titulo: e.target.value });
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const fetchUserData = async (userId: string): Promise<UserData> => {
    try {
      const response = await fetch(`/api/getUser?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      return { id: userId, name: "Usuário Desconhecido", profileImageUrl: "" };
    }
  };

  useEffect(() => {
    if (assignedTo) {
      fetchUserData(assignedTo).then((data) => {
        setUserData(data);
      });
    }
  }, [assignedTo]);

  const handleAssignClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (user) {
      const userId = user.id;
      setFormData((prevFormData) => ({
        ...prevFormData,
        assigned: userId,
      }));
      setAssignedTo(userId);
      console.log(`Usuário atribuído ID: ${userId}`);
    } else {
      console.error("Usuário não logado");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validations for required fields
    if (
      !formData.dor ||
      !formData.tempo_estimado ||
      formData.titulo === "Nome do Card"
    ) {
      alert(
        "Por favor, preencha o campo DOR e Tempo Estimado e nome antes de salvar."
      );
      return;
    }

    setIsSubmitting(true);

    const requestBody = {
      ...formData,
      indicacao_conteudo: formData.conteudoDeApoio,
    };

    try {
      if (formData.id) {
        const response = await axiosInstance.put(
          `/cards/${formData.id}`,
          requestBody
        );
        console.log("Card atualizado com sucesso:", response.data);
      } else {
        const response = await axiosInstance.post(`/cards`, requestBody);
        console.log("Card criado com sucesso:", response.data);
      }
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar o card:", error);
      alert("Falha ao salvar o card. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {}, []);
  const formattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
  };

  useEffect(() => {
    if (initialData.assigned) {
      fetchUserData(initialData.assigned).then((data) => {
        setUserData(data);
      });
    }
  }, [initialData]);

  const handleDeleteCard = async () => {
    const confirmDelete = window.confirm(
      "Você tem certeza de que deseja excluir este cartão?"
    );

    if (!confirmDelete) {
      console.log("Exclusão cancelada");
      return;
    }

    try {
      // Exemplo de chamada para a API ou ação de deletar
      const response = await axiosInstance.delete(`/cards/${initialData.id}`);

      // Verifica se a resposta foi bem-sucedida
      if (response.status === 200) {
        console.log("Cartão deletado com sucesso!");
      } else {
        throw new Error("Erro ao deletar o cartão");
      }
    } catch (error) {
      console.error("Falha ao deletar o cartão:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        className="bg-[rgb(27,27,27)] flex flex-col gap-4 p-4 md:p-6 rounded-md shadow-md w-11/12 max-w-5xl"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex justify-between w-full items-start">
          <div>
            <div className="flex flex-row gap-4 items-center">
              <div
                className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${
                  formData.status === "doing"
                    ? "bg-[#F1C946]"
                    : formData.status === "done"
                    ? "bg-[#51F146]"
                    : formData.status === "prevented"
                    ? "bg-[#F14646]"
                    : "bg-[#F17C46]"
                }`}
              ></div>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  className="bg-[#2d2d2d] p-2 rounded-md text-[#eee] border-none focus:outline-none w-full text-lg md:text-xl"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-xl md:text-2xl font-bold text-white cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {formData.titulo}
                </h2>
              )}
            </div>
            <p className="text-sm md:text-lg font-light text-[#eee]">
              {formattedDate(formData.data_criacao)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {userData ? (
              <div className="flex flex-row gap-4">
                <h2
                  className="text-xl md:text-2xl font-light text-white cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {`${userData.name.split(" ")[0]} ${userData.name.split(" ").slice(-1)}`}
                </h2>
                <Image
                  src={userData.profileImageUrl}
                  alt={userData.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            ) : (
              <Link
                href="#"
                className="text-blue-400 hover:underline"
                onClick={handleAssignClick}
              >
                <span className="text-blue-400 text-base md:text-lg font-light">
                  {"Assign to"}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Campos principais */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Esquerda */}
          <div className="flex flex-col gap-4 w-full md:w-9/12">
            <label
              htmlFor="descricao"
              className="block text-base md:text-lg font-light text-[#eee]"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              className="bg-[#2d2d2d] p-2 rounded-md w-full h-full md:h-full text-[#eee] resize-none border-none focus:outline-none"
              value={formData.descricao}
              onChange={handleChange}
            />

            <div className="flex flex-col md:flex-row h-full gap-4 w-full">
              <div className="flex flex-col gap-2 h-full w-full">
                <label
                  htmlFor="dod"
                  className="block text-base md:text-lg font-normal text-[#eee]"
                >
                  DOD
                </label>
                <textarea
                  id="dod"
                  name="dod"
                  className="bg-[#2d2d2d] p-2 rounded-md w-full h-full text-[#eee] resize-none border-none focus:outline-none"
                  value={formData.dod}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                />
              </div>
              <div className="flex flex-col gap-2 h-full w-full">
                <label
                  htmlFor="dor"
                  className="block text-base md:text-lg font-normal text-[#eee]"
                >
                  DOR
                </label>
                <textarea
                  id="dor"
                  name="dor"
                  className="bg-[#2d2d2d] p-2 rounded-md w-full h-full text-[#eee] resize-none border-none focus:outline-none"
                  value={formData.dor}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                />
              </div>
            </div>
          </div>

          {/* Direita */}
          <div className="flex flex-col gap-6 w-full md:w-3/12">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tempoPrevisto"
                className="text-base md:text-lg font-normal text-[#eee]"
              >
                Tempo
              </label>
              <div className="flex w-full justify-end items-center gap-2">
                <IoHourglassOutline className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="number"
                  id="tempoPrevisto"
                  name="tempo_estimado"
                  placeholder="min"
                  className="bg-[#2d2d2d] p-1 w-16 md:w-20 text-right shadow-inner rounded-md text-[#eeee] border-none focus:outline-none text-xs md:text-sm"
                  value={formData.tempo_estimado || ""}
                  onChange={handleChange}
                />
                <label
                  htmlFor="tempoPrevisto"
                  className="text-base md:text-lg font-light text-[#eee]"
                >
                  Previsto
                </label>
              </div>
              <div className="flex w-full justify-end items-center gap-2">
                <IoHourglassOutline className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="number"
                  id="tempo"
                  name="tempo"
                  placeholder="min"
                  className="bg-[#2d2d2d] p-1 w-16 md:w-20 text-right shadow-inner rounded-md text-[#eeee] border-none focus:outline-none text-xs md:text-sm"
                  value={formData.tempo || ""}
                  onChange={handleChange}
                />
                <label
                  htmlFor="tempoExecutado"
                  className="text-base md:text-lg font-light text-[#eee]"
                >
                  Executados
                </label>
              </div>
            </div>
            {/* Conteúdo de Apoio */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="conteudoDeApoio"
                className="text-base md:text-lg font-normal text-[#eee]"
              >
                Conteúdo de Apoio
              </label>
              <div className="flex items-center justify-end gap-4">
                <IoLinkOutline className="text-[#4DB8FF] w-5 h-5" />
                <input
                  type="text"
                  id="conteudoDeApoio"
                  name="conteudoDeApoio"
                  placeholder="Link de apoio"
                  className="bg-transparent w-full md:w-2/3 rounded-md text-[#eeee] border-none focus:outline-none font-extralight text-sm md:text-base"
                  value={formData.conteudoDeApoio || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <IoLinkOutline className="text-green-500 w-5 h-5" />
                <input
                  type="text"
                  id="prova_pr"
                  name="prova_pr"
                  placeholder="Prova de PR"
                  className="bg-transparent w-full md:w-2/3 rounded-md text-[#eeee] border-none focus:outline-none font-extralight text-sm md:text-base"
                  value={formData.prova_pr || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="tempoPrevisto"
                className="text-lg md:text-xl font-normal text-[#eee]"
              >
                Atributos
              </label>
              <div className="flex flex-col w-full gap-2 overflow-y-auto max-h-32 ">
                {[
                  { label: "Negócios", name: "xp_negocios" },
                  { label: "Arquitetura", name: "xp_arquitetura" },
                  { label: "FrontEnd", name: "xp_frontend" },
                  { label: "BackEnd", name: "xp_backend" },
                  { label: "Design", name: "xp_design" },
                  { label: "Data Analytics", name: "xp_dataAnalytics" },
                ].map(({ label, name }: { label: string; name: string }) => (
                  <div
                    key={name}
                    className="flex items-center w-full justify-end space-y-2 gap-2 md:gap-4"
                  >
                    <label
                      htmlFor={name}
                      className="text-[#eee] text-sm md:text-base text-right font-extralight"
                    >
                      {label}
                    </label>
                    <input
                      type="number"
                      id={name}
                      name={name}
                      placeholder="xp"
                      className="bg-[#2d2d2d] p-1 w-16 md:w-20 text-right shadow-inner rounded-md text-[#eeee] border-none focus:outline-none text-xs md:text-sm"
                      value={formData[name] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-6 flex-row justify-between">
          {initialData.id ? (
            <button
              type="button"
              onClick={() => {
                handleDeleteCard()
                onClose()
              }}
              className="bg-[#F14646] flex flex-row items-center rounded gap-2 px-2"
            >
              <IoTrashOutline className="text-[#eee] w-4 h-4 md:w-5 md:h-5" />
              Deletar
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm md:text-base ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm md:text-base"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModalCard;
