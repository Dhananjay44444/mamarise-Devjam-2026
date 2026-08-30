import React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Shield,
  Moon,
  Scale,
  Briefcase,
} from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Logo, Screen, Button, Card, FloatingAccents, MiniRing } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";
import { useGo } from "../routing/useGo";

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg h-[380px] sm:h-[420px] mx-auto flex items-center justify-center select-none pointer-events-auto">
      {/* Ambient background glow */}
      <div
        className="absolute rounded-full filter blur-[70px] opacity-75 pointer-events-none"
        style={{
          width: 340,
          height: 340,
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(238, 222, 207, 0.9) 0%, rgba(246, 220, 207, 0.45) 50%, transparent 75%)",
        }}
      />

      {/* Decorative Star / Sparkle in Top Right */}
      <motion.div
        className="absolute top-2 right-4 sm:right-6 pointer-events-none"
        animate={{ scale: [1, 1.18, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={C.blushDeep} opacity="0.85">
          <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
        </svg>
      </motion.div>

      {/* Card 1: Restart (Top Right) */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [7, 9, 7] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05, y: -14 }}
        className="absolute top-2 right-4 sm:right-8 z-20 rounded-3xl p-5 sm:p-6 w-40 sm:w-44 shadow-lg cursor-pointer transition-shadow"
        style={{
          background: "#F4EEE3",
          border: `1px solid ${C.line}`,
          boxShadow: "0 18px 36px -8px rgba(43, 38, 32, 0.12)",
        }}
      >
        <Doodle.Bottle className="w-5 h-5 mb-2.5" style={{ color: C.sageDark }} />
        <p className="ff-body text-xs mb-0.5" style={{ color: C.inkSoft }}>
          Restart
        </p>
        <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>
          4 hrs
        </p>
      </motion.div>

      {/* Card 2: Rebalance (Middle Left) */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-7, -5, -7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        whileHover={{ scale: 1.05, y: -12 }}
        className="absolute top-24 left-2 sm:left-6 z-30 rounded-3xl p-5 sm:p-6 w-48 sm:w-52 shadow-xl flex items-center gap-3.5 cursor-pointer transition-shadow"
        style={{
          background: "#F4EEE3",
          border: `1px solid ${C.line}`,
          boxShadow: "0 22px 42px -10px rgba(43, 38, 32, 0.14)",
        }}
      >
        <MiniRing pct={58} color={C.sage} size={48} strokeWidth={5.5} />
        <div>
          <p className="ff-body text-xs mb-0.5" style={{ color: C.inkSoft }}>
            Rebalance
          </p>
          <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>
            58%
          </p>
        </div>
      </motion.div>

      {/* Card 3: Recovery (Bottom Center) */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        whileHover={{ scale: 1.05, y: -16 }}
        className="absolute bottom-4 left-12 sm:left-20 z-10 rounded-3xl p-5 sm:p-6 w-52 sm:w-56 shadow-xl cursor-pointer transition-shadow"
        style={{
          background: "#F4EEE3",
          border: `1px solid ${C.line}`,
          boxShadow: "0 24px 46px -12px rgba(43, 38, 32, 0.15)",
        }}
      >
        <Doodle.MoonRest className="w-5 h-5 mb-2.5" style={{ color: C.sageDark }} />
        <p className="ff-body text-xs mb-0.5" style={{ color: C.inkSoft }}>
          Recovery
        </p>
        <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>
          Stable
        </p>
      </motion.div>
    </div>
  );
}

export default function Landing() {
  const go = useGo();

  return (
    <Screen className="pt-6 pb-20">
      <FloatingAccents />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between mb-16 py-3 px-6 rounded-full glass-panel shadow-sm">
          <Logo size={32} />
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide uppercase" style={{ color: C.inkSoft }}>
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it works</a>
            <a href="#philosophy" className="hover:text-stone-900 transition-colors">Philosophy</a>
            <a href="#story" className="hover:text-stone-900 transition-colors">The Aisha Story</a>
            <button onClick={() => go("safetywall")} className="hover:text-stone-900 transition-colors flex items-center gap-1">
              <Shield size={13} style={{ color: C.sage }} /> Safety Wall
            </button>
          </div>
          <Button variant="sage" size="sm" onClick={() => go("roleselect")}>
            Start Your Journey <ChevronRight size={14} />
          </Button>
        </header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-28">
          <motion.div initial="hidden" animate="show" variants={stagger} className="lg:col-span-7">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6" style={{ background: C.sageLight, border: `1px solid ${C.sage}` }}>
              <Sparkles size={14} style={{ color: C.sageDark }} />
              <span className="ff-body text-xs font-semibold tracking-wider uppercase" style={{ color: C.sageDark }}>
                Recover · Rebalance · Restart
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="ff-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6" style={{ color: C.ink }}>
              From postpartum recovery <br />
              <span className="italic font-light" style={{ color: C.sage }}>to confident readiness.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="ff-body text-lg md:text-xl leading-relaxed mb-8 max-w-xl" style={{ color: C.inkMuted }}>
              Supporting new mothers through physical recovery triage, equitable household workloads, and a gentle career return — one measurable, guilt-free step at a time.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Button variant="sage" size="lg" onClick={() => go("roleselect")}>
                Start as Mom or Partner <ChevronRight size={16} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => go("safetywall")}>
                <Shield size={16} /> Our Safety Standard
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex items-center gap-8 pt-6 border-t" style={{ borderColor: C.lineLight }}>
              <div>
                <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>20 Sec</p>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>Daily check-in</p>
              </div>
              <div className="w-px h-8" style={{ background: C.line }} />
              <div>
                <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>0 Guilt</p>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>Deterministic triage</p>
              </div>
              <div className="w-px h-8" style={{ background: C.line }} />
              <div>
                <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>100% Shared</p>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>Partner action desk</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-5">
            <HeroIllustration />
          </div>
        </div>

        {/* Infographic Statistic Banner */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-28 p-8 md:p-12 rounded-3xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2B2620 0%, #1D1A16 100%)", color: C.cream }}
        >
          <div className="max-w-3xl relative z-10">
            <div className="w-12 h-1.5 rounded-full mb-6" style={{ background: C.blush }} />
            <p className="ff-display text-3xl md:text-5xl leading-tight mb-6 font-light">
              ≈ 1 in 3 educated Indian mothers <span className="font-normal" style={{ color: C.blushLight }}>never return to work</span> after childbirth.
            </p>
            <p className="ff-body text-base md:text-lg leading-relaxed mb-8 opacity-85">
              Not from a lack of talent or capability — but because physical exhaustion, invisible domestic labor, and career readiness stay hidden. MamaRise makes this journey visible, shared, and solvable.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs">
              <div className="flex items-start gap-3">
                <Moon size={18} style={{ color: C.sageLight }} className="shrink-0 mt-0.5" />
                <span>Deterministic physical triage flags real red flags before burnout.</span>
              </div>
              <div className="flex items-start gap-3">
                <Scale size={18} style={{ color: C.blushLight }} className="shrink-0 mt-0.5" />
                <span>Objective household load split transforms arguments into shared tasks.</span>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase size={18} style={{ color: C.goldLight }} className="shrink-0 mt-0.5" />
                <span>Readiness card translates daily care into verifiable capability hours.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Aisha Story Section */}
        <motion.div
          id="story"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mb-28"
        >
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="ff-body text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.sage }}>
              Real-World Impact
            </p>
            <h2 className="ff-display text-4xl md:text-5xl tracking-tight" style={{ color: C.ink }}>
              Meet Aisha. Everyone said she was "fine."
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                week: "Week 8 Postpartum",
                badge: "The Invisible Struggle",
                title: "Exhaustion is normalized",
                desc: "Broken sleep, severe backaches, brain fog. Well-meaning family tell her: “Yeh sab toh normal hai beta.”",
                icon: Moon,
                color: C.blushDeep,
              },
              {
                week: "The Domestic Reality",
                badge: "The Load Imbalance",
                title: "82% of household load",
                desc: "Cooking, laundry, pediatric visits, night wakings quietly handled alone with zero shared visibility.",
                icon: Scale,
                color: C.sageDark,
              },
              {
                week: "Month 6 Restart",
                badge: "The Career Cliff",
                title: "The blank resume gap",
                desc: "When she wants to return, interviewers only see a 6-month gap — missing the recovery, discipline, and growth.",
                icon: Briefcase,
                color: C.ink,
              },
            ].map((story) => (
              <motion.div key={story.week} variants={fadeUp}>
                <Card tilt className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="ff-body text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full" style={{ background: C.paperDeep, color: story.color }}>
                        {story.week}
                      </span>
                      <story.icon size={18} style={{ color: story.color }} />
                    </div>
                    <h3 className="ff-display text-xl font-bold mb-2" style={{ color: C.ink }}>{story.title}</h3>
                    <p className="ff-body text-sm leading-relaxed" style={{ color: C.inkSoft }}>{story.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl text-center glass-panel" style={{ border: `1px solid ${C.sage}` }}>
            <p className="ff-display text-lg italic" style={{ color: C.sageDark }}>
              "Invisible struggle → Objective evidence → Actionable next steps."
            </p>
          </div>
        </motion.div>

        {/* 5-Outcome Connected Data Engine */}
        <motion.div
          id="philosophy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mb-28 text-center"
        >
          <p className="ff-body text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.sage }}>
            Architecture Philosophy
          </p>
          <h2 className="ff-display text-4xl md:text-5xl mb-4" style={{ color: C.ink }}>
            One Shared Engine. Five Outcomes.
          </h2>
          <p className="ff-body text-base max-w-lg mx-auto mb-12" style={{ color: C.inkSoft }}>
            Suggest. Reflect. Never diagnose. Never guilt.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Physical Recovery", icon: Doodle.moonRest, active: true, badge: "Live" },
              { title: "Load Fairness", icon: Doodle.laundry, active: true, badge: "Live" },
              { title: "Career Readiness", icon: Doodle.bottle, active: true, badge: "Live" },
              { title: "Nourish Nudge", icon: Doodle.pot, active: true, badge: "Live" },
              { title: "Care Circle", icon: Doodle.heart, active: true, badge: "Live" },
            ].map((node) => (
              <motion.div key={node.title} variants={fadeUp}>
                <Card hover className="h-full flex flex-col items-center justify-center text-center !p-5">
                  <node.icon className="w-10 h-10 mb-3" style={{ color: C.sage }} />
                  <p className="ff-display text-sm font-semibold mb-1" style={{ color: C.ink }}>{node.title}</p>
                  <span className="ff-body text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: C.sageLight, color: C.sageDark }}>
                    {node.badge}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          id="how-it-works"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mb-28"
        >
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="ff-body text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.sage }}>
              Step-by-Step Experience
            </p>
            <h2 className="ff-display text-4xl md:text-5xl" style={{ color: C.ink }}>
              How MamaRise Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Doodle.moonRest,
                title: "20-Second Daily Check-in",
                desc: "Sleep, energy, pain, mood. Deterministic clinical logic interprets your state without scary diagnostic jargon.",
              },
              {
                step: "02",
                icon: Doodle.laundry,
                title: "The Household Load Mirror",
                desc: "Tasks entered by both partners convert into clear split percentages and 1-click reassignment duties.",
              },
              {
                step: "03",
                icon: Doodle.bottle,
                title: "Readiness Bridge & Card",
                desc: "Tiny 15-min weekly microtasks build verifiable skill currency, ready to export for employers or personal confidence.",
              },
            ].map((step, i) => (
              <motion.div key={step.title} variants={fadeUp}>
                <Card tilt className="h-full flex flex-col justify-between">
                  <div>
                    <span className="ff-display text-5xl font-light opacity-30 block mb-4" style={{ color: C.sageDark }}>
                      {step.step}
                    </span>
                    <step.icon className="w-9 h-9 mb-4" style={{ color: C.sage }} />
                    <h3 className="ff-display text-xl font-bold mb-2" style={{ color: C.ink }}>{step.title}</h3>
                    <p className="ff-body text-sm leading-relaxed" style={{ color: C.inkSoft }}>{step.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ready to Begin Call to Action */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FAF4EB 0%, #EFE4D4 100%)", border: `1px solid ${C.line}` }}
        >
          <div className="max-w-2xl mx-auto relative z-10">
            <Sparkles size={32} style={{ color: C.sage }} className="mx-auto mb-4" />
            <h2 className="ff-display text-4xl md:text-5xl leading-tight mb-4" style={{ color: C.ink }}>
              Your recovery counts. <br />
              <span className="italic" style={{ color: C.sageDark }}>So does everything after it.</span>
            </h2>
            <p className="ff-body text-base mb-8" style={{ color: C.inkSoft }}>
              Join thousands of mothers and partners creating a fairer, healthier postpartum transition.
            </p>
            <Button variant="sage" size="lg" onClick={() => go("roleselect")}>
              Start Your MamaRise Journey <ChevronRight size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 pt-8 flex items-center justify-between flex-wrap gap-4 border-t" style={{ borderColor: C.lineLight }}>
          <Logo size={24} />
          <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
            From recovery to readiness — built with care for new mothers and partners.
          </p>
          <button onClick={() => go("safetywall")} className="ff-body text-xs flex items-center gap-1.5 font-medium" style={{ color: C.sageDark }}>
            <Shield size={13} /> How we keep this safe
          </button>
        </footer>
      </div>
    </Screen>
  );
}
