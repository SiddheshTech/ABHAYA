import React, { useState, useEffect } from "react";
import {
  Search,
  LayoutDashboard,
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
  Shield,
  CheckSquare,
  Heart,
  Send,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";

import RecoveryCenterView from "./crc/RecoveryCenterView";
import ChildrenView from "./crc/ChildrenView";
import SheltersView from "./crc/SheltersView";
import FamilyMatchingView from "./crc/FamilyMatchingView";
import WellnessView from "./crc/WellnessView";
import ProgressJourneyView from "./crc/ProgressJourneyView";
import SettingsPage from "./SettingsPage";
import HelpPage from "./HelpPage";
import CommunityWatchView from "./cw/CommunityWatchView";
import MissingAlertsView from "./cw/MissingAlertsView";
import ReportSightingView from "./cw/ReportSightingView";
import ReportChildView from "./cw/ReportChildView";
import CommunityImpactView from "./cw/CommunityImpactView";
import ProfileView from "./cw/ProfileView";
import NationalCommandView from "./ros/NationalCommandView";
import LiveNationView from "./ros/LiveNationView";
import NetworkActivityView from "./ros/NetworkActivityView";
import RiskForecastView from "./ros/RiskForecastView";
import AIHealthView from "./ros/AIHealthView";
import OrganizationsView from "./ros/OrganizationsView";
import AuditTimelineView from "./ros/AuditTimelineView";
import NationalAICommander from "./ros/NationalAICommander";
import { useToastStore } from "../lib/store";
import { useCRCStore } from "../lib/crcStore";
import { useOverlayStore } from "../lib/overlayStore";
import SecureMailModal from "./ros/SecureMailModal";
import NotificationPanel from "./ros/NotificationPanel";

interface SystemDashboardProps {
  onLogout: () => void;
  highContrast?: boolean;
  role: string;
}

export default function SystemDashboard({
  onLogout,
  highContrast,
  role,
}: SystemDashboardProps) {
  const [activePage, setActivePage] = useState(
    role === "CRC" ? "Recovery Center" : role === "CW" ? "Community Watch" : "National Command",
  );
  
  const { addToast } = useToastStore();
  const initCRC = useCRCStore((state) => state.init);

  const { 
    setMailOpen, 
    setNotificationsOpen, 
    messages, 
    notifications 
  } = useOverlayStore();

  const unreadMailCount = messages.filter((m) => !m.read && !m.sent).length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Namaste! I am Recovery AI, your dedicated assistant. I can help you schedule child interventions, track wellness recovery plans, cross-reference family matching files, or give guidelines for Mission Vatsalya. What can I help you with today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const newMsg = { role: 'user' as const, content: text };
    const updatedMsgs = [...chatMessages, newMsg];
    
    setChatMessages(updatedMsgs);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMsgs }),
      });
      
      const data = await response.json();
      if (response.ok && data.text) {
        setChatMessages([...updatedMsgs, { role: 'model', content: data.text }]);
      } else {
        addToast(data.error || "Gemini AI returned an empty response", "error");
        setChatMessages([...updatedMsgs, { role: 'model', content: "I encountered an error connecting to the core intelligence module. Please verify your Gemini API Key in the settings." }]);
      }
    } catch (e: any) {
      console.error(e);
      addToast("Failed to connect to Recovery AI system", "error");
      setChatMessages([...updatedMsgs, { role: 'model', content: "An error occurred. Please verify that the system server is online and the API key is active." }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (role === "CRC") {
      initCRC();
    }
  }, [role, initCRC]);

  const bgPage = highContrast ? "bg-black" : "bg-[#f8fafc]";
  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  const getSystemName = () => {
    switch (role) {
      case "CRC":
        return "Child Recovery Center";
      case "CW":
        return "Community Watch";
      case "ROS":
        return "Rakshak Operating System";
      default:
        return "System Dashboard";
    }
  };

  return (
    <div className={`min-h-screen flex ${bgPage} font-sans`}>
      {/* Sidebar */}
      <aside
        className={`w-64 flex flex-col border-r ${highContrast ? "border-stone-800 bg-black" : "border-gray-200 bg-white"} p-6 fixed h-full overflow-y-auto`}
      >
        <div className="flex items-center gap-3 mb-10">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkGreenCard}`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <h1 className={`text-xl font-black tracking-tight ${textMain}`}>
            Rakshak
          </h1>
        </div>

        <div className="flex-1 space-y-8">
          {(() => {
            const menuSections =
              role === "CRC"
                ? [
                    {
                      section: "Overview",
                      items: [
                        { icon: LayoutDashboard, label: "Recovery Center" },
                      ],
                    },
                    {
                      section: "Child Care",
                      items: [{ icon: Users, label: "Children" }],
                    },
                    {
                      section: "Shelter Management",
                      items: [{ icon: Globe, label: "Shelters" }],
                    },
                    {
                      section: "Family Reunification",
                      items: [{ icon: Users, label: "Family Matching" }],
                    },
                    {
                      section: "Health & Recovery",
                      items: [{ icon: Activity, label: "Wellness" }],
                    },
                    {
                      section: "Progress Tracking",
                      items: [{ icon: CheckSquare, label: "Progress Journey" }],
                    },
                  ]
                : role === "CW"
                ? [
                    {
                      section: "Overview",
                      items: [
                        { icon: Shield, label: "Community Watch" },
                      ],
                    },
                    {
                      section: "Missing Children",
                      items: [
                        { icon: Bell, label: "Missing Alerts" },
                      ],
                    },
                    {
                      section: "Community Reporting",
                      items: [
                        { icon: Search, label: "Report Sighting" },
                        { icon: Plus, label: "Report Child" },
                      ],
                    },
                    {
                      section: "Community Engagement",
                      items: [
                        { icon: Heart, label: "Community Impact" },
                      ],
                    },
                    {
                      section: "My Account",
                      items: [
                        { icon: Users, label: "Profile" },
                      ],
                    },
                  ]
                : [
                    {
                      section: "Overview",
                      items: [
                        { icon: Shield, label: "National Command" },
                      ],
                    },
                    {
                      section: "National Monitoring",
                      items: [
                        { icon: Globe, label: "Live Nation" },
                      ],
                    },
                    {
                      section: "Threat Intelligence",
                      items: [
                        { icon: Activity, label: "Network Activity" },
                        { icon: AlertTriangle, label: "Risk Forecast" },
                      ],
                    },
                    {
                      section: "AI Operations",
                      items: [
                        { icon: Sparkles, label: "AI Health" },
                      ],
                    },
                    {
                      section: "Organization Management",
                      items: [
                        { icon: Grid, label: "Organizations" },
                      ],
                    },
                    {
                      section: "System Governance",
                      items: [
                        { icon: Calendar, label: "Audit Timeline" },
                      ],
                    },
                  ];

            return menuSections.map((section, sIdx) => (
              <div key={sIdx}>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} px-2 mb-2`}
                >
                  {section.section}
                </p>
                <nav className="space-y-1">
                  {section.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePage(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                        activePage === item.label
                          ? highContrast
                            ? "bg-stone-800 text-yellow-300"
                            : "bg-[#115e3b]/10 text-[#115e3b]"
                          : `${textMuted} hover:bg-gray-50 dark:hover:bg-stone-900`
                      }`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${activePage === item.label ? "" : textMuted}`}
                      />
                      <span>{item.label}</span>
                      {item.label === "Tasks" && (
                        <span className="ml-auto bg-[#115e3b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          12
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            ));
          })()}

          <div>
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} px-2 mb-2`}
            >
              General
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => setActivePage("Settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activePage === "Settings"
                    ? highContrast
                      ? "bg-stone-800 text-yellow-300"
                      : "bg-[#115e3b]/10 text-[#115e3b]"
                    : `${textMuted} hover:bg-gray-50 dark:hover:bg-stone-900`
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setActivePage("Help")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  activePage === "Help"
                    ? highContrast
                      ? "bg-stone-800 text-yellow-300"
                      : "bg-[#115e3b]/10 text-[#115e3b]"
                    : `${textMuted} hover:bg-gray-50 dark:hover:bg-stone-900`
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </button>
              <button
                onClick={onLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${textMuted} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="relative w-96 group">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${textMuted} group-focus-within:text-[#115e3b]`}
            />
            <input
              type="text"
              placeholder={`Search ${getSystemName()}...`}
              className={`w-full pl-10 pr-12 py-2.5 rounded-full border ${highContrast ? "bg-stone-900 border-stone-800 text-yellow-300" : "bg-white border-gray-200"} text-sm focus:outline-none focus:ring-2 focus:ring-[#115e3b] transition-shadow`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${highContrast ? "bg-stone-800 text-stone-400" : "bg-gray-100 text-gray-500"}`}
              >
                ⌘
              </kbd>
              <kbd
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${highContrast ? "bg-stone-800 text-stone-400" : "bg-gray-100 text-gray-500"}`}
              >
                F
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMailOpen(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border hover:shadow-md transition-shadow relative ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-200"}`}
            >
              <Mail className={`w-4 h-4 ${textMuted}`} />
              {unreadMailCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setNotificationsOpen(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border relative hover:shadow-md transition-shadow ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-200"}`}
            >
              <Bell className={`w-4 h-4 ${textMuted}`} />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <div className="flex items-center gap-3 ml-2 border-l pl-6 border-gray-200 dark:border-stone-800 cursor-pointer group" onClick={() => addToast("Opening user profile", "info")}>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#115e3b] dark:group-hover:border-yellow-300 transition-colors">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    role === "CW" ? "Amit" : role === "ROS" ? "Sanjay" : "Kavita"
                  }`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                  {role === "CW" ? "Amit Patel" : role === "ROS" ? "Sanjay Deshmukh" : "Inspector Kavita Rao"}
                </h4>
                <p className={`text-[10px] ${textMuted}`}>
                  {role === "CW" ? "a.patel@abhaya-cw.org" : role === "ROS" ? "s.deshmukh@abhaya-ros.gov.in" : "k.rao@abhaya-crc.gov.in"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        {(() => {
          if (role === "CRC" && activePage === "Recovery Center")
            return <RecoveryCenterView highContrast={highContrast} setActivePage={setActivePage} />;
          if (role === "CRC" && activePage === "Children")
            return <ChildrenView highContrast={highContrast} setActivePage={setActivePage} />;
          if (role === "CRC" && activePage === "Shelters")
            return <SheltersView highContrast={highContrast} setActivePage={setActivePage} />;
          if (role === "CRC" && activePage === "Family Matching")
            return <FamilyMatchingView highContrast={highContrast} setActivePage={setActivePage} />;
          if (role === "CRC" && activePage === "Wellness")
            return <WellnessView highContrast={highContrast} />;
          if (role === "CRC" && activePage === "Progress Journey")
            return <ProgressJourneyView highContrast={highContrast} />;
          if (role === "CW" && activePage === "Community Watch")
            return <CommunityWatchView highContrast={highContrast} />;
          if (role === "CW" && activePage === "Missing Alerts")
            return <MissingAlertsView highContrast={highContrast} />;
          if (role === "CW" && activePage === "Report Sighting")
            return <ReportSightingView highContrast={highContrast} />;
          if (role === "CW" && activePage === "Report Child")
            return <ReportChildView highContrast={highContrast} />;
          if (role === "CW" && activePage === "Community Impact")
            return <CommunityImpactView highContrast={highContrast} />;
          if (role === "CW" && activePage === "Profile")
            return <ProfileView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "National Command")
            return <NationalCommandView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "Live Nation")
            return <LiveNationView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "Network Activity")
            return <NetworkActivityView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "Risk Forecast")
            return <RiskForecastView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "AI Health")
            return <AIHealthView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "Organizations")
            return <OrganizationsView highContrast={highContrast} />;
          if (role === "ROS" && activePage === "Audit Timeline")
            return <AuditTimelineView highContrast={highContrast} />;
          if (activePage === "Settings")
            return <SettingsPage highContrast={highContrast} showToast={addToast} role={role} />;
          if (activePage === "Help")
            return <HelpPage highContrast={highContrast} showToast={addToast} />;

          return (
            <>
              {/* Dashboard Title & Actions */}
              <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2
                    className={`text-2xl font-black tracking-tight ${textMain}`}
                  >
                    {getSystemName()} Dashboard
                  </h2>
                  <p className={`text-sm mt-1 ${textMuted}`}>
                    Plan, prioritize, and accomplish your tasks with ease.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => addToast("Initializing new project...", "success")}
                    className={`px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 ${darkGreenCard}`}
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                  <button
                    onClick={() => addToast("Opening import wizard...", "info")}
                    className={`px-5 py-2.5 rounded-full border font-bold text-sm transition-transform hover:scale-105 ${highContrast ? "border-stone-700 hover:bg-stone-900 text-yellow-300" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                  >
                    Import Data
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                <div
                  className={`p-5 rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between ${darkGreenCard} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => addToast("Viewing all projects...", "info")}
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="font-bold text-sm">Total Projects</h3>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-4xl font-black mb-2">24</p>
                    <div className="flex items-center gap-1">
                      <span className="bg-emerald-500/20 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> 12%
                      </span>
                      <span className="text-[10px] text-emerald-100/70">
                        Increased from last month
                      </span>
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                </div>

                {[
                  {
                    title: "Ended Projects",
                    value: "10",
                    trend: "increase",
                    color: "text-gray-900 dark:text-yellow-300",
                    suffix: "Increased from last month",
                    iconColor: "text-gray-500",
                  },
                  {
                    title: "Running Projects",
                    value: "12",
                    trend: "increase",
                    color: "text-gray-900 dark:text-yellow-300",
                    suffix: "Increased from last month",
                    iconColor: "text-gray-500",
                  },
                  {
                    title: "Pending Project",
                    value: "2",
                    trend: "none",
                    color: "text-gray-900 dark:text-yellow-300",
                    suffix: "On Discuss",
                    iconColor: "text-gray-500",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={() => addToast(`Viewing ${stat.title.toLowerCase()} list...`, "info")}
                    className={`p-5 rounded-2xl shadow-sm border flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group ${highContrast ? "bg-stone-900 border-stone-800 hover:border-yellow-300/50" : "bg-white border-gray-100 hover:border-gray-300"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`font-bold text-sm ${textMain}`}>
                        {stat.title}
                      </h3>
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${highContrast ? "border-stone-700 group-hover:bg-stone-800" : "border-gray-200 group-hover:bg-gray-50"}`}
                      >
                        <ArrowUpRight className={`w-3 h-3 ${stat.iconColor} group-hover:text-blue-500`} />
                      </div>
                    </div>
                    <div>
                      <p className={`text-4xl font-black mb-2 ${stat.color}`}>
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1">
                        {stat.trend === "increase" && (
                          <span className="bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-400 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> 12%
                          </span>
                        )}
                        <span className={`text-[10px] ${textMuted}`}>
                          {stat.suffix}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Grid 2: Analytics & Reminders & Project List */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
                {/* Analytics Chart */}
                <div
                  className={`md:col-span-5 p-6 rounded-2xl shadow-sm border ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100"} flex flex-col`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-bold text-sm ${textMain}`}>
                      Project Analytics
                    </h3>
                    <button onClick={() => addToast("Exporting chart data...", "success")} className={`text-[10px] font-bold ${textMuted} hover:${textMain} transition-colors`}>Export CSV</button>
                  </div>
                  <div className="flex-1 flex items-end gap-3 justify-between pb-6 border-b border-gray-100 dark:border-stone-800">
                    {/* Dummy Bars */}
                    {[40, 60, 30, 80, 50, 40, 30].map((height, i) => (
                      <div
                        key={i}
                        className="w-full flex flex-col items-center gap-2 group cursor-pointer"
                        onClick={() => addToast(`Viewing detailed data for day ${i + 1}`, "info")}
                      >
                        <div
                          className={`w-full rounded-t-lg transition-all hover:opacity-80 group-hover:-translate-y-1 ${
                            i === 1
                              ? highContrast
                                ? "bg-stone-700"
                                : "bg-[#115e3b]"
                              : i === 2
                                ? "bg-emerald-400"
                                : i === 3
                                  ? highContrast
                                    ? "bg-stone-600"
                                    : "bg-[#0f4f31]"
                                  : "bg-repeating-linear-to-t from-gray-100 to-gray-200 dark:from-stone-800 dark:to-stone-700 bg-[length:100%_4px]"
                          }`}
                          style={{ height: `${height}px` }}
                        ></div>
                        <span className={`text-[10px] font-bold ${textMuted} group-hover:${textMain} transition-colors`}>
                          {["S", "M", "T", "W", "T", "F", "S"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reminders */}
                <div
                  className={`md:col-span-3 p-6 rounded-2xl shadow-sm border ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100"} flex flex-col justify-between group`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-bold text-sm ${textMain}`}>
                        Reminders
                      </h3>
                      <button onClick={() => addToast("Opening calendar...", "info")} className={`text-[10px] font-bold ${textMuted} hover:${textMain} transition-colors`}>View All</button>
                    </div>
                    <h2
                      className={`text-xl font-black leading-tight ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors cursor-pointer`}
                      onClick={() => addToast("Opening meeting agenda...", "info")}
                    >
                      Meeting with Arc Company
                    </h2>
                    <p className={`text-xs mt-2 ${textMuted}`}>
                      Time: 10.00 am - 04.00 pm
                    </p>
                  </div>
                  <button
                    onClick={() => addToast("Joining secure video conference...", "success")}
                    className={`w-full mt-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 ${highContrast ? "bg-stone-800 text-yellow-300 border border-yellow-300/30 hover:bg-stone-700" : "bg-[#115e3b] text-white hover:bg-emerald-800"} transition-all hover:scale-105 active:scale-95`}
                  >
                    <Video className="w-4 h-4" /> Start Meeting
                  </button>
                </div>

                {/* Project List */}
                <div
                  className={`md:col-span-4 p-6 rounded-2xl shadow-sm border ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100"} flex flex-col`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-bold text-sm ${textMain}`}>Project</h3>
                    <button
                      onClick={() => addToast("Opening new project form...", "info")}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors ${highContrast ? "border-stone-700 text-yellow-300" : "border-gray-200 text-gray-700"}`}
                    >
                      <Plus className="w-3 h-3" /> New
                    </button>
                  </div>
                  <div className="space-y-4 flex-1">
                    {[
                      {
                        title: "Develop API Endpoints",
                        date: "Due date: Feb 26, 2024",
                        color: "text-blue-500",
                      },
                      {
                        title: "Onboarding Flow",
                        date: "Due date: Feb 28, 2024",
                        color: "text-emerald-500",
                      },
                      {
                        title: "Build Dashboard",
                        date: "Due date: Mar 02, 2024",
                        color: "text-yellow-500",
                      },
                      {
                        title: "Optimize Page Load",
                        date: "Due date: Mar 15, 2024",
                        color: "text-orange-500",
                      },
                      {
                        title: "Cross-Browser Testing",
                        date: "Due date: Mar 22, 2024",
                        color: "text-purple-500",
                      },
                    ].map((task, i) => (
                      <div key={i} className="flex gap-3 items-center cursor-pointer group" onClick={() => addToast(`Opening project details: ${task.title}`, "info")}>
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-12 ${highContrast ? "bg-stone-800" : "bg-gray-50"} ${task.color}`}
                        >
                          <Hexagon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${textMain} group-hover:underline`}>
                            {task.title}
                          </h4>
                          <p className={`text-[10px] ${textMuted}`}>
                            {task.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dashboard Grid 3: Team Collaboration, Project Progress, Time Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
                {/* Team Collaboration */}
                <div
                  className={`md:col-span-5 p-6 rounded-2xl shadow-sm border ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100"}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`font-bold text-sm ${textMain}`}>
                      Team Collaboration
                    </h3>
                    <button
                      onClick={() => addToast("Opening invitation form...", "info")}
                      className={`px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors ${highContrast ? "border-stone-700 text-yellow-300" : "border-gray-200 text-gray-700"}`}
                    >
                      <Plus className="w-3 h-3" /> Add Member
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Alexandra Doff",
                        task: "Working on Github Project Repository",
                        status: "Completed",
                        statusColor:
                          "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
                      },
                      {
                        name: "Edwin Adenike",
                        task: "Working on Integrate User Authentication System",
                        status: "In Progress",
                        statusColor:
                          "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800",
                      },
                      {
                        name: "Isaac Oluwatenilorun",
                        task: "Working on Develop Search and Filter Functionality",
                        status: "Pending",
                        statusColor:
                          "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800",
                      },
                      {
                        name: "David Oshodi",
                        task: "Working on Responsive Layout for Homepage",
                        status: "In Progress",
                        statusColor:
                          "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800",
                      },
                    ].map((member, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-stone-800/50 p-2 -mx-2 rounded-lg transition-colors"
                        onClick={() => addToast(`Opening profile for ${member.name}`, "info")}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden group-hover:ring-2 ring-gray-200 dark:ring-stone-700 transition-all">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${textMain} group-hover:text-blue-500 transition-colors`}>
                              {member.name}
                            </h4>
                            <p
                              className={`text-[10px] ${textMuted} truncate max-w-[200px]`}
                            >
                              {member.task}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full border ${member.statusColor}`}
                        >
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Progress */}
                <div
                  className={`md:col-span-4 p-6 rounded-2xl shadow-sm border flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group hover:border-[#115e3b] dark:hover:border-yellow-300 transition-colors ${highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100"}`}
                  onClick={() => addToast("Opening detailed progress metrics...", "info")}
                >
                  <h3
                    className={`font-bold text-sm absolute top-6 left-6 ${textMain}`}
                  >
                    Project Progress
                  </h3>

                  {/* SVG Arc for Progress */}
                  <div className="relative w-48 h-48 mt-8 group-hover:scale-105 transition-transform duration-500">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path
                        d="M 10 90 A 40 40 0 1 1 90 90"
                        fill="none"
                        stroke={highContrast ? "#292524" : "#f1f5f9"}
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      {/* This represents the completed progress part */}
                      <path
                        d="M 10 90 A 40 40 0 0 1 80 20"
                        fill="none"
                        stroke={highContrast ? "#fde047" : "#115e3b"}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="150"
                        strokeDashoffset="0"
                        className="animate-[dash_1.5s_ease-out_forwards]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                      <span className={`text-4xl font-black ${textMain}`}>
                        41%
                      </span>
                      <span
                        className={`text-[10px] font-bold mt-1 ${textMuted}`}
                      >
                        Overall Complete
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4 w-full justify-center">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <span
                        className={`w-2 h-2 rounded-full ${highContrast ? "bg-yellow-300" : "bg-[#115e3b]"}`}
                      ></span>
                      <span className={textMuted}>Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-stone-700"></span>
                      <span className={textMuted}>In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Time Tracker */}
                <div
                  className={`md:col-span-3 p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between group ${darkGreenCard}`}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent group-hover:opacity-30 transition-opacity"></div>
                  {/* Wavy background decoration */}
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-colors duration-700"></div>

                  <h3 className="font-bold text-sm relative z-10">
                    Time Tracker
                  </h3>

                  <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-6">
                    <div className="text-4xl font-mono font-black tracking-widest text-white group-hover:scale-105 transition-transform duration-500">
                      01:24:08
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 relative z-10 mt-2">
                    <button onClick={() => addToast("Timer paused.", "info")} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                      <Pause className="w-4 h-4 fill-white text-white" />
                    </button>
                    <button onClick={() => addToast("Timer stopped and log saved.", "success")} className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95">
                      <Square className="w-4 h-4 fill-white text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </main>

      {/* Care AI Assistant Floating Button & Sliding Drawer */}
      {role === "CRC" && (
        <>
          <button
            onClick={() => setIsChatOpen(true)}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-transform hover:-translate-y-1 z-50 group ${highContrast ? "bg-stone-800 text-yellow-300 border border-yellow-300" : "bg-[#115e3b] text-white"}`}
          >
            <Heart
              className={`w-5 h-5 ${highContrast ? "text-yellow-300" : "text-rose-300"} group-hover:scale-110 transition-transform`}
            />
            Ask Recovery AI
          </button>

          {isChatOpen && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
              <div className="absolute inset-0" onClick={() => setIsChatOpen(false)} />
              
              <div className={`relative w-full max-w-md sm:max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ${highContrast ? "bg-stone-950 text-white border-l border-stone-800" : "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"}`}>
                {/* Header */}
                <div className={`p-4 flex items-center justify-between border-b ${highContrast ? "border-stone-800 bg-stone-900" : "border-stone-100 dark:border-stone-800 bg-emerald-50/30 dark:bg-stone-900/50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${highContrast ? "bg-stone-800 text-yellow-300" : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"}`}>
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1">
                        Recovery AI Assistant
                      </h3>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                        Government of India • Mission Vatsalya Division
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${highContrast ? "text-yellow-300 border border-stone-800" : ""}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl ${
                          msg.role === 'user'
                            ? highContrast
                              ? "bg-yellow-300 text-black rounded-tr-none font-bold"
                              : "bg-emerald-600 text-white rounded-tr-none"
                            : highContrast
                              ? "bg-stone-900 text-stone-100 border border-stone-800 rounded-tl-none"
                              : "bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-100 rounded-tl-none"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`max-w-[85%] p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 ${highContrast ? "bg-stone-900 border border-stone-800 text-yellow-300" : "bg-stone-100 dark:bg-stone-800/80 text-emerald-600 dark:text-emerald-400"}`}>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-semibold">AI is analyzing database...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Suggest */}
                {chatMessages.length <= 2 && (
                  <div className={`px-4 py-2 border-t ${highContrast ? "border-stone-800" : "border-stone-100 dark:border-stone-800/50"} flex flex-wrap gap-2`}>
                    {[
                      { label: "Draft physical care plan for Rahul", prompt: "Rahul in Mumbai shelter has severe Malnutrition (Wellness Score: 30). Draft a comprehensive physical care and therapeutic diet plan for him." },
                      { label: "Explain Vatsalya Verification Rules", prompt: "What are the regulatory guidelines, identity checks, and verification protocols for family integration under Mission Vatsalya?" },
                      { label: "Counselling guidelines for Amit", prompt: "Amit has high anxiety (Wellness Score: 40). What are the trauma-informed guidelines for scheduling his psychological counselling session?" }
                    ].map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s.prompt)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border text-left hover:scale-[1.01] transition-all ${highContrast ? "border-stone-800 bg-stone-900 text-yellow-300 hover:border-yellow-300" : "border-emerald-100 dark:border-stone-800 bg-emerald-50/10 dark:bg-stone-900/30 text-emerald-700 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-stone-600"}`}
                      >
                        {s.label} →
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer Input */}
                <div className={`p-4 border-t ${highContrast ? "border-stone-800 bg-stone-950" : "border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50"}`}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about cases, schedules, rules..."
                      className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-hidden text-sm ${
                        highContrast
                          ? "bg-stone-900 border-stone-800 text-white placeholder-stone-500 focus:border-yellow-300"
                          : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-500"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className={`px-4 py-2.5 rounded-xl font-bold flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 ${
                        highContrast
                          ? "bg-yellow-300 hover:bg-yellow-400 text-black"
                          : "bg-[#115e3b] hover:bg-[#0f5233] text-white"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* National AI Commander */}
      {role === "ROS" && (
        <NationalAICommander highContrast={highContrast} />
      )}

      <SecureMailModal highContrast={highContrast} />
      <NotificationPanel highContrast={highContrast} />
    </div>
  );
}
