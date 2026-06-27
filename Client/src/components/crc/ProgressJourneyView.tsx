import React, { useState } from "react";
import {
  Flag,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  Shield,
  Heart,
  Search,
  MapPin,
  CheckSquare,
} from "lucide-react";
import { useToastStore } from "../../lib/store";
import { useCRCStore } from "../../lib/crcStore";

export default function ProgressJourneyView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { addToast } = useToastStore();
  const { journeysList, matchesList, updateFamilyMatchStatus } = useCRCStore();
  
  // Local state for checkboxes
  const [tasks, setTasks] = useState([
    { label: "Village Panchayat Verification", done: true },
    { label: "Secondary Biometric Match", done: false },
    { label: "CWC Approval Meeting", done: false },
  ]);

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
    if (newTasks[index].done) {
      addToast(`Task completed: ${newTasks[index].label}`, "success");
    } else {
      addToast(`Task unmarked: ${newTasks[index].label}`, "info");
    }
  };

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-100";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  const mainJourney = journeysList[0];

  const mainMatch = matchesList.find(m => m.childId === "RC-2042") || matchesList[0];
  const isFamilyMatchCompleted = mainMatch?.status === 'Approved';
  const isRescuedCompleted = journeysList.some(j => j.title === "Rescued" && (j.status === "Completed" || j.status === "Current"));
  const isMedicalCompleted = journeysList.some(j => j.title === "Medical Clearance" && (j.status === "Completed" || j.status === "Current"));
  const isIdentityCompleted = journeysList.some(j => j.title === "Family Identified" && (j.status === "Completed" || j.status === "Current")) || isFamilyMatchCompleted;
  const isReintegrationCompleted = journeysList.some(j => j.title === "Reintegration" && (j.status === "Completed" || j.status === "Current"));
  const currentJourneyStage = mainJourney?.currentStage || "Not Started";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className={`md:col-span-3 space-y-4`}>
          <div className={`p-5 rounded-2xl shadow-sm border ${darkGreenCard} cursor-pointer hover:shadow-md transition-shadow`} onClick={() => addToast("Generating detailed journey report...", "info")}>
            <h3 className={`font-bold text-sm mb-4 flex justify-between items-center`}>
              Journey Overview
              <ArrowRight className="w-4 h-4 opacity-50" />
            </h3>
            <div className="space-y-4">
              <div>
                <span
                  className={`block text-[10px] uppercase tracking-wider text-emerald-100`}
                >
                  Current Stage
                </span>
                <span className={`block text-lg font-black`}>
                  {mainJourney ? mainJourney.currentStage : "Not Started"}
                </span>
              </div>
              <div>
                <span
                  className={`block text-[10px] uppercase tracking-wider text-emerald-100`}
                >
                  Days In Care
                </span>
                <span className={`block text-lg font-black`}>{mainJourney ? mainJourney.daysInCare : 0} Days</span>
              </div>
              <div>
                <span
                  className={`block text-[10px] uppercase tracking-wider text-emerald-100`}
                >
                  Assigned Team
                </span>
                <span className={`block text-lg font-black`}>
                  Alpha Rescue Unit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Large Visual Timeline */}
        <div
          className={`md:col-span-6 p-8 rounded-2xl shadow-sm border ${bgCard} flex flex-col items-center relative min-h-[500px]`}
        >
          <h3
            className={`font-bold text-sm ${textMain} mb-8 w-full text-center tracking-widest uppercase`}
          >
            Reintegration Journey
          </h3>

          <div className="flex-1 flex flex-col items-center justify-between relative w-full max-w-xs">
            {/* Central Line */}
            <div className="absolute inset-y-0 left-1/2 w-1 bg-gray-100 dark:bg-stone-800 -translate-x-1/2 z-0 rounded-full"></div>
            <div
              className={`absolute top-0 left-1/2 w-1 ${highContrast ? "bg-yellow-300" : "bg-[#115e3b]"} -translate-x-1/2 z-0 rounded-full transition-all duration-1000`}
              style={{ height: mainJourney ? `${mainJourney.progressPercentage}%` : "0%" }}
            ></div>

            {[
              { label: "Rescued", active: isRescuedCompleted || true, icon: Shield },
              { label: "Medical", active: isMedicalCompleted || true, icon: Heart },
              { label: "Counselling", active: isMedicalCompleted || true, icon: Users },
              {
                label: "Verification",
                active: isIdentityCompleted,
                icon: Search,
                current: !isFamilyMatchCompleted,
              },
              { label: "Family Match", active: isFamilyMatchCompleted, icon: MapPin, current: isFamilyMatchCompleted && !isReintegrationCompleted },
              { label: "Reintegration", active: isReintegrationCompleted, icon: Flag, current: isReintegrationCompleted },
            ].map((step, i) => (
              <div
                key={i}
                className="relative z-10 w-full flex items-center justify-center group cursor-pointer"
                onClick={() => addToast(`Viewing stage details: ${step.label}`, "info")}
              >
                {/* Label Left (Even) or Right (Odd) */}
                <div
                  className={`absolute ${i % 2 === 0 ? "right-1/2 pr-12 text-right" : "left-1/2 pl-12 text-left"} w-1/2`}
                >
                  <span
                    className={`block text-sm font-black ${step.active ? textMain : textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}
                  >
                    {step.label}
                  </span>
                  {step.current && (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 block animate-pulse">
                      In Progress
                    </span>
                  )}
                </div>

                {/* Node */}
                <div
                  className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all shadow-xl group-hover:scale-110 ${
                    step.active
                      ? highContrast
                        ? "bg-stone-900 border-yellow-300 text-yellow-300"
                        : "bg-white border-[#115e3b] text-[#115e3b]"
                      : highContrast
                        ? "bg-stone-900 border-stone-800 text-stone-600"
                        : "bg-white border-gray-100 text-gray-300"
                  } ${step.current ? "ring-4 ring-emerald-500/30" : ""}`}
                >
                  <step.icon className={`w-5 h-5`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`md:col-span-3 space-y-4`}>
          <div className={`p-5 rounded-2xl shadow-sm border ${bgCard} group transition-colors`}>
            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => addToast("Viewing milestone requirements", "info")}>
              <h3 className={`font-bold text-sm ${textMain}`}>
                Next Milestone
              </h3>
              <ArrowRight className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
            </div>
            {isFamilyMatchCompleted ? (
              <div className={`p-4 rounded-xl text-center border ${highContrast ? "border-yellow-300/30 bg-stone-900/50" : "border-emerald-200 bg-emerald-50/50"}`}>
                <CheckCircle2 className={`w-8 h-8 mx-auto mb-2 ${highContrast ? "text-yellow-300" : "text-emerald-600"}`} />
                <span className={`block text-xs font-black ${highContrast ? "text-yellow-300" : "text-emerald-800"}`}>
                  Milestone Completed!
                </span>
                <p className={`text-[10px] ${textMuted} mt-1`}>
                  Family Match verified and approved. Child is in Reintegration stage!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl ${highContrast ? "bg-stone-800 text-yellow-300" : "bg-[#115e3b]/10 text-[#115e3b]"} text-center group-hover:scale-[1.02] transition-transform`}
                >
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <span className="block font-black text-lg">Family Match</span>
                  <span className="block text-[10px] uppercase font-bold mt-1 opacity-80">
                    Estimated: 3 Days
                  </span>
                </div>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (mainMatch) {
                      await updateFamilyMatchStatus(mainMatch.id, 'Approved');
                      addToast("Milestone achieved: Family match verified and approved!", "success");
                    } else {
                      addToast("No active family match found to approve.", "error");
                    }
                  }}
                  className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer ${highContrast ? "bg-stone-800 text-yellow-300 hover:bg-stone-700" : "bg-[#115e3b] text-white hover:bg-emerald-800"}`}
                >
                  Verify & Approve Match
                </button>
              </div>
            )}
          </div>

          <div className={`p-5 rounded-2xl shadow-sm border ${bgCard}`}>
            <h3 className={`font-bold text-sm ${textMain} mb-4`}>
              Pending Tasks
            </h3>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleTask(i)}>
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${task.done ? (highContrast ? "bg-yellow-300 border-yellow-300 text-stone-900" : "bg-[#115e3b] border-[#115e3b] text-white") : `border-gray-300 group-hover:border-emerald-500`}`}
                  >
                    {task.done && <CheckSquare className="w-3 h-3" />}
                  </div>
                  <span
                    className={`text-xs transition-colors ${task.done ? textMuted + " line-through" : textMain + " font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}`}
                  >
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Journey Story */}
      <div className={`p-6 rounded-2xl shadow-sm border ${bgCard}`}>
        <h3 className={`font-bold text-sm ${textMain} mb-6`}>Journey Log</h3>
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
          {journeysList.length === 0 ? (
            <p className={`text-xs ${textMuted}`}>No journey logs available.</p>
          ) : journeysList.map((log, i) => (
            <div
              key={i}
              onClick={() => addToast(`Opening log details for ${log.title}...`, "info")}
              className={`min-w-[200px] p-4 rounded-xl border ${log.status === 'Current' ? (highContrast ? "border-yellow-300" : "border-[#115e3b]") : borderClass} ${log.status === 'Pending' ? "opacity-50" : "cursor-pointer hover:shadow-md transition-shadow hover:-translate-y-1"}`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${log.status === 'Current' ? (highContrast ? "text-yellow-300" : "text-[#115e3b]") : textMuted}`}
              >
                Day {log.daysInCare || 0}
              </span>
              <h4 className={`font-black text-sm ${textMain} mt-1 mb-2`}>
                {log.title}
              </h4>
              <p className={`text-xs ${textMuted}`}>{log.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
