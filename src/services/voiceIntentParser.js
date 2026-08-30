// voiceIntentParser.js
// Centralized Natural Language Intent Detection & Entity Extraction Engine for MamaRise

/**
 * Normalizes input text for regex matching
 */
function cleanText(text) {
  return (text || "").trim().toLowerCase();
}

/**
 * Extracts number of sleep hours from speech
 */
function extractSleepHours(text) {
  if (/remind\s+me|set\s+(?:a\s+)?reminder/i.test(text)) return null;
  const t = text.toLowerCase();
  
  // Digit match (e.g. "slept for 10 hrs", "10 hours", "got 8.5 hours", "slept 10")
  const match =
    t.match(/(?:slept(?:\s+for)?|got|had|with)\s*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)?/i) ||
    t.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:of\s*)?sleep/i) ||
    t.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:last\s*night|today|rest)?/i) ||
    t.match(/slept\s*(\d+(?:\.\d+)?)/i);

  if (match) return parseFloat(match[1]);

  // Word numbers (e.g. "ten hours", "eight hrs", "seven")
  const wordMap = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12
  };
  for (const [word, val] of Object.entries(wordMap)) {
    if (
      new RegExp(`(?:slept(?:\\s+for)?|got|had)\\s+${word}\\s*(?:hours?|hrs?)?`, "i").test(t) ||
      new RegExp(`${word}\\s*(?:hours?|hrs?)\\s*(?:of\\s*)?sleep`, "i").test(t)
    ) {
      return val;
    }
  }
  return null;
}

/**
 * Extracts energy level from speech
 */
function extractEnergy(text) {
  const t = text.toLowerCase();
  if (/\b(?:good|great|high|refreshed|energetic|fine|amazing|well|super|boosted|strong)\b/i.test(t)) return "Good";
  if (/\b(?:okay|moderate|decent|average|alright|stable|neutral)\b/i.test(t)) return "Okay";
  if (/\b(?:exhausted|tired|drained|very low|no energy|fatigued|heavy|low|depleted|sleepy)\b/i.test(t)) return "Low";
  return null;
}

/**
 * Extracts pain level from speech
 */
function extractPain(text) {
  const t = text.toLowerCase();
  if (/severe\s*(?:back\s*)?pain|hurts\s+a\s+lot|extreme\s*pain|intense\s*pain|heavy\s*pain/i.test(t)) return "Severe";
  if (/moderate\s*pain/i.test(t)) return "Moderate";
  if (/mild\s*(?:back\s*)?pain|slight\s*pain|a\s*bit\s*sore|little\s*sore|soreness|mild/i.test(t)) return "Mild";
  if (/no\s*pain|pain\s*free|zero\s*pain/i.test(t)) return "None";
  if (/pain|hurts|ache/i.test(t)) return "Moderate";
  return "None";
}

/**
 * Extracts mood from speech
 */
function extractMood(text) {
  const t = text.toLowerCase();
  if (/\b(?:happy|great|cheerful|optimistic|confident|proud|good|joyful|peaceful|positive)\b/i.test(t)) return "Good";
  if (/\b(?:okay|fine|calm|holding up|stable|neutral)\b/i.test(t)) return "Okay";
  if (/\b(?:overwhelmed|down|sad|crying|anxious|stressed|gloomy|low|struggling)\b/i.test(t)) return "Low";
  if (/\b(?:tired|exhausted|sleepy)\b/i.test(t)) return "Tired";
  return null;
}

/**
 * Matches known household chore names from raw speech
 */
