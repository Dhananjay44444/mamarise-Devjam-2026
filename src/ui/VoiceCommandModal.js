import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Sparkles,
  AlertCircle,
  History,
  X,
  Volume2,
  ListFilter,
  ArrowRight,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { C, shadows } from "../theme";
import { Button, Badge } from "./chrome";
import { useVoiceCommand } from "../hooks/useVoiceCommand";
import { useAppState } from "../state/store";

export function VoiceCommandModal({ isOpen, onClose, onNavigate }) {
  const [activeTab, setActiveTab] = useState("speak"); // "speak" | "history" | "samples"
  const [manualInput, setManualInput] = useState("");
  const { dispatch } = useAppState();

  const {
    isListening,
    liveTranscript,
    isProcessing,
    lastCommandResult,
    voiceError,
    diagnostics,
    startListening,
    stopListening,
    executeCommand,
    clearError,
    voiceCommandHistory,
  } = useVoiceCommand(onNavigate);

  const sampleCommands = [
    {
      label: "Task Completion & Low Energy",
      phrase: "I completed cooking and I'm feeling very tired.",
      desc: "Marks cooking as completed, updates energy to Low & recalculates split.",
    },
    {
      label: "Assign Task to Partner",
      phrase: "Assign grocery shopping to my partner.",
      desc: "Adds task to Partner Action Desk & updates load mirror split.",
    },
    {
      label: "Broadcast Help Request (SOS)",
      phrase: "I need help with dinner tomorrow.",
      desc: "Dispatches high-urgency help card directly to Partner Desk.",
    },
    {
      label: "Recovery Triage Log",
      phrase: "I slept 4 hours last night, feeling exhausted with mild back pain.",
      desc: "Logs sleep (4h), energy (Low), pain (Mild), and updates recovery pulse.",
    },
    {
      label: "Partner Take Over",
      phrase: "I'll handle dinner tonight.",
      desc: "Transfers chore from Mom's plate to Partner's active list.",
    },
    {
      label: "Career Microtask Completed",
      phrase: "Completed Excel refresh microtask.",
      desc: "Checks off Monday career readiness refresh.",
    },
    {
      label: "Set Smart Reminder",
      phrase: "Remind me to drink warm water in 1 hour.",
      desc: "Adds partner-synchronized care reminder.",
    },
    {
      label: "Voice Navigation",
      phrase: "Go to Load Mirror.",
      desc: "Navigates directly to the Load Rebalance board.",
    },
  ];

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    executeCommand(manualInput.trim());
    setManualInput("");
  };

  const handleClearHistory = () => {
    dispatch({ type: "CLEAR_VOICE_HISTORY" });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          className="relative max-w-xl w-full rounded-3xl p-6 sm:p-8 glass-panel shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col justify-between"
          style={{
            background: C.cream,
            border: `1.5px solid ${C.sage}`,
            boxShadow: shadows.xl,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.lineLight }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
                style={{ background: C.sageLight, color: C.sageDark }}
              >
                <Mic size={20} />
              </div>
              <div>
                <h3 className="ff-display text-xl font-bold" style={{ color: C.ink }}>
                  MamaRise Voice Assistant
                </h3>
                <p className="ff-body text-xs text-stone-500">
                  Cross-app natural language state synchronization
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-black/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex rounded-2xl p-1 my-4 glass-panel" style={{ border: `1px solid ${C.lineLight}` }}>
            {[
              { id: "speak", label: "Speak & Listen", icon: Volume2 },
              { id: "samples", label: "Example Commands", icon: ListFilter },
              { id: "history", label: `History (${voiceCommandHistory.length})`, icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all select-none"
                  style={{
                    background: isSelected ? C.cream : "transparent",
                    color: isSelected ? C.ink : C.inkSoft,
                    boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <Icon size={14} style={{ color: isSelected ? C.sage : C.inkSoft }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Live Voice Speech Section */}
          {activeTab === "speak" && (
            <div className="overflow-y-auto pr-1 space-y-4 flex-1 py-2">
              {/* Audio Pulse Visualizer Area */}
              <div
                className="p-8 rounded-3xl text-center relative overflow-hidden flex flex-col items-center justify-center transition-all"
                style={{
                  background: isListening ? C.sageSoft : "rgba(255,252,247,0.7)",
                  border: `1.5px solid ${isListening ? C.sage : C.line}`,
                }}
              >
                {/* Concentric pulse rings while listening */}
                {isListening && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-24 h-24 rounded-full border-2 border-emerald-500 pointer-events-none"
                    />
                    <motion.div
                      animate={{ scale: [1, 2.4, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className="absolute w-24 h-24 rounded-full border border-emerald-400 pointer-events-none"
                    />
                  </>
                )}

                {/* Mic Button */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={isListening ? stopListening : startListening}
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative z-10 select-none mb-4"
                  style={{
                    background: isListening ? C.blushDeep : C.sage,
                    color: C.cream,
                    boxShadow: isListening
                      ? "0 0 30px rgba(190, 105, 80, 0.45)"
                      : "0 10px 24px rgba(95, 135, 102, 0.35)",
                  }}
                  title={isListening ? "Click to stop listening" : "Click to start speech recognition"}
                >
                  {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                </motion.button>

                <p className="ff-display text-base font-bold mb-1" style={{ color: C.ink }}>
                  {isListening
                    ? "Listening... Speak now (Live speech-to-text active)"
                    : isProcessing
                      ? "Interpreting speech intent..."
                      : "Click Mic to Speak"}
                </p>

                <p className="ff-body text-xs text-stone-500 max-w-sm">
                  {isListening
                    ? "Speak into your microphone. Say anything like 'I completed cooking' or 'Need help tomorrow'"
                    : "Click mic → speak → see live transcript in real-time"}
                </p>
              </div>

              {/* Live Transcript Display Bubble */}
              {(liveTranscript || isListening) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl glass-panel"
                  style={{
                    border: `1.5px solid ${isListening ? C.sage : C.lineLight}`,
                    background: C.paperDeep,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="ff-body text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isListening ? "bg-emerald-500 animate-ping" : "bg-stone-400"}`} />
                      {isListening ? "Live Interim / Final Transcript" : "Final Transcript Received"}
                    </span>
                    {isListening && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        LISTENING
                      </span>
                    )}
                  </div>
                  <p className="ff-display text-base font-semibold italic text-stone-900 leading-relaxed">
                    "{liveTranscript || (isListening ? "Listening for your voice..." : "No speech recorded")}"
                  </p>
                </motion.div>
              )}

              {/* Live Diagnostic Telemetry Card */}
              <div
                className="p-3.5 rounded-2xl text-xs flex flex-col gap-1.5"
                style={{
                  background: voiceError ? C.blushSoft : "rgba(242, 235, 224, 0.6)",
                  border: `1px solid ${voiceError ? C.blush : C.line}`,
                }}
              >
                <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider text-stone-700">
                  <span>Speech Recognition Diagnostic Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${diagnostics.isSupported ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                  >
                    {diagnostics.isSupported ? "API SUPPORTED" : "UNSUPPORTED"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
                  <div>
                    <span className="font-semibold text-stone-700">API Type:</span>{" "}
                    <code className="text-[10px] bg-white px-1 py-0.5 rounded font-mono">
                      {diagnostics.apiType || (diagnostics.isSupported ? "SpeechRecognition" : "None")}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Status:</span>{" "}
                    <span className="font-bold">{isListening ? "🎙️ Listening" : "Idle"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Secure Context:</span>{" "}
                    <span>{diagnostics.isSecureContext ? "✅ Yes" : "❌ No"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Iframe Sandbox:</span>{" "}
                    <span>{diagnostics.isIframe ? "⚠️ Yes (Inside Preview)" : "Direct Window"}</span>
                  </div>
                </div>

                {voiceError && (
                  <div className="pt-2 mt-1 border-t border-rose-200 text-rose-800 text-[11px] flex flex-col gap-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">
                        <AlertCircle size={13} /> Error Code: <code>{voiceError.code}</code>
                      </span>
                      <button onClick={clearError} className="hover:underline font-normal text-[10px]">
                        Dismiss
                      </button>
                    </div>
                    <p className="leading-snug">{voiceError.message}</p>
                  </div>
                )}
              </div>

              {/* Quick Spoken Voice Shortcuts */}
              <div className="pt-1">
                <span className="ff-body text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                  Preset Voice Phrases (1-Tap Simulation):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "I completed cooking and I'm feeling very tired.",
                    "Assign grocery shopping to my partner.",
                    "I need help with dinner tomorrow.",
                    "I slept 4 hours last night, feeling exhausted with mild back pain.",
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => executeCommand(phrase)}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-medium glass-panel hover:border-emerald-600 transition-all text-stone-800 text-left shadow-xs"
                      style={{ border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.85)" }}
                    >
                      "{phrase}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Voice Simulator Input */}
              <div className="pt-1">
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Type a voice query (e.g. I completed cooking and feel tired)..."
                    className="ff-body flex-1 px-3.5 py-1.5 rounded-xl text-xs outline-none focus:border-emerald-600 transition-colors"
                    style={{ background: C.paperDeep, border: `1px solid ${C.line}`, color: C.ink }}
                  />
                  <Button type="submit" variant="sage" size="sm" disabled={!manualInput.trim()}>
                    Execute
                  </Button>
                </form>
              </div>

              {/* Structured Command Result Card */}
              {lastCommandResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl glass-panel border"
                  style={{
                    background: C.sageSoft,
                    borderColor: C.sage,
                    boxShadow: shadows.sm,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} style={{ color: C.sageDark }} />
                      <span className="ff-body text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                        Intent Executed & Synced
                      </span>
                    </div>
                    <Badge variant="steady">{lastCommandResult.intent}</Badge>
                  </div>

                  <p className="ff-display text-sm font-bold mb-3" style={{ color: C.ink }}>
                    {lastCommandResult.summaryMessage}
                  </p>

                  {/* Gemini AI Empathetic Companion Reply */}
                  {lastCommandResult.empatheticReply && (
                    <div
                      className="p-3 rounded-xl mb-3 flex items-start gap-2.5 text-xs text-emerald-950 font-medium"
                      style={{ background: "rgba(255, 255, 255, 0.85)", border: `1px solid ${C.sage}` }}
                    >
                      <Heart size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[10px] text-emerald-800 uppercase tracking-wider">
                          MamaRise Companion (Gemini AI):
                        </span>
                        <p className="mt-0.5 italic leading-relaxed text-stone-800">
                          "{lastCommandResult.empatheticReply}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Extracted Entities Grid */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                    {Object.entries(lastCommandResult.entities || {}).map(([key, val]) => {
                      if (!val) return null;
                      return (
                        <span
                          key={key}
                          className="ff-body text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: C.cream, color: C.ink, border: `1px solid ${C.line}` }}
                        >
                          <b>{key}:</b> {String(val)}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* TAB 2: Example Commands & 1-Click Simulations */}
          {activeTab === "samples" && (
            <div className="overflow-y-auto max-h-[360px] pr-1 space-y-2.5 py-2">
              <p className="ff-body text-xs text-stone-600 mb-2">
                Click any phrase to immediately parse the intent and verify full application synchronization:
              </p>

              {sampleCommands.map((sample) => (
                <div
                  key={sample.label}
                  onClick={() => {
                    executeCommand(sample.phrase);
                    setActiveTab("speak");
                  }}
                  className="p-3.5 rounded-2xl glass-panel hover:border-emerald-600 transition-all cursor-pointer flex items-center justify-between group"
                  style={{ border: `1px solid ${C.lineLight}` }}
                >
                  <div>
                    <span className="ff-body text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      {sample.label}
                    </span>
                    <p className="ff-display text-xs font-bold mt-0.5" style={{ color: C.ink }}>
                      "{sample.phrase}"
                    </p>
                    <p className="ff-body text-[10px] text-stone-500 mt-0.5">
                      {sample.desc}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-emerald-600 group-hover:text-white shrink-0 ml-2">
                    Test <ArrowRight size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Voice Command History */}
          {activeTab === "history" && (
            <div className="overflow-y-auto max-h-[360px] pr-1 space-y-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="ff-body text-xs text-stone-500 font-medium">
                  Logged Voice Actions ({voiceCommandHistory.length})
                </span>
                {voiceCommandHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="ff-body text-[11px] text-rose-700 hover:underline"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {voiceCommandHistory.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <History size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="ff-display text-sm font-semibold">No voice commands logged yet</p>
                  <p className="ff-body text-xs mt-0.5">Speak a command above to see history here.</p>
                </div>
              ) : (
                voiceCommandHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl glass-panel flex flex-col gap-1.5"
                    style={{ border: `1px solid ${C.lineLight}` }}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="steady">{item.intent || "VOICE_ACTION"}</Badge>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="ff-display text-xs font-bold" style={{ color: C.ink }}>
                      "{item.transcript}"
                    </p>
                    <p className="ff-body text-[11px] text-emerald-800">
                      ✓ {item.result}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: C.lineLight }}>
            <span className="text-stone-500 text-[11px] flex items-center gap-1">
              <Sparkles size={12} style={{ color: C.sage }} />
              Real-time Intent Detection & State Sync
            </span>
            <Button variant="outline" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Floating Global Voice Assistant Button (Accessible on all screens)
 */
export function VoiceFloatingTrigger({ onOpen }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer select-none transition-all"
      style={{
        background: C.sage,
        color: C.cream,
        boxShadow: "0 14px 32px rgba(95, 135, 102, 0.4)",
        border: `2px solid ${C.cream}`,
      }}
      title="Open MamaRise Voice Command Assistant"
    >
      <Mic size={20} />
      <span className="ff-body text-xs font-bold pr-1 hidden sm:inline">Voice Assistant</span>
      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
    </motion.button>
  );
}
