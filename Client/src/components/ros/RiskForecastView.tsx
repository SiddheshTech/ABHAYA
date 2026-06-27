import React, { useState } from "react";
import { 
  TrendingUp, Calendar, AlertTriangle, ShieldCheck, HelpCircle, 
  ArrowUpRight, Users, CloudRain, Briefcase, Flame, MapPin, 
  CheckCircle, Play, Sparkles, RefreshCw
} from "lucide-react";
import { useRosStore } from "../../lib/rosStore";

interface RiskForecastViewProps {
  highContrast?: boolean;
}

export default function RiskForecastView({ highContrast }: RiskForecastViewProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<"Today" | "1 Week" | "1 Month" | "3 Months" | "6 Months">("1 Month");
  const [activeRecommendation, setActiveRecommendation] = useState<string | null>(null);

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/95 border-stone-800 text-stone-100";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/80";
  const textMain = highContrast ? "text-yellow-300" : "text-white";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  const { predictions } = useRosStore();

  const generateForecast = (period: string, baseRisk: number) => {
    const backendPred = predictions.find(p => p.forecastPeriod === period);
    return {
      weatherRisk: baseRisk + 4,
      migrationRisk: backendPred?.confidenceScore || baseRisk + 12,
      economicDistress: baseRisk + 25,
      conflictRisk: baseRisk - 2,
      expectedCases: backendPred ? Math.floor(baseRisk * 2.5) : baseRisk + 4,
      highRiskDistricts: backendPred ? 14 : Math.floor(baseRisk / 5),
      confidence: backendPred ? `${backendPred.confidenceScore}.0%` : `${80 + baseRisk / 10}%`,
      forecastText: backendPred 
        ? `Target: ${backendPred.targetState}. Expected Spike: ${backendPred.expectedSpike}. AI Confidence: ${backendPred.confidenceScore}%. Recommendations pending.` 
        : `Baseline stability projected for ${period}. Nominal variations in seasonal migration patterns observed.`
    };
  };

  // Dynamic timeline data generated from predictions
  const forecastData: Record<string, any> = {
    "Today": generateForecast("Today", 10),
    "1 Week": generateForecast("1 Week", 30),
    "1 Month": generateForecast("1 Month", 60),
    "3 Months": generateForecast("3 Months", 70),
    "6 Months": generateForecast("6 Months", 45)
  };

  const currentForecast = forecastData[selectedTimeline] || forecastData["1 Month"];

  const handleTriggerRecommendation = (rec: string) => {
    setActiveRecommendation(rec);
    setTimeout(() => {
      setActiveRecommendation(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* HUD Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-indigo-400 font-mono uppercase">
              📈 NATIONAL PREDICTION CENTER
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Trafficking Risk & Future Threat Modeler
          </h2>
        </div>
        <div className="text-right font-mono text-[10px] text-stone-500">
          <p>NEURAL NETWORK CORES: <span className="text-indigo-400 font-bold">12 Active Clusters</span></p>
          <p>PROJECTION HORIZON: <span className="text-stone-350">180 Days</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Risk factors (Demographic factors) */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[400px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Vulnerability Vectors
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Machine learning factor assessments (0-100)</p>
            </div>

            {/* Risk Factor Bars */}
            <div className="space-y-3">
              
              {/* Weather / Flood Risk */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Weather & Flood Catalyst
                  </span>
                  <span className="font-mono text-blue-400 font-bold">{currentForecast.weatherRisk}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${currentForecast.weatherRisk}%` }} />
                </div>
              </div>

              {/* Seasonal Migration Risk */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <Users className="w-3.5 h-3.5 text-emerald-400" /> Seasonal Migration Rate
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{currentForecast.migrationRisk}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${currentForecast.migrationRisk}%` }} />
                </div>
              </div>

              {/* Economic Distress index */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Economic Distress Index
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{currentForecast.economicDistress}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${currentForecast.economicDistress}%` }} />
                </div>
              </div>

              {/* Local Conflict risk */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <Flame className="w-3.5 h-3.5 text-rose-400" /> Local Conflict Vector
                  </span>
                  <span className="font-mono text-rose-400 font-bold">{currentForecast.conflictRisk}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${currentForecast.conflictRisk}%` }} />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Center Panel: Timeline Block Selector & Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[400px]`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 font-mono">
                FUTURE PROJECTION TIMELINE
              </h3>
              <p className="text-[10px] text-stone-500 uppercase mt-0.5">Toggle timeline ranges to inspect AI forecast vectors</p>
            </div>

            {/* Timeline Selection Steps */}
            <div className="flex bg-stone-950 p-1.5 rounded-xl border border-stone-850 font-mono text-[10px] items-center justify-between gap-1 my-2">
              {["Today", "1 Week", "1 Month", "3 Months", "6 Months"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTimeline(t as any)}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                    selectedTimeline === t 
                      ? "bg-white text-black" 
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* AI Core Statement block */}
            <div className="flex-1 flex flex-col justify-center p-4 bg-stone-950 rounded-xl border border-stone-900 my-2 space-y-2 relative">
              <span className="absolute top-3 right-3 text-[9px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest animate-pulse">
                PROJECTION STREAM
              </span>
              <p className="text-[11px] text-stone-400 font-mono leading-relaxed">
                {currentForecast.forecastText}
              </p>
            </div>

            {/* System Status report */}
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 bg-stone-950/50 p-2.5 rounded-lg border border-stone-900">
              <span>ACTIVE MODEL: ABHAYA-NET PREDICT v2.1</span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Projection Active
              </span>
            </div>

          </div>
        </div>

        {/* Right Panel: Output Projections & Confidence */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[400px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Prediction Metrics
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Sighting & confidence projections</p>
            </div>

            {/* Detailed metrics decks */}
            <div className="space-y-4">
              
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-xs font-mono">
                <span className="text-[9px] text-stone-500 uppercase block font-bold">EXPECTED CRITICAL CASES</span>
                <span className="text-2xl font-black text-rose-450">{currentForecast.expectedCases}</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-xs font-mono">
                <span className="text-[9px] text-stone-500 uppercase block font-bold">HIGH RISK DISTRICTS PROJECTED</span>
                <span className="text-2xl font-black text-amber-400">{currentForecast.highRiskDistricts} Districts</span>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-xs font-mono">
                <span className="text-[9px] text-stone-500 uppercase block font-bold">PREDICTIONS MODEL CONFIDENCE</span>
                <span className="text-2xl font-black text-emerald-400">{currentForecast.confidence}</span>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panel: Interactive AI Recommendations & Triage triggers */}
      <div className={`p-5 rounded-2xl border ${bgCard} shadow-xl space-y-4`}>
        <div>
          <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 font-mono">
            AI RECOMMENDED DISPATCH COUNTERMEASURES
          </h3>
          <p className="text-[10px] text-stone-500 uppercase mt-0.5">Trigger rapid state agency briefings</p>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Deploy Allied NGOs", code: "NGO_DISPATCH" },
            { label: "Increase Police Patrols", code: "PATROL_DISPATCH" },
            { label: "Issue Community Alerts", code: "COMMUNITY_ALERT" },
            { label: "Launch Awareness Campaign", code: "CAMPAIGN_LAUNCH" }
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => handleTriggerRecommendation(item.code)}
              className={`p-3.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center justify-between ${
                activeRecommendation === item.code
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-stone-950 border-stone-850 text-stone-300 hover:border-stone-700 hover:bg-stone-900/60"
              }`}
            >
              <span>{item.label}</span>
              {activeRecommendation === item.code ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-stone-500" />
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
