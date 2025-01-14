"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { IoHourglass, IoLink } from "react-icons/io5";
import axiosInstance from "@/app/api/axiosInstance";
import Image from "next/image";

interface FormData {
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
    titulo: initialData.titulo || " Kanban",
    descricao: initialData.descricao || "",
    tempo: initialData.tempo || 0,
    conteudoDeApoio: initialData.indicacao_conteudo || initialData.conteudoDeApoio || "",
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
    if (!formData.dor || !formData.tempo_estimado) {
      alert("Por favor, preencha o campo DOR e Tempo Estimado antes de salvar.");
      return;
    }

    setIsSubmitting(true);

    const requestBody = {
      ...formData,
      indicacao_conteudo: formData.conteudoDeApoio,
    };

    try {
      if (formData.id) {
        const response = await axiosInstance.put(`/cards/${formData.id}`, requestBody);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <form
          className="bg-[#2D2D2D] p-6 rounded-md shadow-md space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  className="bg-[#404040] p-2 rounded-md text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 w-full text-xl"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-xl font-bold text-white cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {formData.titulo}
                </h2>
              )}
              <p className="text-sm text-gray-400">17/11/2024</p>
            </div>
            <div className="flex items-center gap-2">
              {userData?.profileImageUrl ? (
                <Image
                  src={userData.profileImageUrl}
                  alt={userData.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <Link
                  href="#"
                  className="text-blue-400 hover:underline"
                  onClick={handleAssignClick}
                >
                  <span className="text-blue-400 text-sm">{userData?.name || "Assign to user"}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Campos principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Esquerda */}
            <div className="space-y-4">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-300">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descrição"
                className="bg-[#404040] p-3 rounded-md w-full h-32 text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500"
                value={formData.descricao}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dod" className="block text-sm font-medium text-gray-300">
                    DOD
                  </label>
                  <textarea
                    id="dod"
                    name="dod"
                    placeholder="Definição de pronto"
                    className="bg-[#404040] p-3 rounded-md w-full h-24 text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500"
                    value={formData.dod}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                  />
                </div>
                <div>
                  <label htmlFor="dor" className="block text-sm font-medium text-gray-300">
                    DOR
                  </label>
                  <textarea
                    id="dor"
                    name="dor"
                    placeholder="Definição de iniciado"
                    className="bg-[#404040] p-3 rounded-md w-full h-24 text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500"
                    value={formData.dor}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                  />
                </div>
              </div>
            </div>

            {/* Direita */}
            <div className="space-y-4">
              <div>
                <label htmlFor="tempoPrevisto" className="block text-sm font-medium text-gray-300">
                  Tempo Previsto
                </label>
                <div className="flex items-center gap-2">
                  <IoHourglass className="text-yellow-500 w-6 h-6" />
                  <input
                    type="number"
                    id="tempoPrevisto"
                    name="tempo_estimado"
                    placeholder="Minutos"
                    className="bg-[#404040] p-2 rounded-md w-28 text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                    value={formData.tempo_estimado || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="tempoExecutado" className="block text-sm font-medium text-gray-300">
                  Tempo Executado
                </label>
                <div className="flex items-center gap-2">
                  <IoHourglass className="text-green-500 w-6 h-6" />
                  <input
                    type="number"
                    id="tempoExecutado"
                    name="tempo"
                    placeholder="Minutos"
                    className="bg-[#404040] p-2 rounded-md w-28 text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                    value={formData.tempo || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="conteudoDeApoio" className="block text-sm font-medium text-gray-300">
                  Conteúdo de Apoio
                </label>
                <div className="flex items-center gap-2">
                  <IoLink className="text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    id="conteudoDeApoio"
                    name="conteudoDeApoio"
                    placeholder="Link de apoio"
                    className="bg-[#404040] p-2 rounded-md w-full text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                    value={formData.conteudoDeApoio || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Atributos</p>
                {[
                  { label: "Negócios", name: "xp_negocios" },
                  { label: "Arquitetura", name: "xp_arquitetura" },
                  { label: "FrontEnd", name: "xp_frontend" },
                  { label: "BackEnd", name: "xp_backend" },
                  { label: "Design", name: "xp_design" },
                  { label: "Data Analytics", name: "xp_dataAnalytics" },
                ].map(({ label, name }) => (
                  <div key={name} className="flex items-center gap-4">
                    <label
                      htmlFor={name}
                      className="text-gray-400 w-24 text-right text-sm"
                    >
                      {label}:
                    </label>
                    <input
                      type="number"
                      id={name}
                      name={name}
                      placeholder="XP"
                      className="bg-[#404040] p-2 rounded-md w-28 text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                      value={formData[name] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCard;
