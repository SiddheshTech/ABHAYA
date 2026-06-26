import React, { useState } from "react";
import { Upload, Eye, Camera, Send, CheckCircle2, MapPin, Calendar, Clock, AlertCircle, RefreshCw } from "lucide-react";

interface ReportSightingViewProps {
  highContrast?: boolean;
}

export default function ReportSightingView({ highContrast }: ReportSightingViewProps) {
  const [sightingLocation, setSightingLocation] = useState("");
  const [sightingDate, setSightingDate] = useState("");
  const [sightingTime, setSightingTime] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [sightingDetails, setSightingDetails] = useState("");
  const [reporterName, setReporterName] = useState("Amit Patel");
  const [reporterContact, setReporterContact] = useState("+91 91234 56789");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderCol = highContrast ? "border-stone-800" : "border-gray-100";
  const bgCard = highContrast ? "bg-stone-900" : "bg-white";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFiles = Array.from(e.dataTransfer.files) as File[];
    if (uploadedFiles.length > 0) {
      const added = uploadedFiles.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }));
      setFiles(prev => [...prev, ...added]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files) as File[];
      const added = uploadedFiles.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }));
      setFiles(prev => [...prev, ...added]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sightingLocation || !sightingDetails) return;

    setIsSubmitting(true);
    setMatchResult(null);

    // Simulate database comparison & face matching
    setTimeout(() => {
      setIsSubmitting(false);
      setMatchResult({
        reportId: "SR-" + Math.floor(Math.random() * 9000 + 1000),
        matchFound: true,
        matchedChild: "Aarav Sharma (MA-9102)",
        confidence: "94.8%",
        status: "Routed to Patna Central Rescue Team & CWC",
        timestamp: new Date().toLocaleString(),
      });
    }, 2500);
  };

  const handleResetForm = () => {
    setSightingLocation("");
    setSightingDate("");
    setSightingTime("");
    setSelectedChildId("");
    setSightingDetails("");
    setFiles([]);
    setMatchResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Intro Banner */}
      <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm`}>
        <h2 className={`text-xl font-extrabold ${textMain} flex items-center gap-2`}>
          <Camera className="w-5 h-5 text-[#115e3b] dark:text-yellow-300" /> Report Volunteer Sighting
        </h2>
        <p className={`text-xs ${textMuted} mt-1`}>
          Upload a clear photo of the suspected child. Our real-time neural network will immediately scan missing alerts to compute facial similarity indexes.
        </p>
      </div>

      {!matchResult ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Sighting Details Form */}
          <div className={`md:col-span-2 p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
            
            <h3 className={`font-bold text-sm border-b pb-2 ${borderCol} ${textMain}`}>Report Particulars</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Sighting Coordinates / Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className={`w-4 h-4 absolute left-3 top-2.5 ${textMuted}`} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Platform 4, Patna Junction"
                    value={sightingLocation}
                    onChange={(e) => setSightingLocation(e.target.value)}
                    className={`pl-9 pr-4 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast 
                        ? "bg-stone-950 border-stone-800 text-yellow-300" 
                        : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Reference Alert (If Known)
                </label>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs w-full focus:outline-none ${
                    highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-stone-50 border-gray-100 text-gray-700"
                  }`}
                >
                  <option value="">-- Select Child Alert --</option>
                  <option value="MA-9102">Aarav Sharma (MA-9102)</option>
                  <option value="MA-9103">Ananya Patel (MA-9103)</option>
                  <option value="MA-9104">Kabir Singh (MA-9104)</option>
                  <option value="MA-9105">Priya Das (MA-9105)</option>
                  <option value="MA-9106">Rohit Verma (MA-9106)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Sighting Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className={`w-4 h-4 absolute left-3 top-2.5 ${textMuted}`} />
                  <input
                    type="date"
                    required
                    value={sightingDate}
                    onChange={(e) => setSightingDate(e.target.value)}
                    className={`pl-9 pr-4 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast 
                        ? "bg-stone-950 border-stone-800 text-yellow-300" 
                        : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Approx. Sighting Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className={`w-4 h-4 absolute left-3 top-2.5 ${textMuted}`} />
                  <input
                    type="time"
                    required
                    value={sightingTime}
                    onChange={(e) => setSightingTime(e.target.value)}
                    className={`pl-9 pr-4 py-1.5 rounded-xl border text-xs focus:outline-none w-full ${
                      highContrast 
                        ? "bg-stone-950 border-stone-800 text-yellow-300" 
                        : "bg-stone-50 border-gray-100 text-gray-800"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                Visual Description / Sighting Context <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                placeholder="What is the child wearing? Was the child accompanied by an adult? Note details like behavioral cues, approximate age discrepancy, etc."
                value={sightingDetails}
                onChange={(e) => setSightingDetails(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 ${
                  highContrast 
                    ? "bg-stone-950 border-stone-800 text-yellow-300 placeholder-stone-600" 
                    : "bg-stone-50 border-gray-100 text-gray-800 placeholder-gray-400"
                }`}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Reporter Name (Default Assigned)
                </label>
                <input
                  type="text"
                  disabled
                  value={reporterName}
                  className={`px-3 py-1.5 rounded-xl border text-xs w-full bg-stone-100 dark:bg-stone-900 text-stone-400 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Secure SIP VoIP Connection
                </label>
                <input
                  type="text"
                  disabled
                  value={reporterContact}
                  className={`px-3 py-1.5 rounded-xl border text-xs w-full bg-stone-100 dark:bg-stone-900 text-stone-400 cursor-not-allowed`}
                />
              </div>
            </div>

          </div>

          {/* Column 3: Photo Upload and Submission Button */}
          <div className="space-y-6">
            
            {/* Image Dropzone */}
            <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-4`}>
              <h3 className={`font-bold text-sm border-b pb-2 ${borderCol} ${textMain}`}>Facial Scan Import</h3>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? "border-emerald-500 bg-emerald-50/10" 
                    : highContrast 
                      ? "border-stone-800 hover:border-yellow-300" 
                      : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="file"
                  id="sighting-file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                <label htmlFor="sighting-file" className="cursor-pointer space-y-2 block">
                  <Upload className={`w-8 h-8 mx-auto ${textMuted}`} />
                  <p className="text-xs font-bold text-[#115e3b] dark:text-yellow-300">
                    Upload Sighting Photo
                  </p>
                  <p className="text-[10px] text-stone-400">
                    Drag and drop file, or browse
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-900/50 text-xs">
                      <span className={`font-medium ${textMain} truncate max-w-[120px]`}>{file.name}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                        <span>{file.size}</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-red-500 font-bold hover:underline">
                          DEL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Panel */}
            <div className={`p-5 rounded-2xl border ${borderCol} ${bgCard} shadow-sm space-y-3`}>
              {isSubmitting ? (
                <div className="text-center py-4 space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-600 dark:text-yellow-300 animate-spin mx-auto" />
                  <p className={`text-xs font-bold ${textMain}`}>Running Neural AI comparison...</p>
                  <p className="text-[10px] text-stone-400">Evaluating bio-identifiers against Central Database.</p>
                </div>
              ) : (
                <>
                  <p className={`text-[10px] ${textMuted} leading-normal`}>
                    By submitting, this sighting is immediately shared with Rakshak Operations Command and local verified shelters in the specified district.
                  </p>
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] ${
                      highContrast 
                        ? "bg-stone-800 border border-yellow-300 text-yellow-300" 
                        : "bg-[#115e3b] text-white hover:bg-[#0d4a2e]"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Sighting
                  </button>
                </>
              )}
            </div>

          </div>

        </form>
      ) : (
        /* Match Result Screen */
        <div className={`p-6 rounded-2xl border ${borderCol} ${bgCard} shadow-md space-y-6 max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-300`}>
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className={`text-xl font-extrabold ${textMain}`}>Sighting Report Catalogued!</h3>
            <p className="text-xs text-stone-400 font-mono">Reference Code: {matchResult.reportId}</p>
          </div>

          {/* AI Face Recognition Flag */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left space-y-2 max-w-md mx-auto">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide">High Confidence Neural Match Found</h4>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-300 leading-relaxed">
              We detected a <strong className="text-amber-600 dark:text-amber-400 font-bold">{matchResult.confidence} facial similarity match</strong> with missing child alert <strong className="font-semibold text-stone-800 dark:text-white">{matchResult.matchedChild}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto text-xs border-y py-4 my-2 border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Logged Sighting</span>
              <p className={`font-semibold ${textMain}`}>{sightingLocation}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Action Taken</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">{matchResult.status}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleResetForm}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02] ${
                highContrast 
                  ? "bg-stone-800 border border-yellow-300 text-yellow-300" 
                  : "bg-[#115e3b] text-white hover:bg-[#0d4a2e]"
              }`}
            >
              Log Another Sighting
            </button>
            <button
              onClick={handleResetForm}
              className={`px-5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                highContrast ? "border-stone-800 text-yellow-300" : "border-gray-200 text-stone-600 hover:bg-gray-50"
              }`}
            >
              Back to Watch Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
