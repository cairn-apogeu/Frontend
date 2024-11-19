import { IoLogOutOutline } from "react-icons/io5"; // Importe os ícones do Ionicons

import { useAuth } from "@clerk/nextjs";

interface LogOutProps {
    isExpanded: boolean;
  }

const LogOutButton: React.FC<LogOutProps> = ({isExpanded}) => {
  const { signOut } = useAuth();

  return (
    <button
      className={`flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 ${
        isExpanded ? "justify-start ml-7 space-x-4" : "justify-center"
      }`}
      onClick={() => signOut()}
    >
      <IoLogOutOutline color="#F14B4B" className="h-5 w-5 rotate-180" />
      {isExpanded && <span className="text-[#F14B4B]">Sair</span>}
    </button>
  );
};

export default LogOutButton;
