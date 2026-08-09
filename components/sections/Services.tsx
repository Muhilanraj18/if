/**
 * Services Section — Chapter 3: GSAP Aesthetic
 * 
 * Flat, neo-brutalist cards with bouncy hover states.
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
    icon: "{ }",
    title: "Product Engineering",
    description: "Full-stack product development from concept to production. We ship software that scales.",
    tags: ["React", "Node.js", "APIs"],
  },
  {
    id: "ai-automation",
    icon: "< >",
    title: "AI & Automation",
    description: "Intelligent systems that work for you. From LLM integrations to process automation.",
    tags: ["LLMs", "ML Ops", "Automation"],
  },
  {
    id: "cloud-platforms",
    icon: "[ ]",
    title: "Cloud Platforms",
    description: "Resilient, observable, and cost-efficient infrastructure — on AWS, GCP, or Azure.",
    tags: ["AWS", "Kubernetes", "Terraform"],
  },
  {
    id: "digital-consulting",
    icon: "//",
    title: "Digital Consulting",
    description: "Strategic technology advisory for ambitious teams. Make the right decisions faster.",
    tags: ["Strategy", "Audits", "CTO"],
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

        {/* Neo-brutalist card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {SERVICES.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              className={`gsap-service-card clay-card group p-8 md:p-10 ${index % 2 !== 0 ? 'md:mt-16' : ''}`}
            >
              {/* Icon */}
              <div
                className="font-mono text-4xl mb-6 font-bold"
                aria-hidden="true"
              >
                <span
                  className="clay-tag px-4 py-2 text-[var(--gsap-green)]"
                  style={{
                    background: "linear-gradient(135deg, rgba(157,255,47,0.15) 0%, rgba(157,255,47,0.05) 100%)",
                    border: "1px solid rgba(157,255,47,0.3)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(157,255,47,0.15)",
                    display: "inline-block",
                    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {service.icon}
                </span>
              </div>

              <h3
                className="service-title font-sans text-[var(--light)] text-2xl md:text-3xl font-bold mb-4 uppercase"
                style={{ letterSpacing: "-0.02em" }}
              >
                {service.title}
              </h3>

              <p className="font-mono text-[var(--light)] opacity-60 text-sm leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="clay-tag font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5"
                    style={{
                      color: "var(--gsap-green)",
                      background: "linear-gradient(135deg, rgba(157,255,47,0.14) 0%, rgba(157,255,47,0.06) 100%)",
                      border: "1px solid rgba(157,255,47,0.28)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px rgba(157,255,47,0.1)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

