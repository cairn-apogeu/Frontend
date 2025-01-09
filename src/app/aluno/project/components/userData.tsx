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

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/getUser?userId=${id}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    async function fetchDadoUsuario() {
      try {
        const response = await fetch(`${apiUrl}/users/${id}`);
        const data = await response.json();
        setUserDataServer(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    fetchDadoUsuario();
    fetchUserData();
  }, [id]);

  const handleEdit = (field: string, value: string) => {
    setEditField(field);
    setEditedValue(value);
  };

  const handleSave = (field: string) => {
    setUserDataServer((prev: any) => ({
      ...prev,
      [field]: editedValue,
    }));

    fetch(`${apiUrl}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: editedValue }),
    }).catch((error) => console.error("Erro ao salvar dados:", error));

    setEditField(null);
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        // Faça o upload para o Clerk (ou sua API)
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${apiUrl}/users/${id}/upload-photo`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erro ao fazer upload da foto");
        }

        const data = await response.json();

        // Atualize a foto de perfil localmente
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
              onClick={() =>
                document.getElementById("photoUploadInput")?.click()
              }
            />
            {/* Texto ao passar o mouse */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              {uploading ? "Carregando..." : "Clique para editar"}
            </div>
          </div>
          <input
            id="photoUploadInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Campos de redes sociais */}
          <div className="flex flex-col">
            {["linkedin", "github", "discord"].map((field) => (
              <div
                key={field}
                className="flex bg-[#1B1B1B] font-fustat text-xl p-2 cursor-pointer mb-3 rounded-md shadow-md "
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
