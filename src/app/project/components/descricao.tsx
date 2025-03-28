"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axiosInstance from "@/app/api/axiosInstance";
import Sidebar from "./descricao/descricaoSideBar";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { visit } from "unist-util-visit";
import CodeBlock from "./descricao/codeBlock";

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

        if (navTop <= 40 && !isSticky) {
          setIsSticky(true);
        } else if (navTop > 40 && isSticky) {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSticky]);

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
  
    Object.entries(data as Record<string, any>).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        const subDirectory = processJson(value);
        const order = "Order.md" in value ? parseInt(value["Order.md"], 10) : Infinity;
        processedData.push({
          name: key,
          type: "directory",
          order,
          children: subDirectory,
        });
      } else if (key.endsWith(".md") && key !== "Order.md") {
        const order = getFileOrder(value as string);
        processedData.push({ name: key, type: "file", order, content: value });
      }
    });
  
    return processedData.sort((a, b) => a.order - b.order);
  };
  
  const handleFileSelect = (content: string, name: string) => {
    setSelectedFile({ content, name });

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
      await axiosInstance.put(`/projetos/${id}`, form);
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

  return (
    <div className="flex flex-row max-w-full">
      <div className="descricao-container" style={{ display: "flex" }}>
        <Sidebar data={processedData} onSelectFile={handleFileSelect} />
        <div className="content-area" style={{ flex: 1, padding: "16px" }}>
          {selectedFile ? (
            <div className="p-4 max-w-3xl">
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
                components={{
                  pre: CodeBlock,
                }}
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
          padding: "16px",
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
            width: "250px",
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
