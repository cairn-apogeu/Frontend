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
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [filePath, setFilePath] = useState<'saep.md' | 'descricao.md' | 'saep.md' | 'README.md'>('README.md');
  const [branch, setBranch] = useState<string>('main');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchDescricao = async () => {
      try {
        const response = await axiosInstance.get(`/projetos/${id}`);
        const data = response.data;
        if (!data.owner || !data.repositorio || !data.token) {
          setIsEditing(true);
        } else {
          setOwner(data.owner);
          setRepo(data.repositorio);
          setToken(data.token);
          fetchContent(data.owner, data.repositorio, data.token);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar os dados');
      }
    };

    fetchDescricao();
  }, [id, filePath, branch]);

  const fetchContent = async (owner: string, repo: string, token: string) => {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const response = await axiosInstance.get(url, {
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

  const transformRelativeUrlsToAbsolute = (content: string, owner: string, repo: string, branch: string) => {
    const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
    return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
      if (!url.startsWith('http')) {
        return `![${alt}](${baseUrl}${url})`;
      }
      return match;
    });
  };

  const handleSave = async () => {
    try {
      setError(null);
      const response = await axiosInstance.put(`/projetos/${id}`, {
        owner,
        repositorio: repo,
        token,
      });
      if (response.status === 200) {
        setIsEditing(false);
        fetchContent(owner, repo, token);
      } else {
        console.error('Erro ao salvar os dados:', response);
        setError('Erro ao salvar os dados');
      }
    } catch (err: any) {
      console.error('Erro ao salvar os dados:', err);
      setError(err.response?.data?.message || 'Erro ao salvar os dados');
    }
  };

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  if (isEditing) {
    return (
      <div className="descricao-container">
        <h2>Cadastro de Repositório</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div>
            <label>Owner:</label>
            <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} required />
          </div>
          <div>
            <label>Repositório:</label>
            <input type="text" value={repo} onChange={(e) => setRepo(e.target.value)} required />
          </div>
          <div>
            <label>Token:</label>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} required />
          </div>
          <button type="submit">Salvar</button>
        </form>
      </div>
    );
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
