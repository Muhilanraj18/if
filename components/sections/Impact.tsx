/**
 * Impact Section — Chapter 5: GSAP Aesthetic
 * 
 * Bold typography, massive stats counting up on scroll.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { id: "stat-1", value: 10, suffix: "x", label: "Developer Velocity", color: "var(--gsap-green)" },
  { id: "stat-2", value: 99.9, suffix: "%", label: "Uptime SLA", color: "var(--gsap-purple)" },
  { id: "stat-3", value: 50, suffix: "+", label: "Enterprise Deploys", color: "var(--gsap-blue)" },
  { id: "stat-4", value: 0, suffix: "", label: "Legacy Code Remaining", color: "var(--light)" },
];

export default function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      createLineReveal(headingRef.current, { start: "top 80%" });

      // Animate numbers counting up
      const statElements = gsap.utils.toArray(".gsap-stat-number") as HTMLElement[];
      
      statElements.forEach((stat) => {
        const targetValue = parseFloat(stat.dataset.value || "0");
        const isFloat = targetValue % 1 !== 0;

        gsap.fromTo(stat, 
          { textContent: 0 },
          {
            textContent: targetValue,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: isFloat ? 0.1 : 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              once: true,
            },
            onUpdate: function() {
              // Ensure one decimal place for floats like 99.9
              if (isFloat) {
                 stat.innerHTML = Number(this.targets()[0].textContent).toFixed(1);
              }
            }
          }
        );
      });

      // Staggered reveal for stat blocks
      gsap.set(".gsap-stat-block", { y: 50, opacity: 0 });
      gsap.to(".gsap-stat-block", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".gsap-stats-grid",
          start: "top 85%",
          once: true,
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="section-container bg-[var(--dark)] py-32 px-6 relative overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 gsap-grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <SectionDivider variant="cream" showTagline={false} />
          <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">
            // The Impact
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Engineering <br/>
            <span className="gsap-text-gradient">Outcomes</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="gsap-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div 
              key={stat.id}
              className="gsap-stat-block clay-card p-8 flex flex-col items-center justify-center text-center group"
              style={{ borderRadius: 28 }}
            >
              {/* Per-stat colored top specular */}
              <div
                className="absolute top-0 left-[10%] w-[80%] h-[1.5px] pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.color} 50%, transparent)`,
                  opacity: 0.6,
                }}
              />
              {/* Ambient glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 rounded-[28px]"
                style={{
                  background: `radial-gradient(circle at 50% 20%, ${stat.color}18 0%, transparent 65%)`,
                }}
              />

              <div 
                className="font-sans font-black text-6xl md:text-7xl tracking-tighter mb-4 flex items-baseline relative z-10"
                style={{ color: stat.color }}
              >
                <span className="gsap-stat-number" data-value={stat.value}>
                  0
                </span>
                <span className="text-4xl md:text-5xl ml-1">{stat.suffix}</span>
              </div>
              <p className="font-mono text-sm text-[var(--light)] font-bold uppercase tracking-wider relative z-10 opacity-80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

