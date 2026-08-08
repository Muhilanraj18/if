/**
 * HorizontalScrollJourney — Inan Infinites
 *
 * Combines HorizontalTextReveal + HorizontalStatement into ONE pinned section
 * with a scrubbed GSAP timeline that runs two phases:
 *
 *  Phase 1  (t 0-1.5)  Intro overlay:
 *    - Label fades up
 *    - Headline chars fly in from random left/right + rotation (SplitText)
 *    - Clover bounces in elastically
 *    - Sub-text fades up
 *
 *  Transition (t 1.1-1.4)  Intro fades + scales out
 *
 *  Phase 2  (t 1.5-5)  Horizontal track scrolls left:
 *    - Each word  - slides from +-y + scale + back.out(1.7)
 *    - Each badge - scales from 0 + rotation + back.out(2)
 *    - Shapes     - rotate in + power3.out
 *    - Clovers    - elastic bounce + y offset
 *    Timing derived from offsetLeft so each element enters as it crosses right edge.
 *
 *  Clover fix: transform-box:fill-box + transform-origin:center
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const CLOVER_D =
  "M181 121h-.5v-1h.5a60 60 0 1 0-60-60v.5h-1V60a60 60 0 1 0-60 60h.5v1H60a60 60 0 1 0 60 60v-.5h1v.5a60 60 0 1 0 60-60Z";

function Clover({ size, gradId, className = "" }: { size: number; gradId: string; className?: string }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#00ff88" />
          <stop offset="45%"  stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#cc00ff" />
        </linearGradient>
      </defs>
      <path
        className="hj-clover"
        d={CLOVER_D}
        fill={`url(#${gradId})`}
        style={{ transformBox: "fill-box", transformOrigin: "center center" }}
      />
    </svg>
  );
}

function Badge({ label, bg, color = "#080a09", rotate = 0, className = "" }: { label: string; bg: string; color?: string; rotate?: number; className?: string }) {
  return (
    <div
      className={`hj-item hj-badge shrink-0 font-sans font-black rounded-2xl px-7 py-3 whitespace-nowrap ${className}`}
      style={{ background: bg, color, fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em", transform: `rotate(${rotate}deg)` }}
    >
      {label}
    </div>
  );
}

function Word({ text, outline = false }: { text: string; outline?: boolean }) {
  return (
    <span
      className="hj-item hj-word shrink-0 font-sans font-black uppercase leading-none whitespace-nowrap"
      style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)", letterSpacing: "-0.04em", color: outline ? "transparent" : "var(--light)", WebkitTextStroke: outline ? "3px var(--light)" : undefined }}
    >
      {text}
    </span>
  );
}

export default function HorizontalScrollJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef   = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !introRef.current || !trackRef.current) return;
      const section = sectionRef.current;
      const intro   = introRef.current;
      const track   = trackRef.current;

      // Fix clover spin: transform-box:fill-box makes transform-origin:center
      // resolve to the path's own bounding-box centre — no drift, no corner spinning.
      gsap.set(".hj-clover", { transformBox: "fill-box", transformOrigin: "center center" });
      gsap.to(".hj-clover", { rotation: 360, duration: 16, ease: "none", repeat: -1 });

      const phase2Px = track.scrollWidth - window.innerWidth;
      if (phase2Px <= 0) return;

      // Timeline: 5 units. Phase 1 = 0..1.5, Phase 2 = 1.5..5 (3.5 units)
      const P2_START = 1.5, P2_DUR = 3.5, TL_TOTAL = 5;
      const totalPx  = TL_TOTAL * (phase2Px / P2_DUR);

      // SplitText — split each intro line into chars, scatter them far off-screen
      // with random x, y drift AND rotation so landing feels organic.
      const allChars: HTMLElement[] = [];
      intro.querySelectorAll<HTMLElement>(".hj-intro-line").forEach((line, lineIdx) => {
        const split = new SplitText(line, { type: "chars", charsClass: "hj-char" });
        split.chars.forEach((char, i) => {
          const sign  = i % 2 === 0 ? -1 : 1;
          const xDist = sign * gsap.utils.random(300, 700, 1);   // more extreme
          const yDist = lineIdx % 2 === 0 ? gsap.utils.random(-80, -20, 1) : gsap.utils.random(20, 80, 1);
          const rot   = sign * gsap.utils.random(15, 45, 1);     // wilder rotation
          gsap.set(char, { x: xDist, y: yDist, opacity: 0, rotation: rot, scale: 0.6 });
          allChars.push(char as HTMLElement);
        });
      });

      // Phase 1 badge refs (absolutely positioned around headline)
      const p1Badges = Array.from(intro.querySelectorAll<HTMLElement>(".hj-p1-badge"));
      // Hide them initially
      gsap.set(p1Badges, { opacity: 0, scale: 0 });

      // Place track off-screen right
      gsap.set(track, { x: window.innerWidth });

      // Main scrubbed timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: "top top", end: `+=${totalPx}`,
          pin: true, pinSpacing: true, scrub: 1.5, anticipatePin: 1,
        },
      });

      // ── Phase 1: intro timeline ──────────────────────────────────────────

      // Label fades + slides up
      tl.from(intro.querySelector(".hj-label"), { opacity: 0, y: 30, ease: "power2.out", duration: 0.25 }, 0);

      // Chars converge from far off-screen — staggered from center for a
      // 'closing in' effect. scale also returns to 1 for extra drama.
      tl.to(allChars, {
        x: 0, y: 0, opacity: 1, rotation: 0, scale: 1,
        stagger: { each: 0.035, from: "center" },
        ease: "power4.out",
        duration: 0.8,
      }, 0.1);

      // Headline micro-pulse after chars land — feels alive
      tl.to(intro.querySelectorAll(".hj-intro-line"), {
        scale: 1.025, duration: 0.12, ease: "power2.inOut",
        yoyo: true, repeat: 1,
      }, 0.95);

      // Badge 0: "Bold" — top-left, drops from above with big rotation
      tl.from(p1Badges[0], { y: -130, opacity: 0, rotation: -50, scale: 0, ease: "back.out(2.5)", duration: 0.45 }, 0.3);
      // Badge 1: "Visionary" — top-right, flies from right
      tl.from(p1Badges[1], { x: 200,  opacity: 0, rotation:  30, scale: 0, ease: "back.out(2)",   duration: 0.42 }, 0.42);
      // Badge 2: "Fast" — left, slides from left fast
      tl.from(p1Badges[2], { x: -200, opacity: 0, rotation: -20, scale: 0, ease: "power4.out",    duration: 0.38 }, 0.52);
      // Badge 3: "Scalable" — bottom-right, elastic bounce from below
      tl.from(p1Badges[3], { y:  150, opacity: 0, rotation:  15, scale: 0, ease: "elastic.out(1,0.45)", duration: 0.6 }, 0.62);
      // Badge 4: "Global" — bottom-left, slides from below + slight rotation
      tl.from(p1Badges[4], { y:  100, opacity: 0, rotation: -12, scale: 0, ease: "back.out(1.8)", duration: 0.42 }, 0.72);

      // Clover in intro — dramatic spin-in from above
      tl.from(intro.querySelector(".hj-intro-clover"), {
        scale: 0, opacity: 0, y: -140, rotation: -540,
        ease: "power4.out", duration: 0.75,
      }, 0.38);

      // Sub text fades in last — curiosity-building wrap
      tl.from(intro.querySelector(".hj-sub"), { opacity: 0, y: 40, ease: "power2.out", duration: 0.40 }, 0.85);

      // ── Transition: whole intro scales down + fades (curtain-pull) ────────
      tl.to(intro, { opacity: 0, scale: 0.85, y: -80, ease: "power2.in", duration: 0.4 }, 1.15);

      // Phase 2: track scrolls horizontally
      tl.to(track, { x: -phase2Px, ease: "none", duration: P2_DUR }, P2_START);

      // Per-element entrance tweens.
      // Each type gets a DIFFERENT transform + ease.
      // Words also animate filter:blur (the subtle 'slide-into-focus' effect).
      const trackWidth = track.scrollWidth;
      Array.from(track.querySelectorAll<HTMLElement>(".hj-item")).forEach((item, idx) => {
        // t_enter = moment the element's left edge crosses the right viewport edge
        const tEnter = P2_START + (item.offsetLeft / trackWidth) * P2_DUR;
        const tStart = Math.max(P2_START, tEnter - 0.08);

        if (item.classList.contains("hj-word")) {
          // Words: blur-to-sharp focus-pull + y slide from alternating directions
          tl.from(item, {
            y:      idx % 2 === 0 ? 120 : -120,
            opacity: 0,
            scale:  0.75,
            filter: "blur(14px)",   // materialises from soft blur
            ease:   "back.out(1.6)",
            duration: 0.45,
          }, tStart);
        } else if (item.classList.contains("hj-badge")) {
          // Badges: scale from 0 + rotation + steep bounce
          const dir = idx % 3 === 0 ? -1 : 1;
          tl.from(item, {
            y:        dir * 170,
            scale:    0,
            rotation: dir * 48,
            opacity:  0,
            ease:     "back.out(2.3)",
            duration: 0.44,
          }, tStart);
        } else if (item.classList.contains("hj-shape")) {
          tl.from(item, {
            scale: 0, opacity: 0,
            rotation: idx % 2 === 0 ? -90 : 90,
            ease: "power3.out", duration: 0.32,
          }, tStart);
        } else if (item.classList.contains("hj-clover-wrap")) {
          tl.from(item, {
            scale: 0, opacity: 0,
            y: idx % 2 === 0 ? 160 : -160,
            ease: "elastic.out(1, 0.45)", duration: 0.6,
          }, tStart);
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="scroll-journey"
      className="relative bg-[var(--dark)] overflow-hidden"
      style={{ minHeight: "100vh" }}
      aria-label="Scroll journey"
    >
      <div className="absolute inset-0 gsap-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(192,0,255,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* ══ PHASE 1: Intro overlay ══ */}
      <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">

        {/* ── Scattered badge pills — animate in around headline ── */}
        {/* Badge 0: Bold — top-left */}
        <div className="hj-p1-badge absolute top-[16%] left-[7%] font-sans font-black rounded-2xl px-6 py-2 text-xl md:text-2xl"
          style={{ background: "#cc00ff", color: "#fff", letterSpacing: "-0.02em", transform: "rotate(-8deg)" }}>Bold</div>
        {/* Badge 1: Visionary — top-right */}
        <div className="hj-p1-badge absolute top-[12%] right-[8%] font-sans font-black rounded-2xl px-6 py-2 text-xl md:text-2xl"
          style={{ background: "var(--gsap-teal)", color: "#080a09", letterSpacing: "-0.02em", transform: "rotate(5deg)" }}>Visionary</div>
        {/* Badge 2: Fast — mid-left */}
        <div className="hj-p1-badge absolute top-[47%] left-[3%] -translate-y-1/2 font-sans font-black rounded-2xl px-6 py-2 text-xl md:text-2xl"
          style={{ background: "var(--gsap-green)", color: "#080a09", letterSpacing: "-0.02em", transform: "rotate(-5deg)" }}>Fast</div>
        {/* Badge 3: Scalable — bottom-right */}
        <div className="hj-p1-badge absolute bottom-[16%] right-[7%] font-sans font-black rounded-2xl px-6 py-2 text-xl md:text-2xl"
          style={{ background: "var(--gsap-amber)", color: "#080a09", letterSpacing: "-0.02em", transform: "rotate(7deg)" }}>Scalable</div>
        {/* Badge 4: Global — bottom-left */}
        <div className="hj-p1-badge absolute bottom-[20%] left-[10%] font-sans font-black rounded-2xl px-6 py-2 text-xl md:text-2xl"
          style={{ background: "var(--gsap-blue)", color: "#080a09", letterSpacing: "-0.02em", transform: "rotate(-4deg)" }}>Global</div>

        <p className="hj-label font-mono text-[var(--gsap-green)] text-xs tracking-[0.4em] uppercase mb-10 font-bold">// Our approach</p>
        <div className="mb-8 text-center" style={{ overflow: "visible" }}>
          {(["WE BUILD", "THE FUTURE", "TOGETHER."] as const).map((line, i) => (
            <div key={i} className="hj-intro-line font-sans font-black uppercase block"
              style={{ fontSize: "clamp(3rem, 9.5vw, 8.5rem)", letterSpacing: "-0.04em", lineHeight: 0.92, color: i === 1 ? "transparent" : "var(--light)", WebkitTextStroke: i === 1 ? "3px var(--gsap-green)" : undefined }}>
              {line}
            </div>
          ))}
        </div>
        <div className="hj-intro-clover mb-7"><Clover size={96} gradId="hj-intro-grad" /></div>
        <p className="hj-sub font-mono text-[var(--light)] opacity-55 text-sm md:text-base max-w-lg text-center leading-relaxed">
          From raw idea to global infrastructure —<br />every line of code is crafted with intention.
        </p>
      </div>

      {/* PHASE 2 — Horizontal track
           Sentence: We  [INAN INFINITES]  create  [emotions]  worth  [solutions.]
           Plain words slide in with blur-to-sharp focus pull.
           Colored boxes bounce/scale in with back eases.
           Clovers + shapes provide visual breathing room.
      */}
      <div ref={trackRef} className="absolute top-0 left-0 flex items-center gap-8 md:gap-10"
        style={{ height: "100vh", width: "max-content", paddingLeft: "8vw", paddingRight: "10vw", willChange: "transform" }}>

        {/* ── We ── plain */}
        <Word text="We" />

        {/* ── INAN INFINITES ── brand centrepiece badge */}
        {/* Gradient pill: the only gradient-background badge, makes brand name pop */}
        <div
          className="hj-item hj-badge shrink-0 font-sans font-black rounded-3xl whitespace-nowrap self-center"
          style={{
            background:    "linear-gradient(130deg, var(--gsap-green) 0%, var(--gsap-teal) 55%, #cc00ff 100%)",
            color:         "#080a09",
            fontSize:      "clamp(2.2rem, 4.5vw, 4rem)",
            letterSpacing: "-0.03em",
            padding:       "clamp(0.8rem,1.5vw,1.2rem) clamp(1.8rem,3.5vw,3rem)",
            boxShadow:     "0 0 60px rgba(0,255,136,0.22), inset 0 1px 0 rgba(255,255,255,0.25)",
            transform:     "rotate(-2deg)",
          }}
        >
          Inan Infinites
        </div>

        {/* ── Clover 1 ── breathing room after brand */}
        <div className="hj-item hj-clover-wrap shrink-0">
          <Clover size={100} gradId="hj-c1" />
        </div>

        {/* ── create ── plain */}
        <Word text="create" />

        {/* ── emotions ── purple badge */}
        <Badge label="emotions" bg="#cc00ff" color="#fff" rotate={-8} className="" />

        {/* ── Asterisk shape ── */}
        <span
          className="hj-item hj-shape shrink-0 text-[var(--gsap-amber)] select-none"
          style={{ fontSize: "3.5rem", lineHeight: 1 }}
          aria-hidden="true"
        >✳</span>

        {/* ── worth ── outline */}
        <Word text="worth" outline />

        {/* ── Diamond shape ── */}
        <div
          className="hj-item hj-shape shrink-0 self-center bg-[var(--gsap-amber)]"
          style={{ width: 56, height: 56, transform: "rotate(45deg)" }}
          aria-hidden="true"
        />

        {/* ── solutions. ── teal badge */}
        <Badge label="solutions." bg="var(--gsap-teal)" rotate={5} className="" />

        {/* ── Clover 2 ── bridge between sentences */}
        <div className="hj-item hj-clover-wrap shrink-0">
          <Clover size={88} gradId="hj-c2" />
        </div>

        {/* ════════════════════════════════════════════════════════════
            CONTINUES — "We craft technology that moves people."
            Old sentence kept in full; track scrolls on seamlessly.
        ════════════════════════════════════════════════════════════ */}

        {/* ── We ── */}
        <Word text="We" />

        {/* ── Clover 3 ── */}
        <div className="hj-item hj-clover-wrap shrink-0">
          <Clover size={110} gradId="hj-c3" />
        </div>

        {/* ── craft ── */}
        <Word text="craft" />

        {/* ── Fast badge ── green */}
        <Badge label="Fast" bg="var(--gsap-green)" rotate={-8} className="" />

        {/* ── technology ── */}
        <Word text="technology" />

        {/* ── Asterisk ── */}
        <span
          className="hj-item hj-shape shrink-0 text-[var(--gsap-amber)] select-none"
          style={{ fontSize: "3.5rem", lineHeight: 1 }}
          aria-hidden="true"
        >✳</span>

        {/* ── Precise badge ── purple */}
        <Badge label="Precise" bg="#cc00ff" color="#fff" rotate={6} className="" />

        {/* ── that ── outline */}
        <Word text="that" outline />

        {/* ── Diamond ── */}
        <div
          className="hj-item hj-shape shrink-0 self-center bg-[var(--gsap-amber)]"
          style={{ width: 60, height: 60, transform: "rotate(45deg)" }}
          aria-hidden="true"
        />

        {/* ── moves ── */}
        <Word text="moves" />

        {/* ── Alive badge ── teal */}
        <Badge label="Alive" bg="var(--gsap-teal)" rotate={3} className="" />

        {/* ── Clover 4 ── */}
        <div className="hj-item hj-clover-wrap shrink-0">
          <Clover size={96} gradId="hj-c4" />
        </div>

        {/* ── people. ── */}
        <Word text="people." />

        {/* ── Always. badge ── blue, final element */}
        <Badge label="Always." bg="var(--gsap-blue)" rotate={-4} className="" />

      </div>



    </section>
  );
}
