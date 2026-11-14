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

export interface MapProps {
  isPlanning: boolean;
  mapSelectMode: MapSelectMode;
  setMapSelectMode: (mode: MapSelectMode) => void;
  startCoords: LatLngTuple | null;
  setStartCoords: (coords: LatLngTuple | null) => void;
  endCoords: LatLngTuple | null;
  setEndCoords: (coords: LatLngTuple | null) => void;
  zoomTrigger: number;
  isScanning: boolean;
  isSOS: boolean;
  isNavigating: boolean;
  routeType: RouteMode;
  onRouteTypeChange: (type: RouteMode) => void;
  activeRouteData: RouteOptionUI | null;
  onProgressChange: (progress: number, currentPos: LatLngTuple) => void;
  onArrival: () => void;
}
