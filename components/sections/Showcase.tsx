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
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger);

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

      createLineReveal(headingRef.current, { start: "top 80%" });

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Horizontal scrollytelling for Desktop
        if (!horizontalContainerRef.current) return;
        
        const cards = gsap.utils.toArray(".gsap-showcase-card") as HTMLElement[];
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${horizontalContainerRef.current!.scrollWidth - window.innerWidth + 200}`,
          }
        });

        // Translate the container to the left
        tl.to(horizontalContainerRef.current, {
          x: () => {
            const container = horizontalContainerRef.current!;
            const scrollWidth = container.scrollWidth;
            const containerLeft = container.getBoundingClientRect().left;
            // Add containerLeft * 2 to account for both left and right margins to fully reveal the last card
            return -(scrollWidth - window.innerWidth + containerLeft * 2);
          },
          ease: "none",
        });

        // Scrub in cards as they come into view
        cards.forEach((card) => {
           gsap.fromTo(card, 
             { opacity: 0.3, scale: 0.8, rotationY: 15 },
             { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: "power2.out",
               scrollTrigger: {
                 trigger: card,
                 containerAnimation: tl,
                 start: "left center",
                 toggleActions: "play none none reverse",
               }
             }
           );
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
                once: true,
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
      className="section-container py-32 px-6 relative overflow-hidden bg-[var(--dark)]"
      aria-label="Innovation Showcase"
    >
      <div className="max-w-5xl mx-auto relative z-10">
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
          className="flex flex-col md:flex-row gap-8 md:gap-16 md:w-fit perspective-[1200px]"
          style={{ willChange: "transform" }}
        >
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="gsap-showcase-card group rounded-2xl overflow-hidden w-full md:w-[700px] shrink-0 border-2 border-[var(--dark-border)] bg-[var(--dark-surface)] hover:border-[var(--gsap-green)] transition-colors duration-300"
              style={{ boxShadow: "12px 12px 0px rgba(0,0,0,1)" }}
            >
              <div className="flex flex-col h-full min-h-[400px]">
                {/* Top heavy color bar */}
                <div 
                  className="h-32 md:h-48 w-full border-b-2 border-[var(--dark-border)] flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: project.color }}
                >
                  <span className="font-mono text-8xl md:text-9xl font-black text-[var(--dark)] opacity-20 absolute -right-4 -bottom-8">
                    {project.year.slice(-2)}
                  </span>
                  <div className="font-sans text-4xl md:text-6xl font-black text-[var(--dark)] mix-blend-overlay">
                    {project.title.substring(0,2).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                  <div>
                    <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.2em] uppercase mb-3 font-bold">
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
                        className="font-mono text-xs text-[var(--dark)] font-bold tracking-wider uppercase px-3 py-1 bg-[var(--light)] rounded-sm"
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
