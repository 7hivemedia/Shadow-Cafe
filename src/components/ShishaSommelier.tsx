import React, { useState } from "react";
import { ShishaFlavor, MixResponse } from "../types";
import { LIQUID_BASES } from "../data";
import { Sparkles, HelpCircle, Thermometer, Flame, Snowflake, Clock, AlertTriangle, Play, RefreshCw, Layers } from "lucide-react";

interface ShishaSommelierProps {
  flavors: ShishaFlavor[];
}

export default function ShishaSommelier({ flavors }: ShishaSommelierProps) {
  const [flavor1, setFlavor1] = useState(flavors[0]?.id || "");
  const [flavor2, setFlavor2] = useState(flavors[1]?.id || "");
  const [flavor3, setFlavor3] = useState("");
  const [liquidBase, setLiquidBase] = useState(LIQUID_BASES[0].id);
  const [iceTip, setIceTip] = useState(false);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<MixResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingSteps = [
    "Preheating premium organic coconut coals to 240°C...",
    "Aerating raw molasses & arranging leaf cuts in Egyptian clay...",
    "Applying thermal pressure limits over the liquid base...",
    "Consulting the deep-learning AI Shisha Sommelier...",
    "Gently refining glass vapor nodes and cloud densities..."
  ];

  // Map liquid base selection to color codes and bubbles
  const getLiquidProperties = () => {
    switch (liquidBase) {
      case "ice-water":
        return {
          fill: "url(#glacierWaterGradient)",
          glowColor: "rgba(34, 211, 238, 0.4)",
          bubbleColor: "text-cyan-200",
          name: "Glacier Water"
        };
      case "milk":
        return {
          fill: "url(#silkyMilkGradient)",
          glowColor: "rgba(255, 255, 255, 0.3)",
          bubbleColor: "text-zinc-400",
          name: "Creamy Whole Milk"
        };
      case "anise":
        return {
          fill: "url(#aniseTeaGradient)",
          glowColor: "rgba(245, 158, 11, 0.4)",
          bubbleColor: "text-amber-300",
          name: "Star Anise Tea"
        };
      case "citrus":
        return {
          fill: "url(#citrusJuiceGradient)",
          glowColor: "rgba(244, 63, 94, 0.4)",
          bubbleColor: "text-rose-300",
          name: "Citrus Juice"
        };
      default:
        return {
          fill: "url(#glacierWaterGradient)",
          glowColor: "rgba(99, 102, 241, 0.4)",
          bubbleColor: "text-indigo-300",
          name: "Glacier Water"
        };
    }
  };

  const currentLiquidProps = getLiquidProperties();

  const handleMix = async () => {
    if (!flavor1 || !flavor2) {
      setError("Please select at least two shisha flavours to create a mix.");
      return;
    }
    if (flavor1 === flavor2) {
      setError("Please choose two different primary and secondary flavour components.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Staggered premium visual loader step-by-step text
    let step = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        setLoadingStep(step);
      }
    }, 1100);

    try {
      const f1_obj = flavors.find((f) => f.id === flavor1);
      const f2_obj = flavors.find((f) => f.id === flavor2);
      const f3_obj = flavors.find((f) => f.id === flavor3);
      const base_obj = LIQUID_BASES.find((b) => b.id === liquidBase);

      const payload = {
        flavor1: f1_obj ? `${f1_obj.name} (${f1_obj.brand})` : flavor1,
        flavor2: f2_obj ? `${f2_obj.name} (${f2_obj.brand})` : flavor2,
        flavor3: f3_obj ? `${f3_obj.name} (${f3_obj.brand})` : flavor3 || "None",
        liquidBase: base_obj ? base_obj.name : liquidBase,
        iceTip,
        notes,
      };

      const response = await fetch("/api/shisha-mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to analyze shisha flavour blend.");
      }

      setResult(resData.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong during concoction. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const renderMeter = (val: number, label: string, colorClass: string, icon?: React.ReactNode) => {
    return (
      <div className="space-y-1.5 grow">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400 flex items-center gap-1">
            {icon}
            {label}
          </span>
          <span className="font-mono text-zinc-100 font-bold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">{val} / 5</span>
        </div>
        <div className="flex gap-1 h-2 bg-zinc-950 p-[1px] rounded-full border border-zinc-900 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-full grow rounded-sm transition-all duration-500 ${
                i < val ? colorClass : "bg-zinc-900"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setNotes("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* SELECTION CONTROL INTERACTIVE PANEL (5 cols) */}
      <div className="lg:col-span-5 bg-zinc-950/90 border border-zinc-805 rounded-3xl p-6 flex flex-col justify-between h-fit relative overflow-hidden shadow-2xl animate-pulse-glow">
        {/* Subtle decorative mesh background details */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full"></div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Sparkles className="h-5 w-5 animate-spin-slow" />
              </span>
              <h3 className="font-serif text-xl font-bold text-zinc-100">Mixologist Alchemist</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Choose your exact base properties. Select up to three independent shisha bases, customize your flask filtration liquid, and clip a cooling ice-gel wand to generate deep sensory predictions.
            </p>
          </div>

          <div className="space-y-4 border-t border-zinc-900 pt-4">
            {/* Primary Base selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between">
                <span>Primary Base (50% Ratio)</span>
                <span className="text-indigo-400 font-semibold uppercase">Mandatory</span>
              </label>
              <select
                value={flavor1}
                onChange={(e) => setFlavor1(e.target.value)}
                className="w-full py-3 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-semibold font-sans cursor-pointer hover:bg-zinc-850"
              >
                {flavors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.brand} ({f.strength})
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Enhancer selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between">
                <span>Secondary Enhancer (35% Ratio)</span>
                <span className="text-indigo-400 font-semibold uppercase">Mandatory</span>
              </label>
              <select
                value={flavor2}
                onChange={(e) => setFlavor2(e.target.value)}
                className="w-full py-3 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-semibold font-sans cursor-pointer hover:bg-zinc-850"
              >
                {flavors
                  .filter((f) => f.id !== flavor1)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.brand} ({f.strength})
                    </option>
                  ))}
              </select>
            </div>

            {/* Third Accent selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Third Accent (15% Ratio) — Optional
              </label>
              <select
                value={flavor3}
                onChange={(e) => setFlavor3(e.target.value)}
                className="w-full py-3 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans cursor-pointer hover:bg-zinc-850"
              >
                <option value="" className="text-zinc-500">None (Pure Two-Tone Blend)</option>
                {flavors
                  .filter((f) => f.id !== flavor1 && f.id !== flavor2)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.brand} ({f.strength})
                    </option>
                  ))}
              </select>
            </div>

            {/* Hookah vase liquid liquid filter base */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono flex items-center justify-between">
                <span>Hookah Vase Filtration Liquid</span>
                <span className="text-zinc-500 font-normal">Changes Liquid Visuals</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LIQUID_BASES.map((base) => {
                  const isSelected = liquidBase === base.id;
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => setLiquidBase(base.id)}
                      className={`
                        p-2.5 text-left rounded-xl border text-xs transition-all relative flex flex-col justify-between cursor-pointer group
                        ${
                          isSelected
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-300"
                            : "bg-zinc-900/60 border-zinc-850 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        }
                      `}
                    >
                      <div>
                        <p className="font-semibold truncate text-[11px] group-hover:text-zinc-200 transition-colors">{base.name}</p>
                        <p className="text-[9px] text-zinc-500 leading-tight mt-0.5 overflow-hidden line-clamp-1">
                          {base.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1.5 w-full">
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">
                          {base.id === "ice-water" ? "Neutral" : "Aromatic"}
                        </span>
                        {base.cost > 0 ? (
                          <span className="text-[8px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/35 px-1 py-0.5 rounded font-bold font-mono">
                            +₹{base.cost}
                          </span>
                        ) : (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-1 py-0.5 rounded font-bold font-mono">
                            FREE
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Cooling Freezing Ice hose tips toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-semibold text-zinc-250 flex items-center gap-1">
                  <Snowflake className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  Premium Arctic Gel Ice-Hose
                </span>
                <p className="text-[9px] text-zinc-500 leading-tight">
                  Clips a frozen gel core to cool down the inhalation stream, stripping harshness.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={iceTip}
                  onChange={(e) => setIceTip(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-zinc-550 after:border-zinc-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-indigo-100"></div>
              </label>
            </div>

            {/* Special custom requests notes */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                Request adjustments to Shisha Sommelier Chefs
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Pack loose in funnel bowl, triple foil slots, heavy heat..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Create trigger button */}
        <div className="mt-6">
          <button
            onClick={handleMix}
            disabled={loading}
            className="w-full py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/10 cursor-pointer disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed group active:scale-95"
          >
            <Play className="h-4 w-4 shrink-0 fill-current group-hover:scale-110 transition-transform" />
            Concoct Alchemist Sommelier Lab
          </button>
        </div>
      </div>

      {/* RESULT INTERACTIVE VISUAL REACTOR PANEL (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-start gap-6 min-h-[500px]">
        
        {/* INTERACTIVE ALCHEMIST HOOKAH SVW REACTOR (Stays visible in Idle & Result) */}
        <div className="bg-[#0b0b0e] border border-zinc-850 rounded-3xl p-6 relative flex flex-col md:flex-row items-center gap-6 overflow-hidden shadow-xl">
          {/* Glass background highlights */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full"></div>
          
          {/* Live indicator tag */}
          <span className="absolute top-4 left-4 text-[9px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-800 px-2 py-1 rounded-full">
            <span className={`h-2 w-2 rounded-full ${loading ? "bg-amber-400 animate-ping" : "bg-indigo-400 animate-pulse"}`}></span>
            {loading ? "Fusing Molecular Compounds" : "Aura Reactor State: Ready"}
          </span>

          {/* Liquid Base Tag indicator on Hookah */}
          <span className="absolute top-4 right-4 text-[9px] font-mono tracking-wider text-zinc-400 flex items-center gap-1 bg-black/50 border border-zinc-850 px-2.5 py-1 rounded-full uppercase">
            Vase Fluid: <span className="text-zinc-200 font-bold">{currentLiquidProps.name}</span>
          </span>

          {/* Left Side: SVG Reactor Core */}
          <div className="relative w-44 h-60 flex-shrink-0 flex items-center justify-center">
            {/* Ice frosting particles absolute layer */}
            {iceTip && (
              <div className="absolute inset-0 pointer-events-none opacity-45 select-none animate-pulse">
                <div className="absolute top-2/3 left-1/4 text-[8px] text-cyan-300 font-serif">❄</div>
                <div className="absolute top-1/2 right-1/4 text-[10px] text-cyan-300 font-serif">❄</div>
              </div>
            )}

            <svg
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              viewBox="0 0 120 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glacier Water Blue Gradient */}
                <linearGradient id="glacierWaterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.9" />
                </linearGradient>

                {/* Silky Whole Milk Gradient */}
                <linearGradient id="silkyMilkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>

                {/* Warm Star Anise Tea Gradient */}
                <linearGradient id="aniseTeaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
                </linearGradient>

                {/* Chilled Citrus Juice Gradient */}
                <linearGradient id="citrusJuiceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.85" />
                </linearGradient>

                {/* Glass reflections overlay */}
                <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.03" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0.0" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
                </linearGradient>

                {/* Hot Ember Coal Glow gradient */}
                <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff4500" stopOpacity="1" />
                  <stop offset="60%" stopColor="#dc2626" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Hookah Hose Connection System */}
              <path
                d="M 68 150 C 95 150, 110 110, 105 50"
                stroke={iceTip ? "#22d3ee" : "#3f3f46"}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                className={`transition-all duration-700 ${iceTip ? "shadow-lg shadow-cyan-500/25" : ""}`}
              />
              {/* Hose base adaptor */}
              <rect x="64" y="145" width="6" height="8" rx="1" fill="#71717a" />

              {/* Center Metallic Core Stem (Downstem) */}
              <line x1="60" y1="50" x2="60" y2="165" stroke="#a1a1aa" strokeWidth="5" strokeLinecap="round" />
              <line x1="60" y1="50" x2="60" y2="165" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Glass Vase Outer Outline (Flask Chamber) */}
              {/* Bottom Base sits at Y=200, widest bulb fits between X=25 and X=95 */}
              <path
                d="M 45 100 C 45 120, 20 150, 20 185 C 20 202, 35 205, 60 205 C 85 205, 100 202, 100 185 C 100 150, 75 120, 75 100 L 73 60 C 73 50, 47 50, 47 60 Z"
                fill="#18181b"
                fillOpacity="0.4"
                stroke="#4b5563"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic Fluid Content Base Level */}
              {/* This cuts in via clip path or just masked inside a curved arc */}
              <path
                d="M 23 182 C 22 165, 36 148, 48 143 L 72 143 C 84 148, 98 165, 97 182 C 97 198, 85 201, 60 201 C 35 201, 23 198, 23 182 Z"
                fill={currentLiquidProps.fill}
                style={{ filter: `drop-shadow(0 0 10px ${currentLiquidProps.glowColor})` }}
                className="transition-all duration-700"
              />

              {/* Animated rising bubbles container (Only active/bubbles faster if compiling, but always drifts slightly) */}
              <g className="bubbles-overlay pointer-events-none">
                <circle cx="42" cy="188" r="1.5" className="fill-white/35 animate-bubble-up" />
                <circle cx="55" cy="192" r="2.5" className="fill-white/35 animate-bubble-up" style={{ animationDelay: '1.2s', animationDuration: '2.8s' }} />
                <circle cx="68" cy="180" r="1.8" className="fill-white/45 animate-bubble-up" style={{ animationDelay: '0.5s', animationDuration: '3.1s' }} />
                <circle cx="75" cy="194" r="1.2" className="fill-white/25 animate-bubble-up" style={{ animationDelay: '1.9s', animationDuration: '2.4s' }} />
                <circle cx="50" cy="185" r="2.0" className="fill-white/40 animate-bubble-up" style={{ animationDelay: '2.3s', animationDuration: '3.5s' }} />
                {loading && (
                  <g>
                    <circle cx="45" cy="195" r="3" className="fill-white/50 animate-bubble-up" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }} />
                    <circle cx="62" cy="190" r="3.5" className="fill-white/60 animate-bubble-up" style={{ animationDelay: '0.8s', animationDuration: '1.8s' }} />
                  </g>
                )}
              </g>

              {/* Glass Reflection specular Highlights */}
              <path
                d="M 28 185 C 28 170, 36 155, 48 145"
                stroke="url(#glassReflection)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 49 65 L 49 92"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* Purge valve details */}
              <circle cx="40" cy="115" r="3.5" fill="#52525b" />
              <line x1="40" y1="115" x2="35" y2="112" stroke="#71717a" strokeWidth="2" />

              {/* Hookah Stem Accents / Rings (Decorative tech) */}
              <ellipse cx="60" cy="72" rx="10" ry="2.5" fill="#a1a1aa" />
              <ellipse cx="60" cy="85" rx="8" ry="2" fill="#71717a" />

              {/* Charcoal Tray (Pillar Rim plate) */}
              <path d="M 32 46 C 32 40, 88 40, 88 46 L 82 50 L 38 50 Z" fill="#52525b" stroke="#3f3f46" strokeWidth="1" />

              {/* Egyptian Clay Bowl (Top Vessel holds tobacco) */}
              <path d="M 44 26 L 76 26 L 70 42 L 50 42 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
              {/* Dynamic burning embers visual heat glow */}
              <ellipse
                cx="60"
                cy="28"
                rx="14"
                ry="3.5"
                fill={loading ? "url(#emberGlow)" : "#3f3f46"}
                className={`transition-all duration-700 ${loading ? "animate-pulse" : ""}`}
              />

              {/* Visual Coals cubes arranged beautifully */}
              <g className="ember-coals shadow-md">
                <rect
                  x="50"
                  y="18"
                  width="8"
                  height="8"
                  transform="rotate(10 50 18)"
                  fill={loading ? "#ea580c" : "#27272a"}
                  stroke={loading ? "#f97316" : "#18181b"}
                  strokeWidth="0.5"
                  className="transition-colors duration-700"
                />
                <rect
                  x="64"
                  y="19"
                  width="7"
                  height="7"
                  transform="rotate(-15 64 19)"
                  fill={loading ? "#f97316" : "#27272a"}
                  stroke={loading ? "#fdba74" : "#18181b"}
                  strokeWidth="0.5"
                  className="transition-colors duration-700"
                />
              </g>

              {/* Steam drift rising vector (Decorative simulation of actual clouds) */}
              <g className={`transition-opacity duration-500 ${loading ? "opacity-100" : "opacity-30"}`}>
                <path
                  d="M 60 15 Q 55 5, 45 8 T 35 15"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-vapor-drift"
                />
                <path
                  d="M 65 15 Q 75 5, 80 12 T 90 2"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-vapor-drift"
                  style={{ animationDelay: '1.8s' }}
                />
              </g>
            </svg>
          </div>

          {/* Right Side: Status Narrative specifications explaining the visual properties */}
          <div className="space-y-3 font-sans grow">
            <h4 className="text-zinc-200 text-sm font-semibold flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-400" /> Molecular Properties
            </h4>
            
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900">
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Embers Temperature</p>
                <p className="text-sm font-semibold text-zinc-300 mt-0.5">
                  {loading ? "🔥 245°C Optimal" : "❄ Cold Coals"}
                </p>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900">
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Vase Micro-Shock</p>
                <p className="text-sm font-semibold text-zinc-300 mt-0.5">
                  {iceTip ? "🧊 Active Arctic Tip" : "🌡 No Cooling"}
                </p>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 col-span-2">
                <p className="text-[10px] text-zinc-500 font-mono uppercase flex items-center gap-1 justify-between">
                  <span>Chemical Base Solution</span>
                  <span className="text-zinc-650 tracking-tighter self-end text-[8px] font-mono lowercase">Filtration Weight</span>
                </p>
                <p className="text-xs text-zinc-350 font-serif leading-tight mt-1">
                  {liquidBase === "ice-water" && "Crisp, fully untainted classic vapor filter. Yields the authentic, pure tobacco terpene profiles."}
                  {liquidBase === "milk" && "Rich high-fat cloud emulsifier. Enhances thickness and dense, milky sweet cloud volumes."}
                  {liquidBase === "anise" && "Deep, liquorice-spiced hot wood infusions. Adds aromatic warmth and ancient herbal undertone."}
                  {liquidBase === "citrus" && "Citric sharp rinds. Zesty acid cuts through sweet notes, neutralizing heavy molasses burn."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SCREEN / INITIATION STATES PANEL */}
        <div className="grow flex flex-col justify-stretch">
          
          {/* STATE A: COCONUT PREHEATING LOADER */}
          {loading && (
            <div className="bg-[#0b0b0e] border border-zinc-850 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-5 shadow-2xl grow relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="relative h-20 w-20 flex items-center justify-center">
                <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin" />
              </div>
              <div className="space-y-2 max-w-sm relative z-10">
                <h4 className="font-serif text-lg font-bold text-zinc-150 tracking-tight">Molecular Synth Imminent</h4>
                <p className="text-zinc-400 text-xs font-mono transition-all duration-300 animate-pulse h-10 px-4">
                  {loadingSteps[loadingStep]}
                </p>
              </div>
            </div>
          )}

          {/* STATE B: SECURED FORMULATION REPORT */}
          {result && !loading && (
            <div className="bg-gradient-to-b from-zinc-950 to-[#0b0b0e] border border-indigo-950/40 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl grow min-h-[400px]">
              {/* Elegant floating lights */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-3xl pointer-events-none rounded-full"></div>

              <div className="space-y-5">
                {/* Header detail report title */}
                <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[3px] text-indigo-400 font-bold block">
                      Quantum Sommelier Formulation
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-zinc-100 tracking-tight mt-1">
                      {result.name}
                    </h3>
                    <p className="text-xs text-zinc-400 italic font-serif mt-1 opacity-90">
                      &ldquo;{result.aromaSummary}&rdquo;
                    </p>
                  </div>
                  
                  {result.recommendedCoals && (
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono uppercase font-bold tracking-wider shrink-0 self-start">
                      <Flame className="h-3.5 w-3.5 animate-bounce" /> {result.recommendedCoals} Coals Optimal
                    </span>
                  )}
                </div>

                {/* Sensation Meter Grid bars */}
                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-900/80 flex flex-col md:flex-row gap-4">
                  {renderMeter(result.sweetness || 3, "Sweetness Focus", "bg-rose-500", <span className="text-rose-400 text-xs">●</span>)}
                  {renderMeter(result.freshness || 3, "Vapor Chill Metric", "bg-cyan-400", <span className="text-cyan-400 text-xs">❄</span>)}
                  {renderMeter(result.intensity || 3, "Cloud Molecular Mass", "bg-purple-500", <span className="text-purple-400 text-xs">✦</span>)}
                </div>

                {/* Sensory Review Explanation Narrative */}
                <div className="p-4 rounded-2xl bg-[#101016]/40 border border-indigo-950/20 text-xs text-zinc-300 leading-relaxed font-sans shadow-inner">
                  <p className="font-semibold text-[10px] text-indigo-300 uppercase tracking-widest font-mono mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" /> Alchemist Evaluation Notes
                  </p>
                  <p>{result.description}</p>
                </div>

                {/* Milestones timeline */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">Session Longevity Tasting Phases</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.sommelierTastingNotes.map((note, i) => (
                      <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex gap-2 items-start text-xs text-zinc-400">
                        <span className="h-5 w-5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono flex items-center justify-center shrink-0 text-indigo-400 font-bold">
                          {i === 0 ? "10m" : i === 1 ? "40m" : "80m"}
                        </span>
                        <span className="leading-tight text-[11px] font-sans">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* operational footer variables */}
              <div className="mt-6 pt-4 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between sm:items-center text-[10px] text-zinc-500 font-mono gap-3">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-900 w-fit">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" /> Session Lifespan Duration: ~{result.sessionDurationMins || 90} mins
                </span>
                
                <button
                  onClick={handleReset}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold bg-transparent border-none cursor-pointer"
                >
                  Clear and Design another blend ✕
                </button>
              </div>
            </div>
          )}

          {/* STATE C: ERROR BOUNDARIES */}
          {error && !loading && (
            <div className="bg-[#0b0b0e] border border-red-950/40 rounded-3xl p-8 text-center flex flex-col justify-center items-center min-h-[400px] space-y-4 shadow-xl grow">
              <AlertTriangle className="h-10 w-10 text-rose-500 animate-bounce" />
              <h4 className="font-serif text-lg font-bold text-zinc-200">Formulation Blocked</h4>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                {error}
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Clear and Try Again
              </button>
            </div>
          )}

          {/* STATE D: INITIAL IDLE GUIDE */}
          {!loading && !result && !error && (
            <div className="border border-dashed border-zinc-800/80 rounded-3xl p-12 text-center space-y-5 text-zinc-500 max-w-md mx-auto flex flex-col items-center justify-center grow min-h-[400px]">
              <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-805 flex items-center justify-center text-indigo-400 shadow-lg animate-float-slow">
                <HelpCircle className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-base font-bold text-zinc-300 tracking-tight">Idle State: Synthesizer Offline</h4>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs font-sans">
                  Use the configure interface on the left to set up tobacco compounds. Tab <strong>concoct</strong> to vaporize the digital coals in real time!
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
export { ShishaSommelier };
