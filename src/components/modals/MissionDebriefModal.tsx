"use client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Zap,
  Radio,
  Mountain,
  RotateCcw,
  X,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface MissionDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewMission: () => void;
  routeData: any;
  activeRouteId: 1 | 2;
  isSosMission?: boolean;
}

export default function MissionDebriefModal({
  isOpen,
  onClose,
  onNewMission,
  routeData,
  activeRouteId,
  isSosMission = false,
}: MissionDebriefModalProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  if (!isOpen || !routeData) return null;

  const safeRoute = routeData[1];
  const shortRoute = routeData[2];
  const activeRoute = routeData[activeRouteId] || safeRoute;

  const safeRad = Number(safeRoute?.radLevel ?? 4.2);
  const shortRad = Number(shortRoute?.radLevel ?? 9.6);
  const radReductionPct =
    shortRad > 0
      ? Math.max(0, Math.round(((shortRad - safeRad) / shortRad) * 100))
      : 0;

  const safeEnergy = Number(
    safeRoute?.rawEnergy ?? parseInt(String(safeRoute?.energy ?? "42"), 10),
  );
  const shortEnergy = Number(
    shortRoute?.rawEnergy ?? parseInt(String(shortRoute?.energy ?? "78"), 10),
  );
  const energySaved = Math.max(0, shortEnergy - safeEnergy);

  const safeRocks = Number(safeRoute?.rocks ?? 5);
  const shortRocks = Number(shortRoute?.rocks ?? 14);
  const hazardsAvoided = Math.max(0, shortRocks - safeRocks);

  const isSafest = activeRouteId === 1;

  return (
    <div className="fixed inset-0 z-1200lex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-mono">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-2xl bg-mars-bg border rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] ${
          isSosMission
            ? "border-mars-critical"
            : isSafest
              ? "border-mars-success"
              : "border-mars-primary"
        }`}
      >
        <div className="bg-[#111] p-4 border-b border-mars-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSosMission ? (
              <AlertTriangle className="w-5 h-5 text-mars-critical animate-pulse" />
            ) : (
              <ShieldCheck
                className={`w-5 h-5 ${
                  isSafest ? "text-mars-success" : "text-mars-primary"
                }`}
              />
            )}
            <div>
              <h2
                className={`text-sm font-bold tracking-[0.2em] uppercase ${
                  isSosMission
                    ? "text-mars-critical"
                    : isSafest
                      ? "text-mars-success"
                      : "text-mars-primary"
                }`}
              >
                {isSosMission
                  ? isEn
                    ? "EMERGENCY EXTRACTION COMPLETE"
                    : "အရေးပေါ် ကယ်ဆယ်ရေး ပြီးမြောက်ပါပြီ"
                  : isEn
                    ? "MISSION DEBRIEF SUMMARY"
                    : "မစ်ရှင် ရလဒ် အကျဉ်းချုပ်"}
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                {isSosMission
                  ? isEn
                    ? "ROVER SECURED AT HAB-1 (JEZERO BASE)"
                    : "ROVER သည် HAB-1 (JEZERO BASE) သို့ ဘေးကင်းစွာ ရောက်ရှိပါပြီ"
                  : `${activeRoute?.name} • ${activeRoute?.dist} • ${activeRoute?.time}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-white border border-transparent hover:border-mars-panel rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-mars-panel bg-mars-bg">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase mb-2">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                {isSafest
                  ? isEn
                    ? "RADIATION REDUCED"
                    : "ဓာတ်ရောင်ခြည် လျှော့ချမှု"
                  : isEn
                    ? "RAD EXPOSURE"
                    : "ဓာတ်ရောင်ခြည် ထိတွေ့မှု"}
              </div>
              <div
                className={`text-2xl font-bold ${
                  isSafest ? "text-mars-success" : "text-mars-critical"
                }`}
              >
                {isSafest ? `-${radReductionPct}%` : `${shortRad} mSv/h`}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {isSafest
                  ? `${safeRad} vs ${shortRad} mSv/h`
                  : isEn
                    ? "High-altitude rad zone crossed"
                    : "ဓာတ်ရောင်ခြည်ဇုန် ဖြတ်သန်းခဲ့သည်"}
              </p>
            </div>

            <div className="p-4 border border-mars-panel bg-mars-bg">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase mb-2">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                {isSafest
                  ? isEn
                    ? "BATTERY SAVED"
                    : "ဘက်ထရီ ချွေတာနိုင်မှု"
                  : isEn
                    ? "BATTERY USED"
                    : "ဘက်ထရီ သုံးစွဲမှု"}
              </div>
              <div
                className={`text-2xl font-bold ${
                  isSafest ? "text-mars-success" : "text-mars-primary"
                }`}
              >
                {isSafest ? `+${energySaved}%` : `${shortEnergy}%`}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {isSafest
                  ? `${safeEnergy}% vs ${shortEnergy}% drain`
                  : isEn
                    ? "Heavy slope torque penalty"
                    : "တောင်စောက်တက်ရသဖြင့် ပိုကုန်သည်"}
              </p>
            </div>

            <div className="p-4 border border-mars-panel bg-mars-bg">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase mb-2">
                <Mountain className="w-3.5 h-3.5 text-mars-primary" />
                {isSafest
                  ? isEn
                    ? "HAZARDS AVOIDED"
                    : "ရှောင်ကွင်းနိုင်သော အန္တရာယ်"
                  : isEn
                    ? "HAZARDS CROSSED"
                    : "ဖြတ်သန်းခဲ့သော အန္တရာယ်"}
              </div>
              <div
                className={`text-2xl font-bold ${
                  isSafest ? "text-mars-success" : "text-mars-critical"
                }`}
              >
                {isSafest ? `${hazardsAvoided}` : `${shortRocks}`}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {isSafest
                  ? isEn
                    ? "DEM steep slopes bypassed"
                    : "တောင်စောက်ဇုန်များ ရှောင်နိုင်ခဲ့သည်"
                  : isEn
                    ? "Rugged crater ridges traversed"
                    : "ကြမ်းတမ်းသော မြေပြင်များ ဖြတ်ခဲ့သည်"}
              </p>
            </div>
          </div>

          <div className="p-4 border border-mars-panel bg-[#070707] text-xs text-gray-300 leading-relaxed">
            <span className="text-mars-secondary font-bold uppercase tracking-wider block mb-1">
              {isEn
                ? "A* TELEMETRY ASSESSMENT:"
                : "A* လမ်းကြောင်း သုံးသပ်ချက်-"}
            </span>
            {isSosMission
              ? isEn
                ? "Emergency override bypassed active Martian cyclones and steep escarpments using USGS DEM slope gradients to extract the rover safely to HAB-1."
                : "SOS Override စနစ်သည် USGS DEM တောင်စောင်းအချက်အလက်များကို အသုံးပြု၍ မုန်တိုင်းနှင့် အန္တရာယ်ဇုန်များကို ရှောင်ကွင်းကာ HAB-1 စခန်းသို့ ဘေးကင်းစွာ ပြန်လည်ခေါ်ဆောင်ပေးခဲ့ပါသည်။"
              : isSafest
                ? isEn
                  ? `By selecting Route A (Safest), the A* pathfinding model avoided ${hazardsAvoided} severe terrain hazards, reduced cosmic radiation exposure by ${radReductionPct}%, and conserved ${energySaved}% rover battery compared to the direct shortest trajectory.`
                  : `လမ်းကြောင်း A (အလုံခြုံဆုံး) ကို ရွေးချယ်ခဲ့သဖြင့် အတိုဆုံးလမ်းကြောင်းနှင့် ယှဉ်ပါက အန္တရာယ်ဇုန် ${hazardsAvoided} ခုကို ရှောင်ကွင်းနိုင်ခဲ့ပြီး ဓာတ်ရောင်ခြည်သင့်မှု ${radReductionPct}% နှင့် ဘက်ထရီ ${energySaved}% ချွေတာနိုင်ခဲ့ပါသည်။`
                : isEn
                  ? `Route B (Shortest) minimized transit duration (${shortRoute?.time}) but exposed the rover to ${shortRad} mSv/h cosmic radiation and ${shortRocks} rugged terrain hazards.`
                  : `လမ်းကြောင်း B (အတိုဆုံး) သည် ကြာမြင့်ချိန် (${shortRoute?.time}) သက်သာသော်လည်း ဓာတ်ရောင်ခြည် ${shortRad} mSv/h နှင့် မြေပြင်အန္တရာယ် ${shortRocks} ခုကို ဖြတ်သန်းခဲ့ရပါသည်။`}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNewMission}
              className="flex-1 py-3.5 px-4 bg-mars-secondary/15 hover:bg-mars-secondary/30 border border-mars-secondary text-mars-secondary text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              {isEn ? "PLAN NEW MISSION" : "မစ်ရှင်အသစ် စတင်မည်"}
            </button>
            <button
              onClick={onClose}
              className="py-3.5 px-6 bg-[#111] hover:bg-[#1a1a1a] border border-mars-panel text-gray-300 text-xs font-bold tracking-[0.2em] uppercase transition"
            >
              {isEn ? "INSPECT MAP" : "မြေပုံ ဆက်ကြည့်မည်"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
