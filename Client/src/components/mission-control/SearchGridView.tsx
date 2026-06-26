import React from "react";
import {
  Grid,
  Target,
  CheckCircle2,
  Navigation,
  AlertTriangle,
  Layers,
  Crosshair,
} from "lucide-react";
import { useMissionStore, useToastStore } from "../../lib/store";

export default function SearchGridView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { activeSector, setActiveSector } = useMissionStore();
  const { addToast } = useToastStore();

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-gray-200 shadow-sm";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  const handleDeploy = () => {
    addToast(`Resources deployed to ${activeSector}.`, "success");
  };

  const sectors = [
    {
      id: "Sector A",
      status: "Completed",
      color:
        "bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300",
    },
    {
      id: "Sector B",
      status: "In Progress",
      color:
        "bg-blue-500/20 border-blue-500/50 text-blue-700 dark:text-blue-300",
    },
    {
      id: "Sector C",
      status: "Needs Recheck",
      color:
        "bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-300",
    },
    {
      id: "Sector D",
      status: "Unsearched",
      color: "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300",
    },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-black ${textMain} tracking-tight`}>
            Search Grid
          </h2>
          <p
            className={`text-xs uppercase tracking-widest ${textMuted} font-bold mt-1`}
          >
            Tactical Search Planner
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1">
        {/* Left Panel: Status Legend */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <Layers className="w-4 h-4" /> Zone Status
            </h4>
            <div className="space-y-3">
              {[
                { label: "Unsearched", color: "bg-red-500", count: 4 },
                { label: "In Progress", color: "bg-blue-500", count: 2 },
                { label: "Needs Recheck", color: "bg-amber-500", count: 1 },
                { label: "Completed", color: "bg-emerald-500", count: 8 },
              ].map((status) => (
                <div
                  key={status.label}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-default transition-colors ${highContrast ? "hover:bg-stone-800" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${status.color}`}
                    ></div>
                    <span className={`text-sm font-bold ${textMain}`}>
                      {status.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${textMuted}`}>
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Grid-Based Search Map */}
        <div
          className={`col-span-12 md:col-span-6 p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden flex flex-col min-h-[400px] ${highContrast ? "bg-stone-950" : "bg-gray-50"}`}
        >
          {/* Map Background Simulation */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9InJnYmEoMTUwLDE1MCwxNTAsMC4wNSkiLz48cGF0aCBkPSJNMCAxMGgxMHYxMEgweiIgZmlsbD0icmdiYSgxNTAsMTUwLDE1MCwwLjA4KSIvPjwvc3ZnPg==')] opacity-60"></div>

          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 relative z-10 p-4">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`relative border-2 rounded-xl flex items-center justify-center cursor-pointer transition-all ${sector.color} ${activeSector === sector.id ? "ring-4 ring-offset-2 ring-purple-500 scale-[1.02] shadow-xl z-20" : "hover:scale-[1.01] z-10 opacity-80 hover:opacity-100"}`}
              >
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-xl pointer-events-none"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black">{sector.id}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded mt-1 inline-block">
                    {sector.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Sector Details */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <Crosshair className="w-4 h-4" /> Sector Details
            </h4>

            <h5 className={`text-xl font-black ${textMain} mb-4`}>
              {activeSector}
            </h5>

            <div className="space-y-4">
              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Coverage %
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{
                      width:
                        activeSector === "Sector D"
                          ? "0%"
                          : activeSector === "Sector A"
                            ? "100%"
                            : "45%",
                    }}
                  ></div>
                </div>
                <span className={`text-xs font-bold ${textMain}`}>
                  {activeSector === "Sector D"
                    ? "0%"
                    : activeSector === "Sector A"
                      ? "100%"
                      : "45%"}
                </span>
              </div>

              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Miss Probability
                </span>
                <span
                  className={`text-sm font-bold ${activeSector === "Sector D" ? "text-red-500" : "text-emerald-500"}`}
                >
                  {activeSector === "Sector D" ? "High (84%)" : "Low (<5%)"}
                </span>
              </div>

              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Terrain Difficulty
                </span>
                <span className={`text-sm font-bold ${textMain}`}>
                  Moderate / Dense Woods
                </span>
              </div>

              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Assigned Team
                </span>
                <div className={`p-2 rounded-lg text-xs font-bold border ${highContrast ? "bg-stone-900 border-stone-800 text-stone-300" : "bg-gray-50 border-gray-200"}`}>
                  {activeSector === "Sector D" ? "Unassigned" : "Team Alpha"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: AI Planner */}
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
              AI Search Planner
            </span>
            <h3 className="text-lg font-black">{activeSector}</h3>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-6 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Priority Level
            </span>
            <span className="text-sm font-bold text-yellow-300">
              Highest Probability
            </span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden md:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-200 block mb-0.5">
              Recommend Deployment
            </span>
            <span className="text-sm font-bold text-emerald-300">
              Drone + Ground Team
            </span>
          </div>
          <div className="w-px h-8 bg-emerald-600/50 hidden md:block"></div>
          <button
            onClick={handleDeploy}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg text-xs transition-colors self-center"
          >
            Deploy Resources
          </button>
        </div>
      </div>
    </div>
  );
}
