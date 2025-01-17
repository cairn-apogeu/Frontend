"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axiosInstance from "@/app/api/axiosInstance";
import Sidebar from "./descricao/descricaoSideBar";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Escolha um estilo de realce
import { visit } from "unist-util-visit";

interface DescricaoProps {
  id: number;
}

const Descricao: React.FC<DescricaoProps> = ({ id }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<{
    content: string;
    name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [form, setForm] = useState({ token: "", repositorio: "", owner: "" });
  const [headings, setHeadings] = useState<
    { id: string; level: number; text: string }[]
  >([]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".toc");
      if (nav) {
        const navTop = nav.getBoundingClientRect().top;

        // Atualize o estado apenas se houver mudança
        if (navTop <= 40 && !isSticky) {
          console.log(navTop);
          setIsSticky(true);
        } else if (navTop > 40 && isSticky) {
          console.log(navTop);
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSticky]); // Adicione isSticky como dependência

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await axiosInstance.get(
          `/projetos/${id}/github-content`
        );
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
        processedData.push({
          name: key,
          type: "directory",
          order,
          children: subDirectory,
        });
      } else if (key.endsWith(".md") && key !== "Order.md") {
        const order = getFileOrder(value);
        processedData.push({ name: key, type: "file", order, content: value });
      }
    });

    return processedData.sort((a, b) => a.order - b.order);
  };

  const handleFileSelect = (content: string, name: string) => {
    setSelectedFile({ content, name });

    // Extrair os títulos do Markdown
    const headingRegex = /^(#{1,2})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    const extractedHeadings = matches.map((match) => ({
      id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      level: match[1].length,
      text: match[2],
    }));
    setHeadings(extractedHeadings);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/projetos/1`, form);
      alert("Informações enviadas com sucesso!");
    } catch (err: any) {
      console.error("Erro ao enviar informações:", err);
      alert("Erro ao enviar as informações. Tente novamente.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Erro: {error}</p>
        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
          <div>
            <label>
              Token:
              <input
                type="text"
                name="token"
                value={form.token}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Repositório:
              <input
                type="text"
                name="repositorio"
                value={form.repositorio}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Owner:
              <input
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    );
  }

  const processedData = processJson(jsonData || {});
  console.log(processedData);

  return (
    <div className="flex flex-row">
      <div className="descricao-container" style={{ display: "flex" }}>
        <Sidebar data={processedData} onSelectFile={handleFileSelect} />
        <div className="content-area" style={{ flex: 1, padding: "16px" }}>
          {selectedFile ? (
            <div className="p-4 max-w-7xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  rehypeHighlight,
                  () => (tree) => {
                    visit(tree, "element", (node) => {
                      if (["h1", "h2"].includes(node.tagName)) {
                        const text = node.children[0]?.value || "";
                        const id = text
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-");
                        node.properties = { ...(node.properties || {}), id };
                      }
                    });
                  },
                ]}
              >
                {selectedFile.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p>Selecione um arquivo para visualizar o conteúdo.</p>
          )}
        </div>
      </div>
      <nav
        className="toc"
        style={{
          marginLeft: "20px",
          padding: "16px",
          borderRadius: "8px",
          width: "250px",
          zIndex: 10,
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <ul
          className={`${isSticky ? "sticky" : ""}`}
          style={{
            listStyle: "none",
            padding: 0,
            position: isSticky ? "fixed" : "relative",
            top: isSticky ? "24px" : "auto",
          }}
        >
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ marginLeft: `${(heading.level - 1) * 10}px` }}
            >
              <a
                href={`#${heading.id}`}
                className="font-fustat font-light text-[#b3b1b1] decoration-0 focus:text-[#eee] hover:text-[#eee]"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(heading.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Descricao;