function extractTaskName(text, existingTasks = []) {
  const t = cleanText(text);

  // Exact matching against existing tasks in state
  for (const item of existingTasks) {
    const rawItem = cleanText(item.task);
    if (t.includes(rawItem)) return item.task;
    // Word matching
    const words = rawItem.split(/\s+/).filter((w) => w.length > 3 && !["with", "and", "the", "for"].includes(w));
    for (const w of words) {
      if (new RegExp(`\\b${w}\\b`, "i").test(t)) return item.task;
    }
  }

  // Common keywords heuristics
  if (t.includes("cooking") || t.includes("dinner") || t.includes("meal") || t.includes("khichdi") || t.includes("lunch")) {
    return "Cooking Dinner";
  }
  if (t.includes("laundry") || t.includes("clothes") || t.includes("folding")) {
    return "Laundry Wash & Fold";
  }
  if (t.includes("grocer") || t.includes("shopping") || t.includes("supermarket") || t.includes("pharmacy")) {
    return "Grocery & Pharmacy Run";
  }
  if (/\b(?:night\s*wake|night\s*feed|night\s*shift|3\s*am)\b/i.test(t)) {
    return "Night Wake-Up & Feeding Assist";
  }
  if (t.includes("bottle") || t.includes("steriliz") || t.includes("pump")) {
    return "Sterilize Feeding Bottles & Pump Parts";
  }
  if (t.includes("diaper") || t.includes("bath") || t.includes("burping")) {
    return "Morning Diaper Shift & Bath Time";
  }

  // Extract from "completed X" or "assign X"
  const assignMatch = t.match(/assign\s+([a-z\s&]+?)\s+(?:to|for)/i);
  if (assignMatch) return assignMatch[1].trim();

  const completeMatch = t.match(/(?:completed|finished|done with|handled)\s+([a-z\s&]+?)(?:\s+and|\.|$)/i);
  if (completeMatch) return completeMatch[1].trim();

  return "Household Task";
}

/**
 * Main Centralized Intent Parser
 *
 * @param {string} rawTranscript - Spoken sentence from user
 * @param {object} context - Current app state { householdTasks, microtasks, recovery, etc. }
 * @returns {object} Structured command object
 */
