import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";

interface UserData {
  name: string;
  profileImageUrl: string;
}

const DadosUsuario = ({ id }: { id: string }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataServer, setUserDataServer] = useState<any | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/getUser?userId=${id}`);
        const data = await response.json();
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    async function fetchDadoUsuario() {
      try {
        const response = await fetch(`${apiUrl}/users/${id}`);
        const data = await response.json();
        console.log("oaaaaaaaaa", data);
        setUserDataServer(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    fetchDadoUsuario();
    fetchUserData();
  }, [id]);

  return (
    <div className="bg-[#00001A]">
      {userData ? (
        <div>
          <img
            src={userData.profileImageUrl}
            alt={`${userData.name}'s profile`}
            width={200}
            className="rounded-3xl"
          />
        </div>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}
      <div className="flex flex-col">
        <div className="bg-[#1B1B1B]">{userDataServer.linkedin}</div>
        <div className="bg-[#1B1B1B]">{userDataServer.github}</div>
        <div className="bg-[#1B1B1B]">{userDataServer.discord}</div>
      </div>
    </div>
  );
};

export default DadosUsuario;
