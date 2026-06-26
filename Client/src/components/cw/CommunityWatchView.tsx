import React, { useState } from "react";
import { 
  Shield, Eye, MapPin, Users, Bell, ArrowUpRight, 
  Search, Filter, ChevronRight, CheckCircle2, MessageSquare, Send, Radio
} from "lucide-react";

interface CommunityWatchViewProps {
  highContrast?: boolean;
}

export default function CommunityWatchView({ highContrast }: CommunityWatchViewProps) {
  const [regionFilter, setRegionFilter] = useState("All");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, sender: "Delhi HQ", msg: "Immediate priority alert: Active search in South West District. Volunteers check your emails.", time: "10 mins ago", level: "Critical" },
    { id: 2, sender: "Patna Command", msg: "Operation Muskaan Phase IV initialized. High density shelters listed.", time: "42 mins ago", level: "Warning" },
    { id: 3, sender: "Mumbai Metro", msg: "Security check completed for Central station railway shelter.", time: "2 hrs ago", level: "Info" },
  ]);

  const [activePatrols] = useState([
    { id: "P-401", area: "Sarojini Nagar Market", volunteers: 4, status: "On Patrol", lastPing: "3 mins ago" },
    { id: "P-402", area: "Noida Sector 62", volunteers: 3, status: "Resting", lastPing: "18 mins ago" },
    { id: "P-403", area: "Howrah Jn Platform 3-5", volunteers: 6, status: "Responding", lastPing: "Just Now" },
    { id: "P-404", area: "Patna Junction Gate A", volunteers: 2, status: "On Patrol", lastPing: "12 mins ago" },
  ]);

  const [recentIncidents] = useState([
    { id: "INC-883", title: "Sighting of Missing Boy #3381", loc: "New Delhi Railway Station", status: "Verified", time: "1 hr ago" },
    { id: "INC-882", title: "Suspicious group near school gate", loc: "Sector 4, Dwarka", status: "Dispatched", time: "3 hrs ago" },
    { id: "INC-881", title: "Unidentified runaway girl sheltered", loc: "Sewa Ashram, Ghaziabad", status: "Resolved", time: "5 hrs ago" },
  ]);

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    const newB = {
      id: Date.now(),
      sender: "Me (Community Watch Officer)",
      msg: broadcastMessage.trim(),
      time: "Just Now",
      level: "Info",
    };
    setBroadcasts([newB, ...broadcasts]);
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
                <div key={inc.id} className={`p-3.5 rounded-xl border ${borderCol} flex items-center justify-between group hover:border-emerald-500/40 transition-all`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-stone-400">{inc.id}</span>
                      <p className={`font-bold text-sm ${textMain}`}>{inc.title}</p>
                    </div>
                    <p className={`text-xs ${textMuted} flex items-center gap-1`}>
                      <MapPin className="w-3 h-3 text-red-500" /> {inc.loc}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-stone-400">{inc.time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      inc.status === "Verified" 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                    }`}>
                      {inc.status}
                    </span>
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
