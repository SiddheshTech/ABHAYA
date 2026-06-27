import React, { useState } from "react";
import { 
  Signal, MapPin, Search, Shield, Filter, ArrowUpRight, CheckCircle, Flame, 
  ChevronRight, Users, Bell, AlertCircle, Info, Calendar 
} from "lucide-react";
import { useRosStore } from "../../lib/rosStore";

interface LiveNationViewProps {
  highContrast?: boolean;
}

export default function LiveNationView({ highContrast }: LiveNationViewProps) {
  const [selectedState, setSelectedState] = useState<string>("Delhi-NCR");
  const [searchTerm, setSearchTerm] = useState("");
  const [trendRange, setTrendRange] = useState<"30D" | "90D" | "1Y" | "5Y">("90D");

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/95 border-stone-800 text-stone-100";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/85";
  const textMain = highContrast ? "text-yellow-300" : "text-white";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  const { states } = useRosStore();

  // Detailed state dataset for node matrix mapped from backend
  const stateNodes = states.map(s => ({
    name: s.name,
    missing: s.missingCases,
    recovered: s.recoveredCases,
    networks: s.networksDetected,
    riskIndex: s.riskIndex,
    operations: s.activeOperations,
    status: s.riskIndex.includes("Critical") ? "Critical Alert" : s.riskIndex.includes("High") ? "High Alert" : "Optimal"
  }));

  // Left panel data derived dynamically
  const bestPerforming = [...stateNodes]
    .sort((a, b) => b.recovered / (b.missing + b.recovered || 1) - a.recovered / (a.missing + a.recovered || 1))
    .slice(0, 3)
    .map(s => ({
      name: s.name,
      rating: `${(Math.random() * 5 + 90).toFixed(1)}%`,
      latency: `${Math.floor(Math.random() * 10) + 5} mins`
    }));

  // Right panel data derived dynamically
  const highestRisk = [...stateNodes]
    .filter(s => s.status !== "Optimal")
    .sort((a, b) => b.networks - a.networks)
    .slice(0, 3)
    .map(s => ({
      name: s.name,
      index: s.riskIndex,
      threat: `Elevated Network Activity (${s.networks} detected)`
    }));

  // Trend data for timeline
  const trends = {
    "30D": [40, 45, 38, 30, 24, 18],
    "90D": [85, 76, 64, 52, 42, 35],
    "1Y": [280, 250, 210, 180, 140, 124],
    "5Y": [1400, 1200, 950, 780, 560, 481]
  };

  const currentTrend = trends[trendRange];

  // Get active selected node profile
  const activeProfile = stateNodes.find(s => s.name === selectedState) || stateNodes[0];

  const filteredNodes = stateNodes.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* Immersive HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-orange-400 font-mono uppercase">
              LIVE SITUATIONAL AWARENESS GRID
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Live Nation Surveillance Node Center
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-stone-900 border border-stone-800 px-3.5 py-1.5 rounded-xl">
          <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Surveillance Node Sync: Active (24 States Synchronized)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: High Performance & Metrics */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Operational Excellence
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Top-performing state commands</p>
            </div>

            {/* Best Performing States */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">State Rescue Leaders</h4>
              {bestPerforming.map((bp, i) => (
                <div key={i} className="p-2.5 bg-stone-950/50 rounded-xl border border-stone-900 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-stone-200">{bp.name}</p>
                    <p className="text-[10px] text-stone-500 font-mono">Response Latency: {bp.latency}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">{bp.rating}</span>
                </div>
              ))}
            </div>

            {/* Fastest Recoveries Indicator */}
            <div className="p-3 bg-emerald-950/10 border border-emerald-900/40 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Rapid Triage Milestone
              </p>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Delhi-NCR Command registered and unified a recovery in <span className="text-white font-bold font-mono">9 minutes</span> flat from community watch trigger to rapid police dispatch.
              </p>
            </div>

          </div>
        </div>

        {/* Center Panel: Clickable State Node Grid Dashboard */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[440px]`}>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-850 pb-3">
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                  SURVEILLANCE NODE MATRIX
                </h3>
                <p className="text-[10px] text-stone-500 uppercase mt-0.5">Click any state node to access emergency log records</p>
              </div>

              {/* Filter search box */}
              <div className="relative w-full sm:w-40">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input 
                  type="text" 
                  placeholder="Filter state node..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-[11px] font-mono rounded bg-stone-950 border border-stone-850 text-white focus:outline-none placeholder-stone-600"
                />
              </div>
            </div>

            {/* Node Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-4">
              {filteredNodes.map((node) => (
                <div 
                  key={node.name}
                  onClick={() => setSelectedState(node.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                    selectedState === node.name 
                      ? "bg-white border-white text-black" 
                      : "bg-stone-950 border-stone-850 text-stone-300 hover:border-stone-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold truncate max-w-[80px]">{node.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      node.status === "Critical Alert" ? "bg-rose-500" :
                      node.status === "High Alert" ? "bg-amber-500" :
                      "bg-emerald-500"
                    }`} />
                  </div>

                  <div className="mt-3">
                    <span className="text-[9px] block uppercase font-mono tracking-widest opacity-60">Active Missing</span>
                    <span className="text-lg font-black font-mono leading-none">{node.missing}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Node Profile Deck */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono animate-in fade-in">
              <div className="col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-stone-900 pb-2 sm:pb-0 pr-2">
                <span className="text-[9px] text-stone-500 block uppercase font-bold">STATE DOMAIN</span>
                <span className="text-white font-black">{activeProfile.name}</span>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-stone-900 pb-2 sm:pb-0 pr-2">
                <span className="text-[9px] text-stone-500 block uppercase font-bold">MISSING</span>
                <span className="text-rose-400 font-bold">{activeProfile.missing} Cases</span>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-stone-900 pb-2 sm:pb-0 pr-2">
                <span className="text-[9px] text-stone-500 block uppercase font-bold">RECOVERED</span>
                <span className="text-emerald-400 font-bold">{activeProfile.recovered}</span>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-stone-900 pb-2 sm:pb-0 pr-2">
                <span className="text-[9px] text-stone-500 block uppercase font-bold">NETWORKS</span>
                <span className="text-purple-400 font-bold">{activeProfile.networks} Synced</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-500 block uppercase font-bold">ACTIVE DISPATCH</span>
                <span className="text-sky-400 font-bold">{activeProfile.operations}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel: Risk Vector Triage */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Vulnerability Core
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">High Threat State commands</p>
            </div>

            {/* High Risk Command Centers */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Active High-Risk Nodes</h4>
              {highestRisk.map((hr, i) => (
                <div key={i} className="p-2.5 bg-stone-950/50 rounded-xl border border-rose-950/40 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-200">{hr.name}</span>
                    <span className="text-rose-400 font-mono">{hr.index}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-mono">Catalyst: {hr.threat}</p>
                </div>
              ))}
            </div>

            {/* Emerging Threat Broadcast */}
            <div className="p-3 bg-rose-950/10 border border-rose-900/40 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-rose-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Sector-04 Dispatch Warning
              </p>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Assam Border region experiencing high-frequency child transit sightings. Immediate Watch Command escalation requested.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panel: Interactive Trend Timeline */}
      <div className={`p-5 rounded-2xl border ${bgCard} shadow-xl space-y-4`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-850 pb-3">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
              NATIONAL PROTECTION TREND TIMELINE
            </h3>
            <p className="text-[10px] text-stone-500 uppercase mt-0.5">Chronological progress evaluation of the child protection network</p>
          </div>

          {/* Range selectors */}
          <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-850 font-mono text-[10px]">
            {["30D", "90D", "1Y", "5Y"].map((r) => (
              <button
                key={r}
                onClick={() => setTrendRange(r as any)}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                  trendRange === r ? "bg-white text-black" : "text-stone-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Graphic representation */}
        <div className="flex items-end justify-between h-24 gap-3 px-4 pt-4 relative">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-stone-800" />
          {currentTrend.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div 
                className="w-full bg-orange-500 rounded-t-sm transition-all group-hover:bg-orange-400 relative" 
                style={{ height: `${(val / Math.max(...currentTrend)) * 100}%` }} 
              >
                <span className="absolute -top-6 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-stone-950 text-orange-400 text-[9px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-stone-850">
                  {val}
                </span>
              </div>
              <span className="text-[9px] font-bold text-stone-500 font-mono">CYCLE-0{idx+1}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
