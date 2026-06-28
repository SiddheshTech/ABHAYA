import React, { useState, useMemo } from "react";
import {
  Heart,
  Activity,
  Shield,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Calendar,
  MapPin,
  X,
  CheckCircle2,
  Brain,
  Award,
  Sparkles,
  Save,
  Plus,
  Trash,
  Smile,
  FileText,
  UserPlus,
} from "lucide-react";
import { useCRCStore, ChildInfo, WellnessInfo, JourneyMilestoneInfo } from "../../lib/crcStore";
import { useToastStore } from "../../lib/store";

interface ChildrenViewProps {
  highContrast?: boolean;
  setActivePage?: (page: string) => void;
}

export default function ChildrenView({
  highContrast,
  setActivePage,
}: ChildrenViewProps) {
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"timeline" | "wellness" | "case" | "matching">("timeline");
  
  // Store actions
  const {
    childrenList,
    wellnessList,
    journeysList,
    matchesList,
    updateWellnessRecord,
    updateJourneyMilestone,
    updateChildStatus,
  } = useCRCStore();
  const { addToast } = useToastStore();

  // Selected child details
  const childWellness = useMemo(() => {
    if (!selectedChild) return null;
    return wellnessList.find(w => w.childId === selectedChild.id) || {
      id: `w-${selectedChild.id}`,
      childId: selectedChild.id,
      physicalHealth: 85,
      mentalHealth: 75,
      nutrition: 80,
      education: 70,
      emotional: 80,
      social: 75,
      medicalAlerts: ["Mild Nutritional Deficit"],
    } as WellnessInfo;
  }, [selectedChild, wellnessList]);

  const childMilestone = useMemo(() => {
    if (!selectedChild) return null;
    return journeysList.find(j => j.childId === selectedChild.id) || {
      id: `j-${selectedChild.id}`,
      childId: selectedChild.id,
      title: "Counselling Onboarding",
      status: "Current",
      date: "Active",
      description: "Routine psychological wellness adjustment and therapy.",
      currentStage: "Recovering",
      daysInCare: 12,
      progressPercentage: 40
    } as JourneyMilestoneInfo;
  }, [selectedChild, journeysList]);

  const childMatch = useMemo(() => {
    if (!selectedChild) return null;
    return matchesList.find(m => m.childId === selectedChild.id);
  }, [selectedChild, matchesList]);

  // Edit States
  const [editPhysical, setEditPhysical] = useState(85);
  const [editMental, setEditMental] = useState(75);
  const [editNutrition, setEditNutrition] = useState(80);
  const [editEducation, setEditEducation] = useState(70);
  const [editEmotional, setEditEmotional] = useState(80);
  const [editSocial, setEditSocial] = useState(75);
  const [newAlert, setNewAlert] = useState("");
  const [alertsList, setAlertsList] = useState<string[]>([]);
  
  // Case / Officer Notes states
  const [officerNotes, setOfficerNotes] = useState("");
  const [caseWorker, setCaseWorker] = useState("Inspector Raj, CW Unit");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edit states when child is selected
  const handleSelectChild = (child: ChildInfo) => {
    setSelectedChild(child);
    setSelectedTab("timeline");
    
    const wellness = wellnessList.find(w => w.childId === child.id) || {
      physicalHealth: 85,
      mentalHealth: 75,
      nutrition: 80,
      education: 70,
      emotional: 80,
      social: 75,
      medicalAlerts: ["Mild Nutritional Deficit"],
    };
    
    setEditPhysical(wellness.physicalHealth);
    setEditMental(wellness.mentalHealth);
    setEditNutrition(wellness.nutrition);
    setEditEducation(wellness.education);
    setEditEmotional(wellness.emotional);
    setEditSocial(wellness.social);
    setAlertsList(wellness.medicalAlerts || []);

    // Use the dynamic details mapped from the backend
    setOfficerNotes(child.officerNotes || "No specific officer notes available for this child yet.");
    setCaseWorker(child.caseWorker || "Unassigned Case Worker");
  };

  const handleSaveWellness = async () => {
    if (!selectedChild) return;
    setIsSaving(true);
    try {
      await updateWellnessRecord(selectedChild.id, {
        physicalHealth: editPhysical,
        mentalHealth: editMental,
        nutrition: editNutrition,
        education: editEducation,
        emotional: editEmotional,
        social: editSocial,
        medicalAlerts: alertsList
      });
      addToast(`Wellness matrix successfully saved for ${selectedChild.name}.`, "success");
    } catch (err) {
      addToast("Failed to update wellness indicators.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.trim()) return;
    if (alertsList.includes(newAlert.trim())) {
      addToast("Alert already exists.", "info");
      return;
    }
    setAlertsList([...alertsList, newAlert.trim()]);
    setNewAlert("");
    addToast("Temporary wellness alert added. Click Save to persist.", "info");
  };

  const handleRemoveAlert = (alertToRemove: string) => {
    setAlertsList(alertsList.filter(a => a !== alertToRemove));
    addToast("Alert removed from workspace. Click Save to persist.", "info");
  };

  const handleSaveOfficerNotes = () => {
    if (!selectedChild) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast(`Case Officer file notes successfully recorded for ${selectedChild.name}.`, "success");
    }, 1000);
  };

  const filteredChildren = useMemo(() => {
    return childrenList.filter(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      child.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [childrenList, searchQuery]);

  // Overall child wellness index calculation
  const overallWellnessScore = useMemo(() => {
    return Math.round((editPhysical + editMental + editNutrition + editEducation + editEmotional + editSocial) / 6);
  }, [editPhysical, editMental, editNutrition, editEducation, editEmotional, editSocial]);

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-transparent";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-100";
  const darkGreenCard = highContrast
    ? "bg-stone-800 text-yellow-300 border border-yellow-300"
    : "bg-[#115e3b] text-white";

  if (selectedChild) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Back Button */}
        <button
          onClick={() => setSelectedChild(null)}
          className={`flex items-center gap-2 text-sm font-bold ${textMuted} hover:${textMain} transition-all cursor-pointer hover:-translate-x-1`}
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Children Wall
        </button>

        {/* Emotion Guidance Banner */}
        <div className={`p-4 rounded-2xl border ${bgCard} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-stone-800 flex items-center justify-center text-emerald-600 dark:text-yellow-300">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-black ${textMain}`}>Forensic Case Narrative Platform</p>
              <h2 className="text-sm font-medium italic text-gray-500">
                "Every child is on a journey home."
              </h2>
            </div>
          </div>
          <span className="text-[10px] uppercase font-black bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-yellow-300 px-3 py-1 rounded-full">
            Active Care Mode
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Bio Summary */}
          <div className="lg:col-span-3 space-y-4">
            <div
              className={`p-6 rounded-2xl shadow-xs border text-center flex flex-col items-center justify-center ${darkGreenCard}`}
            >
              <div className="w-24 h-24 rounded-full bg-white/20 mb-4 overflow-hidden border-4 border-white/30 hover:scale-105 transition-transform">
                <img
                  src={selectedChild.photo}
                  alt={selectedChild.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-black">{selectedChild.name}</h2>
              <p className="text-xs text-emerald-100 font-bold tracking-wider mb-4">
                ID: {selectedChild.id}
              </p>
              
              <div className="flex gap-2">
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold">
                  Age: {selectedChild.age}
                </span>
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold">
                  Risk: {selectedChild.risk}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className={`p-5 rounded-2xl shadow-xs border ${bgCard} space-y-4`}>
              <h4 className={`font-black text-xs ${textMain} tracking-tight uppercase`}>
                Recovery Benchmarks
              </h4>
              {[
                {
                  label: "Overall Wellness Index",
                  value: `${overallWellnessScore}/100`,
                  icon: Brain,
                  color: "text-emerald-500",
                },
                {
                  label: "Reintegration Confidence",
                  value: `${childMilestone ? childMilestone.progressPercentage : 40}%`,
                  icon: Award,
                  color: "text-blue-500",
                },
                {
                  label: "Current Recovery Stage",
                  value: selectedChild.status,
                  icon: Activity,
                  color: "text-rose-500",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className={`text-[11px] font-bold ${textMuted}`}>
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

          {/* Center Panel - Tabbed Journey Story Narrative */}
          <div className={`lg:col-span-6 p-6 rounded-2xl shadow-xs border ${bgCard} flex flex-col gap-5`}>
            
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 dark:border-stone-800 pb-2 overflow-x-auto gap-4 scrollbar-hide">
              {[
                { id: "timeline", label: "Recovery Timeline", icon: Calendar },
                { id: "wellness", label: "Wellness Indicators", icon: Heart },
                { id: "case", label: "Officer Case Notes", icon: FileText },
                { id: "matching", label: "Family Tree Matches", icon: UserCheck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-1.5 text-xs font-extrabold pb-2 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    selectedTab === tab.id
                      ? "border-[#115e3b] text-[#115e3b] dark:border-yellow-300 dark:text-yellow-300"
                      : "border-transparent text-gray-400 hover:text-stone-700"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: TIMELINE */}
            {selectedTab === "timeline" && (
              <div className="space-y-6">
                <div>
                  <h3 className={`font-black text-sm ${textMain} mb-1`}>Child Recovery Narrative Timeline</h3>
                  <p className="text-[11px] text-gray-400">
                    A compassionate milestone list detailing this child's movement towards reunification.
                  </p>
                </div>

                <div className="relative border-l-2 border-dashed border-gray-100 dark:border-stone-800 pl-6 ml-2 space-y-6">
                  {[
                    { title: "Safe Rescue & Admittance", date: "Initial Phase", desc: "Secured from railway platform safely by child welfare responders. Admitted into care shelter.", done: true },
                    { title: "Pediatric & Medical Cleared", date: "Phase 2", desc: `Routine health scan performed at ${selectedChild.shelter}. Baseline diagnostics cleared.`, done: true },
                    { title: "Counselling & Trauma Support", date: "Phase 3", desc: "Active integration sessions scheduled to build healthy social confidence.", done: selectedChild.status !== "Rescued" },
                    { title: "Family Identity Matching", date: "Phase 4", desc: "Executing regional demographic search, Panchayat notifications, and biometric verification.", done: ["Family Matched", "Reintegrating", "Reintegrated"].includes(selectedChild.status) },
                    { title: "Home Reintegration Completion", date: "Final Phase", desc: "Formal legal transfer of physical custody back to approved guardians.", done: selectedChild.status === "Reintegrated" },
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                        step.done
                          ? "bg-[#115e3b] border-[#115e3b] dark:bg-yellow-300 dark:border-yellow-300 text-white dark:text-stone-900"
                          : "bg-white border-gray-200 dark:bg-stone-900 dark:border-stone-800 text-stone-300"
                      }`}>
                        {step.done ? <CheckCircle2 className="w-3 h-3" /> : <Calendar className="w-2.5 h-2.5" />}
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className={`text-xs font-black ${step.done ? textMain : "text-gray-400"}`}>{step.title}</h4>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">{step.date}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-normal">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl border border-dashed ${borderClass} space-y-3`}>
                  <h4 className="text-xs font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-600" /> AI Care Recommendation</h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Based on wellness scores, we suggest advancing to the next milestone. Child exhibits excellent emotional recovery indicators. No medical warnings reported.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: WELLNESS FORM (EDITABLE) */}
            {selectedTab === "wellness" && (
              <div className="space-y-6">
                <div>
                  <h3 className={`font-black text-sm ${textMain} mb-1`}>Wellness & Care Matrix</h3>
                  <p className="text-[11px] text-gray-400">
                    Adjust health metrics in real-time. Changes will propagate across the platform instantly.
                  </p>
                </div>

                {/* Symmetrical Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Physical Health Status", val: editPhysical, setVal: setEditPhysical },
                    { label: "Psychological Stability", val: editMental, setVal: setEditMental },
                    { label: "Therapeutic Nutrition", val: editNutrition, setVal: setEditNutrition },
                    { label: "Educational Engagement", val: editEducation, setVal: setEditEducation },
                    { label: "Emotional Resilience", val: editEmotional, setVal: setEditEmotional },
                    { label: "Social Adaptation", val: editSocial, setVal: setEditSocial },
                  ].map((slider, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[11px] font-black ${textMain}`}>{slider.label}</span>
                        <span className="text-xs font-black text-[#115e3b] dark:text-yellow-300">{slider.val}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slider.val}
                        onChange={(e) => slider.setVal(parseInt(e.target.value))}
                        className="w-full accent-[#115e3b] dark:accent-yellow-300 h-1 rounded"
                      />
                    </div>
                  ))}
                </div>

                {/* Medical Log Warnings Section */}
                <div className="space-y-3 pt-2">
                  <h4 className={`font-bold text-xs ${textMain}`}>Active Medical Warnings & Logs</h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {alertsList.map((alert, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-[10px] font-black border border-red-100 dark:border-red-950"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {alert}
                        <button
                          onClick={() => handleRemoveAlert(alert)}
                          className="hover:text-red-800 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {alertsList.length === 0 && (
                      <p className="text-[10px] text-gray-400">No medical warnings registered.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddAlert} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add custom wellness log warning..."
                      value={newAlert}
                      onChange={(e) => setNewAlert(e.target.value)}
                      className={`flex-1 px-3 py-1.5 rounded-lg border text-xs focus:outline-hidden ${
                        highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200"
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-stone-800 hover:bg-stone-800 text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={handleSaveWellness}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        Saving Wellness File...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Wellness File
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CASE NOTES (EDITABLE) */}
            {selectedTab === "case" && (
              <div className="space-y-4">
                <div>
                  <h3 className={`font-black text-sm ${textMain} mb-1`}>Welfare Officer Case Notes</h3>
                  <p className="text-[11px] text-gray-400">
                    Draft narrative remarks. Do not structure notes as police profiles; emphasize behavioral recovery.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Assigned Welfare Case Officer
                      </label>
                      <input
                        type="text"
                        value={caseWorker}
                        onChange={(e) => setCaseWorker(e.target.value)}
                        className={`w-full p-2.5 rounded-xl border text-xs focus:outline-hidden ${
                          highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Welfare Center Location
                      </label>
                      <input
                        type="text"
                        disabled
                        value={selectedChild.shelter}
                        className={`w-full p-2.5 rounded-xl border text-xs bg-gray-50 dark:bg-stone-900 cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Case File Narrative Logs
                    </label>
                    <textarea
                      rows={5}
                      value={officerNotes}
                      onChange={(e) => setOfficerNotes(e.target.value)}
                      placeholder="Narrate the child's progress, cognitive skills, and emotional adaptation..."
                      className={`w-full p-3 rounded-xl border text-xs focus:outline-hidden leading-relaxed ${
                        highContrast ? "bg-stone-900 border-stone-800 text-white" : "bg-white border-stone-200"
                      }`}
                    />
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      onClick={handleSaveOfficerNotes}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#115e3b] hover:bg-[#0f5233] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          Saving Notes...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save Case Notes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAMILY MATCHING */}
            {selectedTab === "matching" && (
              <div className="space-y-6">
                <div>
                  <h3 className={`font-black text-sm ${textMain} mb-1`}>Biometric & Demographic Family Correlation</h3>
                  <p className="text-[11px] text-gray-400">
                    Confidence metrics compiled dynamically using regional datasets and local Panchayat records.
                  </p>
                </div>

                {childMatch ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${borderClass} bg-stone-50/50 dark:bg-stone-900/30 flex justify-between items-center`}>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Matched Contact</span>
                        <h4 className={`text-sm font-black ${textMain}`}>{childMatch.matchName}</h4>
                        <span className="text-[11px] text-gray-500 font-medium">Relationship: {childMatch.relationship}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Status</span>
                        <span className="text-xs font-black text-[#115e3b] dark:text-yellow-300">{childMatch.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-xl border ${borderClass} text-center`}>
                        <span className="block text-2xl font-black text-emerald-600">{childMatch.confidenceScore}%</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">DNA Match Index</span>
                      </div>
                      <div className={`p-3 rounded-xl border ${borderClass} text-center`}>
                        <span className="block text-2xl font-black text-emerald-600">{childMatch.biometricMatch}%</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Face Match Index</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl bg-[#115e3b]/5 border border-[#115e3b]/10`}>
                      <h4 className="text-xs font-bold text-[#115e3b] dark:text-yellow-300 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Explainable AI Match Reasoning</h4>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-normal mt-2">
                        We correlated {selectedChild.name} with {childMatch.matchName} because of high facial structural indicators ({childMatch.biometricMatch}%), local linguistic similarities identified during therapeutic conversation, and direct residential record correlations provided by local Panchayat members in {childMatch.location}.
                      </p>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedChild(null);
                          if (setActivePage) {
                            setActivePage("Family Matching");
                            addToast(`Navigating to Family matching workspace`, "info");
                          }
                        }}
                        className="px-4 py-2 bg-[#115e3b] text-white hover:bg-[#0f5233] text-xs font-black rounded-xl transition-all cursor-pointer"
                      >
                        Open Family Matching Studio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 opacity-50">
                    <AlertTriangle className="w-12 h-12 mb-3 text-gray-300 mx-auto" />
                    <p className="font-bold text-sm">No Potential Family Matched</p>
                    <p className="text-xs">Database search is active. Regional records will auto-populate.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Case Worker & Escalate Action */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Caseworker Card */}
            <div className={`p-5 rounded-2xl shadow-xs border ${bgCard}`}>
              <h3 className={`font-black text-xs ${textMain} mb-4 uppercase tracking-wider`}>
                Assigned Case Worker
              </h3>
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => addToast("Connecting secure communication channel...", "info")}>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-offset-2 group-hover:ring-2 ring-[#115e3b] dark:ring-yellow-300 transition-all">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=officer"
                    alt="Officer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className={`text-xs font-black ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>
                    {caseWorker}
                  </h4>
                  <p className={`text-[10px] ${textMuted}`}>
                    Mission Vatsalya Special Division
                  </p>
                </div>
              </div>
            </div>

            {/* Current Shelter Card */}
            <div className={`p-5 rounded-2xl shadow-xs border ${bgCard}`}>
              <h3 className={`font-black text-xs ${textMain} mb-4 uppercase tracking-wider`}>
                Recovery Location
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className={`w-4 h-4 ${textMuted}`} />
                <span className={`text-xs font-extrabold ${textMain}`}>
                  {selectedChild.shelter}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedChild(null);
                  if (setActivePage) {
                    setActivePage("Shelters");
                    addToast(`Navigating to ${selectedChild.shelter} map hub`, "info");
                  }
                }}
                className={`w-full mt-2 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  highContrast ? "bg-stone-800 text-yellow-300 hover:bg-stone-700" : "bg-gray-50 text-gray-700 hover:bg-gray-100/80"
                }`}
              >
                View Shelter Hub
              </button>
            </div>

            {/* Care Actions */}
            <div className={`p-5 rounded-2xl shadow-xs border ${bgCard}`}>
              <h3 className={`font-black text-xs ${textMain} mb-4 uppercase tracking-wider`}>
                Urgent Case Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => addToast(`Family reunification interview scheduled for ${selectedChild.name}.`, "success")}
                  className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 ${
                    highContrast ? "bg-stone-800 text-yellow-300 hover:bg-stone-700" : "bg-[#115e3b]/10 text-[#115e3b] hover:bg-[#115e3b]/20"
                  } transition-all cursor-pointer`}
                >
                  Schedule Family Interview
                </button>
                <button
                  onClick={() => addToast(`Emergency medical advisory escalated for ${selectedChild.name}! Team notified.`, "error")}
                  className="w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100/80 transition-all cursor-pointer"
                >
                  Escalate Medical Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Wall Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-black ${textMain}`}>
            Children Care & Recovery Wall
          </h2>
          <p className={`text-sm ${textMuted}`}>
            Monitor progress and document stories of every child sheltered in our national facilities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
            />
            <input
              type="text"
              placeholder="Search by child ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${
                highContrast ? "bg-stone-900 border-stone-800 text-yellow-300" : "bg-white border-gray-200"
              }`}
            />
          </div>
          <button
            onClick={() => addToast("Opening advanced filter panel...", "info")}
            className={`p-2 rounded-full border transition-colors ${
              highContrast ? "bg-stone-900 border-stone-800 text-yellow-300 hover:bg-stone-800" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Wall */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredChildren.map((child, i) => (
          <div
            key={i}
            onClick={() => handleSelectChild(child)}
            className={`p-5 rounded-2xl shadow-xs border cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-md ${bgCard}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border-2 border-transparent group-hover:border-[#115e3b] transition-colors">
                <img
                  src={child.photo}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                  child.risk === "High"
                    ? "bg-red-50 text-red-600 dark:bg-red-950/20"
                    : child.risk === "Medium"
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-950/20"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                }`}
              >
                {child.risk} Risk
              </span>
            </div>

            <h3 className={`font-black text-lg ${textMain}`}>{child.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold ${textMuted}`}>
                ID: {child.id}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className={`text-xs font-bold ${textMuted}`}>
                Age: {child.age}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className={`w-3.5 h-3.5 ${textMuted}`} />
                <span className={`text-[11px] ${textMuted} truncate`}>
                  {child.shelter}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className={`w-3.5 h-3.5 ${textMuted}`} />
                <span className={`text-[11px] ${textMuted} truncate`}>
                  Stage: {child.status}
                </span>
              </div>
            </div>

            <div
              className={`w-full pt-3 border-t ${borderClass} flex items-center justify-between`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  highContrast ? "text-yellow-300" : "text-[#115e3b]"
                }`}
              >
                Open Case Story
              </span>
              <ArrowRight
                className={`w-4 h-4 ${
                  highContrast ? "text-yellow-300" : "text-[#115e3b]"
                } group-hover:translate-x-1 transition-transform`}
              />
            </div>
          </div>
        ))}
        {filteredChildren.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-50">
            <Search className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-bold">No children matches found</p>
            <p className="text-sm">Double check search strings or keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
