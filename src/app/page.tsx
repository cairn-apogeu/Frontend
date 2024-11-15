import React from 'react';

const KanbanPage: React.FC = () => {
  return (
    <div className="kanban-container">
      <div className="kanban-row">
        <div className="kanban-column">
          <h2>Todo</h2>
          {/* Adicione os cards aqui */}
        </div>
        <div className="kanban-column">
          <h2>In Progress</h2>
          {/* Adicione os cards aqui */}
        </div>
        <div className="kanban-column">
          <h2>Done</h2>
          {/* Adicione os cards aqui */}
        </div>
      </div>
      <div className="kanban-row">
        <div className="kanban-column-full">
          <h2>Prevented</h2>
          {/* Adicione os cards aqui */}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;