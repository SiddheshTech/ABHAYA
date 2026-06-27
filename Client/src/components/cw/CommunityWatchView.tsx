import React, { useState, useEffect } from "react";
import { 
  Shield, Eye, MapPin, Users, Bell, ArrowUpRight, 
  Search, Filter, ChevronRight, CheckCircle2, MessageSquare, Send, Radio
} from "lucide-react";
import { useCWStore } from "../../lib/cwStore";

interface CommunityWatchViewProps {
  highContrast?: boolean;
}

export default function CommunityWatchView({ highContrast }: CommunityWatchViewProps) {
  const [regionFilter, setRegionFilter] = useState("All");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  
  const { broadcasts, patrols: activePatrols, incidents: recentIncidents, fetchCWData } = useCWStore();

  useEffect(() => {
    fetchCWData();
  }, [fetchCWData]);

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  const { addBroadcast } = useCWStore();

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    addBroadcast({
      sender: "Me (Community Watch Officer)",
      msg: broadcastMessage.trim(),
      level: "Info",
    });
    setBroadcastMessage("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Hero banner */}
      <div className={`p-6 rounded-2xl border ${borderCol} ${bgCard} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${highContrast ? "bg-stone-800 text-yellow-300 border border-yellow-300" : "bg-[#115e3b]/10 text-[#115e3b]"}`}>
              Active Sector
            </span>
            <span className={`text-xs ${textMuted} flex items-center gap-1`}>
              <MapPin className="w-3.5 h-3.5 text-red-500" /> New Delhi NCR Region
            </span>
          </div>
          <h2 className={`text-xl font-extrabold ${textMain}`}>
            Welcome back, Community Watch Commander
          </h2>
          <p className={`text-sm ${textMuted}`}>
            Your volunteer group currently coordinates 4 active patrols covering 15 regional shelters and public terminals.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className={`px-4 py-3 rounded-xl border ${borderCol} text-center min-w-[90px]`}>
            <p className="text-xs text-stone-400 font-medium">Volunteers</p>
            <p className={`text-lg font-black ${textMain}`}>124</p>
          </div>
          <div className={`px-4 py-3 rounded-xl border ${borderCol} text-center min-w-[90px]`}>
            <p className="text-xs text-stone-400 font-medium">Verified Sightings</p>
            <p className={`text-lg font-black text-emerald-600 dark:text-emerald-400`}>19</p>
          </div>
        </div>
      </div>

      {/* Grid: Live Watch Patrols & Quick Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Active Patrols & Incidents */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Patrols */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className={`font-bold ${textMain}`}>Active Watch Patrols</h3>
              </div>
              <span className={`text-xs font-semibold ${textMuted}`}>Live Tracking</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${borderCol} text-xs text-stone-400`}>
                    <th className="pb-2">Patrol Unit</th>
                    <th className="pb-2">Coverage Zone</th>
                    <th className="pb-2 text-center">Staff count</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent">
                  {activePatrols.map((patrol) => (
                    <tr key={patrol.id} className="group hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors">
                      <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{patrol.id}</td>
                      <td className="py-3">
                        <div>
                          <p className={`font-medium ${textMain}`}>{patrol.area}</p>
                          <p className="text-[10px] text-stone-400">Pinged {patrol.lastPing}</p>
                        </div>
                      </td>
                      <td className="py-3 text-center font-semibold">{patrol.volunteers} Vols</td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          patrol.status === "Responding" 
                            ? "bg-red-500/10 text-red-500" 
                            : patrol.status === "On Patrol"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {patrol.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Incident Log */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className={`font-bold ${textMain}`}>Recent Incident Log</h3>
              </div>
              <button className="text-xs text-emerald-600 dark:text-yellow-300 font-semibold hover:underline">
                View All Logs
              </button>
            </div>

            <div className="space-y-3">
              {recentIncidents.map((inc) => (
                <div key={inc._id} className="relative pl-6 pb-6 border-l-2 border-stone-200 dark:border-stone-700 last:border-transparent last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-stone-900 border-2 border-orange-500"></div>
                  <div className={`p-4 rounded-xl border ${borderCol} bg-stone-50 dark:bg-stone-800/30 flex flex-col gap-2 hover:border-orange-500/30 transition-colors`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-sm ${textMain}`}>{inc.title}</h4>
                      <span className="text-xs text-stone-400 font-mono">{inc.incidentId}</span>
                    </div>
                    <p className={`text-xs ${textMuted} flex items-center gap-1`}>
                      <MapPin className="w-3 h-3 text-red-500" /> {inc.loc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Radio Broadcasts */}
        <div className="space-y-6">
          
          {/* Quick Broadcast Form */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className={`font-bold ${textMain}`}>Send Emergency Broadcast</h3>
            </div>
            <p className={`text-xs ${textMuted} mb-4`}>
              Dispatch an instant notification to all nearby Watch units and verified local volunteers.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type emergency alert details..."
                className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 ${
                  highContrast 
                    ? "bg-stone-900 border-stone-800 text-yellow-300 placeholder-stone-600" 
                    : "bg-stone-50 border-gray-100 text-gray-800 placeholder-gray-400"
                }`}
                rows={3}
              />
              <button
                type="submit"
                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] ${
                  highContrast 
                    ? "bg-stone-800 border border-yellow-300 text-yellow-300 hover:bg-stone-700" 
                    : "bg-[#115e3b] text-white hover:bg-[#0d4a2e]"
                }`}
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Alert
              </button>
            </form>
          </div>

          {/* Broadcast Ticker */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${textMain} flex items-center gap-1.5`}>
                <Bell className="w-4 h-4 text-amber-500" /> Active Broadcasts
              </h3>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {broadcasts.map((b) => (
                <div key={b.id} className={`p-3 rounded-xl border ${borderCol} space-y-1.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{b.sender}</span>
                    <span className="text-[9px] text-stone-400">{b.time}</span>
                  </div>
                  <p className={`text-xs ${textMuted} leading-normal`}>{b.msg}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      b.level === "Critical" 
                        ? "bg-red-500/15 text-red-500" 
                        : b.level === "Warning"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-blue-500/15 text-blue-500"
                    }`}>
                      {b.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
