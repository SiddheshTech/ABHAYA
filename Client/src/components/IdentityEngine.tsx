import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, Mic, Image as ImageIcon, MapPin, 
  BrainCircuit, Activity, ChevronRight, Fingerprint, 
  User, Hash, Ruler, Scale, Heart, MessageSquare, AlertCircle,
  FileAudio, FileImage, Play, CheckCircle2, ChevronDown, Video, 
  FileText, Trash2, Scissors, Sliders, Volume2, RefreshCw, Eye, Download, ShieldAlert, Database, HelpCircle
} from "lucide-react";
import { socket } from "../lib/socket";

interface IdentityEngineProps {
  highContrast?: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function IdentityEngine({ highContrast, showToast }: IdentityEngineProps) {
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100";
  const textSecondary = highContrast ? "text-gray-400" : "text-gray-500";

  // System States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(14.0);
  const [pipelineLog, setPipelineLog] = useState<string>("Standby. Waiting for forensic inputs.");
  const [wsLogs, setWsLogs] = useState<Array<{ time: string; msg: string; type: 'system' | 'ws' | 'db' }>>([
    { time: "04:48:20", msg: "Forensic terminal initialized.", type: "system" },
    { time: "04:48:21", msg: "WebSocket connected to Central DNA and Face Database.", type: "ws" }
  ]);

  // Form Parameters
  const [age, setAge] = useState("8-10 years");
  const [height, setHeight] = useState("120 cm");
  const [weight, setWeight] = useState("22 kg");
  const [features, setFeatures] = useState("Birthmark on left shoulder. Scars on right knee.");
  const [language, setLanguage] = useState("Speaks a mix of Hindi and an unidentified tribal dialect.");

  // Upload States
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ id: string; name: string; url: string; size: string; progress: number; isCropped?: boolean }>>([]);
  const [uploadedVideos, setUploadedVideos] = useState<Array<{ id: string; name: string; size: string; progress: number }>>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ id: string; name: string; type: 'FIR' | 'Medical' | 'Birth' | 'Other'; size: string; progress: number; ocrData?: any }>>([]);
  const [voiceFile, setVoiceFile] = useState<{ name: string; size: string; isCleaned: boolean; progress: number } | null>(null);

  // Voice Recorder States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const recordInterval = useRef<any>(null);

  // Active Results Tab
  const [resultsTab, setResultsTab] = useState<'profile' | 'biometrics' | 'voice' | 'database' | 'timeline'>('profile');
  const [activeOcrPreview, setActiveOcrPreview] = useState<any | null>(null);

  // Real-Time websocket logs and background job listeners
  useEffect(() => {
    socket.on("update", (data) => {
      if (data.type === "children" || data.type === "family-matches") {
        addWsLog(`Real-time database sync: ${data.type} updated.`, 'db');
      }
    });
    return () => {
      socket.off("update");
    };
  }, []);

  // Voice recording simulation
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    addWsLog("Recording audio channel initiated (NFSU High-Gain Mic)...", 'system');
    recordInterval.current = setInterval(() => {
      setRecordingSeconds(p => p + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordInterval.current);
    const mockUrl = "mock-recorded-voice.wav";
    setRecordedAudioUrl(mockUrl);
    setVoiceFile({
      name: "voice_recording_forensic.wav",
      size: "1.2 MB",
      isCleaned: false,
      progress: 100
    });
    addWsLog("Forensic vocal sample recorded successfully.", 'system');
    if (showToast) showToast("Vocal sample captured.", "success");
  };

  const addWsLog = (msg: string, type: 'system' | 'ws' | 'db' = 'system') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setWsLogs(prev => [{ time: timeStr, msg, type }, ...prev].slice(0, 50));
  };

  // Simulated audio cleaning
  const [isCleaningAudio, setIsCleaningAudio] = useState(false);
  const handleCleanAudio = () => {
    if (!voiceFile) return;
    setIsCleaningAudio(true);
    addWsLog("Running AI spectral noise-reduction filters...", 'system');
    setTimeout(() => {
      setVoiceFile(prev => prev ? { ...prev, isCleaned: true } : null);
      setIsCleaningAudio(false);
      addWsLog("Denoised audio blueprint generated. Target speech isolated.", 'system');
      if (showToast) showToast("Audio noise isolated successfully.", "success");
    }, 2000);
  };

  // Simulated Face Crop
  const [isCropping, setIsCropping] = useState<string | null>(null);
  const handleFaceCrop = (photoId: string) => {
    setIsCropping(photoId);
    addWsLog(`Initiating neural face boundary crop on ${photoId}...`, 'system');
    setTimeout(() => {
      setUploadedPhotos(prev => prev.map(p => p.id === photoId ? { ...p, isCropped: true, url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256" } : p));
      setIsCropping(null);
      addWsLog("Facial region successfully locked and optimized.", 'system');
      if (showToast) showToast("Face cropped and aligned successfully.", "success");
    }, 1500);
  };

  // Metadata Import Simulation
  const handleImportMetadata = () => {
    addWsLog("Parsing police missing-child metadata package...", 'system');
    setTimeout(() => {
      setAge("9.5 years");
      setHeight("122 cm");
      setWeight("23 kg");
      setFeatures("Birthmark on left shoulder, small scar above left eyebrow.");
      setLanguage("Speaks a blend of Sadri and standard Santhali.");
      addWsLog("Metadata successfully integrated into input parameters.", 'db');
      if (showToast) showToast("Police metadata package imported.", "success");
    }, 1000);
  };

  // Drag & Drop / Upload Simulation
  const simulateUploadProgress = (name: string, onDone: (progress: number) => void) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      onDone(current);
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as File[];
    files.forEach(file => {
      processFile(file);
    });
  };

  const processFile = (file: File) => {
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const id = `FILE-${Math.floor(1000 + Math.random() * 9000)}`;
    addWsLog(`Uploading file: ${file.name} (${sizeStr})`, 'system');

    if (file.type.startsWith('image/')) {
      const newPhoto = { id, name: file.name, url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256", size: sizeStr, progress: 0 };
      setUploadedPhotos(prev => [...prev, newPhoto]);
      simulateUploadProgress(file.name, (prog) => {
        setUploadedPhotos(prev => prev.map(p => p.id === id ? { ...p, progress: prog } : p));
        if (prog === 100) addWsLog(`Photo ${file.name} successfully encrypted.`, 'system');
      });
    } else if (file.type.startsWith('video/')) {
      const newVideo = { id, name: file.name, size: sizeStr, progress: 0 };
      setUploadedVideos(prev => [...prev, newVideo]);
      simulateUploadProgress(file.name, (prog) => {
        setUploadedVideos(prev => prev.map(v => v.id === id ? { ...v, progress: prog } : v));
        if (prog === 100) addWsLog(`Video ${file.name} successfully cached.`, 'system');
      });
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.includes('fir') || file.name.includes('report')) {
      let docType: 'FIR' | 'Medical' | 'Birth' | 'Other' = 'Other';
      let ocrData: any = {};
      if (file.name.toLowerCase().includes('fir')) {
        docType = 'FIR';
        ocrData = { firNo: "FIR-442/2026", station: "Dumka Sadar", date: "2026-06-12", reporter: "Sibu Soren (Father)", missingPerson: "Aarav Soren", description: "Age 9, dark complexion, left shoulder birthmark." };
      } else if (file.name.toLowerCase().includes('medical')) {
        docType = 'Medical';
        ocrData = { hospital: "Latehar Rural Clinic", birthDate: "2017-03-15", bloodGroup: "O+", weightAtBirth: "2.8 kg", vaccination: "BCG Completed 2018" };
      } else if (file.name.toLowerCase().includes('birth')) {
        docType = 'Birth';
        ocrData = { regNo: "REG-JH-99210", childName: "Aarav Soren", motherName: "Malati Devi", fatherName: "Sibu Soren", village: "Amrapara" };
      }

      const newDoc = { id, name: file.name, type: docType, size: sizeStr, progress: 0, ocrData };
      setUploadedDocs(prev => [...prev, newDoc]);
      simulateUploadProgress(file.name, (prog) => {
        setUploadedDocs(prev => prev.map(d => d.id === id ? { ...d, progress: prog } : d));
        if (prog === 100) addWsLog(`Document OCR indexing complete for ${file.name}.`, 'system');
      });
    } else if (file.type.startsWith('audio/') || file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
      setVoiceFile({ name: file.name, size: sizeStr, isCleaned: false, progress: 0 });
      simulateUploadProgress(file.name, (prog) => {
        setVoiceFile(prev => prev ? { ...prev, progress: prog } : null);
        if (prog === 100) addWsLog(`Voice file ${file.name} mapped to biometric processor.`, 'system');
      });
    }
  };

  const handleManualUploadClick = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'photo' ? 'image/*' : type === 'voice' ? 'audio/*' : type === 'video' ? 'video/*' : '.pdf';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        processFile(file);
      }
    };
    input.click();
  };

  const removeDoc = (id: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== id));
    if (activeOcrPreview?.id === id) setActiveOcrPreview(null);
  };

  // Pipeline Stages definitions
  const stages = [
    { name: "Photo Analysis", status: "Scanning facial markers & landmark extraction..." },
    { name: "Face Enhancement", status: "Running generative restoration and lighting compensation..." },
    { name: "Super Resolution", status: "Interpolating fine texture arrays to 4K definition..." },
    { name: "Voice Analysis", status: "Isolating audio frequencies and extracting voiceprint signature..." },
    { name: "Dialect Detection", status: "Phonetic spectrum mapping against 40 dialect models..." },
    { name: "Origin Prediction", status: "Cross-referencing regional phoneme databases..." },
    { name: "Village Clustering", status: "Analyzing 12 spatial GIS coordinates of tribal clusters..." },
    { name: "Family Matching", status: "Searching primary paternal/maternal genomic blueprints..." },
    { name: "Government Database Matching", status: "Querying Aadhaar State Aux registries..." },
    { name: "NGO Database Matching", status: "Cross-referencing TrackChild and missing portals..." },
    { name: "School Database Matching", status: "Scraping district primary education enrollment logs..." },
    { name: "Hospital Records", status: "Cross-matching birth vaccine certificates..." },
    { name: "Missing Child Database", status: "Iterative search on national integrated crime registers..." },
    { name: "Final Identity Reconstruction", status: "Generating consolidated high-probability forensic dossier..." }
  ];

  // AI Pipeline Execution State
  const [reconstructionResult, setReconstructionResult] = useState<any | null>(null);

  const startAnalysis = async () => {
    if (uploadedPhotos.length === 0 && !voiceFile) {
      if (showToast) showToast("Upload at least one biometric sample (Photo or Voice).", "error");
      return;
    }

    setIsAnalyzing(true);
    setReconstructionResult(null);
    setActiveStage(0);
    setProgressPercent(0);
    setEstimatedTime(14.0);
    addWsLog("Neural Pipeline initialized. Executing 14-stage forensic matching process.", 'system');

    // Run 14 stages step-by-step
    const totalDuration = 14000; // 14 seconds total
    const stageDuration = totalDuration / stages.length;

    for (let i = 0; i < stages.length; i++) {
      setActiveStage(i);
      setPipelineLog(stages[i].status);
      addWsLog(`Executing Pipeline Stage [${i+1}/14]: ${stages[i].name}`, 'system');
      setProgressPercent(Math.floor(((i + 1) / stages.length) * 100));
      setEstimatedTime(Number((14.0 - (i * 1.0)).toFixed(1)));
      await new Promise(resolve => setTimeout(resolve, stageDuration));
    }

    // Call back-end API to register the completed reconstruction
    try {
      addWsLog("Querying core AI and compiling reconstruction dossier...", 'system');
      const response = await fetch("/api/reconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          height,
          weight,
          features,
          language,
          files: [
            ...uploadedPhotos.map(p => p.name),
            ...uploadedVideos.map(v => v.name),
            ...uploadedDocs.map(d => d.name),
            ...(voiceFile ? [voiceFile.name] : [])
          ]
        })
      });

      const data = await response.json();
      if (data.reconstruction) {
        setReconstructionResult(data.reconstruction);
        addWsLog(`Reconstruction successfully completed. Target identified as ${data.reconstruction.reconstructedIdentity.possibleName}`, 'db');
        if (showToast) showToast(`Identity Reconstructed: ${data.reconstruction.reconstructedIdentity.possibleName}`, "success");
      }
    } catch (err) {
      console.error(err);
      addWsLog("Error resolving API results, switching to high-fidelity procedural fallback", 'system');
    } finally {
      setIsAnalyzing(false);
      setActiveStage(-1);
    }
  };

  // Handle Export Report function
  const handleExport = () => {
    if (!reconstructionResult) return;
    if (showToast) showToast("Generating official forensic dossier...", "info");
    addWsLog("Generating cryptographically signed PDF intelligence report...", "system");
    setTimeout(() => {
      if (showToast) showToast("Dossier generated and downloaded successfully.", "success");
      addWsLog("PDF Report downloaded. Cryptographic hash recorded in audit log.", "db");
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Title Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Fingerprint className="w-8 h-8 text-emerald-600" /> 
            Ghost Reconstruction Center
          </h2>
          <p className={textSecondary}>Identity Engine: Reconstruct identity for undocumented children using multimodal AI.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className={`px-5 py-2.5 rounded-full font-bold text-sm text-white shadow-md transition-all flex items-center gap-2 ${isAnalyzing ? 'bg-emerald-800 cursor-not-allowed opacity-80' : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-95'}`}
          >
            {isAnalyzing ? (
              <><Activity className="w-4 h-4 animate-spin" /> Processing AI Pipeline...</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Run Reconstruction</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Left Panel: Input Zone */}
        <div className={`col-span-4 p-5 rounded-2xl border ${bgCard} shadow-lg flex flex-col space-y-5 min-h-[700px]`}>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-800 pb-3 shrink-0">
            <h4 className="font-extrabold flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100 uppercase tracking-wider">
              <Upload className="w-4 h-4 text-emerald-500" /> Input Zone
            </h4>
            <button 
              onClick={handleImportMetadata}
              className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/25 px-2.5 py-1 rounded-full border border-emerald-500/20 transition-all uppercase"
            >
              Import Metadata
            </button>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {/* Drag & Drop Field */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-2xl transition-all duration-300 text-center flex flex-col items-center justify-center cursor-pointer ${highContrast ? "border-stone-700 hover:border-emerald-500 hover:bg-stone-800" : "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/5 bg-gray-50/50"}`}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Drag & Drop Forensic Media Here</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4">Supports Images, Videos, Audio, and PDFs</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button onClick={() => handleManualUploadClick('photo')} className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-[10px] font-bold rounded-lg hover:border-emerald-500 transition-colors">Images</button>
                <button onClick={() => handleManualUploadClick('audio')} className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-[10px] font-bold rounded-lg hover:border-emerald-500 transition-colors">Voice</button>
                <button onClick={() => handleManualUploadClick('video')} className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-[10px] font-bold rounded-lg hover:border-emerald-500 transition-colors">Video</button>
                <button onClick={() => handleManualUploadClick('pdf')} className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-[10px] font-bold rounded-lg hover:border-emerald-500 transition-colors">PDF Docs</button>
              </div>
            </div>

            {/* Voice Recorder Block */}
            <div className={`p-4 rounded-xl border ${highContrast ? "bg-stone-900/50 border-stone-800" : "bg-slate-50/50 border-slate-100"}`}>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Live Voice Recorder</label>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-red-500 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    RECORDING
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {isRecording ? (
                  <button 
                    onClick={stopRecording}
                    className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md transition-transform scale-105"
                  >
                    <Activity className="w-4 h-4 animate-pulse" />
                  </button>
                ) : (
                  <button 
                    onClick={startRecording}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-transform hover:scale-105"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
                <div className="flex-1">
                  {isRecording ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold font-mono">00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</p>
                      {/* Audio Pulse Bars */}
                      <div className="flex items-end gap-0.5 h-4">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="bg-red-500 flex-1 rounded-t-full transition-all duration-100"
                            style={{ height: `${Math.floor(Math.random() * 85) + 15}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ) : recordedAudioUrl ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Captured Recording</p>
                        <p className="text-[10px] text-gray-400">12 seconds | MP3 isolated</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-gray-400">Click mic to record child's voice</p>
                  )}
                </div>
              </div>
            </div>

            {/* List of Uploaded Biometrics & Files */}
            {(uploadedPhotos.length > 0 || voiceFile || uploadedVideos.length > 0 || uploadedDocs.length > 0) && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">Uploaded Assets</label>
                
                {/* Image List */}
                {uploadedPhotos.map(photo => (
                  <div key={photo.id} className="p-2.5 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900/80 flex items-center gap-3">
                    <img src={photo.url} alt={photo.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-stone-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-gray-800 dark:text-gray-200">{photo.name}</p>
                      <p className="text-[10px] text-gray-400">{photo.size}</p>
                      {photo.progress < 100 ? (
                        <div className="w-full bg-gray-100 dark:bg-stone-800 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${photo.progress}%` }}></div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 mt-1 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Index Completed
                        </span>
                      )}
                    </div>
                    {photo.progress === 100 && (
                      <button 
                        onClick={() => handleFaceCrop(photo.id)}
                        disabled={isCropping === photo.id}
                        className="text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 transition-colors"
                      >
                        {isCropping === photo.id ? "Analyzing..." : photo.isCropped ? "Cropped ✓" : "Crop Face"}
                      </button>
                    )}
                    <button onClick={() => setUploadedPhotos(p => p.filter(i => i.id !== photo.id))} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Voice File */}
                {voiceFile && (
                  <div className="p-2.5 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-600">
                      <FileAudio className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-gray-800 dark:text-gray-200">{voiceFile.name}</p>
                      <p className="text-[10px] text-gray-400">{voiceFile.size}</p>
                      {voiceFile.progress < 100 ? (
                        <div className="w-full bg-gray-100 dark:bg-stone-800 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${voiceFile.progress}%` }}></div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black tracking-widest text-emerald-600 mt-1 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Voice Profiled
                        </span>
                      )}
                    </div>
                    {voiceFile.progress === 100 && (
                      <button 
                        onClick={handleCleanAudio}
                        disabled={isCleaningAudio}
                        className="text-[10px] font-bold bg-purple-500/10 text-purple-600 px-2 py-1 rounded hover:bg-purple-500/20 transition-colors"
                      >
                        {isCleaningAudio ? "Cleaning..." : voiceFile.isCleaned ? "Denoised ✓" : "Clean Audio"}
                      </button>
                    )}
                    <button onClick={() => setVoiceFile(null)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Videos */}
                {uploadedVideos.map(video => (
                  <div key={video.id} className="p-2.5 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 text-emerald-600">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-gray-800 dark:text-gray-200">{video.name}</p>
                      <p className="text-[10px] text-gray-400">{video.size}</p>
                      {video.progress < 100 && (
                        <div className="w-full bg-gray-100 dark:bg-stone-800 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${video.progress}%` }}></div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setUploadedVideos(v => v.filter(i => i.id !== video.id))} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Documents & OCR */}
                {uploadedDocs.map(doc => (
                  <div key={doc.id} className="p-2.5 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0 text-orange-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-gray-800 dark:text-gray-200">{doc.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded uppercase">{doc.type}</span>
                        <p className="text-[10px] text-gray-400">{doc.size}</p>
                      </div>
                    </div>
                    {doc.progress === 100 && doc.ocrData && (
                      <button 
                        onClick={() => setActiveOcrPreview(doc)}
                        className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded hover:bg-emerald-500/20 transition-colors"
                      >
                        Preview OCR
                      </button>
                    )}
                    <button onClick={() => removeDoc(doc.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* OCR Preview Slide-Down Panel */}
            {activeOcrPreview && (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 animate-in slide-in-from-top-4 duration-300 relative">
                <button onClick={() => setActiveOcrPreview(null)} className="absolute top-2 right-2 text-xs font-bold text-gray-400 hover:text-gray-600">✕</button>
                <p className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-2">OCR Document Extracted Metadata</p>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(activeOcrPreview.ocrData).map(([key, val]: any) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                      <span className="text-gray-400 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physical Traits fields */}
            <div className="space-y-4 pt-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">Observed Traits</label>
              
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-2.5 rounded-xl border focus-within:ring-2 ring-emerald-500/20 ${highContrast ? "border-stone-800" : "border-gray-200 bg-white dark:bg-stone-900"}`}>
                  <Hash className={`w-4 h-4 ${textSecondary}`} />
                  <input type="text" placeholder="Age Estimate" value={age} onChange={e => setAge(e.target.value)} className={`flex-1 bg-transparent text-sm outline-none font-medium ${textMain}`} />
                </div>
                <div className={`flex items-center gap-3 p-2.5 rounded-xl border focus-within:ring-2 ring-emerald-500/20 ${highContrast ? "border-stone-800" : "border-gray-200 bg-white dark:bg-stone-900"}`}>
                  <Ruler className={`w-4 h-4 ${textSecondary}`} />
                  <input type="text" placeholder="Height Estimate" value={height} onChange={e => setHeight(e.target.value)} className={`flex-1 bg-transparent text-sm outline-none font-medium ${textMain}`} />
                </div>
                <div className={`flex items-center gap-3 p-2.5 rounded-xl border focus-within:ring-2 ring-emerald-500/20 ${highContrast ? "border-stone-800" : "border-gray-200 bg-white dark:bg-stone-900"}`}>
                  <Scale className={`w-4 h-4 ${textSecondary}`} />
                  <input type="text" placeholder="Weight Estimate" value={weight} onChange={e => setWeight(e.target.value)} className={`flex-1 bg-transparent text-sm outline-none font-medium ${textMain}`} />
                </div>
              </div>

              <div className="space-y-3">
                <div className={`flex items-start gap-3 p-2.5 rounded-xl border focus-within:ring-2 ring-emerald-500/20 ${highContrast ? "border-stone-800" : "border-gray-200 bg-white dark:bg-stone-900"}`}>
                  <User className={`w-4 h-4 mt-1 ${textSecondary}`} />
                  <textarea placeholder="Physical Marks / Scars" value={features} onChange={e => setFeatures(e.target.value)} className={`flex-1 bg-transparent text-sm outline-none resize-none h-16 font-medium ${textMain}`}></textarea>
                </div>
                <div className={`flex items-start gap-3 p-2.5 rounded-xl border focus-within:ring-2 ring-emerald-500/20 ${highContrast ? "border-stone-800" : "border-gray-200 bg-white dark:bg-stone-900"}`}>
                  <MessageSquare className={`w-4 h-4 mt-1 ${textSecondary}`} />
                  <textarea placeholder="Linguistic Sample Notes" value={language} onChange={e => setLanguage(e.target.value)} className={`flex-1 bg-transparent text-sm outline-none resize-none h-16 font-medium ${textMain}`}></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: AI Reconstruction Pipeline */}
        <div className={`col-span-5 p-6 rounded-2xl border flex flex-col relative overflow-hidden min-h-[700px] ${highContrast ? "bg-stone-950 border-stone-800" : "bg-slate-900 border-slate-800 shadow-inner"}`}>
          {/* Ambient Scanning Line */}
          {isAnalyzing && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/30 blur-sm animate-[bounce_4s_infinite] z-20"></div>
          )}
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="flex items-center justify-between mb-4 relative z-10 shrink-0">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-400 animate-pulse" /> AI Reconstruction Pipeline
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-black/30 px-3 py-1.5 rounded-full border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${isAnalyzing ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}></span>
              {isAnalyzing ? `Processing: ${progressPercent}%` : "Standby"}
            </div>
          </div>

          {isAnalyzing && (
            <div className="mb-4 bg-black/40 border border-emerald-500/15 rounded-xl p-3 flex justify-between items-center relative z-10 animate-pulse text-xs text-emerald-400 font-mono">
              <span>{pipelineLog}</span>
              <span className="font-extrabold text-right shrink-0">Est: {estimatedTime}s</span>
            </div>
          )}

          {/* 14 Stages scrollable list */}
          <div className="flex-1 overflow-y-auto pr-1 relative z-10 space-y-2 py-2 max-h-[380px] custom-scrollbar">
            {stages.map((stage, idx) => {
              const isPast = activeStage > idx || (activeStage === -1 && reconstructionResult);
              const isCurrent = activeStage === idx && isAnalyzing;
              const isFuture = (activeStage < idx && isAnalyzing) || (activeStage === -1 && !reconstructionResult);
              
              const opacity = isFuture ? "opacity-25" : "opacity-100";
              const bgColor = isCurrent ? "bg-emerald-500/10 border-emerald-500" : isPast ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-800/10 border-slate-800/50";
              const iconColor = isCurrent ? "text-emerald-400" : isPast ? "text-emerald-500" : "text-slate-600";
              const textColor = isCurrent ? "text-emerald-300 font-bold" : isPast ? "text-slate-100" : "text-slate-500";

              return (
                <div key={idx} className="flex flex-col items-center w-full">
                  <div className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${bgColor} ${opacity} ${isCurrent ? 'scale-[1.02] shadow-[0_0_15px_rgba(52,211,153,0.15)]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-black/40 ${iconColor} text-xs font-black font-mono`}>
                        {isPast ? "✓" : idx + 1}
                      </div>
                      <span className={`text-xs ${textColor}`}>{stage.name}</span>
                    </div>
                    {isCurrent && <Activity className="w-4 h-4 text-emerald-400 animate-spin" />}
                    {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`h-2.5 w-px transition-colors duration-300 ${isPast ? 'bg-emerald-500' : 'bg-slate-800'} relative my-0.5`}>
                      {isPast && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400/50"></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Real-time WebSockets & Background logs ticker */}
          <div className="mt-4 border-t border-slate-800 pt-4 flex-1 flex flex-col min-h-[160px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Central Forensics Hub Logs</span>
            <div className="bg-black/60 rounded-xl p-3 font-mono text-[10px] flex-1 overflow-y-auto space-y-1.5 border border-slate-800/80 custom-scrollbar h-[120px]">
              {wsLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={`font-extrabold shrink-0 ${log.type === 'ws' ? 'text-blue-400' : log.type === 'db' ? 'text-purple-400' : 'text-emerald-500'}`}>
                    {log.type === 'ws' ? '[WS_CONN]' : log.type === 'db' ? '[DB_ENG]' : '[SYS]'}
                  </span>
                  <span className="text-slate-300 flex-1">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: AI Results */}
        <div className={`col-span-3 p-5 rounded-2xl border ${bgCard} shadow-lg flex flex-col min-h-[700px]`}>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-800 pb-3 mb-4 shrink-0">
            <h4 className="font-extrabold flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-blue-500" /> AI Results
            </h4>
            {reconstructionResult && (
              <button 
                onClick={handleExport}
                className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
                title="Export report"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>

          {reconstructionResult ? (
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-100 dark:border-stone-800 pb-1 shrink-0">
                {(['profile', 'biometrics', 'voice', 'database', 'timeline'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setResultsTab(tab)}
                    className={`flex-1 text-[9px] font-black tracking-widest uppercase pb-1.5 border-b-2 text-center capitalize transition-colors ${resultsTab === tab ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content area scrollable */}
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-4">
                
                {/* Profile Tab */}
                {resultsTab === 'profile' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="text-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="relative inline-block mb-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reconstructionResult.reconstructedIdentity.possibleName}`} 
                          alt="AI Match" 
                          className="w-16 h-16 rounded-full mx-auto border-2 border-emerald-500 shadow-md bg-white" 
                        />
                        <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">
                          {reconstructionResult.reconstructedIdentity.overallConfidence}% Match
                        </span>
                      </div>
                      <h5 className="text-lg font-black text-gray-800 dark:text-gray-100">{reconstructionResult.reconstructedIdentity.possibleName}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-extrabold">{reconstructionResult.reconstructedIdentity.region}</p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1.5">
                        <span className="text-gray-400">Predicted Age</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.biometricAnalysis.detectedAge}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1.5">
                        <span className="text-gray-400">Est. Origin</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.reconstructedIdentity.district}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1.5">
                        <span className="text-gray-400">Target Village</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.reconstructedIdentity.village}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1.5">
                        <span className="text-gray-400">Isolated Dialect</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.reconstructedIdentity.language}</span>
                      </div>
                    </div>

                    {/* Similarity Gauges */}
                    <div className="space-y-2.5 pt-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Core Similiarity Indexes</label>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-gray-500">Photo Similarity</span>
                            <span className="text-emerald-500 font-extrabold">{reconstructionResult.reconstructedIdentity.similarities.photo}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${reconstructionResult.reconstructedIdentity.similarities.photo}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-gray-500">Voice Matching</span>
                            <span className="text-blue-500 font-extrabold">{reconstructionResult.reconstructedIdentity.similarities.voice}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${reconstructionResult.reconstructedIdentity.similarities.voice}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-gray-500">DNA Probability</span>
                            <span className="text-purple-500 font-extrabold">{reconstructionResult.reconstructedIdentity.similarities.dna}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${reconstructionResult.reconstructedIdentity.similarities.dna}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-gray-500">Facial Geometry</span>
                            <span className="text-amber-500 font-extrabold">{reconstructionResult.reconstructedIdentity.similarities.facial}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${reconstructionResult.reconstructedIdentity.similarities.facial}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Biometrics Tab */}
                {resultsTab === 'biometrics' && (
                  <div className="space-y-3.5 animate-in fade-in duration-300">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Gender Match</span>
                        <span className="font-extrabold">{reconstructionResult.biometricAnalysis.gender} ({reconstructionResult.biometricAnalysis.genderConfidence}% Conf)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Height Estimate</span>
                        <span className="font-extrabold">{reconstructionResult.biometricAnalysis.estimatedHeight}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Weight Estimate</span>
                        <span className="font-extrabold">{reconstructionResult.biometricAnalysis.estimatedWeight}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Skin Tone</span>
                        <span className="font-extrabold">{reconstructionResult.biometricAnalysis.skinTone}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Eye Color</span>
                        <span className="font-extrabold">{reconstructionResult.biometricAnalysis.eyeColor}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Hair Quality</span>
                        <span className="font-extrabold">{reconstructionResult.biometricAnalysis.hairTexture} ({reconstructionResult.biometricAnalysis.hairColor})</span>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-800 space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Facial Architecture</p>
                      <p className="text-xs text-slate-300">{reconstructionResult.biometricAnalysis.facialFeatures}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-gray-500 uppercase block">Medical Indicators</span>
                      <div className="flex flex-wrap gap-1">
                        {reconstructionResult.biometricAnalysis.medicalIndicators.map((indicator: string, idx: number) => (
                          <span key={idx} className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Voice Tab */}
                {resultsTab === 'voice' && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Acoustic Accent</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.voiceAnalysis.accentDetected}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Dialect Recognized</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.voiceAnalysis.dialectRecognized}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Denoising Level</span>
                        <span className="font-extrabold text-emerald-500">{reconstructionResult.voiceAnalysis.noiseReductionPercent}% clean</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Voice Age Est.</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.voiceAnalysis.ageEstimatedByVoice}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Voice Gender Est.</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.voiceAnalysis.genderEstimatedByVoice}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-stone-800 pb-1">
                        <span className="text-gray-400">Vocal Tone</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-200">{reconstructionResult.voiceAnalysis.emotionDetected}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-800 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase">Voiceprint Signature</p>
                        <p className="text-xs font-mono font-bold text-slate-300 mt-0.5">{reconstructionResult.voiceAnalysis.voiceprintSignature}</p>
                      </div>
                      <Volume2 className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs">
                      <p className="font-extrabold text-blue-600 dark:text-blue-400 mb-1">Speech Alignment Match</p>
                      <p className="text-gray-500 leading-relaxed">{reconstructionResult.voiceAnalysis.speechPatternMatched}</p>
                    </div>
                  </div>
                )}

                {/* Database matches tab */}
                {resultsTab === 'database' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Likely Parents & Kin</label>
                      {reconstructionResult.reconstructedIdentity.likelyParents.map((parent: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-stone-900 border border-slate-100 dark:border-stone-800/80 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold">{parent.name}</p>
                            <p className="text-[10px] text-gray-400">{parent.relation}</p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {parent.confidence}% match
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Primary Registries Hits</label>
                      
                      {reconstructionResult.reconstructedIdentity.schoolMatches.map((sch: any, i: number) => (
                        <div key={i} className="p-2 border border-dashed border-gray-200 dark:border-stone-800 rounded-xl text-xs flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[9px] font-extrabold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase">Education</span>
                            <p className="font-bold mt-1">{sch.schoolName}</p>
                            <p className="text-[10px] text-gray-400">Class: {sch.grade} | Location: {sch.location}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-blue-500">{sch.matchScore}%</span>
                        </div>
                      ))}

                      {reconstructionResult.reconstructedIdentity.medicalMatches.map((med: any, i: number) => (
                        <div key={i} className="p-2 border border-dashed border-gray-200 dark:border-stone-800 rounded-xl text-xs flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[9px] font-extrabold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase">Clinical</span>
                            <p className="font-bold mt-1">{med.condition}</p>
                            <p className="text-[10px] text-gray-400">{med.hospitalName} ({med.recordDate})</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-orange-500">{med.matchScore}%</span>
                        </div>
                      ))}

                      {reconstructionResult.reconstructedIdentity.governmentMatches.map((gov: any, i: number) => (
                        <div key={i} className="p-2 border border-dashed border-gray-200 dark:border-stone-800 rounded-xl text-xs flex justify-between items-start gap-3">
                          <div>
                            <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Aadhaar Auxiliary</span>
                            <p className="font-bold mt-1">{gov.databaseName}</p>
                            <p className="text-[10px] text-gray-400">ID: {gov.recordId} | {gov.status}</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-500">{gov.matchScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Tab */}
                {resultsTab === 'timeline' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">Forensic Activity Timeline</label>
                    <div className="relative border-l border-gray-200 dark:border-stone-800 pl-4 space-y-5 ml-1">
                      {reconstructionResult.reconstructedIdentity.timeline.map((event: any, i: number) => (
                        <div key={i} className="relative text-xs">
                          <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900 ring-4 ring-emerald-500/15"></span>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{event.date}</span>
                          <p className="font-bold text-gray-800 dark:text-gray-100 mt-0.5">{event.event}</p>
                          <p className="text-[10px] text-gray-400">{event.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-stone-800 flex gap-2 shrink-0">
                <button 
                  onClick={handleExport}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-100 dark:border-stone-800 rounded-2xl bg-gray-50/50 dark:bg-stone-950/20">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-stone-900 flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Dossier Awaiting Reconstruction</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                Provide biometric parameters or documents in the Input Zone, then click <strong className="text-emerald-600">Run Reconstruction</strong> to execute the 14-stage NFSU AI Pipeline.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel: Explainable AI */}
      <div className={`p-6 rounded-2xl border ${bgCard} shadow-lg relative overflow-hidden transition-all duration-1000 ${reconstructionResult ? "opacity-100 translate-y-0" : "opacity-40 blur-xs pointer-events-none"}`}>
        <div className="absolute right-0 bottom-0 opacity-5">
          <BrainCircuit className="w-64 h-64 -mr-10 -mb-10 text-emerald-500" />
        </div>
        
        <h4 className="font-extrabold flex items-center gap-2 mb-6 relative z-10 text-sm uppercase tracking-wider text-gray-800 dark:text-gray-200">
          <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" /> Explainable AI Reasoning (XAI)
        </h4>

        <div className="grid grid-cols-3 gap-6 relative z-10">
          <div className={`p-4.5 rounded-2xl border ${highContrast ? "border-stone-800 bg-stone-900/80" : "border-amber-100 bg-amber-50/40"} flex gap-4`}>
             <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
             </div>
             <div>
               <h5 className="text-sm font-extrabold text-amber-800 dark:text-amber-300 mb-1">Acoustic & Dialect Phonemes</h5>
               <p className={`text-xs ${textSecondary} leading-relaxed`}>
                 {reconstructionResult?.reconstructedIdentity?.explainableAI?.acousticPhonemes || "Voice matches southern Jharkhand tribal clusters. Linguistic syntax showcases localized Dumka influences."}
               </p>
             </div>
          </div>

          <div className={`p-4.5 rounded-2xl border ${highContrast ? "border-stone-800 bg-stone-900/80" : "border-blue-100 bg-blue-50/40"} flex gap-4`}>
             <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <Heart className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
             </div>
             <div>
               <h5 className="text-sm font-extrabold text-blue-800 dark:text-blue-300 mb-1">Facial Architecture & Progression</h5>
               <p className={`text-xs ${textSecondary} leading-relaxed`}>
                 {reconstructionResult?.reconstructedIdentity?.explainableAI?.facialStructure || "Craniofacial coordinates match family database overlays. Ocular and nasal width index provides 95.8% match."}
               </p>
             </div>
          </div>

          <div className={`p-4.5 rounded-2xl border ${highContrast ? "border-stone-800 bg-stone-900/80" : "border-purple-100 bg-purple-50/40"} flex gap-4`}>
             <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                <FileAudio className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
             </div>
             <div>
               <h5 className="text-sm font-extrabold text-purple-800 dark:text-purple-300 mb-1">Geographic & Socio-Economic Correlation</h5>
               <p className={`text-xs ${textSecondary} leading-relaxed`}>
                 {reconstructionResult?.reconstructedIdentity?.explainableAI?.geographicSocioEconomic || "Coordinates match high-migration flood zones in the Latehar district corridor, matching current displacement."}
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
