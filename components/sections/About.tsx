/**
 * About Section — Chapter 7: GSAP Aesthetic
 * 
 * Monospace "Code Editor" panels for team bios.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { id: "muhilan", name: "Muhilan Raj", role: "Founder & CEO", handle: "@muhilan" },
  { id: "dhanush", name: "Dhanush", role: "CTO", handle: "@dhanush" },
  { id: "muneer", name: "Muneer", role: "CFO", handle: "@muneer" },
  { id: "rahul", name: "Rahul", role: "CMO", handle: "@rahul" },
  { id: "danupeter", name: "Danu Peter", role: "CPO", handle: "@danupeter" },
  { id: "abishake", name: "Abishake", role: "Data Scientist", handle: "@abishake" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      createLineReveal(headingRef.current, { start: "top 80%" });

      // Staggered Code Panel Reveal
      gsap.set(".gsap-code-card", { scale: 0.8, opacity: 0, rotation: -5 });
      gsap.to(".gsap-code-card", {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".gsap-team-grid",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-container bg-[var(--dark-surface)] py-32 px-6 border-t border-[var(--dark-border)]"
      aria-label="About Inan Infinites"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionDivider variant="cream" showTagline={false} />
          <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">
            // The Core Team
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase"
            style={{
              fontSize: "clamp(2rem, 4vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Minds Behind <br />
            <span className="gsap-text-gradient">The Machine</span>
          </h2>
        </div>

        {/* Team Grid */}
        <div className="gsap-team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <article
              key={member.id}
              className="gsap-code-card bg-[var(--dark)] border-2 border-[var(--dark-border)] rounded-xl overflow-hidden hover:border-[var(--gsap-purple)] transition-colors duration-300 group"
              style={{ boxShadow: "6px 6px 0px rgba(0,0,0,1)" }}
            >
              {/* Fake Window Controls */}
              <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-[var(--dark-border)] bg-[var(--dark-surface)]">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-mono text-xs text-[var(--light)] opacity-50 ml-auto">{member.handle}.ts</span>
              </div>
              
              {/* Fake Code Content */}
              <div className="p-6 font-mono text-sm leading-loose">
                <div><span className="text-[var(--gsap-purple)]">const</span> <span className="text-[var(--gsap-blue)]">member</span> = {"{"}</div>
                <div className="pl-4">
                  <span className="text-[var(--light)] opacity-70">name:</span> <span className="text-[var(--gsap-green)]">"{member.name}"</span>,
                </div>
                <div className="pl-4">
                  <span className="text-[var(--light)] opacity-70">role:</span> <span className="text-[var(--gsap-green)]">"{member.role}"</span>,
                </div>
                <div className="pl-4 flex gap-4 mt-2">
                  <span className="text-[var(--gsap-blue)] cursor-pointer hover:text-[var(--light)] transition-colors">{"<LinkedIn />"}</span>
                  <span className="text-[var(--gsap-blue)] cursor-pointer hover:text-[var(--light)] transition-colors">{"<Twitter />"}</span>
                </div>
                <div>{"};"}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
