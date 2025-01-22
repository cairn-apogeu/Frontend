"use client";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (username: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchValue);
    setSearchValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-[80%] h-[63px] px-5 py-3 bg-[#1b1b1b] rounded-xl shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center mb-6 mt-6">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Pesquisar usuário"
        className="flex-grow bg-transparent text-white outline-none"
      />
      <button type="submit" className="w-6 h-6">
        <img src="/search-icon.svg" alt="Buscar" />
      </button>
    </form>
  );
};

export default SearchBar;