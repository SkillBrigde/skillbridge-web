import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ──────────────────────────────────────────────
       * COLORS — Dark Slate Precision Design System
       * Source: Stitch Design DESIGN.md
       * ────────────────────────────────────────────── */
      colors: {
        // ── Base Canvas & Surfaces ──
        canvas: {
          DEFAULT: "#0B0C0E",
        },
        surface: {
          DEFAULT: "#121315",
          dim: "#121315",
          bright: "#38393B",
          subtle: "#0F1115",
          container: {
            lowest: "#0D0E10",
            low: "#1B1C1E",
            DEFAULT: "#1F2022",
            high: "#292A2C",
            highest: "#343537",
          },
        },
        "on-surface": {
          DEFAULT: "#E3E2E5",
          variant: "#C6C5D5",
        },
        "inverse-surface": "#E3E2E5",
        "inverse-on-surface": "#303033",

        // ── Structural Hairlines ──
        outline: {
          DEFAULT: "#908F9E",
          variant: "#454652",
        },
        "surface-tint": "#BDC2FF",

        // ── Brand Action (Indigo) ──
        primary: {
          DEFAULT: "#BDC2FF",
          container: "#5E6AD2",
          fixed: "#DFE0FF",
          "fixed-dim": "#BDC2FF",
        },
        "on-primary": {
          DEFAULT: "#121F8B",
          container: "#FDFAFF",
          fixed: "#000965",
          "fixed-variant": "#2E3AA2",
        },
        "inverse-primary": "#4854BB",

        // ── Escrow / Settled (Emerald) ──
        secondary: {
          DEFAULT: "#48DFA3",
          container: "#03BD84",
          fixed: "#6AFCBD",
          "fixed-dim": "#48DFA3",
        },
        "on-secondary": {
          DEFAULT: "#003825",
          container: "#00452D",
          fixed: "#002114",
          "fixed-variant": "#005237",
        },

        // ── Pending / Expiry (Amber) ──
        tertiary: {
          DEFAULT: "#FFB955",
          container: "#A06800",
          fixed: "#FFDDB4",
          "fixed-dim": "#FFB955",
        },
        "on-tertiary": {
          DEFAULT: "#452B00",
          container: "#FFFAF9",
          fixed: "#291800",
          "fixed-variant": "#633F00",
        },

        // ── Dispute / Critical SLA (Rose) ──
        error: {
          DEFAULT: "#FFB4AB",
          container: "#93000A",
        },
        "on-error": {
          DEFAULT: "#690005",
          container: "#FFDAD6",
        },

        // ── Semantic Aliases (convenience) ──
        brand: {
          indigo: "#5E6AD2",
          "indigo-hover": "#6F7BE2",
          "indigo-active": "#525DBB",
        },
        escrow: {
          emerald: "#27C98F",
        },
        pending: {
          amber: "#F5A623",
        },
        dispute: {
          rose: "#FF5C5C",
        },

        // ── Text Contrast Tiers ──
        "text-primary": "#F0F2F5",
        "text-secondary": "#9BA1B0",
        "text-tertiary": "#5D6474",
      },

      /* ──────────────────────────────────────────────
       * TYPOGRAPHY
       * ────────────────────────────────────────────── */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      fontSize: {
        "display-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        "display-lg-mobile": [
          "26px",
          { lineHeight: "32px", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        "headline-md": [
          "20px",
          { lineHeight: "28px", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "headline-sm": [
          "16px",
          { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        "body-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "body-sm": [
          "12px",
          { lineHeight: "18px", letterSpacing: "-0.005em", fontWeight: "400" },
        ],
        "label-code": [
          "13px",
          { lineHeight: "18px", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "label-numeric": [
          "14px",
          { lineHeight: "20px", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "label-badge": [
          "11px",
          { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "500" },
        ],
      },

      /* ──────────────────────────────────────────────
       * SPACING — 8pt Grid + 4pt Micro
       * ────────────────────────────────────────────── */
      spacing: {
        "space-xs": "0.25rem",   // 4px
        "space-sm": "0.5rem",    // 8px
        "space-md": "1rem",      // 16px
        "space-lg": "1.5rem",    // 24px
        "space-xl": "2rem",      // 32px
        gutter: "1rem",          // 16px
        "gutter-desktop": "1.5rem", // 24px
        margin: "1rem",          // 16px
        "margin-tablet": "1.5rem",  // 24px
        "margin-desktop": "2.5rem", // 40px
      },

      /* ──────────────────────────────────────────────
       * BORDER RADIUS
       * ────────────────────────────────────────────── */
      borderRadius: {
        sm: "0.125rem",    // 2px
        DEFAULT: "0.25rem", // 4px
        md: "0.375rem",    // 6px
        lg: "0.5rem",      // 8px
        xl: "0.75rem",     // 12px
        full: "9999px",
      },

      /* ──────────────────────────────────────────────
       * BOX SHADOW — Depth via Tonal Stacking
       * ────────────────────────────────────────────── */
      boxShadow: {
        "overlay": "0 8px 24px -4px rgba(0, 0, 0, 0.8)",
        "focus-ring": "0 0 0 1px rgba(94, 106, 210, 0.25)",
        "focus-ring-brand": "0 0 0 1px rgba(94, 106, 210, 0.4)",
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        "card-lg": "0 4px 12px -2px rgba(0, 0, 0, 0.5)",
      },

      /* ──────────────────────────────────────────────
       * KEYFRAMES & ANIMATIONS
       * ────────────────────────────────────────────── */
      keyframes: {
        "ping-slow": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "scan-line": {
          "0%": { top: "0.5rem" },
          "100%": { top: "calc(100% - 0.5rem)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "scan-line": "scan-line 2s ease-in-out infinite alternate",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },

      /* ──────────────────────────────────────────────
       * BREAKPOINTS (already default in Tailwind,
       * documented here for reference)
       * Mobile: <768px | Tablet: 768-1199px | Desktop: 1200+
       * ────────────────────────────────────────────── */
      screens: {
        tablet: "768px",
        desktop: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
