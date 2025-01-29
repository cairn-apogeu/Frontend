"use client";

import axios from "axios";
import { getCookie } from "cookies-next"; // Importa a função para obter cookies

// Cria a instância do Axios com a base URL configurada
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Defina a URL do seu backend no arquivo .env.local
});

// Adiciona um interceptor para incluir o token do cookie em cada requisição
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("__session"); // Substitua "auth_token" pelo nome do cookie que armazena o token

    if (token && typeof token === "string") {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"]; // Remove o cabeçalho caso o token não exista
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adiciona um interceptor para log ou tratamento global de erros (opcional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na resposta da API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
