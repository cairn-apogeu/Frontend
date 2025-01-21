'use client'
import SideNav from "../components/sideNav";
import DadosUsuario from "./components/userData";

export default function Project() {
    return (
      <div className="flex min-h-screen min-w-screen bg-[#141414]">
        <SideNav />
        <div className="flex flex-col gap-11 w-full h-fit ml-16 p-14">
            <div className="flex flex-row w-full justify-between">
                <DadosUsuario />
            </div>
        </div>
      </div>
    );
  }
  