import { UserData } from "@/app/components/graphsTypes";
import Image from "next/image";
import React from "react";

interface TopUsersByXPProps {
  user: UserData;
}

const UserProfile: React.FC<TopUsersByXPProps> = ({ user }) => {
  return (
    <div
      key={user.id}
      className="w-64 md:w-56 lg:w-64 bg-[#1b1b1b] rounded-lg shadow-md p-4 flex flex-col items-center gap-3"
    >
      <Image
        width={1000}
        height={1000}
        className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full"
        src={user.profileImageUrl || "https://via.placeholder.com/144x144"}
        alt={user.name || "Usuário"}
      />
      <div className="text-center">
        <p className="text-white text-sm md:text-base lg:text-lg font-semibold truncate">
          {user.name || "Usuário"}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
