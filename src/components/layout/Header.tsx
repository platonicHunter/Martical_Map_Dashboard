"use client";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Header({
  coords,
}: {
  coords?: [number, number] | null;
}) {
  const { lang, toggleLang, t } = useLanguage();
  const isEn = lang === "en";

  const lat = coords ? coords[0].toFixed(4) : "18.4447";
  const lng = coords ? coords[1].toFixed(4) : "77.4508";

  return (
    <header className="h-14 border-b border-mars-panel bg-[#050505] px-4 md:px-6 flex items-center justify-between font-mono text-xs z-20 shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-mars-secondary animate-pulse shadow-[0_0_8px_#00E5FF]"></span>
        <h1 className="text-mars-secondary font-bold tracking-[0.25em] uppercase text-xs md:text-sm">
          {t("systemTitle") || "MARS NAVIGATION SYSTEM"}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* 🚀 Dynamic Jezero Crater Coordinates */}
        <div className="hidden md:block text-gray-400 tracking-wider">
          LAT: <span className="text-gray-200">{lat}° N</span> &nbsp; LNG:{" "}
          <span className="text-gray-200">{lng}° E</span>
        </div>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1 border border-mars-panel rounded bg-[#111] hover:bg-[#222] text-gray-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-mars-primary" />
          <span className="font-bold">{isEn ? "ENG" : "MYA"}</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-mars-success font-bold tracking-widest">
          <div className="flex gap-0.5 items-end h-3">
            <span className="w-1 h-1.5 bg-mars-success"></span>
            <span className="w-1 h-2.5 bg-mars-success"></span>
            <span className="w-1 h-3.5 bg-mars-success animate-pulse"></span>
          </div>
          <span>MARS-NET: ACTIVE</span>
        </div>
      </div>
    </header>
  );
}
