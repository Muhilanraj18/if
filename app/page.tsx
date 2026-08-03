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
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Showcase from "@/components/sections/Showcase";
import HowWeBuild from "@/components/sections/HowWeBuild";
import Impact from "@/components/sections/Impact";
import About from "@/components/sections/About";
import GSAPPlayground from "@/components/sections/GSAPPlayground";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      {/* Preloader — unmounts self after animation via onComplete */}
      {!preloaderDone && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Fixed navigation */}
      <Navbar visible={preloaderDone} />

      {/* ── Chapter 1: Liquid Glass / Spatial UI ───────────────────── */}
      <Hero preloaderDone={preloaderDone} />

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
