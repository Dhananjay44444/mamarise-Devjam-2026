// voiceService.js
// Production-Grade Speech Recognition Service with Detailed Diagnostics and Error Mapping

export class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.mediaStream = null;
  }

  /**
   * Detects browser SpeechRecognition support and environment security context
   */
  getSupportDetails() {
    const hasStandard = typeof window !== "undefined" && "SpeechRecognition" in window;
    const hasWebkit = typeof window !== "undefined" && "webkitSpeechRecognition" in window;
    const isSecureContext = typeof window !== "undefined" ? window.isSecureContext : false;
    const protocol = typeof window !== "undefined" ? window.location.protocol : "";
    const isIframe = typeof window !== "undefined" ? window.self !== window.top : false;

    console.log("[SpeechRecognition] API Support Detection:", {
      SpeechRecognition: hasStandard,
      webkitSpeechRecognition: hasWebkit,
      isSecureContext,
      protocol,
      isIframe,
    });

    return {
      isSupported: hasStandard || hasWebkit,
      apiType: hasStandard ? "window.SpeechRecognition" : hasWebkit ? "window.webkitSpeechRecognition" : "None",
      isSecureContext,
      protocol,
      isIframe,
    };
  }

  /**
   * Request microphone permission explicitly via getUserMedia
   */
  async requestMicrophonePermission() {
    console.log("[SpeechRecognition] Requesting getUserMedia audio permission...");
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.warn("[SpeechRecognition] navigator.mediaDevices.getUserMedia is not available");
      return { granted: false, error: "mediaDevices API not available in this environment" };
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[SpeechRecognition] Microphone permission granted successfully.");
      return { granted: true, stream: this.mediaStream };
    } catch (err) {
      console.error("[SpeechRecognition] Permission-related error during getUserMedia:", err.name, err.message);
      return { granted: false, error: err.name || err.message };
    }
  }

  /**
   * Starts a fresh Speech Recognition session
   */
  async start({ onTranscript, onFinal, onError, onStart, onEnd, onDiagnostic }) {
    console.log("[SpeechRecognition] Microphone button click registered");

    const support = this.getSupportDetails();
    if (onDiagnostic) {
      onDiagnostic({
        support,
        state: "checking_permission",
        error: null,
      });
    }

    if (!support.isSupported) {
      const errObj = {
        code: "not-supported",
        message: "SpeechRecognition is not supported in this browser. Please test in Google Chrome or Safari.",
        diagnostic: support,
      };
      console.error("[SpeechRecognition] Recognition error: API not supported", errObj);
      if (onError) onError(errObj);
      if (onDiagnostic) onDiagnostic({ support, state: "error", error: errObj });
      return false;
    }

    // Stop any existing session
    this.stop();

    // Check / request microphone permissions first
    const perm = await this.requestMicrophonePermission();
    if (!perm.granted) {
      const errObj = {
        code: "not-allowed",
        message: `Microphone permission denied (${perm.error}). Please allow microphone access in browser settings.`,
        diagnostic: { ...support, permissionError: perm.error },
      };
      console.error("[SpeechRecognition] Recognition error: Permission Denied", errObj);
      if (onError) onError(errObj);
      if (onDiagnostic) onDiagnostic({ support, state: "error", error: errObj });
      return false;
    }

    // Instantiate a fresh SpeechRecognition instance for this session
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
      this.recognition.maxAlternatives = 1;
      console.log("[SpeechRecognition] Fresh recognition instance created.");
    } catch (instErr) {
      console.error("[SpeechRecognition] Failed to instantiate SpeechRecognition:", instErr);
      const errObj = {
        code: "instantiation-error",
        message: instErr.message || "Failed to create SpeechRecognition instance.",
      };
      if (onError) onError(errObj);
      return false;
    }

    let finalTranscript = "";

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("[SpeechRecognition] onstart fired: Recognition active and listening...");
      if (onStart) onStart();
      if (onDiagnostic) {
        onDiagnostic({
          support,
          state: "listening",
          error: null,
          lastEvent: "onstart",
        });
      }
    };

    this.recognition.onaudiostart = () => {
      console.log("[SpeechRecognition] onaudiostart: Audio capture started");
    };

    this.recognition.onspeechstart = () => {
      console.log("[SpeechRecognition] onspeechstart: User speech detected");
    };

    this.recognition.onspeechend = () => {
      console.log("[SpeechRecognition] onspeechend: User speech paused");
    };

    this.recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }

      console.log("[SpeechRecognition] Recognition result received:", {
        interim,
        final: finalTranscript.trim(),
        rawEvent: event,
      });

      const currentDisplay = (finalTranscript + interim).trim();
      if (onTranscript && currentDisplay) {
        onTranscript(currentDisplay, Boolean(finalTranscript));
      }
      if (onDiagnostic) {
        onDiagnostic({
          support,
          state: "receiving_transcript",
          transcript: currentDisplay,
          lastEvent: "onresult",
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.error("[SpeechRecognition] Recognition error event fired:", {
        error: event.error,
        message: event.message,
        event,
      });

      let humanMessage = `Speech recognition error: ${event.error}`;
      let isAntigravitySandboxIssue = false;

      switch (event.error) {
        case "not-allowed":
          humanMessage = "Microphone access was denied. Please grant microphone permission in your browser.";
          break;
        case "service-not-allowed":
          isAntigravitySandboxIssue = true;
          humanMessage =
            "Speech recognition service was blocked by the browser or sandbox policy. In Antigravity preview, open the app in a new browser tab (http://localhost:3000) to allow speech recognition.";
          break;
        case "no-speech":
          humanMessage = "No speech was detected. Please try speaking closer to the microphone.";
          break;
        case "audio-capture":
          humanMessage = "No microphone was found or microphone is currently in use by another app.";
          break;
        case "network":
          isAntigravitySandboxIssue = true;
          humanMessage =
            "Network error: Browser speech recognition service is unreachable. (Chrome/Safari require access to speech recognition endpoints. In Antigravity preview, open in a dedicated browser tab at http://localhost:3000).";
          break;
        case "aborted":
          humanMessage = "Speech recognition was stopped.";
          break;
        default:
          humanMessage = `Speech recognition error (${event.error}).`;
      }

      const errObj = {
        code: event.error,
        message: humanMessage,
        isAntigravitySandboxIssue,
        rawEvent: event,
      };

      if (onError) onError(errObj);
      if (onDiagnostic) {
        onDiagnostic({
          support,
          state: "error",
          error: errObj,
          lastEvent: `onerror (${event.error})`,
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("[SpeechRecognition] Recognition session ended (onend). Final transcript:", finalTranscript.trim());
      if (onEnd) onEnd();
      if (finalTranscript.trim() && onFinal) {
        onFinal(finalTranscript.trim());
      }
      if (onDiagnostic) {
        onDiagnostic({
          support,
          state: "idle",
          finalTranscript: finalTranscript.trim(),
          lastEvent: "onend",
        });
      }
    };

    try {
      console.log("[SpeechRecognition] Calling recognition.start()...");
      this.recognition.start();
      return true;
    } catch (startErr) {
      console.error("[SpeechRecognition] Error invoking recognition.start():", startErr);
      const errObj = {
        code: "start-failed",
        message: startErr.message || "Failed to start speech recognition.",
      };
      if (onError) onError(errObj);
      return false;
    }
  }

  /**
   * Cleanly stops recognition and releases audio tracks
   */
  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        console.log("[SpeechRecognition] Stopping recognition instance...");
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
      this.recognition = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
  }

  abort() {
    this.stop();
  }
}

export const globalSpeechService = new SpeechRecognitionService();
