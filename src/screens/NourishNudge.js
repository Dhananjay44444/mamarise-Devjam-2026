import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, ChevronRight, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar, Chip } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";
import { fetchNutritionSuggestions } from "../services/dataService";

function capacityLabel(recovery) {
  if (!recovery) return "Moderate";
  if (recovery.energy === "Low" || recovery.sleepHours < 5) return "Low";
  if (recovery.energy === "Okay") return "Moderate";
  return "Good";
}

const DEFAULT_CATEGORIES = {
  "Energy": {
    icon: Doodle.Bottle,
    items: [
      "A handful of soaked almonds and a banana keeps postpartum blood sugar steadier than tea alone.",
      "Small, frequent bites beat three big heavy meals when energy is depleted.",
      "Jaggery with roasted peanuts (Chikki) is a fast, iron-rich, no-cook energy fix.",
    ],
  },
  "Iron & Recovery": {
    icon: Doodle.Heart,
    items: [
      "Moong dal with a generous squeeze of fresh lemon helps iron absorb 3x better.",
      "Black raisins soaked overnight support hemoglobin and gentle digestion.",
      "Spiced bone broth or golden lentil soup with ghee replenishes postpartum blood volume losses.",
    ],
  },
  "Hydration": {
    icon: Doodle.MoonRest,
    items: [
      "Keep a full thermal bottle within arm's reach of wherever you nurse or feed.",
      "Warm thermal water with a pinch of Himalayan salt and lemon accelerates cellular fluid replenishment.",
      "Drink a full glass of water before each feeding session as an automatic anchor habit.",
    ],
  },
  "1-Pot Quick Meals": {
    icon: Doodle.Pot,
    items: [
      "Oat, flaxseed & tahini energy clusters support prolactin balance without sudden blood sugar spikes.",
      "Moong Dal Khichdi with a dollop of ghee — single pot, minimal chopping, soothing on the gut.",
      "Curd rice with a pinch of roasted cumin and ginger, ready in four minutes flat.",
    ],
  },
};

