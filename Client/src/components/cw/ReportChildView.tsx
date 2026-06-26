import React, { useState } from "react";
import { Upload, HelpCircle, FileText, Send, CheckCircle2, UserPlus, Info, ShieldAlert, Sparkles } from "lucide-react";

interface ReportChildViewProps {
  highContrast?: boolean;
}

export default function ReportChildView({ highContrast }: ReportChildViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [disappearedDate, setDisappearedDate] = useState("");
  const [height, setHeight] = useState("");
  const [clothing, setClothing] = useState("");
  const [scars, setScars] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [emergencyAlert, setEmergencyAlert] = useState(true);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredResult, setRegisteredResult] = useState<any>(null);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files) as File[];
      const added = uploadedFiles.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }));
      setFiles(prev => [...prev, ...added]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !age || !lastSeen || !disappearedDate) return;

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      
      // Compute priority category
      const parsedAge = parseInt(age);
      let calculatedPriority = "High";
      if (parsedAge < 10 || emergencyAlert) {
        calculatedPriority = "Critical";
      }

      setRegisteredResult({
        alertId: "MA-" + Math.floor(Math.random() * 9000 + 1000),
        childName: `${firstName} ${lastName}`,
        age: parsedAge,
        priority: calculatedPriority,
        dispatchStatus: "Distributed to 4 Regional Watch Teams & 15 Railway Stations",
        timestamp: new Date().toLocaleDateString(),
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
        <h2 className={`text-xl font-extrabold ${textMain} flex items-center gap-2`}>
          <UserPlus className="w-5 h-5 text-[#115e3b] dark:text-yellow-300" /> Register New Missing Child
        </h2>
        <p className={`text-xs ${textMuted} mt-1`}>
          Initialize a secure state-wide missing child alert folder. This transmits instant bio-data files to localized police databases and NGO watch channels.
        </p>
      </div>

      {!registeredResult ? (
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Form Fields */}
          <div className={`md:col-span-2 p-6 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-6`}>
            
            {/* Step 1: Child Demographics */}
            <div className="space-y-4">
              <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-1.5 ${borderCol} ${textMain}`}>
                <Info className="w-4 h-4 text-emerald-600 dark:text-yellow-300" /> Demographics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kumar"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={18}
                    placeholder="e.g. 7"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs w-full focus:outline-none ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-700"
                    }`}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Disappearance Incident */}
            <div className="space-y-4">
              <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-1.5 ${borderCol} ${textMain}`}>
                <ShieldAlert className="w-4 h-4 text-red-500" /> Disappearance Event
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Disappearance Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Market Square, Gwalior"
                    value={lastSeen}
                    onChange={(e) => setLastSeen(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Disappearance Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={disappearedDate}
                    onChange={(e) => setDisappearedDate(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Physical Identifiers */}
            <div className="space-y-4">
              <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-1.5 ${borderCol} ${textMain}`}>
                <Sparkles className="w-4 h-4 text-blue-500" /> Physical Identifiers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Approx. Height (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Distinctive Marks (Scars, Birthmarks)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scar near left eye brow"
                    value={scars}
                    onChange={(e) => setScars(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Clothing when last seen
                </label>
                <input
                  type="text"
                  placeholder="e.g. School uniform white shirt, blue trousers"
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                    highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* Step 4: Family Details */}
            <div className="space-y-4">
              <h3 className={`font-bold text-sm border-b pb-2 ${borderCol} ${textMain}`}>Guardian Contact</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Satish Kumar"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    Guardian Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 91111 22222"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: File and Submit Action */}
          <div className="space-y-6">
            
            {/* File upload */}
            <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
              <h3 className={`font-bold text-sm border-b pb-2 ${borderCol} ${textMain}`}>Identification Photo</h3>
              
              <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${highContrast ? "border-stone-800 hover:border-yellow-300" : "border-gray-200 hover:border-gray-300"}`}>
                <input
                  type="file"
                  id="child-photo"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <label htmlFor="child-photo" className="cursor-pointer space-y-2 block">
                  <Upload className={`w-8 h-8 mx-auto ${textMuted}`} />
                  <p className="text-xs font-bold text-[#115e3b] dark:text-yellow-300">
                    Upload Profile Photo
                  </p>
                  <p className="text-[10px] text-stone-400">
                    Standard high-res jpg/png
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900/50 text-xs flex justify-between items-center">
                  <span className={`font-medium ${textMain} truncate max-w-[120px]`}>{files[0].name}</span>
                  <button type="button" onClick={() => setFiles([])} className="text-red-500 font-bold hover:underline text-[10px]">
                    REMOVE
                  </button>
                </div>
              )}
            </div>

            {/* Flag alert triggers */}
            <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
              <h3 className={`font-bold text-sm border-b pb-2 ${borderCol} ${textMain}`}>Alert Options</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className={`text-xs font-bold ${textMain}`}>Immediate Amber Alert</p>
                  <p className="text-[10px] text-stone-400">Dispatch live SMS/Mails to regional circles.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyAlert}
                  onChange={(e) => setEmergencyAlert(e.target.checked)}
                  className="w-4 h-4 text-[#115e3b] rounded focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submission Actions */}
            <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
              {isRegistering ? (
                <div className="text-center py-2 space-y-3">
                  <span className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                  <p className="text-xs text-stone-500 font-bold">Generating secure folders...</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] ${
                    highContrast 
                      ? "bg-stone-800 border border-yellow-300 text-yellow-300" 
                      : "bg-[#115e3b] text-white hover:bg-[#0d4a2e]"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Initialize Alert
                </button>
              )}
            </div>

          </div>

        </form>
      ) : (
        /* SUCCESS PAGE */
        <div className={`p-6 rounded-2xl border ${borderCol} ${bgCard} shadow-md space-y-6 max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-300`}>
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className={`text-xl font-extrabold ${textMain}`}>Folder Successfully Created!</h3>
            <p className="text-xs text-stone-400 font-mono">Database Registry ID: {registeredResult.alertId}</p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-left space-y-3 max-w-md mx-auto text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/50 dark:border-stone-800">
              <strong className={`font-semibold ${textMain}`}>Registered Profile:</strong>
              <span className={`font-bold ${textMain}`}>{registeredResult.childName} (Age {registeredResult.age})</span>
            </div>
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/50 dark:border-stone-800">
              <strong className={`font-semibold ${textMain}`}>System Priority Index:</strong>
              <span className={`font-extrabold ${registeredResult.priority === "Critical" ? "text-red-500" : "text-amber-500"}`}>{registeredResult.priority} Alert</span>
            </div>
            <div className="flex flex-col gap-1">
              <strong className={`font-semibold ${textMain}`}>Regional Dispatch status:</strong>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">{registeredResult.dispatchStatus}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRegisteredResult(null)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02] ${
                highContrast 
                  ? "bg-stone-800 border border-yellow-300 text-yellow-300" 
                  : "bg-[#115e3b] text-white hover:bg-[#0d4a2e]"
              }`}
            >
              Report Another Child
            </button>
            <button
              onClick={() => setRegisteredResult(null)}
              className={`px-5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                highContrast ? "border-stone-800 text-yellow-300" : "border-gray-200 text-stone-600 hover:bg-gray-50"
              }`}
            >
              Back to Operations
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
