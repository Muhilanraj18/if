"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface KineticLoaderProps {
  onComplete: () => void;
  preloaderDone?: boolean;
}

export default function KineticLoader({ onComplete, preloaderDone = true }: KineticLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Skip animation if user prefers reduced motion
        onComplete();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!typeRef.current || !containerRef.current) return;

        const kineticType = typeRef.current;
        const typeLines = gsap.utils.toArray<HTMLElement>(".type-line");
        const oddLines = gsap.utils.toArray<HTMLElement>(".type-line.odd");
        const evenLines = gsap.utils.toArray<HTMLElement>(".type-line.even");

        // Set initial static state (this is what's revealed when Preloader wipes up)
        gsap.set(kineticType, { scale: 1, rotation: 0 });
        gsap.set(typeLines, { opacity: 0.015, x: "0%" });

        // If preloader is not done, just sit there statically
        if (!preloaderDone) return;

        // Build the timeline
        const tl = gsap.timeline({
          onComplete: () => {
            // Fade out the entire container rapidly before calling onComplete
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.15,
              ease: "power2.out",
              onComplete: onComplete,
            });
          },
        });

        const customEase = "expo.inOut";

        // Main scaling and rotation — uses translateZ to stay on GPU compositor
        tl.to(kineticType, {
          duration: 1.6,
          ease: customEase,
          scale: 2.2,
          rotation: -90,
          z: 0.01, // force GPU layer
        });

        // Odd lines slide left
        tl.to(
          oddLines,
          {
            keyframes: [
              { x: "20%", duration: 1, ease: customEase },
              { x: "-200%", duration: 1.5, ease: customEase },
            ],
            stagger: 0.08,
          },
          0
        );

        // Even lines slide right
        tl.to(
          evenLines,
          {
            keyframes: [
              { x: "-20%", duration: 1, ease: customEase },
              { x: "200%", duration: 1.5, ease: customEase },
            ],
            stagger: 0.08,
          },
          0
        );

        // Opacity fade in then fade out
        tl.to(
          typeLines,
          {
            keyframes: [
              { opacity: 1, duration: 1, ease: customEase },
              { opacity: 0, duration: 1.5, ease: customEase },
            ],
            stagger: 0.05,
          },
          0
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [preloaderDone] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ backgroundColor: "var(--dark)" }}
      aria-hidden="true"
      suppressHydrationWarning
    >
      <div
        ref={typeRef}
        className="kinetic-type flex flex-col justify-center items-center text-center uppercase"
        suppressHydrationWarning
        style={{
          width: "100vmax",
          height: "100vmax",
          transformStyle: "preserve-3d",
          perspective: 1000,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`type-line ${
              i % 2 === 0 ? "even" : "odd"
            } whitespace-nowrap font-bold text-[var(--gsap-green)]`}
            style={{
              fontSize: "clamp(3.5rem, 10vw, 14rem)",
              lineHeight: 0.75,
              opacity: 0.015,
              zIndex: i % 2 === 0 ? 150 : 50,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
              WebkitFontSmoothing: "subpixel-antialiased",
            }}
          >
            INAN INFINITES INAN INFINITES INAN INFINITES
          </div>
        ))}
      </div>
    </div>
  );
}
