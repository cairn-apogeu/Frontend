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
}

const TopUsersByXP: React.FC<TopUsersByXPProps> = ({
  area,
  showTotalXP = false,
  topUsersTotal,
  topUsersArea,
  userRank,
  userTotalRank,
}) => {
  return (
    <div className="w-[80%] h-[full] flex flex-col justify-center items-center gap-3.5 mx-auto">
      {showTotalXP ? (
        <>
          <div className="self-stretch text-white text-[32px] font-semibold font-['Fustat'] leading-loose">
            Top 3 Usuários com mais XP Total
          </div>
          <div className="self-stretch h-[0px] border border-[#eeeeee]/10"></div>
          <div className="self-stretch justify-between items-start inline-flex mb-10">
            {topUsersTotal.map((user, index) => (
              <div
                key={user.userId}
                className="w-72 px-6 py-4 bg-[#1b1b1b] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex"
              >
                <img
                  className="w-36 h-36 rounded-[5px]"
                  src={user.profileImageUrl || "https://via.placeholder.com/144x144"}
                  alt={user.name || "Usuário"}
                />
                <div className="w-60 h-16 flex-col justify-between items-center flex">
                  <div className="self-stretch justify-start items-center gap-1 inline-flex">
                    <div className="text-[#4db8ff] text-[32px] font-semibold font-['Fustat'] leading-loose">
                      #{index + 1}
                    </div>
                    <div className="text-white text-[32px] font-semibold font-['Fustat'] leading-loose w-full truncate">
                      {user.name || "Usuário"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {userTotalRank && (
              <div className="w-72 px-6 py-4 bg-[#1b1b1b] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex">
                <img
                  className="w-36 h-36 rounded-[5px]"
                  src={topUsersTotal.find(user => user.userId === user.userId)?.profileImageUrl || "https://via.placeholder.com/144x144"}
                  alt="Você"
                />
                <div className="w-60 h-16 flex-col justify-between items-start flex">
                  <div className="self-stretch justify-start items-center gap-[26px] inline-flex">
                    <div className="text-[#4db8ff] text-[32px] font-semibold font-['Fustat'] leading-loose">
                      #{userTotalRank}
                    </div>
                    <div className="text-white text-[32px] font-semibold font-['Fustat'] leading-loose">
                      Você
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="self-stretch text-white text-[32px] font-semibold font-['Fustat'] leading-loose">
            Top 3 {area}
          </div>
          <div className="self-stretch h-[0px] border border-[#eeeeee]/10"></div>
          <div className="self-stretch justify-between items-start inline-flex mb-10">
            {topUsersArea.map((user, index) => (
              <div
                key={user.userId}
                className="w-72 px-6 py-4 bg-[#1b1b1b] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex"
              >
                <img
                  className="w-36 h-36 rounded-[5px]"
                  src={user.profileImageUrl || "https://via.placeholder.com/144x144"}
                  alt={user.name || "Usuário"}
                />
                <div className="w-60 h-16 flex-col justify-between items-start flex">
                  <div className="self-stretch justify-start items-center gap-1 inline-flex">
                    <div className="text-[#4db8ff] text-[32px] font-semibold font-['Fustat'] leading-loose">
                      #{index + 1}
                    </div>
                    <div className="text-white text-[32px] font-semibold font-['Fustat'] leading-loose w-full truncate">
                      {user.name || "Usuário"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {userRank && (
              <div className="w-72 px-6 py-4 bg-[#1b1b1b] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-col justify-center items-center gap-6 inline-flex">
                <img
                  className="w-36 h-36 rounded-[5px]"
                  src={topUsersArea.find(user => user.userId === user.userId)?.profileImageUrl || "https://via.placeholder.com/144x144"}
                  alt="Você"
                />
                <div className="w-60 h-16 flex-col justify-between items-start flex">
                  <div className="self-stretch justify-start items-center gap-[26px] inline-flex">
                    <div className="text-[#4db8ff] text-[32px] font-semibold font-['Fustat'] leading-loose">
                      #{userRank}
                    </div>
                    <div className="text-white text-[32px] font-semibold font-['Fustat'] leading-loose">
                      Você
                    </div>
                  </div>
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