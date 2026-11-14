import L from "leaflet";

export const startIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="relative flex items-center justify-center w-10 h-10">
           <span class="absolute inline-flex h-full w-full rounded-full border-2 border-mars-success opacity-75 animate-ping"></span>
           <span class="relative inline-flex rounded-full h-3 w-3 bg-mars-success shadow-[0_0_10px_#00FF66]"></span>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const endIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="relative flex items-center justify-center w-10 h-10">
           <span class="absolute inline-flex h-full w-full rounded-full border-2 border-mars-primary opacity-75 animate-ping"></span>
           <span class="relative inline-flex rounded-full h-3 w-3 bg-mars-primary shadow-[0_0_10px_#FF6200]"></span>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const roverIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="relative flex items-center justify-center w-6 h-6">
           <span class="absolute inline-flex h-full w-full rounded-full border border-white opacity-100 animate-ping"></span>
           <span class="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_15px_#FFFFFF]"></span>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
