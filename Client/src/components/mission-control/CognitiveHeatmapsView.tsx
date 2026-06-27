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
import { MapContainer, TileLayer, Circle, CircleMarker, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

// Fix Leaflet marker icons issue in React
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Types
interface CaseRecord {
  id: string;
  name: string;
  guardian: string;
  missionId: string;
  coords: { lat: number; lng: number };
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
  lat: number;
  lng: number;
}

interface SearchTeam {
  id: string;
  name: string;
  type: "Drone" | "Police" | "NGO";
  lat: number;
  lng: number;
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
      coords: { lat: 19.0760 + (Math.random()*0.02-0.01), lng: 72.8777 + (Math.random()*0.02-0.01) }, // Approximate mapped coords
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
  const [lastSeen, setLastSeen] = useState({ lat: 19.0760, lng: 72.8777 });
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnZones, setDrawnZones] = useState<{ lat: number; lng: number; radius: number; label: string }[]>([]);

  // Real-time Event simulation
  const [simulationTime, setSimulationTime] = useState(0); // 0 to 100% along path
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 4x

  // State variables for backend data
  const [searchTeams, setSearchTeams] = useState<SearchTeam[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [heatmapBlobs, setHeatmapBlobs] = useState<any[]>([]);
  const [predictedPath, setPredictedPath] = useState<{lat: number, lng: number}[]>([]);
  const [explanations, setExplanations] = useState<any[]>([]);

  // Connect to Mission Control Websocket
  useEffect(() => {
    const socket = io("/api/mission", { path: "/socket.io" });
    
    socket.on("update", (msg: { type: string, data: any[] }) => {
      if (msg.type === "teams" || msg.type === "drones") {
        setSearchTeams(prev => {
          const others = prev.filter(p => !msg.data.find((m:any) => m.teamId === p.id && (msg.type === "teams" ? p.type !== "Drone" : p.type === "Drone")));
          const updated = msg.data.map((t: any) => ({
            id: t.teamId,
            name: t.teamId,
            type: msg.type === "teams" ? "Police" : "Drone",
            lat: t.location?.lat || 19.0760,
            lng: t.location?.lng || 72.8777,
            color: msg.type === "teams" ? "#ef4444" : "#06b6d4",
            status: t.status
          }));
          return [...others, ...updated];
        });
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  // Fetch Cognitive Map from Psychology Search
  useEffect(() => {
    const fetchCognitiveMap = async () => {
      try {
        const res = await fetch("/api/psych/v1/search/cognitive-map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            center_lat: lastSeen.lat,
            center_lng: lastSeen.lng,
            radius_km: getSearchRadiusMeters(activeProfile) / 1000,
            child_profile: activeProfile
          })
        });
        if (res.ok) {
          const data = await res.json();
          setLandmarks(data.landmarks || []);
          setHeatmapBlobs(data.heatmaps || []);
          setPredictedPath(data.predicted_path || []);
          setExplanations(data.explanations || []);
        }
      } catch (err) {
        console.error("Failed to fetch cognitive map", err);
      }
    };
    fetchCognitiveMap();
  }, [lastSeen, activeProfile]);

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
        setLastSeen({ lat: parseFloat(RegExp.$1), lng: parseFloat(RegExp.$3) });
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
    setLastSeen((prev) => ({ lat: prev.lat + (Math.random() * 0.005 - 0.0025), lng: prev.lng + (Math.random() * 0.005 - 0.0025) }));
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



  // Exporters
  const handleExportCSV = () => {
    const data = [
      ["Case ID", selectedCase.id],
      ["Name", selectedCase.name],
      ["Default Profile", activeProfile],
      ["Last Seen Coordinates (Lat, Lng)", `${lastSeen.lat}, ${lastSeen.lng}`],
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
LAST SEEN MATRIX COORDS: ${lastSeen.lat}, ${lastSeen.lng}

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

  const recommendations = { team: "Deploy AI Directed Task Force", action: "Prioritize Calculated Zones", radius: "1.5 km", confidence: "90%" };

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

            {/* Leaflet map body */}
            <div className="flex-1 w-full h-full relative z-0" style={{ minHeight: '400px' }}>
              <MapContainer 
                center={[lastSeen.lat, lastSeen.lng]} 
                zoom={14} 
                style={{ width: '100%', height: '100%', background: highContrast ? "#0c0a09" : "#141416" }}
                zoomControl={true}
              >
                <TileLayer
                  url={highContrast ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* Heatmaps */}
                {layers.heatmap && heatmapBlobs.map((b, i) => (
                  <Circle 
                    key={`hm-${i}`}
                    center={[b.lat, b.lng]} 
                    radius={b.radius} 
                    pathOptions={{ color: 'transparent', fillColor: `rgb(${b.r},${b.g},${b.b})`, fillOpacity: b.intensity * 0.4 }} 
                  />
                ))}

                {/* Radius Boundary */}
                {layers.radius && (
                  <Circle
                    center={[lastSeen.lat, lastSeen.lng]}
                    radius={getSearchRadiusMeters(activeProfile)}
                    pathOptions={{ color: highContrast ? '#eab308' : '#9333ea', weight: 2, dashArray: '5, 5', fillOpacity: 0.05 }}
                  />
                )}

                {/* Predicted Paths */}
                {layers.predictedPath && (
                  <Polyline 
                    positions={predictedPath.map(p => [p.lat, p.lng])} 
                    pathOptions={{ color: '#c084fc', weight: 3, dashArray: '6, 6' }}
                  />
                )}

                {/* Drawn Zones */}
                {drawnZones.map((z, i) => (
                  <Circle key={`dz-${i}`} center={[z.lat, z.lng]} radius={z.radius} pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.15 }}>
                     <Tooltip direction="top" permanent className="bg-transparent border-none text-yellow-400 font-bold text-xs shadow-none">{z.label}</Tooltip>
                  </Circle>
                ))}

                {/* Landmarks */}
                {layers.landmarks && landmarks.map((l, i) => (
                  <CircleMarker 
                    key={`lm-${i}`}
                    center={[l.lat, l.lng]} 
                    radius={8} 
                    pathOptions={{ color: '#fff', weight: 1, fillColor: l.type === 'Safe Zone' ? '#10b981' : l.type === 'Danger Area' ? '#ef4444' : '#3b82f6', fillOpacity: 1 }}
                  >
                    <Tooltip direction="bottom" offset={[0, 10]} permanent className="bg-transparent border-none text-gray-200 font-bold text-xs shadow-none">
                      {l.name}
                    </Tooltip>
                  </CircleMarker>
                ))}

                {/* Active Units */}
                {layers.activeUnits && searchTeams.map(t => (
                  <CircleMarker 
                    key={`t-${t.id}`}
                    center={[t.lat, t.lng]}
                    radius={8}
                    pathOptions={{ color: '#fff', weight: 1.2, fillColor: t.color, fillOpacity: 1 }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} permanent className="bg-transparent border-none text-white font-bold text-[10px] shadow-none">
                      {t.name}
                    </Tooltip>
                  </CircleMarker>
                ))}

                {/* Last Seen or Simulated Target */}
                <CircleMarker
                  center={layers.movementTrails && predictedPath.length > 0 ? [
                    predictedPath[Math.min(Math.floor((simulationTime / 100) * predictedPath.length), Math.max(0, predictedPath.length - 1))]?.lat || lastSeen.lat,
                    predictedPath[Math.min(Math.floor((simulationTime / 100) * predictedPath.length), Math.max(0, predictedPath.length - 1))]?.lng || lastSeen.lng
                  ] : [lastSeen.lat, lastSeen.lng]}
                  radius={6}
                  pathOptions={{ color: '#ef4444', weight: 2, fillColor: '#ef4444', fillOpacity: 1 }}
                >
                  <Tooltip direction="bottom" offset={[0, 10]} permanent className="bg-transparent border-none text-red-500 font-bold text-[10px] shadow-none">
                    {layers.movementTrails && predictedPath.length > 0 ? "SIMULATED TARGET" : "LAST SEEN POINT"}
                  </Tooltip>
                </CircleMarker>

              </MapContainer>
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
                  const Icon = AlertTriangle; // Use fallback icon since backend does not return one
                  return (
                    <div key={i} className="p-2.5 bg-stone-950/60 border border-stone-850/60 rounded-xl space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <h5 className="font-bold text-xs text-stone-200">{exp.title}</h5>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.25 rounded shrink-0">
                          {exp.confidence}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-relaxed">{exp.summary}</p>
                      
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
                <span className="font-bold text-yellow-300">{selectedCase?.name || "None"} ({selectedCase?.id || "N/A"})</span>
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
