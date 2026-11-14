export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://martical-map-backend.onrender.com/";

export const FALLBACK_WEATHER = {
  temp: -52, // Celsius
  windSpeed: 18, // m/s
  pressure: 1.2, // ATM
  radLevel: 4.8, // mSv/h
  ambient: 62, // %
  status: "NORMAL", // NORMAL, ELEVATED, CRITICAL
};

export const FALLBACK_BIOMETRICS = {
  pulse: 85,
  oxygen: 68,
  suitPressure: 1.2,
};

// 🌪️ ဖုန်တိုင်း (Cyclone / Dust Storm) Data
export const MOCK_DUST_STORMS = [
  {
    id: "storm_1",
    name: "Active Martian Cyclone",
    center: [18.42, 77.2], // မြေပုံပေါ်ရှိ ဖုန်တိုင်းဗဟိုချက်
    radius: 12000, // meters (12 KM)
    speed: 18.5, // m/s
    direction: "South-West",
    severity: "HIGH",
  },
];

// -------------------------------------------------------------
// 🚀 Hackathon Live Demo အတွက် ထပ်ဖြည့်ထားသော Data များ
// -------------------------------------------------------------

// ၁။ အန္တရာယ်ဇုန်များ (မြေပုံတွင် Polygon နှင့် Slope/Elevation Popup ပြရန်)
export const MOCK_HAZARD_ZONES = [
  {
    id: "hazard_1",
    name: "Steep Crater Edge",
    maxSlope: 22.4, // degrees
    elevation: -1890, // meters
    polygon: [
      [18.39, 77.29],
      [18.41, 77.29],
      [18.41, 77.32],
      [18.39, 77.32],
    ],
  },
  {
    id: "hazard_2",
    name: "Deep Sand Dune",
    maxSlope: 19.8, // degrees
    elevation: -2040, // meters
    polygon: [
      [18.45, 77.22],
      [18.47, 77.22],
      [18.47, 77.26],
      [18.45, 77.26],
    ],
  },
];

// ၂။ ဓာတ်ရောင်ခြည် မြင့်မားသော ကုန်းမြင့်ဇုန်များ (Radiation Zones)
export const MOCK_RADIATION_ZONES = [
  {
    id: "rad_1",
    name: "High-Altitude Cosmic Rad Zone #1",
    center: [18.25, 76.6],
    radius: 15000, // 15 KM
    radLevel: 8.4, // mSv/h
    elevation: -1420, // meters
  },
  {
    id: "rad_2",
    name: "Solar Particle Exposure Basin",
    center: [18.1, 77.5],
    radius: 13000, // 13 KM
    radLevel: 7.6, // mSv/h
    elevation: -1580, // meters
  },
];

// ၃။ အရေးပေါ် ခိုလှုံနိုင်သော စခန်းများ (MAV Info Panel တွင် Dynamic ပြရန်)
export const SAFE_HAVENS = [
  {
    id: "hab_1",
    name: "HAB-1 (Jezero Base)",
    coords: [18.4447, 77.4508],
    capacity: 4,
  },
  {
    id: "hab_2",
    name: "Outpost Alpha",
    coords: [18.52, 77.2],
    capacity: 2,
  },
];

// ၄။ Presentation တွင် အမြန်ရွေးချယ်ပြသနိုင်ရန် နေရာများ (Jezero Crater အစစ်များ)
export const DEMO_LOCATIONS = {
  startPoint: {
    name: "Perseverance Landing Site",
    coords: [18.4447, 77.4508],
  },
  endPointSafest: {
    name: "Ancient River Delta",
    coords: [18.49, 77.38],
  },
  endPointShortest: {
    name: "Crater Rim (High Slope)",
    coords: [18.4, 77.3],
  },
};

// ၅။ Offline Fail-Safe Mode အတွက် အရန် Data (Route A နှင့် Route B နှစ်ခုလုံးအတွက်)
export const FALLBACK_ROUTES = {
  safest: {
    status: "success",
    routeType: "safest",
    distance_km: 14.4,
    estimated_time_mins: 158,
    hazards_encountered: 6,
    success_rate: 94,
    energy_cost: 42,
  },
  shortest: {
    status: "success",
    routeType: "shortest",
    distance_km: 13.6,
    estimated_time_mins: 88,
    hazards_encountered: 12,
    success_rate: 62,
    energy_cost: 78,
  },
};

// (Legacy export - တခြားဖိုင်များမှ ခေါ်သုံးထားပါက Error မတက်စေရန် ဆက်ထားပေးထားသည်)
export const FALLBACK_ROUTE_RESPONSE = {
  ...FALLBACK_ROUTES.safest,
  path: [
    [18.4447, 77.4508],
    [18.45, 77.42],
    [18.47, 77.4],
    [18.49, 77.38],
  ],
};
