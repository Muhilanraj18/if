/**
 * GSAP Provider — Inan Infinites
 * 
 * Client component that initialises GSAP + Lenis once on mount.
 * Must be imported into the root layout as a client-only boundary.
 * 
 * gsap-react skill: all GSAP code runs client-only inside useGSAP/useEffect.
 * gsap-scrolltrigger skill: register plugins once at top level.
 */

"use client";

import { useEffect } from "react";
import { initGSAP } from "@/lib/animations/gsapSetup";

export default function GSAPProvider() {
  useEffect(() => {
    // initGSAP: registers plugins, starts Lenis, sets up matchMedia
    const mm = initGSAP();

    return () => {
      mm?.revert();
    };
  }, []);

  // Renders nothing — side-effects only
  return null;
}
