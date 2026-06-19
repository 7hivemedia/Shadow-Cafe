import { ShishaFlavor, LoungeSection } from "./types";

import heroImg from "./assets/images/shadow_cafe_hero_1781888955671.jpg";
import interiorImg from "./assets/images/shadow_cafe_interior_1781888974353.jpg";
import vipImg from "./assets/images/shadow_cafe_vip_1781888990456.jpg";
import outdoorImg from "./assets/images/shadow_cafe_outdoor_1781889005348.jpg";

export const SHISHA_FLAVORS: ShishaFlavor[] = [
  {
    id: "blue-mystique",
    name: "Blue Mystique",
    brand: "Starbuzz Premium",
    category: "fruity",
    description: "An exotic blend of ripe blueberries matched with sweet white peach and a cooling undertone that stays crisp throughout the session.",
    notes: ["Blueberry", "Peach", "Cooling Mint"],
    sweetness: 4,
    freshness: 4,
    intensity: 3,
    warmth: 2,
    strength: "Classic Blond",
    price: 1650,
    featured: true
  },
  {
    id: "kashmir-peach",
    name: "Kashmir Peach",
    brand: "Tangiers Exclusive",
    category: "spicy",
    description: "A cult favourite blond-dark crossover. Juicy, sweet yellow peach enveloped in warm, spicy Kashmiri cardamom, clove, and fine wood notes.",
    notes: ["Peach", "Cardamom", "Spices", "Earthwood"],
    sweetness: 3,
    freshness: 1,
    intensity: 5,
    warmth: 5,
    strength: "Dark Leaf",
    price: 1950,
    featured: true
  },
  {
    id: "gotham-mint",
    name: "Gotham Double Mint",
    brand: "Al Fakher Reserve",
    category: "minty",
    description: "An absolute powerhouse of pure spear and peppermint combined. Crafted for purists who desire a heavy, ice-chill throat sensation and pristine thick cloud formulation.",
    notes: ["Peppermint", "Spearmint", "Menthol Crystals"],
    sweetness: 1,
    freshness: 5,
    intensity: 5,
    warmth: 1,
    strength: "Classic Blond",
    price: 1350,
    featured: false
  },
  {
    id: "purple-haze",
    name: "Purple Haze",
    brand: "DarkSide Core",
    category: "floral",
    description: "A delicate, highly sensory journey through lavender blossoms and sweet dark grape, finished with a velvet touch of royal hibiscus.",
    notes: ["Lavender", "Dark Grape", "Hibiscus Tea"],
    sweetness: 3,
    freshness: 3,
    intensity: 4,
    warmth: 3,
    strength: "Dark Leaf",
    price: 1850,
    featured: true
  },
  {
    id: "pasha-cream",
    name: "Pasha's Pistachio Cream",
    brand: "Overdozz Premium",
    category: "dessert",
    description: "Rich, roasted Turkish pistachios folded into a warm sweet vanilla bean custard, leaving a smooth buttery aroma and light hazelnut finish.",
    notes: ["Pistachio", "Vanilla Custard", "Hazelnut", "Brown Sugar"],
    sweetness: 5,
    freshness: 1,
    intensity: 4,
    warmth: 5,
    strength: "Classic Blond",
    price: 1750,
    featured: true
  },
  {
    id: "lemon-chill",
    name: "Lemon Mint Ice",
    brand: "Social Smoke",
    category: "fruity",
    description: "Zesty freshly-squeezed yellow lemon rinds spiked with crisp ice-cold peppermint leaves. Exceptionally refreshing and easy-going.",
    notes: ["Lemony Citric", "Peppermint", "Ice Crystals"],
    sweetness: 2,
    freshness: 4,
    intensity: 3,
    warmth: 2,
    strength: "Classic Blond",
    price: 1550,
    featured: false
  },
  {
    id: "red-velvet",
    name: "Dark Crimson Kiss",
    brand: "MustHave Exclusive",
    category: "fruity",
    description: "A intense sour-sweet combination of crushed raspberries, wild red cranberries, and dark cherries, packed with rich molasses extracts.",
    notes: ["Raspberry", "Cranberry", "Dark Cherry"],
    sweetness: 4,
    freshness: 2,
    intensity: 5,
    warmth: 3,
    strength: "Dark Leaf",
    price: 2050,
    featured: false
  },
  {
    id: "zen-matcha",
    name: "Zen Matcha Blossom",
    brand: "Element Earth",
    category: "floral",
    description: "Earthy powdered Japanese matcha tea leaves, sweetened slightly with wild jasmine honey and a soft lingering cherry blossom breath.",
    notes: ["Matcha Tea", "Jasmine Honey", "Cherry Blossom"],
    sweetness: 2,
    freshness: 3,
    intensity: 4,
    warmth: 3,
    strength: "Dark Leaf",
    price: 1950,
    featured: false
  },
  {
    id: "herbal-nirvana",
    name: "Herbal Nirvana Float",
    brand: "Hydro Herbal (Tobacco-Free)",
    category: "dessert",
    description: "A completely nicotine-free, molasses-free herbal blend mirroring spiced apple cider poured over soft vanilla ice cream.",
    notes: ["Baked Apple", "Cinnamon", "Vanilla Bean"],
    sweetness: 4,
    freshness: 2,
    intensity: 3,
    warmth: 4,
    strength: "Herbal",
    price: 1350,
    featured: false
  }
];

