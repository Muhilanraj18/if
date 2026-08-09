/**
 * Preloader — Inan Infinites
 * 
 * SVG stroke draw animation of the "ih" monogram and flame tick,
 * followed by a full-page mask-open wipe to reveal the hero.
 * 
 * Uses DrawSVGPlugin (gsap-plugins skill) + gsap.timeline (gsap-timeline skill).
 * Respects prefers-reduced-motion: calls onComplete immediately if true.
 */

"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(DrawSVGPlugin);

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<SVGPathElement>(null);
  const stemIRef = useRef<SVGRectElement>(null);
  const stemHRef = useRef<SVGRectElement>(null);
  const archRef = useRef<SVGPathElement>(null);
  const wordmarkRef = useRef<SVGTextElement>(null);
  const taglineRef = useRef<SVGTextElement>(null);

  // gsap-react skill: useGSAP ensures cleanup on unmount
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Reduced-motion: skip animation entirely
        onComplete();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!flameRef.current || !stemIRef.current) return;

        // Start all paths at drawSVG 0 (nothing drawn)
      // gsap-plugins skill: DrawSVGPlugin pattern — from 0% to full stroke
      const paths = [
        flameRef.current,
        archRef.current,
      ].filter(Boolean);

      if (!paths.length) return;

      gsap.set(paths, { drawSVG: "0% 0%", autoAlpha: 1 });
      gsap.set([wordmarkRef.current, taglineRef.current].filter(Boolean), { autoAlpha: 0 });

        // gsap-timeline skill: sequence with position parameter
        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete() {
            // Mask wipe: slide the preloader up off screen
            gsap.to(maskRef.current, {
              yPercent: -100,
              duration: 0.9,
              ease: "power4.inOut",
              onComplete,
            });
          },
        });

        // 1. Draw the flame tick (gsap-plugins DrawSVG)
        if (flameRef.current) {
          tl.to(flameRef.current, { drawSVG: "0% 100%", duration: 0.5 });
        }

        // 2. Draw "h" arch
        if (archRef.current) {
          tl.to(archRef.current, { drawSVG: "0% 100%", duration: 0.7 }, "<0.2");
        }

        // 3. Fade wordmark in
        if (wordmarkRef.current) {
          tl.to(wordmarkRef.current, { autoAlpha: 1, duration: 0.4 }, "+=0.1");
        }
        if (taglineRef.current) {
          tl.to(taglineRef.current, { autoAlpha: 1, duration: 0.35 }, "<0.15");
        }

        // 4. Hold briefly
        tl.to({}, { duration: 0.5 });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={maskRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--dark)" }}
      aria-label="Loading Inan Infinites"
      role="status"
      suppressHydrationWarning
    >
      <div ref={containerRef} className="flex flex-col items-center gap-6" suppressHydrationWarning>
        {/* SVG monogram — stroke-only paths for DrawSVG */}
        <svg
          viewBox="0 0 90 90"
          width="120"
          height="120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Flame tick — needs stroke + stroke-width for DrawSVG (gsap-plugins) */}
          <path
            ref={flameRef}
            d="M30 10 C30 10 22 20 22 28 C22 34 25.5 37.5 30 37.5 C34.5 37.5 38 34 38 28 C38 20 30 10 30 10 Z"
            stroke="var(--gsap-green)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* "i" stem */}
          <rect
            ref={stemIRef as React.RefObject<SVGRectElement>}
            x="27"
            y="42"
            width="6"
            height="40"
            rx="3"
            stroke="var(--light)"
            strokeWidth="2"
            strokeLinecap="round"
            // Rect needs to be cast for DrawSVG — use path equivalent via stroke
          />

          {/* "h" left stem */}
          <rect
            ref={stemHRef as React.RefObject<SVGRectElement>}
            x="46"
            y="42"
            width="6"
            height="40"
            rx="3"
            stroke="var(--light)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* "h" arch */}
          <path
            ref={archRef}
            d="M52 56 C52 48 58 44 63 44 C68 44 74 48 74 56 L74 82 L68 82 L68 56 C68 52 65.5 49.5 63 49.5 C60.5 49.5 58 52 58 56 L58 82 L52 82"
            stroke="var(--light)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Wordmark */}
        <svg
          viewBox="0 0 280 50"
          width="240"
          height="40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <text
            ref={wordmarkRef}
            x="140"
            y="28"
            fontFamily="var(--font-sans)"
            fontSize="18"
            fontWeight="900"
            letterSpacing="2"
            fill="var(--light)"
            textAnchor="middle"
          >
            INAN INFINITES
          </text>
          <text
            ref={taglineRef}
            x="140"
            y="44"
            fontFamily="var(--font-mono)"
            fontSize="8"
            fontWeight="700"
            letterSpacing="4"
            fill="var(--gsap-green)"
            textAnchor="middle"
          >
            // INITIALIZING SYSTEM...
          </text>
        </svg>
      </div>
    </div>
  );
}
