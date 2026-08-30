// dataService.js
// Client API layer communicating with FastAPI Python Backend (with offline resilience)

const API_BASE = "http://localhost:8000/api/v1";

/**
 * Fetches AI-powered nutrition suggestions from Gemini via the FastAPI backend
 */
export async function fetchNutritionSuggestions(recovery = {}) {
  try {
    const res = await fetch(`${API_BASE}/nutrition/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase: "Week 8 Postpartum",
        current_energy: recovery.energy || "Low",
        sleep_hours: recovery.sleepHours || 5.0,
        dietary_preference: "General",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.suggestions)) {
        return data.suggestions;
      }
    }
  } catch (err) {
    console.warn("[API] Backend nutrition request failed, using local fallback", err);
  }

  // Local fallback if backend is offline
  return [
    {
      pillar: "hydration",
      pillar_title: "Hydration & Electrolytes",
      title: "Warm Thermal Water with Himalayan Salt & Lemon",
      rationale: "Breastfeeding draws 700ml+ daily fluids; cellular hydration requires trace minerals over plain cold water.",
      action_tip: "Keep an insulated 1L bottle on your nightstand at 45°C with a pinch of sea salt.",
      timing: "Morning & Night Shift",
      quick_prep_mins: 2,
    },
    {
      pillar: "iron_recovery",
      pillar_title: "Iron & Tissue Recovery",
      title: "Spiced Bone Broth or Golden Lentil Soup with Ghee",
      rationale: "Replenishes postpartum blood volume losses and provides bioavailable collagen for pelvic healing.",
      action_tip: "Add 1 tsp of grass-fed ghee and crushed cumin to warm broth in a mug.",
      timing: "Afternoon Shift",
      quick_prep_mins: 5,
    },
    {
      pillar: "nursing_snacks",
      pillar_title: "1-Handed Nursing Snacks",
      title: "Oat, Flaxseed & Tahini Energy Clusters",
      rationale: "Beta-glucans and plant lignans support prolactin balance without sudden blood sugar spikes.",
      action_tip: "Roll oats, honey, tahini, and crushed chia into 1-inch bite balls; store in bedside jar.",
      timing: "Nursing Block",
      quick_prep_mins: 10,
    },
    {
      pillar: "calming_tonics",
      pillar_title: "Nervous System Reset",
      title: "Warm Chamomile & Magnesium Night Elixir",
      rationale: "Down-regulates high cortisol surges during fragmented 3 AM newborn wakings.",
      action_tip: "Steep pure chamomile flowers with warm oat milk and a dash of nutmeg.",
      timing: "30 Mins Before Sleep",
      quick_prep_mins: 3,
    },
  ];
}

/**
 * Interactive Q&A for postpartum gentle nutrition with zero diet culture or calorie counting
 */
export async function askNutritionAi(question = "", recovery = {}) {
  try {
    const res = await fetch(`${API_BASE}/nutrition/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        recovery,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success" && data.result) {
        return data.result;
      }
    }
  } catch (err) {
    console.warn("[API] Backend ask nutrition request failed, using local AI fallback", err);
  }

  // Local fallback response
  return {
    title: "Warm Tahini, Banana & Crushed Almond Fuel",
    recommendation: "When fatigue is high, combining natural potassium from fruit with plant lipids prevents sudden blood sugar crashes during feeding shifts.",
    quickRecipe: "Slice 1 banana, drizzle 1 tablespoon warm tahini or peanut butter, and top with soaked almonds.",
    healingBenefit: "Delivers instant bioavailable magnesium and healthy fats for cellular repair in 90 seconds.",
    prepTime: "2 mins",
  };
}

/**
 * Sends spoken voice transcript to Gemini AI backend for calm empathetic reply and intent extraction
 */
