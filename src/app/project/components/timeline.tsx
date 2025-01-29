import { useEffect, useRef, useState } from "react";

interface TimelineProps {
  totalSprints: number; // Número total de sprints
  currentSprint: number; // Sprint atual
  sprintProgress: number; // Progresso da sprint atual (0 a 1)
  sprintSelected: number; // Sprint atualmente selecionada
  setSprintSelected: (sprint: number) => void; // Função para alterar a sprint selecionada
}

const Timeline: React.FC<TimelineProps> = ({
  totalSprints,
  currentSprint,
  sprintProgress,
  sprintSelected,
  setSprintSelected,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [divSize, setDivSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDivSize({ width, height });
    }
  }, []);

  let lastSprintProgress: number = 0;
  if (currentSprint > totalSprints) lastSprintProgress = 1;
  if (currentSprint < totalSprints) lastSprintProgress = 0;
  if (currentSprint === totalSprints) lastSprintProgress = sprintProgress;

  return (
    <div
      className="w-full flex flex-row items-center justify-center"
      ref={divRef}
    >
      <div
        style={{ width: `${divSize.width / (totalSprints + 2)}px` }}
        className={`flex flex-row items-center`}
      >
        <div
          onClick={() => setSprintSelected(0)} // Atualiza o estado no componente pai
          className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4DB8FF]"
        >
          {sprintSelected === 0 && (
            <div className="w-2 h-2 rounded-full bg-[#eee]" />
          )}
        </div>
        <div className="h-1 w-full bg-[#4DB8FF]" />
      </div>
      {Array.from({ length: totalSprints - 1 }).map((_, index) => {
        const sprint = index + 1;
        let progress: number = 0;
        if (currentSprint > sprint) progress = 1;
        if (currentSprint < sprint) progress = 0;
        if (currentSprint === sprint) progress = sprintProgress;

        return (
          <div
            key={index}
            style={{ width: `${divSize.width / (totalSprints + 1)}px` }}
            className={`flex flex-row items-center`}
          >
            <button
              style={{ backgroundColor: progress !== 0 ? "#4DB8FF" : "#eee" }}
              className="flex items-center justify-center min-w-4 min-h-4 rounded-full"
              onClick={() => setSprintSelected(sprint)} // Atualiza o estado no componente pai
            >
              {sprintSelected === sprint && (
                <div className="w-2 h-2 rounded-full bg-[#eee]" />
              )}
            </button>
            <div
              style={{
                width: `${
                  (divSize.width / (totalSprints + 1) - 16) * progress
                }px`,
              }}
              className="h-1 bg-[#4DB8FF]"
            />
            <div
              style={{
                width: `${
                  (divSize.width / (totalSprints + 1) - 16) * (1 - progress)
                }px`,
              }}
              className="h-1 bg-[#eee]"
            />
          </div>
        );
      })}
      <div
        style={{ width: `${(divSize.width - 80) / (totalSprints + 1)}px` }}
        className={`flex flex-row items-center`}
      >
        <button
          onClick={() => setSprintSelected(totalSprints)} // Atualiza o estado no componente pai
          style={{
            backgroundColor: lastSprintProgress !== 0 ? "#4DB8FF" : "#eee",
          }}
          className="flex items-center justify-center min-w-4 min-h-4 rounded-full"
        >
          {sprintSelected === totalSprints && (
            <div className="w-2 h-2 rounded-full bg-[#eee]" />
          )}
        </button>
        <div
          style={{
            width: `${
              ((divSize.width - 80) / (totalSprints + 1) - 16) *
              lastSprintProgress
            }px`,
          }}
          className="h-1 bg-[#4DB8FF]"
        />
        <div
          style={{
            width: `${
              ((divSize.width - 80) / (totalSprints + 1) - 16) *
              (1 - lastSprintProgress)
            }px`,
          }}
          className="h-1 bg-[#eee]"
        />
        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4DB8FF]" />
      </div>
    </div>
  );
};

export default Timeline;
