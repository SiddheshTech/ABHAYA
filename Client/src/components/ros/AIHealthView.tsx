import React, { useState } from "react";
import { 
  Sparkles, Brain, Cpu, Clock, CheckCircle2, AlertCircle, RefreshCw, 
  Send, Radio, TrendingUp, CpuIcon, Layers, Server, Activity
} from "lucide-react";

interface AIHealthViewProps {
  highContrast?: boolean;
}

export default function AIHealthView({ highContrast }: AIHealthViewProps) {
  const [selectedModel, setSelectedModel] = useState<string>("Identity Engine");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [classifiedResult, setClassifiedResult] = useState<any | null>(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [isRetrained, setIsRetrained] = useState(false);

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/95 border-stone-800 text-stone-100";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/80";
  const textMain = highContrast ? "text-yellow-300" : "text-white";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  // Detailed Model dataset
  const models = [
    {
      name: "Identity Engine",
      accuracy: "96.4%",
      inferenceSpeed: "180ms",
      load: "12%",
      predictions: 18412,
      failures: 2,
      retrainingStatus: "Up to date",
      description: "Facial recognition, embedding vectorization matching, and photographic matching layers."
    },
    {
      name: "Network Genome",
      accuracy: "94.2%",
      inferenceSpeed: "450ms",
      load: "34%",
      predictions: 9140,
      failures: 5,
      retrainingStatus: "Retraining Scheduled",
      description: "Sighting correlation engine mapping syndicate mutations across national railway nodes."
    },
    {
      name: "Prediction Engine",
      accuracy: "91.8%",
      inferenceSpeed: "310ms",
      load: "5%",
      predictions: 14800,
      failures: 1,
      retrainingStatus: "Up to date",
      description: "Demographic risk vector and weather-migration correlation forecasting model."
    },
    {
      name: "Cognitive Heatmaps",
      accuracy: "92.0%",
      inferenceSpeed: "220ms",
      load: "8%",
      predictions: 6120,
      failures: 0,
      retrainingStatus: "Up to date",
      description: "Live geo-density hotspots visualization mapping missing child frequencies against DCPU latency."
    },
    {
      name: "Behavioral AI",
      accuracy: "95.5%",
      inferenceSpeed: "290ms",
      load: "18%",
      predictions: 12240,
      failures: 4,
      retrainingStatus: "Up to date",
      description: "Analyzes ticketing profiles and transit behaviors to flag anomalous under-age travel vectors."
    }
  ];

  const activeModel = models.find(m => m.name === selectedModel) || models[0];

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setIsRetrained(true);
    }, 1500);
  };

  // Inference Matching Sandbox
  const handleAnalyzeDescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descriptionInput.trim()) return;

    setIsProcessing(true);
    setClassifiedResult(null);

    setTimeout(() => {
      setIsProcessing(false);
      setClassifiedResult({
        extractedAge: "7-8 years",
        clothingMatch: "Red striped shirt, dark trousers",
        sightingSeverity: "Red Alert",
        confidence: "94.2%",
        potentialMatch: "Aarav Sharma (ID: REC-9481)",
        locationSector: "Delhi-NCR Sector 3"
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* Immersive HUD Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-emerald-400 font-mono uppercase">
              ARTIFICIAL INTELLIGENCE OPERATIONS CENTER
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Abhaya Neural Pipeline Ecosystem
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-900/30">
          <Brain className="w-3.5 h-3.5 animate-pulse" />
          <span>GLOBAL MODELS RETRAINING COMPLETE: v4.2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Accuracy and Training Dashboard */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Network Architecture
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Select active pipeline core</p>
            </div>

            {/* Models Navigation */}
            <div className="space-y-2">
              {models.map((m) => (
                <div 
                  key={m.name}
                  onClick={() => setSelectedModel(m.name)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex justify-between items-center ${
                    selectedModel === m.name 
                      ? "bg-emerald-950/40 border-emerald-850 text-emerald-400" 
                      : "bg-stone-950/50 border-stone-900 hover:border-stone-800 text-stone-350"
                  }`}
                >
                  <span className="font-bold">{m.name}</span>
                  <span className="text-[10px] font-bold font-mono">{m.accuracy}</span>
                </div>
              ))}
            </div>

            {/* Retrain Action HUD */}
            <div className="pt-2 border-t border-stone-900 space-y-2">
              <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest font-mono">RETRAINING TELEMETRY</span>
              {isRetrained ? (
                <div className="text-center py-2 bg-emerald-950/30 border border-emerald-900 text-emerald-400 text-xs font-bold font-mono rounded-xl">
                  ✓ GLOBAL v4.2 MATRIX LOADED
                </div>
              ) : (
                <button
                  onClick={handleRetrain}
                  disabled={isRetraining}
                  className="w-full py-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 rounded-xl text-xs font-bold font-mono text-stone-300 transition-all flex items-center justify-center gap-2"
                >
                  {isRetraining ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>TUNING EMBEDDINGS...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>FORCE MODEL RETRAIN</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Center Panel: Model Universe HUD */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[440px] relative overflow-hidden`}>
            
            <div className="border-b border-stone-850 pb-3 flex justify-between items-start">
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                  MODEL SPECIFICATION VIEW
                </h3>
                <p className="text-[10px] text-stone-500 uppercase mt-0.5">Specifications of {activeModel.name}</p>
              </div>
              <span className="text-[9px] font-mono text-stone-500 bg-stone-950 px-2 py-1 rounded border border-stone-850 uppercase">STABILITY SCORE: 99.9%</span>
            </div>

            {/* Description & specs details */}
            <div className="my-4 space-y-4">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-900 space-y-2 text-xs">
                <span className="text-[9px] text-stone-500 uppercase font-bold tracking-widest font-mono">PIPELINE FUNCTIONAL SCOPE</span>
                <p className="text-stone-300 leading-relaxed font-mono">
                  {activeModel.description}
                </p>
              </div>

              {/* Specs parameters */}
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-900">
                  <span className="text-[9px] text-stone-500 uppercase block font-bold">Inference Speed</span>
                  <span className="text-sm font-black text-white">{activeModel.inferenceSpeed}</span>
                </div>
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-900">
                  <span className="text-[9px] text-stone-500 uppercase block font-bold">Current System Load</span>
                  <span className="text-sm font-black text-white">{activeModel.load}</span>
                </div>
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-900">
                  <span className="text-[9px] text-stone-500 uppercase block font-bold">Accuracy Score</span>
                  <span className="text-sm font-black text-emerald-400">{activeModel.accuracy}</span>
                </div>
              </div>
            </div>

            {/* Verification diagnostics */}
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex items-center justify-between text-[10px] font-mono">
              <span className="text-stone-500">OPERATIONAL PIPELINE: <span className="text-white font-bold">{activeModel.name.toUpperCase()}</span></span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> STATUS: ONLINE
              </span>
            </div>

          </div>
        </div>

        {/* Right Panel: Sighting Vector Matching sandbox */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl flex flex-col justify-between h-[440px]`}>
            
            <div>
              <div className="border-b border-stone-850 pb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-900/40">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                    Match Inference
                  </h3>
                  <p className="text-[10px] text-stone-500 uppercase">Run pipeline match vectors</p>
                </div>
              </div>

              {/* Match sandbox form */}
              <form onSubmit={handleAnalyzeDescription} className="space-y-3 mt-4">
                <textarea
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="e.g. 7 year old child in red shirt found alone near Delhi junction"
                  className="w-full p-2.5 text-xs font-mono rounded-lg border border-stone-850 bg-stone-950 text-white h-20 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-stone-600"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !descriptionInput.trim()}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isProcessing 
                      ? "bg-stone-800 text-stone-500" 
                      : "bg-emerald-600 hover:bg-emerald-700 text-white font-mono tracking-widest"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Vector Match In-Flight...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>EXECUTE MATRIX MATCH</span>
                    </>
                  )}
                </button>
              </form>

              {/* Inference reports results */}
              {classifiedResult && (
                <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-dashed border-emerald-900/50 space-y-2 text-[10px] font-mono animate-in fade-in duration-350">
                  <div className="flex justify-between items-center pb-1 border-b border-stone-900">
                    <span className="font-bold text-stone-500 uppercase">CLASSIFIED MATCH REPORT</span>
                    <span className="text-emerald-500 font-bold">SUCCESS</span>
                  </div>
                  <p className="flex justify-between"><span className="text-stone-500">Extracted Age:</span><span className="font-semibold text-white">{classifiedResult.extractedAge}</span></p>
                  <p className="flex justify-between"><span className="text-stone-500">Clothing:</span><span className="font-semibold text-white">{classifiedResult.clothingMatch}</span></p>
                  <p className="flex justify-between"><span className="text-stone-500">Confidence Score:</span><span className="font-bold text-indigo-400">{classifiedResult.confidence}</span></p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-dashed border-stone-900 text-[10px] font-mono text-stone-500 flex items-center justify-between">
              <span>MATRIX v4.2 CONFIG</span>
              <span>EPOCH 100/100</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panel: AI Performance Report */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-900/50 font-mono font-bold text-xs uppercase tracking-widest">
            AI WORKLOAD INDEX
          </span>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {activeModel.name} Active Workload Profiler
            </h4>
            <p className="text-[10px] text-stone-500 mt-0.5 font-mono">TOTAL PREDICTIONS GENERATED: <span className="text-white font-bold">{activeModel.predictions.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Real-time telemetry indicators */}
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono font-bold text-stone-400">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" /> Load: {activeModel.load}</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-purple-400 rounded-full" /> Latency: {activeModel.inferenceSpeed}</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-rose-400 rounded-full" /> Blocked Failures: {activeModel.failures}</span>
        </div>
      </div>

    </div>
  );
}
