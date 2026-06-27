import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Video,
  Radio,
  Eye,
  Crosshair,
  Wind,
  Battery,
  AlertTriangle,
  RotateCw,
  Sliders,
  Sparkles,
  Compass,
  Zap,
  Target
} from "lucide-react";
import { useToastStore } from "../../lib/store";
import { useMissionStore } from "../../lib/missionStore";

export default function AerialSurveillanceView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { addToast } = useToastStore();
  const { drones } = useMissionStore();
  const [activeDroneId, setActiveDroneId] = useState<string | null>(null);

  useEffect(() => {
    if (drones.length > 0 && !activeDroneId) {
      setActiveDroneId(drones[0].id);
    }
  }, [drones, activeDroneId]);

  const activeDrone = drones.find(d => d.id === activeDroneId) || null;

  const [isThermal, setIsThermal] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [cameraAngle, setCameraAngle] = useState(45);
  const [noiseIntensity, setNoiseIntensity] = useState(0.08);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Environmental simulation parameters
  const [wind, setWind] = useState(14);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        // Environmental fluctuations
        setWind((prev) => Math.max(8, Math.min(25, prev + (Math.random() - 0.5) * 2)));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Render simulated drone camera feed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background color (thermal vs normal)
      if (isThermal) {
        ctx.fillStyle = "#0c051a"; // Dark purple
      } else {
        ctx.fillStyle = "#1e293b"; // Slate gray land
      }
      ctx.fillRect(0, 0, w, h);

      // Draw simulated ground details (grid, river, roads, and houses)
      ctx.strokeStyle = isThermal ? "rgba(147, 51, 234, 0.15)" : "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = frameCount % gridSize; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = frameCount % gridSize; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw a winding river/road
      ctx.beginPath();
      ctx.moveTo(-100, h * 0.3);
      ctx.bezierCurveTo(w * 0.3, h * 0.1, w * 0.6, h * 0.8, w + 100, h * 0.6);
      ctx.lineWidth = 24 * (zoomLevel / 4);
      ctx.strokeStyle = isThermal ? "rgba(239, 68, 68, 0.4)" : "rgba(30, 41, 59, 0.8)"; // Warm river vs dark river
      ctx.stroke();

      // Active drone search footprint box
      ctx.strokeStyle = isThermal ? "rgba(234, 179, 8, 0.8)" : "rgba(16, 185, 129, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.25, h * 0.25, w * 0.5, h * 0.5);

      // Draw some targets/hotspots
      const hotspots = [
        { x: w * 0.4, y: h * 0.35, label: "GROUND TEAM ALPHA", size: 8, isHostile: false },
        { x: w * 0.65, y: h * 0.6, label: "PROBABLE ROUTE PING", size: 6, isHostile: true },
      ];

      hotspots.forEach((spot) => {
        // Draw radar marker
        const rad = spot.size + Math.sin(frameCount * 0.1) * 3;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, rad, 0, Math.PI * 2);
        if (isThermal) {
          ctx.fillStyle = spot.isHostile ? "rgba(239, 68, 68, 0.9)" : "rgba(234, 179, 8, 0.9)";
        } else {
          ctx.fillStyle = spot.isHostile ? "rgba(239, 68, 68, 0.8)" : "rgba(16, 185, 129, 0.8)";
        }
        ctx.fill();

        // Pulsing outer ring
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, rad * 2, 0, Math.PI * 2);
        ctx.strokeStyle = isThermal ? "rgba(234, 179, 8, 0.3)" : "rgba(16, 185, 129, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "9px monospace";
        ctx.fillText(spot.label, spot.x + spot.size + 4, spot.y + 3);
      });

      // HUD crosshairs in the center
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;

      // Inner crosshair circles
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      // Crosshair notches
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy); ctx.lineTo(cx - 35, cy);
      ctx.moveTo(cx + 35, cy); ctx.lineTo(cx + 50, cy);
      ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy - 35);
      ctx.moveTo(cx, cy + 35); ctx.lineTo(cx, cy + 50);
      ctx.stroke();

      // Draw telemetry corners
      ctx.lineWidth = 3;
      const len = 20;
      ctx.strokeStyle = isThermal ? "rgba(234, 179, 8, 0.9)" : "rgba(16, 185, 129, 0.9)";
      
      // Top Left
      ctx.beginPath(); ctx.moveTo(20, 20 + len); ctx.lineTo(20, 20); ctx.lineTo(20 + len, 20); ctx.stroke();
      // Top Right
      ctx.beginPath(); ctx.moveTo(w - 20, 20 + len); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20 - len, 20); ctx.stroke();
      // Bottom Left
      ctx.beginPath(); ctx.moveTo(20, h - 20 - len); ctx.lineTo(20, h - 20); ctx.lineTo(20 + len, h - 20); ctx.stroke();
      // Bottom Right
      ctx.beginPath(); ctx.moveTo(w - 20, h - 20 - len); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20 - len, h - 20); ctx.stroke();

      // Pitch ladders left and right
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      
      // Left pitch scale
      for (let i = -2; i <= 2; i++) {
        const py = cy + i * 40 + (cameraAngle % 40);
        ctx.beginPath();
        ctx.moveTo(60, py); ctx.lineTo(75, py);
        ctx.stroke();
        ctx.fillText(`${i * 10}°`, 42, py + 3);
      }

      // Live sweeping text
      if (isScanning && frameCount % 30 < 15) {
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 10px monospace";
        ctx.fillText("• REC SECURE LINK", 30, 45);
      }

      // Add camera static noise
      ctx.fillStyle = `rgba(255, 255, 255, ${noiseIntensity * Math.random()})`;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * w * 0.4, 1.5);
      }

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [isThermal, zoomLevel, cameraAngle, noiseIntensity, isScanning]);

  const toggleThermal = () => {
    setIsThermal(!isThermal);
    addToast(isThermal ? "Swapped to Optical Standard feed" : "Activated Thermal Heatwave infrared lookup", "info");
  };

  const handleDroneShift = (droneId: string, droneName: string) => {
    setActiveDroneId(droneId);
    addToast(`${droneName} feed established. Tactical link locked.`, "success");
  };

  const bgCardStyle = highContrast
    ? "bg-stone-900 border-stone-800 text-yellow-300"
    : "bg-white border-gray-200/80 shadow-sm text-gray-900";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Top Controller row */}
      <div className={`p-4 mb-4 rounded-xl border ${bgCardStyle} flex flex-col md:flex-row items-center justify-between gap-4`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-gray-900 flex items-center gap-2">
              UAV Aerial Search & Rescue Desk
              <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                AIR-LINK LIVE
              </span>
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tactical Unmanned Aerial Systems Gateway</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {drones.map((drone) => (
            <button
              key={drone.id}
              onClick={() => handleDroneShift(drone.id, drone.name)}
              className={`text-xs font-black px-3.5 py-1.5 rounded-lg border transition-all ${
                activeDroneId === drone.id
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {drone.name}
            </button>
          ))}
          {drones.length === 0 && (
             <span className="text-xs font-bold text-gray-400">NO DRONES ACTIVE</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1">
        
        {/* HUD LIVE CAMERA GRID */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className={`rounded-xl border ${bgCardStyle} overflow-hidden flex flex-col relative`}>
            
            {/* Base toolbar */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={toggleThermal}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isThermal
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-black/80 text-white border-white/20 hover:bg-black"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>THERMAL OVERLAY {isThermal ? "ACTIVE" : "OFF"}</span>
              </button>

              <button
                onClick={() => setIsScanning(!isScanning)}
                className="px-3 py-1.5 rounded-lg border text-[10px] font-bold font-mono bg-black/80 text-white border-white/20 hover:bg-black flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "STREAM SYNCED" : "PAUSE FEED"}</span>
              </button>
            </div>

            <div className="absolute top-4 right-4 z-10 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl text-white font-mono text-[10px] border border-white/15 flex flex-col gap-0.5">
              <span className="text-gray-400">LATITUDE: <strong className="text-emerald-400">{activeDrone?.location?.lat?.toFixed(4) || "0.0000"}° N</strong></span>
              <span className="text-gray-400">LONGITUDE: <strong className="text-emerald-400">{activeDrone?.location?.lng?.toFixed(4) || "0.0000"}° E</strong></span>
              <span className="text-gray-400">HEADING: <strong className="text-yellow-400">284° WNW</strong></span>
            </div>

            {/* Video feed container */}
            <div className="flex-1 min-h-[420px] relative bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={480}
                className="w-full h-full max-h-[500px] object-cover"
              />
            </div>

            {/* Bottom HUD readout */}
            <div className="p-3 bg-gray-50 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  Altitude: <strong className="text-gray-900">{activeDrone?.altitude || 0}m</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-blue-500" />
                  Wind Resistance: <strong className="text-gray-900">{wind.toFixed(1)} km/h</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-emerald-500 animate-pulse" />
                  UAV Battery: <strong className="text-gray-900">{activeDrone?.battery?.toFixed(1) || 0}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Signal:</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">EXCELLENT (94 dB)</span>
              </div>
            </div>

          </div>
        </div>

        {/* TACTICAL DRONE COMMAND HUB */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          
          <div className={`p-4 rounded-xl border ${bgCardStyle} flex flex-col gap-4`}>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" /> Telecommand Center
            </h4>

            {/* Controls */}
            <div className="space-y-4 text-xs font-semibold text-gray-600">
              <div>
                <div className="flex justify-between mb-1 text-gray-800">
                  <span>Target Sweep Altitude (m)</span>
                  <span>{activeDrone?.altitude || 0} m</span>
                </div>
                <input
                  type="range" min="50" max="350"
                  value={activeDrone?.altitude || 120}
                  onChange={(e) => {
                     // Normally would send command via socket to update drone altitude
                     addToast(`Requested altitude change to ${e.target.value}m`, "info");
                  }}
                  className="w-full h-1.5 bg-gray-100 rounded-lg accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-gray-800">
                  <span>Zoom Focus Power</span>
                  <span>{zoomLevel}x Scope</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[2, 4, 8, 16].map((z) => (
                    <button
                      key={z}
                      onClick={() => {
                        setZoomLevel(z);
                        addToast(`Digital camera scope set to ${z}x magnification`, "info");
                      }}
                      className={`py-1 text-center font-bold border rounded-lg text-[10px] transition-all cursor-pointer ${
                        zoomLevel === z
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-gray-800">
                  <span>Gimbal Camera Angle (°)</span>
                  <span>{cameraAngle}°</span>
                </div>
                <input
                  type="range" min="15" max="90"
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-gray-800">
                  <span>Video Static Filter Noise</span>
                  <span>{(noiseIntensity * 100).toFixed(0)}% Noise</span>
                </div>
                <input
                  type="range" min="1" max="30" step="1"
                  value={noiseIntensity * 100}
                  onChange={(e) => setNoiseIntensity(Number(e.target.value) / 100)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* AI SEARCH FLIGHT RECOMMENDATIONS */}
          <div className={`p-4 rounded-xl border ${bgCardStyle} flex flex-col gap-3 flex-1`}>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> Flight Path Neural Optimizer
            </h4>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px]">
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1.5">
                <span className="text-[9px] font-bold text-purple-600 font-mono block uppercase">RECOMMENDED SEARCH GRID</span>
                <span className="font-extrabold text-gray-900 block text-[11px] tracking-tight">Sector 4 Forest Boundary</span>
                <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                  Thermal prediction suggests wandering child Suresh may seek forest canopy cover under rainfall. Zooming in on river crossing block C.
                </p>
                <button
                  onClick={() => {
                    setZoomLevel(8);
                    addToast("AI Flight sweep coordinates dispatched. Camera locked to river crossing C.", "success");
                  }}
                  className="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-[9px] rounded-lg transition-colors cursor-pointer"
                >
                  DISPATCH CAMERA PILOT
                </button>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-emerald-600 font-mono block uppercase">BATTERY PROTOCOL SAFE</span>
                <span className="font-extrabold text-gray-900 block text-[11px] tracking-tight">Standard Return-To-Home Landing Zone</span>
                <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                  Calculated safe altitude return coordinates: LAT: 26.7245° N / LON: 88.5901° E. Landing pads clear of weather warning corridors.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
