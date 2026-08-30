import React from "react";
import { motion } from "framer-motion";
import { Shield, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar } from "../ui/chrome";

export default function SafetyWall({ go }) {
  const steps = [
    { title: "Your Input", desc: "Sleep, energy, pain, mood" },
    { title: "Deterministic Rules", desc: "Auditable clinical thresholds" },
    { title: "Triage Classification", desc: "Stable / Monitor / Urgent" },
    { title: "Empathy Translation", desc: "AI phrases with gentle tone" },
    { title: "Safe Action Step", desc: "Non-prescriptive next steps" },
  ];

  return (
    <Screen className="pb-16">
      <div className="max-w-2xl mx-auto">
        <TopBar
          title="Safety Architecture"
          subtitle="How MamaRise guarantees clinical and emotional safety"
          onBack={() => go("dashboard")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: C.sageLight }}>
              <Shield size={28} style={{ color: C.sageDark }} />
            </div>
            <div>
              <h1 className="ff-display text-3xl md:text-4xl font-bold tracking-tight" style={{ color: C.ink }}>
                Suggest. Reflect. Never Diagnose.
              </h1>
              <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                Our non-negotiable architectural guardrails.
              </p>
            </div>
          </motion.div>

          {/* Core Safety Standard Card */}
          <motion.div variants={fadeUp}>
            <Card className="mb-6">
              <p className="ff-display text-lg font-bold mb-3" style={{ color: C.ink }}>
                The Deterministic Rule Boundary
              </p>
              <p className="ff-body text-sm leading-relaxed mb-4" style={{ color: C.inkSoft }}>
                MamaRise is not a diagnostic device. Every recovery triage score is calculated by a strict, audited deterministic rule engine — never by speculative AI generation.
              </p>
              <p className="ff-body text-sm leading-relaxed" style={{ color: C.inkSoft }}>
                AI is only ever used as a supportive copywriter to phrase established results with warmth, empathy, and cultural respect.
              </p>
            </Card>
          </motion.div>

          {/* Pipeline Visual Steps */}
          <motion.div variants={fadeUp} className="mb-6">
            <p className="ff-body text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.sageDark }}>
              Data Pipeline & Safety Architecture
            </p>

            <div className="space-y-2.5">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  className="p-3.5 rounded-2xl flex items-center justify-between gap-3 glass-panel"
                  style={{ border: `1px solid ${C.lineLight}` }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: C.sageLight, color: C.sageDark }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="ff-display text-sm font-bold" style={{ color: C.ink }}>{s.title}</p>
                      <p className="ff-body text-[11px]" style={{ color: C.inkSoft }}>{s.desc}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && <ChevronRight size={14} className="text-stone-400" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Non-Negotiable Guarantees */}
          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl" style={{ background: C.paperDeep, border: `1px solid ${C.lineLight}` }}>
              <CheckCircle2 size={18} style={{ color: C.sage }} className="mb-2" />
              <p className="ff-display text-sm font-bold mb-1" style={{ color: C.ink }}>Zero Shame Notification Policy</p>
              <p className="ff-body text-xs leading-relaxed" style={{ color: C.inkSoft }}>
                No streaks, no guilt-based alerts, and no punitive reminders if you skip checking in.
              </p>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: C.paperDeep, border: `1px solid ${C.lineLight}` }}>
              <Lock size={18} style={{ color: C.blushDeep }} className="mb-2" />
              <p className="ff-display text-sm font-bold mb-1" style={{ color: C.ink }}>Privacy & Local Sovereignty</p>
              <p className="ff-body text-xs leading-relaxed" style={{ color: C.inkSoft }}>
                All household and recovery data stays strictly under your and your partner's control.
              </p>
            </div>
          </motion.div>

          <Button variant="sage" size="md" onClick={() => go("dashboard")} className="w-full justify-center">
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
