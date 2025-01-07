"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axiosInstance from "@/app/api/axiosInstance";

interface DescricaoProps {
  id: number;
}

const Descricao: React.FC<DescricaoProps> = ({ id }) => {
  const [descricaoContent, setDescricaoContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<"README.md" | "descricao.md" | "saep.md">("README.md");
  const [branch, setBranch] = useState<string>("main");
  const [projeto, setProjeto] = useState<any>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    token: string;
    repositorio: string;
    owner: string;
  }>({
    token: "",
    repositorio: "",
    owner: "",
  });

  useEffect(() => {
    const verificarProjeto = async () => {
      try {
        // Busca o projeto pelo ID
        const response = await axiosInstance.get(`/projetos/${id}`);
        const data = response.data;
        setProjeto(data);

        // Verifica os campos
        if (!data.token || !data.repositorio || !data.owner) {
          setCarregando(false);
          return;
        }

        // Carrega o conteúdo do GitHub
        await fetchContent();
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao carregar o projeto");
        console.error("Detalhes do erro:", err);
      } finally {
        setCarregando(false);
      }
    };

    const fetchContent = async () => {
      try {
        const url = `/projetos/${id}/github-content`;
        const response = await axiosInstance.get(url, {
          params: { filePath, branch },
        });
        const content = response.data.content;
        const absoluteContent = transformRelativeUrlsToAbsolute(content, filePath, branch);
        setDescricaoContent(absoluteContent);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao carregar o arquivo");
        console.error("Detalhes do erro:", err);
      }
    };

    verificarProjeto();
  }, [id, filePath, branch]);

  const transformRelativeUrlsToAbsolute = (content: string, filePath: string, branch: string) => {
    const baseUrl = `https://raw.githubusercontent.com/owner/repo/${branch}/`;
    return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      if (!url.startsWith("http")) {
        return `![${alt}](${baseUrl}${url})`;
      }
      return match;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Envia os dados via PUT
      await axiosInstance.put(`/projetos/${id}`, formData);
      window.location.reload(); // Recarrega a página para refletir os novos dados
    } catch (err: any) {
      console.error("Erro ao salvar os dados:", err);
      alert("Erro ao salvar os dados");
    }
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  // Se os campos obrigatórios estão ausentes, exibe o formulário
  if (!projeto?.token || !projeto?.repositorio || !projeto?.owner) {
    return (
      <div className="formulario-cadastro">
        <h2>Cadastro de Projeto</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Token:
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Repositório:
            <input
              type="text"
              name="repositorio"
              value={formData.repositorio}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Owner:
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Salvar</button>
        </form>
      </div>
    );
  }

  // Fluxo principal
  return (
    <div className="descricao-container">
      {descricaoContent ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{descricaoContent}</ReactMarkdown>
      ) : (
        <p>Carregando descrição...</p>
      )}
    </div>
  );
};

export default Descricao;
