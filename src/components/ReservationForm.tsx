import React, { useState, useEffect, useMemo } from "react";
import { ShishaFlavor, LoungeSection, Booking } from "../types";
import LoungeMap from "./LoungeMap";
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, Ticket, Printer, XCircle, ChevronLeft } from "lucide-react";

interface ReservationFormProps {
  sections: LoungeSection[];
  flavors: ShishaFlavor[];
  initialFlavorId?: string;
  onBookingSuccess?: () => void;
}

export default function ReservationForm({
  sections,
  flavors,
  initialFlavorId = "",
  onBookingSuccess,
}: ReservationFormProps) {
  // Input fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Date time state (Default to today)
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [selectedSectionId, setSelectedSectionId] = useState("main-hall");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [preferredFlavorId, setPreferredFlavorId] = useState(initialFlavorId);
  const [customRequests, setCustomRequests] = useState("");

  // Booking states
  const [submissions, setSubmissions] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Booking | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initial flavour selection if changed externally
  useEffect(() => {
    if (initialFlavorId) {
      setPreferredFlavorId(initialFlavorId);
    }
  }, [initialFlavorId]);

  // Fetch current reservations from express to check double bookings on the client side
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.bookings);
      }
    } catch (err) {
      console.error("Error loading server bookings for occupancy validation:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeReceipt]);

  // Derive already booked tables based on the selectedDate and selectedTime
  const bookedTableIds = useMemo(() => {
    return submissions
      .filter(
        (b) =>
          b.date === date &&
          b.time === time &&
          b.status === "confirmed"
      )
      .map((b) => b.tableId);
  }, [submissions, date, time]);

  // Whenever Date, Time or Section change, check if selected table is valid
  useEffect(() => {
    // Auto reset table ID if it becomes occupied
    if (selectedTableId && bookedTableIds.includes(selectedTableId)) {
      setSelectedTableId("");
    }
  }, [date, time, bookedTableIds]);

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleSelectTable = (sectionId: string, tableId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedTableId(tableId);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validations
    if (!name.trim()) return setFormError("Please enter your full name.");
    if (!email.trim() || !email.includes("@")) return setFormError("Please provide a valid email address.");
    if (!phone.trim()) return setFormError("Please enter your contact phone number.");
    if (!selectedTableId) return setFormError("Please select a table on the Lounge Floorplan Map.");

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          guests: Number(guests),
          sectionId: selectedSectionId,
          tableId: selectedTableId,
          preferredFlavorId,
          customRequests,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to finalize reservation.");
      }

      // Display receipt success modal
      setActiveReceipt(resData.booking);
      if (onBookingSuccess) {
        onBookingSuccess();
      }

      // Clear fields on success
      setName("");
      setEmail("");
      setPhone("");
      setCustomRequests("");
      setSelectedTableId("");
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred during table registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you absolutely sure you want to cancel this reservation?")) return;
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Your reservation has been successfully cancelled.");
        if (activeReceipt?.id === bookingId) {
          setActiveReceipt(null);
        }
        fetchBookings();
      } else {
        alert(data.error || "Failed to cancel reservation.");
      }
    } catch (err) {
      alert("Error contacting reservation server.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* State A: Complete Virtual Pass confirmation receipt */}
      {activeReceipt ? (
        <div className="space-y-6">
          <div className="bg-emerald-550/10 border border-emerald-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-emerald-300">Reservation Secured</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              We have forwarded a secure receipt confirmation and entry credentials to your email directly. Show this virtual pass upon lounge arrival.
            </p>
          </div>

          {/* Glowing Virtual entry pass */}
          <div className="border border-zinc-803 rounded-3xl bg-zinc-950 max-w-md mx-auto relative overflow-hidden font-mono shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            {/* Top design accent */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>

            <div className="p-6 space-y-6 relative">
              {/* Outer circle layout design notches */}
              <div className="absolute top-[60%] -left-3 h-6 w-6 rounded-full bg-zinc-900 border-r border-zinc-803"></div>
              <div className="absolute top-[60%] -right-3 h-6 w-6 rounded-full bg-zinc-900 border-l border-zinc-803"></div>

              {/* Pass header */}
              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span className="font-bold tracking-widest text-zinc-300">SHADOW LOUNGE</span>
                <span className="flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-indigo-400" /> VIRTUAL PASS
                </span>
              </div>

              {/* Ticket code and Guest Name */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">RESERVATION HOLDER</p>
                <h4 className="text-lg font-bold text-zinc-200 mt-0.5">{activeReceipt.name}</h4>
                <p className="text-[10px] text-indigo-400 font-bold tracking-widest mt-1">ID: {activeReceipt.id.toUpperCase()}</p>
              </div>

              {/* Booking specifications grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-b border-dashed border-zinc-800 py-4 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">DATE</span>
                  <p className="font-bold text-zinc-300 mt-0.5">{activeReceipt.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">ENTRY TIME</span>
                  <p className="font-bold text-zinc-300 mt-0.5">{activeReceipt.time}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">CAPACITY</span>
                  <p className="font-bold text-zinc-300 mt-0.5">{activeReceipt.guests} Guests</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">LOUNGE TABLE</span>
                  <p className="font-bold text-zinc-300 mt-0.5">{activeReceipt.tableId}</p>
                </div>
              </div>

              {/* Preferences details */}
              <div className="text-xs space-y-1 bg-zinc-900/40 p-3 rounded-xl border border-zinc-905">
                <p className="text-[9px] text-zinc-500 uppercase">Selected Flavour Hold</p>
                <p className="text-zinc-350 font-sans">
                  {flavors.find((f) => f.id === activeReceipt.preferredFlavorId)?.name || "Traditional Charcoal Setup"}
                </p>
              </div>

              {/* Mock barcodes representing VIP passes */}
              <div className="pt-4 flex flex-col items-center justify-center space-y-2">
                <div 
                  className="w-full h-12 bg-zinc-800 opacity-60 rounded flex items-center justify-center space-x-1"
                  style={{
                    backgroundImage: "repeating-linear-gradient(90deg, #121214, #121214 2px, #E4E4E7 2px, #E4E4E7 5px)"
                  }}
                ></div>
                <span className="text-[9px] text-zinc-650 tracking-[6px] font-mono select-none">*{activeReceipt.id.toUpperCase()}*</span>
              </div>
            </div>

            {/* Hold cancel block */}
            <div className="bg-zinc-900/60 p-4 border-t border-dashed border-zinc-803 flex justify-between gap-4 items-center">
              <button
                onClick={() => window.print()}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
              >
                <Printer className="h-3.5 w-3.5" /> Print receipt
              </button>
              <button
                onClick={() => handleCancelBooking(activeReceipt.id)}
                className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition font-bold"
              >
                <XCircle className="h-3.5 w-3.5" /> Cancel Reservation
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setActiveReceipt(null)}
              className="text-xs text-zinc-400 hover:text-indigo-400 font-semibold flex items-center gap-1.5 mx-auto py-2 px-4 rounded-lg bg-zinc-900/50 border border-zinc-805"
            >
              <ChevronLeft className="h-4 w-4" /> SECURE ANOTHER TABLE
            </button>
          </div>
        </div>
      ) : (
        /* State B: Normal Booking Form Inputs */
        <form onSubmit={handleFormSubmit} className="space-y-8">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Grid layout parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left box: customer specs */}
            <div className="bg-zinc-900/50 border border-zinc-805 rounded-2xl p-6 backdrop-blur-md space-y-5">
              <h3 className="font-semibold text-base text-zinc-100 pb-2 border-b border-zinc-800">
                1. Entry & Contact Details
              </h3>

              {/* Name Details */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Full Guest Name</label>
                <input
                  type="text"
                  placeholder=" Marcus Aurelius"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email details */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="marcus@sunset.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                  />
                </div>

                {/* Mobile contact */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (210) 555-5321"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-sm text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Date & Time specs group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-800/40 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Time Block</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  >
                    <option value="17:00">5:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:30">9:30 PM</option>
                    <option value="23:00">11:00 PM</option>
                    <option value="00:30">12:30 AM</option>
                    <option value="02:00">2:00 AM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Guests Count</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

             {/* Right box: shisha holds */}
            <div className="bg-zinc-900/50 border border-zinc-805 rounded-2xl p-6 backdrop-blur-md space-y-5">
              <h3 className="font-semibold text-base text-zinc-100 pb-2 border-b border-zinc-800">
                2. Flavour Preference holds
              </h3>

              {/* Selected holding flavour profile */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Reserved Hookah Tobacco Blend</label>
                <select
                  value={preferredFlavorId}
                  onChange={(e) => setPreferredFlavorId(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- No holds (Regular Charcoal Setup upon arrival) --</option>
                  {flavors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.brand} - ₹{f.price.toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-500 leading-tight">
                  Pre-booking a blend saves preparation line queues. Flavour changes are fully permitted directly inside the lounge.
                </p>
              </div>

              {/* Special instructions notes */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Special Seating Requests (e.g. DJ view, silent spaces...)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us if you are celebrating or require specific accessibility setups..."
                  value={customRequests}
                  onChange={(e) => setCustomRequests(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-805 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>
            </div>
          </div>

          {/* Interactive room layout section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-semibold text-base text-zinc-100">
                3. Choose Seating Room & Table Number
              </h3>
              {/* Seating Room selector tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-zinc-805 rounded-xl shrink-0">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSectionId(s.id);
                      setSelectedTableId("");
                    }}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200
                      ${
                        selectedSectionId === s.id
                          ? "bg-indigo-500 text-white shadow-md"
                          : "text-zinc-500 hover:text-zinc-300"
                      }
                    `}
                  >
                    {s.id === "main-hall" && "Shadow Hall"}
                    {s.id === "vip-cave" && "Crimson Cave"}
                    {s.id === "sky-terrace" && "Sky Terrace"}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Map floorplan */}
            <LoungeMap
              sections={sections}
              selectedSectionId={selectedSectionId}
              selectedTableId={selectedTableId}
              bookedTableIds={bookedTableIds}
              onSelectTable={handleSelectTable}
            />
          </div>

          {/* Checkout triggering actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-950 border border-zinc-805 p-6 rounded-3xl gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-zinc-500 font-mono">SELECTED SEATING CONFIG</p>
              <h4 className="text-lg font-bold text-zinc-200 mt-1">
                {selectedTableId ? (
                  <>
                    Room Section: <span className="text-indigo-400">{activeSection.name.split(" ")[0]}</span> (Table {selectedTableId.split("-")[1] || selectedTableId})
                  </>
                ) : (
                  <span className="text-zinc-600 italic">Please select your table on the floorplan map</span>
                )}
              </h4>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedTableId}
              className="w-full sm:w-auto py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-zinc-100 hover:from-indigo-600 hover:to-purple-700 shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.4)] disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-650 disabled:border-zinc-805 disabled:cursor-not-allowed group"
            >
              {loading ? "Registering Your Space..." : "Finalize Space Securement"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
export { ReservationForm };
