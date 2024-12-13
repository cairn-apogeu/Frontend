"use client";
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import remarkGfm from 'remark-gfm';

interface DescricaoProps {
  owner: string; 
  repo: string;  
  filePath: 'README.md' | 'descricao.md' | 'saep.md'; 
  branch?: string; 
  token: string; 
}

const Descricao: React.FC<DescricaoProps> = ({ owner, repo, filePath, branch = 'main', token }) => {
  const [descricaoContent, setDescricaoContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescricao = async () => {
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3.raw',
          },
          params: {
            ref: branch,
          },
        });
        const content = response.data;
        const absoluteContent = transformRelativeUrlsToAbsolute(content, owner, repo, branch);
        setDescricaoContent(absoluteContent);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar o arquivo');
      }
    };

    fetchDescricao();
  }, [owner, repo, filePath, branch, token]);

  const transformRelativeUrlsToAbsolute = (content: string, owner: string, repo: string, branch: string) => {
    const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
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