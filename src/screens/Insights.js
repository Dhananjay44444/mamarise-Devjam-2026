import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Scale, Award, Video, Clock, CheckCircle2 } from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, TopBar, Badge } from "../ui/chrome";
import { useAppState, selectTotalWatchStats } from "../state/store";
import { formatTotalWatchTime } from "../services/videoService";

function capacityLabel(recovery) {
  if (!recovery) return "Moderate";
  if (recovery.energy === "Low" || recovery.sleepHours < 5) return "Low";
  if (recovery.energy === "Okay") return "Moderate";
  return "Good";
}

export default function Insights({ recovery, choreSplit, skills = [], go }) {
  const { state } = useAppState();
  const watchStats = selectTotalWatchStats(state);

  const done = skills.filter((s) => s.done).length;
  const radialPct = skills.length ? Math.round((done / skills.length) * 100) : 0;
  const radialData = [{ name: "done", value: radialPct, fill: C.sage }];

  const trend = [
    { d: "Mon", cap: 5 },
    { d: "Tue", cap: 4 },
    { d: "Wed", cap: 6 },
    { d: "Thu", cap: 3 },
    { d: "Fri", cap: 5 },
    { d: "Sat", cap: 7 },
    {
      d: "Sun",
      cap: recovery
        ? capacityLabel(recovery) === "Low"
          ? 3
          : capacityLabel(recovery) === "Moderate"
            ? 6
            : 9
        : 5,
    },
  ];

  return (
    <Screen className="pb-16">
      <div className="max-w-4xl mx-auto">
        <TopBar
          title="Recovery & Load Analytics"
          subtitle="Trends and objective progression data"
          onBack={() => go("dashboard")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="ff-display text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: C.ink }}>
              Your Journey at a Glance
            </h1>
            <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
              Encouraging progress metrics derived from your daily check-ins and shared task board.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Chart 1: Load Split */}
            <motion.div variants={fadeUp}>
              <Card className="h-full">
                <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: C.lineLight }}>
                  <div className="flex items-center gap-2">
                    <Scale size={16} style={{ color: C.blushDeep }} />
                    <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                      Household Load Balance
                    </h3>
                  </div>
                  <span className="ff-body text-xs font-semibold" style={{ color: C.blushDeep }}>
                    You: {choreSplit.me}%
                  </span>
                </div>

                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "You", value: choreSplit.me },
                          { name: "Partner", value: choreSplit.partner },
                        ]}
                        dataKey="value"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        <Cell fill={C.blushDeep} />
                        <Cell fill={C.sage} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-6 text-xs ff-body mt-2">
                  <span className="flex items-center gap-2" style={{ color: C.ink }}>
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: C.blushDeep }} /> You ({choreSplit.me}%)
                  </span>
                  <span className="flex items-center gap-2" style={{ color: C.ink }}>
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: C.sage }} /> Partner ({choreSplit.partner}%)
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* Chart 2: Skill Refresh Pace */}
            <motion.div variants={fadeUp}>
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: C.lineLight }}>
                    <div className="flex items-center gap-2">
                      <Award size={16} style={{ color: C.sageDark }} />
                      <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                        Weekly Micro-Refreshes
                      </h3>
                    </div>
                    <span className="ff-body text-xs font-semibold" style={{ color: C.sageDark }}>
                      {done}/{skills.length} Complete
                    </span>
                  </div>

                  <div style={{ width: "100%", height: 160 }} className="relative flex items-center justify-center">
                    <ResponsiveContainer>
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={radialData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar dataKey="value" cornerRadius={20} background={{ fill: C.paperDeep }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="ff-display text-3xl font-bold" style={{ color: C.ink }}>
                        {radialPct}%
                      </span>
                      <span className="ff-body text-[10px] text-stone-500 uppercase font-bold">Goal Pace</span>
                    </div>
                  </div>
                </div>

                <p className="ff-body text-xs text-center mt-2" style={{ color: C.inkSoft }}>
                  {radialPct === 100
                    ? "All weekly microtasks completed! Outstanding consistency."
                    : "Paced for low-stress retention and return readiness."}
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Chart 3: Weekly Capacity Trend */}
          <motion.div variants={fadeUp} className="mb-6">
            <Card>
              <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: C.lineLight }}>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} style={{ color: C.sage }} />
                  <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                    Capacity Trend (Hours / Day)
                  </h3>
                </div>
                <span className="ff-body text-xs text-stone-500">7-Day Moving Window</span>
              </div>

              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={trend}>
                    <CartesianGrid stroke={C.lineLight} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="d" stroke={C.inkSoft} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cap"
                      name="Capacity (hrs)"
                      stroke={C.sage}
                      strokeWidth={3}
                      dot={{ fill: C.sage, r: 5, stroke: C.cream, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Card 4: Wellness Video Learning & Watch Duration */}
          <motion.div variants={fadeUp}>
            <Card>
              <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: C.lineLight }}>
                <div className="flex items-center gap-2">
                  <Video size={16} style={{ color: C.sageDark }} />
                  <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                    Wellness & Recovery Studio Learning Time
                  </h3>
                </div>
                <Badge variant="steady">
                  <Clock size={12} /> {formatTotalWatchTime(watchStats.totalSeconds)} Total Logged
                </Badge>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="p-3.5 rounded-2xl glass-panel text-center" style={{ background: C.paperDeep }}>
                  <p className="ff-body text-[10px] uppercase font-bold text-stone-500">Active Watch Time</p>
                  <p className="ff-display text-2xl font-bold mt-1 text-emerald-800">
                    {formatTotalWatchTime(watchStats.totalSeconds)}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl glass-panel text-center" style={{ background: C.paperDeep }}>
                  <p className="ff-body text-[10px] uppercase font-bold text-stone-500">Sessions Completed</p>
                  <p className="ff-display text-2xl font-bold mt-1 text-stone-800">
                    {watchStats.totalSessions}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl glass-panel text-center" style={{ background: C.paperDeep }}>
                  <p className="ff-body text-[10px] uppercase font-bold text-stone-500">Verified Evidence-Based</p>
                  <p className="ff-display text-2xl font-bold mt-1 text-emerald-700">100%</p>
                </div>
              </div>

              {watchStats.recentSessions.length > 0 ? (
                <div>
                  <p className="ff-body text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Recent Watched Guidance Sessions
                  </p>
                  <div className="space-y-2">
                    {watchStats.recentSessions.map((s, idx) => (
                      <div
                        key={s.sessionId || idx}
                        className="p-3 rounded-xl glass-panel flex items-center justify-between text-xs"
                        style={{ border: `1px solid ${C.lineLight}` }}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                          <span className="font-semibold truncate text-stone-800">{s.videoTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {Math.max(1, Math.round((s.activeSeconds || 0) / 60))}m
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(s.watchedAt || Date.now()).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="ff-body text-xs text-stone-500 italic text-center py-2">
                  Watch recommended studio videos from your dashboard to log active recovery learning time.
                </p>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Screen>
  );
}
