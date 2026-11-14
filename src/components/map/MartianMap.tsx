"use client";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Circle,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { LatLngBoundsExpression } from "leaflet";
import { MapProps } from "./MapWrapper";
import { useLanguage } from "@/lib/LanguageContext";
import { startIcon, endIcon, roverIcon } from "./MapIcons";
import { MapClickHandler, MapActionHandler } from "./MapHandlers";
import TacticalLayersUI from "./TacticalLayersUI";
import {
  MOCK_HAZARD_ZONES,
  MOCK_DUST_STORMS,
  MOCK_RADIATION_ZONES,
  API_BASE_URL,
} from "@/constants/mockData";

const MAP_URL =
  "https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png";

const jezeroBounds: LatLngBoundsExpression = [
  [15.0, 70.0],
  [25.0, 85.0],
];

const buildDynamicEnvironment = (
  start: [number, number],
  end: [number, number],
) => {
  const [sLat, sLng] = start;
  const [eLat, eLng] = end;
  const midLat = (sLat + eLat) / 2;
  const midLng = (sLng + eLng) / 2;
  const spanLat = Math.max(0.2, Math.abs(sLat - eLat));
  const spanLng = Math.max(0.2, Math.abs(sLng - eLng));
  const dLat = spanLat * 0.12;
  const dLng = spanLng * 0.12;

  const h1Lat = sLat + e_lat_diff(sLat, eLat) * 0.35;
  const h1Lng = sLng + e_lng_diff(sLng, eLng) * 0.35;
  const h2Lat = sLat + e_lat_diff(sLat, eLat) * 0.68;
  const h2Lng = sLng + e_lng_diff(sLng, eLng) * 0.68;

  function e_lat_diff(s: number, e: number) {
    return e - s;
  }
  function e_lng_diff(s: number, e: number) {
    return e - s;
  }

  const hazards = [
    {
      id: "dyn_haz_1",
      name: "DEM Steep Escarpment #1",
      maxSlope: 21.4,
      elevation: -1890,
      polygon: [
        [h1Lat - dLat, h1Lng - dLng],
        [h1Lat + dLat, h1Lng - dLng],
        [h1Lat + dLat, h1Lng + dLng],
        [h1Lat - dLat, h1Lng + dLng],
      ],
    },
    {
      id: "dyn_haz_2",
      name: "High-Risk Crater Ridge #2",
      maxSlope: 19.2,
      elevation: -2010,
      polygon: [
        [h2Lat - dLat * 0.85, h2Lng - dLng * 0.85],
        [h2Lat + dLat * 0.85, h2Lng - dLng * 0.85],
        [h2Lat + dLat * 0.85, h2Lng + dLng * 0.85],
        [h2Lat - dLat * 0.85, h2Lng + dLng * 0.85],
      ],
    },
  ];

  const degDist = Math.hypot(sLat - eLat, sLng - eLng);
  const stormRadius = Math.max(8000, Math.min(28000, degDist * 14500));

  const storms = [
    {
      id: "dyn_storm_1",
      name: "Active Martian Cyclone",
      center: [midLat, midLng],
      radius: stormRadius,
      speed: 31.6,
      direction: "South-West",
    },
  ];

  // Dynamic Radiation Zone Calculation
  const radLat = sLat + (eLat - sLat) * 0.54;
  const radLng = sLng + (eLng - sLng) * 0.54;
  const radiation = [
    {
      id: "dyn_rad_1",
      name: "High-Altitude Cosmic Rad Zone",
      center: [radLat, radLng],
      radius: Math.round(stormRadius * 0.72),
      radLevel: 9.4,
      elevation: -1450,
    },
  ];

  return { hazards, storms, radiation };
};

const generateFallbackPath = (
  start: [number, number],
  end: [number, number],
  isCurved: boolean,
): [number, number][] => {
  const steps = 32;
  const spanLat = end[0] - start[0];
  const spanLng = end[1] - start[1];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const curveOffset = isCurved
      ? Math.sin(t * Math.PI) *
        Math.max(0.22, Math.hypot(spanLat, spanLng) * 0.28)
      : 0;
    return [
      start[0] + spanLat * t + curveOffset,
      start[1] + spanLng * t - curveOffset * 0.7,
    ];
  });
};

