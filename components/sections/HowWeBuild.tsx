/**
 * How We Build Section — Chapter 2: GSAP Aesthetic
 * 
 * Animated SVG line drawing itself on scroll, connecting process nodes.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "@/components/ui/SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  { num: "01", title: "DISCOVERY",    desc: "We map the territory. Deep dives into architecture, goals, and constraints.",       side: "left"  },
  { num: "02", title: "PROTOTYPING",  desc: "Rapid iteration. We build disposable prototypes to validate assumptions fast.",      side: "right" },
  { num: "03", title: "ENGINEERING",  desc: "Writing code that scales. Clean, modular, and production-ready.",                   side: "left"  },
  { num: "04", title: "DEPLOYMENT",   desc: "Zero-downtime shipping. CI/CD pipelines that let you deploy on Fridays.",           side: "right" },
];

export default function HowWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      // 1. Draw the squiggly line on scroll
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".process-container",
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          }
        });
      }

      // Mobile green flowing line
      const mobileLine = document.querySelector('.mobile-green-line');
      if (mobileLine) {
        gsap.fromTo(mobileLine, 
          { scaleY: 0 },
          { 
            scaleY: 1, 
            ease: "none",
            scrollTrigger: {
              trigger: ".process-container",
              start: "top 60%",
              end: "bottom 80%",
              scrub: true,
            }
          }
        );
      }

      // 2. Node entrance animations using matchMedia for mobile responsiveness
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const nodes = gsap.utils.toArray(".process-node") as HTMLElement[];
        nodes.forEach((node, i) => {
          const step = PROCESS_STEPS[i];
          gsap.from(node, {
            x: step.side === "left" ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: node,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        const nodes = gsap.utils.toArray(".process-node") as HTMLElement[];
        nodes.forEach((node) => {
          gsap.from(node, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          });
        });
      });
      
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-container bg-[var(--dark-surface)] py-32 px-6 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <SectionDivider variant="cream" showTagline={false} />
          <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">
            // The Pipeline
          </p>
          <h2 className="font-sans font-black text-[var(--light)] text-4xl md:text-6xl uppercase tracking-tighter">
            How We Build
          </h2>
        </div>

        {/* Process Flow */}
        <div className="process-container relative mt-16 pb-16">
          
          {/* Background SVG Line (Desktop) — path stays tightly centered, cards push outward */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[120px] hidden md:block -z-10">
            <svg width="100%" height="100%" viewBox="0 0 120 800" preserveAspectRatio="none">
              {/* Dim background line — simple straight vertical */}
              <path
                d="M60,0 C60,100 30,180 30,300 C30,420 90,500 90,600 C90,700 60,750 60,800"
                fill="none"
                stroke="var(--dark-border)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Highlight active line */}
              <path
                ref={pathRef}
                d="M60,0 C60,100 30,180 30,300 C30,420 90,500 90,600 C90,700 60,750 60,800"
                fill="none"
                stroke="var(--gsap-green)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px rgba(138,230,20,0.5))" }}
              />
            </svg>
          </div>
          
          {/* Mobile Straight Line */}
          <div className="absolute top-0 bottom-0 left-6 w-1 bg-[var(--dark-border)] block md:hidden -z-10">
            <div className="mobile-green-line w-full h-full bg-[var(--gsap-green)] origin-top shadow-[0_0_8px_rgba(138,230,20,0.5)]" />
          </div>

          <div className="flex flex-col gap-10 md:gap-28">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={`process-node flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 ${
                  step.side === "left"
                    ? "md:pr-[52%]"
                    : "md:pl-[52%] md:flex-row-reverse"
                }`}
              >
                {/* Node Dot / Number */}
                <div className={`relative ${step.side === "left" ? 'md:-mr-5' : 'md:-ml-5'} z-10 shrink-0`}>
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-mono font-black text-[var(--gsap-green)] text-base"
                    style={{
                      background: "linear-gradient(145deg, rgba(157,255,47,0.16) 0%, rgba(157,255,47,0.05) 100%)",
                      border: "1.5px solid rgba(157,255,47,0.4)",
                      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.25), 0 4px 16px rgba(157,255,47,0.18), 0 10px 28px rgba(0,0,0,0.35)",
                    }}
                  >
                    {step.num}
                  </div>
                </div>

                {/* Clay Content Panel */}
                <div className="clay-card process-card w-full group" style={{ borderRadius: 20 }}>
                  {/* Header strip */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <h3 className="font-sans font-black text-xl text-[var(--light)] uppercase tracking-tight group-hover:text-[var(--gsap-green)] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <span
                      className="font-mono text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: "var(--gsap-green)" }}
                    >
                      →
                    </span>
                  </div>
                  {/* Body */}
                  <div className="px-6 py-4">
                    <p className="font-mono text-sm text-[var(--light)] opacity-55 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

