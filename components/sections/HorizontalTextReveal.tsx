/**
 * HorizontalTextReveal — Inan Infinites
 *
 * Letters fly in from the left/right and converge into words/sentences
 * as the user scrolls. Uses SplitText + ScrollTrigger scrub.
 *
 * GSAP skills used:
 *  - gsap-plugins: SplitText (chars)
 *  - gsap-scrolltrigger: pinned timeline, scrub
 *  - gsap-timeline: position parameter for per-char stagger
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const LINES = [
  { text: "WE BUILD", accent: false },
  { text: "THE FUTURE",  accent: true  },
  { text: "TOGETHER.",   accent: false },
];

const SENTENCES = [
  "From raw idea to global infrastructure —",
  "every line of code is crafted with intention.",
];

export default function HorizontalTextReveal() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headlineRef.current || !subRef.current) return;

      const headlineEls = headlineRef.current.querySelectorAll<HTMLElement>(".htr-line");
      const subEls = subRef.current.querySelectorAll<HTMLElement>(".htr-sub");

      /* ── Headline: chars fly in horizontally ── */
      const lineSplits: SplitText[] = [];

      headlineEls.forEach((line) => {
        const split = new SplitText(line, { type: "chars", charsClass: "htext-char" });
        lineSplits.push(split);

        split.chars.forEach((char, charIdx) => {
          const fromLeft = charIdx % 2 === 0;
          gsap.set(char, {
            x: fromLeft ? -window.innerWidth * 0.8 : window.innerWidth * 0.8,
            opacity: 0,
          });
        });
      });

      /* ── Sub sentences: words fly in from alternating sides ── */
      const subSplits: SplitText[] = [];
      subEls.forEach((el, idx) => {
        const split = new SplitText(el, { type: "words", wordsClass: "htext-char" });
        subSplits.push(split);
        split.words.forEach(() => {
          const fromLeft = idx % 2 === 0;
          gsap.set(split.words, {
            x: fromLeft ? -300 : 300,
            opacity: 0,
          });
        });
      });

      /* ── Pinned timeline, each char flies to x:0 as user scrolls ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280vh",
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
        },
      });

      // Headline chars converge
      headlineEls.forEach((line, lineIdx) => {
        const split = lineSplits[lineIdx];
        split.chars.forEach((char, charIdx) => {
          const fromLeft = charIdx % 2 === 0;
          const startOffset = lineIdx * 0.15 + charIdx * 0.02;
          tl.to(
            char,
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            startOffset
          );
        });
      });

      // Sub sentences arrive after headline
      subEls.forEach((el, idx) => {
        const split = subSplits[idx];
        split.words.forEach((word, wIdx) => {
          const fromLeft = idx % 2 === 0;
          tl.to(
            word,
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            0.8 + idx * 0.15 + wIdx * 0.04
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="htext"
      className="section-container relative min-h-screen flex items-center justify-center bg-[var(--dark)] overflow-hidden"
      style={{ borderTop: "1px solid var(--dark-border)" }}
      aria-label="We build the future together"
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(157,255,47,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(192,38,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 gsap-grid-bg opacity-30 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl w-full mx-6 md:mx-auto text-center">
        {/* Eyebrow label */}
        <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.4em] uppercase mb-10 font-bold">
          // Our mission
        </p>

        {/* Headline — each line gets SplitText chars */}
        <div ref={headlineRef} className="mb-10 overflow-hidden flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2">
          {LINES.map(({ text, accent }, i) => (
            <span
              key={i}
              className="htr-line font-sans font-black uppercase leading-none inline-block"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                letterSpacing: "-0.04em",
                color: accent ? "transparent" : "var(--light)",
                WebkitTextStroke: accent ? "3px var(--gsap-green)" : undefined,
                lineHeight: 0.95,
              }}
              aria-label={text}
            >
              {text}
            </span>
          ))}
        </div>

        {/* Horizontal rule with glow */}
        <div
          className="mx-auto mb-8"
          style={{
            width: "160px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--gsap-green), var(--gsap-teal), transparent)",
          }}
        />

        {/* Sub sentences */}
        <div ref={subRef} className="space-y-3">
          {SENTENCES.map((s, i) => (
            <div
              key={i}
              className="htr-sub font-mono text-base md:text-lg text-[var(--light)] opacity-70 leading-relaxed"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
