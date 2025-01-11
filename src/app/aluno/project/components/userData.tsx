import { useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa";

interface UserData {
  name: string;
  profileImageUrl: string;
}

const DadosUsuario = ({ id }: { id: string }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataServer, setUserDataServer] = useState<any | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false); // Controle de upload
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const editRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isSignedIn, userId } = useAuth();
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Busca dados do usuário de um endpoint interno (/api/getUser)
        const response = await fetch(`/api/getUser?userId=${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário (Clerk):", error);
      }
    }

    async function fetchDadoUsuario() {
      try {
        // Busca dados do usuário diretamente do seu backend
        const response = await fetch(`${apiUrl}/users/${userId}`);
        const data = await response.json();
        setUserDataServer(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário (Server):", error);
      }
    }

    fetchDadoUsuario();
    fetchUserData();
  }, [userId]);

  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setEditedValue(value);
  };

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove cabeçalho "data:image/..." se quiser
        const base64 = result.replace(/^data:\w+\/\w+;base64,/, "");
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSave = (field: string) => {
    // Atualiza localmente
    setUserDataServer((prev: any) => ({
      ...prev,
      [field]: editedValue,
    }));

    // Faz PATCH no servidor
    fetch(`${apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: editedValue }),
    }).catch((error) => console.error("Erro ao salvar dados:", error));

    // Fecha o modo de edição
    setEditField(null);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const base64String = await fileToBase64(file);
        console.log(base64String);
        // Faz upload da foto para o seu servidor
        const response = await fetch(`/api/postProfilePic/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: base64String }),
        });

        if (!response.ok) {
          throw new Error("Erro ao fazer upload da foto");
        }

        const data = await response.json();
        console.log(data);
        // Atualiza a foto de perfil localmente (dados retornados do servidor)
        setUserData((prev) => ({
          ...prev!,
          profileImageUrl: data.newProfileImageUrl,
        }));

        alert("Foto de perfil atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
        alert("Erro ao atualizar a foto. Tente novamente.");
      } finally {
        setUploading(false);
      }
    }
  };

  const iconMapping: { [key: string]: JSX.Element } = {
    linkedin: <FaLinkedin className="text-3xl mr-8" />,
    github: <FaGithub className="text-3xl mr-8" />,
    discord: <FaDiscord className="text-3xl mr-8" />,
  };

  // Fecha o "modo edição" ao clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (editRef.current && !editRef.current.contains(event.target as Node)) {
      setEditField(null);
    }
  };

  useEffect(() => {
    if (editField) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editField]);

  return (
    <div className="bg-[#00001A]">
      {userData ? (
        <div className="w-[20%]">
          {/* Foto do Usuário */}
          <div className="relative group">
            <img
              src={userData.profileImageUrl}
              alt={`${userData.name}'s profile`}
              width="full"
              className="rounded-2xl mb-6 shadow-md cursor-pointer"
              onClick={() => {
                console.log("Imagem clicada");
                fileInputRef.current?.click();
              }}
            />
            {/* Texto ao passar o mouse */}
            {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              {uploading ? "Carregando..." : "Clique para editar"}
            </div> */}

            {/* O input "invisível" para upload de foto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              // Em vez de "hidden", use classes que deixam ele invisível mas no DOM
              className="absolute w-0 h-0 opacity-0 pointer-events-auto"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Campos de redes sociais */}
          <div className="flex flex-col">
            {["linkedin", "github", "discord"].map((field) => (
              <div
                key={field}
                className="flex bg-[#1B1B1B] font-fustat text-xl p-2 cursor-pointer mb-3 rounded-md shadow-md"
                onClick={() => handleEdit(field, userDataServer[field])}
              >
                {iconMapping[field]}@
                {editField === field ? (
                  <div ref={editRef}>
                    <input
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      className="bg-gray-700 text-white rounded w-[70%] p-1"
                    />
                    <button
                      onClick={() => handleSave(field)}
                      className="ml-2 bg-green-600 text-white w-12 text-md py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  userDataServer[field]
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}
    </div>
  );
};

export default DadosUsuario;
