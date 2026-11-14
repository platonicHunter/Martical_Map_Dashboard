export function processRouteData(
  safestRaw: any,
  shortestRaw: any,
  isEn: boolean,
) {
  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const sDist = safestRaw?.distance_km ?? 14.4;
  const sTime = safestRaw?.estimated_time_mins ?? 158;
  const sRocks = safestRaw?.hazards_encountered ?? 5;
  const sSuccess = safestRaw?.success_rate ?? 94;
  const sEnergy = safestRaw?.energy_cost ?? 42;
  const sWind = safestRaw?.wind_speed ?? 16.4;
  const sRadVal = safestRaw?.rad_level ?? 4.2;
  const sTemp = safestRaw?.temp ?? -51;

  const shDist = shortestRaw?.distance_km ?? 13.6;
  const shTime = shortestRaw?.estimated_time_mins ?? 88;
  const shRocks = shortestRaw?.hazards_encountered ?? 14;
  const shSuccess = shortestRaw?.success_rate ?? 62;
  const shEnergy = shortestRaw?.energy_cost ?? 78;
  const shWind = shortestRaw?.wind_speed ?? 34.8;
  const shRadVal = shortestRaw?.rad_level ?? 9.6;
  const shTemp = shortestRaw?.temp ?? -56;

  return {
    1: {
      id: 1,
      name: isEn ? "ROUTE A (SAFEST)" : "လမ်းကြောင်း A (အလုံခြုံဆုံး)",
      dist: `${sDist} KM`,
      time: formatTime(sTime),
      success: sSuccess,
      energy: `${sEnergy}%`,
      rocks: sRocks,
      rads: isEn ? "LOW" : "နည်းပါး",
      radLevel: sRadVal, // 🚀 Dynamic mSv/h
      windSpeed: sWind, // 🚀 Dynamic m/s
      temp: sTemp, // 🚀 Dynamic °C
      color: "mars-success",
      border: "border-mars-success",
      bg: "bg-mars-success/10",
      gear: isEn
        ? [
            "Standard Wheel Config",
            "Solar Array Boost",
            "Topo Scanner",
            "Sample Container",
          ]
        : ["ပုံမှန်ဘီးစနစ်", "ဆိုလာစွမ်းအင်အပို", "မြေပြင်စကန်နာ", "နမူနာဘူး"],
    },
    2: {
      id: 2,
      name: isEn ? "ROUTE B (SHORTEST)" : "လမ်းကြောင်း B (အတိုဆုံး)",
      dist: `${shDist} KM`,
      time: formatTime(shTime),
      success: shSuccess,
      energy: `${shEnergy}%`,
      rocks: shRocks,
      rads: isEn ? "HIGH" : "မြင့်မား",
      radLevel: shRadVal, // 🚀 Dynamic mSv/h
      windSpeed: shWind, // 🚀 Dynamic m/s
      temp: shTemp, // 🚀 Dynamic °C
      color: "mars-primary",
      border: "border-mars-primary",
      bg: "bg-mars-primary/10",
      gear: isEn
        ? [
            "High-Torque Wheels",
            "Heavy Rad Shielding",
            "Aux Battery Pack",
            "Winch Cable",
          ]
        : [
            "မြေကြမ်းသုံးဘီး",
            "ဓာတ်ရောင်ခြည်ကာဝတ်စုံ",
            "အရန်ဘက်ထရီ",
            "ကယ်ဆယ်ရေးကြိုး",
          ],
    },
  };
}
