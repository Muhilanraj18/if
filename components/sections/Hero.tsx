/**
 * Hero Section — Inan Infinites
 *
 * Interactive FOCUS / PRESENCE / FEEL home page.
 * - Background images crossfade on row hover
 * - Floating typography watermark across the viewport
 * - SplitText char animations expand/collapse per row
 * - Parallax mouse tracking on bg layers
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(SplitText, ScrambleTextPlugin, CustomEase);

// ── Background images per state ──────────────────────────────────────────────
const BG_IMAGES: Record<string, string> = {
  default:  "https://assets.codepen.io/7558/wave-bg-001.webp",
  focus:    "https://assets.codepen.io/7558/wave-bg-002.webp",
  presence: "https://assets.codepen.io/7558/wave-bg-003.webp",
  feel:     "https://assets.codepen.io/7558/wave-bg-004.webp",
};

// ── Scattered background text ─────────────────────────────────────────────────
const TEXT_ITEMS: Array<{ text: string; top: string; left?: string; right?: string }> = [
  { text: "BE",              top: "5%",  left: "8%" },
  { text: "PRESENT",         top: "5%",  left: "15%" },
  { text: "LISTEN",          top: "5%",  left: "28%" },
  { text: "DEEPLY",          top: "5%",  left: "42%" },
  { text: "OBSERVE",         top: "5%",  left: "55%" },
  { text: "&",               top: "5%",  left: "75%" },
  { text: "FEEL",            top: "5%",  left: "85%" },
  { text: "MAKE",            top: "10%", left: "12%" },
  { text: "BETTER",          top: "10%", left: "45%" },
  { text: "DECISIONS",       top: "10%", right: "20%" },
  { text: "THE",             top: "15%", left: "8%" },
  { text: "CREATIVE",        top: "15%", left: "30%" },
  { text: "PROCESS",         top: "15%", left: "55%" },
  { text: "IS",              top: "15%", right: "20%" },
  { text: "MYSTERIOUS",      top: "15%", right: "5%" },
  { text: "S",               top: "25%", left: "5%" },
  { text: "I",               top: "25%", left: "10%" },
  { text: "M",               top: "25%", left: "15%" },
  { text: "P",               top: "25%", left: "20%" },
  { text: "L",               top: "25%", left: "25%" },
  { text: "I",               top: "25%", left: "30%" },
  { text: "C",               top: "25%", left: "35%" },
  { text: "I",               top: "25%", left: "40%" },
  { text: "T",               top: "25%", left: "45%" },
  { text: "Y",               top: "25%", left: "50%" },
  { text: "IS THE KEY",      top: "25%", right: "5%" },
  { text: "FIND YOUR VOICE", top: "35%", left: "25%" },
  { text: "TRUST INTUITION", top: "35%", left: "65%" },
  { text: "EMBRACE SILENCE", top: "50%", left: "5%" },
  { text: "QUESTION EVERYTHING", top: "50%", right: "5%" },
  { text: "TRUTH",           top: "75%", left: "20%" },
  { text: "WISDOM",          top: "75%", right: "20%" },
  { text: "FOCUS",           top: "80%", left: "10%" },
  { text: "ATTENTION",       top: "80%", left: "35%" },
  { text: "AWARENESS",       top: "80%", left: "65%" },
  { text: "PRESENCE",        top: "80%", right: "10%" },
  { text: "SIMPLIFY",        top: "85%", left: "25%" },
  { text: "REFINE",          top: "85%", right: "25%" },
];

// ── Rows ──────────────────────────────────────────────────────────────────────
const ROWS = [
  { id: "focus",    label: "FOCUS" },
  { id: "presence", label: "PRESENCE" },
  { id: "feel",     label: "FEEL" },
];

export default function Hero({ preloaderDone = true }: { preloaderDone?: boolean }) {
  const sectionRef   = useRef<HTMLElement>(null);
  const bgDefaultRef = useRef<HTMLDivElement>(null);
  const bgFocusRef   = useRef<HTMLDivElement>(null);
  const bgPresRef    = useRef<HTMLDivElement>(null);
  const bgFeelRef    = useRef<HTMLDivElement>(null);

  // State refs — avoid React re-renders inside GSAP callbacks
  const activeRowRef   = useRef<string | null>(null);
  const inTransition   = useRef(false);
  const splitTexts     = useRef<Record<string, SplitText>>({});
  const charWidths     = useRef<Record<string, { normal: number[]; wide: number[] }>>({});

  // Refs for scramble interval
  const scrambleTimer  = useRef<NodeJS.Timeout | null>(null);

  const setupChars = () => {
    ROWS.forEach((row, idx) => {
      const el = document.getElementById(`hero-text-${row.id}`) as HTMLElement | null;
      if (!el) return;

      if (splitTexts.current[row.id]) {
        splitTexts.current[row.id].revert();
      }

      const split = new SplitText(el, {
        type: "chars" as const,
        charsClass: `hero-char hero-char-${row.id}`,
        reduceWhiteSpace: false,
      });

      splitTexts.current[row.id] = split;

      // Measure natural + wide widths
      const natural: number[] = [];
      const wide: number[] = [];
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize || "40");
      const ratio = fontSize / 160;
      const isMobile = window.innerWidth < 768;

      split.chars.forEach((char) => {
        const cEl = char as HTMLElement;
        const w = Math.ceil(cEl.offsetWidth);
        natural.push(w);
        // On mobile keep expansion safe to prevent overflow
        const wideW = isMobile ? Math.ceil(w * 1.25) : Math.max(Math.ceil(w * 1.8), Math.ceil(85 * ratio));
        wide.push(wideW);
      });
      charWidths.current[row.id] = { normal: natural, wide };

      // Make inner span for translateX effect
      split.chars.forEach((char, ci) => {
        const hEl = char as HTMLElement;
        const txt = hEl.textContent || "";
        hEl.textContent = "";
        const inner = document.createElement("span");
        inner.className = "hero-char-inner";
        inner.textContent = txt;
        inner.style.cssText = "display:inline-block;transform:translate3d(0,0,0);";
        hEl.appendChild(inner);
        hEl.style.width = `${natural[ci]}px`;
        hEl.style.maxWidth = `${natural[ci]}px`;
      });

      el.style.visibility = "visible";

      // Initial blur-in stagger - delayed until after kinetic loader completes
      gsap.fromTo(
        split.chars,
        { opacity: 0, filter: "blur(15px)", willChange: "opacity, filter, transform" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08,
          ease: "customEase",
          delay: 0.2 + 0.12 * idx,
        }
      );
    });
  };

  useGSAP(
    () => {
      if (!preloaderDone) return;

      CustomEase.create("customEase", "0.86, 0, 0.07, 1");
      CustomEase.create("mouseEase", "0.25, 0.1, 0.25, 1");

      /* ── 1. Register SplitText for each row ── */
      setupChars();

      /* ── 2. Background text pulse ── */
      const bgItems = document.querySelectorAll<HTMLElement>(".hero-bg-text-item");
      bgItems.forEach((item, i) => {
        gsap.to(item, {
          opacity: 0.85,
          duration: 2 + (i % 3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5 + i * 0.1, // Delay start
        });
      });

      /* ── 3. Scramble random bg text words ── */
      const scramble = () => {
        const items = document.querySelectorAll<HTMLElement>(".hero-bg-text-item");
        if (!items.length) return;
        const pick = items[Math.floor(Math.random() * items.length)];
        const orig = pick.dataset.text ?? pick.textContent ?? "";
        gsap.to(pick, {
          duration: 1,
          scrambleText: { text: orig, chars: "■▪▌▐▬", revealDelay: 0.5, speed: 0.3 },
          ease: "none",
        });
        scrambleTimer.current = setTimeout(scramble, (0.5 + Math.random() * 2) * 1000);
      };
      scrambleTimer.current = setTimeout(scramble, 3000);

      /* ── 4. Parallax on mouse move (desktop only) ── */
      const parallaxEls = sectionRef.current?.querySelectorAll<HTMLElement>("[data-parallax]");
      const onMove = (e: MouseEvent) => {
        if (window.innerWidth < 768) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const ox = (e.clientX - cx) / cx;
        const oy = (e.clientY - cy) / cy;
        parallaxEls?.forEach((el) => {
          const s = parseFloat(el.dataset.parallax ?? "0.02");
          gsap.to(el, { x: ox * 100 * s, y: oy * 50 * s, duration: 1.0, ease: "mouseEase", overwrite: "auto" });
        });
      };
      const onLeave = () => {
        parallaxEls?.forEach((el) => gsap.to(el, { x: 0, y: 0, duration: 1.5, ease: "customEase" }));
      };
      sectionRef.current?.addEventListener("mousemove", onMove);
      sectionRef.current?.addEventListener("mouseleave", onLeave);

      // Handle window resize with debouncing
      let resizeTimeout: NodeJS.Timeout;
      const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setupChars();
        }, 200);
      };
      window.addEventListener("resize", onResize);

      return () => {
        sectionRef.current?.removeEventListener("mousemove", onMove);
        sectionRef.current?.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimeout);
        if (scrambleTimer.current) clearTimeout(scrambleTimer.current);
      };
    },
    { scope: sectionRef, dependencies: [preloaderDone] }
  );

  /* ── Background switcher (outside useGSAP so we can call freely) ── */
  function switchBg(id: string) {
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      default:  bgDefaultRef,
      focus:    bgFocusRef,
      presence: bgPresRef,
      feel:     bgFeelRef,
    };
    Object.entries(map).forEach(([key, ref]) => {
      gsap.to(ref.current, { opacity: key === id ? 1 : 0, duration: 0.8, ease: "power2.inOut" });
    });
  }

  /* ── Activate row ── */
  function activateRow(rowId: string) {
    if (activeRowRef.current === rowId || inTransition.current) return;
    inTransition.current = true;

    const prev = activeRowRef.current;
    activeRowRef.current = rowId;

    // Deactivate prev chars
    if (prev && splitTexts.current[prev]) {
      const prevChars  = splitTexts.current[prev].chars;
      const prevInners = prevChars.map((c: Element) => c.querySelector(".hero-char-inner")).filter(Boolean);
      const w = charWidths.current[prev];
      gsap.to(prevChars, { width: (i: number) => w?.normal[i] ?? 40, maxWidth: (i: number) => w?.normal[i] ?? 40, duration: 0.5, stagger: 0.02, ease: "customEase", overwrite: "auto" });
      gsap.to(prevInners, { x: 0, duration: 0.5, stagger: 0.02, ease: "customEase", overwrite: "auto" });
    }

    // Activate new chars
    const chars  = splitTexts.current[rowId]?.chars ?? [];
    const inners = chars.map((c: Element) => c.querySelector(".hero-char-inner")).filter(Boolean);
    const w2     = charWidths.current[rowId];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const el     = document.getElementById(`hero-text-${rowId}`);
    const fontSize = parseFloat(el ? window.getComputedStyle(el).fontSize : "160");
    const ratio  = fontSize / 160;
    // On mobile, zero xShift prevents characters from shifting off-screen
    const xShift = isMobile ? 0 : -35 * ratio;

    const tl = gsap.timeline({
      onComplete: () => { inTransition.current = false; },
    });
    tl.to(chars,  { width: (i: number) => w2?.wide[i] ?? 60, maxWidth: (i: number) => w2?.wide[i] ?? 60, duration: 0.6, stagger: 0.03, ease: "customEase", overwrite: "auto" }, 0);
    tl.to(inners, { x: xShift, duration: 0.6, stagger: 0.03, ease: "customEase", overwrite: "auto" }, 0.04);

    switchBg(rowId);
  }

  /* ── Deactivate row ── */
  function deactivateRow(rowId: string) {
    if (activeRowRef.current !== rowId || inTransition.current) return;
    activeRowRef.current = null;

    const chars  = splitTexts.current[rowId]?.chars ?? [];
    const inners = chars.map((c: Element) => c.querySelector(".hero-char-inner")).filter(Boolean);
    const w      = charWidths.current[rowId];
    gsap.to(inners, { x: 0, duration: 0.5, stagger: 0.02, ease: "customEase", overwrite: "auto" });
    gsap.to(chars,  { width: (i: number) => w?.normal[i] ?? 40, maxWidth: (i: number) => w?.normal[i] ?? 40, duration: 0.5, stagger: 0.02, ease: "customEase", overwrite: "auto" });

    switchBg("default");
  }

  const handleRowClick = (rowId: string) => {
    if (activeRowRef.current === rowId) {
      deactivateRow(rowId);
    } else {
      activateRow(rowId);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-container relative"
      style={{ minHeight: "100vh", overflow: "hidden", background: "#000" }}
    >
      {/* ── Frame bg ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(https://assets.codepen.io/7558/web03.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
        data-parallax="0.015"
      />

      {/* ── Crossfading background images ── */}
      {Object.entries(BG_IMAGES).map(([key, src]) => (
        <div
          key={key}
          ref={
            key === "default"  ? bgDefaultRef :
            key === "focus"    ? bgFocusRef   :
            key === "presence" ? bgPresRef    :
            bgFeelRef
          }
          data-parallax="0.025"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: key === "default" ? 1 : 0,
            zIndex: 1,
            mixBlendMode: "multiply",
            transition: undefined,
          }}
        />
      ))}

      {/* ── Bottom gradient ── */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "40vh",
          background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          zIndex: 2,
        }}
      />

      {/* ── Scattered bg text ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {TEXT_ITEMS.map((item, i) => (
          <div
            key={i}
            className="hero-bg-text-item"
            data-text={item.text}
            style={{
              position: "absolute",
              top: item.top,
              ...(item.left  ? { left:  item.left  } : {}),
              ...(item.right ? { right: item.right } : {}),
              color: "#ffcc00",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              opacity: 0.6,
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* ── Main interactive rows ── */}
      <div
        className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 sm:px-6"
        style={{ zIndex: 10 }}
      >
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
          {ROWS.map((row) => (
            <div
              key={row.id}
              className="hero-row w-full flex items-center justify-center relative cursor-pointer select-none"
              data-row-id={row.id}
              style={{
                position: "relative",
                height: "clamp(60px, 12vw, 150px)",
                margin: "clamp(4px, 1vw, 12px) 0",
                overflow: "visible",
                zIndex: 100,
              }}
              onMouseEnter={() => activateRow(row.id)}
              onMouseLeave={() => deactivateRow(row.id)}
              onClick={() => handleRowClick(row.id)}
            >
              {/* Text content */}
              <div
                id={`hero-text-${row.id}`}
                className="hero-text-content"
                data-text={row.label}
                style={{
                  fontWeight: "normal",
                  fontFamily: "'PP Neue Montreal', system-ui, sans-serif",
                  textTransform: "uppercase",
                  color: "#ffcc00",
                  letterSpacing: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  visibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  userSelect: "none",
                }}
              >
                {row.label}
              </div>

              {/* Invisible interactive hit area on top */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Inline styles for char animation ── */}
      <style>{`
        .hero-char {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: max-width 0.6s cubic-bezier(0.86, 0, 0.07, 1), width 0.6s cubic-bezier(0.86, 0, 0.07, 1);
          flex-shrink: 0;
        }
        .hero-char-inner {
          display: inline-block;
          will-change: transform;
          transform: translate3d(0,0,0);
          -webkit-font-smoothing: antialiased;
          backface-visibility: hidden;
        }
        .hero-text-content {
          font-size: clamp(3.8rem, 9.5vw, 9.5rem);
          line-height: 1;
        }
        @media (max-width: 768px) {
          .hero-row { height: clamp(52px, 11vw, 84px) !important; margin: 3px 0 !important; }
          .hero-text-content { font-size: clamp(2.3rem, 8vw, 3.6rem); }
          .hero-bg-text-item { display: none !important; } /* Hide scattered text on mobile to prevent overlap & lag */
        }
        @media (max-width: 480px) {
          .hero-row { height: clamp(44px, 10vw, 68px) !important; margin: 2px 0 !important; }
          .hero-text-content { font-size: clamp(1.8rem, 8vw, 2.45rem); }
        }
        @media (max-width: 360px) {
          .hero-row { height: 42px !important; margin: 2px 0 !important; }
          .hero-text-content { font-size: 1.6rem; }
        }
      `}</style>
    </section>
  );
}
