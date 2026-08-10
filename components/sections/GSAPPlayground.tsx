"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SectionDivider from "@/components/ui/SectionDivider";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function GSAPPlayground() {
  const sectionRef              = useRef<HTMLElement>(null);
  const horizontalContainerRef  = useRef<HTMLDivElement>(null);

  /* Refs for the SVGs */
  const butterflyRef    = useRef<HTMLDivElement>(null);
  const leftWingRef     = useRef<SVGGElement>(null);
  const rightWingRef    = useRef<SVGGElement>(null);
  const ballRef         = useRef<HTMLDivElement>(null);
  const windmillBladesRef = useRef<HTMLDivElement>(null);
  const kiteRef         = useRef<HTMLDivElement>(null);
  const headingRef      = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* ── 1. Heading Entrance (Jumping & Flying) ───────────────────────────── */
      if (headingRef.current) {
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
      }

      /* ── 2. Horizontal Scroll Setup ─────────────────────────────── */
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!horizontalContainerRef.current) return;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: true,
            start: "bottom bottom",
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

        // Inner elements animate relative to scrub timeline
        tl.to(butterflyRef.current, { y: -30, rotation: 10, ease: "sine.inOut" }, 0);
        tl.to(ballRef.current, { x: 40, rotation: 360, ease: "none" }, 0);
        tl.to(windmillBladesRef.current, { rotation: 720, ease: "none" }, 0);
        tl.to(kiteRef.current, { y: -40, x: 20, rotation: -15, ease: "power1.inOut" }, 0);
      });

      mm.add("(max-width: 1023px)", () => {
        if (!horizontalContainerRef.current) return;
        const cards = gsap.utils.toArray(".feature-card") as HTMLElement[];
        
        cards.forEach((card) => {
          gsap.from(card, {
            y: 80,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        scrollTl.to(butterflyRef.current, { y: -30, rotation: 10, ease: "sine.inOut" }, 0);
        scrollTl.to(ballRef.current, { x: 40, rotation: 360, ease: "none" }, 0);
        scrollTl.to(windmillBladesRef.current, { rotation: 720, ease: "none" }, 0);
        scrollTl.to(kiteRef.current, { y: -40, x: 20, rotation: -15, ease: "power1.inOut" }, 0);
      });

      // Butterfly wings: infinite flapping
      if (leftWingRef.current && rightWingRef.current) {
        gsap.to([leftWingRef.current, rightWingRef.current], {
          scaleX: 0.15,
          duration: 0.25,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          svgOrigin: "0 0",
        });
      }
    },
    { scope: sectionRef }
  );

  const style = `
    @keyframes hub-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }
    @keyframes plane-trail {
      0%   { opacity: 0.6; width: 0; }
      100% { opacity: 0;   width: 80px; }
    }
    .feature-card {
      position: relative;
      border-radius: 28px;
      background: linear-gradient(
        155deg,
        rgba(255, 255, 255, 0.17) 0%,
        rgba(255, 255, 255, 0.09) 30%,
        rgba(255, 255, 255, 0.04) 65%,
        rgba(0, 0, 0, 0.04) 100%
      );
      backdrop-filter: blur(40px) saturate(180%) brightness(1.1);
      -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(1.1);
      border: 1px solid rgba(255, 255, 255, 0.22);
      box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.62),
        inset 2px 0 0 rgba(255, 255, 255, 0.22),
        inset -1px 0 0 rgba(0, 0, 0, 0.08),
        inset 0 -2px 6px rgba(0, 0, 0, 0.22),
        0 2px 4px rgba(0, 0, 0, 0.35),
        0 6px 16px rgba(0, 0, 0, 0.28),
        0 16px 40px rgba(0, 0, 0, 0.2),
        0 36px 72px rgba(0, 0, 0, 0.14),
        0 0 0 1px rgba(255, 255, 255, 0.07),
        0 4px 0 rgba(0, 0, 0, 0.45);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 450px;
      overflow: hidden;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
    }
    .feature-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 55%;
      height: 100%;
      background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 60%, transparent 100%);
      transform: translateX(-130%) skewX(-20deg);
      pointer-events: none;
      z-index: 1;
      transition: none;
    }
    .feature-card:hover::before {
      animation: clay-sheen 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    .feature-card::after {
      content: "";
      position: absolute;
      top: 0;
      left: 6%;
      width: 88%;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 20%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.45) 80%, transparent 100%);
      border-radius: 0 0 50% 50%;
      pointer-events: none;
      z-index: 2;
      filter: blur(0.5px);
    }
    .feature-card:hover {
      transform: translateY(-8px) scale(1.015);
      box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.7),
        inset 2px 0 0 rgba(255, 255, 255, 0.28),
        inset -1px 0 0 rgba(0, 0, 0, 0.06),
        inset 0 -2px 6px rgba(0, 0, 0, 0.18),
        0 4px 8px rgba(0, 0, 0, 0.4),
        0 12px 28px rgba(0, 0, 0, 0.32),
        0 28px 60px rgba(0, 0, 0, 0.24),
        0 56px 96px rgba(0, 0, 0, 0.16),
        0 0 0 1px rgba(255, 255, 255, 0.12),
        0 6px 0 rgba(0, 0, 0, 0.5);
      border-color: rgba(255, 255, 255, 0.32);
    }
    .paper-plane-trail {
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      height: 2px;
      background: linear-gradient(to left, rgba(157,255,47,0.6), transparent);
      animation: plane-trail 0.6s ease-out infinite;
    }
  `;

  return (
    <section
      ref={sectionRef}
      id="playground"
      className="section-container relative overflow-hidden bg-[var(--dark)] min-h-screen flex flex-col justify-center py-20"
    >
      <style>{style}</style>

      {/* Subtle grid background */}
      <div className="absolute inset-0 gsap-grid-bg opacity-20 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full mb-12">
        {/* ── HEADER ── */}
        <div ref={headingRef} className="flex flex-col items-center text-center">
          <SectionDivider variant="neon" showTagline={false} />
          <p className="font-mono text-[var(--gsap-purple)] text-xs tracking-[0.4em] uppercase font-bold mb-6 mt-12">
            // CREATIVE ENGINEERING
          </p>
          <h2
            className="font-sans font-black text-[var(--light)] uppercase mb-6"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            INFINITE
            <br />
            <span style={{ WebkitTextStroke: "2px var(--gsap-purple)", color: "transparent" }}>
              POSSIBILITIES
            </span>
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full overflow-visible">
        {/* ── BENTO METRICS GRID ── */}
        <div
          ref={horizontalContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
          style={{ willChange: "transform" }}
        >
          {/* Stat Card — Projects */}
          <div className="feature-card col-span-1 !min-h-[220px] !items-start !justify-between !p-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gsap-green)" }}># Delivered</p>
              <p className="font-sans font-black text-[var(--light)]" style={{ fontSize: "5rem", lineHeight: 1, letterSpacing: "-0.06em" }}>
                120<span className="text-[var(--gsap-green)]" style={{ fontSize: "3rem" }}>+</span>
              </p>
              <p className="font-mono text-xs text-[var(--light)] opacity-45 mt-2">Projects shipped worldwide</p>
            </div>
            <div ref={butterflyRef} className="absolute bottom-4 right-6 opacity-30 will-change-transform z-0 pointer-events-none">
              <svg viewBox="-72 -58 144 114" width="70" height="56" xmlns="http://www.w3.org/2000/svg">
                <g ref={leftWingRef}>
                  <ellipse cx="-33" cy="-18" rx="37" ry="23" fill="#FF7A2F" opacity="0.96" />
                  <ellipse cx="-25" cy="15"  rx="24" ry="17" fill="#FFB347" opacity="0.88" />
                </g>
                <g ref={rightWingRef}>
                  <ellipse cx="33"  cy="-18" rx="37" ry="23" fill="#FF7A2F" opacity="0.96" />
                  <ellipse cx="25"  cy="15"  rx="24" ry="17" fill="#FFB347" opacity="0.88" />
                </g>
                <ellipse cx="0" cy="2" rx="4.5" ry="25" fill="#9dff2f" />
              </svg>
            </div>
          </div>

          {/* Stat Card — Clients */}
          <div className="feature-card col-span-1 !min-h-[220px] !items-start !justify-between !p-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gsap-teal)" }}># Global Reach</p>
              <p className="font-sans font-black text-[var(--light)]" style={{ fontSize: "5rem", lineHeight: 1, letterSpacing: "-0.06em" }}>
                18<span className="text-[var(--gsap-teal)]" style={{ fontSize: "3rem" }}>+</span>
              </p>
              <p className="font-mono text-xs text-[var(--light)] opacity-45 mt-2">Countries served</p>
            </div>
            <div ref={kiteRef} className="absolute bottom-4 right-6 opacity-25 will-change-transform z-0 pointer-events-none">
              <svg viewBox="-68 -92 136 200" width="50" height="120" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,-88 L62,0 L0,88 L-62,0 Z" fill="#2aabff" />
                <path d="M0,-88 L62,0 L0,0 Z" fill="rgba(255,255,255,0.12)" />
                <line x1="-62" y1="0" x2="62" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <line x1="0" y1="-88" x2="0" y2="88" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Stat Card — Uptime */}
          <div className="feature-card col-span-1 !min-h-[220px] !items-start !justify-between !p-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gsap-purple)" }}># Reliability</p>
              <p className="font-sans font-black text-[var(--light)]" style={{ fontSize: "5rem", lineHeight: 1, letterSpacing: "-0.06em" }}>
                99.<span className="text-[var(--gsap-purple)]" style={{ fontSize: "2.5rem" }}>9%</span>
              </p>
              <p className="font-mono text-xs text-[var(--light)] opacity-45 mt-2">Average platform uptime</p>
            </div>
            <div ref={ballRef} className="absolute bottom-4 right-6 opacity-20 will-change-transform z-0 pointer-events-none">
              <svg viewBox="-46 -46 92 92" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                <circle r="44" fill="#c026ff" />
                <path d="M-44,0 Q0,-22 44,0" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
                <circle cx="-13" cy="-15" r="12" fill="rgba(255,255,255,0.22)" />
              </svg>
            </div>
          </div>

          {/* Wide card — Capabilities */}
          <div className="feature-card col-span-1 sm:col-span-2 !min-h-[200px] !items-start !p-8">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: "var(--gsap-amber)" }}># What We Master</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Product Engineering", "AI & LLM Integration", "Cloud Infrastructure",
                "Real-time Systems", "Mobile Apps", "API Design",
                "Data Pipelines", "DevOps & CI/CD", "UX Engineering",
                "Security Hardening",
              ].map((cap) => (
                <span
                  key={cap}
                  className="font-mono text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(240,242,239,0.8)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Windmill card — Speed stat */}
          <div className="feature-card col-span-1 !min-h-[200px] !items-start !justify-between !p-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gsap-blue)" }}># Ship Speed</p>
              <p className="font-sans font-black text-[var(--light)]" style={{ fontSize: "5rem", lineHeight: 1, letterSpacing: "-0.06em" }}>
                2<span className="text-[var(--gsap-blue)]" style={{ fontSize: "2.2rem" }}>wks</span>
              </p>
              <p className="font-mono text-xs text-[var(--light)] opacity-45 mt-2">Average MVP to production</p>
            </div>
            <div ref={windmillBladesRef} className="absolute bottom-4 right-4 opacity-20 z-0 pointer-events-none" style={{ width: 60, height: 60 }}>
              <svg viewBox="-60 -60 120 120" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                <rect x="-7" y="-58" width="14" height="60" rx="7" fill="#9dff2f" />
                <rect x="2" y="-7" width="58" height="14" rx="7" fill="#9dff2f" />
                <rect x="-7" y="-2" width="14" height="60" rx="7" fill="rgba(157,255,47,0.6)" />
                <rect x="-60" y="-7" width="58" height="14" rx="7" fill="rgba(157,255,47,0.6)" />
                <circle r="12" fill="#1a1c1a" stroke="#9dff2f" strokeWidth="2.5" />
                <circle r="5" fill="#9dff2f" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
