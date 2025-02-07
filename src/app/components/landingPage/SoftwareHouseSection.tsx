"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"; // Ícones para dropdown

const dropdownItems = [
  {
    title: "💰 Metade do valor, sem perder qualidade.",
    content:
      "A Apogeu entrega tecnologia sob medida a um custo menor que software houses tradicionais, garantindo eficiência e inovação.",
  },
  {
    title: "🚀 formação de talentos.",
    content:
      "Nosso modelo une aprendizado baseado em projetos (PBL) e mentoria de desenvolvedores seniores, reduzindo custos sem comprometer qualidade.",
  },
  {
    title: "✅ Código validado por especialistas.",
    content:
      "Cada entrega passa por uma revisão rigorosa, garantindo soluções robustas, seguras e escaláveis.",
  },
  {
    title: "📈 Seu projeto, do jeito certo.",
    content:
      "Desenvolvemos com transparência total, entregando tecnologia eficiente e resultados reais para o seu negócio.",
  },
];

const SoftwareHouseSection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefs = useRef<Array<HTMLDivElement | null>>([]);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showDetails) {
      gsap.to(titleRef.current, {
        x: isMobile ? 0 : -50,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.2 }
      );

      itemRefs.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: index * (isMobile ? 0.3 : 0.5) }
        );
      });
    } else {
      gsap.to(detailsRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => setShowDetails(false),
      });

      gsap.to(titleRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [showDetails, isMobile]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const toggleDropdown = (index: number) => {
    const isOpen = expandedIndex === index;

    if (isOpen) {
      gsap.to(dropdownRefs.current[index], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setExpandedIndex(null),
      });
    } else {
      if (expandedIndex !== null) {
        gsap.to(dropdownRefs.current[expandedIndex], {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        });
      }

      setExpandedIndex(index);
      gsap.fromTo(
        dropdownRefs.current[index],
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  };
  console.log(!isMobile || !showDetails);
  

  return (
    <div className="new-content inset-0 mb-[41vh] flex flex-wrap gap-6 flex-row items-start justify-center text-start z-10">
      <div
        ref={titleRef}
        className={`flex flex-col ${
          showDetails ? "md:w-[30%] md:items-start" : "items-center"
        } justify-start h-full`}
      >
        <h2 className={`text-3xl md:text-4xl text-white font-fustat font-bold ${!showDetails || isMobile && "text-center"}`}>
          A Software House{" "}
          <span className="text-[#4DB8FF]">Mais inovadora</span>
        </h2>
        {!isMobile || !showDetails ? (
            <button
          className={`mt-6 py-2 px-4 md:px-6 bg-transparent border border-[#eee] text-[#eee] rounded-lg text-sm md:text-lg font-semibold transition-all ${
            !showDetails && "self-center"
          } ${showDetails ? "bg-[#4DB8FF] text-[#eee] hover:bg-[#3a96e3]" : "hover:bg-[#4DB8FF]"}`}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Entendi!" : "Porque?"}
        </button>
        ): null}
      </div>

      {showDetails && (
        <div ref={detailsRef} className={`details-content flex flex-col ${isMobile ? "w-full" : "w-[30%]"} items-start justify-start h-full gap-2`}>
          {dropdownItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              className="w-full rounded-lg transition-all py-2 px-3"
            >
              <button
                className={`w-full text-white text-md md:text-lg font-semibold flex justify-between items-center ${
                  expandedIndex === index ? " text-white scale-105" : "bg-transparent"
                }`}
                onClick={() => toggleDropdown(index)}
              >
                {item.title}
                {expandedIndex === index ? (
                  <MdKeyboardArrowUp className="text-lg transition-transform duration-300" />
                ) : (
                  <MdKeyboardArrowDown className="text-lg transition-transform duration-300" />
                )}
              </button>

              <div
                ref={(el) => {
                  if (el) dropdownRefs.current[index] = el;
                }}
                className="overflow-hidden font-extralight text-white text-md md:text-lg px-3"
                style={{ height: 0, opacity: 0 }}
              >
                {item.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoftwareHouseSection;
