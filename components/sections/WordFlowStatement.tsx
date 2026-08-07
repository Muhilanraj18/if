/**
 * WordFlowStatement — Inan Infinites
 *
 * "We Inan Infinites — we create emotion-worth solutions"
 *
 * Animation: each word starts far off-screen LEFT and slides rightward
 * into its final position as the user scrolls. Mimics the card-reveal
 * feel of the Showcase / GSAP Playground but for a brand statement.
 *
 * GSAP: SplitText (words) + ScrollTrigger (scrub pin) + stagger left→right
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

/* ── Brand statement broken into styled lines ── */
const STATEMENT_LINES = [
  {
    text: "We Inan Infinites —",
    accent: false,
    size: "clamp(2.8rem, 7vw, 7rem)",
    color: "var(--light)",
  },
  {
    text: "we create",
    accent: false,
    size: "clamp(2.8rem, 7vw, 7rem)",
    color: "var(--light)",
  },
  {
    text: "emotion-worth",
    accent: true,
    size: "clamp(2.8rem, 7vw, 7rem)",
    color: "transparent",
  },
  {
    text: "solutions.",
    accent: false,
    size: "clamp(2.8rem, 7vw, 7rem)",
    color: "var(--light)",
  },
];

export default function WordFlowStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!linesRef.current) return;

      const lineEls = linesRef.current.querySelectorAll<HTMLElement>(".wfs-line");
      if (!lineEls.length) return;

      /* Split each line into chars */
      const splits: ReturnType<typeof SplitText.create>[] = [];

      lineEls.forEach((lineEl) => {
        const split = SplitText.create(lineEl, {
          type: "chars",
          charsClass: "wfs-char inline-block",
        });
        splits.push(split);
      });

      // 1. Container scrolls horizontally
      const scrollTween = gsap.to(linesRef.current, {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          end: "+=4500px",
          scrub: 1.0,
        },
      });

      // 2. Individual chars animate in while scrolling
      splits.forEach((split) => {
        split.chars.forEach((char) => {
          gsap.from(char, {
            yPercent: gsap.utils.random(-200, 200),
            rotation: gsap.utils.random(-20, 20),
            opacity: 0,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: char,
              containerAnimation: scrollTween,
              start: "left 100%",
              end: "left 30%",
              scrub: 1,
            },
          });
        });
      });

      // 3. SVGs spin/animate while scrolling
      const svgs = linesRef.current.querySelectorAll(".wfs-svg");
      svgs.forEach((svg, index) => {
        gsap.to(svg, {
          rotation: index % 2 === 0 ? 360 : -360,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: svg,
            containerAnimation: scrollTween,
            start: "left 110%",
            end: "right -10%",
            scrub: 0.5,
          },
        });
      });

    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="statement"
      className="section-container relative h-screen flex items-center bg-[var(--dark)] overflow-hidden"
      style={{ borderTop: "1px solid var(--dark-border)" }}
      aria-label="Inan Infinites brand statement"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 gsap-grid-bg opacity-20 pointer-events-none" />

      {/* Main horizontally scrolling text block */}
      <div
        ref={linesRef}
        className="flex items-center w-max whitespace-nowrap pl-[100vw] pr-[50vw] gap-[2vw] relative z-10"
      >
        <p
          className="font-mono text-[var(--gsap-green)] text-[2vw] tracking-[0.45em] uppercase font-bold self-start mt-8"
          style={{ opacity: 0.8 }}
        >
          // Who we are
        </p>

        {STATEMENT_LINES.map(({ text, accent, size, color }, i) => (
          <React.Fragment key={i}>
            <div
              className="wfs-line font-sans font-black uppercase leading-[1.1] overflow-visible"
              style={{
                fontSize: size,
                letterSpacing: "-0.03em",
                color: accent ? "transparent" : color,
                WebkitTextStroke: accent ? `3px var(--gsap-green)` : undefined,
                background: accent
                  ? "linear-gradient(110deg, var(--gsap-green) 0%, var(--gsap-teal) 50%, var(--gsap-purple) 100%)"
                  : "none",
                WebkitBackgroundClip: accent ? "text" : "unset",
                backgroundClip: accent ? "text" : "unset",
                WebkitTextFillColor: accent ? "transparent" : undefined,
              }}
              aria-label={text}
            >
              {text}
            </div>

            {/* Injected SVGs interleaved between some words */}
            {i === 0 && (
              <svg className="wfs-svg w-[6vw] h-[6vw] text-[var(--gsap-green)] opacity-90 mx-[1vw]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
              </svg>
            )}
            {i === 2 && (
              <svg className="wfs-svg w-[8vw] h-[8vw] text-[var(--gsap-purple)] opacity-70 mx-[2vw]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            )}
            {i === 4 && (
              <svg className="wfs-svg w-[7vw] h-[7vw] text-[var(--gsap-teal)] opacity-80 mx-[1vw]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M2 12H22M12 2L22 12L12 22" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
