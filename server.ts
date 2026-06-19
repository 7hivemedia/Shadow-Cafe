import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Booking } from "./src/types";

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const app = express();
const PORT = 3000;

app.use(express.json());

// Path for reservations state file database
const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

// Helper to safely load bookings list
function loadBookings(): Booking[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      return JSON.parse(data) as Booking[];
    }
  } catch (error) {
    console.error("Error reading bookings database, using backup state:", error);
  }
  
  // Seed default sample bookings if file doesn't exist
  const initialData: Booking[] = [
    {
      id: "b-001",
      name: "Arjun Mehta",
      email: "arjun.mehta@outlook.in",
      phone: "+91 98450 12345",
      date: new Date().toISOString().split("T")[0], // Today
      time: "20:00",
      guests: 4,
      sectionId: "main-hall",
      tableId: "MH-S3",
      preferredFlavorId: "purple-haze",
      customRequests: "Celebrating a project milestone, near the acoustic speakers if possible.",
      status: "confirmed",
      createdAt: new Date().toISOString()
    },
    {
      id: "b-002",
      name: "Riya Sharma",
      email: "riya.sharma@gmail.com",
      phone: "+91 91234 56789",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
      time: "21:30",
      guests: 2,
      sectionId: "vip-cave",
      tableId: "VIP-C1",
      preferredFlavorId: "kashmir-peach",
      customRequests: "Quiet anniversary seating, dynamic cooling setup directly requested.",
      status: "confirmed",
      createdAt: new Date().toISOString()
    }
  ];
  saveBookings(initialData);
  return initialData;
}

// Helper to safely write bookings list
function saveBookings(bookings: Booking[]) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (error) {
    console.error("Critical: failed writing bookings to disk database:", error);
  }
}

// REST Endpoints under /api/*
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// GET all bookings
app.get("/api/bookings", (req, res) => {
  try {
    const list = loadBookings();
    res.json({ success: true, count: list.length, bookings: list });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed listing bookings database." });
  }
});

