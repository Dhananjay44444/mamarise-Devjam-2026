// store.js
// Single source of truth for MamaRise shared between Mom and Partner

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadState, saveState } from "../services/storageService";
import { fetchVideoRecommendations } from "../services/dataService";

const seedHouseholdTasks = [
  {
    id: 1,
    task: "Night Wake-Up & Feeding Assist",
    by: "Me",
    status: "confirmed",
    category: "Night Care",
    estMins: 45,
    notes: "3:00 AM diaper change and soothing.",
  },
  {
    id: 2,
    task: "Laundry Wash & Fold",
    by: "Me",
    status: "confirmed",
    category: "Cleaning",
    estMins: 30,
    notes: "Baby cottons and burp cloths.",
  },
  {
    id: 3,
    task: "Prepare Evening Dinner & Khichdi",
    by: "Partner",
    status: "confirmed",
    category: "Cooking",
    estMins: 40,
    notes: "Nutritious warm meal with ghee.",
  },
  {
    id: 4,
    task: "Morning Diaper Shift & Burping",
    by: "Partner",
    status: "completed",
    category: "Baby Care",
    estMins: 25,
    completedAt: "8:30 AM Today",
    notes: "Handled smoothly so Mom could rest.",
  },
];

const seedMicrotasks = [
  { day: "Monday", name: "Excel Refresh", mins: 15, done: false },
  { day: "Wednesday", name: "Interview Storytelling", mins: 20, done: false },
  { day: "Saturday", name: "Email Communication", mins: 15, done: false },
];

const seedAppointments = [
  {
    id: 1,
    title: "Week 8 Pediatrician Growth Check & Vaccines",
    date: "Tomorrow, 10:30 AM",
    doctor: "Dr. Ananya Rao",
    location: "Apollo Cradle Clinic",
    partnerCovering: true,
    notes: "Partner handling transport and baby soothing during drops.",
  },
  {
    id: 2,
    title: "Postpartum Maternal Recovery & Pelvic Health",
    date: "Friday, 3:00 PM",
    doctor: "Dr. Meenakshi Sundaram",
    location: "Fortis La Femme",
    partnerCovering: false,
    notes: "Partner staying home with baby during Mom's consultation.",
  },
];

const seedHelpRequests = [
  {
    id: 1,
    text: "Can you please sterilize pump parts and bottles before the 9 PM feed?",
    from: "Aisha",
    urgency: "High",
    createdAt: Date.now() - 3600000,
    status: "pending",
  },
  {
    id: 2,
    text: "Pick up fresh coconut water and iron supplements from Apollo Pharmacy",
    from: "Aisha",
    urgency: "Medium",
    createdAt: Date.now() - 7200000,
    status: "in_progress",
  },
];

const defaultState = {
  // identity + session
  currentUser: { name: "Aisha" },
  userRole: null, // "mom" | "partner" | null
  isAuthenticated: false,
  session: null,
  selectedRole: null,

  // profiles
  momProfile: {
    name: "Aisha",
    postpartumDate: null,
    workStatus: null,
    availability: null,
    partnerConnected: true,
  },
  partnerProfile: {
    name: "Rohan",
    email: "rohan@mamarise.app",
    connected: true,
    streakDays: 5,
  },

  // household tasks
  householdTasks: seedHouseholdTasks,
  microtasks: seedMicrotasks,
  appointments: seedAppointments,
  helpRequests: seedHelpRequests,

  // recovery / wellbeing
  recovery: {
    sleepHours: 5,
    energy: "Low",
    pain: "Mild",
    mood: "Okay",
    notes: "Back feels sore from nursing; low sleep.",
  },
  mood: "Okay",
  energyLevel: "Low",

  // reminders + notifications
  reminders: [
    { id: 101, text: "Refill thermal water bottle beside bed", time: "Tonight, 8:00 PM" },
  ],
  notifications: [
    {
      id: 1,
      type: "recovery",
      text: "Aisha logged sleep: 5 hours (Low Capacity alert).",
      read: false,
      createdAt: Date.now() - 1800000,
    },
    {
      id: 2,
      type: "help",
      text: "Aisha requested assistance with pump sterilization.",
      read: false,
      createdAt: Date.now() - 3600000,
    },
  ],

  // video
  videoRecommendations: [],
  videoWatchHistory: [],
  videoWatchTime: 0,

  // voice & activity
  voiceCommandHistory: [],
  dailyActivity: [
    { date: new Date().toISOString().slice(0, 10), type: "partner_chore", detail: "Morning Diaper Shift & Burping completed" },
  ],

  // care circle
  circle: [],
};

