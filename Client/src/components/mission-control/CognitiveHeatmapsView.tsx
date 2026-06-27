import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Map,
  CheckCircle2,
  Shield,
  AlertTriangle,
  Target,
  Navigation,
  Eye,
  Crosshair,
  Search,
  Filter,
  Plus,
  Save,
  Clock,
  Users,
  Play,
  Pause,
  Download,
  ChevronRight,
  FileDown,
  Share2,
  Compass,
  Radio,
  Activity,
  Send,
  Trash2,
  Edit,
  Sliders,
  Moon,
  Sun,
  Wind,
  Cloud,
  MapPin,
  ChevronDown,
  Check,
  Zap,
  Info,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";
import { useToastStore, useMissionStore } from "../../lib/store";
import { useApiStore } from "../../lib/apiStore";
import { useMissionStore as useLocalMissionStore } from "../../lib/missionStore";

// Types
interface CaseRecord {
  id: string;
  name: string;
  guardian: string;
  missionId: string;
  coords: { x: number; y: number };
  gpsLabel: string;
  region: string;
  incidentType: string;
  searchZone: string;
  officer: string;
  lastSeenTime: string;
  defaultProfile: string;
}

interface Landmark {
  name: string;
  type: "Safe Zone" | "Danger Area" | "Attraction Point";
  x: number;
  y: number;
}

interface SearchTeam {
  id: string;
  name: string;
  type: "Drone" | "Police" | "NGO";
  x: number;
  y: number;
  color: string;
  status: string;
  assignedZone?: string;
}

interface CustomParams {
  age: number;
  gender: string;
  mobility: string;
  disability: string;
  behavior: string;
  communication: string;
  fear: string;
  favoriteLocation: string;
  speed: number;
  riskLevel: string;
  weather: string;
  terrain: string;
  dayNight: string;
}

// Dynamic cases registry will be generated inside the component

const LANDMARKS: Landmark[] = [
  { name: "Sankalp Safe Shelter", type: "Safe Zone", x: 800, y: 400 },
  { name: "Abhaya Quiet Center", type: "Safe Zone", x: 580, y: 580 },
  { name: "Deep Water Canal", type: "Danger Area", x: 320, y: 250 },
  { name: "Highway Interchange", type: "Danger Area", x: 120, y: 200 },
  { name: "Railway Station Hub", type: "Attraction Point", x: 180, y: 750 },
  { name: "Central Park Playground", type: "Attraction Point", x: 550, y: 550 },
];

