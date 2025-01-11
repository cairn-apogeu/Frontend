"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axiosInstance from "@/app/api/axiosInstance";
import Sidebar from "./descricao/descricaoSideBar";

interface DescricaoProps {
  id: number;
}

const Descricao: React.FC<DescricaoProps> = ({ id }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<{ content: string; name: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axiosInstance.get(`/projetos/${id}/github-content`);
        setJsonData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao carregar o conteúdo");
        console.error("Detalhes do erro:", err);
      } finally {
        setCarregando(false);
      }
    };

    fetchJsonData();
  }, [id]);

  const getFileOrder = (content: string): number => {
    const match = content.match(/<!--(\d+)-->/);
    return match ? parseInt(match[1], 10) : Infinity;
  };

  const processJson = (data: any): any[] => {
    const processedData: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "object") {
        const subDirectory = processJson(value);
        const order = parseInt(value["Order.md"] || "Infinity", 10);
        processedData.push({ name: key, type: "directory", order, children: subDirectory });
      } else if (key.endsWith(".md") && key !== "Order.md") {
        const order = getFileOrder(value);
        processedData.push({ name: key, type: "file", order, content: value });
      }
    });

    return processedData.sort((a, b) => a.order - b.order);
  };

  const handleFileSelect = (content: string, name: string) => {
    setSelectedFile({ content, name });
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  const processedData = processJson(jsonData || {});

  return (
    <div className="descricao-container" style={{ display: "flex" }}>
      <Sidebar data={processedData} onSelectFile={handleFileSelect} />
      <div className="content-area" style={{ flex: 1, padding: "16px" }}>
        {selectedFile ? (
          <>
            <h1>{selectedFile.name}</h1>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {selectedFile.content}
            </ReactMarkdown>
          </>
        ) : (
          <p>Selecione um arquivo para visualizar o conteúdo.</p>
        )}
      </div>
    </div>
  );
};

export default Descricao;
