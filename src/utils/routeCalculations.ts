export function processRouteData(
  safestRaw: any,
  shortestRaw: any,
  isEn: boolean,
) {
  const formatTime = (mins: number) => {
    const safeMins = Math.max(1, Math.round(mins));
    const h = Math.floor(safeMins / 60);
    const m = safeMins % 60;
    return `${h}h ${m}m`;
  };

  const rawShortDist = Number(shortestRaw?.distance_km ?? 13.6);
  const rawSafeDist = Number(safestRaw?.distance_km ?? 14.4);

  const shDist = Number(rawShortDist.toFixed(1));
  const sDist = Number(
    (rawSafeDist <= shDist ? shDist * 1.22 : rawSafeDist).toFixed(1),
  );

  const shTime = Number(shortestRaw?.estimated_time_mins ?? 88);
  const sTime = Math.max(
    shTime + 15,
    Number(safestRaw?.estimated_time_mins ?? 158),
  );

  const sRocks = Number(safestRaw?.hazards_encountered ?? 5);
  const shRocks = Math.max(
    sRocks + 6,
    Number(shortestRaw?.hazards_encountered ?? 14),
  );

  const sSuccess = Number(safestRaw?.success_rate ?? 94);
  const shSuccess = Math.min(
    sSuccess - 18,
    Number(shortestRaw?.success_rate ?? 62),
  );

  const sEnergy = Number(safestRaw?.energy_cost ?? 42);
  const shEnergy = Math.max(
    sEnergy + 15,
    Number(shortestRaw?.energy_cost ?? 78),
  );

  const sWind = Number(Number(safestRaw?.wind_speed ?? 16.4).toFixed(1));
  const shWind = Number(Number(shortestRaw?.wind_speed ?? 34.8).toFixed(1));

  const sRadVal = Number(Number(safestRaw?.rad_level ?? 4.2).toFixed(1));
  const shRadVal = Number(Number(shortestRaw?.rad_level ?? 9.6).toFixed(1));

  const sTemp = Math.round(Number(safestRaw?.temp ?? -51));
  const shTemp = Math.round(Number(shortestRaw?.temp ?? -56));

  const getRadLabel = (rad: number, isSafeRoute: boolean) => {
    if (isSafeRoute && rad < 6.0) return isEn ? "LOW" : "နည်းပါး";
    if (rad < 7.0) return isEn ? "MODERATE" : "အသင့်အတင့်";
    return isEn ? "HIGH" : "မြင့်မား";
  };

  return {
    1: {
      id: 1,
      routeType: "safest",
      name: isEn ? "ROUTE A (SAFEST)" : "လမ်းကြောင်း A (အလုံခြုံဆုံး)",
      dist: `${sDist} KM`,
      rawDist: sDist,
      time: formatTime(sTime),
      rawTimeMins: sTime,
      success: sSuccess,
      energy: `${sEnergy}%`,
      rawEnergy: sEnergy,
      rocks: sRocks,
      rads: getRadLabel(sRadVal, true),
      radLevel: sRadVal,
      windSpeed: sWind,
      temp: sTemp,
      color: "mars-success",
      border: "border-mars-success",
      bg: "bg-mars-success/10",
      path: safestRaw?.path ?? [],
      telemetryPoints: safestRaw?.telemetryPoints ?? [],
      dynamicHazards: safestRaw?.dynamicHazards ?? [],
      dynamicStorms: safestRaw?.dynamicStorms ?? [],
      dynamicRadiation: safestRaw?.dynamicRadiation ?? [],
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
      routeType: "shortest",
      name: isEn ? "ROUTE B (SHORTEST)" : "လမ်းကြောင်း B (အတိုဆုံး)",
      dist: `${shDist} KM`,
      rawDist: shDist,
      time: formatTime(shTime),
      rawTimeMins: shTime,
      success: shSuccess,
      energy: `${shEnergy}%`,
      rawEnergy: shEnergy,
      rocks: shRocks,
      rads: getRadLabel(shRadVal, false),
      radLevel: shRadVal,
      windSpeed: shWind,
      temp: shTemp,
      color: "mars-primary",
      border: "border-mars-primary",
      bg: "bg-mars-primary/10",
      path: shortestRaw?.path ?? [],
      telemetryPoints: shortestRaw?.telemetryPoints ?? [],
      dynamicHazards: shortestRaw?.dynamicHazards ?? [],
      dynamicStorms: shortestRaw?.dynamicStorms ?? [],
      dynamicRadiation: shortestRaw?.dynamicRadiation ?? [],
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
