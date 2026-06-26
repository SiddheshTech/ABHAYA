import React, { useState } from "react";
import {
  Network,
  Fingerprint,
  Mic,
  MapPin,
  CheckCircle2,
  Shield,
  Search,
  Sparkles,
  Activity,
  X,
  User,
  Heart,
  FileText,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToastStore } from "../../lib/store";
import { useCRCStore, FamilyMatchInfo } from "../../lib/crcStore";

interface FamilyMatchingViewProps {
  highContrast?: boolean;
  setActivePage?: (page: string) => void;
}

interface FamilyMemberNode {
  id: string;
  name: string;
  relationship: string;
  confidenceScore: number;
  biometricMatch: number;
  voiceMatch: number;
  languageMatch: number;
  regionalSimilarity: number;
  villageCorrelation: number;
  behavioralIndicators: number;
  historicalRecords: number;
  documentMatch: number;
  communityVerification: number;
  aiConfidence: number;
  photoUrl: string;
  reasoning: string;
  location: string;
}

export default function FamilyMatchingView({
  highContrast,
  setActivePage,
}: FamilyMatchingViewProps) {
  const { addToast } = useToastStore();
  const { matchesList, updateFamilyMatchStatus } = useCRCStore();

  const mainMatch = matchesList[0] || {
    id: "match-2042",
    childId: "RC-2042",
    matchName: "Rajesh Kumar",
    relationship: "Grandfather",
    confidenceScore: 92,
    biometricMatch: 88,
    voiceMatch: 95,
    status: "Pending Verification",
    location: "Pune, Maharashtra"
  };

  // State to track which family node is currently selected
  const [selectedNodeId, setSelectedNodeId] = useState<string>("grandfather");

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-100";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  // Highly-structured potential family nodes mapping all 10 requested metrics
  const potentialFamilyNodes: FamilyMemberNode[] = [
    {
      id: "grandfather",
      name: mainMatch.matchName,
      relationship: "Grandfather",
      confidenceScore: mainMatch.confidenceScore,
      biometricMatch: mainMatch.biometricMatch,
      voiceMatch: mainMatch.voiceMatch,
      languageMatch: 94,
      regionalSimilarity: 90,
      villageCorrelation: 95,
      behavioralIndicators: 88,
      historicalRecords: 92,
      documentMatch: 85,
      communityVerification: 96,
      aiConfidence: 94,
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=grandpa",
      location: mainMatch.location,
      reasoning: "Excellent facial structural compatibility in primary jawline bone matrices. Direct match identified from missing child alert #402 filed in Pune local station in September 2023. Additionally, local Panchayat council members from Saswad village have verified the grandfather's physical descriptions of his grandson, aligning perfectly with standard developmental benchmarks."
    },
    {
      id: "uncle",
      name: "Suresh Kumar",
      relationship: "Paternal Uncle",
      confidenceScore: 78,
      biometricMatch: 72,
      voiceMatch: 80,
      languageMatch: 88,
      regionalSimilarity: 85,
      villageCorrelation: 72,
      behavioralIndicators: 70,
      historicalRecords: 80,
      documentMatch: 75,
      communityVerification: 80,
      aiConfidence: 78,
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=uncle",
      location: "Pune Rural, Maharashtra",
      reasoning: "DNA genetic markers align at 78% which correlates highly with immediate secondary kinship. Suresh lives in the neighboring block and owns registered farmland verified via digital land registry. Expresses deep eagerness to cooperate with child welfare teams."
    },
    {
      id: "mother",
      name: "Devi Bai (Deceased/Untraceable)",
      relationship: "Biological Mother",
      confidenceScore: 98,
      biometricMatch: 96,
      voiceMatch: 94,
      languageMatch: 98,
      regionalSimilarity: 98,
      villageCorrelation: 99,
      behavioralIndicators: 95,
      historicalRecords: 98,
      documentMatch: 92,
      communityVerification: 99,
      aiConfidence: 98,
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mother",
      location: "Deceased (2021)",
      reasoning: "DNA matching confirms 98.4% maternal relationship with zero room for biometric ambiguity. Regrettably, civic records show she passed away in 2021, which precipitated the child's wandering and accidental loss. This makes the grandfather the legal primary next-of-kin."
    },
    {
      id: "aunt",
      name: "Kiran Deshmukh",
      relationship: "Maternal Aunt",
      confidenceScore: 45,
      biometricMatch: 40,
      voiceMatch: 55,
      languageMatch: 70,
      regionalSimilarity: 65,
      villageCorrelation: 40,
      behavioralIndicators: 50,
      historicalRecords: 30,
      documentMatch: 60,
      communityVerification: 50,
      aiConfidence: 48,
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=aunt",
      location: "Satara, Maharashtra",
      reasoning: "Moderate genetic similarity indicating maternal aunt connection. Regional similarity is moderate, but her residential district of Satara does not match the child's primary spoken colloquialisms. Retained as secondary support system contact."
    }
  ];

  const selectedNode = potentialFamilyNodes.find(n => n.id === selectedNodeId) || potentialFamilyNodes[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Selected Node Biometric & Match Metrics */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-5 rounded-2xl shadow-xs border ${bgCard} space-y-4`}>
            <div className="flex justify-between items-center mb-1">
              <h3 className={`font-black text-sm ${textMain} tracking-tight`}>
                Verification Metrics
              </h3>
              <span className="text-[9px] bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 px-2 py-0.5 rounded font-black uppercase">
                Active Node
              </span>
            </div>

            <div className="text-center pb-3 border-b border-gray-50 dark:border-stone-800/50 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border-2 border-[#115e3b] dark:border-yellow-300 mb-2">
                <img src={selectedNode.photoUrl} alt={selectedNode.name} className="w-full h-full object-cover" />
              </div>
              <h4 className={`text-sm font-black ${textMain}`}>{selectedNode.name}</h4>
              <span className="text-[10px] text-gray-400 font-bold">{selectedNode.relationship}</span>
            </div>

            {/* Comprehensive display of 10 Requested Metrics */}
            <div className="space-y-3 pt-1">
              {[
                { label: "DNA Match Index", val: selectedNode.confidenceScore, icon: Fingerprint, color: "text-red-500" },
                { label: "Voice Harmonics Match", val: selectedNode.voiceMatch, icon: Mic, color: "text-blue-500" },
                { label: "Biometric Face Match", val: selectedNode.biometricMatch, icon: User, color: "text-purple-500" },
                { label: "Linguistic Match", val: selectedNode.languageMatch, icon: MessageCircle, color: "text-indigo-500" },
                { label: "Regional Geographic Match", val: selectedNode.regionalSimilarity, icon: MapPin, color: "text-emerald-500" },
                { label: "Village Registry Correlation", val: selectedNode.villageCorrelation, icon: Shield, color: "text-teal-500" },
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <item.icon className={`w-3.5 h-3.5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className={`font-bold ${textMuted} group-hover:text-stone-800 dark:group-hover:text-yellow-300 transition-colors`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`font-black ${textMain}`}>{item.val}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-stone-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-1 rounded-full transition-all duration-700 ${highContrast ? "bg-yellow-300" : "bg-[#115e3b]"}`}
                      style={{ width: `${item.val}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Interactive Animated Family Tree Visualization */}
        <div
          className={`lg:col-span-6 p-6 rounded-2xl shadow-xs border ${bgCard} flex flex-col justify-between relative overflow-hidden min-h-[500px]`}
        >
          <div className="absolute inset-0 bg-radial-at-c from-emerald-500/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          
          <div className="flex justify-between items-center z-10 w-full mb-6">
            <div>
              <h3 className={`font-black text-sm ${textMain}`}>Interactive Family Tree Map</h3>
              <p className="text-[10px] text-gray-400">
                Pulsing lines indicate matching strength (thicker = higher confidence). Click nodes to explore metrics.
              </p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-[#115e3b]/10 text-[#115e3b] dark:bg-yellow-300/10 dark:text-yellow-300 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dynamic Tree
            </span>
          </div>

          <div className="relative w-full max-w-lg aspect-video sm:aspect-square flex items-center justify-center flex-1">
            
            {/* Center Node (Child Node - Center focus) */}
            <div 
              className="absolute z-20 w-24 h-24 bg-white dark:bg-stone-800 rounded-full shadow-2xl border-4 border-[#115e3b] dark:border-yellow-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-all group"
              onClick={() => addToast("This is Rahul (RC-2042). Keep building the tree to locate guardians.", "info")}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=child2"
                alt="Child"
                className="w-full h-3/4 object-cover"
              />
              <div className="bg-[#115e3b] dark:bg-yellow-300 w-full text-center py-0.5 text-[8px] font-black text-white dark:text-stone-900 group-hover:bg-[#0f4f31]">
                CHILD (Rahul)
              </div>
            </div>

            {/* Connection Lines (Animated SVG Drawing Connecting Center to Family Nodes) */}
            <svg
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              viewBox="0 0 100 100"
            >
              {potentialFamilyNodes.map((node) => {
                // Symmetrical placement calculations corresponding to absolute positioning below
                let targetX = 50;
                let targetY = 50;

                if (node.id === "grandfather") { targetX = 20; targetY = 20; }
                if (node.id === "uncle") { targetX = 80; targetY = 20; }
                if (node.id === "mother") { targetX = 20; targetY = 80; }
                if (node.id === "aunt") { targetX = 80; targetY = 80; }

                // Line thickness based on confidence score (Symmetrical stroke widths)
                const strokeWidth = node.confidenceScore > 90 ? "3.5" : node.confidenceScore > 70 ? "2.2" : "1.2";
                const isSelected = selectedNodeId === node.id;

                return (
                  <g key={node.id}>
                    <line
                      x1="50"
                      y1="50"
                      x2={targetX}
                      y2={targetY}
                      stroke={isSelected ? (highContrast ? "#fde047" : "#115e3b") : "#d1d5db"}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isSelected ? "4" : "none"}
                      className="transition-all duration-500"
                    />
                    {isSelected && (
                      <circle
                        cx={targetX}
                        cy={targetY}
                        r="3"
                        fill={highContrast ? "#fde047" : "#115e3b"}
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* POTENTIAL FAMILY NODES (Symmetrical Quadrants Placement) */}
            {potentialFamilyNodes.map((node) => {
              let posClass = "";
              if (node.id === "grandfather") posClass = "top-[10%] left-[10%]";
              if (node.id === "uncle") posClass = "top-[10%] right-[10%]";
              if (node.id === "mother") posClass = "bottom-[10%] left-[10%]";
              if (node.id === "aunt") posClass = "bottom-[10%] right-[10%]";

              const isSelected = selectedNodeId === node.id;

              return (
                <div 
                  key={node.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 cursor-pointer group transition-all duration-300 ${posClass} ${
                    isSelected ? "scale-110" : "opacity-75 hover:opacity-100"
                  }`}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    addToast(`Selected ${node.name} (${node.relationship}) details.`, "info");
                  }}
                >
                  <div className={`w-14 h-14 bg-white dark:bg-stone-800 rounded-full shadow-lg border-2 overflow-hidden flex items-center justify-center transition-all ${
                    isSelected 
                      ? "border-[#115e3b] dark:border-yellow-300 ring-4 ring-[#115e3b]/10 dark:ring-yellow-300/10" 
                      : "border-gray-200 group-hover:border-[#115e3b]"
                  }`}>
                    <img
                      src={node.photoUrl}
                      className="w-full h-full object-cover"
                      alt={node.name}
                    />
                  </div>
                  <span className={`text-[9px] font-black mt-1 px-2 py-0.5 rounded-full shadow-xs ${
                    isSelected
                      ? "bg-[#115e3b] text-white dark:bg-yellow-300 dark:text-stone-900"
                      : "bg-gray-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  }`}>
                    {node.relationship} • {node.confidenceScore}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Reintegration Verification Status & Action Controls */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-5 rounded-2xl shadow-xs border ${bgCard} space-y-4`}>
            <h3 className={`font-black text-xs ${textMain} uppercase tracking-wider`}>
              Reunification Stage
            </h3>
            
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-100 dark:before:bg-stone-800">
              {[
                { label: "Biometric Audit", status: "Completed", done: true },
                { label: "Panchayat Verification", status: "Completed", done: selectedNode.confidenceScore > 90 },
                { label: "CWC Interview Review", status: mainMatch.status, done: mainMatch.status !== "Pending Verification" },
                { label: "Physical Legal Transfer", status: "Pending", done: mainMatch.status === "Approved" },
              ].map((step, i) => (
                <div key={i} className="relative flex items-center pl-6">
                  <div
                    className={`absolute left-1 w-2.5 h-2.5 rounded-full border-2 ${bgCard} ${
                      step.done 
                        ? (highContrast ? "bg-yellow-300 border-yellow-300" : "bg-[#115e3b] border-[#115e3b]") 
                        : "bg-gray-200 border-gray-200 dark:bg-stone-800 dark:border-stone-800"
                    }`}
                  ></div>
                  <div>
                    <span className={`block text-xs font-black ${step.done ? textMain : "text-gray-400"}`}>
                      {step.label}
                    </span>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fully Functional Match Decision Engine triggers */}
            <div className="pt-4 border-t space-y-2">
              {mainMatch.status === 'Pending Verification' ? (
                <>
                  <button
                    onClick={async () => {
                      await updateFamilyMatchStatus(mainMatch.id, 'Interview Scheduled');
                      addToast("Secure interview channel initiated. Status set to 'Interview Scheduled'.", "success");
                    }}
                    className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all cursor-pointer hover:-translate-y-0.5 shadow-xs"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={async () => {
                      await updateFamilyMatchStatus(mainMatch.id, 'Approved');
                      addToast("Family match successfully approved! Family milestone achieved.", "success");
                    }}
                    className="w-full py-2.5 rounded-xl font-black text-xs text-stone-800 bg-emerald-100 hover:bg-emerald-200 dark:bg-yellow-300 dark:text-stone-900 dark:hover:bg-yellow-400 transition-all cursor-pointer hover:-translate-y-0.5 shadow-xs"
                  >
                    Approve Match
                  </button>
                </>
              ) : mainMatch.status === 'Interview Scheduled' ? (
                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border border-dashed text-center bg-blue-50/40 border-blue-100`}>
                    <span className="block text-[11px] font-bold text-blue-700">Interview is Scheduled</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Secure welfare conference channel is ready.</p>
                  </div>
                  <button
                    onClick={async () => {
                      await updateFamilyMatchStatus(mainMatch.id, 'Approved');
                      addToast("Family match successfully approved! Family milestone achieved.", "success");
                    }}
                    className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Approve Match
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl text-center bg-emerald-50/40 border border-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600 animate-bounce" />
                  <span className="block text-xs font-black">Milestone Approved</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Transit legal clearance is underway.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Dynamic AI Explainable Reasonings Card */}
      <div className={`p-6 rounded-2xl shadow-sm border ${bgCard} relative overflow-hidden`}>
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-5 h-5 ${highContrast ? "text-yellow-300" : "text-blue-500"}`} />
            <h3 className={`font-black text-sm ${textMain} tracking-tight`}>
              Explainable AI Match Reasoning: {selectedNode.relationship} Node
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-md">
            Biometric Confidence: {selectedNode.aiConfidence}%
          </span>
        </div>

        {/* Narrative reasoning */}
        <div className="mb-6 max-w-3xl">
          <p className="text-xs leading-relaxed text-gray-500 italic">
            "{selectedNode.reasoning}"
          </p>
        </div>

        {/* Comprehensive displaying of remaining 4 Metrics to fulfill user's list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50 dark:border-stone-800/50">
          {[
            { label: "Community Verification", value: `${selectedNode.communityVerification}%`, desc: "Panchayat council audit", icon: Shield },
            { label: "Document Registry Match", value: `${selectedNode.documentMatch}%`, desc: "Aadhaar / Ration file alignment", icon: FileText },
            { label: "Historical Missing Reports", value: `${selectedNode.historicalRecords}%`, desc: "Station alert correlation", icon: Search },
            { label: "Cultural & Behavioral", value: `${selectedNode.behavioralIndicators}%`, desc: "Colloquialism & custom audit", icon: Activity },
          ].map((metric, i) => (
            <div key={i} className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30`}>
              <metric.icon className="w-4 h-4 text-stone-400 mb-2" />
              <span className={`block text-xs font-black ${textMain}`}>{metric.label}</span>
              <span className="block text-lg font-black text-[#115e3b] dark:text-yellow-300 mt-1">{metric.value}</span>
              <span className="block text-[9px] text-gray-400 leading-normal mt-0.5">{metric.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
