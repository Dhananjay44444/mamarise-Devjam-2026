import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { C } from "../theme";
import { Screen, Button, TopBar, Chip } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";

export default function Onboarding({ user, setUser, go }) {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      go("dashboard");
    }
  };

  const sideIcons = [Doodle.MoonRest, Doodle.Bottle, Doodle.Heart, Doodle.Laundry];
  const sideTitles = [
    "Recovery Timeline",
    "Pacing Your Return",
    "Realistic Availability",
    "Equitable Collaboration",
  ];
  const sideDescriptions = [
    "Your postpartum recovery timeline shapes your daily energy expectations and triage recommendations.",
    "Whether you're returning in weeks or taking a deliberate break, we build goals around your terms.",
    "We plan around real micro-windows of free time (15-20 minutes), not unachievable blocks.",
    "Connecting your partner creates an automatic action desk so domestic tasks are shared, not debated.",
  ];

  const SideIcon = sideIcons[step];

  return (
    <Screen className="pb-16">
      <div className="max-w-3xl mx-auto">
        <TopBar
          title={`Step ${step + 1} of 4`}
          subtitle="Setting up your personalized MamaRise pace"
          onBack={() => (step === 0 ? go("landing") : setStep(step - 1))}
          role="mom"
        />

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full flex-1 transition-all duration-500"
              style={{
                background: i <= step ? C.sage : C.paperDeep,
              }}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                      Phase 1: Timeline
                    </span>
                    <h2 className="ff-display text-3xl font-bold" style={{ color: C.ink }}>
                      When did you give birth?
                    </h2>
                    <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
                      Helps us calibrate postpartum healing phases and recovery pacing.
                    </p>
                    <input
                      type="date"
                      className="ff-body w-full px-4 py-3.5 rounded-2xl outline-none"
                      style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                      onChange={(e) => setUser({ ...user, postpartumDate: e.target.value })}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                      Phase 2: Transition Goals
                    </span>
                    <h2 className="ff-display text-3xl font-bold" style={{ color: C.ink }}>
                      What is your current work situation?
                    </h2>
                    <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
                      We tailor your micro-refreshes to match where you want to go.
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {[
                        "Planning to return to work soon",
                        "Currently on active maternity leave",
                        "Taking an intentional career break",
                        "Exploring new opportunities or freelancing",
                      ].map((o) => (
                        <button
                          key={o}
                          onClick={() => setUser({ ...user, workStatus: o })}
                          className={`p-3.5 rounded-2xl text-left ff-body text-sm font-medium transition-all ${user.workStatus === o ? "shadow-sm" : ""
                            }`}
                          style={{
                            background: user.workStatus === o ? C.sageLight : C.paperDeep,
                            color: user.workStatus === o ? C.sageDark : C.ink,
                            border: `1.5px solid ${user.workStatus === o ? C.sage : "transparent"}`,
                          }}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                      Phase 3: Availability
                    </span>
                    <h2 className="ff-display text-3xl font-bold" style={{ color: C.ink }}>
                      Your typical weekly availability?
                    </h2>
                    <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
                      Be realistic — 15 mindful minutes is worth more than 2 stressed hours.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {["Very Limited (15-30 min/day)", "Limited (1 hr/day)", "Moderate (2-3 hrs/day)", "Flexible"].map((o) => (
                        <Chip
                          key={o}
                          label={o}
                          selected={user.availability === o}
                          onClick={() => setUser({ ...user, availability: o })}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                      Phase 4: Co-Parenting
                    </span>
                    <h2 className="ff-display text-3xl font-bold" style={{ color: C.ink }}>
                      Connect partner for shared task tracking?
                    </h2>
                    <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
                      They receive a dedicated Partner Desk without needing to ask you what to do.
                    </p>
                    <div className="flex gap-3">
                      <Chip
                        label="Yes, connect partner"
                        selected={user.partner === true}
                        onClick={() => setUser({ ...user, partner: true })}
                      />
                      <Chip
                        label="I'll connect later"
                        selected={user.partner === false}
                        onClick={() => setUser({ ...user, partner: false })}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <Button variant="sage" size="lg" onClick={next} className="w-full justify-center">
                <span>{step === 3 ? "Enter MamaRise Space" : "Continue to Next Step"}</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          <div className="hidden md:block md:col-span-5">
            <motion.div
              key={step + "-preview"}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl text-center glass-panel"
              style={{ border: `1.5px solid ${C.lineLight}`, boxShadow: C.shadows?.sm }}
            >
              <div className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: C.sageLight }}>
                <SideIcon className="w-8 h-8" style={{ color: C.sageDark }} />
              </div>
              <h3 className="ff-display text-xl font-bold mb-2" style={{ color: C.ink }}>
                {sideTitles[step]}
              </h3>
              <p className="ff-body text-xs leading-relaxed" style={{ color: C.inkSoft }}>
                {sideDescriptions[step]}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
