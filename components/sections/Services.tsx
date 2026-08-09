/**
 * Services Section — Chapter 3: GSAP Aesthetic
 *
 * Professional clay cards with numbered hierarchy, icon clarity, and CTA footers.
 * SplitText char-by-char reveal on service titles.
 */

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SERVICES = [
  {
    id: "product-engineering",
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Product Engineering",
    description: "Full-stack development from concept to production. We architect, build, and ship software built to scale.",
    tags: ["React", "Node.js", "APIs"],
    accent: "var(--gsap-green)",
  },
  {
    id: "ai-automation",
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="9" cy="14" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "AI & Automation",
    description: "Intelligent systems that learn and adapt. From LLM integrations to end-to-end process automation.",
    tags: ["LLMs", "ML Ops", "Automation"],
    accent: "var(--gsap-purple)",
  },
  {
    id: "cloud-platforms",
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
    title: "Cloud Platforms",
    description: "Resilient, observable, cost-efficient infrastructure built for AWS, GCP, or Azure — and built to last.",
    tags: ["AWS", "Kubernetes", "Terraform"],
    accent: "var(--gsap-blue)",
  },
  {
    id: "digital-consulting",
    num: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Digital Consulting",
    description: "Strategic technology advisory for ambitious teams. Make the right architectural decisions faster.",
    tags: ["Strategy", "Audits", "CTO-as-a-Service"],
    accent: "var(--gsap-teal)",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      createLineReveal(headingRef.current, { start: "top 80%" });

      // Bouncy entrance for cards
      const cards = gsap.utils.toArray(".gsap-service-card") as HTMLElement[];
      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, rotation: 2 },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );

        // SplitText char-by-char reveal on service card title
        const titleEl = card.querySelector<HTMLElement>(".service-title");
        if (titleEl) {
          const split = new SplitText(titleEl, { type: "chars" });
          gsap.from(split.chars, {
            opacity: 0,
            y: 20,
            rotationX: -60,
            stagger: 0.04,
            duration: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-container bg-[var(--dark)] py-32 px-6"
      aria-label="Products and Services"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <SectionDivider variant="navy" showTagline={false} />
          <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">
            // What we build
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)]"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            PRODUCTS &<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px var(--light)" }}>SERVICES</span>
          </h2>
        </div>

        {/* Professional card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              className={`gsap-service-card clay-card group flex flex-col ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
              style={{ borderRadius: 24 }}
            >
              {/* Card header stripe */}
              <div
                className="flex items-start justify-between p-7 pb-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Icon + number row */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(145deg, color-mix(in srgb, ${service.accent} 18%, transparent) 0%, color-mix(in srgb, ${service.accent} 6%, transparent) 100%)`,
                      border: `1px solid color-mix(in srgb, ${service.accent} 32%, transparent)`,
                      boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.3), 0 4px 16px color-mix(in srgb, ${service.accent} 18%, transparent)`,
                      color: service.accent,
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    className="service-title font-sans text-[var(--light)] text-xl font-bold uppercase"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Step number */}
                <span
                  className="font-mono text-xs font-black tracking-widest flex-shrink-0 mt-1"
                  style={{ color: service.accent, opacity: 0.55 }}
                >
                  {service.num}
                </span>
              </div>

              {/* Card body */}
              <div className="p-7 pt-5 flex flex-col flex-grow">
                <p className="font-mono text-[var(--light)] opacity-55 text-sm leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="clay-tag font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-1"
                      style={{
                        color: service.accent,
                        background: `linear-gradient(135deg, color-mix(in srgb, ${service.accent} 14%, transparent) 0%, color-mix(in srgb, ${service.accent} 5%, transparent) 100%)`,
                        border: `1px solid color-mix(in srgb, ${service.accent} 28%, transparent)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 8px color-mix(in srgb, ${service.accent} 10%, transparent)`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA footer */}
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span
                    className="font-mono text-xs tracking-widest uppercase font-bold group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: service.accent, opacity: 0.45 }}
                  >
                    Learn more →
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      background: `color-mix(in srgb, ${service.accent} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${service.accent} 35%, transparent)`,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3" style={{ color: service.accent }}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
