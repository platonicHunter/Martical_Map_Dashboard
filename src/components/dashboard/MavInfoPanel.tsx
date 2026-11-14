"use client";
import { useLanguage } from "@/lib/LanguageContext";
import { SAFE_HAVENS } from "@/constants/mockData"; // 🚀 Mock Data ခေါ်သုံးမည်

export default function MavInfoPanel({
  isActive,
  navMode,
  activeDetails,
}: any) {
  const { t } = useLanguage();

  return (
    <div className="border-b border-mars-panel p-4 md:p-6">
      <h2 className="text-xs text-gray-500 mb-3 uppercase">
        {t("mavInfo") || "MAV TELEMETRY"}
      </h2>
      <div className="flex justify-between mb-4">
        <div>
          <div className="text-xs text-gray-400 uppercase">
            {t("distToGo") || "DISTANCE"}
          </div>
          <div className="text-2xl text-gray-200 font-bold">
            {isActive ? activeDetails?.dist || "-- KM" : "-- KM"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase">
            {t("navMode") || "NAV MODE"}
          </div>
          <div
            className={`text-lg font-bold ${navMode === "sim" ? "text-mars-secondary" : "text-mars-critical"}`}
          >
            {!isActive
              ? t("standby") || "STANDBY"
              : navMode === "sim"
                ? t("waypointAssist") || "WAYPOINT"
                : t("freeRoam") || "MANUAL"}
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-400 uppercase">
          {t("safeHaven") || "NEAREST SAFE HAVEN"}
        </div>
        <div className="text-base text-gray-300">
          {isActive ? `${SAFE_HAVENS[0].name} (1.8 KM)` : "---"}
        </div>
      </div>
    </div>
  );
}
