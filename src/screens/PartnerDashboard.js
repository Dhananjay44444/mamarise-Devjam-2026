import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Moon,
  Plus,
  Zap,
  Sparkles,
  Clock,
  Heart,
  Calendar,
  Bell,
  Flame,
  Lightbulb,
  Droplet,
  CheckCheck,
  Utensils,
  X,
  Info,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { C, stagger, fadeUp, shadows } from "../theme";
import { Screen, Button, Card, Badge, TopBar } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";
import {
  useAppState,
  selectChoreSplit,
  selectPartnerContributions,
} from "../state/store";
import { PATHS } from "../routing/paths";

function getCategoryIcon(cat) {
  switch (cat) {
    case "Cooking":
      return Doodle.Pot;
    case "Cleaning":
      return Doodle.Broom;
    case "Baby Care":
      return Doodle.Bottle;
    case "Night Care":
    case "Night Shift":
      return Doodle.MoonRest;
    case "Errands":
      return Doodle.Bag;
    default:
      return Doodle.Laundry;
  }
}

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const {
    currentUser,
    recovery,
    householdTasks = [],
    momProfile,
    partnerProfile,
    appointments = [],
    helpRequests = [],
    notifications = [],
  } = state;

  const [activeTab, setActiveTab] = useState("todo"); // "todo" | "takeover" | "requests" | "appointments"
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [customTaskName, setCustomTaskName] = useState("");
  const [customTaskCategory, setCustomTaskCategory] = useState("Baby Care");
  const [toastMessage, setToastMessage] = useState(null);

  const herName = momProfile?.name || "Aisha";
  const myName = currentUser?.name || partnerProfile?.name || "Rohan";
  const streak = partnerProfile?.streakDays || 5;

  const choreSplit = useMemo(() => selectChoreSplit(state), [state]);
  const partnerContributions = useMemo(() => selectPartnerContributions(state), [state]);

  // Tasks assigned to Partner (pending or active)
  const myActiveTasks = householdTasks.filter(
    (t) => t.by === "Partner" && t.status === "confirmed"
  );
  const myPendingTasks = householdTasks.filter(
    (t) => t.by === "Partner" && t.status === "pending"
  );
  const myCompletedTasks = householdTasks.filter(
    (t) => t.by === "Partner" && t.status === "completed"
  );

  // Tasks on Mom's plate that Partner can take over
  const momTasksToTakeOver = householdTasks.filter(
    (t) => t.by === "Me" && t.status !== "completed"
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate(PATHS.landing, { replace: true });
  };

  // Actions
  const handleTakeOver = (id, taskName) => {
    dispatch({ type: "TAKE_OVER_TASK", payload: { id } });
    showToast(`You took over "${taskName}" — relieved from ${herName}'s plate!`);
  };

  const handleCompleteTask = (id, taskName) => {
    dispatch({ type: "COMPLETE_TASK", payload: { id } });
    showToast(`"${taskName}" marked as completed. Shared split updated!`);
  };

  const handleAcceptTask = (id, taskName) => {
    dispatch({ type: "RESPOND_TASK", payload: { id, accept: true } });
    showToast(`Accepted "${taskName}"!`);
  };

  const handleRemindMe = (task) => {
    dispatch({
      type: "REMIND_TASK",
      payload: { id: task.id, text: task.task, time: "In 30 mins" },
    });
    showToast(`Reminder set for "${task.task}"`);
  };

  const handleRespondHelpRequest = (id, status) => {
    dispatch({ type: "RESPOND_HELP_REQUEST", payload: { id, status } });
    showToast(status === "completed" ? "Help request marked complete!" : "Help request accepted!");
  };

  const handleToggleAppointment = (id) => {
    dispatch({ type: "TOGGLE_APPOINTMENT_COVER", payload: { id } });
    showToast("Updated appointment attendance coverage.");
  };

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!customTaskName.trim()) return;
    dispatch({
      type: "ASSIGN_TASK",
      payload: {
        task: customTaskName.trim(),
        by: "Partner",
        category: customTaskCategory,
        estMins: 30,
      },
    });
    showToast(`Added and assigned "${customTaskName}" to your board.`);
    setCustomTaskName("");
  };

  // Quick Action Presets
  const triggerQuickAction = (actionTitle, category, estMins) => {
    dispatch({
      type: "ASSIGN_TASK",
      payload: {
        task: actionTitle,
        by: "Partner",
        category,
        estMins,
      },
    });
    showToast(`Claimed quick action: "${actionTitle}"`);
  };

  // Contextual Dynamic Mission
  const supportMission = useMemo(() => {
    if (recovery?.energy === "Low" || recovery?.sleepHours < 5) {
      return {
        title: `Protect ${herName}'s Recovery & Evening Rest`,
        subtitle: `${herName} logged low sleep (${recovery?.sleepHours || 4}h) and physical fatigue. Your mission today is to absorb physical kitchen & night duties so she can rest uninterrupted.`,
        priorityChore: momTasksToTakeOver[0]?.task || "Night Feeding & Diaper Assist",
        badge: "High Support Day",
        color: C.blushDeep,
        bg: "rgba(252, 240, 235, 0.9)",
      };
    }
    if (momTasksToTakeOver.length > 2) {
      return {
        title: "Rebalance the Household Load to 50/50",
        subtitle: `${herName} is currently carrying ${choreSplit.me}% of domestic duties. Take over 1-2 chores from her list below to achieve equity.`,
        priorityChore: momTasksToTakeOver[0]?.task || "Dinner & Kitchen Cleanup",
        badge: "Load Imbalance",
        color: C.gold,
        bg: "rgba(248, 235, 212, 0.85)",
      };
    }
    return {
      title: "Maintain Steady Co-Parenting Rhythm",
      subtitle: `${herName}'s recovery is steady today. Keep the positive momentum going with proactive baby shifts and meal prep.`,
      priorityChore: "Prepare Evening Meal",
      badge: "Steady Rhythm",
      color: C.sageDark,
      bg: "rgba(238, 244, 236, 0.9)",
    };
  }, [recovery, momTasksToTakeOver, choreSplit, herName]);

  // AI Support Suggestions
  const aiTips = [
    {
      title: "Action Over Asking",
      tip: `Don't ask "${herName}, what should I do?". Look at the pending list below and take over 1 task directly.`,
      icon: Zap,
    },
    {
      title: "Physical Strain Boundary",
      tip: "Standing to cook or fold laundry exceeds her 20-min fatigue threshold in Week 8. Take over dinner tonight.",
      icon: Utensils,
    },
    {
      title: "Unbroken Nap Window",
      tip: `Take baby for a 45-minute stroller walk at 2:00 PM to give ${herName} deep, guilt-free sleep.`,
      icon: Moon,
    },
  ];

  return (
    <Screen className="pb-20">
      {/* Toast feedback banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-2xl glass-panel flex items-center gap-2.5 text-xs font-semibold"
            style={{
              background: C.sageDark,
              color: C.cream,
              border: `1.5px solid ${C.sageLight}`,
            }}
          >
            <CheckCheck size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Navigation */}
        <TopBar
          title="Partner Action Desk"
          subtitle={`Co-parenting workspace · Supporting ${herName}`}
          onSafety={() => navigate(PATHS.safety)}
          onLogout={logout}
          role="partner"
        />

        {/* 1. Personalized Greeting & Central Question Header */}
        <motion.div initial="hidden" animate="show" variants={stagger} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className="ff-body text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs"
                  style={{ background: C.sageLight, color: C.sageDark, border: `1px solid ${C.sage}` }}
                >
                  Partner Workspace
                </span>
                <span className="ff-body text-xs font-semibold text-stone-500">
                  Week 8 Postpartum · Supporting {herName}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <Flame size={13} className="text-amber-600 fill-amber-500" />
                  <span>{streak}-Day Support Streak</span>
                </div>
              </div>

              <h1 className="ff-display text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: C.ink }}>
                Good morning, {myName}
              </h1>
              <p className="ff-display text-base sm:text-lg italic mt-1 font-light" style={{ color: C.sageDark }}>
                "What can I do today to make things easier for {herName}?"
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="p-3.5 rounded-2xl glass-panel self-start md:self-auto flex items-center gap-4 shadow-sm">
              <div className="text-center pr-3 border-r" style={{ borderColor: C.lineLight }}>
                <p className="ff-body text-[10px] uppercase font-bold text-stone-500">Relief Shift</p>
                <p className="ff-display text-xl font-bold" style={{ color: C.sageDark }}>
                  {100 - choreSplit.me}%
                </p>
              </div>
              <div className="text-center">
                <p className="ff-body text-[10px] uppercase font-bold text-stone-500">Done Today</p>
                <p className="ff-display text-xl font-bold" style={{ color: C.ink }}>
                  {partnerContributions.tasksCompleted} tasks
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Today's Support Mission Hero */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-8 p-6 md:p-8 rounded-3xl relative overflow-hidden glass-panel"
          style={{
            border: `1.5px solid ${supportMission.color}`,
            background: supportMission.bg,
            boxShadow: shadows.md,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} style={{ color: supportMission.color }} />
                <span
                  className="ff-body text-xs font-bold uppercase tracking-wider"
                  style={{ color: supportMission.color }}
                >
                  Today's Primary Mission
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="ff-display text-2xl md:text-3xl font-bold mb-3" style={{ color: C.ink }}>
                {supportMission.title}
              </h2>
              <p className="ff-body text-sm leading-relaxed mb-4" style={{ color: C.inkMuted }}>
                {supportMission.subtitle}
              </p>

              {/* Mom's Vitals at a glance */}
              {recovery && (
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <span className="flex items-center gap-1">
                    <Moon size={13} style={{ color: C.sage }} /> Sleep: <b>{recovery.sleepHours}h</b>
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap size={13} style={{ color: C.sage }} /> Energy: <b>{recovery.energy}</b>
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={13} style={{ color: C.blushDeep }} /> Comfort: <b>{recovery.pain} Pain</b>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Button for Primary Mission */}
            <div className="shrink-0 flex flex-col gap-2">
              <Button
                variant="sage"
                size="lg"
                onClick={() => {
                  if (momTasksToTakeOver[0]) {
                    handleTakeOver(momTasksToTakeOver[0].id, momTasksToTakeOver[0].task);
                  } else {
                    triggerQuickAction("Cook Dinner & Clean Kitchen", "Cooking", 45);
                  }
                }}
                className="shadow-md font-semibold"
              >
                <Zap size={16} /> I'll Handle {supportMission.priorityChore}
              </Button>
              <span className="text-[11px] text-center text-stone-500">
                1-click auto-assigns to your active list
              </span>
            </div>
          </div>
        </motion.div>

        {/* 8. Help Requests from Mom (SOS / Priority Broadcast) */}
        {helpRequests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                  Direct Help Requests from {herName}
                </h3>
              </div>
              <span className="ff-body text-xs text-stone-500">
                {helpRequests.filter((h) => h.status !== "completed").length} active request(s)
              </span>
            </div>

            <div className="space-y-3">
              {helpRequests.map((req) => {
                const isDone = req.status === "completed";
                const isInProgress = req.status === "in_progress";
                return (
                  <Card
                    key={req.id}
                    hover={false}
                    className="!p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    style={{
                      background: isDone ? C.sageSoft : req.urgency === "High" ? C.blushSoft : "rgba(255,252,247,0.9)",
                      border: `1.5px solid ${isDone ? C.sage : req.urgency === "High" ? C.blush : C.line}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          background: isDone ? C.sageLight : C.blushLight,
                          color: isDone ? C.sageDark : C.blushDeep,
                        }}
                      >
                        <Heart size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="ff-body text-[11px] font-bold uppercase tracking-wider" style={{ color: isDone ? C.sageDark : C.blushDeep }}>
                            {req.urgency} Urgency · From {req.from}
                          </span>
                          {isInProgress && (
                            <Badge variant="warning">In Progress</Badge>
                          )}
                          {isDone && (
                            <Badge variant="steady">Completed</Badge>
                          )}
                        </div>
                        <p className={`ff-display text-base font-semibold ${isDone ? "line-through opacity-70" : ""}`} style={{ color: C.ink }}>
                          "{req.text}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {!isDone && (
                        <>
                          <Button
                            variant="sage"
                            size="sm"
                            onClick={() => handleRespondHelpRequest(req.id, "completed")}
                          >
                            <Check size={14} /> Mark Done
                          </Button>
                          {!isInProgress && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRespondHelpRequest(req.id, "in_progress")}
                            >
                              I'm on it
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Quick Support Actions Carousel / Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
              Quick 1-Click Support Actions
            </h3>
            <span className="ff-body text-xs text-stone-500">Tap to immediately claim and relieve</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: "Cook Dinner", icon: Utensils, cat: "Cooking", mins: 45 },
              { title: "3 AM Night Shift", icon: Moon, cat: "Night Care", mins: 40 },
              { title: "Refill Water/Snacks", icon: Droplet, cat: "Baby Care", mins: 10 },
              { title: "1-Hour Stroller Walk", icon: Clock, cat: "Baby Care", mins: 60 },
              { title: "Laundry Cycle", icon: Doodle.Laundry, cat: "Cleaning", mins: 35 },
              { title: "Pharmacy Run", icon: Doodle.Bag, cat: "Errands", mins: 25 },
            ].map((act) => {
              const IconComp = act.icon;
              return (
                <motion.button
                  key={act.title}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ y: -3 }}
                  onClick={() => triggerQuickAction(act.title, act.cat, act.mins)}
                  className="p-3.5 rounded-2xl glass-panel text-left flex flex-col justify-between transition-all hover:border-emerald-600 shadow-xs cursor-pointer select-none"
                  style={{ border: `1px solid ${C.lineLight}` }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 shadow-xs" style={{ background: C.sageLight, color: C.sageDark }}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="ff-display text-xs font-bold leading-snug mb-0.5" style={{ color: C.ink }}>
                      {act.title}
                    </p>
                    <p className="ff-body text-[10px] text-stone-500 font-medium">
                      ~{act.mins} mins
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tabbed Interactive Duty Center */}
        <div className="mb-8">
          <div className="flex rounded-2xl p-1.5 glass-panel mb-6 flex-wrap gap-1" style={{ border: `1px solid ${C.lineLight}` }}>
            {[
              { id: "todo", label: "My Active Tasks", count: myActiveTasks.length + myPendingTasks.length },
              { id: "takeover", label: "Take Over From Mom", count: momTasksToTakeOver.length, highlight: true },
              { id: "appointments", label: "Upcoming Appointments", count: appointments.length },
              { id: "completed", label: "Completed Log", count: myCompletedTasks.length },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all select-none"
                  style={{
                    background: isSelected ? C.cream : "transparent",
                    color: isSelected ? C.ink : C.inkSoft,
                    boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: tab.highlight && tab.count > 0 ? C.blushLight : isSelected ? C.sageLight : C.paperDeep,
                      color: tab.highlight && tab.count > 0 ? C.blushDeep : isSelected ? C.sageDark : C.inkSoft,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Partner Active Tasks */}
          {activeTab === "todo" && (
            <div className="space-y-4">
              {myPendingTasks.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="ff-body text-xs font-bold uppercase tracking-wider text-amber-800">
                    Awaiting Your Confirmation ({myPendingTasks.length})
                  </p>
                  {myPendingTasks.map((t) => {
                    const IconComp = getCategoryIcon(t.category);
                    return (
                      <Card key={t.id} hover={false} className="!p-4 bg-amber-50/70 border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                            <IconComp className="w-5 h-5" />
                          </span>
                          <div>
                            <p className="ff-display text-sm font-bold" style={{ color: C.ink }}>{t.task}</p>
                            <p className="ff-body text-xs text-stone-500">Assigned to you by {herName} · ~{t.estMins || 30} mins</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="sage" size="sm" onClick={() => handleAcceptTask(t.id, t.task)}>
                            <Check size={13} /> Accept Task
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h4 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                  Active Tasks on Your List
                </h4>
                <span className="ff-body text-xs text-stone-500">
                  Mark complete when done to update Mom's dashboard
                </span>
              </div>

              {myActiveTasks.length === 0 ? (
                <Card className="py-12 text-center text-stone-500">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-600 opacity-60" />
                  <p className="ff-display text-base font-semibold" style={{ color: C.ink }}>
                    Your active task queue is clear!
                  </p>
                  <p className="ff-body text-xs mt-1 max-w-sm mx-auto">
                    Switch to the <b>"Take Over From Mom"</b> tab to relieve chores from {herName}'s plate.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {myActiveTasks.map((t) => {
                    const IconComp = getCategoryIcon(t.category);
                    return (
                      <Card
                        key={t.id}
                        hover={false}
                        className="!p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel"
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs" style={{ background: C.sageLight, color: C.sageDark }}>
                            <IconComp className="w-5 h-5" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="ff-body text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: C.paperDeep, color: C.inkSoft }}>
                                {t.category || "General"}
                              </span>
                              <span className="ff-body text-xs text-stone-500">~{t.estMins || 25} mins</span>
                            </div>
                            <p className="ff-display text-base font-bold" style={{ color: C.ink }}>
                              {t.task}
                            </p>
                            {t.notes && (
                              <p className="ff-body text-xs text-stone-500 italic mt-0.5">
                                "{t.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Button
                            variant="sage"
                            size="sm"
                            onClick={() => handleCompleteTask(t.id, t.task)}
                            className="font-semibold shadow-xs"
                          >
                            <Check size={14} /> Mark as Complete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemindMe(t)}
                          >
                            <Clock size={13} /> Remind Me
                          </Button>
                          <button
                            onClick={() => setSelectedTaskDetails(t)}
                            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-black/5"
                            title="View task details"
                          >
                            <Info size={16} />
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Quick Add Custom Chore */}
              <Card className="mt-6">
                <h4 className="ff-display text-sm font-bold mb-3" style={{ color: C.ink }}>
                  Add a New Chore for Yourself
                </h4>
                <form onSubmit={handleAddCustomTask} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={customTaskName}
                    onChange={(e) => setCustomTaskName(e.target.value)}
                    placeholder="e.g. Clean sterilizer, Order grocery staples, Wash bottles..."
                    className="ff-body flex-1 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-600 transition-colors"
                    style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                  <select
                    value={customTaskCategory}
                    onChange={(e) => setCustomTaskCategory(e.target.value)}
                    className="ff-body px-3 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                  >
                    <option>Baby Care</option>
                    <option>Cooking</option>
                    <option>Cleaning</option>
                    <option>Night Care</option>
                    <option>Errands</option>
                  </select>
                  <Button
                    type="submit"
                    variant="sage"
                    size="sm"
                    disabled={!customTaskName.trim()}
                    className="shrink-0 justify-center"
                  >
                    <Plus size={14} /> Add to My Board
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {/* TAB 2: Take Over From Mom */}
          {activeTab === "takeover" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-panel mb-4 flex items-start gap-3" style={{ background: C.sageSoft, border: `1px solid ${C.sage}` }}>
                <Sparkles size={18} style={{ color: C.sageDark }} className="shrink-0 mt-0.5" />
                <div>
                  <p className="ff-display text-sm font-bold" style={{ color: C.sageDark }}>
                    Relieve {herName}'s Domestic Load
                  </p>
                  <p className="ff-body text-xs text-stone-600 leading-relaxed">
                    These tasks are currently on {herName}'s plate. Clicking <b>"I'll handle this"</b> transfers the task directly to your board and instantly updates her dashboard.
                  </p>
                </div>
              </div>

              {momTasksToTakeOver.length === 0 ? (
                <Card className="py-12 text-center text-stone-500">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-600 opacity-60" />
                  <p className="ff-display text-base font-semibold" style={{ color: C.ink }}>
                    {herName} has no pending tasks!
                  </p>
                  <p className="ff-body text-xs mt-1">
                    She has cleared her list or all chores have already been shared.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {momTasksToTakeOver.map((t) => {
                    const IconComp = getCategoryIcon(t.category);
                    return (
                      <Card
                        key={t.id}
                        hover={false}
                        className="!p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel hover:border-emerald-600 transition-colors"
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs" style={{ background: C.blushLight, color: C.blushDeep }}>
                            <IconComp className="w-5 h-5" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="ff-body text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ background: C.blushSoft, color: C.blushDeep }}>
                                On {herName}'s List
                              </span>
                              <span className="ff-body text-xs text-stone-500">~{t.estMins || 30} mins</span>
                            </div>
                            <p className="ff-display text-base font-bold" style={{ color: C.ink }}>
                              {t.task}
                            </p>
                            {t.notes && (
                              <p className="ff-body text-xs text-stone-500 italic mt-0.5">
                                "{t.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Button
                            variant="sage"
                            size="sm"
                            onClick={() => handleTakeOver(t.id, t.task)}
                            className="font-semibold shadow-xs"
                          >
                            <Zap size={14} /> I'll Handle This (Take Over)
                          </Button>
                          <button
                            onClick={() => setSelectedTaskDetails(t)}
                            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-black/5"
                            title="View task details"
                          >
                            <Info size={16} />
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Upcoming Appointments */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                  Pediatrician & Recovery Appointments
                </h4>
                <span className="ff-body text-xs text-stone-500">Sync with your calendar</span>
              </div>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <Card key={apt.id} hover={false} className="!p-5 glass-panel">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs" style={{ background: C.sageLight, color: C.sageDark }}>
                          <Calendar size={20} />
                        </div>
                        <div>
                          <span className="ff-body text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                            {apt.date}
                          </span>
                          <h4 className="ff-display text-lg font-bold mt-0.5" style={{ color: C.ink }}>
                            {apt.title}
                          </h4>
                          <p className="ff-body text-xs text-stone-600 mt-1">
                            {apt.doctor} · <span className="font-semibold">{apt.location}</span>
                          </p>
                          {apt.notes && (
                            <p className="ff-body text-xs text-stone-500 italic mt-2">
                              📌 "{apt.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleAppointment(apt.id)}
                          className="ff-body text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 shadow-xs"
                          style={{
                            background: apt.partnerCovering ? C.sage : C.paperDeep,
                            color: apt.partnerCovering ? C.cream : C.inkSoft,
                            border: `1px solid ${apt.partnerCovering ? C.sage : C.line}`,
                          }}
                        >
                          <Check size={13} />
                          {apt.partnerCovering ? "You're Attending / Driving" : "Offer to Accompany"}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Completed Log */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                  Recent Contributions Completed by You
                </h4>
                <Badge variant="steady">{myCompletedTasks.length} Completed</Badge>
              </div>

              {myCompletedTasks.length === 0 ? (
                <Card className="py-12 text-center text-stone-500">
                  <p className="ff-display text-base">No tasks completed yet today</p>
                  <p className="ff-body text-xs mt-1">Complete an active chore above to log your impact.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {myCompletedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl glass-panel flex items-center justify-between"
                      style={{ border: `1px solid ${C.lineLight}` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                          <Check size={16} />
                        </span>
                        <div>
                          <p className="ff-display text-sm font-bold line-through opacity-80" style={{ color: C.ink }}>
                            {t.task}
                          </p>
                          <p className="ff-body text-[11px] text-stone-500">
                            Completed at {t.completedAt || "Earlier today"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="steady">Verified</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. Shared Household Workload Overview & 11. AI Support Suggestions (2-Column) */}
        <div className="grid md:grid-cols-12 gap-6 mb-8">
          {/* Workload Donut */}
          <div className="md:col-span-6">
            <Card className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: C.lineLight }}>
                  <div className="flex items-center gap-2">
                    <Doodle.Laundry className="w-5 h-5" style={{ color: C.sageDark }} />
                    <h4 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                      Shared Domestic Split
                    </h4>
                  </div>
                  <span className="ff-body text-xs font-semibold" style={{ color: C.sageDark }}>
                    You: {100 - choreSplit.me}%
                  </span>
                </div>

                <div className="flex items-center justify-center py-2" style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Mom's Share", value: choreSplit.me },
                          { name: "Your Share", value: 100 - choreSplit.me },
                        ]}
                        dataKey="value"
                        innerRadius={44}
                        outerRadius={68}
                        paddingAngle={4}
                      >
                        <Cell fill={C.blushDeep} />
                        <Cell fill={C.sage} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-6 text-xs mt-2">
                  <span className="flex items-center gap-1.5 font-medium" style={{ color: C.ink }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.blushDeep }} /> {herName} ({choreSplit.me}%)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium" style={{ color: C.ink }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.sage }} /> You ({100 - choreSplit.me}%)
                  </span>
                </div>
              </div>

              <p className="ff-body text-[11px] text-stone-500 text-center mt-4">
                Taking over 1 more chore moves the balance closer to equal 50/50.
              </p>
            </Card>
          </div>

          {/* AI Support Suggestions */}
          <div className="md:col-span-6">
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: C.lineLight }}>
                <Lightbulb size={16} style={{ color: C.gold }} />
                <h4 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                  Postpartum Partner Insights
                </h4>
              </div>

              <div className="space-y-3">
                {aiTips.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={tip.title}
                      className="p-3 rounded-2xl glass-panel flex items-start gap-3"
                      style={{ border: `1px solid ${C.lineLight}` }}
                    >
                      <span className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs" style={{ background: C.sageLight, color: C.sageDark }}>
                        <Icon size={14} />
                      </span>
                      <div>
                        <p className="ff-display text-xs font-bold" style={{ color: C.ink }}>
                          {tip.title}
                        </p>
                        <p className="ff-body text-[11px] text-stone-600 leading-snug mt-0.5">
                          {tip.tip}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* 13. Notifications & Important Updates Drawer */}
        {notifications.length > 0 && (
          <div className="p-4 rounded-3xl glass-panel mb-8" style={{ border: `1px solid ${C.lineLight}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={15} style={{ color: C.sageDark }} />
              <h4 className="ff-display text-sm font-bold" style={{ color: C.ink }}>
                Shared Activity & Updates
              </h4>
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="text-xs p-2.5 rounded-xl bg-white/70 flex items-center justify-between">
                  <span className="ff-body text-stone-700">{n.text}</span>
                  <span className="text-[10px] text-stone-400 font-mono">Just now</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTaskDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(43, 38, 32, 0.6)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="p-6 md:p-8 rounded-3xl glass-panel max-w-md w-full relative shadow-2xl"
              style={{ background: C.cream, border: `1.5px solid ${C.sage}` }}
            >
              <button
                onClick={() => setSelectedTaskDetails(null)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant="steady">{selectedTaskDetails.category || "Household"}</Badge>
                <span className="text-xs text-stone-500">~{selectedTaskDetails.estMins || 30} mins</span>
              </div>

              <h3 className="ff-display text-2xl font-bold mb-3" style={{ color: C.ink }}>
                {selectedTaskDetails.task}
              </h3>

              <div className="space-y-3 p-4 rounded-2xl mb-6" style={{ background: C.paperDeep }}>
                <p className="text-xs text-stone-700">
                  <b>Currently Handled By:</b> {selectedTaskDetails.by === "Me" ? `${herName} (Mom)` : `${myName} (Partner)`}
                </p>
                <p className="text-xs text-stone-700">
                  <b>Status:</b> {selectedTaskDetails.status}
                </p>
                {selectedTaskDetails.notes && (
                  <p className="text-xs text-stone-600 italic">
                    <b>Notes:</b> "{selectedTaskDetails.notes}"
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {selectedTaskDetails.by === "Me" && selectedTaskDetails.status !== "completed" && (
                  <Button
                    variant="sage"
                    size="md"
                    onClick={() => {
                      handleTakeOver(selectedTaskDetails.id, selectedTaskDetails.task);
                      setSelectedTaskDetails(null);
                    }}
                    className="flex-1 justify-center"
                  >
                    <Zap size={14} /> I'll Handle This (Take Over)
                  </Button>
                )}
                {selectedTaskDetails.by === "Partner" && selectedTaskDetails.status !== "completed" && (
                  <Button
                    variant="sage"
                    size="md"
                    onClick={() => {
                      handleCompleteTask(selectedTaskDetails.id, selectedTaskDetails.task);
                      setSelectedTaskDetails(null);
                    }}
                    className="flex-1 justify-center"
                  >
                    <Check size={14} /> Complete Task
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedTaskDetails(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
