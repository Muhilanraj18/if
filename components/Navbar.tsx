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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 flex justify-center">
      <nav
        ref={navRef}
        id="navbar"
        className="w-full flex items-center justify-between px-6 md:px-8 py-3 rounded-full border border-[var(--gsap-green)] border-opacity-30 bg-[rgba(8,10,9,0.4)] backdrop-blur-md"
        style={{
          visibility: "hidden", // autoAlpha starts hidden
          boxShadow: "0 0 30px rgba(157,255,47,0.05) inset",
        }}
        aria-label="Main navigation"
      >
      {/* Logo */}
      <a href="#top" onClick={(e) => handleNavClick(e, "#hero")} className="shrink-0">
        <Logo size={34} variant="cream" markOnly />
      </a>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-7" role="list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-sans text-xs tracking-[0.18em] uppercase text-[var(--light)] opacity-60 hover:opacity-100 transition-opacity duration-300"
              data-cursor="magnetic"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right cluster: CTA */}
      <div className="hidden md:flex items-center gap-4">
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          className="liquid-btn px-5 py-2 text-xs tracking-widest uppercase"
          data-cursor="magnetic"
        >
          <span>Get in touch</span>
        </a>
      </div>

      {/* Mobile: hamburger */}
      <div className="md:hidden flex items-center gap-3">
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px bg-[var(--light)] opacity-70 transition-all duration-300"
              style={{
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(2px, 2px)"
                  : i === 2 ? "rotate(-45deg) translate(2px, -2px)"
                  : "scaleX(0)"
                  : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel py-6 md:hidden rounded-3xl mt-4 border border-[var(--gsap-green)] border-opacity-30">
          <ul className="flex flex-col items-center gap-6" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-sans text-sm tracking-widest uppercase text-[var(--light)] opacity-80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </nav>
    </div>
  );
}
