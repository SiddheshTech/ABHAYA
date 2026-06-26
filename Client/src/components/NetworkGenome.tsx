import React, { useState, useEffect } from "react";
import { 
  Network, Activity, BrainCircuit, Users, Car, Smartphone, 
  CreditCard, MapPin, Briefcase, Zap, AlertTriangle, Crosshair, 
  TrendingUp, ShieldAlert, Biohazard, ArrowUpRight, ArrowRight
} from "lucide-react";

interface NetworkGenomeProps {
  highContrast?: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function NetworkGenome({ highContrast, showToast }: NetworkGenomeProps) {
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100";
  const textSecondary = highContrast ? "text-gray-400" : "text-gray-500";

  // State to randomly pulse nodes
  const [pulsingNode, setPulsingNode] = useState<number | null>(null);
  const [isSequencing, setIsSequencing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsingNode(Math.floor(Math.random() * 12));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRunSequencing = () => {
    setIsSequencing(true);
    if (showToast) showToast("Initiating Genome Sequencing. Analyzing structural nodes...", "info");
    
    setTimeout(() => {
      setIsSequencing(false);
      if (showToast) showToast("Sequencing complete. Found 3 critical mutation vectors.", "success");
    }, 3000);
  };

  const dnaNodes = [
    { type: "Person", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500" },
    { type: "Phone", icon: Smartphone, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500" },
    { type: "Location", icon: MapPin, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500" },
    { type: "Vehicle", icon: Car, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500" },
    { type: "UPI", icon: CreditCard, color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500" },
    { type: "Case", icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500" },
    
    { type: "Person", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500" },
    { type: "Location", icon: MapPin, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500" },
    { type: "Vehicle", icon: Car, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500" },
    { type: "Phone", icon: Smartphone, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500" },
    { type: "UPI", icon: CreditCard, color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500" },
    { type: "Person", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500" },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-600" /> 
            Criminal DNA Sequencing Lab
          </h2>
          <p className={textSecondary}>Network Genome: Visualize trafficking organizations as living, mutating organisms.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRunSequencing} disabled={isSequencing} className={`px-5 py-2 rounded-full font-bold text-sm text-white shadow-md transition-colors flex items-center gap-2 ${isSequencing ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}>
            <Activity className={`w-4 h-4 ${isSequencing ? 'animate-spin' : ''}`} /> {isSequencing ? 'Sequencing...' : 'Run Genome Sequencing'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6 h-[500px]">
        
        {/* Left Panel: Network States */}
        <div className={`col-span-3 space-y-4 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar`}>
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Emerging Networks
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900/50" : "border-amber-100 bg-amber-50"} flex justify-between items-center`}>
                <div>
                  <p className="text-sm font-bold">Strain Alpha-9</p>
                  <p className={`text-[10px] ${textSecondary}`}>12 Nodes • High Activity</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              </div>
              <div className={`p-3 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900/50" : "border-gray-100 bg-gray-50"} flex justify-between items-center`}>
                <div>
                  <p className="text-sm font-bold">Strain Beta-4</p>
                  <p className={`text-[10px] ${textSecondary}`}>5 Nodes • Forming</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Biohazard className="w-4 h-4 text-rose-500" /> Recently Mutated
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900/50" : "border-rose-100 bg-rose-50"} flex justify-between items-center`}>
                <div>
                  <p className="text-sm font-bold">Syndicate G-12</p>
                  <p className={`text-[10px] ${textSecondary}`}>Tactics shift detected</p>
                </div>
                <TrendingUp className="w-4 h-4 text-rose-500" />
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-blue-500" /> Rapid Growth
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900/50" : "border-blue-100 bg-blue-50"} flex justify-between items-center`}>
                <div>
                  <p className="text-sm font-bold">Cluster Delta</p>
                  <p className={`text-[10px] ${textSecondary}`}>+40% volume in 24h</p>
                </div>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" /> Dormant Networks
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900/50" : "border-gray-100 bg-gray-50"} flex justify-between items-center opacity-70`}>
                <div>
                  <p className="text-sm font-bold">Old Guard</p>
                  <p className={`text-[10px] ${textSecondary}`}>No activity &gt; 60 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Animated DNA Structure */}
        <div className={`col-span-6 rounded-2xl border flex flex-col relative overflow-hidden h-full ${highContrast ? "bg-stone-950 border-stone-800" : "bg-slate-900 border-slate-800 shadow-inner"}`}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="flex items-center justify-between p-6 border-b border-white/10 relative z-10 shrink-0 bg-black/20 backdrop-blur-sm">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" /> Live Genome Strand
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Sequencing Active
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
            <div className="w-full h-full relative max-w-sm mx-auto">
              {/* DNA Backdrop SVG */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 400">
                <path d="M 30,0 Q 10,50 50,100 T 70,200 T 50,300 T 30,400" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" strokeLinecap="round" />
                <path d="M 70,0 Q 90,50 50,100 T 30,200 T 50,300 T 70,400" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" strokeLinecap="round" />
                
                {/* Connecting rungs */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line 
                    key={`rung-${i}`}
                    x1="20" y1={20 + (i * 32)} 
                    x2="80" y2={20 + (i * 32)} 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2"
                  />
                ))}
              </svg>

              {/* DNA Nodes */}
              <div className="absolute inset-0 flex flex-col justify-between py-4">
                {dnaNodes.map((node, i) => {
                  const isLeft = i % 2 === 0;
                  const offset = Math.sin((i / dnaNodes.length) * Math.PI * 2) * 40; // Sine wave offset
                  const xPos = isLeft ? 30 + offset : 70 - offset;
                  
                  const isPulsing = pulsingNode === i;

                  return (
                    <div 
                      key={i} 
                      className="w-full flex items-center absolute transition-all duration-1000 ease-in-out"
                      style={{ 
                        top: `${(i / (dnaNodes.length - 1)) * 100}%`, 
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {/* Visual Node */}
                      <div 
                        className={`absolute flex flex-col items-center group cursor-pointer transition-all duration-300 z-10`}
                        style={{ left: `${xPos}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className={`w-10 h-10 rounded-full border-2 ${node.bg} ${node.border} flex items-center justify-center ${node.color} backdrop-blur-sm shadow-lg
                          ${isPulsing ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-4 ring-white/20' : 'hover:scale-110'}`}
                        >
                          <node.icon className={`w-5 h-5 ${isPulsing ? 'animate-pulse' : ''}`} />
                        </div>
                        <div className="absolute top-full mt-2 bg-black/90 px-2 py-1 rounded border border-white/10 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {node.type} Activity
                        </div>
                      </div>
                      
                      {/* Connection Line to center */}
                      <div className="absolute left-1/2 top-1/2 h-px bg-white/20 -translate-y-1/2" style={{ width: `${Math.abs(50 - xPos)}%`, [isLeft ? 'right' : 'left']: '50%' }}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Analytics */}
        <div className={`col-span-3 space-y-4 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar`}>
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-stone-900`}>
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-800">
              <Crosshair className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-1">Kingpin Detected</h4>
            <p className={`text-xs ${textSecondary}`}>High-probability match in core node structure. Awaiting visual confirmation.</p>
          </div>

          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-4 text-sm">Vital Metrics</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-bold ${textSecondary}`}>Network Strength</span>
                  <span className="text-emerald-500 font-bold">High</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-bold ${textSecondary}`}>Mutation Risk</span>
                  <span className="text-amber-500 font-bold">Critical</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[92%] rounded-full animate-pulse"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-bold ${textSecondary}`}>Collapse Point Prediction</span>
                  <span className="text-blue-500 font-bold">3 Nodes</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[30%] rounded-full"></div>
                </div>
                <p className={`text-[10px] mt-2 leading-tight ${textSecondary}`}>Taking out top 3 command nodes has 80% probability of network dissolution.</p>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
             <h4 className="font-bold mb-4 text-sm flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-purple-500" /> Expansion Forecast
             </h4>
             <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                 <div className="flex-1">
                   <p className="text-xs font-bold">Logistics Shift</p>
                   <p className={`text-[10px] ${textSecondary}`}>Switching to rail transport</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
                 <div className="flex-1">
                   <p className="text-xs font-bold">Recruitment</p>
                   <p className={`text-[10px] ${textSecondary}`}>Targeting college areas</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom: Genome Analysis */}
      <div className={`p-6 rounded-2xl border ${bgCard} shadow-sm`}>
        <h4 className="font-bold flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-blue-500" /> Real-time Genome Analysis
        </h4>

        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Target Network</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">G-12</span>
            <span className="text-xs font-bold flex items-center gap-1 text-emerald-500">
              <Activity className="w-3 h-3" /> Active sequencing
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Mutation Probability</span>
            <span className="text-2xl font-black text-amber-500 font-mono tracking-tight">78%</span>
            <span className="text-xs font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3 h-3" /> Imminent change
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Expected Shift</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold border border-gray-200 dark:border-stone-700 px-2 py-1 rounded">Mumbai</span>
              <ArrowRight className={`w-4 h-4 ${textSecondary}`} />
              <span className="text-sm font-bold border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Pune</span>
            </div>
            <span className={`text-xs mt-1 ${textSecondary}`}>Based on precursor activity</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Predicted Expansion</span>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span className="text-lg font-bold">Nashik</span>
            </div>
            <span className={`text-xs mt-1 ${textSecondary}`}>84% confidence score</span>
          </div>
        </div>
      </div>
    </div>
  );
}
