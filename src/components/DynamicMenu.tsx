import React, { useState, useMemo } from "react";
import { ShishaFlavor } from "../types";
import { Search, Flame, Snowflake, Sparkles, Filter, Leaf, ChevronRight, Check, Compass, HelpCircle } from "lucide-react";

interface DynamicMenuProps {
  flavors: ShishaFlavor[];
  selectedFlavorId: string;
  onSelectFlavor: (flavorId: string) => void;
}

type MenuMood = "all" | "cosy" | "ice" | "zen" | "sweet-treat";

export default function DynamicMenu({ flavors, selectedFlavorId, onSelectFlavor }: DynamicMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeStrength, setActiveStrength] = useState<string>("all");
  
  // Custom interactive mood pair state
  const [selectedMood, setSelectedMood] = useState<MenuMood>("all");

  const categories = [
    { id: "all", name: "All profiles" },
    { id: "fruity", name: "Fruity" },
    { id: "minty", name: "Minty & Ice" },
    { id: "spicy", name: "Spiced & Warm" },
    { id: "floral", name: "Floral & Herb" },
    { id: "dessert", name: "Creams & Sweets" },
  ];

  // Filters logic incorporating the custom mood pair filters
  const filteredFlavors = useMemo(() => {
    return flavors.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.notes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = activeCategory === "all" || f.category === activeCategory;
      const matchStrength = activeStrength === "all" || f.strength === activeStrength;

      // Custom Mood pairing thresholds
      let matchMood = true;
      if (selectedMood === "cosy") {
        matchMood = f.warmth >= 3 || f.category === "spicy";
      } else if (selectedMood === "ice") {
        matchMood = f.freshness >= 4 || f.category === "minty";
      } else if (selectedMood === "zen") {
        matchMood = f.category === "floral" || f.notes.includes("Lavender") || f.notes.includes("Hibiscus Tea");
      } else if (selectedMood === "sweet-treat") {
        matchMood = f.sweetness >= 4 || f.category === "dessert";
      }

      return matchSearch && matchCategory && matchStrength && matchMood;
    });
  }, [flavors, searchQuery, activeCategory, activeStrength, selectedMood]);

  // Suggest dynamic pairings based on currently selected tobacco
  const getPairingSuggestion = (flavor: ShishaFlavor) => {
    if (flavor.category === "fruity") {
      return "Pair with 'Gotham Double Mint' for an exceptionally fresh, crisp orchard frost.";
    }
    if (flavor.category === "minty") {
      return "Pair with 'Pasha's Pistachio Cream' to temper down intense ice with heavy buttery walnut.";
    }
    if (flavor.category === "spicy") {
      return "Pair with 'Purple Haze' for a mesmerizing, lavender-cardamom incense mist.";
    }
    if (flavor.category === "floral") {
      return "Pair with 'Kashmir Peach' for a warm floral-peach infusion of pure elegance.";
    }
    return "Pair with 'Blue Mystique' for a rich, blueberry-clove alchemist sweetness.";
  };

  const renderProgress = (val: number, colorClass: string) => {
    return (
      <div className="flex items-center gap-1.5 w-full">
        <div className="flex gap-0.5 grow h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-full grow rounded-sm transition-all duration-300 ${
                i < val ? colorClass : "bg-zinc-900"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-zinc-550 shrink-0 select-none font-bold">{val}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* 1. MOOD-PAIRING INTERACTIVE TOOLBAR */}
      <div className="bg-gradient-to-r from-[#0b0b0e] to-black border border-zinc-850 p-6 rounded-3xl relative overflow-hidden shadow-lg">
        {/* Glow element */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-4 mb-4">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[3px] text-indigo-400 font-bold block">Sensory Helper Portal</span>
            <h4 className="text-sm font-serif font-bold text-zinc-100 flex items-center gap-1.5 mt-0.5">
              <Compass className="h-4 w-4 text-indigo-400 animate-spin-slow" /> What is your current Lounge Vibe?
            </h4>
          </div>
          {selectedMood !== "all" && (
            <button
              onClick={() => setSelectedMood("all")}
              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition font-bold"
            >
              Reset Vibe Filter ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: "all", label: "Any Vibe", desc: "No bias", icon: "🌌" },
            { id: "cosy", label: "Cosy & Warm", desc: "Heavy Cardamom / Woody", icon: "☕" },
            { id: "ice", label: "Ice Shock Chill", desc: "Heavy Citric / Peppermint", icon: "🧊" },
            { id: "zen", label: "Floral Zen", desc: "Blended Lavender / Tea", icon: "🌸" },
            { id: "sweet-treat", label: "Sweet Dessert", desc: "Buttery Pastry / Fruit", icon: "🍮" }
          ].map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id as MenuMood)}
                className={`
                  p-3 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden
                  ${
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-200"
                      : "bg-black/50 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-800"
                  }
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg">{m.icon}</span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>}
                </div>
                <div className="mt-3">
                  <p className="font-semibold text-xs text-zinc-200 transition-colors group-hover:text-white">{m.label}</p>
                  <p className="text-[9px] text-zinc-550 leading-tight mt-0.5 line-clamp-1">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FILTERS AND SEARCH TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input bar */}
        <div className="relative grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search flavor names, elements, brands (e.g. Cardamom, Lavender)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium font-sans"
          />
        </div>

        {/* Categorization chips slider */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer
                ${
                  activeCategory === c.id
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "bg-zinc-950/60 text-zinc-400 border border-zinc-850 hover:bg-zinc-900/60 hover:text-zinc-200"
                }
              `}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. STRENGTH ROW */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-zinc-900 pb-4">
        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 shrink-0 uppercase tracking-wider">
          <Filter className="h-3 w-3 text-indigo-400" /> Raw Leaf Selection:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveStrength("all")}
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              activeStrength === "all"
                ? "bg-zinc-900 border-zinc-700 text-zinc-200"
                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350"
            }`}
          >
            All Cuts
          </button>
          <button
            onClick={() => setActiveStrength("Classic Blond")}
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              activeStrength === "Classic Blond"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Classic Blond (Easy Inhale)
          </button>
          <button
            onClick={() => setActiveStrength("Dark Leaf")}
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              activeStrength === "Dark Leaf"
                ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span> Dark Leaf (Heavy Nicotine)
          </button>
          <button
            onClick={() => setActiveStrength("Herbal")}
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              activeStrength === "Herbal"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Herbal (Nicotine-Free)
          </button>
        </div>
      </div>

      {/* 4. FLAVOR CARDS GRID */}
      {filteredFlavors.length === 0 ? (
        <div className="text-center py-16 border border-zinc-850/60 rounded-3xl bg-[#09090c]/40 max-w-sm mx-auto space-y-3">
          <Leaf className="h-12 w-12 text-zinc-700 mx-auto stroke-1 animate-bounce" />
          <div>
            <p className="text-zinc-300 font-semibold text-sm">No mixtures match your filters.</p>
            <p className="text-zinc-500 text-xs mt-1">Try resetting search keywords or selecting all profiles.</p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
              setActiveStrength("all");
              setSelectedMood("all");
            }}
            className="text-xs text-indigo-400 font-bold hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFlavors.map((flavor) => {
            const isSelected = selectedFlavorId === flavor.id;

            return (
              <div
                key={flavor.id}
                className={`
                  bg-[#0b0b0e] border rounded-3xl p-5 flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-300 relative overflow-hidden group
                  ${isSelected ? "border-indigo-550 shadow-[0_10px_25px_rgba(99,102,241,0.15)] bg-zinc-950" : "border-zinc-850"}
                `}
              >
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full group-hover:bg-indigo-500/10 transition-all"></div>

                <div>
                  {/* Category Pill and Pricing info */}
                  <div className="flex items-center justify-between mb-3.5 relative z-10">
                    <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded border ${
                      flavor.category === "fruity" && "bg-rose-500/10 border-rose-500/20 text-rose-300"
                    } ${
                      flavor.category === "minty" && "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                    } ${
                      flavor.category === "floral" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    } ${
                      flavor.category === "spicy" && "bg-amber-500/10 border-amber-500/20 text-amber-300"
                    } ${
                      flavor.category === "dessert" && "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                    }`}>
                      {flavor.category}
                    </span>
                    <span className="text-zinc-100 font-mono font-bold text-sm bg-black/60 border border-zinc-900 px-2.5 py-1 rounded-xl">
                      ₹{flavor.price.toLocaleString("en-IN")} <span className="text-[9px] font-normal text-zinc-500">/ session</span>
                    </span>
                  </div>

                  {/* Brand & Name */}
                  <div className="mb-2 relative z-10">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono truncate font-semibold">{flavor.brand}</p>
                    <h4 className="text-base font-serif font-black text-zinc-200 mt-0.5 flex items-center gap-1.5">
                      {flavor.name}
                      {flavor.featured && (
                        <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold uppercase tracking-wider flex items-center gap-0.5 shrink-0 animate-pulse">
                          <Sparkles className="h-2.5 w-2.5" /> Favorite
                        </span>
                      )}
                    </h4>
                  </div>

                  {/* Brief description */}
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 min-h-[48px] font-sans">{flavor.description}</p>

                  {/* Flavor ingredients notes */}
                  <div className="flex flex-wrap gap-1.5 mb-5 shrink-0 relative z-10">
                    {flavor.notes.map((note, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono tracking-wider px-2 py-1 rounded-lg bg-black border border-zinc-900 text-zinc-400 font-bold"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating bars section */}
                <div className="space-y-2 border-t border-zinc-900 pt-4 pb-2 text-[10px] text-zinc-400 capitalize relative z-10 shrink-0">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 font-mono uppercase text-[9px] tracking-wider">Sweetness</span>
                      {renderProgress(flavor.sweetness, "bg-rose-500")}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 font-mono uppercase text-[9px] tracking-wider shrink-0 flex items-center gap-0.5"><Snowflake className="h-2.5 w-2.5 text-cyan-400/80" /> Cool Fresh</span>
                      {renderProgress(flavor.freshness, "bg-cyan-400")}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 font-mono uppercase text-[9px] tracking-wider">Intensity</span>
                      {renderProgress(flavor.intensity, "bg-purple-500")}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 font-mono uppercase text-[9px] tracking-wider shrink-0 flex items-center gap-0.5"><Flame className="h-2.5 w-2.5 text-amber-500/80" /> Spicy Warm</span>
                      {renderProgress(flavor.warmth, "bg-amber-500")}
                    </div>
                  </div>
                </div>

                {/* Advanced pairing assistant container */}
                <div className="bg-black/40 border border-zinc-900 border-dashed rounded-xl p-2.5 my-3 text-[10px] font-sans leading-tight text-zinc-500">
                  <span className="text-[9px] text-indigo-400 font-mono tracking-widest font-bold uppercase block mb-0.5">Alchemist Sommelier Pair suggestion</span>
                  {getPairingSuggestion(flavor)}
                </div>

                {/* Reservation Select trigger */}
                <button
                  onClick={() => onSelectFlavor(flavor.id)}
                  className={`
                    w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all uppercase duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95
                    ${
                      isSelected
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-850 hover:text-zinc-100"
                    }
                  `}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4" /> Locked For Your Booking
                    </>
                  ) : (
                    <>
                      Fast-Hold in Floor Table <ChevronRight className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export { DynamicMenu };
