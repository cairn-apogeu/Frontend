"use client";
import React, { useState } from 'react';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação, como integração com API ou Clerk.
    // Para este exemplo, redireciona para outra página após o login.
    window.location.href = './kambam.tsx';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src="/logo.png" alt="Apogeu Brand Book Logo" />
          <h1>APOGEU BRAND BOOK</h1>
        </div>
        <p>Acesse, estude e transforme suas ideias!</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login">Login</label>
          <input
            type="text"
            id="login"
            className="input-field"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            className="input-field"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          
          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={lembrar}
                onChange={() => setLembrar(!lembrar)}
              />{" "}
              Lembrar
            </label>
            <a href="./kambam.tsx" className="forgot-password">
              Esqueci minha senha
            </a>
          </div>
          
          <button type="submit" className="login-button">
            Acessar
          </button>
        </form>
      </div>
      
      <div className="image-section">
        {/* A imagem da montanha pode ser adicionada como background via CSS */}
      </div>
    </div>
  );
}
