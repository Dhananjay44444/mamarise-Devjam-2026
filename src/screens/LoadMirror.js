import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Plus,
  Check,
  Sparkles,
  AlertCircle,
  Heart,
  Send,
  CheckCheck,
  Zap,
  UserCheck,
} from "lucide-react";
import { C } from "../theme";
import { Screen, Card, Button, TopBar, Chip, Badge } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";
import { useAppState, selectChoreSplit } from "../state/store";
import { fetchAiRebalanceSuggestions } from "../services/dataService";

export default function LoadMirror({ chores = [], setChores, capacityLow, go }) {
  const { state, dispatch } = useAppState();
  const { helpRequests = [], partnerProfile, recovery } = state;
  const partnerName = partnerProfile?.name || "Partner";

  const [task, setTask] = useState("Laundry");
  const [customTaskName, setCustomTaskName] = useState("");
  const [by, setBy] = useState("Me");
  const [viewAs, setViewAs] = useState("me");
  const [helpInput, setHelpInput] = useState("");
  const [helpUrgency, setHelpUrgency] = useState("High");

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [rebalanceNotification, setRebalanceNotification] = useState(null);

  const pending = chores.filter((c) => c.status === "pending");
  const partnerTaken = chores.filter((c) => c.by === "Partner");

  const choreSplit = selectChoreSplit(state);
  const pct = choreSplit.me;

  const pieData = [
    { name: "You", value: pct },
    { name: partnerName, value: 100 - pct },
  ];

  // Load AI Rebalancing Suggestions from Gemini
  const loadAiSuggestions = async () => {
    try {
      const suggestions = await fetchAiRebalanceSuggestions(
        recovery || {},
        chores,
        choreSplit,
        partnerName
      );
      if (suggestions && suggestions.length > 0) {
        setAiSuggestions(suggestions);
      }
    } catch (err) {
      console.warn("Failed to fetch AI suggestions:", err);
    }
  };

  useEffect(() => {
    loadAiSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recovery?.sleepHours, recovery?.energy, recovery?.pain, chores.length]);

  const assignToPartner = (t, meta = {}) => {
    dispatch({
      type: "ASSIGN_TASK",
      payload: {
        task: typeof t === "string" ? t : t.name,
        by: "Partner",
        category: meta.category || (typeof t === "object" ? t.category : "Household"),
        estMins: meta.estMins || (typeof t === "object" ? t.estMins : 30),
        notes: meta.aiRationale || (typeof t === "object" ? t.aiRationale : `AI Rebalance recommendation for ${partnerName}`),
      },
    });

    const taskName = typeof t === "string" ? t : t.name;
    setRebalanceNotification(`✓ Shifted "${taskName}" to ${partnerName}. Domestic equity updating!`);
    setTimeout(() => setRebalanceNotification(null), 4000);
  };

  // 1-Click Auto-Rebalance to 50/50
  const handleAutoRebalance5050 = () => {
    // If Mom's load is over 50%, take top 2 high-strain AI suggested tasks and assign to Partner
    const tasksToAssign = aiSuggestions.slice(0, 2);
    tasksToAssign.forEach((item) => {
      dispatch({
        type: "ASSIGN_TASK",
        payload: {
          task: item.name,
          by: "Partner",
          category: item.category || "Household",
          estMins: item.estMins || 30,
          notes: `1-Click 50/50 Auto-Rebalance: ${item.aiRationale}`,
        },
      });
    });

    setRebalanceNotification(`✨ AI Auto-Rebalanced! Assigned 2 high-strain tasks to ${partnerName} to reach domestic equity.`);
    setTimeout(() => setRebalanceNotification(null), 5000);
  };

  const handleAddTask = () => {
    const finalTask = task === "Other" ? customTaskName.trim() || "Household Task" : task;
    dispatch({
      type: "ASSIGN_TASK",
      payload: {
        task: finalTask,
        by,
        category: task === "Other" ? "Household" : task,
        estMins: 30,
      },
    });
    if (task === "Other") setCustomTaskName("");
  };

  const handleSendHelpRequest = (e) => {
    e.preventDefault();
    if (!helpInput.trim()) return;
    dispatch({
      type: "SEND_HELP_REQUEST",
      payload: {
        text: helpInput.trim(),
        urgency: helpUrgency,
      },
    });
    setHelpInput("");
  };

  const respond = (id, accept) => {
    dispatch({ type: "RESPOND_TASK", payload: { id, accept } });
  };

  const getDoodleForTask = (taskName) => {
    if (taskName.includes("Laundry")) return Doodle.Laundry;
    if (taskName.includes("Cook") || taskName.includes("Dinner")) return Doodle.Pot;
    if (taskName.includes("Grocer") || taskName.includes("Pharmacy")) return Doodle.Bag;
    if (taskName.includes("Night") || taskName.includes("Sleep")) return Doodle.MoonRest;
    if (taskName.includes("Baby") || taskName.includes("Diaper")) return Doodle.Bottle;
    return Doodle.Broom;
  };

  return (
    <Screen className="pb-20">
      <div className="max-w-4xl mx-auto">
        <TopBar
          title="Load Mirror"
          subtitle="Objective, judgment-free household load sharing"
          onBack={() => go("dashboard")}
          onInsights={() => go("insights")}
          role="mom"
          activeScreen="loadmirror"
          go={go}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="ff-display text-3xl md:text-4xl font-bold tracking-tight" style={{ color: C.ink }}>
              Household Load Split
            </h1>
            <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
              Visualizing the domestic division without blame or friction.
            </p>
          </div>

          <div className="flex gap-2 p-1.5 rounded-2xl glass-panel self-start sm:self-auto">
            <Chip label="Your View" selected={viewAs === "me"} onClick={() => setViewAs("me")} />
            <Chip label={`${partnerName}'s View`} selected={viewAs === "partner"} onClick={() => setViewAs("partner")} />
          </div>
        </div>

        {viewAs === "partner" ? (
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: C.lineLight }}>
              <div>
                <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                  {partnerName}'s Task Inbox
                </h3>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                  Tasks requested by you awaiting partner confirmation
                </p>
              </div>
              <Badge variant="steady">{pending.filter((c) => c.by === "Partner").length} Pending</Badge>
            </div>

            {pending.filter((c) => c.by === "Partner").length === 0 ? (
              <div className="py-8 text-center" style={{ color: C.inkSoft }}>
                <CheckCheck size={32} className="mx-auto mb-2 text-emerald-600 opacity-60" />
                <p className="ff-display text-base" style={{ color: C.ink }}>Inbox is completely clear.</p>
                <p className="ff-body text-xs mt-1">All assigned chores have been confirmed or completed by {partnerName}.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {pending
                    .filter((c) => c.by === "Partner")
                    .map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-3.5 rounded-2xl"
                        style={{ background: C.paperDeep, border: `1px solid ${C.lineLight}` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs" style={{ background: C.cream, color: C.sageDark }}>
                            <Doodle.Laundry className="w-4 h-4" />
                          </span>
                          <span className="ff-body text-sm font-medium" style={{ color: C.ink }}>
                            {c.task}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="sage" size="sm" onClick={() => respond(c.id, true)}>
                            <Check size={12} /> Accept
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => respond(c.id, false)}>
                            Decline
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            )}
          </Card>
        ) : (
          <>
            {/* Split Donut & Overview Card */}
            <Card className="mb-8">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 flex justify-center">
                  <div style={{ width: 170, height: 170 }} className="relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          innerRadius={48}
                          outerRadius={74}
                          paddingAngle={4}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill={C.blushDeep} />
                          <Cell fill={C.sage} />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="ff-display text-xl font-bold" style={{ color: C.ink }}>
                        {pct}%
                      </span>
                      <span className="ff-body text-[10px] uppercase font-bold" style={{ color: C.blushDeep }}>
                        Your Load
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.lineLight }}>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: C.blushDeep }} />
                      <span className="ff-body text-sm font-medium" style={{ color: C.ink }}>You handle</span>
                    </div>
                    <span className="ff-display text-xl font-bold" style={{ color: C.blushDeep }}>{pct}%</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.lineLight }}>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: C.sage }} />
                      <span className="ff-body text-sm font-medium" style={{ color: C.ink }}>{partnerName} handles</span>
                    </div>
                    <span className="ff-display text-xl font-bold" style={{ color: C.sageDark }}>{100 - pct}%</span>
                  </div>

                  {/* Partner Real-Time Reassurance Banner */}
                  {partnerTaken.length > 0 && (
                    <div className="p-3 rounded-xl flex items-center justify-between text-xs glass-panel" style={{ background: C.sageSoft, border: `1px solid ${C.sage}` }}>
                      <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                        <Zap size={14} className="text-emerald-600" />
                        {partnerName} is actively covering {partnerTaken.length} task(s) on your behalf
                      </span>
                      <Badge variant="steady">Live Sync</Badge>
                    </div>
                  )}

                  {pending.length > 0 && (
                    <div className="p-3 rounded-xl flex items-center justify-between text-xs" style={{ background: C.blushSoft, color: C.blushDeep }}>
                      <span className="font-medium">{pending.length} chore(s) pending partner confirmation</span>
                      <Sparkles size={14} />
                    </div>
                  )}

                  {capacityLow && (
                    <div className="p-3 rounded-xl flex items-start gap-2 text-xs" style={{ background: C.sageSoft, color: C.sageDark }}>
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>Your recovery capacity is low today. Consider rebalancing 1-2 chores below.</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Direct SOS / Help Request Broadcaster */}
            <Card className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} style={{ color: C.blushDeep }} />
                <h3 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                  Broadcast a Direct Help Request to {partnerName}
                </h3>
              </div>
              <form onSubmit={handleSendHelpRequest} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={helpInput}
                  onChange={(e) => setHelpInput(e.target.value)}
                  placeholder="e.g. Can you please sterilize bottles before 8 PM, or bring warm soup?"
                  className="ff-body flex-1 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-rose-400 transition-colors"
                  style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                />
                <select
                  value={helpUrgency}
                  onChange={(e) => setHelpUrgency(e.target.value)}
                  className="ff-body px-3 py-2.5 rounded-xl text-xs outline-none"
                  style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <option value="High">High Urgency</option>
                  <option value="Medium">Medium</option>
                  <option value="Gentle">Gentle Request</option>
                </select>
                <Button
                  type="submit"
                  variant="blush"
                  size="sm"
                  disabled={!helpInput.trim()}
                  className="shrink-0 justify-center"
                >
                  <Send size={14} /> Send to Partner Desk
                </Button>
              </form>

              {helpRequests.length > 0 && (
                <div className="mt-4 pt-3 border-t space-y-2" style={{ borderColor: C.lineLight }}>
                  <p className="ff-body text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Active Help Requests ({helpRequests.length})
                  </p>
                  {helpRequests.map((req) => (
                    <div key={req.id} className="text-xs p-2.5 rounded-xl bg-white/70 flex items-center justify-between">
                      <span className="ff-body text-stone-800">"{req.text}"</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: req.status === "completed" ? C.sageLight : C.blushLight,
                          color: req.status === "completed" ? C.sageDark : C.blushDeep,
                        }}
                      >
                        {req.status === "completed" ? "Completed by Partner" : req.status === "in_progress" ? "Partner on it" : "Sent to Desk"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Bottom 2-Column: Task Logger & Smart Rebalance Recommendations (Equal Height Level) */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {/* Add / Log Task Card */}
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Plus size={16} style={{ color: C.sage }} />
                    <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>Log a Task</h3>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="ff-body text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: C.inkSoft }}>
                        Select Task
                      </label>
                      <select
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="ff-body w-full px-3.5 py-2.5 rounded-2xl outline-none text-xs"
                        style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                      >
                        {["Laundry", "Baby Care", "Night Wake-Up", "Cooking", "Cleaning", "Groceries", "Other"].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* 1-Tap Quick Task Shortcuts */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        { label: "Laundry", DoodleIcon: Doodle.Laundry },
                        { label: "Night Wake-Up", DoodleIcon: Doodle.MoonRest },
                        { label: "Cooking", DoodleIcon: Doodle.Pot },
                        { label: "Baby Care", DoodleIcon: Doodle.Bottle },
                        { label: "Groceries", DoodleIcon: Doodle.Bag },
                      ].map((item) => {
                        const IconComp = item.DoodleIcon;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setTask(item.label)}
                            className={`text-[11px] px-2.5 py-1 rounded-xl transition-all font-medium border flex items-center gap-1.5 cursor-pointer ${
                              task === item.label
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold"
                                : "bg-white/80 text-stone-600 border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {task === "Other" && (
                      <input
                        type="text"
                        value={customTaskName}
                        onChange={(e) => setCustomTaskName(e.target.value)}
                        placeholder="Enter chore name..."
                        className="ff-body w-full px-3.5 py-2.5 rounded-2xl outline-none text-xs"
                        style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                      />
                    )}

                    <div>
                      <label className="ff-body text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: C.inkSoft }}>
                        Handled By
                      </label>
                      <div className="flex gap-2">
                        <Chip label="Handled by Me" selected={by === "Me"} onClick={() => setBy("Me")} />
                        <Chip label={`Assign to ${partnerName}`} selected={by === "Partner"} onClick={() => setBy("Partner")} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Button variant="sage" onClick={handleAddTask} className="w-full justify-center">
                    <Plus size={14} /> Add to Shared Load
                  </Button>
                </div>
              </Card>

              {/* Smart Rebalance Suggestions Card */}
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} style={{ color: C.blushDeep }} />
                      <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                        Suggested to Rebalance
                      </h3>
                    </div>

                    {pct > 50 && (
                      <button
                        onClick={handleAutoRebalance5050}
                        className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl transition-colors border border-rose-200 flex items-center gap-1 cursor-pointer shrink-0"
                        title="Auto-assign tasks to partner to reach 50/50 balance"
                      >
                        <Zap size={11} /> Auto 50/50
                      </button>
                    )}
                  </div>

                  {/* AI Notification Toast */}
                  <AnimatePresence>
                    {rebalanceNotification && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-2 mb-3 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-200"
                      >
                        <UserCheck size={14} className="text-emerald-700 shrink-0" />
                        <span>{rebalanceNotification}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Suggestions Clean List (3 Perfectly Proportioned Items) */}
                  <div className="space-y-2.5">
                    {aiSuggestions.slice(0, 3).map((s) => (
                      <div
                        key={s.id || s.name}
                        className="p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                        style={{ background: C.paperDeep, border: `1px solid ${C.lineLight}` }}
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="ff-body text-xs font-bold truncate text-stone-900">
                            {s.name}
                          </p>
                          <p className="ff-body text-[11px] truncate text-stone-500">
                            {s.desc || s.aiRationale}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => assignToPartner(s)}
                          className="shrink-0 text-xs py-1 px-3"
                        >
                          Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Harmonious Footer Note */}
                <div className="pt-3 mt-auto">
                  <p className="ff-body text-[11px] text-stone-500 text-center">
                    Assigning sends a request directly to {partnerName}'s action desk.
                  </p>
                </div>
              </Card>
            </div>

            {/* Confirmed Task History */}
            <div className="mt-8">
              <h3 className="ff-display text-lg font-bold mb-4" style={{ color: C.ink }}>
                All Active & Completed Household Tasks
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {chores.slice(0, 9).map((c) => {
                  const IconComponent = getDoodleForTask(c.task);
                  const isCompleted = c.status === "completed";
                  const isPartner = c.by === "Partner";
                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl flex items-center gap-3 glass-panel"
                      style={{
                        border: `1.5px solid ${isCompleted ? C.sage : isPartner ? "rgba(95,135,102,0.4)" : C.lineLight}`,
                        background: isCompleted ? C.sageSoft : "rgba(255,252,247,0.85)",
                      }}
                    >
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          background: isCompleted ? C.sageLight : isPartner ? C.sageLight : C.blushLight,
                          color: isCompleted ? C.sageDark : isPartner ? C.sageDark : C.blushDeep,
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </span>
                      <div className="overflow-hidden flex-1">
                        <p className={`ff-body text-xs font-semibold truncate ${isCompleted ? "line-through opacity-75" : ""}`} style={{ color: C.ink }}>
                          {c.task}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="ff-body text-[10px] font-bold" style={{ color: isPartner ? C.sageDark : C.blushDeep }}>
                            {isPartner ? `${partnerName}` : "You"}
                          </span>
                          <span className="text-[10px] text-stone-400">·</span>
                          <span className="ff-body text-[10px] text-stone-500">
                            {isCompleted ? "Done" : c.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
