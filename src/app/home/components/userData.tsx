import axiosInstance from "@/app/api/axiosInstance";
import { useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoLogoDiscord, IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

interface UserMetadata {
  linkedin?: string;
  github?: string;
  discord?: string;
}

interface UserData {
  profileImageUrl: string;
}

const DadosUsuario = () => {
  const [metadata, setMetadata] = useState<UserMetadata | null>(null);
  const [editField, setEditField] = useState<keyof UserMetadata | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const editRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<UserData>({
    profileImageUrl: "/default-profile.png",
  });

  useEffect(() => {
    if (!user) return;

    // Buscar metadados do backend usando Axios
    const fetchMetadata = async () => {
      try {
        const response = await axiosInstance.get<UserMetadata>(`/users/${user.id}`);
        setMetadata(response.data);
      } catch (error) {
        console.error("Erro ao buscar metadados do usuário:", error);
      }
    };

    fetchMetadata();
  }, [user]);

  const handleEdit = (field: keyof UserMetadata, value: string) => {
    setEditField(field);
    setEditedValue(value);
  };

  const handleSave = async (field: keyof UserMetadata) => {
    if (!user || !metadata) return;

    try {
      // Atualizar metadados no backend
      const updatedMetadata = { ...metadata, [field]: editedValue };
      await axiosInstance.put(`/users/${user.id}`, updatedMetadata);

      // Atualizar estado local após sucesso
      setMetadata(updatedMetadata);
      setEditField(null);
    } catch (error) {
      console.error("Erro ao salvar dados no backend:", error);
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }

    if (file) {
      setUploading(true);
      try {
        const result = await user.setProfileImage({ file });
        console.log("Imagem de perfil atualizada:", result);

        // Atualizar localmente a URL da imagem
        setUserData((prev) => ({
          ...prev,
          profileImageUrl: result.publicUrl || prev.profileImageUrl,
        }));
      } catch (error) {
        console.error("Erro ao atualizar a imagem de perfil:", error);
      } finally {
        setUploading(false);
      }
    }
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

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/getUser?userId=${user?.id}`);
        const data = await response.json();
        console.log(response);
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }

    if (user?.id) {
      fetchUserData();
    }
  }, [user, uploading]);

  if (!isSignedIn || !user || !metadata) {
    return <p>Carregando dados do usuário...</p>;
  }

  const iconMapping: { [key in keyof UserMetadata]: JSX.Element } = {
    linkedin: <IoLogoLinkedin className="min-w-7 h-7" />,
    github: <IoLogoGithub className="min-w-7 h-7" />,
    discord: <IoLogoDiscord className="min-w-7 h-7"/>,
  };

  return (
    <div className="w-[13%]">
      {/* Foto do Usuário */}
      <div className="">
        <Image
          src={userData?.profileImageUrl}
          alt={`${user.fullName}'s profile`}
          width={500}
          height={500}
          className="rounded-2xl mb-7 w-full shadow-lg cursor-pointer hover:opacity-50"
          onClick={() => fileInputRef.current?.click()}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="absolute w-0 h-0 opacity-0 pointer-events-auto"
          onChange={handlePhotoUpload}
        />
      </div>

      {/* Campos de redes sociais */}
      <div className="flex flex-col">
        {(["linkedin", "github", "discord"] as (keyof UserMetadata)[]).map(
          (field) => (
            <div
              key={field}
              className="flex bg-[#1B1B1B]  px-2 py-1 items-center text-sm font-fustat font-light cursor-pointer mb-2 rounded-md shadow-lg"
              onClick={() => handleEdit(field, metadata[field] || "")}
            >
              {iconMapping[field]}<p className="ml-5">@</p>
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
                    className="ml-2 bg-green-600 text-white w-6 text-md py-1 rounded"
                  >
                    Ok
                  </button>
                </div>
              ) : (
                <p className="truncate">{metadata[field] || "Não informado"}</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DadosUsuario;
