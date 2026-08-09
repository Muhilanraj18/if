/**
 * Showcase Section — Chapter 4: GSAP Aesthetic
 * 
 * Massive overlapping flat panels.
 * Horizontal scrollytelling on desktop, vertical stacking on mobile.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger, SplitText);

const PROJECTS = [
  {
    id: "proj-1",
    label: "Product Engineering",
    title: "CommandFlow",
    description: "Enterprise workflow orchestration platform built for startup speed.",
    tags: ["SaaS", "Real-time"],
    year: "2025",
    color: "var(--gsap-green)",
  },
  {
    id: "proj-2",
    label: "AI & Automation",
    title: "NeuralBridge",
    description: "Unified AI middleware layer connecting LLMs to enterprise data.",
    tags: ["LLM", "Middleware"],
    year: "2025",
    color: "var(--gsap-purple)",
  },
  {
    id: "proj-3",
    label: "Cloud Platforms",
    title: "ArcCloud",
    description: "Multi-cloud orchestration with single-pane-of-glass observability.",
    tags: ["AWS", "Terraform"],
    year: "2024",
    color: "var(--gsap-blue)",
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      // Jumping & Flying Letters Animation
      const split = new SplitText(headingRef.current, { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        y: () => gsap.utils.random(-100, 100),
        x: () => gsap.utils.random(-100, 100),
        rotation: () => gsap.utils.random(-90, 90),
        duration: 1.2,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Horizontal scrollytelling for Desktop
        if (!horizontalContainerRef.current) return;
        
        const cards = gsap.utils.toArray(".gsap-showcase-card") as HTMLElement[];
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: true,
            start: "bottom bottom", // Pin when the bottom of the section hits the bottom of the screen
            end: () => `+=${horizontalContainerRef.current!.scrollWidth * 0.6}`,
          }
        });

        // Translate the container to the left
        tl.to(horizontalContainerRef.current, {
          x: () => {
            const container = horizontalContainerRef.current!;
            const scrollWidth = container.scrollWidth;
            const containerLeft = container.getBoundingClientRect().left;
            return -(scrollWidth - window.innerWidth + containerLeft + 24);
          },
          ease: "none",
        });

      });

      mm.add("(max-width: 767px)", () => {
        // Vertical stacking for Mobile
        const cards = gsap.utils.toArray(".gsap-showcase-card") as HTMLElement[];
        cards.forEach((card) => {
          gsap.fromTo(card,
            { autoAlpha: 0, y: 60 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.0,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              }
            }
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-container relative overflow-hidden bg-[var(--dark)] min-h-screen flex flex-col justify-center py-20"
      aria-label="Innovation Showcase"
    >
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20">
          <SectionDivider variant="cream" showTagline={false} />
          <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">
            // Selected work
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Innovation<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px var(--light)" }}>Showcase</span>
          </h2>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={horizontalContainerRef} 
          className="flex flex-col md:flex-row gap-6 md:gap-16 md:w-max perspective-[1200px]"
          style={{ willChange: "transform", paddingRight: "10vw" }}
        >
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="gsap-showcase-card clay-card group w-full md:w-[680px] shrink-0 flex flex-col"
              style={{ borderRadius: 28 }}
            >
              {/* Card header — colour band */}
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{
                  height: "200px",
                  background: `linear-gradient(150deg,
                    color-mix(in srgb, ${project.color} 18%, rgba(0,0,0,0.4)) 0%,
                    color-mix(in srgb, ${project.color} 8%, rgba(0,0,0,0.55)) 60%,
                    rgba(0,0,0,0.65) 100%)`,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Top specular line */}
                <div
                  className="absolute top-0 left-[8%] w-[84%] h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${project.color}70 50%, transparent)` }}
                />
                {/* Giant watermark year */}
                <span
                  className="font-mono font-black absolute -right-2 -bottom-6 select-none"
                  style={{ fontSize: "9rem", lineHeight: 1, color: project.color, opacity: 0.08, letterSpacing: "-0.06em" }}
                >
                  {project.year}
                </span>
                {/* Label top-left */}
                <div className="absolute top-5 left-7 flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }}
                  />
                  <span
                    className="font-mono text-[10px] tracking-[0.28em] uppercase font-black"
                    style={{ color: project.color }}
                  >
                    {project.label}
                  </span>
                </div>
                {/* Year badge top-right */}
                <span
                  className="absolute top-5 right-7 font-mono text-xs font-bold tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {project.year}
                </span>
                {/* Big initials monogram */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-sans font-black"
                    style={{
                      fontSize: "5rem",
                      color: project.color,
                      textShadow: `0 0 60px ${project.color}50, 0 0 120px ${project.color}20`,
                      letterSpacing: "-0.06em",
                      opacity: 0.75,
                    }}
                  >
                    {project.title.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                {/* Title + description */}
                <div className="mb-6">
                  <h3
                    className="font-sans font-black text-[var(--light)] mb-3"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
                  >
                    {project.title}
                  </h3>
                  <p className="font-mono text-[var(--light)] opacity-55 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.07)" }} />

                {/* Tags + CTA */}
                <div className="flex items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="clay-tag font-mono text-[11px] font-bold tracking-wider uppercase px-3 py-1"
                        style={{
                          color: project.color,
                          background: `linear-gradient(135deg, color-mix(in srgb, ${project.color} 15%, transparent) 0%, color-mix(in srgb, ${project.color} 5%, transparent) 100%)`,
                          border: `1px solid color-mix(in srgb, ${project.color} 32%, transparent)`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 8px color-mix(in srgb, ${project.color} 15%, transparent)`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    className="font-mono text-xs tracking-widest uppercase font-black flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: project.color }}
                  >
                    View →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

