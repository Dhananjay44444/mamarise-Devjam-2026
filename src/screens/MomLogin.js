import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, UserPlus, LogIn } from "lucide-react";
import { C } from "../theme";
import { Logo, Screen, Button } from "../ui/chrome";
import { useAppState } from "../state/store";
import {
  loginWithPassword,
  registerUser,
  validateLoginFields,
  validateRegisterFields,
  DEMO_ACCOUNTS,
} from "../services/authService";
import { PATHS } from "../routing/paths";

function Field({ label, type, value, onChange, error, placeholder, autoComplete }) {
  return (
    <label className="block mb-4">
      <span className="ff-body text-xs tracking-wide mb-1.5 block" style={{ color: C.inkSoft }}>{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="ff-body w-full px-4 py-3 rounded-2xl outline-none"
        style={{ background: C.cream, border: `1px solid ${error ? C.blushDeep : C.line}`, color: C.ink }}
      />
      {error && <span className="ff-body text-xs mt-1.5 block" style={{ color: C.blushDeep }}>{error}</span>}
    </label>
  );
}

export default function MomLogin() {
  const navigate = useNavigate();
  const { dispatch } = useAppState();
  const [mode, setMode] = useState("signin"); // "signin" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [subCode, setSubCode] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setFormError("");
    setSubCode("");
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNTS.mom.email);
    setPassword(DEMO_ACCOUNTS.mom.password);
    setName(DEMO_ACCOUNTS.mom.name);
    setErrors({});
    setFormError("");
  };

  const quickDemoLogin = async () => {
    setLoading(true);
    setFormError("");
    try {
      const session = await loginWithPassword({
        email: DEMO_ACCOUNTS.mom.email,
        password: DEMO_ACCOUNTS.mom.password,
        name: DEMO_ACCOUNTS.mom.name,
        role: "mom",
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: session });
      navigate(PATHS.momDashboard, { replace: true });
    } catch (err) {
      setFormError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubCode("");

    if (mode === "register") {
      const next = validateRegisterFields({ email, password, name, role: "mom" });
      setErrors(next);
      if (Object.keys(next).length) return;

      setLoading(true);
      try {
        const session = await registerUser({ email, password, name, role: "mom" });
        dispatch({ type: "LOGIN_SUCCESS", payload: session });
        navigate("/mom/onboarding", { replace: true });
      } catch (err) {
        setFormError(err.message || "Could not create account. Please try again.");
        if (err.fields) setErrors(err.fields);
      } finally {
        setLoading(false);
      }
    } else {
      const next = validateLoginFields({ email, password, name, role: "mom" });
      setErrors(next);
      if (Object.keys(next).length) return;

      setLoading(true);
      try {
        const session = await loginWithPassword({ email, password, name, role: "mom" });
        dispatch({ type: "LOGIN_SUCCESS", payload: session });
        navigate(PATHS.momDashboard, { replace: true });
      } catch (err) {
        setFormError(err.message || "Something went gently wrong. Please try again.");
        if (err.subCode) setSubCode(err.subCode);
        if (err.fields) setErrors(err.fields);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Screen ambient={false} style={{ background: C.cream }}>
      <div className="max-w-md mx-auto relative">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <button onClick={() => navigate(PATHS.chooseRole)} className="ff-body text-xs flex items-center gap-1" style={{ color: C.inkSoft }}><ArrowLeft size={14} /> Roles</button>
        </div>

        <p className="ff-body text-xs tracking-[0.2em] uppercase mb-2" style={{ color: C.blushDeep }}>
          {mode === "signin" ? "A quiet door, just for you" : "Begin your recovery journey"}
        </p>
        <h1 className="ff-display text-4xl leading-tight mb-2" style={{ color: C.ink }}>
          {mode === "signin" ? (
            <>Welcome back.<br />You're safe here.</>
          ) : (
            <>Create your<br />private space.</>
          )}
        </h1>
        <p className="ff-body text-sm mb-6" style={{ color: C.inkSoft }}>
          {mode === "signin"
            ? "Sign in with your email or use the 1-click demo to step right in."
            : "Set up your own account to track your recovery and household load."}
        </p>

        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1 mb-6" style={{ background: C.paperDeep, border: `1px solid ${C.line}` }}>
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: mode === "signin" ? C.cream : "transparent",
              color: mode === "signin" ? C.ink : C.inkSoft,
              boxShadow: mode === "signin" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            <LogIn size={13} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className="flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: mode === "register" ? C.cream : "transparent",
              color: mode === "register" ? C.ink : C.inkSoft,
              boxShadow: mode === "register" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            <UserPlus size={13} /> Create Account
          </button>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-3" style={{ background: C.sageLight, border: `1px solid ${C.sage}` }}>
          <div>
            <p className="ff-display text-sm font-semibold" style={{ color: C.sageDark }}>Demo Account Available</p>
            <p className="ff-body text-xs" style={{ color: C.inkSoft }}>Instant access with pre-filled test data</p>
          </div>
          <button
            type="button"
            onClick={quickDemoLogin}
            disabled={loading}
            className="ff-body text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-medium shrink-0 shadow-sm"
            style={{ background: C.sage, color: C.cream }}
          >
            <Sparkles size={13} /> 1-Click Demo
          </button>
        </div>

        <form onSubmit={submit} className="rounded-3xl p-6 md:p-8" style={{ background: "rgba(244,238,227,0.88)", border: `1px solid ${C.line}` }} noValidate>
          {mode === "register" && (
            <Field
              label="What should we call you?"
              type="text"
              value={name}
              onChange={setName}
              error={errors.name}
              placeholder="Your first name"
              autoComplete="given-name"
            />
          )}

          <Field
            label="Your email"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Field
            label={mode === "register" ? "Create a private password" : "Your password"}
            type="password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            placeholder="At least 6 characters"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />

          {formError && (
            <div className="ff-body text-sm mb-4 px-4 py-3 rounded-2xl" style={{ background: C.blushLight, color: C.blushDeep }} role="alert">
              <p>{formError}</p>
              {subCode === "ACCOUNT_NOT_FOUND" && (
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="mt-2 text-xs font-semibold underline block"
                >
                  Click here to create this account now →
                </button>
              )}
            </div>
          )}

          <Button type="submit" variant="blush" disabled={loading} className="w-full justify-center mt-2">
            {loading
              ? mode === "register" ? "Setting up your space…" : "Settling you in…"
              : mode === "register" ? "Create Account & Start" : "Enter gently"}
          </Button>

          <div className="mt-4 pt-3 text-center" style={{ borderTop: `1px solid ${C.line}` }}>
            {mode === "signin" ? (
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="ff-body text-xs"
                style={{ color: C.inkSoft }}
              >
                Don't have an account? <span className="font-semibold underline" style={{ color: C.blushDeep }}>Create one now</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="ff-body text-xs"
                style={{ color: C.inkSoft }}
              >
                Already have an account? <span className="font-semibold underline" style={{ color: C.blushDeep }}>Sign in</span>
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 p-3 rounded-2xl flex items-center justify-between text-xs" style={{ background: C.paperDeep }}>
          <span className="ff-body" style={{ color: C.inkSoft }}>
            Demo credentials: <code className="px-1.5 py-0.5 rounded" style={{ background: C.cream }}>{DEMO_ACCOUNTS.mom.email}</code> / <code className="px-1.5 py-0.5 rounded" style={{ background: C.cream }}>{DEMO_ACCOUNTS.mom.password}</code>
          </span>
          <button
            type="button"
            onClick={fillDemo}
            className="ff-body underline font-medium text-xs ml-2"
            style={{ color: C.sageDark }}
          >
            Auto-fill
          </button>
        </div>
      </div>
    </Screen>
  );
}