export default function MartianMap(props: MapProps) {
  const center: [number, number] = [18.4, 77.3];
  const { t } = useLanguage();

  const [roverPos, setRoverPos] = useState<[number, number] | null>(null);
  const [showRoute, setShowRoute] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showRadiation, setShowRadiation] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  const [internalRouteType, setInternalRouteType] = useState<
    "safest" | "shortest"
  >("safest");
  const activeRouteType: "safest" | "shortest" =
    props.routeType ?? internalRouteType;

  const handleSetRouteType = (type: "safest" | "shortest") => {
    setInternalRouteType(type);
    props.onRouteTypeChange?.(type);
  };

  const [apiPath, setApiPath] = useState<[number, number][]>([]);
  const [telemetryPoints, setTelemetryPoints] = useState<any[]>([]);
  const [hazardZones, setHazardZones] = useState<any[]>(MOCK_HAZARD_ZONES);
  const [stormZones, setStormZones] = useState<any[]>(MOCK_DUST_STORMS);
  const [radiationZones, setRadiationZones] =
    useState<any[]>(MOCK_RADIATION_ZONES);
  const [isFetching, setIsFetching] = useState(false);

  // Trajectory & Dynamic Corridor Hazards Calculation
  useEffect(() => {
    const fetchRoute = async () => {
      if (!props.startCoords || !props.endCoords) return;

      setIsFetching(true);
      setApiPath([]);
      setTelemetryPoints([]);

      const localEnv = buildDynamicEnvironment(
        props.startCoords,
        props.endCoords,
      );
      setHazardZones(localEnv.hazards);
      setStormZones(localEnv.storms);
      setRadiationZones(localEnv.radiation);

      try {
        const response = await fetch(`${API_BASE_URL}/api/calculate-route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startCoords: props.startCoords,
            endCoords: props.endCoords,
            routeType: activeRouteType,
            hazards: showHazards ? localEnv.hazards.map((z) => z.polygon) : [],
          }),
        });

        const data = await response.json();
        if (
          data.status === "success" &&
          Array.isArray(data.path) &&
          data.path.length > 0
        ) {
          setApiPath(data.path);
          setTelemetryPoints(data.telemetryPoints || []);
          if (data.dynamicHazards) setHazardZones(data.dynamicHazards);
          if (data.dynamicStorms) setStormZones(data.dynamicStorms);
          if (data.dynamicRadiation) setRadiationZones(data.dynamicRadiation);
        } else {
          throw new Error("Invalid path response");
        }
      } catch {
        const fallback = generateFallbackPath(
          props.startCoords,
          props.endCoords,
          activeRouteType === "safest",
        );
        setApiPath(fallback);
        setTelemetryPoints(
          fallback
            .filter(
              (_, idx) => idx % 6 === 0 && idx > 0 && idx < fallback.length - 1,
            )
            .map((coords, i) => ({
              coords,
              elevation: -2150 + i * 45,
              slope: activeRouteType === "safest" ? 6.5 : 18.4,
            })),
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchRoute();
  }, [props.startCoords, props.endCoords, activeRouteType, showHazards]);

  // Rover Animation & Progress Tracking
  useEffect(() => {
    if (props.isNavigating && apiPath.length > 0) {
      setRoverPos(apiPath[0]);
      props.onRoverMove?.(apiPath[0]);
      let step = 0;
      const totalSteps = apiPath.length - 1;

      const timer = setInterval(() => {
        step++;
        if (step >= totalSteps) {
          clearInterval(timer);
          setRoverPos(apiPath[totalSteps]);
          props.onRoverMove?.(apiPath[totalSteps]);
          props.onProgressChange?.(1);
          props.onArrival?.();
        } else {
          setRoverPos(apiPath[step]);
          props.onRoverMove?.(apiPath[step]);
          props.onProgressChange?.(step / totalSteps);
        }
      }, 150);

      return () => clearInterval(timer);
    } else if (!props.isNavigating) {
      setRoverPos(null);
      props.onRoverMove?.(null);
    }
  }, [props.isNavigating, apiPath]);

  return (
    <div className="relative h-full w-full">
      {props.startCoords && props.endCoords && (
        <TacticalLayersUI
          showHazards={showHazards}
          setShowHazards={setShowHazards}
          showRadiation={showRadiation}
          setShowRadiation={setShowRadiation}
          showWeather={showWeather}
          setShowWeather={setShowWeather}
          showRoute={showRoute}
          setShowRoute={setShowRoute}
          routeType={activeRouteType}
          setRouteType={handleSetRouteType}
        />
      )}

      {isFetching && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1000 flex flex-col items-center justify-center bg-[#0A0300]/90 border border-mars-primary/50 rounded p-4 backdrop-blur-md shadow-[0_0_20px_rgba(255,98,0,0.2)]">
          <div className="w-8 h-8 border-4 border-mars-primary/30 border-t-mars-primary rounded-full animate-spin mb-3"></div>
          <span className="text-mars-primary font-mono text-[11px] font-bold tracking-widest animate-pulse">
            READING DEM TOPOGRAPHY...
          </span>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={8}
        className="h-full w-full bg-[#0A0300]"
        zoomControl={false}
        maxBounds={jezeroBounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
      >
        <TileLayer url={MAP_URL} opacity={1} />
        <MapClickHandler {...props} />
        <MapActionHandler
          zoomTrigger={props.zoomTrigger}
          startCoords={props.startCoords}
          endCoords={props.endCoords}
        />

        {/* 🔴 1. Dynamic Terrain Hazard Polygons */}
        {showHazards &&
          hazardZones.map((zone, idx) => (
            <Polygon
              key={`${zone.id || "haz"}-${idx}`}
              positions={zone.polygon as any}
              pathOptions={{
                color: "#FF2A2A",
                fillColor: "#FF2A2A",
                fillOpacity: 0.4,
                weight: 2,
              }}
            >
              <Popup className="font-mono text-xs">
                <div className="text-red-600 font-bold border-b pb-1 mb-1">
                  ⛰️ {zone.name || "STEEP TERRAIN"}
                </div>
                <div className="text-gray-800">
                  <div>
                    MAX SLOPE: <b>{zone.maxSlope ?? 21.4}°</b>
                  </div>
                  <div>
                    ELEVATION: <b>{zone.elevation ?? -1890} m</b>
                  </div>
                  <div className="text-[10px] text-red-600 font-bold mt-1">
                    {t("impassableTerrain") || "HIGH ROLLOVER RISK"}
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* 🟣 2. High Radiation Zones */}
        {showRadiation &&
          radiationZones.map((rad, idx) => (
            <Circle
              key={`${rad.id || "rad"}-${idx}`}
              center={rad.center as [number, number]}
              radius={rad.radius || 15000}
              pathOptions={{
                color: "#C084FC",
                fillColor: "#A855F7",
                fillOpacity: 0.22,
                weight: 1.5,
                dashArray: "6, 6",
              }}
            >
              <Popup className="font-mono text-xs">
                <div className="text-purple-700 font-bold border-b pb-1 mb-1">
                  ☢️ {rad.name || "HIGH RADIATION ZONE"}
                </div>
                <div className="text-gray-800">
                  <div>
                    RAD LEVEL: <b>{rad.radLevel} mSv/h</b>
                  </div>
                  <div>
                    ALTITUDE: <b>{rad.elevation} m</b>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* 🟡 3. Dynamic Cyclone / Dust Storm Circles */}
        {showWeather &&
          stormZones.map((storm, idx) => (
            <Circle
              key={`${storm.id || "storm"}-${idx}`}
              center={storm.center as [number, number]}
              radius={storm.radius || 14000}
              pathOptions={{
                color: "#FFD700",
                fillColor: "#FFD700",
                fillOpacity: 0.28,
                weight: 2,
                dashArray: "6, 6",
              }}
            >
              <Popup className="font-mono text-xs">
                <div className="text-amber-600 font-bold border-b pb-1 mb-1">
                  🌪️ {storm.name || "ACTIVE DUST STORM"}
                </div>
                <div className="text-gray-800">
                  <div>
                    WIND SPEED: <b>{storm.speed} m/s</b>
                  </div>
                  <div>
                    DIRECTION: <b>{storm.direction}</b>
                  </div>
                  <div>
                    RADIUS:{" "}
                    <b>{((storm.radius || 12000) / 1000).toFixed(1)} KM</b>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* 🟢/🟠 4. Route Trajectory Polyline */}
        {!props.isPlanning && showRoute && apiPath.length > 0 && (
          <Polyline
            key={`route-${activeRouteType}-${apiPath.length}`}
            positions={apiPath}
            color={activeRouteType === "safest" ? "#00FF66" : "#FF6200"}
            weight={3.5}
            dashArray={activeRouteType === "shortest" ? "10, 10" : undefined}
          />
        )}

        {/* 🔵 5. DEM Telemetry Waypoints */}
        {!props.isPlanning &&
          showRoute &&
          telemetryPoints.map((pt, idx) => (
            <CircleMarker
              key={`tp-${idx}-${pt.coords[0]}`}
              center={pt.coords}
              radius={4}
              pathOptions={{
                color: "#00E5FF",
                fillColor: pt.slope > 15 ? "#FF2A2A" : "#00E5FF",
                fillOpacity: 0.9,
                weight: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                <div className="font-mono text-[10px] leading-tight">
                  <div className="font-bold text-blue-900">DEM TELEMETRY</div>
                  <div>ELEV: {pt.elevation} m</div>
                  <div>SLOPE: {pt.slope}°</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {roverPos && (
          <Marker position={roverPos} icon={roverIcon} zIndexOffset={1000}>
            <Popup className="font-mono text-xs font-bold">ROVER-1</Popup>
          </Marker>
        )}

        {props.startCoords && (
          <Marker position={props.startCoords} icon={startIcon}>
            <Popup className="font-mono text-xs text-mars-success">
              START POINT
            </Popup>
          </Marker>
        )}

        {props.endCoords && (
          <Marker position={props.endCoords} icon={endIcon}>
            <Popup className="font-mono text-xs text-mars-primary">
              DESTINATION
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
