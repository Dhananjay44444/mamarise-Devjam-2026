import React, { useState, useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { AppProvider, useAppState, selectChoreSplit } from "./state/store";
import { C } from "./theme";
import { PATHS, MOM_SCREENS } from "./routing/paths";
import { GuestRoute, ProtectedRoute } from "./routing/ProtectedRoute";
import { useGo } from "./routing/useGo";
import { Button } from "./ui/chrome";

// Screens
import Landing from "./screens/Landing";
import RoleSelect from "./screens/RoleSelect";
import MomLogin from "./screens/MomLogin";
import PartnerLogin from "./screens/PartnerLogin";
import MomDashboard from "./screens/MomDashboard";
import PartnerDashboard from "./screens/PartnerDashboard";
import LoadMirror from "./screens/LoadMirror";
import Checkin from "./screens/Checkin";
import CheckinResult from "./screens/CheckinResult";
import ReadinessBridge from "./screens/ReadinessBridge";
import ReadinessCard from "./screens/ReadinessCard";
import ShareExport from "./screens/ShareExport";
import Insights from "./screens/Insights";
import NourishNudge from "./screens/NourishNudge";
import CareCircle from "./screens/CareCircle";
import SafetyWall from "./screens/SafetyWall";
import Onboarding from "./screens/Onboarding";
import { VoiceCommandModal, VoiceFloatingTrigger } from "./ui/VoiceCommandModal";

function capacityLabel(recovery) {
  if (!recovery) return "Moderate";
  if (recovery.energy === "Low" || recovery.sleepHours < 5) return "Low";
  if (recovery.energy === "Okay") return "Moderate";
  return "Good";
}

function Celebration({ userName, onClose, onViewCard }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "rgba(43, 38, 32, 0.65)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative rounded-3xl p-8 max-w-sm w-full text-center glass-panel shadow-2xl"
        style={{ background: C.cream, border: `1.5px solid ${C.sage}` }}
      >
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm" style={{ background: C.sageLight, color: C.sageDark }}>
          <Sparkles size={28} />
        </div>
        <h3 className="ff-display text-2xl font-bold mb-2" style={{ color: C.ink }}>
          You did it, {userName}.
        </h3>
        <p className="ff-body text-xs leading-relaxed mb-6" style={{ color: C.inkSoft }}>
          Every weekly microtask refreshed. That is real, verifiable transition currency toward your return readiness.
        </p>
        <div className="space-y-2.5">
          <Button variant="sage" size="md" onClick={onViewCard} className="w-full justify-center">
            <span>View Updated Readiness Card</span>
            <ChevronRight size={15} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full justify-center">
            Continue in Dashboard
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MamaRise() {
  const { view } = useParams();
  const go = useGo();
  const [celebrate, setCelebrate] = useState(false);
  const { state, dispatch } = useAppState();
  const {
    currentUser: user,
    recovery,
    householdTasks: chores,
    microtasks: skills = [],
    circle,
  } = state;

  const setUser = (payload) => dispatch({ type: "SET_USER", payload });
  const setRecovery = (payload) => dispatch({ type: "SET_RECOVERY", payload });
  const setChores = (payload) => dispatch({ type: "SET_HOUSEHOLD_TASKS", payload });
  const setCircle = (payload) => dispatch({ type: "SET_CIRCLE", payload });
  const logVoiceCommand = (text) => dispatch({ type: "LOG_VOICE_COMMAND", payload: text });

  const onLogout = () => {
    dispatch({ type: "LOGOUT" });
    go("landing");
  };

  const choreSplit = useMemo(() => selectChoreSplit(state), [state]);

  const capacityHrs = useMemo(() => {
    let base = 8;
    if (recovery) {
      const cap = capacityLabel(recovery);
      base = cap === "Low" ? 3 : cap === "Moderate" ? 6 : 9;
    }
    const loadPenalty = choreSplit.me > 55 ? 2 : 0;
    return Math.max(2, base - loadPenalty);
  }, [recovery, choreSplit]);

  const toggleSkill = (day) => {
    const wasAllDone = skills.every((s) => s.done);
    dispatch({ type: "TOGGLE_MICROTASK", payload: day });
    const willBeAllDone = skills
      .map((s) => (s.day === day ? { ...s, done: !s.done } : s))
      .every((s) => s.done);
    if (willBeAllDone && !wasAllDone) setCelebrate(true);
  };

  const screen = MOM_SCREENS.includes(view) ? view : "dashboard";

  const pages = {
    dashboard: (
      <MomDashboard
        user={user}
        recovery={recovery}
        choreSplit={choreSplit}
        capacityHrs={capacityHrs}
        skills={skills}
        go={go}
        onLogout={onLogout}
      />
    ),
    onboarding: <Onboarding user={user} setUser={setUser} go={go} />,
    checkin: <Checkin recovery={recovery} setRecovery={setRecovery} go={go} onVoiceCommand={logVoiceCommand} />,
    checkinresult: recovery ? (
      <CheckinResult recovery={recovery} go={go} />
    ) : (
      <MomDashboard
        user={user}
        recovery={recovery}
        choreSplit={choreSplit}
        capacityHrs={capacityHrs}
        skills={skills}
        go={go}
        onLogout={onLogout}
      />
    ),
    loadmirror: (
      <LoadMirror
        chores={chores}
        setChores={setChores}
        capacityLow={recovery ? capacityLabel(recovery) === "Low" : false}
        go={go}
      />
    ),
    readiness: (
      <ReadinessBridge
        capacityHrs={capacityHrs}
        skills={skills}
        toggleSkill={toggleSkill}
        go={go}
      />
    ),
    readinesscard: <ReadinessCard user={user} recovery={recovery} skills={skills} go={go} />,
    shareexport: <ShareExport user={user} recovery={recovery} skills={skills} go={go} />,
    safetywall: <SafetyWall go={go} />,
    insights: <Insights recovery={recovery} choreSplit={choreSplit} skills={skills} go={go} />,
    nourishnudge: <NourishNudge recovery={recovery} go={go} />,
    carecircle: <CareCircle circle={circle} setCircle={setCircle} go={go} />,
  };

  return (
    <>
      <div key={screen} className="w-full">
        {pages[screen] || pages.dashboard}
      </div>
      <AnimatePresence>
        {celebrate && (
          <Celebration
            userName={user.name || "Aisha"}
            onClose={() => setCelebrate(false)}
            onViewCard={() => {
              setCelebrate(false);
              go("readinesscard");
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function AppRoutes() {
  const go = useGo();
  const { state } = useAppState();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleVoiceNavigate = (target) => {
    setIsVoiceModalOpen(false);
    if (target === "partner") {
      go(PATHS.partnerDashboard);
    } else {
      go(target);
    }
  };

  return (
    <>
      <Routes>
        <Route path={PATHS.landing} element={<GuestRoute><Landing /></GuestRoute>} />
        <Route path={PATHS.chooseRole} element={<GuestRoute><RoleSelect /></GuestRoute>} />
        <Route path={PATHS.momLogin} element={<GuestRoute><MomLogin /></GuestRoute>} />
        <Route path={PATHS.partnerLogin} element={<GuestRoute><PartnerLogin /></GuestRoute>} />
        <Route path={PATHS.safety} element={<SafetyWall go={go} />} />
        <Route
          path={PATHS.partnerDashboard}
          element={
            <ProtectedRoute role="partner">
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/mom" element={<Navigate to={PATHS.momDashboard} replace />} />
        <Route
          path="/mom/:view"
          element={
            <ProtectedRoute role="mom">
              <MamaRise />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={PATHS.landing} replace />} />
      </Routes>

      {/* Global Voice Assistant Floating Trigger & Modal - Only visible when authenticated */}
      {state.isAuthenticated && (
        <>
          <VoiceFloatingTrigger onOpen={() => setIsVoiceModalOpen(true)} />
          <VoiceCommandModal
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            onNavigate={handleVoiceNavigate}
          />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen relative" style={{ background: C.cream }}>
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
