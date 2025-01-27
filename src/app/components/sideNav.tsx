"use client";
import React, { useState } from "react";
import {
  IoHome,
  IoPeople,
  IoCodeSlash,
} from "react-icons/io5"; // Importe os ícones do Ionicons
import Link from "next/link";
import Image from "next/image";
import LogoFull from "../../../public/logo-full.svg";
import Logo from "../../../public/logo-apogeu.svg";
import LogOutButton from "./logout";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/home",
    icon: <IoHome className="h-8 w-8" />,
  },
  {
    label: "Comunidade",
    href: "/communit",
    icon: <IoPeople className="h-8 w-8" />,
  },
  {
    label: "Apogeu Codes",
    href: "/user",
    icon: <IoCodeSlash className="h-8 w-8" />,
  },
];

const SideNav: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`bg-[#1B1B1B] rounded-r-3xl fixed shadow-xl text-white h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-6">
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <Image src={LogoFull} alt="logo" className="h-9" />
          ) : (
            <Image src={Logo} alt="logo" className="w-11 h-9" />
          )}
        </button>
      </div>
      <nav className="flex flex-col h-full mt-28 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 hover:bg-gray-700 transition-colors duration-200 ${
              isExpanded ? "justify-start ml-7 space-x-4" : "justify-center"
            }`}
          >
            {item.icon}
            {isExpanded && <span>{item.label}</span>}
          </Link>
        ))}
        <div className="flex flex-col justify-around h-full">
          <LogOutButton isExpanded={isExpanded} />
        </div>
      </nav>
    </aside>
  );
};

export default SideNav;
