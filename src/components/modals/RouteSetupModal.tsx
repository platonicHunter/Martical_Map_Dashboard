"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertOctagon,
  Package,
  Clock,
  Globe,
  Loader2,
  Zap,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/lib/LanguageContext";
import { processRouteData } from "@/utils/routeCalculations";
import { PREDEFINED_LOCATIONS } from "@/constants/MapData";
import { API_BASE_URL } from "@/constants/mockData";

export default function RouteSetupModal({
  isOpen,
  onConfirm,
  mapSelectMode,
  setMapSelectMode,
  startCoords,
  setStartCoords,
  endCoords,
  setEndCoords,
}: any) {
  const { t, lang, toggleLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState<1 | 2 | null>(null);
  const [startMode, setStartMode] = useState<string | null>(null);
  const [endMode, setEndMode] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchedRouteData, setFetchedRouteData] = useState<any>(null);
  const [routeError, setRouteError] = useState(false);

  // 🚀 Coordinate အန္တရာယ်ရှိ/မရှိ စစ်ဆေးသည့် State များ
  const [startSafety, setStartSafety] = useState<any>(null);
  const [endSafety, setEndSafety] = useState<any>(null);

  const isEn = lang === "en";

  // Start Point အန္တရာယ်ကင်းမှု စစ်ဆေးခြင်း
  useEffect(() => {
    const checkSafety = async (
      coords: [number, number] | null,
      setter: (val: any) => void,
    ) => {
      if (!coords) {
        setter(null);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-point`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coords }),
        });
        if (!res.ok) {
          setter(null);
          return;
        }
        const data = await res.json();
        setter(data);
      } catch {
        setter(null);
      }
    };

    checkSafety(startCoords, setStartSafety);
  }, [startCoords]);

  // End Point အန္တရာယ်ကင်းမှု စစ်ဆေးခြင်း
  useEffect(() => {
    const checkSafety = async (
      coords: [number, number] | null,
      setter: (val: any) => void,
    ) => {
      if (!coords) {
        setter(null);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-point`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coords }),
        });
        if (!res.ok) {
          setter(null);
          return;
        }
        const data = await res.json();
        setter(data);
      } catch {
        setter(null);
      }
    };

    checkSafety(endCoords, setEndSafety);
  }, [endCoords]);

  // Start နှင့် End အရမ်းနီးကပ်လွန်းနေလား စစ်ခြင်း (အနည်းဆုံး ~12 KM ခြားသင့်သည်)
  const isTooClose =
    startCoords &&
    endCoords &&
    Math.hypot(startCoords[0] - endCoords[0], startCoords[1] - endCoords[1]) <
      0.2;

  const hasHazard = Boolean(startSafety?.isHazardous || endSafety?.isHazardous);
  const isCalculateDisabled =
    !startCoords || !endCoords || isLoading || hasHazard;

  const handleCalculate = async () => {
    setIsLoading(true);
    setRouteError(false);

    try {
      const [safestRes, shortestRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/calculate-route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startCoords,
            endCoords,
            routeType: "safest",
            hazards: [],
          }),
        }),
        fetch(`${API_BASE_URL}/api/calculate-route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startCoords,
            endCoords,
            routeType: "shortest",
            hazards: [],
          }),
        }),
      ]);

      const safestData = await safestRes.json();
      const shortestData = await shortestRes.json();

      const dynamicData = processRouteData(safestData, shortestData, isEn);

      setFetchedRouteData(dynamicData);
      setStep(2);
    } catch (err) {
      console.error("Calculation Error:", err);
      setRouteError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || mapSelectMode !== null) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-mono">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-mars-bg border border-mars-panel rounded-lg shadow-[0_0_50px_rgba(0,229,255,0.05)] overflow-hidden flex flex-col max-h-[92vh] overflow-y-auto"
      >
        <div className="bg-[#111] p-4 border-b border-mars-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-sm bg-mars-secondary animate-pulse"></span>
            <h2 className="text-mars-secondary text-sm font-bold tracking-[0.2em] uppercase">
              {isEn ? "ROUTE SETUP" : "လမ်းကြောင်း သတ်မှတ်ခြင်း"}
            </h2>
          </div>

          {/* Language Switch Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLang();
            }}
            className="flex items-center gap-2 px-3 py-1.5 border border-mars-panel rounded bg-[#1a1a1a] hover:bg-[#222] transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-mars-primary" />
            <span className="text-xs font-mono font-bold text-gray-300">
              {isEn ? "ENG" : "MYA"}
            </span>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {routeError && (
            <Alert
              variant="destructive"
              className="mb-6 bg-red-950/50 border-red-500 text-red-200"
            >
              <AlertOctagon className="h-4 w-4" />
              <AlertTitle>{isEn ? "Error" : "အမှား"}</AlertTitle>
              <AlertDescription>
                {isEn
                  ? "Error calculating routes. Please try again."
                  : "လမ်းကြောင်း တွက်ချက်ရာတွင် အမှားဖြစ်နေပါသည်။ ထပ်မံကြိုးစားပါ။"}
              </AlertDescription>
            </Alert>
          )}

          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* STARTING COORDINATES */}
                <div className="p-5 border border-mars-panel bg-mars-bg flex flex-col justify-between">
                  <div>
                    <label className="text-mars-success text-xs font-bold tracking-widest flex items-center gap-2 mb-4">
                      {isEn ? "STARTING POINT" : "စတင်မည့် နေရာ"}
                    </label>
                    <div className="space-y-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStartMode("gps");
                          setStartCoords([18.52121, 77.31222]);
                        }}
                        className={`w-full p-3 border text-xs transition text-left uppercase ${
                          startMode === "gps"
                            ? "border-mars-success bg-mars-success/10 text-mars-success"
                            : "border-mars-panel text-gray-400 hover:text-mars-success"
                        }`}
                      >
                        {">"} {isEn ? "GPS UPLINK" : "GPS ဖြင့် နေရာယူမည်"}{" "}
                        {startMode === "gps" &&
                          (isEn ? "[LOCKED]" : "[ချိတ်ဆက်ပြီး]")}
                      </button>

                      {/* Manual Input (Start) */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStartMode("manual");
                            setStartCoords(null);
                          }}
                          className={`w-full p-3 border text-xs transition text-left uppercase ${
                            startMode === "manual"
                              ? "border-mars-success bg-mars-success/10 text-mars-success"
                              : "border-mars-panel text-gray-400 hover:text-mars-success"
                          }`}
                        >
                          {">"}{" "}
                          {isEn ? "MANUAL INPUT" : "ကိုယ်တိုင် ရိုက်ထည့်မည်"}
                        </button>
                        {startMode === "manual" && (
                          <input
                            type="text"
                            placeholder="e.g. 18.52, 77.31"
                            onChange={(e) => {
                              const pts = e.target.value.split(",");
                              if (
                                pts.length === 2 &&
                                !isNaN(Number(pts[0])) &&
                                !isNaN(Number(pts[1]))
                              ) {
                                setStartCoords([
                                  Number(pts[0]),
                                  Number(pts[1]),
                                ]);
                              }
                            }}
                            className="w-full bg-[#111] border border-mars-success/50 p-3 text-xs text-mars-success outline-none focus:border-mars-success"
                          />
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStartMode("map");
                          setMapSelectMode("start");
                        }}
                        className={`w-full p-3 border text-xs transition text-left uppercase ${
                          startMode === "map"
                            ? "border-mars-success bg-mars-success/10 text-mars-success"
                            : "border-mars-panel text-gray-400 hover:text-mars-success"
                        }`}
                      >
                        {">"} {isEn ? "MARK ON MAP" : "မြေပုံပေါ်တွင် ထောက်မည်"}{" "}
                        {startMode === "map" &&
                          startCoords &&
                          ` [LAT: ${startCoords[0].toFixed(5)}, LNG: ${startCoords[1].toFixed(5)}]`}
                      </button>

                      {/* အထင်ကရနေရာ ရွေးရန် (Start) */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStartMode("landmark");
                            setStartCoords(null);
                          }}
                          className={`w-full p-3 border text-xs transition text-left uppercase ${
                            startMode === "landmark"
                              ? "border-mars-success bg-mars-success/10 text-mars-success"
                              : "border-mars-panel text-gray-400 hover:text-mars-success"
                          }`}
                        >
                          {">"}{" "}
                          {isEn ? "SELECT LANDMARK" : "အထင်ကရနေရာ ရွေးမည်"}
                        </button>
                        {startMode === "landmark" && (
                          <select
                            className="w-full bg-[#111] border border-mars-success/50 p-3 text-xs text-mars-success outline-none focus:border-mars-success cursor-pointer"
                            onChange={(e) => {
                              const loc = PREDEFINED_LOCATIONS.find(
                                (l) => l.id === e.target.value,
                              );
                              if (loc) setStartCoords(loc.coords);
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              {isEn
                                ? "-- CHOOSE LOCATION --"
                                : "-- နေရာရွေးချယ်ပါ --"}
                            </option>
                            {PREDEFINED_LOCATIONS.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 🚀 Start Point Safety Feedback */}
                  {startCoords && startSafety && (
                    <div className="mt-4">
                      {startSafety.isHazardous ? (
                        <div className="p-3 border border-mars-critical bg-mars-critical/10 text-mars-critical text-[11px] space-y-2">
                          <div className="flex items-center gap-2 font-bold">
                            <AlertOctagon className="w-4 h-4 shrink-0" />
                            <span>
                              {startSafety.reason === "OUT_OF_DEM_BOUNDS"
                                ? isEn
                                  ? "OUTSIDE JEZERO DEM COVERAGE (15-25°N, 70-85°E)"
                                  : "DEM မြေပုံဧရိယာ အပြင်ဘက် ရောက်နေပါသည်"
                                : isEn
                                  ? `HAZARDOUS TERRAIN (SLOPE: ${startSafety.slope}°)`
                                  : `အန္တရာယ်ရှိသော တောင်စောက်ဇုန် (${startSafety.slope}°)`}
                            </span>
                          </div>
                          {startSafety.safeCoords && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStartCoords(startSafety.safeCoords);
                              }}
                              className="w-full py-1.5 px-2 bg-mars-critical/20 hover:bg-mars-critical/40 border border-mars-critical text-white text-[10px] font-bold tracking-wider uppercase transition"
                            >
                              {isEn
                                ? "⚡ AUTO-SNAP TO NEAREST SAFE ZONE"
                                : "⚡ အနီးဆုံး ဘေးကင်းရာနေရာသို့ ရွှေ့မည်"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 border border-mars-success/40 bg-mars-success/5 text-mars-success text-[10px] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isEn
                              ? "SAFE TERRAIN VERIFIED"
                              : "ဘေးကင်းသော မြေပြင်"}
                          </span>
                          <span>
                            SLOPE: {startSafety.slope}° | ELEV:{" "}
                            {startSafety.elevation}m
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* DESTINATION TARGET */}
                <div className="p-5 border border-mars-panel bg-mars-bg flex flex-col justify-between">
                  <div>
                    <label className="text-mars-primary text-xs font-bold tracking-widest flex items-center gap-2 mb-4">
                      {isEn ? "DESTINATION TARGET" : "သွားရောက်မည့် နေရာ"}
                    </label>
                    <div className="space-y-3">
                      {/* Manual Input (End) */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEndMode("manual");
                            setEndCoords(null);
                          }}
                          className={`w-full p-3 border text-xs transition text-left uppercase ${
                            endMode === "manual"
                              ? "border-mars-primary bg-mars-primary/10 text-mars-primary"
                              : "border-mars-panel text-gray-400 hover:text-mars-primary"
                          }`}
                        >
                          {">"}{" "}
                          {isEn ? "MANUAL INPUT" : "ကိုယ်တိုင် ရိုက်ထည့်မည်"}
                        </button>
                        {endMode === "manual" && (
                          <input
                            type="text"
                            placeholder="e.g. 20.39, 75.80"
                            onChange={(e) => {
                              const pts = e.target.value.split(",");
                              if (
                                pts.length === 2 &&
                                !isNaN(Number(pts[0])) &&
                                !isNaN(Number(pts[1]))
                              ) {
                                setEndCoords([Number(pts[0]), Number(pts[1])]);
                              }
                            }}
                            className="w-full bg-[#111] border border-mars-primary/50 p-3 text-xs text-mars-primary outline-none focus:border-mars-primary"
                          />
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndMode("map");
                          setMapSelectMode("end");
                        }}
                        className={`w-full p-3 border text-xs transition text-left uppercase ${
                          endMode === "map"
                            ? "border-mars-primary bg-mars-primary/10 text-mars-primary"
                            : "border-mars-panel text-gray-400 hover:text-mars-primary"
                        }`}
                      >
                        {">"} {isEn ? "MARK ON MAP" : "မြေပုံပေါ်တွင် ထောက်မည်"}{" "}
                        {endMode === "map" &&
                          endCoords &&
                          ` [LAT: ${endCoords[0].toFixed(5)}, LNG: ${endCoords[1].toFixed(5)}]`}
                      </button>

                      {/* အထင်ကရနေရာ ရွေးရန် (End) */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEndMode("landmark");
                            setEndCoords(null);
                          }}
                          className={`w-full p-3 border text-xs transition text-left uppercase ${
                            endMode === "landmark"
                              ? "border-mars-primary bg-mars-primary/10 text-mars-primary"
                              : "border-mars-panel text-gray-400 hover:text-mars-primary"
                          }`}
                        >
                          {">"}{" "}
                          {isEn ? "SELECT LANDMARK" : "အထင်ကရနေရာ ရွေးမည်"}
                        </button>
                        {endMode === "landmark" && (
                          <select
                            className="w-full bg-[#111] border border-mars-primary/50 p-3 text-xs text-mars-primary outline-none focus:border-mars-primary cursor-pointer"
                            onChange={(e) => {
                              const loc = PREDEFINED_LOCATIONS.find(
                                (l) => l.id === e.target.value,
                              );
                              if (loc) setEndCoords(loc.coords);
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              {isEn
                                ? "-- CHOOSE LOCATION --"
                                : "-- နေရာရွေးချယ်ပါ --"}
                            </option>
                            {PREDEFINED_LOCATIONS.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 🚀 End Point Safety Feedback */}
                  {endCoords && endSafety && (
                    <div className="mt-4">
                      {endSafety.isHazardous ? (
                        <div className="p-3 border border-mars-critical bg-mars-critical/10 text-mars-critical text-[11px] space-y-2">
                          <div className="flex items-center gap-2 font-bold">
                            <AlertOctagon className="w-4 h-4 shrink-0" />
                            <span>
                              {endSafety.reason === "OUT_OF_DEM_BOUNDS"
                                ? isEn
                                  ? "OUTSIDE JEZERO DEM COVERAGE (15-25°N, 70-85°E)"
                                  : "DEM မြေပုံဧရိယာ အပြင်ဘက် ရောက်နေပါသည်"
                                : isEn
                                  ? `HAZARDOUS TERRAIN (SLOPE: ${endSafety.slope}°)`
                                  : `အန္တရာယ်ရှိသော တောင်စောက်ဇုန် (${endSafety.slope}°)`}
                            </span>
                          </div>
                          {endSafety.safeCoords && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEndCoords(endSafety.safeCoords);
                              }}
                              className="w-full py-1.5 px-2 bg-mars-critical/20 hover:bg-mars-critical/40 border border-mars-critical text-white text-[10px] font-bold tracking-wider uppercase transition"
                            >
                              {isEn
                                ? "⚡ AUTO-SNAP TO NEAREST SAFE ZONE"
                                : "⚡ အနီးဆုံး ဘေးကင်းရာနေရာသို့ ရွှေ့မည်"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 border border-mars-primary/40 bg-mars-primary/5 text-mars-primary text-[10px] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isEn
                              ? "SAFE TERRAIN VERIFIED"
                              : "ဘေးကင်းသော မြေပြင်"}
                          </span>
                          <span>
                            SLOPE: {endSafety.slope}° | ELEV:{" "}
                            {endSafety.elevation}m
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 🚀 Start နှင့် End အရမ်းနီးနေပါက သတိပေးချက် */}
              {isTooClose && (
                <div className="p-3 border border-yellow-500/60 bg-yellow-500/10 text-yellow-400 text-xs flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn
                      ? "POINTS ARE VERY CLOSE (<12 KM). SELECT POINTS FURTHER APART FOR FULL A* HAZARD AVOIDANCE."
                      : "စမှတ်နှင့် ဆုံးမှတ် အလွန်နီးကပ်နေပါသည်။ လမ်းကြောင်းရှောင်ကွင်းမှု ပိုမိုတိကျစေရန် ပိုဝေးသောနေရာ ရွေးချယ်ပါ။"}
                  </span>
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={isCalculateDisabled}
                className={`w-full p-5 text-sm font-bold tracking-[0.2em] transition-all uppercase flex justify-center items-center gap-3 ${
                  !isCalculateDisabled
                    ? "bg-[#111] hover:bg-mars-secondary/20 text-mars-secondary border border-mars-secondary"
                    : hasHazard
                      ? "bg-mars-critical/10 text-mars-critical/70 border border-mars-critical/50 cursor-not-allowed"
                      : "bg-[#111] text-gray-600 border border-[#222] cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />{" "}
                    {isEn
                      ? "CALCULATING ALGORITHMS..."
                      : "လမ်းကြောင်း တွက်ချက်နေပါသည်..."}
                  </>
                ) : hasHazard ? (
                  <>
                    <AlertOctagon className="w-5 h-5" />{" "}
                    {isEn
                      ? "RESOLVE TERRAIN HAZARDS FIRST"
                      : "အန္တရာယ်ဇုန်ကို အရင်ပြင်ဆင်ပါ"}
                  </>
                ) : isEn ? (
                  "CALCULATE TRAJECTORIES"
                ) : (
                  "လမ်းကြောင်း တွက်ချက်မည်"
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-400 tracking-widest uppercase">
                  {isEn ? "ANALYSIS COMPLETE" : "တွက်ချက်မှု ပြီးစီးပါပြီ"}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-white underline"
                >
                  {isEn ? "EDIT COORDINATES" : "နေရာများ ပြန်ပြင်မည်"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((routeId) => {
                  const data = fetchedRouteData[routeId];
                  return (
                    <div
                      key={routeId}
                      onClick={() => setSelectedRoute(routeId as 1 | 2)}
                      className={`border cursor-pointer transition-all ${
                        selectedRoute === routeId
                          ? data.bg + " " + data.border
                          : "border-mars-panel bg-mars-bg hover:border-gray-500"
                      }`}
                    >
                      <div
                        className={`p-4 border-b ${
                          selectedRoute === routeId
                            ? data.border
                            : "border-mars-panel"
                        }`}
                      >
                        <h3
                          className={`text-sm font-bold tracking-widest ${
                            selectedRoute === routeId
                              ? `text-${data.color}`
                              : "text-gray-400"
                          }`}
                        >
                          {data.name}
                        </h3>
                      </div>

                      <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 block mb-1">
                            {isEn ? "DISTANCE" : "အကွာအဝေး"}
                          </span>
                          <span className="text-gray-200 text-sm">
                            {data.dist}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1 items-center gap-1">
                            <Clock className="w-3 h-3 inline-block mr-1" />
                            {isEn ? "EST. TIME" : "ကြာမြင့်မည့်အချိန်"}
                          </span>
                          <span className="text-gray-200 text-sm">
                            {data.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">
                            {isEn ? "SUCCESS RATE" : "အောင်မြင်နိုင်ခြေ"}
                          </span>
                          <span
                            className={`text-lg font-bold ${
                              data.success >= 80
                                ? "text-mars-success"
                                : "text-mars-primary"
                            }`}
                          >
                            {data.success}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1 items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500 inline-block mr-1" />
                            {isEn ? "ENERGY COST" : "ဘက်ထရီ သုံးစွဲမှု"}
                          </span>
                          <span className="text-gray-300 text-sm">
                            {data.energy}
                          </span>
                        </div>

                        <div className="col-span-2 pt-2 border-t border-[#333]">
                          <span className="text-gray-500 block mb-1">
                            {isEn ? "TERRAIN HAZARDS" : "မြေပြင် အန္တရာယ်များ"}
                          </span>
                          <div className="flex gap-4">
                            <span
                              className={`block ${
                                data.rocks > 4
                                  ? "text-mars-primary"
                                  : "text-gray-300"
                              }`}
                            >
                              {data.rocks} {isEn ? "ROCKS" : "ကျောက်ဆောင်"}
                            </span>
                            <span
                              className={
                                data.rads === "HIGH" || data.rads === "မြင့်မား"
                                  ? "text-mars-critical block"
                                  : "text-gray-300 block"
                              }
                            >
                              {isEn ? "RADS:" : "ဓာတ်ရောင်ခြည်:"} {data.rads}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedRoute && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`mt-4 border p-4 ${fetchedRouteData[selectedRoute].border} bg-[#050505]`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Package
                      className={`w-4 h-4 text-${fetchedRouteData[selectedRoute].color}`}
                    />
                    <h4
                      className={`text-xs font-bold uppercase tracking-widest text-${fetchedRouteData[selectedRoute].color}`}
                    >
                      {isEn ? "REQUIRED PAYLOAD" : "သယ်ဆောင်ရမည့် ပစ္စည်းများ"}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {fetchedRouteData[selectedRoute].gear.map(
                      (item: string, index: number) => (
                        <div
                          key={index}
                          className="bg-[#111] border border-[#222] p-2 text-[10px] text-gray-300 flex items-center gap-2"
                        >
                          <span
                            className={`w-1 h-1 rounded-full bg-${fetchedRouteData[selectedRoute].color}`}
                          ></span>
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => {
                  if (selectedRoute && fetchedRouteData) {
                    onConfirm("sim", fetchedRouteData);
                  }
                }}
                disabled={!selectedRoute}
                className={`w-full mt-4 p-5 text-sm font-bold tracking-[0.3em] uppercase transition-all flex justify-center items-center gap-3 ${
                  selectedRoute
                    ? "bg-mars-success/20 text-mars-success border border-mars-success hover:bg-mars-success/40 shadow-[0_0_20px_rgba(0,255,102,0.2)]"
                    : "bg-[#111] text-gray-600 border border-[#222] cursor-not-allowed"
                }`}
              >
                {selectedRoute ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />{" "}
                    {isEn ? "ENGAGE SYSTEM" : "စနစ်ကို စတင်မည်"}
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-5 h-5" />{" "}
                    {isEn ? "SELECT A ROUTE" : "လမ်းကြောင်း ရွေးချယ်ပါ"}
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
