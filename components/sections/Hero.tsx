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

      // ── 0.5. Clover Spin (fast then slow-mo)
      gsap.fromTo(".hero-clover", 
        { transformOrigin: "50% 50%", rotation: 0 },
        { rotation: 1440, duration: 4, ease: "power4.out" }
      );
      gsap.to(".hero-clover", {
        rotation: "+=360",
        duration: 30,
        ease: "none",
        repeat: -1,
        delay: 4
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

      // ── 5. Mouse Interactive Glow ──
      const heroEl = sectionRef.current;
      if (heroEl && cursorGlowRef.current) {
        const xTo = gsap.quickTo(cursorGlowRef.current, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(cursorGlowRef.current, "y", { duration: 0.6, ease: "power3" });
        
        const waterXTo = gsap.quickTo(watermarkRef.current, "x", { duration: 1.2, ease: "power2.out" });
        const waterYTo = gsap.quickTo(watermarkRef.current, "y", { duration: 1.2, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
          const rect = heroEl.getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;
          
          xTo(relX);
          yTo(relY);

          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          waterXTo((e.clientX - cx) * -0.05);
          waterYTo((e.clientY - cy) * -0.05);
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
      `}</style>

      {/* ── INTERACTIVE MOUSE GLOW ── */}
      <div 
        ref={cursorGlowRef} 
        className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full mix-blend-screen pointer-events-none z-0"
        style={{ transform: "translate(-50%, -50%)", opacity: 0.07, filter: "blur(130px)", background: "radial-gradient(circle, var(--gsap-green) 0%, var(--gsap-teal) 60%, transparent 100%)" }}
      />

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
            fontSize: "clamp(3.5rem, 11vw, 10rem)",
            letterSpacing: "-0.04em",
          }}
        >
          {/* Linked hover group — hovering anywhere flips both words */}
          <div className="headline-group relative cursor-pointer flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 w-max mx-auto overflow-visible">
            <span ref={infiniteRef} className="infinite-text block">Infinite</span>
            
            <div className="flex items-center gap-4 overflow-visible">
              <span ref={ideasRef} className="ideas-text block">Ideas.</span>
              <svg id="svg-stage" className="w-[1.2em] h-[1.2em] opacity-90 inline-block pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                <rect fill="url(#hero-grad)" clipPath="url(#hero-cp)" width="300" height="300"/>
                <defs>
                  <clipPath id="hero-cp">
                    <path className="hero-clover" d="M181 121h-.5v-1h.5a60 60 0 1 0-60-60v.5h-1V60a60 60 0 1 0-60 60h.5v1H60a60 60 0 1 0 60 60v-.5h1v.5a60 60 0 1 0 60-60Z"/>
                  </clipPath>
                  <linearGradient id="hero-grad" x1="0" y1="0" x2="280" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset=".3" stopColor="var(--gsap-green)"/>
                    <stop offset=".8" stopColor="var(--gsap-purple)"/>
                  </linearGradient>
                </defs>
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
