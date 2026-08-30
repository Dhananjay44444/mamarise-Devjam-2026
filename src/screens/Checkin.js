import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Moon, Battery, Heart, ChevronRight, Sparkles } from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar, Chip } from "../ui/chrome";

import { useVoiceCommand } from "../hooks/useVoiceCommand";

export default function Checkin({ recovery, setRecovery, go, onVoiceCommand }) {
  const [f, setF] = useState(
    recovery || { sleepHours: 6, energy: null, pain: null, mood: null, notes: "" }
  );

  const set = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

  const { isListening, startListening, stopListening, liveTranscript, voiceError } = useVoiceCommand();

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Sync spoken notes and extracted parameters into form
  React.useEffect(() => {
    if (liveTranscript) {
      // Auto-extract sleep
      const sleepMatch = liveTranscript.match(/(\d+)\s*(hours?|hrs?)/i);
      if (sleepMatch) set("sleepHours", parseInt(sleepMatch[1], 10));

      // Auto-extract energy
      if (/exhausted|tired|drained|low/i.test(liveTranscript)) set("energy", "Low");
      else if (/good|great|energetic|fine/i.test(liveTranscript)) set("energy", "Good");
      else if (/okay|moderate|alright/i.test(liveTranscript)) set("energy", "Okay");

      // Auto-extract pain
      if (/severe/i.test(liveTranscript)) set("pain", "Severe");
      else if (/moderate/i.test(liveTranscript)) set("pain", "Moderate");
      else if (/mild|sore/i.test(liveTranscript)) set("pain", "Mild");
      else if (/no pain|fine/i.test(liveTranscript)) set("pain", "None");

      // Auto-extract mood
      if (/overwhelmed|sad|low|down/i.test(liveTranscript)) set("mood", "Low");
      else if (/happy|good|great/i.test(liveTranscript)) set("mood", "Good");
      else if (/okay|calm/i.test(liveTranscript)) set("mood", "Okay");

      set("notes", liveTranscript);
    }
  }, [liveTranscript]);

  const canSubmit = f.energy && f.pain && f.mood;

  return (
    <Screen className="pb-16">
      <div className="max-w-xl mx-auto">
        <TopBar
          title="Daily Recovery Triage"
          subtitle="20 seconds to assess rest and strain"
          onBack={() => go("dashboard")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6">
            <h1 className="ff-display text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: C.ink }}>
              How are you feeling, really?
            </h1>
            <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
              No judgment. This data tunes your capacity and recommends tasks to delegate.
            </p>
          </motion.div>

          <Card className="mb-6 space-y-6">
            {/* Sleep slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Moon size={16} style={{ color: C.sage }} />
                  <span className="ff-body text-xs font-semibold uppercase tracking-wider" style={{ color: C.ink }}>
                    Sleep Last Night
                  </span>
                </div>
                <span className="ff-display text-xl font-bold" style={{ color: C.sageDark }}>
                  {f.sleepHours} hours
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={f.sleepHours}
                onChange={(e) => set("sleepHours", +e.target.value)}
                className="w-full cursor-pointer"
                style={{ accentColor: C.sage }}
              />
              <div className="flex justify-between text-[10px] ff-body text-stone-400 mt-1">
                <span>0h (Disrupted)</span>
                <span>6h (Moderate)</span>
                <span>12h (Restorative)</span>
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Battery size={16} style={{ color: C.sage }} />
                <span className="ff-body text-xs font-semibold uppercase tracking-wider" style={{ color: C.ink }}>
                  Physical Energy
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Low", "Okay", "Good"].map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={f.energy === opt}
                    onClick={() => set("energy", opt)}
                  />
                ))}
              </div>
            </div>

            {/* Pain / Discomfort */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Heart size={16} style={{ color: C.blushDeep }} />
                <span className="ff-body text-xs font-semibold uppercase tracking-wider" style={{ color: C.ink }}>
                  Pain / Physical Strain
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["None", "Mild", "Moderate", "Severe"].map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={f.pain === opt}
                    onClick={() => set("pain", opt)}
                  />
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles size={16} style={{ color: C.sageDark }} />
                <span className="ff-body text-xs font-semibold uppercase tracking-wider" style={{ color: C.ink }}>
                  Emotional State
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Low", "Okay", "Good"].map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={f.mood === opt}
                    onClick={() => set("mood", opt)}
                  />
                ))}
              </div>
            </div>

            {/* Voice & Notes */}
            <div className="pt-2 border-t" style={{ borderColor: C.lineLight }}>
              <span className="ff-body text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: C.inkSoft }}>
                Additional Notes (Optional · Speak or Type)
              </span>
              <div className="flex gap-2 items-start">
                <textarea
                  value={f.notes || ""}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={2}
                  placeholder="e.g. Back feels sore after nursing, partner handled 3am bottle..."
                  className="ff-body flex-1 px-4 py-3 rounded-2xl outline-none text-xs"
                  style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                />
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
                  style={{
                    background: isListening ? C.blushDeep : C.sageLight,
                    color: isListening ? C.cream : C.sageDark,
                    border: `1px solid ${isListening ? C.blushDeep : C.sage}`,
                  }}
                  title={isListening ? "Stop listening" : "Speak your notes or check-in"}
                >
                  <Mic size={18} />
                </button>
              </div>
              {isListening && (
                <p className="ff-body text-xs mt-2 animate-pulse font-medium" style={{ color: C.blushDeep }}>
                  Listening gently... speak your sleep, energy, pain, or notes.
                </p>
              )}
              {voiceError && (
                <p className="ff-body text-xs mt-2 font-medium text-rose-700">
                  {voiceError.message}
                </p>
              )}
            </div>
          </Card>

          <Button
            variant="sage"
            size="lg"
            className={`w-full justify-center ${!canSubmit ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => {
              setRecovery(f);
              go("checkinresult");
            }}
          >
            <span>See My Recovery Result</span>
            <ChevronRight size={16} />
          </Button>
        </motion.div>
      </div>
    </Screen>
  );
}
