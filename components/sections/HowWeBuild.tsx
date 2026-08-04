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
  { num: "01", title: "DISCOVERY", desc: "We map the territory. Deep dives into architecture, goals, and constraints." },
  { num: "02", title: "PROTOTYPING", desc: "Rapid iteration. We build disposable prototypes to validate assumptions fast." },
  { num: "03", title: "ENGINEERING", desc: "Writing code that scales. Clean, modular, and production-ready." },
  { num: "04", title: "DEPLOYMENT", desc: "Zero-downtime shipping. CI/CD pipelines that let you deploy on Fridays." },
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
          gsap.from(node, {
            x: i % 2 === 0 ? -50 : 50,
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
          
          {/* Background SVG Line (Desktop) */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[300px] hidden md:block -z-10">
            <svg width="100%" height="100%" viewBox="0 0 300 800" preserveAspectRatio="none">
              {/* Dim background line */}
              <path 
                d="M150,0 C150,150 50,200 50,300 C50,400 250,500 250,600 C250,700 150,750 150,800" 
                fill="none" 
                stroke="var(--dark-border)" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
              {/* Highlight active line */}
              <path 
                ref={pathRef}
                d="M150,0 C150,150 50,200 50,300 C50,400 250,500 250,600 C250,700 150,750 150,800" 
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

          <div className="flex flex-col gap-12 md:gap-32">
            {PROCESS_STEPS.map((step, idx) => (
              <div 
                key={step.num}
                className={`process-node flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 ${idx % 2 === 0 ? 'md:pr-[50%]' : 'md:pl-[50%] md:flex-row-reverse'}`}
              >
                {/* Node Dot / Number */}
                <div className={`relative ${idx % 2 === 0 ? 'md:-mr-6' : 'md:-ml-6'} z-10 shrink-0`}>
                  <div className="w-12 h-12 rounded-full bg-[var(--dark)] border-2 border-[var(--gsap-green)] flex items-center justify-center font-mono font-bold text-[var(--gsap-green)] shadow-[0_0_15px_rgba(138,230,20,0.3)]">
                    {step.num}
                  </div>
                </div>

                {/* Content Panel */}
                <div className="process-card bg-white/10 backdrop-blur-2xl border border-[var(--gsap-green)] shadow-[0_0_20px_rgba(138,230,20,0.2)] p-6 md:p-8 rounded-3xl w-full hover:shadow-[0_0_30px_rgba(138,230,20,0.4)] hover:bg-white/20 transition-all duration-300 group">
                  <h3 className="font-sans font-black text-2xl text-[var(--light)] mb-2 uppercase tracking-tight group-hover:text-[var(--gsap-green)] transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm text-[var(--light)] opacity-70">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
