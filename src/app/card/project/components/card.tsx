"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

interface FormData {
  titulo: string;
  descricao: string;
  tempo: string;
  conteudoDeApoio: string;
  negocios: string;
  arquitetura: string;
  frontend: string;
  backend: string;
  design: string;
  dataAnalytics: string;
  dod: string;
  dor: string;
}

interface UserData {
  id: string;
  name: string;
  profileImageUrl: string;
  tipo_perfil: string;
}

interface ModalCardProps {
  cardId?: number;
  initialData: Partial<FormData>;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const ModalCard: React.FC<ModalCardProps> = ({ cardId, initialData, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    titulo: initialData.titulo || "Diagrama de sequência Kanban",
    descricao: initialData.descricao || "",
    tempo: initialData.tempo || "",
    conteudoDeApoio: initialData.conteudoDeApoio || "",
    negocios: initialData.negocios || "",
    arquitetura: initialData.arquitetura || "",
    frontend: initialData.frontend || "",
    backend: initialData.backend || "",
    design: initialData.design || "",
    dataAnalytics: initialData.dataAnalytics || "",
    dod: initialData.dod || "",
    dor: initialData.dor || "",
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  // Função para buscar dados do usuário
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
      return { id: userId, name: "Usuário Desconhecido", profileImageUrl: "", tipo_perfil: "aluno" };
    }
  };

  // useEffect para buscar dados do usuário quando assignedTo é atualizado
  useEffect(() => {
    if (assignedTo) {
      fetchUserData(assignedTo).then((data) => {
        setUserData(data);
      });
    }
  }, [assignedTo]);

  useEffect(() => {
    if (user) {
      setAssignedTo(user.id);
    }
  }, [user]);

  const handleAssignClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (user) {
      const userId = user.id;
      setAssignedTo(userId);
      console.log(`Usuário atribuído ID: ${userId}`);
    } else {
      console.error("Usuário não logado");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dadosParaEnviar: Partial<FormData> = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      dod: formData.dod,
      dor: formData.dor,
      tempo: formData.tempo,
      conteudoDeApoio: formData.conteudoDeApoio,
    };

    if (userData?.tipo_perfil === 'gestor') {
      Object.assign(dadosParaEnviar, formData);
    }

    try {
      if (cardId) {
        await axios.put(`/cards/${cardId}`, dadosParaEnviar);
        console.log("Card atualizado com sucesso");
      } else {
        await axios.post(`/cards`, dadosParaEnviar);
        console.log("Card criado com sucesso");
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
      <div className="flex-grow ml-16 py-8 px-8">
        <div className="max-w-[1200px] mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-[#2D2D2D] p-6 rounded-md shadow-md relative space-y-8"
            style={{ width: "85%" }}
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
                    className="bg-[#404040] p-2 rounded-md text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-lg font-semibold text-gray-200 cursor-pointer"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {formData.titulo}
                  </p>
                )}
                <p className="text-sm text-gray-400">17/11/2024</p>
              </div>
              <div className="relative flex items-center">
                {userData ? (
                  <div className="flex items-center">
                    {userData.profileImageUrl && (
                      <img
                        src={userData.profileImageUrl}
                        alt={userData.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <span className="text-blue-400 hover:underline cursor-pointer">
                      {userData.name}
                    </span>
                  </div>
                ) : (
                  <Link href="#" className="text-blue-400 hover:underline" onClick={handleAssignClick}>
                    Assign to
                  </Link>
                )}
              </div>
            </div>

            {/* Campos principais */}
            <div className="grid grid-cols-2 gap-6">
              {/* Coluna Esquerda: Descrição, DOD e DOR */}
              <div className="space-y-6">
                {/* Descrição */}
                <div>
                  <label
                    htmlFor="descricao"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    id="descricao"
                    placeholder="Descrição"
                    className="bg-[#404040] p-3 rounded-md w-96 h-[200px] text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500"
                    style={{ width: "140%" }}
                    value={formData.descricao}
                    onChange={handleChange}
                    disabled={userData?.tipo_perfil !== 'gestor'}
                  />
                </div>

                {/* DOD e DOR */}
                <div
                  className="grid grid-cols-2 gap-4 rounded-md h-[160px]"
                  style={{ width: "140%" }}
                >
                  <div>
                    <label
                      htmlFor="dod"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      DOD
                    </label>
                    <textarea
                      id="dod"
                      name="dod"
                      placeholder="Definição de pronto"
                      className="bg-[#404040] p-3 rounded-md w-full h-[200px] text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500"
                      value={formData.dod}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      disabled={userData?.tipo_perfil !== 'gestor'}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dor"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      DOR
                    </label>
                    <textarea
                      id="dor"
                      name="dor"
                      placeholder="Definição de iniciado"
                      className="bg-[#404040] p-3 rounded-md w-full h-[200px] text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500"
                      value={formData.dor}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      disabled={userData?.tipo_perfil !== 'gestor'}
                    />
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Tempo, Conteúdo de Apoio e Atributos */}
              <div
                className="space-y-4 relative"
                style={{
                  width: "80%",
                  height: "400px",
                  marginLeft: "80px",
                  paddingLeft: "20%",
                }}
              >
                <div>
                  <label
                    htmlFor="tempo"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Tempo
                  </label>
                  <input
                    type="text"
                    id="tempo"
                    name="tempo"
                    placeholder="Tempo (ex: 2d 4h)"
                    className="bg-[#404040] p-2 rounded-md w-full text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                    value={formData.tempo}
                    onChange={handleChange}
                    disabled={userData?.tipo_perfil !== 'gestor'}
                  />
                </div>
                <div>
                  <label
                    htmlFor="conteudoDeApoio"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Conteúdo de Apoio
                  </label>
                  <textarea
                    id="conteudoDeApoio"
                    name="conteudoDeApoio"
                    placeholder="Link ou detalhes do conteúdo de apoio"
                    className="bg-[#404040] p-2 rounded-md w-full h-[60px] text-gray-300 resize-none border-none focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                    value={formData.conteudoDeApoio}
                    onChange={handleChange}
                    disabled={userData?.tipo_perfil !== 'gestor'}
                  />
                </div>
                <div>
                  <p className="text-md font-semibold text-gray-200 mb-2">
                    Atributos
                  </p>
                  <div className="grid gap-1">
                    {[
                      "Negócios",
                      "Arquitetura",
                      "FrontEnd",
                      "BackEnd",
                      "Design",
                      "Data Analytics",
                    ].map((item) => (
                      <div key={item} className="flex items-center">
                        <label
                          htmlFor={item.toLowerCase()}
                          className="text-gray-400 mr-2 w-16 shrink-0 text-right text-xs"
                        >
                          {item}:
                        </label>
                        <input
                          type="text"
                          id={item.toLowerCase()}
                          name={item.toLowerCase()}
                          placeholder={`Digite ${item}`}
                          className="bg-[#404040] p-2 rounded-md w-full text-gray-300 border-none focus:outline-none focus:ring focus:ring-blue-500 text-xs"
                          value={
                            formData[
                              item.toLowerCase() as keyof FormData
                            ]
                          }
                          onChange={handleChange}
                          disabled={userData?.tipo_perfil !== 'gestor'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Botões no canto inferior direito */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
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
    </div>
  );
};

export default ModalCard;