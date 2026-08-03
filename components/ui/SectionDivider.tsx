/**
 * Section Divider — Inan Infinites
 * 
 * The brand diamond ◆ motif with horizontal rules and tagline text.
 * DrawSVGPlugin animates the rules drawing in on scroll-enter.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap-plugins skill: register before use
gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

interface SectionDividerProps {
  variant?: "navy" | "cream" | "neon";
  showTagline?: boolean;
  className?: string;
}

export default function SectionDivider({
  variant = "navy",
  showTagline = true,
  className = "",
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<SVGLineElement>(null);
  const lineRightRef = useRef<SVGLineElement>(null);
  const diamondRef = useRef<SVGPathElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const color = variant === "navy" ? "#0B1F3F" : variant === "neon" ? "#8ae614" : "#FAFAF8";
  const dimColor = variant === "navy" ? "rgba(11,31,63,0.35)" : variant === "neon" ? "rgba(138,230,20,0.35)" : "rgba(250,250,248,0.35)";

  // gsap-react skill: useGSAP for proper cleanup
  useGSAP(
    () => {
      if (!lineLeftRef.current || !lineRightRef.current) return;

      // DrawSVGPlugin pattern (gsap-plugins skill): draw from 0 to full stroke
      gsap.set([lineLeftRef.current, lineRightRef.current], {
        drawSVG: "0% 0%",
      });

      // gsap-timeline skill: timeline sequences the components
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          once: true,
          toggleActions: "play none none none",
        },
        defaults: { ease: "power2.inOut" },
      });

      tl.to(lineLeftRef.current, { drawSVG: "0% 100%", duration: 0.8 }, 0)
        .to(lineRightRef.current, { drawSVG: "0% 100%", duration: 0.8 }, 0)
        .from(diamondRef.current, { scale: 0, autoAlpha: 0, duration: 0.4, ease: "back.out(2)" }, 0.4);

      // Only animate tagline if the element is mounted (showTagline=true)
      if (taglineRef.current) {
        tl.from(taglineRef.current, { autoAlpha: 0, y: 6, duration: 0.5 }, 0.6);
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center gap-3 py-8 ${className}`}
      aria-hidden="true"
    >
      {/* SVG rule + diamond */}
      <svg
        viewBox="0 0 320 20"
        width="320"
        height="20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        {/* Left rule */}
        <line
          ref={lineLeftRef}
          x1="0"
          y1="10"
          x2="145"
          y2="10"
          stroke={dimColor}
          strokeWidth="0.75"
        />

        {/* Diamond */}
        <path
          ref={diamondRef}
          d="M160 4 L166 10 L160 16 L154 10 Z"
          fill={color}
          opacity="0.7"
        />

        {/* Right rule */}
        <line
          ref={lineRightRef}
          x1="175"
          y1="10"
          x2="320"
          y2="10"
          stroke={dimColor}
          strokeWidth="0.75"
        />
      </svg>

      {showTagline && (
        <p
          ref={taglineRef}
          className="tagline-rule text-xs tracking-widest"
          style={{ color: dimColor }}
        >
          <span>INNOVATE</span>
          <span style={{ color: color }}>◆</span>
          <span>INSPIRE</span>
          <span style={{ color: color }}>◆</span>
          <span>INFINITE</span>
        </p>
      )}
    </div>
  );
}
