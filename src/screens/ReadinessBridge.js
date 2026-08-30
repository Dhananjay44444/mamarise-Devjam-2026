// ReadinessBridge.js
// Career Restart Bridge with Curated Course Tracks (UI/UX, Python, Java, Self-Financing, Data) and Watch Tracking

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
} from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar } from "../ui/chrome";
import {
  COURSE_TRACKS,
  getCareerVideosByTrack,
  formatTotalWatchTime,
} from "../services/videoService";
import { VideoPlayerModal } from "../ui/VideoPlayerModal";
import { useAppState, selectTotalWatchStats } from "../state/store";

export default function ReadinessBridge({ capacityHrs, skills = [], toggleSkill, go }) {
  const { state } = useAppState();
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [activeVideoForPlayer, setActiveVideoForPlayer] = useState(null);

  const done = skills.filter((s) => s.done).length;
  const pct = skills.length ? Math.round((done / skills.length) * 100) : 0;

  // Filter videos by selected track
  const filteredVideos = useMemo(() => {
    return getCareerVideosByTrack(selectedTrack, state);
  }, [selectedTrack, state]);

  const watchStats = useMemo(() => {
    return selectTotalWatchStats(state);
  }, [state]);

  const getTrackIcon = (iconName) => {
    switch (iconName) {
      case "Layout":
        return <Layout size={14} />;
      case "Code2":
        return <Code2 size={14} />;
      case "Terminal":
        return <Terminal size={14} />;
      case "DollarSign":
        return <DollarSign size={14} />;
      case "BarChart3":
        return <BarChart3 size={14} />;
      default:
        return <Sparkles size={14} />;
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
                    <span className="ff-display text-2xl font-bold" style={{ color: C.sageDark }}>{pct}%</span>
                    <span className="ff-body text-xs text-stone-500">({done}/{skills.length} done)</span>
                  </div>
                  <div className="w-36 bg-stone-200 h-2 rounded-full overflow-hidden mt-1.5">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: C.sage }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Microtasks Checklist */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="ff-display text-2xl font-bold" style={{ color: C.ink }}>
                Weekly 15-Minute Micro-Refreshes
              </h2>
              <span className="ff-body text-xs text-stone-500">Tap circle when complete</span>
            </div>

            <div className="space-y-3">
              {skills.map((s) => (
                <Card
                  key={s.day}
                  hover={false}
                  className="!py-4 !px-5 flex items-center justify-between transition-all"
                  style={{
                    background: s.done ? C.sageSoft : "rgba(255, 252, 247, 0.85)",
                    border: `1px solid ${s.done ? C.sage : C.lineLight}`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggleSkill(s.day)}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0"
                      style={{
                        background: s.done ? C.sage : "transparent",
                        border: `1.8px solid ${s.done ? C.sage : C.line}`,
                      }}
                    >
                      <AnimatePresence>
                        {s.done && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={16} color={C.cream} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="ff-body text-[11px] font-bold uppercase tracking-wider" style={{ color: s.done ? C.sageDark : C.inkSoft }}>
                          {s.day}
                        </span>
                        <span className="ff-body text-[10px] px-2 py-0.5 rounded-full" style={{ background: C.paperDeep, color: C.inkSoft }}>
                          {s.mins} mins
                        </span>
                      </div>
                      <p className={`ff-display text-lg font-semibold ${s.done ? "line-through opacity-80" : ""}`} style={{ color: C.ink }}>
                        {s.name}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SECTION: Career Upskilling Courses & Video Learning Studio */}
          {/* ========================================================================= */}
          <motion.div variants={fadeUp} className="mb-10">
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
