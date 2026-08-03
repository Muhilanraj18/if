"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TextMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      
      // Moving in horizontal direction when scrolling
      gsap.to(textRef.current, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Tie it directly to the scrollbar
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-24 overflow-hidden bg-[var(--gsap-green)] flex items-center border-y-2 border-[var(--dark)]"
      style={{ minHeight: "20vh" }}
    >
      <div 
        ref={textRef} 
        className="flex gap-16 md:gap-32 whitespace-nowrap will-change-transform font-sans font-black uppercase text-[var(--dark)] opacity-90"
        style={{ width: "max-content", fontSize: "clamp(4rem, 15vw, 12rem)", letterSpacing: "-0.05em", lineHeight: 0.8 }}
      >
        <span>WE ARE INAN INFINITES.</span>
        <span className="opacity-50">{"//"}</span>
        <span>WE BUILD THE FUTURE.</span>
        <span className="opacity-50">{"//"}</span>
        <span>WE ARE INAN INFINITES.</span>
        <span className="opacity-50">{"//"}</span>
        <span>WE BUILD THE FUTURE.</span>
      </div>
    </section>
  );
}
