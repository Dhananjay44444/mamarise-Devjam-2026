import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Check, X } from "lucide-react";
import { C, fadeUp, stagger } from "../theme";
import { Screen, Card, Button, TopBar, Chip, Badge } from "../ui/chrome";
import { Doodle } from "../ui/Doodles";

export default function CareCircle({ circle = [], setCircle, go }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Babysitting");
  const [availability, setAvailability] = useState("Weekday mornings");
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState("All");

  const roles = ["Babysitting", "Meal drop-off", "School pickup", "Emotional support", "Night help"];
  const availOptions = ["Weekday mornings", "Weekday evenings", "Weekends", "On-call anytime"];

  const add = () => {
    if (!name.trim()) return;
    setCircle([
      {
        id: Date.now(),
        name: name.trim(),
        role,
        availability,
        note: note.trim(),
        status: "available",
      },
      ...circle,
    ]);
    setName("");
    setNote("");
  };

  const remove = (id) => setCircle(circle.filter((c) => c.id !== id));
  const request = (id) =>
    setCircle(circle.map((c) => (c.id === id ? { ...c, status: "pending" } : c)));
  const confirm = (id) =>
    setCircle(circle.map((c) => (c.id === id ? { ...c, status: "confirmed" } : c)));

  const visible = filter === "All" ? circle : circle.filter((c) => c.role === filter);

  return (
    <Screen className="pb-16">
      <div className="max-w-2xl mx-auto">
        <TopBar
          title="Care Circle"
          subtitle="Trusted inner network on your terms — no public ratings"
          onBack={() => go("dashboard")}
          role="mom"
        />

        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: C.blushLight }}>
              <Doodle.Heart className="w-8 h-8" style={{ color: C.blushDeep }} />
            </div>
            <div>
              <h1 className="ff-display text-3xl font-bold tracking-tight" style={{ color: C.ink }}>
                People You Trust, On Your Terms.
              </h1>
              <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                Invite verified friends, family, and trusted caregivers with zero public rating pressure.
              </p>
            </div>
          </motion.div>

          {/* Add Helper Card */}
          <motion.div variants={fadeUp}>
            <Card className="mb-6">
              <h3 className="ff-display text-base font-bold mb-3" style={{ color: C.ink }}>
                Add to Your Circle
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Helper's Name (e.g. Nani, Priya, Aunty Sunita)"
                  className="ff-body w-full px-4 py-3 rounded-2xl outline-none text-xs"
                  style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="ff-body px-3.5 py-2.5 rounded-2xl outline-none text-xs"
                    style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                  >
                    {roles.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>

                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="ff-body px-3.5 py-2.5 rounded-2xl outline-none text-xs"
                    style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                  >
                    {availOptions.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Private note (optional — e.g. great with newborn soothing)"
                  className="ff-body w-full px-4 py-3 rounded-2xl outline-none text-xs"
                  style={{ background: C.cream, border: `1px solid ${C.line}`, color: C.ink }}
                />

                <Button variant="blush" size="md" onClick={add} className="w-full justify-center">
                  <Plus size={15} /> Add to Care Circle
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Filter Chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-4">
            <Chip label="All Support" selected={filter === "All"} onClick={() => setFilter("All")} />
            {roles.map((r) => (
              <Chip key={r} label={r} selected={filter === r} onClick={() => setFilter(r)} />
            ))}
          </motion.div>

          {/* Circle Helpers List */}
          <motion.div variants={fadeUp} className="space-y-3 mb-6">
            <AnimatePresence>
              {visible.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card hover={false} className="!p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center ff-display font-bold text-base shrink-0 shadow-sm"
                          style={{ background: C.sageLight, color: C.sageDark }}
                        >
                          {p.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="ff-display text-base font-bold" style={{ color: C.ink }}>
                            {p.name}
                          </p>
                          <p className="ff-body text-xs" style={{ color: C.inkSoft }}>
                            {p.role} · <span className="font-medium text-emerald-700">{p.availability}</span>
                          </p>
                          {p.note && (
                            <p className="ff-body text-xs italic mt-1" style={{ color: C.inkMuted }}>
                              "{p.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => remove(p.id)}
                        className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="mt-3.5 pt-3 border-t flex items-center justify-between flex-wrap gap-2" style={{ borderColor: C.lineLight }}>
                      <div>
                        {p.status === "available" && (
                          <Button variant="sage" size="sm" onClick={() => request(p.id)}>
                            Ask for Support
                          </Button>
                        )}
                        {p.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Badge variant="warning">Awaiting Reply</Badge>
                            <button
                              onClick={() => confirm(p.id)}
                              className="ff-body text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold"
                            >
                              Simulate: They accepted
                            </button>
                          </div>
                        )}
                        {p.status === "confirmed" && (
                          <Badge variant="steady">
                            <Check size={11} /> Confirmed for this week
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {visible.length === 0 && (
              <div className="py-10 text-center text-stone-400 glass-panel rounded-3xl">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p className="ff-display text-base text-stone-700">No helpers found in this category</p>
                <p className="ff-body text-xs mt-1">Add trusted friends or relatives above.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Screen>
  );
}
