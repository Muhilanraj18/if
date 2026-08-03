/**
 * Hero Section — Chapter 1: GSAP Aesthetic
 * 
 * Dark background, neon accents, massive bouncy typography,
 * floating geometric shapes, and a massive watermark.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function Hero({ preloaderDone = true }: { preloaderDone?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

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

      // ── 1. SplitText headline reveal (bouncy)
      const split = new SplitText(headlineRef.current, { type: "words,chars" });
      
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(split.chars, {
        y: 100,
        opacity: 0,
        rotationZ: 10,
        scale: 0.5,
        duration: 1.2,
        stagger: 0.04,
        ease: "back.out(1.7)",
      });

      // ── 2. Subtitle + CTA reveal
      tl.from(subRef.current, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.6");
      tl.from(ctaRef.current, { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4");

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

      // ── 4. Mouse Interactive Glow ──
      const heroEl = sectionRef.current;
      if (heroEl && cursorGlowRef.current) {
        const xTo = gsap.quickTo(cursorGlowRef.current, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(cursorGlowRef.current, "y", { duration: 0.6, ease: "power3" });
        
        // Also add subtle parallax to watermark
        const waterXTo = gsap.quickTo(watermarkRef.current, "x", { duration: 1.2, ease: "power2.out" });
        const waterYTo = gsap.quickTo(watermarkRef.current, "y", { duration: 1.2, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
          const rect = heroEl.getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;
          
          xTo(relX);
          yTo(relY);

          // Parallax for watermark (move opposite to mouse, slightly)
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
      {/* ── INTERACTIVE MOUSE GLOW ── */}
      <div 
        ref={cursorGlowRef} 
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[var(--gsap-green)] rounded-full mix-blend-screen pointer-events-none z-0"
        style={{ transform: "translate(-50%, -50%)", opacity: 0.08, filter: "blur(120px)" }}
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
        {/* Neon Green Box */}
        <div className="gsap-shape absolute top-[15%] left-[20%] w-12 h-12 bg-[var(--gsap-green)] opacity-60" style={{ borderRadius: '4px', transform: 'rotate(15deg)' }} />
        <div className="gsap-shape absolute top-[75%] left-[10%] w-8 h-8 border-2 border-[var(--gsap-green)] opacity-40" style={{ transform: 'rotate(45deg)' }} />
        
        {/* Purple Circles */}
        <div className="gsap-shape absolute bottom-[25%] right-[15%] w-24 h-24 bg-[var(--gsap-purple)] rounded-full opacity-50 blur-[2px]" />
        <div className="gsap-shape absolute top-[25%] right-[30%] w-6 h-6 border-2 border-[var(--gsap-purple)] rounded-full opacity-60" />

        {/* Blue Triangle */}
        <div className="gsap-shape absolute top-[40%] right-[20%] opacity-60" style={{ width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '50px solid var(--gsap-blue)', transform: 'rotate(-25deg)' }} />
        <div className="gsap-shape absolute bottom-[15%] right-[35%] w-16 h-16 border-4 border-[var(--gsap-blue)] opacity-40 rounded-lg" style={{ transform: 'rotate(12deg)' }} />

        {/* Orange Accents */}
        <div className="gsap-shape absolute bottom-[40%] left-[25%] w-3 h-3 bg-[#FF7A2F] rounded-full opacity-80" />
        <div className="gsap-shape absolute top-[15%] right-[45%] w-4 h-4 bg-[#FFB347] rounded-sm opacity-70 transform rotate-45" />

        {/* Floating Lines */}
        <div className="gsap-shape absolute top-[50%] left-[5%] w-24 h-[2px] bg-gradient-to-r from-[var(--gsap-green)] to-transparent opacity-40" />
        <div className="gsap-shape absolute top-[60%] right-[5%] w-32 h-[2px] bg-gradient-to-l from-[var(--gsap-purple)] to-transparent opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl w-full mx-6 md:mx-auto text-center flex flex-col items-center pointer-events-none">
        
        {/* Tagline */}
        <div className="inline-block px-6 py-2 border border-[var(--gsap-green)] border-opacity-30 rounded-full text-xs font-mono text-[var(--gsap-green)] mb-10 tracking-widest bg-[var(--dark-surface)] backdrop-blur-md shadow-[0_0_20px_rgba(138,230,20,0.1)]">
          // INAN INFINITES_
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-sans font-black mb-8"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
          }}
        >
          <span className="text-[var(--light)] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">INFINITE IDEAS.</span>
          <br />
          <span className="gsap-text-gradient">ENGINEERED.</span>
        </h1>

        {/* Subtitle */}
        <div className="relative pointer-events-auto">
          <div className="absolute inset-0 bg-[var(--gsap-purple)] opacity-20 blur-[60px] rounded-full"></div>
          <p
            ref={subRef}
            className="relative font-mono text-[var(--light)] opacity-75 text-sm md:text-base leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            We build technology products and services that push boundaries —
            from AI automation to fluid, high-performance cloud platforms.
            <br/><br/>
            <span className="text-[var(--gsap-purple)] bg-[#ce26ff]/10 px-3 py-1 rounded-sm border border-[#ce26ff]/20">{"{"} performance: "maximum", design: "fluid" {"}"}</span>
          </p>
        </div>

        {/* CTA */}
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
            className="gsap-button relative group overflow-hidden"
          >
            <span className="relative z-10">Explore Work</span>
            <div className="absolute inset-0 bg-[var(--gsap-green)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
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
