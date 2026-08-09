/**
 * Navbar — Inan Infinites
 * 
 * - Fully transparent on load, gains blur/tint on scroll via ScrollTrigger toggleClass
 * - Dark/Light theme toggle (sun ↔ moon) with GSAP quickTo animation
 * - Mobile hamburger menu
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { href: "#services",   label: "Services" },
  { href: "#work",       label: "Work" },
  { href: "#build",      label: "How We Build" },
  { href: "#about",      label: "About" },
  { href: "#contact",    label: "Contact" },
];

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── GSAP: fade in after preloader + scroll-blur via toggleClass ── */
  useGSAP(
    () => {
      if (!navRef.current) return;

      // Fade-in after preloader
      gsap.to(navRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : -20,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (visible) {
        let timeoutId: NodeJS.Timeout;

        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "max",
          onUpdate: (self) => {
            // Toggle blur styling when scrolled past top
            if (window.scrollY > 80) {
              navRef.current?.classList.add("navbar-scrolled");
            } else {
              navRef.current?.classList.remove("navbar-scrolled");
            }

            // Direction: 1 = scrolling down, -1 = scrolling up
            if (self.direction === 1) {
              // Hide on scroll down
              gsap.to(navRef.current, { yPercent: -150, opacity: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            } else if (self.direction === -1) {
              // Show on scroll up
              gsap.to(navRef.current, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            }

            // Clear previous stop-scroll timer
            clearTimeout(timeoutId);

            // Auto-hide when scrolling stops (unless at the very top)
            timeoutId = setTimeout(() => {
              if (window.scrollY > 100) {
                gsap.to(navRef.current, { yPercent: -150, opacity: 0, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
              }
            }, 1200);
          }
        });
      }
    },
    { dependencies: [visible], scope: navRef }
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      import("@/lib/animations/gsapSetup").then(({ getLenis }) => {
        getLenis()?.scrollTo(target as HTMLElement, { offset: -80 });
      });
    }
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <nav
        ref={navRef}
        id="navbar"
        className="clay-navbar w-full flex items-center justify-between px-6 md:px-8 py-3 rounded-full relative"
        style={{ visibility: "hidden" }}
        aria-label="Main navigation"
      >
        {/* Top specular glint bar for navbar */}
        <div
          className="absolute top-0 left-[8%] w-[84%] h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 70%, transparent)",
          }}
        />

        {/* Logo */}
        <a href="#top" onClick={(e) => handleNavClick(e, "#hero")} className="shrink-0 relative z-10">
          <Logo size={34} variant="cream" markOnly />
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7 relative z-10" role="list">
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

        {/* Right cluster: CTA */}
        <div className="hidden md:flex items-center gap-4 relative z-10">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="clay-btn px-5 py-2 text-xs"
            data-cursor="magnetic"
          >
            <span>Get in touch</span>
          </a>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-3 relative z-10">
          <button
            className="rounded-full clay-card clay-card-dark relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ width: 40, height: 40 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[16px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute left-0 w-full rounded-full bg-[var(--light)] transition-all duration-300 origin-center"
                  style={{
                    height: 2,
                    top: i === 0 ? 0 : i === 1 ? 7 : 14,
                    opacity: menuOpen && i === 1 ? 0 : 0.85,
                    transform: menuOpen
                      ? i === 0 ? "translateY(7px) rotate(45deg)"
                      : i === 2 ? "translateY(-7px) rotate(-45deg)"
                      : "none"
                      : "none",
                  }}
                />
              ))}
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="clay-card absolute top-full left-0 right-0 w-full py-8 md:hidden mt-4 shadow-2xl"
            style={{ borderRadius: 28, zIndex: 100 }}
          >
            {/* Accent line at top */}
            <div className="absolute top-0 left-[10%] w-[80%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(157,255,47,0.4) 50%, transparent)" }}
            />
            <ul className="flex flex-col items-center gap-6 relative z-10" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-sans text-sm tracking-widest uppercase text-[var(--light)] opacity-80 hover:opacity-100 hover:text-[var(--gsap-green)] transition-all duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="clay-btn px-6 py-2.5 text-xs"
                >
                  <span>Get in touch</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