export async function sendVoiceCommandToBackend(transcript, currentRole = "mom", userContext = {}) {
  try {
    const res = await fetch(`${API_BASE}/voice/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        current_role: currentRole,
        user_context: userContext,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[API] Backend voice request failed, using local parser", err);
  }
  return null;
}

/**
 * Evaluates recovery state against deterministic clinical safety rule engine
 */
export async function evaluateTriageRuleEngine(recovery = {}) {
  try {
    const res = await fetch(`${API_BASE}/triage/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sleep_hours: recovery.sleepHours || 6.0,
        energy: recovery.energy || "Okay",
        pain: recovery.pain || "None",
        mood: recovery.mood || "Okay",
        notes: recovery.notes || "",
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[API] Backend triage request failed, using local safety logic", err);
  }
  return null;
}

/**
 * Fetches AI-powered household rebalance suggestions from Gemini via the FastAPI backend
 */
export async function fetchAiRebalanceSuggestions(
  recovery = {},
  chores = [],
  choreSplit = { me: 75, partner: 25 },
  partnerName = "Partner"
) {
  try {
    const res = await fetch(`${API_BASE}/tasks/rebalance-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recovery,
        chores,
        choreSplit,
        partnerName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        return data.suggestions;
      }
    }
  } catch (err) {
    console.warn("[API] Backend rebalance suggestion request failed, using local AI fallback", err);
  }

  // Local intelligent fallback based on Mom's actual recovery numbers
  const sleepHours = recovery.sleepHours ?? 6;
  const energy = recovery.energy || "Okay";
  const pain = recovery.pain || "None";
  const isHighStrain = sleepHours < 5 || energy === "Low" || pain === "Severe" || pain === "Moderate";

  return [
    {
      id: "rebal-night-01",
      name: "Night Wake-Up & Feeding Assist Shift",
      desc: `Transfers 3 AM diaper and burping duty to ${partnerName}`,
      aiRationale: `Because you logged ${sleepHours}h sleep and ${energy} energy, having ${partnerName} cover the 3 AM wake-up protects 90 continuous minutes of restorative REM sleep.`,
      category: "Night Care",
      estMins: 45,
      urgency: isHighStrain ? "Urgent" : "High Priority",
      impactBadge: "Sleep Restoration",
    },
    {
      id: "rebal-cook-02",
      name: "Evening Warm Dinner & Khichdi Prep",
      desc: `Transfers standing kitchen cooking duties to ${partnerName}`,
      aiRationale: "Eliminates 40 minutes of continuous standing in the kitchen, relieving pelvic floor pressure and lower lumbar strain.",
      category: "Cooking",
      estMins: 40,
      urgency: pain !== "None" ? "High Priority" : "Recommended",
      impactBadge: "Spinal Relief",
    },
    {
      id: "rebal-errand-03",
      name: "Grocery & Pharmacy Errand Run",
      desc: "Offloads external errands and heavy grocery bags",
      aiRationale: "Prevents heavy lifting and driving fatigue, allowing you to stay resting in comfortable clothing at home.",
      category: "Errands",
      estMins: 35,
      urgency: "Recommended",
      impactBadge: "Errand Offload",
    },
    {
      id: "rebal-laundry-04",
      name: "Laundry Wash, Fold & Put Away",
      desc: "Transfers heavy basket carrying and repetitive bending",
      aiRationale: `Repetitive bending over laundry baskets stresses the lumbar spine. Handing this to ${partnerName} saves 30 minutes of physical exertion.`,
      category: "Cleaning",
      estMins: 30,
      urgency: pain !== "None" ? "High Priority" : "Recommended",
      impactBadge: "Spinal Relief",
    },
    {
      id: "rebal-bottles-05",
      name: "Sanitize Pump Parts & Bottles",
      desc: "Handles evening sterilizer run and bottle prep",
      aiRationale: "Ensures all clean feeding gear is ready beside your bed before the night shift without you having to wash at midnight.",
      category: "Baby Care",
      estMins: 20,
      urgency: "Recommended",
      impactBadge: "Fatigue Reduction",
    },
  ];
}

export async function fetchVideoRecommendations() {
  return Promise.resolve([]);
}
