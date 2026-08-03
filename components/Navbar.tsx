/**
 * Navbar — Inan Infinites
 * 
 * Fixed navigation that fades in after the preloader completes.
 * ScrollTrigger toggleClass highlights active section.
 */

"use client";

import React, { useRef, useState } from "react";
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
  visible: boolean; // set to true after preloader completes
}

export default function Navbar({ visible }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // gsap-react skill: useGSAP with dependency array for visible prop
  useGSAP(
    () => {
      if (!navRef.current) return;

      // gsap-core skill: autoAlpha (not opacity) so it's truly hidden at 0
      gsap.to(navRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : -20,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    { dependencies: [visible], scope: navRef }
  );

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      // Use Lenis for smooth programmatic scroll
      import("@/lib/animations/gsapSetup").then(({ getLenis }) => {
        getLenis()?.scrollTo(target as HTMLElement, { offset: -80 });
      });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        visibility: "hidden",   // autoAlpha starts hidden
        backdropFilter: "blur(12px)",
        background: "rgba(14, 16, 15, 0.85)",
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <a href="#top" onClick={(e) => handleNavClick(e, "#hero")}>
        <Logo size={36} variant="cream" markOnly />
      </a>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-8" role="list">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-sans text-xs tracking-[0.18em] uppercase text-[var(--light)] opacity-70 hover:opacity-100 transition-opacity duration-300"
              data-cursor="magnetic"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        onClick={(e) => handleNavClick(e, "#contact")}
        className="hidden md:inline-flex items-center gap-2 liquid-btn px-5 py-2 rounded-full text-xs tracking-widest uppercase"
        data-cursor="magnetic"
      >
        Get in touch
      </a>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 glass-panel py-6 md:hidden">
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
  );
}
