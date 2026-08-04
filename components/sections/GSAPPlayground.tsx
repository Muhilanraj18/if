"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SectionDivider from "@/components/ui/SectionDivider";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function GSAPPlayground() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  /* Refs for the SVGs */
  const butterflyRef = useRef<HTMLDivElement>(null);
  const leftWingRef  = useRef<SVGGElement>(null);
  const rightWingRef = useRef<SVGGElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const windmillBladesRef = useRef<HTMLDivElement>(null);
  const kiteRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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

        // The inner elements (butterfly, ball, etc.) will animate relative to this scrub timeline
        tl.to(butterflyRef.current, { y: -30, rotation: 10, ease: "sine.inOut" }, 0);
        tl.to(ballRef.current, { x: 40, rotation: 360, ease: "none" }, 0);
        tl.to(windmillBladesRef.current, { rotation: 720, ease: "none" }, 0);
        tl.to(kiteRef.current, { y: -40, x: 20, rotation: -15, ease: "power1.inOut" }, 0);
      });

      mm.add("(max-width: 1023px)", () => {
        // Vertical mobile layout animations
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

        // Fallback scrub animations for mobile vertical scrolling
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
    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(24px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 450px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.4s ease, box-shadow 0.4s ease;
    }
    .feature-card:hover {
      border-color: rgba(138, 230, 20, 0.8); /* Match gsap-green hover theme */
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
      background: rgba(255, 255, 255, 0.15);
    }
    .feature-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .feature-card:hover::before {
      opacity: 1;
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
          <p className="font-mono text-[var(--light)] opacity-55 text-sm max-w-xl leading-relaxed mt-4">
            Fluid. Expressive. Scalable.{" "}
            <span className="text-[var(--gsap-purple)]">Every pixel moves</span> with
            intent — organized and engineered for maximum performance.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full overflow-visible">
        {/* ── HORIZONTAL SCROLL CARDS ── */}
        <div 
          ref={horizontalContainerRef} 
          className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:w-max"
          style={{ willChange: "transform", paddingRight: "10vw" }}
        >
          
          {/* Card 1: Butterfly */}
          <article className="feature-card w-full lg:w-[480px] shrink-0">
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
                  <ellipse cx="0" cy="2"   rx="4.5" ry="25" fill="#8ae614" />
                  <ellipse cx="0" cy="-18" rx="5.5" ry="7"  fill="#a8f028" />
                  <path d="M-3,-23 Q-15,-40 -11,-52" stroke="#8ae614" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d=" M3,-23 Q 15,-40  11,-52" stroke="#8ae614" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="-11" cy="-52" r="3" fill="#8ae614" />
                  <circle cx=" 11" cy="-52" r="3" fill="#8ae614" />
                </svg>
              </div>
            </div>
            <div className="mt-8 text-center px-4">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-3">Organic Motion</h3>
              <p className="font-mono text-sm text-[var(--light)] opacity-60 leading-relaxed">Complex SVG paths combined with lifelike physics and fluid easing curves.</p>
            </div>
          </article>

          {/* Card 2: Ball */}
          <article className="feature-card w-full lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-center justify-center w-full relative">
              <div ref={ballRef} className="will-change-transform z-10" style={{ transform: "translateX(-20px)" }}>
                <svg viewBox="-46 -46 92 92" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                  <circle r="44" fill="#ce26ff" />
                  <path d="M-44,0 Q0,-22 44,0" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
                  <path d="M-44,12 Q0,-10 44,12" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
                  <path d="M-40,-20 Q0,-42 40,-20" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
                  <ellipse rx="44" ry="17" fill="none" stroke="rgba(206,38,255,0.35)" strokeWidth="2.5" />
                  <circle cx="-13" cy="-15" r="12" fill="rgba(255,255,255,0.22)" />
                  <circle cx="-8" cy="-10" r="5" fill="rgba(255,255,255,0.18)" />
                </svg>
                <div style={{ width: "100px", height: "10px", background: "radial-gradient(ellipse at center, rgba(206,38,255,0.55) 0%, transparent 75%)", marginTop: "6px" }} />
              </div>
            </div>
            <div className="mt-8 text-center px-4">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-3">Kinetic Flow</h3>
              <p className="font-mono text-sm text-[var(--light)] opacity-60 leading-relaxed">Scroll-driven translations mapping precise pixel space to viewport time.</p>
            </div>
          </article>

          {/* Card 3: Windmill */}
          <article className="feature-card w-full lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-end justify-center w-full relative pt-12">
              <div style={{ position: "relative", width: "90px" }}>
                <div ref={windmillBladesRef} style={{ position: "absolute", top: "-55px", left: "-15px", width: "120px", height: "120px", zIndex: 2 }}>
                  <svg viewBox="-60 -60 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                    <rect x="-7" y="-58" width="14" height="60" rx="7" fill="#8ae614" />
                    <rect x="2" y="-7" width="58" height="14" rx="7" fill="#8ae614" />
                    <rect x="-7" y="-2" width="14" height="60" rx="7" fill="rgba(138,230,20,0.6)" />
                    <rect x="-60" y="-7" width="58" height="14" rx="7" fill="rgba(138,230,20,0.6)" />
                    <circle r="16" fill="none" stroke="rgba(138,230,20,0.25)" strokeWidth="8" style={{ animation: "hub-pulse 2s ease-in-out infinite" }} />
                    <circle r="12" fill="#1a1c1a" stroke="#8ae614" strokeWidth="2.5" />
                    <circle r="5" fill="#8ae614" />
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
            <div className="mt-8 text-center px-4">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-3">Sustainable Power</h3>
              <p className="font-mono text-sm text-[var(--light)] opacity-60 leading-relaxed">Robust, infinitely optimized loop components running at a steady 60fps.</p>
            </div>
          </article>

          {/* Card 4: Kite */}
          <article className="feature-card w-full lg:w-[480px] shrink-0">
            <div className="flex-grow flex items-center justify-center w-full relative">
              <div ref={kiteRef} className="will-change-transform z-10">
                <svg viewBox="-68 -92 136 390" width="100" height="280" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,-88 L62,0 L0,88 L-62,0 Z" fill="#26a8ff" />
                  <path d="M0,-88 L62,0 L0,0 Z" fill="rgba(255,255,255,0.12)" />
                  <path d="M0,0 L0,88 L-62,0 Z" fill="rgba(0,0,0,0.10)" />
                  <line x1="-62" y1="0" x2="62" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <line x1="0" y1="-88" x2="0" y2="88" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <path d="M0,-88 L62,0 L0,88 L-62,0 Z" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
                  <circle r="6" fill="rgba(255,255,255,0.7)" />
                  <path d="M0,88 Q30,120 18,160 Q6,196 32,222 Q50,244 24,272 Q10,288 34,308" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="35" cy="310" rx="14" ry="6" fill="#ce26ff" transform="rotate(22, 35, 310)" />
                  <ellipse cx="22" cy="278" rx="14" ry="6" fill="#FF7A2F" transform="rotate(-14,22, 278)" />
                  <ellipse cx="33" cy="247" rx="14" ry="6" fill="#8ae614" transform="rotate(20, 33, 247)" />
                  <ellipse cx="14" cy="216" rx="14" ry="6" fill="#26a8ff" transform="rotate(-9, 14, 216)" opacity="0.85" />
                </svg>
              </div>
            </div>
            <div className="mt-8 text-center px-4">
              <h3 className="font-mono text-sm font-bold text-[var(--light)] uppercase tracking-widest mb-3">Elevated Design</h3>
              <p className="font-mono text-sm text-[var(--light)] opacity-60 leading-relaxed">Lifting brand experiences and engineering beyond the standard static page.</p>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
