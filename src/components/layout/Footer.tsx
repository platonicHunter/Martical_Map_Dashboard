"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer({
  onReRoute,
  onZoom,
  onScan,
  onSOS,
  isSOS,
  isScanning,
}: any) {
  const { t } = useLanguage();

  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="grid grid-cols-4 border-t border-mars-panel text-xs font-bold text-gray-400 tracking-widest shrink-0"
    >
      <button
        onClick={onZoom}
        className="py-4 border-r border-mars-panel hover:bg-mars-panel hover:text-white transition uppercase"
      >
        {t("zoom")}
      </button>

      <button
        onClick={onReRoute}
        className="py-4 border-r border-mars-panel hover:bg-mars-panel hover:text-white transition uppercase text-mars-secondary"
      >
        {t("reRoute")}
      </button>

      {/* 🚀 FIXED: Scan Terrain Button with Active State & Disabled Lock */}
      <button
        onClick={onScan}
        disabled={isScanning}
        className={`py-4 border-r border-mars-panel transition-all uppercase flex items-center justify-center gap-2 ${
          isScanning
            ? "bg-mars-success/20 text-mars-success shadow-[inset_0_0_20px_rgba(0,255,102,0.2)]"
            : "hover:bg-mars-success/20 hover:text-mars-success"
        }`}
      >
        {isScanning && (
          <span className="w-2 h-2 rounded-full bg-mars-success animate-ping"></span>
        )}
        {t("scanTerrain")}
      </button>

      <button
        onClick={onSOS}
        className={`py-4 border-b-[3px] transition uppercase ${
          isSOS
            ? "bg-mars-critical text-white border-b-white animate-pulse shadow-[0_0_20px_rgba(255,42,42,0.8)]"
            : "bg-mars-critical/20 text-mars-critical border-b-mars-critical hover:bg-mars-critical/40"
        }`}
      >
        {isSOS ? t("cancelSos") : t("sosOverride")}
      </button>
    </motion.footer>
  );
}
