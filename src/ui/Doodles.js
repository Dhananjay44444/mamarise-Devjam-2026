import React from "react";

export const LaundryIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path
      d="M12 26 Q10 24 14 22 Q30 12 50 22 Q54 24 52 26 L52 54 Q52 58 48 58 L16 58 Q12 58 12 54 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="40" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="32" cy="40" r="4" fill="currentColor" opacity="0.15" />
    <path d="M22 22 L24 22 M28 22 L30 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const PotIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path
      d="M14 30 L50 30 L47 50 Q46 54 42 54 L22 54 Q18 54 17 50 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M8 30 L14 30 M50 30 L56 30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M26 22 Q32 14 38 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="14" r="2" fill="currentColor" />
  </svg>
);

export const BottleIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path
      d="M26 10 L38 10 L38 16 Q44 20 44 28 L44 52 Q44 58 38 58 L26 58 Q20 58 20 52 L20 28 Q20 20 26 16 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <line x1="28" y1="32" x2="36" y2="32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="28" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="28" y1="48" x2="34" y2="48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const BroomIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path d="M40 8 L18 46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M18 46 L10 58 M18 46 L16 58 M18 46 L22 57" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="40" cy="8" r="2.5" fill="currentColor" />
  </svg>
);

export const BagIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path
      d="M16 22 L48 22 L46 56 Q46 58 44 58 L20 58 Q18 58 18 56 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M24 22 Q24 12 32 12 Q40 12 40 22" fill="none" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

export const MoonRestIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path
      d="M40 12 Q26 12 22 26 Q18 40 30 48 Q20 46 16 34 Q12 20 26 10 Q34 6 40 12 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="44" cy="24" r="1.8" fill="currentColor" />
    <circle cx="48" cy="36" r="1.5" fill="currentColor" />
  </svg>
);

export const HeartIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} {...props}>
    <path
      d="M32 54 Q10 38 10 22 Q10 10 22 10 Q30 10 32 18 Q34 10 42 10 Q54 10 54 22 Q54 38 32 54 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const LeafIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} {...props}>
    <path d="M4 20 Q2 10 12 4 Q22 10 20 20 Q12 24 4 20 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 20 Q12 14 18 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SparkleIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} {...props}>
    <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
  </svg>
);

export const PetalIcon = ({ className = "w-6 h-6", style = {}, ...props }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} {...props}>
    <path d="M12 3 Q19 10 12 21 Q5 10 12 3 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const Doodle = {
  laundry: LaundryIcon, Laundry: LaundryIcon,
  pot: PotIcon, Pot: PotIcon,
  bottle: BottleIcon, Bottle: BottleIcon,
  broom: BroomIcon, Broom: BroomIcon,
  bag: BagIcon, Bag: BagIcon,
  moonRest: MoonRestIcon, MoonRest: MoonRestIcon,
  heart: HeartIcon, Heart: HeartIcon,
  leaf: LeafIcon, Leaf: LeafIcon,
  sparkle: SparkleIcon, Sparkle: SparkleIcon,
  petal: PetalIcon, Petal: PetalIcon,
};

export default Doodle;
