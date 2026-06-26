import React, { useState } from "react";
import {
  Map,
  Home,
  Users,
  HeartPulse,
  Activity,
  Shield,
  ArrowRight,
  Bed,
  UserPlus,
  AlertTriangle,
  Briefcase,
  Plus,
  Compass,
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  Truck,
  Heart,
} from "lucide-react";
import { useCRCStore, ShelterInfo } from "../../lib/crcStore";
import { useToastStore } from "../../lib/store";

interface SheltersViewProps {
  highContrast?: boolean;
  setActivePage?: (page: string) => void;
}

export default function SheltersView({
  highContrast,
  setActivePage,
}: SheltersViewProps) {
  const [selectedShelterName, setSelectedShelterName] = useState<string>("Delhi Hope Center");
  const [isUpdating, setIsUpdating] = useState(false);

  const { sheltersList, updateChildStatus } = useCRCStore();
  const { addToast } = useToastStore();

  const selectedShelter = sheltersList.find(s => s.name === selectedShelterName) || sheltersList[0];

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-100";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  const totalShelters = sheltersList.length;
  const highOccupancyCount = sheltersList.filter(s => (s.occupancy / s.capacity) > 0.85).length;
  const warningsCount = sheltersList.filter(s => s.status === 'Warning' || s.status === 'Critical').length;

  // Static mock variables to satisfy "Doctors, Counsellors, Inspection History, Performance, Funding, Supply Status"
  const getExtendedShelterDetails = (name: string) => {
    switch (name) {
      case "Delhi Hope Center":
        return {
          doctors: "Dr. Sunita Sharma (Pediatrician), Dr. Ravi Sen (General)",
          counsellors: "Manoj Kumar (Trauma Specialist), Priya Shah (Child Psychologist)",
          inspectionHistory: "Passed with Honors (March 2026)",
          performanceScore: "95/100",
          fundingStatus: "Fully Funded (Ministry Grant Vatsalya)",
          supplyStatus: "Sufficient (3 months buffer medicine & meals)",
          details: "Primary Northern India gateway shelter equipped with standard child play rooms and isolation beds."
        };
      case "Mumbai SafeHaven":
        return {
          doctors: "Dr. Alok Verma (Pediatrician), Dr. Anita Deshmukh (Psychiatrist)",
          counsellors: "Sanjay Joshi (Youth Specialist), Maria D'Souza (Therapist)",
          inspectionHistory: "Passed (January 2026)",
          performanceScore: "88/100",
          fundingStatus: "Emergency Grants Activated due to occupancy",
          supplyStatus: "Restocking Needed (Medical kits & therapeutic milk)",
          details: "Critical Western hub focusing on immediate rescue intake. High density, requires active capacity transfers."
        };
      case "Pune Aashray":
        return {
          doctors: "Dr. Milind Kulkarni (General), Dr. Swati Patil (Nutritionist)",
          counsellors: "Anjali Gore (Cognitive Therapist), Rahul Sawant (Case Worker)",
          inspectionHistory: "Passed (February 2026)",
          performanceScore: "92/100",
          fundingStatus: "Stable (Local Trust & CSR Matching)",
          supplyStatus: "Sufficient (Abundant storage beds)",
          details: "Long-term therapeutic recovery retreat with open garden classrooms and educational workspaces."
        };
      case "Bangalore Care":
        return {
          doctors: "Dr. Ramesh Hegde (Pediatrician), Dr. Sophia Thomas (Behavioral)",
          counsellors: "Karthik Raja (Reintegration Officer), Lakshmi Iyer (Therapist)",
          inspectionHistory: "Passed with Warnings (November 2025)",
          performanceScore: "84/100",
          fundingStatus: "Critical (Awaiting Quarterly Disbursement)",
          supplyStatus: "Low Buffer (Restock advisory raised for winter clothing)",
          details: "Southern special support hub focusing on multilingual child rescue cases and digital tracking labs."
        };
      default:
        return {
          doctors: "Dr. Sunita Sharma",
          counsellors: "Manoj Kumar",
          inspectionHistory: "Passed (March 2026)",
          performanceScore: "90/100",
          fundingStatus: "Stable",
          supplyStatus: "Sufficient",
          details: "Standard safety recovery shelter operations."
        };
    }
  };

  const extDetails = getExtendedShelterDetails(selectedShelter?.name || "Delhi Hope Center");

  // Local handler to simulate admitting child to selected shelter (+1 occupancy)
  const handleAdmitChild = () => {
    if (!selectedShelter) return;
    if (selectedShelter.occupancy >= selectedShelter.capacity) {
      addToast(`Admittance failed: ${selectedShelter.name} is at maximum capacity!`, "error");
      return;
    }
    
    setIsUpdating(true);
    setTimeout(() => {
      selectedShelter.occupancy += 1;
      selectedShelter.availableBeds -= 1;
      setIsUpdating(false);
      addToast(`Successfully admitted 1 child into ${selectedShelter.name}. Capacity updated.`, "success");
    }, 800);
  };

  // Local handler to discharge/transfer child (-1 occupancy)
  const handleDischargeChild = () => {
    if (!selectedShelter) return;
    if (selectedShelter.occupancy <= 0) {
      addToast(`Discharge failed: No children currently in ${selectedShelter.name}.`, "info");
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      selectedShelter.occupancy -= 1;
      selectedShelter.availableBeds += 1;
      setIsUpdating(false);
      addToast(`Successfully dispatched 1 child from ${selectedShelter.name}. Capacity updated.`, "success");
    }, 800);
  };

  // AI Transfer Recommendation Executable Button
  const handleExecuteAITransfer = () => {
    const mumbai = sheltersList.find(s => s.name === "Mumbai SafeHaven");
    const pune = sheltersList.find(s => s.name === "Pune Aashray");
    
    if (!mumbai || !pune) return;
    setIsUpdating(true);
    setTimeout(() => {
      // Transfer 3 children
      mumbai.occupancy -= 3;
      mumbai.availableBeds += 3;
      pune.occupancy += 3;
      pune.availableBeds -= 3;
      setIsUpdating(false);
      addToast("AI Balanced Capacity Transfer executed! 3 children safely routed from Mumbai to Pune Aashray.", "success");
    }, 1500);
  };

  // Color coordinate representing occupancy percentage (Heatmap Support)
  const getOccupancyColor = (shelter: ShelterInfo) => {
    const ratio = shelter.occupancy / shelter.capacity;
    if (ratio >= 0.9) return "bg-red-500 ring-red-300 animate-pulse";
    if (ratio >= 0.75) return "bg-orange-500 ring-orange-300";
    return "bg-emerald-500 ring-emerald-300";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top operational summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total National Shelters", value: totalShelters, icon: Home, color: "text-blue-500" },
          { label: "Under-Capacity Warnings", value: highOccupancyCount, icon: AlertTriangle, color: "text-orange-500" },
          { label: "Active Operational Alerts", value: warningsCount, icon: AlertCircle, color: "text-red-500" },
          { label: "Specialist Caseworkers", value: "32 Staff", icon: Users, color: "text-emerald-500" },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-xs border ${bgCard} flex items-center gap-4`}>
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-stone-800 flex items-center justify-center">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <span className={`block text-[10px] uppercase font-bold tracking-wider ${textMuted}`}>{item.label}</span>
              <span className={`text-lg font-black ${textMain}`}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: National Shelters List */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-5 rounded-2xl shadow-xs border ${bgCard}`}>
            <h3 className={`font-black text-sm ${textMain} mb-4 uppercase tracking-wider`}>
              National Facilities List
            </h3>
            <div className="space-y-2">
              {sheltersList.map((shelter) => {
                const ratio = Math.round((shelter.occupancy / shelter.capacity) * 100);
                return (
                  <div
                    key={shelter.id}
                    onClick={() => setSelectedShelterName(shelter.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedShelterName === shelter.name
                        ? "border-[#115e3b] bg-[#115e3b]/5 dark:border-yellow-300 dark:bg-yellow-300/5"
                        : `${borderClass} hover:bg-gray-50 dark:hover:bg-stone-800/50`
                    }`}
                  >
                    <div>
                      <span className={`block text-xs font-black ${textMain}`}>{shelter.name}</span>
                      <span className="block text-[10px] text-gray-400">
                        Beds Available: {shelter.availableBeds} / {shelter.capacity}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        ratio >= 90 ? "bg-red-50 text-red-600" : ratio >= 75 ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {ratio}% full
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Capacity Transfer Recommendations Block */}
          <div className={`p-5 rounded-2xl shadow-xs border ${bgCard} space-y-4`}>
            <h4 className="text-xs font-black text-stone-900 dark:text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600 animate-spin" />
              Transfer Advisory
            </h4>
            
            <p className="text-[11px] text-gray-500 leading-normal">
              <strong>Mumbai SafeHaven</strong> occupancy is currently at <strong>93%</strong>. Local guidelines recommend regional rebalancing to ensure active medical attention.
            </p>

            <div className={`p-3 rounded-lg text-[10px] leading-relaxed border bg-orange-50/20 border-orange-100`}>
              <span className="font-bold text-orange-700 block mb-1">AI Automated Transfer:</span>
              Route 3 children safely from Mumbai SafeHaven to <strong>Pune Aashray</strong> (Occupancy: 50%, 15 beds available).
            </div>

            <button
              onClick={handleExecuteAITransfer}
              disabled={isUpdating}
              className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? "Balancing Capacities..." : "Initiate Balanced AI Transfer"}
            </button>
          </div>
        </div>

        {/* Center Panel: Interactive Map Representation with Heatmap Support */}
        <div className={`lg:col-span-6 p-6 rounded-2xl shadow-xs border ${bgCard} flex flex-col relative min-h-[480px]`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`font-black text-sm ${textMain}`}>National Operations Map</h3>
              <p className="text-[11px] text-gray-400">
                Heatmap indicates occupancy density. Click dots to toggle selected facilities.
              </p>
            </div>
            
            {/* Map Legend */}
            <div className="flex gap-3 text-[9px] uppercase font-bold text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;75%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> 75%-90%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> &gt;90%
              </span>
            </div>
          </div>

          {/* Graphical India SVG Representation Container */}
          <div className="flex-1 border border-dashed border-gray-100 dark:border-stone-800 rounded-xl bg-slate-50/50 dark:bg-stone-950/20 relative overflow-hidden flex items-center justify-center p-4">
            
            {/* Minimalist SVG map outlines representing India context */}
            <svg viewBox="0 0 400 450" className="w-full max-w-sm h-full opacity-10 dark:opacity-5 absolute pointer-events-none">
              <path
                d="M150 50 L180 30 L220 40 L250 80 L230 140 L260 170 L240 220 L270 280 L230 350 L200 420 L160 410 L140 350 L100 290 L120 230 L90 180 L110 130 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

            {/* HEATMAP INTERACTIVE SHELTER PIN DOTS */}
            {sheltersList.map((shelter) => {
              // Custom geographic coordinate placement on our minimal SVG box
              let positionClass = "top-1/4 left-1/2"; // Delhi
              if (shelter.name === "Mumbai SafeHaven") positionClass = "top-1/2 left-1/4";
              if (shelter.name === "Pune Aashray") positionClass = "top-[58%] left-[28%]";
              if (shelter.name === "Bangalore Care") positionClass = "bottom-1/4 left-1/2";

              const colorClass = getOccupancyColor(shelter);
              const isSelected = selectedShelterName === shelter.name;

              return (
                <div
                  key={shelter.id}
                  onClick={() => setSelectedShelterName(shelter.name)}
                  className={`absolute flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform z-20 ${positionClass} ${
                    isSelected ? "scale-125" : ""
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ring-4 ${colorClass}`} />
                  <span className={`mt-1 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs transition-opacity ${
                    isSelected
                      ? "bg-[#115e3b] text-white dark:bg-yellow-300 dark:text-stone-900 opacity-100"
                      : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 opacity-0 group-hover:opacity-100"
                  }`}>
                    {shelter.name.replace(" Center", "").replace(" Care", "").replace(" SafeHaven", "").replace(" Aashray", "")}
                  </span>
                </div>
              );
            })}

            {/* Selected Shelter Overview Overlay Card */}
            {selectedShelter && (
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border shadow-lg bg-white/95 dark:bg-stone-950/95 backdrop-blur-md z-30 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-sm text-stone-900 dark:text-yellow-300">{selectedShelter.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Regional Intake Node
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    selectedShelter.status === "Active" ? "bg-emerald-50 text-emerald-600" : selectedShelter.status === "Warning" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                  }`}>
                    {selectedShelter.status} Status
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-1">
                    <span className="block text-sm font-black text-stone-800 dark:text-stone-100">{selectedShelter.capacity}</span>
                    <span className="block text-[8px] uppercase text-gray-400 font-bold">Capacity</span>
                  </div>
                  <div className="p-1">
                    <span className="block text-sm font-black text-stone-800 dark:text-stone-100">{selectedShelter.occupancy}</span>
                    <span className="block text-[8px] uppercase text-gray-400 font-bold">Occupancy</span>
                  </div>
                  <div className="p-1">
                    <span className={`block text-sm font-black ${selectedShelter.availableBeds < 5 ? "text-orange-500" : "text-emerald-500"}`}>
                      {selectedShelter.availableBeds}
                    </span>
                    <span className="block text-[8px] uppercase text-gray-400 font-bold">Available</span>
                  </div>
                  <div className="p-1">
                    <span className="block text-sm font-black text-stone-800 dark:text-stone-100">{selectedShelter.staff}</span>
                    <span className="block text-[8px] uppercase text-gray-400 font-bold">Staff</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Symmetrical Details Panel (Capacity, Doctors, Counsellors, Supply, Funding) */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-5 rounded-2xl shadow-xs border ${bgCard} space-y-4`}>
            <h3 className={`font-black text-sm ${textMain} uppercase tracking-wider`}>
              Center Logistics Sheet
            </h3>

            {/* Doctors & Counsellors */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="pb-3 border-b border-gray-50 dark:border-stone-800/50">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Doctors On Duty
                </span>
                <p className={`font-bold ${textMain} mt-0.5`}>{extDetails.doctors}</p>
              </div>

              <div className="pb-3 border-b border-gray-50 dark:border-stone-800/50">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Therapists & Counsellors
                </span>
                <p className={`font-bold ${textMain} mt-0.5`}>{extDetails.counsellors}</p>
              </div>

              <div className="pb-3 border-b border-gray-50 dark:border-stone-800/50">
                <div className="flex justify-between">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    Inspection History
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">{extDetails.performanceScore}</span>
                </div>
                <p className={`font-bold ${textMain} mt-0.5`}>{extDetails.inspectionHistory}</p>
              </div>

              <div className="pb-3 border-b border-gray-50 dark:border-stone-800/50">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Funding Source
                </span>
                <p className={`font-bold ${textMain} mt-0.5`}>{extDetails.fundingStatus}</p>
              </div>

              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Operational Supply buffer
                </span>
                <p className={`font-bold ${textMain} mt-0.5`}>{extDetails.supplyStatus}</p>
              </div>
            </div>
          </div>

          {/* Admittance Controls / Live Capacity updates */}
          <div className={`p-5 rounded-2xl shadow-xs border ${bgCard} space-y-4`}>
            <h3 className={`font-black text-xs ${textMain} uppercase tracking-wider`}>
              Intake Desk Operations
            </h3>

            <div className="space-y-2">
              <button
                onClick={handleAdmitChild}
                disabled={isUpdating}
                className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Admit Child (+1 Bed Occupied)
              </button>

              <button
                onClick={handleDischargeChild}
                disabled={isUpdating}
                className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border ${
                  highContrast ? "border-stone-700 text-yellow-300 hover:bg-stone-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Bed className="w-4 h-4 text-emerald-600" />
                Discharge Child (-1 Bed Free)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical Action Hub */}
      <div className={`p-6 rounded-2xl shadow-sm border ${bgCard}`}>
        <h3 className={`font-black text-sm ${textMain} mb-4 uppercase tracking-wider`}>
          Emergency Operations Desk
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Dispatch Transit team",
              icon: Truck,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-950/20",
              action: "Transfer Child Task Team"
            },
            {
              label: "Allocate Financial Pool",
              icon: DollarSign,
              color: "text-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-950/20",
              action: "Emergency Shelter Funding"
            },
            {
              label: "Request Pediatric Doctor",
              icon: HeartPulse,
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-950/20",
              action: "Pediatric Advisory Service"
            },
            {
              label: "Request Extra Caregivers",
              icon: UserPlus,
              color: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-950/20",
              action: "Trauma Care Volunteers"
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                addToast(`${item.action} has been dispatched successfully.`, "success");
              }}
              className={`p-4 rounded-xl border ${borderClass} flex flex-col items-center text-center hover:shadow-md hover:border-gray-300 dark:hover:border-stone-600 transition-all group cursor-pointer`}
            >
              <div
                className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className={`text-xs font-bold ${textMain}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
