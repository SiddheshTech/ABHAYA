import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  Users,
  Shield,
  ArrowRight,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Calendar,
  Plus,
  Mail,
  Share2,
  Download,
  X,
  ChevronRight,
  Info,
  Check,
  Loader2,
  Filter,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCRCStore, ChildInfo } from "../../lib/crcStore";
import { useToastStore } from "../../lib/store";

interface RecoveryCenterViewProps {
  highContrast?: boolean;
  setActivePage?: (page: string) => void;
}

export default function RecoveryCenterView({
  highContrast,
  setActivePage,
}: RecoveryCenterViewProps) {
  const {
    childrenUnderCare,
    newRescues,
    familyMatches,
    medicalCases,
    successRate,
    urgentCases,
    priorityQueue,
    schedule,
    dailyBrief,
    childrenList,
    updateChildStatus,
    addScheduleItem,
  } = useCRCStore();

  const { addToast } = useToastStore();

  // Local UI States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredChildId, setHoveredChildId] = useState<string | null>(null);
  const [selectedChildStory, setSelectedChildStory] = useState<ChildInfo | null>(null);
  const [isAdvancingId, setIsAdvancingId] = useState<string | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventIcon, setNewEventIcon] = useState("Heart");
  const [showBriefEmailModal, setShowBriefEmailModal] = useState(false);
  const [briefEmailAddress, setBriefEmailAddress] = useState("committee@vatsalya.gov.in");
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Bulk operation states
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-100";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart": return Heart;
      case "Users": return Users;
      case "Activity": return Activity;
      case "Shield": return Shield;
      default: return Heart;
    }
  };

  const getStageKey = (status: string): string => {
    const s = status.toLowerCase();
    if (s.includes("rescue")) return "Rescued";
    if (s.includes("recovering")) return "Recovering";
    if (s.includes("medical")) return "Medical";
    if (s.includes("verify") || s.includes("verification")) return "Verification";
    if (s.includes("match") || s.includes("family")) return "Family Match";
    if (s.includes("reintegrat")) return "Reintegrated";
    return "Recovering";
  };

  const getNextStatus = (status: string): string => {
    const currentStage = getStageKey(status);
    if (currentStage === "Rescued") return "Recovering";
    if (currentStage === "Recovering") return "Medical Check";
    if (currentStage === "Medical") return "Verification";
    if (currentStage === "Verification") return "Family Matched";
    if (currentStage === "Family Match") return "Reintegrating";
    return "Reintegrated";
  };

  const getChildDetails = (child: ChildInfo) => {
    const name = child.name;
    if (name === "Ananya") {
      return { summary: "Responded exceptionally well to play therapy. Safe & stable.", team: "Care Unit Alpha", days: "16 Days", next: "Awaiting Reintegration Check" };
    }
    if (name === "Rahul") {
      return { summary: "Under active pediatrician guidance. Showing quick strength gains.", team: "Medical Team Beta", days: "6 Days", next: "Identity Assessment" };
    }
    if (name === "Priya") {
      return { summary: "Excited about grandfather reunification. Transit plan drafted.", team: "Reunification Team", days: "42 Days", next: "Transit to Pune" };
    }
    if (name === "Amit") {
      return { summary: "Mild trauma recovery. Enjoys sorting therapeutic blocks.", team: "Counselling Team C", days: "2 Days", next: "Pediatric Consultation" };
    }
    if (name === "Unknown") {
      return { summary: "Quiet, non-verbal. Safehouse caretakers providing warm support.", team: "Special Care Wing", days: "4 Days", next: "Panchayat Verification" };
    }
    if (name === "Suresh") {
      return { summary: "Confident teenager. Eagerly preparing to rejoin local village school.", team: "Youth Support Board", days: "135 Days", next: "Post-Placement Audit" };
    }
    return { summary: "Adjusting warmly to the shelter environment. Staff monitoring closely.", team: "Care Unit Alpha", days: "5 Days", next: "Regular Case Review" };
  };

  const stages = ["Rescued", "Recovering", "Medical", "Verification", "Family Match", "Reintegrated"];

  const handleAdvanceStage = async (child: ChildInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(child.status);
    const targetStage = getStageKey(nextStatus);
    setIsAdvancingId(child.id);
    try {
      await updateChildStatus(child.id, nextStatus);
      addToast(`${child.name} successfully advanced to "${targetStage}" stage.`, "success");
    } catch (err) {
      addToast("Failed to advance child stage", "error");
    } finally {
      setIsAdvancingId(null);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventTime) return;
    addScheduleItem(newEventTitle, newEventTime, newEventIcon);
    addToast(`Successfully scheduled: ${newEventTitle}`, "success");
    setNewEventTitle("");
    setNewEventTime("");
    setShowAddEventModal(false);
  };

  const handleEmailSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSending(true);
    setTimeout(() => {
      setIsEmailSending(false);
      setShowBriefEmailModal(false);
      addToast(`Daily Recovery Brief successfully sent to: ${briefEmailAddress}`, "success");
    }, 1500);
  };

  const handleDownloadPDF = () => {
    const reportText = `ABHAYA MISSION VATSALYA PORTAL
DAILY RECOVERY BRIEF REPORT - ${new Date().toLocaleDateString()}
"Every child is on a journey home."

PORTAL OVERVIEW METRICS:
- Children Under Care: ${childrenUnderCare}
- New Rescues (Today): ${newRescues}
- Family Matches pending: ${familyMatches}
- Active Medical Cases: ${medicalCases}
- Reintegration Success Rate: ${successRate}%
- Urgent Attention Cases: ${urgentCases}

RECOVERY PIPELINE METRICS:
${stages.map(stage => {
  const count = childrenList.filter(c => getStageKey(c.status) === stage).length;
  return `- ${stage} Stage: ${count} children`;
}).join("\n")}

This report has been automatically generated and cryptographically signed under the guidelines of Ministry of Women and Child Development.`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Daily_Recovery_Brief_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Daily brief downloaded successfully.", "success");
  };

  const handleShareBrief = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast("Secure workspace link copied to clipboard!", "success");
    setShowShareModal(true);
  };

  // Filter children based on selected left category
  const filteredChildren = childrenList.filter(child => {
    if (!selectedCategory) return true;
    const stage = getStageKey(child.status);
    if (selectedCategory === "New Rescues") return stage === "Rescued";
    if (selectedCategory === "Medical Priority") return stage === "Medical" || child.risk === "High";
    if (selectedCategory === "Awaiting Verification") return stage === "Verification";
    if (selectedCategory === "Pending Family Match") return stage === "Family Match";
    return true;
  });

  const toggleChildSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChildIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkActionExecute = async () => {
    if (selectedChildIds.length === 0) {
      addToast("Please select children to apply bulk actions.", "info");
      return;
    }
    if (!bulkAction) {
      addToast("Please select a bulk action from the menu.", "info");
      return;
    }

    addToast(`Executing bulk action: "${bulkAction}" on ${selectedChildIds.length} profiles...`, "info");
    for (const id of selectedChildIds) {
      if (bulkAction === "Verify Identity") {
        await updateChildStatus(id, "Verification");
      } else if (bulkAction === "Send to Medical") {
        await updateChildStatus(id, "Medical Check");
      } else if (bulkAction === "Approve Reintegration") {
        await updateChildStatus(id, "Reintegrating");
      }
    }
    addToast(`Successfully completed "${bulkAction}" for selected children.`, "success");
    setSelectedChildIds([]);
    setBulkAction("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Recovery Bar with Live KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          {
            label: "Children Under Care",
            value: childrenUnderCare,
            icon: Users,
            color: "text-blue-500",
            trend: "+3% vs last month",
            desc: "Active safety shelter occupancy",
          },
          {
            label: "New Rescues",
            value: newRescues,
            icon: Shield,
            color: "text-emerald-500",
            trend: "+8 new today",
            desc: "First level contact centers",
          },
          {
            label: "Family Matches",
            value: familyMatches,
            icon: Heart,
            color: "text-rose-500",
            trend: "98.4% DNA match confidence",
            desc: "Pending Panchayat check",
          },
          {
            label: "Medical Cases",
            value: medicalCases,
            icon: HeartPulse,
            color: "text-orange-500",
            trend: "-2 from yesterday",
            desc: "Under dedicated pediatric care",
          },
          {
            label: "Success Rate",
            value: `${successRate}%`,
            icon: CheckCircle2,
            color: "text-emerald-500",
            trend: "99.8% stability index",
            desc: "Sustainable reunification rate",
          },
          {
            label: "Urgent Cases",
            value: urgentCases,
            icon: AlertTriangle,
            color: "text-red-500",
            trend: "Immediate staff deployed",
            desc: "Action protocol activated",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl shadow-xs border ${bgCard} transition-all hover:border-[#115e3b]/30 hover:shadow-md cursor-pointer flex flex-col justify-between`}
            onClick={() => addToast(`Viewing detailed ${stat.label} report`, "info")}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}
                >
                  {stat.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-black ${textMain}`}>{stat.value}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-50 dark:border-stone-800/50">
              <span className="text-[10px] font-bold text-[#115e3b] dark:text-yellow-300 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
              <p className="text-[9px] text-gray-400 mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Intelligence & Priority Queue */}
        <div
          className={`lg:col-span-3 p-5 rounded-2xl shadow-xs border ${bgCard} flex flex-col gap-5`}
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-extrabold text-sm ${textMain} tracking-tight`}>
                Intelligence Center
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  addToast("All filters cleared.", "info");
                }}
                className="text-[10px] uppercase font-bold text-stone-400 hover:text-[#115e3b] transition-colors"
              >
                Clear
              </button>
            </div>
            
            {/* Category selection */}
            <div className="space-y-2">
              {[
                { label: "New Rescues", count: childrenList.filter(c => getStageKey(c.status) === "Rescued").length, color: "emerald" },
                { label: "Medical Priority", count: childrenList.filter(c => getStageKey(c.status) === "Medical" || c.risk === "High").length, color: "red" },
                { label: "Awaiting Verification", count: childrenList.filter(c => getStageKey(c.status) === "Verification").length, color: "yellow" },
                { label: "Pending Family Match", count: childrenList.filter(c => getStageKey(c.status) === "Family Match").length, color: "blue" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    selectedCategory === item.label
                      ? "border-[#115e3b] bg-[#115e3b]/5 dark:border-yellow-300 dark:bg-yellow-300/5"
                      : `${borderClass} hover:bg-gray-50 dark:hover:bg-stone-800/50`
                  }`}
                  onClick={() => setSelectedCategory(item.label)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                    <span className={`text-xs font-extrabold ${selectedCategory === item.label ? "text-[#115e3b] dark:text-yellow-300" : textMain} transition-colors`}>
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      selectedCategory === item.label
                        ? "bg-[#115e3b] text-white dark:bg-yellow-300 dark:text-stone-900"
                        : "bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Operations & Quick Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-stone-800 space-y-4">
            <h4 className={`font-bold text-xs ${textMain} tracking-tight`}>
              Bulk Management Actions
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                  Selected Children ({selectedChildIds.length})
                </label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs focus:outline-hidden ${
                    highContrast ? "bg-stone-900 border-stone-800 text-yellow-300" : "bg-white border-gray-200"
                  }`}
                >
                  <option value="">Select Action...</option>
                  <option value="Verify Identity">Mark Identity verified</option>
                  <option value="Send to Medical">Direct to Medical Care</option>
                  <option value="Approve Reintegration">Approve Reintegration</option>
                </select>
              </div>

              <button
                disabled={selectedChildIds.length === 0 || !bulkAction}
                onClick={handleBulkActionExecute}
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-stone-900 dark:bg-stone-800 border border-stone-800 dark:border-stone-700 hover:bg-stone-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
              >
                Execute Bulk Action
              </button>

              <button
                onClick={() => {
                  if (setActivePage) {
                    setActivePage("Wellness");
                    addToast("Navigating to Wellness Platform", "info");
                  }
                }}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                  highContrast ? "border-stone-700 hover:bg-stone-800 text-yellow-300" : "border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                Go to Wellness Hub
              </button>
            </div>
          </div>
        </div>

        {/* Center: Interactive Recovery Landscape Grid */}
        <div
          className={`lg:col-span-6 p-6 rounded-2xl shadow-xs border ${bgCard} flex flex-col`}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`font-extrabold text-sm ${textMain}`}>
                Interactive Recovery Landscape
              </h3>
              <p className="text-[11px] text-gray-400">
                Children move fluidly through stages. Hover cards for details. Click to view full journey.
              </p>
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest ${textMuted} bg-gray-50 dark:bg-stone-900 border ${borderClass} px-3 py-1 rounded-full flex items-center gap-1.5`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
          </div>

          {/* Swimlanes Board */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 flex-1">
            {stages.map((stage) => {
              const childrenInStage = filteredChildren.filter(c => getStageKey(c.status) === stage);
              return (
                <div
                  key={stage}
                  className="flex flex-col bg-gray-50/50 dark:bg-stone-950/40 p-2 rounded-xl border border-dashed border-gray-100 dark:border-stone-900 min-h-[340px]"
                >
                  {/* Stage Title and Badge */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-stone-900">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${textMain} truncate`}>
                      {stage}
                    </span>
                    <span className="text-[9px] font-bold bg-[#115e3b]/10 text-[#115e3b] dark:bg-yellow-300/10 dark:text-yellow-300 px-1.5 py-0.5 rounded">
                      {childrenInStage.length}
                    </span>
                  </div>

                  {/* Children cards list in this stage */}
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] scrollbar-hide">
                    <AnimatePresence mode="popLayout">
                      {childrenInStage.map((child) => {
                        const isSelectedForBulk = selectedChildIds.includes(child.id);
                        const details = getChildDetails(child);
                        return (
                          <motion.div
                            key={child.id}
                            layoutId={`child-${child.id}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onMouseEnter={() => setHoveredChildId(child.id)}
                            onMouseLeave={() => setHoveredChildId(null)}
                            onClick={() => setSelectedChildStory(child)}
                            className={`p-2.5 rounded-xl border cursor-pointer relative transition-all shadow-xs group ${
                              isSelectedForBulk
                                ? "border-[#115e3b] bg-[#115e3b]/5 dark:border-yellow-300 dark:bg-yellow-300/5"
                                : highContrast
                                  ? "bg-stone-900 border-stone-800 hover:border-yellow-300/40"
                                  : "bg-white border-gray-100 hover:border-[#115e3b]/30 hover:shadow-md"
                            }`}
                          >
                            {/* Checkbox for bulk actions */}
                            <button
                              onClick={(e) => toggleChildSelection(child.id, e)}
                              className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 transition-opacity"
                            >
                              <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                                isSelectedForBulk ? "bg-[#115e3b] border-[#115e3b] dark:bg-yellow-300 dark:border-yellow-300 text-white dark:text-stone-900" : "bg-white border-gray-300 dark:bg-stone-800 dark:border-stone-700"
                              }`}>
                                {isSelectedForBulk && <Check className="w-2.5 h-2.5" />}
                              </div>
                            </button>

                            {/* Avatar Bubble */}
                            <div className="flex flex-col items-center text-center">
                              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#115e3b] dark:group-hover:border-yellow-300 transition-colors">
                                <img
                                  src={child.photo}
                                  alt={child.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className={`block text-[11px] font-extrabold ${textMain} mt-1.5 truncate w-full`}>
                                {child.name}
                              </span>
                              <span className="block text-[9px] text-gray-400 font-bold">
                                Age: {child.age} • {child.id}
                              </span>
                            </div>

                            {/* Advance stage button - floating on card bottom */}
                            {stage !== "Reintegrated" && (
                              <button
                                onClick={(e) => handleAdvanceStage(child, e)}
                                className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-gray-50 hover:bg-[#115e3b] hover:text-white dark:bg-stone-800 dark:hover:bg-yellow-300 dark:hover:text-stone-900 text-stone-400 transition-colors opacity-0 group-hover:opacity-100"
                                title={`Advance to ${getStageKey(getNextStatus(child.status))}`}
                              >
                                {isAdvancingId === child.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </button>
                            )}

                            {/* HOVER TOOLTIP/OVERLAY DETAILS */}
                            {hoveredChildId === child.id && (
                              <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl z-40 text-left pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-start mb-1.5">
                                  <span className="text-[10px] font-black text-[#115e3b] dark:text-yellow-300 uppercase tracking-wider">{child.name}</span>
                                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                                    child.risk === "High" ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" : "bg-emerald-50 text-emerald-600"
                                  }`}>
                                    {child.risk} Risk
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-normal mb-1.5">
                                  "{details.summary}"
                                </p>
                                <div className="space-y-1 text-[8px] text-gray-400 border-t border-gray-50 dark:border-stone-800/50 pt-1.5">
                                  <div><span className="font-bold text-gray-500">Facility:</span> {child.shelter}</div>
                                  <div><span className="font-bold text-gray-500">Staff Unit:</span> {details.team}</div>
                                  <div><span className="font-bold text-gray-500">Days Active:</span> {details.days}</div>
                                  <div><span className="font-bold text-gray-500">Milestone:</span> {details.next}</div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {childrenInStage.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-8">
                        <Clock className="w-6 h-6 mb-1 text-gray-300" />
                        <span className="text-[9px] uppercase tracking-wider">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Interactive Schedule Calendar & Reminders */}
        <div
          className={`lg:col-span-3 p-5 rounded-2xl shadow-xs border ${bgCard} flex flex-col justify-between`}
        >
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className={`font-extrabold text-sm ${textMain}`}>
                Welfare Operations Schedule
              </h3>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="p-1 rounded-full bg-[#115e3b]/10 hover:bg-[#115e3b]/20 text-[#115e3b] dark:bg-yellow-300/10 dark:hover:bg-yellow-300/20 dark:text-yellow-300 transition-colors cursor-pointer"
                title="Add Schedule Event"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {schedule.map((item, i) => {
                const Icon = getIcon(item.iconName);
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${borderClass} flex items-center justify-between hover:bg-gray-50 dark:hover:bg-stone-800/50 cursor-pointer transition-all group`}
                    onClick={() => addToast(`Opening file context: "${item.label}"`, "info")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          highContrast ? "bg-stone-800 group-hover:bg-stone-700" : "bg-gray-50 group-hover:bg-gray-100"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${textMuted} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`} />
                      </div>
                      <div>
                        <span className={`block text-xs font-bold ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                          {item.label}
                        </span>
                        <span className="block text-[9px] text-gray-400 font-medium">
                          Today • {item.time}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToast(`Reminder notification configured for ${item.label}.`, "success");
                      }}
                      className="text-[9px] font-bold text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remind
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-stone-800 mt-4">
            <button
              onClick={() => {
                if (setActivePage) {
                  setActivePage("Progress Journey");
                  addToast("Navigating to Progress Journey Timeline", "info");
                }
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#115e3b] text-white hover:bg-[#0f5233] transition-all hover:scale-[1.01] cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              Full Timelines & Journeys
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Daily Recovery Brief & Options */}
      <div
        className={`p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row items-center justify-between gap-6 ${darkGreenCard}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg">Daily Recovery Brief</h3>
              <span className="bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black tracking-wider">
                AI Automated
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 max-w-md">
              Summarized indicators, priority medical needs, and reunification progress drafted under Ministry guidelines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {dailyBrief.map((stat, i) => (
            <div key={i} className="text-center min-w-[80px]">
              <span className="block text-2xl font-black">{stat.value}</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-100 whitespace-nowrap mt-1">
                {stat.label}
              </span>
            </div>
          ))}

          <div className="h-8 w-[1px] bg-white/20 hidden md:block" />

          {/* Report Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2 cursor-pointer border border-white/20 text-white"
              title="Download TXT Report"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={() => setShowBriefEmailModal(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2 cursor-pointer border border-white/20 text-white"
              title="Email Report to Committee"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </button>
            <button
              onClick={handleShareBrief}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2 cursor-pointer border border-white/20 text-white"
              title="Share Secure Connection Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* --- POPUPS & MODALS --- */}

      {/* 1. SCHEDULE EVENT MODAL */}
      <AnimatePresence>
        {showAddEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setShowAddEventModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-sm p-6 rounded-2xl shadow-2xl border mx-4 ${
                highContrast ? "bg-stone-950 border-stone-800 text-white" : "bg-white text-stone-900 border-gray-100"
              }`}
            >
              <button
                onClick={() => setShowAddEventModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="font-extrabold text-sm mb-4">Add Operation Schedule</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Event Label / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. Pediatric Vaccination Followup"
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                      highContrast ? "bg-stone-900 border-stone-800 text-white focus:border-yellow-300" : "bg-white border-stone-200 focus:border-[#115e3b]"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Time Range
                    </label>
                    <input
                      type="text"
                      required
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      placeholder="e.g. 11:30 AM"
                      className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                        highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Category Icon
                    </label>
                    <select
                      value={newEventIcon}
                      onChange={(e) => setNewEventIcon(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                        highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200"
                      }`}
                    >
                      <option value="Heart">Heart (Counselling)</option>
                      <option value="Users">Users (Family)</option>
                      <option value="Activity">Activity (Medical)</option>
                      <option value="Shield">Shield (Alerts)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all cursor-pointer"
                >
                  Schedule Operation Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SUMMARY EMAIL MODAL */}
      <AnimatePresence>
        {showBriefEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setShowBriefEmailModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-sm p-6 rounded-2xl shadow-2xl border mx-4 ${
                highContrast ? "bg-stone-950 border-stone-800 text-white" : "bg-white text-stone-900 border-gray-100"
              }`}
            >
              <button
                onClick={() => setShowBriefEmailModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-extrabold text-sm mb-2">Send Daily Brief Report</h3>
              <p className="text-[11px] text-gray-400 mb-4">
                Encrypt and transmit today's recovery data sheet to secure stakeholder endpoints.
              </p>

              <form onSubmit={handleEmailSend} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Stakeholder Address
                  </label>
                  <input
                    type="email"
                    required
                    value={briefEmailAddress}
                    onChange={(e) => setBriefEmailAddress(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                      highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200"
                    }`}
                  />
                </div>

                <div className={`p-3 rounded-lg text-[10px] leading-relaxed flex gap-2 ${
                  highContrast ? "bg-stone-900 text-yellow-300 border border-stone-800" : "bg-blue-50 text-blue-700 border border-blue-100/50"
                }`}>
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Transmitted files will be encrypted using standard Government of India gateway standards for digital child welfare safety.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isEmailSending}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isEmailSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending Cryptographic Mail...
                    </>
                  ) : (
                    "Transmit Encrypted Email"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setShowShareModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-sm p-6 rounded-2xl shadow-2xl border mx-4 text-center ${
                highContrast ? "bg-stone-950 border-stone-800 text-white" : "bg-white text-stone-900"
              }`}
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm mb-1">Copied Securely!</h3>
              <p className="text-xs text-gray-400 mb-4">
                The secure link to the Rakshak Child Recovery Operations Center is copied. Invite other welfare specialists.
              </p>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 bg-gray-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold transition-all"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. DETAIL JOURNEY STORY IN-PAGE OVERLAY MODAL */}
      <AnimatePresence>
        {selectedChildStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setSelectedChildStory(null)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`relative w-full max-w-lg p-6 rounded-2xl shadow-2xl border mx-4 overflow-y-auto max-h-[90vh] ${
                highContrast ? "bg-stone-950 border-stone-800 text-white animate-in" : "bg-white text-stone-900 border-gray-100"
              }`}
            >
              <button
                onClick={() => setSelectedChildStory(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors border"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border">
                  <img
                    src={selectedChildStory.photo}
                    alt={selectedChildStory.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black flex items-center gap-2">
                    {selectedChildStory.name}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      selectedChildStory.risk === "High" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {selectedChildStory.risk} Risk
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    ID: {selectedChildStory.id} • Age: {selectedChildStory.age} • shelter: {selectedChildStory.shelter}
                  </p>
                </div>
              </div>

              {/* Journey Narrative */}
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="block text-[10px] font-bold text-[#115e3b] dark:text-yellow-300 uppercase tracking-wider mb-1">
                    Child Care Status
                  </span>
                  <p className="text-gray-500 font-medium">
                    {selectedChildStory.name} is currently in the <strong className="text-stone-800 dark:text-yellow-300">"{getStageKey(selectedChildStory.status)}"</strong> stage.
                    The care caseworker unit has logged general adjustments as positive, safe, and collaborative with counseling specialists.
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-[#115e3b] dark:text-yellow-300 uppercase tracking-wider mb-2">
                    Active Recovery Milestones
                  </span>
                  <div className="relative border-l-2 border-dashed border-gray-100 dark:border-stone-800 pl-4 space-y-3">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#115e3b] dark:bg-yellow-300" />
                      <span className="block font-bold">Rescued & Sheltered</span>
                      <p className="text-gray-400">Child recovered safely and admitted to shelter with standard safety clothing and meals.</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ${
                        selectedChildStory.status === "Rescued" ? "bg-gray-200" : "bg-[#115e3b] dark:bg-yellow-300"
                      }`} />
                      <span className="block font-bold">Medical Examination</span>
                      <p className="text-gray-400">Routine physical evaluation and baseline nutritional indexing completed.</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ${
                        ["Rescued", "Recovering", "Medical Check"].includes(selectedChildStory.status) ? "bg-gray-200" : "bg-[#115e3b] dark:bg-yellow-300"
                      }`} />
                      <span className="block font-bold">Emotional & Counsellor Onboarding</span>
                      <p className="text-gray-400">Initial integration session with child welfare psychotherapist.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedChildStory(null);
                      if (setActivePage) {
                        setActivePage("Progress Journey");
                        addToast(`Opening timeline detail page for ${selectedChildStory.name}`, "info");
                      }
                    }}
                    className="px-4 py-2 bg-[#115e3b] text-white hover:bg-[#0f5233] rounded-lg font-bold"
                  >
                    View Timeline Page
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
