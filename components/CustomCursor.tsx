/**
 * Custom Cursor — Inan Infinites
 * 
 * Diamond-shaped cursor element. Rendered at root; hidden on touch devices.
 * Animation logic in lib/animations/cursor.ts.
 * 
 * gsap-react skill: useGSAP for cleanup, contextSafe for event handlers.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { initCursor, destroyCursor } from "@/lib/animations/cursor";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // gsap-react skill: useGSAP handles cleanup on unmount
  useGSAP(
    () => {
      if (!cursorRef.current || !dotRef.current) return;
      initCursor(cursorRef.current, dotRef.current);

      return () => {
        destroyCursor();
      };
    },
    { scope: cursorRef }
  );

  return (
    <>
      {/* Main diamond cursor */}
      <div
        ref={cursorRef}
        id="custom-cursor"
        aria-hidden="true"
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "18px",
          height: "18px",
          pointerEvents: "none",
          zIndex: 9999,
          // Diamond via clip-path
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          backgroundColor: "var(--gsap-green)",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />

      {/* Trailing dot */}
      <div
        ref={dotRef}
        id="cursor-dot"
        aria-hidden="true"
        suppressHydrationWarning
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          backgroundColor: "var(--gsap-green)",
          transform: "translate(-50%, -50%)",
          opacity: 0.5,
        }}
      />
    </>
  );
}