export default function NourishNudge({ recovery, go }) {
  const level = recovery ? capacityLabel(recovery) : "Moderate";
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isGeminiEnhanced, setIsGeminiEnhanced] = useState(false);

  // Fetch live Gemini AI suggestions from FastAPI backend
  useEffect(() => {
    let isMounted = true;
    fetchNutritionSuggestions(recovery).then((geminiList) => {
      if (!isMounted || !geminiList || !geminiList.length) return;

      const updated = { ...DEFAULT_CATEGORIES };

      geminiList.forEach((s) => {
        if (s.pillar === "hydration") {
          updated["Hydration"] = {
            ...updated["Hydration"],
            items: [
              `${s.title}: ${s.rationale} (${s.action_tip})`,
              ...DEFAULT_CATEGORIES["Hydration"].items,
            ],
          };
        } else if (s.pillar === "iron_recovery") {
          updated["Iron & Recovery"] = {
            ...updated["Iron & Recovery"],
            items: [
              `${s.title}: ${s.rationale} (${s.action_tip})`,
              ...DEFAULT_CATEGORIES["Iron & Recovery"].items,
            ],
          };
        } else if (s.pillar === "nursing_snacks") {
          updated["1-Pot Quick Meals"] = {
            ...updated["1-Pot Quick Meals"],
            items: [
              `${s.title}: ${s.rationale} (${s.action_tip})`,
              ...DEFAULT_CATEGORIES["1-Pot Quick Meals"].items,
            ],
          };
        } else if (s.pillar === "calming_tonics") {
          updated["Energy"] = {
            ...updated["Energy"],
            items: [
              `${s.title}: ${s.rationale} (${s.action_tip})`,
              ...DEFAULT_CATEGORIES["Energy"].items,
            ],
          };
        }
      });

      setCategories(updated);
      setIsGeminiEnhanced(true);
    });

    return () => {
      isMounted = false;
    };
  }, [recovery]);

  const catKeys = Object.keys(categories);
  const [cat, setCat] = useState(catKeys[0]);
  const [idx, setIdx] = useState(0);
  const [glasses, setGlasses] = useState(3);
  const [feedback, setFeedback] = useState(null);

  const current = categories[cat] || DEFAULT_CATEGORIES[catKeys[0]];
  const CatIcon = current.icon;

  return (
    <Screen className="pb-16">
      <div className="max-w-2xl mx-auto">
        <TopBar
          title="Nourish Nudge"
          subtitle="Gentle postpartum nutrition awareness without calorie counting"
          onBack={() => go("dashboard")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.sageLight }}>
              <Doodle.Pot className="w-8 h-8" style={{ color: C.sageDark }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="ff-display text-3xl font-bold tracking-tight" style={{ color: C.ink }}>
                  Gentle Nutrition, Zero Guilt.
                </h1>
                {isGeminiEnhanced && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Sparkles size={11} /> Gemini AI Tuned
                  </span>
                )}
              </div>
              <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                Tuned to today's recovery state ({level.toLowerCase()} capacity). Pick a category for gentle ideas.
              </p>
            </div>
          </motion.div>

          {/* Category Chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
            {catKeys.map((k) => (
              <Chip
                key={k}
                label={k}
                selected={cat === k}
                onClick={() => {
                  setCat(k);
                  setIdx(0);
                  setFeedback(null);
                }}
              />
            ))}
          </motion.div>

          {/* Suggestion Card */}
          <motion.div variants={fadeUp}>
            <Card className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CatIcon className="w-5 h-5" style={{ color: C.sage }} />
                <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sage }}>
                  {cat} Suggestion
                </span>
              </div>

              <p className="ff-display text-xl leading-snug mb-6" style={{ color: C.ink }}>
                "{current.items[idx % current.items.length]}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t" style={{ borderColor: C.lineLight }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIdx((idx + 1) % current.items.length);
                    setFeedback(null);
                  }}
                >
                  <span>Show Another Idea</span>
                  <ChevronRight size={14} />
                </Button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedback("up")}
                    className="ff-body text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                    style={{
                      background: feedback === "up" ? C.sageLight : "transparent",
                      border: `1px solid ${feedback === "up" ? C.sage : C.line}`,
                      color: feedback === "up" ? C.sageDark : C.inkSoft,
                    }}
                  >
                    <ThumbsUp size={12} /> Helpful
                  </button>
                  <button
                    onClick={() => setFeedback("down")}
                    className="ff-body text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                    style={{
                      background: feedback === "down" ? C.blushLight : "transparent",
                      border: `1px solid ${feedback === "down" ? C.blush : C.line}`,
                      color: feedback === "down" ? C.blushDeep : C.inkSoft,
                    }}
                  >
                    <ThumbsDown size={12} /> Not today
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Hydration Tracker */}
          <motion.div variants={fadeUp}>
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets size={16} style={{ color: C.sage }} />
                  <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                    Hydration Pacing (Today Only)
                  </span>
                </div>
                <span className="ff-display font-semibold text-sm" style={{ color: C.ink }}>
                  {glasses} of 8 glasses
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mb-3 py-2 px-3 rounded-2xl bg-white/60">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
                    className="flex flex-col items-center gap-1 cursor-pointer p-1"
                  >
                    <svg viewBox="0 0 24 32" style={{ width: 22, height: 28 }}>
                      <path
                        d="M5 4 L19 4 L17 28 L7 28 Z"
                        fill={i < glasses ? C.sage : C.paperDeep}
                        stroke={C.line}
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[9px] font-mono text-stone-400">{i + 1}</span>
                  </motion.button>
                ))}
              </div>

              <p className="ff-body text-xs text-stone-500 text-center">
                Tap glass to fill · Resets automatically tomorrow without saving historical pressure.
              </p>
            </Card>
          </motion.div>

          <p className="ff-body text-xs text-center leading-relaxed" style={{ color: C.inkSoft }}>
            No calorie counters. No dietary restrictions. Just gentle reminders to nourish yourself.
          </p>
        </motion.div>
      </div>
    </Screen>
  );
}
