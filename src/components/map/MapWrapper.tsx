"use client";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export interface MapProps {
  isPlanning: boolean;
  mapSelectMode: "start" | "end" | null;
  setMapSelectMode: (mode: "start" | "end" | null) => void;
  startCoords: [number, number] | null;
  setStartCoords: (coords: [number, number] | null) => void;
  endCoords: [number, number] | null;
  setEndCoords: (coords: [number, number] | null) => void;
  zoomTrigger: number;
  isScanning: boolean;
  isSOS: boolean;
  isNavigating?: boolean;
  // 🚀 MartianMap တွင် သုံးထားသော Props အသစ်များအားလုံးကို Type သတ်မှတ်ပေးထားသည်
  routeType?: "safest" | "shortest";
  onRouteTypeChange?: (type: "safest" | "shortest") => void;
  onProgressChange?: (progress: number) => void;
  onArrival?: () => void;
  onRoverMove?: (coords: [number, number] | null) => void;
}

const LoadingMap = () => {
  const { t } = useLanguage();
  return (
    <div className="h-full w-full flex items-center justify-center text-mars-primary animate-pulse font-bold tracking-widest">
      {t("initMap") || "INITIALIZING TELEMETRY MAP..."}
    </div>
  );
};

const MartianMap = dynamic(() => import("./MartianMap"), {
  ssr: false,
  loading: LoadingMap,
});

export default function MapWrapper(props: MapProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`absolute inset-0 z-0 ${props.isSOS ? "grayscale-50 sepia-50 hue-rotate-[-50deg]" : ""}`}
    >
      <AnimatePresence>
        {props.isScanning && (
          <div className="absolute inset-0 z-9999 pointer-events-none overflow-hidden bg-mars-success/5">
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.5, repeat: 1, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-mars-success shadow-[0_0_30px_3px_rgba(0,255,102,0.8)]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-mars-success font-bold tracking-[0.3em] text-sm animate-pulse">
              {t("analyzingTopo") || "ANALYZING TOPOGRAPHY..."}
            </div>
          </div>
        )}
      </AnimatePresence>

      <MartianMap {...props} />
    </div>
  );
}
