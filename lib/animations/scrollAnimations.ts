/**
 * Scroll Animation Helpers — Inan Infinites
 * 
 * Factory helpers for ScrollTrigger-based patterns:
 * parallax, pinned timelines, count-up, batch entrances.
 * 
 * All follow gsap-scrolltrigger skill conventions:
 * - ScrollTrigger is registered in gsapSetup.ts (not here)
 * - ScrollTrigger on top-level tweens/timelines (not child tweens)
 * - scrub or toggleActions — never both on the same trigger
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * createParallax — tie element's y-position to scroll progress.
 * 
 * gsap-scrolltrigger skill: scrub links animation to scroll.
 * speed: 0.3 = slow drift, 0.6 = faster parallax layer.
 */
export function createParallax(
  element: Element,
  speed: number = 0.4,
  distance: number = 120
) {
  // gsap-core skill: transform alias y (not top/left) for performance
  return gsap.to(element, {
    y: distance * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,   // gsap-scrolltrigger skill: scrub smoothness 1s lag
    },
  });
}

/**
 * createPinTimeline — returns a timeline pinned to a section for scrub animation.
 * 
 * gsap-scrolltrigger skill: pin the section, scrub the timeline.
 * Do NOT animate the pinned element itself — animate children inside.
 */
export function createPinTimeline(
  trigger: Element,
  scrubDuration: number = 3000, // pixels of scroll travel
  scrub: number = 1
) {
  // gsap-timeline skill: gsap.timeline() with ScrollTrigger on the timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end: `+=${scrubDuration}`,
      pin: true,
      pinSpacing: true,
      scrub,
    },
  });

  return tl;
}

/**
 * createCountUp — animate a numeric readout from 0 to target on scroll enter.
 * Uses ScrollTrigger once:true so it only fires once.
 */
export function createCountUp(
  element: Element,
  target: number,
  suffix: string = "",
  duration: number = 2
) {
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration,
    ease: "power2.out",
    onUpdate() {
      element.textContent =
        Math.round(obj.val).toLocaleString() + suffix;
    },
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      once: true,
      toggleActions: "play none none none",
    },
  });
}

/**
 * createBatchEntrance — ScrollTrigger.batch for staggered card/cell entrances.
 * 
 * gsap-scrolltrigger skill: ScrollTrigger.batch() pattern.
 * Each element becomes its own trigger; callbacks receive arrays of elements.
 */
export function createBatchEntrance(
  selector: string,
  containerRef?: Element
) {
  ScrollTrigger.batch(selector, {
    start: "top 88%",
    once: true,
    onEnter: (elements) => {
      // gsap-core skill: stagger object with from: "start"
      gsap.from(elements, {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        stagger: { each: 0.1, from: "start" },
        ease: "power3.out",
        overwrite: "auto",
      });
    },
  });
}

/**
 * createFadeIn — simple autoAlpha + y fade for elements without SplitText.
 */
export function createFadeIn(
  targets: string | Element | Element[],
  options: {
    y?: number;
    stagger?: number;
    duration?: number;
    start?: string;
    once?: boolean;
  } = {}
) {
  const {
    y = 30,
    stagger = 0.12,
    duration = 0.9,
    start = "top 85%",
    once = true,
  } = options;

  const trigger =
    typeof targets === "string"
      ? document.querySelector(targets)
      : Array.isArray(targets)
      ? targets[0]
      : targets;

  // gsap-timeline skill: timeline keeps things composable
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      once,
      toggleActions: "play none none none",
    },
  });

  tl.from(targets, {
    autoAlpha: 0,
    y,
    duration,
    stagger,
    ease: "power3.out",
  });

  return tl;
}
