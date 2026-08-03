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
      className="py-4 md:py-8 overflow-hidden bg-[var(--gsap-green)] flex items-center border-y-2 border-[var(--dark)]"
      style={{ minHeight: "10vh" }}
    >
      <div 
        ref={textRef} 
        className="flex gap-8 md:gap-16 whitespace-nowrap will-change-transform font-sans font-black uppercase text-[var(--dark)] opacity-90"
        style={{ width: "max-content", fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
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
