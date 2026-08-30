// ReadinessBridge.js
// Career Restart Bridge with Curated Course Tracks & 10 Industry Weekly 15-Minute Micro-Refresh Tracks

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Clock,
  Play,
  Eye,
  Sparkles,
  Layout,
  Code2,
  Terminal,
  DollarSign,
  BarChart3,
  GraduationCap,
  ShieldCheck,
  Globe,
  TrendingUp,
  Award,
  Cloud,
  Briefcase,
  Plus,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Target,
  BookOpen,
} from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar } from "../ui/chrome";
import {
  COURSE_TRACKS,
  getCareerVideosByTrack,
  formatTotalWatchTime,
} from "../services/videoService";
import {
  UPSKILLING_TRACKS,
  getUpskillingTrack,
} from "../services/upskillingService";
import { VideoPlayerModal } from "../ui/VideoPlayerModal";
import { useAppState, selectTotalWatchStats } from "../state/store";

export default function ReadinessBridge({ capacityHrs: propCapacityHrs, skills: propSkills = [], toggleSkill, go }) {
  const { state, dispatch } = useAppState();
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [activeMicroTrackId, setActiveMicroTrackId] = useState("uiux");
  const [activeVideoForPlayer, setActiveVideoForPlayer] = useState(null);
  const [expandedDrillId, setExpandedDrillId] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTask, setCustomTask] = useState({
    day: "Monday",
    name: "",
    mins: 15,
    tag: "Custom",
    drill: "",
  });

  // Track-specific tasks state with local storage fallback
  const [trackTasksMap, setTrackTasksMap] = useState(() => {
    const map = {};
    UPSKILLING_TRACKS.forEach((track) => {
      map[track.id] = track.tasks;
    });
    return map;
  });

  const activeTrackObj = useMemo(() => {
    return getUpskillingTrack(activeMicroTrackId);
  }, [activeMicroTrackId]);

  const currentTasks = trackTasksMap[activeMicroTrackId] || activeTrackObj.tasks;
  const doneTasks = currentTasks.filter((t) => t.done).length;
  const trackPct = currentTasks.length ? Math.round((doneTasks / currentTasks.length) * 100) : 0;

  // Global microtasks stats
  const capacityHrs =
    propCapacityHrs !== undefined
      ? propCapacityHrs
      : (() => {
          let base = 8;
          if (state.recovery) {
            const energy = state.recovery.energy;
            const sleep = state.recovery.sleepHours;
            base = energy === "Low" || sleep < 5 ? 3 : energy === "Okay" ? 6 : 9;
          }
          return Math.max(2, base);
        })();

  const handleToggleTask = (taskId, day) => {
    setTrackTasksMap((prev) => {
      const updatedList = (prev[activeMicroTrackId] || []).map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      );
      return { ...prev, [activeMicroTrackId]: updatedList };
    });

    if (toggleSkill) {
      toggleSkill(day);
    } else {
      dispatch({ type: "TOGGLE_MICROTASK", payload: day });
    }
  };

  const handleResetTrack = () => {
    setTrackTasksMap((prev) => {
      const resetList = (prev[activeMicroTrackId] || []).map((t) => ({ ...t, done: false }));
      return { ...prev, [activeMicroTrackId]: resetList };
    });
  };

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!customTask.name.trim()) return;

    const newTask = {
      id: `custom-${Date.now()}`,
      day: customTask.day,
      name: customTask.name.trim(),
      mins: Number(customTask.mins) || 15,
      tag: customTask.tag.trim() || "Custom Skill",
      drill: customTask.drill.trim() || "Complete your self-paced practice session.",
      keyTakeaway: "Personalized micro-learning tailored to your specific return goals.",
      done: false,
    };

    setTrackTasksMap((prev) => ({
      ...prev,
      [activeMicroTrackId]: [...(prev[activeMicroTrackId] || []), newTask],
    }));

    setCustomTask({ day: "Monday", name: "", mins: 15, tag: "Custom", drill: "" });
    setShowCustomModal(false);
  };

  // Filter videos by selected track
  const filteredVideos = useMemo(() => {
    return getCareerVideosByTrack(selectedTrack, state);
  }, [selectedTrack, state]);

  const watchStats = useMemo(() => {
    return selectTotalWatchStats(state);
  }, [state]);

  const getTrackIcon = (iconName, size = 15) => {
    switch (iconName) {
      case "Layout":
        return <Layout size={size} />;
      case "Code2":
        return <Code2 size={size} />;
      case "Terminal":
        return <Terminal size={size} />;
      case "DollarSign":
        return <DollarSign size={size} />;
      case "BarChart3":
        return <BarChart3 size={size} />;
      case "Globe":
        return <Globe size={size} />;
      case "TrendingUp":
        return <TrendingUp size={size} />;
      case "Award":
        return <Award size={size} />;
      case "Cloud":
        return <Cloud size={size} />;
      case "Briefcase":
        return <Briefcase size={size} />;
      default:
        return <Sparkles size={size} />;
    }
  };

  return (
    <Screen className="pb-16">
      <div className="max-w-4xl mx-auto">
        <TopBar
          title="Career Readiness Bridge"
          subtitle="Micro-learning paced around real capacity, not ideal time"
          onBack={() => go("dashboard")}
          role="mom"
          activeScreen="readiness"
          go={go}
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          {/* Capacity Banner */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="p-6 md:p-8 rounded-3xl glass-panel relative overflow-hidden" style={{ border: `1.5px solid ${C.line}` }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={15} style={{ color: C.sageDark }} />
                    <span className="ff-body text-xs font-bold uppercase tracking-wider" style={{ color: C.sageDark }}>
                      Available Free Capacity This Week
                    </span>
                  </div>
                  <h1 className="ff-display text-4xl md:text-5xl font-bold" style={{ color: C.ink }}>
                    {capacityHrs} <span className="text-xl font-normal text-stone-500">hours</span>
                  </h1>
                </div>

                <div className="text-right sm:self-center">
                  <div className="flex items-center gap-2">
                    <span className="ff-display text-2xl font-bold" style={{ color: C.sageDark }}>{trackPct}%</span>
                    <span className="ff-body text-xs text-stone-500">({doneTasks}/{currentTasks.length} done)</span>
                  </div>
                  <div className="w-36 bg-stone-200 h-2 rounded-full overflow-hidden mt-1.5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: C.sage }}
                      animate={{ width: `${trackPct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SECTION: 10 Upskilling Tracks & Weekly 15-Minute Micro-Refreshes */}
          {/* ========================================================================= */}
          <motion.div variants={fadeUp} className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Target size={16} />
                  </span>
                  <h2 className="ff-display text-2xl font-bold" style={{ color: C.ink }}>
                    Weekly 15-Minute Micro-Refreshes
                  </h2>
                </div>
                <p className="ff-body text-xs text-stone-500 mt-0.5">
                  Select an upskilling track below to load curated daily drills designed for returning mothers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomModal(true)}
                  className="text-xs"
                >
                  <Plus size={13} /> Add Custom Drill
                </Button>
                {doneTasks > 0 && (
                  <button
                    onClick={handleResetTrack}
                    className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors text-xs flex items-center gap-1 font-medium"
                    title="Reset completed drills for this track"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* 10 Upskilling Track Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {UPSKILLING_TRACKS.map((track) => {
                const isSelected = activeMicroTrackId === track.id;
                const trackTasksList = trackTasksMap[track.id] || track.tasks;
                const completedInTrack = trackTasksList.filter((t) => t.done).length;

                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setActiveMicroTrackId(track.id);
                      setSelectedTrack(track.id);
                    }}
                    className="px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all select-none shadow-xs group"
                    style={{
                      background: isSelected ? C.sageDark : "rgba(255, 252, 247, 0.9)",
                      color: isSelected ? C.cream : C.ink,
                      border: `1.5px solid ${isSelected ? C.sageDark : C.lineLight}`,
                    }}
                  >
                    {getTrackIcon(track.icon, 14)}
                    <span>{track.shortLabel}</span>
                    {completedInTrack > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected ? "bg-emerald-950 text-emerald-200" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {completedInTrack}/{trackTasksList.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Track Highlight Banner */}
            <div
              className="p-5 rounded-3xl glass-panel mb-5 border transition-all"
              style={{
                borderColor: C.lineLight,
                background: "rgba(255, 252, 247, 0.95)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="ff-body text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                      {activeTrackObj.category}
                    </span>
                    <span className="ff-body text-xs text-stone-500">
                      Target: <b className="text-stone-800">{activeTrackObj.targetRole}</b>
                    </span>
                  </div>
                  <h3 className="ff-display text-base font-bold" style={{ color: C.ink }}>
                    {activeTrackObj.label}
                  </h3>
                  <p className="ff-body text-xs text-stone-600 max-w-xl">
                    {activeTrackObj.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => {
                      setSelectedTrack(activeMicroTrackId);
                      const videoSection = document.getElementById("video-learning-studio");
                      if (videoSection) videoSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-700 hover:text-white transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <BookOpen size={13} /> View Video Lessons
                  </button>
                </div>
              </div>
            </div>

            {/* Microtasks Cards Grid / List */}
            <div className="space-y-3">
              {currentTasks.map((task) => {
                const isExpanded = expandedDrillId === task.id;

                return (
                  <Card
                    key={task.id}
                    hover={false}
                    className="!p-0 overflow-hidden transition-all shadow-xs"
                    style={{
                      background: task.done ? C.sageSoft : "rgba(255, 252, 247, 0.88)",
                      border: `1.5px solid ${task.done ? C.sage : C.lineLight}`,
                    }}
                  >
                    <div className="p-4 sm:px-5 flex items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        {/* Interactive Checkbox */}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleToggleTask(task.id, task.day)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs shrink-0 mt-0.5 sm:mt-0 cursor-pointer"
                          style={{
                            background: task.done ? C.sage : "white",
                            border: `2px solid ${task.done ? C.sage : C.line}`,
                          }}
                          title={task.done ? "Mark as uncompleted" : "Mark as completed"}
                        >
                          <AnimatePresence>
                            {task.done && (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check size={15} color={C.cream} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span
                              className="ff-body text-[11px] font-bold uppercase tracking-wider"
                              style={{ color: task.done ? C.sageDark : C.inkSoft }}
                            >
                              {task.day}
                            </span>
                            <span className="ff-body text-[10px] px-2 py-0.2 rounded-full bg-stone-200 text-stone-700 font-mono">
                              {task.mins} mins
                            </span>
                            <span className="ff-body text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                              {task.tag}
                            </span>
                          </div>
                          <p
                            className={`ff-display text-base font-bold leading-snug ${
                              task.done ? "line-through opacity-75 text-stone-600" : "text-stone-900"
                            }`}
                          >
                            {task.name}
                          </p>
                        </div>
                      </div>

                      {/* Expand Practice Drill Accordion Button */}
                      <button
                        onClick={() => setExpandedDrillId(isExpanded ? null : task.id)}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors text-stone-600 hover:text-emerald-900 hover:bg-stone-200/60 shrink-0"
                      >
                        <span className="hidden sm:inline">{isExpanded ? "Hide Drill" : "Practice Drill"}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    {/* Expandable Drill Instructions Box */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-4 pt-1 border-t bg-stone-50/70 text-xs space-y-2"
                          style={{ borderColor: C.lineLight }}
                        >
                          <div className="flex items-start gap-2 pt-2">
                            <span className="font-bold text-emerald-800 shrink-0">Today's 15-Min Action Step:</span>
                            <span className="text-stone-700 leading-relaxed">{task.drill}</span>
                          </div>
                          {task.keyTakeaway && (
                            <div className="flex items-start gap-2 pt-1 border-t border-stone-200/60">
                              <span className="font-bold text-stone-600 shrink-0">Industry Takeaway:</span>
                              <span className="text-stone-600 leading-relaxed">{task.keyTakeaway}</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SECTION: Career Upskilling Courses & Video Learning Studio */}
          {/* ========================================================================= */}
          <motion.div id="video-learning-studio" variants={fadeUp} className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </span>
                  <h2 className="ff-display text-2xl font-bold" style={{ color: C.ink }}>
                    Career Restart Video Courses & Upskilling Tracks
                  </h2>
                </div>
                <p className="ff-body text-xs text-stone-500 mt-0.5">
                  Select a skill track below. Study videos are vetted for returning mothers with automatic active watch-time tracking.
                </p>
              </div>

              {/* Total Study Time Logged Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel self-start sm:self-auto shrink-0 border border-emerald-300 shadow-xs">
                <Clock size={14} className="text-emerald-700" />
                <span className="ff-body text-xs font-semibold text-stone-700">
                  Study Logged:{" "}
                  <b className="text-emerald-800 font-bold">{formatTotalWatchTime(watchStats.totalSeconds)}</b>
                </span>
              </div>
            </div>

            {/* Course Track Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
              {COURSE_TRACKS.map((track) => {
                const isSelected = selectedTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className="px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all select-none shadow-xs"
                    style={{
                      background: isSelected ? C.sageDark : "rgba(255, 252, 247, 0.9)",
                      color: isSelected ? C.cream : C.ink,
                      border: `1.5px solid ${isSelected ? C.sageDark : C.lineLight}`,
                    }}
                  >
                    {getTrackIcon(track.icon)}
                    <span>{track.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Video Course Recommendations Grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl glass-panel overflow-hidden border flex flex-col justify-between group shadow-sm hover:shadow-md transition-all cursor-pointer"
                  style={{
                    background: "rgba(255, 252, 247, 0.95)",
                    borderColor: C.lineLight,
                  }}
                  onClick={() => setActiveVideoForPlayer(video)}
                >
                  <div>
                    {/* Video Thumbnail */}
                    <div className="relative w-full aspect-video overflow-hidden bg-stone-200">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Duration Overlay */}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-stone-950/80 text-white font-mono text-[10px] font-semibold backdrop-blur-xs">
                        {video.duration}
                      </span>

                      {/* Difficulty Badge */}
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-200 text-[10px] font-bold backdrop-blur-xs border border-emerald-500/30">
                        {video.difficulty || "Job-Ready"}
                      </span>

                      {/* Hover Play Button */}
                      <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                          <Play size={20} className="ml-0.5 text-emerald-800 fill-emerald-800" />
                        </div>
                      </div>
                    </div>

                    {/* Course Metadata Body */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="ff-body text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          {video.category}
                        </span>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {video.rating || "4.9 ★"}
                        </span>
                      </div>

                      <h3 className="ff-display text-base font-bold leading-snug text-stone-900 group-hover:text-emerald-900 transition-colors" title={video.title}>
                        {video.title}
                      </h3>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                        <span className="font-semibold text-stone-700 truncate max-w-[170px]">{video.creator}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Eye size={12} /> {video.views}
                        </span>
                      </div>

                      {/* Why Recommended for Returning Mothers */}
                      <div
                        className="p-2.5 rounded-2xl text-[11px] font-medium flex items-start gap-2"
                        style={{ background: C.sageSoft, color: C.sageDark }}
                      >
                        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                        <p className="leading-snug text-emerald-950 font-normal">
                          <b className="font-semibold">Career Return Advantage:</b> {video.whyRecommended}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Watch & Track Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVideoForPlayer(video);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all text-emerald-900 bg-emerald-100 hover:bg-emerald-700 hover:text-white shadow-xs"
                    >
                      <Play size={13} /> Start Course & Track Study Time
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA to Readiness Card */}
          <motion.div variants={fadeUp}>
            <Button variant="sage" size="lg" onClick={() => go("readinesscard")} className="w-full justify-between shadow-md">
              <span>View & Share Your Readiness Credential</span>
              <ChevronRight size={16} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Modal: Add Custom 15-Minute Micro-Task */}
        <AnimatePresence>
          {showCustomModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs"
                onClick={() => setShowCustomModal(false)}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative z-10 w-full max-w-md p-6 rounded-3xl glass-panel shadow-2xl space-y-4"
                style={{ background: "rgba(255, 252, 247, 0.98)", border: `1.5px solid ${C.line}` }}
              >
                <div>
                  <h3 className="ff-display text-lg font-bold" style={{ color: C.ink }}>
                    Add Custom 15-Minute Micro-Refresh
                  </h3>
                  <p className="ff-body text-xs text-stone-500">
                    Add a personalized learning drill to your {activeTrackObj.shortLabel} track.
                  </p>
                </div>

                <form onSubmit={handleAddCustomTask} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Target Day of Week</label>
                    <select
                      value={customTask.day}
                      onChange={(e) => setCustomTask({ ...customTask, day: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 outline-none focus:border-emerald-600"
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Drill Title / Focus Skill</label>
                    <input
                      type="text"
                      required
                      value={customTask.name}
                      onChange={(e) => setCustomTask({ ...customTask, name: e.target.value })}
                      placeholder="e.g., Read Chapter 3 of Clean Code, Design Mobile Nav..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Duration (Mins)</label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={customTask.mins}
                        onChange={(e) => setCustomTask({ ...customTask, mins: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Skill Tag</label>
                      <input
                        type="text"
                        value={customTask.tag}
                        onChange={(e) => setCustomTask({ ...customTask, tag: e.target.value })}
                        placeholder="e.g. React, UX, SQL"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">15-Min Action Drill (Instructions)</label>
                    <textarea
                      rows="2"
                      value={customTask.drill}
                      onChange={(e) => setCustomTask({ ...customTask, drill: e.target.value })}
                      placeholder="What specific practice exercise will you complete during this window?"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowCustomModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="sage" size="sm">
                      Add to Weekly Schedule
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Interactive Video Player Modal */}
        <VideoPlayerModal
          video={activeVideoForPlayer}
          isOpen={Boolean(activeVideoForPlayer)}
          onClose={() => setActiveVideoForPlayer(null)}
        />
      </div>
    </Screen>
  );
}
