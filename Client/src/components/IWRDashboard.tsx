import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useOverlayStore } from "../lib/overlayStore";
import SecureMailModal from "./ros/SecureMailModal";
import NotificationPanel from "./ros/NotificationPanel";
import { 
  Search, Mail, Bell, Plus, Download, 
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Users, 
  Settings, HelpCircle, LogOut, ArrowUpRight, Play, Pause, Square,
  Shield, Briefcase, Network, Activity, Database, Eye, Target, Cpu,
  AlertTriangle, MapPin, Filter, Clock, User, CheckCircle2, AlertCircle, ChevronRight,
  Smartphone, Car, CreditCard, Link2, Zap,
  FileText, Image as ImageIcon, Video, Mic, Globe, ShieldAlert, Archive,
  MessageSquare, Camera, Merge, Check, XCircle, ArrowRight, Radar, X
} from "lucide-react";

interface IWRDashboardProps {
  onLogout: () => void;
  highContrast: boolean;
}

import indiaMap from "../assets/india.svg";

export default function IWRDashboard({ onLogout, highContrast }: IWRDashboardProps) {
  const [activeView, setActiveView] = useState("War Room");

  const { 
    setMailOpen, 
    setNotificationsOpen, 
    messages, 
    notifications 
  } = useOverlayStore();

  const unreadMailCount = messages.filter((m) => !m.read && !m.sent).length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`flex min-h-screen ${highContrast ? "bg-stone-950 text-white" : "bg-[#f8faf9] text-gray-900"}`}>
      <SecureMailModal highContrast={highContrast} />
      <NotificationPanel highContrast={highContrast} />
      
      {/* Sidebar */}
      <aside className={`w-64 flex flex-col border-r shrink-0 ${highContrast ? "border-stone-800 bg-stone-950" : "border-gray-200 bg-[#fbfdfc]"} p-6 sticky top-0 h-screen`}>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-bold"><Shield className="w-4 h-4" /></div>
          <span className="font-bold text-lg leading-tight tracking-tight">LAW<br/>ENFORCEMENT</span>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">OVERVIEW</h4>
            <nav className="space-y-1">
              <button onClick={() => setActiveView("War Room")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "War Room" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Shield className="w-4 h-4" />
                <span className="text-sm">War Room</span>
                {activeView === "War Room" && <span className="ml-auto w-1 h-5 bg-emerald-700 rounded-full"></span>}
              </button>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">INVESTIGATIONS</h4>
            <nav className="space-y-1">
              <button onClick={() => setActiveView("Live Cases")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "Live Cases" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">Live Cases</span>
                {activeView === "Live Cases" && <span className="ml-auto w-1 h-5 bg-emerald-700 rounded-full"></span>}
              </button>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase">Crime Network</h4>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView("Trafficking Genome Lab")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "Trafficking Genome Lab" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Network className="w-4 h-4" />
                <span className="text-sm">Trafficking Genome Lab</span>
              </button>
              <button 
                onClick={() => setActiveView("Intelligence Feed")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "Intelligence Feed" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Activity className="w-4 h-4" />
                <span className="text-sm">Intelligence Feed</span>
              </button>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">LEADS & SIGHTINGS</h4>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView("Lead Fusion Center")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "Lead Fusion Center" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Lead Fusion Center</span>
                {activeView === "Lead Fusion Center" && <span className="ml-auto w-1 h-5 bg-emerald-700 rounded-full"></span>}
              </button>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">OPERATIONS</h4>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView("Tactical Deployment Center")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "Tactical Deployment Center" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Target className="w-4 h-4" />
                <span className="text-sm">Tactical Deployment Center</span>
                {activeView === "Tactical Deployment Center" && <span className="ml-auto w-1 h-5 bg-emerald-700 rounded-full"></span>}
              </button>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">CASE BRIEFINGS</h4>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView("AI Investigation Desk")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "AI Investigation Desk" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <FileText className="w-4 h-4" />
                <span className="text-sm">AI Investigation Desk</span>
                {activeView === "AI Investigation Desk" && <span className="ml-auto w-1 h-5 bg-emerald-700 rounded-full"></span>}
              </button>
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">DIGITAL FORENSICS</h4>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView("Evidence Vault")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeView === "Evidence Vault" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"}`}>
                <Database className="w-4 h-4" />
                <span className="text-sm">Evidence Vault</span>
              </button>
            </nav>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search task" 
              className={`w-full pl-9 pr-12 py-2 rounded-xl text-sm outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/20 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border border-gray-100 shadow-sm"}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded border border-gray-200">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded border border-gray-200">F</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMailOpen(true)}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors relative"
            >
              <Mail className="w-4 h-4" />
              {unreadMailCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-purple-500 rounded-full border border-white"></span>
              )}
            </button>
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
              )}
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Insp. Smith Kadam" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold leading-tight">Insp. Smith Kadam</p>
                <p className="text-xs text-gray-500">smithkadam24@gmail.com</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-4 flex-1 flex flex-col">
          {activeView === "War Room" ? (
            <WarRoomView highContrast={highContrast} />
          ) : activeView === "Live Cases" ? (
            <LiveCasesView highContrast={highContrast} />
          ) : activeView === "Trafficking Genome Lab" ? (
            <TraffickingGenomeLabView highContrast={highContrast} />
          ) : activeView === "Intelligence Feed" ? (
            <IntelligenceFeedView highContrast={highContrast} />
          ) : activeView === "Evidence Vault" ? (
            <EvidenceVaultView highContrast={highContrast} />
          ) : activeView === "Lead Fusion Center" ? (
            <LeadFusionCenterView highContrast={highContrast} />
          ) : activeView === "Tactical Deployment Center" ? (
            <TacticalDeploymentCenterView highContrast={highContrast} />
          ) : activeView === "AI Investigation Desk" ? (
            <AIInvestigationDeskView highContrast={highContrast} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an option from the sidebar.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function WarRoomView({ highContrast }: { highContrast: boolean }) {
  const [activeQueue, setActiveQueue] = useState("Priority Alpha");
  const [selectedFeed, setSelectedFeed] = useState<number | null>(null);
  const [deployStatus, setDeployStatus] = useState("idle");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ activeCases: 0, escalatedCases: 0, childrenRescuedToday: 0, openOperations: 0 });
  const [priorityQueues, setPriorityQueues] = useState<any[]>([]);
  const [liveFeeds, setLiveFeeds] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/dashboard/summary`);
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setPriorityQueues(data.priorityQueues);
          setLiveFeeds(data.liveFeeds);
        }
      } catch (err) {
        console.error("Failed to fetch War Room data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = () => {
    setDeployStatus("deploying");
    setTimeout(() => {
      setDeployStatus("deployed");
      setTimeout(() => setDeployStatus("idle"), 3000);
    }, 1500);
  };

  const createCustomIcon = (color: string, isSelected: boolean) => {
    const bgColors: Record<string, string> = { red: 'bg-red-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', purple: 'bg-purple-500', blue: 'bg-blue-500' };
    const pingColors: Record<string, string> = { red: 'bg-red-400', emerald: 'bg-emerald-400', amber: 'bg-amber-400', purple: 'bg-purple-400', blue: 'bg-blue-400' };
    const htmlString = `
      <div class="relative flex h-4 w-4 items-center justify-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-white' : pingColors[color]}"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 ${isSelected ? `${bgColors[color]} ring-2 ring-white` : bgColors[color]} shadow-[0_0_10px_rgba(0,0,0,0.8)]"></span>
      </div>
    `;
    return L.divIcon({ className: 'custom-leaflet-icon', html: htmlString, iconSize: [16, 16], iconAnchor: [8, 8] });
  };

  if (loading) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Establishing Secure Connection to National Command...</div>;

  return (
    <>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 shrink-0">
            <div>
              <h1 className="text-2xl font-black mb-1 tracking-tight text-emerald-950 dark:text-emerald-500 uppercase">War Room</h1>
              <p className="text-sm font-medium text-emerald-700/70 dark:text-emerald-400/70 tracking-widest uppercase">National Situational Awareness Center</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold shadow-sm border border-red-100 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                THREAT LEVEL: HIGH
              </div>
            </div>
          </div>

          {/* Top Command Bar - Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
            {/* Active Cases */}
            <div className={`rounded-xl p-4 border transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${highContrast ? "bg-stone-900 border-stone-800 hover:bg-stone-800" : "bg-white border-gray-100 hover:border-emerald-200"}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xs text-gray-500 tracking-wider uppercase">Active Cases</h3>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black">{metrics.activeCases.toLocaleString()}</div>
            </div>

            {/* Escalated Cases */}
            <div className={`rounded-xl p-4 border border-red-200 bg-red-50 text-red-950 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:bg-red-100`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xs text-red-700 tracking-wider uppercase">Escalated Cases</h3>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-black text-red-700">{metrics.escalatedCases.toLocaleString()}</div>
            </div>

            {/* Children Rescued Today */}
            <div className={`rounded-xl p-4 border border-emerald-200 bg-emerald-50 text-emerald-950 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer hover:bg-emerald-100`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xs text-emerald-700 tracking-wider uppercase">Children Rescued Today</h3>
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">{metrics.childrenRescuedToday.toLocaleString()}</div>
            </div>

            {/* Open Operations */}
            <div className={`rounded-xl p-4 border transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${highContrast ? "bg-stone-900 border-stone-800 hover:bg-stone-800" : "bg-white border-gray-100 hover:border-blue-200"}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xs text-gray-500 tracking-wider uppercase">Open Operations</h3>
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black">{metrics.openOperations.toLocaleString()}</div>
            </div>
          </div>

          {/* Main Content Area (3 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden mb-6">
            
            {/* Left Panel: Queues */}
            <div className={`lg:col-span-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center">
                <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Queues
                </h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {priorityQueues.map(queue => (
                  <div 
                    key={queue.id}
                    onClick={() => setActiveQueue(queue.id)}
                    className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${activeQueue === queue.id ? 'ring-2 ring-offset-1 ring-emerald-500/30' : ''}
                      ${queue.color === 'red' ? `border-red-100 text-red-800 ${activeQueue === queue.id ? 'bg-red-100' : 'bg-red-50 hover:bg-red-100'}` : ''}
                      ${queue.color === 'amber' ? `border-amber-100 text-amber-800 ${activeQueue === queue.id ? 'bg-amber-100' : 'bg-amber-50 hover:bg-amber-100'}` : ''}
                      ${queue.color === 'blue' ? `border-blue-100 text-blue-800 ${activeQueue === queue.id ? 'bg-blue-100' : 'bg-blue-50 hover:bg-blue-100'}` : ''}
                      ${queue.color === 'gray' ? `border-gray-200 dark:border-stone-700 text-gray-700 dark:text-gray-300 ${activeQueue === queue.id ? 'bg-gray-100 dark:bg-stone-700' : 'bg-gray-50 dark:bg-stone-800 hover:bg-gray-100 dark:hover:bg-stone-700'}` : ''}
                    `}
                  >
                    <div className="font-bold text-sm">{queue.id}</div>
                    <div className={`px-2 py-0.5 rounded text-xs font-bold
                      ${queue.color === 'red' ? 'bg-red-200 text-red-800' : ''}
                      ${queue.color === 'amber' ? 'bg-amber-200 text-amber-800' : ''}
                      ${queue.color === 'blue' ? 'bg-blue-200 text-blue-800' : ''}
                      ${queue.color === 'gray' ? 'bg-gray-200 dark:bg-stone-600 text-gray-800 dark:text-gray-200' : ''}
                    `}>{queue.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Map */}
            <div className={`lg:col-span-2 rounded-xl border flex flex-col relative overflow-hidden group ${highContrast ? "bg-stone-900 border-stone-800" : "bg-slate-50 border-gray-200 shadow-inner"}`}>
              <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur border border-gray-200 dark:border-stone-700 px-3 py-2 rounded-lg shadow-sm">
                <h3 className="font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Live Operations Map
                </h3>
              </div>
              
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                 <button className="bg-white/90 dark:bg-stone-900/90 backdrop-blur border border-gray-200 dark:border-stone-700 p-2 rounded-lg shadow-sm hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors">
                   <Plus className="w-4 h-4" />
                 </button>
                 <button className="bg-white/90 dark:bg-stone-900/90 backdrop-blur border border-gray-200 dark:border-stone-700 p-2 rounded-lg shadow-sm hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors">
                   <div className="w-4 h-4 border-2 border-current rounded-sm"></div>
                 </button>
              </div>
              
              {/* Map Placeholder/Area */}
              <div className="flex-1 w-full h-full relative z-0 bg-stone-900">
                <MapContainer center={[22.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  {liveFeeds.map(feed => {
                    const isSelected = selectedFeed === feed.id;
                    const textColors: Record<string, string> = { red: 'text-red-600', emerald: 'text-emerald-600', amber: 'text-amber-600', purple: 'text-purple-600', blue: 'text-blue-600' };
                    return (
                      <Marker key={feed.id} position={[feed.lat, feed.lng]} icon={createCustomIcon(feed.color, isSelected)} eventHandlers={{ click: () => setSelectedFeed(feed.id) }}>
                        <Popup className="custom-popup">
                          <div className="p-1">
                            <div className={`text-xs font-bold uppercase ${textColors[feed.color]}`}>{feed.title}</div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{feed.desc}</div>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapContainer>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-t border-gray-200 dark:border-stone-700 p-3">
                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold tracking-wider uppercase">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-red-500 transition-colors"><div className="w-2 h-2 rounded-full bg-red-500"></div> Missing</div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-amber-500 transition-colors"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Sightings</div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 transition-colors"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Rescue</div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-purple-500 transition-colors"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Routes</div>
                </div>
              </div>
            </div>

            {/* Right Panel: Live Feed */}
            <div className={`lg:col-span-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center">
                <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Live Feed
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {/* Feed Items */}
                {liveFeeds.map(feed => {
                  let Icon = AlertTriangle;
                  if (feed.type === 'success') Icon = Shield;
                  if (feed.type === 'sighting') Icon = Eye;
                  if (feed.type === 'network') Icon = Network;
                  if (feed.type === 'evidence') Icon = Database;
                  
                  return (
                    <div 
                      key={feed.id} 
                      onClick={() => setSelectedFeed(feed.id)}
                      className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedFeed === feed.id ? 'bg-gray-100 dark:bg-stone-800' : 'hover:bg-gray-50 dark:hover:bg-stone-800/50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                        ${feed.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                        ${feed.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : ''}
                        ${feed.color === 'amber' ? 'bg-amber-100 text-amber-600' : ''}
                        ${feed.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                        ${feed.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                      `}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold mb-0.5
                          ${feed.color === 'red' ? 'text-red-600' : ''}
                          ${feed.color === 'emerald' ? 'text-emerald-600' : ''}
                          ${feed.color === 'amber' ? 'text-amber-600' : ''}
                          ${feed.color === 'purple' ? 'text-purple-600' : ''}
                          ${feed.color === 'blue' ? 'text-blue-600' : ''}
                        `}>{feed.title}</div>
                        <div className="text-sm font-medium leading-tight">{feed.desc}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{feed.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom: AI Briefing */}
          <div className="bg-emerald-950 text-emerald-50 rounded-xl p-5 relative overflow-hidden shrink-0 border border-emerald-900/50 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-3 md:border-r border-emerald-800/50 md:pr-6 shrink-0 cursor-help">
                <div className="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center shadow-inner group-hover:bg-emerald-700 transition-colors">
                  <Cpu className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI Generated
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest">Daily Briefing</div>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 uppercase text-xs tracking-wider font-bold">Case:</span>
                    <span className="bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-100 font-mono">RK204</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 uppercase text-xs tracking-wider font-bold">Likely Route:</span>
                    <span>Mumbai &rarr; Pune</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 uppercase text-xs tracking-wider font-bold">Confidence:</span>
                    <span className="text-emerald-300 font-bold">84%</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleDeploy}
                  disabled={deployStatus !== 'idle'}
                  className={`whitespace-nowrap px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg ${
                    deployStatus === 'idle' ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 hover:-translate-y-0.5' : 
                    deployStatus === 'deploying' ? 'bg-amber-500 text-amber-950 animate-pulse' : 
                    'bg-blue-500 text-white'
                  }`}
                >
                  {deployStatus === 'idle' ? 'Deploy Team Bravo' : 
                   deployStatus === 'deploying' ? 'Deploying...' : 
                   'Team Deployed ✓'}
                </button>
              </div>
            </div>
          </div>
    </>
  );
}

function TraffickingGenomeLabView({ highContrast }: { highContrast: boolean }) {
  const [activeNetworkId, setActiveNetworkId] = useState("n4");
  const [activeSuspectId, setActiveSuspectId] = useState<string | null>(null);
  const [trackingSuspects, setTrackingSuspects] = useState<Record<string, boolean>>({});

  const [emergingNetworks, setEmergingNetworks] = useState<any[]>([]);
  const [highActivityNetworks, setHighActivityNetworks] = useState<any[]>([]);
  const [suspects, setSuspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/dashboard/genome`);
        if (res.ok) {
          const data = await res.json();
          setEmergingNetworks(data.emergingNetworks || []);
          setHighActivityNetworks(data.highActivityNetworks || []);
          setSuspects(data.suspects || []);
        }
      } catch (err) {
        console.error("Failed to fetch Genome Lab data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Establishing Secure Connection to Lab...</div>;

  const allNetworks = [...emergingNetworks, ...highActivityNetworks];
  const activeNetwork = allNetworks.find(n => n.id === activeNetworkId) || allNetworks[0];

  if (!activeNetwork) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold">No active networks detected.</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-emerald-600" />
            Trafficking Genome Lab
          </h2>
          <p className="text-gray-500 font-medium">Visualize trafficking organizations.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden mb-6">
        
        {/* Left Panel */}
        <div className={`w-full lg:w-72 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border p-4 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4">Emerging Networks</h3>
            <div className="space-y-3">
              {emergingNetworks.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => setActiveNetworkId(n.id)}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${activeNetworkId === n.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10' : 'bg-gray-50 dark:bg-stone-800/50 border-gray-100 dark:border-stone-700 hover:border-emerald-300'}`}
                >
                  <span className="font-bold text-sm">{n.name}</span>
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
          
          <div className={`rounded-xl border p-4 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4">High Activity Networks</h3>
            <div className="space-y-3">
              {highActivityNetworks.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => setActiveNetworkId(n.id)}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${activeNetworkId === n.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10' : 'bg-gray-50 dark:bg-stone-800/50 border-gray-100 dark:border-stone-700 hover:border-emerald-300'}`}
                >
                  <span className="font-bold text-sm text-red-600 dark:text-red-400">{n.name}</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
              ))}
            </div>
          </div>
          
          <div className={`rounded-xl border p-4 shrink-0 flex-1 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4">Most Connected Suspects</h3>
            <div className="space-y-3">
              {suspects.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => setActiveSuspectId(n.id)}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${activeSuspectId === n.id ? 'bg-emerald-50 border border-emerald-500 ring-1 ring-emerald-500' : 'bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700 hover:border-emerald-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeSuspectId === n.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">{n.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Center: Live Interactive Network */}
        <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden relative ${highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900 border-gray-200 shadow-inner"}`}>
          
          {/* Suspect Info Modal */}
          {activeSuspectId && (
            <div className="absolute top-4 right-4 z-20 w-64 p-4 rounded-xl shadow-2xl border border-white/20 bg-black/80 backdrop-blur-md animate-in slide-in-from-right-4 fade-in">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-white font-bold">{suspects.find(s => s.id === activeSuspectId)?.name}</h4>
                <button onClick={() => setActiveSuspectId(null)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-300 mb-3">Known connections to {activeNetwork.name}. High mutation probability detected.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Threat Level</span>
                  <span className="text-red-400 font-bold">Critical</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Known Aliases</span>
                  <span className="text-emerald-400 font-bold">3</span>
                </div>
              </div>
              <button 
                onClick={() => setTrackingSuspects(prev => ({ ...prev, [activeSuspectId]: true }))} 
                className={`mt-4 w-full py-1.5 text-white text-xs font-bold rounded transition-colors ${trackingSuspects[activeSuspectId] ? 'bg-blue-600' : 'bg-emerald-600 hover:bg-emerald-500'}`}
              >
                {trackingSuspects[activeSuspectId] ? 'Tracking Active' : 'Track Target'}
              </button>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10 flex gap-2">
             <div className="px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur text-xs font-bold text-white flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute opacity-75"></span>
               <span className="w-2 h-2 rounded-full bg-emerald-500 relative inline-flex shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
               LIVE INTERACTIVE NETWORK
             </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2 max-w-[80%]">
            {[
              { label: 'Suspect', icon: User, color: 'bg-red-500 text-white' },
              { label: 'Vehicle', icon: Car, color: 'bg-amber-500 text-white' },
              { label: 'Phone', icon: Smartphone, color: 'bg-blue-500 text-white' },
              { label: 'UPI', icon: CreditCard, color: 'bg-emerald-500 text-white' },
              { label: 'Location', icon: MapPin, color: 'bg-purple-500 text-white' },
              { label: 'Case', icon: Briefcase, color: 'bg-gray-500 text-white' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/10 px-2 py-1 rounded text-[10px] text-white/80 font-medium shrink-0">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${l.color}`}>
                  <l.icon className="w-2.5 h-2.5" />
                </div>
                {l.label}
              </div>
            ))}
          </div>

          {/* Canvas area */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800 to-stone-950">
             {/* Lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
               <g stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none">
                 <line x1="50%" y1="40%" x2="30%" y2="25%" />
                 <line x1="50%" y1="40%" x2="70%" y2="30%" />
                 <line x1="50%" y1="40%" x2="45%" y2="65%" />
                 <line x1="50%" y1="40%" x2="65%" y2="70%" />
                 <line x1="30%" y1="25%" x2="20%" y2="40%" />
                 <line x1="70%" y1="30%" x2="85%" y2="45%" />
                 <line x1="45%" y1="65%" x2="35%" y2="80%" />
                 <line x1="65%" y1="70%" x2="50%" y2="85%" />
                 <line x1="65%" y1="70%" x2="80%" y2="80%" />
               </g>
             </svg>
             
             {/* Nodes */}
             <div 
               className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
               onClick={() => setActiveNetworkId('n4')}
             >
               <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] z-10 relative hover:scale-110 transition-transform">
                 <User className="w-6 h-6" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Kingpin Alpha</div>
             </div>
             
             <div 
               className="absolute left-[30%] top-[25%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
               onClick={() => setActiveNetworkId('n2')}
             >
               <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 relative hover:scale-110 transition-transform">
                 <Car className="w-5 h-5" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Transport Vehicle</div>
             </div>

             <div 
               className="absolute left-[70%] top-[30%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
               onClick={() => setActiveNetworkId('n1')}
             >
               <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 relative hover:scale-110 transition-transform">
                 <Smartphone className="w-5 h-5" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Burner Phone</div>
             </div>
             
             <div 
               className="absolute left-[45%] top-[65%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
               onClick={() => setActiveNetworkId('n5')}
             >
               <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 relative hover:scale-110 transition-transform">
                 <CreditCard className="w-5 h-5" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">UPI Transaction</div>
             </div>

             <div 
               className="absolute left-[65%] top-[70%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
               onClick={() => setActiveNetworkId('n3')}
             >
               <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 relative hover:scale-110 transition-transform">
                 <MapPin className="w-5 h-5" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Safehouse Location</div>
             </div>
             
             {/* Secondary nodes */}
             <div className="absolute left-[20%] top-[40%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
               <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Briefcase className="w-4 h-4" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Case File #12A</div>
             </div>
             <div className="absolute left-[85%] top-[45%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
               <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:scale-110 transition-transform">
                 <User className="w-4 h-4" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Suspect Bravo</div>
             </div>
             <div className="absolute left-[35%] top-[80%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
               <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Briefcase className="w-4 h-4" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Case File #99B</div>
             </div>
             <div className="absolute left-[50%] top-[85%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
               <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)] hover:scale-110 transition-transform">
                 <Car className="w-4 h-4" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Escort Vehicle</div>
             </div>
             <div className="absolute left-[80%] top-[80%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10">
               <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:scale-110 transition-transform">
                 <Smartphone className="w-4 h-4" />
               </div>
               <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Intercepted Call</div>
             </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className={`w-full lg:w-72 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-6">Network Metrics</h3>
             
             <div className="space-y-6">
               <div>
                 <div className="flex justify-between items-end mb-2">
                   <span className="font-bold text-sm">Kingpin Score</span>
                   <span className="font-mono text-lg font-black text-red-500">{activeNetwork.metrics.kingpin}/100</span>
                 </div>
                 <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${activeNetwork.metrics.kingpin}%` }}></div>
                 </div>
               </div>

               <div>
                 <div className="flex justify-between items-end mb-2">
                   <span className="font-bold text-sm">Network Strength</span>
                   <span className="font-mono text-lg font-black text-amber-500">{activeNetwork.metrics.strength}%</span>
                 </div>
                 <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${activeNetwork.metrics.strength}%` }}></div>
                 </div>
               </div>

               <div>
                 <div className="flex justify-between items-end mb-2">
                   <span className="font-bold text-sm">Collapse Potential</span>
                   <span className="font-mono text-lg font-black text-emerald-500">{activeNetwork.metrics.collapse}%</span>
                 </div>
                 <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${activeNetwork.metrics.collapse}%` }}></div>
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between items-end mb-2">
                   <span className="font-bold text-sm">Mutation Probability</span>
                   <span className="font-mono text-lg font-black text-purple-500">{activeNetwork.metrics.mutation}%</span>
                 </div>
                 <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${activeNetwork.metrics.mutation}%` }}></div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
         <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
           <Zap className="w-4 h-4 text-amber-500" />
           AI Network Summary
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700">
             <div className="text-xs text-gray-500 mb-1">Target Network</div>
             <div className="font-black text-lg text-red-600 dark:text-red-400">{activeNetwork.summary.target}</div>
           </div>
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700">
             <div className="text-xs text-gray-500 mb-1">Likely Expansion</div>
             <div className="font-bold text-lg">{activeNetwork.summary.expansion}</div>
           </div>
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700">
             <div className="text-xs text-gray-500 mb-1">Predicted Route</div>
             <div className="font-bold text-lg">{activeNetwork.summary.route}</div>
           </div>
           <div className={`p-4 rounded-lg border ${activeNetwork.summary.risk === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50' : activeNetwork.summary.risk === 'HIGH' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/50' : activeNetwork.summary.risk === 'MEDIUM' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/50' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50'}`}>
             <div className={`text-xs font-bold mb-1 uppercase tracking-wider ${activeNetwork.summary.risk === 'CRITICAL' ? 'text-red-600/70 dark:text-red-400/70' : activeNetwork.summary.risk === 'HIGH' ? 'text-orange-600/70 dark:text-orange-400/70' : activeNetwork.summary.risk === 'MEDIUM' ? 'text-amber-600/70 dark:text-amber-400/70' : 'text-blue-600/70 dark:text-blue-400/70'}`}>Risk Level</div>
             <div className={`font-black text-lg ${activeNetwork.summary.risk === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : activeNetwork.summary.risk === 'HIGH' ? 'text-orange-600 dark:text-orange-400' : activeNetwork.summary.risk === 'MEDIUM' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>{activeNetwork.summary.risk}</div>
           </div>
         </div>
      </div>
    </div>
  );
}

function IntelligenceFeedView({ highContrast }: { highContrast: boolean }) {
  const [activeAlertId, setActiveAlertId] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/intelligence/feed`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((t: any) => ({
            id: t._id,
            title: t.type || 'Intelligence Alert',
            severity: t.level || t.severity || 'Medium',
            time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString() : 'Recently',
            desc: t.description || t.details || '',
            score: t.confidenceScore ?? t.score ?? 75,
            location: t.location || '',
            sources: t.sources || [],
            affectedCases: t.affectedCases || [],
          }));
          setAlerts(mapped);
          if (!activeAlertId && mapped.length > 0) setActiveAlertId(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch Intelligence Feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Syncing Intelligence Feeds...</div>;

  const filteredAlerts = activeFilter ? alerts.filter(a => a.severity === activeFilter) : alerts;
  const activeAlert = alerts.find(a => a.id === activeAlertId) || alerts[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            Threat Intelligence Center
          </h2>
          <p className="text-gray-500 font-medium">Real-time intelligence monitoring.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden mb-6">
        {/* Left Panel */}
        <div className={`w-full lg:w-48 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar`}>
           <div className={`rounded-xl border p-4 flex flex-col gap-2 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-2">Threat Levels</h3>
             {[
               { label: 'Critical', color: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400', icon: ShieldAlert },
               { label: 'High', color: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-orange-400', icon: AlertTriangle },
               { label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400', icon: AlertCircle },
               { label: 'Low', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400', icon: Eye }
             ].map(level => (
               <button 
                 key={level.label} 
                 onClick={() => setActiveFilter(activeFilter === level.label ? null : level.label)}
                 className={`flex items-center gap-2 p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${level.color} ${activeFilter === level.label ? 'ring-2 ring-offset-1 ring-emerald-500 dark:ring-offset-stone-900 scale-[1.02]' : activeFilter ? 'opacity-50 grayscale' : ''}`}
               >
                 <level.icon className="w-4 h-4 shrink-0" />
                 {level.label}
               </button>
             ))}
           </div>
        </div>
        
        {/* Center: Live Feed */}
        <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center shrink-0">
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Live Feed
             </h3>
             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Updating...</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
               <div 
                 key={alert.id}
                 onClick={() => setActiveAlertId(alert.id)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all ${activeAlertId === alert.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10' : 'hover:border-gray-300 dark:hover:border-stone-600'} ${highContrast ? 'bg-stone-950 border-stone-800' : 'bg-gray-50/50 border-gray-100'}`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${alert.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : alert.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' : alert.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                       {alert.severity}
                     </span>
                     <h4 className="font-bold text-base text-gray-900 dark:text-white">{alert.title}</h4>
                   </div>
                   <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.time}</span>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400">{alert.desc}</p>
               </div>
             )) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Activity className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-medium text-sm">No alerts match the selected filter.</p>
                </div>
             )}
          </div>
        </div>
        
        {/* Right Panel */}
        <div className={`w-full lg:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border p-5 flex-1 flex flex-col ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-6 pb-4 border-b border-gray-100 dark:border-stone-800">Alert Details</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{activeAlert.title}</h4>
                <p className="text-sm text-gray-500">{activeAlert.desc}</p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Confidence Score</span>
                  <span className={`font-mono text-xl font-black transition-colors duration-500 ${activeAlert?.score >= 90 ? 'text-emerald-500' : activeAlert?.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{activeAlert?.score}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${activeAlert?.score >= 90 ? 'bg-emerald-500' : activeAlert?.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${activeAlert?.score || 0}%` }}></div>
                </div>
              </div>

              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500 block mb-3">Evidence Sources</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-stone-800 rounded text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1"><Video className="w-3 h-3" /> CCTV</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-stone-800 rounded text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1"><Globe className="w-3 h-3" /> OSINT</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-stone-800 rounded text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1"><Smartphone className="w-3 h-3" /> SIGINT</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500 block mb-3">Affected Cases</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded border border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold">MH-2026-4001</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
         <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
           <Activity className="w-4 h-4" />
           Threat Timeline
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700">
             <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Morning</div>
             <div className="font-black text-2xl">12 <span className="text-sm font-medium text-gray-400">Alerts</span></div>
           </div>
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700">
             <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Afternoon</div>
             <div className="font-black text-2xl">28 <span className="text-sm font-medium text-gray-400">Alerts</span></div>
           </div>
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700">
             <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Night</div>
             <div className="font-black text-2xl text-red-600 dark:text-red-400">45 <span className="text-sm font-medium text-gray-400">Alerts</span></div>
           </div>
           <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
             <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-bold mb-1 uppercase tracking-wider">Weekly Trend</div>
             <div className="font-black text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
               <TrendingUpIcon /> +14%
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function EvidenceVaultView({ highContrast }: { highContrast: boolean }) {
  const [activeEvidenceId, setActiveEvidenceId] = useState<any>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [evidences, setEvidences] = useState<any[]>([]);
  const [caseIdFilter, setCaseIdFilter] = useState('MH-2026-4001');
  const [loading, setLoading] = useState(true);

  const typeIconMap: Record<string, any> = { 'Video': Video, 'Audio': Mic, 'Photos': ImageIcon, 'Device Dumps': Smartphone, 'Documents': FileText };
  const typeColorMap: Record<string, string> = { 'Video': 'text-blue-500 bg-blue-50', 'Audio': 'text-amber-500 bg-amber-50', 'Photos': 'text-emerald-500 bg-emerald-50', 'Device Dumps': 'text-purple-500 bg-purple-50', 'Documents': 'text-red-500 bg-red-50' };

  const fetchEvidence = async (caseId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/evidence/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((e: any) => ({
          id: e._id,
          title: e.url?.split('/').pop() || e.type,
          type: e.type,
          date: e.metadata?.timestamp ? new Date(e.metadata.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown',
          size: e.metadata?.size || 'N/A',
          icon: typeIconMap[e.type] || FileText,
          color: typeColorMap[e.type] || 'text-gray-500 bg-gray-100',
          uploader: e.uploaderId || 'Unknown',
          location: e.metadata?.location || 'Unknown',
          chainOfCustodyHash: e.chainOfCustodyHash,
          aiAnalysis: e.aiAnalysis || {}
        }));
        setEvidences(mapped);
        if (mapped.length > 0) setActiveEvidenceId(mapped[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch Evidence Vault:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvidence(caseIdFilter); }, [caseIdFilter]);

  if (loading) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Loading Evidence Vault...</div>;

  const activeEv = evidences.find(e => e.id === activeEvidenceId) || evidences[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Archive className="w-6 h-6 text-emerald-600" />
            Digital Forensics Center
          </h2>
          <p className="text-gray-500 font-medium">Store and analyze evidence.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden mb-6">
        
        {/* Center: Evidence Repository */}
        <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
           <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex flex-wrap justify-between items-center gap-3 shrink-0">
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500">Evidence Repository</h3>
             <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Case ID:</span>
               <select
                 value={caseIdFilter}
                 onChange={e => setCaseIdFilter(e.target.value)}
                 className={`text-xs font-bold py-1 px-2 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500 ${highContrast ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
               >
                 <option value="MH-2026-4001">MH-2026-4001</option>
                 <option value="MH-2026-3992">MH-2026-3992</option>
                 <option value="DL-2026-0881">DL-2026-0881</option>
                 <option value="WB-2026-1104">WB-2026-1104</option>
               </select>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
               {evidences.map(ev => (
                 <div 
                   key={ev.id}
                   onClick={() => setActiveEvidenceId(ev.id)}
                   className={`p-4 rounded-xl border cursor-pointer transition-all ${activeEvidenceId === ev.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10' : 'hover:border-gray-300 dark:hover:border-stone-600'} ${highContrast ? 'bg-stone-950 border-stone-800' : 'bg-gray-50/50 border-gray-100'}`}
                 >
                   <div className="flex items-start gap-3">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${ev.color} dark:bg-opacity-10`}>
                       <ev.icon className="w-5 h-5" />
                     </div>
                     <div className="min-w-0">
                       <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate mb-1" title={ev.title}>{ev.title}</h4>
                       <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                         <span>{ev.type}</span>
                         <span>•</span>
                         <span>{ev.size}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className={`w-full lg:w-96 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <div className="w-full h-48 bg-black relative flex items-center justify-center shrink-0 group">
              {activeEv.type === 'Video' ? (
                <>
                  <img src="https://images.unsplash.com/photo-1544391629-9e8c441b181e?auto=format&fit=crop&w=600&q=80" alt="Preview" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                  </div>
                </>
              ) : activeEv.type === 'Photos' ? (
                 <img src="https://images.unsplash.com/photo-1596726111003-888f4e24da27?auto=format&fit=crop&w=600&q=80" alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500 flex flex-col items-center gap-2">
                  <activeEv.icon className="w-12 h-12 opacity-50" />
                  <span className="text-sm font-medium">Preview not available</span>
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col border-b border-gray-100 dark:border-stone-800">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white truncate">{activeEv.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Timestamp</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><Clock className="w-3 h-3" /> {activeEv.date}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Location</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeEv?.location || 'Unknown'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Uploader</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><User className="w-3 h-3" /> {activeEv.uploader}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  disabled={downloadStatus !== null}
                  onClick={() => {
                    setDownloadStatus('downloading');
                    setTimeout(() => setDownloadStatus('done'), 1500);
                    setTimeout(() => setDownloadStatus(null), 3000);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 text-white font-bold rounded-lg transition-colors text-sm disabled:cursor-not-allowed ${downloadStatus === 'done' ? 'bg-blue-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {downloadStatus === 'downloading' ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span> Downloading...</>
                  ) : downloadStatus === 'done' ? (
                    <><Check className="w-4 h-4" /> Download Complete</>
                  ) : (
                    <><Download className="w-4 h-4" /> Download Evidence</>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-5 bg-gray-50 dark:bg-stone-900/50">
               <h4 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
                 <Cpu className="w-4 h-4 text-emerald-600" />
                 AI Analysis Panel
               </h4>
               <div className="space-y-3">
                 <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-stone-950 border border-gray-100 dark:border-stone-800">
                   <span className="text-sm font-medium">Faces Detected</span>
                   <span className="font-mono font-bold text-emerald-600">3</span>
                 </div>
                 <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-stone-950 border border-gray-100 dark:border-stone-800">
                   <span className="text-sm font-medium">Vehicles Identified</span>
                   <span className="font-mono font-bold text-emerald-600">1</span>
                 </div>
                 <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-stone-950 border border-gray-100 dark:border-stone-800">
                   <span className="text-sm font-medium">Text Extracted</span>
                   <span className="font-mono font-bold text-gray-400">None</span>
                 </div>
                 <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-stone-950 border border-gray-100 dark:border-stone-800">
                   <span className="text-sm font-medium">Objects Detected</span>
                   <span className="font-mono font-bold text-emerald-600">Backpack</span>
                 </div>
                 <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-stone-950 border border-gray-100 dark:border-stone-800">
                   <span className="text-sm font-medium">Related Cases</span>
                   <span className="font-mono font-bold text-blue-500 underline cursor-pointer">MH-2026-4001</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
         <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
           <Link2 className="w-4 h-4" />
           Chain of Custody
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-4 h-4" />
             </div>
             <div>
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Created</div>
               <div className="font-bold text-sm">Oct 24, 14:30</div>
             </div>
           </div>
           
           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-4 h-4" />
             </div>
             <div>
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Verified</div>
               <div className="font-bold text-sm">Oct 24, 15:15</div>
             </div>
           </div>

           <div className="p-4 rounded-lg bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-4 h-4" />
             </div>
             <div>
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Reviewed</div>
               <div className="font-bold text-sm">Oct 25, 09:00</div>
             </div>
           </div>

           <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-stone-700 flex items-center gap-3 opacity-60">
             <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 dark:bg-stone-800 flex items-center justify-center shrink-0">
               <Square className="w-4 h-4" />
             </div>
             <div>
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Used In Court</div>
               <div className="font-bold text-sm text-gray-400">Pending</div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

function LiveCasesView({ highContrast }: { highContrast: boolean }) {
  const [activeCategory, setActiveCategory] = useState("Active");
  const [activeCaseId, setActiveCaseId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isCaseFileOpen, setIsCaseFileOpen] = useState(false);  
  const [categories, setCategories] = useState([
    { label: "Active", count: 0, color: "emerald" },
    { label: "Escalated", count: 0, color: "red" },
    { label: "Cold Cases", count: 0, color: "gray" },
    { label: "Unassigned Cases", count: 0, color: "amber" }
  ]);

  const [allCases, setAllCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/dashboard/cases`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || categories);
          setAllCases(data.cases || []);
        }
      } catch (err) {
        console.error("Failed to fetch Cases data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Syncing Case Files...</div>;

  const filteredCases = allCases.filter(c => 
    c.category === activeCategory &&
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const activeCase = allCases.find(c => c.id === activeCaseId) || filteredCases[0] || allCases[0];

  if (!activeCase) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold">No active cases found.</div>;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black mb-1 tracking-tight text-emerald-950 dark:text-emerald-500 uppercase">Live Cases</h1>
          <p className="text-sm font-medium text-emerald-700/70 dark:text-emerald-400/70 tracking-widest uppercase">Case Command Center</p>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className={`p-4 rounded-xl border mb-6 flex flex-wrap items-center gap-4 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Cases..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/20 ${highContrast ? "bg-stone-800 border-stone-700" : "bg-gray-50 border border-gray-200"}`}
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-gray-500">Filter by:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {["State", "District", "Risk", "Officer", "Duration", "Status"].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(activeFilter === filter ? null : filter)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${activeFilter === filter ? "bg-gray-200 border-gray-300 dark:bg-stone-700 text-gray-800 dark:text-white" : highContrast ? "border-stone-700 hover:bg-stone-800 text-gray-300" : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600 focus:bg-gray-100"}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area (2 Columns + Bottom) */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 mb-6">
        
        {/* Center: Dynamic Case Board & Categories */}
        <div className={`flex-1 min-w-0 rounded-xl border flex flex-col overflow-hidden min-h-[calc(100vh-220px)] ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
          {/* Horizontal Categories */}
          <div className="p-3 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex overflow-x-auto hide-scrollbar gap-2 shrink-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button 
                  key={cat.label} 
                  onClick={() => {
                    setActiveCategory(cat.label);
                    const newFirstCase = allCases.find(c => c.category === cat.label);
                    if (newFirstCase) setActiveCaseId(newFirstCase.id);
                  }}
                  className={`px-4 py-2 rounded-lg border flex justify-between items-center whitespace-nowrap transition-all duration-200 shadow-sm gap-3
                  ${isActive ? 'ring-2 ring-offset-1 ring-emerald-500/30' : ''}
                  ${cat.color === 'emerald' ? `border-emerald-100 hover:bg-emerald-100 text-emerald-800 ${isActive ? 'bg-emerald-100' : 'bg-emerald-50'}` : ''}
                  ${cat.color === 'red' ? `border-red-100 hover:bg-red-100 text-red-800 ${isActive ? 'bg-red-100' : 'bg-red-50'}` : ''}
                  ${cat.color === 'gray' ? `border-gray-200 hover:bg-gray-100 text-gray-700 dark:border-stone-700 dark:text-gray-300 ${isActive ? 'bg-gray-100 dark:bg-stone-700' : 'bg-gray-50 dark:bg-stone-800'}` : ''}
                  ${cat.color === 'amber' ? `border-amber-100 hover:bg-amber-100 text-amber-800 ${isActive ? 'bg-amber-100' : 'bg-amber-50'}` : ''}
                `}>
                  <span className="font-bold text-sm">{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold
                    ${cat.color === 'emerald' ? 'bg-emerald-200 text-emerald-800' : ''}
                    ${cat.color === 'red' ? 'bg-red-200 text-red-800' : ''}
                    ${cat.color === 'gray' ? 'bg-gray-200 text-gray-800 dark:bg-stone-600 dark:text-gray-200' : ''}
                    ${cat.color === 'amber' ? 'bg-amber-200 text-amber-800' : ''}
                  `}>{cat.count}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-sm tracking-widest uppercase text-gray-500">Dynamic Case Board</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">{filteredCases.length} Results</span>
          </div>

          <div className="flex-1 p-4 bg-gray-50/30 dark:bg-stone-950/30 overflow-x-auto hide-scrollbar">
            {filteredCases.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No cases found in this category.</p>
              </div>
            ) : (
              <div className="flex flex-nowrap items-stretch gap-4 pb-2">
                {/* Case Cards */}
                {filteredCases.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => setActiveCaseId(c.id)}
                    className={`min-w-[320px] w-[320px] shrink-0 p-4 rounded-xl border flex gap-4 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg group ${activeCaseId === c.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10' : ''} ${highContrast ? "border-stone-700 bg-stone-800 hover:bg-stone-700" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="w-24 h-32 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-300 relative shadow-sm">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 pr-2">
                            <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-0.5 truncate">ID: MH-2026-{4000+c.id}</div>
                            <h4 className="font-bold text-lg leading-tight text-gray-900 dark:text-white truncate">{c.name}</h4>
                            <div className="text-xs text-gray-500 font-medium">Age: {c.age} yrs</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 space-y-2 shrink-0">
                         <div className={`w-fit px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm ${c.risk > 90 ? 'bg-red-50 text-red-700 border-red-200' : c.risk > 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                           Risk Score: {c.risk}
                         </div>
                        <div className="flex flex-wrap gap-2 text-[10px]">
                          <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-100 shrink-0">
                            <Clock className="w-3 h-3 shrink-0" /> {c.missingHours}h
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-100 shrink-0">
                            <Activity className="w-3 h-3 shrink-0" /> {c.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Case Details / Focus */}
        <div className={`w-full lg:w-80 shrink-0 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center">
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500">Case Focus</h3>
            <span className="text-xs font-bold text-gray-400 font-mono">MH-2026-{4000+activeCase.id}</span>
          </div>
          <div className="p-5 flex-1 overflow-y-auto space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-stone-800 pb-4">
               <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                  <img src={activeCase.img} alt={activeCase.name} className="w-full h-full object-cover" />
               </div>
               <div>
                 <h4 className="font-black text-lg">{activeCase.name}</h4>
                 <p className="text-sm text-gray-500 font-medium">Status: {activeCase.status}</p>
               </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Officer Assigned</h4>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-stone-800 bg-gray-50 dark:bg-stone-900/50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Insp. Smith Kadam" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-sm">Insp. Smith Kadam</div>
                  <div className="text-xs text-gray-500">Mumbai Crime Branch</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Latest Activity</h4>
              <div className="text-sm font-medium p-3 bg-blue-50 text-blue-900 border border-blue-100 rounded-lg shadow-sm">
                {activeCase.id === 1 ? "CCTV footage requested from Pune Railway Station." : 
                 activeCase.id === 3 ? "Escalated to national grid due to state border crossing." :
                 "Interrogating primary witnesses at last known location."}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Last Seen</h4>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-stone-800">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">
                  {activeCase.id % 2 === 0 ? "Andheri West, Mumbai" : "Sector 14 Market, Navi Mumbai"}<br/>
                  <span className="text-xs text-gray-500">Oct 24, 2026 - 14:30 IST</span>
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Most Recent Lead</h4>
              <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-800 mb-1">Unverified Sighting</div>
                    <div className="text-sm text-amber-900 leading-tight">Similar description matched at {activeCase.id === 1 ? "Lonavala toll plaza" : "city limits"}. Vehicle plate partial match.</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={() => setIsCaseFileOpen(true)} className="w-full py-2.5 bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-md transition-colors">
              Open Full Case File
            </button>
          </div>
        </div>

      </div>

      {/* Bottom: Investigation Timeline */}
      <div className={`rounded-xl border p-5 shrink-0 overflow-x-auto ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500">Investigation Timeline</h3>
          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">Case: MH-2026-{4000+activeCase.id}</span>
        </div>
        
        <div className="flex items-center min-w-max pb-2">
          {[
            { label: "Reported", status: "done" },
            { label: "Verified", status: "done" },
            { label: "Evidence Added", status: activeCase.missingHours > 24 ? "done" : "active" },
            { label: "Sighting Found", status: activeCase.missingHours > 24 ? "active" : "pending" },
            { label: "Investigation Update", status: activeCase.status === "Investigating" ? "active" : "pending" },
            { label: "Recovered", status: activeCase.status === "Recovered" ? "done" : "pending" },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center">
              {/* Node */}
              <div className="flex flex-col items-center relative z-10 w-28">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300
                  ${step.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                  ${step.status === 'active' ? 'bg-white border-emerald-500 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-110' : ''}
                  ${step.status === 'pending' ? 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-stone-800 dark:border-stone-600' : ''}
                `}>
                  {step.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : 
                   step.status === 'active' ? <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> : 
                   <span className="text-xs font-bold">{i+1}</span>}
                </div>
                <div className={`text-[10px] font-bold text-center uppercase tracking-wider transition-colors duration-300
                  ${step.status === 'done' ? 'text-emerald-700 dark:text-emerald-400' : ''}
                  ${step.status === 'active' ? 'text-emerald-600 dark:text-emerald-500' : ''}
                  ${step.status === 'pending' ? 'text-gray-400' : ''}
                `}>{step.label}</div>
              </div>
              
              {/* Connector */}
              {i < arr.length - 1 && (
                <div className={`w-28 h-1 -ml-4 -mr-4 -mt-6 transition-colors duration-500
                  ${step.status === 'done' ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-stone-700'}
                `}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Case File Modal */}
      {isCaseFileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCaseFileOpen(false)}></div>
          <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${highContrast ? "bg-stone-900 border border-stone-800" : "bg-white"}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-stone-800">
              <div>
                <h3 className="text-lg font-black uppercase text-gray-900 dark:text-white">Full Case File: MH-2026-{4000+activeCase.id}</h3>
                <p className="text-xs font-bold text-gray-500">{activeCase.name} - {activeCase.status}</p>
              </div>
              <button onClick={() => setIsCaseFileOpen(false)} className="p-2 bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-stone-950">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-40 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                  <img src={activeCase.img} alt={activeCase.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Name</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{activeCase.name}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Age</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{activeCase.age} yrs</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Missing Hours</span>
                    <span className="text-sm font-black text-amber-600">{activeCase.missingHours}h</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Risk Score</span>
                    <span className={`text-sm font-black ${activeCase.risk > 90 ? 'text-red-600' : 'text-amber-600'}`}>{activeCase.risk}/100</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                    <span className="text-sm font-black text-emerald-600">{activeCase.status}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-gray-100 dark:border-stone-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">{activeCase.category}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-gray-100 dark:border-stone-800 shadow-sm">
                <h4 className="font-bold text-sm tracking-widest uppercase text-gray-500 mb-4 border-b border-gray-100 pb-2">Case Narrative</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Subject was last seen at {activeCase.id % 2 === 0 ? "Andheri West, Mumbai" : "Sector 14 Market, Navi Mumbai"} on Oct 24, 2026. 
                  Initial reports suggest possible transit towards {activeCase.id === 1 ? "Pune" : "Nashik"} via public transportation. 
                  Local authorities have been notified and CCTV footage from all major transit hubs is currently under AI review. 
                  The case has been flagged with a risk score of {activeCase.risk} due to recent similar incidents in the district.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-end gap-3">
              <button onClick={() => setIsCaseFileOpen(false)} className="px-4 py-2 font-bold text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-stone-800 rounded-lg transition-colors">Close</button>
              <button onClick={() => { setIsCaseFileOpen(false); }} className="px-4 py-2 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadFusionCenterView({ highContrast }: { highContrast: boolean }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeLeadId, setActiveLeadId] = useState(1);

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/dashboard/leads`);
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      } catch (err) {
        console.error("Failed to fetch Leads data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Aggregating Global Feeds...</div>;

  const handleAction = async (action: string) => {
    const activeLead = leads.find(l => l.id === activeLeadId);
    if (!activeLead) return;

    if (action === 'Verify') {
      try {
        await fetch(`${import.meta.env.VITE_IWR_API_URL}/leads/${activeLead.id}/verify`, { method: 'PUT' });
      } catch (err) {
        console.error('Verify API failed, updating locally:', err);
      }
    }

    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id === activeLeadId) {
        switch (action) {
          case 'Escalate': return { ...lead, priority: "Critical", confidence: Math.min(100, lead.confidence + 10) };
          case 'Merge': return { ...lead, linkedCase: "MH-2026-4001" };
          case 'Verify': return { ...lead, status: "Verified" };
          default: return lead;
        }
      }
      return lead;
    }).filter(lead => action !== 'Archive' || lead.id !== activeLeadId));
    
    if (action === 'Archive') {
      const remainingLeads = leads.filter(l => l.id !== activeLeadId);
      if (remainingLeads.length > 0) setActiveLeadId(remainingLeads[0].id);
    }
  };


  const filteredLeads = activeFilter === "All" ? leads : leads.filter(l => l.status === activeFilter);
  const activeLead = leads.find(l => l.id === activeLeadId) || leads[0];

  if (!activeLead) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold">No active leads found.</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Radar className="w-6 h-6 text-emerald-600" />
            Lead Fusion Center
          </h2>
          <p className="text-gray-500 font-medium">Convert citizen reports into actionable intelligence.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden mb-6">
        {/* Left Panel */}
        <div className={`w-full lg:w-48 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar`}>
           <div className={`rounded-xl border p-4 flex flex-col gap-2 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-2">Lead Status</h3>
             <button 
               onClick={() => setActiveFilter("All")}
               className={`flex justify-between items-center p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${activeFilter === "All" ? 'bg-gray-100 dark:bg-stone-800 border-gray-300 dark:border-stone-600 ring-2 ring-emerald-500 dark:ring-offset-stone-900' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-stone-800/50'}`}
             >
               All Leads
               <span className="text-xs bg-gray-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">{leads.length}</span>
             </button>
             {[
               { label: 'Unverified', color: 'text-gray-500 bg-gray-50 border-gray-200 dark:bg-stone-800 dark:border-stone-700', icon: HelpCircle },
               { label: 'AI Reviewed', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400', icon: Cpu },
               { label: 'Officer Reviewed', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400', icon: User },
               { label: 'Verified', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400', icon: CheckCircle2 }
             ].map(level => {
               const count = leads.filter(l => l.status === level.label).length;
               return (
                 <button 
                   key={level.label} 
                   onClick={() => setActiveFilter(level.label)}
                   className={`flex justify-between items-center p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${level.color} ${activeFilter === level.label ? 'ring-2 ring-offset-1 ring-emerald-500 dark:ring-offset-stone-900 scale-[1.02]' : activeFilter !== "All" ? 'opacity-50 grayscale' : ''}`}
                 >
                   <div className="flex items-center gap-2">
                     <level.icon className="w-4 h-4 shrink-0" />
                     {level.label}
                   </div>
                   <span className="text-xs font-mono bg-white/50 dark:bg-black/50 px-1.5 py-0.5 rounded">{count}</span>
                 </button>
               );
             })}
           </div>
        </div>
        
        {/* Center: Live Incoming Leads */}
        <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center shrink-0">
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Live Incoming Leads
             </h3>
             <div className="flex gap-2">
               {['Sightings', 'Anonymous Tips', 'Witness Reports', 'Media Uploads'].map(cat => (
                 <span key={cat} className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-stone-800 dark:text-gray-400 px-2 py-1 rounded-full border border-gray-200 dark:border-stone-700 hidden sm:inline-block">{cat}</span>
               ))}
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {filteredLeads.length > 0 ? filteredLeads.map(lead => (
               <div 
                 key={lead.id}
                 onClick={() => setActiveLeadId(lead.id)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all ${activeLeadId === lead.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10' : 'hover:border-gray-300 dark:hover:border-stone-600'} ${highContrast ? 'bg-stone-950 border-stone-800' : 'bg-gray-50/50 border-gray-100'}`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${lead.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : lead.status === 'Officer Reviewed' ? 'bg-amber-50 text-amber-700 border-amber-200' : lead.status === 'AI Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-stone-800 dark:text-gray-400 dark:border-stone-700'}`}>
                       {lead.status === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : lead.status === 'Officer Reviewed' ? <User className="w-3 h-3" /> : lead.status === 'AI Reviewed' ? <Cpu className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                       {lead.status}
                     </span>
                     <span className="text-xs font-bold text-gray-500">{lead.type}</span>
                   </div>
                   <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.time}</span>
                 </div>
                 <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">{lead.title}</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{lead.desc}</p>
               </div>
             )) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Radar className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-medium text-sm">No leads match the selected filter.</p>
                </div>
             )}
          </div>
        </div>
        
        {/* Right Panel */}
        <div className={`w-full lg:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border p-5 flex-1 flex flex-col ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-6 pb-4 border-b border-gray-100 dark:border-stone-800">Lead Analysis</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{activeLead.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{activeLead.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900/50">Source: {activeLead.source}</span>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-500">AI Confidence</span>
                  <span className={`font-mono text-xl font-black transition-colors duration-500 ${activeLead.confidence >= 80 ? 'text-emerald-500' : activeLead.confidence >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{activeLead.confidence}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${activeLead.confidence >= 80 ? 'bg-emerald-500' : activeLead.confidence >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${activeLead.confidence}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Location</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-start gap-1"><MapPin className="w-4 h-4 shrink-0 text-emerald-500" /> <span className="line-clamp-2">{activeLead.location}</span></span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Dist from Last Seen</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1"><Activity className="w-4 h-4 text-blue-500" /> {activeLead.distance}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Priority</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${!activeLead ? 'text-gray-900' : activeLead.priority === 'Critical' ? 'text-red-600 dark:text-red-400' : activeLead.priority === 'High' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}><AlertCircle className="w-4 h-4 shrink-0" /> {activeLead?.priority}</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Assigned To</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1"><User className="w-4 h-4 text-emerald-500" /> {activeLead?.assignedOfficer}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500 block mb-3">Linked Case</span>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeLead?.linkedCase !== 'None' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-gray-100 text-gray-400 dark:bg-stone-800'}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-bold ${activeLead?.linkedCase !== 'None' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{activeLead?.linkedCase}</span>
                  </div>
                  {activeLead?.linkedCase !== 'None' && <ArrowRight className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
         <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
           <Cpu className="w-4 h-4 text-emerald-500" />
           AI Recommendation Engine
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <button onClick={() => handleAction('Escalate')} disabled={!activeLead} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
             <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Escalate</span>
           </button>
           
           <button onClick={() => handleAction('Merge')} disabled={!activeLead} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
             <Merge className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Merge</span>
           </button>

           <button onClick={() => handleAction('Verify')} disabled={!activeLead} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
             <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Req. Verification</span>
           </button>

           <button onClick={() => handleAction('Archive')} disabled={!activeLead} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 dark:bg-stone-800 dark:border-stone-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
             <Archive className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Archive</span>
           </button>
         </div>
      </div>
    </div>
  );
}

function TacticalDeploymentCenterView({ highContrast }: { highContrast: boolean }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTeamId, setActiveTeamId] = useState<any>(null);
  const [selectedDeployTeam, setSelectedDeployTeam] = useState("Team Alpha");
  const [selectedDeployZone, setSelectedDeployZone] = useState("Siliguri Corridor Sector 4");
  const [teams, setTeams] = useState<any[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'done'>('idle');

  useEffect(() => {
    const fetchOps = async () => {
      setLoadingTeams(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_IWR_API_URL}/operations`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((op: any, i: number) => ({
            id: op._id || i,
            type: 'Ground Teams',
            status: op.status || 'Standby',
            name: op.teamName,
            location: op.currentMission?.searchZone || 'Base',
            eta: op.currentMission?.etaMinutes ? `${op.currentMission.etaMinutes} min` : 'N/A',
            coverage: op.currentMission?.expectedCoverage ?? 75,
            success: op.currentMission?.successProbability ?? 80,
            mission: op.status === 'Airborne' ? 'Aerial Search' : op.status === 'On Mission' ? 'Active Search' : op.status
          }));
          setTeams(mapped);
          if (mapped.length > 0) setActiveTeamId(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch Operations:', err);
      } finally {
        setLoadingTeams(false);
      }
    };
    fetchOps();
    const interval = setInterval(fetchOps, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    setDeployStatus('deploying');
    try {
      await fetch(`${import.meta.env.VITE_IWR_API_URL}/operations/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: selectedDeployTeam, searchZone: selectedDeployZone, etaMinutes: 14 })
      });
      setTeams(prev => prev.map(t => t.name === selectedDeployTeam
        ? { ...t, status: 'On Mission', location: selectedDeployZone, eta: '14 min', coverage: 81, mission: 'Deployment' }
        : t));
      setDeployStatus('done');
      setTimeout(() => setDeployStatus('idle'), 3000);
    } catch (err) {
      console.error('Deploy failed:', err);
      setDeployStatus('idle');
    }
  };


  const filteredTeams = activeFilter === "All" ? teams : teams.filter(t => t.status === activeFilter);
  const activeTeam = teams.find(t => t.id === activeTeamId) || teams[0];

  if (loadingTeams) return <div className="flex items-center justify-center h-full text-emerald-600 font-bold animate-pulse">Loading Operational Units...</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            Tactical Deployment Center
          </h2>
          <p className="text-gray-500 font-medium">Coordinate rescue missions.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden mb-6">
        {/* Left Panel */}
        <div className={`w-full lg:w-48 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar`}>
           <div className={`rounded-xl border p-4 flex flex-col gap-2 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-2">Team Status</h3>
             <button 
               onClick={() => setActiveFilter("All")}
               className={`flex justify-between items-center p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${activeFilter === "All" ? 'bg-gray-100 dark:bg-stone-800 border-gray-300 dark:border-stone-600 ring-2 ring-emerald-500 dark:ring-offset-stone-900' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-stone-800/50'}`}
             >
               All Teams
               <span className="text-xs bg-gray-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">{teams.length}</span>
             </button>
             {[
               { label: 'Available', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400', icon: Shield },
               { label: 'On Mission', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400', icon: Target },
               { label: 'Returning', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400', icon: ArrowRight },
               { label: 'Standby', color: 'text-gray-500 bg-gray-50 border-gray-200 dark:bg-stone-800 dark:border-stone-700', icon: Clock }
             ].map(level => {
               const count = teams.filter(l => l.status === level.label).length;
               return (
                 <button 
                   key={level.label} 
                   onClick={() => setActiveFilter(level.label)}
                   className={`flex justify-between items-center p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${level.color} ${activeFilter === level.label ? 'ring-2 ring-offset-1 ring-emerald-500 dark:ring-offset-stone-900 scale-[1.02]' : activeFilter !== "All" ? 'opacity-50 grayscale' : ''}`}
                 >
                   <div className="flex items-center gap-2">
                     <level.icon className="w-4 h-4 shrink-0" />
                     {level.label}
                   </div>
                   <span className="text-xs font-mono bg-white/50 dark:bg-black/50 px-1.5 py-0.5 rounded">{count}</span>
                 </button>
               );
             })}
           </div>
        </div>
        
        {/* Center: Operational Map */}
        <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center shrink-0">
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Operational Map
             </h3>
             <div className="flex gap-2">
               {['Ground Teams', 'Drones', 'Vehicles', 'Checkpoints', 'Search Zones'].map(cat => (
                 <span key={cat} className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-stone-800 dark:text-gray-400 px-2 py-1 rounded-full border border-gray-200 dark:border-stone-700 hidden sm:inline-block">{cat}</span>
               ))}
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50/50 via-white to-white dark:from-emerald-900/10 dark:via-stone-950 dark:to-stone-950">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
             {filteredTeams.length > 0 ? filteredTeams.map(team => (
               <div 
                 key={team.id}
                 onClick={() => setActiveTeamId(team.id)}
                 className={`relative z-10 p-4 rounded-xl border cursor-pointer transition-all ${activeTeamId === team.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/20' : 'hover:border-gray-300 dark:hover:border-stone-600'} ${highContrast ? 'bg-stone-950 border-stone-800' : 'bg-white border-gray-100'}`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${team.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' : team.status === 'Returning' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50' : team.status === 'On Mission' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-stone-800 dark:text-gray-400 dark:border-stone-700'}`}>
                       {team.status === 'Available' ? <CheckCircle2 className="w-3 h-3" /> : team.status === 'Returning' ? <ArrowRight className="w-3 h-3" /> : team.status === 'On Mission' ? <Target className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                       {team.status}
                     </span>
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{team.type}</span>
                   </div>
                   <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {team.location}</span>
                 </div>
                 <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">{team.name}</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Mission: {team.mission}</p>
               </div>
             )) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 relative z-10">
                  <Target className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-medium text-sm">No teams match the selected filter.</p>
                </div>
             )}
          </div>
        </div>
        
        {/* Right Panel */}
        <div className={`w-full lg:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border p-5 flex-1 flex flex-col ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-6 pb-4 border-b border-gray-100 dark:border-stone-800">Team Telemetry</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{activeTeam?.name}</h4>
                <p className="text-sm text-gray-500 mb-2">{activeTeam?.type} - {activeTeam?.location}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900/50">Status: {activeTeam?.status}</span>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Success Probability</span>
                  <span className={`font-mono text-xl font-black transition-colors duration-500 ${!activeTeam ? 'text-gray-500' : activeTeam.success >= 90 ? 'text-emerald-500' : activeTeam.success >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{activeTeam?.success ?? 0}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${!activeTeam ? 'bg-gray-500' : activeTeam.success >= 90 ? 'bg-emerald-500' : activeTeam.success >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${activeTeam?.success ?? 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Coverage</span>
                  <span className={`font-mono text-xl font-black transition-colors duration-500 ${!activeTeam ? 'text-gray-500' : activeTeam.coverage >= 80 ? 'text-blue-500' : activeTeam.coverage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{activeTeam?.coverage ?? 0}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${!activeTeam ? 'bg-gray-500' : activeTeam.coverage >= 80 ? 'bg-blue-500' : activeTeam.coverage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${activeTeam?.coverage ?? 0}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">ETA</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-500" /> {activeTeam?.eta}</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mission</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1"><Target className="w-4 h-4 text-blue-500" /> <span className="line-clamp-1">{activeTeam?.mission}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
         <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
           <MapPin className="w-4 h-4 text-emerald-500" />
           Deployment Planner
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
           <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4">
             <select value={selectedDeployTeam} onChange={e => setSelectedDeployTeam(e.target.value)} className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 font-bold text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
               <option>Team Alpha</option>
               <option>Drone Squad 1</option>
               <option>Convoy Delta</option>
               <option>Team Bravo</option>
             </select>
             <select value={selectedDeployZone} onChange={e => setSelectedDeployZone(e.target.value)} className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 font-bold text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
               <option>Search Zone 12</option>
               <option>Grid 7B</option>
               <option>Highway 9</option>
             </select>
           </div>
           <div className="flex justify-between md:justify-around items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
             <div className="text-center">
               <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">ETA</span>
               <span className="font-black text-emerald-700 dark:text-emerald-300">14 min</span>
             </div>
             <div className="w-px h-8 bg-emerald-200 dark:bg-emerald-800"></div>
             <div className="text-center">
               <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Expected Coverage</span>
               <span className="font-black text-emerald-700 dark:text-emerald-300">81%</span>
             </div>
           </div>
           <button onClick={handleDeploy} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors">
             <Target className="w-5 h-5" />
             Execute Deployment
           </button>
         </div>
      </div>
    </div>
  );
}

function AIInvestigationDeskView({ highContrast }: { highContrast: boolean }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeBriefingId, setActiveBriefingId] = useState(1);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const briefings = [
    { id: 1, type: "Evidence", status: "High Risk", title: "Encrypted Hard Drive", summary: "Contains ledgers and contact lists matching Syndicate X.", risk: 92, recovery: 85, nextAction: "Analyze Ledger", similar: "Case #4092" },
    { id: 2, type: "Witnesses", status: "Medium Risk", title: "Informant Delta", summary: "Provided timeline of the Highway 9 convoy movement.", risk: 65, recovery: 40, nextAction: "Secure Safehouse", similar: "Case #2211" },
    { id: 3, type: "Documents", status: "Low Risk", title: "Fake IDs Batch", summary: "Forged passports seized at border checkpoint.", risk: 30, recovery: 95, nextAction: "Cross-check DB", similar: "Case #1105" },
    { id: 4, type: "Timeline", status: "High Risk", title: "Meeting at Grid 7B", summary: "Surveillance footage of Kingpin Alpha meeting associates.", risk: 88, recovery: 60, nextAction: "Deploy Team Alpha", similar: "Case #3304" }
  ];

  const handleAiQuery = async (query: string) => {
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_AIFL_API_URL}/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: `Case briefing: ${activeBriefing?.title}. Summary: ${activeBriefing?.summary}. Risk: ${activeBriefing?.risk}%. Next recommended action: ${activeBriefing?.nextAction}.`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response || data.text || data.message || 'AI analysis complete.');
      } else {
        setAiResponse(`[Offline Mode] Context loaded from ${activeBriefing?.title}. Analysis complete. The system recommends proceeding with "${activeBriefing?.nextAction}" to mitigate the current ${activeBriefing?.risk}% risk factor.`);
      }
    } catch (err) {
      setAiResponse(`[Offline Mode] Context loaded from ${activeBriefing?.title}. Analysis complete. The system recommends proceeding with "${activeBriefing?.nextAction}" to mitigate the current ${activeBriefing?.risk}% risk factor.`);
    } finally {
      setIsAiLoading(false);
    }
  };


  const filteredBriefings = activeFilter === "All" ? briefings : briefings.filter(b => b.type === activeFilter);
  const activeBriefing = briefings.find(b => b.id === activeBriefingId) || briefings[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            AI Investigation Desk
          </h2>
          <p className="text-gray-500 font-medium">Generate investigation intelligence.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden mb-6">
        {/* Left Panel */}
        <div className={`w-full lg:w-48 shrink-0 flex flex-col gap-4 overflow-y-auto hide-scrollbar`}>
           <div className={`rounded-xl border p-4 flex flex-col gap-2 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-2">Case Data</h3>
             <button 
               onClick={() => setActiveFilter("All")}
               className={`flex justify-between items-center p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${activeFilter === "All" ? 'bg-gray-100 dark:bg-stone-800 border-gray-300 dark:border-stone-600 ring-2 ring-emerald-500 dark:ring-offset-stone-900' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-stone-800/50'}`}
             >
               All Data
               <span className="text-xs bg-gray-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">{briefings.length}</span>
             </button>
             {[
               { label: 'Evidence', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400', icon: Database },
               { label: 'Witnesses', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400', icon: Users },
               { label: 'Documents', color: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-stone-800 dark:border-stone-700 dark:text-gray-400', icon: FileText },
               { label: 'Timeline', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400', icon: Clock }
             ].map(level => {
               const count = briefings.filter(l => l.type === level.label).length;
               return (
                 <button 
                   key={level.label} 
                   onClick={() => setActiveFilter(level.label)}
                   className={`flex justify-between items-center p-2 rounded-lg border font-bold text-sm transition-all hover:scale-[1.02] ${level.color} ${activeFilter === level.label ? 'ring-2 ring-offset-1 ring-emerald-500 dark:ring-offset-stone-900 scale-[1.02]' : activeFilter !== "All" ? 'opacity-50 grayscale' : ''}`}
                 >
                   <div className="flex items-center gap-2">
                     <level.icon className="w-4 h-4 shrink-0" />
                     {level.label}
                   </div>
                   <span className="text-xs font-mono bg-white/50 dark:bg-black/50 px-1.5 py-0.5 rounded">{count}</span>
                 </button>
               );
             })}
           </div>
        </div>
        
        {/* Center: AI Briefing Screen */}
        <div className={`flex-1 rounded-xl border flex flex-col overflow-hidden ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
          <div className="p-4 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-stone-900 flex justify-between items-center shrink-0">
             <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 flex items-center gap-2">
               <Cpu className="w-4 h-4 text-emerald-500" />
               AI Briefing Screen
             </h3>
             <div className="flex gap-2">
               {['Case Summary', 'Risk Assessment', 'Network Associations', 'Suspect Analysis', 'Recovery Probability'].map(cat => (
                 <span key={cat} className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-stone-800 dark:text-gray-400 px-2 py-1 rounded-full border border-gray-200 dark:border-stone-700 hidden sm:inline-block">{cat}</span>
               ))}
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {filteredBriefings.length > 0 ? filteredBriefings.map(briefing => (
               <div 
                 key={briefing.id}
                 onClick={() => setActiveBriefingId(briefing.id)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all ${activeBriefingId === briefing.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/20' : 'hover:border-gray-300 dark:hover:border-stone-600'} ${highContrast ? 'bg-stone-950 border-stone-800' : 'bg-gray-50/50 border-gray-100'}`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${briefing.status === 'High Risk' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' : briefing.status === 'Medium Risk' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50'}`}>
                       {briefing.status === 'High Risk' ? <AlertTriangle className="w-3 h-3" /> : briefing.status === 'Medium Risk' ? <AlertCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                       {briefing.status}
                     </span>
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{briefing.type}</span>
                   </div>
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1"><Cpu className="w-3 h-3" /> AI Processed</span>
                 </div>
                 <h4 className="font-bold text-base text-gray-900 dark:text-white mb-1">{briefing.title}</h4>
                 <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{briefing.summary}</p>
               </div>
             )) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileText className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-medium text-sm">No intelligence items match the selected filter.</p>
                </div>
             )}
          </div>
        </div>
        
        {/* Right Panel */}
        <div className={`w-full lg:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar`}>
          <div className={`rounded-xl border p-5 flex-1 flex flex-col ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-6 pb-4 border-b border-gray-100 dark:border-stone-800">AI Predictions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{activeBriefing?.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{activeBriefing?.summary}</p>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Risk Forecast</span>
                  <span className={`font-mono text-xl font-black transition-colors duration-500 ${!activeBriefing ? 'text-gray-500' : activeBriefing.risk >= 80 ? 'text-red-500' : activeBriefing.risk >= 50 ? 'text-amber-500' : 'text-blue-500'}`}>{activeBriefing?.risk ?? 0}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${!activeBriefing ? 'bg-gray-500' : activeBriefing.risk >= 80 ? 'bg-red-500' : activeBriefing.risk >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${activeBriefing?.risk ?? 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Recovery Probability</span>
                  <span className={`font-mono text-xl font-black transition-colors duration-500 ${!activeBriefing ? 'text-gray-500' : activeBriefing.recovery >= 80 ? 'text-emerald-500' : activeBriefing.recovery >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{activeBriefing?.recovery ?? 0}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${!activeBriefing ? 'bg-gray-500' : activeBriefing.recovery >= 80 ? 'bg-emerald-500' : activeBriefing.recovery >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${activeBriefing?.recovery ?? 0}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Recommended Actions</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> {activeBriefing?.nextAction}</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-stone-800/50 rounded-lg border border-gray-100 dark:border-stone-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Similar Cases</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"><Briefcase className="w-4 h-4" /> {activeBriefing?.similar}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className={`rounded-xl border p-5 shrink-0 ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100 shadow-sm"}`}>
         <h3 className="font-bold text-xs tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
           <Cpu className="w-4 h-4 text-emerald-500" />
           Rakshak AI Assistant
         </h3>
         <div className="flex flex-col gap-4">
           {aiResponse && (
             <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl flex gap-3 text-sm text-emerald-800 dark:text-emerald-300 font-medium animate-in fade-in slide-in-from-bottom-2">
               <Cpu className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
               <p>{aiResponse}</p>
             </div>
           )}
           {isAiLoading && (
             <div className="p-4 bg-gray-50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700 rounded-xl flex gap-3 text-sm text-gray-500 font-medium animate-pulse">
               <Cpu className="w-5 h-5 shrink-0" />
               <p>Rakshak AI is analyzing context...</p>
             </div>
           )}
           <div className="flex flex-wrap gap-3">
             {[
               'Show similar cases',
               'Find connected suspects',
               'Predict next movement',
               'Generate investigation report',
               'Identify highest-risk network'
             ].map((query, i) => (
               <button 
                 key={i} 
                 onClick={() => handleAiQuery(query)}
                 disabled={isAiLoading}
                 className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-800 dark:hover:text-emerald-400 transition-colors text-sm font-bold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                 <MessageSquare className="w-4 h-4 shrink-0" />
                 {query}
               </button>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}
