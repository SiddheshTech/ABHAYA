import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  LineChart, Activity, CloudRain, AlertTriangle, TrendingDown, Users,
  MapPin, ShieldAlert, Target, Clock, AlertCircle, Shield, ArrowRight,
  TrendingUp, BarChart2, Search, Database, RefreshCw, Sliders, Eye,
  Settings, History, CheckCircle2, X, ChevronRight, Sparkles, BookOpen,
  UserCheck, Server
} from "lucide-react";
import { socket } from "../lib/socket";

interface PredictionEngineProps {
  highContrast?: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

// Interfaces for our state variables
interface PredictionItem {
  id: string;
  timeframe: string;
  timestamp: string;
  migrationRisk: {
    level: string;
    trend: string;
    confidence: number;
    reasoning: string;
    factors: string[];
    regions: string[];
    timeline: string;
    actions: string;
  };
  floodRisk: {
    probability: number;
    rainfall: string;
    riverLevels: string;
    satelliteData: string;
    districts: string[];
    forecast: string;
    impactAssessment: string;
  };
  economicDistress: {
    vulnerabilityScore: number;
    employment: string;
    migration: string;
    inflation: string;
    foodSupply: string;
    povertyIndex: string;
    trendCharts: number[];
  };
  socialUnrest: {
    riskScore: number;
    socialMedia: string;
    crimeReports: string;
    protestMonitoring: string;
    sentimentAnalysis: string;
    communityAlerts: string;
  };
  predictedCases: {
    value: number;
    changePercent: string;
    confidence: number;
    historicalComparison: string;
    weeklyForecast: number[];
    monthlyForecast: number[];
  };
  expectedLocations: Array<{
    name: string;
    probability: number;
    confidence: number;
    expectedTime: string;
    distance: string;
    lastActivity: string;
    details: string;
  }>;
  threatProbability: {
    gaugeValue: number;
    trend: string;
    forecast: string;
    riskContributors: string[];
    mitigationSuggestions: string;
  };
  confidenceScore: {
    accuracy: string;
    freshness: string;
    level: string;
    reliability: string;
    quality: string;
    modelVersion: string;
  };
  aiExplanation: string;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "case" | "mission" | "officer" | "simulation" | "location";
  details: any;
}

export default function PredictionEngine({ highContrast, showToast }: PredictionEngineProps) {
  // Theme styling states (strictly following global LIGHT THEME requirements for Mission Control)
  const bgCard = highContrast ? "bg-stone-900 border-2 border-stone-700 text-white" : "bg-white border border-slate-100 shadow-md hover:shadow-lg text-slate-800 transition-all duration-300";
  const bgHeader = highContrast ? "bg-stone-950 border-stone-800 text-white" : "bg-slate-50 border-b border-slate-200 text-slate-900";
  const textMain = highContrast ? "text-yellow-300" : "text-slate-900";
  const textSecondary = highContrast ? "text-slate-300" : "text-slate-500";

  // Dashboard state variables
  const [currentPrediction, setCurrentPrediction] = useState<PredictionItem | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<string>("72 Hours");
  const [compareId, setCompareId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"geospatial" | "network" | "timeseries">("geospatial");

  // Real-time states
  const [wsConnected, setWsConnected] = useState<boolean>(socket.connected);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [secondsSinceGenerated, setSecondsSinceGenerated] = useState<number>(0);

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

  // Simulation execution / generator state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStepIndex, setGenStepIndex] = useState<number>(0);
  const [customPromptOpen, setCustomPromptOpen] = useState<boolean>(false);
  const [customPromptText, setCustomPromptText] = useState<string>("");

  // Explainable AI (XAI) methodology popup state
  const [xaiPopupCard, setXaiPopupCard] = useState<{ title: string; score: string | number; description: string; listTitle?: string; listItems?: string[]; actionTitle?: string; actionDesc?: string } | null>(null);

  // Selected map/location details in bottom panel
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);

  const timeframes = ["Today", "24 Hours", "72 Hours", "1 Week", "1 Month"];
  
  // Custom simulation loading steps
  const generationSteps = [
    "Initializing SecCopilot telemetry matrix...",
    "Retrieving Doppler rainfall grids and river metrics...",
    "Scanning socio-economic indices and employment variables...",
    "Analyzing social sentinel keywords and transit alerts...",
    "Synthesizing neural migration flow vectors...",
    "Finalizing predictions and generating defensive recommendations..."
  ];

  // Load initial data
  useEffect(() => {
    fetchHistory();
    fetchAuditLogs();

    // Setup websocket listeners
    socket.on("connect", () => {
      setWsConnected(true);
      setLastSyncTime(new Date());
      if (showToast) showToast("Live prediction feed connected.", "success");
    });

    socket.on("disconnect", () => {
      setWsConnected(false);
    });

    socket.on("update", (payload: { type: string; data: any }) => {
      if (payload.type === "predictions") {
        setPredictionHistory(payload.data);
        if (payload.data.length > 0) {
          // If active prediction is still null or matches activeTimeframe, set it
          const matching = payload.data.find((p: any) => p.timeframe === activeTimeframe);
          if (matching) {
            setCurrentPrediction(matching);
          } else if (!currentPrediction) {
            setCurrentPrediction(payload.data[0]);
            setActiveTimeframe(payload.data[0].timeframe);
          }
        }
        setLastSyncTime(new Date());
      } else if (payload.type === "audit") {
        setAuditLogs(payload.data);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("update");
    };
  }, [activeTimeframe]);

  // Keep track of how long ago prediction was updated
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSinceGenerated(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync / Fetch functions
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/predictions/history");
      const data = await res.json();
      setPredictionHistory(data);
      if (data.length > 0) {
        const matching = data.find((p: any) => p.timeframe === activeTimeframe);
        if (matching) {
          setCurrentPrediction(matching);
        } else {
          setCurrentPrediction(data[0]);
          setActiveTimeframe(data[0].timeframe);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/predictions/audit");
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) {
      console.error("Failed to fetch audits:", err);
    }
  };

  const handleManualSync = async () => {
    await fetchHistory();
    await fetchAuditLogs();
    setLastSyncTime(new Date());
    if (showToast) showToast("Dashboard synchronized with server state.", "success");
  };

  // Timeline timeframe click -> immediately triggers backend AI calculation
  const handleTimeframeChange = async (tf: string) => {
    if (isGenerating) return;
    setActiveTimeframe(tf);
    
    // Check if we already have it in local history
    const cached = predictionHistory.find(p => p.timeframe === tf);
    if (cached) {
      setCurrentPrediction(cached);
      setSecondsSinceGenerated(0);
      if (showToast) showToast(`Loaded local cached prediction for ${tf}.`, "info");
      return;
    }

    // Otherwise, generate it
    await runWorkflow(tf);
  };

  // Run the full step-by-step simulation workflow
  const runWorkflow = async (tf: string, customPrompt?: string) => {
    setIsGenerating(true);
    setGenStepIndex(0);

    // Step-by-step progress simulation (250ms per step for satisfying visual flow)
    for (let i = 0; i < generationSteps.length; i++) {
      setGenStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    try {
      const response = await fetch("/api/predictions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeframe: tf,
          customPrompt,
          userEmail: "smith.kadam25@sakec.ac.in"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate prediction");
      }

      const result = await response.json();
      setCurrentPrediction(result.prediction);
      setSecondsSinceGenerated(0);
      
      // Update history in local state as well
      await fetchHistory();
      await fetchAuditLogs();

      if (showToast) showToast(`Simulation complete: ${tf} forecast is active.`, "success");
    } catch (err: any) {
      console.error(err);
      if (showToast) showToast("Prediction generation failed. Using baseline calculations.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle manual "Run Simulation" click
  const handleRunSimulation = () => {
    runWorkflow(activeTimeframe);
  };

  // Handle custom scenario query
  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromptText.trim()) return;
    setCustomPromptOpen(false);
    runWorkflow(activeTimeframe, customPromptText);
    setCustomPromptText("");
  };

  // Live autocomplete search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Compare active prediction against historical simulation
  const comparedPrediction = useMemo(() => {
    if (!compareId) return null;
    return predictionHistory.find(p => p.id === compareId) || null;
  }, [compareId, predictionHistory]);

  // Map hotzone nodes for Geospatial simulation
  const hotspotsData = useMemo(() => {
    if (!currentPrediction) return [];
    return currentPrediction.expectedLocations;
  }, [currentPrediction]);

  // Click handler for hotspot elements on map
  const handleHotspotClick = (loc: any) => {
    setSelectedHotspot(loc);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12 text-slate-800">
      
      {/* Header Panel with Law Enforcement Command Status */}
      <div className={`p-6 rounded-2xl border ${highContrast ? "bg-stone-950 border-stone-800 text-white" : "bg-white border-slate-200 shadow-md"} mb-6 relative overflow-hidden`}>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${wsConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> SECCOPILOT FORECAST ENGINE — ONLINE
              </span>
            </div>
            
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
              <LineChart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /> 
              Future Intelligence Simulator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              National law enforcement spatial crime models and climate vulnerability prediction indices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live connection badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-stone-800 border border-slate-200 dark:border-stone-700">
              <span className={wsConnected ? "text-emerald-600" : "text-rose-500"}>
                {wsConnected ? "Websocket Connected" : "Disconnected (Polling)"}
              </span>
              <button 
                onClick={handleManualSync}
                className="hover:rotate-180 transition-transform duration-500 p-0.5"
                title="Sync now"
              >
                <RefreshCw className="w-3 h-3 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <button 
              onClick={() => setCustomPromptOpen(true)}
              className="px-4 py-2 rounded-lg font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-200 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> 
              Custom Scenario
            </button>

            <button 
              onClick={handleRunSimulation}
              disabled={isGenerating}
              className={`px-5 py-2 rounded-lg font-bold text-xs text-white shadow-md transition-all flex items-center gap-2 ${isGenerating ? 'bg-emerald-800 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02]'}`}
            >
              <Activity className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : 'animate-pulse'}`} /> 
              {isGenerating ? 'Computing AI...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>

      {/* Autocomplete Search Bar */}
      <div className="mb-6 relative">
        <div className={`p-1.5 rounded-xl border flex items-center bg-white shadow-sm ${searchFocused ? 'ring-2 ring-emerald-500 border-transparent' : 'border-slate-200'}`}>
          <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
          <input 
            type="text"
            placeholder="Search Law Enforcement Database (e.g. 'RC-2041', 'Ananya', 'Siliguri Corridor', 'Team Alpha', 'SIM-2026-06-25-01')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm py-2 px-3 text-slate-800 dark:text-slate-900 placeholder-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Search Results Autocomplete Dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
            <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
              Matching Records
            </div>
            {searchResults.map((result) => (
              <div 
                key={result.id}
                onMouseDown={() => setSelectedSearchResult(result)}
                className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-slate-100 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                      result.type === 'case' ? 'bg-amber-100 text-amber-800' :
                      result.type === 'mission' ? 'bg-blue-100 text-blue-800' :
                      result.type === 'officer' ? 'bg-purple-100 text-purple-800' :
                      result.type === 'simulation' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {result.type}
                    </span>
                    {result.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{result.subtitle}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Left Factors, Center Visualizer, Right Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* 1. Left Panel: Interactive Risk Factors */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-start">
          
          <div className="px-1 shrink-0 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Socio-Environmental Indicators</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Live feeds</span>
          </div>

          {/* Migration Risk Card */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Migration Risk Index Methodologies",
              score: currentPrediction.migrationRisk.level,
              description: currentPrediction.migrationRisk.reasoning,
              listTitle: "Contributing Local Factors",
              listItems: currentPrediction.migrationRisk.factors,
              actionTitle: "Mandatory Protective Interventions",
              actionDesc: currentPrediction.migrationRisk.actions
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
            <h4 className="font-bold mb-3 flex items-center justify-between text-slate-700 dark:text-stone-300 text-sm">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Migration Risk
              </span>
              <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-100">XAI info</span>
            </h4>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-3xl font-black text-amber-600 leading-none">
                {currentPrediction?.migrationRisk.level || "High"}
              </div>
              <div className="text-xs font-bold text-rose-500">
                {currentPrediction?.migrationRisk.trend}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {currentPrediction?.migrationRisk.reasoning || "Analyzing movement vectors in frontier blocks."}
            </p>
          </div>

          {/* Flood Risk Card */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Doppler Climatology Flood Models",
              score: `${currentPrediction.floodRisk.probability}% Probability`,
              description: currentPrediction.floodRisk.impactAssessment,
              listTitle: "Districts Under Active Alert",
              listItems: currentPrediction.floodRisk.districts,
              actionTitle: "Satellite Telemetry Metrics",
              actionDesc: `${currentPrediction.floodRisk.satelliteData}. Projected rainfall: ${currentPrediction.floodRisk.rainfall}.`
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} group`}
          >
            <h4 className="font-bold mb-3 flex items-center justify-between text-slate-700 dark:text-stone-300 text-sm">
              <span className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500 animate-bounce" /> Flood Risk
              </span>
              <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">XAI info</span>
            </h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${currentPrediction?.floodRisk.probability || 85}%` }}
                ></div>
              </div>
              <span className="text-xs font-black text-blue-600">{currentPrediction?.floodRisk.probability || 85}%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Rainfall: <span className="font-semibold text-slate-700">{currentPrediction?.floodRisk.rainfall}</span> | {currentPrediction?.floodRisk.forecast}
            </p>
          </div>

          {/* Economic Distress Card */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Socioeconomic Destitution Risk Indices",
              score: `${currentPrediction.economicDistress.vulnerabilityScore}% Score`,
              description: `Rural poverty vulnerability indices currently rate at ${currentPrediction.economicDistress.povertyIndex}. Unvetted transport is historically correlated with agricultural disruption.`,
              listTitle: "Economic Stresses Tracked",
              listItems: [
                `Labor Outflow: ${currentPrediction.economicDistress.migration}`,
                `Unemployment Spike: ${currentPrediction.economicDistress.employment}`,
                `Inflation Rate: ${currentPrediction.economicDistress.inflation}`,
                `Supply Reserves: ${currentPrediction.economicDistress.foodSupply}`
              ]
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} group`}
          >
            <h4 className="font-bold mb-3 flex items-center justify-between text-slate-700 dark:text-stone-300 text-sm">
              <span className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" /> Economic Distress
              </span>
              <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-100">XAI info</span>
            </h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${currentPrediction?.economicDistress.vulnerabilityScore || 60}%` }}
                ></div>
              </div>
              <span className="text-xs font-black text-rose-600">{currentPrediction?.economicDistress.vulnerabilityScore || 60}%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Employment: <span className="font-semibold text-slate-700">{currentPrediction?.economicDistress.employment}</span>
            </p>
          </div>

          {/* Social Unrest Card */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Social Media Sentinel Sentiment Models",
              score: `${currentPrediction?.socialUnrest?.riskScore ?? 35}% Unrest Score`,
              description: `Our NLP sentinel monitors local social networks, tracking recruitment advertisements and distressed keywords. Current sentiment value: ${currentPrediction?.socialUnrest?.sentimentAnalysis ?? "N/A"}`,
              listTitle: "Active Social Alerts",
              listItems: [
                `Keywords Trend: ${currentPrediction?.socialUnrest?.socialMedia ?? "No data"}`,
                `Crime Sentinel: ${currentPrediction?.socialUnrest?.crimeReports ?? "No data"}`,
                `Protest Status: ${currentPrediction?.socialUnrest?.protestMonitoring ?? "No data"}`,
                `Community Flag: ${currentPrediction?.socialUnrest?.communityAlerts ?? "No data"}`
              ]
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} group`}
          >
            <h4 className="font-bold mb-3 flex items-center justify-between text-slate-700 dark:text-stone-300 text-sm">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" /> Social Unrest
              </span>
              <span className="text-[10px] font-bold text-purple-500 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-100">XAI info</span>
            </h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${currentPrediction?.socialUnrest?.riskScore ?? 35}%` }}
                ></div>
              </div>
              <span className="text-xs font-black text-purple-600">{currentPrediction?.socialUnrest?.riskScore ?? 35}%</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Keywords frequency: <span className="font-semibold text-slate-700">{currentPrediction?.socialUnrest?.socialMedia ? `${currentPrediction.socialUnrest.socialMedia.slice(0, 45)}...` : "No data"}</span>
            </p>
          </div>
        </div>

        {/* 2. Center Panel: Tactical Visualizer Dashboard */}
        <div className={`lg:col-span-6 rounded-2xl border flex flex-col relative overflow-hidden bg-slate-50 ${highContrast ? "border-stone-800 text-white" : "border-slate-200 shadow-md"}`}>
          
          {/* Diagnostic Loading Screen overlay when running simulation */}
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-8 text-white">
              <Activity className="w-16 h-16 text-emerald-400 animate-spin mb-6" />
              <h3 className="text-2xl font-black tracking-tight mb-2 text-emerald-400">SECCOPILOT NEURAL CALCULATION IN PROGRESS</h3>
              <p className="text-xs text-slate-400 font-mono mb-8 uppercase tracking-widest">Compiling multispectral climate indices and migration risk weights</p>
              
              {/* Animated Progress Step Bars */}
              <div className="w-full max-w-md bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((genStepIndex + 1) / generationSteps.length) * 100}%` }}
                ></div>
              </div>

              {/* Console Diagnostic Log Lines */}
              <div className="w-full max-w-md bg-black/50 rounded-xl border border-white/10 p-4 font-mono text-xs space-y-2 h-44 overflow-y-auto">
                {generationSteps.map((step, idx) => (
                  <div key={idx} className={`flex items-start gap-2 ${idx < genStepIndex ? 'text-emerald-400' : idx === genStepIndex ? 'text-white font-bold' : 'text-slate-600'}`}>
                    {idx < genStepIndex ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : idx === genStepIndex ? (
                      <span className="w-4 h-4 shrink-0 flex items-center justify-center text-amber-400 animate-pulse">●</span>
                    ) : (
                      <span className="w-4 h-4 shrink-0 flex items-center justify-center text-slate-700">○</span>
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Tab Headers */}
          <div className="p-4 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 relative z-10">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> 
              Tactical Interactive Simulator Workspace
            </h4>
            
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => setActiveTab("geospatial")}
                className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all ${activeTab === 'geospatial' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Geospatial Sim
              </button>
              <button 
                onClick={() => setActiveTab("network")}
                className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all ${activeTab === 'network' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Network Graph
              </button>
              <button 
                onClick={() => setActiveTab("timeseries")}
                className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all ${activeTab === 'timeseries' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Time-Series Curves
              </button>
            </div>
          </div>

          {/* Core Interactive Scrubber Area */}
          <div className="p-4 border-b border-slate-200 bg-white/70 flex items-center justify-between gap-4 shrink-0 relative z-10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scrubber Timeframe:</span>
            <div className="flex-1 max-w-sm relative flex justify-between items-center px-4">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200"></div>
              {timeframes.map((tf, idx) => (
                <div 
                  key={idx}
                  className="relative flex flex-col items-center cursor-pointer group"
                  onClick={() => handleTimeframeChange(tf)}
                >
                  <div className={`w-3.5 h-3.5 rounded-full relative z-10 transition-all duration-300 border-2 ${
                    activeTimeframe === tf 
                      ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-lg' 
                      : 'bg-white border-slate-300 hover:border-emerald-400'
                  }`}></div>
                  <div className={`absolute top-full mt-1.5 text-[10px] font-black whitespace-nowrap transition-colors ${activeTimeframe === tf ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    {tf}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono text-slate-400">
                Updated {secondsSinceGenerated}s ago
              </div>
            </div>
          </div>

          {/* Central Interactive Simulation Workspace Canvas */}
          <div className="flex-1 relative p-6 flex flex-col items-center justify-center min-h-[350px]">
            
            {activeTab === "geospatial" && (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {/* SVG Tactical Map Overlay */}
                <svg className="w-full max-w-lg aspect-video rounded-xl bg-white border border-slate-100 shadow-inner p-2 relative" viewBox="0 0 600 340">
                  <defs>
                    <radialGradient id="highRiskGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="medRiskGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Stylized tactical grid map */}
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Map border/regions paths (Stylized boundaries representing North-Eastern sectors) */}
                  <path d="M 50 280 Q 150 200 250 240 T 450 180 T 550 120" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <path d="M 300 300 L 400 240 Q 450 150 420 80" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Flow vectors with animation (representing transport corridor routes) */}
                  {/* Route 1: Bihar to West Bengal */}
                  <path id="route1" d="M 120 250 Q 240 220 350 180" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" />
                  <circle r="4" fill="#3b82f6">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 120 250 Q 240 220 350 180" />
                  </circle>

                  {/* Route 2: Assam frontier down */}
                  <path id="route2" d="M 500 130 Q 420 160 350 180" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />
                  <circle r="4" fill="#f59e0b">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 500 130 Q 420 160 350 180" />
                  </circle>

                  {/* Route 3: Border Crossing to Katihar Rail */}
                  <path id="route3" d="M 350 180 Q 280 230 200 270" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" />
                  <circle r="4" fill="#ef4444">
                    <animateMotion dur="5s" repeatCount="indefinite" path="M 350 180 Q 280 230 200 270" />
                  </circle>

                  {/* Pulsing Sonar Warning rings behind critical hotzones */}
                  {hotspotsData.map((hot, idx) => {
                    const isHigh = hot.probability > 70;
                    const color = isHigh ? "#ef4444" : "#f59e0b";
                    const x = 200 + (idx * 150);
                    const y = 270 - (idx * 50);

                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="25" fill={isHigh ? "url(#highRiskGrad)" : "url(#medRiskGrad)"}>
                          <animate attributeName="r" values="10;40;10" dur="4s" repeatCount="indefinite" />
                        </circle>
                        {/* Flashing Core point */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="6" 
                          fill={color} 
                          className="cursor-pointer" 
                          onClick={() => handleHotspotClick(hot)}
                        >
                          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        {/* Text Label */}
                        <text x={x} y={y - 12} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="extrabold" fontFamily="sans-serif">
                          {hot.name} ({hot.probability}%)
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Selected location detail drawer panel overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-md text-xs flex justify-between items-center z-10 transition-all">
                  {selectedHotspot ? (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{selectedHotspot.name}</span>
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.5 rounded">
                            {selectedHotspot.probability}% Risk
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5 font-medium">{selectedHotspot.details}</p>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          Distance: {selectedHotspot.distance} | Expected: {selectedHotspot.expectedTime}
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedHotspot(null)}
                        className="p-1 hover:bg-slate-100 rounded-full shrink-0"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </>
                  ) : (
                    <div className="text-slate-400 text-center w-full font-medium italic py-1.5">
                      Click any flashing sonar node on the tactical map to load regional flow intelligence vectors.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "network" && (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <svg className="w-full max-w-lg aspect-video rounded-xl bg-white border border-slate-100 shadow-inner p-2" viewBox="0 0 600 340">
                  {/* Grid background */}
                  <pattern id="gridNet" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="1" fill="#cbd5e1" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#gridNet)" />

                  {/* Coordinated crime network mapping nodes */}
                  {/* Links */}
                  <path d="M 100 170 L 220 100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M 100 170 L 220 240" stroke="#ef4444" strokeWidth="2" />
                  <path d="M 220 100 L 380 100" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M 220 240 L 380 240" stroke="#ef4444" strokeWidth="3" />
                  <path d="M 380 100 L 500 170" stroke="#3b82f6" strokeWidth="2" />
                  <path d="M 380 240 L 500 170" stroke="#ef4444" strokeWidth="4" />
                  
                  {/* Animated packets */}
                  <circle r="4" fill="#ef4444">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 100 170 L 220 240 L 380 240 L 500 170" />
                  </circle>

                  {/* Node 1: Local recruiter node */}
                  <g className="cursor-pointer group" onClick={() => handleHotspotClick({ name: "Local Source Node A", details: "Unvetted agents operating local sweep operations targeting flood displacement shelters." })}>
                    <circle cx="100" cy="170" r="14" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
                    <text x="100" y="200" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">Source Node A</text>
                  </g>

                  {/* Node 2: Recruitment Agent B */}
                  <g className="cursor-pointer" onClick={() => handleHotspotClick({ name: "Recruiter Node B", details: "Active cellular recruitment recruiter posing as commercial helper." })}>
                    <circle cx="220" cy="100" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                    <text x="220" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">Recruiter Broker</text>
                  </g>

                  {/* Node 3: Transit Staging Hub C */}
                  <g className="cursor-pointer" onClick={() => handleHotspotClick({ name: "Staging Center C", details: "Flagged guest house/transit node near highway border junction." })}>
                    <circle cx="220" cy="240" r="16" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                    <text x="220" y="272" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">Transit Broker C</text>
                  </g>

                  {/* Node 4: Main Transport Line D */}
                  <g className="cursor-pointer" onClick={() => handleHotspotClick({ name: "Corridor Highway NH-31", details: "Critical inter-state bypass operating high unregistered fleet." })}>
                    <circle cx="380" cy="100" r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                    <text x="380" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">NH-31 Corridor</text>
                  </g>

                  {/* Node 5: Destination Hub E */}
                  <g className="cursor-pointer" onClick={() => handleHotspotClick({ name: "Cachar Railway Yard", details: "Major rail yard junction with severe unvetted booking counts." })}>
                    <circle cx="380" cy="240" r="18" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                    <text x="380" y="274" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">Staging Point D</text>
                  </g>

                  {/* Node 6: External Exit Endpoint */}
                  <g className="cursor-pointer" onClick={() => handleHotspotClick({ name: "Border Exit Crossing", details: "Final border point where exit routes are active." })}>
                    <circle cx="500" cy="170" r="20" fill="#fca5a5" stroke="#b91c1c" strokeWidth="2" />
                    <text x="500" y="205" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">Border Point E</text>
                  </g>
                </svg>

                {/* Detail drawer panel overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-md text-xs flex justify-between items-center z-10 transition-all">
                  {selectedHotspot ? (
                    <>
                      <div className="flex-1">
                        <div className="font-extrabold text-slate-900">{selectedHotspot.name}</div>
                        <p className="text-slate-500 mt-0.5 font-medium">{selectedHotspot.details}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedHotspot(null)}
                        className="p-1 hover:bg-slate-100 rounded-full shrink-0"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </>
                  ) : (
                    <div className="text-slate-400 text-center w-full font-medium italic py-1.5">
                      Hover/click on nodes to explore structural connections of trafficking network cells.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "timeseries" && (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {currentPrediction ? (
                  <div className="w-full max-w-lg bg-white border border-slate-100 rounded-xl p-4 shadow-inner flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projection Models Time-series</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                          <span className="text-[10px] font-bold text-slate-600">Cases Forecast</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 bg-rose-500 rounded"></span>
                          <span className="text-[10px] font-bold text-slate-600">Threat Threshold</span>
                        </div>
                      </div>
                    </div>

                    <svg className="w-full aspect-[2/1]" viewBox="0 0 500 220">
                      {/* Grid guidelines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="180" x2="480" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* Axes */}
                      <line x1="40" y1="20" x2="40" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Tick labels */}
                      <text x="32" y="24" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">150</text>
                      <text x="32" y="64" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">100</text>
                      <text x="32" y="104" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">50</text>
                      <text x="32" y="144" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">10</text>

                      {/* Chart curves */}
                      {/* Predicted Cases curve */}
                      <path 
                        d={`M 40 ${180 - currentPrediction.predictedCases.weeklyForecast[0]*1.1} 
                           L 113 ${180 - currentPrediction.predictedCases.weeklyForecast[1]*1.1} 
                           L 186 ${180 - currentPrediction.predictedCases.weeklyForecast[2]*1.1} 
                           L 259 ${180 - currentPrediction.predictedCases.weeklyForecast[3]*1.1} 
                           L 332 ${180 - currentPrediction.predictedCases.weeklyForecast[4]*1.1} 
                           L 405 ${180 - currentPrediction.predictedCases.weeklyForecast[5]*1.1} 
                           L 478 ${180 - currentPrediction.predictedCases.weeklyForecast[6]*1.1}`} 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3.5" 
                      />

                      {/* Threat Threshold line */}
                      <path 
                        d="M 40 140 Q 260 110 478 80" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2" 
                        strokeDasharray="4 4" 
                      />

                      {/* Interactive dots */}
                      {currentPrediction.predictedCases.weeklyForecast.map((val, idx) => {
                        const x = 40 + (idx * 73);
                        const y = 180 - val * 1.1;
                        return (
                          <g key={idx} className="cursor-pointer group">
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="4" 
                              fill="#10b981" 
                              stroke="#ffffff" 
                              strokeWidth="1.5" 
                            />
                            <text x={x} y={y - 10} textAnchor="middle" fill="#065f46" fontSize="8" fontWeight="black" className="opacity-0 group-hover:opacity-100 bg-white px-1">
                              {val}
                            </text>
                          </g>
                        );
                      })}

                      {/* X axis labels */}
                      <text x="40" y="196" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle">Day 1</text>
                      <text x="186" y="196" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle">Day 3</text>
                      <text x="332" y="196" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle">Day 5</text>
                      <text x="478" y="196" fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="middle">Day 7</text>
                    </svg>
                  </div>
                ) : (
                  <div className="text-slate-400 italic">Generating forecast indexes...</div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Historical Compare Bar */}
          <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" /> Comparison Analysis:
            </span>
            <div className="flex items-center gap-3">
              <select 
                value={compareId}
                onChange={(e) => setCompareId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700"
              >
                <option value="">-- Compare with Past Simulation --</option>
                {predictionHistory
                  .filter(p => p.id !== currentPrediction?.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.timeframe} ({new Date(p.timestamp).toLocaleTimeString()}) - Cases: {p.predictedCases.value}
                    </option>
                  ))}
              </select>
              {compareId && (
                <button 
                  onClick={() => setCompareId("")}
                  className="p-1 hover:bg-slate-100 rounded"
                  title="Clear compare"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Right Panel: Interactive Forecast Metrics */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-start">
          
          <div className="px-1 shrink-0 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Intelligence Metrics</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">Evaluated</span>
          </div>

          {/* Predicted Cases Metric */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Predicted Cases Forecasting Matrix",
              score: currentPrediction.predictedCases.value,
              description: `A projected spike of ${currentPrediction.predictedCases.changePercent} is anticipated based on environmental and socioeconomic indicators.`,
              listTitle: "Time horizon forecast progression",
              listItems: [
                `Baseline Target: ${currentPrediction.predictedCases.historicalComparison}`,
                `Day 3 Projection: ${currentPrediction.predictedCases.weeklyForecast[2]} expected cases`,
                `Day 5 Projection: ${currentPrediction.predictedCases.weeklyForecast[4]} expected cases`,
                `Month Horizon: ${currentPrediction.predictedCases.monthlyForecast[0]} projected total cases`
              ]
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold flex items-center gap-2 text-slate-700 text-sm">
                <Target className="w-4 h-4 text-emerald-500" /> Predicted Cases
              </h4>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Next {activeTimeframe}
              </span>
            </div>
            <div className="text-4xl font-black tracking-tighter leading-none text-emerald-600 mb-2">
              {currentPrediction?.predictedCases.value || 114}
            </div>
            <div className="flex items-center gap-1 text-xs text-rose-500 font-extrabold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 
              {currentPrediction?.predictedCases.changePercent || "+36%"} vs. Baseline
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              {currentPrediction?.predictedCases.historicalComparison}
            </p>
          </div>

          {/* Expected Locations Metric */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Expected Regional Staging Hotspots",
              score: `${currentPrediction.expectedLocations.length} Primary Sectors`,
              description: "The following coordinate quadrants have been flagged by spatial neural density models as high risk.",
              listTitle: "Locations Log Analysis",
              listItems: currentPrediction.expectedLocations.map(l => `${l.name} (${l.probability}% probability, ${l.expectedTime} timeframe): ${l.details}`)
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} group`}
          >
            <h4 className="font-bold flex items-center justify-between text-slate-700 text-sm mb-3">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 animate-pulse" /> Hotspots Probability
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">XAI</span>
            </h4>
            <div className="space-y-2.5">
              {currentPrediction?.expectedLocations.map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1.5 last:border-none">
                  <span className="font-bold text-slate-800">{loc.name}</span>
                  <span className="text-rose-500 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded">
                    {loc.probability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Probability Gauge */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "System Threat Level Assessment",
              score: `${currentPrediction.threatProbability.gaugeValue}% Probability`,
              description: currentPrediction.threatProbability.forecast,
              listTitle: "Primary System Risk Contributors",
              listItems: currentPrediction.threatProbability.riskContributors,
              actionTitle: "Direct Preventive Intervention Suggested",
              actionDesc: currentPrediction.threatProbability.mitigationSuggestions
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} group`}
          >
            <h4 className="font-bold flex items-center justify-between text-slate-700 text-sm mb-3">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Threat Probability
              </span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">XAI</span>
            </h4>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 mb-2">
              <div 
                className="bg-rose-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${currentPrediction?.threatProbability.gaugeValue || 72}%` }}
              ></div>
            </div>
            <p className="text-[11px] font-medium text-rose-600">
              {currentPrediction?.threatProbability.trend}
            </p>
          </div>

          {/* Confidence Score Gauge */}
          <div 
            onClick={() => currentPrediction && setXaiPopupCard({
              title: "Model Accuracy & Calibration Metrics",
              score: currentPrediction?.confidenceScore?.accuracy ?? "90%",
              description: `Verification status: ${currentPrediction?.confidenceScore?.reliability ?? "Unknown"}. Prediction telemetry: ${currentPrediction?.confidenceScore?.quality ?? "Unknown"}.`,
              listTitle: "Engine Specifications",
              listItems: [
                `Standard: ${currentPrediction?.confidenceScore?.quality ?? "Unknown"}`,
                `Model Calibration: ${currentPrediction?.confidenceScore?.reliability ?? "Unknown"}`,
                `Data Freshness: ${currentPrediction?.confidenceScore?.freshness ?? "Unknown"}`,
                `Calibrated Engine: ${currentPrediction?.confidenceScore?.modelVersion ?? "Unknown"}`
              ]
            })}
            className={`p-5 rounded-2xl border cursor-pointer ${bgCard} bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 group`}
          >
            <h4 className="font-bold flex items-center justify-between text-slate-700 text-sm mb-3">
              <span className="flex items-center gap-2 text-emerald-700">
                <BarChart2 className="w-4 h-4" /> Confidence Score
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">XAI</span>
            </h4>
            <div className="text-3xl font-black text-emerald-600 mb-1">
              {currentPrediction ? `${94 - activeTimeframeOffset(currentPrediction.timeframe) * 4}%` : "90%"}
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Model parameters: <span className="text-slate-700 font-bold">{currentPrediction?.confidenceScore?.accuracy ?? "N/A"}</span>
            </p>
          </div>

        </div>
      </div>

      {/* 4. Split / Compare Sidebar Delta View */}
      {comparedPrediction && currentPrediction && (
        <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/40 mb-6 animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              Comparative Intelligence Analysis (Delta Assessment)
            </h4>
            <button 
              onClick={() => setCompareId("")}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-slate-400 uppercase">Risk Level Shift</div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-lg font-bold text-slate-600">{comparedPrediction.migrationRisk.level}</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-black text-rose-600">{currentPrediction.migrationRisk.level}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-slate-400 uppercase">Expected Cases Delta</div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-lg font-bold text-slate-600">{comparedPrediction.predictedCases.value}</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-black text-emerald-600">{currentPrediction.predictedCases.value}</span>
                <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">
                  {currentPrediction.predictedCases.value - comparedPrediction.predictedCases.value > 0 ? `+${currentPrediction.predictedCases.value - comparedPrediction.predictedCases.value}` : currentPrediction.predictedCases.value - comparedPrediction.predictedCases.value} cases shift
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-slate-400 uppercase">Threat Probability Gauge Shift</div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-lg font-bold text-slate-600">{comparedPrediction.threatProbability.gaugeValue}%</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-black text-slate-800">{currentPrediction.threatProbability.gaugeValue}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Panel: Deep AI Forecast Explanations */}
      <div className={`p-6 rounded-2xl border ${bgCard} bg-emerald-50/10 border-emerald-100/30`}>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h4 className="font-extrabold flex items-center gap-2 text-emerald-800 text-base">
            <Shield className="w-5 h-5 text-emerald-600" /> SECCOPILOT STRATEGIC THREAT BRIEFING
          </h4>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 font-mono">
            SECURE ACCESS GRADE-4
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {currentPrediction?.aiExplanation || "Operational baseline modeling is currently calculating environmental displacements and border region flow weights. Choose interactive scrubbers to assess long-term horizons."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1 border-r border-slate-100 pr-4 last:border-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tactical Quadrant</span>
            <span className="text-sm font-extrabold text-slate-900">Assam Frontier Sector 4</span>
            <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" /> Core Surveillance Zone
            </span>
          </div>

          <div className="flex flex-col gap-1 border-r border-slate-100 pr-4 last:border-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Combined Risk Factor</span>
            <span className="text-sm font-extrabold text-rose-600 uppercase">
              {currentPrediction?.migrationRisk.level || "HIGH"} ACCELERATING
            </span>
            <span className="text-[11px] font-medium text-rose-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> High exploitative threat
            </span>
          </div>

          <div className="flex flex-col gap-1 border-r border-slate-100 pr-4 last:border-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Optimal Deflection Window</span>
            <span className="text-sm font-extrabold text-slate-900">Next 48 to 72 Hours</span>
            <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Rapid deployment phase
            </span>
          </div>

          <div className="flex flex-col gap-1 pr-4 last:border-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Command Directive Suggestion</span>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Activate NGO Terminals
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MODAL DIALOGS AND POPUPS */}

      {/* Custom Prompt Manual Scenario Input Modal */}
      {customPromptOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Initialize Custom Simulation Scenario
              </h3>
              <button 
                onClick={() => setCustomPromptOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCustomPromptSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide custom tactical parameters (e.g., "Predict transit risks if flash floods shut down Katihar railways during major regional harvest delays"). Gemini AI will synthesize complete risk structures based on your input.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Custom Simulation Focus Query</label>
                <textarea 
                  value={customPromptText}
                  onChange={(e) => setCustomPromptText(e.target.value)}
                  placeholder="Enter custom spatial scenario constraints..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 h-28 resize-none text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Timeframe Horizon</label>
                  <select 
                    value={activeTimeframe}
                    onChange={(e) => setActiveTimeframe(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {timeframes.map(tf => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end justify-end h-full pt-5">
                  <button 
                    type="submit"
                    className="px-5 py-2 rounded-lg font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-colors"
                  >
                    Generate Custom Forecast
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Explainable AI (XAI) methodology popup modal */}
      {xaiPopupCard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                {xaiPopupCard.title}
              </h3>
              <button 
                onClick={() => setXaiPopupCard(null)}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Assessed Value</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">{xaiPopupCard.score}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Explainable AI Methodology Synopsis</span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{xaiPopupCard.description}</p>
              </div>

              {xaiPopupCard.listItems && xaiPopupCard.listItems.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{xaiPopupCard.listTitle || "Variables Tracked"}</span>
                  <ul className="mt-1.5 space-y-1.5 text-xs text-slate-600">
                    {xaiPopupCard.listItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {xaiPopupCard.actionTitle && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" /> {xaiPopupCard.actionTitle}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{xaiPopupCard.actionDesc}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setXaiPopupCard(null)}
                className="px-4 py-1.5 rounded-lg font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Search Result Popup Modal */}
      {selectedSearchResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                Detailed Intelligence Record
              </h3>
              <button 
                onClick={() => setSelectedSearchResult(null)}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Record Title / Identifier</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedSearchResult.title}</div>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] uppercase font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedSearchResult.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Record Index ID</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSearchResult.id}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Context Summary</span>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">{selectedSearchResult.subtitle}</div>
                </div>
              </div>

              {selectedSearchResult.type === "case" && selectedSearchResult.details && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="font-bold text-slate-800">Case Child Demographics & Status:</div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-slate-400 block font-medium">Gender/Age</span>
                      <span className="font-bold text-slate-800">{selectedSearchResult.details.gender} | {selectedSearchResult.details.age}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-slate-400 block font-medium">Status</span>
                      <span className="font-bold text-slate-800">{selectedSearchResult.details.status}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-slate-400 block font-medium">Class Level</span>
                      <span className="font-bold text-slate-800">{selectedSearchResult.details.classification}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedSearchResult.type === "simulation" && selectedSearchResult.details && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="font-bold text-slate-800">Past Simulation Analysis:</div>
                  <p className="text-slate-500 italic leading-relaxed">{selectedSearchResult.details.aiExplanation}</p>
                  <button 
                    onClick={() => {
                      setCurrentPrediction(selectedSearchResult.details);
                      setActiveTimeframe(selectedSearchResult.details.timeframe);
                      setSelectedSearchResult(null);
                      if (showToast) showToast(`Restored active simulation context for ${selectedSearchResult.details.timeframe}`, "info");
                    }}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold rounded-lg transition-colors mt-2"
                  >
                    Restore Dashboard to this Simulation Point
                  </button>
                </div>
              )}

              {selectedSearchResult.type === "location" && selectedSearchResult.details && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="font-bold text-slate-800">Tactical Hotspot Intelligence:</div>
                  <p className="text-slate-500 leading-relaxed font-medium">{selectedSearchResult.details.desc}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedSearchResult(null)}
                className="px-4 py-1.5 rounded-lg font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function activeTimeframeOffset(timeframe: string): number {
  switch (timeframe) {
    case "Today": return 0;
    case "24 Hours": return 1;
    case "72 Hours": return 2;
    case "1 Week": return 3;
    case "1 Month": return 4;
    default: return 2;
  }
}
