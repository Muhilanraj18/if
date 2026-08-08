/**
 * Home Page — Inan Infinites
 * 
 * Single-page scroll journey assembling all 8 chapters.
 * Preloader shows on first visit, then reveals the full page.
 * Navbar becomes visible after preloader completes.
 * 
 * Chapter order:
 *   1. Hero        — Liquid Glass / Spatial UI
 *   2. Manifesto   — Minimalism
 *   3. Services    — Claymorphism
 *   4. Showcase    — Glassmorphism + Parallax
 *   5. HowWeBuild  — Skeuomorphism / HUD
 *   6. Impact      — Maximalism + Pentagrid
 *   7. About       — Neumorphism
 *   8. Contact     — Liquid Glass (bookend)
 */

"use client";

import React, { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import KineticLoader from "@/components/KineticLoader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Showcase from "@/components/sections/Showcase";
import HowWeBuild from "@/components/sections/HowWeBuild";
import Impact from "@/components/sections/Impact";
import About from "@/components/sections/About";
import GSAPPlayground from "@/components/sections/GSAPPlayground";
import TextMarquee from "@/components/sections/TextMarquee";
import HorizontalScrollJourney from "@/components/sections/HorizontalScrollJourney";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [kineticDone, setKineticDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  const handleKineticComplete = useCallback(() => {
    setKineticDone(true);
  }, []);

  return (
    <>
      {/* Preloader — unmounts self after animation via onComplete */}
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* KineticLoader — underneath Preloader, waits for preloaderDone */}
      {!kineticDone && (
        <KineticLoader preloaderDone={preloaderDone} onComplete={handleKineticComplete} />
      )}

      {/* Fixed navigation */}
      <Navbar visible={kineticDone} />

      {/* ── Chapter 1: Liquid Glass / Spatial UI ───────────────────── */}
      <Hero preloaderDone={kineticDone} />
      <TextMarquee />

      {/* ── Combined horizontal scroll journey (chars + horizontal scroll) ── */}
      <HorizontalScrollJourney />

      {/* ── Chapter 2: Minimalism ───────────────────────────────────── */}
      <Manifesto />

      {/* ── Chapter 3: Claymorphism ─────────────────────────────────── */}
      <Services />

      {/* ── Chapter 4: Glassmorphism + Parallax ────────────────────── */}
      <Showcase />

      {/* ── Chapter 5: Skeuomorphism / HUD ─────────────────────────── */}
      <HowWeBuild />

      {/* ── Chapter 6: Maximalism + Pentagrid ──────────────────────── */}
      <Impact />

      {/* ── Chapter 7: Neumorphism ──────────────────────────────────── */}
      <About />

      {/* ── GSAP Playground ─────────────────────────────────────────── */}
      <GSAPPlayground />

      {/* ── Chapter 8: Liquid Glass (bookend) ──────────────────────── */}
      <Contact />
    </>
  );
}