export function appReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };

    case "SET_SELECTED_ROLE":
      return { ...state, selectedRole: action.payload };

    case "LOGIN_SUCCESS": {
      const { name, email, role, loggedInAt } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        userRole: role,
        selectedRole: role,
        currentUser: { ...state.currentUser, name, email },
        session: { email, loggedInAt, role },
        momProfile: role === "mom" ? { ...state.momProfile, name } : state.momProfile,
        partnerProfile:
          role === "partner"
            ? { ...state.partnerProfile, name: name || "Rohan", email, connected: true }
            : state.partnerProfile,
      };
    }

    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        userRole: null,
        session: null,
        selectedRole: null,
        currentUser: { ...state.currentUser, email: null },
      };

    case "SET_USER":
      return {
        ...state,
        currentUser:
          typeof action.payload === "function"
            ? action.payload(state.currentUser)
            : { ...state.currentUser, ...action.payload },
      };
    case "SET_USER_ROLE":
      return { ...state, userRole: action.payload };
    case "SET_MOM_PROFILE":
      return { ...state, momProfile: { ...state.momProfile, ...action.payload } };
    case "SET_PARTNER_PROFILE":
      return { ...state, partnerProfile: { ...state.partnerProfile, ...action.payload } };

    case "SET_HOUSEHOLD_TASKS":
      return {
        ...state,
        householdTasks:
          typeof action.payload === "function"
            ? action.payload(state.householdTasks)
            : action.payload,
      };

    case "ASSIGN_TASK": {
      const isMe = action.payload.by === "Me";
      const task = {
        id: Date.now(),
        task: action.payload.task,
        by: action.payload.by,
        status: isMe ? "confirmed" : "pending",
        category: action.payload.category || "Household",
        estMins: action.payload.estMins || 20,
        notes: action.payload.notes || "",
      };
      const partnerName = state.partnerProfile?.name || "Partner";
      const momName = state.momProfile?.name || "Aisha";
      const notifyText = isMe
        ? `"${task.task}" added to ${momName}'s list`
        : `"${task.task}" assigned to ${partnerName}`;

      return {
        ...state,
        householdTasks: [task, ...state.householdTasks],
        notifications: [
          {
            id: Date.now(),
            type: "task",
            text: notifyText,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "TAKE_OVER_TASK": {
      const { id } = action.payload;
      const partnerName = state.partnerProfile?.name || "Partner";
      let takenTaskName = "Chore";
      const updated = state.householdTasks.map((t) => {
        if (t.id === id) {
          takenTaskName = t.task;
          return { ...t, by: "Partner", status: "confirmed" };
        }
        return t;
      });

      return {
        ...state,
        householdTasks: updated,
        dailyActivity: [
          { date: new Date().toISOString().slice(0, 10), type: "takeover", detail: takenTaskName },
          ...state.dailyActivity,
        ],
        notifications: [
          {
            id: Date.now(),
            type: "task",
            text: `${partnerName} took over "${takenTaskName}" — taken off Mom's plate!`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "COMPLETE_TASK": {
      const { id } = action.payload;
      let completedTaskName = "Chore";
      const updated = state.householdTasks.map((t) => {
        if (t.id === id) {
          completedTaskName = t.task;
          return {
            ...t,
            status: "completed",
            completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Today",
          };
        }
        return t;
      });

      return {
        ...state,
        householdTasks: updated,
        dailyActivity: [
          { date: new Date().toISOString().slice(0, 10), type: "partner_chore", detail: completedTaskName },
          ...state.dailyActivity,
        ],
        notifications: [
          {
            id: Date.now(),
            type: "task",
            text: `"${completedTaskName}" marked completed!`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "RESPOND_TASK": {
      const { id, accept } = action.payload;
      const updated = state.householdTasks
        .map((t) => (t.id === id ? { ...t, status: accept ? "confirmed" : "declined" } : t))
        .filter((t) => t.status !== "declined");
      return { ...state, householdTasks: updated };
    }

    case "REMIND_TASK": {
      const { id, text, time } = action.payload;
      return {
        ...state,
        reminders: [
          { id: Date.now(), text: text || "Task reminder", time: time || "In 1 hour", taskId: id },
          ...state.reminders,
        ],
        notifications: [
          {
            id: Date.now(),
            type: "reminder",
            text: `Reminder set: "${text}"`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "RESPOND_HELP_REQUEST": {
      const { id, status } = action.payload;
      const updated = state.helpRequests.map((h) => (h.id === id ? { ...h, status } : h));
      const req = state.helpRequests.find((h) => h.id === id);
      const reqText = req ? `"${req.text.slice(0, 30)}..."` : "Help request";

      return {
        ...state,
        helpRequests: updated,
        notifications: [
          {
            id: Date.now(),
            type: "help",
            text: status === "completed" ? `${reqText} completed by Partner!` : `${reqText} accepted by Partner.`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "SEND_HELP_REQUEST": {
      const newReq = {
        id: Date.now(),
        text: action.payload.text,
        from: state.momProfile?.name || "Aisha",
        urgency: action.payload.urgency || "High",
        createdAt: Date.now(),
        status: "pending",
      };
      return {
        ...state,
        helpRequests: [newReq, ...state.helpRequests],
        notifications: [
          {
            id: Date.now(),
            type: "help",
            text: `Aisha sent a help request: "${newReq.text}"`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "TOGGLE_APPOINTMENT_COVER": {
      const { id } = action.payload;
      const updated = state.appointments.map((a) =>
        a.id === id ? { ...a, partnerCovering: !a.partnerCovering } : a
      );
      return { ...state, appointments: updated };
    }

    case "SET_MICROTASKS":
      return {
        ...state,
        microtasks:
          typeof action.payload === "function"
            ? action.payload(state.microtasks)
            : action.payload,
      };

    case "TOGGLE_MICROTASK": {
      const updated = state.microtasks.map((s) => (s.day === action.payload ? { ...s, done: !s.done } : s));
      return {
        ...state,
        microtasks: updated,
        dailyActivity: [
          { date: new Date().toISOString().slice(0, 10), type: "microtask", detail: action.payload },
          ...state.dailyActivity,
        ],
      };
    }

    case "SET_RECOVERY": {
      const recovery = action.payload;
      if (!recovery) return { ...state, recovery: null };
      return {
        ...state,
        recovery,
        mood: recovery.mood ?? state.mood,
        energyLevel: recovery.energy ?? state.energyLevel,
        dailyActivity: [
          { date: new Date().toISOString().slice(0, 10), type: "checkin", detail: recovery },
          ...state.dailyActivity,
        ],
        notifications: [
          {
            id: Date.now(),
            type: "recovery",
            text: `Aisha logged recovery check-in (${recovery.energy} Energy, ${recovery.sleepHours}h Sleep)`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "SET_CIRCLE":
      return {
        ...state,
        circle:
          typeof action.payload === "function"
            ? action.payload(state.circle)
            : action.payload,
      };

    case "ADD_REMINDER":
      return { ...state, reminders: [action.payload, ...state.reminders] };
    case "REMOVE_REMINDER":
      return { ...state, reminders: state.reminders.filter((r) => r.id !== action.payload) };

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      };

    case "SET_VIDEO_RECOMMENDATIONS":
      return { ...state, videoRecommendations: action.payload };
    case "ADD_VIDEO_WATCH": {
      const { video, seconds } = action.payload;
      return {
        ...state,
        videoWatchHistory: [{ ...video, watchedAt: Date.now(), activeSeconds: seconds }, ...state.videoWatchHistory],
        videoWatchTime: (state.videoWatchTime || 0) + seconds,
      };
    }
    case "RECORD_WATCH_SESSION": {
      const {
        sessionId = `sess-${Date.now()}`,
        videoId,
        videoTitle,
        creator,
        category,
        startTime = Date.now(),
        activeSeconds = 0,
        completed = false,
        status = "completed",
      } = action.payload;

      if (!activeSeconds || activeSeconds <= 0) return state;

      const newSession = {
        sessionId,
        videoId,
        videoTitle,
        creator,
        category,
        startTime,
        activeSeconds,
        completed,
        status,
        watchedAt: Date.now(),
      };

      const newActivity = {
        date: new Date().toISOString().slice(0, 10),
        type: "video_watch",
        detail: `Completed ${Math.max(1, Math.round(activeSeconds / 60))}m wellness learning: "${videoTitle}"`,
      };

      const newNotification = {
        id: Date.now(),
        type: "video",
        text: `Logged ${Math.max(1, Math.round(activeSeconds / 60))} min of recovery learning: "${videoTitle}".`,
        read: false,
        createdAt: Date.now(),
      };

      return {
        ...state,
        videoWatchHistory: [newSession, ...state.videoWatchHistory],
        videoWatchTime: (state.videoWatchTime || 0) + activeSeconds,
        dailyActivity: [newActivity, ...(state.dailyActivity || [])],
        notifications: [newNotification, ...(state.notifications || [])],
      };
    }
    case "CLEAR_WATCH_HISTORY":
      return {
        ...state,
        videoWatchHistory: [],
        videoWatchTime: 0,
      };

    case "VOICE_COMPLETE_TASK": {
      const { taskName, taskId, energy, mood, pain, rawTranscript } = action.payload;
      let matched = false;
      const updatedTasks = state.householdTasks.map((t) => {
        if ((taskId && t.id === taskId) || t.task.toLowerCase().includes(taskName.toLowerCase()) || taskName.toLowerCase().includes(t.task.toLowerCase())) {
          matched = true;
          return {
            ...t,
            status: "completed",
            completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Today",
          };
        }
        return t;
      });

      const finalTasks = matched
        ? updatedTasks
        : [
          {
            id: Date.now(),
            task: taskName,
            by: state.userRole === "partner" ? "Partner" : "Me",
            status: "completed",
            category: "Household",
            completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Today",
          },
          ...state.householdTasks,
        ];

      const newRecovery =
        energy || mood || pain
          ? {
            ...(state.recovery || { sleepHours: 6 }),
            ...(energy ? { energy } : {}),
            ...(mood ? { mood } : {}),
            ...(pain ? { pain } : {}),
            notes: rawTranscript,
          }
          : state.recovery;

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "COMPLETE_TASK",
        entities: { taskName, energy, mood, pain },
        result: `Marked "${taskName}" as completed${energy ? ` & logged ${energy} energy` : ""}`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        householdTasks: finalTasks,
        recovery: newRecovery,
        energyLevel: energy || state.energyLevel,
        mood: mood || state.mood,
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
        dailyActivity: [
          { date: new Date().toISOString().slice(0, 10), type: "voice_complete", detail: `"${taskName}" completed via voice` },
          ...state.dailyActivity,
        ],
        notifications: [
          {
            id: Date.now(),
            type: "voice",
            text: `Voice Command: "${taskName}" marked completed!`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "VOICE_ASSIGN_TASK": {
      const { task, by, category, rawTranscript } = action.payload;
      const newTask = {
        id: Date.now(),
        task,
        by,
        status: by === "Me" ? "confirmed" : "pending",
        category: category || "Household",
        estMins: 30,
      };

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "ASSIGN_TASK",
        entities: { task, by, category },
        result: `Assigned "${task}" to ${by}`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        householdTasks: [newTask, ...state.householdTasks],
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
        notifications: [
          {
            id: Date.now(),
            type: "voice",
            text: `Voice Action: "${task}" assigned to ${by}`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "VOICE_SEND_HELP_REQUEST": {
      const { text, urgency, rawTranscript } = action.payload;
      const newReq = {
        id: Date.now(),
        text,
        from: state.momProfile?.name || "Aisha",
        urgency: urgency || "High",
        createdAt: Date.now(),
        status: "pending",
      };

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "HELP_REQUEST",
        entities: { text, urgency },
        result: `Broadcast help request to Partner Desk: "${text}"`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        helpRequests: [newReq, ...state.helpRequests],
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
        notifications: [
          {
            id: Date.now(),
            type: "help",
            text: `Voice Help Broadcast: "${text}" sent to Partner Desk`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "VOICE_UPDATE_RECOVERY":
    case "VOICE_LOG_RECOVERY": {
      const { sleepHours, energy, pain, mood, notes, rawTranscript } = action.payload || {};
      const safeSleepHours = sleepHours !== undefined && sleepHours !== null ? Number(sleepHours) : (state.recovery?.sleepHours ?? 8);
      const safeEnergy = energy || (safeSleepHours >= 8 ? "Good" : safeSleepHours < 5 ? "Low" : "Okay");
      const safePain = pain || state.recovery?.pain || "None";
      const safeMood = mood || state.recovery?.mood || (safeEnergy === "Good" ? "Good" : "Okay");

      const updatedRecovery = {
        sleepHours: safeSleepHours,
        energy: safeEnergy,
        pain: safePain,
        mood: safeMood,
        notes: notes || rawTranscript || "",
      };

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "LOG_RECOVERY",
        entities: { sleepHours: safeSleepHours, energy: safeEnergy, pain: safePain, mood: safeMood },
        result: `Logged recovery: ${safeSleepHours}h sleep · ${safeEnergy} energy · ${safeMood} mood · ${safePain} pain`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        recovery: updatedRecovery,
        energyLevel: safeEnergy,
        mood: safeMood,
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
        notifications: [
          {
            id: Date.now(),
            type: "recovery",
            text: `Voice Triage: Logged ${safeSleepHours}h sleep & ${safeEnergy} energy`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "VOICE_TAKE_OVER_TASK": {
      const { taskName, taskId, rawTranscript } = action.payload;
      let matched = false;
      const updatedTasks = state.householdTasks.map((t) => {
        if ((taskId && t.id === taskId) || t.task.toLowerCase().includes(taskName.toLowerCase()) || taskName.toLowerCase().includes(t.task.toLowerCase())) {
          matched = true;
          return { ...t, by: "Partner", status: "confirmed" };
        }
        return t;
      });

      const finalTasks = matched
        ? updatedTasks
        : [
          {
            id: Date.now(),
            task: taskName,
            by: "Partner",
            status: "confirmed",
            category: "Household",
            estMins: 30,
          },
          ...state.householdTasks,
        ];

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "TAKE_OVER_TASK",
        entities: { taskName },
        result: `Partner took over "${taskName}"`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        householdTasks: finalTasks,
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
        notifications: [
          {
            id: Date.now(),
            type: "task",
            text: `Voice Takeover: Partner took over "${taskName}"`,
            read: false,
            createdAt: Date.now(),
          },
          ...state.notifications,
        ],
      };
    }

    case "VOICE_COMPLETE_MICROTASK": {
      const { day, rawTranscript } = action.payload;
      const updatedMicrotasks = state.microtasks.map((s) => (s.day === day ? { ...s, done: true } : s));

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "COMPLETE_MICROTASK",
        entities: { day },
        result: `Completed ${day} Career Readiness microtask`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        microtasks: updatedMicrotasks,
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
      };
    }

    case "VOICE_ADD_REMINDER": {
      const { text, time, rawTranscript } = action.payload;
      const newReminder = { id: Date.now(), text, time };

      const historyEntry = {
        id: Date.now(),
        transcript: rawTranscript,
        intent: "SET_REMINDER",
        entities: { text, time },
        result: `Set reminder: "${text}" (${time})`,
        timestamp: Date.now(),
        status: "success",
      };

      return {
        ...state,
        reminders: [newReminder, ...state.reminders],
        voiceCommandHistory: [historyEntry, ...state.voiceCommandHistory],
      };
    }

    case "CLEAR_VOICE_HISTORY":
      return { ...state, voiceCommandHistory: [] };

    case "LOG_VOICE_COMMAND": {
      const entry = {
        id: Date.now(),
        transcript: action.payload,
        intent: "GENERAL_LOG",
        entities: {},
        result: `Logged note: "${action.payload}"`,
        timestamp: Date.now(),
        status: "success",
      };
      return {
        ...state,
        voiceCommandHistory: [entry, ...state.voiceCommandHistory],
      };
    }

    default:
      return state;
  }
}

const AppStateContext = createContext(null);

function hydrateFromStorage(init) {
  const saved = loadState();
  if (!saved) return init;
  const next = { ...init, ...saved };
  if (typeof saved.isAuthenticated !== "boolean") {
    next.isAuthenticated = false;
    next.userRole = null;
    next.session = null;
  }
  // Ensure appointments and helpRequests are present if loading older storage
  if (!next.appointments) next.appointments = seedAppointments;
  if (!next.helpRequests) next.helpRequests = seedHelpRequests;
  if (!next.partnerProfile) next.partnerProfile = defaultState.partnerProfile;
  return next;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, defaultState, hydrateFromStorage);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (state.videoRecommendations.length === 0) {
      fetchVideoRecommendations().then((videos) =>
        dispatch({ type: "SET_VIDEO_RECOMMENDATIONS", payload: videos })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be called inside an AppProvider");
  return ctx;
}

// Selectors
export function selectChoreSplit(state) {
  const activeOrDone = state.householdTasks.filter(
    (t) => t.status === "confirmed" || t.status === "completed"
  );
  const total = activeOrDone.length || 1;
  const me = Math.round((activeOrDone.filter((t) => t.by === "Me").length / total) * 100);
  return { me, partner: 100 - me };
}

export function selectPartnerContributions(state) {
  const completed = state.householdTasks.filter(
    (t) => t.by === "Partner" && t.status === "completed"
  );
  const active = state.householdTasks.filter(
    (t) => t.by === "Partner" && t.status === "confirmed"
  );
  const pending = state.householdTasks.filter(
    (t) => t.by === "Partner" && t.status === "pending"
  );
  return {
    completed,
    active,
    pending,
    tasksCompleted: completed.length,
    activeCount: active.length,
  };
}

export function selectTotalWatchStats(state) {
  const history = state.videoWatchHistory || [];
  const totalSeconds = state.videoWatchTime || 0;
  const totalMinutes = Math.round(totalSeconds / 60);
  const categoriesMap = {};

  history.forEach((h) => {
    const cat = h.category || "General Wellness";
    categoriesMap[cat] = (categoriesMap[cat] || 0) + (h.activeSeconds || 0);
  });

  return {
    totalSessions: history.length,
    totalSeconds,
    totalMinutes,
    categoriesMap,
    recentSessions: history.slice(0, 5),
  };
}

export { defaultState, seedAppointments, seedHelpRequests, seedHouseholdTasks };
