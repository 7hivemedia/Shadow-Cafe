export interface ShishaFlavor {
  id: string;
  name: string;
  brand: string;
  category: "fruity" | "minty" | "floral" | "spicy" | "dessert";
  description: string;
  notes: string[];
  sweetness: number; // 1-5 scale
  freshness: number; // 1-5 scale
  intensity: number; // 1-5 scale
  warmth: number; // 1-5 scale
  strength: "Classic Blond" | "Dark Leaf" | "Herbal";
  price: number;
  featured?: boolean;
}

export type TableType = "Regular Table" | "Plush Lounge Sofa" | "VIP Premium Cabana";

export interface LoungeSection {
  id: string;
  name: string;
  description: string;
  capacityText: string;
  amenities: string[];
  imageUrl: string;
  tables: {
    id: string;
    type: TableType;
    number: number;
    capacity: number;
    isVip: boolean;
  }[];
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  sectionId: string;
  tableId: string;
  preferredFlavorId?: string;
  customRequests?: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

export interface MixRequest {
  flavor1: string;
  flavor2: string;
  flavor3: string;
  liquidBase: string; // "Ice Water", "Milk", "Anise Tea", "Fruit Juice"
  iceTip: boolean;
  notes?: string;
}

export interface MixResponse {
  name: string;
  aromaSummary: string;
  sweetness: number;
  freshness: number;
  intensity: number;
  description: string;
  sommelierTastingNotes: string[];
  recommendedCoals: number;
  sessionDurationMins: number;
}
