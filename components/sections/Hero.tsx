/**
 * Hero Section — Chapter 1: GSAP Aesthetic
 * 
 * Dark background, neon accents, massive bouncy typography,
 * floating geometric shapes, DrawSVG animated CTA ring, and a massive watermark.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(SplitText, ScrollTrigger, DrawSVGPlugin);

// Seeded particle field — deterministic so no SSR hydration mismatch
const COLORS = ["var(--gsap-green)", "var(--gsap-teal)", "var(--gsap-purple)", "var(--gsap-blue)", "var(--gsap-amber)"];
const PARTICLES = Array.from({ length: 50 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  const rand = (n: number) => ((seed * (n + 1) * 1664525 + 1013904223) >>> 0) / 4294967296;
  return {
    x:        rand(0) * 100,
    y:        rand(1) * 100,
    size:     Math.floor(rand(2) * 5) + 2,
    color:    COLORS[Math.floor(rand(3) * COLORS.length)],
    opacity:  rand(4) * 0.25 + 0.15,
    blur:     rand(5) > 0.5 ? 1 : 0,
    duration: rand(6) * 4 + 2,
    delay:    rand(7) * 4,
  };
});

export default function Hero({ preloaderDone = true }: { preloaderDone?: boolean }) {
  const sectionRef     = useRef<HTMLElement>(null);
  const headlineRef    = useRef<HTMLHeadingElement>(null);
  const infiniteRef    = useRef<HTMLSpanElement>(null);
  const ideasRef       = useRef<HTMLSpanElement>(null);
  const subRef         = useRef<HTMLParagraphElement>(null);
  const ctaRef         = useRef<HTMLAnchorElement>(null);
  const ctaRingRef     = useRef<SVGRectElement>(null);
  const shapesRef      = useRef<HTMLDivElement>(null);
  const watermarkRef   = useRef<HTMLDivElement>(null);
  const cursorGlowRef  = useRef<HTMLDivElement>(null);
  const cursorGlow2Ref = useRef<HTMLDivElement>(null);
  const engineeredRef  = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!headlineRef.current) return;

      if (!preloaderDone) {
        gsap.set([headlineRef.current, subRef.current, ctaRef.current, watermarkRef.current], { opacity: 0 });
        if (shapesRef.current) {
          gsap.set(shapesRef.current.querySelectorAll(".gsap-shape"), { opacity: 0 });
        }
        return;
      }

      // Make visible for animation
      gsap.set([headlineRef.current, subRef.current, ctaRef.current, watermarkRef.current], { opacity: 1 });

      // ── 0. Watermark text fade in
      gsap.fromTo(watermarkRef.current, 
        { opacity: 0, scale: 1.2 },
        { opacity: 0.03, scale: 1, duration: 2, ease: "power2.out" }
      );

      // ── 0.5. Clover Spin
      // CSS transform-box:fill-box makes transform-origin:center use the
      // path's OWN bounding box centre — not the SVG viewport origin.
      // This guarantees the clover always spins around its visual centre.
      gsap.set(".hero-clover", {
        transformBox: "fill-box",
        transformOrigin: "center center",
      });
      gsap.to(".hero-clover", {
        rotation: 360,
        duration: 18,
        ease: "none",
        repeat: -1,
      });

      // ── 1. Animate each headline line individually
      const tl = gsap.timeline();

      tl.from([infiniteRef.current, ideasRef.current], {
        y: 100,
        opacity: 0,
        rotationZ: 5,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.18,
        ease: "back.out(1.7)",
        clearProps: "all",
      });

      // ── 2. Subtitle + CTA reveal
      tl.from(subRef.current, { opacity: 0, y: 25, duration: 0.7, ease: "power2.out" }, "-=0.6");
      tl.from(ctaRef.current, { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.4");

      // ── 2b. DrawSVG: animate ring around CTA button
      if (ctaRingRef.current) {
        tl.fromTo(
          ctaRingRef.current,
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 1.0, ease: "power2.inOut" },
          "-=0.5"
        );
        // After drawing, make it pulse
        gsap.to(ctaRingRef.current, {
          opacity: 0.4,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: tl.duration(),
        });
      }

      // ── 3. Floating geometric shapes animation
      const shapes = shapesRef.current?.querySelectorAll(".gsap-shape");
      if (shapes) {
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            y: `random(-60, 60)`,
            x: `random(-60, 60)`,
            rotation: `random(-90, 90)`,
            duration: `random(4, 8)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
          
          gsap.from(shape, {
             scale: 0,
             opacity: 0,
             duration: 1.5,
             ease: "elastic.out(1, 0.4)",
             delay: 0.5 + (i * 0.1)
          });
        });
      }

      // ── 4. Engineered scroll visibility ──
      if (engineeredRef.current) {
        gsap.set(engineeredRef.current, { opacity: 0 });
        let scrollTimeout: NodeJS.Timeout;
        
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: () => {
            gsap.to(engineeredRef.current, { opacity: 1, duration: 0.2 });
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              gsap.to(engineeredRef.current, { opacity: 0, duration: 0.5 });
            }, 150);
          }
        });
      }

      // ── 5. Enhanced cursor-reactive background system ──
      const heroEl = sectionRef.current;
      if (heroEl) {
        // Primary bright glow follows cursor closely
        const xTo  = gsap.quickTo(cursorGlowRef.current,  "x", { duration: 0.4, ease: "power3" });
        const yTo  = gsap.quickTo(cursorGlowRef.current,  "y", { duration: 0.4, ease: "power3" });
        // Secondary slower glow for trail effect
        const x2To = gsap.quickTo(cursorGlow2Ref.current, "x", { duration: 0.9, ease: "power2" });
        const y2To = gsap.quickTo(cursorGlow2Ref.current, "y", { duration: 0.9, ease: "power2" });

        const waterXTo = gsap.quickTo(watermarkRef.current, "x", { duration: 1.2, ease: "power2.out" });
        const waterYTo = gsap.quickTo(watermarkRef.current, "y", { duration: 1.2, ease: "power2.out" });

        // Animate individual particles on mouse proximity
        const particles = heroEl.querySelectorAll<HTMLDivElement>(".hero-particle");

        const handleMouseMove = (e: MouseEvent) => {
          const rect = heroEl.getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;

          xTo(relX);
          yTo(relY);
          x2To(relX);
          y2To(relY);

          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          waterXTo((e.clientX - cx) * -0.05);
          waterYTo((e.clientY - cy) * -0.05);

          // Particles near cursor react with subtle scale/brightness
          particles.forEach((p) => {
            const pr = p.getBoundingClientRect();
            const dx = relX - (pr.left - rect.left + pr.width / 2);
            const dy = relY - (pr.top  - rect.top  + pr.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / 220);
            gsap.to(p, {
              scale: 1 + proximity * 2.5,
              opacity: parseFloat(p.dataset.baseOpacity || "0.35") + proximity * 0.5,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        heroEl.addEventListener("mousemove", handleMouseMove);
        return () => heroEl.removeEventListener("mousemove", handleMouseMove);
      }
    },
    { scope: sectionRef, dependencies: [preloaderDone] }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-container relative min-h-[100vh] flex items-center justify-center overflow-hidden gsap-grid-bg"
      style={{ backgroundColor: "var(--dark)" }}
    >
      <style>{`
        /* Default states */
        .infinite-text {
          color: transparent !important;
          -webkit-text-stroke: 3px rgba(240, 242, 239, 0.9);
          transition: color 0.15s ease, -webkit-text-stroke 0.15s ease;
          display: block;
        }
        .ideas-text {
          color: var(--light) !important;
          -webkit-text-stroke: 3px transparent;
          transition: color 0.15s ease, -webkit-text-stroke 0.15s ease;
          display: block;
        }
        /* When hovering the group — BOTH change simultaneously */
        .headline-group:hover .infinite-text {
          color: var(--light) !important;
          -webkit-text-stroke: 3px transparent;
        }
        .headline-group:hover .ideas-text {
          color: transparent !important;
          -webkit-text-stroke: 3px rgba(240, 242, 239, 0.9);
        }
        /* CTA ring */
        .cta-ring-svg {
          position: absolute;
          inset: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          pointer-events: none;
          overflow: visible;
        }
        @keyframes heroParticlePulse {
          from { transform: scale(1);   opacity: var(--p-op, 0.2); }
          to   { transform: scale(1.6); opacity: calc(var(--p-op, 0.2) * 1.8); }
        }
      `}</style>

      {/* ── PRIMARY CURSOR GLOW (bright, tight) ── */}
      <div
        ref={cursorGlowRef}
        className="absolute top-0 left-0 pointer-events-none z-0"
        style={{
          width: 500,
          height: 500,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          opacity: 0.18,
          filter: "blur(90px)",
          background: "radial-gradient(circle, var(--gsap-green) 0%, var(--gsap-teal) 50%, transparent 100%)",
        }}
      />

      {/* ── SECONDARY TRAILING GLOW (slower, wider, purple) ── */}
      <div
        ref={cursorGlow2Ref}
        className="absolute top-0 left-0 pointer-events-none z-0"
        style={{
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          opacity: 0.09,
          filter: "blur(140px)",
          background: "radial-gradient(circle, var(--gsap-purple) 0%, var(--gsap-blue) 60%, transparent 100%)",
        }}
      />

      {/* ── SCANLINE TEXTURE OVERLAY ── */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />



      {/* ── AMBIENT GLOW BLOBS (static) ── */}
      <div className="absolute top-[10%] left-[5%]  w-[360px] h-[360px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle, rgba(157,255,47,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-[10%] right-[5%] w-[420px] h-[420px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle, rgba(192,38,255,0.12) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute top-[40%] right-[20%]  w-[300px] h-[300px] rounded-full pointer-events-none z-0" style={{ background: "radial-gradient(circle, rgba(42,171,255,0.10) 0%, transparent 70%)", filter: "blur(70px)" }} />

      {/* ── MASSIVE WATERMARK ── */}
      <div 
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
      >
        <span 
          className="font-sans font-black text-[var(--light)] uppercase whitespace-nowrap will-change-transform"
          style={{ fontSize: "28vw", letterSpacing: "-0.08em", userSelect: "none" }}
        >
          INAN
        </span>
      </div>

      {/* Floating Shapes Background */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glass Panels */}
        <div className="gsap-shape absolute top-[15%] left-[20%] w-32 h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass" style={{ transform: 'rotate(15deg)' }} />
        <div className="gsap-shape absolute top-[70%] left-[10%] w-24 h-24 bg-white/5 backdrop-blur-md border border-white/20 rounded-full shadow-glass" />
        
        {/* Purple/Blue Glow Orbs */}
        <div className="gsap-shape absolute bottom-[25%] right-[15%] w-64 h-64 bg-[var(--gsap-purple)] rounded-full opacity-25 blur-[80px]" />
        <div className="gsap-shape absolute top-[25%] right-[30%] w-48 h-48 bg-[var(--gsap-teal)] rounded-full opacity-15 blur-[60px]" />

        {/* More Glass Panels */}
        <div className="gsap-shape absolute top-[40%] right-[15%] w-40 h-64 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-glass" style={{ transform: 'rotate(-15deg)' }} />
        <div className="gsap-shape absolute bottom-[15%] right-[35%] w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-xl shadow-glass" style={{ transform: 'rotate(12deg)' }} />

        {/* Ambient Gradient Lines */}
        <div className="gsap-shape absolute top-[50%] left-[5%] w-32 h-[1px] bg-gradient-to-r from-white/40 to-transparent opacity-60" />
        <div className="gsap-shape absolute top-[60%] right-[5%] w-48 h-[1px] bg-gradient-to-l from-white/40 to-transparent opacity-60" />

        {/* Extra green accent dot */}
        <div className="gsap-shape absolute top-[30%] left-[8%] w-3 h-3 bg-[var(--gsap-green)] rounded-full opacity-80 blur-[2px]" />
        <div className="gsap-shape absolute bottom-[35%] right-[8%] w-2 h-2 bg-[var(--gsap-teal)] rounded-full opacity-70 blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl w-full mx-6 md:mx-auto pt-24 md:pt-32 text-center flex flex-col items-center pointer-events-none">
        


        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-sans font-black uppercase mb-8 leading-none pointer-events-auto"
          style={{
            fontSize: "clamp(2.5rem, 11vw, 10rem)",
            letterSpacing: "-0.04em",
          }}
        >
          {/* Linked hover group — hovering anywhere flips both words */}
          <div className="headline-group relative cursor-pointer flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 w-max mx-auto overflow-visible">
            <span ref={infiniteRef} className="infinite-text block">Infinite</span>
            
            <div className="flex items-center gap-4 overflow-visible">
              <span ref={ideasRef} className="ideas-text block">Ideas.</span>
              {/*
                Spin the SVG element itself — GSAP uses the rendered
                element box (50% 50%) so rotation is always perfectly centred.
                The path is a direct visible child (no clipPath hack) so GSAP
                never has to guess a bounding-box from inside <defs>.
              */}
              <svg
                id="svg-stage"
                className="hero-clover-svg w-[1.2em] h-[1.2em] inline-block pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 300"
                style={{ overflow: "visible" }}
              >
                <defs>
                  {/* Vivid neon gradient — green → cyan → purple */}
                  <linearGradient id="hero-grad" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"  stopColor="#00ff88"/>
                    <stop offset="45%" stopColor="#00e5ff"/>
                    <stop offset="100%" stopColor="#cc00ff"/>
                  </linearGradient>
                </defs>
                <path
                  className="hero-clover"
                  d="M181 121h-.5v-1h.5a60 60 0 1 0-60-60v.5h-1V60a60 60 0 1 0-60 60h.5v1H60a60 60 0 1 0 60 60v-.5h1v.5a60 60 0 1 0 60-60Z"
                  fill="url(#hero-grad)"
                  style={{ transformBox: "fill-box", transformOrigin: "center center" }}
                />
              </svg>
            </div>
          </div>
          {/* Engineered — shows while scrolling */}
          <span
            ref={engineeredRef}
            className="gsap-text-gradient drop-shadow-[0_0_30px_rgba(157,255,47,0.4)] inline-block opacity-0"
            style={{ marginTop: "-1.2rem" }}
          >Engineered.</span>
        </h1>

        {/* Subtitle */}
        <div className="relative pointer-events-auto">
          <div className="absolute inset-0 bg-[var(--gsap-purple)] opacity-15 blur-[60px] rounded-full"></div>
          <p
            ref={subRef}
            className="relative font-mono text-[var(--light)] opacity-75 text-sm md:text-base leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            We build technology products and services that push boundaries —
            from AI automation to fluid, high-performance cloud platforms.
          </p>
        </div>

        {/* CTA with DrawSVG ring */}
        <div className="flex gap-6 mt-4 pointer-events-auto">
          <a
            ref={ctaRef}
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              import("@/lib/animations/gsapSetup").then(({ getLenis }) => {
                getLenis()?.scrollTo("#services", { offset: -80 });
              });
            }}
            className="gsap-button relative group overflow-visible"
            style={{ position: "relative" }}
          >
            <span className="relative z-10">Explore Work</span>
            <div className="absolute inset-0 bg-[var(--gsap-teal)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 rounded-full"></div>

            {/* DrawSVG animated ring around button */}
            <svg
              className="cta-ring-svg"
              viewBox="0 0 100 100"
              fill="none"
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-12px",
                width: "calc(100% + 24px)",
                height: "calc(100% + 24px)",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <rect
                ref={ctaRingRef}
                x="1" y="1" width="98" height="98"
                rx="49"
                stroke="var(--gsap-green)"
                strokeWidth="2"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[var(--dark-border)] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[var(--dark-border)] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[var(--dark-border)] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[var(--dark-border)] opacity-50 z-0 pointer-events-none"></div>
    </section>
  );
}
