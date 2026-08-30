import React from "react";
import { motion } from "framer-motion";
import { Share2, Award, CheckCircle2, Shield } from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Button, TopBar } from "../ui/chrome";

function capacityLabel(recovery) {
  if (!recovery) return "Pending";
  if (recovery.energy === "Low" || recovery.sleepHours < 5) return "Low Capacity";
  if (recovery.energy === "Okay") return "Moderate Capacity";
  return "Steady Capacity";
}

export default function ReadinessCard({ user, recovery, skills = [], go }) {
  const doneSkills = skills.filter((s) => s.done);
  const nextSkill = skills.find((s) => !s.done);

  return (
    <Screen className="pb-16">
      <div className="max-w-md mx-auto">
        <TopBar
          title="Readiness Credential"
          subtitle="Verifiable maternity transition evidence"
          onBack={() => go("dashboard")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          {/* 3D Glass Credential Card */}
          <motion.div
            variants={fadeUp}
            whileHover={{ rotateY: 3, rotateX: -3 }}
            className="mb-8 rounded-3xl p-7 md:p-8 relative overflow-hidden transition-transform duration-300"
            style={{
              background: "linear-gradient(145deg, #2B2620 0%, #171512 100%)",
              border: "1.5px solid rgba(212, 163, 89, 0.4)",
              boxShadow: "0 28px 56px -12px rgba(0, 0, 0, 0.55)",
              color: C.cream,
            }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Award size={140} style={{ color: C.goldLight }} />
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="ff-body text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  MamaRise Verified Credential
                </span>
              </div>
              <Shield size={16} className="text-stone-400" />
            </div>

            <h1 className="ff-display text-3xl font-bold text-white mb-1">
              {user.name || "Aisha Sharma"}
            </h1>
            <p className="ff-body text-xs text-stone-400 mb-6">
              Maternity & Career Transition Portfolio
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 mb-0.5">Readiness Status</p>
                <p className="ff-display font-semibold text-emerald-300">Active Transition</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 mb-0.5">Paced Capacity</p>
                <p className="ff-display font-semibold text-white">~16 hrs / week</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 mb-0.5">Recovery Triage</p>
                <p className="ff-display font-semibold text-white">{capacityLabel(recovery)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 mb-0.5">Domestic Load</p>
                <p className="ff-display font-semibold text-white">Equitably Shared</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-2">Skills Refreshed & Practiced</p>
              <div className="flex flex-wrap gap-2">
                {doneSkills.length ? (
                  doneSkills.map((s) => (
                    <span key={s.day} className="ff-body text-xs px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                      <CheckCircle2 size={11} /> {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-stone-400">Complete weekly microtasks to unlock skill badges.</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span>Next Goal: {nextSkill ? nextSkill.name : "All goals met"}</span>
              <span className="text-[10px] font-mono opacity-60">ID: MR-{Date.now().toString().slice(-6)}</span>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={fadeUp} className="space-y-3">
            <Button variant="sage" size="lg" onClick={() => go("shareexport")} className="w-full justify-center">
              <Share2 size={16} /> Share or Download PDF
            </Button>
            <Button variant="outline" size="md" onClick={() => go("readiness")} className="w-full justify-center">
              Back to Restart Tasks
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Screen>
  );
}
