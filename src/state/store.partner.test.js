import { appReducer, defaultState, selectChoreSplit, selectPartnerContributions } from "./store";

describe("Partner Shared State Lifecycle & Synchronization", () => {
  test("Mom adds chore -> Partner takes over -> split shifts -> Partner completes chore", () => {
    // 1. Mom adds a chore on her list
    const step1 = appReducer(defaultState, {
      type: "ASSIGN_TASK",
      payload: { task: "Sterilize Feeding Bottles", by: "Me", category: "Baby Care" },
    });

    const addedTask = step1.householdTasks[0];
    expect(addedTask.task).toBe("Sterilize Feeding Bottles");
    expect(addedTask.by).toBe("Me");
    expect(addedTask.status).toBe("confirmed");

    const splitAfterMomAdd = selectChoreSplit(step1);
    expect(splitAfterMomAdd.me).toBeGreaterThan(splitAfterMomAdd.partner);

    // 2. Partner sees task on 'Take Over From Mom' and clicks 'I'll handle this'
    const step2 = appReducer(step1, {
      type: "TAKE_OVER_TASK",
      payload: { id: addedTask.id },
    });

    const takenTask = step2.householdTasks.find((t) => t.id === addedTask.id);
    expect(takenTask.by).toBe("Partner");
    expect(takenTask.status).toBe("confirmed");
    expect(step2.notifications[0].text).toContain("took over \"Sterilize Feeding Bottles\"");

    const splitAfterTakeover = selectChoreSplit(step2);
    expect(splitAfterTakeover.partner).toBeGreaterThan(splitAfterMomAdd.partner);

    // 3. Partner marks the task as complete
    const step3 = appReducer(step2, {
      type: "COMPLETE_TASK",
      payload: { id: addedTask.id },
    });

    const completedTask = step3.householdTasks.find((t) => t.id === addedTask.id);
    expect(completedTask.status).toBe("completed");
    expect(completedTask.completedAt).toBeDefined();

    const partnerStats = selectPartnerContributions(step3);
    expect(partnerStats.tasksCompleted).toBeGreaterThan(0);
    expect(partnerStats.completed.some((t) => t.id === addedTask.id)).toBe(true);
  });

  test("Mom sends help request -> Partner accepts and marks done", () => {
    const step1 = appReducer(defaultState, {
      type: "SEND_HELP_REQUEST",
      payload: { text: "Bring fresh water and soothing balm", urgency: "High" },
    });

    expect(step1.helpRequests[0].text).toBe("Bring fresh water and soothing balm");
    expect(step1.helpRequests[0].status).toBe("pending");

    // Partner accepts
    const step2 = appReducer(step1, {
      type: "RESPOND_HELP_REQUEST",
      payload: { id: step1.helpRequests[0].id, status: "in_progress" },
    });
    expect(step2.helpRequests[0].status).toBe("in_progress");

    // Partner completes
    const step3 = appReducer(step2, {
      type: "RESPOND_HELP_REQUEST",
      payload: { id: step1.helpRequests[0].id, status: "completed" },
    });
    expect(step3.helpRequests[0].status).toBe("completed");
  });

  test("Partner toggles appointment coverage", () => {
    const aptId = defaultState.appointments[0].id;
    const initialCover = defaultState.appointments[0].partnerCovering;

    const next = appReducer(defaultState, {
      type: "TOGGLE_APPOINTMENT_COVER",
      payload: { id: aptId },
    });

    expect(next.appointments[0].partnerCovering).toBe(!initialCover);
  });
});
