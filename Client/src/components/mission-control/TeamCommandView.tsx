import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Navigation,
  Activity,
  Battery,
  Shield,
  Plane,
  Plus,
  CheckCircle2,
  MapPin,
  Compass,
  Radio,
  Signal,
  Wifi,
  BotMessageSquare,
  X,
  Send,
  Zap,
  Maximize2,
  Minimize2,
  Trash2,
  Sliders,
  Wind,
  Thermometer,
  Eye,
  AlertTriangle,
  Upload,
  Mic,
  Video,
  FileText,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";
import { useToastStore } from "../../lib/store";
import { useMissionStore } from "../../lib/missionStore";

// Type definitions matching enterprise security standards
interface TacticalUnit {
  id: string;
  name: string;
  type: "team" | "drone" | "k9" | "medical" | "police" | "volunteer";
  status: "Ready" | "On Mission" | "En Route" | "Standby" | "Offline" | "Medical" | "Emergency" | "Maintenance";
  location: { lat: number; lng: number };
  target: { lat: number; lng: number };
  battery: number;
  speed: number; // km/h
  heading: string;
  altitude: number; // m
  signal: number; // %
  gpsAccuracy: number; // m
  distanceCovered: number; // km
  missionProgress: number; // %
  healthStatus: string;
  eta: string;
  trail: { lat: number; lng: number }[];
}

interface MissionLog {
  id: string;
  title: string;
  status: "Active" | "Pending" | "Completed" | "Aborted";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedUnit: string;
  progress: number;
}

