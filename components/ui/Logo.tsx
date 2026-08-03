/**
 * Logo — Inan Infinites
 * 
 * Inline SVG monogram and wordmark.
 * The "ih" letterform with a flame/leaf tick above the "i".
 * Used at multiple sizes across preloader, navbar, footer.
 */

import React from "react";

interface LogoProps {
  /** Pixel height of the mark (width scales proportionally) */
  size?: number;
  /** "navy" = navy on transparent, "cream" = cream on transparent */
  variant?: "navy" | "cream";
  /** Show only the monogram, not the full wordmark */
  markOnly?: boolean;
  className?: string;
}

export default function Logo({
  size = 48,
  variant = "navy",
  markOnly = false,
  className = "",
}: LogoProps) {
  const fill = variant === "cream" ? "#FAFAF8" : "#0B1F3F";
  const accent = "#B9D4F0";

  return (
    <svg
      viewBox="0 0 220 80"
      height={size}
      width={markOnly ? (size * 60) / 80 : (size * 220) / 80}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Inan Infinites"
      role="img"
    >
      {/* ── Monogram: "ih" ───────────────────────────────────────────── */}

      {/* Flame / leaf tick above the "i" dot position */}
      <path
        id="flame-tick"
        d="M22 6 C22 6 17 12 17 18 C17 22 19.5 24.5 22 24.5 C24.5 24.5 27 22 27 18 C27 12 22 6 22 6 Z"
        fill={accent}
        className="animate-flame-flicker"
      />

      {/* "i" stem */}
      <rect x="19.5" y="28" width="5" height="42" rx="2.5" fill={fill} />

      {/* "h" left stem */}
      <rect x="32" y="28" width="5" height="42" rx="2.5" fill={fill} />

      {/* "h" arch + right stem */}
      <path
        d="M37 42 C37 34 44 30 50 30 C56 30 61 34 61 42 L61 70 L56 70 L56 42 C56 37 53 34.5 50 34.5 C47 34.5 42 37 42 42 L42 70 L37 70 Z"
        fill={fill}
      />

      {/* ── Wordmark: "INAN INFINITES" (hidden when markOnly) ────────── */}
      {!markOnly && (
        <g transform="translate(80, 0)">
          {/* INAN INFINITES as wide-tracked small caps */}
          <text
            x="0"
            y="42"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="13"
            fontWeight="700"
            letterSpacing="5"
            fill={fill}
            textAnchor="start"
          >
            INAN INFINITES
          </text>

          {/* Tagline with diamond dividers */}
          <text
            x="0"
            y="58"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="6"
            fontWeight="400"
            letterSpacing="3.5"
            fill={variant === "cream" ? "rgba(250,250,248,0.6)" : "rgba(11,31,63,0.5)"}
            textAnchor="start"
          >
            INNOVATE ◆ INSPIRE ◆ INFINITE
          </text>

          {/* Decorative rule under tagline */}
          <line
            x1="0"
            y1="64"
            x2="135"
            y2="64"
            stroke={variant === "cream" ? "rgba(250,250,248,0.2)" : "rgba(11,31,63,0.15)"}
            strokeWidth="0.5"
          />
        </g>
      )}
    </svg>
  );
}
