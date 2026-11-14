// src/types/mars.ts

export type LatLngTuple = [number, number];
export type RouteMode = "safest" | "shortest";
export type NavMode = "sim" | "manual" | null;
export type MapSelectMode = "start" | "end" | null;

export interface TelemetryNode {
  coords: LatLngTuple;
  elevation: number;
  slope: number;
}

export interface HazardZone {
  id: string;
  name: string;
  maxSlope?: number;
  elevation?: number;
  polygon: LatLngTuple[];
}

export interface DustStorm {
  id: string;
  center: LatLngTuple;
  radius: number;
  speed: number;
  direction: string;
  severity: string;
}

export interface RouteOptionUI {
  id: 1 | 2;
  routeType: RouteMode;
  codeName: string; // "ROUTE A" | "ROUTE B"
  name: string;
  dist: string;
  distKm: number;
  time: string;
  timeMins: number;
  success: number;
  rocks: number;
  steepSlopes: number;
  maxSlope: number;
  elevGain: number;
  rads: string;
  energy: string;
  energyNum: number;
  color: string;
  bg: string;
  border: string;
  gear: string[];
  path: LatLngTuple[];
  telemetryPoints: TelemetryNode[];
}

export type RouteComparisonData = {
  1: RouteOptionUI;
  2: RouteOptionUI;
};

interface MapProps {
  isPlanning: boolean;
  mapSelectMode: "start" | "end" | null;
  setMapSelectMode: (mode: "start" | "end" | null) => void;
  startCoords: [number, number] | null;
  setStartCoords: (coords: [number, number] | null) => void;
  endCoords: [number, number] | null;
  setEndCoords: (coords: [number, number] | null) => void;
  activeRouteType?: "safest" | "shortest"; // 🚀 ဤနေရာကို ထည့်ပါ
  setActiveRouteType?: (type: "safest" | "shortest") => void; // 🚀 ဤနေရာကို ထည့်ပါ
  routeData: any;
  isNavigating: boolean;
  onRoverMove?: (coords: [number, number] | null) => void;
  onProgressChange?: (progress: number) => void;
  onArrival?: () => void;
}
