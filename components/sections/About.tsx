/**
 * About Section — Chapter 7
 *
 * Team cards — all 8 members, names listed as "Soon Revealed".
 * Roles: CEO · CTO · CFO · CMO · CPO · CDO · COO · CHRO
 * Colour theory: orange/amber glass cards, warm ember accents.
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
  accentVar: string;      // CSS var for card accent colour
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
        background:
          "linear-gradient(180deg, var(--dark) 0%, var(--dark-surface) 100%)",
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
                background:
                  "linear-gradient(110deg, var(--gsap-green) 0%, var(--gsap-teal) 50%, var(--gsap-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Machine
            </span>
          </h2>
          <p
            className="font-mono text-sm mt-5 max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--light)", opacity: 0.5 }}
          >
            8 roles. Infinite vision. Names reveal as we grow.
          </p>
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
      className="team-card clay-card group cursor-default w-full max-w-xs mx-auto sm:max-w-none"
      style={{
        borderRadius: 28,
        /* Per-card accent tint overlay handled below */
      }}
    >
      {/* Colored accent specular line at top */}
      <div
        className="absolute top-0 left-[8%] w-[84%] h-[1.5px] pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent} 30%, ${accent} 70%, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Ambient accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accent}20 0%, transparent 60%)`,
          borderRadius: 28,
        }}
      />

      {/* Window dots */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,75,43,0.75)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 4px rgba(255,75,43,0.4)" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,184,48,0.75)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 4px rgba(255,184,48,0.4)" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(40,200,80,0.7)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 4px rgba(40,200,80,0.4)" }} />
        <span
          className="font-mono text-[10px] ml-auto tracking-widest"
          style={{ color: accent, opacity: 0.7 }}
        >
          {member.handle}
        </span>
      </div>

      {/* Code content */}
      <div className="p-5 font-mono text-xs leading-loose relative z-10">
        {/* Role badge */}
        <div
          className="clay-tag inline-block px-3 py-1 mb-4 font-bold text-[10px] tracking-[0.22em] uppercase"
          style={{
            background: `linear-gradient(135deg, ${accent}20 0%, ${accent}08 100%)`,
            border: `1px solid ${accent}50`,
            color: accent,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px ${accent}20`,
          }}
        >
          {member.role}
        </div>

        <div style={{ color: "rgba(240,242,239,0.45)" }}>const member = {"{"}</div>

        <div className="pl-4 mt-1">
          <span style={{ color: "rgba(240,242,239,0.45)" }}>name:&nbsp;</span>
          <span
            className="italic"
            style={{
              color: accent,
              opacity: 0.85,
            }}
          >
            &quot;Soon Revealed&quot;
          </span>
          ,
        </div>

        <div className="pl-4">
          <span style={{ color: "rgba(240,242,239,0.45)" }}>status:&nbsp;</span>
          <span style={{ color: accent, opacity: 0.75 }}>
            &quot;Active&quot;
          </span>
          ,
        </div>

        <div style={{ color: "rgba(240,242,239,0.45)" }}>{"};"}</div>

        {/* Social links */}
        <div className="flex gap-3 mt-4">
          {["LinkedIn", "X"].map((s) => (
            <span
              key={s}
              className="clay-tag text-[10px] tracking-widest uppercase cursor-pointer px-2.5 py-1 hover:opacity-100 transition-all"
              style={{
                color: accent,
                opacity: 0.6,
                background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