export default function TeamCommandView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { teams: storeTeams, drones: storeDrones, init: initStore, kpis } = useMissionStore();
  const { addToast } = useToastStore();

  // Color theme selectors
  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-gray-200 shadow-sm";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  // Navigation tabs for left & right modules to respect exact layout boundary
  const [leftTab, setLeftTab] = useState<"resources" | "missions" | "intel">("resources");
  const [rightTab, setRightTab] = useState<"status" | "telemetry" | "comms">("status");

  // Local state for interactive GIS map controls
  const [mapZoom, setMapZoom] = useState<number>(1.2);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapRotation, setMapRotation] = useState<number>(0); // radians
  const [mapTilt, setMapTilt] = useState<number>(0); // tilt factor
  const [mapLayer, setMapLayer] = useState<"satellite" | "terrain" | "vector" | "hybrid">("hybrid");
  const [heatmapEnabled, setHeatmapEnabled] = useState<boolean>(false);
  const [geofenceEnabled, setGeofenceEnabled] = useState<boolean>(true);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);
  const [rulerPoints, setRulerPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({ lat: 27.0375, lng: 88.4236 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);

  // Audio system simulation
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Live simulation units state (merged and managed locally for smooth continuous interpolation)
  const [tacticalUnits, setTacticalUnits] = useState<TacticalUnit[]>([]);
  const unitsRef = useRef<TacticalUnit[]>([]);

  // Deployment Planner form state
  const [deployType, setDeployType] = useState<"team" | "drone" | "k9" | "medical" | "police" | "volunteer">("team");
  const [deployTargetSector, setDeployTargetSector] = useState<string>("Sikkim Sector");
  const [deployPriority, setDeployPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");

  // Local missions management
  const [missionsList, setMissionsList] = useState<MissionLog[]>([
    { id: "MSN-101", title: "Search northern riverbanks", status: "Active", priority: "Critical", assignedUnit: "Air-1", progress: 68 },
    { id: "MSN-102", title: "Establish transit checkpoint", status: "Active", priority: "High", assignedUnit: "Team Alpha", progress: 85 },
    { id: "MSN-103", title: "Medical dispatch to base camps", status: "Pending", priority: "Medium", assignedUnit: "Unassigned", progress: 0 },
  ]);
  const [newMissionTitle, setNewMissionTitle] = useState("");

  // Live Communications chat logs & state
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: string; text: string; time: string; type: "text" | "sos" | "media"; mediaUrl?: string }[]
  >([
    { id: "1", sender: "System", text: "Tactical Downlink established with Sikkim Gateway-09.", time: "04:22:00", type: "text" },
    { id: "2", sender: "Team Alpha", text: "Establishing perimeter at waypoint Bravo-4.", time: "04:22:12", type: "text" },
    { id: "3", sender: "Air-1", text: "Thermal anomaly detected near river coordinates. Requesting scan.", time: "04:22:30", type: "text" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isRadioListening, setIsRadioListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // AI Command Center state
  const [aiQueries, setAiQueries] = useState<{ query: string; response: string; isLoading: boolean }[]>([
    {
      query: "Analyze risk factors for search operations right now.",
      response: "TERRAIN: Steep slopes in Sector 4 with mudslide risk. METEOROLOGY: Active downpour reducing drone flight ceiling to 100m. RECOMMENDATION: Focus ground teams near railway junctions; keep K9 units on dry ridges. GPS confidence is stable.",
      isLoading: false
    }
  ]);
  const [customAiQuery, setCustomAiQuery] = useState("");

  // Filter state for showing specific statuses on map
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // References
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const thermalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Initializing synthesized military audio cue
  const playTacticalBeep = (type: "deploy" | "click" | "alert" | "comms") => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "deploy") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === "alert") {
        osc.type = "square";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(587, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "comms") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {}
  };

  // Wait for real-time tracking from backend store
  useEffect(() => {
    // Initial sync will be handled by the store observer below
  }, []);

  // Continuous micro-movement interpolation (60 FPS smooth animation loop)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 1000; // seconds
      lastTime = now;

      unitsRef.current = unitsRef.current.map((u) => {
        if (u.status === "Offline" || u.status === "Standby") return u;

        // Smoothly nudge unit location towards target
        const dLat = u.target.lat - u.location.lat;
        const dLng = u.target.lng - u.location.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        let nextLat = u.location.lat;
        let nextLng = u.location.lng;
        let nextTarget = u.target;
        let nextEta = u.eta;

        // Speed adjustment parameter
        const speedFactor = u.type === "drone" ? 0.003 : 0.0008;

        if (dist > 0.001) {
          nextLat += (dLat / dist) * speedFactor * delta;
          nextLng += (dLng / dist) * speedFactor * delta;
          
          // Compute dynamic ETA in minutes
          const minsRemaining = Math.max(1, Math.round((dist * 100) / (u.type === "drone" ? 2 : 0.5)));
          nextEta = `${minsRemaining} mins`;
        } else {
          // Reached target, we will wait for backend to provide next target
          nextEta = "Arrived";
        }

        // Increment distance and fluctuate battery level naturally
        const batteryDepletion = u.type === "drone" ? 0.006 * delta : 0.002 * delta;
        const speedNoise = (Math.random() - 0.5) * 0.5;

        // Keep a neat rolling breadcrumb trail
        let nextTrail = [...u.trail];
        if (nextTrail.length === 0 || Math.abs(nextLat - nextTrail[nextTrail.length - 1].lat) > 0.0005) {
          nextTrail.push({ lat: u.location.lat, lng: u.location.lng });
          if (nextTrail.length > 25) nextTrail.shift();
        }

        return {
          ...u,
          location: { lat: nextLat, lng: nextLng },
          target: nextTarget,
          battery: Math.max(2, parseFloat((u.battery - batteryDepletion).toFixed(2))),
          speed: Math.max(0.5, parseFloat((u.speed + speedNoise).toFixed(1))),
          distanceCovered: parseFloat((u.distanceCovered + 0.0001).toFixed(3)),
          missionProgress: Math.min(100, Math.round(u.missionProgress + (Math.random() > 0.85 ? 1 : 0))),
          eta: nextEta,
          trail: nextTrail
        };
      });

      setTacticalUnits(unitsRef.current);
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Web Socket state sync fallback with existing missionStore API data
  useEffect(() => {
    const activeUnitIds = new Set<string>();

    const mergeStoreData = (storeArr: any[], unitType: "team" | "drone") => {
      storeArr.forEach(item => {
        activeUnitIds.add(item.id);
        const existing = unitsRef.current.find(u => u.id === item.id);
        if (existing) {
           // Update target based on real-time server coordinates, interpolation will smoothly drive it there
           existing.target = { lat: item.location.lat, lng: item.location.lng };
           existing.battery = item.battery ?? existing.battery;
           existing.status = item.status || "On Mission";
        } else {
           // Create new unit
           unitsRef.current.push({
             id: item.id,
             name: item.name,
             type: unitType,
             status: item.status || "On Mission",
             location: { lat: item.location.lat, lng: item.location.lng },
             target: { lat: item.location.lat, lng: item.location.lng }, // Start at location
             battery: item.battery ?? 100,
             speed: unitType === "drone" ? 45 : 12,
             heading: "N/A",
             altitude: unitType === "drone" ? 150 : 0,
             signal: 100,
             gpsAccuracy: 1.0,
             distanceCovered: 0,
             missionProgress: 0,
             healthStatus: "Nominal",
             eta: "Calculating...",
             trail: []
           });
        }
      });
    };

    if (storeTeams.length > 0) mergeStoreData(storeTeams, "team");
    if (storeDrones.length > 0) mergeStoreData(storeDrones, "drone");

    // Remove units that no longer exist in the backend
    if (storeTeams.length > 0 || storeDrones.length > 0) {
      unitsRef.current = unitsRef.current.filter(u => activeUnitIds.has(u.id));
    }

    setTacticalUnits([...unitsRef.current]);
  }, [storeTeams, storeDrones]);

  // Canvas GIS map drawing routine
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fluid resize handling
    const container = mapContainerRef.current;
    const width = container ? container.clientWidth : 600;
    const height = container ? container.clientHeight : 450;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Map geographic projection helper
    const centerLat = 27.0375;
    const centerLng = 88.4236;
    const latScale = 14000 * mapZoom;
    const lngScale = 14000 * Math.cos((centerLat * Math.PI) / 180) * mapZoom;

    const projectCoords = (lat: number, lng: number) => {
      // Delta from center
      let dx = (lng - centerLng) * lngScale;
      let dy = (centerLat - lat) * latScale; // Screen Y goes down

      // Apply rotation matrix
      const cosR = Math.cos(mapRotation);
      const sinR = Math.sin(mapRotation);
      const rx = dx * cosR - dy * sinR;
      const ry = dx * sinR + dy * cosR;

      // Apply tilt factor projection
      const tx = rx;
      const ty = ry * Math.cos(mapTilt * (Math.PI / 180));

      // Translate by pan offset and center onto viewport
      return {
        x: tx + width / 2 + mapPan.x,
        y: ty + height / 2 + mapPan.y
      };
    };

    // Draw Map Layers Base
    if (mapLayer === "satellite") {
      ctx.fillStyle = highContrast ? "#0c0a09" : "#111827";
      ctx.fillRect(0, 0, width, height);
      // Render radar green-slate mountain overlays
      ctx.fillStyle = highContrast ? "#1c1917" : "#1e293b";
      ctx.beginPath();
      ctx.arc(width / 2 + 100, height / 2 - 50, 200 * mapZoom, 0, Math.PI * 2);
      ctx.fill();
    } else if (mapLayer === "terrain") {
      ctx.fillStyle = highContrast ? "#09090b" : "#0f172a";
      ctx.fillRect(0, 0, width, height);
    } else if (mapLayer === "vector") {
      ctx.fillStyle = highContrast ? "#000000" : "#fafafa";
      ctx.fillRect(0, 0, width, height);
    } else {
      // Hybrid View (Default - Deep Slate with grid lines)
      ctx.fillStyle = highContrast ? "#080707" : "#0f172a";
      ctx.fillRect(0, 0, width, height);
    }

    // Grid System
    ctx.strokeStyle = highContrast ? "rgba(234, 179, 8, 0.08)" : "rgba(16, 185, 129, 0.08)";
    ctx.lineWidth = 1;
    const gridStep = 0.02; // Grid interval in lat/lng degrees
    const startLat = 26.85;
    const endLat = 27.25;
    const startLng = 88.20;
    const endLng = 88.65;

    // Draw Longitude Grid lines
    for (let lng = startLng; lng <= endLng; lng += gridStep) {
      ctx.beginPath();
      let first = true;
      for (let lat = startLat; lat <= endLat; lat += 0.01) {
        const p = projectCoords(lat, lng);
        if (first) {
          ctx.moveTo(p.x, p.y);
          first = false;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    // Draw Latitude Grid lines
    for (let lat = startLat; lat <= endLat; lat += gridStep) {
      ctx.beginPath();
      let first = true;
      for (let lng = startLng; lng <= endLng; lng += 0.01) {
        const p = projectCoords(lat, lng);
        if (first) {
          ctx.moveTo(p.x, p.y);
          first = false;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    // Draw Topographical Terrain Contour isolines (Contour shapes around ridges)
    const ridges = [
      { lat: 27.12, lng: 88.45, radius: 0.08, height: 2800 },
      { lat: 26.98, lng: 88.28, radius: 0.06, height: 1600 },
      { lat: 27.05, lng: 88.38, radius: 0.09, height: 2100 }
    ];

    ridges.forEach((ridge) => {
      ctx.strokeStyle = highContrast ? "rgba(120, 113, 108, 0.15)" : "rgba(16, 185, 129, 0.12)";
      ctx.lineWidth = 1;
      for (let r = ridge.radius; r > 0.01; r -= 0.015) {
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
          const lat = ridge.lat + Math.sin(angle) * r;
          const lng = ridge.lng + Math.cos(angle) * r * 1.1; // adjust aspect
          const p = projectCoords(lat, lng);
          if (angle === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    });

    // Draw Scenic Teesta River winding pathway
    ctx.strokeStyle = highContrast ? "rgba(59, 130, 246, 0.4)" : "rgba(34, 211, 238, 0.45)";
    ctx.lineWidth = 3 * mapZoom;
    ctx.beginPath();
    const riverPoints = [
      { lat: 27.24, lng: 88.58 },
      { lat: 27.18, lng: 88.52 },
      { lat: 27.14, lng: 88.46 },
      { lat: 27.09, lng: 88.44 },
      { lat: 27.05, lng: 88.41 },
      { lat: 27.00, lng: 88.43 },
      { lat: 26.92, lng: 88.45 }
    ];
    riverPoints.forEach((p, idx) => {
      const proj = projectCoords(p.lat, p.lng);
      if (idx === 0) ctx.moveTo(proj.x, proj.y);
      else ctx.lineTo(proj.x, proj.y);
    });
    ctx.stroke();

    // Draw Geofencing Danger Zones
    if (geofenceEnabled) {
      const dangerPolygons = [
        [
          { lat: 27.10, lng: 88.40 },
          { lat: 27.13, lng: 27.13 }, // drawing bounding corners
          { lat: 27.13, lng: 88.45 },
          { lat: 27.08, lng: 88.46 },
          { lat: 27.07, lng: 88.41 },
        ]
      ];
      ctx.fillStyle = "rgba(239, 68, 68, 0.07)";
      ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
      ctx.lineWidth = 1.5;
      dangerPolygons.forEach((poly) => {
        ctx.beginPath();
        poly.forEach((coord, i) => {
          const proj = projectCoords(coord.lat, coord.lng);
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Warning Label inside Geofence Zone
        const centerProj = projectCoords(27.095, 88.43);
        ctx.fillStyle = "rgba(239, 68, 68, 0.65)";
        ctx.font = "bold 9px monospace";
        ctx.fillText("WARNING: SEVERE WATERLOGGING", centerProj.x - 70, centerProj.y);
      });
    }

    // Draw Heatmap Overlay if enabled
    if (heatmapEnabled) {
      ctx.fillStyle = "rgba(225, 29, 72, 0.12)";
      tacticalUnits.forEach((u) => {
        const proj = projectCoords(u.location.lat, u.location.lng);
        const grad = ctx.createRadialGradient(proj.x, proj.y, 5, proj.x, proj.y, 65 * mapZoom);
        grad.addColorStop(0, "rgba(244, 63, 94, 0.4)");
        grad.addColorStop(0.5, "rgba(244, 63, 94, 0.1)");
        grad.addColorStop(1, "rgba(244, 63, 94, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 65 * mapZoom, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Search Radius (glowing operational range) around selected unit
    if (selectedUnitId) {
      const activeUnit = tacticalUnits.find((u) => u.id === selectedUnitId);
      if (activeUnit) {
        const proj = projectCoords(activeUnit.location.lat, activeUnit.location.lng);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 50 * mapZoom, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
      }
    }

    // Draw Ruler measurement line if active
    if (isRulerActive && rulerPoints.length > 0) {
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const p1 = projectCoords(rulerPoints[0].lat, rulerPoints[0].lng);
      ctx.moveTo(p1.x, p1.y);

      const p2 = rulerPoints.length > 1 
        ? projectCoords(rulerPoints[1].lat, rulerPoints[1].lng)
        : projectCoords(cursorCoords.lat, cursorCoords.lng);

      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Calc geographic distance
      const latDiff = (rulerPoints.length > 1 ? rulerPoints[1].lat : cursorCoords.lat) - rulerPoints[0].lat;
      const lngDiff = (rulerPoints.length > 1 ? rulerPoints[1].lng : cursorCoords.lng) - rulerPoints[0].lng;
      const distKm = (Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111).toFixed(2); // approximate degree distance multiplier

      ctx.fillStyle = "#a855f7";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`MEASURED PATH: ${distKm} KM`, (p1.x + p2.x) / 2 + 10, (p1.y + p2.y) / 2);
    }

    // Draw Breadcrumb Trails & Units
    tacticalUnits.forEach((u) => {
      // Respect map status filter
      if (filterStatus && u.status !== filterStatus) return;

      const currentProj = projectCoords(u.location.lat, u.location.lng);

      // Draw breadcrumb history
      if (u.trail && u.trail.length > 0) {
        ctx.strokeStyle = u.type === "drone" ? "rgba(96, 165, 250, 0.25)" : "rgba(52, 211, 153, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        u.trail.forEach((t, index) => {
          const pt = projectCoords(t.lat, t.lng);
          if (index === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      // Draw dashed trajectory to active target path
      ctx.strokeStyle = u.type === "drone" ? "rgba(96, 165, 250, 0.15)" : "rgba(52, 211, 153, 0.15)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      const targetProj = projectCoords(u.target.lat, u.target.lng);
      ctx.moveTo(currentProj.x, currentProj.y);
      ctx.lineTo(targetProj.x, targetProj.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw sonar pulsing radar wave
      const pulseRadius = (Date.now() / 25) % 20 + 4;
      ctx.strokeStyle = u.type === "drone" ? `rgba(59, 130, 246, ${1 - (pulseRadius - 4) / 20})` : `rgba(16, 185, 129, ${1 - (pulseRadius - 4) / 20})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(currentProj.x, currentProj.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Unit Base Icon Node
      const isSelected = selectedUnitId === u.id;
      ctx.fillStyle = isSelected
        ? "#eab308"
        : u.type === "drone"
          ? "#2563eb"
          : u.type === "team"
            ? "#059669"
            : "#ca8a04";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(currentProj.x, currentProj.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw simple human or drone indicator lines inside the node
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (u.type === "drone") {
        // wing line
        ctx.moveTo(currentProj.x - 4, currentProj.y);
        ctx.lineTo(currentProj.x + 4, currentProj.y);
        ctx.moveTo(currentProj.x, currentProj.y - 3);
        ctx.lineTo(currentProj.x, currentProj.y + 4);
      } else {
        // person head/shoulders
        ctx.arc(currentProj.x, currentProj.y - 1.5, 1.5, 0, Math.PI * 2);
      }
      ctx.stroke();

      // Draw floating text label
      ctx.fillStyle = highContrast ? "#facc15" : "#f1f5f9";
      ctx.font = "bold 9px Inter, system-ui, sans-serif";
      const labelText = u.name;
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 4;
      ctx.fillText(labelText, currentProj.x + 10, currentProj.y + 3);
      ctx.shadowBlur = 0; // reset
    });

    // Draw Mini-Map in bottom right corner
    const miniWidth = 90;
    const miniHeight = 65;
    const miniX = width - miniWidth - 10;
    const miniY = height - miniHeight - 10;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.fillRect(miniX, miniY, miniWidth, miniHeight);
    ctx.strokeRect(miniX, miniY, miniWidth, miniHeight);

    // Draw very tiny map landmarks inside mini-map
    ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
    tacticalUnits.forEach((u) => {
      const relLat = (u.location.lat - startLat) / (endLat - startLat);
      const relLng = (u.location.lng - startLng) / (endLng - startLng);
      const muX = miniX + relLng * miniWidth;
      const muY = miniY + (1 - relLat) * miniHeight;
      ctx.beginPath();
      ctx.arc(muX, muY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [mapZoom, mapPan, mapRotation, mapTilt, mapLayer, heatmapEnabled, geofenceEnabled, selectedUnitId, isRulerActive, rulerPoints, cursorCoords, tacticalUnits, filterStatus]);

  // Handle map interaction inputs (Zoom with wheel, click/drag to Pan)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setMapZoom((z) => Math.max(0.6, Math.min(3.5, z * zoomFactor)));
    playTacticalBeep("click");
  };

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) return; // Right click handles context menu
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - mapPan.x, y: e.clientY - mapPan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Inverse projection to show lat/lng coords on cursor
    const startLat = 26.85;
    const endLat = 27.25;
    const startLng = 88.20;
    const endLng = 88.65;
    const centerLat = 27.0375;
    const centerLng = 88.4236;
    const latScale = 14000 * mapZoom;
    const lngScale = 14000 * Math.cos((centerLat * Math.PI) / 180) * mapZoom;

    // Center translation reverse
    const tx = screenX - canvas.width / 2 - mapPan.x;
    const ty = (screenY - canvas.height / 2 - mapPan.y) / Math.cos(mapTilt * (Math.PI / 180));

    // Inverse rotation
    const cosR = Math.cos(-mapRotation);
    const sinR = Math.sin(-mapRotation);
    const rx = tx * cosR - ty * sinR;
    const ry = tx * sinR + ty * cosR;

    const computedLng = rx / lngScale + centerLng;
    const computedLat = centerLat - ry / latScale;

    setCursorCoords({ lat: computedLat, lng: computedLng });

    if (!isDraggingRef.current) return;
    setMapPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDraggingRef.current = false;
  };

  const handleMapClick = (e: React.MouseEvent) => {
    // Check if clicked near any unit to select them
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Helper projection matcher
    const centerLat = 27.0375;
    const centerLng = 88.4236;
    const latScale = 14000 * mapZoom;
    const lngScale = 14000 * Math.cos((centerLat * Math.PI) / 180) * mapZoom;

    let clickedUnitId: string | null = null;

    tacticalUnits.forEach((u) => {
      let dx = (u.location.lng - centerLng) * lngScale;
      let dy = (centerLat - u.location.lat) * latScale;
      const cosR = Math.cos(mapRotation);
      const sinR = Math.sin(mapRotation);
      const rx = dx * cosR - dy * sinR;
      const ry = dx * sinR + dy * cosR;
      const screenX = rx + canvas.width / 2 + mapPan.x;
      const screenY = ry * Math.cos(mapTilt * (Math.PI / 180)) + canvas.height / 2 + mapPan.y;

      const dist = Math.sqrt((clickX - screenX) * (clickX - screenX) + (clickY - screenY) * (clickY - screenY));
      if (dist < 12) {
        clickedUnitId = u.id;
      }
    });

    if (clickedUnitId) {
      setSelectedUnitId(clickedUnitId);
      playTacticalBeep("click");
    } else {
      if (isRulerActive) {
        if (rulerPoints.length >= 2) {
          setRulerPoints([cursorCoords]);
        } else {
          setRulerPoints([...rulerPoints, cursorCoords]);
        }
        playTacticalBeep("click");
      } else {
        setSelectedUnitId(null);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setContextMenu({
      x,
      y,
      lat: cursorCoords.lat,
      lng: cursorCoords.lng
    });
    playTacticalBeep("alert");
  };

  // Dispatch new mission via context menu or form
  const handleCreateMission = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMissionTitle.trim()) return;

    const newM: MissionLog = {
      id: `MSN-${Math.floor(100 + Math.random() * 900)}`,
      title: newMissionTitle,
      status: "Active",
      priority: "High",
      assignedUnit: "Unassigned",
      progress: 0
    };

    setMissionsList([newM, ...missionsList]);
    setNewMissionTitle("");
    addToast(`Mission ${newM.id} initialized successfully.`, "success");
    playTacticalBeep("deploy");
  };

  // Perform fully functional one-click resource deployment
  const handleDeployConfirm = () => {
    const deploymentId = `unit-${Math.floor(1000 + Math.random() * 9000)}`;
    const unitNamesMap: Record<string, string> = {
      team: "Tactical Guard",
      drone: "Recon Hawk",
      k9: "Rescue Patrol",
      medical: "Med-Unit",
      police: "Local Escort",
      volunteer: "Vol-Team"
    };

    const newUnit: TacticalUnit = {
      id: deploymentId,
      name: `${unitNamesMap[deployType]} ${unitsRef.current.length + 1}`,
      type: deployType,
      status: "En Route",
      location: { lat: 26.92 + Math.random() * 0.1, lng: 88.30 + Math.random() * 0.1 },
      target: { lat: 27.05 + Math.random() * 0.1, lng: 88.40 + Math.random() * 0.1 },
      battery: 100,
      speed: deployType === "drone" ? 48.0 : 12.0,
      heading: "000° N",
      altitude: deployType === "drone" ? 150 : 0,
      signal: 100,
      gpsAccuracy: 0.9,
      distanceCovered: 0,
      missionProgress: 0,
      healthStatus: "Operational - Deployment Init",
      eta: "12 mins",
      trail: []
    };

    const nextList = [...unitsRef.current, newUnit];
    unitsRef.current = nextList;
    setTacticalUnits(nextList);

    // Dynamic countdown logs update in communications window
    const timestamp = new Date().toTimeString().split(' ')[0];
    setChatMessages((c) => [
      ...c,
      {
        id: Math.random().toString(),
        sender: "Base",
        text: `⚠️ DEPLOYED: ${newUnit.name} dispatched to ${deployTargetSector} [Priority: ${deployPriority}]`,
        time: timestamp,
        type: "text"
      }
    ]);

    addToast(`Successfully dispatched ${newUnit.name} to ${deployTargetSector}.`, "success");
    playTacticalBeep("deploy");
  };

  // Send message to communications chat
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const timestamp = new Date().toTimeString().split(' ')[0];
    const newMsg = {
      id: Math.random().toString(),
      sender: "Commander Rajesh",
      text: chatInput,
      time: timestamp,
      type: "text" as const
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    playTacticalBeep("comms");

    // Simulate real-time response from ground team
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const respTimestamp = new Date().toTimeString().split(' ')[0];
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "Team Alpha",
          text: `Acknowledged, Commander. Adjusting search vector now.`,
          time: respTimestamp,
          type: "text" as const
        }
      ]);
      playTacticalBeep("comms");
    }, 1500);
  };

  // Voice Speech simulated typing transceiver
  const handleToggleRadio = () => {
    if (isRadioListening) {
      setIsRadioListening(false);
    } else {
      setIsRadioListening(true);
      playTacticalBeep("alert");
      setTimeout(() => {
        // Automatically transcribe speech simulation
        const timestamp = new Date().toTimeString().split(' ')[0];
        setChatMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "Volunteer Rescuer",
            text: `[RADIO TRANSCRIPT] Foothills cleared. Zero active flooding anomalies located here. Moving to base camp-C.`,
            time: timestamp,
            type: "text"
          }
        ]);
        setIsRadioListening(false);
        playTacticalBeep("comms");
      }, 3500);
    }
  };

  // Floating AI recommendation query processing connecting straight to Gemini proxy api
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAiQuery.trim()) return;

    const userQ = customAiQuery;
    setCustomAiQuery("");
    
    // Add pending log
    const entryId = Math.random().toString();
    setAiQueries((q) => [...q, { query: userQ, response: "", isLoading: true }]);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are Command AI. Give tactical advice on: "${userQ}". Keep the response short, clear, and action-oriented. Reference latitude/longitude grids or terrain if appropriate. Keep it to 3 highly operational bullets.`
            }
          ]
        })
      });
      const data = await res.json();
      const aiResponseText = data.text || "DOWNLINK TIMEOUT. Standard response generated: Mobilize airborne asset to clear high-density areas. Local safety guidelines must be strictly enforced.";
      
      setAiQueries((queries) =>
        queries.map((q) => (q.query === userQ ? { ...q, response: aiResponseText, isLoading: false } : q))
      );
      playTacticalBeep("comms");
    } catch (err) {
      setAiQueries((queries) =>
        queries.map((q) => (q.query === userQ ? { ...q, response: "Downlink offline. Relocate base stations to clear atmospheric radar interference.", isLoading: false } : q))
      );
    }
  };

  // Draw Drone Thermal Scanner feed at 15 FPS
  useEffect(() => {
    if (rightTab !== "comms") return;
    const canvas = thermalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scanLineY = 0;

    // Generate simulated thermal heat signatures
    const heatTargets = [
      { x: 40, y: 35, size: 6, vx: 0.2, vy: 0.1 },
      { x: 140, y: 65, size: 4, vx: -0.1, vy: 0.3 },
      { x: 90, y: 95, size: 8, vx: 0.1, vy: -0.2 }
    ];

    const drawThermal = () => {
      // Dark green scan screen
      ctx.fillStyle = "#011c0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial camera view boundary
      const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, canvas.width/1.4);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0)");
      gradient.addColorStop(0.8, "rgba(16, 185, 129, 0.08)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal raster static lines
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw moving thermal heat blobs (white-hot with green outlines)
      heatTargets.forEach((t) => {
        // Move blobs slowly
        t.x += t.vx;
        t.y += t.vy;
        if (t.x < 10 || t.x > canvas.width - 10) t.vx *= -1;
        if (t.y < 10 || t.y > canvas.height - 10) t.vy *= -1;

        // Glowing radial white gradient
        const radGrad = ctx.createRadialGradient(t.x, t.y, 1, t.x, t.y, t.size * 2);
        radGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        radGrad.addColorStop(0.3, "rgba(253, 224, 71, 0.8)"); // yellow transition
        radGrad.addColorStop(0.7, "rgba(239, 68, 68, 0.45)"); // red flare
        radGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Scrolling Scanline bar
      scanLineY = (scanLineY + 1.2) % canvas.height;
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(canvas.width, scanLineY);
      ctx.stroke();

      // Camera tele HUD text
      ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
      ctx.font = "bold 8px monospace";
      ctx.fillText("IR SCAN: COMPL-v2", 10, 15);
      ctx.fillText("AGC: ON", 10, 25);
      ctx.fillText("ZOOM: 4.5X", canvas.width - 65, 15);

      // Blinking red recording point
      if (Math.floor(Date.now() / 600) % 2 === 0) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(canvas.width - 15, 22, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
        ctx.fillText("REC", canvas.width - 33, 25);
      }

      animId = requestAnimationFrame(drawThermal);
    };

    animId = requestAnimationFrame(drawThermal);
    return () => cancelAnimationFrame(animId);
  }, [rightTab]);

  // Selected Unit context
  const activeUnit = tacticalUnits.find((u) => u.id === selectedUnitId) || tacticalUnits[0];

  return (
    <div className={`flex flex-col h-full animate-in fade-in duration-500 relative select-none ${highContrast ? "dark text-yellow-300" : ""}`}>
      {/* Title block */}
      <div className="flex justify-between items-center mb-5 z-10 relative">
        <div>
          <h2 className={`text-2xl font-black ${textMain} tracking-tight flex items-center gap-2`}>
            Team Command
          </h2>
          <p className={`text-xs uppercase tracking-widest ${textMuted} font-bold mt-0.5`}>
            Personnel Coordination Center
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Audio volume switch */}
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              playTacticalBeep("click");
            }}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
              audioEnabled ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-gray-100 border-gray-200 text-gray-500"
            }`}
            title="Toggle Tactical Audio Feedback"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 relative z-10">
        
        {/* Left Card: Resources & Missions Management (Expanded Tabs) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} flex flex-col h-[460px] overflow-hidden`}>
            
            {/* Expanded Tab Switches */}
            <div className="flex border-b border-gray-100 dark:border-stone-800 pb-2 mb-3 justify-between">
              <button
                onClick={() => { setLeftTab("resources"); playTacticalBeep("click"); }}
                className={`text-xs font-black uppercase tracking-wider pb-1 transition-colors ${
                  leftTab === "resources" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => { setLeftTab("missions"); playTacticalBeep("click"); }}
                className={`text-xs font-black uppercase tracking-wider pb-1 transition-colors ${
                  leftTab === "missions" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Missions
              </button>
              <button
                onClick={() => { setLeftTab("intel"); playTacticalBeep("click"); }}
                className={`text-xs font-black uppercase tracking-wider pb-1 transition-colors ${
                  leftTab === "intel" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Mission AI
              </button>
            </div>

            {/* Tab contents */}
            {leftTab === "resources" && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3 flex items-center gap-2`}>
                    <Shield className="w-3.5 h-3.5" /> Filter by Unit Status
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Ready", count: tacticalUnits.filter((u) => u.status === "Ready").length, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/25" },
                      { label: "On Mission", count: tacticalUnits.filter((u) => u.status === "On Mission").length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/25" },
                      { label: "En Route", count: tacticalUnits.filter((u) => u.status === "En Route").length, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/25" },
                      { label: "Standby", count: tacticalUnits.filter((u) => u.status === "Standby").length, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/25" },
                      { label: "Offline", count: tacticalUnits.filter((u) => u.status === "Offline").length, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/25" },
                    ].map((st) => (
                      <button
                        key={st.label}
                        onClick={() => {
                          setFilterStatus(filterStatus === st.label ? null : st.label);
                          playTacticalBeep("click");
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${st.bg} ${
                          filterStatus === st.label ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${st.color.replace("text-", "bg-")}`}></span>
                          <span className={`text-[11px] font-bold ${st.color}`}>{st.label}</span>
                        </div>
                        <span className={`text-xs font-black ${textMain}`}>{st.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tactical unit mini directory list */}
                <div className="border-t border-gray-100 dark:border-stone-800 pt-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-2 block`}>Unit Telemetries</span>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {tacticalUnits.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => { setSelectedUnitId(u.id); playTacticalBeep("click"); }}
                        className={`flex items-center justify-between p-1.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          selectedUnitId === u.id ? "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600" : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-gray-400">{u.speed}km/h</span>
                          <Battery className={`w-3.5 h-3.5 ${u.battery < 20 ? "text-red-500" : "text-emerald-500"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {leftTab === "missions" && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-2">
                  {missionsList.map((m) => (
                    <div key={m.id} className="p-2 border border-gray-100 dark:border-stone-800 rounded-lg bg-gray-50 dark:bg-stone-900/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gray-200 dark:bg-stone-800 text-gray-700 dark:text-gray-300">
                          {m.id}
                        </span>
                        <span className={`text-[9px] font-black uppercase ${
                          m.priority === "Critical" ? "text-red-500" : "text-amber-500"
                        }`}>
                          {m.priority}
                        </span>
                      </div>
                      <h5 className="text-[11px] font-bold text-gray-800 leading-snug">{m.title}</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">Assigned: {m.assignedUnit}</p>
                      
                      {/* Live search dynamic progress meter */}
                      <div className="w-full bg-gray-200 dark:bg-stone-800 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${m.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCreateMission} className="border-t border-gray-100 dark:border-stone-800 pt-3 flex gap-1">
                  <input
                    type="text"
                    value={newMissionTitle}
                    onChange={(e) => setNewMissionTitle(e.target.value)}
                    placeholder="New tactical search task..."
                    className="flex-1 text-[11px] outline-none px-2 py-1.5 border border-gray-200 dark:border-stone-800 rounded bg-transparent text-gray-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {leftTab === "intel" && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-2 text-[11px]">
                  {aiQueries.map((q, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/25 border border-purple-100 dark:border-purple-900/30">
                        <span className="font-extrabold text-purple-700 dark:text-purple-400">QUERY: </span>
                        <span className="text-gray-700 dark:text-gray-300">{q.query}</span>
                      </div>
                      <div className="p-2 rounded bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-800">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">AI DESTRUCTION ANALYSIS: </span>
                        {q.isLoading ? (
                          <span className="animate-pulse flex items-center gap-1.5 mt-1 text-gray-400">
                            <Zap className="w-3.5 h-3.5 animate-spin" /> Gathering GIS satellite downlink...
                          </span>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-1">{q.response}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskAI} className="border-t border-gray-100 dark:border-stone-800 pt-3 flex gap-1">
                  <input
                    type="text"
                    value={customAiQuery}
                    onChange={(e) => setCustomAiQuery(e.target.value)}
                    placeholder="Ask Command AI..."
                    className="flex-1 text-[11px] outline-none px-2 py-1.5 border border-purple-200 dark:border-stone-800 rounded bg-transparent text-gray-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

        {/* Center Card: Live GIS Tactical Tracker Map */}
        <div
          ref={mapContainerRef}
          className={`col-span-12 lg:col-span-6 p-1 rounded-xl border ${bgCard} relative overflow-hidden flex flex-col h-[460px] bg-slate-950 border-gray-200 shadow-sm`}
        >
          {/* Top GIS Map Layer Overlay HUD */}
          <div className="absolute top-3 left-3 z-20 flex gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-800">
            {[
              { id: "hybrid", label: "HYB" },
              { id: "satellite", label: "SAT" },
              { id: "terrain", label: "TER" },
              { id: "vector", label: "VEC" },
            ].map((lay) => (
              <button
                key={lay.id}
                onClick={() => { setMapLayer(lay.id as any); playTacticalBeep("click"); }}
                className={`px-2 py-1 text-[9px] font-black rounded transition-colors ${
                  mapLayer === lay.id ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {lay.label}
              </button>
            ))}
          </div>

          {/* Right Top GIS Controls HUD */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <button
              onClick={() => { setHeatmapEnabled(!heatmapEnabled); playTacticalBeep("click"); }}
              className={`px-2 py-1 bg-slate-900/80 border border-slate-800 text-[9px] font-black rounded flex items-center gap-1 transition-colors ${
                heatmapEnabled ? "text-rose-400 border-rose-500" : "text-gray-400"
              }`}
              title="Toggle Infrared Heatmap Overlay"
            >
              <Eye className="w-3 h-3" />
              HEAT
            </button>

            <button
              onClick={() => { setGeofenceEnabled(!geofenceEnabled); playTacticalBeep("click"); }}
              className={`px-2 py-1 bg-slate-900/80 border border-slate-800 text-[9px] font-black rounded flex items-center gap-1 transition-colors ${
                geofenceEnabled ? "text-amber-400 border-amber-500" : "text-gray-400"
              }`}
              title="Toggle Geofence Alerts"
            >
              <AlertTriangle className="w-3 h-3" />
              GEOFENCE
            </button>

            <button
              onClick={() => { setIsRulerActive(!isRulerActive); setRulerPoints([]); playTacticalBeep("click"); }}
              className={`px-2 py-1 bg-slate-900/80 border border-slate-800 text-[9px] font-black rounded flex items-center gap-1 transition-colors ${
                isRulerActive ? "text-purple-400 border-purple-500" : "text-gray-400"
              }`}
              title="Distance Ruler"
            >
              <Compass className="w-3 h-3" />
              RULER
            </button>
          </div>

          {/* Core WebGL-like GIS Interactive Canvas */}
          <canvas
            ref={mapCanvasRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleMapClick}
            onContextMenu={handleContextMenu}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* Left bottom rotation / tilt widget HUD */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-[10px] font-bold text-gray-400">
            <div className="flex gap-1.5 border-r border-slate-800 pr-2 mr-2">
              <button onClick={() => { setMapRotation((r) => r + 0.15); playTacticalBeep("click"); }} className="hover:text-white" title="Rotate Clockwise">↻</button>
              <button onClick={() => { setMapRotation((r) => r - 0.15); playTacticalBeep("click"); }} className="hover:text-white" title="Rotate Counter-Clockwise">↺</button>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => { setMapTilt((t) => Math.min(60, t + 5)); playTacticalBeep("click"); }} className="hover:text-white" title="Tilt Up">▲ TILT</button>
              <button onClick={() => { setMapTilt((t) => Math.max(0, t - 5)); playTacticalBeep("click"); }} className="hover:text-white" title="Tilt Down">▼ TILT</button>
            </div>
          </div>

          {/* Bottom Live Coordinate Display and Zoom Controls */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-[9px] font-mono font-bold text-emerald-400">
              CURSOR: {cursorCoords.lat.toFixed(4)}° N, {cursorCoords.lng.toFixed(4)}° E
            </span>
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={() => { setMapZoom((z) => Math.max(0.6, z - 0.2)); playTacticalBeep("click"); }}
                className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center rounded"
              >
                -
              </button>
              <button
                onClick={() => { setMapZoom((z) => Math.min(3.5, z + 0.2)); playTacticalBeep("click"); }}
                className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* Right-click custom waypoint context menu */}
          {contextMenu && (
            <div
              className="absolute z-50 bg-slate-900 text-white border border-slate-800 shadow-2xl rounded-lg p-2.5 text-[10px] font-bold w-44"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onMouseLeave={() => setContextMenu(null)}
            >
              <div className="border-b border-slate-800 pb-1 mb-1.5 text-gray-400 truncate">
                COORD: {contextMenu.lat.toFixed(4)}N, {contextMenu.lng.toFixed(4)}E
              </div>
              <button
                onClick={() => {
                  setMissionsList((prev) => [
                    { id: `MSN-${Math.floor(100 + Math.random()*900)}`, title: `Waypoint check in Sector 4`, status: "Active", priority: "High", assignedUnit: "Unassigned", progress: 0 },
                    ...prev
                  ]);
                  addToast("Active Waypoint dispatched to search logs.", "success");
                  setContextMenu(null);
                  playTacticalBeep("deploy");
                }}
                className="w-full text-left py-1 hover:bg-slate-800 px-1.5 rounded text-emerald-400 transition-colors"
              >
                🎯 DISPATCH WAYPOINT HERE
              </button>
              <button
                onClick={() => {
                  addToast("Hazards zone logged in tactical overlay.", "warning");
                  setContextMenu(null);
                  playTacticalBeep("alert");
                }}
                className="w-full text-left py-1 hover:bg-slate-800 px-1.5 rounded text-rose-400 transition-colors"
              >
                ⚠️ LOCK HAZARD AREA
              </button>
            </div>
          )}
        </div>

        {/* Right Card: Telemetry stats, thermal stream feed & comms */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} flex flex-col h-[460px] overflow-hidden`}>
            
            {/* Extended Right Tab Switches */}
            <div className="flex border-b border-gray-100 dark:border-stone-800 pb-2 mb-3 justify-between">
              <button
                onClick={() => { setRightTab("status"); playTacticalBeep("click"); }}
                className={`text-xs font-black uppercase tracking-wider pb-1 transition-colors ${
                  rightTab === "status" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => { setRightTab("telemetry"); playTacticalBeep("click"); }}
                className={`text-xs font-black uppercase tracking-wider pb-1 transition-colors ${
                  rightTab === "telemetry" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Diagnostics
              </button>
              <button
                onClick={() => { setRightTab("comms"); playTacticalBeep("click"); }}
                className={`text-xs font-black uppercase tracking-wider pb-1 transition-colors ${
                  rightTab === "comms" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Comms Desk
              </button>
            </div>

            {/* Tab contents */}
            {rightTab === "status" && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-3.5">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} flex items-center gap-2`}>
                    <Activity className="w-4 h-4 text-emerald-600" /> Selected Unit HUD
                  </h4>

                  <div className="p-3 bg-gray-50 dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-emerald-600 uppercase">{activeUnit?.name}</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {activeUnit?.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2.5 text-[10px] font-bold text-gray-500">
                      <div>SPEED: <span className="text-gray-800 dark:text-yellow-300">{activeUnit?.speed} km/h</span></div>
                      <div>HEADING: <span className="text-gray-800 dark:text-yellow-300">{activeUnit?.heading}</span></div>
                      <div>ALTITUDE: <span className="text-gray-800 dark:text-yellow-300">{activeUnit?.altitude}m</span></div>
                      <div>SIGNAL: <span className="text-gray-800 dark:text-yellow-300">{activeUnit?.signal}%</span></div>
                      <div>ACCURACY: <span className="text-gray-800 dark:text-yellow-300">±{activeUnit?.gpsAccuracy}m</span></div>
                      <div>ETA: <span className="text-gray-800 dark:text-yellow-300">{activeUnit?.eta}</span></div>
                    </div>
                  </div>

                  {/* High precision telemetry progress meters */}
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1 flex justify-between`}>
                      <span>Battery Levels</span>
                      <span className="text-emerald-500">{activeUnit?.battery}%</span>
                    </span>
                    <div className={`w-full rounded-full h-1.5 mb-2 ${highContrast ? "bg-stone-800" : "bg-gray-200"}`}>
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${activeUnit?.battery}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1 flex justify-between`}>
                      <span>Fuel / Ground Status</span>
                      <span className="text-amber-500">82%</span>
                    </span>
                    <div className={`w-full rounded-full h-1.5 mb-2 ${highContrast ? "bg-stone-800" : "bg-gray-200"}`}>
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `82%` }}></div>
                    </div>
                  </div>
                </div>

                {/* KPI bottom blocks strictly matching user screen design */}
                <div className="grid grid-cols-2 gap-2 mt-3.5 border-t border-gray-100 dark:border-stone-800 pt-3">
                  <div className={`p-2.5 rounded-lg text-center border ${highContrast ? "bg-stone-800 border-stone-700" : "bg-gray-50 border-gray-150"}`}>
                    <Users className={`w-4 h-4 mx-auto mb-1 ${textMain}`} />
                    <span className={`text-base font-black ${textMain} block`}>
                      {kpis.officersDeployed || 12}
                    </span>
                    <span className={`text-[8px] uppercase tracking-wider font-extrabold ${textMuted}`}>
                      Personnel
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-lg text-center border ${highContrast ? "bg-stone-800 border-stone-700" : "bg-gray-50 border-gray-150"}`}>
                    <Navigation className={`w-4 h-4 mx-auto mb-1 ${textMain}`} />
                    <span className={`text-base font-black ${textMain} block`}>
                      {kpis.searchRadiusKm || 23}<span className="text-xs">km</span>
                    </span>
                    <span className={`text-[8px] uppercase tracking-wider font-extrabold ${textMuted}`}>
                      Coverage
                    </span>
                  </div>
                </div>
              </div>
            )}

            {rightTab === "telemetry" && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4 text-[11px] font-bold">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} flex items-center gap-2 mb-2`}>
                    <Sliders className="w-4 h-4 text-emerald-600" /> Diagnostic Downlink
                  </h4>

                  <div className="space-y-3">
                    <div className="p-2 border border-gray-100 dark:border-stone-800 bg-gray-50 dark:bg-stone-900 rounded">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>SYS DIAGNOSTIC</span>
                        <span className="text-emerald-500">STABLE</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 leading-normal">{activeUnit?.healthStatus}</div>
                    </div>

                    <div className="p-2 border border-gray-100 dark:border-stone-800 bg-gray-50 dark:bg-stone-900 rounded">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>SIGNAL DECIBEL</span>
                        <span className="text-blue-500">98 dBm</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Signal className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">Carrier Transceiver link: OPTIMAL</span>
                      </div>
                    </div>

                    <div className="p-2 border border-gray-100 dark:border-stone-800 bg-gray-50 dark:bg-stone-900 rounded">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>WEATHER TELEMETRY</span>
                        <span className="text-rose-500">CONVECTIVE</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Wind className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-gray-700 dark:text-gray-300">Heavy rain bands expected near sector line.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {rightTab === "comms" && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                
                {/* Live Infrared Scan Thermal Camera canvas feed */}
                <div className="mb-2.5 rounded-lg overflow-hidden border border-emerald-900 bg-black">
                  <span className="text-[8px] font-black text-emerald-500 p-1 block border-b border-emerald-950 uppercase tracking-widest bg-emerald-950/40">
                    Live Drone Camera Scan [Thermal IR]
                  </span>
                  <canvas ref={thermalCanvasRef} width={220} height={100} className="w-full h-[100px] block" />
                </div>

                {/* Comms Logs list */}
                <div className="flex-1 overflow-y-auto space-y-2 mb-2 max-h-36 pr-1 text-[10px] font-bold font-mono">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="border-b border-gray-50 dark:border-stone-800 pb-1.5">
                      <div className="flex justify-between text-gray-400 mb-0.5">
                        <span className="text-emerald-500">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">{msg.text}</div>
                    </div>
                  ))}
                  {isTyping && <div className="text-gray-400 animate-pulse italic">Team Alpha typing transcript...</div>}
                </div>

                {/* Audio voice radio push trigger */}
                <div className="flex gap-1.5 border-t border-gray-100 dark:border-stone-800 pt-2">
                  <button
                    onClick={handleToggleRadio}
                    className={`p-1.5 rounded transition-all flex items-center justify-center shrink-0 ${
                      isRadioListening ? "bg-red-600 text-white animate-pulse" : "bg-gray-100 dark:bg-stone-900 text-gray-500 hover:text-red-500"
                    }`}
                    title="Activate Transceiver Speech Simulation"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <form onSubmit={handleSendChat} className="flex-1 flex gap-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Transmission text..."
                      className="flex-1 text-[10px] outline-none border border-gray-200 dark:border-stone-800 rounded px-1.5 py-1.5 bg-transparent text-gray-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center justify-center transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Bottom: Interactive Deployment Planner strictly matching user design styling */}
      <div
        className={`mt-4 p-4 rounded-xl ${darkGreenCard} flex flex-col xl:flex-row items-center justify-between shadow-lg relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10 mb-4 xl:mb-0 w-full xl:w-auto">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30 shrink-0">
            <Users className="w-5 h-5 text-emerald-300 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Tactical Deployment planner console
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-black text-emerald-100">Deploy Unit Type:</span>
              <select
                value={deployType}
                onChange={(e) => { setDeployType(e.target.value as any); playTacticalBeep("click"); }}
                className="bg-emerald-800/90 text-yellow-300 border border-emerald-600 rounded px-2 py-0.5 text-xs outline-none font-bold font-mono cursor-pointer"
              >
                <option value="team">Team Ground Unit</option>
                <option value="drone">Recon Air Drone</option>
                <option value="k9">K9 Rescue Patrol</option>
                <option value="medical">Medical First-Aid</option>
                <option value="police">Police Escort Grid</option>
                <option value="volunteer">Volunteer Searchers</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap xl:flex-nowrap gap-5 xl:gap-6 relative z-10 w-full xl:w-auto justify-between xl:justify-end items-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Estimated Arrival (ETA)
            </span>
            <span className="text-sm font-bold text-yellow-300">
              {deployType === "drone" ? "4 mins" : "12 mins"}
            </span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden xl:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Projected Sector Coverage
            </span>
            <span className="text-sm font-bold text-emerald-300">
              {deployType === "drone" ? "92%" : "85%"}
            </span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden xl:block"></div>
          <button
            onClick={handleDeployConfirm}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-xs transition-colors self-center flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Confirm Deployment
          </button>
        </div>
      </div>
    </div>
  );
}
