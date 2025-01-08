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
  const [projectData, setProjectData] = useState<any>(null);
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
        const response = await axios.get(`/api/project/${projectId}`);
        const project = response.data;

        setProjectData(project);
        setSprints(project.sprints);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const calculateProgress = (start: Date, end: Date) => {
    const now = new Date();
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const elapsed = now.getTime() - new Date(start).getTime();
    return Math.min(Math.max(elapsed / duration, 0), 1);
  };

  if (!projectData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="w-full flex flex-row items-center justify-center"
      ref={divRef}
    >
      {sprints.map((sprint, index) => {
        const sprintProgress = calculateProgress(
          sprint.dia_inicio,
          sprint.dia_fim
        );

        return (
          <div
            key={sprint.id}
            style={{ width: `${divSize.width / (sprints.length + 1)}px` }}
            className="flex flex-row items-center"
          >
            <button
              style={{
                backgroundColor: sprintProgress > 0 ? "#4DB8FF" : "#eee",
              }}
              className="flex items-center justify-center w-6 h-6 rounded-full"
              title={`Sprint ${index + 1}: ${sprintProgress * 100}% completo`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;