// VideoPlayerModal.js
// Interactive Wellness Video Player with Active Watch-Time & Page-Visibility Tracking

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Clock,
  Eye,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { C, shadows } from "../theme";
import { Button } from "./chrome";
import { useVideoTracker } from "../hooks/useVideoTracker";
import { formatWatchTime } from "../services/videoService";

export function VideoPlayerModal({ video, isOpen, onClose }) {
  const {
    isPlaying,
    activeSeconds,
    isTabActive,
    togglePlayPause,
    finishSession,
  } = useVideoTracker(video, (session) => {
    console.log("[VideoTracker] Watch session saved:", session);
  });

  if (!isOpen || !video) return null;

  const handleClose = () => {
    finishSession("exited");
    onClose();
  };

  const handleMarkCompleted = () => {
    finishSession("completed");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-stone-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 20, opacity: 0 }}
          className="relative max-w-3xl w-full rounded-3xl overflow-hidden glass-panel shadow-2xl z-10 max-h-[92vh] flex flex-col justify-between"
          style={{
            background: C.cream,
            border: `1.5px solid ${C.sage}`,
            boxShadow: shadows.xl,
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b flex items-center justify-between gap-4" style={{ borderColor: C.lineLight }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: C.sageLight, color: C.sageDark }}
              >
                <Sparkles size={16} />
              </span>
              <div className="truncate">
                <span className="ff-body text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {video.category || "Recovery Studio"}
                </span>
                <h3 className="ff-display text-base sm:text-lg font-bold truncate text-stone-900" title={video.title}>
                  {video.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-black/5 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Video Player Display Area */}
          <div className="relative bg-black w-full aspect-video flex items-center justify-center overflow-hidden group">
            {/* Embedded Video Player or Stylized Studio Player */}
            <iframe
              src={video.embedUrl ? `${video.embedUrl}?autoplay=1&mute=0&controls=1` : "https://www.youtube.com/embed/dQw4w9WgXcQ"}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Inactive Tab Overlay Indicator */}
            {!isTabActive && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center z-20">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs mb-2 border border-amber-500/40">
                  ⏸️ Tracking Paused
                </span>
                <p className="ff-display text-sm font-semibold">
                  Browser tab is currently in the background
                </p>
                <p className="ff-body text-xs text-stone-300 mt-1 max-w-sm">
                  Watch duration auto-pauses when you switch tabs and resumes when you return.
                </p>
              </div>
            )}
          </div>

          {/* Active Watch Tracking Bar */}
          <div
            className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs"
            style={{ background: C.paperDeep, borderColor: C.lineLight }}
          >
            {/* Live Watch Timer */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-stone-700">Active Watch Time:</span>
              <span className="ff-display font-mono font-bold text-emerald-800 text-sm px-2 py-0.5 bg-white rounded-lg border border-emerald-200">
                {formatWatchTime(activeSeconds)}
              </span>
              <span className="text-[11px] text-stone-400">/ {video.duration}</span>
            </div>

            {/* Visibility & Playback Status Badges */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 ${isTabActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
              >
                {isTabActive ? "🟢 Active Tab Tracking" : "⏸️ Paused (Tab in Background)"}
              </span>

              <button
                onClick={togglePlayPause}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? "Pause Timer" : "Resume Timer"}
              </button>
            </div>
          </div>

          {/* Metadata & Recommendation Context Footer */}
          <div className="p-4 sm:p-5 overflow-y-auto max-h-48 space-y-3">
            {/* Why Recommended Callout */}
            {(video.whyRecommended || video.recommendationReason) && (
              <div
                className="p-3 rounded-2xl flex items-start gap-2.5 text-xs font-medium"
                style={{ background: C.sageSoft, border: `1px solid ${C.sage}`, color: C.sageDark }}
              >
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-950">Career Return Advantage:</span>
                  <p className="mt-0.5 text-emerald-900 leading-snug">{video.whyRecommended || video.recommendationReason}</p>
                </div>
              </div>
            )}

            {/* Creator & Video Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-stone-800">{video.creator}</span>
                <span className="flex items-center gap-1 text-stone-500">
                  <Eye size={13} /> {video.views}
                </span>
                <span className="flex items-center gap-1 text-stone-500">
                  <Clock size={13} /> {video.duration}
                </span>
              </div>

              {video.externalUrl && (
                <a
                  href={video.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 hover:text-emerald-700 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                >
                  Open on YouTube <ExternalLink size={12} />
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t" style={{ borderColor: C.lineLight }}>
              <Button variant="outline" size="sm" onClick={handleClose}>
                Close & Save Progress
              </Button>
              <Button variant="sage" size="sm" onClick={handleMarkCompleted} className="flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={14} /> Mark as Finished & Log Time
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
