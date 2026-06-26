import React, { useState } from "react";
import {
  User,
  Settings2,
  Bell,
  Shield,
  Key,
  Activity,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  Palette,
  Wifi,
  Database,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Save,
} from "lucide-react";
import { useAuthStore, useToastStore } from "../../lib/store";

export default function SettingsView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-gray-200 shadow-sm";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const inputBg = highContrast
    ? "bg-stone-950 border-stone-800"
    : "bg-gray-50 border-gray-200";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast("Settings saved successfully.", "success");
    }, 1000);
  };

  const tabs = [
    { id: "Profile", icon: User, label: "Commander Profile" },
    { id: "Preferences", icon: Settings2, label: "Mission Preferences" },
    { id: "Notifications", icon: Bell, label: "Notifications" },
    { id: "Security", icon: Shield, label: "Security Center" },
    { id: "Roles", icon: Key, label: "Roles & Permissions" },
    { id: "System", icon: Activity, label: "System Status" },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <div>
          <h2 className={`text-2xl font-black ${textMain} tracking-tight`}>
            Settings & Configuration
          </h2>
          <p
            className={`text-xs uppercase tracking-widest ${textMuted} font-bold mt-1`}
          >
            Manage your environment
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#115e3b] hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 relative z-10">
        {/* Settings Sidebar */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id
                  ? highContrast
                    ? "bg-stone-800 text-yellow-300 ring-1 ring-stone-700"
                    : "bg-white text-emerald-700 shadow-sm ring-1 ring-gray-100"
                  : `hover:bg-gray-100 dark:hover:bg-stone-800 ${textMuted}`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div
          className={`col-span-12 md:col-span-9 p-6 rounded-2xl border ${bgCard} shadow-sm overflow-y-auto max-h-[70vh]`}
        >
          <form id="settings-form" onSubmit={handleSave}>
            {activeTab === "Profile" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3
                  className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
                >
                  Commander Profile
                </h3>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-stone-800 overflow-hidden border-4 border-white dark:border-stone-900 shadow-lg">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Commander"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        addToast(
                          "Photo uploaded and updated successfully.",
                          "success",
                        )
                      }
                      className={`px-4 py-2 text-sm font-bold rounded-lg border ${highContrast ? "border-stone-700 hover:bg-stone-800 text-yellow-300" : "border-gray-200 hover:bg-gray-50 text-gray-700"} transition-colors`}
                    >
                      Change Photo
                    </button>
                    <p className={`text-xs mt-2 ${textMuted}`}>
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Sarah Connor"
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Employee ID
                    </label>
                    <input
                      type="text"
                      defaultValue="OP-7734"
                      disabled
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm opacity-60 cursor-not-allowed ${textMain}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Rank / Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Chief Commander"
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue="Tactical Operations"
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="commander@ops.gov"
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 019-2834"
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Preferences" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3
                  className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
                >
                  Mission Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Theme
                    </label>
                    <select
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    >
                      <option>System Default</option>
                      <option>Light Mode</option>
                      <option>Dark Mode</option>
                      <option>High Contrast (Tactical)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Language
                    </label>
                    <select
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    >
                      <option>English (US)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Time Zone
                    </label>
                    <select
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    >
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>EST (Eastern Standard Time)</option>
                      <option>PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                    >
                      Date & Time Format
                    </label>
                    <select
                      className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${textMain}`}
                    >
                      <option>YYYY-MM-DD (24hr)</option>
                      <option>MM/DD/YYYY (12hr)</option>
                      <option>DD/MM/YYYY (24hr)</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border ${highContrast ? "border-stone-800" : "border-gray-100"} cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors`}
                    >
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <span className={`block text-sm font-bold ${textMain}`}>
                          Enable Accessibility Enhancements
                        </span>
                        <span className={`block text-xs ${textMuted}`}>
                          Increase contrast, larger tap targets, and reduce
                          motion
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3
                  className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
                >
                  Notification Settings
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      label: "Mission Alerts",
                      desc: "Critical updates regarding active missions",
                    },
                    {
                      label: "Emergency Alerts",
                      desc: "Override notifications for Red/Amber alerts",
                    },
                    {
                      label: "Team Assignments",
                      desc: "When personnel are dispatched or return",
                    },
                    {
                      label: "AI Recommendations",
                      desc: "Proactive insights from Mission AI",
                    },
                    {
                      label: "Vehicle Status",
                      desc: "Fuel/Battery critical warnings",
                    },
                  ].map((notif, i) => (
                    <label
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border ${highContrast ? "border-stone-800" : "border-gray-100"} cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors`}
                    >
                      <div>
                        <span className={`block text-sm font-bold ${textMain}`}>
                          {notif.label}
                        </span>
                        <span className={`block text-xs ${textMuted}`}>
                          {notif.desc}
                        </span>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                          type="checkbox"
                          name="toggle"
                          id={`toggle-${i}`}
                          defaultChecked={i < 3}
                          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          style={{
                            right: i < 3 ? "0" : "1.25rem",
                            borderColor: i < 3 ? "#10b981" : "#e5e7eb",
                          }}
                        />
                        <label
                          htmlFor={`toggle-${i}`}
                          className={`toggle-label block overflow-hidden h-5 rounded-full ${i < 3 ? "bg-emerald-500" : "bg-gray-300"} cursor-pointer`}
                        ></label>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3
                  className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
                >
                  Security Center
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() =>
                      addToast(
                        "Password reset link sent to your email.",
                        "info",
                      )
                    }
                    className={`p-4 rounded-xl border ${highContrast ? "border-stone-800 hover:bg-stone-800" : "border-gray-200 hover:bg-gray-50"} transition-colors text-left flex flex-col gap-1`}
                  >
                    <span className={`text-sm font-bold ${textMain}`}>
                      Change Password
                    </span>
                    <span className={`text-xs ${textMuted}`}>
                      Last changed 45 days ago
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      addToast("Redirecting to 2FA configuration...", "info")
                    }
                    className={`p-4 rounded-xl border ${highContrast ? "border-stone-800 hover:bg-stone-800" : "border-gray-200 hover:bg-gray-50"} transition-colors text-left flex flex-col gap-1`}
                  >
                    <span
                      className={`text-sm font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> 2FA Enabled
                    </span>
                    <span className={`text-xs ${textMuted}`}>
                      Manage authenticator apps & passkeys
                    </span>
                  </button>
                </div>

                <h4
                  className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-3`}
                >
                  Active Sessions
                </h4>
                <div className="space-y-3">
                  <div
                    className={`p-3 rounded-xl border ${highContrast ? "border-stone-800" : "border-gray-200"} flex justify-between items-center`}
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className={`w-5 h-5 ${textMuted}`} />
                      <div>
                        <p className={`text-sm font-bold ${textMain}`}>
                          MacBook Pro 16"{" "}
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded ml-2">
                            Current
                          </span>
                        </p>
                        <p className={`text-xs ${textMuted}`}>
                          San Francisco, CA • Safari • IP: 192.168.1.1
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${highContrast ? "border-stone-800" : "border-gray-200"} flex justify-between items-center`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className={`w-5 h-5 ${textMuted}`} />
                      <div>
                        <p className={`text-sm font-bold ${textMain}`}>
                          iPhone 14 Pro
                        </p>
                        <p className={`text-xs ${textMuted}`}>
                          San Francisco, CA • iOS App • IP: 10.0.0.45
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addToast("Session revoked successfully.", "success")
                      }
                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Roles" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3
                  className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
                >
                  Roles & Permissions
                </h3>

                <div
                  className={`p-6 rounded-xl border-l-4 border-l-purple-500 ${highContrast ? "bg-stone-950 border-stone-800" : "bg-purple-50 border-purple-100"} flex items-start gap-4 mb-6`}
                >
                  <Key className={`w-6 h-6 text-purple-500 shrink-0 mt-1`} />
                  <div>
                    <h4
                      className={`text-sm font-black ${highContrast ? "text-purple-400" : "text-purple-900"} mb-1`}
                    >
                      Current Role:{" "}
                      {user?.role === "admin"
                        ? "Global Administrator"
                        : "Standard Operator"}
                    </h4>
                    <p
                      className={`text-xs ${highContrast ? "text-stone-400" : "text-purple-700"} max-w-2xl`}
                    >
                      You have full access to all mission control modules,
                      personnel deployment, and emergency override systems. Role
                      modifications require dual-authorization from central
                      command.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4
                    className={`text-sm font-bold uppercase tracking-wider ${textMuted}`}
                  >
                    Assigned Units & Orgs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-lg border ${highContrast ? "border-stone-800" : "border-gray-200"}`}
                    >
                      <span
                        className={`block text-xs font-bold text-blue-500 uppercase`}
                      >
                        Primary
                      </span>
                      <span className={`block text-sm font-bold ${textMain}`}>
                        Tactical Operations Div.
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${highContrast ? "border-stone-800" : "border-gray-200"}`}
                    >
                      <span
                        className={`block text-xs font-bold text-emerald-500 uppercase`}
                      >
                        Secondary
                      </span>
                      <span className={`block text-sm font-bold ${textMain}`}>
                        Emergency Response Team
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "System" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <h3
                  className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
                >
                  System Status & Diagnostics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Globe,
                      label: "Network Routing",
                      status: "Optimal",
                      color: "text-emerald-500",
                    },
                    {
                      icon: Database,
                      label: "Core Database",
                      status: "Syncing",
                      color: "text-blue-500",
                    },
                    {
                      icon: HardDrive,
                      label: "Local Cache",
                      status: "45% Used",
                      color: "text-emerald-500",
                    },
                    {
                      icon: Wifi,
                      label: "WebSocket",
                      status: "Connected",
                      color: "text-emerald-500",
                    },
                    {
                      icon: Activity,
                      label: "AI Engine API",
                      status: "Operational",
                      color: "text-emerald-500",
                    },
                    {
                      icon: AlertTriangle,
                      label: "Telemetry",
                      status: "Warning: High Latency",
                      color: "text-amber-500",
                    },
                  ].map((sys, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-950" : "border-gray-200 bg-gray-50"} flex flex-col gap-2`}
                    >
                      <div className="flex justify-between items-start">
                        <sys.icon className={`w-4 h-4 ${textMuted}`} />
                        <div
                          className={`w-2 h-2 rounded-full ${sys.color.replace("text-", "bg-")} animate-pulse`}
                        ></div>
                      </div>
                      <div>
                        <span
                          className={`block text-[10px] font-bold uppercase tracking-wider ${textMuted}`}
                        >
                          {sys.label}
                        </span>
                        <span
                          className={`block text-sm font-bold ${sys.color}`}
                        >
                          {sys.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() =>
                      addToast("Local cache cleared successfully.", "success")
                    }
                    className={`px-4 py-2 text-xs font-bold rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors`}
                  >
                    Clear Local Cache
                  </button>
                  <button
                    type="button"
                    onClick={() => addToast("System logs downloaded.", "info")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border ${highContrast ? "border-stone-700 hover:bg-stone-800 text-stone-300" : "border-gray-200 hover:bg-gray-100 text-gray-700"} transition-colors`}
                  >
                    Download System Logs
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
