import React, { useState, useEffect } from "react";
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Mail,
  ArrowUpRight,
  Plus,
  Play,
  Pause,
  Square,
  Video,
  Hexagon,
  Globe,
  Map,
  Grid,
  AlertTriangle,
  Activity,
  Zap,
  Shield,
  Radar,
  Target,
  Wifi,
  Crosshair,
  MapPin,
  Thermometer,
  Navigation,
  Compass,
  Layers,
  Eye,
  Radio,
  Signal,
  BotMessageSquare,
  X,
  Send,
  CheckCircle2,
  Info,
  Brain,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import MissionControlView from "./mission-control/MissionControlView";
import OperationsGlobeView from "./mission-control/OperationsGlobeView";
import CognitiveHeatmapsView from "./mission-control/CognitiveHeatmapsView";
import SearchGridView from "./mission-control/SearchGridView";
import TeamCommandView from "./mission-control/TeamCommandView";
import EmergencyModeView from "./mission-control/EmergencyModeView";
import AerialSurveillanceView from "./mission-control/AerialSurveillanceView";
import SettingsView from "./mission-control/SettingsView";
import HelpView from "./mission-control/HelpView";
import { useToastStore } from "../lib/store";
import { useMissionStore } from "../lib/missionStore";
import { useOverlayStore } from "../lib/overlayStore";
import SecureMailModal from "./ros/SecureMailModal";
import NotificationPanel from "./ros/NotificationPanel";

