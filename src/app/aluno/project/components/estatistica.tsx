import React, { useEffect, useState } from "react";

import RadarComponent from "@/app/components/radarChart";
import BarChartComponent from "@/app/components/barChart";
import ThroughputComponent from "@/app/components/throughputChart";

import axios from "axios";

const Estatisticas = () => {
  return (
    <div className="bg-[#141414] font-fustat flex-col ml-10 mr-10 h-[100vh] overflow-hidden">
      <div className="flex items-stretch overflow-hidden h-[50%]">
        <div className="flex-col items-start justify-between">
          <div className="bg-[#1b1b1b] p-3 rounded-md m-4 shadow-md">
            <p className="text-[16] font-extralight">Capacity</p>
            <p className="text-3xl font-semibold"> 7680min </p>
          </div>
          <div className="bg-[#1b1b1b] p-3 rounded-md m-4 shadow-md">
            <p className="text-[16] font-extralight">Throughput</p>
            <p className="text-3xl font-semibold"> 1920min</p>
          </div>
          <div className="bg-[#1b1b1b] p-3 rounded-md m-4 shadow-md">
            <p className="text-[16] font-extralight whitespace-nowrap">
              Average ThroughPut
            </p>
            <p className="text-3xl font-semibold">384min</p>
          </div>
        </div>

        <div className="bg-[#1b1b1b] rounded-md shadow-md m-4 w-full h-min-full p-4 overflow-hidden">
          <p className="text-[16] font-extralight mb-3">
            Individual Throughput
          </p>
          <ThroughputComponent />
        </div>
      </div>

      <div className="flex overflow-hidden h-[50%]">
        <div className="flex-[1.8] bg-[#1b1b1b] rounded-md shadow-md m-4 w-full h-min-full p-4 overflow-hidden">
          <p className="text-[16] font-extralight mb-3">Delta Time Predict</p>
          <BarChartComponent />
        </div>

        <div className="flex-[1.2] flex-row bg-[#1b1b1b] rounded-md shadow-md m-4 w-full p-4 overflow-hidden">
          <p className="text-[16] font-extralight ">Skills</p>
          <RadarComponent />
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;
