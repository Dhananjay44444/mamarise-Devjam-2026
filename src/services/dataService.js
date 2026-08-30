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
    console.warn("[API] Backend triage request failed", err);
  }
  return null;
}

export async function fetchVideoRecommendations() {
  return Promise.resolve([]);
}
