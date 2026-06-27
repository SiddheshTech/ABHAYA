import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Shield, Bell, Palette, Globe, Smartphone, Lock, 
  Key, Clock, Database, Wifi, Server, Activity, Check,
  Mail, AlertTriangle, Monitor, Save, Sliders, Cpu,
  Download, Upload, RefreshCw, Eye, EyeOff, ShieldCheck,
  FileCheck, HelpCircle, HardDrive, Phone, Users, CheckCircle2
} from 'lucide-react';

interface SettingsPageProps {
  highContrast?: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
  role?: string;
}

import { useSettingsStore } from '../lib/settingsStore';

// Removed hardcoded roleProfilesData

export default function SettingsPage({ highContrast, showToast, role }: SettingsPageProps) {
  const { 
    profile, preferences, sessions, securityLogs: storeSecurityLogs, passkeys: storePasskeys, systemMetrics: storeSystemMetrics, 
    init, updateProfile, updatePreferences, revokeSession 
  } = useSettingsStore();

  useEffect(() => {
    init();
  }, [init]);

  const [activeTab, setActiveTab] = useState("Profile");
  
  // Theme & Styles
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900 dark:text-stone-100";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white dark:bg-stone-900 border-gray-100 dark:border-stone-800";
  const textSecondary = highContrast ? "text-gray-400" : "text-gray-500 dark:text-stone-400";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-200 dark:border-stone-800";

  // 1. Profile State
  const [profileState, setProfileState] = useState({
    fullName: "",
    employeeId: "",
    badgeNumber: "",
    rank: "",
    organization: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    emergencyContact: "",
    bio: ""
  });

  // Profile Image and Cropping
  const [profileImage, setProfileImage] = useState(`https://api.dicebear.com/7.x/avataaars/svg?seed=Default`);

  useEffect(() => {
    if (profile) {
      setProfileState({
        fullName: profile.name || "",
        employeeId: profileState.employeeId || "",
        badgeNumber: profileState.badgeNumber || "",
        rank: profile.rank || "",
        organization: profile.organization || "",
        department: profileState.department || "",
        designation: profileState.designation || "",
        email: profile.email || "",
        phone: profile.phone || "",
        emergencyContact: profile.emergencyContact || "",
        bio: profile.bio || ""
      });
      setProfileImage(`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed || profile.name}`);
    }
  }, [profile]);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [cropPosition, setCropPosition] = useState({ x: 50, y: 50, scale: 1 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autosave
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);

  // 2. Security State
  const [passwords, setPasswords] = useState({ current: "", newPassword: "", confirm: "" });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [is2FaEnabled, setIs2FaEnabled] = useState(true);
  const [passkeys, setPasskeys] = useState(storePasskeys);

  const [securityLogsFilter, setSecurityLogsFilter] = useState("All");
  const [securityLogs, setSecurityLogs] = useState(storeSecurityLogs);

  useEffect(() => {
    setPasskeys(storePasskeys);
    setSecurityLogs(storeSecurityLogs);
  }, [storePasskeys, storeSecurityLogs]);

  // 3. Notification Settings State
  const [notificationConfig, setNotificationConfig] = useState({
    childRescueAlerts: true,
    emergencyAlerts: true,
    aiNotifications: true,
    familyMatchAlerts: true,
    medicalAlerts: true,
    shelterAlerts: false,
    wellnessAlerts: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    desktopNotifications: true
  });

  // 4. Appearance Settings State
  const [appearance, setAppearance] = useState({
    theme: "Light Mode",
    fontSize: "Medium",
    language: "English (US)",
    timezone: "UTC+05:30 (IST)",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    accessibilityKeyboard: true
  });

  useEffect(() => {
    if (preferences) {
      setNotificationConfig({
        childRescueAlerts: preferences.alerts?.rescue ?? true,
        emergencyAlerts: preferences.alerts?.emergency ?? true,
        aiNotifications: preferences.alerts?.predictive ?? true,
        familyMatchAlerts: preferences.alerts?.verification ?? true,
        medicalAlerts: preferences.alerts?.medical ?? true,
        shelterAlerts: preferences.alerts?.capacity ?? false,
        wellnessAlerts: preferences.alerts?.psychological ?? true,
        pushNotifications: preferences.routing?.browserPush ?? true,
        emailNotifications: preferences.routing?.emailDigest ?? true,
        smsNotifications: preferences.routing?.smsGateway ?? false,
        desktopNotifications: preferences.routing?.localSystem ?? true
      });
      setAppearance({
        theme: preferences.theme || "Light Mode",
        fontSize: "Medium",
        language: preferences.language || "English (US)",
        timezone: preferences.timeZone || "UTC+05:30 (IST)",
        dateFormat: preferences.dateFormat || "DD/MM/YYYY",
        timeFormat: "24-hour",
        accessibilityKeyboard: preferences.accessibility ?? true
      });
    }
  }, [preferences]);

  // 5. Recovery Preferences State
  const [recoveryPrefs, setRecoveryPrefs] = useState(profile?.recoveryPrefs || {
    defaultDashboard: "Recovery Center",
    autoRefreshInterval: "30s",
    defaultSearchRadius: 50, // km
    aiRecommendationLevel: "Moderate",
    defaultMapLayer: "Street View",
    timelinePreferences: "Chronological",
    casePriorityDisplay: "High-to-Low",
    childCardLayout: "Detailed List"
  });

  // 6. AI Config State
  const [aiConfig, setAiConfig] = useState(profile?.aiConfig || {
    recoveryAiEnabled: true,
    aiSuggestions: true,
    aiCaseSummaries: true,
    aiPredictions: true,
    aiRiskAnalysis: true,
    aiNotifications: true,
    aiAutoClassification: false
  });

  // 7. Data and Privacy State
  const [privacyConfig, setPrivacyConfig] = useState(profile?.privacyConfig || {
    dataSharing: true,
    telemetryEnabled: false,
    autoBackup: true,
    backupFrequency: "Weekly"
  });

  useEffect(() => {
    if (profile) {
      if (profile.recoveryPrefs) setRecoveryPrefs(profile.recoveryPrefs);
      if (profile.aiConfig) setAiConfig(profile.aiConfig);
      if (profile.privacyConfig) setPrivacyConfig(profile.privacyConfig);
    }
  }, [profile]);

  const [isBackupSpinnerActive, setIsBackupSpinnerActive] = useState(false);

  // 8. System Status State (Live updates)
  const [systemMetrics, setSystemMetrics] = useState({
    ping: 24,
    activeTransactions: 4,
    wsPacketsSent: 1502,
    wsPacketsReceived: 1489,
    aiLoad: 12,
    aiRequestCount: 342,
    storageUsed: 2.4, // GB
    cacheUsed: 312, // MB
    networkSpeed: "85 Mbps",
    isOnline: navigator.onLine
  });

  useEffect(() => {
    if (storeSystemMetrics) {
      setSystemMetrics(storeSystemMetrics);
    }
  }, [storeSystemMetrics]);

  // Auto Refresh Interval Timer (mocking the live ping only, not mutating all metrics randomly anymore)
  useEffect(() => {
    const handleOnlineStatus = () => {
      setSystemMetrics(prev => ({ ...prev, isOnline: navigator.onLine }));
    };
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        ping: Math.floor(Math.random() * 15) + 15
      }));
    }, 4000);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  // Theme apply logic
  useEffect(() => {
    const root = document.documentElement;
    if (appearance.theme === "Dark Mode") {
      root.classList.add("dark");
    } else if (appearance.theme === "Light Mode") {
      root.classList.remove("dark");
    } else if (appearance.theme === "High Contrast") {
      root.classList.add("dark"); // typically uses custom contrast tokens
    } else {
      // System default
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }, [appearance.theme]);

  // Validation functions
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val: string) => /^\+?[0-9\s-]{10,14}$/.test(val);

  // Handle Profile Upload & Crop
  const handleImageUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempImage(event.target.result as string);
          setIsCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCroppedImage = () => {
    if (tempImage) {
      setProfileImage(tempImage);
      setIsCropModalOpen(false);
      setTempImage(null);
      if (showToast) showToast("Profile image cropped and saved successfully.", "success");
    }
  };

  // Profile Auto-save Simulation
  const handleProfileFieldChange = (key: string, value: string) => {
    setProfileState(prev => ({ ...prev, [key]: value }));
    if (autosaveEnabled) {
      // Simulate real-time backend updates
      const debounceTimeout = setTimeout(() => {
        if (showToast) showToast(`Saving ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}...`, "info");
      }, 500);
      return () => clearTimeout(debounceTimeout);
    }
  };

  const forceProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(profileState.email)) {
      if (showToast) showToast("Invalid email address format.", "error");
      return;
    }
    if (!validatePhone(profileState.phone)) {
      if (showToast) showToast("Invalid phone number format.", "error");
      return;
    }
    try {
      await updateProfile({
        name: profileState.fullName,
        email: profileState.email,
        employeeId: profileState.employeeId,
        badgeNumber: profileState.badgeNumber,
        rank: profileState.rank,
        organization: profileState.organization,
        department: profileState.department,
        designation: profileState.designation,
        phone: profileState.phone,
        emergencyContact: profileState.emergencyContact,
        bio: profileState.bio
      });
      if (showToast) showToast("Profile modifications saved permanently to central server.", "success");
    } catch (err) {
      if (showToast) showToast("Failed to save profile.", "error");
    }
  };

  // Password Security Logic
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "None", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1: return { score: 25, text: "Weak", color: "bg-red-500" };
      case 2: return { score: 50, text: "Moderate", color: "bg-yellow-500" };
      case 3: return { score: 75, text: "Strong", color: "bg-blue-500" };
      case 4: return { score: 100, text: "Excellent / Enterprise Safe", color: "bg-emerald-500" };
      default: return { score: 10, text: "Very Weak", color: "bg-red-600" };
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPassword || !passwords.confirm) {
      if (showToast) showToast("Please fill in all password fields.", "error");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      if (showToast) showToast("New password confirmation does not match.", "error");
      return;
    }
    if (calculatePasswordStrength(passwords.newPassword).score < 50) {
      if (showToast) showToast("Your new password must be at least Moderate strength.", "error");
      return;
    }

    if (showToast) showToast("Credentials modified successfully. Session secured.", "success");
    setPasswords({ current: "", newPassword: "", confirm: "" });
  };

  // Two Factor Switch
  const toggle2FA = () => {
    setIs2FaEnabled(!is2FaEnabled);
    if (showToast) {
      showToast(is2FaEnabled ? "Two-Factor Authentication suspended." : "Secure 2FA token active.", is2FaEnabled ? "info" : "success");
    }
  };

  // Passkeys Add
  const registerNewPasskey = () => {
    const id = "pk-" + (passkeys.length + 1);
    const newKey = { id, name: "Physical FIDO2 Token (Registered)", added: new Date().toISOString().split('T')[0] };
    setPasskeys([...passkeys, newKey]);
    if (showToast) showToast("Passkey credential compiled and registered.", "success");
  };

  // Session Revocation
  const handleRevokeSession = async (id: string) => {
    await revokeSession(id);
    if (showToast) showToast("Device token revoked. Session terminated.", "success");
  };

  const handleRevokeAllOthers = async () => {
    // In a real app we'd have a revokeAll endpoint
    const otherSessions = sessions.filter(s => !s.isCurrent);
    for (const s of otherSessions) {
      await revokeSession(s.id);
    }
    if (showToast) showToast("All other active platform logins have been terminated.", "success");
  };

  // Interactive Notifications Changes
  const handleNotificationConfigChange = (key: keyof typeof notificationConfig) => {
    const newVal = !notificationConfig[key];
    setNotificationConfig(prev => ({ ...prev, [key]: newVal }));
    if (showToast) {
      showToast(`${(key as string).replace(/([A-Z])/g, ' $1')} applied instantly.`, "success");
    }
  };

  // Data Download Simulator
  const handleDownloadPersonalData = () => {
    if (showToast) showToast("Compiling personal data ledger archive...", "info");
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profile, notificationConfig, appearance, recoveryPrefs, aiConfig, privacyConfig }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Abhaya_User_Ledger_${profileState.employeeId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      if (showToast) showToast("Personal dossier compiled and downloaded.", "success");
    }, 1500);
  };

  // Backup Manual Trigger
  const triggerManualBackup = () => {
    setIsBackupSpinnerActive(true);
    setTimeout(() => {
      setIsBackupSpinnerActive(false);
      if (showToast) showToast("Encrypted mirror backup successfully saved to National Server.", "success");
    }, 2000);
  };

  // Import Settings Simulation
  const triggerImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) setProfileState(prev => ({ ...prev, ...parsed.profile }));
          if (parsed.notificationConfig) setNotificationConfig(prev => ({ ...prev, ...parsed.parsed.notificationConfig }));
          if (parsed.appearance) setAppearance(prev => ({ ...prev, ...parsed.appearance }));
          if (showToast) showToast("System preferences and profile successfully imported.", "success");
        } catch (err) {
          if (showToast) showToast("Corrupted or malformed backup JSON template.", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: "Profile", icon: User, label: "Profile Settings" },
    { id: "Security", icon: Shield, label: "Account Security" },
    { id: "Notifications", icon: Bell, label: "Notification Centre" },
    { id: "Appearance", icon: Palette, label: "Appearance" },
    { id: "Recovery", icon: Sliders, label: "Recovery Preferences" },
    { id: "AICo", icon: Cpu, label: "AI Configuration" },
    { id: "DataPrivacy", icon: Database, label: "Data & Privacy" },
    { id: "System", icon: Server, label: "System Information" }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-16 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className={`text-3xl font-black ${textMain} tracking-tight mb-2 flex items-center gap-2`}>
            <Sliders className="w-8 h-8 text-[#115e3b] dark:text-yellow-300" />
            Mission Control Settings
          </h2>
          <p className={textSecondary}>Configure governmental protocols, user profiles, AI preferences, and operational interfaces.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className={`text-xs font-bold ${textSecondary}`}>Autosave Sync</span>
          <button 
            onClick={() => {
              setAutosaveEnabled(!autosaveEnabled);
              if (showToast) showToast(autosaveEnabled ? "Autosave deactivated." : "Autosave synchronized globally.", "info");
            }}
            className={`w-12 h-6 rounded-full transition-colors relative ${autosaveEnabled ? 'bg-[#115e3b] dark:bg-yellow-300' : 'bg-gray-300 dark:bg-stone-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white dark:bg-black absolute top-1 transition-transform ${autosaveEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Tab Left Sidebar */}
        <div className={`w-full lg:w-72 shrink-0 rounded-2xl border p-2.5 ${bgCard} shadow-sm`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary} px-4 mb-3 pt-2`}>Settings Sub-Systems</p>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold transition-all text-xs text-left ${
                  activeTab === tab.id 
                    ? highContrast
                      ? "bg-stone-800 text-yellow-300 border-l-4 border-yellow-300"
                      : "bg-[#115e3b]/10 text-[#115e3b] dark:text-yellow-300 dark:bg-stone-800" 
                    : `text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50`
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "scale-110" : ""}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Right Content */}
        <div className="flex-1 w-full">
          {/* TAB 1: PROFILE */}
          {activeTab === "Profile" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div className="flex items-center justify-between border-b pb-4 dark:border-stone-800">
                <div>
                  <h3 className={`text-xl font-black ${textMain}`}>National Profile Record</h3>
                  <p className={`text-xs ${textSecondary}`}>Manage identification data for the active officer badge.</p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${highContrast ? "bg-stone-800 border text-yellow-300 border-yellow-300" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"}`}>
                  ROLE: CHILD WELFARE OFFICER
                </span>
              </div>

              {/* Avatar Photo section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b dark:border-stone-800 border-gray-100">
                <div 
                  onClick={handleImageUploadClick}
                  className="w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center relative group cursor-pointer overflow-hidden border-2 border-dashed border-[#115e3b] dark:border-stone-700 hover:border-solid transition-all shrink-0"
                >
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Upload className="w-5 h-5 mb-1 text-white" />
                    <span className="text-[10px] font-extrabold">CHANGE</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div className="text-center sm:text-left space-y-1">
                  <h4 className={`text-lg font-extrabold ${textMain}`}>{profileState.fullName}</h4>
                  <p className={`text-xs font-semibold ${textSecondary}`}>{profileState.designation} • {profileState.department}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className={`text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 ${textSecondary} px-2 py-0.5 rounded`}>ID: {profileState.employeeId}</span>
                    <span className={`text-[10px] font-mono font-bold bg-stone-100 dark:bg-stone-800 ${textSecondary} px-2 py-0.5 rounded`}>BADGE: {profileState.badgeNumber}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 italic pt-1">Accepts PNG/JPG. Automatic server-side verification.</p>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={forceProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Full Name</label>
                    <input 
                      type="text" 
                      value={profileState.fullName}
                      onChange={(e) => handleProfileFieldChange("fullName", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Employee ID</label>
                      <input 
                        type="text" 
                        value={profileState.employeeId}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border opacity-60 cursor-not-allowed bg-gray-100 dark:bg-stone-800/30 text-stone-500 border-gray-200 dark:border-stone-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Badge Number</label>
                      <input 
                        type="text" 
                        value={profileState.badgeNumber}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border opacity-60 cursor-not-allowed bg-gray-100 dark:bg-stone-800/30 text-stone-500 border-gray-200 dark:border-stone-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Service Rank</label>
                    <input 
                      type="text" 
                      value={profileState.rank}
                      onChange={(e) => handleProfileFieldChange("rank", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Affiliated Organization</label>
                    <input 
                      type="text" 
                      value={profileState.organization}
                      onChange={(e) => handleProfileFieldChange("organization", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Assigned Department</label>
                    <input 
                      type="text" 
                      value={profileState.department}
                      onChange={(e) => handleProfileFieldChange("department", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Official Designation</label>
                    <input 
                      type="text" 
                      value={profileState.designation}
                      onChange={(e) => handleProfileFieldChange("designation", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Official Email Address</label>
                    <input 
                      type="email" 
                      value={profileState.email}
                      onChange={(e) => handleProfileFieldChange("email", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Phone Number</label>
                      <input 
                        type="text" 
                        value={profileState.phone}
                        onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Emergency Contact</label>
                      <input 
                        type="text" 
                        value={profileState.emergencyContact}
                        onChange={(e) => handleProfileFieldChange("emergencyContact", e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Personal Biography / Professional Summary</label>
                  <textarea 
                    rows={3}
                    value={profileState.bio}
                    onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t dark:border-stone-800">
                  <button type="submit" className={`px-6 py-3 font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 text-sm ${highContrast ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-[#115e3b] hover:bg-[#0d4c2f] text-white"}`}>
                    <Save className="w-4 h-4" /> Save Record & Sign Off
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ACCOUNT SECURITY */}
          {activeTab === "Security" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-8`}>
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Enterprise Security Sub-System</h3>
                <p className={`text-xs ${textSecondary}`}>Ensure multi-factor identity proofing, passkey orchestration, and session tracking.</p>
              </div>

              {/* Status banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${highContrast ? "border-yellow-300 bg-stone-900 text-yellow-300" : "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/10 dark:border-emerald-900/30"}`}>
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-yellow-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300">Identity Audit Clear</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">Two-factor biometric encryption and passkeys are fully configured and registered in accordance with National Portal directives.</p>
                </div>
              </div>

              {/* Change Password Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6 dark:border-stone-800">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>Change Master Password</h4>
                  
                  <div className="space-y-2 relative">
                    <label className={`text-xs font-semibold ${textSecondary}`}>Current Master Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPass ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className={`w-full pl-4 pr-10 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-stone-400`}
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label className={`text-xs font-semibold ${textSecondary}`}>New Master Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPass ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        className={`w-full pl-4 pr-10 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPass(!showNewPass)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-stone-400`}
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {passwords.newPassword && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className={textSecondary}>Password Integrity:</span>
                          <span className={calculatePasswordStrength(passwords.newPassword).text === "Excellent / Enterprise Safe" ? "text-emerald-500" : "text-amber-500"}>
                            {calculatePasswordStrength(passwords.newPassword).text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${calculatePasswordStrength(passwords.newPassword).color}`} 
                            style={{ width: `${calculatePasswordStrength(passwords.newPassword).score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-semibold ${textSecondary}`}>Confirm New Password</label>
                    <input 
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <button type="submit" className={`px-4 py-2 font-bold text-xs rounded-lg transition-colors shadow-xs ${highContrast ? "bg-stone-800 border border-yellow-300 text-yellow-300 hover:bg-stone-700" : "bg-[#115e3b] text-white hover:bg-[#0d4c2f]"}`}>
                    Update Credentials
                  </button>
                </form>

                <div className="space-y-6">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>Hardware Token & Passkeys</h4>
                  
                  <div className={`p-4 rounded-xl border ${borderClass} space-y-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className={`font-extrabold text-xs ${textMain}`}>Two-Factor Token authentication (2FA)</p>
                          <p className={`text-[10px] ${textSecondary}`}>YubiKey & Authenticator setup</p>
                        </div>
                      </div>
                      <button 
                        onClick={toggle2FA}
                        className={`text-[10px] px-2.5 py-1 rounded font-extrabold border ${is2FaEnabled ? (highContrast ? "bg-stone-800 text-yellow-300 border-yellow-300" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20") : "bg-gray-50 text-stone-500 border-gray-200"}`}
                      >
                        {is2FaEnabled ? "ENABLED" : "SUSPENDED"}
                      </button>
                    </div>

                    <div className="border-t dark:border-stone-800 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold tracking-wider uppercase ${textSecondary}`}>Registered Passkeys</span>
                        <button 
                          onClick={registerNewPasskey}
                          className="text-[10px] font-extrabold text-[#115e3b] dark:text-yellow-300 hover:underline"
                        >
                          + REGISTER PASSKEY
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {passkeys.map(pk => (
                          <div key={pk.id} className="flex items-center justify-between bg-stone-50 dark:bg-stone-950 p-2 rounded-lg text-xs">
                            <span className={`font-bold ${textMain}`}>{pk.name}</span>
                            <span className={`text-[10px] text-stone-400 font-mono`}>Added {pk.added}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions & History */}
              <div className="border-t pt-6 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>Active Operational Sessions</h4>
                  <button 
                    onClick={handleRevokeAllOthers}
                    className="text-[10px] font-extrabold text-red-600 dark:text-red-400 hover:underline"
                  >
                    TERMINATE OTHER SESSIONS
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sessions.map(sess => (
                    <div key={sess.id} className={`p-4 rounded-xl border ${borderClass} flex flex-col justify-between ${sess.active ? 'bg-emerald-50/10 border-emerald-500/30' : ''}`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sess.active ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-stone-800'}`}>
                            {sess.active ? "CURRENT SESSION" : "TRUSTED CLIENT"}
                          </span>
                          {!sess.active && (
                            <button 
                              onClick={() => handleRevokeSession(sess.id)}
                              className="text-[10px] font-bold text-red-500 hover:underline"
                            >
                              REVOKE
                            </button>
                          )}
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Monitor className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                          <div>
                            <p className={`font-extrabold text-xs ${textMain}`}>{sess.device}</p>
                            <p className="text-[10px] text-stone-400 font-medium">{sess.browser} • {sess.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t dark:border-stone-800/60 flex items-center justify-between text-[10px] font-mono font-bold text-stone-400">
                        <span>IP: {sess.ip}</span>
                        <span>{sess.lastActive}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Logs Tab */}
              <div className="border-t pt-6 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>Audited Security Logs</h4>
                  <select 
                    value={securityLogsFilter}
                    onChange={(e) => setSecurityLogsFilter(e.target.value)}
                    className={`text-xs px-2.5 py-1 border rounded-lg focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"}`}
                  >
                    <option value="All">All Logs</option>
                    <option value="Success">Successes Only</option>
                    <option value="Failed">Failures Only</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b dark:border-stone-800 text-stone-400 font-bold uppercase">
                        <th className="py-2">Event Trigger</th>
                        <th className="py-2">Timestamp</th>
                        <th className="py-2">Origin IP</th>
                        <th className="py-2 text-right">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityLogs
                        .filter(l => securityLogsFilter === "All" || l.status === securityLogsFilter)
                        .map(log => (
                          <tr key={log.id} className="border-b dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800/10">
                            <td className="py-2.5 font-bold">{log.event}</td>
                            <td className="py-2.5 text-stone-400">{log.time}</td>
                            <td className="py-2.5 font-mono text-stone-400">{log.ip}</td>
                            <td className="py-2.5 text-right font-bold">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-red-50 text-red-600 dark:bg-red-950/20'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATION CENTER */}
          {activeTab === "Notifications" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>National Alerts Registry</h3>
                <p className={`text-xs ${textSecondary}`}>Assign secure instant-notification routers for emergency signals and wellness logs.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary} mb-3`}>Rescue & Operational Milestones</h4>
                  <div className="space-y-3">
                    {[
                      { key: "childRescueAlerts", title: "Child Rescue & Apprehension Alerts", desc: "Notify immediately when a child has been retrieved from high-risk fields." },
                      { key: "emergencyAlerts", title: "Critical Emergency Broadcasts", desc: "Priority warnings about shelter relocations or custody disputes." },
                      { key: "aiNotifications", title: "Predictive Analytics Insights (AI)", desc: "Receive automated child profiling indicators and risk level warnings." },
                      { key: "familyMatchAlerts", title: "Integrated Family Verification Matches", desc: "Notification upon high-centrality biometric match in the Aadhaar repository." },
                      { key: "medicalAlerts", title: "Urgent Medical & Health Indicators", desc: "Urgent therapy, medicine shortages, and malnutrition triggers." },
                      { key: "shelterAlerts", title: "Shelter Out-In Capacity Alerts", desc: "Logs when regional shelter capacity shifts above 90% threshold." },
                      { key: "wellnessAlerts", title: "Child Psychological Recovery Milestones", desc: "Notifies when wellness score records fluctuate above critical margins." }
                    ].map((item) => (
                      <div key={item.key} className={`flex items-center justify-between p-3.5 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/40`}>
                        <div className="space-y-0.5">
                          <p className={`font-bold text-xs ${textMain}`}>{item.title}</p>
                          <p className="text-[10px] text-stone-400">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleNotificationConfigChange(item.key as keyof typeof notificationConfig)}
                          className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${notificationConfig[item.key as keyof typeof notificationConfig] ? 'bg-[#115e3b] dark:bg-yellow-300' : 'bg-gray-300 dark:bg-stone-700'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white dark:bg-black absolute top-1 transition-transform ${notificationConfig[item.key as keyof typeof notificationConfig] ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 dark:border-stone-800">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary} mb-3`}>Alert Routing Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "pushNotifications", title: "Direct Browser Push Messages", desc: "Mount popups directly in client headers." },
                      { key: "emailNotifications", title: "Encrypted Government Email Digest", desc: "Secure cryptographic logs transmitted daily." },
                      { key: "smsNotifications", title: "Critical Priority SMS Gateways", desc: "Send standard GSM alerts directly to secure devices." },
                      { key: "desktopNotifications", title: "Local System Level Alerts", desc: "Native OS notification hook integration." }
                    ].map((item) => (
                      <div key={item.key} className={`flex items-center justify-between p-3.5 rounded-xl border ${borderClass} bg-stone-50/30 dark:bg-stone-950/20`}>
                        <div className="space-y-0.5">
                          <p className={`font-bold text-xs ${textMain}`}>{item.title}</p>
                          <p className="text-[10px] text-stone-400">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleNotificationConfigChange(item.key as keyof typeof notificationConfig)}
                          className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${notificationConfig[item.key as keyof typeof notificationConfig] ? 'bg-[#115e3b] dark:bg-yellow-300' : 'bg-gray-300 dark:bg-stone-700'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white dark:bg-black absolute top-1 transition-transform ${notificationConfig[item.key as keyof typeof notificationConfig] ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPEARANCE */}
          {activeTab === "Appearance" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Interface & Accessibility</h3>
                <p className={`text-xs ${textSecondary}`}>Adjust structural styling, high-contrast states, and typography parameters immediately.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Selector */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Visual Theme</label>
                  <select 
                    value={appearance.theme}
                    onChange={(e) => {
                      setAppearance({...appearance, theme: e.target.value});
                      if(showToast) showToast(`Theme shifted to ${e.target.value}.`, "success");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Light Mode</option>
                    <option>Dark Mode</option>
                    <option>High Contrast</option>
                    <option>System Default</option>
                  </select>
                </div>

                {/* Font Size Selector */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Typography Scale</label>
                  <select 
                    value={appearance.fontSize}
                    onChange={(e) => {
                      setAppearance({...appearance, fontSize: e.target.value});
                      if(showToast) showToast(`Font size configured to ${e.target.value}.`, "success");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Small (Dense)</option>
                    <option>Medium (Standard)</option>
                    <option>Large (Accessible)</option>
                    <option>Extra Large (Dyslexia Friendly)</option>
                  </select>
                </div>

                {/* Language Dropdown */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>System Language</label>
                  <select 
                    value={appearance.language}
                    onChange={(e) => {
                      setAppearance({...appearance, language: e.target.value});
                      if(showToast) showToast(`Primary interface compiled in ${e.target.value}.`, "success");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>English (US)</option>
                    <option>Hindi (भारत • हिन्दी)</option>
                    <option>Bengali (ভারত • বাংলা)</option>
                    <option>Tamil (ভারত • தமிழ்)</option>
                    <option>Marathi (भारत • मराठी)</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Standard Time Zone</label>
                  <select 
                    value={appearance.timezone}
                    onChange={(e) => {
                      setAppearance({...appearance, timezone: e.target.value});
                      if(showToast) showToast("System clocks sync'd.", "success");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>UTC+05:30 (Indian Standard Time)</option>
                    <option>UTC+00:00 (Greenwich Mean Time)</option>
                    <option>UTC+08:00 (Singapore / East Asia)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Date Presentation</label>
                  <select 
                    value={appearance.dateFormat}
                    onChange={(e) => setAppearance({...appearance, dateFormat: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Time Format */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Time Presentation</label>
                  <select 
                    value={appearance.timeFormat}
                    onChange={(e) => setAppearance({...appearance, timeFormat: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>24-hour (Military Sync)</option>
                    <option>12-hour (Standard AM/PM)</option>
                  </select>
                </div>
              </div>

              {/* Accessibility Settings */}
              <div className="border-t pt-6 dark:border-stone-800 space-y-3">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>Government Accessibility Mandate</h4>
                <div className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30 flex items-start justify-between`}>
                  <div className="space-y-1 pr-6">
                    <p className={`font-bold text-xs ${textMain}`}>Full Keyboard Screen Navigation (WCAG 2.1)</p>
                    <p className="text-[10px] text-stone-400">Forces screen readers and standard Tab elements to support complete non-mouse operational capability in high-risk zones.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setAppearance({...appearance, accessibilityKeyboard: !appearance.accessibilityKeyboard});
                      if(showToast) showToast("Keyboard helpers configured.", "info");
                    }}
                    className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${appearance.accessibilityKeyboard ? 'bg-[#115e3b] dark:bg-yellow-300' : 'bg-gray-300 dark:bg-stone-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white dark:bg-black absolute top-1 transition-transform ${appearance.accessibilityKeyboard ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RECOVERY PREFERENCES */}
          {activeTab === "Recovery" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Operational Protocols</h3>
                <p className={`text-xs ${textSecondary}`}>Fine-tune default tracking views, telemetry ranges, and card designs for Child Care units.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Default Boot Landing View</label>
                  <select 
                    value={recoveryPrefs.defaultDashboard}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, defaultDashboard: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Recovery Center</option>
                    <option>Children Overview</option>
                    <option>Active Shelters Mapping</option>
                    <option>AI Predictions Engine</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Database Live Auto-Refresh</label>
                  <select 
                    value={recoveryPrefs.autoRefreshInterval}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, autoRefreshInterval: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>No Refresh (Manual Only)</option>
                    <option>10 seconds (Max Load)</option>
                    <option>30 seconds (Recommended)</option>
                    <option>1 minute (Standard)</option>
                    <option>5 minutes (Eco Mode)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className={textSecondary}>Default GPS Search Radius</span>
                    <span className={textMain}>{recoveryPrefs.defaultSearchRadius} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="200" 
                    value={recoveryPrefs.defaultSearchRadius}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, defaultSearchRadius: parseInt(e.target.value)})}
                    className="w-full accent-[#115e3b]" 
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>10 km</span>
                    <span>100 km</span>
                    <span>200 km (Inter-State)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Recommendation Level (AI)</label>
                  <select 
                    value={recoveryPrefs.aiRecommendationLevel}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, aiRecommendationLevel: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Conservative (Requires absolute proof)</option>
                    <option>Moderate (Fuzzy logic matches)</option>
                    <option>Highly Assertive (Proactive signals)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Tactical Map Layer</label>
                  <select 
                    value={recoveryPrefs.defaultMapLayer}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, defaultMapLayer: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Street View Map</option>
                    <option>Infrared Satellite Layer</option>
                    <option>Topographical Terrain Layer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Journey Progression View</label>
                  <select 
                    value={recoveryPrefs.timelinePreferences}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, timelinePreferences: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Chronological Order (Earliest First)</option>
                    <option>Structured Milestone Groups</option>
                    <option>Reverse Chronological</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Default Layout for Child Cards</label>
                  <select 
                    value={recoveryPrefs.childCardLayout}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, childCardLayout: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>Visual Bento Grid</option>
                    <option>Detailed List Grid</option>
                    <option>Kanban Pipeline Board</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Default Threat/Priority View</label>
                  <select 
                    value={recoveryPrefs.casePriorityDisplay}
                    onChange={(e) => setRecoveryPrefs({...recoveryPrefs, casePriorityDisplay: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-gray-50 dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                  >
                    <option>High-to-Low (Emergency Centric)</option>
                    <option>Low-to-High (Comprehensive)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-stone-800 flex justify-end">
                <button 
                  onClick={() => { if(showToast) showToast("Tactical preferences synchronized.", "success"); }}
                  className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-xs ${highContrast ? "bg-yellow-300 text-black" : "bg-[#115e3b] text-white"}`}
                >
                  Apply Operational Profile
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: AI CONFIGURATION */}
          {activeTab === "AICo" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Gemini AI Engine Hyperparameters</h3>
                <p className={`text-xs ${textSecondary}`}>Deploy, suspend, or restrict machine learning routines for automated case management.</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "recoveryAiEnabled", title: "Core Recovery AI Assistant (Gemini)", desc: "Enables natural-language case auditing, support chat systems, and policy searching." },
                  { key: "aiSuggestions", title: "Automated Counselling & Care Advice", desc: "Suggests child-specific cognitive interventions based on wellness thresholds." },
                  { key: "aiCaseSummaries", title: "AI-Generated dossier case files summaries", desc: "Drafts executive case briefs for police, courts, or Child Welfare Committees." },
                  { key: "aiPredictions", title: "Biometric Identity & Match Prediction Model", desc: "Performs matching likelihood calculations against Aadhaar/missing directories." },
                  { key: "aiRiskAnalysis", title: "Trauma Severity Risk Assessments", desc: "Calculates child exploitation levels and classifies priority cases." },
                  { key: "aiNotifications", title: "Intelligent Trigger Signal System", desc: "Dispatches alarms when automated profiles trace systemic irregularities." },
                  { key: "aiAutoClassification", title: "Self-governing Auto Classification (Experimental)", desc: "Allows machine learning to self-categorize shelter placement slots without review." }
                ].map(item => (
                  <div key={item.key} className={`p-4 rounded-xl border ${borderClass} flex items-start justify-between bg-stone-50/40 dark:bg-stone-950/20`}>
                    <div className="space-y-1">
                      <p className={`font-bold text-xs ${textMain}`}>{item.title}</p>
                      <p className="text-[10px] text-stone-400">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setAiConfig(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof aiConfig] }));
                        if(showToast) showToast(`${item.title} toggled.`, "info");
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${aiConfig[item.key as keyof typeof aiConfig] ? 'bg-[#115e3b] dark:bg-yellow-300' : 'bg-gray-300 dark:bg-stone-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white dark:bg-black absolute top-1 transition-transform ${aiConfig[item.key as keyof typeof aiConfig] ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-xl border border-dashed border-yellow-300/40 bg-yellow-500/5 text-xs text-yellow-600 dark:text-yellow-300 flex items-start gap-3`}>
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>Enabling <strong>Self-governing Auto Classification</strong> bypasses human CWO authentication for shelter allocation, in breach of general Mission Vatsalya protocols. Handle with extreme caution.</p>
              </div>
            </div>
          )}

          {/* TAB 7: DATA & PRIVACY */}
          {activeTab === "DataPrivacy" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Privacy Protocols & Encryption</h3>
                <p className={`text-xs ${textSecondary}`}>Manage consent registers, export secure ledger dossiers, or import structural system parameters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b dark:border-stone-800">
                <div className={`p-5 rounded-xl border ${borderClass} space-y-3`}>
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-[#115e3b] dark:text-yellow-300" />
                    <div>
                      <h4 className={`font-bold text-xs ${textMain}`}>Export Audited dossier Data</h4>
                      <p className="text-[10px] text-stone-400">Download complete structured profile parameters, preference models, and logs.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDownloadPersonalData}
                      className={`px-3 py-1.5 rounded font-bold text-[10px] ${highContrast ? "bg-stone-800 text-yellow-300 border border-yellow-300" : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"}`}
                    >
                      Download Ledger (JSON)
                    </button>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${borderClass} space-y-3`}>
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h4 className={`font-bold text-xs ${textMain}`}>Import Setup Preferences</h4>
                      <p className="text-[10px] text-stone-400">Restore your preferences from an exported .json backup ledger.</p>
                    </div>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="preferences-uploader" 
                      accept=".json" 
                      onChange={triggerImportSettings} 
                      className="hidden" 
                    />
                    <label 
                      htmlFor="preferences-uploader" 
                      className={`inline-block px-3 py-1.5 rounded font-bold text-[10px] cursor-pointer ${highContrast ? "bg-stone-800 text-yellow-300 border border-yellow-300" : "bg-[#115e3b] hover:bg-[#0d4c2f] text-white"}`}
                    >
                      Browse backup .json
                    </label>
                  </div>
                </div>
              </div>

              {/* Backups preferences */}
              <div className="space-y-4">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>Encrypted Mirrored Cloud Backups</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${borderClass} flex items-center justify-between`}>
                    <div className="space-y-0.5">
                      <p className={`font-bold text-xs ${textMain}`}>Auto Cloud Synced Mirrors</p>
                      <p className="text-[10px] text-stone-400">Auto backup of child care wellness index files.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setPrivacyConfig(prev => ({ ...prev, autoBackup: !prev.autoBackup }));
                        if(showToast) showToast("Auto backups modified.", "info");
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${privacyConfig.autoBackup ? 'bg-[#115e3b] dark:bg-yellow-300' : 'bg-gray-300 dark:bg-stone-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white dark:bg-black absolute top-1 transition-transform ${privacyConfig.autoBackup ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border ${borderClass} flex items-center justify-between`}>
                    <div className="space-y-0.5">
                      <p className={`font-bold text-xs ${textMain}`}>National Mirror Frequency</p>
                      <p className="text-[10px] text-stone-400">Scheduled data export interval.</p>
                    </div>
                    <select 
                      value={privacyConfig.backupFrequency}
                      onChange={(e) => setPrivacyConfig({...privacyConfig, backupFrequency: e.target.value})}
                      className={`text-xs px-2.5 py-1.5 rounded border focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"}`}
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
                  <div className="space-y-1">
                    <p className={`font-bold text-xs ${textMain}`}>Force Cryptographic Ledger Push</p>
                    <p className="text-[10px] text-stone-400">Compiles historical data, signs with badge certificate, and pushes to government vault.</p>
                  </div>
                  <button 
                    onClick={triggerManualBackup}
                    disabled={isBackupSpinnerActive}
                    className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 border hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${highContrast ? "border-yellow-300 text-yellow-300" : "border-gray-200 dark:border-stone-700"}`}
                  >
                    {isBackupSpinnerActive ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Pushing Mirror...
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        Mirror Backup Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM INFORMATION (LIVE UPDATING) */}
          {activeTab === "System" && (
            <div className={`rounded-2xl border ${bgCard} p-6 shadow-sm space-y-6`}>
              <div className="flex items-center justify-between border-b pb-4 dark:border-stone-800">
                <div>
                  <h3 className={`text-xl font-black ${textMain}`}>Government Core Server Diagnostics</h3>
                  <p className={`text-xs ${textSecondary}`}>Live auditing logs of operational servers and regional database shards.</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-pulse">
                  <Activity className="w-4 h-4" /> LIVE DIAGNOSTICS ACTIVE
                </div>
              </div>

              {/* Status panel grids */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30 text-center space-y-1`}>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Gateway Ping</p>
                  <p className={`text-2xl font-black font-mono text-[#115e3b] dark:text-yellow-300`}>{systemMetrics.ping} ms</p>
                  <p className="text-[9px] text-emerald-500 font-bold">🟢 EXCELLENT SPEED</p>
                </div>

                <div className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30 text-center space-y-1`}>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Active Threads</p>
                  <p className={`text-2xl font-black font-mono ${textMain}`}>{systemMetrics.activeTransactions}</p>
                  <p className="text-[9px] text-stone-400">Concurrent Transactions</p>
                </div>

                <div className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30 text-center space-y-1`}>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">WebSocket Flow</p>
                  <p className={`text-sm font-black font-mono ${textMain}`}>↑{systemMetrics.wsPacketsSent} / ↓{systemMetrics.wsPacketsReceived}</p>
                  <p className="text-[9px] text-stone-400">Packets processed</p>
                </div>

                <div className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30 text-center space-y-1`}>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Gemini Server Load</p>
                  <p className={`text-2xl font-black font-mono text-indigo-500`}>{systemMetrics.aiLoad}%</p>
                  <p className="text-[9px] text-indigo-400 font-bold">Model 3.5-flash operational</p>
                </div>
              </div>

              {/* Interactive Storage Indicator Gauge */}
              <div className={`p-5 rounded-xl border ${borderClass} grid grid-cols-1 md:grid-cols-3 gap-6 items-center`}>
                <div className="space-y-1">
                  <h4 className={`font-bold text-xs ${textMain}`}>Secured Indexed Storage</h4>
                  <p className="text-[10px] text-stone-400 font-medium">Shows local space allocated for indexed child records, photo archives, and cached database grids.</p>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className={textSecondary}>Cache Allocation: {systemMetrics.cacheUsed} MB / 1024 MB</span>
                    <span className={textMain}>{(systemMetrics.cacheUsed / 1024 * 100).toFixed(1)}% Used</span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${systemMetrics.cacheUsed / 1024 * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-stone-400 font-bold">Local File Cache Storage: {systemMetrics.storageUsed} GB / 10 GB</span>
                    <button 
                      onClick={() => {
                        setSystemMetrics(prev => ({ ...prev, cacheUsed: 2 }));
                        if(showToast) showToast("System cache flushed. Storage allocation cleared.", "success");
                      }}
                      className="text-[10px] font-extrabold text-blue-500 hover:underline"
                    >
                      FLUSH CACHE
                    </button>
                  </div>
                </div>
              </div>

              {/* Client Network status indicators */}
              <div className="border-t pt-6 dark:border-stone-800">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${textSecondary} mb-3`}>Audited Environmental Context</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className={`p-3.5 rounded-xl border ${borderClass} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <Wifi className={systemMetrics.isOnline ? "text-emerald-500 w-5 h-5 animate-pulse" : "text-red-500 w-5 h-5"} />
                      <div>
                        <p className={`font-bold ${textMain}`}>Network Connectivity</p>
                        <p className="text-[10px] text-stone-400 font-semibold">{systemMetrics.isOnline ? "Continuous Active Connection" : "Offline / Offline Mode active"}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${systemMetrics.isOnline ? 'text-emerald-500' : 'text-red-500'}`}>
                      {systemMetrics.isOnline ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${borderClass} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <HardDrive className="text-[#115e3b] dark:text-yellow-300 w-5 h-5" />
                      <div>
                        <p className={`font-bold ${textMain}`}>Vatsalya Client Core</p>
                        <p className="text-[10px] text-stone-400 font-semibold">Active Client Version: v2.4.1-stable</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold text-stone-400`}>
                      BUILD #2026.115
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Crop Modal */}
      {isCropModalOpen && tempImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`max-w-md w-full rounded-2xl border ${bgCard} p-6 space-y-6 shadow-2xl`}>
            <div>
              <h3 className={`text-lg font-black ${textMain}`}>Crop Profile Image</h3>
              <p className={`text-xs ${textSecondary}`}>Adjust frame bounds to conform with standard credentials badge aspect ratio.</p>
            </div>
            
            <div className="relative aspect-square w-full bg-stone-100 dark:bg-stone-950 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 flex items-center justify-center">
              <img 
                src={tempImage} 
                alt="Temp Crop" 
                className="max-h-full max-w-full object-contain select-none" 
                style={{
                  transform: `translate(${cropPosition.x - 50}px, ${cropPosition.y - 50}px) scale(${cropPosition.scale})`
                }}
              />
              {/* Crop Frame Overlay Indicator */}
              <div className="absolute inset-0 border-4 border-black/40 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-[#115e3b] dark:border-yellow-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            {/* Slider to scale image */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-stone-400">
                <span>Scale Magnification</span>
                <span>{cropPosition.scale.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.05"
                value={cropPosition.scale}
                onChange={(e) => setCropPosition(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                className="w-full accent-[#115e3b]"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => {
                  setIsCropModalOpen(false);
                  setTempImage(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg border border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors`}
              >
                Abort
              </button>
              <button 
                onClick={saveCroppedImage}
                className={`px-4 py-2 text-xs font-bold rounded-lg text-white bg-[#115e3b] hover:bg-[#0d4c2f] transition-colors`}
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
