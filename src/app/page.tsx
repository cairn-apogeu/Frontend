"use client";

import React, { useEffect, useState } from 'react';
import Card from '../components/Cards';
import axios from 'axios';

interface CardType {
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

const KanbanPage: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get<CardType[]>('http://localhost:3333/cards');
        setCards(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Erro ao carregar os cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="kanban-container">
      <div className="kanban-row">
        <div className="kanban-column">
          <h2>Todo</h2>
          {cards.filter(card => card.status === 'Todo').map(card => (
            <Card key={card.id} {...card} />
          ))}
        </div>
        <div className="kanban-column">
          <h2>In Progress</h2>
          {cards.filter(card => card.status === 'In Progress').map(card => (
            <Card key={card.id} {...card} />
          ))}
        </div>
        <div className="kanban-column">
          <h2>Done</h2>
          {cards.filter(card => card.status === 'Done').map(card => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </div>
      <div className="kanban-row">
        <div className="kanban-column-full">
          <h2>Prevented</h2>
          {cards.filter(card => card.status === 'Prevented').map(card => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;