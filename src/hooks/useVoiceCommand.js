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

  // Process a final transcript into intent with Gemini AI support
  const processTranscript = useCallback(
    async (transcriptText) => {
      if (!transcriptText || !transcriptText.trim()) return null;

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
    [state, dispatch, onNavigate]
  );

  // Start listening session
  const startListening = useCallback(async () => {
    setVoiceError(null);
    setLiveTranscript("");
    setFinalTranscript("");
    setLastCommandResult(null);

    await serviceRef.current.start({
      onStart: () => {
        setIsListening(true);
      },
      onTranscript: (currentText, isFinal) => {
        setLiveTranscript(currentText);
      },
      onFinal: (completedText) => {
        setFinalTranscript(completedText);
        setLiveTranscript(completedText);
        processTranscript(completedText);
      },
      onError: (err) => {
        setIsListening(false);
        setVoiceError(err);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onDiagnostic: (diagInfo) => {
        setDiagnostics((prev) => ({ ...prev, ...diagInfo }));
      },
    });
  }, [processTranscript]);

  // Stop listening session
  const stopListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Execute direct command (e.g. for testing / preset phrases)
  const executeCommand = useCallback(
    (text) => {
      setLiveTranscript(text);
      setFinalTranscript(text);
      return processTranscript(text);
    },
    [processTranscript]
  );

  const clearError = useCallback(() => setVoiceError(null), []);

  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.abort();
      }
    };
  }, []);

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
