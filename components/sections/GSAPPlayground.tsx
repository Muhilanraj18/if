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
        {/* ── HORIZONTAL SCROLL CARDS ── */}
        <div 
          ref={horizontalContainerRef} 
          className="flex flex-col items-center lg:items-start lg:flex-row gap-6 lg:gap-12 lg:w-max lg:pr-[10vw]"
          style={{ willChange: "transform" }}
        >
          
          {/* Card 1: Butterfly */}
          <article className="feature-card w-full max-w-md lg:max-w-none lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-center justify-center w-full relative">
              <div ref={butterflyRef} className="will-change-transform z-10">
                <svg viewBox="-72 -58 144 114" width="120" height="96" xmlns="http://www.w3.org/2000/svg">
                  <g ref={leftWingRef}>
                    <ellipse cx="-33" cy="-18" rx="37" ry="23" fill="#FF7A2F" opacity="0.96" />
                    <circle  cx="-29" cy="-14" r="6.5" fill="rgba(255,255,255,0.2)" />
                    <circle  cx="-48" cy="-27" r="4.5" fill="rgba(0,0,0,0.15)" />
                    <ellipse cx="-26" cy="-10" rx="10" ry="5" fill="rgba(255,200,80,0.4)" />
                    <ellipse cx="-25" cy="15"  rx="24" ry="17" fill="#FFB347" opacity="0.88" />
                    <circle  cx="-22" cy="12"  r="4.5" fill="rgba(255,255,255,0.18)" />
                  </g>
                  <g ref={rightWingRef}>
                    <ellipse cx="33"  cy="-18" rx="37" ry="23" fill="#FF7A2F" opacity="0.96" />
                    <circle  cx="29"  cy="-14" r="6.5" fill="rgba(255,255,255,0.2)" />
                    <circle  cx="48"  cy="-27" r="4.5" fill="rgba(0,0,0,0.15)" />
                    <ellipse cx="26"  cy="-10" rx="10" ry="5" fill="rgba(255,200,80,0.4)" />
                    <ellipse cx="25"  cy="15"  rx="24" ry="17" fill="#FFB347" opacity="0.88" />
                    <circle  cx="22"  cy="12"  r="4.5" fill="rgba(255,255,255,0.18)" />
                  </g>
                  <ellipse cx="0" cy="2"   rx="4.5" ry="25" fill="#9dff2f" />
                  <ellipse cx="0" cy="-18" rx="5.5" ry="7"  fill="#b8ff5a" />
                  <path d="M-3,-23 Q-15,-40 -11,-52" stroke="#9dff2f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d=" M3,-23 Q 15,-40  11,-52" stroke="#9dff2f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="-11" cy="-52" r="3" fill="#9dff2f" />
                  <circle cx=" 11" cy="-52" r="3" fill="#9dff2f" />
                </svg>
              </div>
            </div>
            <div className="mt-8 text-center px-4 relative z-10">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-2">Organic Motion</h3>
              <p className="font-mono text-xs text-[var(--light)] opacity-50 leading-relaxed">Lifelike physics. Fluid easing curves.</p>
            </div>
          </article>

          {/* Card 2: Ball */}
          <article className="feature-card w-full max-w-md lg:max-w-none lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-center justify-center w-full relative">
              <div ref={ballRef} className="will-change-transform z-10" style={{ transform: "translateX(-20px)" }}>
                <svg viewBox="-46 -46 92 92" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                  <circle r="44" fill="#c026ff" />
                  <path d="M-44,0 Q0,-22 44,0" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
                  <path d="M-44,12 Q0,-10 44,12" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
                  <path d="M-40,-20 Q0,-42 40,-20" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
                  <ellipse rx="44" ry="17" fill="none" stroke="rgba(192,38,255,0.35)" strokeWidth="2.5" />
                  <circle cx="-13" cy="-15" r="12" fill="rgba(255,255,255,0.22)" />
                  <circle cx="-8" cy="-10" r="5" fill="rgba(255,255,255,0.18)" />
                </svg>
                <div style={{ width: "100px", height: "10px", background: "radial-gradient(ellipse at center, rgba(192,38,255,0.55) 0%, transparent 75%)", marginTop: "6px" }} />
              </div>
            </div>
            <div className="mt-8 text-center px-4 relative z-10">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-2">Kinetic Flow</h3>
              <p className="font-mono text-xs text-[var(--light)] opacity-50 leading-relaxed">Scroll-driven translations at 60fps.</p>
            </div>
          </article>

          {/* Card 3: Windmill */}
          <article className="feature-card w-full max-w-md lg:max-w-none lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-end justify-center w-full relative pt-12">
              <div style={{ position: "relative", width: "90px" }}>
                <div ref={windmillBladesRef} style={{ position: "absolute", top: "-55px", left: "-15px", width: "120px", height: "120px", zIndex: 2 }}>
                  <svg viewBox="-60 -60 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                    <rect x="-7" y="-58" width="14" height="60" rx="7" fill="#9dff2f" />
                    <rect x="2" y="-7" width="58" height="14" rx="7" fill="#9dff2f" />
                    <rect x="-7" y="-2" width="14" height="60" rx="7" fill="rgba(157,255,47,0.6)" />
                    <rect x="-60" y="-7" width="58" height="14" rx="7" fill="rgba(157,255,47,0.6)" />
                    <circle r="16" fill="none" stroke="rgba(157,255,47,0.25)" strokeWidth="8" style={{ animation: "hub-pulse 2s ease-in-out infinite" }} />
                    <circle r="12" fill="#1a1c1a" stroke="#9dff2f" strokeWidth="2.5" />
                    <circle r="5" fill="#9dff2f" />
                  </svg>
                </div>
                <svg viewBox="0 0 100 238" width="90" height="180" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                  <polygon points="42,0 58,0 65,238 35,238" fill="#1a1c1a" />
                  <polygon points="42,0 58,0 65,238 35,238" fill="none" stroke="var(--dark-border)" strokeWidth="1.5" />
                  <ellipse cx="50" cy="115" rx="7" ry="9" fill="var(--dark)" stroke="var(--dark-border)" strokeWidth="1" />
                  <ellipse cx="50" cy="158" rx="7" ry="9" fill="var(--dark)" stroke="var(--dark-border)" strokeWidth="1" />
                  <path d="M43,207 L43,238 L57,238 L57,207 Q57,199 50,199 Q43,207 43,207Z" fill="var(--dark)" stroke="var(--dark-border)" strokeWidth="1" />
                  <rect x="25" y="232" width="50" height="6" rx="3" fill="#2a2c2a" />
                </svg>
              </div>
            </div>
            <div className="mt-8 text-center px-4 relative z-10">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-2">Sustainable Power</h3>
              <p className="font-mono text-xs text-[var(--light)] opacity-50 leading-relaxed">Infinite loops at a steady 60fps.</p>
            </div>
          </article>

          {/* Card 4: Kite */}
          <article className="feature-card w-full max-w-md lg:max-w-none lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-center justify-center w-full relative">
              <div ref={kiteRef} className="will-change-transform z-10">
                <svg viewBox="-68 -92 136 390" width="100" height="280" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,-88 L62,0 L0,88 L-62,0 Z" fill="#2aabff" />
                  <path d="M0,-88 L62,0 L0,0 Z" fill="rgba(255,255,255,0.12)" />
                  <path d="M0,0 L0,88 L-62,0 Z" fill="rgba(0,0,0,0.10)" />
                  <line x1="-62" y1="0" x2="62" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <line x1="0" y1="-88" x2="0" y2="88" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <path d="M0,-88 L62,0 L0,88 L-62,0 Z" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
                  <circle r="6" fill="rgba(255,255,255,0.7)" />
                  <path d="M0,88 Q30,120 18,160 Q6,196 32,222 Q50,244 24,272 Q10,288 34,308" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="35" cy="310" rx="14" ry="6" fill="#c026ff" transform="rotate(22, 35, 310)" />
                  <ellipse cx="22" cy="278" rx="14" ry="6" fill="#FF7A2F" transform="rotate(-14,22, 278)" />
                  <ellipse cx="33" cy="247" rx="14" ry="6" fill="#9dff2f" transform="rotate(20, 33, 247)" />
                  <ellipse cx="14" cy="216" rx="14" ry="6" fill="#2aabff" transform="rotate(-9, 14, 216)" opacity="0.85" />
                </svg>
              </div>
            </div>
            <div className="mt-8 text-center px-4 relative z-10">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-2">Elevated Design</h3>
              <p className="font-mono text-xs text-[var(--light)] opacity-50 leading-relaxed">Brand experiences beyond the static page.</p>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