export default function CognitiveHeatmapsView({ highContrast }: { highContrast?: boolean }) {
  const { addToast } = useToastStore();

  const { children } = useApiStore();
  const { teams } = useLocalMissionStore();

  const casesRegistry = React.useMemo(() => {
    return children.filter(c => c.status === "Missing").map(c => ({
      id: c.id || "CASE-000",
      name: c.name || "Unknown",
      guardian: c.guardianName || "Unknown",
      missionId: "MSN-XXX",
      coords: { x: 500 + (Math.random()*40-20), y: 500 + (Math.random()*40-20) }, // Approximate mapped coords
      gpsLabel: c.lastSeenLocation || "Unknown",
      region: "Sector",
      incidentType: c.status || "Missing",
      searchZone: "Zone",
      officer: "Officer",
      lastSeenTime: c.lastSeenDate ? new Date(c.lastSeenDate).toLocaleDateString() : "Unknown",
      defaultProfile: "Runaway"
    }));
  }, [children]);

  // State managers
  const [activeProfile, setActiveProfile] = useState<string>("Autism");
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);

  useEffect(() => {
    if (casesRegistry.length > 0 && !selectedCase) {
      setSelectedCase(casesRegistry[0]);
    }
  }, [casesRegistry, selectedCase]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(["CASE-9481", "Aarav Sharma", "Indore Sector 4"]);
  const [savedSearches, setSavedSearches] = useState<string[]>(["High Risk Runaways", "Railway Sector-4 Grid"]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter criteria
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterIncident, setFilterIncident] = useState("All");

  // Custom behavior profile parameters
  const [customParams, setCustomParams] = useState<CustomParams>({
    age: 8,
    gender: "Male",
    mobility: "High",
    disability: "Cognitive spectrum",
    behavior: "Attracted to moving trains",
    communication: "Non-verbal",
    fear: "Loud sirens & uniform",
    favoriteLocation: "Train engine rooms",
    speed: 3.5,
    riskLevel: "High",
    weather: "Overcast with mild rain",
    terrain: "Railside grid",
    dayNight: "Day Patrol",
  });

  // Layer Toggles
  const [layers, setLayers] = useState({
    heatmap: true,
    radius: true,
    predictedPath: true,
    landmarks: true,
    activeUnits: true,
    movementTrails: true,
    terrain: true,
  });

  // Canvas interactive offsets
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(0.85);
  const [panX, setPanX] = useState(60);
  const [panY, setPanY] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastSeen, setLastSeen] = useState({ x: 500, y: 500 });
  const [isDraggingMarker, setIsDraggingMarker] = useState(false);

  // Drawing tools
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnZones, setDrawnZones] = useState<{ x: number; y: number; radius: number; label: string }[]>([]);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);

  // Real-time Event simulation
  const [simulationTime, setSimulationTime] = useState(0); // 0 to 100% along path
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 4x

  // Search teams deployments mapped from dynamic store
  const searchTeams = React.useMemo<SearchTeam[]>(() => {
    return teams.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type === "drone" ? "Drone" : "Police",
      x: 300 + (t.location.lat % 1) * 1000,
      y: 300 + (t.location.lng % 1) * 1000,
      color: t.type === "drone" ? "#06b6d4" : "#ef4444",
      status: t.status,
    }));
  }, [teams]);

  // Timeline real-time feeds
  const [timeline, setTimeline] = useState([
    { time: "09:15 AM", event: "Biometric database sync flagged railway transit logs", category: "System" },
    { time: "10:30 AM", event: "Volunteer group Gamma established field base", category: "Unit" },
    { time: "11:00 AM", event: "Drone Delta-1 dispatched for thermal riverbank scan", category: "AI" },
  ]);

  // Officer Collaboration log
  const [comments, setComments] = useState<string[]>([
    "Officer Kavita Rao: Swept the north railway crossing corridor. Sighting unconfirmed.",
    "Command Dispatch: Local alerts broadcasted to state-wide nodal shelters.",
  ]);
  const [newComment, setNewComment] = useState("");

  // Theme support
  const bgCard = highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-white border-gray-200 shadow-sm text-gray-900";
  const bgPanel = highContrast ? "bg-stone-900 border-stone-850" : "bg-gray-50 border-gray-100";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-stone-400" : "text-gray-500 font-mono text-[11px]";
  const darkGreenCard = highContrast
    ? "bg-stone-900 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";
  const bgInput = highContrast ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-gray-50 border-gray-200 text-gray-850";
  const borderCard = highContrast ? "border-stone-850" : "border-gray-200";
  const borderSubtle = highContrast ? "border-stone-900" : "border-gray-150";
  const bgListItem = highContrast ? "hover:bg-stone-900 border-stone-900 text-stone-300" : "hover:bg-gray-50 border-gray-100 text-gray-800";
  const bgDropdown = highContrast ? "bg-stone-950 border-stone-850 text-stone-300" : "bg-white border-gray-200 text-gray-800 shadow-xl";

  // Search handler
  const executeSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);

    // Find case by name, ID, guardian, region, etc.
    const normalized = query.toLowerCase();
    const found = casesRegistry.find(
      (c) =>
        c.id.toLowerCase().includes(normalized) ||
        c.name.toLowerCase().includes(normalized) ||
        c.guardian.toLowerCase().includes(normalized) ||
        c.region.toLowerCase().includes(normalized) ||
        c.officer.toLowerCase().includes(normalized) ||
        c.searchZone.toLowerCase().includes(normalized)
    );

    if (found) {
      setSelectedCase(found);
      setLastSeen(found.coords);
      setActiveProfile(found.defaultProfile);
      addToast(`Case synchronized: ${found.name} (${found.id})`, "success");

      // Save search
      if (!recentSearches.includes(query) && query.trim() !== "") {
        setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
      }
    } else {
      // Check if coordinate query
      const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
      if (coordRegex.test(query)) {
        addToast("GPS search coordinates mapped directly to grid overlay", "info");
        setLastSeen({ x: 450, y: 450 });
      } else {
        addToast("No active cases matched search criteria. Showing general intelligence.", "warning");
      }
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        const searchInput = document.getElementById("main-search");
        searchInput?.focus();
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  // Sync simulation incrementor
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationTime((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            addToast("Search path simulation reached final target horizon", "info");
            return 100;
          }
          return prev + 1 * simulationSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  // Handle click sighting injection
  const triggerSighting = () => {
    if (!selectedCase) return;
    const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const eventText = `Verified citizen sighting: near ${selectedCase.searchZone}`;
    setTimeline((prev) => [{ time: newTime, event: eventText, category: "Unit" }, ...prev]);
    // shift last seen closer to a random zone
    setLastSeen((prev) => ({ x: prev.x + (Math.random() * 40 - 20), y: prev.y + (Math.random() * 40 - 20) }));
    addToast("New live sighting added! Recalculating AI grid indices.", "success");
  };

  // Profile data models
  const getSearchRadiusMeters = (profile: string) => {
    switch (profile) {
      case "Autism": return 120;
      case "ADHD": return 280;
      case "Toddler": return 60;
      case "Runaway": return 400;
      case "Special Needs": return 160;
      default: return customParams.speed * 45; // custom
    }
  };

  const getPredictedPathPoints = (profile: string) => {
    const start = lastSeen;
    switch (profile) {
      case "Autism":
        return [
          start,
          { x: start.x - 50, y: start.y - 60 },
          { x: start.x - 120, y: start.y - 140 },
          { x: 580, y: 580 }, // Abhaya quiet enclosure
        ];
      case "ADHD":
        return [
          start,
          { x: start.x + 80, y: start.y - 30 },
          { x: start.x - 40, y: start.y + 110 },
          { x: 550, y: 550 }, // Central park
        ];
      case "Toddler":
        return [
          start,
          { x: start.x + 10, y: start.y - 12 },
          { x: start.x + 20, y: start.y + 15 },
          { x: start.x + 15, y: start.y + 5 }, // tight cluster
        ];
      case "Runaway":
        return [
          start,
          { x: start.x - 80, y: start.y + 40 },
          { x: start.x - 180, y: start.y + 120 },
          { x: 180, y: 750 }, // Station Terminal
        ];
      case "Special Needs":
        return [
          start,
          { x: start.x + 90, y: start.y - 30 },
          { x: 800, y: 400 }, // Safe shelter
        ];
      default:
        // Build custom path towards designated target
        const targetX = customParams.favoriteLocation.includes("Train") ? 180 : 800;
        const targetY = customParams.favoriteLocation.includes("Train") ? 750 : 400;
        return [
          start,
          { x: (start.x + targetX) / 2, y: (start.y + targetY) / 2 },
          { x: targetX, y: targetY },
        ];
    }
  };

  const getHeatmapBlobs = (profile: string) => {
    const start = lastSeen;
    switch (profile) {
      case "Autism":
        return [
          { x: start.x - 40, y: start.y - 50, radius: 90, r: 168, g: 85, b: 247, intensity: 0.8 },
          { x: 320, y: 250, radius: 130, r: 59, g: 130, b: 246, intensity: 0.95 }, // deep water canal attraction
          { x: 580, y: 580, radius: 100, r: 16, g: 185, b: 129, intensity: 0.7 }, // safe enclosure
        ];
      case "ADHD":
        return [
          { x: start.x + 60, y: start.y - 20, radius: 120, r: 168, g: 85, b: 247, intensity: 0.65 },
          { x: 550, y: 550, radius: 140, r: 234, g: 179, b: 8, intensity: 0.8 }, // central park
          { x: 120, y: 200, radius: 130, r: 239, g: 68, b: 68, intensity: 0.6 }, // high danger highway
        ];
      case "Toddler":
        return [
          { x: start.x, y: start.y, radius: 70, r: 168, g: 85, b: 247, intensity: 0.98 }, // extremely tight
          { x: start.x + 15, y: start.y + 15, radius: 50, r: 239, g: 68, b: 68, intensity: 0.85 },
        ];
      case "Runaway":
        return [
          { x: start.x, y: start.y, radius: 100, r: 168, g: 85, b: 247, intensity: 0.5 },
          { x: 180, y: 750, radius: 180, r: 168, g: 85, b: 247, intensity: 0.95 }, // Station hub attraction
        ];
      case "Special Needs":
        return [
          { x: start.x, y: start.y, radius: 95, r: 168, g: 85, b: 247, intensity: 0.7 },
          { x: 800, y: 400, radius: 120, r: 16, g: 185, b: 129, intensity: 0.9 }, // shelter target
        ];
      default:
        // Custom heatmap based on variables
        const radius = customParams.speed * 40;
        const color = customParams.riskLevel === "Extreme" ? { r: 239, g: 68, b: 68 } : { r: 168, g: 85, b: 247 };
        return [
          { x: start.x, y: start.y, radius: radius, r: color.r, g: color.g, b: color.b, intensity: 0.85 },
        ];
    }
  };

  const getExplanationCards = (profile: string) => {
    switch (profile) {
      case "Autism":
        return [
          { icon: Crosshair, title: "Attracted to Water", text: "High probability sensory-seeking behavior near canals.", confidence: "94%", evidence: "Matched on 14 similar cases", reasoning: "Running water frequencies mask environmental anxiety overloads." },
          { icon: Shield, title: "Prefers Quiet Spaces", text: "Likely hiding in shadowed, non-trafficked enclosures.", confidence: "88%", evidence: "Thermal imagery archives", reasoning: "Averse to loud decibel ranges near active urban grids." },
          { icon: Eye, title: "Likely to Hide", text: "Avoids direct verbal engagement; seeks secure corners.", confidence: "91%", evidence: "Developmental record files", reasoning: "Sensory hyper-alertness triggers defensive cover behaviors." },
          { icon: AlertTriangle, title: "Avoids Crowded Areas", text: "Steers clear of transit lines and highway corridors.", confidence: "87%", evidence: "Sankalp GIS database", reasoning: "Crowded areas overload auditory processing capacities." },
        ];
      case "ADHD":
        return [
          { icon: Zap, title: "High Random Wander", text: "Erratic speed bursts and hyperactive pathing curves.", confidence: "74%", evidence: "CCTV tracking logs", reasoning: "Exploratory impulse triggers non-linear, unpredictable travel directions." },
          { icon: Map, title: "Attracted to Playgrounds", text: "Climbs tall slides, fences or bright billboard grids.", confidence: "82%", evidence: "Regional search metrics", reasoning: "High visual and vestibular stimulus attracts active play nodes." },
        ];
      case "Toddler":
        return [
          { icon: Target, title: "Very Limited Radius", text: "Cannot cover long travel distances; sits down quickly.", confidence: "95%", evidence: "Pediatric mobility charts", reasoning: "Physical stride limitation locks potential radius under 1km." },
          { icon: AlertTriangle, title: "High Water & Road Danger", text: "Draws near moving vehicles or water slides blindly.", confidence: "98%", evidence: "Critical incident annals", reasoning: "Inability to recognize physical risk parameters." },
        ];
      case "Runaway":
        return [
          { icon: Navigation, title: "Targeted Transit Flight", text: "Heads directly to bus, auto, and train terminals.", confidence: "90%", evidence: "Mission Vatsalya ledger", reasoning: "Intentional escape vectors seek transport interfaces early." },
          { icon: Shield, title: "Avoids Police Uniforms", text: "Slinks into tunnels or side paths when officers approach.", confidence: "85%", evidence: "NGO field report database", reasoning: "Fear of apprehension steers flight towards dark tracks." },
        ];
      case "Special Needs":
        return [
          { icon: Shield, title: "Drawn to Nurturing Nodes", text: "Seeks safe shelters, volunteers, or female helpers.", confidence: "84%", evidence: "Case study registries", reasoning: "Familiarity-seeking leads to friendly assistance units." },
          { icon: Clock, title: "Rapid Fatigue Risk", text: "Requires medical supplements or rest cycles in 6 hours.", confidence: "91%", evidence: "Hospital index metrics", reasoning: "Lower physical threshold demands quick intervention." },
        ];
      default:
        return [
          { icon: Sliders, title: "Custom Parameters Loaded", text: `Modeled: ${customParams.behavior}.`, confidence: "80%", evidence: "Dynamic AI weight matrix", reasoning: `Simulating tailored response for ${customParams.age}-year-old applicant.` },
        ];
    }
  };

  const getRecommendations = (profile: string) => {
    switch (profile) {
      case "Autism":
        return { team: "Deploy Team Bravo", action: "Prioritize River Zone", radius: "1.5 km", confidence: "91%" };
      case "ADHD":
        return { team: "Deploy Drone Squad", action: "Prioritize Central Park", radius: "4.0 km", confidence: "74%" };
      case "Toddler":
        return { team: "Mobilize Local Volunteers", action: "Sweep Immediate Yards", radius: "0.8 km", confidence: "95%" };
      case "Runaway":
        return { team: "Dispatch Railway Patrol", action: "Secure Transit Gates", radius: "6.0 km", confidence: "89%" };
      case "Special Needs":
        return { team: "Deploy Nodal Medical Team", action: "Verify Sanctuary Safe Shelters", radius: "2.2 km", confidence: "84%" };
      default:
        return { team: "Deploy Custom Task Force", action: `Secure ${customParams.favoriteLocation}`, radius: `${(customParams.speed * 1.5).toFixed(1)} km`, confidence: "82%" };
    }
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight || 450;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Drawing functions
    const draw = () => {
      ctx.fillStyle = highContrast ? "#0c0a09" : "#141416";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      // Grid Lines
      if (layers.terrain) {
        ctx.strokeStyle = highContrast ? "rgba(254, 240, 138, 0.08)" : "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        for (let x = -1000; x < 2000; x += 60) {
          ctx.beginPath(); ctx.moveTo(x, -1000); ctx.lineTo(x, 2000); ctx.stroke();
        }
        for (let y = -1000; y < 2000; y += 60) {
          ctx.beginPath(); ctx.moveTo(-1000, y); ctx.lineTo(2000, y); ctx.stroke();
        }

        // River / Water Canal
        ctx.strokeStyle = "rgba(59, 130, 246, 0.22)";
        ctx.lineWidth = 26;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(100, 250);
        ctx.bezierCurveTo(350, 270, 420, 180, 720, 220);
        ctx.stroke();

        // Railway Track
        ctx.strokeStyle = "rgba(120, 113, 108, 0.35)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(80, 800);
        ctx.lineTo(920, 310);
        ctx.stroke();
      }

      // Heatmap layer
      if (layers.heatmap) {
        const blobs = getHeatmapBlobs(activeProfile);
        blobs.forEach((b) => {
          const radial = ctx.createRadialGradient(b.x, b.y, 5, b.x, b.y, b.radius);
          const mult = 1 + 0.06 * Math.sin(Date.now() / 320);
          radial.addColorStop(0, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.intensity * 0.45})`);
          radial.addColorStop(0.4, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.intensity * 0.2})`);
          radial.addColorStop(1, `rgba(${b.r}, ${b.g}, ${b.b}, 0)`);
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * mult, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Search Radius Boundary
      if (layers.radius) {
        const rad = getSearchRadiusMeters(activeProfile) * 1.5;
        ctx.strokeStyle = highContrast ? "#eab308" : "#9333ea";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(lastSeen.x, lastSeen.y, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(147, 51, 234, 0.02)";
        ctx.fill();
      }

      // Predicted Paths
      if (layers.predictedPath) {
        const path = getPredictedPathPoints(activeProfile);
        if (path.length > 1) {
          ctx.strokeStyle = "rgba(147, 51, 234, 0.65)";
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Moving arrows along path
          const offset = (Date.now() / 30) % 30;
          ctx.strokeStyle = "#c084fc";
          ctx.lineWidth = 3;
          ctx.setLineDash([3, 27]);
          ctx.lineDashOffset = -offset;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // User drawn zones
      drawnZones.forEach((z) => {
        ctx.strokeStyle = "#eab308";
        ctx.fillStyle = "rgba(234, 179, 8, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(z.label, z.x, z.y - z.radius - 5);
      });

      // Landmarks
      if (layers.landmarks) {
        LANDMARKS.forEach((l) => {
          let col = "#3b82f6";
          if (l.type === "Safe Zone") col = "#10b981";
          if (l.type === "Danger Area") col = "#ef4444";

          ctx.fillStyle = col + "20";
          ctx.beginPath(); ctx.arc(l.x, l.y, 20, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(l.x, l.y, 6, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(l.x, l.y, 6, 0, Math.PI * 2); ctx.stroke();

          ctx.fillStyle = "#e2e8f0";
          ctx.font = "bold 9px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(l.name, l.x, l.y + 16);
        });
      }

      // Active units / teams
      if (layers.activeUnits) {
        searchTeams.forEach((team) => {
          const pulse = 1 + 0.1 * Math.sin(Date.now() / 200 + team.id.charCodeAt(0));
          ctx.fillStyle = team.color + "25";
          ctx.beginPath(); ctx.arc(team.x, team.y, 18 * pulse, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = team.color;
          ctx.beginPath(); ctx.arc(team.x, team.y, 6, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(team.x, team.y, 6, 0, Math.PI * 2); ctx.stroke();

          // Sweep cone for Drones
          if (team.type === "Drone") {
            const angle = (Date.now() / 1200) % (Math.PI * 2);
            ctx.fillStyle = "rgba(6, 182, 212, 0.05)";
            ctx.strokeStyle = "rgba(6, 182, 212, 0.18)";
            ctx.beginPath();
            ctx.moveTo(team.x, team.y);
            ctx.arc(team.x, team.y, 65, angle - 0.3, angle + 0.3);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
          }

          ctx.fillStyle = "#ffffff";
          ctx.font = "8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(team.name, team.x, team.y - 10);
        });
      }

      // Active simulation route positioning
      if (layers.movementTrails) {
        const pathPoints = getPredictedPathPoints(activeProfile);
        const ptIndex = Math.min(Math.floor((simulationTime / 100) * pathPoints.length), pathPoints.length - 1);
        const currentSimPos = pathPoints[ptIndex] || lastSeen;

        // Draw trail dots
        ctx.fillStyle = "rgba(168, 85, 247, 0.4)";
        for (let i = 0; i <= ptIndex; i++) {
          if (pathPoints[i]) {
            ctx.beginPath(); ctx.arc(pathPoints[i].x, pathPoints[i].y, 3.5, 0, Math.PI * 2); ctx.fill();
          }
        }

        // Active sweep point
        const activePulse = 1 + 0.15 * Math.sin(Date.now() / 150);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(currentSimPos.x, currentSimPos.y, 11 * activePulse, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(currentSimPos.x, currentSimPos.y, 4.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.fillText("SIMULATED TARGET", currentSimPos.x, currentSimPos.y - 15);
      } else {
        // Just standard Last Seen Marker
        const pulse = 1 + 0.1 * Math.sin(Date.now() / 250);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(lastSeen.x, lastSeen.y, 10 * pulse, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(lastSeen.x, lastSeen.y, 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("LAST SEEN POINT", lastSeen.x, lastSeen.y - 14);
      }

      // Live drawing shape feedback
      if (isDrawingMode && drawStart && drawCurrent) {
        const r = Math.sqrt(Math.pow(drawCurrent.x - drawStart.x, 2) + Math.pow(drawCurrent.y - drawStart.y, 2));
        ctx.strokeStyle = "#eab308";
        ctx.fillStyle = "rgba(234, 179, 8, 0.12)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(drawStart.x, drawStart.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    };

    let animationId: number;
    const tick = () => {
      draw();
      animationId = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(animationId);
  }, [zoom, panX, panY, activeProfile, lastSeen, layers, drawnZones, isDrawingMode, drawStart, drawCurrent, simulationTime, searchTeams]);

  // Map mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const mapX = (clickX - panX) / zoom;
    const mapY = (clickY - panY) / zoom;

    // Check click on Last Seen marker to allow dragging
    const distToMarker = Math.sqrt(Math.pow(mapX - lastSeen.x, 2) + Math.pow(mapY - lastSeen.y, 2));
    if (distToMarker < 20) {
      setIsDraggingMarker(true);
      return;
    }

    if (isDrawingMode) {
      setDrawStart({ x: mapX, y: mapY });
      setDrawCurrent({ x: mapX, y: mapY });
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingMarker) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      setLastSeen({
        x: Math.round((clickX - panX) / zoom),
        y: Math.round((clickY - panY) / zoom),
      });
      return;
    }

    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    } else if (isDrawingMode && drawStart) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      setDrawCurrent({
        x: (clickX - panX) / zoom,
        y: (clickY - panY) / zoom,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDraggingMarker) {
      setIsDraggingMarker(false);
      addToast("Last Seen benchmark moved. Recalculating route metrics.", "info");
    }
    setIsDragging(false);

    if (isDrawingMode && drawStart && drawCurrent) {
      const radius = Math.round(
        Math.sqrt(Math.pow(drawCurrent.x - drawStart.x, 2) + Math.pow(drawCurrent.y - drawStart.y, 2))
      );
      if (radius > 10) {
        const label = `Zone-${drawnZones.length + 1}`;
        setDrawnZones((prev) => [...prev, { x: drawStart.x, y: drawStart.y, radius, label }]);
        addToast(`Drawn tactical sector added: ${label}`, "success");
      }
      setDrawStart(null);
      setDrawCurrent(null);
      setIsDrawingMode(false);
    }
  };

  // Exporters
  const handleExportCSV = () => {
    const data = [
      ["Case ID", selectedCase.id],
      ["Name", selectedCase.name],
      ["Default Profile", activeProfile],
      ["Last Seen Coordinates (X, Y)", `${lastSeen.x}, ${lastSeen.y}`],
      ["Search Radius", getSearchRadiusMeters(activeProfile) + "m"],
      ["Calculated Risk Level", selectedCase.incidentType],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Abhaya_Cognitive_Report_${selectedCase.id}.csv`);
    document.body.appendChild(link);
    link.click();
    addToast("CSV Report downloaded successfully!", "success");
  };

  const handleExportPDF = () => {
    const reportText = `
ABHAYA COGNITIVE SEARCH INTELLIGENCE DOSSIER
============================================
CASE BENCHMARK: ${selectedCase.id}
CHILD NAME: ${selectedCase.name}
GUARDIAN: ${selectedCase.guardian}
INCIDENT PROFILE: ${activeProfile}
STATUS OF OPERATION: Active Field Search

AI SEARCH RADIUS: ${getSearchRadiusMeters(activeProfile)} meters
COGNITIVE BIAS LEVEL: High Sighting Propensity
LAST SEEN MATRIX COORDS: ${lastSeen.x}, ${lastSeen.y}

TACTICAL DEPLOYMENTS:
- Drone Delta-1 (Corridor Scan)
- State Rescue Team Alpha (Ground Patrol)
- Sankalp Volunteers C (Community Sweep)

COMPLIANCE AUDIT SIGN-OFF STATUS: Verified Secured Hashed Ledgers
    `;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Abhaya_CaseDossier_${selectedCase.id}.txt`;
    link.click();
    addToast("Dossier text archive generated!", "success");
  };

  const addOfficerComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setComments((prev) => [...prev, `Officer Sanjay Deshmukh: ${newComment}`]);
    setNewComment("");
    addToast("Comment logged in mission records.", "success");
  };

  const recommendations = getRecommendations(activeProfile);
  const explanations = getExplanationCards(activeProfile);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Top Section: Advanced Autocomplete Search and HUD Filters */}
      <div className="flex flex-col gap-3 mb-6 relative z-30">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Main Search Bar */}
          <div className="flex-1 relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${highContrast ? "text-stone-500" : "text-gray-400"}`} />
            <input
              id="main-search"
              type="text"
              placeholder="Search by Case ID, name, region, coordinates (e.g. 22.5726, 88.3639) or guardian... [Press / to focus]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && executeSearch(searchQuery)}
              className={`w-full text-sm border pl-10 pr-10 py-3 rounded-xl focus:outline-none transition-all font-sans ${bgInput}`}
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${highContrast ? "text-stone-500 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border ${bgDropdown} overflow-hidden z-50`}>
                {casesRegistry.filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.id.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => executeSearch(c.name)}
                    className={`w-full text-left p-3 ${bgListItem} flex items-center justify-between border-b last:border-b-0 transition-colors`}
                  >
                    <div>
                      <span className="block font-bold text-sm">{c.name}</span>
                      <span className="block text-[10px] uppercase text-gray-500 mt-0.5">{c.id} • {c.region}</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black dark:bg-purple-900/50 dark:text-purple-400">
                      {c.incidentType}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick HUD filter triggers */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                showAdvancedFilters
                  ? "bg-purple-100 border-purple-200 text-purple-700"
                  : highContrast
                  ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850"
                  : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>ADVANCED FILTERS</span>
            </button>
            <button
              onClick={triggerSighting}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/10 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>REPORT SIGHTING</span>
            </button>
          </div>
        </div>

        {/* Slidedown Filters Panel */}
        {showAdvancedFilters && (
          <div className={`p-4 border rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top duration-200 ${highContrast ? "bg-stone-950/90 border-stone-850 text-white" : "bg-white border-gray-200 shadow-lg text-gray-800"}`}>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Target Risk Range</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`}
              >
                <option value="All">All Risk Profiles</option>
                <option value="Extreme">Extreme Risk Only</option>
                <option value="High">High / Moderate Risk</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Incident Classification</label>
              <select
                value={filterIncident}
                onChange={(e) => setFilterIncident(e.target.value)}
                className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`}
              >
                <option value="All">All Incident Types</option>
                <option value="Runaway">Runaway Minor</option>
                <option value="Autism Wandering">Autism spectrum wandering</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Grid Search Zones</label>
              <select className={`w-full p-2.5 rounded-lg text-xs font-mono border focus:outline-none ${highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`}>
                <option>All Regional Grids</option>
                <option>Sector-4 Corridor</option>
                <option>Railway Boundary Line</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => { setFilterRisk("All"); setFilterIncident("All"); addToast("Filters reset to default scope.", "info"); }}
                className={`w-full py-2.5 text-xs font-mono font-bold rounded-lg border ${highContrast ? "bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-300" : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"}`}
              >
                RESET FILTERS
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6 z-10 relative">
          <div>
            <h2 className={`text-2xl font-black ${textMain} tracking-tight`}>
              Child Behavioral Intelligence
            </h2>
            <p className={`text-xs uppercase tracking-widest ${textMuted} font-bold mt-1`}>
              Cognitive Profile & Trajectory Prediction
            </p>
          </div>
          {selectedCase && (
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md">
                <Brain className="w-4 h-4" /> RECALCULATE AI WEIGHTS
              </button>
            </div>
          )}
        </div>

      {/* Main Grid: Selector, Interactive Map, Explanations */}
      <div className="grid grid-cols-12 gap-4 flex-1">
        
        {/* Left Column: Behavior Profile Selector */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1 flex flex-col justify-between`}>
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}>
                <Brain className="w-4.5 h-4.5 text-purple-400" /> Behavior Selector
              </h4>
              <div className="space-y-1.5">
                {casesRegistry.filter(
                  (c) =>
                    filterRisk === "All" || c.incidentType.includes(filterRisk)
                ).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCase(c);
                      setLastSeen(c.coords);
                      setActiveProfile(c.defaultProfile);
                      addToast(`Switched to active case: ${c.name}`, "info");
                    }}
                    className={`w-full text-left p-3 rounded-lg border flex flex-col gap-1 transition-all ${
                      selectedCase?.id === c.id
                        ? `border-purple-500 ring-1 ring-purple-500/20 ${highContrast ? "bg-stone-900" : "bg-purple-50"}`
                        : `border-transparent ${bgListItem}`
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-bold text-sm ${selectedCase?.id === c.id ? (highContrast ? "text-yellow-300" : "text-gray-900") : textMain}`}>
                        {c.name}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 rounded ${selectedCase?.id === c.id ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-stone-800 dark:text-stone-400"}`}>
                        {c.id}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase text-gray-500 font-bold">{c.incidentType}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {c.region}
                    </span>
                  </button>
                ))}
                {casesRegistry.length === 0 && (
                   <div className="p-4 text-center text-sm text-gray-500 font-bold uppercase">NO ACTIVE MISSING CASES</div>
                )}
              </div>
            </div>

            {/* In-place Custom Profile Builder Form */}
            {activeProfile === "Custom Profile" && (
              <div className="mt-4 p-3 bg-stone-950 border border-stone-850 rounded-xl space-y-3 max-h-[300px] overflow-y-auto">
                <div className="border-b border-stone-900 pb-1.5 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-purple-400 font-bold uppercase">Configure custom constraints</span>
                  <Sliders className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                </div>

                <div className="space-y-2 text-[10px] font-mono">
                  <div>
                    <label className="block text-stone-500 mb-0.5">Physical Age: {customParams.age} years</label>
                    <input
                      type="range" min="2" max="18"
                      value={customParams.age}
                      onChange={(e) => setCustomParams({ ...customParams, age: Number(e.target.value) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-0.5">Avg Travel Speed: {customParams.speed} km/h</label>
                    <input
                      type="range" min="0.5" max="8.0" step="0.5"
                      value={customParams.speed}
                      onChange={(e) => setCustomParams({ ...customParams, speed: Number(e.target.value) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-0.5">Disability Constraints</label>
                    <select
                      value={customParams.disability}
                      onChange={(e) => setCustomParams({ ...customParams, disability: e.target.value })}
                      className="w-full bg-stone-900 p-1.5 rounded border border-stone-800 text-stone-300"
                    >
                      <option>None</option>
                      <option>Cognitive spectrum</option>
                      <option>Mobility impaired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-0.5">Communication constraints</label>
                    <select
                      value={customParams.communication}
                      onChange={(e) => setCustomParams({ ...customParams, communication: e.target.value })}
                      className="w-full bg-stone-900 p-1.5 rounded border border-stone-800 text-stone-300"
                    >
                      <option>Speaks clearly</option>
                      <option>Non-verbal</option>
                      <option>Limited language/signs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-0.5">Attraction Points Preference</label>
                    <select
                      value={customParams.favoriteLocation}
                      onChange={(e) => setCustomParams({ ...customParams, favoriteLocation: e.target.value })}
                      className="w-full bg-stone-900 p-1.5 rounded border border-stone-800 text-stone-300"
                    >
                      <option value="Train engine rooms">Train Engine Terminals</option>
                      <option value="Water Reservoirs">Water Reservoirs / Canals</option>
                      <option value="Woodlands">Quiet Woodlands / Parks</option>
                    </select>
                  </div>

                  <button
                    onClick={() => addToast("Custom Neural prediction model updated!", "success")}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-mono text-[9px] font-bold rounded-lg uppercase mt-2 cursor-pointer transition-colors"
                  >
                    COMPUTE MODEL WEIGHTS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Live Map Heatmap Canvas Container */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-3">
          <div className={`p-1 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden flex flex-col min-h-[460px] flex-1`}>
            
            {/* Map floating toggles and layers HUD panel */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
              <span
                onClick={() => setLayers({ ...layers, heatmap: !layers.heatmap })}
                className={`px-2 py-1 rounded text-[9px] font-bold font-mono border cursor-pointer transition-all ${
                  layers.heatmap ? "bg-purple-950/80 border-purple-800 text-purple-400" : "bg-stone-950/40 border-stone-800 text-stone-500"
                }`}
              >
                PROBABILITY HEATMAPS
              </span>
              <span
                onClick={() => setLayers({ ...layers, radius: !layers.radius })}
                className={`px-2 py-1 rounded text-[9px] font-bold font-mono border cursor-pointer transition-all ${
                  layers.radius ? "bg-yellow-950/80 border-yellow-800 text-yellow-400" : "bg-stone-950/40 border-stone-800 text-stone-500"
                }`}
              >
                SEARCH BOUNDARY
              </span>
              <span
                onClick={() => setLayers({ ...layers, activeUnits: !layers.activeUnits })}
                className={`px-2 py-1 rounded text-[9px] font-bold font-mono border cursor-pointer transition-all ${
                  layers.activeUnits ? "bg-emerald-950/80 border-emerald-800 text-emerald-400" : "bg-stone-950/40 border-stone-800 text-stone-500"
                }`}
              >
                ACTIVE UNITS
              </span>
            </div>

            {/* Interactive map controls bottom right */}
            <div className="absolute bottom-16 right-3 z-20 flex flex-col gap-1.5">
              <button
                onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2))}
                className="w-8 h-8 rounded-lg bg-stone-950 hover:bg-stone-900 border border-stone-800 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                +
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.4))}
                className="w-8 h-8 rounded-lg bg-stone-950 hover:bg-stone-900 border border-stone-800 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => { setZoom(0.85); setPanX(60); setPanY(10); }}
                className="w-8 h-8 rounded-lg bg-stone-950 hover:bg-stone-900 border border-stone-800 text-white text-[10px] font-mono flex items-center justify-center cursor-pointer"
              >
                RST
              </button>
              <button
                onClick={() => {
                  setIsDrawingMode(!isDrawingMode);
                  if (!isDrawingMode) addToast("Click and drag on the map to define a custom search zone", "info");
                }}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer ${
                  isDrawingMode ? "bg-yellow-600 text-white border-yellow-500" : "bg-stone-950 hover:bg-stone-900 border-stone-800 text-stone-400"
                }`}
                title="Annotate Zone"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas map body */}
            <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="block w-full h-full"
              />
            </div>

            {/* Map bottom bar: Simulation slider timeline */}
            <div className="bg-stone-950 border-t border-stone-850 p-3 flex items-center justify-between gap-4 z-10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isSimulating ? "bg-amber-600 text-white" : "bg-stone-900 hover:bg-stone-850 text-stone-300"
                  }`}
                >
                  {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="font-mono text-[10px]">
                  <span className="text-stone-500">HORIZON:</span> <span className="text-purple-400 font-bold">{simulationTime}% Simulated</span>
                </div>
              </div>

              <div className="flex-1 px-4">
                <input
                  type="range" min="0" max="100"
                  value={simulationTime}
                  onChange={(e) => setSimulationTime(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-stone-900 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 4].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimulationSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                      simulationSpeed === speed
                        ? "bg-purple-950 border-purple-800 text-purple-400"
                        : "bg-stone-900 border-stone-850 text-stone-500"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Explanation & Timeline Logs */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1 flex flex-col justify-between overflow-y-auto max-h-[500px]`}>
            
            {selectedCase && (
                <div className={`p-5 rounded-2xl border flex flex-col gap-5 h-full ${bgCard}`}>
                  <div className={`flex items-center gap-4 border-b ${borderSubtle} pb-4`}>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200 dark:bg-purple-900/30 dark:border-purple-900 shrink-0">
                      <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black tracking-tight">{selectedCase.name}</h3>
                      <p className={`text-xs ${textMuted} font-bold mt-0.5`}>
                        {selectedCase.id} • {selectedCase.incidentType}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm">
                      {activeProfile} Profile
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <span className={`block text-[9px] uppercase tracking-wider mb-1 opacity-70`}>Last Seen Zone</span>
                      <span className={textMain}>{selectedCase.searchZone}</span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase tracking-wider mb-1 opacity-70`}>GPS Label</span>
                      <span className="font-mono text-purple-500 dark:text-purple-400">{selectedCase.gpsLabel}</span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase tracking-wider mb-1 opacity-70`}>Lead Officer</span>
                      <span className={textMain}>{selectedCase.officer}</span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase tracking-wider mb-1 opacity-70`}>Time Elapsed</span>
                      <span className="text-amber-600 dark:text-amber-500 font-black flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {selectedCase.lastSeenTime}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Explanations section */}
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-3 flex items-center gap-2`}>
                <Eye className="w-4 h-4 text-purple-400" /> AI Explanation Engine
              </h4>
              <p className="text-[10px] text-stone-500 leading-relaxed mb-3">
                Decrypted telemetry and probability explanations generated via live Abhaya cognitive models.
              </p>

              <div className="space-y-2">
                {explanations.map((exp, i) => {
                  const Icon = exp.icon;
                  return (
                    <div key={i} className="p-2.5 bg-stone-950/60 border border-stone-850/60 rounded-xl space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <h5 className="font-bold text-xs text-stone-200">{exp.title}</h5>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.25 rounded shrink-0">
                          {exp.confidence} Conf.
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-relaxed">{exp.text}</p>
                      
                      <div className="pt-1.5 border-t border-stone-900/60 text-[9px] font-mono text-stone-500 leading-normal">
                        <p><span className="text-stone-450 font-semibold">Evidence:</span> {exp.evidence}</p>
                        <p><span className="text-stone-450 font-semibold">Reasoning:</span> {exp.reasoning}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Realtime Event Logs stream */}
            <div className="mt-4 pt-4 border-t border-stone-850">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-purple-400 font-mono mb-2">Live investigation timeline</h5>
              <div className="space-y-2 max-h-[140px] overflow-y-auto">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-2 text-[10px] font-mono border-b border-stone-900/50 pb-1.5">
                    <span className="text-purple-400 shrink-0">{item.time}</span>
                    <span className="text-stone-400 leading-normal">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Section: Active Collaboration Chat & Report downloads */}
      <div className="grid grid-cols-12 gap-4 mt-4">
        
        {/* Officer Collaboration notes */}
        <div className="col-span-12 md:col-span-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm h-full flex flex-col justify-between gap-3`}>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4 text-purple-400" /> Officer Briefing Feed
              </h4>
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto text-[10px] font-mono text-stone-300">
                {comments.map((c, i) => (
                  <div key={i} className="p-1.5 bg-stone-950/40 border border-stone-900 rounded">
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={addOfficerComment} className="flex gap-1">
              <input
                type="text"
                placeholder="Log mission briefing updates..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-mono font-bold"
              >
                LOG
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Search recommendations summary and report downloader */}
        <div className="col-span-12 md:col-span-8">
          <div className={`p-4 rounded-xl ${darkGreenCard} flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden h-full`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 relative z-10 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-400/20">
                <Target className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200 font-mono">
                  Calculated Search Recommendations
                </span>
                <h3 className="text-md font-black tracking-tight mt-0.5">{recommendations.team}</h3>
                <p className="text-[10px] text-emerald-100/80 font-mono mt-0.5">Objective: {recommendations.action}</p>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-5 items-center relative z-10 text-xs font-mono">
              <div>
                <span className="text-[9px] font-bold uppercase text-emerald-200 block mb-0.5">Target Scope</span>
                <span className="font-bold text-yellow-300">{selectedCase.name} ({selectedCase.id})</span>
              </div>
              <div className="w-px h-8 bg-emerald-600/40 hidden md:block"></div>
              <div>
                <span className="text-[9px] font-bold uppercase text-emerald-200 block mb-0.5">Coverage Limit</span>
                <span className="font-bold">{recommendations.radius} Radius</span>
              </div>
              <div className="w-px h-8 bg-emerald-600/40 hidden md:block"></div>
              <div>
                <span className="text-[9px] font-bold uppercase text-emerald-200 block mb-0.5">Confidence</span>
                <span className="font-bold text-emerald-300">{recommendations.confidence} Accuracy</span>
              </div>
              <div className="w-px h-8 bg-emerald-600/40 hidden md:block"></div>
              
              <div className="flex gap-1.5">
                <button
                  onClick={handleExportCSV}
                  className="p-2 bg-stone-950/60 hover:bg-stone-950 text-white rounded-lg border border-stone-800 transition-colors cursor-pointer"
                  title="Download CSV"
                >
                  <FileDown className="w-4 h-4 text-stone-300" />
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold font-mono tracking-wider flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOSSIER</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
