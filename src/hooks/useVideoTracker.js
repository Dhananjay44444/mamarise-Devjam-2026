// useVideoTracker.js
// Custom React hook for active watch-time tracking with Page Visibility detection

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppState } from "../state/store";

export function useVideoTracker(video, onSessionFinished) {
  const { dispatch } = useAppState();

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isTabActive, setIsTabActive] = useState(
    typeof document !== "undefined" ? !document.hidden : true
  );
  const [sessionStartTime] = useState(() => Date.now());
  const [sessionId] = useState(() => `vidsess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);

  const activeSecondsRef = useRef(0);
  const isPlayingRef = useRef(true);
  const isTabActiveRef = useRef(true);

  // Synchronize refs
  activeSecondsRef.current = activeSeconds;
  isPlayingRef.current = isPlaying;
  isTabActiveRef.current = isTabActive;

  // Active Timer Interval
  useEffect(() => {
    if (!video) return;

    const intervalId = setInterval(() => {
      // Only increment if playing AND browser tab is currently visible
      if (isPlayingRef.current && isTabActiveRef.current) {
        setActiveSeconds((prev) => {
          const next = prev + 1;
          activeSecondsRef.current = next;
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [video]);

  // Page Visibility API Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabActive(isVisible);
      isTabActiveRef.current = isVisible;
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", () => {
        setIsTabActive(false);
        isTabActiveRef.current = false;
      });
      window.addEventListener("focus", () => {
        setIsTabActive(true);
        isTabActiveRef.current = true;
      });
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  // Finish and record session
  const finishSession = useCallback(
    (status = "completed") => {
      const finalDuration = activeSecondsRef.current;
      if (finalDuration > 0 && video) {
        const payload = {
          sessionId,
          videoId: video.id,
          videoTitle: video.title,
          creator: video.creator,
          category: video.category,
          startTime: sessionStartTime,
          activeSeconds: finalDuration,
          completed: status === "completed" || finalDuration >= (video.durationSeconds || 300) * 0.7,
          status,
        };

        dispatch({
          type: "RECORD_WATCH_SESSION",
          payload,
        });

        if (onSessionFinished) {
          onSessionFinished(payload);
        }
      }
    },
    [video, sessionId, sessionStartTime, dispatch, onSessionFinished]
  );

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return {
    isPlaying,
    activeSeconds,
    isTabActive,
    togglePlayPause,
    setIsPlaying,
    finishSession,
  };
}
