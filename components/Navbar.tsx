/**
 * Navbar — Inan Infinites
 *
 * Hybrid Navbar:
 * - Desktop: Standard navbar with scroll-away behavior (hidden on mobile).
 * - Mobile: Island-style floating pill with GSAP easeReverse timeline (hidden on desktop).
 */

"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { href: "#services", label: "Work",    num: "01" },
  { href: "#work",     label: "About",   num: "02" },
  { href: "#build",    label: "Studio",  num: "03" },
  { href: "#about",    label: "Journal", num: "04" },
  { href: "#contact",  label: "Contact", num: "05" },
];

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  /* ── Desktop State ── */
  const navRef = useRef<HTMLElement>(null);

  /* ── Mobile State ── */
  const islandRef   = useRef<HTMLElement>(null);
  const barMidRef   = useRef<SVGLineElement>(null);
  const barTopRef   = useRef<SVGLineElement>(null);
  const barBotRef   = useRef<SVGLineElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const linkRefs    = useRef<HTMLAnchorElement[]>([]);
  const btnRef      = useRef<HTMLButtonElement>(null);
  
  const tlRef       = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef   = useRef(false);
  const builtRef    = useRef(false);

  /* =========================================================================
     DESKTOP NAVBAR LOGIC
     ========================================================================= */
  useGSAP(
    () => {
      if (!navRef.current) return;
      if (!visible) return;

      gsap.to(navRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });

      let timeoutId: NodeJS.Timeout;

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          if (window.scrollY > 80) {
            navRef.current?.classList.add("navbar-scrolled");
          } else {
            navRef.current?.classList.remove("navbar-scrolled");
          }

          if (self.direction === 1) {
            gsap.to(navRef.current, { yPercent: -150, opacity: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          } else if (self.direction === -1) {
            gsap.to(navRef.current, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          }

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (window.scrollY > 100) {
              gsap.to(navRef.current, { yPercent: -150, opacity: 0, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
            }
          }, 1200);
        }
      });
    },
    { dependencies: [visible], scope: navRef }
  );

  /* =========================================================================
     MOBILE FIXED NAVBAR LOGIC
     ========================================================================= */
  useEffect(() => {
    if (!islandRef.current) return;
    if (visible) {
      gsap.killTweensOf(islandRef.current);
      gsap.fromTo(
        islandRef.current,
        { autoAlpha: 0, y: -24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
    } else {
      gsap.set(islandRef.current, { autoAlpha: 0, y: -24 });
    }
  }, [visible]);

  // Mobile scroll elevation effect
  useEffect(() => {
    const handleScroll = () => {
      if (!islandRef.current) return;
      if (window.scrollY > 30) {
        islandRef.current.classList.add("island-scrolled");
      } else {
        islandRef.current.classList.remove("island-scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildTimeline = useCallback(() => {
    if (!panelRef.current || !overlayRef.current) return;

    if (tlRef.current) {
      tlRef.current.revert();
      tlRef.current.kill();
    }

    const tl = gsap.timeline({ paused: true })
      .set(overlayRef.current, { pointerEvents: "auto" })
      // Morph SVG hamburger into X
      .to(barMidRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      }, 0)
      .to(barTopRef.current, {
        attr: { x1: 4, y1: 4, x2: 12, y2: 12 },
        duration: 0.28,
        ease: "power3.inOut",
      }, 0)
      .to(barBotRef.current, {
        attr: { x1: 12, y1: 4, x2: 4, y2: 12 },
        duration: 0.28,
        ease: "power3.inOut",
      }, 0)
      // Backdrop fade
      .to(backdropRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      }, 0)
      // Panel slide down & fade
      .fromTo(panelRef.current,
        { autoAlpha: 0, y: -16, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        },
        0.05
      )
      // Nav links stagger in
      .fromTo(linkRefs.current.filter(Boolean),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          ease: "power2.out",
          stagger: 0.04,
        },
        0.12
      );

    tlRef.current = tl;
    builtRef.current = true;
  }, []);

  useEffect(() => {
    const id = setTimeout(buildTimeline, 50);
    window.addEventListener("resize", buildTimeline);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", buildTimeline);
    };
  }, [buildTimeline]);

  const toggle = useCallback(() => {
    if (!builtRef.current) buildTimeline();
    if (!tlRef.current || !btnRef.current) return;

    isOpenRef.current = !isOpenRef.current;
    const open = isOpenRef.current;

    btnRef.current.setAttribute("aria-expanded", String(open));
    btnRef.current.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    linkRefs.current.forEach((l) => l?.setAttribute("tabindex", open ? "0" : "-1"));

    if (open) {
      tlRef.current.timeScale(1).play();
    } else {
      tlRef.current.eventCallback("onReverseComplete", () => {
        if (overlayRef.current) gsap.set(overlayRef.current, { pointerEvents: "none" });
      });
      tlRef.current.timeScale(1.4).reverse();
    }
  }, [buildTimeline]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenRef.current) {
        toggle();
        btnRef.current?.focus();
      }
      if (e.key === "Tab" && isOpenRef.current) {
        const focusable = linkRefs.current.filter((l) => l?.getAttribute("tabindex") === "0");
        if (!focusable.length) return;
        const [first, last] = [focusable[0], focusable[focusable.length - 1]];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  /* =========================================================================
     COMMON
     ========================================================================= */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      import("@/lib/animations/gsapSetup").then(({ getLenis }) => {
        getLenis()?.scrollTo(target as HTMLElement, { offset: -80 });
      });
    }
    if (isOpenRef.current) toggle();
  };

  return (
    <>
      {/* ── DESKTOP NAVBAR (Hidden on mobile) ── */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 hidden md:block">
        <nav
          ref={navRef}
          id="navbar-desktop"
          className="clay-navbar w-full flex items-center justify-between px-6 md:px-8 py-3 rounded-full relative"
          style={{ opacity: 0, visibility: "hidden", transform: "translateY(-20px)" }}
          aria-label="Desktop navigation"
        >
          <div
            className="absolute top-0 left-[8%] w-[84%] h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 70%, transparent)",
            }}
          />
          <a href="#top" onClick={(e) => handleNavClick(e, "#hero")} className="shrink-0 relative z-10">
            <Logo size={34} variant="cream" markOnly />
          </a>
          <ul className="flex items-center gap-7 relative z-10" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-sans text-xs tracking-[0.18em] uppercase text-[var(--light)] opacity-60 hover:opacity-100 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(157,255,47,0.5)]"
                  data-cursor="magnetic"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 relative z-10">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="clay-btn px-5 py-2 text-xs"
              data-cursor="magnetic"
            >
              <span>Get in touch</span>
            </a>
          </div>
        </nav>
      </div>

      {/* ── MOBILE FIXED NAVBAR (Hidden on desktop) ── */}
      <div className="md:hidden">
        <header
          ref={islandRef}
          className="island"
          style={{ opacity: 0, visibility: "hidden" }}
          aria-label="Mobile navigation"
        >
          {/* Brand mark & title */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="island-brand"
            aria-label="Inan Infinites home"
          >
            <Logo size={24} variant="cream" markOnly />
            <span className="island-brand-text">INAN</span>
          </a>

          {/* Actions: Quick contact pill + Toggle */}
          <div className="island-actions">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="island-cta"
            >
              Contact
            </a>

            <button
              ref={btnRef}
              className="menu-btn"
              id="menuToggle"
              aria-expanded="false"
              aria-controls="menu-overlay"
              aria-label="Open navigation menu"
              onClick={toggle}
            >
              <div className="button-cont">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <line ref={barTopRef} x1="2" y1="5"  x2="14" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line ref={barMidRef} x1="2" y1="8"  x2="14" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line ref={barBotRef} x1="2" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </button>
          </div>
        </header>

        {/* Backdrop overlay & Dropdown Panel */}
        <div
          ref={overlayRef}
          id="menu-overlay"
          className="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={backdropRef}
            className="menu-backdrop"
            onClick={() => { if (isOpenRef.current) toggle(); }}
          />
          <div ref={panelRef} className="menu-panel">
            <nav aria-label="Mobile menu links">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  ref={(el) => { if (el) linkRefs.current[i] = el; }}
                  className="menu-link"
                  href={link.href}
                  tabIndex={-1}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <span>{link.label}</span>
                  <span className="link-num">{link.num}</span>
                </a>
              ))}
            </nav>

            <div className="menu-footer">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="clay-btn w-full py-3 text-xs flex items-center justify-center gap-2"
                tabIndex={-1}
              >
                <span>Get in touch</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

              <div className="menu-footer-meta">
                <span>Zurich • Tokyo • Global</span>
                <span className="text-[var(--gsap-green)]">Open for Q3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
