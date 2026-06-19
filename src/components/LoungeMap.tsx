import React from "react";
import { LoungeSection, TableType } from "../types";
import { Armchair, Coffee, ShieldAlert, Sparkles, SunMoon, Trees, Radio, Tv } from "lucide-react";

interface LoungeMapProps {
  sections: LoungeSection[];
  selectedSectionId: string;
  selectedTableId: string;
  bookedTableIds: string[];
  onSelectTable: (sectionId: string, tableId: string) => void;
}

export default function LoungeMap({
  sections,
  selectedSectionId,
  selectedTableId,
  bookedTableIds,
  onSelectTable,
}: LoungeMapProps) {
  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  // Customizable glowing styles depending on room section
  const getThemeVars = () => {
    switch (selectedSectionId) {
      case "vip-cave":
        return {
          glowAccent: "rgba(239, 68, 68, 0.15)",
          borderGlow: "border-red-500/25",
          selectedColor: "bg-red-500/10 border-red-500 text-red-200",
          selectedTag: "bg-red-700/20 text-red-300 border-red-500/30",
          accentColor: "text-red-400"
        };
      case "sky-terrace":
        return {
          glowAccent: "rgba(245, 158, 11, 0.15)",
          borderGlow: "border-amber-500/25",
          selectedColor: "bg-amber-500/10 border-amber-500 text-amber-200",
          selectedTag: "bg-amber-700/20 text-amber-300 border-amber-500/30",
          accentColor: "text-amber-400"
        };
      default:
        return {
          glowAccent: "rgba(99, 102, 241, 0.15)",
          borderGlow: "border-indigo-500/25",
          selectedColor: "bg-indigo-500/10 border-indigo-500 text-indigo-100",
          selectedTag: "bg-indigo-700/20 text-indigo-300 border-indigo-550",
          accentColor: "text-indigo-400"
        };
    }
  };

  const themeVars = getThemeVars();

  return (
    <div className="bg-[#0b0b0e] border border-zinc-850 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div 
        className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-750" 
        style={{ backgroundColor: themeVars.glowAccent }}
      ></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-[3px] text-zinc-500 font-bold block">
            Room blueprint mapping coordinates
          </span>
          <h3 className="font-serif text-xl font-bold text-zinc-150 flex items-center gap-2 mt-0.5">
            {selectedSectionId === "main-hall" && <Coffee className="h-5 w-5 text-indigo-400 animate-pulse" />}
            {selectedSectionId === "vip-cave" && <Sparkles className="h-5 w-5 text-rose-500 animate-float-slow" />}
            {selectedSectionId === "sky-terrace" && <SunMoon className="h-5 w-5 text-amber-500 animate-spin-slow" />}
            {currentSection.name}
          </h3>
          <p className="text-zinc-450 text-xs mt-0.5 max-w-lg leading-relaxed">{currentSection.description}</p>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider font-bold shrink-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-3 h-3 rounded-md bg-zinc-900 border border-zinc-800 block"></span>
            <span>Available</span>
          </div>
          <div className={`flex items-center gap-1.5 ${themeVars.accentColor}`}>
            <span className={`w-3 h-3 rounded-md block bg-zinc-950 border ${themeVars.accentColor.replace('text-', 'border-')}`}></span>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600">
            <span className="w-3 h-3 rounded-md bg-zinc-950 border border-zinc-900 flex items-center justify-center block text-[9px] text-zinc-700 font-bold">✕</span>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {/* Dynamic floor layout visualstage */}
      <div className="border border-zinc-900 rounded-2xl bg-black/50 p-6 md:p-10 relative overflow-hidden">
        {/* Technical architecture grid markings */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid grid-cols-12 grid-rows-6">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-zinc-500"></div>
          ))}
        </div>

        {/* Lounge Rooms Layout stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {currentSection.tables.map((table) => {
            const isBooked = bookedTableIds.includes(table.id);
            const isSelected = selectedTableId === table.id;

            return (
              <button
                key={table.id}
                disabled={isBooked}
                type="button"
                onClick={() => onSelectTable(currentSection.id, table.id)}
                className={`
                  relative py-8 px-4 rounded-2xl text-center border transition-all duration-300 flex flex-col items-center justify-center gap-2 group cursor-pointer
                  ${
                    isBooked
                      ? "bg-zinc-950/80 border-zinc-900/60 cursor-not-allowed opacity-45 text-zinc-600"
                      : isSelected
                      ? `${themeVars.selectedColor} ${themeVars.borderGlow} shadow-lg shadow-indigo-500/5`
                      : "bg-zinc-950/30 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-300 active:scale-95"
                  }
                `}
                style={{ minHeight: "140px" }}
              >
                {/* Visual indicator of seat chairs organized in circle around the table */}
                <div className="relative h-9 w-9 flex items-center justify-center mb-1">
                  {/* Table Core Dial */}
                  <div className={`h-4.5 w-4.5 rounded-full border transition-all duration-300 flex items-center justify-center text-[7px] font-mono leading-none ${
                    isSelected ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 font-bold" : isBooked ? "bg-zinc-900 border-zinc-800 text-zinc-600" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}>
                    T
                  </div>
                  
                  {/* Armchairs arranged geometrically around table */}
                  {Array.from({ length: Math.min(table.capacity, 6) }).map((_, i) => {
                    const angle = (i * 360) / Math.min(table.capacity, 6);
                    return (
                      <div
                        key={i}
                        className="absolute w-3.5 h-3.5 transition-transform group-hover:scale-110"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-14px)`
                        }}
                      >
                        <Armchair
                          className={`h-3 w-3 -rotate-18 Q-rotate-0 transition-colors ${
                            isSelected 
                              ? themeVars.accentColor 
                              : isBooked 
                              ? "text-zinc-900" 
                              : "text-zinc-700 group-hover:text-zinc-500"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Table Identity */}
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] uppercase tracking-[2px] font-mono font-bold ${isSelected ? themeVars.accentColor : "text-zinc-500"}`}>
                    Table {table.number}
                  </span>
                  <span className="font-semibold text-xs mt-0.5 truncate max-w-[130px] text-zinc-200">
                    {table.type === "VIP Premium Cabana" ? "VIP Premium Cabana" : table.type}
                  </span>
                </div>

                {/* Capsule pill details */}
                <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                  isBooked 
                    ? "bg-black text-zinc-700 border border-zinc-950" 
                    : isSelected 
                    ? themeVars.selectedTag 
                    : "bg-zinc-900 text-zinc-400 group-hover:bg-zinc-850 group-hover:text-zinc-300"
                }`}>
                  {isBooked ? "Occupied" : `${table.capacity} Available Seats`}
                </span>

                {/* VIP Emblem */}
                {table.isVip && !isBooked && (
                  <span className="absolute top-2 right-2 text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold tracking-widest uppercase flex items-center gap-0.5">
                    <Sparkles className="h-2 w-2" /> VIP
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Ambient Room features representation details */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-zinc-600 font-mono gap-4 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-indigo-400 animate-pulse shrink-0" />
            Sonic Source (Deep Chill Synthesizer DJ Deck)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded bg-zinc-800 inline-block"></span>
            Aero-Ventilation Air Lock
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
            Coals Replenisher Lounge Station
          </span>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-indigo-950/10 border border-indigo-900/30 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-200 leading-relaxed font-sans">
          <p className="font-semibold">Sanctuary Capacity Regulations</p>
          <p className="opacity-80 mt-1">
            VIP Cabanas and Plush Lounge Sofas include active glass separation blocks and air extraction chambers. Room configurations are fully preheated for immediate use, reserved slot holds free for 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
export { LoungeMap };
