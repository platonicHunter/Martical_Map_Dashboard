import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export function MapClickHandler(props: any) {
  const map = useMap();

  // 🚀 FIX: Mark on Map နှိပ်ထားချိန်တွင် လက်ဝါးပုံ (grab) အစား ပစ်မှတ်ထောက်သည့် (crosshair) ပုံစံသို့ ပြောင်းပေးမည်
  useEffect(() => {
    const container = map.getContainer();
    if (props.mapSelectMode) {
      container.style.cursor = "crosshair";
    } else {
      container.style.cursor = "";
    }
  }, [props.mapSelectMode, map]);

  useMapEvents({
    click(e) {
      if (props.mapSelectMode === "start") {
        props.setStartCoords([e.latlng.lat, e.latlng.lng]);
        props.setMapSelectMode(null);
      } else if (props.mapSelectMode === "end") {
        props.setEndCoords([e.latlng.lat, e.latlng.lng]);
        props.setMapSelectMode(null);
      }
    },
  });

  return null;
}

export function MapActionHandler({
  zoomTrigger,
  startCoords,
  endCoords,
}: {
  zoomTrigger: number;
  startCoords: [number, number] | null;
  endCoords?: [number, number] | null;
}) {
  const map = useMap();

  // Start နှင့် End ရွေးလိုက်သည်နှင့် လမ်းကြောင်းတစ်ခုလုံး အကြီးကြီး မြင်ရအောင် Auto Zoom ဆွဲပေးမည်
  useEffect(() => {
    if (startCoords && endCoords) {
      map.fitBounds([startCoords, endCoords], {
        padding: [80, 80],
        maxZoom: 10,
        animate: true,
      });
    } else if (startCoords) {
      map.flyTo(startCoords, 9, { duration: 1.2 });
    }
  }, [startCoords, endCoords, zoomTrigger, map]);

  return null;
}
