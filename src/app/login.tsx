// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useSignIn, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Mountains from "../../public/Mountains-darkmode.png";
import LogoFull from "../../public/logo-full.svg";
import RadarComponent from "./components/radarChart";

export default function LoginPage() {
  return (
    <div className="flex h-screen white">
      <RadarComponent />
    </div>
  );
}
