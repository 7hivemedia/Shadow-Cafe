import React, { useState } from "react";
import { SHISHA_FLAVORS, LOUNGE_SECTIONS, HOURS_OF_OPERATION } from "./data";
import DynamicMenu from "./components/DynamicMenu";
import ShishaSommelier from "./components/ShishaSommelier";
import ReservationForm from "./components/ReservationForm";
import Gallery from "./components/Gallery";
import AdminPanel from "./components/AdminPanel";

import heroImg from "./assets/images/shadow_cafe_hero_1781888955671.jpg";
import interiorImg from "./assets/images/shadow_cafe_interior_1781888974353.jpg";

import { 
  Menu as MenuIcon, 
  Sparkles, 
  Armchair, 
  MapPin, 
  Clock, 
  CalendarCheck, 
  Grid3X3, 
  Layers,
  ChevronRight,
  Shield,
  Instagram,
  Phone,
  Mail,
  Compass
} from "lucide-react";

type TabID = "home" | "menu" | "sommelier" | "reserve" | "gallery" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>("home");
  const [preferredFlavorId, setPreferredFlavorId] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Link selected flavor onto reservation hold & swap tabs
  const handleSelectFlavorForBooking = (flavorId: string) => {
    setPreferredFlavorId(flavorId);
    setActiveTab("reserve");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentTheme = {
    glowColor: "from-indigo-500/15 to-transparent",
    accentText: "text-indigo-400",
    accentBorder: "border-indigo-500/30",
    accentBadge: "bg-indigo-500/15 border-indigo-500/20 text-indigo-300",
    btnGradient: "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/15",
    accentFocus: "focus:border-indigo-500/60 focus:ring-indigo-500/20"
  };

  const tabs: { id: TabID; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "The Sanctuary", icon: <Compass className="h-4 w-4" /> },
    { id: "menu", label: "Aroma Menu", icon: <Layers className="h-4 w-4" /> },
    { id: "sommelier", label: "Sommelier Lab", icon: <Sparkles className="h-4 w-4" /> },
    { id: "reserve", label: "Secure Table", icon: <CalendarCheck className="h-4 w-4" /> },
    { id: "gallery", label: "Ambiance", icon: <Grid3X3 className="h-4 w-4" /> },
    { id: "admin", label: "Staff Office", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-300 font-sans selection:bg-indigo-500/25 selection:text-indigo-200 antialiased flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Dynamic Vibe background atmospheric glow */}
      <div 
        style={{ backgroundImage: `radial-gradient(ellipse at top, var(--tw-gradient-stops))` }}
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[350px] bg-gradient-to-b ${currentTheme.glowColor} blur-3xl pointer-events-none rounded-full transition-all duration-1000`}
      ></div>

      {/* Header element */}
      <header className="border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-100 font-serif font-black tracking-tighter shadow-lg select-none text-xl transition-all duration-500 hover:border-zinc-700">
              S
            </div>
            <div>
              <h1 className="font-serif font-bold text-base tracking-tight text-zinc-150 leading-tight">Shadow Cafe</h1>
              <p className="text-[9px] uppercase font-mono tracking-[4px] text-zinc-550 font-bold">Shisha Sanctuary</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`
                  px-3 py-2 rounded-xl text-[10px] font-mono tracking-wider font-bold uppercase transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer
                  ${
                    activeTab === tab.id
                      ? "bg-zinc-900 border border-zinc-850 text-zinc-100 shadow-md"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border border-transparent"
                  }
                `}
              >
                <span className="shrink-0 text-zinc-500 group-hover:text-zinc-350">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Business Hours indication */}
          <div className="hidden xl:flex flex-col items-end text-right shrink-0">
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 whitespace-nowrap font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURED SANCTUARY
            </span>
            <span className="text-zinc-500 text-[9px] font-mono uppercase tracking-[1px] mt-0.5 whitespace-nowrap">{HOURS_OF_OPERATION.weekends}</span>
          </div>

          {/* Mobile navigation toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-white cursor-pointer"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-zinc-900 bg-[#070708] p-4 space-y-3 relative z-50">
            {/* Mobile Navigation tabs */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full py-3 px-4 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-3
                  ${
                    activeTab === tab.id
                      ? "bg-zinc-900 border border-zinc-855 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-350"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Container screen */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 flex-grow relative z-10">
        
        {/* Tab view controllers */}
        {activeTab === "home" && (
          <div className="space-y-12 animate-fade-in">
            {/* Redesigned Premium Hero Section (Asymmetrical Dual-Column Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-gradient-to-br from-[#0a0a0c] to-[#040405] border border-zinc-900 rounded-[36px] p-6 sm:p-10 md:p-14 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden">
              {/* Internal subtle visual accent flares */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />

              {/* Left Column: Narrative Content & CTA */}
              <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left z-10">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  Bengaluru's Elite Shisha Lounge
                </div>

                <div className="space-y-3">
                  <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-white uppercase leading-none select-none">
                    Unveil the <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">Shadows</span>
                  </h2>
                  <p className="text-zinc-450 text-xs md:text-sm leading-relaxed max-w-xl">
                    Shadow Cafe reimagines traditional shisha alchemy inside an ultra-modern, structural sensory rest space. Blending fine loose leaf tobaccos with custom filtration liquid bases and bespoke ice-gel wands.
                  </p>
                </div>

                {/* Technical / Premium Badges List */}
                <div className="grid grid-cols-3 gap-3 max-w-md pt-2">
                  <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3 text-center">
                    <div className="text-[14px] font-serif font-extrabold text-indigo-300">9+</div>
                    <div className="text-[9px] font-mono tracking-wider uppercase text-zinc-500 font-bold mt-1">SIGNATURES</div>
                  </div>
                  <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3 text-center">
                    <div className="text-[14px] font-serif font-extrabold text-indigo-300">ICE CORE</div>
                    <div className="text-[9px] font-mono tracking-wider uppercase text-zinc-500 font-bold mt-1">COOL WHIPS</div>
                  </div>
                  <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3 text-center">
                    <div className="text-[14px] font-serif font-extrabold text-indigo-300">18+ ONLY</div>
                    <div className="text-[9px] font-mono tracking-wider uppercase text-zinc-500 font-bold mt-1">SECURED ENTRY</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab("reserve")}
                    className={`py-4 px-8 rounded-2xl bg-gradient-to-r ${currentTheme.btnGradient} text-[11px] font-mono font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                  >
                    Hold Floor Table Space
                  </button>
                  <button
                    onClick={() => setActiveTab("sommelier")}
                    className="py-4 px-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Formulate AI Mixture
                  </button>
                </div>
              </div>

              {/* Right Column: Layered Premium Image Showcase */}
              <div className="lg:col-span-5 relative w-full h-[280px] sm:h-[350px] md:h-[400px] z-10">
                <div className="absolute inset-0 rounded-[32px] border border-zinc-800/40 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-500 hover:border-zinc-700/60 group">
                  {/* Aspect Ratio Box holding original hero image */}
                  <img
                    src={heroImg}
                    alt="Shadow Cafe Interior Ambiance"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040405] via-[#040405]/20 to-transparent" />
                  
                  {/* Floating interactive luxury badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 border border-zinc-850 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-serif font-extrabold text-zinc-100 uppercase tracking-wider">Shadow Sanctuary</div>
                      <div className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">Indiranagar · Bengaluru</div>
                    </div>
                    <span className="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono tracking-widest px-2.5 py-1 rounded-lg uppercase font-bold">
                      LIVE ACCESS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick highlight Bento boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: Dynamic menu browse */}
              <div className="bg-[#0b0b0e] border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition duration-300 space-y-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl pointer-events-none rounded-full"></div>
                <div className="space-y-3">
                  <span className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl block w-fit">
                    <Layers className="h-5 w-5 animate-pulse" />
                  </span>
                  <h3 className="font-serif font-bold text-zinc-200 text-lg">Aroma Flavor profiles</h3>
                  <p className="text-zinc-450 text-xs leading-relaxed font-sans">
                    Filter and inspect over nine gourmet loose and dark leaf cuts, checking intensity weights, sweetness meters, and active pairing recommendations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("menu")}
                  className="text-xs text-indigo-400 font-bold flex items-center gap-1 group/btn pt-2 select-none cursor-pointer"
                >
                  Browse Menu <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Box 2: interactive sommelier */}
              <div className="bg-[#0b0b0e] border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition duration-300 space-y-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl pointer-events-none rounded-full"></div>
                <div className="space-y-3">
                  <span className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl block w-fit">
                    <Sparkles className="h-5 w-5 animate-spin-slow" />
                  </span>
                  <h3 className="font-serif font-bold text-zinc-200 text-lg">Alchemist Sommelier Lab</h3>
                  <p className="text-zinc-450 text-xs leading-relaxed font-sans">
                    Uniquely combine raw flavor cuts, whole milks, or warm teas. Let our master Sommelier predict session longevity and molecular vapor densities using our custom-engineered Hookah glass flask model.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("sommelier")}
                  className="text-xs text-purple-400 font-bold flex items-center gap-1 group/btn pt-2 select-none cursor-pointer"
                >
                  Blend Custom Mixture <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Box 3: Floor plan reservations */}
              <div className="bg-[#0b0b0e] border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-700 transition duration-300 space-y-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl pointer-events-none rounded-full"></div>
                <div className="space-y-3">
                  <span className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl block w-fit">
                    <Armchair className="h-5 w-5 animate-bounce" />
                  </span>
                  <h3 className="font-serif font-bold text-zinc-200 text-lg">Secure Space Booking</h3>
                  <p className="text-zinc-450 text-xs leading-relaxed font-sans">
                    Settle into our Private Crimson Cave or open Sky Terrace. Interact directly with floor coordinate blueprints to lock down specific available tables instantly.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("reserve")}
                  className="text-xs text-amber-400 font-bold flex items-center gap-1 group/btn pt-2 select-none cursor-pointer"
                >
                  Secure Table Space <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>



            {/* General Description and location panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-zinc-900">
              <div className="space-y-4">
                <h3 className="font-serif text-3xl font-bold text-zinc-150 tracking-tight">A Sensory Sanctuary.</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Whether booking for cozy twilight pairings or reserving the entire VIP Crimson Cave, Shadow Cafe handles every coal preheating cycle and ventilation metric with absolute excellence. Crafted as a pristine rest space in Bengaluru and structural boundaries globally.
                </p>
                <div className="space-y-2 pt-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-400" /> 100 Feet Road, Indiranagar, Bengaluru, India
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" /> Mon - Sun: 5:00 PM - 3:30 AM
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-zinc-900 overflow-hidden bg-black aspect-video relative flex items-center justify-center">
                <img
                  src={interiorImg}
                  alt="Glass Hookah Session"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-75 grayscale hover:grayscale-0 transition duration-700"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-550 font-bold">Artisanal Curation list</span>
              <h2 className="text-3xl font-serif font-black tracking-tight text-zinc-150">Gourmet Tobacco Molasses</h2>
              <p className="text-zinc-500 text-xs max-w-xl leading-relaxed">
                Browse our curated selection of Premium Blond, Dark Leaf, and Nicotine-free Herbal cuts, preheated cleanly on premium coconut coals. Click any flavor to select it directly for your table reservation.
              </p>
            </div>
            <DynamicMenu
              flavors={SHISHA_FLAVORS}
              selectedFlavorId={preferredFlavorId}
              onSelectFlavor={handleSelectFlavorForBooking}
            />
          </div>
        )}

        {activeTab === "sommelier" && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-550 font-bold">Interactive Alchemist Portal</span>
              <h2 className="text-3xl font-serif font-black tracking-tight text-zinc-150">AI Sensory Sommelier</h2>
              <p className="text-zinc-500 text-xs max-w-xl leading-relaxed">
                Stir the cauldron. Build and evaluate creative shisha flavor mixes, custom liquid vase filters, and cooling ice cores, with instantaneous molecular predictions.
              </p>
            </div>
            <ShishaSommelier flavors={SHISHA_FLAVORS} />
          </div>
        )}

        {activeTab === "reserve" && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1 flex justify-between items-end gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-550 font-bold">Secured table coordination</span>
                <h2 className="text-3xl font-serif font-black tracking-tight text-zinc-150">Reserve Your Sanctuary</h2>
                <p className="text-zinc-500 text-xs max-w-lg leading-relaxed">
                  Enter your specifications, coordinates, and secure your virtual admission pass instantly.
                </p>
              </div>
              {preferredFlavorId && (
                <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono tracking-wider px-3 py-1.5 rounded-xl uppercase font-bold shrink-0">
                  Holds Flavour: <span className="font-sans font-extrabold text-zinc-200">
                    {SHISHA_FLAVORS.find(f => f.id === preferredFlavorId)?.name || preferredFlavorId}
                  </span>
                </span>
              )}
            </div>
            <ReservationForm
              sections={LOUNGE_SECTIONS}
              flavors={SHISHA_FLAVORS}
              initialFlavorId={preferredFlavorId}
              onBookingSuccess={() => setPreferredFlavorId("")}
            />
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-550 font-bold">Visual logs</span>
              <h2 className="text-3xl font-serif font-black tracking-tight text-zinc-150">Ambiance Showcase</h2>
              <p className="text-zinc-500 text-xs max-w-lg leading-relaxed">
                Explore photographs representing the pristine environments, premium glassware, and twilight lighting configurations of our physical lounge sanctuary.
              </p>
            </div>
            <Gallery />
          </div>
        )}

        {activeTab === "admin" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-550 font-bold">Back-Office Desk</span>
              <h2 className="text-3xl font-serif font-black tracking-tight text-zinc-150">Sanctuary Vault Office</h2>
              <p className="text-zinc-500 text-xs max-w-xl leading-relaxed font-medium">
                Authorized staff monitor reservations, adjust capacity locks, oversee table status, and verify active safety keys.
              </p>
            </div>
            <AdminPanel sections={LOUNGE_SECTIONS} />
          </div>
        )}

      </main>

      {/* Aesthetic humbler footer */}
      <footer className="border-t border-zinc-900 bg-[#040405] py-16 text-xs text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-serif text-zinc-300 font-semibold text-sm">S</div>
              <span className="font-serif font-black text-zinc-300 text-sm tracking-tight">Shadow Cafe</span>
            </div>
            <p className="text-zinc-650 text-[11px] leading-relaxed font-sans">
              Reimagining luxury hookah and sensory sanctuary environments through architectural precision and culinary expertise.
            </p>
          </div>

          {/* Col 2: Info links */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold font-semibold">Sanctuary Rules</h4>
            <div className="space-y-1.5 text-zinc-650 font-semibold text-[11px]">
              <p>Minimum Age: Strict 18+ ID check</p>
              <p>Continuous ventilation exchange systems</p>
              <p>Dress Code: High Casual / Smart evening wear</p>
            </div>
          </div>

          {/* Col 3: Hours details */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Ambient Slots</h4>
            <div className="space-y-1.5 text-zinc-650 font-semibold text-[11px]">
              <p>Weekdays: {HOURS_OF_OPERATION.weekdays}</p>
              <p>Weekends: {HOURS_OF_OPERATION.weekends}</p>
              <p>Valet service available in full</p>
            </div>
          </div>

          {/* Col 4: Contact links */}
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1">
              <Phone className="h-3 w-3 text-indigo-400" /> Dial Office
            </h4>
            <div className="space-y-1 text-zinc-650 font-semibold text-[11px]">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-zinc-600" /> +91 98860 12345
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-zinc-600" /> sanctuary@shadowcafe.club
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 font-mono gap-4 uppercase tracking-[1px] font-bold">
          <span>© {new Date().getFullYear()} SHADOW CAE SANCTUARY. ALL ACCESS CODES PERSISTED.</span>
          <span className="flex items-center gap-3">
            <a href="https://www.instagram.com/shadowcafe_un/" target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition flex items-center gap-1">
              <Instagram className="h-3.5 w-3.5 text-rose-500/80" /> Instagram
            </a>
          </span>
        </div>
      </footer>

    </div>
  );
}
