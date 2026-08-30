import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, TrendingUp, LogOut } from "lucide-react";
import { C, shadows } from "../theme";
import { LeafIcon, SparkleIcon, PetalIcon } from "./Doodles";

export function Logo({ size = 32, dark = false, withTagline = false }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{
          background: dark ? "rgba(255,255,255,0.08)" : "rgba(95, 135, 102, 0.12)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(95, 135, 102, 0.25)"}`,
        }}
      >
        <svg width={size - 4} height={size - 4} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke={dark ? C.emeraldLight : C.sage} strokeWidth="1.8" />
          <path
            d="M20 29 Q20 19 11 13 Q21 8 20.5 18 Q20 8 30 13 Q21 19 20 29 Z"
            fill={dark ? C.emeraldLight : C.sage}
            opacity="0.92"
          />
          <circle cx="20" cy="20" r="2.4" fill={dark ? C.cream : C.blushDeep} />
        </svg>
      </div>
      <div>
        <span className="ff-display text-2xl tracking-tight leading-none block font-normal" style={{ color: dark ? C.cream : C.ink }}>
          Mama<em style={{ color: dark ? C.emeraldLight : C.sage, fontStyle: "italic" }}>Rise</em>
        </span>
        {withTagline && (
          <span className="ff-body text-[10px] tracking-widest uppercase block mt-0.5" style={{ color: dark ? C.paperDeep : C.inkSoft }}>
            Recovery · Rebalance · Restart
          </span>
        )}
      </div>
    </div>
  );
}

export function FloatingAccents({ dark = false }) {
  const items = [
    { I: LeafIcon, x: "5%", y: "8%", c: dark ? C.emeraldLight : C.sage, s: 26, dur: 7, delay: 0 },
    { I: SparkleIcon, x: "92%", y: "12%", c: dark ? C.goldLight : C.blushDeep, s: 18, dur: 6, delay: 1 },
    { I: PetalIcon, x: "94%", y: "65%", c: dark ? C.sageLight : C.blush, s: 24, dur: 8, delay: 2 },
    { I: SparkleIcon, x: "3%", y: "72%", c: dark ? C.emeraldLight : C.sage, s: 16, dur: 6.5, delay: 0.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block opacity-60"
          style={{ left: it.x, top: it.y, color: it.c }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 8, -4, 0],
            opacity: [0.4, 0.75, 0.4],
          }}
          transition={{
            duration: it.dur,
            repeat: Infinity,
            delay: it.delay,
            ease: "easeInOut",
          }}
        >
          <it.I style={{ width: it.s, height: it.s }} />
        </motion.div>
      ))}
    </div>
  );
}

export function MiniRing({ pct = 0, color = C.sage, size = 56, strokeWidth = 5.5, label = null }) {
  const r = size / 2 - strokeWidth;
  const circ = 2 * Math.PI * r;
  const safePct = Math.min(100, Math.max(0, pct));

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={C.paperDeep}
          strokeWidth={strokeWidth}
          opacity={0.8}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (circ * safePct) / 100 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="ff-display text-xs font-semibold" style={{ color: C.ink }}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

export function Screen({ children, dark = false, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen w-full px-5 py-8 md:px-10 lg:px-14 relative overflow-hidden flex flex-col justify-between ${className}`}
      style={{
        background: dark ? C.obsidian : C.cream,
        color: dark ? C.cream : C.ink,
      }}
    >
      {/* Background ambient lighting layers */}
      <div
        className="absolute rounded-full pointer-events-none filter blur-[110px] opacity-60"
        style={{
          width: 520,
          height: 520,
          left: "-10%",
          top: "-5%",
          background: dark
            ? "radial-gradient(circle, rgba(95,135,102,0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(248,221,210,0.7) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none filter blur-[120px] opacity-60"
        style={{
          width: 480,
          height: 480,
          right: "-12%",
          bottom: "5%",
          background: dark
            ? "radial-gradient(circle, rgba(134,197,144,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(223,234,220,0.85) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex-1">{children}</div>
    </motion.div>
  );
}

export function Card({
  children,
  className = "",
  style = {},
  hover = true,
  tilt = false,
  dark = false,
  glass = true,
  onClick,
  ...props
}) {
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setRot({ x: py * -7, y: px * 7 });
  };

  const baseBg = dark
    ? "rgba(34, 38, 35, 0.95)"
    : glass
      ? "rgba(255, 252, 247, 0.88)"
      : C.paper;

  const baseBorder = dark ? "rgba(255, 255, 255, 0.1)" : "rgba(216, 207, 192, 0.65)";

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      onClick={onClick}
      whileHover={
        hover
          ? {
            y: -4,
            boxShadow: dark
              ? "0 22px 48px -12px rgba(0, 0, 0, 0.6)"
              : "0 20px 42px -10px rgba(43, 38, 32, 0.12)",
            borderColor: dark ? "rgba(134, 197, 144, 0.4)" : "rgba(95, 135, 102, 0.4)",
          }
          : {}
      }
      animate={tilt ? { rotateX: rot.x, rotateY: rot.y } : {}}
      className={`rounded-3xl p-6 md:p-7 relative transition-colors duration-200 ${glass ? (dark ? "glass-panel-dark" : "glass-panel") : ""
        } ${className}`}
      style={{
        background: baseBg,
        border: `1px solid ${baseBorder}`,
        boxShadow: dark ? shadows.md : shadows.sm,
        transformPerspective: 900,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Button({
  children,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
  disabled = false,
  size = "md",
  ...props
}) {
  const sizeStyles =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : size === "lg"
        ? "px-7 py-4 text-base font-semibold"
        : "px-5 py-3 text-sm";

  const getVariantStyles = () => {
    switch (variant) {
      case "sage":
        return {
          background: "linear-gradient(135deg, #5F8766 0%, #44634A 100%)",
          color: C.cream,
          boxShadow: shadows.glowSage,
        };
      case "blush":
        return {
          background: "linear-gradient(135deg, #DF937D 0%, #BE6950 100%)",
          color: C.cream,
          boxShadow: shadows.glowBlush,
        };
      case "obsidian":
        return {
          background: "linear-gradient(135deg, #2A302B 0%, #181A18 100%)",
          color: C.cream,
          border: `1px solid ${C.emeraldLight}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        };
      case "outline":
        return {
          background: "rgba(255, 252, 247, 0.6)",
          color: C.ink,
          border: `1.5px solid ${C.inkMuted}`,
          backdropFilter: "blur(8px)",
        };
      case "ghost":
        return {
          background: "transparent",
          color: C.inkSoft,
          border: "1px solid transparent",
        };
      case "solid":
      default:
        return {
          background: C.ink,
          color: C.cream,
          boxShadow: "0 8px 22px rgba(43, 38, 32, 0.18)",
        };
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2, filter: "brightness(1.05)" }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={onClick}
      className={`ff-body inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none ${sizeStyles} ${className}`}
      style={getVariantStyles()}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Chip({ label, selected, onClick, dark = false }) {
  return (
    <motion.button
      type="button"
      layout
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="ff-body px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 select-none shadow-sm"
      style={{
        borderColor: selected
          ? dark
            ? C.emeraldLight
            : C.sage
          : dark
            ? "rgba(255,255,255,0.12)"
            : C.line,
        background: selected
          ? dark
            ? "rgba(134, 197, 144, 0.2)"
            : C.sageLight
          : dark
            ? "rgba(255,255,255,0.04)"
            : "rgba(255, 252, 247, 0.7)",
        color: selected
          ? dark
            ? C.emeraldLight
            : C.sageDark
          : dark
            ? C.paperDeep
            : C.inkSoft,
      }}
    >
      {label}
    </motion.button>
  );
}

export function TopBar({
  title,
  subtitle,
  onBack,
  onInsights,
  onSafety,
  onLogout,
  role = "mom",
  activeScreen = null,
  go = null,
}) {
  const isPartner = role === "partner";

  return (
    <header
      className="flex items-center justify-between mb-8 pb-4 flex-wrap gap-4 border-b transition-colors"
      style={{ borderColor: "rgba(216,207,192,0.45)" }}
    >
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: `1px solid ${C.line}`,
              color: C.ink,
            }}
          >
            <ArrowLeft size={16} />
          </button>
        ) : (
          <Logo size={28} />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span
              className="ff-body text-xs font-semibold tracking-widest uppercase"
              style={{ color: C.sageDark }}
            >
              {title}
            </span>
            <span
              className="ff-body text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: isPartner ? C.sageLight : "rgba(223,147,125,0.15)",
                color: isPartner ? C.sageDark : C.blushDeep,
                border: `1px solid ${isPartner ? C.sage : C.blush}`,
              }}
            >
              {isPartner ? "Partner Mode" : "Mom Space"}
            </span>
          </div>
          {subtitle && (
            <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {go && (
          <div
            className="hidden md:flex items-center gap-1 p-1 rounded-2xl"
            style={{ background: "rgba(242, 235, 224, 0.7)" }}
          >
            <button
              onClick={() => go("dashboard")}
              className={`ff-body text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${activeScreen === "dashboard" ? "shadow-sm" : ""
                }`}
              style={{
                background: activeScreen === "dashboard" ? C.cream : "transparent",
                color: activeScreen === "dashboard" ? C.ink : C.inkSoft,
              }}
            >
              Home
            </button>
            <button
              onClick={() => go("loadmirror")}
              className={`ff-body text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${activeScreen === "loadmirror" ? "shadow-sm" : ""
                }`}
              style={{
                background: activeScreen === "loadmirror" ? C.cream : "transparent",
                color: activeScreen === "loadmirror" ? C.ink : C.inkSoft,
              }}
            >
              Load Mirror
            </button>
            <button
              onClick={() => go("readiness")}
              className={`ff-body text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${activeScreen === "readiness" ? "shadow-sm" : ""
                }`}
              style={{
                background: activeScreen === "readiness" ? C.cream : "transparent",
                color: activeScreen === "readiness" ? C.ink : C.inkSoft,
              }}
            >
              Restart Plan
            </button>
          </div>
        )}

        {onInsights && (
          <button
            onClick={onInsights}
            className="ff-body text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-transform hover:scale-105 font-medium shadow-sm"
            style={{
              background: C.sageLight,
              color: C.sageDark,
              border: "1px solid rgba(95,135,102,0.25)",
            }}
          >
            <TrendingUp size={13} /> Insights
          </button>
        )}

        {onSafety && (
          <button
            onClick={onSafety}
            className="ff-body text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: `1px solid ${C.line}`,
              color: C.inkSoft,
            }}
          >
            <Shield size={13} /> Safety
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="ff-body text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors hover:bg-opacity-80"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: `1px solid ${C.line}`,
              color: C.inkSoft,
            }}
          >
            <LogOut size={13} /> Log out
          </button>
        )}
      </div>
    </header>
  );
}

export function Badge({ children, variant = "neutral", className = "" }) {
  const getBadgeStyle = () => {
    switch (variant) {
      case "success":
      case "steady":
        return { background: C.sageLight, color: C.sageDark, border: `1px solid ${C.sage}` };
      case "warning":
      case "monitor":
        return { background: C.goldLight, color: "#875C1C", border: `1px solid ${C.gold}` };
      case "urgent":
      case "alert":
        return { background: C.blushLight, color: C.blushDeep, border: `1px solid ${C.blush}` };
      case "neutral":
      default:
        return { background: C.paperDeep, color: C.inkSoft, border: `1px solid ${C.line}` };
    }
  };

  return (
    <span
      className={`ff-body text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${className}`}
      style={getBadgeStyle()}
    >
      {children}
    </span>
  );
}
