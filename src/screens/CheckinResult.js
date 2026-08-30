import React from "react";
import { motion } from "framer-motion";
import { Moon, Battery, Heart, ChevronRight } from "lucide-react";
import { C, fadeUp, stagger, shadows } from "../theme";
import { Screen, Card, Button, TopBar } from "../ui/chrome";
import { useAppState } from "../state/store";

function getTriage({ sleepHours, energy, pain, mood }) {
  if (pain === "Severe" || (mood === "Low" && energy === "Low" && sleepHours < 3)) return "URGENT";
  if (energy === "Low" || sleepHours < 5 || pain === "Moderate") return "MONITOR";
  return "STABLE";
}

const TRIAGE_COPY = {
  URGENT: {
    label: "Contact a healthcare professional",
    badge: "Clinical Check Recommended",
    note: "What you're describing is worth talking through with a doctor soon — not because anything is wrong with you, but because you deserve active medical support today.",
    color: C.blushDeep,
    bg: C.blushSoft,
  },
  MONITOR: {
    label: "Monitor & Protect Rest",
    badge: "Rest Protocol Active",
    note: "You are carrying high physical fatigue today. We recommend reducing non-essential chores and transferring night wakings or heavy tasks to your partner.",
    color: "#875C1C",
    bg: C.goldLight,
  },
  STABLE: {
    label: "Feeling Steady",
    badge: "Steady Recovery",
    note: "You're pacing well today. This is a great moment to protect this energy — and explore gentle 15-minute skill refreshes if you feel ready.",
    color: C.sageDark,
    bg: C.sageSoft,
  },
};

function capacityLabel({ sleepHours, energy }) {
  if (energy === "Low" || sleepHours < 5) return "Low (~3 hrs)";
  if (energy === "Okay") return "Moderate (~6 hrs)";
  return "Good (~9 hrs)";
}

export default function CheckinResult({ recovery: propRecovery, go }) {
  const { state } = useAppState();
  const recovery = state.recovery || propRecovery;

  if (!recovery) {
    go("dashboard");
    return null;
  }

  const triage = getTriage(recovery);
  const copy = TRIAGE_COPY[triage];
  const cap = capacityLabel(recovery);

  return (
    <Screen className="pb-16">
      <div className="max-w-xl mx-auto">
        <TopBar
          title="Triage Result"
          subtitle="Interpreted through clinical recovery logic"
          onBack={() => go("dashboard")}
          onSafety={() => go("safetywall")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          {/* Vitals Ribbon */}
          <motion.div variants={fadeUp}>
            <Card className="mb-6">
              <p className="ff-body text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.inkSoft }}>
                Today's Vitals Snapshot
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-2xl" style={{ background: C.paperDeep }}>
                  <Moon size={18} className="mx-auto mb-1.5" style={{ color: C.sage }} />
                  <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>{recovery.sleepHours}h</p>
                  <p className="ff-body text-[11px]" style={{ color: C.inkSoft }}>Sleep</p>
                </div>
                <div className="p-3 rounded-2xl" style={{ background: C.paperDeep }}>
                  <Battery size={18} className="mx-auto mb-1.5" style={{ color: C.sage }} />
                  <p className="ff-display text-2xl font-bold" style={{ color: C.ink }}>{recovery.energy}</p>
                  <p className="ff-body text-[11px]" style={{ color: C.inkSoft }}>Energy</p>
                </div>
                <div className="p-3 rounded-2xl" style={{ background: C.paperDeep }}>
                  <Heart size={18} className="mx-auto mb-1.5" style={{ color: C.sage }} />
                  <p className="ff-display text-lg font-bold" style={{ color: C.ink }}>{cap}</p>
                  <p className="ff-body text-[11px]" style={{ color: C.inkSoft }}>Capacity</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Triage Guidance Card */}
          <motion.div variants={fadeUp}>
            <div
              className="p-6 md:p-8 rounded-3xl mb-6 relative overflow-hidden"
              style={{
                background: copy.bg,
                border: `1.5px solid ${copy.color}`,
                boxShadow: shadows.md,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: copy.color }}>
                  {copy.label}
                </span>
                <span className="ff-body text-xs px-2.5 py-0.5 rounded-full font-semibold bg-white/60" style={{ color: copy.color }}>
                  {copy.badge}
                </span>
              </div>
              <p className="ff-display text-xl md:text-2xl font-bold leading-snug mb-4" style={{ color: C.ink }}>
                {copy.note}
              </p>
              <p className="ff-body text-xs opacity-75" style={{ color: C.inkMuted }}>
                Every recovery threshold is deterministic and non-diagnostic. AI is only used to phrase results with empathy.
              </p>
            </div>
          </motion.div>

          {/* Next Steps CTA */}
          <motion.div variants={fadeUp} className="space-y-3">
            <Button variant="sage" size="lg" onClick={() => go("loadmirror")} className="w-full justify-between">
              <span>See Tasks You Can Rebalance Today</span>
              <ChevronRight size={16} />
            </Button>
            <Button variant="outline" size="md" onClick={() => go("dashboard")} className="w-full justify-center">
              Return to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Screen>
  );
}
