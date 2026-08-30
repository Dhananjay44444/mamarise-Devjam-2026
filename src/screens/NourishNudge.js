import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Send,
} from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar, Chip } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";
import { fetchNutritionSuggestions, askNutritionAi } from "../services/dataService";

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

const QUICK_PROMPTS = [
  { label: "2-Min Nursing Fuel", DoodleIcon: Doodle.Bottle, query: "Quick 2-minute 1-handed snack while nursing baby at night" },
  { label: "Calming Rest Tonic", DoodleIcon: Doodle.MoonRest, query: "Warm calming drink for postpartum exhaustion before sleep" },
  { label: "Gentle Iron Boost", DoodleIcon: Doodle.Heart, query: "Easy vegetarian iron foods that are gentle on postpartum digestion" },
  { label: "Lactation Hydration", DoodleIcon: Doodle.Pot, query: "Hydrating drinks to support breast milk supply without sugar" },
];

export default function NourishNudge({ recovery, go }) {
  const level = recovery ? capacityLabel(recovery) : "Moderate";
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  // Custom AI Question state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

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
    });

    return () => {
      isMounted = false;
    };
  }, [recovery]);

  const handleAskAi = async (customQuery) => {
    const queryToUse = customQuery || aiQuestion;
    if (!queryToUse.trim()) return;

    setIsAskingAi(true);
    try {
      const res = await askNutritionAi(queryToUse, recovery);
      if (res) {
        setAiResponse(res);
      }
    } catch (err) {
      console.warn("Failed to get AI answer:", err);
    } finally {
      setIsAskingAi(false);
    }
  };

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
          {/* Header Banner */}
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.sageLight }}>
              <Doodle.Pot className="w-8 h-8" style={{ color: C.sageDark }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="ff-display text-3xl font-bold tracking-tight" style={{ color: C.ink }}>
                  Gentle Nutrition, Zero Guilt.
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Sparkles size={11} /> Gemini AI Tuned
                </span>
              </div>
              <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                Postpartum recovery fuel calibrated to your recovery state ({level.toLowerCase()} capacity).
              </p>
            </div>
          </motion.div>

          {/* AI Recovery Context Callout Banner */}
          <motion.div variants={fadeUp} className="mb-6">
            <div
              className="p-4 rounded-2xl text-xs space-y-1.5 border"
              style={{ background: "rgba(255, 252, 247, 0.95)", borderColor: C.lineLight }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-stone-900">Your Recovery Signals:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-mono text-[11px] border border-stone-200">
                  Sleep: {recovery?.sleepHours || 6}h
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-medium text-[11px] border border-stone-200">
                  Energy: {recovery?.energy || "Okay"}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-medium text-[11px] border border-stone-200">
                  Strain: {recovery?.pain || "None"}
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Gemini AI Recommendation: Focus on warm, mineral-rich cellular hydration and 1-handed healthy fats that protect deep rest and tissue repair without digestive strain.
              </p>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SECTION: Interactive "Ask Gemini Nutrition AI" */}
          {/* ========================================================================= */}
          <motion.div variants={fadeUp} className="mb-6">
            <Card className="!p-5 border-emerald-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-emerald-700" />
                <h3 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                  Ask Gemini for Gentle Fuel Ideas
                </h3>
              </div>
              <p className="ff-body text-xs text-stone-500 mb-3">
                Have a craving, low energy, or limited ingredients? Ask for quick 1-handed recovery ideas.
              </p>

              {/* Quick Prompt Chips with SVG Doodles */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {QUICK_PROMPTS.map((p) => {
                  const IconC = p.DoodleIcon;
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setAiQuestion(p.query);
                        handleAskAi(p.query);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 transition-colors font-medium border border-stone-200 text-stone-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <IconC className="w-3.5 h-3.5" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input & Ask Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g. What's an instant snack for 3 AM nursing?"
                  className="ff-body flex-1 px-3.5 py-2.5 rounded-xl text-xs outline-none bg-white border border-stone-300 focus:border-emerald-600 transition-colors"
                />
                <Button
                  type="submit"
                  variant="sage"
                  size="sm"
                  disabled={isAskingAi || !aiQuestion.trim()}
                  className="shrink-0"
                >
                  <Send size={13} /> {isAskingAi ? "Thinking..." : "Ask AI"}
                </Button>
              </form>

              {/* AI Answer Box */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-950 text-sm">{aiResponse.title}</span>
                        {aiResponse.prepTime && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono">
                            Prep: {aiResponse.prepTime}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                        Zero-Guilt Recipe
                      </span>
                    </div>

                    <p className="text-stone-700 leading-relaxed font-medium">
                      {aiResponse.recommendation}
                    </p>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200/60 text-stone-800 space-y-1">
                      <p className="font-bold text-emerald-900">Quick 1-Handed Prep:</p>
                      <p className="leading-relaxed">{aiResponse.quickRecipe}</p>
                    </div>

                    {aiResponse.healingBenefit && (
                      <p className="text-[11px] text-stone-600">
                        <b className="text-stone-800">Healing Benefit:</b> {aiResponse.healingBenefit}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* ========================================================================= */}
          {/* SECTION: 4 Curated Nutrition Pillars */}
          {/* ========================================================================= */}
          <motion.div variants={fadeUp} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="ff-body text-xs font-bold uppercase tracking-wider text-stone-600">
                Explore Recovery Food Pillars
              </span>
              <span className="ff-body text-xs text-stone-500">Zero Calorie Counting</span>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
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
            </div>

            {/* Suggestion Card */}
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
                    className="ff-body text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
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
                    className="ff-body text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
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
