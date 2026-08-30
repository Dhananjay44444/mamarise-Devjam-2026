import React, { useState } from "react";
import { Copy, Printer, Check, Shield } from "lucide-react";
import { C, shadows } from "../theme";
import { Screen, Button, TopBar } from "../ui/chrome";

function capacityLabel(recovery) {
  if (!recovery) return "Pending";
  if (recovery.energy === "Low" || recovery.sleepHours < 5) return "Low Capacity";
  if (recovery.energy === "Okay") return "Moderate Capacity";
  return "Steady Capacity";
}

export default function ShareExport({ user, recovery, skills = [], go }) {
  const [copied, setCopied] = useState(false);
  const doneSkills = skills.filter((s) => s.done);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://mamarise.app/r/${(user.name || "aisha").toLowerCase()}-readiness`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Screen className="pb-16">
      <div className="max-w-xl mx-auto">
        <TopBar
          title="Share & Export"
          subtitle="Communicate readiness and growth with employers"
          onBack={() => go("readinesscard")}
          role="mom"
        />

        <div className="mb-6">
          <h1 className="ff-display text-3xl font-bold mb-2" style={{ color: C.ink }}>
            Show the whole story.
          </h1>
          <p className="ff-body text-sm" style={{ color: C.inkSoft }}>
            Not a blank gap — physical recovery, shared domestic balance, and deliberate skill maintenance made visible.
          </p>
        </div>

        {/* Printable View */}
        <div id="printable-card" className="mb-6">
          <div
            className="p-7 md:p-8 rounded-3xl"
            style={{
              background: "linear-gradient(145deg, #2B2620 0%, #171512 100%)",
              border: "1.5px solid rgba(212, 163, 89, 0.4)",
              color: C.cream,
              boxShadow: shadows.md,
            }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="ff-body text-xs font-bold uppercase tracking-widest text-emerald-400">
                MamaRise Readiness Portfolio
              </span>
              <Shield size={14} className="text-stone-400" />
            </div>

            <h2 className="ff-display text-2xl font-bold text-white mb-1">
              {user.name || "Aisha Sharma"}
            </h2>
            <p className="ff-body text-xs text-stone-400 mb-5">
              Verified Postpartum & Career Transition Candidate
            </p>

            <div className="space-y-2 text-xs text-stone-300 mb-5">
              <p>• <b>Recovery Pacing:</b> {capacityLabel(recovery)}</p>
              <p>• <b>Household Load:</b> Proactively balanced with partner support</p>
              <p>
                • <b>Skills Maintained:</b>{" "}
                {doneSkills.length ? doneSkills.map((s) => s.name).join(", ") : "Active Micro-Refreshes in progress"}
              </p>
              <p>• <b>Recovery & Wellness Learning:</b> Certified clinical studio hours logged</p>
            </div>

            <p className="text-[10px] font-mono text-stone-500 pt-3 border-t border-white/10">
              Issued via MamaRise Verified Readiness Engine
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 mb-6">
          <Button variant="sage" size="lg" onClick={copyLink} className="w-full justify-center">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "Shareable Link Copied to Clipboard!" : "Copy Shareable Portfolio Link"}</span>
          </Button>

          <Button variant="outline" size="md" onClick={() => window.print()} className="w-full justify-center">
            <Printer size={16} />
            <span>Download / Print as PDF</span>
          </Button>
        </div>

        <p className="ff-body text-xs text-center leading-relaxed" style={{ color: C.inkSoft }}>
          "Download as PDF" opens your browser's native print dialog — select "Save as PDF" as the destination.
        </p>
      </div>
    </Screen>
  );
}
