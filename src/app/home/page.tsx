"use client";

import SideNav from "@/app/components/sideNav";
import ProjectCards from "./components/projetosUsuario";

export default function Home() {

  return (
    <div className="flex min-h-screen min-w-screen bg-[#141414]">
      <SideNav />
      <div className="flex flex-col gap-11 w-full h-fit ml-16 p-14">
        <ProjectCards userId="user_2pwyg7ytpVO7SDcg8tUsCVTkmnR" />
      </div>
    </div>
  );
}
