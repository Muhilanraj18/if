/**
 * Text Reveal Animations — Inan Infinites
 * 
 * SplitText-based reveal utilities.
 * Follows gsap-plugins skill: SplitText with mask, autoSplit, onSplit().
 * Returns the tween from onSplit() so SplitText can clean up on re-split.
 */

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export interface TextRevealOptions {
  /** ScrollTrigger trigger element (defaults to the text element itself) */
  trigger?: Element | string;
  /** Start position (default: "top 85%") */
  start?: string;
  /** Stagger between lines (default: 0.08) */
  stagger?: number;
  /** Duration of each line reveal (default: 1.0) */
  duration?: number;
  /** Delay before animation starts (default: 0) */
  delay?: number;
  /** Once: kill ScrollTrigger after first play */
  once?: boolean;
}

/**
 * createLineReveal — clip-path mask reveal, line by line.
 * 
 * Pattern from gsap-plugins SplitText skill:
 *   - mask: "lines" wraps each line in overflow:clip container
 *   - autoSplit: true re-splits on resize/font-load
 *   - onSplit() returns the tween for automatic cleanup
 */
export function createLineReveal(
  target: string | Element,
  options: TextRevealOptions = {}
) {
  const {
    trigger,
    start = "top 85%",
    stagger = 0.08,
    duration = 1.0,
    delay = 0,
    once = true,
  } = options;

  // gsap-plugins skill: SplitText.create with mask and autoSplit
  const split = SplitText.create(target, {
    type: "lines",
    mask: "lines",            // each line gets overflow:clip wrapper
    autoSplit: true,
    linesClass: "split-line",
    // aria: "auto" (default) preserves screen-reader semantics
    onSplit(self) {
      // gsap-core skill: gsap.from() for entrance from hidden state
      const tween = gsap.from(self.lines, {
        yPercent: 105,
        duration,
        stagger,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: (trigger as Element) || (target as Element),
          start,
          once,
          toggleActions: "play none none none",
        },
      });
      // Return tween so SplitText can sync progress on re-split
      return tween;
    },
  });

  return split;
}

/**
 * createCharReveal — staggered character pop-in for short display text.
 * 
 * Does NOT use autoSplit (single-line headings don't need it).
 * Uses clip-path y-reveal per char.
 */
export function createCharReveal(
  target: string | Element,
  options: TextRevealOptions = {}
) {
  const {
    trigger,
    start = "top 90%",
    stagger = 0.025,
    duration = 0.6,
    delay = 0,
    once = true,
  } = options;

  const split = SplitText.create(target, {
    type: "chars,words",
    mask: "chars",
    smartWrap: true,         // gsap-plugins tip: prevents mid-word breaks on chars
  });

  // gsap-timeline skill: use timeline so stagger and delay compose cleanly
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: (trigger as Element) || (target as Element),
      start,
      once,
      toggleActions: "play none none none",
    },
  });

  tl.from(split.chars, {
    yPercent: 110,
    duration,
    stagger,
    delay,
    ease: "power4.out",
  });

  return { split, tl };
}

/**
 * createWordReveal — fade + slight y offset, word by word.
 * Used for body copy and subtitles.
 */
export function createWordReveal(
  target: string | Element,
  options: TextRevealOptions = {}
) {
  const {
    trigger,
    start = "top 88%",
    stagger = 0.04,
    duration = 0.7,
    delay = 0,
    once = true,
  } = options;

  const split = SplitText.create(target, {
    type: "words",
    autoSplit: true,
    onSplit(self) {
      const tween = gsap.from(self.words, {
        autoAlpha: 0,     // gsap-core skill: autoAlpha vs opacity
        y: 12,
        duration,
        stagger,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: (trigger as Element) || (target as Element),
          start,
          once,
          toggleActions: "play none none none",
        },
      });
      return tween;
    },
  });

  return split;
}
