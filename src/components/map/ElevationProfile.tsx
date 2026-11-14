"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/lib/LanguageContext";

export default function ElevationProfile({
  data,
  routeType,
}: {
  data: any[];
  routeType: string;
}) {
  const { t, lang } = useLanguage();
  const isEn = lang === "en";

  if (!data || data.length === 0) return null;

  // Chart အတွက် Data Format ပြင်ဆင်ခြင်း (Waypoints အလိုက် အမြင့်ပေ)
  const chartData = data.map((pt, index) => ({
    waypoint: `WP-${index + 1}`,
    elevation: pt.elevation,
    slope: pt.slope,
  }));

  const color = routeType === "safest" ? "#00FF66" : "#FF6200";

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[85%] h-30 z-1000 bg-[#0A0500]/70 backdrop-blur-md border border-mars-panel rounded-lg p-2 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      <div
        className="text-[10px] font-bold tracking-widest uppercase mb-1 ml-2 flex items-center gap-2"
        style={{ color }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        ></span>
        {isEn
          ? "ELEVATION PROFILE (DEM TOPOGRAPHY)"
          : "မြေပြင် အနိမ့်အမြင့် ပြကွက်"}
      </div>

      <div className="w-full h-21.25">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="waypoint" hide />
            <YAxis
              domain={["dataMin - 20", "dataMax + 20"]}
              tick={{ fill: "#aaaaaa", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                fontSize: "10px",
                borderRadius: "4px",
              }}
              itemStyle={{ color: "#fff", fontWeight: "bold" }}
              labelStyle={{ display: "none" }}
              formatter={(value, name, props) => [
                `${value} m (Slope: ${props.payload.slope}°)`,
                isEn ? "ELEVATION" : "အမြင့်ပေ",
              ]}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorElev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
