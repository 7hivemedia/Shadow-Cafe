import React, { useState, useEffect } from "react";
import { Booking, LoungeSection } from "../types";
import { ListFilter, KeyRound, ShieldCheck, Trash2, CalendarCheck, RefreshCw, Mail, Phone, Info } from "lucide-react";

interface AdminPanelProps {
  sections: LoungeSection[];
}

export default function AdminPanel({ sections }: AdminPanelProps) {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const expectedPasscode = "1210";

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === expectedPasscode) {
      setIsAuthorized(true);
      setErrorMsg("");
      fetchBookings();
    } else {
      setErrorMsg("Incorrect access code. Please try again.");
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok && data.success) {
        // Sort newest first
        const sorted = data.bookings.sort(
          (a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBookings(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation from the master book?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  // Calculate stats
  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    guestsCount: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.guests, 0),
  };

  // Authorization Shield lock screen
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-805 rounded-2xl p-6 text-center space-y-6">
        <div className="h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <KeyRound className="h-6 w-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-zinc-150">Lounge Administrative Vault</h3>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Authorized Shadow Cafe staff only. Enter your standard pincode lock to monitor active table sheets, reservations logs, or vacate tables.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            maxLength={4}
            placeholder="Enter standard pincode passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full text-center tracking-[12px] font-bold text-lg py-2.5 rounded-xl bg-black border border-zinc-800 text-zinc-200 placeholder:text-zinc-700 placeholder:tracking-normal focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 font-mono"
          />
          {errorMsg && <p className="text-[10px] text-red-500">{errorMsg}</p>}
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-803 hover:bg-zinc-805 text-zinc-300 transition-all border border-zinc-705 cursor-pointer"
            >
              Verify Passcode
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview stats layout card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings Sheets", val: stats.total, color: "text-zinc-200" },
          { label: "Active Holds", val: stats.active, color: "text-emerald-400" },
          { label: "Cancelled Holds", val: stats.cancelled, color: "text-red-400" },
          { label: "Expected Active Guests", val: stats.guestsCount, color: "text-indigo-400" },
        ].map((item, idx) => (
          <div key={idx} className="bg-zinc-905 border border-zinc-805 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">{item.label}</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* Control Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-semibold text-zinc-200">Vault Access Granted (Developer Session)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filtering dropdown */}
          <div className="flex bg-black/40 border border-zinc-805 rounded-lg p-0.5">
            {["all", "confirmed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-[10px] uppercase px-2.5 py-1 rounded font-medium transition ${
                  filterStatus === status ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="p-2 aspect-square rounded-lg bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Bookings sheet log */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 border border-zinc-850 rounded-2xl bg-zinc-900/10">
          <CalendarCheck className="h-10 w-10 text-zinc-650 mx-auto" />
          <p className="text-zinc-400 mt-2 font-medium">No booking entries logged on sheet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-855 rounded-xl bg-zinc-905/30 backdrop-blur-sm shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-805 text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="p-4">Holder / Card</th>
                <th className="p-4">Slot Details</th>
                <th className="p-4">Seating Coordinates</th>
                <th className="p-4">Flavour preferences</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-810">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                  {/* Holder info split */}
                  <td className="p-4 space-y-1">
                    <p className="font-bold text-zinc-200 text-sm leading-tight">{b.name}</p>
                    <p className="text-[10px] text-zinc-550 font-mono tracking-wider uppercase">{b.id}</p>
                    <div className="flex flex-col gap-0.5 text-[10px] text-zinc-450 pt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-2.5 w-2.5" /> {b.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5 font-mono" /> {b.phone}
                      </span>
                    </div>
                  </td>

                  {/* Slot Details date time */}
                  <td className="p-4 space-y-1">
                    <p className="font-bold text-zinc-300 font-mono">{b.date}</p>
                    <p className="text-[10px] uppercase font-mono text-indigo-400 font-bold">{b.time} Hold</p>
                    <p className="text-[10px] text-zinc-500">{b.guests} covers reserved</p>
                  </td>

                  {/* Room / Table index */}
                  <td className="p-4 space-y-1">
                    <p className="font-semibold text-zinc-300">
                      {b.sectionId === "main-hall" && "Shadow Hall"}
                      {b.sectionId === "vip-cave" && "Crimson VIP"}
                      {b.sectionId === "sky-terrace" && "Sky Terrace"}
                    </p>
                    <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-indigo-300 px-2 py-0.5 rounded">
                      Table {b.tableId.split("-")[1] || b.tableId}
                    </span>
                  </td>

                  {/* Preloaded Flavor Preference */}
                  <td className="p-4 max-w-[200px] truncate space-y-1">
                    {/* Retrieve flavor name */}
                    <p className="font-medium text-zinc-350 truncate">
                      {b.preferredFlavorId
                        ? sections[0] /* placeholder array lookup */
                          ? "Predefined blend"
                          : "Traditional"
                        : "Traditional Setup (Charcoal)"}
                    </p>
                    {b.preferredFlavorId && (
                      <span className="text-[10px] font-serif text-indigo-400 italic font-medium block">
                        Hold: {b.preferredFlavorId}
                      </span>
                    )}
                    {b.customRequests && (
                      <p className="text-[10px] text-zinc-500 italic truncate" title={b.customRequests}>
                        &ldquo;{b.customRequests}&rdquo;
                      </p>
                    )}
                  </td>

                  {/* Status Capsule */}
                  <td className="p-4">
                    <span
                      className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-1 rounded-full border ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "bg-red-500/10 border-red-500/20 text-red-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* Void trigger action */}
                  <td className="p-4 text-right">
                    {b.status === "confirmed" ? (
                      <button
                        onClick={() => cancelReservation(b.id)}
                        className="p-2 rounded bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-300 transition duration-200"
                        title="Void Seating Sheet"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-600 italic">Voided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export { AdminPanel };
