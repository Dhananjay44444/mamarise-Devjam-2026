import { parseVoiceIntent } from "./voiceIntentParser";
import { appReducer, defaultState, selectChoreSplit } from "../state/store";

describe("Voice Intent Parser & Entity Extraction", () => {
  const context = defaultState;

  test("Parses task completion with energy and mood: 'I completed cooking and I'm feeling very tired.'", () => {
    const raw = "I completed cooking and I'm feeling very tired.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("COMPLETE_TASK");
    expect(result.entities.taskName.toLowerCase()).toContain("cook");
    expect(result.entities.energy).toBe("Low");
    expect(result.entities.mood).toBe("Tired");
    expect(result.stateAction.type).toBe("VOICE_COMPLETE_TASK");
  });

  test("Parses task assignment: 'Assign grocery shopping to my partner.'", () => {
    const raw = "Assign grocery shopping to my partner.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("ASSIGN_TASK");
    expect(result.entities.taskName.toLowerCase()).toContain("grocer");
    expect(result.entities.assignedTo).toBe("Partner");
    expect(result.stateAction.type).toBe("VOICE_ASSIGN_TASK");
  });

  test("Parses help request: 'I need help with dinner tomorrow.'", () => {
    const raw = "I need help with dinner tomorrow.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("HELP_REQUEST");
    expect(result.entities.requestText).toBe(raw);
    expect(result.stateAction.type).toBe("VOICE_SEND_HELP_REQUEST");
  });

  test("Parses recovery check-in: 'I slept 4 hours last night, feeling exhausted with mild back pain.'", () => {
    const raw = "I slept 4 hours last night, feeling exhausted with mild back pain.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("LOG_RECOVERY");
    expect(result.entities.sleepHours).toBe(4);
    expect(result.entities.energy).toBe("Low");
    expect(result.entities.pain).toBe("Mild");
    expect(result.stateAction.type).toBe("VOICE_LOG_RECOVERY");
  });

  test("Parses partner takeover: 'I'll handle dinner tonight.'", () => {
    const raw = "I'll handle dinner tonight.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("TAKE_OVER_TASK");
    expect(result.entities.taskName.toLowerCase()).toContain("dinner");
    expect(result.stateAction.type).toBe("VOICE_TAKE_OVER_TASK");
  });

  test("Parses career microtask: 'Completed Excel refresh microtask.'", () => {
    const raw = "Completed Excel refresh microtask.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("COMPLETE_MICROTASK");
    expect(result.entities.day).toBe("Monday");
    expect(result.stateAction.type).toBe("VOICE_COMPLETE_MICROTASK");
  });

  test("Parses reminder: 'Remind me to drink warm water in 1 hour.'", () => {
    const raw = "Remind me to drink warm water in 1 hour.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("SET_REMINDER");
    expect(result.entities.text.toLowerCase()).toContain("drink warm water");
    expect(result.stateAction.type).toBe("VOICE_ADD_REMINDER");
  });

  test("Parses navigation: 'Go to Load Mirror.'", () => {
    const raw = "Go to Load Mirror.";
    const result = parseVoiceIntent(raw, context);

    expect(result.intent).toBe("NAVIGATE");
    expect(result.entities.target).toBe("loadmirror");
  });
});

describe("Cross-Application State Synchronization with Voice Actions", () => {
  test("VOICE_COMPLETE_TASK updates task status, logs energy to recovery, and updates history", () => {
    const parsed = parseVoiceIntent("I completed cooking and I'm feeling very tired.", defaultState);

    const nextState = appReducer(defaultState, parsed.stateAction);

    // 1. Check task is completed
    const cookingTask = nextState.householdTasks.find((t) => t.task.toLowerCase().includes("cook"));
    expect(cookingTask.status).toBe("completed");

    // 2. Check recovery energy updated
    expect(nextState.recovery.energy).toBe("Low");
    expect(nextState.recovery.mood).toBe("Tired");

    // 3. Check voice command history logged
    expect(nextState.voiceCommandHistory.length).toBeGreaterThan(0);
    expect(nextState.voiceCommandHistory[0].intent).toBe("COMPLETE_TASK");
    expect(nextState.voiceCommandHistory[0].entities.energy).toBe("Low");

    // 4. Check notification pushed
    expect(nextState.notifications[0].type).toBe("voice");
  });

  test("VOICE_ASSIGN_TASK updates household tasks and recalculates split", () => {
    const parsed = parseVoiceIntent("Assign grocery shopping to my partner.", defaultState);

    const nextState = appReducer(defaultState, parsed.stateAction);

    const assigned = nextState.householdTasks.find((t) => t.task.toLowerCase().includes("grocer"));
    expect(assigned).toBeDefined();
    expect(assigned.by).toBe("Partner");

    const split = selectChoreSplit(nextState);
    expect(split).toBeDefined();
  });

  test("VOICE_SEND_HELP_REQUEST adds to helpRequests queue for Partner Desk", () => {
    const parsed = parseVoiceIntent("I need help with dinner tomorrow.", defaultState);

    const nextState = appReducer(defaultState, parsed.stateAction);

    expect(nextState.helpRequests[0].text).toContain("dinner tomorrow");
    expect(nextState.helpRequests[0].status).toBe("pending");
  });

  test("VOICE_LOG_RECOVERY updates recovery triage state", () => {
    const parsed = parseVoiceIntent(
      "I slept 4 hours last night, feeling exhausted with mild back pain.",
      defaultState
    );

    const nextState = appReducer(defaultState, parsed.stateAction);

    expect(nextState.recovery.sleepHours).toBe(4);
    expect(nextState.recovery.energy).toBe("Low");
    expect(nextState.recovery.pain).toBe("Mild");
  });
});
