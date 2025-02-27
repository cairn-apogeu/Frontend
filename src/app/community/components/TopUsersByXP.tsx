import Image from "next/image";
import React from "react";

interface UserXP {
  userId: string;
  xp: number;
  name?: string;
  profileImageUrl?: string;
  rank?: number;
  area?: string;
}

interface TopUsersByXPProps {
  area?: string;
  showTotalXP?: boolean;
  topUsersTotal: UserXP[];
  topUsersArea: UserXP[];
  userRank: number | null;
  userTotalRank: number | null;
  userId: string;
}

const TopUsersByXP: React.FC<TopUsersByXPProps> = ({
  area,
  showTotalXP = false,
  topUsersTotal,
  topUsersArea,
  userRank,
  userTotalRank,
  userId,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 p-4">
      {showTotalXP ? (
        <>
          <h2 className="text-white text-lg md:text-2xl font-semibold text-center">
            Top 3 Usuários com mais XP Total
          </h2>
          <div className="border-t border-gray-700 my-4"></div>
          <div className="flex justify-center gap-4">
            {topUsersTotal.slice(0, 3).map((user, index) => (
              <div
                key={user.userId}
                className="w-1/4 bg-[#1b1b1b] rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                <Image
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-36 md:h-36 rounded-md"
                  src={
                    user.profileImageUrl ||
                    "https://via.placeholder.com/144x144"
                  }
                  alt={user.name || "Usuário"}
                />
                <div className="mt-2 text-center truncate">
                  <p className="text-[#4db8ff] text-xl md:text-2xl font-semibold max-w-xs overflow-hidden whitespace-nowrap truncate">
                    #{index + 1}
                  </p>
                  <p className="text-white text-lg md:text-xl max-w-56 overflow-hidden whitespace-nowrap truncate">
                    {user.name || "Usuário"}
                  </p>
                </div>
              </div>
            ))}
            {userTotalRank && (
              <div className="w-1/4 bg-[#1b1b1b] rounded-lg shadow-lg p-4 flex flex-col items-center">
                <Image
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-36 md:h-36 rounded-md"
                  src={
                    topUsersTotal.find((user) => user.userId === userId)
                      ?.profileImageUrl || "https://via.placeholder.com/144x144"
                  }
                  alt="Você"
                />
                <div className="mt-2 text-center truncate">
                  <p className="text-[#4db8ff] text-xl md:text-2xl font-semibold max-w-xs overflow-hidden whitespace-nowrap truncate">
                    #{userTotalRank}
                  </p>
                  <p className="text-white text-lg md:text-xl truncate">Você</p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-white text-lg md:text-2xl font-semibold text-center">
            Top 3 {area === "datalytics" ? "Data Analytics" : area}
          </h2>
          <div className="border-t border-gray-700 my-4"></div>
          <div className="flex max-sm:flex-wrap justify-center gap-4">
            {topUsersArea.slice(0, 3).map((user, index) => (
              <div
                key={user.userId}
                className="w-1/4 bg-[#1b1b1b] rounded-lg shadow-lg p-4 flex flex-col items-center"
              >
                <Image
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-36 md:h-36 rounded-md"
                  src={
                    user.profileImageUrl ||
                    "https://via.placeholder.com/144x144"
                  }
                  alt={user.name || "Usuário"}
                />
                <div className="mt-2 text-center truncate">
                  <p className="text-[#4db8ff] text-xl md:text-2xl font-semibold max-w-xs overflow-hidden whitespace-nowrap truncate">
                    #{index + 1}
                  </p>
                  <p className="text-white text-lg md:text-xl max-w-56 overflow-hidden whitespace-nowrap truncate">
                    {user.name || "Usuário"}
                  </p>
                </div>
              </div>
            ))}
            {userRank && (
                <div className="w-1/4 bg-[#1b1b1b] rounded-lg shadow-lg p-4 flex flex-col items-center">
                  <Image
                    width={128}
                    height={128}
                    className="w-24 h-24 md:w-36 md:h-36 rounded-md"
                    src={
                      topUsersArea.find((user) => user.userId === userId)
                        ?.profileImageUrl || "https://via.placeholder.com/144x144"
                    }
                    alt="Você"
                  />
                  <div className="mt-2 text-center truncate">
                    <p className="text-[#4db8ff] text-xl md:text-2xl font-semibold max-w-xs overflow-hidden whitespace-nowrap truncate">
                      #{userRank}
                    </p>
                    <p className="text-white text-lg md:text-xl truncate">Você</p>
                  </div>
                </div>
              
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopUsersByXP;
