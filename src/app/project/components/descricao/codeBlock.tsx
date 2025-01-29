import React, { useState, useRef, useEffect } from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(""); // Estado para armazenar o conteúdo do <code>
  const codeRef = useRef<HTMLElement | null>(null); // Referência para o <code>

  // Atualiza o estado `code` com o conteúdo do <code> assim que o componente monta
  useEffect(() => {
    if (codeRef.current) {
      setCode(codeRef.current.textContent || ""); // Captura o texto do elemento <code>
    }
  }, []);

  const handleCopy = async () => {
    console.log(code);
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2 segundos
    } catch (error) {
      console.error("Erro ao copiar: ", error);
    }
  };

  if (inline) {
    return <code className={className}>{children}</code>; // Renderiza código inline simples
  }

  return (
    <div className="relative group">
      <pre className={className}>
        <code ref={codeRef}>{children}</code> {/* Associa o ref ao <code> */}
      </pre>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-sm rounded"
      >
        {copied ? "Copiado!" : "Copiar"}
      </button>
    </div>
  );
};

export default CodeBlock;
