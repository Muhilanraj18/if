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
              className="gsap-showcase-card clay-card group w-full md:w-[700px] shrink-0"
              style={{ borderRadius: 32 }}
            >
              <div className="flex flex-col h-full min-h-[400px]">
                {/* Top frosted color header */}
                <div 
                  className="h-32 md:h-48 w-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, color-mix(in srgb, ${project.color} 22%, rgba(255,255,255,0.06)) 0%, color-mix(in srgb, ${project.color} 10%, rgba(0,0,0,0.2)) 100%)`,
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Top specular for header */}
                  <div className="absolute top-0 left-[8%] w-[84%] h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${project.color}80 50%, transparent)` }}
                  />
                  <span className="font-mono text-8xl md:text-9xl font-black opacity-15 absolute -right-4 -bottom-8 select-none"
                    style={{ color: project.color }}>
                    {project.year.slice(-2)}
                  </span>
                  <div
                    className="font-sans text-4xl md:text-6xl font-black"
                    style={{
                      color: project.color,
                      textShadow: `0 0 40px ${project.color}60`,
                      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                    }}
                  >
                    {project.title.substring(0,2).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                  <div>
                    <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3 font-bold"
                      style={{ color: project.color, opacity: 0.8 }}>
                      // {project.label}
                    </p>
                    <h3 className="font-sans font-black text-[var(--light)] mb-4 text-3xl md:text-4xl uppercase">
                      {project.title}
                    </h3>
                    <p className="font-mono text-[var(--light)] opacity-70 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="clay-tag font-mono text-xs font-bold tracking-wider uppercase px-3 py-1.5"
                        style={{
                          color: project.color,
                          background: `linear-gradient(135deg, color-mix(in srgb, ${project.color} 15%, transparent) 0%, color-mix(in srgb, ${project.color} 5%, transparent) 100%)`,
                          border: `1px solid color-mix(in srgb, ${project.color} 35%, transparent)`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px color-mix(in srgb, ${project.color} 20%, transparent)`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

