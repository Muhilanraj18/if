/**
 * TechMarquee Section — Animated SVG Path Showcase
 *
 * Displays tech stack icons and capabilities flowing along a
 * wave-shaped SVG path using MarqueeAlongSvgPath.
 * Sits between the HowWeBuild and Impact sections.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";

gsap.registerPlugin(ScrollTrigger);

// ── SVG Wave Path ─────────────────────────────────────────────────────────
const WAVE_PATH =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

// ── Tech Chips Data ───────────────────────────────────────────────────────
const TECH_CHIPS = [
  { label: "React", color: "var(--gsap-blue)", icon: "⬡" },
  { label: "TypeScript", color: "var(--gsap-blue)", icon: "TS" },
  { label: "Next.js", color: "var(--light)", icon: "▲" },
  { label: "Node.js", color: "var(--gsap-green)", icon: "⬡" },
  { label: "GraphQL", color: "var(--gsap-purple)", icon: "◈" },
  { label: "AWS", color: "var(--gsap-amber)", icon: "☁" },
  { label: "Docker", color: "var(--gsap-blue)", icon: "⬛" },
  { label: "Kubernetes", color: "var(--gsap-blue)", icon: "⎔" },
  { label: "Terraform", color: "var(--gsap-purple)", icon: "◇" },
  { label: "PostgreSQL", color: "var(--gsap-blue)", icon: "◙" },
  { label: "Redis", color: "var(--gsap-amber)", icon: "◉" },
  { label: "Rust", color: "var(--gsap-amber)", icon: "⚙" },
  { label: "Python", color: "var(--gsap-blue)", icon: "🐍" },
  { label: "LLM APIs", color: "var(--gsap-green)", icon: "✦" },
];

export default function TechMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      gsap.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--dark-surface) 0%, var(--dark) 100%)",
        borderTop: "1px solid var(--dark-border)",
        borderBottom: "1px solid var(--dark-border)",
      }}
      aria-label="Technology Stack"
    >
      {/* ── Subtle grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(157,255,47,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(157,255,47,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(ellipse, var(--gsap-green) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full pointer-events-none opacity-8"
        style={{
          background: "radial-gradient(ellipse, var(--gsap-purple) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Section label ── */}
      <div
        ref={headingRef}
        className="relative z-10 text-center pt-14 pb-6 px-4"
      >
        <p
          className="font-mono text-xs tracking-[0.35em] uppercase font-bold mb-3"
          style={{ color: "var(--gsap-green)" }}
        >
          // Our Stack
        </p>
        <h2
          className="font-sans font-black uppercase text-[var(--light)]"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
          }}
        >
          Built with the{" "}
          <span
            style={{
              background:
                "linear-gradient(110deg, var(--gsap-green) 0%, var(--gsap-teal) 50%, var(--gsap-blue) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Best
          </span>
        </h2>
        <p
          className="font-mono text-sm mt-3 max-w-sm mx-auto"
          style={{ color: "rgba(240,242,239,0.45)" }}
        >
          Drag or hover the wave — interact with our stack
        </p>
      </div>

      {/* ── SVG Path Marquee ── */}
      <div className="relative z-10" style={{ height: "340px" }}>
        <MarqueeAlongSvgPath
          path={WAVE_PATH}
          viewBox="0 0 996 330"
          baseVelocity={10}
          slowdownOnHover
          draggable
          repeat={2}
          dragSensitivity={0.12}
          grabCursor
          responsive
          enableRollingZIndex
          zIndexBase={1}
          zIndexRange={15}
          className="w-full h-full"
        >
          {TECH_CHIPS.map((chip, i) => (
            <TechChip key={i} {...chip} />
          ))}
        </MarqueeAlongSvgPath>
      </div>

      {/* ── Bottom tagline ── */}
      <div className="relative z-10 text-center pb-10 px-4">
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase"
          style={{ color: "rgba(240,242,239,0.25)" }}
        >
          + 30 more technologies in our arsenal
        </p>
      </div>
    </section>
  );
}

/* ── Tech Chip Component ─────────────────────────────────────────────────── */
function TechChip({
  label,
  color,
  icon,
}: {
  label: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      className="group flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer select-none transition-all duration-200 hover:scale-110"
      style={{
        background: `linear-gradient(135deg,
          color-mix(in srgb, ${color} 14%, rgba(0,0,0,0.6)) 0%,
          color-mix(in srgb, ${color} 6%, rgba(0,0,0,0.75)) 100%)`,
        border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 16px color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {/* Icon */}
      <span
        className="font-mono text-xs font-black leading-none"
        style={{ color }}
        aria-hidden
      >
        {icon}
      </span>
      {/* Label */}
      <span
        className="font-mono text-[11px] font-bold tracking-wider uppercase whitespace-nowrap"
        style={{ color }}
      >
        {label}
      </span>
      {/* Subtle glow on hover */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${color} 25%, transparent) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
