"use client";
import { Activity, AlertTriangle, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function BiometricsPanel({
  isActive,
  activeDetails,
  isNavigating,
}: any) {
  const { t } = useLanguage();

  // 🚀 Dynamic Calculation
  // Energy ပိုစားလျှင် Oxygen ပိုကျမည်။ သွားနေလျှင် (isNavigating) Oxygen ပိုကျမည်။
  const energyVal = parseInt(activeDetails?.energy || "30");
  const oxygen = isActive
    ? isNavigating
      ? Math.max(20, 100 - energyVal - 15)
      : 100 - Math.floor(energyVal / 2)
    : "--";

  // Rads မြင့်လျှင် Suit Pressure တက်မည်
  const isHighRad =
    activeDetails?.rads === "HIGH" || activeDetails?.rads === "မြင့်မား";
  const pressure = isActive ? (isHighRad ? "1.8 ATM" : "1.2 ATM") : "-.-";

  return (
    <div className="border-b border-mars-panel p-4 md:p-6">
      <h2 className="text-xs text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
        {t("biometrics") || "BIOMETRICS"}
        {isActive && (
          <Activity className="w-3 h-3 text-mars-success animate-pulse" />
        )}
      </h2>

      <div className="text-xs text-gray-400 mb-2 uppercase">
        {t("pulse") || "PULSE"}
      </div>

      <div
        className={`h-16 border rounded relative overflow-hidden flex items-center mb-4 ${!isActive ? "border-[#333] bg-[#111]" : isNavigating ? "border-mars-primary/50 bg-mars-primary/10" : "border-mars-critical/30 bg-mars-critical/10"}`}
      >
        {isActive && (
          <svg
            className="w-full h-full"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
          >
            <motion.polyline
              points="0,20 20,20 30,10 40,35 50,5 60,20 80,20 90,10 100,35 110,5 120,20 140,20 150,10 160,35 170,5 180,20 200,20"
              fill="none"
              stroke={isNavigating ? "#FF6200" : "#FF2A2A"}
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, x: [-200, 0] }}
              transition={{
                duration: isNavigating ? 1 : 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        )}
        <HeartPulse
          className={`absolute right-3 top-3 w-5 h-5 ${!isActive ? "text-gray-600" : isNavigating ? "text-mars-primary animate-ping" : "text-mars-critical animate-pulse"}`}
        />
      </div>

      <div className="flex justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase">
            {t("oxygen") || "OXYGEN"}
          </div>
          <div className="text-3xl text-gray-200 font-bold">
            {isActive ? `${oxygen}%` : "--%"}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 uppercase">
            {t("suitPressure") || "SUIT PRESSURE"}
          </div>
          <div
            className={`text-3xl font-bold flex items-center gap-2 ${!isActive ? "text-gray-600" : isHighRad ? "text-mars-critical animate-pulse" : "text-gray-200"}`}
          >
            {isHighRad && <AlertTriangle className="w-6 h-6" />} {pressure}
          </div>
        </div>
      </div>
    </div>
  );
}
