/**
 * Contact Section — Chapter 8: GSAP Aesthetic
 *
 * Super 3D claymorphism form. No placeholders.
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

      gsap.set(".gsap-contact-element", { y: 50, opacity: 0, scale: 0.96 });
      gsap.to(".gsap-contact-element", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.6)",
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
      className="section-container min-h-screen flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden bg-[var(--dark)]"
      aria-label="Contact Inan Infinites"
    >
      {/* Premium ambient glows */}
      <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[var(--gsap-purple)] rounded-full opacity-8 blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[5%] right-[5%] w-[700px] h-[700px] bg-[var(--gsap-teal)] rounded-full opacity-8 blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[var(--gsap-green)] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 gsap-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <SectionDivider variant="cream" showTagline={false} />
          <h2
            ref={headingRef}
            className="font-sans font-black text-[var(--light)] uppercase mt-12"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            Start a{" "}
            <span
              style={{
                background: "linear-gradient(110deg, var(--gsap-green) 0%, var(--gsap-teal) 50%, var(--gsap-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Conversation.
            </span>
          </h2>
        </div>

        {/* Super 3D Clay Form Container */}
        <div
          className="gsap-contact-element gsap-contact-grid clay-form-3d grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 p-8 md:p-14 relative"
          style={{ borderRadius: 36 }}
        >
          {/* Layered inner ambient tint */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            background: "radial-gradient(ellipse at 30% 0%, rgba(157,255,47,0.055) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(192,38,255,0.04) 0%, transparent 55%)",
            borderRadius: 36,
          }} />
          {/* Bottom extrusion face — visible clay thickness */}
          <div className="absolute bottom-[-6px] left-[2%] w-[96%] h-[6px] pointer-events-none z-[-1]" style={{
            background: "rgba(0,0,0,0.5)",
            borderRadius: "0 0 36px 36px",
            filter: "blur(2px)",
          }} />

          {/* Form Section */}
          <div className="gsap-contact-element lg:col-span-3 relative z-10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div
                  className="w-24 h-24 mb-8 rounded-full flex items-center justify-center text-[var(--gsap-green)] clay-card"
                  style={{ borderRadius: "50%", padding: 0 }}
                >
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-sans font-black text-[var(--light)] text-3xl mb-3 uppercase tracking-tight">
                  Message Received
                </h3>
                <p className="font-mono text-[var(--light)] opacity-50 text-sm max-w-xs mx-auto">
                  We&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-name"
                      className="font-sans text-[10px] font-black tracking-[0.28em] uppercase ml-1"
                      style={{ color: "var(--gsap-green)", opacity: 0.9 }}
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="clay-input w-full px-5 py-4 font-mono text-sm"
                    />
                  </div>
                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-email"
                      className="font-sans text-[10px] font-black tracking-[0.28em] uppercase ml-1"
                      style={{ color: "var(--gsap-teal)", opacity: 0.9 }}
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="clay-input w-full px-5 py-4 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2 flex-grow">
                  <label
                    htmlFor="contact-message"
                    className="font-sans text-[10px] font-black tracking-[0.28em] uppercase ml-1"
                    style={{ color: "var(--gsap-purple)", opacity: 0.9 }}
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="clay-input w-full px-5 py-4 font-mono text-sm resize-none flex-grow min-h-[140px]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="clay-btn w-full py-4 text-sm mt-2"
                >
                  <span>Send Message →</span>
                </button>
              </form>
            )}
          </div>

          {/* Details Section */}
          <div className="gsap-contact-element lg:col-span-2 flex flex-col justify-center gap-10 lg:pl-10 border-t lg:border-t-0 lg:border-l pt-10 lg:pt-0 relative z-10"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            {/* Email */}
            <div className="group clay-card p-6" style={{ borderRadius: 20 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-3 font-black" style={{ color: "var(--gsap-green)" }}>
                Email Us
              </p>
              <a
                href="mailto:hello@inaninfinites.com"
                className="font-sans font-bold text-[var(--light)] text-base hover:text-[var(--gsap-green)] transition-colors break-all"
              >
                hello@inaninfinites.com
              </a>
            </div>

            {/* Phone */}
            <div className="group clay-card p-6" style={{ borderRadius: 20 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-3 font-black" style={{ color: "var(--gsap-purple)" }}>
                Call Us
              </p>
              <a
                href="tel:+919876543210"
                className="font-sans font-bold text-[var(--light)] text-base hover:text-[var(--gsap-purple)] transition-colors"
              >
                +91 98765 43210
              </a>
            </div>

            {/* HQ */}
            <div className="group clay-card p-6" style={{ borderRadius: 20 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-3 font-black" style={{ color: "var(--gsap-teal)" }}>
                Headquarters
              </p>
              <p className="font-sans font-bold text-[var(--light)] text-base leading-snug">
                Chennai, Tamil Nadu<br />India
              </p>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center flex flex-col items-center">
          <div className="w-10 h-10 mb-6 flex items-center justify-center opacity-30">
            <svg viewBox="0 0 300 300" className="w-full h-full fill-current text-[var(--light)]">
              <path d="M181 121h-.5v-1h.5a60 60 0 1 0-60-60v.5h-1V60a60 60 0 1 0-60 60h.5v1H60a60 60 0 1 0 60 60v-.5h1v.5a60 60 0 1 0 60-60Z"/>
            </svg>
          </div>
          <p className="font-mono text-[var(--light)] opacity-30 text-xs tracking-widest">
            © {new Date().getFullYear()} INAN INFINITES.
          </p>
        </div>
      </div>
    </section>
  );
}
