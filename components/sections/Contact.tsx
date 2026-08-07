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
      className="section-container min-h-screen flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden bg-[var(--dark)]"
      aria-label="Contact Inan Infinites"
    >
      {/* Premium ambient glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[var(--gsap-purple)] rounded-full opacity-10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[var(--gsap-teal)] rounded-full opacity-10 blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 gsap-grid-bg opacity-20 pointer-events-none" />

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
            Start a <br className="md:hidden" />
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
          <p className="font-mono text-[var(--light)] opacity-50 text-sm mt-6 max-w-md mx-auto leading-relaxed">
            Whether it's a bold idea or a complex system, let's engineer the infinite together.
          </p>
        </div>

        <div 
          className="gsap-contact-grid grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 p-8 md:p-12 rounded-[2rem] relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px) saturate(150%)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gsap-green)] to-transparent opacity-30" />
          
          {/* Form Section */}
          <div className="gsap-contact-element lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center bg-[var(--gsap-green)]/10 border border-[var(--gsap-green)]/30 text-[var(--gsap-green)]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-sans font-black text-[var(--light)] text-3xl mb-4 uppercase tracking-tight">Message Received</h3>
                <p className="font-mono text-[var(--light)] opacity-60 text-sm max-w-xs mx-auto">
                  Our systems are processing your request. We will initiate contact shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="contact-name" className="block font-sans text-xs font-bold text-[var(--light)] tracking-widest uppercase mb-3 ml-1 opacity-80">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl font-mono text-sm bg-white/5 border border-white/10 text-[var(--light)] focus:outline-none focus:border-[var(--gsap-teal)]/50 focus:bg-white/10 transition-all placeholder-white/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block font-sans text-xs font-bold text-[var(--light)] tracking-widest uppercase mb-3 ml-1 opacity-80">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl font-mono text-sm bg-white/5 border border-white/10 text-[var(--light)] focus:outline-none focus:border-[var(--gsap-teal)]/50 focus:bg-white/10 transition-all placeholder-white/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="mb-8 flex-grow">
                  <label htmlFor="contact-message" className="block font-sans text-xs font-bold text-[var(--light)] tracking-widest uppercase mb-3 ml-1 opacity-80">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl font-mono text-sm bg-white/5 border border-white/10 text-[var(--light)] focus:outline-none focus:border-[var(--gsap-teal)]/50 focus:bg-white/10 transition-all placeholder-white/20 resize-none h-full min-h-[140px]"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl font-sans font-bold text-sm uppercase tracking-widest text-[var(--dark)] transition-all transform hover:scale-[1.02] active:scale-95"
                  style={{
                    background: "linear-gradient(90deg, var(--gsap-green) 0%, var(--gsap-teal) 100%)",
                    boxShadow: "0 10px 30px -10px rgba(157,255,47,0.4)"
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Details Section */}
          <div className="gsap-contact-element lg:col-span-2 flex flex-col justify-center gap-10 lg:pl-10 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0">
            <div className="group">
               <p className="font-mono text-xs tracking-widest uppercase mb-3 font-bold opacity-50 transition-opacity group-hover:opacity-100" style={{ color: "var(--gsap-green)" }}>Email</p>
               <a href="mailto:hello@inaninfinites.com" className="font-sans font-medium text-[var(--light)] text-xl hover:text-[var(--gsap-green)] transition-colors break-all">
                 hello@inaninfinites.com
               </a>
            </div>
            
            <div className="group">
               <p className="font-mono text-xs tracking-widest uppercase mb-3 font-bold opacity-50 transition-opacity group-hover:opacity-100" style={{ color: "var(--gsap-purple)" }}>Phone</p>
               <a href="tel:+919876543210" className="font-sans font-medium text-[var(--light)] text-xl hover:text-[var(--gsap-purple)] transition-colors">
                 +91 98765 43210
               </a>
            </div>

            <div className="group">
               <p className="font-mono text-xs tracking-widest uppercase mb-3 font-bold opacity-50 transition-opacity group-hover:opacity-100" style={{ color: "var(--gsap-teal)" }}>Headquarters</p>
               <p className="font-sans font-medium text-[var(--light)] text-lg leading-relaxed opacity-90">
                 Chennai, Tamil Nadu<br/>
                 India
               </p>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center flex flex-col items-center">
          <div className="w-10 h-10 mb-6 flex items-center justify-center opacity-40">
            <svg viewBox="0 0 300 300" className="w-full h-full fill-current text-[var(--light)]">
              <path d="M181 121h-.5v-1h.5a60 60 0 1 0-60-60v.5h-1V60a60 60 0 1 0-60 60h.5v1H60a60 60 0 1 0 60 60v-.5h1v.5a60 60 0 1 0 60-60Z"/>
            </svg>
          </div>
          <p className="font-mono text-[var(--light)] opacity-40 text-xs tracking-widest">
            © {new Date().getFullYear()} INAN INFINITES.
          </p>
        </div>
      </div>
    </section>
  );
}
