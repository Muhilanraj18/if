/**
 * Custom Cursor — Inan Infinites
 * 
 * Diamond-shaped cursor that follows the mouse with GSAP quickTo lag.
 * Morphs to a larger diamond on interactive elements.
 * Implements magnetic pull toward buttons within ~40px.
 * 
 * gsap-core skill: gsap.quickTo() for smooth, low-latency cursor following.
 */

import gsap from "gsap";

interface CursorState {
  xTo: ReturnType<typeof gsap.quickTo> | null;
  yTo: ReturnType<typeof gsap.quickTo> | null;
  dotXTo: ReturnType<typeof gsap.quickTo> | null;
  dotYTo: ReturnType<typeof gsap.quickTo> | null;
  cursorEl: HTMLElement | null;
  dotEl: HTMLElement | null;
  isActive: boolean;
  magneticTarget: Element | null;
}

const state: CursorState = {
  xTo: null,
  yTo: null,
  dotXTo: null,
  dotYTo: null,
  cursorEl: null,
  dotEl: null,
  isActive: false,
  magneticTarget: null,
};

/**
 * initCursor — attach all cursor logic.
 * Call once after the cursor DOM element is mounted.
 */
export function initCursor(
  cursorEl: HTMLElement,
  dotEl: HTMLElement
) {
  state.cursorEl = cursorEl;
  state.dotEl = dotEl;
  state.isActive = true;

  // gsap-core skill: gsap.quickTo() for low-latency property animation
  // duration + ease control the "lag" of the cursor following the mouse
  state.xTo = gsap.quickTo(cursorEl, "x", {
    duration: 0.35,
    ease: "power3.out",
  });
  state.yTo = gsap.quickTo(cursorEl, "y", {
    duration: 0.35,
    ease: "power3.out",
  });
  
  // Dot tracks instantly (0 duration)
  state.dotXTo = gsap.quickTo(dotEl, "x", {
    duration: 0,
  });
  state.dotYTo = gsap.quickTo(dotEl, "y", {
    duration: 0,
  });

  // Track mouse position
  window.addEventListener("mousemove", onMouseMove);

  // Detect interactive elements for morphing
  attachMagneticListeners();

  // Hide on touch
  if (window.matchMedia("(hover: none)").matches) {
    gsap.set(cursorEl, { autoAlpha: 0 });
  }
}

function onMouseMove(e: MouseEvent) {
  if (!state.isActive || !state.xTo || !state.yTo) return;

  // If within magnetic range of a target, snap to it
  if (state.magneticTarget) {
    const rect = state.magneticTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 60) {
      const pull = 1 - dist / 60;
      state.xTo(cx + dx * (1 - pull * 0.6));
      state.yTo(cy + dy * (1 - pull * 0.6));
      state.dotXTo!(e.clientX);
      state.dotYTo!(e.clientY);
      return;
    }
  }

  state.xTo(e.clientX);
  state.yTo(e.clientY);
  state.dotXTo!(e.clientX);
  state.dotYTo!(e.clientY);
}

/** Attach listeners to all interactive elements on the page */
function attachMagneticListeners() {
  // Re-run on each call so dynamically-added elements are covered
  const targets = document.querySelectorAll(
    'a, button, [data-cursor="magnetic"], .liquid-btn, .clay-card'
  );

  targets.forEach((el) => {
    el.addEventListener("mouseenter", () => onEnterInteractive(el));
    el.addEventListener("mouseleave", onLeaveInteractive);
  });
}

function onEnterInteractive(el: Element) {
  if (!state.cursorEl) return;
  state.magneticTarget = el;

  // gsap-core skill: gsap.to() for cursor morph
  gsap.to(state.cursorEl, {
    scale: 2.2,
    duration: 0.3,
    ease: "back.out(1.7)",
    overwrite: "auto",
  });
}

function onLeaveInteractive() {
  if (!state.cursorEl) return;
  state.magneticTarget = null;

  gsap.to(state.cursorEl, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
    overwrite: "auto",
  });
}

/** Re-scan the DOM for new interactive elements (call after content changes) */
export function refreshCursorTargets() {
  attachMagneticListeners();
}

export function destroyCursor() {
  state.isActive = false;
  window.removeEventListener("mousemove", onMouseMove);
}
