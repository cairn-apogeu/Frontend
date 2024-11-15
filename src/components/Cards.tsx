// Card.tsx
import React from 'react';
import './Cards.css';

interface CardProps {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  tempo_estimado?: number;
  tempo?: number;
  assigned?: string;
  sprint?: number;
  dod: string[];
  dor: string[];
  tipo: string;
  xp: number;
  indicacao_conteudo?: string;
}

const Card: React.FC<CardProps> = ({
  id,
  titulo,
  descricao,
  status,
  tempo_estimado,
  tempo,
  assigned,
  sprint,
  dod,
  dor,
  tipo,
  xp,
  indicacao_conteudo
}) => {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Status:</strong> {status}</p>
      {descricao && <p><strong>Descrição:</strong> {descricao}</p>}
      {tempo_estimado && <p><strong>Tempo Estimado:</strong> {tempo_estimado} horas</p>}
      {tempo && <p><strong>Tempo:</strong> {tempo} horas</p>}
      {assigned && <p><strong>Assigned:</strong> {assigned}</p>}
      {sprint && <p><strong>Sprint:</strong> {sprint}</p>}
      <p><strong>DOD:</strong> {dod.join(', ')}</p>
      <p><strong>DOR:</strong> {dor.join(', ')}</p>
      {tipo && <p><strong>Tipo de xp:</strong> {tipo}</p>}
      {xp && <p><strong>Quantidade de xp:</strong> {xp}</p>}
      {indicacao_conteudo && <p><strong>Indicação de Conteúdo:</strong> {indicacao_conteudo}</p>}
    </div>
  );
};

export default Card;