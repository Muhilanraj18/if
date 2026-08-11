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

      /* Staggered bento card entrance */
      gsap.set(".bento-card", { y: 30, opacity: 0, scale: 0.96 });
      gsap.to(".bento-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: { each: 0.15, from: "start" },
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* Hover float */
      gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card) => {
        card.addEventListener("mouseenter", () =>
          gsap.to(card, { y: -4, duration: 0.35, ease: "power2.out", overwrite: "auto" })
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
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
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
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            The Idea Behind <br className="sm:hidden" />
            <span
              style={{
                background: "linear-gradient(110deg, var(--gsap-green) 0%, var(--gsap-teal) 50%, var(--gsap-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Machine
            </span>
          </h2>
        </div>

        <div className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          
          {/* Main Story Block */}
          <BentoCard
            className="md:col-span-2 py-8 md:py-10"
            accent="var(--gsap-green)"
            title="The Beginning"
            number="01"
          >
            <h3 className="font-sans font-black text-2xl md:text-3xl text-[var(--light)] mb-5 uppercase tracking-tight">
              It started with an idea.
            </h3>
            <p className="font-sans text-[15px] text-[var(--light)] opacity-70 mb-4 leading-relaxed">
              Inan Infinites began with a simple belief:
            </p>
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] mb-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: "var(--gsap-green)" }} />
                <p className="font-sans text-base md:text-lg text-[var(--gsap-green)] opacity-100 font-bold uppercase tracking-wide pl-2">
                  If something can be better, why not build it better?
                </p>
            </div>
            <p className="font-sans text-[15px] text-[var(--light)] opacity-70 leading-relaxed mb-4">
              We started by exploring technology, solving everyday problems, and turning random ideas into real concepts.
            </p>
            <p className="font-sans text-[15px] text-[var(--light)] opacity-70 leading-relaxed">
              From a <strong className="text-[var(--light)] opacity-100">smarter mechanical pencil</strong> to <strong className="text-[var(--light)] opacity-100">AI, software, and future products</strong>, every idea pushed us one step further.
            </p>
          </BentoCard>

          {/* Process Block */}
          <BentoCard
            className="md:col-span-1 py-8 md:py-10 text-center"
            accent="var(--gsap-amber)"
            title="The Process"
            number="02"
          >
            <div className="flex flex-col justify-center h-full space-y-3 md:space-y-4 pt-4">
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-widest text-[var(--light)] opacity-80 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] py-4 px-4 rounded-xl">
                We’re still learning.
              </p>
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-widest text-[var(--light)] opacity-80 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] py-4 px-4 rounded-xl">
                Still experimenting.
              </p>
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-widest text-[var(--gsap-amber)] opacity-100 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] py-4 px-4 rounded-xl font-bold">
                Still building.
              </p>
            </div>
          </BentoCard>

          {/* The Vision Block */}
          <BentoCard
            className="md:col-span-3 text-center py-12 md:py-16"
            accent="var(--gsap-purple)"
          >
            <h3 className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-[var(--gsap-purple)] uppercase mb-6 font-bold">
              // The Vision
            </h3>
            <div className="font-sans font-black text-2xl md:text-4xl text-[var(--light)] uppercase leading-tight md:leading-tight space-y-2 mb-8">
              <p>We’re not here to follow the future.</p>
              <p className="text-[var(--gsap-purple)]">We’re here to build it.</p>
            </div>
            <p className="font-sans text-lg md:text-xl text-[var(--light)] opacity-90 font-bold uppercase tracking-widest">
              INAN INFINITES <br/>
              <span className="text-[var(--light)] opacity-50 text-xs md:text-sm mt-2 block tracking-widest uppercase font-semibold">Infinite ideas. One vision.</span>
            </p>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}

function BentoCard({
  children,
  className = "",
  accent,
  number,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  accent: string;
  number?: string;
  title?: string;
}) {
  return (
    <article
      className={`bento-card clay-card group p-6 md:p-8 flex flex-col relative overflow-hidden ${className}`}
      style={{ borderRadius: 28 }}
    >
      {/* Specular line */}
      <div
        className="absolute top-0 left-[10%] w-[80%] h-[1.5px] pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent} 40%, ${accent} 60%, transparent)`,
          opacity: 0.5,
        }}
      />
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${accent} 12%, transparent) 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        {number && title && (
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="font-mono text-xs font-black tracking-widest" style={{ color: accent }}>
              {number}
            </span>
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-[var(--light)] opacity-60 font-semibold">
              {title}
            </span>
          </div>
        )}
        <div className="flex-grow flex flex-col justify-center">
          {children}
        </div>
      </div>
    </article>
  );
}
