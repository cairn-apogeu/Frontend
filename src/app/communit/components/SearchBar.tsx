"use client";
import axiosInstance from "@/app/api/axiosInstance";
import { UserData } from "@/app/components/graphsTypes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (username: string) => void;
  onFetch: (users: UserData[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFetch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const response = await axiosInstance.get("/users");
        const usersPromises = response.data.map((user: UserData) =>
          axios.get(`api/getUser?userId=${user.user_clerk_id}`)
        );
        const usersData = await Promise.all(usersPromises);
        const newUsers = usersData.map((responseUser) => responseUser.data);
  
        // Atualizar o estado evitando duplicados
        setUsers((prevUsers) => {
          const allUsers = [...prevUsers, ...newUsers];
          const uniqueUsers = allUsers.filter(
            (user, index, self) =>
              index === self.findIndex((u) => u.id === user.id) // Remove duplicados por ID
          );
          return uniqueUsers;
        });
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
  
    fetchAllUsers();
  }, []);
  useEffect(() => {
    onFetch(users)
  }, [users, onFetch])

  return (
    <form
      className="w-[80%] h-[63px] px-5 py-3 bg-[#1b1b1b] rounded-xl shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center mb-6 mt-6"
    >
      <input
        type="text"
        value={searchValue}
        onChange={(e) => {
          onSearch(e.target.value);
          setSearchValue(e.target.value);
        }}
        placeholder="Pesquisar usuário"
        className="flex-grow bg-transparent text-white outline-none"
      />
      <button type="submit" className="w-6 h-6">
        <Image width={100} height={100} src="/search-icon.svg" alt="Buscar" />
      </button>
    </form>
  );
};

export default SearchBar;
