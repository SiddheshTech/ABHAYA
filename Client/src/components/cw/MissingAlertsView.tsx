import React, { useState, useEffect } from "react";
import { Search, Filter, AlertTriangle, MapPin, Calendar, User, Eye, Share2, Clipboard, Copy, Check } from "lucide-react";
import { useCWStore, Alert as StoreAlert } from "../../lib/cwStore";

interface MissingAlertsViewProps {
  highContrast?: boolean;
}

interface MissingAlert {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  riskLevel: "Critical" | "High" | "Medium";
  description: string;
  avatarSeed: string;
}

export default function MissingAlertsView({ highContrast }: MissingAlertsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<MissingAlert | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { alerts: storeAlerts, fetchCWData } = useCWStore();

  useEffect(() => {
    fetchCWData();
  }, [fetchCWData]);

  // Map store alerts to the expected interface format
  const alerts: MissingAlert[] = storeAlerts.map(a => ({
    id: a._id.substring(0, 8),
    name: a.name,
    age: a.age,
    gender: a.gender,
    lastSeenLocation: a.location,
    lastSeenDate: new Date(a.lastSeenDate).toISOString().split('T')[0],
    riskLevel: a.riskLevel as "Critical" | "High" | "Medium",
    description: `Alert ID: ${a._id}. Please check for more info.`,
    avatarSeed: a.name,
  }));

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  const handleCopyAlert = (alert: MissingAlert) => {
    const textToCopy = `[MISSING CHILD ALERT]
Name: ${alert.name} (Age ${alert.age}, ${alert.gender})
Last Seen: ${alert.lastSeenLocation} on ${alert.lastSeenDate}
Risk Level: ${alert.riskLevel}
Description: ${alert.description}
If sighted, immediately report to Rakshak Helpline or dial 1098.`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(alert.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "All" || alert.gender === genderFilter;
    const matchesRisk = riskFilter === "All" || alert.riskLevel === riskFilter;

    return matchesSearch && matchesGender && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className={`text-xl font-extrabold ${textMain} flex items-center gap-2`}>
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" /> Active Missing Alerts
          </h2>
          <p className={`text-xs ${textMuted} mt-1`}>
            Cross-referenced with Child Welfare Committees (CWC) and police bulletins. Keep a sharp lookout.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3 top-2.5 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search alert by name, zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-1.5 rounded-xl border text-xs focus:outline-none w-[180px] md:w-[220px] ${
                highContrast 
                  ? "bg-stone-950 border-stone-800 text-yellow-300 placeholder-stone-600" 
                  : "bg-stone-50 border-gray-100 text-gray-800"
              }`}
            />
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs ${
              highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-700"
            }`}
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs ${
              highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-700"
            }`}
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Grid: Alert list & detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Alerts List */}
        <div className={`lg:col-span-8 space-y-4`}>
          {filteredAlerts.length === 0 ? (
            <div className={`p-10 rounded-2xl border ${borderCol} ${bgCard} text-center space-y-2`}>
              <User className="w-8 h-8 text-stone-300 mx-auto" />
              <p className={`font-bold ${textMain}`}>No missing alerts match your criteria.</p>
              <p className={`text-xs ${textMuted}`}>Try clearing filters or adjusting your search query.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all hover:scale-[1.005] hover:shadow-sm ${
                  selectedAlert?.id === alert.id 
                    ? highContrast 
                      ? "border-yellow-300 bg-stone-900" 
                      : "border-emerald-600 bg-emerald-50/5" 
                    : `${borderCol} ${bgCard}`
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Photo Profile representation */}
                  <div className="flex-shrink-0 flex items-center justify-center sm:justify-start">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${alert.avatarSeed}`}
                        alt={alert.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wide mr-2">{alert.id}</span>
                        <span className={`font-extrabold text-base ${textMain}`}>{alert.name}</span>
                        <span className={`text-xs ${textMuted} ml-2`}>({alert.age} years, {alert.gender})</span>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold self-start ${
                        alert.riskLevel === "Critical" 
                          ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                          : alert.riskLevel === "High"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}>
                        {alert.riskLevel} Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <p className={`${textMuted} flex items-center gap-1.5`}>
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" /> 
                        <strong className="font-semibold text-stone-600 dark:text-stone-300">Last Seen:</strong> {alert.lastSeenLocation}
                      </p>
                      <p className={`${textMuted} flex items-center gap-1.5`}>
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" /> 
                        <strong className="font-semibold text-stone-600 dark:text-stone-300">Date:</strong> {alert.lastSeenDate}
                      </p>
                    </div>

                    <p className={`text-xs ${textMuted} line-clamp-2 italic`}>
                      &ldquo;{alert.description}&rdquo;
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <button 
                        onClick={() => setSelectedAlert(alert)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors ${
                          highContrast 
                            ? "bg-stone-800 text-yellow-300 hover:bg-stone-700" 
                            : "bg-[#115e3b]/10 text-[#115e3b] hover:bg-[#115e3b]/20"
                        }`}
                      >
                        <Eye className="w-3 h-3" /> Full Profile
                      </button>

                      <button 
                        onClick={() => handleCopyAlert(alert)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-colors ${
                          highContrast 
                            ? "border-stone-800 text-yellow-300 hover:bg-stone-900" 
                            : "border-gray-200 text-stone-600 hover:bg-gray-50"
                        }`}
                      >
                        {copiedId === alert.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedId === alert.id ? "Copied" : "Copy Alert Text"}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Quick Action & Expanded Detail Card */}
        <div className="lg:col-span-4">
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm sticky top-6 space-y-4`}>
            {selectedAlert ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800 border-2 border-emerald-500 mx-auto">
                    <img 
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${selectedAlert.avatarSeed}`}
                      alt={selectedAlert.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className={`font-black text-lg mt-2 ${textMain}`}>{selectedAlert.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">{selectedAlert.id}</p>
                </div>

                <hr className={borderCol} />

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Age / Gender</span>
                    <p className={`font-semibold ${textMain}`}>{selectedAlert.age} years old &bull; {selectedAlert.gender}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Last Seen Coordinates</span>
                    <p className={`font-semibold ${textMain} flex items-center gap-1`}>
                      <MapPin className="w-3 h-3 text-red-500" /> {selectedAlert.lastSeenLocation}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Reported Missing Since</span>
                    <p className={`font-semibold ${textMain} flex items-center gap-1`}>
                      <Calendar className="w-3.5 h-3.5 text-stone-400" /> {selectedAlert.lastSeenDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Physical Profile / Context</span>
                    <p className={`${textMuted} leading-relaxed bg-stone-50 dark:bg-stone-900/40 p-2.5 rounded-xl border ${borderCol}`}>
                      {selectedAlert.description}
                    </p>
                  </div>
                </div>

                <hr className={borderCol} />

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopyAlert(selectedAlert)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-colors ${
                      highContrast 
                        ? "border-stone-800 text-yellow-300 hover:bg-stone-900" 
                        : "border-gray-200 text-stone-600 hover:bg-gray-50"
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Alert
                  </button>
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                      highContrast 
                        ? "bg-stone-800 text-yellow-300 hover:bg-stone-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Close
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className={`font-bold ${textMain}`}>No Child Selected</h4>
                <p className={`text-xs ${textMuted} leading-normal`}>
                  Select any missing alert card on the left to inspect high-resolution profile imagery, physical identifying markers, and coordinate reports.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
