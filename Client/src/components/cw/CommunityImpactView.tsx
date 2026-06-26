import React, { useState } from "react";
import { Heart, Award, Users, Map, Clock, ArrowUpRight, CheckCircle, Flame, Star, Globe } from "lucide-react";

interface CommunityImpactViewProps {
  highContrast?: boolean;
}

export default function CommunityImpactView({ highContrast }: CommunityImpactViewProps) {
  const [activeLeaderboardPeriod, setActiveLeaderboardPeriod] = useState("This Month");

  const [impactStats] = useState([
    { label: "Children Safely Reunited", value: "142", desc: "Coordinated with CW & CWC", icon: Heart, color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
    { label: "Active Watch Volunteers", value: "1,208", desc: "Joined across India", icon: Users, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Sighting Reports Logged", value: "849", desc: "72% matched instantly", icon: Globe, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { label: "Search Patrol Hours", value: "14,830 hrs", desc: "On-the-ground sweeps", icon: Clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "Prerna NGO, Patna", reports: 84, score: 980, activeVols: 32 },
    { rank: 2, name: "Dwarka Watch Circle", reports: 61, score: 810, activeVols: 18 },
    { rank: 3, name: "Kolkata Station Volunteers", reports: 59, score: 790, activeVols: 24 },
    { rank: 4, name: "Sewa Dham, Noida", reports: 42, score: 620, activeVols: 15 },
  ]);

  const [milestones] = useState([
    { title: "Operation Muskaan III Cleared", desc: "100% of major railway nodes under active patrol coverage.", date: "June 2026", done: true },
    { title: "Bihar Volunteer Expansion", desc: "Recruited 200 fresh community watch members in rural districts.", date: "May 2026", done: true },
    { title: "Inter-State Transit Network", desc: "Setup transit monitoring checkpoints on Delhi-Patna national highways.", date: "July 2026 (Target)", done: false },
  ]);

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Welcome & Overview */}
      <div className={`p-6 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-2`}>
        <div className="flex items-center gap-1.5">
          <Award className="w-5 h-5 text-emerald-600 dark:text-yellow-300" />
          <h2 className={`text-xl font-extrabold ${textMain}`}>Community Impact Dashboard</h2>
        </div>
        <p className={`text-xs ${textMuted}`}>
          Visualizing real outcomes of the decentralized volunteer force. Your alerts, patrols, and sighting validations directly fuel the nationwide child safety shield.
        </p>
      </div>

      {/* Grid: 4 Core stats blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactStats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm flex items-center gap-4 group hover:border-emerald-500/30 transition-colors`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">{stat.label}</span>
              <p className={`text-2xl font-black ${textMain}`}>{stat.value}</p>
              <p className="text-[10px] text-stone-400">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard and Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Watch Circles Leaderboard (2 Columns) */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm ${textMain} flex items-center gap-2`}>
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Top Active Watch Circles
            </h3>
            
            <div className="flex gap-1.5">
              {["This Week", "This Month"].map((per) => (
                <button
                  key={per}
                  onClick={() => setActiveLeaderboardPeriod(per)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                    activeLeaderboardPeriod === per 
                      ? highContrast 
                        ? "bg-stone-800 text-yellow-300" 
                        : "bg-[#115e3b]/10 text-[#115e3b]" 
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {per}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${borderCol} text-stone-400 uppercase font-bold tracking-wider`}>
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Watch Unit Name</th>
                  <th className="pb-2 text-center">Verified Sightings</th>
                  <th className="pb-2 text-center">Active Volunteers</th>
                  <th className="pb-2 text-right">Impact Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {leaderboard.map((item) => (
                  <tr key={item.rank} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-1">
                        {item.rank <= 3 ? <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> : null}
                        <span className="font-bold">{item.rank}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 font-bold ${textMain}`}>{item.name}</td>
                    <td className="py-3.5 text-center font-semibold text-emerald-600 dark:text-emerald-400">{item.reports}</td>
                    <td className="py-3.5 text-center">{item.activeVols} Members</td>
                    <td className="py-3.5 text-right font-mono font-bold text-[#115e3b] dark:text-yellow-300">{item.score} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Operations Milestones Timeline (1 Column) */}
        <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
          <h3 className={`font-bold text-sm ${textMain}`}>National Operations Timeline</h3>

          <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100 dark:before:bg-stone-800">
            {milestones.map((ms, idx) => (
              <div key={idx} className="flex gap-4 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border ${
                  ms.done 
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                    : "bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800 text-stone-400"
                }`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className={`font-bold text-xs ${textMain}`}>{ms.title}</p>
                    <span className="text-[9px] text-stone-400 font-medium">{ms.date}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