interface MissionControlDashboardProps {
  onLogout: () => void;
  highContrast?: boolean;
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const bg =
          toast.type === "success"
            ? "bg-emerald-600"
            : toast.type === "error"
              ? "bg-red-600"
              : toast.type === "warning"
                ? "bg-amber-600"
                : "bg-blue-600";
        const Icon =
          toast.type === "success"
            ? CheckCircle2
            : toast.type === "error"
              ? AlertTriangle
              : toast.type === "warning"
                ? AlertTriangle
                : Info;
        return (
          <div
            key={toast.id}
            className={`${bg} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold pr-4">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default function MissionControlDashboard({
  onLogout,
  highContrast,
}: MissionControlDashboardProps) {
  const [activePage, setActivePage] = useState("Operations Globe");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMsg, setCopilotMsg] = useState("");
  const [chatLog, setChatLog] = useState<
    { role: "user" | "ai"; msg: string }[]
  >([
    {
      role: "ai",
      msg: "How can I assist your mission today? (e.g. 'Where should teams search next?')",
    },
  ]);

  const { init } = useMissionStore();
  const { addToast } = useToastStore();
  const { 
    setMailOpen, 
    setNotificationsOpen, 
    messages, 
    notifications 
  } = useOverlayStore();

  const unreadMailCount = messages.filter((m) => !m.read && !m.sent).length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    init();
  }, [init]);

  const bgMain = highContrast ? "bg-black" : "bg-[#f4f7f6]";
  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";

  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  const getNavItemClass = (pageName: string, isEmergency = false) => {
    if (isEmergency) {
      return activePage === pageName
        ? "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors bg-red-600 text-white shadow-sm"
        : "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20";
    }

    return activePage === pageName
      ? `flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-colors ${highContrast ? "bg-stone-900 text-yellow-300" : "bg-white text-emerald-800 shadow-sm"}`
      : `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${textMuted} hover:bg-white hover:text-gray-900 dark:hover:bg-stone-900 dark:hover:text-white`;
  };

  const handleCopilotSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotMsg.trim()) return;
    const newChat = [...chatLog, { role: "user", msg: copilotMsg } as const];
    setChatLog(newChat);
    setCopilotMsg("");

    // Simulate AI response
    setTimeout(() => {
      setChatLog([
        ...newChat,
        {
          role: "ai",
          msg: "Analyzing tactical data... I recommend deploying Drone Air-1 to Sector 4 and mobilizing Team Bravo. Confidence: 87%.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex font-sans ${bgMain}`}>
      {/* Sidebar */}
      <aside
        className={`w-64 shrink-0 flex flex-col justify-between py-6 px-4 ${highContrast ? "bg-black border-r border-yellow-300" : "bg-[#f4f7f6]"}`}
      >
        <div className="flex flex-col h-full justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 px-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Hexagon className="w-5 h-5 fill-current animate-spin-slow" />
              </div>
              <span className={`text-xl font-black ${textMain} tracking-tight`}>
                Mission Control
              </span>
            </div>

            {/* Structured Navigation Groups matching user screenshot layout */}
            <div className="space-y-4">
              {[
                {
                  groupName: "Live Operations",
                  items: [
                    { label: "Operations Globe", icon: Globe, page: "Operations Globe" },
                    { label: "Mission Metrics", icon: BarChart2, page: "Mission Metrics" },
                  ],
                },
                {
                  groupName: "Tactical Planning",
                  items: [
                    { label: "Active Search", icon: Target, page: "Active Search" },
                    { label: "Live Team Tracking", icon: Users, page: "Live Team Tracking" },
                  ],
                },
                {
                  groupName: "AI Predictions",
                  items: [
                    { label: "Child Intelligence", icon: Brain, page: "Child Intelligence" },
                    { label: "Aerial Surveillance", icon: Video, page: "Aerial Surveillance" },
                  ],
                },
                {
                  groupName: "Emergency Response",
                  items: [
                    { label: "Incident Monitoring", icon: AlertTriangle, page: "Incident Monitoring", isEmergency: true },
                  ],
                },
              ].map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <p className={`text-[10px] font-black uppercase tracking-wider ${textMuted} px-2 mb-1`}>
                    {group.groupName}
                  </p>
                  <nav className="space-y-0.5">
                    {group.items.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => {
                          setActivePage(item.page);
                          if (item.isEmergency) {
                            addToast("Incident Monitoring and Broadcast center opened", "warning");
                          }
                        }}
                        className={`w-full text-left ${getNavItemClass(item.page, item.isEmergency)}`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Mobile App Download Card */}
            <div className="p-3 bg-[#115e3b] text-white rounded-2xl border border-emerald-700/30 shadow-md">
              <span className="text-[9px] font-black tracking-widest text-emerald-200 block uppercase mb-1">STAY MOBILE</span>
              <h5 className="text-xs font-black tracking-tight leading-tight mb-1">Download Mobile App</h5>
              <p className="text-[10px] text-emerald-100/70 font-medium leading-tight mb-2.5">
                Stay connected with ground units and live GPS telemetry updates on-the-go.
              </p>
              <button
                onClick={() => addToast("Mobile App installer package dispatched to secure device profile", "success")}
                className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>Download</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${textMuted} px-2 mb-1`}>
                General
              </p>
              <nav className="space-y-0.5">
                {[
                  { icon: Settings, label: "Settings" },
                  { icon: HelpCircle, label: "Help" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePage(item.label)}
                    className={getNavItemClass(item.label)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
                <button
                  onClick={onLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${textMuted} hover:bg-white hover:text-gray-900 dark:hover:bg-stone-900 dark:hover:text-white cursor-pointer`}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col p-6 min-h-screen overflow-y-auto ${highContrast ? "bg-stone-950" : "bg-[#F8FAFC] rounded-l-3xl border-l border-gray-100 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]"}`}
      >
        {/* Top Header - Perfect match of user screenshot */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/10 shrink-0">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight uppercase">
                  {activePage === "Operations Globe" ? "Operations Globe" : "Mission Control"}
                </h1>
                <span className="text-[9px] font-extrabold bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full uppercase">
                  Tactical-v4
                </span>
                <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-1 animate-pulse bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  SAT-LINK ACTIVE
                </span>
              </div>
              <p className="text-[9px] text-gray-400 font-mono font-bold mt-1 uppercase tracking-wider">
                LAT: 26.7271° N • LON: 88.5953° E • SIKKIM SECTOR GATEWAY-09
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                setActivePage("Incident Monitoring");
                addToast("INITIATING NATIONAL LEVEL EMERGENCY RESPONDERS GRID", "error");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10 transition-all cursor-pointer animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>INITIATE EMERGENCY</span>
            </button>

            <button
              onClick={() => setMailOpen(true)}
              className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center transition-colors relative"
              title="Secured Mail Desk"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              {unreadMailCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-600 rounded-full border border-white"></span>
              )}
            </button>

            <button
              onClick={() => setNotificationsOpen(true)}
              className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center transition-colors relative"
              title="Telemetry Alerts"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
              )}
            </button>

            <div
              className="flex items-center gap-2.5 pl-1 ml-1 cursor-pointer border-l border-gray-200"
              onClick={() => setActivePage("Settings")}
            >
              <div className="w-9 h-9 rounded-xl bg-orange-100 overflow-hidden border border-gray-200 shadow-sm shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-black text-gray-800 leading-tight">Director Rajesh Sinha</p>
                <p className="text-[9px] text-gray-400 font-mono">r.sinha@abhaya-mc.gov.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Pages loading layout matching screenshot mapping */}
        {activePage === "Operations Globe" && (
          <OperationsGlobeView highContrast={highContrast} />
        )}
        {activePage === "Mission Metrics" && (
          <MissionControlView highContrast={highContrast} />
        )}
        {activePage === "Active Search" && (
          <SearchGridView highContrast={highContrast} />
        )}
        {activePage === "Live Team Tracking" && (
          <TeamCommandView highContrast={highContrast} />
        )}
        {activePage === "Child Intelligence" && (
          <CognitiveHeatmapsView highContrast={highContrast} />
        )}
        {activePage === "Aerial Surveillance" && (
          <AerialSurveillanceView highContrast={highContrast} />
        )}
        {activePage === "Incident Monitoring" && (
          <EmergencyModeView highContrast={highContrast} />
        )}
        {activePage === "Settings" && (
          <SettingsView highContrast={highContrast} />
        )}
        {activePage === "Help" && <HelpView highContrast={highContrast} />}
      </main>

      {/* Rescue AI Copilot Floating Button & Chat */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {copilotOpen && (
          <div
            className={`w-80 mb-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col border ${highContrast ? "bg-stone-950 border-stone-800" : "bg-white border-purple-100"}`}
          >
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <BotMessageSquare className="w-5 h-5" />
                <span className="font-bold text-sm">Ask Mission AI</span>
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-64 p-4 overflow-y-auto flex flex-col gap-3 text-sm">
              {chatLog.map((c, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${c.role === "ai" ? (highContrast ? "bg-stone-900 text-purple-300 rounded-tl-sm self-start" : "bg-purple-50 text-purple-900 rounded-tl-sm self-start") : highContrast ? "bg-stone-800 text-yellow-300 rounded-tr-sm self-end" : "bg-gray-100 text-gray-800 rounded-tr-sm self-end"}`}
                >
                  {c.msg}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleCopilotSend}
              className={`p-2 border-t ${highContrast ? "border-stone-800" : "border-gray-100"} flex items-center gap-2`}
            >
              <input
                type="text"
                value={copilotMsg}
                onChange={(e) => setCopilotMsg(e.target.value)}
                placeholder="Ask for recommendations..."
                className={`flex-1 bg-transparent outline-none px-2 py-1 text-sm ${textMain}`}
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className={`px-5 py-3 rounded-full font-bold text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600`}
        >
          <BotMessageSquare className="w-5 h-5" /> Ask Mission AI
        </button>
      </div>

      <SecureMailModal highContrast={highContrast} />
      <NotificationPanel highContrast={highContrast} />
      <ToastContainer />
    </div>
  );
}
