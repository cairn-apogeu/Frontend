"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface TimelineProps {
  projectId: number;
}

const Timeline: React.FC<TimelineProps> = ({ projectId }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [divSize, setDivSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [projectProgress, setProjectProgress] = useState(0);
  const [sprints, setSprints] = useState<any[]>([]);

  useEffect(() => {
    if (divRef.current) {
      const { width, height } = divRef.current.getBoundingClientRect();
      setDivSize({ width, height });
    }
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/api/projectData?projectId=${projectId}`);
        const project = response.data;

        const now = new Date();
        const projectDuration =
          new Date(project.data_fim).getTime() - new Date(project.data_inicio).getTime();
        const projectElapsed = now.getTime() - new Date(project.data_inicio).getTime();
        const progress = Math.min(Math.max(projectElapsed / projectDuration, 0), 1);

        setProjectProgress(progress);
        setSprints(project.sprints);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  return (
    <div
      className="w-full flex flex-row items-center justify-center"
      ref={divRef}
    >
      <div
        style={{ width: `${divSize.width / (sprints.length + 2)}px` }}
        className={`flex flex-row items-center`}
      >
        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#4DB8FF]">
          <div
            style={{ width: `${projectProgress * 100}%` }}
            className="h-1 bg-[#4DB8FF]"
          />
        </div>
      </div>
      {sprints.map((sprint) => {
        const sprintDuration =
          new Date(sprint.data_fim).getTime() - new Date(sprint.data_inicio).getTime();
        const sprintElapsed = new Date().getTime() - new Date(sprint.data_inicio).getTime();
        const sprintProgress = Math.min(Math.max(sprintElapsed / sprintDuration, 0), 1);

        return (
          <div
            key={sprint.id}
            style={{ width: `${divSize.width / (sprints.length + 2)}px` }}
            className="flex flex-row items-center"
          >
            <button
              style={{
                backgroundColor: sprintProgress > 0 ? "#4DB8FF" : "#eee",
              }}
              className="flex items-center justify-center min-w-4 min-h-4 rounded-full"
            >
              <div
                style={{ width: `${sprintProgress * 100}%` }}
                className="h-1 bg-[#4DB8FF]"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
