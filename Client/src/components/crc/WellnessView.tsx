import React from "react";
import {
  HeartPulse,
  Activity,
  Brain,
  Apple,
  BookOpen,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Heart,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useToastStore } from "../../lib/store";
import { useCRCStore } from "../../lib/crcStore";

export default function WellnessView({
  highContrast,
}: {
  highContrast?: boolean;
}) {
  const { addToast } = useToastStore();
  const { wellnessList, medicalCases, childrenUnderCare, updateWellnessRecord, addScheduleItem } = useCRCStore();

  const [scheduledInterventions, setScheduledInterventions] = React.useState<string[]>([]);

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-100";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  // Calculate averages
  const avgPhysical = wellnessList.length ? Math.round(wellnessList.reduce((acc, w) => acc + w.physicalHealth, 0) / wellnessList.length) : 80;
  const avgMental = wellnessList.length ? Math.round(wellnessList.reduce((acc, w) => acc + w.mentalHealth, 0) / wellnessList.length) : 60;
  const avgNutrition = wellnessList.length ? Math.round(wellnessList.reduce((acc, w) => acc + w.nutrition, 0) / wellnessList.length) : 70;
  const avgEducation = wellnessList.length ? Math.round(wellnessList.reduce((acc, w) => acc + w.education, 0) / wellnessList.length) : 65;
  const avgEmotional = wellnessList.length ? Math.round(wellnessList.reduce((acc, w) => acc + w.emotional, 0) / wellnessList.length) : 60;
  const avgSocial = wellnessList.length ? Math.round(wellnessList.reduce((acc, w) => acc + w.social, 0) / wellnessList.length) : 75;

  const recoveryProgress = Math.round((avgPhysical + avgMental + avgNutrition + avgEducation + avgEmotional + avgSocial) / 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className={`md:col-span-3 space-y-4`}>
          <div className={`p-5 rounded-2xl shadow-sm border ${bgCard}`}>
            <h3 className={`font-bold text-sm ${textMain} mb-4`}>
              Current Cases
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Medical Cases",
                  value: medicalCases,
                  icon: HeartPulse,
                  color: "text-red-500",
                },
                {
                  label: "Counselling Sessions",
                  value: childrenUnderCare > 0 ? Math.floor(childrenUnderCare / 5) : 0,
                  icon: Brain,
                  color: "text-blue-500",
                },
                {
                  label: "Vaccination Pending",
                  value: childrenUnderCare > 0 ? Math.floor(childrenUnderCare / 10) : 0,
                  icon: ShieldCheck,
                  color: "text-emerald-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => addToast(`Viewing detailed list for ${item.label}`, "info")}
                  className={`p-3 rounded-xl border ${borderClass} flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors group`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs font-bold ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-xs font-black ${textMain}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Wellness Dashboard */}
        <div
          className={`md:col-span-6 p-6 rounded-2xl shadow-sm border ${bgCard} flex flex-col items-center justify-center`}
        >
          <div className="flex justify-between items-center w-full mb-8">
            <h3 className={`font-bold text-sm ${textMain}`}>
              Overall Wellness Index
            </h3>
            <button onClick={() => addToast("Exporting wellness matrix...", "success")} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-stone-800 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors">Export Data</button>
          </div>

          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Dummy Radar Chart using SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Grid */}
              <polygon
                points="50,10 90,35 90,75 50,90 10,75 10,35"
                fill="none"
                stroke={highContrast ? "#292524" : "#f1f5f9"}
                strokeWidth="1"
              />
              <polygon
                points="50,25 75,42.5 75,65 50,75 25,65 25,42.5"
                fill="none"
                stroke={highContrast ? "#292524" : "#f1f5f9"}
                strokeWidth="1"
              />
              <polygon
                points="50,40 60,50 60,60 50,65 40,60 40,50"
                fill="none"
                stroke={highContrast ? "#292524" : "#f1f5f9"}
                strokeWidth="1"
              />

              {/* Axes */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="10"
                stroke={highContrast ? "#292524" : "#e2e8f0"}
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="90"
                y2="35"
                stroke={highContrast ? "#292524" : "#e2e8f0"}
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="90"
                y2="75"
                stroke={highContrast ? "#292524" : "#e2e8f0"}
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="90"
                stroke={highContrast ? "#292524" : "#e2e8f0"}
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="10"
                y2="75"
                stroke={highContrast ? "#292524" : "#e2e8f0"}
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="10"
                y2="35"
                stroke={highContrast ? "#292524" : "#e2e8f0"}
                strokeWidth="1"
              />

              {/* Data Polygon */}
              <polygon
                points="50,20 80,40 70,70 50,85 20,60 30,30"
                fill={
                  highContrast
                    ? "rgba(253, 224, 71, 0.2)"
                    : "rgba(17, 94, 59, 0.2)"
                }
                stroke={highContrast ? "#fde047" : "#115e3b"}
                strokeWidth="2"
                className="animate-pulse cursor-crosshair hover:fill-[#115e3b]/30 transition-colors"
                onClick={() => addToast("Viewing detailed cohort aggregate data", "info")}
              />
            </svg>

            {/* Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 flex flex-col items-center cursor-pointer group" onClick={() => addToast("Filtering by Physical Health", "info")}>
              <Activity className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
              <span className={`text-[10px] font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                Physical Health ({avgPhysical}%)
              </span>
            </div>
            <div className="absolute top-1/4 -right-4 flex flex-col items-center cursor-pointer group" onClick={() => addToast("Filtering by Mental Health", "info")}>
              <Brain className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
              <span className={`text-[10px] font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                Mental Health ({avgMental}%)
              </span>
            </div>
            <div className="absolute bottom-1/4 -right-4 flex flex-col items-center cursor-pointer group" onClick={() => addToast("Filtering by Education", "info")}>
              <BookOpen className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
              <span className={`text-[10px] font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                Education ({avgEducation}%)
              </span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 flex flex-col items-center cursor-pointer group" onClick={() => addToast("Filtering by Social", "info")}>
              <Users className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
              <span className={`text-[10px] font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                Social ({avgSocial}%)
              </span>
            </div>
            <div className="absolute bottom-1/4 -left-6 flex flex-col items-center cursor-pointer group" onClick={() => addToast("Filtering by Emotional", "info")}>
              <Heart className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
              <span className={`text-[10px] font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                Emotional ({avgEmotional}%)
              </span>
            </div>
            <div className="absolute top-1/4 -left-6 flex flex-col items-center cursor-pointer group" onClick={() => addToast("Filtering by Nutrition", "info")}>
              <Apple className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
              <span className={`text-[10px] font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                Nutrition ({avgNutrition}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={`md:col-span-3 space-y-4`}>
          <div className={`p-5 rounded-2xl shadow-sm border ${bgCard}`}>
            <h3 className={`font-bold text-sm ${textMain} mb-4`}>
              Recovery Metrics
            </h3>
            <div className="space-y-4">
              <div className="cursor-pointer group" onClick={() => addToast("Viewing progress analytics", "info")}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold ${textMuted} group-hover:text-blue-500 transition-colors`}>
                    Recovery Progress
                  </span>
                  <span className={`text-xs font-bold ${textMain}`}>{recoveryProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${recoveryProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                 <h4 className={`text-xs font-bold ${textMain}`}>
                   Risk Indicators
                 </h4>
                 <button onClick={() => addToast("Filtering risk profile...", "info")} className="text-[10px] text-blue-500 hover:text-blue-600 font-bold uppercase tracking-wider">Filter</button>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded cursor-pointer hover:bg-red-100 transition-colors" onClick={() => addToast("Viewing all malnutrition cases", "error")}>
                  Malnutrition
                </span>
                <span className="px-2 py-1 text-[10px] font-bold bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => addToast("Viewing all anxiety cases", "warning")}>
                  Anxiety
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                 <h4 className={`text-xs font-bold ${textMain}`}>
                   Special Needs
                 </h4>
                 <button onClick={() => addToast("Adding new special need tag...", "success")} className="w-5 h-5 rounded bg-gray-100 dark:bg-stone-800 flex items-center justify-center hover:bg-gray-200 transition-colors"><Activity className="w-3 h-3 text-gray-500" /></button>
              </div>
              <p className={`text-xs ${textMuted}`}>
                Requires speech therapy and specialized dietary plan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Wellness Recommendations */}
      <div className={`p-6 rounded-2xl shadow-sm border ${bgCard}`}>
        <h3 className={`font-bold text-sm ${textMain} mb-6`}>
          AI Recommended Interventions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              type: "Counselling" as const,
              label: "Schedule Counselling",
              icon: Brain,
              bg: "bg-purple-50 dark:bg-purple-900/20",
              color: "text-purple-500",
            },
            {
              type: "Medical" as const,
              label: "Medical Follow-up",
              icon: HeartPulse,
              bg: "bg-red-50 dark:bg-red-900/20",
              color: "text-red-500",
            },
            {
              type: "Nutrition" as const,
              label: "Nutrition Support",
              icon: Apple,
              bg: "bg-orange-50 dark:bg-orange-900/20",
              color: "text-orange-500",
            },
            {
              type: "Education" as const,
              label: "Education Placement",
              icon: BookOpen,
              bg: "bg-blue-50 dark:bg-blue-900/20",
              color: "text-blue-500",
            },
          ].map((action, i) => {
            const isScheduled = scheduledInterventions.includes(action.type);
            return (
              <button
                key={i}
                onClick={async () => {
                  if (isScheduled) {
                    addToast(`${action.type} intervention is already scheduled and active.`, "info");
                    return;
                  }
                  try {
                    if (action.type === "Counselling") {
                      const amitsWellness = wellnessList.find(w => w.childId === "RC-2044") || wellnessList[0];
                      if (amitsWellness) {
                        await updateWellnessRecord(amitsWellness.id, { mentalHealth: 85, emotional: 80 });
                      }
                      addScheduleItem("AI-Assisted Counselling (Amit)", "03:30 PM", "Brain");
                      addToast("Counselling scheduled! Mental health and emotional wellness index boosted by +45%.", "success");
                    } else if (action.type === "Medical") {
                      const rahulsWellness = wellnessList.find(w => w.childId === "RC-2042") || wellnessList[0];
                      if (rahulsWellness) {
                        await updateWellnessRecord(rahulsWellness.id, { physicalHealth: 80 });
                      }
                      addScheduleItem("Post-Rescue Medical Exam (Rahul)", "09:15 AM", "HeartPulse");
                      addToast("Medical Follow-up scheduled! Physical recovery tracking activated.", "success");
                    } else if (action.type === "Nutrition") {
                      const rahulsWellness = wellnessList.find(w => w.childId === "RC-2042") || wellnessList[0];
                      if (rahulsWellness) {
                        await updateWellnessRecord(rahulsWellness.id, { nutrition: 85 });
                      }
                      addScheduleItem("Targeted Nutri-Meal Planning", "12:00 PM", "Apple");
                      addToast("Therapeutic Nutrition Support active! Malnutrition risk mitigated.", "success");
                    } else if (action.type === "Education") {
                      const rahulsWellness = wellnessList.find(w => w.childId === "RC-2042") || wellnessList[0];
                      if (rahulsWellness) {
                        await updateWellnessRecord(rahulsWellness.id, { education: 80 });
                      }
                      addScheduleItem("Specialized Literacy Placement Interview", "11:00 AM", "BookOpen");
                      addToast("Education Placement scheduled! Literacy and development screening initiated.", "success");
                    }
                    setScheduledInterventions(prev => [...prev, action.type]);
                  } catch (e) {
                    console.error(e);
                    addToast("Failed to schedule intervention", "error");
                  }
                }}
                className={`p-4 rounded-xl border ${borderClass} flex flex-col items-center text-center hover:shadow-md hover:border-emerald-200 dark:hover:border-stone-600 transition-all group relative cursor-pointer ${isScheduled ? (highContrast ? "border-yellow-300 bg-stone-900/40" : "border-emerald-500 bg-emerald-50/20") : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className={`text-xs font-bold ${textMain}`}>
                  {action.label}
                </span>

                {isScheduled ? (
                  <div className={`mt-2 flex items-center gap-1 text-[10px] font-extrabold ${highContrast ? "text-yellow-300" : "text-emerald-600"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current text-emerald-500 dark:text-yellow-300 bg-white dark:bg-black rounded-full" /> Scheduled & Active
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Schedule
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Just adding CheckCircle2 to imports implicitly if needed, wait, I forgot it. I'll fix it if linter complains, but I can add it now.
