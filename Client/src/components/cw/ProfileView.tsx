import React, { useState } from "react";
import { User, Shield, Mail, Phone, MapPin, Key, Save, Bell, History, Check } from "lucide-react";

interface ProfileViewProps {
  highContrast?: boolean;
}

export default function ProfileView({ highContrast }: ProfileViewProps) {
  const [name, setName] = useState("Amit Patel");
  const [email, setEmail] = useState("a.patel@abhaya-cw.org");
  const [phone, setPhone] = useState("+91 91234 56789");
  const [sector, setSector] = useState("Delhi-NCR Regional Command");
  const [supervisor, setSupervisor] = useState("Director Sinha (Patna HQ)");
  const [isSaved, setIsSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailAlerts: true,
    patrolDispatches: true,
    highRiskAlerts: true,
  });

  const [recentLogs] = useState([
    { id: 1, action: "Dispatched Emergency Alert SR-1102", time: "Today, 11:30 AM" },
    { id: 2, action: "Registered Sighting of Missing Child (Aarav)", time: "Yesterday, 4:15 PM" },
    { id: 3, action: "Authorized Volunteer Circle Patrol P-403", time: "June 23, 2026" },
    { id: 4, action: "Logged in from Secure Terminal IP 10.12.83.1", time: "June 22, 2026" },
  ]);

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Top Banner Card */}
      <div className={`p-6 rounded-2xl border ${borderCol} ${bgCard} shadow-sm flex flex-col sm:flex-row items-center gap-5`}>
        <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" 
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h2 className={`text-xl font-extrabold ${textMain}`}>{name}</h2>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
              ACTIVE COMMANDER
            </span>
          </div>
          <p className="text-xs text-stone-400 font-mono">Profile ID: CW-83912</p>
          <p className={`text-xs ${textMuted} flex items-center justify-center sm:justify-start gap-1`}>
            <MapPin className="w-3 h-3 text-red-500" /> Delhi, NCR Sector Node
          </p>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Editable details & Notifications */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <form onSubmit={handleSave} className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
            <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-1.5 ${borderCol} ${textMain}`}>
              <User className="w-4 h-4 text-[#115e3b] dark:text-yellow-300" /> Personal Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                    highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                    highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">SIP VoIP Phone Connection</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                    highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">Operational Sector Area</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                    highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                  }`}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-[1.02] ${
                  highContrast 
                    ? "bg-stone-800 border border-yellow-300 text-yellow-300" 
                    : "bg-[#115e3b] text-white hover:bg-[#0d4a2e]"
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {isSaved ? "Saved Instantly" : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Notification Preferences */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
            <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-1.5 ${borderCol} ${textMain}`}>
              <Bell className="w-4 h-4 text-emerald-600 dark:text-yellow-300" /> Sighting & Alert Notifications
            </h3>

            <div className="space-y-3.5">
              {[
                { key: "smsAlerts", title: "Instant SMS Alerts", desc: "Get text notifications on critical missing sightings reported in your NCR region." },
                { key: "emailAlerts", title: "CWC State Reports Email Digest", desc: "Receive automated child-matching case folder notifications from Bihar HQ." },
                { key: "patrolDispatches", title: "Patrol unit updates", desc: "Receive immediate ping summaries when watch patrol teams change statuses." },
                { key: "highRiskAlerts", title: "Emergency Amber Alerts", desc: "Receive loud, persistent overrides for critical priority child cases." },
              ].map((notif) => (
                <div key={notif.key} className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className={`text-xs font-bold ${textMain}`}>{notif.title}</p>
                    <p className="text-[11px] text-stone-400 leading-normal">{notif.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[notif.key as keyof typeof notifications]}
                    onChange={() => handleToggleNotification(notif.key as keyof typeof notifications)}
                    className="mt-0.5 w-4 h-4 text-[#115e3b] rounded focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Security metadata & recent action history */}
        <div className="space-y-6">
          
          {/* Security details */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-3`}>
            <h3 className={`font-bold text-sm ${textMain} flex items-center gap-1.5`}>
              <Key className="w-4 h-4 text-red-500" /> Security Credentials
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase">Supervisor Contact</span>
                <p className={`font-semibold ${textMain}`}>{supervisor}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase">Security Token</span>
                <p className="font-mono text-[10px] text-stone-400 tracking-wider">**********83912</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase">Secure Encryption Key</span>
                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-stone-50 dark:bg-stone-950 text-stone-500 border mt-1">
                  SHA-256 RAKSHAK-SYSTEM-ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Operational Logs History */}
          <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
            <h3 className={`font-bold text-sm ${textMain} flex items-center gap-1.5`}>
              <History className="w-4 h-4 text-blue-500" /> Activity History
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {recentLogs.map((log) => (
                <div key={log.id} className="text-xs space-y-0.5">
                  <p className={`font-semibold ${textMain}`}>{log.action}</p>
                  <p className="text-[10px] text-stone-400">{log.time}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
