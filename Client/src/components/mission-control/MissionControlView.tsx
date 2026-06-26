import React, { useEffect } from "react";
import {
  Activity,
  Shield,
  MapPin,
  Zap,
  Radar,
  Users,
  Target,
  Crosshair,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useMissionStore } from "../../lib/missionStore";
import { useToastStore } from "../../lib/store";

export default function MissionControlView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { missions, kpis, init, addMissionLog } = useMissionStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    init();
  }, [init]);

  const handleAddMission = () => {
    const title = prompt("Enter new mission code:");
    if (title) {
      addToast(`Mission ${title} initialized successfully.`, "success");
    }
  };

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-gray-200 shadow-sm";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Top Mission Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        {[
          {
            label: "Active Missions",
            value: kpis.activeMissions.toString(),
            icon: Target,
            color: "text-blue-500",
          },
          {
            label: "Teams Deployed",
            value: kpis.officersDeployed.toString(),
            icon: Users,
            color: "text-emerald-500",
          },
          {
            label: "Drones Airborne",
            value: kpis.dronesAirborne.toString(),
            icon: Shield,
            color: "text-emerald-500",
          },
          {
            label: "Search Coverage",
            value: "84%",
            icon: Radar,
            color: "text-indigo-500",
          },
          {
            label: "Search Radius",
            value: `${kpis.searchRadiusKm}km`,
            icon: AlertTriangle,
            color: "text-red-500",
          },
          {
            label: "Success Rate",
            value: "96.2%",
            icon: Activity,
            color: "text-emerald-500",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border ${bgCard} shadow-sm flex items-center justify-between`}
          >
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}
              >
                {stat.label}
              </p>
              <h3 className={`text-xl font-black ${textMain}`}>{stat.value}</h3>
            </div>
            <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4 flex-1">
        {/* Left Panel: Critical Info */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div
            className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4
                className={`text-sm font-bold uppercase tracking-wider ${textMuted} flex items-center gap-2`}
              >
                <Zap className="w-4 h-4 text-red-500" /> Critical Missions
              </h4>
              <button
                onClick={handleAddMission}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
              {missions.length === 0 ? (
                <div className={`text-xs ${textMuted} text-center py-4`}>
                  No active missions.
                </div>
              ) : (
                missions.map((m: any, idx: number) => (
                  <div
                    key={`${m.id}-${idx}`}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-stone-800 border dark:border-stone-700"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold ${textMain}`}>{m.title}</span>
                      <span className="text-[10px] font-mono text-red-500 font-bold animate-pulse">
                        {m.progress}%
                      </span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold ${m.priority === "Critical" ? "text-red-500" : "text-blue-500"}`}
                    >
                      {m.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Weather
              Warnings
            </h4>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">
                Sector 4 Heavy Rain
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-500">
                Drone visibility reduced to 40%. Recommend ground thermal
                deployment.
              </span>
            </div>
          </div>
        </div>

        {/* Center: Massive 3D Globe Area */}
        <div
          className={`col-span-12 md:col-span-6 p-4 rounded-xl border ${bgCard} shadow-sm flex flex-col relative overflow-hidden items-center justify-center min-h-[400px]`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>

          {/* Simulated 3D Rotating Globe */}
          <div className="relative w-80 h-80 rounded-full bg-blue-900/10 border border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.2)] flex items-center justify-center">
            {/* Globe Grid lines (CSS representation) */}
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateX(75deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateX(75deg) rotateY(45deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateX(75deg) rotateY(90deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateX(75deg) rotateY(135deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateY(0deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateY(45deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateY(90deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border border-blue-500/20"
              style={{ transform: "rotateY(135deg)" }}
            ></div>

            {/* Glowing Center */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/10 to-transparent"></div>

            {/* Markers */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>

            {/* Connection Arcs (Simulated with SVGs) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 80 80 Q 150 20 220 120"
                fill="transparent"
                stroke="rgba(16, 185, 129, 0.5)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-[dash_3s_linear_infinite]"
              />
              <path
                d="M 80 80 Q 120 180 160 220"
                fill="transparent"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-[dash_3s_linear_infinite]"
              />
            </svg>
            <style>{`
              @keyframes dash {
                to { stroke-dashoffset: -24; }
              }
            `}</style>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <div className="flex gap-4">
              <span className="flex items-center text-[10px] font-bold text-red-500 uppercase">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>{" "}
                Incident
              </span>
              <span className="flex items-center text-[10px] font-bold text-emerald-500 uppercase">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>{" "}
                Ground Team
              </span>
              <span className="flex items-center text-[10px] font-bold text-blue-500 uppercase">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>{" "}
                Drone
              </span>
            </div>
            <span className="text-[10px] font-mono text-blue-400">
              GLOBAL LINK: ONLINE
            </span>
          </div>
        </div>

        {/* Right Panel: AI Recs & Updates */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <Crosshair className="w-4 h-4 text-purple-500" /> AI
              Recommendations
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 mb-1 block">
                  Deploy Canine Unit
                </span>
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  Target scent detected near Sector 4 treeline. Probability:
                  84%.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 mb-1 block">
                  Shift Drone Pattern
                </span>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Expand grid 2km North based on wind trajectory.
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <Activity className="w-4 h-4 text-emerald-500" /> Mission Updates
            </h4>
            <div className="space-y-3 overflow-y-auto max-h-[150px]">
              {missions.flatMap(m => m.logs.map((log: string, idx: number) => (
                <div key={`${m.id}-log-${idx}`} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className={`text-xs ${textMain}`}>
                      {log}
                    </p>
                    <span className={`text-[10px] ${textMuted}`}>{m.title}</span>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Mission Briefing */}
      <div
        className={`mt-4 p-4 rounded-xl ${darkGreenCard} flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10 mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
            <Target className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Active Operation
            </span>
            <h3 className="text-lg font-black font-mono">{missions[0]?.title || "N/A"}</h3>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-6 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Search Radius
            </span>
            <span className="text-sm font-bold">{kpis.searchRadiusKm} km</span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden md:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Coverage
            </span>
            <span className="text-sm font-bold">{missions[0]?.progress || 0}%</span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden md:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Success Probability
            </span>
            <span className="text-sm font-bold text-emerald-300">83%</span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden md:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Recommended Deployment
            </span>
            <span className="text-sm font-bold">Sector 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
