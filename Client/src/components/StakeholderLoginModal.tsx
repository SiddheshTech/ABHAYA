import React, { useState, useEffect } from "react";
import { translations, Language } from "../data/translations";
import { X, ShieldCheck, CheckCircle, RefreshCw, Layers, Award, FileText, UserCheck, Eye, AlertTriangle, UserPlus, LogIn } from "lucide-react";
import { useAuthStore } from "../lib/authStore";

interface StakeholderLoginModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  onIWRLogin?: () => void;
  onAIFLLogin?: () => void;
  onMCLogin?: () => void;
  onSystemLogin?: (role: string) => void;
}

export default function StakeholderLoginModal({
  lang,
  isOpen,
  onClose,
  highContrast,
  onIWRLogin,
  onAIFLLogin,
  onMCLogin,
  onSystemLogin
}: StakeholderLoginModalProps) {
  const t = translations[lang];
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  // Auto-route if already authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      const userRole = user.role;
      if (userRole === "IWR" && onIWRLogin) onIWRLogin();
      else if (userRole === "AIFL" && onAIFLLogin) onAIFLLogin();
      else if (userRole === "MC" && onMCLogin) onMCLogin();
      else if (["CRC", "CW", "ROS"].includes(userRole) && onSystemLogin) onSystemLogin(userRole);
    }
  }, [isOpen, isAuthenticated, user, onIWRLogin, onAIFLLogin, onMCLogin, onSystemLogin]);

  // Login credentials states
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("IWR");
  const [district, setDistrict] = useState("Pune, Maharashtra");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Mock Stakeholder Database for foster care applications
  const [applications, setApplications] = useState([
    { id: "APP-5091", primary: "Sachin Patil", spouse: "Vidya Patil", income: 840000, status: "Pending", homeStudySubmitted: true, dcpuOfficer: "Anil Deshmukh" },
    { id: "APP-1290", primary: "Ranganathan Iyer", spouse: "Meena Iyer", income: 1450000, status: "Approved", homeStudySubmitted: true, dcpuOfficer: "S. Swaminathan" },
    { id: "APP-6771", primary: "Vikram Rathore", spouse: "", income: 580000, status: "Pending", homeStudySubmitted: false, dcpuOfficer: "K. Singh" },
    { id: "APP-4421", primary: "Dipankar Da", spouse: "Rimi Da", income: 920000, status: "Rejected", homeStudySubmitted: true, dcpuOfficer: "A. Mukharjee" },
  ]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      const endpoint = isSignUp ? '/register' : '/login';
      const body = isSignUp 
        ? { name, email, password, role }
        : { email, password };

      const res = await fetch(`${import.meta.env.VITE_AUTH_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAuth(data.user, data.token);

      // Trigger the role-specific dashboard if applicable
      const userRole = data.user.role;
      if (userRole === "IWR" && onIWRLogin) onIWRLogin();
      else if (userRole === "AIFL" && onAIFLLogin) onAIFLLogin();
      else if (userRole === "MC" && onMCLogin) onMCLogin();
      else if (["CRC", "CW", "ROS"].includes(userRole) && onSystemLogin) onSystemLogin(userRole);
      
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, nextStatus: "Approved" | "Rejected" | "Pending") => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: nextStatus } : app))
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 select-none" id="stakeholder-login-modal">
      <div 
        className={`w-full max-w-3xl rounded-xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          highContrast ? "bg-stone-950 text-yellow-300 border-yellow-300" : "bg-white text-gray-800 border-gray-100"
        }`}
      >
        
        {/* Header bar */}
        <div className={`p-4 flex items-center justify-between border-b ${
          highContrast ? "border-yellow-300 bg-stone-900" : "bg-linear-to-r from-orange-400/5 via-amber-500/5 to-amber-600/5 border-gray-150"
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <span className="font-extrabold text-sm uppercase tracking-wider">
              {lang === "en" ? "Stakeholder Secure Panel" : "हितधारक सुरक्षा कक्ष"}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 transition-all text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {!isAuthenticated ? (
            
            /* 1. Login/Signup Form Screen */
            <form onSubmit={handleAuth} className="max-w-md mx-auto space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {lang === "en" ? "Official Authentication gateway" : "आधिकारिक प्रमाणीकरण प्रवेश द्वार"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Access regional child tracking systems, monitor cases on active foster houses, and approve documents.
                </p>
              </div>

              {/* Toggle Sign In / Sign Up */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${!isSignUp ? 'bg-white shadow-xs text-amber-600' : 'text-gray-500'}`}
                >
                  <LogIn className="w-4 h-4 inline-block mr-1" /> Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${isSignUp ? 'bg-white shadow-xs text-amber-600' : 'text-gray-500'}`}
                >
                  <UserPlus className="w-4 h-4 inline-block mr-1" /> Sign Up
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {errorMsg}
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">FULL NAME</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp} 
                    placeholder="e.g. Officer Raj"
                    className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="e.g. admin@abhaya.gov"
                  className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">SELECT SECURITY LEVEL / ROLE</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-stone-900 text-sm border rounded-lg"
                >
                  <option value="IWR">Investigation War Room</option>
                  <option value="AIFL">AI Forensic Lab</option>
                  <option value="MC">Mission Control</option>
                  <option value="CRC">Child Recovery Center</option>
                  <option value="CW">Community Watch</option>
                  <option value="ROS">Rakshak Operating System</option>
                </select>
              </div>

              {/* Passcode input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">SEC_ACCESS_TOKEN / CODE</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg font-mono font-bold tracking-widest text-amber-800"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all text-sm uppercase shadow-md flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Processing...' : isSignUp ? 'Register Account' : 'Verify & Enter Gateway'}</span>
              </button>
            </form>
          ) : (
            
            /* 2. Interactive Authenticated Stakeholder Dashboard */
            <div className="space-y-6 select-text">
              
              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b gap-3">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="p-2 bg-amber-500/10 text-amber-600 rounded-md">
                    <UserCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#9e27b0]">ACCESS PROFILE ID: {user?.role}-83912 ({user?.name})</h4>
                    <p className="text-gray-400 mt-0.5 font-mono">{district} ● Active Session</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse block" />
                  <span className="text-xs text-green-700 font-bold">STATE ONLINE</span>
                  <button 
                    onClick={handleLogout}
                    className="p-1 px-3 border border-red-200 hover:bg-red-50 text-red-650 rounded text-xs font-extrabold ml-3"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Active DCPU cases to approve */}
              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase mb-3 text-amber-800 tracking-wider">
                  📂 Pending Foster Parent Applications / Home Studies
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b text-gray-400 uppercase font-bold bg-gray-50 dark:bg-stone-800 text-[10px]">
                        <th className="p-3">App ID</th>
                        <th className="p-3">Primary Applicant</th>
                        <th className="p-3">Combined Income</th>
                        <th className="p-3">Home-Study (HSR) Details</th>
                        <th className="p-3">Current Flag</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr 
                          key={app.id} 
                          className="border-b hover:bg-gray-50/50 dark:hover:bg-stone-900 transition-all text-xs"
                        >
                          <td className="p-3 font-mono font-bold text-amber-800">{app.id}</td>
                          <td className="p-3">
                            <span className="font-extrabold text-gray-900 block">{app.primary}</span>
                            {app.spouse && <span className="text-[10px] text-gray-400">Spouse: {app.spouse}</span>}
                          </td>
                          <td className="p-3 font-mono text-gray-600">₹{app.income.toLocaleString()}/yr</td>
                          <td className="p-3">
                            {app.homeStudySubmitted ? (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded text-[10px] uppercase">
                                Verified HSR Ok
                              </span>
                            ) : (
                              <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded text-[10px] uppercase">
                                HSR Critical Draft
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              app.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                              app.status === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleStatusChange(app.id, "Approved")}
                              disabled={app.status === "Approved"}
                              className="px-2 py-1 bg-green-600 active:bg-green-700 hover:bg-green-700 text-white rounded text-[10px] font-bold disabled:opacity-40"
                              title="Approve adoption draft folder"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, "Rejected")}
                              disabled={app.status === "Rejected"}
                              className="px-2 py-1 bg-red-650 hover:bg-red-700 active:bg-red-800 text-white rounded text-[10px] font-bold disabled:opacity-40"
                              title="Reject application"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mock Audit logs */}
              <div className="bg-gray-50 dark:bg-stone-900 border p-4 rounded-lg">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Real-time Secure Audit Trail</span>
                </h5>
                <div className="space-y-1.5 font-mono text-[10px] text-gray-500">
                  <p>[13:09:51] SECURE TOKEN ID RE-ISSUED BY CENTRAL REGISTRY-COORDINATOR UNIT.</p>
                  <p>[12:44:11] HOME STUDY DOSSIER SUBMITTED FOR SACHIN PATIL IN PUNE DISTRICT.</p>
                  <p>[11:02:19] DISTRICT TRACKCHILD STATS EXPORTED GRAPHICALLY SUCCESSFULLY.</p>
                </div>
              </div>

            </div>

          )}
        </div>

        {/* Footer controls */}
        {!(isAuthenticated && role === "IWR") && (
          <div className={`p-4 border-t flex justify-end gap-3 ${
            highContrast ? "border-yellow-300 bg-stone-900" : "bg-gray-50 border-gray-150"
          }`}>
            <button 
              onClick={onClose}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${
                highContrast 
                  ? "border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black" 
                  : "border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {translations[lang].contactUs === "Contact Us" ? "Close Portal" : "कक्ष बंद करें"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
