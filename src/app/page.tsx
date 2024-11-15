import React from 'react';
import Card from '../components/Cards';

const KanbanPage: React.FC = () => {
  const cards = [
    {
      id: 1,
      titulo: 'Tarefa 1',
      descricao: 'Descrição da tarefa 1',
      status: 'Todo',
      tempo_estimado: 5,
      tempo: 2,
      assigned: 'João',
      sprint: 1,
      dod: ['Critério 1', 'Critério 2'],
      dor: ['Critério A', 'Critério B'],
      tipo: 'Frontend',
      xp: 2,
      indicacao_conteudo: 'Conteúdo 1'
    },    {
      id: 2,
      titulo: 'Tarefa 1',
      descricao: 'Descrição da tarefa 1',
      status: 'Prevented',
      tempo_estimado: 5,
      tempo: 2,
      assigned: 'João',
      sprint: 1,
      dod: ['Critério 1', 'Critério 2'],
      dor: ['Critério A', 'Critério B'],
      tipo: 'Frontend',
      xp: 2,
      indicacao_conteudo: 'Conteúdo 1'
    },
    {
      id: 3,
      titulo: 'Tarefa 1',
      descricao: 'Descrição da tarefa 1',
      status: 'Prevented',
      tempo_estimado: 5,
      tempo: 2,
      assigned: 'João',
      sprint: 1,
      dod: ['Critério 1', 'Critério 2'],
      dor: ['Critério A', 'Critério B'],
      tipo: 'Frontend',
      xp: 2,
      indicacao_conteudo: 'Conteúdo 1'
    },
    {
      id: 4,
      titulo: 'Tarefa 1',
      descricao: 'Descrição da tarefa 1',
      status: 'Prevented',
      tempo_estimado: 5,
      tempo: 2,
      assigned: 'João',
      sprint: 1,
      dod: ['Critério 1', 'Critério 2'],
      dor: ['Critério A', 'Critério B'],
      tipo: 'Frontend',
      xp: 2,
      indicacao_conteudo: 'Conteúdo 1'
    },
    {
      id: 5,
      titulo: 'Tarefa 1',
      descricao: 'Descrição da tarefa 1',
      status: 'Prevented',
      tempo_estimado: 5,
      tempo: 2,
      assigned: 'João',
      sprint: 1,
      dod: ['Critério 1', 'Critério 2'],
      dor: ['Critério A', 'Critério B'],
      tipo: 'Frontend',
      xp: 2,
      indicacao_conteudo: 'Conteúdo 1'
    },
    {
      id: 6,
      titulo: 'Tarefa 1',
      descricao: 'Descrição da tarefa 1',
      status: 'Prevented',
      tempo_estimado: 5,
      tempo: 2,
      assigned: 'João',
      sprint: 1,
      dod: ['Critério 1', 'Critério 2'],
      dor: ['Critério A', 'Critério B'],
      tipo: 'Frontend',
      xp: 2,
      indicacao_conteudo: 'Conteúdo 1'
    },
    
  ];

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