"use client";
import {
  Layers,
  AlertTriangle,
  CloudLightning,
  Navigation,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface TacticalLayersProps {
  showHazards: boolean;
  setShowHazards: (v: boolean) => void;
  showWeather: boolean;
  setShowWeather: (v: boolean) => void;
  showRoute: boolean;
  setShowRoute: (v: boolean) => void;
  routeType: "safest" | "shortest";
  setRouteType: (t: "safest" | "shortest") => void;
  showRadiation?: boolean;
  setShowRadiation?: (v: boolean) => void;
}

export default function TacticalLayersUI({
  showHazards,
  setShowHazards,
  showWeather,
  setShowWeather,
  showRoute,
  setShowRoute,
  routeType,
  setRouteType,
}: TacticalLayersProps) {
  const { t, lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="absolute top-4 right-4 z-[999] bg-[#0A0A0A]/95 border border-mars-panel rounded-lg p-4 w-64 font-mono shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="flex items-center gap-2 text-mars-secondary text-xs font-bold tracking-widest uppercase mb-4 border-b border-[#222] pb-2">
        <Layers className="w-4 h-4" />
        {t("tacticalLayers") || "TACTICAL LAYERS"}
      </div>

      <div className="space-y-3 text-xs">
        {/* Terrain Hazards Toggle */}
        <label className="flex items-center justify-between cursor-pointer text-gray-300 hover:text-white">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-mars-critical" />
            {t("terrainHazards") || "TERRAIN HAZARDS"}
          </span>
          <input
            type="checkbox"
            checked={showHazards}
            onChange={(e) => setShowHazards(e.target.checked)}
            className="accent-mars-critical w-4 h-4 cursor-pointer"
          />
        </label>

        {/* Dust Storms Toggle */}
        <label className="flex items-center justify-between cursor-pointer text-gray-300 hover:text-white">
          <span className="flex items-center gap-2">
            <CloudLightning className="w-3.5 h-3.5 text-[#FFD700]" />
            {t("dustStorms") || "Dust Storms"}
          </span>
          <input
            type="checkbox"
            checked={showWeather}
            onChange={(e) => setShowWeather(e.target.checked)}
            className="accent-[#FFD700] w-4 h-4 cursor-pointer"
          />
        </label>

        <div className="border-t border-[#222] pt-3">
          <label className="flex items-center justify-between cursor-pointer text-gray-300 hover:text-white mb-3">
            <span className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-mars-success" />
              {t("navTrajectory") || "Nav Trajectory"}
            </span>
            <input
              type="checkbox"
              checked={showRoute}
              onChange={(e) => setShowRoute(e.target.checked)}
              className="accent-mars-success w-4 h-4 cursor-pointer"
            />
          </label>

          {/* 🚀 ROUTE A (SAFEST) vs ROUTE B (SHORTEST) Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRouteType("safest")}
              className={`py-2 px-1 text-[10px] font-bold tracking-wider uppercase rounded border transition-all ${
                routeType === "safest"
                  ? "bg-mars-success text-black border-mars-success shadow-[0_0_12px_rgba(0,255,102,0.4)]"
                  : "bg-[#111] text-gray-400 border-[#333] hover:text-white"
              }`}
            >
              {isEn ? "ROUTE A (SAFE)" : "လမ်းကြောင်း A"}
            </button>
            <button
              onClick={() => setRouteType("shortest")}
              className={`py-2 px-1 text-[10px] font-bold tracking-wider uppercase rounded border transition-all ${
                routeType === "shortest"
                  ? "bg-mars-primary text-black border-mars-primary shadow-[0_0_12px_rgba(255,98,0,0.4)]"
                  : "bg-[#111] text-gray-400 border-[#333] hover:text-white"
              }`}
            >
              {isEn ? "ROUTE B (SHORT)" : "လမ်းကြောင်း B"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
