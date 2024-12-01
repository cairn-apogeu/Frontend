"use client"
import React, { useState } from 'react';
import Card from '../app/card/project/components/card'; // Certifique-se de que o caminho está correto

const Page: React.FC = () => {
    const [showCard, setShowCard] = useState(false);

    const handleButtonClick = () => {
        setShowCard(true);
    };

    return (
        <div className="flex min-h-screen bg-[#1F1F1F] text-gray-300 justify-center items-center">
            <button
                onClick={handleButtonClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Mostrar Card
            </button>
            {showCard && <Card />}
        </div>
    );
};

export default Page;