// POST create booking with double-booking prevention check
app.post("/api/bookings", (req, res) => {
  try {
    const { name, email, phone, date, time, guests, sectionId, tableId, preferredFlavorId, customRequests } = req.body;
    
    // Strict Sanitization / Validation
    if (!name || !email || !phone || !date || !time || !guests || !sectionId || !tableId) {
      return res.status(400).json({ success: false, error: "Missing required booking details." });
    }

    const bookings = loadBookings();

    // Check for double reservation (same table, same date, same time block)
    const isDoubleBooked = bookings.some(
      (b) =>
        b.tableId === tableId &&
        b.date === date &&
        b.time === time &&
        b.status === "confirmed"
    );

    if (isDoubleBooked) {
      return res.status(409).json({
        success: false,
        error: "This table is already booked at this specific date and time slot. Please choose another table or time."
      });
    }

    const newBooking: Booking = {
      id: `booking-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      sectionId,
      tableId,
      preferredFlavorId: preferredFlavorId || "",
      customRequests: customRequests || "",
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    saveBookings(bookings);

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Booking reservation failure:", error);
    res.status(500).json({ success: false, error: "Failed to finalize your reservation." });
  }
});

// POST cancel booking
app.post("/api/bookings/:id/cancel", (req, res) => {
  try {
    const { id } = req.params;
    const bookings = loadBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: "Reservation ID not found." });
    }

    bookings[index].status = "cancelled";
    saveBookings(bookings);

    res.json({ success: true, booking: bookings[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to cancel reservation." });
  }
});

// POST Custom Shisha Mix Sommelier AI Analysis (Gemini Powered)
app.post("/api/shisha-mix", async (req, res) => {
  try {
    const { flavor1, flavor2, flavor3, liquidBase, iceTip, notes } = req.body;

    if (!flavor1 || !flavor2) {
      return res.status(400).json({ success: false, error: "At least two shisha flavor bases must be selected." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response inside sandbox if API key is missing
      return res.json({
        success: true,
        fallback: true,
        data: {
          name: `${flavor1} & ${flavor2} Horizon`,
          aromaSummary: "A delightful crisp fusion with clean aromatic density.",
          sweetness: 4,
          freshness: 3,
          intensity: 4,
          description: `This artisanal blend merges the rich qualities of ${flavor1} with targeted notes of ${flavor2}${flavor3 ? ' and accents of ' + flavor3 : ''}. Infused down through a base of ${liquidBase}.`,
          sommelierTastingNotes: [
            "Session kickoff: Bright crisp inhalation, featuring immediate fruit molasses resolution.",
            "Mid-session peak: The liquid base softens the extraction leading to high cloud density.",
            "Exhale and aftertaste: A smooth sweet finish lingering gracefully to the end."
          ],
          recommendedCoals: 3,
          sessionDurationMins: 90
        }
      });
    }

    const promptString = `You are the master Shisha Sommelier and Flavor Alchemist at 'Shadow Cafe', a high-end, luxurious, dimly lit shisha lounge with ambient moody lighting.
Analyze the following custom shisha mix requested by a guest:
- Primary Flavor: ${flavor1}
- Secondary Enhancer: ${flavor2}
- Third Accent Flavor: ${flavor3 || "None selected"}
- Liquid Base in Hookah Vase: ${liquidBase || "Glacier Ice Water"}
- Cooling Ice-Tip Attached: ${iceTip ? "Yes, active, bringing freezing temperatures" : "No, standard warm-hose connection"}
- Additional Guest requests/notes: ${notes || "None"}

Generate a detailed and beautiful sensory review of this fusion.
Establish a creative mystical name for this mix (e.g. 'Lunar Frost Mint', 'Orchard Spice Haze').
Evaluate numeric properties sweetness (1 to 5), freshness (1 to 5), and intensity (1 to 5).
Provide an aesthetic sensory description, plus 3 discrete 'Sommelier Tasting Notes' describing session milestones (e.g. 'The 20-minute mark...').
Suggest optimal coconut coal count and total expected session duration before charcoal replacement (mins).

Respond strictly in valid JSON matching this schema:
{
  "name": "Creative Unique Blend Name",
  "aromaSummary": "Brief sensory or smell summary (1 sentence)",
  "sweetness": 4,
  "freshness": 3,
  "intensity": 5,
  "description": "Exquisite 3-4 sentence narrative review of the smoke, texture, flavor interactions, and visual clouds.",
  "sommelierTastingNotes": [
    "First 10 minutes: explanation of kickoff notes...",
    "Mid-session (30-40 min): explanation of how heat transitions and notes shift...",
    "Tail end (60+ min): explanation of persistence, base liquid inflections..."
  ],
  "recommendedCoals": 3,
  "sessionDurationMins": 90
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            aromaSummary: { type: Type.STRING },
            sweetness: { type: Type.INTEGER },
            freshness: { type: Type.INTEGER },
            intensity: { type: Type.INTEGER },
            description: { type: Type.STRING },
            sommelierTastingNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendedCoals: { type: Type.INTEGER },
            sessionDurationMins: { type: Type.INTEGER }
          },
          required: ["name", "aromaSummary", "sweetness", "freshness", "intensity", "description", "sommelierTastingNotes", "recommendedCoals", "sessionDurationMins"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response returned from Gemini models.");
    }

    const resultData = JSON.parse(responseText.trim());
    res.json({ success: true, fallback: false, data: resultData });

  } catch (error) {
    console.error("AI Sommelier service error:", error);
    res.status(500).json({ success: false, error: "AI Flavor Sommelier is clearing its coals. Please try again soon." });
  }
});

// Configure Vite integration or static file rendering
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite live compiler...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with bundled static pages...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shadow Cafe Full-Stack portal running on http://localhost:${PORT}`);
  });
}

startServer();
