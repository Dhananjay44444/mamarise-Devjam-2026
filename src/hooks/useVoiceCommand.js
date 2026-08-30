// useVoiceCommand.js
// Custom React hook for Speech Recognition with Live Diagnostics

import { useState, useCallback, useEffect, useRef } from "react";
import { SpeechRecognitionService } from "../services/voiceService";
import { parseVoiceIntent } from "../services/voiceIntentParser";
import { sendVoiceCommandToBackend } from "../services/dataService";
import { useAppState } from "../state/store";

export function useVoiceCommand(onNavigate) {
  const { state, dispatch } = useAppState();

  const serviceRef = useRef(null);
  if (!serviceRef.current) {
    serviceRef.current = new SpeechRecognitionService();
  }

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommandResult, setLastCommandResult] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
  const [diagnostics, setDiagnostics] = useState(() =>
    serviceRef.current ? serviceRef.current.getSupportDetails() : { isSupported: false }
  );

  const isSupported = diagnostics.isSupported;

  const silenceTimerRef = useRef(null);
  const currentTranscriptRef = useRef("");

  // Clean up silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Process a final transcript into intent with Gemini AI support
  const processTranscript = useCallback(
    async (transcriptText) => {
      if (!transcriptText || !transcriptText.trim()) return null;

      clearSilenceTimer();
      setIsProcessing(true);
      setVoiceError(null);

      try {
        // Parse locally first for instant UI response
        const parsed = parseVoiceIntent(transcriptText, state);

        // Fetch empathetic reply from Gemini backend in background/parallel
        sendVoiceCommandToBackend(transcriptText, state.userRole, state)
          .then((backendRes) => {
            if (backendRes && backendRes.empathetic_reply) {
              setLastCommandResult((prev) => ({
                ...(prev || parsed),
                empatheticReply: backendRes.empathetic_reply,
              }));
            }
          })
          .catch(() => {});

        if (parsed.stateAction) {
          if (parsed.stateAction.type === "VOICE_NAVIGATE") {
            if (onNavigate) {
              onNavigate(parsed.stateAction.payload.target);
            }
          } else {
            dispatch(parsed.stateAction);
          }
        }

        setLastCommandResult(parsed);
        setIsProcessing(false);
        return parsed;
      } catch (err) {
        setIsProcessing(false);
        setVoiceError({
          code: "PARSER_ERROR",
          message: "Failed to parse speech intent.",
        });
        return null;
      }
    },
    [state, dispatch, onNavigate, clearSilenceTimer]
  );

  // Stop listening session and process whatever text was captured
  const stopListening = useCallback(() => {
    clearSilenceTimer();
    const textToProcess = currentTranscriptRef.current ? currentTranscriptRef.current.trim() : "";
    if (serviceRef.current) {
      serviceRef.current.stop();
    }
    setIsListening(false);
    if (textToProcess) {
      setFinalTranscript(textToProcess);
      processTranscript(textToProcess);
    }
  }, [clearSilenceTimer, processTranscript]);

  // Reset 4-second inactivity/silence timer
  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      const textToProcess = currentTranscriptRef.current ? currentTranscriptRef.current.trim() : "";
      stopListening();
      if (textToProcess) {
        setFinalTranscript(textToProcess);
        processTranscript(textToProcess);
      }
    }, 4000);
  }, [clearSilenceTimer, stopListening, processTranscript]);

  // Start listening session
  const startListening = useCallback(async () => {
    clearSilenceTimer();
    currentTranscriptRef.current = "";
    setVoiceError(null);
    setLiveTranscript("");
    setFinalTranscript("");
    setLastCommandResult(null);

    // Start 4-second initial silence timer
    resetSilenceTimer();

    await serviceRef.current.start({
      onStart: () => {
        setIsListening(true);
        resetSilenceTimer();
      },
      onTranscript: (currentText, isFinal) => {
        currentTranscriptRef.current = currentText;
        setLiveTranscript(currentText);
        // Refresh 4-second silence timer on every chunk of speech
        resetSilenceTimer();
      },
      onFinal: (completedText) => {
        currentTranscriptRef.current = completedText;
        setFinalTranscript(completedText);
        setLiveTranscript(completedText);
        clearSilenceTimer();
        processTranscript(completedText);
      },
      onError: (err) => {
        clearSilenceTimer();
        setIsListening(false);
        setVoiceError(err);
      },
      onEnd: () => {
        clearSilenceTimer();
        setIsListening(false);
      },
      onDiagnostic: (diagInfo) => {
        setDiagnostics((prev) => ({ ...prev, ...diagInfo }));
      },
    });
  }, [processTranscript, resetSilenceTimer, clearSilenceTimer]);

  // Execute direct command (e.g. for testing / preset phrases)
  const executeCommand = useCallback(
    (text) => {
      clearSilenceTimer();
      setLiveTranscript(text);
      setFinalTranscript(text);
      return processTranscript(text);
    },
    [processTranscript, clearSilenceTimer]
  );

  const clearError = useCallback(() => setVoiceError(null), []);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (serviceRef.current) {
        serviceRef.current.abort();
      }
    };
  }, [clearSilenceTimer]);

  return {
    isSupported,
    isListening,
    liveTranscript,
    finalTranscript,
    isProcessing,
    lastCommandResult,
    voiceError,
    diagnostics,
    startListening,
    stopListening,
    executeCommand,
    clearError,
    voiceCommandHistory: state.voiceCommandHistory || [],
  };
}