export const LOUNGE_SECTIONS: LoungeSection[] = [
  {
    id: "main-hall",
    name: "The Shadow Hall (Main Lounge)",
    description: "The heartbeat of Shadow Cafe. Fully immersive space with moody neon indigo LED outlines, deep velvet sofas, live DJ acoustics, and an active, high-energy social atmosphere.",
    capacityText: "Perfect for social pairs and groups of 4-8",
    imageUrl: heroImg,
    amenities: ["Plush Velvet Seating", "High-End Sound Synthesis", "Ambient LED Backlights", "Near Bar & Mixology Stations"],
    tables: [
      { id: "MH-T1", type: "Regular Table", number: 1, capacity: 2, isVip: false },
      { id: "MH-T2", type: "Regular Table", number: 2, capacity: 2, isVip: false },
      { id: "MH-S3", type: "Plush Lounge Sofa", number: 3, capacity: 4, isVip: false },
      { id: "MH-S4", type: "Plush Lounge Sofa", number: 4, capacity: 4, isVip: false },
      { id: "MH-S5", type: "Plush Lounge Sofa", number: 5, capacity: 6, isVip: false },
      { id: "MH-S6", type: "Plush Lounge Sofa", number: 6, capacity: 8, isVip: false }
    ]
  },
  {
    id: "vip-cave",
    name: "VIP Crimson Cave",
    description: "Understated luxury. Precluded, private candle-lit booths framed with raw mahogany, velvet heavy curtains, low reflective tables, and tailored premium glass hookahs. Requires a minimum reservation or package spend.",
    capacityText: "Ultimate exclusivity for private gatherings of 2-6",
    imageUrl: vipImg,
    amenities: ["Premium Designer Glass Hookahs included", "Private Butler Service Callable", "Sound Isolating Acoustic Curtains", "Dimmable Filament Lighting"],
    tables: [
      { id: "VIP-C1", type: "VIP Premium Cabana", number: 11, capacity: 4, isVip: true },
      { id: "VIP-C2", type: "VIP Premium Cabana", number: 12, capacity: 4, isVip: true },
      { id: "VIP-C3", type: "VIP Premium Cabana", number: 13, capacity: 6, isVip: true }
    ]
  },
  {
    id: "sky-terrace",
    name: "Sky Canopy Lantern Terrace",
    description: "A pristine open-air escape under the stars. Adorned with floating fire lanterns, cedarwood decking, heated cozy weatherproof sofas, and dynamic tabletop firepits representing the twilight skyline.",
    capacityText: "Breezy and relaxing, suitable for 2-4 guests",
    imageUrl: outdoorImg,
    amenities: ["Heated Weatherproof Loungers", "Tabletop Firepits", "Open Canopy Ventilation", "Starry Sky Overview"],
    tables: [
      { id: "ST-T1", type: "Regular Table", number: 21, capacity: 2, isVip: false },
      { id: "ST-T2", type: "Regular Table", number: 22, capacity: 2, isVip: false },
      { id: "ST-S3", type: "Plush Lounge Sofa", number: 23, capacity: 4, isVip: false },
      { id: "ST-S4", type: "Plush Lounge Sofa", number: 24, capacity: 4, isVip: false }
    ]
  }
];

export const LIQUID_BASES = [
  { id: "ice-water", name: "Glacier Ice Water", description: "Standard cold crisp base for pure untainted tobacco vapor", cost: 0 },
  { id: "milk", name: "Silky Cold Whole Milk", description: "Enhances fat density of clouds for a highly creamy dessert smoke", cost: 350 },
  { id: "anise", name: "Infused Warm Star Anise Tea", description: "Adds a fragrant traditional liquorice background to fruit blends", cost: 450 },
  { id: "citrus", name: "Chilled Pressed Citrus Juice", description: "Adds a natural zesty rind sharpness to sweet berry flavour formulas", cost: 600 }
];

export const HOURS_OF_OPERATION = {
  weekdays: "5:00 PM - 1:00 AM (Mon-Thu)",
  weekends: "4:00 PM - 3:30 AM (Fri-Sun)",
  phone: "+91 98450 12345",
  email: "bookings@shadowcafelounge.com"
};

export const INSTAGRAM_EMBED_PHOTOS = [
  {
    url: interiorImg,
    caption: "Our master-grade glass stem hookahs getting prepped for twilight. Burning at steady 220°C."
  },
  {
    url: heroImg,
    caption: "Step into structural darkness. Shadow Hall's sonic waves and light lines are now direct."
  },
  {
    url: vipImg,
    caption: "The exclusive VIP Crimson lounge cave. Perfect space for absolute privacy and custom shisha sessions."
  },
  {
    url: outdoorImg,
    caption: "Fairy light canopies and open-air relaxation. Twilight sits perfectly on our Sky Terrace."
  }
];
