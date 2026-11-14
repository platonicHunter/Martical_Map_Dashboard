"use client";
import { Thermometer, Wind } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function EnvironmentPanel({ isActive, activeDetails }: any) {
  const { t } = useLanguage();

  const isHighRad =
    activeDetails?.rads === "HIGH" || activeDetails?.rads === "မြင့်မား";
  const radValue = activeDetails?.radLevel ?? (isHighRad ? 9.4 : 4.2);
  const windSpeed = activeDetails?.windSpeed ?? (isHighRad ? 32.5 : 16.2);
  const tempValue = activeDetails?.temp ?? -52;
  const ambientValue = isHighRad ? 38 : 68;

  return (
    <div className="border-b border-mars-panel p-4 md:p-6">
      <h2 className="text-xs text-gray-500 mb-4 uppercase tracking-widest">
        {t("environment") || "ENVIRONMENT"}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-400 flex items-center gap-1 mb-1 uppercase">
            <Thermometer className="w-3.5 h-3.5 text-mars-secondary" />
            {t("temp") || "TEMP"}
          </div>
          <div className="text-2xl font-bold text-gray-100">
            {isActive ? `${tempValue}°C` : "--°C"}
          </div>
          <div className="text-[10px] text-gray-500 uppercase">
            {t("current") || "CURRENT"}
          </div>
        </div>

        <div
          className={`p-3 rounded border ${
            !isActive
              ? "border-[#222] bg-[#111]"
              : isHighRad
                ? "border-mars-critical/60 bg-mars-critical/10"
                : "border-mars-primary/40 bg-mars-primary/10"
          }`}
        >
          <div
            className={`text-[10px] uppercase mb-1 ${
              !isActive
                ? "text-gray-500"
                : isHighRad
                  ? "text-mars-critical"
                  : "text-mars-primary"
            }`}
          >
            {t("radLevel") || "RAD LEVEL"}
          </div>
          <div
            className={`text-lg font-bold ${
              !isActive
                ? "text-gray-600"
                : isHighRad
                  ? "text-mars-critical"
                  : "text-mars-primary"
            }`}
          >
            {isActive ? `${radValue} mSv/h` : "-- mSv/h"}
          </div>
          {isActive && (
            <span
              className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                isHighRad
                  ? "bg-mars-critical text-black"
                  : "bg-mars-primary text-black"
              }`}
            >
              {isHighRad
                ? t("danger") || "DANGER"
                : t("elevated") || "ELEVATED"}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-1 uppercase">
            {t("ambient") || "AMBIENT"}
          </div>
          <div className="text-lg font-bold text-gray-200">
            {isActive ? `${ambientValue}%` : "--%"}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400 flex items-center gap-1 mb-1 uppercase">
            <Wind className="w-3.5 h-3.5 text-gray-400" />
            {t("windSpeed") || "WIND SPEED"}
          </div>
          <div
            className={`text-lg font-bold ${
              !isActive
                ? "text-gray-600"
                : windSpeed > 25
                  ? "text-[#FFD700] animate-pulse"
                  : "text-gray-200"
            }`}
          >
            {isActive ? `${windSpeed} m/s` : "-- m/s"}
          </div>
        </div>
      </div>
    </div>
  );
}
