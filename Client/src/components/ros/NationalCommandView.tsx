import React, { useState, useEffect } from "react";
import { 
  Shield, MapPin, AlertCircle, CheckCircle2, Users, Activity, Globe, RefreshCw, 
  ChevronRight, Bell, Search, ArrowUpRight, TrendingUp, Radio, AlertTriangle, 
  Sparkles, Layers, Info, Check, Eye
} from "lucide-react";
import { useRosStore } from "../../lib/rosStore";

interface NationalCommandViewProps {
  highContrast?: boolean;
}

export default function NationalCommandView({ highContrast }: NationalCommandViewProps) {
  // Layers state
  const [activeLayer, setActiveLayer] = useState<"Safe" | "Watchlist" | "HighRisk" | "ActiveRescue" | "NetworkClusters" | "Emergency" | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    dashboard: liveMetricsFromStore, 
    recoveries: recentRecoveries, 
    majorCases, 
    states: stateRankings, 
    organizations: topTeams, 
    predictions, 
    networks: networkMutations,
    fetchRosData 
  } = useRosStore();

  useEffect(() => {
    fetchRosData();
  }, [fetchRosData]);

  const [liveMetrics, setLiveMetrics] = useState({
    missing: 481,
    recovered: 3819,
    networks: 41,
    riskDistricts: 18,
    activeSearches: 124,
    successRate: "94.2%",
    threatIndex: "M-4"
  });

  useEffect(() => {
    if (liveMetricsFromStore) {
      setLiveMetrics({
        missing: liveMetricsFromStore.missingChildren,
        recovered: liveMetricsFromStore.recoveredChildren,
        networks: liveMetricsFromStore.networksDetected,
        riskDistricts: liveMetricsFromStore.riskDistricts,
        activeSearches: liveMetricsFromStore.activeSearches,
        successRate: liveMetricsFromStore.rescueSuccessRate,
        threatIndex: liveMetricsFromStore.threatIndex
      });
    }
  }, [liveMetricsFromStore]);

  // Derive predictions
  const migrationRisks = predictions.map(p => ({ sector: p.targetState, index: p.riskFactors?.migrationRisk || 'Unknown', trend: p.forecastPeriod }));
  const predictedHotspots = predictions.map(p => ({ region: p.targetState, confidence: `${p.confidenceScore}%`, timeline: p.forecastPeriod }));

  // Interactive Layer Configurations for the Map Nodes
  const layers = [
    { id: "All", label: "All Layers", color: "text-stone-300" },
    { id: "Safe", label: "🟢 Safe Districts", color: "text-emerald-500" },
    { id: "Watchlist", label: "🟡 Watchlist Districts", color: "text-amber-500" },
    { id: "HighRisk", label: "🔴 High Risk Districts", color: "text-rose-500" },
    { id: "ActiveRescue", label: "🔵 Active Rescue Operations", color: "text-sky-500" },
    { id: "NetworkClusters", label: "🧬 Network Clusters", color: "text-purple-500" },
    { id: "Emergency", label: "⚠ Emergency Zones", color: "text-orange-500" },
  ];

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900 dark:text-stone-100";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white dark:bg-stone-900 border-gray-100 dark:border-stone-800";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500 dark:text-stone-400";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-200 dark:border-stone-800";

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* Immersive HUD Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-emerald-400 font-mono uppercase">
              🇮🇳 RAKSHAK OPERATING SYSTEM
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            National Command & Control Center
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right font-mono text-[10px] text-stone-500">
            <p>SURVEILLANCE LATENCY: <span className="text-emerald-400 font-bold">8ms</span></p>
            <p>SECURE SESSION ID: <span className="text-stone-350">ROS-9401-AX</span></p>
          </div>
          <span className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-xl font-bold uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Live National Uplink Active
          </span>
        </div>
      </div>

      {/* Top National Intelligence Bar (Interactive Dashboard Dashboard) */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {[
          { label: "Missing Active", val: liveMetrics.missing, change: "+2 today", color: "text-rose-400", bg: "bg-rose-950/20 border-rose-900/30" },
          { label: "Total Recovered", val: liveMetrics.recovered, change: "+17 cycle", color: "text-emerald-400", bg: "bg-emerald-950/20 border-emerald-900/30" },
          { label: "Networks Tracked", val: liveMetrics.networks, change: "2 Mutating", color: "text-purple-400", bg: "bg-purple-950/20 border-purple-900/30" },
          { label: "Risk Districts", val: liveMetrics.riskDistricts, change: "0 Warning", color: "text-amber-400", bg: "bg-amber-950/20 border-amber-900/30" },
          { label: "Active Searches", val: liveMetrics.activeSearches, change: "4 Dispatched", color: "text-sky-400", bg: "bg-sky-950/20 border-sky-900/30" },
          { label: "Rescue Success", val: liveMetrics.successRate, change: "+1.2% year", color: "text-teal-400", bg: "bg-teal-950/20 border-teal-900/30" },
          { label: "Threat Index", val: liveMetrics.threatIndex, change: "Moderate", color: "text-indigo-400", bg: "bg-indigo-950/20 border-indigo-900/30" }
        ].map((item, idx) => (
          <div key={idx} className={`p-3.5 rounded-xl border flex flex-col justify-between ${item.bg} bg-stone-950/40`}>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{item.label}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`text-xl font-black tracking-tight ${item.color}`}>{item.val}</span>
            </div>
            <span className="text-[9px] text-stone-400 font-mono mt-1">{item.change}</span>
          </div>
        ))}
      </div>

      {/* Tri-Panel Immersive Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: National Activity & Triage */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[520px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                National Activity
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Chronicle of live child protection corridor</p>
            </div>

            {/* Recent Recoveries */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex justify-between">
                <span>Recent Recoveries</span>
                <span className="text-emerald-500 text-[9px]">LIVE</span>
              </h4>
              <div className="space-y-2">
                {recentRecoveries.map((r, i) => (
                  <div key={r._id || i} className="p-2.5 bg-stone-950/50 rounded-xl border border-stone-900 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-stone-200">{r.child}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{r.sector}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 rounded font-mono font-bold uppercase">{r.status}</span>
                      <p className="text-[9px] text-stone-500 mt-1 font-mono">{r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Major Cases */}
            <div className="space-y-2.5 pt-2 border-t border-stone-900">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Major Active Cases</h4>
              <div className="space-y-1.5">
                {majorCases.map((c, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-stone-900/30 last:border-0">
                    <span className="text-stone-300 font-medium">{c.name}</span>
                    <span className="text-[9px] font-bold text-rose-450 uppercase bg-rose-950/30 border border-rose-900 px-1.5 py-0.5 rounded font-mono">{c.priority}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* State Rankings */}
            <div className="space-y-2.5 pt-2 border-t border-stone-900">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">State Response Rankings</h4>
              <div className="space-y-2">
                {stateRankings.map((st, i) => (
                <div key={st._id || i} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-800 transition-colors">
                  <span className={`text-sm font-bold ${textMain}`}>{st.name}</span>
                  <div className="text-right">
                    <p className={`text-sm font-bold text-emerald-400`}>{(st.recoveredCases / Math.max(1, st.missingCases) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
              </div>
            </div>

          </div>
        </div>

        {/* Center Panel: Massive SVG India Map Layout */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[520px] relative overflow-hidden`}>
            
            {/* Background elements */}
            <div className="absolute inset-0 bg-repeating-linear-to-r from-stone-500/5 to-stone-500/10 bg-[length:20px_20px] pointer-events-none" />
            
            {/* Top Bar Map Controls */}
            <div className="relative z-10 flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                  SITUATIONAL GEOGRAPHIC CORRIDORS
                </h3>
                <p className="text-[10px] text-stone-500 uppercase mt-0.5">Toggle surveillance overlays in real-time</p>
              </div>

              {/* Layers drop down / filter wrap */}
              <div className="flex flex-wrap gap-1">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={`px-2 py-1 rounded text-[9px] font-bold font-mono border transition-all cursor-pointer ${
                      activeLayer === layer.id 
                        ? "bg-white text-black border-white" 
                        : "bg-stone-950 text-stone-400 border-stone-850 hover:bg-stone-900"
                    }`}
                  >
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG India Grid Map Representation */}
            <div className="flex-1 flex items-center justify-center py-4 relative z-10">
              <svg viewBox="0 0 500 450" className="w-full h-full max-h-[380px] text-stone-600">
                {/* Geographic region lines */}
                <path d="M 120 80 L 150 60 L 220 70 L 240 120 L 260 160 L 220 220 L 200 280 L 180 340 L 170 380 L 160 420 L 150 380 L 130 320 L 110 240 L 100 160 L 120 80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <path d="M 220 70 L 280 90 L 320 110 L 340 150 L 380 180 L 410 160 L 440 180 L 420 220 L 380 240 L 340 220 L 300 200 L 260 160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                {/* Layer representation conditions */}

                {/* 🟢 Safe Districts */}
                {(activeLayer === "All" || activeLayer === "Safe") && (
                  <>
                    <g className="cursor-pointer group">
                      <circle cx="180" cy="350" r="14" className="fill-emerald-500/10 stroke-emerald-500/65 animate-pulse" />
                      <circle cx="180" cy="350" r="4" className="fill-emerald-400" />
                      <text x="195" y="353" className="text-[9px] fill-stone-400 font-mono">BENGALURU CORRIDOR (SAFE)</text>
                    </g>
                    <g className="cursor-pointer group">
                      <circle cx="140" cy="280" r="14" className="fill-emerald-500/10 stroke-emerald-500/65 animate-pulse" />
                      <circle cx="140" cy="280" r="4" className="fill-emerald-400" />
                      <text x="155" y="283" className="text-[9px] fill-stone-400 font-mono">GOA HQ</text>
                    </g>
                  </>
                )}

                {/* 🟡 Watchlist Districts */}
                {(activeLayer === "All" || activeLayer === "Watchlist") && (
                  <>
                    <g className="cursor-pointer group">
                      <circle cx="280" cy="180" r="16" className="fill-amber-500/10 stroke-amber-500/65 animate-pulse" />
                      <circle cx="280" cy="180" r="5" className="fill-amber-400" />
                      <text x="295" y="183" className="text-[9px] fill-stone-400 font-mono">PATNA WATCHLIST</text>
                    </g>
                    <g className="cursor-pointer group">
                      <circle cx="170" cy="120" r="16" className="fill-amber-500/10 stroke-amber-500/65 animate-pulse" />
                      <circle cx="170" cy="120" r="5" className="fill-amber-400" />
                      <text x="185" y="123" className="text-[9px] fill-stone-400 font-mono">JAIPUR JUNCTION</text>
                    </g>
                  </>
                )}

                {/* 🔴 High Risk Districts */}
                {(activeLayer === "All" || activeLayer === "HighRisk") && (
                  <>
                    <g className="cursor-pointer group">
                      <circle cx="400" cy="160" r="18" className="fill-rose-500/20 stroke-rose-500/80 animate-pulse" />
                      <circle cx="400" cy="160" r="5" className="fill-rose-500" />
                      <text x="310" y="150" className="text-[9px] fill-rose-450 font-mono font-bold">ASSAM BORDER (HIGH RISK)</text>
                    </g>
                  </>
                )}

                {/* 🔵 Active Rescue Operations */}
                {(activeLayer === "All" || activeLayer === "ActiveRescue") && (
                  <>
                    <g className="cursor-pointer group">
                      <circle cx="200" cy="90" r="15" className="fill-sky-500/20 stroke-sky-500/80" />
                      <line x1="200" y1="90" x2="240" y2="130" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" />
                      <circle cx="200" cy="90" r="4" className="fill-sky-400" />
                      <text x="215" y="93" className="text-[9px] fill-sky-400 font-mono font-bold">DELHI SECTOR 3 (RESCUE ACTIVE)</text>
                    </g>
                  </>
                )}

                {/* 🧬 Network Clusters */}
                {(activeLayer === "All" || activeLayer === "NetworkClusters") && (
                  <>
                    <g className="cursor-pointer group">
                      <circle cx="220" cy="230" r="22" className="fill-purple-500/10 stroke-purple-500/60 animate-pulse" />
                      <line x1="220" y1="230" x2="160" y2="210" stroke="#a855f7" strokeWidth="1" />
                      <circle cx="220" cy="230" r="6" className="fill-purple-500" />
                      <circle cx="160" cy="210" r="4" className="fill-purple-400" />
                      <text x="235" y="233" className="text-[9px] fill-purple-400 font-mono">CLUSTER G12 (MUTATING)</text>
                    </g>
                  </>
                )}

                {/* ⚠ Emergency Zones */}
                {(activeLayer === "All" || activeLayer === "Emergency") && (
                  <>
                    <g className="cursor-pointer group">
                      <polygon points="150,180 170,220 130,220" className="fill-orange-500/20 stroke-orange-500 animate-pulse" />
                      <text x="175" y="210" className="text-[9px] fill-orange-400 font-mono font-bold">⚠ MUMBAI DISPATCH ALERT</text>
                    </g>
                  </>
                )}
              </svg>
            </div>

            {/* Geographical Index Indicator */}
            <div className="relative z-10 bg-stone-950 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between text-[10px] font-mono">
              <span className="text-stone-500">ACTIVE OVERLAY GRID: <span className="text-white font-bold">{activeLayer.toUpperCase()}</span></span>
              <span className="text-emerald-400 font-bold">✓ SECURED ENCRYPTED CONNECTION</span>
            </div>

          </div>
        </div>

        {/* Right Panel: National Intelligence & Risks */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[520px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                National Intelligence
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Machine learning & predictive triage forecasts</p>
            </div>

            {/* Migration Risks */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Socio-Migration Risks</h4>
              {migrationRisks.map((mr, i) => (
                <div key={i} className="p-2.5 bg-stone-950/50 rounded-xl border border-stone-900 text-xs">
                  <div className="flex justify-between font-bold text-stone-300">
                    <span>{mr.sector}</span>
                    <span className="text-amber-400 font-mono">{mr.index}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 font-mono">{mr.trend}</p>
                </div>
              ))}
            </div>

            {/* Network Mutations */}
            <div className="space-y-2 pt-2 border-t border-stone-900">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Network Mutation Alerts</h4>
              {networkMutations.map((nm, i) => (
                <div key={nm._id || i} className="p-2.5 bg-stone-950/50 rounded-xl border border-purple-950/50 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-400 font-mono">{nm.clusterId}</span>
                    <span className="text-[9px] bg-purple-950/50 text-purple-400 px-1.5 py-0.5 rounded border border-purple-900">{nm.threatLevel}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono">Structure: {nm.growthStatus}</p>
                  <p className="text-[10px] text-stone-500 font-semibold">{nm.threatLevel}</p>
                </div>
              ))}
            </div>

            {/* Predicted Hotspots */}
            <div className="space-y-2 pt-2 border-t border-stone-900">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">AI Spot-Risk Predictions</h4>
              {predictedHotspots.map((ph, i) => (
                <div key={i} className="p-2.5 bg-stone-950/50 rounded-xl border border-stone-900 text-xs">
                  <div className="flex justify-between font-bold text-stone-300">
                    <span className="truncate max-w-[130px]">{ph.region}</span>
                    <span className="text-rose-400 font-mono font-black">{ph.confidence}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 font-mono">Forecasted Trigger: {ph.timeline}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panel: National Situation Report (Live Feed / Log / Analytics) */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-900/60 font-mono font-bold text-xs uppercase tracking-widest">
            RO-SITREP
          </span>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Hourly National Situation Report (COM-01)
            </h4>
            <p className="text-[10px] text-stone-500 mt-0.5 font-mono uppercase">Compiled automatically via secure micro-service network</p>
          </div>
        </div>

        {/* Real-time telemetry ticker */}
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono font-bold text-stone-400">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" /> 17 RECOVERED</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-purple-400 rounded-full" /> 2 MUTATIONS IDENTIFIED</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-amber-400 rounded-full" /> 4 HIGH-RISK ZONES</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-sky-400 rounded-full" /> 6 ACTIVE DISPATCHES</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-purple-400 rounded-full" /> 3 AI PREDICTIONS EXECUTED</span>
        </div>
      </div>

    </div>
  );
}
