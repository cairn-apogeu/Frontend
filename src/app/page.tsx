"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DarkMontainSVG from "../../public/Dark-Montain-SVG.svg";
import MinDarkMontainSVG from "../../public/Dark-Montain-SVG-min.svg";
import Image from "next/image";
import LogoFull from "../../public/logo-full.svg";
import Link from "next/link";
import { getCalApi } from "@calcom/embed-react";
import SoftwareHouseSection from "./components/landingPage/SoftwareHouseSection";
import Laptop3D from "./components/landingPage/Laptop3d";

export default function InteractivePage() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState(false);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showDetails) {
      // Ajusta a posição inicial do título antes de animar
      gsap.set(titleRef.current, { x: 0 });

      // Animação para mover título e botão suavemente para a esquerda
      gsap.to(titleRef.current, {
        x: -50, // Move para a esquerda
        duration: 0.6,
        ease: "power3.out",
      });

      // Animação para exibir os detalhes suavemente
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.2 }
      );
    } else {
      // Animação para esconder os detalhes antes de removê-los
      gsap.to(detailsRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => setShowDetails(false),
      });

      // Retorna o título para o centro
      gsap.to(titleRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [showDetails]);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({
        namespace: "reuniao-de-apresentacao-de-projeto",
      });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#1b1b1b" },
          dark: { "cal-brand": "#4DB8FF" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Animação da montanha
    gsap.to(".mountain-image", {
      scale: isMobile ? 2 : 1.5,
      y: isMobile ? "90%" : "90%",
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom top",
        scrub: true,
        anticipatePin: 1,
      },
    });

    gsap.to(".mountain-image-2", {
      scale: 1,
      y: isMobile ? "95%" : "95%",
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".container",
        start: "top top",
        end: "bottom top",
        scrub: true,
        anticipatePin: 1,
      },
    });

    // Animações para cada seção "novo conteúdo"
    const newContents = document.querySelectorAll(".new-content");

    newContents.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, scale: 0.75 },
        {
          opacity: 1,
          scale: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: section, // Cada seção é o gatilho da sua animação
            start: "top 90%", // Inicia mais cedo para fluidez
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const handleScroll = () => {
    window.scrollTo({
      top: window.scrollY + 300, // Ajuste o valor 500 para a distância que deseja rolar
      behavior: "smooth",
    });
  };

  return (
    <div className="container relative px-6 md:px-14 py-5 min-h-[200vh] min-w-full w-full overflow-hidden bg-[#141414]">
      {/* Header fixo */}
      <div className="fixed left-0 px-6 md:px-14 flex flex-row w-full items-center justify-between z-50">
        <Image src={LogoFull} alt="logo" className="w-28 md:w-40" />
        <Link
          href={"/login"}
          className="bg-[#1b1b1b] px-4 md:px-6 py-2 text-sm md:text-xl rounded-md font-fustat font-medium shadow-md"
        >
          Login
        </Link>
      </div>

      {/* Imagem da montanha */}
      <div
        className={`mountain-image fixed -bottom-20 max-sm:-bottom-0 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none ${
          isMobile ? "w-[150%]" : "w-full"
        } h-auto`}
      >
        <Image
          src={DarkMontainSVG}
          alt="Montanha"
          layout="intrinsic"
          objectFit="cover"
          className="w-full h-auto max-sm:w-[1500px]"
          priority
        />
      </div>

      <div
        className={`flex flex-row items-end mountain-image-2 scale-50 fixed -bottom-20 max-sm:-bottom-0 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none ${
          isMobile ? "w-[150%]" : "w-full"
        } h-auto`}
      >
        <Image
          src={MinDarkMontainSVG}
          alt="Montanha"
          layout="intrinsic"
          objectFit="cover"
          className="w-full h-auto max-sm:w-[1500px]"
          priority
        />
        <div className="w-[50%] -left-96 absolute bg-[#090A0C] -z-10 h-[48%]"></div>
        <div className="w-[50%] -right-96 absolute bg-[#090A0C] -z-10 h-[52%]"></div>
      </div>

      {/* Conteúdo inicial */}
      <div className="current-content flex flex-col mt-[20vh] mb-[41vh] z-50 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl w-full md:w-2/3 text-[#eee] font-fustat font-bold mx-auto md:mx-0">
          Transforme sua empresa{" "}
          <span className="text-[#4DB8FF]">em uma máquina de inovação.</span>
        </h1>
        <p className="text-sm md:text-lg mt-4 md:mt-0 mb-6 text-[#646464] mx-auto md:mx-0">
          Soluções sob medida que aumentam sua eficiência e reduzem seus custos.
        </p>
        <div className="flex flex-wrap flex-col md:flex-row gap-4 md:gap-8 items-center justify-center md:justify-start">
          <button
            data-cal-namespace="reuniao-de-apresentacao-de-projeto"
            data-cal-link="paulo-octavio-paula/reuniao-de-apresentacao-de-projeto"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="py-2 md:py-3 px-4 md:px-6 bg-[#eee] text-[#141414] rounded-lg text-sm md:text-lg font-semibold hover:bg-[#0070bb] transition-all"
          >
            Iniciar Jornada Gratuitamente
          </button>
          <button
            onClick={handleScroll}
            className="py-2 md:py-4 px-4 md:px-6 bg-transparent border border-[#eee] text-[#eee] rounded-lg text-sm md:text-lg font-semibold hover:bg-[#0070bb] transition-all"
          >
            Conhecer Melhor
          </button>
        </div>
      </div>

      {/* Seções de conteúdo novo */}

      <SoftwareHouseSection />

        <Laptop3D />


      <div className="new-content inset-0 flex flex-wrap flex-col mb-[41vh] items-center justify-center text-center z-10 scale-75">
        <h2 className="text-3xl md:text-4xl text-white font-fustat font-bold">
          Estudo aprofundado{" "}
          <span className="text-[#4DB8FF]">do seu mercado</span>
        </h2>
      </div>

      <div className="new-content  inset-0 flex flex-wrap flex-col mb-[41vh] items-center justify-center text-center z-10 scale-75">
        <h2 className="text-3xl md:text-4xl text-white font-fustat font-bold">
          Criação de{" "}
          <span className="text-[#4DB8FF]">design e brandkit profissional</span>
        </h2>
      </div>

      <div className="new-content  inset-0 flex flex-wrap flex-col mb-[41vh] items-center justify-center text-center z-10 scale-75">
        <h2 className="text-3xl md:text-4xl text-white font-fustat font-bold">
          Apresentações periódicas da{" "}
          <span className="text-[#4DB8FF]">evolução do seu projeto</span>
        </h2>
      </div>

      <div className="new-content  inset-0 flex flex-wrap flex-col mb-[41vh] items-center justify-center text-center z-10 scale-75">
        <h2 className="text-3xl md:text-4xl text-white font-fustat font-bold">
          <span className="text-[#4DB8FF]">100% </span>
          de transparencia
        </h2>
      </div>

      <div className="new-content  inset-0 flex flex-wrap flex-col mb-[80vh] items-center justify-center text-center z-10 scale-75">
        <h2 className="text-3xl md:text-4xl text-white font-fustat font-bold">
          Metodologia de{" "}
          <span className="text-[#4DB8FF]">desenvolvimento ágil</span>
        </h2>
      </div>

      <div className="new-content  inset-0 flex flex-wrap flex-col mb-[80vh] items-center justify-center text-center z-10 scale-75">
        <h2 className="text-3xl md:text-4xl text-white font-fustat font-bold">
          Documentação{" "}
          <span className="text-[#4DB8FF]">robusta e diagramada</span>
        </h2>
      </div>
    </div>
  );
}
