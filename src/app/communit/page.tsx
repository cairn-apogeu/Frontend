"use client";
import React from "react";
import TopUsersByXP from "../components/TopUsersByXP";

const FinalPage: React.FC = () => {
  return (
    <div>
      <h1>Ranking Page</h1>
      <TopUsersByXP showTotalXP={true} />
      <TopUsersByXP area="frontend" />
    </div>
  );
};

export default FinalPage;