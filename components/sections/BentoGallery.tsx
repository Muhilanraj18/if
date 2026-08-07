"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

const IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297121280-872518f8e078?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1200&auto=format&fit=crop",
];

export default function BentoGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!galleryRef.current || !containerRef.current) return;

      const galleryElement = galleryRef.current;
      const galleryItems = gsap.utils.toArray<HTMLElement>(".gallery__item", galleryElement);

      const createTween = () => {
        // Temporarily add the final class to capture the final state
        galleryElement.classList.add("gallery--final");
        const flipState = Flip.getState(galleryItems);
        galleryElement.classList.remove("gallery--final");

        const flip = Flip.to(flipState, {
          simple: true,
          ease: "expoScale(1, 5)",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: galleryElement,
            start: "center center",
            end: "+=100%",
            scrub: true,
            pin: containerRef.current,
          },
        });
        
        tl.add(flip);
      };

      createTween();

      // Ensure we recreate the tween on resize since Flip states depend on viewport dimensions
      let resizeTimer: any;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 200);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="gallery" className="gallery-wrap bg-[var(--dark)] relative w-full h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        .gallery-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .gallery {
          position: relative;
          width: 100%;
          height: 100%;
          flex: none;
        }

        .gallery__item {
          background-position: 50% 50%;
          background-size: cover;
          flex: none;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .gallery__item img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .gallery--bento {
          display: grid;
          gap: 1vh;
          grid-template-columns: repeat(3, 32.5vw);
          grid-template-rows: repeat(4, 23vh);
          justify-content: center;
          align-content: center;
        }

        .gallery--final.gallery--bento {
          grid-template-columns: repeat(3, 100vw);
          grid-template-rows: repeat(4, 49.5vh);
          gap: 1vh;
        }

        @media (max-width: 768px) {
          .gallery--bento {
            grid-template-columns: repeat(2, 48vw);
            grid-template-rows: repeat(5, 18vh);
          }
          .gallery--final.gallery--bento {
            grid-template-columns: repeat(2, 100vw);
            grid-template-rows: repeat(5, 30vh);
          }
          .gallery--bento .gallery__item:nth-child(1) { grid-area: 1 / 1 / 3 / 2; }
          .gallery--bento .gallery__item:nth-child(2) { grid-area: 1 / 2 / 2 / 3; }
          .gallery--bento .gallery__item:nth-child(3) { grid-area: 2 / 2 / 4 / 3; }
          .gallery--bento .gallery__item:nth-child(4) { grid-area: 3 / 1 / 4 / 2; }
          .gallery--bento .gallery__item:nth-child(5) { grid-area: 4 / 1 / 6 / 2; }
          .gallery--bento .gallery__item:nth-child(6) { grid-area: 4 / 2 / 5 / 3; }
          .gallery--bento .gallery__item:nth-child(7) { grid-area: 5 / 2 / 6 / 3; }
          .gallery--bento .gallery__item:nth-child(8) { display: none; }
        }

        @media (min-width: 769px) {
          .gallery--bento .gallery__item:nth-child(1) { grid-area: 1 / 1 / 3 / 2; }
          .gallery--bento .gallery__item:nth-child(2) { grid-area: 1 / 2 / 2 / 3; }
          .gallery--bento .gallery__item:nth-child(3) { grid-area: 2 / 2 / 4 / 3; }
          .gallery--bento .gallery__item:nth-child(4) { grid-area: 1 / 3 / 3 / 3; }
          .gallery--bento .gallery__item:nth-child(5) { grid-area: 3 / 1 / 3 / 2; }
          .gallery--bento .gallery__item:nth-child(6) { grid-area: 3 / 3 / 5 / 4; }
          .gallery--bento .gallery__item:nth-child(7) { grid-area: 4 / 1 / 5 / 2; }
          .gallery--bento .gallery__item:nth-child(8) { grid-area: 4 / 2 / 5 / 3; }
        }
      `}</style>

      <div ref={galleryRef} className="gallery gallery--bento gallery--switch" id="gallery-8">
        {IMAGES.map((src, index) => (
          <div key={index} className="gallery__item">
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
