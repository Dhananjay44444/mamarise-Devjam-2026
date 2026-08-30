import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ListTodo, Moon, Sparkles, UserPlus, LogIn } from "lucide-react";
import { C, shadows } from "../theme";
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

const MISSIONS = [
  { icon: Moon, t: "Cover a night stretch", d: "See her last check-in. Pick up wake-ups if she's depleted." },
  { icon: ListTodo, t: "Clear the pending list", d: "Accept or take household tasks so the load isn't guessed." },
  { icon: CheckCircle2, t: "Make help visible", d: "Confirmed tasks show up in the shared household picture." },
];

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { dispatch } = useAppState();
  const [mode, setMode] = useState("signin"); // "signin" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState("Night help");
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
    setEmail(DEMO_ACCOUNTS.partner.email);
    setPassword(DEMO_ACCOUNTS.partner.password);
    setName(DEMO_ACCOUNTS.partner.name);
    setErrors({});
    setFormError("");
  };

  const quickDemoLogin = async () => {
    setLoading(true);
    setFormError("");
    try {
      const session = await loginWithPassword({
        email: DEMO_ACCOUNTS.partner.email,
        password: DEMO_ACCOUNTS.partner.password,
        name: DEMO_ACCOUNTS.partner.name,
        role: "partner",
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: session });
      navigate(PATHS.partnerDashboard, { replace: true });
    } catch (err) {
      setFormError(err.message || "Failed to log in with demo partner account.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubCode("");

    if (mode === "register") {
      const next = validateRegisterFields({ email, password, name, role: "partner" });
      setErrors(next);
      if (Object.keys(next).length) return;

      setLoading(true);
      try {
        const session = await registerUser({ email, password, name, role: "partner" });
        dispatch({ type: "LOGIN_SUCCESS", payload: session });
        navigate(PATHS.partnerDashboard, { replace: true });
      } catch (err) {
        setFormError(err.message || "Could not create partner account. Try again.");
        if (err.fields) setErrors(err.fields);
      } finally {
        setLoading(false);
      }
    } else {
      const next = validateLoginFields({ email, password, name, role: "partner" });
      setErrors(next);
      if (Object.keys(next).length) return;

      setLoading(true);
      try {
        const session = await loginWithPassword({ email, password, name, role: "partner" });
        dispatch({ type: "LOGIN_SUCCESS", payload: session });
        navigate(PATHS.partnerDashboard, { replace: true });
      } catch (err) {
        setFormError(err.message || "Could not sign in. Try again.");
        if (err.subCode) setSubCode(err.subCode);
        if (err.fields) setErrors(err.fields);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Screen ambient={false} style={{ background: C.cream }}>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <button
            onClick={() => navigate(PATHS.chooseRole)}
            className="ff-body text-xs flex items-center gap-1 font-medium px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
            style={{ color: C.inkSoft }}
          >
            <ArrowLeft size={14} /> Back to Roles
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: C.sageLight, border: `1px solid ${C.sage}` }}>
              <span className="ff-body text-xs font-semibold uppercase tracking-wider" style={{ color: C.sageDark }}>
                Partner action desk
              </span>
            </div>
            <h1 className="ff-display text-4xl leading-tight mb-4" style={{ color: C.ink }}>
              Show up. Take the next useful step.
            </h1>
            <p className="ff-body text-sm mb-8 leading-relaxed" style={{ color: C.inkMuted }}>
              This login is for doing, not browsing. After you sign in you'll see what she actually needs — then you pick it up without friction.
            </p>

            <ol className="space-y-4">
              {MISSIONS.map((m, i) => (
                <li key={m.t} className="flex gap-4">
                  <span
                    className="ff-display w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold shadow-sm"
                    style={{ background: C.sageLight, color: C.sageDark, border: `1px solid ${C.sage}` }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="ff-body text-sm font-semibold flex items-center gap-2" style={{ color: C.ink }}>
                      <m.icon size={14} style={{ color: C.sageDark }} /> {m.t}
                    </p>
                    <p className="ff-body text-xs mt-1 leading-relaxed" style={{ color: C.inkSoft }}>
                      {m.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4">
            {/* 1-Click Demo Login Banner */}
            <div
              className="p-4 rounded-2xl flex items-center justify-between gap-3 glass-panel shadow-sm"
              style={{ border: `1px solid ${C.sage}`, background: C.sageSoft }}
            >
              <div>
                <p className="ff-display text-sm font-semibold" style={{ color: C.sageDark }}>
                  Partner Demo Ready
                </p>
                <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                  Instant test access as Rohan
                </p>
              </div>
              <button
                type="button"
                onClick={quickDemoLogin}
                disabled={loading}
                className="ff-body text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-medium shrink-0 shadow-sm transition-transform hover:scale-105"
                style={{ background: C.sage, color: C.cream }}
              >
                <Sparkles size={13} /> 1-Click Demo
              </button>
            </div>

            <form
              onSubmit={submit}
              className="rounded-3xl p-6 md:p-8 glass-panel"
              style={{
                border: "1.5px solid rgba(95, 135, 102, 0.35)",
                boxShadow: shadows.md,
              }}
              noValidate
            >
              {/* Tab switcher */}
              <div
                className="flex rounded-2xl p-1 mb-6"
                style={{ background: C.paperDeep, border: "1px solid rgba(216, 207, 192, 0.6)" }}
              >
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all select-none"
                  style={{
                    background: mode === "signin" ? C.cream : "transparent",
                    color: mode === "signin" ? C.ink : C.inkSoft,
                    boxShadow: mode === "signin" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <LogIn size={13} style={{ color: mode === "signin" ? C.sage : C.inkSoft }} /> Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="flex-1 py-2 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all select-none"
                  style={{
                    background: mode === "register" ? C.cream : "transparent",
                    color: mode === "register" ? C.ink : C.inkSoft,
                    boxShadow: mode === "register" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <UserPlus size={13} style={{ color: mode === "register" ? C.sage : C.inkSoft }} /> Create Account
                </button>
              </div>

              <p className="ff-body text-xs tracking-[0.16em] uppercase mb-1 font-bold" style={{ color: C.sageDark }}>
                {mode === "signin" ? "Sign in to help" : "New partner registration"}
              </p>
              <h2 className="ff-display text-2xl font-bold mb-5" style={{ color: C.ink }}>
                {mode === "signin" ? "Ready when you are." : "Step into the picture."}
              </h2>

              {mode === "register" && (
                <label className="block mb-4">
                  <span className="ff-body text-xs mb-1.5 block font-medium" style={{ color: C.inkSoft }}>Your Name</span>
                  <input
                    type="text"
                    value={name}
                    autoComplete="given-name"
                    onChange={(e) => setName(e.target.value)}
                    className="ff-body w-full px-4 py-3 rounded-2xl outline-none"
                    style={{ background: C.cream, color: C.ink, border: `1px solid ${errors.name ? C.blushDeep : C.line}` }}
                    placeholder="Your first name"
                  />
                  {errors.name && <span className="ff-body text-xs mt-1.5 block" style={{ color: C.blushDeep }}>{errors.name}</span>}
                </label>
              )}

              <label className="block mb-4">
                <span className="ff-body text-xs mb-1.5 block font-medium" style={{ color: C.inkSoft }}>Email</span>
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="ff-body w-full px-4 py-3 rounded-2xl outline-none"
                  style={{ background: C.cream, color: C.ink, border: `1px solid ${errors.email ? C.blushDeep : C.line}` }}
                  placeholder="partner@email.com"
                />
                {errors.email && <span className="ff-body text-xs mt-1.5 block" style={{ color: C.blushDeep }}>{errors.email}</span>}
              </label>

              <label className="block mb-5">
                <span className="ff-body text-xs mb-1.5 block font-medium" style={{ color: C.inkSoft }}>
                  {mode === "register" ? "Create a Password" : "Password"}
                </span>
                <input
                  type="password"
                  value={password}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ff-body w-full px-4 py-3 rounded-2xl outline-none"
                  style={{ background: C.cream, color: C.ink, border: `1px solid ${errors.password ? C.blushDeep : C.line}` }}
                  placeholder="Min. 6 characters"
                />
                {errors.password && <span className="ff-body text-xs mt-1.5 block" style={{ color: C.blushDeep }}>{errors.password}</span>}
              </label>

              <p className="ff-body text-xs mb-2 font-medium" style={{ color: C.inkSoft }}>I'll start with</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Night help", "Meals", "Laundry", "Whatever's pending"].map((label) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => setFocus(label)}
                    className="ff-body text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors select-none"
                    style={{
                      background: focus === label ? C.sageLight : C.paperDeep,
                      color: focus === label ? C.sageDark : C.inkSoft,
                      border: `1px solid ${focus === label ? C.sage : C.line}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {formError && (
                <div
                  className="ff-body text-sm mb-4 px-4 py-3 rounded-2xl"
                  style={{ background: C.blushSoft, color: C.blushDeep, border: `1px solid ${C.blush}` }}
                  role="alert"
                >
                  <p>{formError}</p>
                  {subCode === "ACCOUNT_NOT_FOUND" && (
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="mt-2 text-xs font-semibold underline block"
                    >
                      Click here to create this partner account now →
                    </button>
                  )}
                </div>
              )}

              <Button type="submit" variant="sage" disabled={loading} className="w-full justify-center">
                {loading
                  ? mode === "register" ? "Setting up account…" : "Connecting…"
                  : mode === "register" ? "Create Partner Account" : "Enter and help"}
              </Button>

              <div className="mt-4 pt-3 text-center" style={{ borderTop: `1px solid ${C.lineLight}` }}>
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="ff-body text-xs"
                    style={{ color: C.sageDark }}
                  >
                    New partner? <span className="font-semibold underline">Create an account</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="ff-body text-xs"
                    style={{ color: C.sageDark }}
                  >
                    Already registered? <span className="font-semibold underline">Sign in</span>
                  </button>
                )}
              </div>
            </form>

            <div className="p-3.5 rounded-2xl flex items-center justify-between text-xs glass-panel" style={{ border: `1px solid ${C.lineLight}` }}>
              <span className="ff-body" style={{ color: C.inkSoft }}>
                Demo: <code className="px-1.5 py-0.5 rounded bg-white font-mono">{DEMO_ACCOUNTS.partner.email}</code> / <code className="px-1.5 py-0.5 rounded bg-white font-mono">{DEMO_ACCOUNTS.partner.password}</code>
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="ff-body underline font-semibold text-xs ml-2"
                style={{ color: C.sageDark }}
              >
                Auto-fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
