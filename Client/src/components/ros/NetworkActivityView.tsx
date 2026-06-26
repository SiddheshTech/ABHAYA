import React, { useState } from "react";
import { 
  GitBranch, ShieldAlert, Zap, Orbit, Search, User, Compass, HelpCircle, 
  MapPin, ShieldCheck, AlertCircle, Info, RefreshCw 
} from "lucide-react";

interface NetworkActivityViewProps {
  highContrast?: boolean;
}

export default function NetworkActivityView({ highContrast }: NetworkActivityViewProps) {
  const [selectedCluster, setSelectedCluster] = useState<string>("Cluster G12");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/95 border-stone-800 text-stone-100";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/80";
  const textMain = highContrast ? "text-yellow-300" : "text-white";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  // Immersive cluster dataset
  const clusters = [
    {
      id: "Cluster G12",
      name: "Sankalp Transit Ring (G12)",
      nodes: 24,
      kingpin: "Alias: 'Ustad' Syndicate",
      expansion: "Pune & Ahmedabad Junctions",
      growth: "+18% this month",
      threat: "Extreme (High biometric matching hitrate)",
      statesAffected: "Bihar, Maharashtra, Gujarat",
      recentActivity: "Sighted in transit near Indore sleeper lines",
      galaxyCoords: { cx: 200, cy: 180, r: 24 }
    },
    {
      id: "Cluster G18",
      name: "Highway Border Alliance (G18)",
      nodes: 15,
      kingpin: "Alias: 'The Broker' Syndicate",
      expansion: "Dhubri & Siliguri Corridors",
      growth: "+12% this month",
      threat: "Critical (Child trafficking via tea estates)",
      statesAffected: "Assam, West Bengal",
      recentActivity: "Biometric duplicates flagged at Nabadwip crossing",
      galaxyCoords: { cx: 350, cy: 120, r: 18 }
    },
    {
      id: "Cluster G21",
      name: "Coastal Rail Network (G21)",
      nodes: 9,
      kingpin: "Alias: 'Amma' Syndicate",
      expansion: "Chennai & Madurai Terminal Hubs",
      growth: "Stable",
      threat: "Medium (Urban domestic servitude transit)",
      statesAffected: "Tamil Nadu, Andhra Pradesh",
      recentActivity: "NGO child welfare alert raised in Madurai station",
      galaxyCoords: { cx: 150, cy: 300, r: 14 }
    }
  ];

  const activeCluster = clusters.find(c => c.id === selectedCluster) || clusters[0];

  const handleDeployTeam = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* Immersive HUD Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-purple-400 font-mono uppercase">
              NATIONAL CRIMINAL GENOME CENTER
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Trafficking Network Mutation Galaxy
          </h2>
        </div>
        <div className="text-right font-mono text-[10px] text-stone-500">
          <p>BIO-RECORDS SYNCHRONIZED: <span className="text-purple-400 font-bold">14,812 Profiles</span></p>
          <p>CROSS-MATCH INDEX: <span className="text-stone-350">99.8% Perfect Match</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Growth Indicators */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-purple-400 font-mono flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                Network Dynamics
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Sighting expansion and syndication indexes</p>
            </div>

            {/* Largest Networks */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Largest active syndicates</h4>
              {clusters.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCluster(c.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex justify-between items-center ${
                    selectedCluster === c.id 
                      ? "bg-purple-950/40 border-purple-800 text-purple-200" 
                      : "bg-stone-950/50 border-stone-900 hover:border-stone-800 text-stone-300"
                  }`}
                >
                  <div>
                    <p className="font-bold">{c.id}</p>
                    <p className="text-[10px] text-stone-500 font-mono">Linked state nodes: {c.nodes}</p>
                  </div>
                  <span className="text-[10px] font-bold font-mono text-purple-400">{c.growth}</span>
                </div>
              ))}
            </div>

            {/* Mutated Warning indicators */}
            <div className="p-3 bg-purple-950/15 border border-purple-900/40 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-purple-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Recent mutation alert
              </p>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Cluster G12 successfully integrated secondary railway ticketing accounts, merging biometric IDs with previously distinct records. This indicates a highly dynamic operation.
              </p>
            </div>

          </div>
        </div>

        {/* Center Panel: Cosmic galaxy representation */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[440px] relative overflow-hidden`}>
            
            {/* Space galaxy overlay dots */}
            <div className="absolute inset-0 bg-radial-to-t from-purple-950/10 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start border-b border-stone-850 pb-3">
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-purple-400 font-mono">
                  SIGHTING NETWORK UNIVERSE
                </h3>
                <p className="text-[10px] text-stone-500 uppercase mt-0.5">Click on any cosmic system center to track crime geometry</p>
              </div>
              <span className="text-[9px] font-mono text-stone-500 bg-stone-950 px-2 py-1 rounded border border-stone-850 uppercase">COGNITIVE HEATMAPS ENABLED</span>
            </div>

            {/* Cosmic SVG Cosmos with Glowing Stars */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg viewBox="0 0 500 350" className="w-full h-full max-h-[300px]">
                {/* Cosmos Orbit Lines */}
                <ellipse cx="250" cy="175" rx="180" ry="100" fill="none" stroke="#581c87" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />
                <ellipse cx="250" cy="175" rx="110" ry="60" fill="none" stroke="#581c87" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />

                {/* Draw clusters representation */}
                {clusters.map((c) => (
                  <g 
                    key={c.id} 
                    onClick={() => setSelectedCluster(c.id)}
                    className="cursor-pointer group"
                  >
                    {/* Ring glow */}
                    <circle 
                      cx={c.galaxyCoords.cx} 
                      cy={c.galaxyCoords.cy} 
                      r={c.galaxyCoords.r} 
                      className={`transition-all ${
                        selectedCluster === c.id 
                          ? "fill-purple-500/15 stroke-purple-400 animate-pulse stroke-2" 
                          : "fill-purple-500/5 stroke-purple-700/60 group-hover:stroke-purple-500"
                      }`} 
                    />
                    {/* Core node */}
                    <circle 
                      cx={c.galaxyCoords.cx} 
                      cy={c.galaxyCoords.cy} 
                      r="6" 
                      className={selectedCluster === c.id ? "fill-purple-400" : "fill-purple-600"} 
                    />
                    {/* Satellite stars linking around */}
                    <circle cx={c.galaxyCoords.cx - 15} cy={c.galaxyCoords.cy - 10} r="2" fill="#a855f7" />
                    <circle cx={c.galaxyCoords.cx + 20} cy={c.galaxyCoords.cy + 5} r="1.5" fill="#c084fc" />
                    {/* Label */}
                    <text 
                      x={c.galaxyCoords.cx + 12} 
                      y={c.galaxyCoords.cy - 12} 
                      className={`text-[9px] font-mono transition-all ${
                        selectedCluster === c.id ? "fill-white font-bold" : "fill-stone-500"
                      }`}
                    >
                      {c.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Tactical intelligence overlay deck */}
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex items-center justify-between text-[10px] font-mono">
              <span className="text-stone-500">SYNAPSE TRACKING DECK: <span className="text-white font-bold">{selectedCluster}</span></span>
              <span className="text-purple-400 font-bold uppercase flex items-center gap-1">
                <Orbit className="w-3 h-3 animate-spin" /> Mutation Level: HIGH
              </span>
            </div>

          </div>
        </div>

        {/* Right Panel: Kingpins and Syndication */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Intelligence Profile
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Target biometric profiling details</p>
            </div>

            {/* active profile stats */}
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest font-mono">SYNDICATE TITLE</span>
                <p className="font-bold text-stone-200 mt-0.5">{activeCluster.name}</p>
              </div>

              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest font-mono">DETECTED KINGPIN IDENTIFIER</span>
                <p className="font-bold text-purple-400 mt-0.5">{activeCluster.kingpin}</p>
              </div>

              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest font-mono">PRIMARY DIRECTION OF EXPANSION</span>
                <p className="font-bold text-stone-300 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {activeCluster.expansion}
                </p>
              </div>

              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest font-mono">CROSS-STATE TRANSIT DOMAINS</span>
                <p className="font-bold text-stone-300 mt-0.5 font-mono">{activeCluster.statesAffected}</p>
              </div>

              <div className="pt-2 border-t border-stone-900">
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest font-mono">LATEST BIOMETRIC FLAGGING</span>
                <p className="text-stone-400 text-[11px] mt-1 leading-relaxed italic">
                  "{activeCluster.recentActivity}"
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panel: AI Network Forecast & Rapid Deploy */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-purple-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-900/50 font-mono font-bold text-xs uppercase tracking-widest">
            AI FORECAST INDEX
          </span>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Network {activeCluster.id} Target Projection: {activeCluster.expansion}
            </h4>
            <p className="text-[10px] text-stone-500 mt-0.5 font-mono">RECOMMENDED STRATEGY: IMMEDIATE DISPATCH TO CRITICAL TRANSIT CORRIDOR</p>
          </div>
        </div>

        {/* Deploy Controls */}
        <div className="flex items-center gap-3">
          {isDeployed ? (
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-4 py-2 rounded-xl">
              ✓ SPECIAL INVESTIGATION FORCE DISPATCHED
            </span>
          ) : (
            <button
              onClick={handleDeployTeam}
              disabled={isDeploying}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                isDeploying 
                  ? "bg-stone-800 text-stone-400 cursor-not-allowed" 
                  : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-purple-900/20 shadow-lg"
              }`}
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>TRANSMITTING DIRECTIVE...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>DEPLOY INVESTIGATION TEAM</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
