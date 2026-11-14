"use client";
import { useLanguage } from "@/lib/LanguageContext";
import { Play, CheckCircle2, Flag } from "lucide-react";

export interface MissionDetailsProps {
  isPlanning: boolean;
  startCoords: [number, number] | null;
  endCoords: [number, number] | null;
  isNavigating?: boolean;
  isArrived?: boolean;
  onInitiate?: () => void;
  calculatedDist?: string;
  estimatedTime?: string;
  terrainHazards?: number;
}

export default function MissionDetailsPanel({
  isPlanning,
  startCoords,
  endCoords,
  isNavigating,
  isArrived,
  onInitiate,
  calculatedDist,
  estimatedTime,
  terrainHazards,
}: MissionDetailsProps) {
  const { t } = useLanguage();

  return (
    <div className="p-4 flex-1 border-t border-mars-panel flex flex-col overflow-hidden">
      <h2 className="text-xs text-mars-secondary mb-2.5 font-bold tracking-widest uppercase">
        {t("missionDetails") || "MISSION DETAILS"}
      </h2>
      {!isPlanning ? (
        <div className="space-y-2.5 text-xs font-mono text-gray-300 bg-[#111] border border-[#222] p-3.5 flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            <div>
              <span className="text-gray-500 block text-[10px]">
                {t("startPoint") || "START POINT"}
              </span>
              LAT {startCoords?.[0].toFixed(5) || "0.00000"} / LNG{" "}
              {startCoords?.[1].toFixed(5) || "0.00000"}
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">
                {t("endPoint") || "END POINT"}
              </span>
              LAT {endCoords?.[0].toFixed(5) || "0.00000"} / LNG{" "}
              {endCoords?.[1].toFixed(5) || "0.00000"}
            </div>

            <div className="border-t border-[#333] pt-2 grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500 block text-[10px]">
                  {t("calculatedDist") || "CALCULATED DIST"}
                </span>
                <span className="text-gray-100 font-bold">
                  {calculatedDist || "--- KM"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">
                  {t("estimatedTime") || "ESTIMATED TIME"}
                </span>
                <span className="text-gray-100 font-bold">
                  {estimatedTime || "---"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block text-[10px]">
                {t("terrainHazards") || "TERRAIN HAZARDS"}
              </span>
              <span className="text-mars-critical font-bold">
                {terrainHazards ?? 0} {t("rugged") || "(Rugged)"}
              </span>
            </div>

            <div className="border-t border-[#333] pt-2">
              <div
                className={`font-bold text-[11px] ${
                  isArrived
                    ? "text-mars-success"
                    : "text-mars-primary animate-pulse"
                }`}
              >
                {isArrived
                  ? "STATUS: TARGET REACHED"
                  : t("statusProceeding") || "STATUS: PROCEEDING TO TARGET"}
              </div>
            </div>
          </div>

          <button
            onClick={onInitiate}
            disabled={isNavigating}
            className={`w-full font-bold tracking-widest py-2.5 mt-2 flex items-center justify-center gap-2 transition-all ${
              isNavigating
                ? "bg-[#111] border border-[#333] text-gray-500 cursor-not-allowed"
                : "bg-mars-success/20 hover:bg-mars-success/40 border border-mars-success text-mars-success shadow-[0_0_15px_rgba(0,255,102,0.2)]"
            }`}
          >
            {isNavigating ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-spin" />
                {t("roverInMotion") || "ROVER IN MOTION"}
              </>
            ) : isArrived ? (
              <>
                <Flag className="w-4 h-4" /> RE-RUN TRAJECTORY
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />{" "}
                {t("initiateRover") || "INITIATE ROVER"}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-600 font-mono">
          {t("awaitingRouteParams") || "AWAITING ROUTE PARAMETERS..."}
        </div>
      )}
    </div>
  );
}
