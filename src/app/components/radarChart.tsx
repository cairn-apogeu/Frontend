import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

const RadarComponent = () => {
  const data = {
    labels: ["Backend", "frontend", "Negócios", "Cortrupedes", "mastodonte"],
    datasets: [
      {
        label: "Equipe ",
        data: [60, 80, 30, 40, 0],
        fill: true,
        backgroundColor: "#0080FF80",
        borderColor: "#0080FF80",
        pointRadius: 4,
        tension: 0,
      },
      {
        label: "Fulaninho ",
        data: [0, 40, 60, 100, 32],
        fill: true,
        backgroundColor: "#a3f38699",
        borderColor: "#a3f38699",
        pointRadius: 4,
        tension: 0,
      },
    ],
  };

  return (
    <div style={{ width: "500px" }}>
      <Radar data={data}></Radar>
    </div>
  );
};

export default RadarComponent;
