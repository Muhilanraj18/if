/**
 * About Section — Chapter 7
 *
 * Team cards — all 8 members, names listed as "Soon Revealed".
 * Roles: CEO · CTO · CFO · CMO · CPO · CDO · COO · CHRO
 * Professional clay card design with avatar, role badge, and social footer.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger);

type Member = {
  id: string;
  role: string;
  handle: string;
  accentVar: string;
};

const TEAM: Member[] = [
  { id: "ceo",  role: "CEO",  handle: "@inan.ceo",  accentVar: "--gsap-green"  },
  { id: "cto",  role: "CTO",  handle: "@inan.cto",  accentVar: "--gsap-purple" },
  { id: "cfo",  role: "CFO",  handle: "@inan.cfo",  accentVar: "--gsap-amber"  },
  { id: "cmo",  role: "CMO",  handle: "@inan.cmo",  accentVar: "--gsap-teal"   },
  { id: "cpo",  role: "CPO",  handle: "@inan.cpo",  accentVar: "--gsap-green"  },
  { id: "cdo",  role: "CDO",  handle: "@inan.cdo",  accentVar: "--gsap-purple" },
  { id: "coo",  role: "COO",  handle: "@inan.coo",  accentVar: "--gsap-amber"  },
  { id: "chro", role: "CHRO", handle: "@inan.chro", accentVar: "--gsap-teal"   },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;
      createLineReveal(headingRef.current, { start: "top 80%" });

      /* Staggered card entrance */
      gsap.set(".team-card", { y: 50, opacity: 0, scale: 0.92 });
      gsap.to(".team-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: { each: 0.08, from: "start" },
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".team-grid",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      /* Subtle hover float per card */
      gsap.utils.toArray<HTMLElement>(".team-card").forEach((card) => {
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
      className="section-container py-28 px-4 sm:px-6"
      style={{
        background: "linear-gradient(180deg, var(--dark) 0%, var(--dark-surface) 100%)",
      }}
      aria-label="About Inan Infinites — The Core Team"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16 md:mb-20">
          <SectionDivider variant="cream" showTagline={false} />
          <p
            className="font-mono text-xs tracking-[0.38em] uppercase mb-4 font-bold mt-6"
            style={{ color: "var(--gsap-green)" }}
          >
            // The Core Team
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase"
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Minds Behind&nbsp;
            <br className="sm:hidden" />
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

        {/* ── Team Grid ── */}
        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {TEAM.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Individual Card ─────────────────────────────────────────────── */
function MemberCard({ member }: { member: Member }) {
  const accent = `var(${member.accentVar})`;

  return (
    <article
      className="team-card clay-card group cursor-default w-full max-w-xs mx-auto sm:max-w-none flex flex-col"
      style={{ borderRadius: 24 }}
    >
      {/* Colored accent specular line at top */}
      <div
        className="absolute top-0 left-[8%] w-[84%] h-[1.5px] pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent} 30%, ${accent} 70%, transparent)`,
          opacity: 0.65,
        }}
      />

      {/* Ambient accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${accent} 18%, transparent) 0%, transparent 65%)`,
          borderRadius: 24,
        }}
      />

      {/* Card header — role badge + status */}
      <div
        className="px-5 py-4 flex items-center justify-between relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 18%, transparent) 0%, color-mix(in srgb, ${accent} 6%, transparent) 100%)`,
            border: `1px solid color-mix(in srgb, ${accent} 45%, transparent)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 8px color-mix(in srgb, ${accent} 18%, transparent)`,
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
          />
          <span
            className="font-mono text-[10px] font-black tracking-[0.22em] uppercase"
            style={{ color: accent }}
          >
            {member.role}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-widest uppercase opacity-35 text-[var(--light)]">
          Active
        </span>
      </div>

      {/* Avatar + name body */}
      <div className="px-5 py-6 flex flex-col items-center text-center gap-4 flex-grow relative z-10">
        {/* Avatar circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(155deg, color-mix(in srgb, ${accent} 22%, rgba(255,255,255,0.06)) 0%, color-mix(in srgb, ${accent} 8%, rgba(0,0,0,0.3)) 100%)`,
            border: `1.5px solid color-mix(in srgb, ${accent} 40%, transparent)`,
            boxShadow: `inset 0 2px 0 rgba(255,255,255,0.28), 0 4px 16px color-mix(in srgb, ${accent} 20%, transparent), 0 8px 24px rgba(0,0,0,0.3)`,
          }}
        >
          <span
            className="font-sans font-black text-xl"
            style={{ color: accent, opacity: 0.9 }}
          >
            {member.role.substring(0, 1)}
          </span>
        </div>

        {/* Name + handle */}
        <div>
          <p
            className="font-sans font-bold text-[var(--light)] text-base tracking-tight"
            style={{ opacity: 0.85 }}
          >
            Soon Revealed
          </p>
          <p
            className="font-mono text-[10px] tracking-widest mt-1"
            style={{ color: accent, opacity: 0.55 }}
          >
            {member.handle}
          </p>
        </div>
      </div>

      {/* Footer — social links */}
      <div
        className="px-5 py-4 flex items-center gap-2 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {["LinkedIn", "X"].map((s) => (
          <span
            key={s}
            className="flex-1 text-center font-mono text-[10px] tracking-widest uppercase cursor-pointer py-2 rounded-lg transition-all duration-200 hover:opacity-100"
            style={{
              color: accent,
              opacity: 0.45,
              background: "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
