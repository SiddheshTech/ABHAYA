import React, { useState, useEffect } from "react";
import { useOverlayStore } from "../lib/overlayStore";
import SecureMailModal from "./ros/SecureMailModal";
import NotificationPanel from "./ros/NotificationPanel";
import { 
  Search, Mail, Bell, LayoutDashboard, CheckSquare, Calendar, 
  BarChart2, Users, Settings, HelpCircle, LogOut, ArrowUpRight,
  Plus, MoreHorizontal, Check, Play, Pause, Square, SearchCode,
  Beaker, Fingerprint, Network, BrainCircuit, LineChart, Archive,
  Activity, AlertTriangle, ShieldAlert, Cpu, Zap, MapPin, Eye, Lock, FileText, Database, Target,
  RefreshCw, TrendingUp, ChevronRight, X
} from "lucide-react";

import IdentityEngine from "./IdentityEngine";
import NetworkGenome from "./NetworkGenome";
import CriminalMind from "./CriminalMind";
import PredictionEngine from "./PredictionEngine";
import IntelligenceArchive from "./IntelligenceArchive";
import SettingsPage from "./SettingsPage";
import HelpPage from "./HelpPage";

interface AIForensicDashboardProps {
  onLogout: () => void;
  highContrast?: boolean;
}

export default function AIForensicDashboard({ onLogout, highContrast }: AIForensicDashboardProps) {
  const [activePage, setActivePage] = useState("AI Lab");

  const { 
    setMailOpen, 
    setNotificationsOpen, 
    messages, 
    notifications 
  } = useOverlayStore();

  const unreadMailCount = messages.filter((m) => !m.read && !m.sent).length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isInitializingTask, setIsInitializingTask] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    showToast("Generating consolidated intelligence report...", "info");
    setTimeout(() => {
      setIsExporting(false);
      showToast("Report exported successfully.", "success");
    }, 2000);
  };

  const handleInitializeTask = () => {
    setIsInitializingTask(true);
    showToast("Initializing new AI forensic task...", "info");
    setTimeout(() => {
      setIsInitializingTask(false);
      showToast("AI Task initialized. Deep analysis running in background.", "success");
    }, 2000);
  };

  const handleCopilotSubmit = async () => {
    if (!copilotQuery.trim()) return;
    setIsCopilotLoading(true);
    setCopilotResponse("");
    try {
      if (showToast) showToast("Analyzing query across forensic databases...", "info");
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: copilotQuery })
      });
      if (!response.ok) throw new Error("AI Failed");
      const data = await response.json();
      setCopilotResponse(data.reply || "No response received.");
    } catch (error) {
      console.error("Copilot Error:", error);
      setCopilotResponse("Error: Unable to connect to Rakshak AI Copilot.");
      if (showToast) showToast("Connection to Rakshak AI failed.", "error");
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleCopilotExample = (text: string) => {
    setCopilotQuery(text);
    setTimeout(() => {
      handleCopilotSubmit();
    }, 100);
  };

  // Helper classes based on contrast
  const bgMain = highContrast ? "bg-black" : "bg-[#f8fafc]";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100";
  const textSecondary = highContrast ? "text-gray-400" : "text-gray-500";
  
  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden ${bgMain} ${textMain}`}>
      <SecureMailModal highContrast={highContrast} />
      <NotificationPanel highContrast={highContrast} />
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col h-full border-r shrink-0 transition-colors ${highContrast ? "border-stone-800 bg-black" : "border-gray-200 bg-[#f8fafc]"}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
            <SearchCode className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">AI Forensics</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-6 mt-4">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary} px-2 mb-2`}>Overview</p>
            <nav className="space-y-1">
              <button onClick={() => setActivePage("AI Lab")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "AI Lab" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
                <div className="flex items-center gap-3">
                  <Beaker className="w-4 h-4" />
                  <span>AI Lab</span>
                </div>
                {activePage === "AI Lab" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
              </button>
            </nav>
          </div>

          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary} px-2 mb-2`}>Identity Intelligence</p>
            <nav className="space-y-1">
              <button onClick={() => setActivePage("Identity Engine")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Identity Engine" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-4 h-4" />
                  <span>Identity Engine</span>
                </div>
                {activePage === "Identity Engine" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
              </button>
            </nav>
          </div>

          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary} px-2 mb-2`}>Criminal Intelligence</p>
            <nav className="space-y-1">
              <button onClick={() => setActivePage("Network Genome")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Network Genome" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
                <div className="flex items-center gap-3">
                  <Network className="w-4 h-4" />
                  <span>Network Genome</span>
                </div>
                {activePage === "Network Genome" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
              </button>
              <button onClick={() => setActivePage("Criminal Mind")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Criminal Mind" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Criminal Mind</span>
                </div>
                {activePage === "Criminal Mind" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
              </button>
            </nav>
          </div>

          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary} px-2 mb-2`}>Predictive Intelligence</p>
            <nav className="space-y-1">
              <button onClick={() => setActivePage("Prediction Engine")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Prediction Engine" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
                <div className="flex items-center gap-3">
                  <LineChart className="w-4 h-4" />
                  <span>Prediction Engine</span>
                </div>
                {activePage === "Prediction Engine" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
              </button>
            </nav>
          </div>

          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary} px-2 mb-2`}>Knowledge Base</p>
            <nav className="space-y-1">
              <button onClick={() => setActivePage("Intelligence Archive")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Intelligence Archive" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
                <div className="flex items-center gap-3">
                  <Archive className="w-4 h-4" />
                  <span>Intelligence Archive</span>
                </div>
                {activePage === "Intelligence Archive" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
              </button>
            </nav>
          </div>
        </div>

        <div className="px-4 py-4 mt-auto border-t border-gray-100 dark:border-stone-800">
          <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary} px-2 mb-2`}>General</p>
          <nav className="space-y-1">
            <button onClick={() => setActivePage("Settings")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Settings" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
              {activePage === "Settings" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
            </button>
            <button onClick={() => setActivePage("Help")} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activePage === "Help" ? (highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100") : (highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100")}`}>
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </div>
              {activePage === "Help" && <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>}
            </button>
            <button onClick={onLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${highContrast ? "text-gray-400 hover:bg-stone-900" : "text-gray-500 hover:bg-gray-100"}`}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white/50 dark:bg-black/50">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0">
          <div className={`flex items-center px-4 py-2 rounded-full w-96 border ${highContrast ? "bg-stone-900 border-stone-700" : "bg-white border-gray-200"}`}>
            <Search className={`w-4 h-4 ${textSecondary}`} />
            <input 
              type="text" 
              placeholder="Search Case..." 
              className={`flex-1 bg-transparent border-none outline-hidden px-3 text-sm font-medium ${textMain} placeholder:text-gray-400`}
            />
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${highContrast ? "bg-stone-800" : "bg-gray-100"}`}>⌘ F</div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setMailOpen(true)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors relative ${highContrast ? "bg-stone-900 border-stone-800 hover:bg-stone-800" : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"}`}>
              <Mail className="w-4 h-4 text-gray-500" />
              {unreadMailCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-purple-500 rounded-full border border-white"></span>
              )}
            </button>
            <button onClick={() => setNotificationsOpen(true)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors relative ${highContrast ? "bg-stone-900 border-stone-800 hover:bg-stone-800" : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"}`}>
              <Bell className="w-4 h-4 text-gray-500" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white animate-pulse"></span>
              )}
            </button>
            <div onClick={() => showToast("Opening User Profile...", "info")} className="flex items-center gap-3 pl-2 cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Smith" alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              <div>
                <h4 className="text-sm font-bold leading-none mb-1">Dr. Smith Kadam</h4>
                <p className={`text-xs ${textSecondary}`}>Chief Forensics / Lab Director</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          
          {activePage === "AI Lab" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Intelligence Command Center</h2>
              <p className={textSecondary}>Real-time overview of all forensic intelligence activities.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExportReport}
                disabled={isExporting}
                className={`px-4 py-2 rounded-full font-bold text-sm border shadow-sm transition-colors flex items-center gap-2 ${isExporting ? 'opacity-70 cursor-not-allowed' : ''} ${highContrast ? "border-stone-700 bg-stone-900 hover:bg-stone-800" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {isExporting ? 'Exporting...' : 'Export Report'}
              </button>
              <button 
                onClick={handleInitializeTask}
                disabled={isInitializingTask}
                className={`px-5 py-2 rounded-full font-bold text-sm text-white shadow-md transition-colors flex items-center gap-2 ${isInitializingTask ? 'bg-emerald-800 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                {isInitializingTask ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                {isInitializingTask ? 'Initializing...' : 'Initialize AI Task'}
              </button>
            </div>
          </div>

          {/* Top Intelligence Bar */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden group`}>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wider ${textSecondary}`}>Identity Recons</h4>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black tracking-tighter leading-none">124</span>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" />+12</span>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden group`}>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wider ${textSecondary}`}>Active Networks</h4>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black tracking-tighter leading-none">8</span>
                <Network className="w-4 h-4 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden group`}>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wider ${textSecondary}`}>Threat Level</h4>
              <div className="flex items-end justify-between">
                <span className="text-xl font-black tracking-tighter leading-none text-red-500">CRITICAL</span>
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden group`}>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wider ${textSecondary}`}>Predictions Gen.</h4>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black tracking-tighter leading-none">1.4k</span>
                <BrainCircuit className="w-4 h-4 text-purple-500 opacity-50" />
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden group`}>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wider ${textSecondary}`}>New Intelligence</h4>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black tracking-tighter leading-none">45</span>
                <Database className="w-4 h-4 text-amber-500 opacity-50" />
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${bgCard} shadow-sm relative overflow-hidden group`}>
              <h4 className={`text-xs font-bold mb-2 uppercase tracking-wider ${textSecondary}`}>Forensic Alerts</h4>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black tracking-tighter leading-none">12</span>
                <ShieldAlert className="w-4 h-4 text-rose-500 opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Left Panel */}
            <div className="col-span-3 space-y-6 flex flex-col">
              <div className={`flex-1 p-5 rounded-2xl border ${bgCard} shadow-sm flex flex-col`}>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-500" /> New Reconstructions
                </h4>
                <div className="space-y-3 flex-1">
                  {[
                    { id: "REC-942", match: "98%", status: "Verified", time: "10m ago" },
                    { id: "REC-881", match: "84%", status: "Pending", time: "1h ago" },
                    { id: "REC-705", match: "92%", status: "Verified", time: "3h ago" }
                  ].map((rec, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900/50" : "border-gray-100 bg-gray-50"} flex items-center justify-between`}>
                      <div>
                        <p className="text-sm font-bold">{rec.id}</p>
                        <p className={`text-[10px] ${textSecondary}`}>{rec.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-600">{rec.match}</p>
                        <p className={`text-[10px] ${rec.status === "Verified" ? "text-blue-500" : "text-amber-500"}`}>{rec.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex-1 p-5 rounded-2xl border ${bgCard} shadow-sm flex flex-col`}>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Active Analyses
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold">Deepfake Audio Sweep</span>
                      <span className="text-emerald-500">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[65%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold">Device Extraction (Mobile)</span>
                      <span className="text-amber-500">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[40%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center text-xs font-bold">
                  <span className="text-red-500">3 Urgent Cases</span>
                  <span className="text-amber-500">12 Pending Reviews</span>
                </div>
              </div>
            </div>

            {/* Center: Interactive Intelligence Universe */}
            <div className={`col-span-6 rounded-2xl border flex flex-col overflow-hidden relative ${highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900 border-stone-800 shadow-inner"}`}>
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 relative z-10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h4 className="font-bold text-white text-sm">Interactive Intelligence Universe</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => showToast("Filtering by Nodes...", "info")} className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold transition-colors">Nodes</button>
                  <button onClick={() => showToast("Filtering by Links...", "info")} className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold transition-colors">Links</button>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden">
                {/* SVG Connections (Decorative) */}
                <svg className="absolute inset-0 w-full h-full opacity-30" pointerEvents="none">
                  <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#34d399" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="30%" y1="70%" x2="50%" y2="50%" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="70%" y1="80%" x2="50%" y2="50%" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20%" y1="30%" x2="30%" y2="70%" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="80%" y1="20%" x2="70%" y2="80%" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                {/* Animated Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

                {/* Nodes */}
                <div onClick={() => showToast("Loading Identity Recon details...", "info")} className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Identity Recon</div>
                </div>

                <div onClick={() => showToast("Loading Emerging Threats analysis...", "info")} className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Emerging Threats</div>
                </div>

                <div onClick={() => showToast("Loading Network Activity graph...", "info")} className="absolute top-[70%] left-[30%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Network className="w-5 h-5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Network Activity</div>
                </div>

                <div onClick={() => showToast("Loading Predicted Hotspots map...", "info")} className="absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Predicted Hotspots</div>
                </div>

                {/* Central Node */}
                <div onClick={() => showToast("Initializing Core AI Engine diagnostics...", "info")} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
                  <div className="w-16 h-16 rounded-full bg-[#064e3b] border-2 border-emerald-400 flex items-center justify-center text-white shadow-[0_0_30px_rgba(52,211,153,0.3)] group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-black px-3 py-1.5 rounded border border-white/20 text-xs font-bold text-white whitespace-nowrap">Core AI Engine</div>
                </div>

                {/* Data Packets Animation */}
                <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-emerald-400 rounded-full animate-[ping_3s_infinite]"></div>
                <div className="absolute top-[70%] left-[30%] w-2 h-2 bg-blue-400 rounded-full animate-[ping_4s_infinite]"></div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-3 space-y-6 flex flex-col">
              <div className={`flex-1 p-5 rounded-2xl border ${bgCard} shadow-sm flex flex-col`}>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-500" /> AI Findings
                </h4>
                <div className="space-y-4 flex-1">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5">Pattern Matches</p>
                      <p className={`text-[10px] ${textSecondary}`}>14 new links established in Syndicate X communications.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5">Network Alerts</p>
                      <p className={`text-[10px] ${textSecondary}`}>Unusual encrypted traffic detected in Sector 4.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <LineChart className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5">Behavior Predictions</p>
                      <p className={`text-[10px] ${textSecondary}`}>85% probability of target relocation in 24hrs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Daily Intelligence Brief */}
          <div className={`p-6 rounded-2xl border ${bgCard} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#064e3b] dark:text-emerald-500" /> Daily Intelligence Brief
              </h4>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${highContrast ? "bg-stone-800" : "bg-gray-100"}`}>Updated 5 mins ago</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                  <Network className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-400 leading-none mb-1">3</div>
                  <p className="text-xs font-bold text-blue-900/70 dark:text-blue-300">New Network Clusters</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-400 leading-none mb-1">2</div>
                  <p className="text-xs font-bold text-amber-900/70 dark:text-amber-300">Emerging Kingpins</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-red-700 dark:text-red-400 leading-none mb-1">1</div>
                  <p className="text-xs font-bold text-red-900/70 dark:text-red-300">High-Risk Migration Event</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 leading-none mb-1">8</div>
                  <p className="text-xs font-bold text-emerald-900/70 dark:text-emerald-300">Identity Matches Generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePage === "Identity Engine" && (
        <IdentityEngine highContrast={highContrast} showToast={showToast} />
      )}

      {activePage === "Network Genome" && (
        <NetworkGenome highContrast={highContrast} showToast={showToast} />
      )}

      {activePage === "Criminal Mind" && (
        <CriminalMind highContrast={highContrast} showToast={showToast} />
      )}

      {activePage === "Prediction Engine" && (
        <PredictionEngine highContrast={highContrast} showToast={showToast} />
      )}

      {activePage === "Intelligence Archive" && (
        <IntelligenceArchive highContrast={highContrast} showToast={showToast} />
      )}

      {activePage === "Settings" && (
        <SettingsPage highContrast={highContrast} showToast={showToast} role="AIFL" />
      )}

      {activePage === "Help" && (
        <HelpPage highContrast={highContrast} showToast={showToast} />
      )}

    </div>
  </main>

  {/* AI Copilot (Visible Everywhere) */}
  <div className="fixed bottom-6 right-6 z-50 group">
    <div className="absolute bottom-full right-0 mb-4 w-72 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-2xl shadow-2xl p-4 opacity-0 scale-95 origin-bottom-right pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 flex flex-col">
      <div className="flex items-center gap-2 mb-3 border-b border-gray-100 dark:border-stone-800 pb-2">
        <Zap className="w-5 h-5 text-purple-500" />
        <h4 className="font-bold text-sm">Ask Rakshak AI</h4>
      </div>
      <div className="space-y-2 mb-4 flex-1 max-h-64 overflow-y-auto custom-scrollbar">
        {copilotResponse ? (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl">
             <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{copilotResponse}</p>
             <button onClick={() => {setCopilotResponse(""); setCopilotQuery("")}} className="text-[10px] font-bold text-purple-600 mt-2 hover:underline">Ask another question</button>
          </div>
        ) : isCopilotLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-[10px] text-gray-500">Analyzing patterns...</span>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Examples</p>
            <button onClick={() => handleCopilotExample("Find similar children")} className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group/btn border border-transparent hover:border-gray-200 dark:hover:border-stone-700">
              Find similar children. <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => handleCopilotExample("Predict origin from voice")} className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group/btn border border-transparent hover:border-gray-200 dark:hover:border-stone-700">
              Predict origin from voice. <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => handleCopilotExample("Show kingpin of Network G12")} className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group/btn border border-transparent hover:border-gray-200 dark:hover:border-stone-700">
              Show kingpin of Network G12. <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => handleCopilotExample("Which district is highest risk?")} className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group/btn border border-transparent hover:border-gray-200 dark:hover:border-stone-700">
              Which district is highest risk? <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => handleCopilotExample("Explain this criminal profile")} className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group/btn border border-transparent hover:border-gray-200 dark:hover:border-stone-700">
              Explain this criminal profile. <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </>
        )}
      </div>
      <div className="relative mt-auto">
        <input 
          type="text" 
          value={copilotQuery}
          onChange={(e) => setCopilotQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCopilotSubmit()}
          placeholder="Type your query..." 
          className="w-full bg-gray-100 dark:bg-stone-800 border-none rounded-xl py-2.5 pl-3 pr-10 text-xs outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow" 
        />
        <button onClick={handleCopilotSubmit} disabled={!copilotQuery.trim() || isCopilotLoading} className="absolute right-1 top-1 w-7 h-7 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    <button className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform">
      <Zap className="w-6 h-6 fill-current text-purple-400" />
    </button>
  </div>

  {/* Global Toast Notification */}
  {toast && (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" : toast.type === "error" ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" : "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"}`}>
        {toast.type === "success" && <Check className="w-5 h-5" />}
        {toast.type === "error" && <AlertTriangle className="w-5 h-5" />}
        {toast.type === "info" && <Activity className="w-5 h-5" />}
        <span className="text-sm font-bold">{toast.message}</span>
        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X className="w-4 h-4" /></button>
      </div>
    </div>
  )}
</div>
  );
}
