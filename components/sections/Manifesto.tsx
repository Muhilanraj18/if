/**
 * Manifesto Section — Chapter 2: Minimalism
 * 
 * Three pinned scroll steps: "Innovate." / "Inspire." / "Infinite."
 * One line per screen-height of scroll travel, revealed sequentially.
 * DrawSVG animated underline draws under each word as it appears.
 * 
 * Patterns:
 * - gsap-scrolltrigger skill: pinned timeline with scrub, top-level ScrollTrigger
 * - gsap-timeline skill: position parameter controls per-line timing
 * - gsap-core skill: autoAlpha for true visibility toggle
 * - gsap-plugins skill: DrawSVGPlugin for animated underline
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const WORDS = [
  { word: "Innovate.", sub: "We challenge the status quo — building products that didn't exist yesterday.", color: "var(--gsap-green)" },
  { word: "Inspire.",  sub: "Our work moves people, teams, and entire industries forward.",                 color: "var(--gsap-purple)" },
  { word: "Infinite.", sub: "There is no ceiling. Only the next problem worth solving.",                   color: "var(--gsap-teal)" },
];

export default function Manifesto() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const lines       = containerRef.current.querySelectorAll<HTMLElement>(".manifesto-line");
      const underlines  = containerRef.current.querySelectorAll<SVGPathElement>(".manifesto-underline");
      if (!lines.length) return;

      // Set initial states
      gsap.set(lines, { autoAlpha: 0, y: 30 });
      // DrawSVG: start each underline fully hidden (0% to 0%)
      gsap.set(underlines, { drawSVG: "0% 0%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     `+=${lines.length * 120}vh`,
          pin:     true,
          pinSpacing: true,
          scrub:   1.5,
        },
        defaults: { ease: "power2.inOut" },
      });

      lines.forEach((line, i) => {
        const offset    = i / lines.length;
        const outOffset = (i + 0.7) / lines.length;
        const underline = underlines[i];

        // Fade in with scale
        tl.fromTo(line,
          { autoAlpha: 0, y: 40, scale: 1.05 },
          { autoAlpha: 1, y: 0,  scale: 1,    duration: 0.2 },
          offset
        );

        // Draw the underline (DrawSVG: 0%→100%)
        if (underline) {
          tl.fromTo(underline,
            { drawSVG: "0% 0%" },
            { drawSVG: "0% 100%", duration: 0.18, ease: "power3.out" },
            offset + 0.06
          );
        }

        // Fade out before next word
        if (i < lines.length - 1) {
          tl.to(line,      { autoAlpha: 0, y: -40, scale: 0.95, duration: 0.15 }, outOffset);
          if (underline) {
            tl.to(underline, { drawSVG: "100% 100%", duration: 0.12, ease: "power2.in" }, outOffset);
          }
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="section-container bg-cream"
      aria-label="Manifesto — Innovate, Inspire, Infinite"
      style={{ minHeight: "100vh" }}
    >
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      >
        {WORDS.map(({ word, sub, color }) => (
          <div
            key={word}
            className="manifesto-line absolute inset-0 flex flex-col items-center justify-center px-6"
            aria-label={word}
          >
            {/* Decorative diamond above */}
            <span
              className="block text-navy/20 text-xl mb-8 tracking-[3em]"
              aria-hidden="true"
            >
              ◆
            </span>

            <div className="relative inline-block">
              <h2
                className="font-serif text-navy"
                style={{
                  fontSize: "clamp(4rem, 12vw, 10rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                }}
              >
                {word}
              </h2>

              {/* DrawSVG underline — drawn in with GSAP */}
              <svg
                className="absolute left-0 w-full overflow-visible pointer-events-none"
                style={{ bottom: "-8px", height: "6px" }}
                viewBox="0 0 400 6"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="manifesto-underline"
                  d="M0,3 C50,1 100,5 150,3 C200,1 250,5 300,3 C350,1 380,4 400,3"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="font-sans text-navy/55 mt-10 max-w-md text-base md:text-lg leading-relaxed">
              {sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
