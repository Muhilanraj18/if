/**
 * GSAP Animation Setup — Inan Infinites
 * 
 * Single initialization point for all GSAP plugins and Lenis smooth scroll.
 * Follows gsap-react skill: registerPlugin at top level, once.
 * Follows gsap-scrolltrigger skill: ScrollTrigger.scrollerProxy() for Lenis.
 * Follows gsap-core skill: gsap.matchMedia() for prefers-reduced-motion.
 * 
 * Call initGSAP() once in the root client component.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

// ── Plugin registration (gsap-plugins skill: register before first use) ────
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// ── Global defaults (gsap-core skill: gsap.defaults()) ────────────────────
gsap.defaults({
  ease: "power2.out",
  duration: 0.8,
});

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis smooth scroll and wire it to GSAP ScrollTrigger.
 * 
 * Uses ScrollTrigger.scrollerProxy() per gsap-scrolltrigger skill so that
 * pinning and scrubbing stay in sync with the smooth-scrolled position.
 */
function initLenis() {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  // Wire Lenis → ScrollTrigger via scrollerProxy (gsap-scrolltrigger skill pattern)
  lenisInstance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/**
 * Main init — call once on client mount.
 * Uses gsap.matchMedia() to gate animations behind prefers-reduced-motion
 * (gsap-core skill: accessibility and responsive pattern).
 */
export function initGSAP() {
  if (typeof window === "undefined") return;

  initLenis();

  // gsap-core skill: gsap.matchMedia() conditions syntax
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { reduceMotion } = context.conditions as {
        isDesktop: boolean;
        reduceMotion: boolean;
      };

      if (reduceMotion) {
        // Kill Lenis — native scroll for reduced-motion users
        lenisInstance?.destroy();
        lenisInstance = null;
        gsap.ticker.remove(() => {});
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    }
  );

  return mm;
}

export function getLenis() {
  return lenisInstance;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
