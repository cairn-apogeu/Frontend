"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const Laptop3D = () => {
  const modelRef = useRef<THREE.Group | null>(null);
  const screenRef = useRef<THREE.Object3D | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const { scene } = useGLTF("/laptop.glb");

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const updateSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  useEffect(() => {
    if (!scene) return;

    const modelGroup = scene as THREE.Group;
    modelRef.current = modelGroup;

    const screen = scene.getObjectByName("Ecran_6_5");
    if (screen) {
      screenRef.current = screen;
      screen.rotation.z = Math.PI / 2;
    }
  }, [scene]);

  useEffect(() => {
    if (!screenRef.current || !modelRef.current || !triggerRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top 30%",
        end: "top 10%",
        scrub: true,
      },
    });

    tl.to(screenRef.current.rotation, { z: -Math.PI / 12, ease: "power3.inOut" });
    tl.to(modelRef.current.position, { z: windowSize.width < 768 ? 0: 0.15 , ease: "power3.inOut" }, "<");
    tl.to(modelRef.current.rotation, { y: -Math.PI / 12, ease: "power3.inOut" }, "<");

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: windowSize.width < 768 ? 20 : -150, // 🔹 Texto mais afastado do notebook
        ease: "power3.out",
        duration: 1.5,
      },
      "+=0.5"
    );
  }, [scene, windowSize.width]);

  const scale = useMemo(() => (windowSize.width < 768 ? [2.8, 2.8, 2.8] : [4, 4, 4]), [windowSize.width]);
  const cameraPosition = useMemo(() => (windowSize.width < 768 ? [0, 0.4, 2.2] : [0, 0.5, 2]), [windowSize.width]);
  const textPosition = useMemo(() => (windowSize.width < 768 ? "top-[55%] text-center px-4" : "left-10"), [windowSize.width]);

  return (
    <div ref={triggerRef} className="relative w-full h-screen flex flex-col items-center justify-center">
      <div className="laptop-container absolute w-full h-full flex justify-center items-center">
        <Canvas camera={{ position: cameraPosition, fov: windowSize.width < 768 ? 75 : 50 }}>
          <Environment preset="night" background={false} />

          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, -3]} intensity={1} />

          <group ref={modelRef} position={[0, -0.1, 0]} scale={scale} rotation={[0, Math.PI / 2.1, 0]}>
            <primitive object={scene} />
          </group>
        </Canvas>
      </div>

      {/* Texto responsivo com melhor espaçamento */}
      <div
        ref={textRef}
        className={`absolute flex flex-col gap-3 text-white ${
          windowSize.width < 768 ? "text-sm" : "text-2xl md:text-4xl"
        } font-bold opacity-0 ${textPosition}`}
      >
        <h2 className="text-2xl md:text-4xl font-fustat font-bold leading-tight">
          Acompanhe <span className="text-[#4DB8FF]">Todos os Resultados</span>
        </h2>
        <p className="text-md md:text-lg max-w-lg font-extralight leading-relaxed">
          Uma plataforma para acompanhar com 100% de transparência tudo que está sendo desenvolvido em tempo real e ter
          acesso a uma documentação descritiva de todo o projeto.
        </p>
      </div>
    </div>
  );
};

export default Laptop3D;
