"use client";

import React, { useState } from "react";
import MinhaPagina from "./components/card";

export default function InitialPage() {
  const [showCard, setShowCard] = useState(false);

  const handleButtonClick = () => {
    setShowCard(true);
  };

  return (
    <div className="flex h-screen bg-[#141414] justify-center items-center">
      {!showCard ? (
        <button
          type="button"
          onClick={handleButtonClick}
          className="py-3 px-10 bg-[#4DB8FF] text-white hover:bg-[#0070bb] font-fustat font-semibold transition-all rounded-xl text-lg"
        >
          Mostrar Card
        </button>
      ) : (
        <MinhaPagina />
      )}
    </div>
  );
}