export function parseVoiceIntent(rawTranscript, context = {}) {
  const text = cleanText(rawTranscript);
  if (!text) {
    return {
      rawTranscript: "",
      intent: "UNKNOWN",
      confidence: 0,
      entities: {},
      summaryMessage: "No speech detected. Please speak clearly into the microphone.",
      stateAction: null,
    };
  }

  const existingTasks = context.householdTasks || [];

  // 1. INTENT: Reminder (Check high priority before sleep check)
  const isReminder = /(?:remind\s+me|set\s+(?:a\s+)?reminder)/i.test(text);
  if (isReminder) {
    const cleanReminder = rawTranscript
      .replace(/(?:remind\s+me\s+to|set\s+(?:a\s+)?reminder\s+to|set\s+(?:a\s+)?reminder\s+for)/i, "")
      .trim();
    return {
      rawTranscript,
      intent: "SET_REMINDER",
      confidence: 0.88,
      entities: {
        text: cleanReminder || "Voice reminder",
        time: "In 1 hour",
      },
      summaryMessage: `Set reminder: "${cleanReminder || "Voice reminder"}"`,
      stateAction: {
        type: "VOICE_ADD_REMINDER",
        payload: { text: cleanReminder, time: "In 1 hour", rawTranscript },
      },
    };
  }

  // 2. INTENT: Microtask / Skill Refresh Complete (Check before general complete)
  const isMicrotask = /(?:excel|interview|communication|storytelling|microtask|readiness)/i.test(text) && /(?:completed|finished|done|refreshed)/i.test(text);
  if (isMicrotask) {
    let day = "Monday";
    if (/interview|storytelling/i.test(text)) day = "Wednesday";
    if (/email|communication/i.test(text)) day = "Saturday";

    return {
      rawTranscript,
      intent: "COMPLETE_MICROTASK",
      confidence: 0.95,
      entities: { day },
      summaryMessage: `Marked career readiness microtask for ${day} as completed.`,
      stateAction: {
        type: "VOICE_COMPLETE_MICROTASK",
        payload: { day, rawTranscript },
      },
    };
  }

  // 3. INTENT: Take Over Task (Partner Voice)
  const isTakeOver = /(?:i'll\s+handle|i\s+will\s+take\s+over|taking\s+over|i\s+can\s+take)/i.test(text);
  if (isTakeOver) {
    const taskName = extractTaskName(text, existingTasks);
    const matchedTask = existingTasks.find(
      (t) => cleanText(t.task).includes(cleanText(taskName)) || cleanText(taskName).includes(cleanText(t.task))
    );

    return {
      rawTranscript,
      intent: "TAKE_OVER_TASK",
      confidence: 0.93,
      entities: {
        taskName: matchedTask ? matchedTask.task : taskName,
        taskId: matchedTask ? matchedTask.id : null,
      },
      summaryMessage: `Partner took over "${matchedTask ? matchedTask.task : taskName}". Relieved from Mom's plate!`,
      stateAction: {
        type: "VOICE_TAKE_OVER_TASK",
        payload: {
          taskId: matchedTask ? matchedTask.id : null,
          taskName: matchedTask ? matchedTask.task : taskName,
          rawTranscript,
        },
      },
    };
  }

  // 4. INTENT: Help / SOS Request from Mom to Partner
  const isHelpRequest =
    /(?:i\s+need\s+help|need\s+support|can\s+(?:my\s+)?partner|ask\s+(?:rohan|partner)|please\s+help|request\s+help)/i.test(
      text
    );

  if (isHelpRequest) {
    const urgency = /urgent|asap|immediately|high|tonight|right now/i.test(text) ? "High" : "Medium";
    return {
      rawTranscript,
      intent: "HELP_REQUEST",
      confidence: 0.94,
      entities: {
        requestText: rawTranscript,
        urgency,
      },
      summaryMessage: `Broadcast help request to Partner Action Desk: "${rawTranscript}"`,
      stateAction: {
        type: "VOICE_SEND_HELP_REQUEST",
        payload: {
          text: rawTranscript,
          urgency,
          rawTranscript,
        },
      },
    };
  }

  // 5. INTENT: Assign Task / Rebalance to Partner
  const isAssign =
    /(?:assign|give|hand over|transfer|add\s+chore|set\s+task)\s+/i.test(text) &&
    /(?:partner|husband|rohan|him|spouse|me)/i.test(text);

  if (isAssign || /assign\s+/i.test(text)) {
    const taskName = extractTaskName(text, existingTasks);
    const isToPartner = /(?:partner|husband|rohan|him|spouse)/i.test(text) || !/to\s+me/i.test(text);

    return {
      rawTranscript,
      intent: "ASSIGN_TASK",
      confidence: 0.92,
      entities: {
        taskName,
        assignedTo: isToPartner ? "Partner" : "Me",
        category: taskName.includes("Cooking")
          ? "Cooking"
          : taskName.includes("Laundry")
            ? "Cleaning"
            : taskName.includes("Grocer")
              ? "Errands"
              : "Household",
      },
      summaryMessage: `Assigned "${taskName}" to ${isToPartner ? "Partner" : "You"}. Shared load split updated.`,
      stateAction: {
        type: "VOICE_ASSIGN_TASK",
        payload: {
          task: taskName,
          by: isToPartner ? "Partner" : "Me",
          category: taskName.includes("Cooking")
            ? "Cooking"
            : taskName.includes("Laundry")
              ? "Cleaning"
              : taskName.includes("Grocer")
                ? "Errands"
                : "Household",
          rawTranscript,
        },
      },
    };
  }

  // 6. INTENT: Complete Task (with optional recovery/mood updates)
  const isComplete =
    /(?:completed|finished|done with|marked done|handled)\s+/i.test(text) ||
    /^(?:i\s+)?did\s+/i.test(text);

  if (isComplete) {
    const taskName = extractTaskName(text, existingTasks);
    const energy = extractEnergy(text);
    const mood = extractMood(text);
    const pain = extractPain(text);

    const matchedTask = existingTasks.find(
      (t) => cleanText(t.task).includes(cleanText(taskName)) || cleanText(taskName).includes(cleanText(t.task))
    );

    return {
      rawTranscript,
      intent: "COMPLETE_TASK",
      confidence: 0.95,
      entities: {
        taskName: matchedTask ? matchedTask.task : taskName,
        taskId: matchedTask ? matchedTask.id : null,
        energy,
        mood,
        pain,
      },
      summaryMessage: `Marked "${matchedTask ? matchedTask.task : taskName}" as complete${energy ? ` and logged ${energy} energy` : ""
        }.`,
      stateAction: {
        type: "VOICE_COMPLETE_TASK",
        payload: {
          taskName: matchedTask ? matchedTask.task : taskName,
          taskId: matchedTask ? matchedTask.id : null,
          energy,
          mood,
          pain,
          rawTranscript,
        },
      },
    };
  }

  // 7. INTENT: Log Recovery Check-in (Sleep, Pain, Energy, Mood)
  const hasSleep = extractSleepHours(text);
  const hasEnergy = extractEnergy(text);
  const hasPain = extractPain(text);
  const hasMood = extractMood(text);

  if (
    hasSleep !== null ||
    (hasEnergy && (hasMood || text.includes("feeling") || text.includes("feel"))) ||
    (hasEnergy && hasPain !== "None") ||
    /(?:check-in|triage|slept|sleep|my\s+energy|my\s+pain|feeling\s+good|feeling\s+tired|feeling\s+exhausted)/i.test(text)
  ) {
    const sleepHours = hasSleep !== null ? hasSleep : (context.recovery?.sleepHours || 8);
    const energy = hasEnergy || (sleepHours >= 8 ? "Good" : sleepHours < 5 ? "Low" : "Okay");
    const pain = hasPain || "None";
    const mood = hasMood || (energy === "Good" ? "Good" : energy === "Low" ? "Tired" : "Okay");

    return {
      rawTranscript,
      intent: "LOG_RECOVERY",
      confidence: 0.95,
      entities: {
        sleepHours,
        energy,
        pain,
        mood,
        notes: rawTranscript,
      },
      summaryMessage: `Logged recovery update: ${sleepHours}h sleep · ${energy} energy · ${mood} mood · ${pain} pain.`,
      stateAction: {
        type: "VOICE_LOG_RECOVERY",
        payload: {
          sleepHours,
          energy,
          pain,
          mood,
          notes: rawTranscript,
          rawTranscript,
        },
      },
    };
  }

  // 8. INTENT: Navigation Command
  const isNav = /(?:go\s+to|open|show|navigate\s+to)\s+/i.test(text);
  if (isNav) {
    let target = "dashboard";
    if (/partner/i.test(text)) target = "partner";
    else if (/load|mirror|split|rebalance/i.test(text)) target = "loadmirror";
    else if (/check|triage|recovery/i.test(text)) target = "checkin";
    else if (/readiness|career|bridge|card/i.test(text)) target = "readiness";
    else if (/safety|wall/i.test(text)) target = "safetywall";
    else if (/insights/i.test(text)) target = "insights";

    return {
      rawTranscript,
      intent: "NAVIGATE",
      confidence: 0.96,
      entities: { target },
      summaryMessage: `Navigating to ${target}...`,
      stateAction: {
        type: "VOICE_NAVIGATE",
        payload: { target, rawTranscript },
      },
    };
  }

  // Fallback: General Notes / Unstructured Voice Log
  return {
    rawTranscript,
    intent: "GENERAL_LOG",
    confidence: 0.6,
    entities: {},
    summaryMessage: `Logged voice note: "${rawTranscript}"`,
    stateAction: {
      type: "LOG_VOICE_COMMAND",
      payload: rawTranscript,
    },
  };
}
