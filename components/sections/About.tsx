"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;
      createLineReveal(headingRef.current, { start: "top 80%" });

      gsap.set(".bento-card", { y: 40, opacity: 0, scale: 0.94 });
      gsap.to(".bento-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        stagger: { each: 0.12, from: "start" },
        ease: "back.out(1.3)",
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card) => {
        card.addEventListener("mouseenter", () =>
          gsap.to(card, { y: -6, duration: 0.35, ease: "power2.out", overwrite: "auto" })
        );
        card.addEventListener("mouseleave", () =>
          gsap.to(card, { y: 0, duration: 0.4, ease: "power2.inOut", overwrite: "auto" })
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-container py-24 px-4 sm:px-6"
      style={{
        background: "linear-gradient(180deg, var(--dark) 0%, var(--dark-surface) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <SectionDivider variant="cream" showTagline={false} />
          <p
            className="font-mono text-[10px] md:text-xs tracking-[0.38em] uppercase mb-4 font-bold mt-6"
            style={{ color: "var(--gsap-green)" }}
          >
            // Our Story
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Built Different.{" "}
            <span
              style={{
                background: "linear-gradient(110deg, var(--gsap-green) 0%, var(--gsap-teal) 50%, var(--gsap-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built Infinite.
            </span>
          </h2>
        </div>

        {/* ── BENTO GRID ─ 3 rows, 6 cols */}
        <div className="bento-grid grid grid-cols-1 md:grid-cols-6 gap-5 md:gap-6">

          {/* ── ROW 1 ── */}

          {/* Card 1: Origin story wide */}
          <BentoCard
            className="md:col-span-4 py-8 md:py-10"
            accent="var(--gsap-green)"
            tag="01 · The Beginning"
            glowColor="rgba(157,255,47,0.09)"
          >
            <h3 className="font-sans font-black text-2xl md:text-3xl text-[var(--light)] mb-4 uppercase tracking-tight">
              It started with a question.
            </h3>
            <div
              className="relative p-4 rounded-2xl mb-5 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-full"
                style={{ background: "var(--gsap-green)" }}
              />
              <p className="font-sans text-base md:text-lg text-[var(--gsap-green)] font-bold uppercase tracking-wide pl-3">
                &ldquo;If something can be better — why not build it better?&rdquo;
              </p>
            </div>
            <p className="font-sans text-[14px] text-[var(--light)] opacity-60 leading-relaxed mb-3">
              Inan Infinites began not in a boardroom, but in a mind that refused to accept the ordinary. We started
              exploring technology as a craft — solving real problems, turning strange ideas into real things.
            </p>
            <p className="font-sans text-[14px] text-[var(--light)] opacity-60 leading-relaxed">
              From a <strong className="text-[var(--light)] opacity-100">smarter mechanical pencil</strong> to{" "}
              <strong className="text-[var(--light)] opacity-100">AI, software, and future products</strong> — every
              idea pushed us one step further into the infinite.
            </p>
          </BentoCard>

          {/* Card 2: Process pills narrow */}
          <BentoCard
            className="md:col-span-2 py-8 md:py-10"
            accent="var(--gsap-amber)"
            tag="02 · The Process"
            glowColor="rgba(255,184,48,0.07)"
          >
            <div className="flex flex-col gap-3 h-full justify-center">
              {[
                { label: "We learn.", color: "var(--gsap-green)" },
                { label: "We experiment.", color: "var(--gsap-teal)" },
                { label: "We break things.", color: "var(--gsap-amber)" },
                { label: "We fix them.", color: "var(--gsap-purple)" },
                { label: "We ship.", color: "var(--gsap-green)" },
              ].map(({ label, color }) => (
                <div
                  key={label}
                  className="font-mono text-[11px] md:text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl font-bold flex items-center gap-2.5"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color,
                    boxShadow:
                      "inset 0 1.5px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  {label}
                </div>
              ))}
            </div>
          </BentoCard>

          {/* ── ROW 2 ── */}

          {/* Card 3: Stat */}
          <BentoCard
            className="md:col-span-2"
            accent="var(--gsap-teal)"
            tag="03 · Launched"
            glowColor="rgba(0,229,201,0.07)"
          >
            <div className="flex flex-col h-full justify-between py-2">
              <p
                className="font-sans font-black text-[var(--light)]"
                style={{ fontSize: "5rem", lineHeight: 1, letterSpacing: "-0.06em" }}
              >
                12
                <span className="text-[var(--gsap-teal)]" style={{ fontSize: "2.8rem" }}>
                  +
                </span>
              </p>
              <p className="font-mono text-xs text-[var(--light)] opacity-40 uppercase tracking-widest mt-2">
                Products shipped
              </p>
              <div className="mt-4 flex gap-1.5 flex-wrap">
                {["Web", "AI", "Mobile", "IoT"].map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(0,229,201,0.1)",
                      border: "1px solid rgba(0,229,201,0.2)",
                      color: "var(--gsap-teal)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Card 4: Timeline */}
          <BentoCard
            className="md:col-span-2"
            accent="var(--gsap-purple)"
            tag="04 · Journey"
            glowColor="rgba(192,38,255,0.07)"
          >
            <div className="flex flex-col gap-4">
              {[
                { year: "2022", label: "The First Idea",       color: "var(--gsap-green)" },
                { year: "2023", label: "First Product Built",  color: "var(--gsap-teal)" },
                { year: "2024", label: "Went Digital",         color: "var(--gsap-purple)" },
                { year: "2025", label: "Scaling Infinite",     color: "var(--gsap-amber)" },
              ].map(({ year, label, color }) => (
                <div key={year} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  />
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span
                      className="font-mono text-[10px] font-black tracking-wider flex-shrink-0"
                      style={{ color }}
                    >
                      {year}
                    </span>
                    <span className="font-sans text-xs text-[var(--light)] opacity-55 truncate">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Card 5: Mindset */}
          <BentoCard
            className="md:col-span-2"
            accent="var(--gsap-blue)"
            tag="05 · Mindset"
            glowColor="rgba(42,171,255,0.07)"
          >
            <div className="flex flex-col h-full justify-center items-center text-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(42,171,255,0.2) 0%, rgba(42,171,255,0.05) 100%)",
                  border: "1px solid rgba(42,171,255,0.3)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(42,171,255,0.2)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--gsap-blue)"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <p className="font-sans font-black text-[var(--light)] text-lg md:text-xl uppercase leading-tight tracking-tight">
                Curiosity is our competitive advantage.
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase opacity-40 text-[var(--light)]">
                — INAN INFINITES
              </p>
            </div>
          </BentoCard>

          {/* ── ROW 3 ── */}

          {/* Card 6: Vision full width */}
          <BentoCard
            className="md:col-span-6 text-center py-14 md:py-20"
            accent="var(--gsap-purple)"
            glowColor="rgba(192,38,255,0.07)"
          >
            <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-[var(--gsap-purple)] uppercase mb-6 font-bold">
              // The Vision
            </p>
            <div
              className="font-sans font-black text-2xl md:text-4xl lg:text-5xl text-[var(--light)] uppercase leading-tight space-y-2 mb-8"
            >
              <p>We&apos;re not here to follow the future.</p>
              <p
                style={{
                  background:
                    "linear-gradient(110deg, var(--gsap-purple) 0%, var(--gsap-teal) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                We&apos;re here to build it.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-sans text-lg md:text-xl text-[var(--light)] opacity-90 font-black uppercase tracking-widest">
                INAN INFINITES
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--gsap-green)",
                  boxShadow: "0 0 8px var(--gsap-green)",
                }}
              />
              <span className="font-mono text-xs text-[var(--light)] opacity-40 tracking-widest uppercase">
                Infinite ideas. One vision.
              </span>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}

/* ── BentoCard — deep claymorphism ───────────────────────────────── */
function BentoCard({
  children,
  className = "",
  accent,
  tag,
  glowColor = "rgba(157,255,47,0.05)",
}: {
  children: React.ReactNode;
  className?: string;
  accent: string;
  tag?: string;
  glowColor?: string;
}) {
  return (
    <article
      className={`bento-card group relative overflow-hidden flex flex-col p-6 md:p-8 ${className}`}
      style={{
        borderRadius: 28,
        /* Diagonal bright-to-dark background sells the dome surface */
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.11) 25%, rgba(255,255,255,0.055) 55%, rgba(0,0,0,0.07) 100%)",
        backdropFilter: "blur(44px) saturate(200%) brightness(1.14)",
        WebkitBackdropFilter: "blur(44px) saturate(200%) brightness(1.14)",
        border: "1.5px solid rgba(255,255,255,0.26)",
        boxShadow: [
          /* INSET — surface curvature lighting */
          "inset 0 3px 0 rgba(255,255,255,0.72)",
          "inset 0 1px 0 rgba(255,255,255,0.92)",
          "inset 3px 0 0 rgba(255,255,255,0.28)",
          "inset -2px 0 4px rgba(0,0,0,0.10)",
          "inset 0 -4px 12px rgba(0,0,0,0.28)",
          /* OUTER — physical elevation */
          "0 2px 4px rgba(0,0,0,0.48)",
          "0 6px 14px rgba(0,0,0,0.36)",
          "0 18px 40px rgba(0,0,0,0.24)",
          "0 38px 72px rgba(0,0,0,0.16)",
          "0 0 0 1px rgba(255,255,255,0.08)",
          /* EXTRUSION — clay thickness */
          "0 8px 0 rgba(0,0,0,0.52)",
          "0 11px 6px rgba(0,0,0,0.32)",
        ].join(", "),
        transition:
          "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease",
        willChange: "transform",
      }}
    >
      {/* Top specular ridge — sharpest lit point on dome */}
      <div
        className="absolute top-0 left-[5%] w-[90%] pointer-events-none z-10"
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 15%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 85%, transparent 100%)",
          borderRadius: "0 0 60% 60%",
          filter: "blur(0.8px)",
        }}
      />

      {/* Dome sheen — upper-half radial ellipse highlight */}
      <div
        className="absolute top-0 left-0 w-[65%] h-[55%] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 28% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
          borderRadius: "28px 0 0 0",
        }}
      />

      {/* Accent color glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, transparent 65%)`,
          borderRadius: 28,
        }}
      />

      {/* Accent specular line (colored) */}
      <div
        className="absolute top-0 left-[10%] w-[80%] pointer-events-none z-10"
        style={{
          height: "1.5px",
          background: `linear-gradient(90deg, transparent, ${accent} 40%, ${accent} 60%, transparent)`,
          opacity: 0.45,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {tag && (
          <div
            className="flex items-center gap-2.5 mb-5 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            />
            <span
              className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] font-black"
              style={{ color: accent }}
            >
              {tag}
            </span>
          </div>
        )}
        <div className="flex-grow flex flex-col justify-center">{children}</div>
      </div>
    </article>
  );
}
