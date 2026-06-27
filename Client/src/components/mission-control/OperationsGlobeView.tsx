import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import { io } from "socket.io-client";
import {
  Search,
  Filter,
  X,
  Plus,
  Compass,
  Zap,
  Target,
  Users,
  AlertTriangle,
  Clock,
  ChevronRight,
  Shield,
  Activity,
  Video,
  Phone,
  Mic,
  Send,
  Sliders,
  Wind,
  Thermometer,
  Eye,
  Droplets,
  Layers,
  MapPin,
  Bot
} from "lucide-react";
import { useToastStore, useMissionStore } from "../../lib/store";

interface CaseObject {
  id: string;
  name: string;
  type: string;
  region: string;
  lat: number;
  lon: number;
  status: string;
  priority: string;
  assignedTeam: string;
}

export default function OperationsGlobeView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { addToast } = useToastStore();
  const { teams, drones, kpis } = useMissionStore();

  const [cases, setCases] = useState<CaseObject[]>([]);
  const [liveTeams, setLiveTeams] = useState<any[]>([]);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCase, setSelectedCase] = useState<CaseObject | null>(null);
  
  // Real-time environmental parameters
  const [temp, setTemp] = useState(29.4);
  const [humidity, setHumidity] = useState(74);
  const [rainfall, setRainfall] = useState(12.5);
  const [visibility, setVisibility] = useState(5.0);
  const [wind, setWind] = useState(14.8);
  const [impactLevel, setImpactLevel] = useState("NORMAL");

  // Autocomplete & Saved search states
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(["Suresh Sikkim", "Siliguri Corridor", "Drone Airborne"]);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");

  // AI recommendations log
  const [aiRecs, setAiRecs] = useState<string[]>([
    "OPTIMIZATION: UAV-Alpha flight trajectory rerouted 12° West to bypass local cell over Gangtok.",
    "BEHAVIOR MODEL: Suresh search vector shifted 2km Northeast toward transit junction based on railway data.",
    "WEATHER RISK: Siliguri rainfall (+12mm) restricting drone search altitudes to 150m."
  ]);

  // Chat copilot states
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMsg, setCopilotMsg] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ role: "ai" | "user"; msg: string }>>([
    { role: "ai", msg: "Commander, I have analyzed the operational grid. Weather in Sikkim corridor is stable but wet. How can I assist you with routes or team dispatches?" }
  ]);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  // Layers state
  const [layers, setLayers] = useState({
    missingChildren: true,
    groundTeams: true,
    droneUnits: true,
    cctvCameras: true,
    satelliteImagery: true,
    mobileTowers: false,
    policeVehicles: false,
    rescueTeams: false,
    heatmaps: false,
    riskZones: false,
    crowdDensity: false,
    roadBlocks: false,
    hospitals: false,
    safeHouses: false,
    checkpoints: false,
    searchRadius: false,
  });

  const [zoom, setZoom] = useState(1.0);
  const [isRotating, setIsRotating] = useState(true);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (globeRef.current && isRotating) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    } else if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
    }
  }, [isRotating]);

  useEffect(() => {
    if (selectedCase && globeRef.current) {
      globeRef.current.pointOfView({ lat: selectedCase.lat, lng: selectedCase.lon, altitude: 0.5 }, 1500);
      setIsRotating(false);
    }
  }, [selectedCase]);

  const mapData = useMemo(() => {
    let points = [];
    if (layers.missingChildren) {
      points.push(...cases.map(c => ({ ...c, color: '#eab308', size: 1.5, type: 'case' })));
    }
    if (layers.groundTeams) {
      points.push(...liveTeams.filter(t => t.type === 'groundTeams').map(t => ({ ...t, size: 0.8, type: 'team' })));
    }
    if (layers.droneUnits) {
      points.push(...liveTeams.filter(t => t.type === 'droneUnits').map(t => ({ ...t, size: 0.8, type: 'drone' })));
    }
    return points;
  }, [cases, liveTeams, layers]);

  const handleZoomIn = () => {
    if (globeRef.current) {
      const currentPov = globeRef.current.pointOfView();
      globeRef.current.pointOfView({ ...currentPov, altitude: Math.max(0.1, currentPov.altitude - 0.2) }, 500);
    }
  };

  const handleZoomOut = () => {
    if (globeRef.current) {
      const currentPov = globeRef.current.pointOfView();
      globeRef.current.pointOfView({ ...currentPov, altitude: Math.min(3.0, currentPov.altitude + 0.2) }, 500);
    }
  };

  const handleReset = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 26.7271, lng: 88.5953, altitude: 2.0 }, 1000);
      setIsRotating(true);
      setSelectedCase(null);
      addToast("Camera focus and satellite path realigned to default sector", "info");
    }
  };

  // Immediate weather scan trigger
  const handleLightningAction = () => {
    addToast("Initiating live radar high-frequency weather scan...", "info");
    setTemp(28.2 + Math.random());
    setHumidity(Math.floor(70 + Math.random() * 15));
    setRainfall(parseFloat((10 + Math.random() * 8).toFixed(1)));
    setVisibility(4.2 + Math.random());
    setWind(parseFloat((12 + Math.random() * 5).toFixed(1)));
    setImpactLevel("RAIN DEGRADATION DETECTED");
    addToast("Radar sweep complete. Weather metrics refreshed on environmental grid.", "success");
  };

  // Instant Search Engine
  useEffect(() => {
    if (!searchQuery) {
      setSearchSuggestions([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const suggestions: any[] = [];

    // Search cases
    cases.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)) {
        suggestions.push({ type: "case", label: `${c.name} [${c.id}]`, detail: c.region, item: c });
      }
    });

    // Search teams & drones
    teams.forEach(t => {
      if (t.name.toLowerCase().includes(q)) {
        suggestions.push({ type: "team", label: `${t.name} (Team)`, detail: t.status, item: t });
      }
    });

    drones.forEach(d => {
      if (d.name.toLowerCase().includes(q)) {
        suggestions.push({ type: "drone", label: `${d.name} (Drone)`, detail: d.status, item: d });
      }
    });

    setSearchSuggestions(suggestions.slice(0, 5));
  }, [searchQuery, cases, teams, drones]);

  const handleSelectSuggestion = (s: any) => {
    setSearchQuery("");
    setSearchSuggestions([]);
    
    if (s.type === "case") {
      handleCaseSelect(s.item);
    } else {
      // Rotate camera to unit location
      const loc = s.item.location;
      globeRef.current?.pointOfView({ lat: loc.lat, lng: loc.lng, altitude: 0.5 }, 1500);
      addToast(`Satellite tracking established on ${s.item.name}`, "info");
    }
  };

  const handleCaseSelect = (c: CaseObject) => {
    setSelectedCase(c);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: c.lat, lng: c.lon, altitude: 0.5 }, 1500);
      setIsRotating(false);
    }
    addToast(`Satellite Target Locked: ${c.name} [${c.id}]`, "success");
  };

  // Voice command assistant simulator
  const handleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceStatus("");
    } else {
      setIsListening(true);
      setVoiceStatus("LISTENING...");
      setTimeout(() => setVoiceStatus("PROCESSING COMMAND..."), 2000);
      setTimeout(() => {
        setIsListening(false);
        setVoiceStatus("");
        addToast("Voice Command parsed: 'Focus Sector 4 drones'", "info");
      }, 3500);
    }
  };

  // Ask Mission AI Copilot Chat backend connectivity
  const handleCopilotSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotMsg.trim()) return;

    const userMessage = copilotMsg.trim();
    setChatLog(prev => [...prev, { role: "user", msg: userMessage }]);
    setCopilotMsg("");
    setIsCopilotTyping(true);

    try {
      const messagesPayload = chatLog
        .concat({ role: "user", msg: userMessage })
        .map(m => ({
          role: m.role === "ai" ? "model" : "user",
          content: m.msg
        }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesPayload })
      });
      const data = await res.json();
      
      setChatLog(prev => [...prev, { role: "ai", msg: data.text || "I was unable to retrieve a response from server. Standby." }]);
    } catch (err) {
      setChatLog(prev => [...prev, { role: "ai", msg: "Telemetry downlink interrupted. Please retry in a few seconds." }]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  // Live periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic fluctuation of weather stats
      setTemp(p => parseFloat((p + (Math.random() - 0.5) * 0.15).toFixed(1)));
      setRainfall(p => Math.max(1, parseFloat((p + (Math.random() - 0.5) * 0.2).toFixed(1))));
      setWind(p => parseFloat((p + (Math.random() - 0.5) * 0.3).toFixed(1)));

      // Add a fresh intelligence recommendation
      const feedPool = [
        "RISK MODEL: Wet vegetation corridors raising drone thermographic profile locks.",
        "UNIT OPTIMIZATION: K9-Unit 03 search trajectory aligned along Teesta River bank.",
        "TELEMETRY: Mobile tower TWR-09 reports signal load increase in Border Sector 1.",
        "AI DEVIATION: Case Priya Das location likelihood shifted 3.4% West following satellite pass."
      ];
      const freshRec = feedPool[Math.floor(Math.random() * feedPool.length)];
      setAiRecs(prev => [freshRec, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 relative select-none">
      
      {/* 1. Dynamic Transparent Top Search & Control Deck */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-emerald-500" />
          </div>
          <input
            type="text"
            placeholder="Search Cases, Victims, Coordinates (e.g. 27.3, 88.6)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 backdrop-blur-xl text-white pl-11 pr-12 py-3 text-sm font-semibold rounded-xl border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.1)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500 transition-all"
          />
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-3 top-2.5 p-1 rounded-lg transition-colors cursor-pointer ${isListening ? "bg-red-600 text-white animate-pulse" : "text-emerald-500 hover:bg-emerald-950/40"}`}
            title="Start Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-5 py-3 rounded-xl border font-bold text-xs uppercase flex items-center gap-2 shadow-2xl backdrop-blur-xl transition-all cursor-pointer ${
            showFilters
              ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20"
              : "bg-slate-950/85 text-slate-300 border-emerald-500/25 hover:text-white hover:border-emerald-500"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>FILTERS</span>
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-4 py-3 rounded-xl border font-mono font-bold text-xs shadow-2xl backdrop-blur-xl transition-all cursor-pointer ${
            isRotating
              ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40"
              : "bg-slate-950/85 text-slate-400 border-emerald-500/20 hover:text-white"
          }`}
        >
          {isRotating ? "ROTATING" : "STATIONARY"}
        </button>
      </div>

      {/* Voice Assistant Waveform Overlay */}
      {isListening && (
        <div className="absolute top-20 left-4 right-4 z-40 max-w-md mx-auto p-4 bg-slate-950/95 backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-2xl flex flex-col items-center gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 h-6">
            <span className="w-1 bg-red-500 h-2 rounded animate-bounce"></span>
            <span className="w-1 bg-red-500 h-5 rounded animate-bounce delay-75"></span>
            <span className="w-1 bg-red-500 h-3 rounded animate-bounce delay-100"></span>
            <span className="w-1 bg-red-500 h-6 rounded animate-bounce delay-150"></span>
            <span className="w-1 bg-red-500 h-2 rounded animate-bounce delay-200"></span>
          </div>
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">{voiceStatus}</span>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {searchSuggestions.length > 0 && (
        <div className="absolute top-16 left-4 right-4 z-40 max-w-xl mx-auto bg-slate-950/95 border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl divide-y divide-slate-800">
          {searchSuggestions.map((s, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSuggestion(s)}
              className="p-3 hover:bg-emerald-950/30 cursor-pointer flex justify-between items-center transition-colors"
            >
              <div>
                <p className="text-xs font-black text-white">{s.label}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.detail}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          ))}
        </div>
      )}

      {/* Expandable Advanced Filters */}
      {showFilters && (
        <div className="absolute top-20 left-4 right-4 z-30 max-w-2xl mx-auto p-4 bg-slate-950/95 border border-emerald-500/30 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-200">
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Priority Level</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-500/20 text-white px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Search Progress</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-500/20 text-white px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active Search">Active Search</option>
              <option value="Standby">Standby</option>
              <option value="Assisted">Assisted</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedPriority("All");
                setSelectedStatus("All");
                setSearchQuery("");
                addToast("Operations filtering reset.", "info");
              }}
              className="w-full py-2 bg-slate-900 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono rounded-lg hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              RESET RULES
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Interactive 3D Canvas Container */}
      <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative border border-emerald-500/10 shadow-2xl">
        <div className={`absolute inset-0 z-0 ${highContrast ? "bg-black" : "bg-[#050a12]"}`}>
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            htmlElementsData={mapData}
            htmlElement={(d: any) => {
              const el = document.createElement('div');
              el.innerHTML = `
                <div style="transform: translate(-50%, -50%); cursor: pointer; text-align: center;">
                  <div style="background: ${d.color}; width: ${d.size * 10}px; height: ${d.size * 10}px; border-radius: 50%; box-shadow: 0 0 10px ${d.color}; border: 1px solid white;"></div>
                  <span style="color: white; font-size: 10px; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 4px; border-radius: 4px; display: block; margin-top: 4px;">${d.name}</span>
                </div>
              `;
              el.onclick = () => {
                if (d.type === 'case') {
                  setSelectedCase(d);
                  setAiRecs([
                    `FOCUS SHIFT: Re-analyzing geospatial perimeter for ${d.name}...`,
                    `DEPLOYMENT: Recommend redirecting ${d.assignedTeam} to ${d.lat.toFixed(2)}, ${d.lon.toFixed(2)}.`
                  ]);
                  addToast(`Selected case ${d.name}`, "info");
                }
              };
              return el;
            }}
          />
        </div>
      </div>

        {/* 3. LEFT COLUMN: SATELLITE RADAR TARGET LOCKS */}
        <div className="absolute left-6 top-20 z-15 bg-slate-950/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-4 shadow-2xl max-w-xs w-full hidden xl:flex flex-col max-h-[380px]">
          <div className="flex items-center gap-1.5 pb-2.5 mb-3 border-b border-emerald-500/15">
            <Target className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400 font-mono">
              SATELLITE RADAR TARGET LOCKS
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono ml-auto">({cases.length})</span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => handleCaseSelect(c)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  selectedCase?.id === c.id
                    ? "bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-slate-900/50 border-emerald-500/10 hover:border-emerald-500/30 hover:bg-slate-900"
                }`}
              >
                {/* Scanning line animation inside active card */}
                {selectedCase?.id === c.id && (
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0)_90%,rgba(16,185,129,0.15)_100%)] h-[200%] animate-scan pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors leading-tight">
                      {c.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono uppercase mt-0.5 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-emerald-500" /> {c.region}
                    </p>
                  </div>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                      c.priority === "Critical" 
                        ? "bg-red-950/60 text-red-400 border-red-500/20" 
                        : "bg-amber-950/60 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {c.priority}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-1 text-[8px] font-mono text-slate-400">
                  <div>CONF: <span className="text-emerald-400 font-bold">98.4%</span></div>
                  <div>DIS: <span className="text-slate-200">14.2 km</span></div>
                </div>

                {/* Quick actions for active target card */}
                {selectedCase?.id === c.id && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-500/20 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToast(`Direct secure downlink established to ${c.assignedTeam} radio.`, "info");
                      }}
                      className="py-1 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 text-[8px] font-black uppercase rounded font-mono transition-colors cursor-pointer"
                    >
                      Assign Team
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToast(`Tactical drone flight coordinates uploaded to satellite mesh.`, "success");
                      }}
                      className="py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[8px] font-black uppercase rounded font-mono transition-all cursor-pointer"
                    >
                      Deploy Drone
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. BOTTOM LEFT: GLOBAL SCAN HUD */}
        <div className="absolute bottom-6 left-6 z-15 bg-slate-950/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-4 shadow-2xl min-w-[250px] flex flex-col gap-2.5 animate-in slide-in-from-left duration-300">
          <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black tracking-widest text-white uppercase font-mono">GLOBAL SCAN</span>
            <span className="text-[9px] font-extrabold text-emerald-400 font-mono ml-auto animate-pulse">LIVE FEED</span>
          </div>

          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-emerald-500/5">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-red-500" /> ACTIVE MISSIONS
              </span>
              <strong className="text-white text-sm font-black font-mono">{kpis.activeMissions || 14}</strong>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-emerald-500/5">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" /> MISSING CHILDREN
              </span>
              <strong className="text-white text-sm font-black font-mono">8</strong>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-emerald-500/5">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" /> UNITS DEPLOYED
              </span>
              <strong className="text-white text-sm font-black font-mono">{kpis.officersDeployed || 42}</strong>
            </div>
          </div>
        </div>

        {/* 5. BOTTOM RIGHT: ENVIRONMENTAL INTEL */}
        <div className="absolute bottom-6 right-6 z-15 bg-slate-950/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-4 shadow-2xl min-w-[260px] flex flex-col gap-2.5 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-2.5">
            <Wind className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black tracking-widest text-white uppercase font-mono">ENVIRONMENTAL INTEL</span>
          </div>

          <div className="space-y-1.5 text-xs font-semibold text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase flex items-center gap-1">
                <Thermometer className="w-3 h-3" /> TEMPERATURE
              </span>
              <strong className="text-white text-sm font-black font-mono">{temp.toFixed(1)}°C</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase flex items-center gap-1">
                <Eye className="w-3 h-3" /> VISIBILITY
              </span>
              <strong className="text-white text-sm font-black font-mono">{visibility.toFixed(1)} km</strong>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase flex items-center gap-1">
                <Droplets className="w-3 h-3" /> MONSOON RAIN
              </span>
              <strong className="text-white text-sm font-black font-mono">{rainfall.toFixed(1)} mm</strong>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-mono text-[9px] tracking-wide uppercase">STATUS</span>
              <strong className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">{impactLevel}</strong>
            </div>
          </div>
        </div>

        {/* Floating Weather Scan Trigger Button */}
        <button
          onClick={handleLightningAction}
          className="absolute bottom-44 right-6 z-20 w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
          title="Trigger Atmospheric Thermal Scan"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>

        {/* 6. RIGHT COLUMN: TACTICAL LAYERS CONTROL PANEL */}
        <div className="absolute right-6 top-32 z-15 bg-slate-950/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-4 shadow-2xl max-w-[210px] w-full hidden lg:flex flex-col">
          <div className="flex items-center gap-1.5 pb-2 mb-2.5 border-b border-emerald-500/15">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 font-mono">
              INTELLIGENCE LAYERS
            </span>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
            {[
              { id: "missingChildren", label: "Missing Children", count: cases.length, color: "text-red-500" },
              { id: "groundTeams", label: "Ground Teams", count: teams?.length || 3, color: "text-blue-400" },
              { id: "droneUnits", label: "Drone Units", count: drones?.length || 4, color: "text-emerald-400" },
              { id: "cctvCameras", label: "CCTV Cameras", count: 24, color: "text-cyan-400" },
              { id: "satelliteImagery", label: "Satellite Grid", count: "ACTIVE", color: "text-amber-500" },
              { id: "mobileTowers", label: "Mobile Towers", count: 8, color: "text-slate-400" },
            ].map(layer => (
              <label
                key={layer.id}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-900/60 cursor-pointer text-[10px] font-bold text-slate-300 select-none"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(layers as any)[layer.id]}
                    onChange={(e) => {
                      setLayers(prev => ({ ...prev, [layer.id]: e.target.checked }));
                      addToast(`Intelligence Layer '${layer.label}' updated`, "info");
                    }}
                    className="accent-emerald-500 w-3 h-3 rounded"
                  />
                  <span>{layer.label}</span>
                </div>
                <span className={`font-mono text-[9px] font-black opacity-85 ${layer.color}`}>{layer.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 7. RIGHT COLUMN: DYNAMIC AI LOG PANEL */}
        <div className="absolute right-6 top-[370px] z-15 bg-slate-950/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-4 shadow-2xl max-w-[210px] w-full hidden lg:flex flex-col">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-emerald-500/15">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 font-mono">
              AI DECISION LOG
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[140px] pr-0.5">
            {aiRecs.map((rec, idx) => (
              <p key={idx} className="text-[8px] font-mono leading-relaxed text-slate-400 border-l border-emerald-500/20 pl-1.5 py-0.5">
                {rec}
              </p>
            ))}
          </div>
        </div>

        {/* 8. FLOATING CHAT DECK: ASK MISSION AI TERMINAL (Functional Integration) */}
        <div className="absolute bottom-24 right-20 z-20 flex flex-col items-end">
          {copilotOpen && (
            <div className="w-80 mb-3 bg-slate-950/95 border-2 border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-3 bg-gradient-to-r from-emerald-900 to-slate-950 flex justify-between items-center border-b border-emerald-500/20 text-white">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-mono font-black text-xs uppercase tracking-wider">Mission AI Co-pilot</span>
                </div>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="hover:bg-slate-900 p-1 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Chat log */}
              <div className="h-48 p-3 overflow-y-auto flex flex-col gap-2.5 text-[11px] font-semibold font-sans">
                {chatLog.map((c, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl max-w-[85%] leading-relaxed ${
                      c.role === "ai" 
                        ? "bg-emerald-950/30 border border-emerald-500/20 text-emerald-100 rounded-tl-sm self-start" 
                        : "bg-slate-900 border border-slate-800 text-white rounded-tr-sm self-end"
                    }`}
                  >
                    {c.msg}
                  </div>
                ))}
                {isCopilotTyping && (
                  <div className="p-2 rounded-xl bg-emerald-950/10 text-emerald-400 font-mono text-[9px] self-start animate-pulse">
                    RECEIVING DOWNLINK...
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleCopilotSend}
                className="p-2 border-t border-slate-900 flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={copilotMsg}
                  onChange={(e) => setCopilotMsg(e.target.value)}
                  placeholder="Ask copilot for recommendations..."
                  className="flex-1 bg-slate-900 border border-emerald-500/10 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-white focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="px-4 py-2.5 rounded-full font-black font-mono text-[10px] shadow-lg transition-all bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer uppercase tracking-widest border border-emerald-400 shadow-emerald-500/20"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>ASK CO-PILOT</span>
          </button>
        </div>

        {/* ThreeJS Map Navigation Control Desk */}
        <div className="absolute right-6 top-6 z-15 flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-emerald-500/20 shadow-2xl">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg hover:bg-emerald-950/40 text-emerald-400 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
            title="Satellite Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg hover:bg-emerald-950/40 text-emerald-400 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
            title="Satellite Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-lg hover:bg-emerald-950/40 text-emerald-400 text-[10px] font-black flex items-center justify-center cursor-pointer transition-colors"
            title="Reset Grid Matrix"
          >
            RST
          </button>
        </div>

      </div>
  );
}
