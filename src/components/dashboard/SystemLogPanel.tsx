"use client";
import { useLanguage } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function SystemLogPanel({
  isActive,
  activeDetails,
  isNavigating,
  isArrived,
}: any) {
  const { t, lang } = useLanguage();
  const isEn = lang === "en";
  const [logs, setLogs] = useState<any[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!isActive || !activeDetails) {
      setLogs([]);
      return;
    }

    const uid = () => Math.random().toString(36).substring(2, 9);
    const getFormattedTime = (offsetSec = 0) => {
      const d = new Date(Date.now() + offsetSec * 1000);
      return `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
    };

    const routeName = activeDetails.name || "ROUTE";
    const totalRocks = activeDetails.rocks || 0;
    const radStatus = activeDetails.rads || "NORMAL";

    setLogs([
      {
        id: `log-start-${uid()}`,
        time: getFormattedTime(0),
        type: "success",
        text: isEn
          ? `Trajectory Engaged: ${routeName} (${activeDetails.dist})`
          : `လမ်းကြောင်း ရွေးချယ်ပြီး: ${routeName} (${activeDetails.dist})`,
      },
      {
        id: `log-scan-${uid()}`,
        time: getFormattedTime(1),
        type: "warning",
        text: isEn
          ? `DEM Topo Scan: Detected ${totalRocks} terrain hazards & active storm zone.`
          : `မြေပြင်စစ်ဆေးမှု: ကျောက်ဆောင် ${totalRocks} ခု နှင့် မုန်တိုင်းဇုန် တွေ့ရှိရသည်။`,
      },
    ]);

    const timers: NodeJS.Timeout[] = [];

    if (isNavigating) {
      const distNum = parseFloat(activeDetails?.dist || "4.0");
      const totalDurationMs = Math.min(
        8000,
        Math.max(3500, Math.round(distNum / 0.3) * 150),
      );
      const isSafest =
        routeName.includes("SAFE") ||
        routeName.includes("A") ||
        routeName.includes("အလုံခြုံဆုံး");
      const isHighRad = radStatus === "HIGH" || radStatus === "မြင့်မား";

      timers.push(
        setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            {
              id: `log-nav1-${uid()}`,
              time: getFormattedTime(1),
              type: "success",
              text: isEn
                ? "INITIATING ROVER MOVEMENT..."
                : "စက်ရုပ်ယာဉ် စတင် ထွက်ခွာနေပါပြီ...",
            },
          ]);
        }, 400),
      );

      if (isSafest) {
        timers.push(
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              {
                id: `log-s1-${uid()}`,
                time: getFormattedTime(2),
                type: "warning",
                text: isEn
                  ? "ALERT: Cyclone proximity warning. Recalculating safe vector..."
                  : "ALERT: ဖုန်တိုင်း (Cyclone) အနီးသို့ ရောက်ရှိနေပါသည်။ လမ်းကြောင်းရှောင်ကွင်းနေသည်...",
              },
            ]);
          }, totalDurationMs * 0.3),
        );

        timers.push(
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              {
                id: `log-s2-${uid()}`,
                time: getFormattedTime(4),
                type: "primary",
                text: isEn
                  ? `SYS: Rerouted around ${totalRocks} high-slope DEM hazards.`
                  : `SYS: တောင်စောက်နှင့် ကျောက်ဆောင် ${totalRocks} ခုကို အောင်မြင်စွာ ရှောင်ကွင်းပြီးပါပြီ။`,
              },
            ]);
          }, totalDurationMs * 0.65),
        );
      } else {
        timers.push(
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              {
                id: `log-sh1-${uid()}`,
                time: getFormattedTime(2),
                type: "warning",
                text: isEn
                  ? "WARN: Direct trajectory cuts through active Dust Storm!"
                  : "WARN: ဖုန်တိုင်း (Dust Storm) ဇုန်ထဲသို့ တိုက်ရိုက် ဖြတ်သန်းနေပါပြီ!",
              },
            ]);
          }, totalDurationMs * 0.28),
        );

        timers.push(
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              {
                id: `log-sh2-${uid()}`,
                time: getFormattedTime(4),
                type: "critical",
                text: isEn
                  ? `ALERT: Climbing steep slope (${totalRocks} rocks). High-Torque ACTIVE!`
                  : `ALERT: ကျောက်ဆောင် ${totalRocks} ခုပါသည့် တောင်စောက်အား တိုက်ရိုက်တက်နေပါသည်!`,
              },
            ]);
          }, totalDurationMs * 0.55),
        );

        if (isHighRad) {
          timers.push(
            setTimeout(() => {
              setLogs((prev) => [
                ...prev,
                {
                  id: `log-sh3-${uid()}`,
                  time: getFormattedTime(6),
                  type: "critical",
                  text: isEn
                    ? "DANGER: High Radiation exposure! Heavy Shielding ENGAGED."
                    : "DANGER: ဓာတ်ရောင်ခြည် မြင့်မားနေပါသည်! အထူးကာကွယ်ရေးစနစ် စတင်ပါပြီ။",
                },
              ]);
            }, totalDurationMs * 0.8),
          );
        }
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [isActive, isNavigating, activeDetails, isEn]);

  useEffect(() => {
    if (isArrived && activeDetails) {
      const d = new Date();
      const timeStr = `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
      setLogs((prev) => [
        ...prev,
        {
          id: `log-arrived-${Date.now()}`,
          time: timeStr,
          type: "success",
          text: isEn
            ? `NAV: TARGET REACHED! Total Energy Used: ${activeDetails.energy}`
            : `NAV: ပန်းတိုင်သို့ ရောက်ရှိပါပြီ! စုစုပေါင်း ဘက်ထရီသုံးစွဲမှု: ${activeDetails.energy}`,
        },
      ]);
    }
  }, [isArrived, activeDetails, isEn]);

  return (
    <div className="p-4 bg-[#050505] flex flex-col h-[38%] min-h-42.5 shrink-0 border-b border-mars-panel overflow-hidden">
      <h2 className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold shrink-0">
        {t("systemLogTitle") || "SYSTEM LOG"}
      </h2>

      <div
        ref={scrollContainerRef}
        className="text-xs space-y-2 font-mono flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {!isActive ? (
          <div className="text-gray-600">
            {t("awaitingParams") || "AWAITING PARAMETERS..."}
          </div>
        ) : (
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 leading-relaxed ${
                  log.type === "success"
                    ? "text-mars-success"
                    : log.type === "primary"
                      ? "text-mars-primary"
                      : log.type === "warning"
                        ? "text-[#FFD700]"
                        : log.type === "critical"
                          ? "text-mars-critical font-bold"
                          : "text-gray-400"
                }`}
              >
                <span className="opacity-60 shrink-0">[{log.time}]</span>
                <span>{log.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
