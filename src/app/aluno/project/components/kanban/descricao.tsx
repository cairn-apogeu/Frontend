"use client";
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axiosInstance from '@/app/api/axiosInstance';

interface DescricaoProps {
  id: number;
}

const Descricao: React.FC<DescricaoProps> = ({ id }) => {
  const [descricaoContent, setDescricaoContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<'README.md' | 'descricao.md' | 'saep.md' >('saep.md');
  const [branch, setBranch] = useState<string>('main');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const url = `/projetos/${id}/github-content`;
        const response = await axiosInstance.get(url, {
          params: {
            filePath,
            branch,
          },
        });
        const content = response.data.content;
        const absoluteContent = transformRelativeUrlsToAbsolute(content, filePath, branch);
        setDescricaoContent(absoluteContent);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar o arquivo');
        console.error('Detalhes do erro:', err);
      }
    };

    fetchContent();
  }, [id, filePath, branch]);

  const transformRelativeUrlsToAbsolute = (content: string, filePath: string, branch: string) => {
    const baseUrl = `https://raw.githubusercontent.com/owner/repo/${branch}/`;
    return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      if (!url.startsWith('http')) {
        return `![${alt}](${baseUrl}${url})`;
      }
      return match;
    });
  };

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="descricao-container">
      {descricaoContent ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{descricaoContent}</ReactMarkdown>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default Descricao;