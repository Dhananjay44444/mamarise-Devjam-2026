import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Handshake, ArrowLeft, ChevronRight, Sparkles, Shield, Moon, ListTodo } from "lucide-react";
import { C, fadeUp, stagger, shadows } from "../theme";
import { Logo, Screen } from "../ui/chrome";
import { useAppState } from "../state/store";
import { PATHS } from "../routing/paths";

export default function RoleSelect() {
  const navigate = useNavigate();
  const { dispatch } = useAppState();

  const choose = (role) => {
    dispatch({ type: "SET_SELECTED_ROLE", payload: role });
    navigate(role === "mom" ? PATHS.momLogin : PATHS.partnerLogin);
  };

  return (
    <Screen className="py-8">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-12">
          <Logo size={32} />
          <button
            onClick={() => navigate(PATHS.landing)}
            className="ff-body text-xs font-medium flex items-center gap-1 px-3.5 py-2 rounded-xl transition-colors hover:bg-black/5"
            style={{ color: C.inkSoft }}
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="text-center max-w-2xl mx-auto mb-12">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: C.sageLight, border: `1px solid ${C.sage}` }}>
            <Sparkles size={13} style={{ color: C.sageDark }} />
            <span className="ff-body text-xs font-semibold uppercase tracking-wider" style={{ color: C.sageDark }}>
              This space is for both of you
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="ff-display text-4xl sm:text-5xl leading-tight mb-3" style={{ color: C.ink }}>
            Who is stepping in today?
          </motion.h1>
          <motion.p variants={fadeUp} className="ff-body text-base" style={{ color: C.inkSoft }}>
            MamaRise creates a tailored experience for each of you. Choose your door below to enter your workspace.
          </motion.p>
        </motion.div>

        {/* Dual Portal Cards */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid md:grid-cols-2 gap-7">
          {/* Mom Portal */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6, boxShadow: "0 24px 48px -10px rgba(223, 147, 125, 0.25)" }}
            onClick={() => choose("mom")}
            className="group cursor-pointer rounded-3xl p-8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, #FFF9F2 0%, #F5EDE0 100%)",
              border: "1.5px solid rgba(223, 147, 125, 0.4)",
              boxShadow: shadows.md,
            }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Heart size={120} style={{ color: C.blushDeep }} />
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm" style={{ background: C.blushLight }}>
                <Heart size={26} style={{ color: C.blushDeep }} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.blushDeep }}>
                  Calm & Supportive
                </span>
              </div>
              <h2 className="ff-display text-3xl font-bold mb-3" style={{ color: C.ink }}>
                I am a Mom
              </h2>
              <p className="ff-body text-sm leading-relaxed mb-6" style={{ color: C.inkMuted }}>
                A quiet space for you. Track physical recovery without guilt, see a transparent household load split, and build a gentle return-to-work plan at your pace.
              </p>

              <div className="space-y-2 mb-8 text-xs font-medium" style={{ color: C.inkSoft }}>
                <div className="flex items-center gap-2">
                  <Moon size={14} style={{ color: C.sage }} /> 20-second daily recovery triage
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: C.sage }} /> 15-min career refresh microtasks
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} style={{ color: C.sage }} /> Exportable Readiness Card
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
              <span className="ff-body text-xs font-semibold" style={{ color: C.blushDeep }}>
                Step inside as Mom
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" style={{ background: C.blushDeep, color: C.cream }}>
                <ChevronRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Partner Portal */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6, boxShadow: "0 24px 48px -10px rgba(95, 135, 102, 0.25)" }}
            onClick={() => choose("partner")}
            className="group cursor-pointer rounded-3xl p-8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, #F9F5EE 0%, #EDE5D8 100%)",
              border: "1.5px solid rgba(95, 135, 102, 0.4)",
              boxShadow: shadows.md,
            }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Handshake size={120} style={{ color: C.sageDark }} />
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm" style={{ background: C.sageLight }}>
                <Handshake size={26} style={{ color: C.sageDark }} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                  Action-Oriented & Tactical
                </span>
              </div>
              <h2 className="ff-display text-3xl font-bold mb-3" style={{ color: C.ink }}>
                I am a Partner
              </h2>
              <p className="ff-body text-sm leading-relaxed mb-6" style={{ color: C.inkMuted }}>
                A working desk for doing, not guessing. See her real physical capacity today, accept pending chores with one click, and provide genuine support where it matters most.
              </p>

              <div className="space-y-2 mb-8 text-xs font-medium" style={{ color: C.inkSoft }}>
                <div className="flex items-center gap-2">
                  <Moon size={14} style={{ color: C.sage }} /> Real-time Mom capacity status alert
                </div>
                <div className="flex items-center gap-2">
                  <ListTodo size={14} style={{ color: C.sage }} /> 1-Click task acceptance board
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: C.sage }} /> Measurable shared household impact
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
              <span className="ff-body text-xs font-semibold" style={{ color: C.sageDark }}>
                Step inside as Partner
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform" style={{ background: C.sage, color: C.cream }}>
                <ChevronRight size={16} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Screen>
  );
}
