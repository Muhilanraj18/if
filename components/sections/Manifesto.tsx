/**
 * Manifesto Section — Chapter 2: Minimalism
 * 
 * Three pinned scroll steps: "Innovate." / "Inspire." / "Infinite."
 * One line per screen-height of scroll travel, revealed sequentially.
 * 
 * Patterns:
 * - gsap-scrolltrigger skill: pinned timeline with scrub, top-level ScrollTrigger
 * - gsap-timeline skill: position parameter controls per-line timing
 * - gsap-core skill: autoAlpha for true visibility toggle
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  { word: "Innovate.", sub: "We challenge the status quo — building products that didn't exist yesterday." },
  { word: "Inspire.", sub: "Our work moves people, teams, and entire industries forward." },
  { word: "Infinite.", sub: "There is no ceiling. Only the next problem worth solving." },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const lines = containerRef.current.querySelectorAll<HTMLElement>(".manifesto-line");
      if (!lines.length) return;

      // Set initial states — all lines invisible except first hint
      gsap.set(lines, { autoAlpha: 0, y: 30 });

      // gsap-timeline skill: timeline on ScrollTrigger (not on child tweens)
      // gsap-scrolltrigger skill: pin + scrub for per-word scroll reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${lines.length * 120}vh`,  // 120vh scroll per word
          pin: true,
          pinSpacing: true,
          scrub: 1.5,                         // scrub-scrolltrigger skill: smooth lag
        },
        defaults: { ease: "power2.inOut" },
      });

      // Sequence each word in and out (position parameter: gsap-timeline skill)
      lines.forEach((line, i) => {
        const offset = i / lines.length;
        const outOffset = (i + 0.7) / lines.length;

        // Fade in with scale down
        tl.fromTo(line, 
          { autoAlpha: 0, y: 40, scale: 1.05 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.2 }, 
          offset
        );

        // Fade out (before next word) with scale up
        if (i < lines.length - 1) {
          tl.to(line, { autoAlpha: 0, y: -40, scale: 0.95, duration: 0.15 }, outOffset);
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
        {WORDS.map(({ word, sub }) => (
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

            <p
              className="font-sans text-navy/55 mt-8 max-w-md text-base md:text-lg leading-relaxed"
            >
              {sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
