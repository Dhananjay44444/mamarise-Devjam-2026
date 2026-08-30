// theme.js
// Modern, cohesive design system for MamaRise

export const C = {
  // Core Warm Brand Tokens (Mom & Shared)
  cream: "#FAF6EF",
  creamWarm: "#F7F1E6",
  paper: "#F2EBE0",
  paperDeep: "#E8DFD0",
  paperCard: "rgba(255, 252, 247, 0.85)",
  paperGlass: "rgba(247, 241, 230, 0.72)",

  // Typography & Inks
  ink: "#2B2620",
  inkMuted: "#524A40",
  inkSoft: "#7E7568",
  inkLight: "#A69E92",

  // Sage Palette (Restoration, Health & Harmony)
  sage: "#5F8766",
  sageDark: "#3E6145",
  sageLight: "#DFEADC",
  sageSoft: "#EEF4EC",
  sageGlow: "rgba(95, 135, 102, 0.25)",

  // Blush / Rose Clay Palette (Support, Care & Warmth)
  blush: "#DF937D",
  blushLight: "#F8DDD2",
  blushDeep: "#BE6950",
  blushSoft: "#FCF0EB",
  blushGlow: "rgba(223, 147, 125, 0.25)",

  // Obsidian & Tactical Emerald (Partner Desk)
  obsidian: "#181A18",
  obsidianCard: "#222623",
  obsidianBorder: "rgba(255, 255, 255, 0.09)",
  obsidianHover: "#2C322D",
  emeraldLight: "#86C590",
  emeraldGlow: "rgba(134, 197, 144, 0.3)",

  // Borders & Accents
  line: "#D8CFC0",
  lineLight: "rgba(216, 207, 192, 0.45)",
  lineGlow: "rgba(95, 135, 102, 0.4)",
  gold: "#D4A359",
  goldLight: "#F8EBD4",
};

export const shadows = {
  sm: "0 2px 8px rgba(43, 38, 32, 0.04)",
  md: "0 8px 24px -4px rgba(43, 38, 32, 0.07)",
  lg: "0 18px 40px -8px rgba(43, 38, 32, 0.11)",
  xl: "0 26px 60px -12px rgba(43, 38, 32, 0.16)",
  glowSage: "0 12px 32px -4px rgba(95, 135, 102, 0.28)",
  glowBlush: "0 12px 32px -4px rgba(223, 147, 125, 0.28)",
  glowObsidian: "0 20px 48px -10px rgba(0, 0, 0, 0.45)",
};

export const gradients = {
  momHero: "radial-gradient(120% 120% at 50% 0%, #FFF8EE 0%, #FAF4EB 45%, #F0E6D6 100%)",
  momCard: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(247,241,230,0.85) 100%)",
  momAccent: "linear-gradient(135deg, #5F8766 0%, #44634A 100%)",
  blushAccent: "linear-gradient(135deg, #E39B85 0%, #BE6950 100%)",
  partnerHero: "radial-gradient(120% 120% at 50% 0%, #222622 0%, #171917 60%, #101210 100%)",
  partnerCard: "linear-gradient(145deg, rgba(34,38,35,0.95) 0%, rgba(24,26,24,0.98) 100%)",
  partnerGlow: "linear-gradient(135deg, #86C590 0%, #4E7C55 100%)",
};

// Motion Variants
export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const staggerSlow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
