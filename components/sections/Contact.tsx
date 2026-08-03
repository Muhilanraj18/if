/**
 * Contact Section — Chapter 8: GSAP Aesthetic
 * 
 * Stark dark terminal-style inputs and flat UI.
 */

"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionDivider from "@/components/ui/SectionDivider";
import { createLineReveal } from "@/lib/animations/textReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useGSAP(
    () => {
      if (!headingRef.current) return;

      createLineReveal(headingRef.current, { start: "top 80%" });

      gsap.set(".gsap-contact-element", { y: 40, opacity: 0 });
      gsap.to(".gsap-contact-element", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".gsap-contact-grid",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-container min-h-screen flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden bg-[var(--dark)] border-t border-[var(--dark-border)]"
      aria-label="Contact Inan Infinites"
    >
      <div className="absolute inset-0 gsap-grid-bg opacity-40 pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <SectionDivider variant="cream" showTagline={false} />
          <p className="font-mono text-[var(--gsap-green)] text-xs tracking-[0.3em] uppercase mb-4 font-bold">
            // Start a connection
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Deploy <br />
            <span className="gsap-text-gradient">Your Vision</span>
          </h2>
        </div>

        <div className="gsap-contact-grid grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[var(--dark-surface)] border-2 border-[var(--dark-border)] p-8 md:p-12 rounded-3xl" style={{ boxShadow: "12px 12px 0px rgba(0,0,0,1)" }}>
          
          {/* Form */}
          <div className="gsap-contact-element">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-[var(--gsap-green)] text-5xl mb-6 font-mono font-bold">200 OK</div>
                <h3 className="font-sans font-black text-[var(--light)] text-3xl mb-4 uppercase">Message received.</h3>
                <p className="font-mono text-[var(--light)] opacity-70 text-sm">
                  {"{"} status: "We'll be in touch within 24 hours." {"}"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <label htmlFor="contact-name" className="block font-mono text-xs text-[var(--light)] opacity-70 mb-2">// NAME</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="gsap-input w-full px-5 py-4 rounded-xl font-mono text-sm"
                    placeholder="const name ="
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="contact-email" className="block font-mono text-xs text-[var(--light)] opacity-70 mb-2">// EMAIL</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="gsap-input w-full px-5 py-4 rounded-xl font-mono text-sm"
                    placeholder="const email ="
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="contact-message" className="block font-mono text-xs text-[var(--light)] opacity-70 mb-2">// MESSAGE</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="gsap-input w-full px-5 py-4 rounded-xl font-mono text-sm resize-none"
                    placeholder="export default function Message() { ... }"
                  />
                </div>
                <button type="submit" className="gsap-button w-full">
                  Execute.send()
                </button>
              </form>
            )}
          </div>

          {/* Details */}
          <div className="gsap-contact-element flex flex-col justify-center gap-10 lg:pl-12 border-t lg:border-t-0 lg:border-l border-[var(--dark-border)] pt-10 lg:pt-0">
            <div>
               <p className="font-mono text-[var(--gsap-green)] text-xs tracking-widest uppercase mb-2 font-bold">// Email</p>
               <a href="mailto:hello@inaninfinites.com" className="font-sans font-bold text-[var(--light)] text-xl hover:text-[var(--gsap-green)] transition-colors">hello@inaninfinites.com</a>
            </div>
            
            <div>
               <p className="font-mono text-[var(--gsap-purple)] text-xs tracking-widest uppercase mb-2 font-bold">// Phone</p>
               <a href="tel:+919876543210" className="font-sans font-bold text-[var(--light)] text-xl hover:text-[var(--gsap-purple)] transition-colors">+91 98765 43210</a>
            </div>

            <div>
               <p className="font-mono text-[var(--gsap-blue)] text-xs tracking-widest uppercase mb-2 font-bold">// Location</p>
               <p className="font-sans font-bold text-[var(--light)] text-xl">Chennai, Tamil Nadu, India</p>
            </div>
          </div>

        </div>

        {/* Footer tagline */}
        <div className="mt-16 text-center border-t border-[var(--dark-border)] pt-8">
          <p className="font-mono text-[var(--light)] opacity-40 text-xs">
            © {new Date().getFullYear()} INAN INFINITES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </section>
  );
}
