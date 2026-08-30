import React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar, MiniRing } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";

function capacityLabel(recovery) {
  if (!recovery) return "Pending Check-in";
  if (recovery.energy === "Low" || recovery.sleepHours < 5) return "Low Capacity";
  if (recovery.energy === "Okay") return "Moderate Capacity";
  return "Steady Capacity";
}

function JourneyThread({ active = 1, compact = false }) {
  const stages = [
    { label: "Recover", sub: "Physical Triage" },
    { label: "Rebalance", sub: "Domestic Equity" },
    { label: "Restart", sub: "Career Currency" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl glass-panel text-center" style={{ border: `1px solid ${C.lineLight}` }}>
      <p className="ff-body text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.sageDark }}>
        Your Gentle Transition Roadmap
      </p>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5" style={{ background: C.paperDeep }} />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 transition-all duration-700"
          style={{
            background: C.sage,
            width: active === 0 ? "0%" : active === 1 ? "50%" : "100%",
          }}
        />

        {stages.map((stage, idx) => {
          const isDone = idx < active;
          const isCurrent = idx === active;
          return (
            <div key={stage.label} className="relative z-10 flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm"
                style={{
                  background: isCurrent ? C.sage : isDone ? C.sageDark : C.paper,
                  color: isCurrent || isDone ? C.cream : C.inkSoft,
                  border: `2px solid ${isCurrent ? C.sage : isDone ? C.sageDark : C.line}`,
                }}
              >
                {isDone ? <CheckCircle2 size={16} /> : `0${idx + 1}`}
              </div>
              <span className="ff-display text-xs font-semibold mt-2" style={{ color: C.ink }}>
                {stage.label}
              </span>
              <span className="ff-body text-[10px]" style={{ color: C.inkSoft }}>
                {stage.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MomDashboard({
  user,
  recovery,
  choreSplit,
  capacityHrs,
  skills = [],
  go,
  onLogout,
}) {
  const capText = capacityLabel(recovery);
  const doneSkillsCount = skills.filter((s) => s.done).length;
  const isTriageUrgent = recovery?.pain === "Severe" || (recovery?.mood === "Low" && recovery?.energy === "Low");

  return (
    <Screen className="pb-16">
      <div className="max-w-5xl mx-auto">
        <TopBar
          title="Mom Dashboard"
          subtitle="A quiet space designed for your recovery pace"
          onInsights={() => go("insights")}
          onSafety={() => go("safetywall")}
          onLogout={onLogout}
          role="mom"
          activeScreen="dashboard"
          go={go}
        />

        {/* Welcome Banner */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="ff-body text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style={{ background: C.blushLight, color: C.blushDeep }}>
                  Week 8 Postpartum
                </span>
                <span className="ff-body text-xs" style={{ color: C.inkSoft }}>
                  · Rest & Recovery Phase
                </span>
              </div>
              <h1 className="ff-display text-3xl md:text-4xl font-bold tracking-tight" style={{ color: C.ink }}>
                Good morning, {user.name || "Aisha"}
              </h1>
            </div>

            {/* Quick status pill */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl glass-panel self-start md:self-auto">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.sageLight, color: C.sageDark }}>
                <Sparkles size={16} />
              </div>
              <div>
                <p className="ff-body text-[10px] font-bold uppercase tracking-wider" style={{ color: C.inkSoft }}>Today's Pulse</p>
                <p className="ff-display text-xs font-semibold" style={{ color: C.ink }}>{capText}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trio Core Cards Grid */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Physical Recovery */}
          <motion.div variants={fadeUp}>
            <Card tilt className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: C.sageLight }}>
                    <Doodle.MoonRest className="w-7 h-7" style={{ color: C.sageDark }} />
                  </div>
                  <MiniRing
                    pct={recovery ? (recovery.energy === "Low" ? 35 : recovery.energy === "Okay" ? 65 : 90) : 50}
                    color={recovery?.energy === "Low" ? C.blushDeep : C.sage}
                    size={52}
                  />
                </div>

                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                  Pillar 01
                </span>
                <h3 className="ff-display text-xl font-bold mb-1" style={{ color: C.ink }}>
                  Physical Recovery
                </h3>
                <p className="ff-body text-xs leading-relaxed mb-4" style={{ color: C.inkSoft }}>
                  {recovery
                    ? `Last logged: ${recovery.sleepHours}h sleep · ${recovery.energy} energy · ${recovery.pain} pain.`
                    : "Take 20 seconds to log sleep, energy, and comfort level."}
                </p>

                {isTriageUrgent && (
                  <div className="p-2.5 rounded-xl mb-4 text-xs font-medium flex items-center gap-2" style={{ background: C.blushSoft, color: C.blushDeep }}>
                    <AlertCircle size={14} className="shrink-0" />
                    <span>Rest is advised. Partner alert generated.</span>
                  </div>
                )}
              </div>

              <Button
                variant={recovery ? "outline" : "sage"}
                onClick={() => go("checkin")}
                className="w-full justify-between"
              >
                <span>{recovery ? "Update Check-in" : "Start Check-in"}</span>
                <ChevronRight size={15} />
              </Button>
            </Card>
          </motion.div>

          {/* Card 2: Household Load Rebalance */}
          <motion.div variants={fadeUp}>
            <Card tilt className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: C.blushLight }}>
                    <Doodle.Laundry className="w-7 h-7" style={{ color: C.blushDeep }} />
                  </div>
                  <MiniRing
                    pct={choreSplit.me}
                    color={choreSplit.me > 55 ? C.blushDeep : C.sage}
                    size={52}
                    label={`${choreSplit.me}%`}
                  />
                </div>

                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.blushDeep }}>
                  Pillar 02
                </span>
                <h3 className="ff-display text-xl font-bold mb-1" style={{ color: C.ink }}>
                  Load Rebalance
                </h3>
                <p className="ff-body text-xs leading-relaxed mb-4" style={{ color: C.inkSoft }}>
                  You carry <b>{choreSplit.me}%</b> of domestic tasks. Partner handles <b>{choreSplit.partner}%</b>.
                </p>

                <div className="p-2.5 rounded-xl mb-4 text-xs font-medium flex items-center justify-between" style={{ background: C.paperDeep }}>
                  <span style={{ color: C.ink }}>Partner Action Desk</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live & Connected
                  </span>
                </div>
              </div>

              <Button variant="outline" onClick={() => go("loadmirror")} className="w-full justify-between">
                <span>View & Rebalance Load</span>
                <ChevronRight size={15} />
              </Button>
            </Card>
          </motion.div>

          {/* Card 3: Career Restart Bridge */}
          <motion.div variants={fadeUp}>
            <Card tilt className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: C.sageLight }}>
                    <Doodle.Bottle className="w-7 h-7" style={{ color: C.sageDark }} />
                  </div>
                  <div className="text-right">
                    <p className="ff-display text-2xl font-bold" style={{ color: C.sageDark }}>
                      {capacityHrs} <span className="text-xs font-normal">hrs/wk</span>
                    </p>
                    <p className="ff-body text-[10px]" style={{ color: C.inkSoft }}>Free Capacity</p>
                  </div>
                </div>

                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                  Pillar 03
                </span>
                <h3 className="ff-display text-xl font-bold mb-1" style={{ color: C.ink }}>
                  Career Restart
                </h3>
                <p className="ff-body text-xs leading-relaxed mb-4" style={{ color: C.inkSoft }}>
                  <b>{doneSkillsCount} of {skills.length || 3}</b> weekly micro-refreshes completed towards your Readiness Card.
                </p>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(doneSkillsCount / (skills.length || 3)) * 100}%`,
                      background: C.sage,
                    }}
                  />
                </div>
              </div>

              <Button variant="outline" onClick={() => go("readiness")} className="w-full justify-between">
                <span>Build Restart Plan</span>
                <ChevronRight size={15} />
              </Button>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Wellness & Support Hub */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <Card
            hover
            onClick={() => go("nourishnudge")}
            className="cursor-pointer flex items-center justify-between !p-5 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C.sageLight }}>
                <Doodle.Pot className="w-6 h-6" style={{ color: C.sageDark }} />
              </div>
              <div>
                <p className="ff-display text-base font-bold" style={{ color: C.ink }}>Nourish Nudge</p>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>Gentle, 1-handed nutrition ideas · No calorie tracking</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" style={{ background: C.paperDeep }}>
              <ChevronRight size={15} style={{ color: C.ink }} />
            </div>
          </Card>

          <Card
            hover
            onClick={() => go("carecircle")}
            className="cursor-pointer flex items-center justify-between !p-5 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C.blushLight }}>
                <Doodle.Heart className="w-6 h-6" style={{ color: C.blushDeep }} />
              </div>
              <div>
                <p className="ff-display text-base font-bold" style={{ color: C.ink }}>Care Circle</p>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>Trusted helpers and family on your terms · No public stars</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" style={{ background: C.paperDeep }}>
              <ChevronRight size={15} style={{ color: C.ink }} />
            </div>
          </Card>
        </div>

        {/* Transition Roadmap Thread */}
        <JourneyThread active={recovery ? (doneSkillsCount > 1 ? 2 : 1) : 0} />
      </div>
    </Screen>
  );
}
