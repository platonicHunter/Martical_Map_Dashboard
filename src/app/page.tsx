"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MapWrapper from "@/components/map/MapWrapper";
import RouteSetupModal from "@/components/map/RouteSetupModal";
import BiometricsPanel from "@/components/dashboard/BiometricsPanel";
import EnvironmentPanel from "@/components/dashboard/EnvironmentPanel";
import MavInfoPanel from "@/components/dashboard/MavInfoPanel";
import SystemLogPanel from "@/components/dashboard/SystemLogPanel";
import MissionDetailsPanel from "@/components/dashboard/MissionDetailsPanel";

export default function Page() {
  const [isPlanning, setIsPlanning] = useState(true);
  const [navMode, setNavMode] = useState<"sim" | "manual" | null>(null);

  const [mapSelectMode, setMapSelectMode] = useState<"start" | "end" | null>(
    null,
  );
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
  const [liveRoverCoords, setLiveRoverCoords] = useState<
    [number, number] | null
  >(null);

  const [zoomTrigger, setZoomTrigger] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const [isArrived, setIsArrived] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  const [fullRouteData, setFullRouteData] = useState<any>(null);
  const [currentRouteType, setCurrentRouteType] = useState<
    "safest" | "shortest"
  >("safest");

  const handleEngage = (
    mode: "sim" | "manual",
    routeData: any = null,
    initialRoute: "safest" | "shortest" = "safest",
  ) => {
    setNavMode(mode);
    setIsPlanning(false);
    setCurrentRouteType(initialRoute);
    if (routeData) setFullRouteData(routeData);
  };

  const handleReRoute = () => {
    setIsPlanning(true);
    setNavMode(null);
    setIsNavigating(false);
    setIsArrived(false);
    setNavProgress(0);
    setStartCoords(null);
    setEndCoords(null);
    setLiveRoverCoords(null);
    setFullRouteData(null);
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const handleInitiateRover = () => {
    setIsArrived(false);
    setNavProgress(0);
    setIsNavigating(true);
  };

  const handleArrival = () => {
    setIsNavigating(false);
    setIsArrived(true);
    setNavProgress(1);
  };

  const handleRouteSwitch = (type: "safest" | "shortest") => {
    setCurrentRouteType(type);
    setIsNavigating(false);
    setIsArrived(false);
    setNavProgress(0);
  };

  const activeDetails = useMemo(() => {
    if (!fullRouteData) return null;
    return currentRouteType === "safest" ? fullRouteData[1] : fullRouteData[2];
  }, [fullRouteData, currentRouteType]);

  return (
    <div
      className={`h-screen w-full flex flex-col overflow-hidden relative select-none transition-colors duration-500 ${
        isSOS ? "bg-[#2a0000]" : "bg-mars-bg"
      }`}
    >
      <AnimatePresence>
        {isSOS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-100 pointer-events-none border-10 border-mars-critical flex items-center justify-center bg-mars-critical/10"
          >
            <div className="absolute inset-0 bg-mars-critical/20 animate-pulse"></div>
            <h1 className="text-4xl md:text-6xl text-mars-critical font-bold tracking-[0.5em] animate-bounce drop-shadow-[0_0_20px_rgba(255,42,42,1)]">
              EMERGENCY OVERRIDE
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 Live Rover Coordinates သို့မဟုတ် Start Point ကို Header တွင် ပြသမည် */}
      <Header coords={liveRoverCoords || startCoords} />

      <RouteSetupModal
        isOpen={isPlanning}
        onConfirm={handleEngage}
        mapSelectMode={mapSelectMode}
        setMapSelectMode={setMapSelectMode}
        startCoords={startCoords}
        setStartCoords={setStartCoords}
        endCoords={endCoords}
        setEndCoords={setEndCoords}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`flex-1 grid grid-cols-12 gap-0 overflow-hidden transition-all duration-1000 ${
          isPlanning && !mapSelectMode
            ? "opacity-30 blur-sm pointer-events-none"
            : "opacity-100 blur-0 pointer-events-auto"
        }`}
      >
        {/* 🟢 LEFT PANEL */}
        <div
          className={`col-span-12 lg:col-span-3 flex flex-col h-full overflow-y-auto border-r border-mars-panel bg-[#050505] ${
            mapSelectMode ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <BiometricsPanel
            isActive={!isPlanning || isSOS}
            activeDetails={activeDetails}
            isNavigating={isNavigating}
            navProgress={navProgress}
          />
          <EnvironmentPanel
            isActive={!isPlanning}
            activeDetails={activeDetails}
          />
          <MavInfoPanel
            isActive={!isPlanning}
            navMode={isSOS ? "manual" : navMode}
            activeDetails={activeDetails}
            navProgress={navProgress}
          />
        </div>

        {/* 🔵 CENTER PANEL */}
        <div
          className={`col-span-12 lg:col-span-6 relative border-r border-mars-panel h-full bg-[#0A0300] ${
            mapSelectMode ? "cursor-crosshair" : ""
          }`}
        >
          <MapWrapper
            isPlanning={isPlanning}
            mapSelectMode={mapSelectMode}
            setMapSelectMode={setMapSelectMode}
            setStartCoords={setStartCoords}
            setEndCoords={setEndCoords}
            startCoords={startCoords}
            endCoords={endCoords}
            zoomTrigger={zoomTrigger}
            isScanning={isScanning}
            isSOS={isSOS}
            isNavigating={isNavigating}
            routeType={currentRouteType}
            onRouteTypeChange={handleRouteSwitch}
            onProgressChange={setNavProgress}
            onArrival={handleArrival}
            onRoverMove={setLiveRoverCoords}
          />
          {mapSelectMode && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111]/90 border border-mars-secondary text-mars-secondary px-6 py-3 font-bold tracking-widest animate-pulse pointer-events-none text-center">
              CLICK ON MAP TO SELECT
              <br />
              {mapSelectMode === "start" ? "STARTING" : "DESTINATION"} POINT
            </div>
          )}
        </div>

        {/* 🟠 RIGHT PANEL (overflow-hidden သုံးထားသဖြင့် SYSTEM LOG နှင့် ခလုတ် လုံးဝ ပြတ်မထွက်တော့ပါ) */}
        <div
          className={`col-span-12 lg:col-span-3 flex flex-col h-full overflow-hidden bg-[#050505] ${
            mapSelectMode ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <SystemLogPanel
            isActive={!isPlanning || isSOS}
            activeDetails={activeDetails}
            isNavigating={isNavigating}
            isArrived={isArrived}
          />
          <MissionDetailsPanel
            isPlanning={isPlanning}
            startCoords={startCoords}
            endCoords={endCoords}
            isNavigating={isNavigating}
            isArrived={isArrived}
            onInitiate={handleInitiateRover}
            calculatedDist={activeDetails?.dist}
            estimatedTime={activeDetails?.time}
            terrainHazards={activeDetails?.rocks}
          />
        </div>
      </motion.main>

      <Footer
        onReRoute={handleReRoute}
        onZoom={() => setZoomTrigger((prev) => prev + 1)}
        onScan={handleScan}
        onSOS={() => setIsSOS(!isSOS)}
        isSOS={isSOS}
        isScanning={isScanning}
      />
    </div>
  );
}
