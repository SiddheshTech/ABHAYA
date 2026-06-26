import React, { useState } from "react";
import {
  AlertTriangle,
  Radio,
  ShieldAlert,
  Siren,
  Crosshair,
  MapPin,
  Users,
  Activity,
  Target,
} from "lucide-react";
import { useToastStore } from "../../lib/store";
import { useMissionStore } from "../../lib/missionStore";

export default function EmergencyModeView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const [activeAlert, setActiveAlert] = useState("Red Alert");
  const { addToast } = useToastStore();
  const { activateEmergency, emergencyAlerts, broadcastEmergency, missions, kpis } = useMissionStore();

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-gray-200 shadow-sm";

  const emergencyCard = "bg-red-600 text-white shadow-xl shadow-red-600/20";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center animate-pulse border ${highContrast ? "bg-stone-900 border-red-600" : "bg-red-50 border-red-300"}`}>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className={`text-2xl font-black ${textMain} tracking-tight`}>
              Crisis Response Center
            </h2>
            <p
              className={`text-xs uppercase tracking-widest text-red-500 font-bold mt-1`}
            >
              Emergency Override Protocol
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 flex-1 relative z-10">
        {/* Left Panel: Active Emergencies */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <Siren className="w-4 h-4 text-red-500" /> Active Emergencies
            </h4>
            <div className="space-y-3">
              {[
                {
                  label: "Red Alert",
                  count: 1,
                  color: "bg-red-500 text-white",
                  icon: ShieldAlert,
                },
                {
                  label: "Amber Alerts",
                  count: 3,
                  color: "bg-amber-500 text-white",
                  icon: AlertTriangle,
                },
                {
                  label: "Disaster Events",
                  count: 0,
                  color: highContrast ? "bg-stone-800 text-stone-400" : "bg-gray-150 text-gray-500",
                  icon: Radio,
                },
              ].map((status) => (
                <button
                  key={status.label}
                  onClick={() => setActiveAlert(status.label)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    activeAlert === status.label
                      ? `border-red-500 ring-2 ring-red-500/10 ${highContrast ? "bg-stone-900" : "bg-red-50"}`
                      : `border-transparent ${highContrast ? "bg-stone-950 hover:border-stone-850" : "bg-gray-50 hover:border-gray-200"}`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center ${status.color}`}
                    >
                      <status.icon className="w-3 h-3" />
                    </div>
                    <span
                      className={`text-xs font-bold ${activeAlert === status.label ? (highContrast ? "text-yellow-300" : "text-gray-900") : textMuted}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-black ${activeAlert === status.label ? (highContrast ? "text-yellow-300" : "text-gray-900") : textMuted}`}
                  >
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Red Alert Command Screen */}
        <div
          className={`col-span-12 md:col-span-6 p-4 rounded-xl border-2 shadow-sm flex flex-col relative overflow-hidden min-h-[400px] ${highContrast ? "border-red-600 bg-stone-950" : "border-red-200 bg-red-50/50"}`}
        >
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDE5LjVoNDBWMTloLS41djE5SDB6IiBmaWxsPSIjZWY0NDQ0Ii8+PC9zdmc+')] mix-blend-overlay"></div>

          <div className={`flex justify-between items-center mb-6 relative z-10 border-b pb-4 ${highContrast ? "border-stone-900" : "border-red-150"}`}>
            <h3 className="text-xl font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-5 h-5 animate-pulse" /> COMMAND SCREEN: ONLINE
            </h3>
            <span className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold uppercase animate-pulse">
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 relative z-10">
            <div className={`p-4 rounded-xl border backdrop-blur-sm ${highContrast ? "bg-stone-900 border-red-900/30" : "bg-white/80 border-red-100"}`}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Emergency Cases
              </h4>
              <div className="space-y-2 overflow-y-auto max-h-[100px]">
                {missions.filter(m => m.priority === "Critical" || m.priority === "High").map((m) => (
                   <div key={m.id} className={`p-2 rounded border mb-2 ${highContrast ? "bg-stone-950 border-red-900/30 text-stone-200" : "bg-red-50 border-red-100 text-red-950"}`}>
                     <span className="text-xs font-bold block">
                       {m.title}
                     </span>
                     <span className="text-[9px] font-mono opacity-85 mt-1 block">
                       ID: {m.id} | Priority: {m.priority}
                     </span>
                   </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl border backdrop-blur-sm ${highContrast ? "bg-stone-900 border-red-900/30" : "bg-white/80 border-red-100"}`}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1">
                <Target className="w-3 h-3" /> Broadcast Logs
              </h4>
              <div className="space-y-2 overflow-y-auto max-h-[100px]">
                {emergencyAlerts.map((alert, idx) => (
                  <div key={idx} className={`p-2 rounded border mb-2 ${highContrast ? "bg-stone-950 border-amber-900/30 text-stone-200" : "bg-amber-50 border-amber-100 text-amber-950"}`}>
                    <span className="text-[9px] font-mono">
                      {alert}
                    </span>
                  </div>
                ))}
                {emergencyAlerts.length === 0 && (
                  <div className="text-xs text-amber-700 dark:text-amber-500 opacity-70">No recent broadcasts.</div>
                )}
              </div>
            </div>

            <div className={`col-span-2 p-4 rounded-xl border backdrop-blur-sm ${highContrast ? "bg-stone-900 border-red-900/30" : "bg-white/80 border-red-100"}`}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Critical Locations
              </h4>
              <div className={`h-32 rounded border flex items-center justify-center relative overflow-hidden ${highContrast ? "bg-stone-950 border-red-900/30" : "bg-red-50/20 border-red-100"}`}>
                <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9InJnYmEoMjM5LDY4LDY4LDAuMSkiLz48cGF0aCBkPSJNMCAxMGgxMHYxMEgweiIgZmlsbD0icmdiYSgyMzksNjgsNjgsMC4xNSkiLz48L3N2Zz4=')]"></div>
                <div className="absolute top-[40%] left-[40%] text-red-600 animate-[pulse_2s_infinite] flex flex-col items-center">
                  <Crosshair className="w-8 h-8" />
                  <span className={`text-[9px] font-bold px-1 mt-1 rounded border ${highContrast ? "bg-stone-900 border-red-900/30 text-red-400" : "bg-white text-red-600 border-red-100 shadow-sm"}`}>
                    Incident Zero
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Response Teams */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className={`p-4 rounded-xl border ${bgCard} shadow-sm flex-1`}>
            <h4
              className={`text-sm font-bold uppercase tracking-wider ${textMuted} mb-4 flex items-center gap-2`}
            >
              <ShieldAlert className="w-4 h-4" /> Response Teams
            </h4>

            <div className="space-y-4">
              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Escalation Level
                </span>
                <div className={`w-full rounded-full h-1.5 mb-1 ${highContrast ? "bg-stone-850" : "bg-gray-200"}`}>
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-red-500">
                  LEVEL 5 - MAXIMUM
                </span>
              </div>

              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Authority Notified
                </span>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-[9px] font-bold rounded border ${highContrast ? "bg-stone-900 text-blue-300 border-stone-800" : "bg-blue-50 text-blue-700 border-blue-100"}`}>
                    State Police
                  </span>
                  <span className={`px-2 py-1 text-[9px] font-bold rounded border ${highContrast ? "bg-stone-900 text-blue-300 border-stone-800" : "bg-blue-50 text-blue-700 border-blue-100"}`}>
                    Federal Auth
                  </span>
                </div>
              </div>

              <div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${textMuted} block mb-1`}
                >
                  Estimated Impact
                </span>
                <span className={`text-sm font-bold ${textMain}`}>
                  City-wide Alert Active
                </span>
              </div>

              <div className={`p-3 rounded-lg border mt-4 ${highContrast ? "bg-stone-900 border-red-900/50 text-red-400" : "bg-red-50 border-red-100 text-red-800"}`}>
                <h5 className="text-[10px] font-bold uppercase mb-1">
                  Available Units
                </h5>
                <div className="flex justify-between items-center text-sm font-black">
                  <span>{kpis.officersDeployed}</span>
                  <Users className="w-4 h-4 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Emergency Action Plan */}
      <div
        className={`mt-4 p-4 rounded-xl ${emergencyCard} flex flex-col md:flex-row items-center justify-between relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10 mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">
              Emergency Action Plan
            </span>
            <h3 className="text-lg font-black tracking-tight">
              Deploy All Nearby Units
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 relative z-10">
          <button
            onClick={() => {
              addToast("Police notified successfully.", "success");
              activateEmergency();
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition-colors border border-white/20 whitespace-nowrap"
          >
            Notify Police
          </button>
          <button
            onClick={() => {
              addToast("Drones activated for emergency area.", "warning");
              broadcastEmergency("DRONES ACTIVATED - SECTOR 4");
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition-colors border border-white/20 whitespace-nowrap"
          >
            Activate Drones
          </button>
          <button
            onClick={() => {
              addToast("Public alert issued across all channels.", "error");
              broadcastEmergency("PUBLIC ALERT ISSUED - MISSING CHILD ZONE");
            }}
            className="px-5 py-2 bg-white text-red-700 hover:bg-gray-50 font-black rounded-lg text-xs transition-colors shadow-lg whitespace-nowrap"
          >
            Issue Public Alert
          </button>
        </div>
      </div>
    </div>
  );
}
