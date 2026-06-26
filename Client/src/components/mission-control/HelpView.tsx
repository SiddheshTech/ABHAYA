import React, { useState } from "react";
import {
  Search,
  BookOpen,
  MessageSquare,
  LifeBuoy,
  FileText,
  Map,
  Users,
  Zap,
  Shield,
  HelpCircle,
  PhoneCall,
  PlaySquare,
  Bug,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Activity,
} from "lucide-react";
import { useToastStore } from "../../lib/store";

export default function HelpView({ highContrast }: { highContrast?: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Documentation");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const { addToast } = useToastStore();

  const bgCard = highContrast
    ? "bg-stone-900 border-stone-800"
    : "bg-white border-gray-200 shadow-sm";
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const textMuted = highContrast ? "text-gray-400" : "text-gray-500";
  const inputBg = highContrast
    ? "bg-stone-950 border-stone-800"
    : "bg-gray-50 border-gray-200";

  const handleSubmitTicket = () => {
    setShowTicketModal(false);
    addToast("Support ticket submitted successfully.", "success");
  };

  const categories = [
    { id: "Documentation", icon: BookOpen, label: "Documentation" },
    { id: "FAQs", icon: HelpCircle, label: "FAQs" },
    { id: "Support", icon: LifeBuoy, label: "Support Center" },
    { id: "Tours", icon: PlaySquare, label: "Guided Tours" },
    { id: "Report", icon: Bug, label: "Report Issue" },
    { id: "Status", icon: Activity, label: "System Status" },
  ];

  // For fixing Lucide Activity icon missing import, I'll just use Zap
  const categoriesFixed = [
    { id: "Documentation", icon: BookOpen, label: "Documentation" },
    { id: "FAQs", icon: HelpCircle, label: "FAQs" },
    { id: "Support", icon: LifeBuoy, label: "Support Center" },
    { id: "Tours", icon: PlaySquare, label: "Guided Tours" },
    { id: "Report", icon: Bug, label: "Report Issue" },
    { id: "Status", icon: Zap, label: "System Status" },
  ];

  const docs = [
    {
      icon: Map,
      title: "Mission Dashboard",
      desc: "Overview of central command",
    },
    { icon: Users, title: "Operations & Teams", desc: "Managing personnel" },
    {
      icon: AlertTriangle,
      title: "Emergency Mode",
      desc: "Triggering red alerts",
    },
    { icon: Shield, title: "Security & Access", desc: "Managing roles" },
  ];

  const faqs = [
    {
      q: "How do I deploy a drone team?",
      a: "Navigate to Team Command, select an available drone from the left panel, and click 'Deploy'.",
    },
    {
      q: "What triggers an auto-Red Alert?",
      a: "The AI Copilot will trigger a Red Alert if telemetry detects anomalies matching critical incident profiles.",
    },
    {
      q: "How do I reset my API key?",
      a: "Go to Settings > Security Center > API Keys and select 'Rotate Key'.",
    },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <div>
          <h2 className={`text-2xl font-black ${textMain} tracking-tight`}>
            Help & Support Center
          </h2>
          <p
            className={`text-xs uppercase tracking-widest ${textMuted} font-bold mt-1`}
          >
            Enterprise Command Documentation
          </p>
        </div>
        <div className="relative w-72">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`}
          />
          <input
            type="text"
            placeholder="Search docs, FAQs, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-[#115e3b] outline-none transition-all ${textMain}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 relative z-10">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
          {categoriesFixed.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${
                activeCategory === cat.id
                  ? highContrast
                    ? "bg-stone-800 text-yellow-300 ring-1 ring-stone-700"
                    : "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                  : `hover:bg-gray-100 dark:hover:bg-stone-800 ${textMuted}`
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}

          <div
            className={`mt-auto p-4 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-900" : "border-blue-100 bg-blue-50"} flex flex-col items-center text-center`}
          >
            <PhoneCall
              className={`w-6 h-6 mb-2 ${highContrast ? "text-yellow-300" : "text-blue-600"}`}
            />
            <h4 className={`text-sm font-bold ${textMain} mb-1`}>
              Emergency Support
            </h4>
            <p className={`text-xs ${textMuted} mb-3`}>
              24/7 Regional Operations Center
            </p>
            <button
              onClick={() =>
                addToast(
                  "Initiating secure call to regional operations center...",
                  "info",
                )
              }
              className={`w-full py-2 rounded-lg font-bold text-xs ${highContrast ? "bg-yellow-300 text-black" : "bg-blue-600 text-white hover:bg-blue-700"} transition-colors`}
            >
              Call +1-800-COMMAND
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={`col-span-12 md:col-span-9 p-6 rounded-2xl border ${bgCard} shadow-sm overflow-y-auto max-h-[70vh]`}
        >
          {activeCategory === "Documentation" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3
                className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
              >
                Official Documentation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map((doc, i) => (
                  <a
                    href="#"
                    key={i}
                    className={`p-4 rounded-xl border ${highContrast ? "border-stone-800 hover:bg-stone-800" : "border-gray-200 hover:bg-gray-50"} transition-all group flex items-start gap-4`}
                  >
                    <div
                      className={`p-2 rounded-lg ${highContrast ? "bg-stone-900 text-yellow-300" : "bg-blue-50 text-blue-600"}`}
                    >
                      <doc.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-sm font-bold ${textMain} group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors`}
                      >
                        {doc.title}
                      </h4>
                      <p className={`text-xs ${textMuted} mt-1`}>{doc.desc}</p>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 ${textMuted} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "FAQs" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3
                className={`text-lg font-black ${textMain} border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
              >
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${highContrast ? "border-stone-800" : "border-gray-200"}`}
                  >
                    <h4
                      className={`text-sm font-bold ${textMain} mb-2 flex items-start gap-2`}
                    >
                      <HelpCircle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${highContrast ? "text-yellow-300" : "text-blue-500"}`}
                      />
                      {faq.q}
                    </h4>
                    <p className={`text-sm ${textMuted} pl-6`}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "Support" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div
                className={`flex justify-between items-center border-b ${highContrast ? "border-stone-800" : "border-gray-100"} pb-4`}
              >
                <h3 className={`text-lg font-black ${textMain}`}>
                  Support Center
                </h3>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${highContrast ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-blue-600 text-white hover:bg-blue-700"} transition-colors`}
                >
                  Raise Support Ticket
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`p-6 rounded-xl border ${highContrast ? "border-stone-800 bg-stone-950" : "border-gray-200 bg-gray-50"} text-center flex flex-col items-center justify-center min-h-[200px]`}
                >
                  <MessageSquare className={`w-8 h-8 mb-3 ${textMuted}`} />
                  <h4 className={`text-sm font-bold ${textMain} mb-1`}>
                    Live Chat
                  </h4>
                  <p className={`text-xs ${textMuted} mb-4`}>
                    Connect with an operations specialist
                  </p>
                  <button
                    onClick={() =>
                      addToast("Connecting to operations specialist...", "info")
                    }
                    className={`px-4 py-2 rounded-lg border ${highContrast ? "border-stone-700 hover:bg-stone-800" : "border-gray-300 hover:bg-white"} text-sm font-bold transition-colors`}
                  >
                    Start Chat
                  </button>
                </div>
                <div
                  className={`p-6 rounded-xl border ${highContrast ? "border-stone-800" : "border-gray-200"}`}
                >
                  <h4 className={`text-sm font-bold ${textMain} mb-4`}>
                    Recent Tickets
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`block text-xs font-bold ${textMain}`}>
                          TKT-9923: Maps not loading
                        </span>
                        <span className={`block text-[10px] ${textMuted}`}>
                          Updated 2 hrs ago
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-bold rounded uppercase">
                        In Progress
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`block text-xs font-bold ${textMain}`}>
                          TKT-9901: Audio issues in dispatch
                        </span>
                        <span className={`block text-[10px] ${textMuted}`}>
                          Updated 2 days ago
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase">
                        Resolved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeCategory === "Tours" ||
            activeCategory === "Report" ||
            activeCategory === "Status") && (
            <div className="flex flex-col items-center justify-center h-64 animate-in fade-in text-center">
              {React.createElement(
                categoriesFixed.find((c) => c.id === activeCategory)?.icon ||
                  Zap,
                { className: `w-12 h-12 mb-4 opacity-20 ${textMain}` },
              )}
              <h3 className={`text-lg font-black ${textMain} mb-2`}>
                {activeCategory} Module
              </h3>
              <p className={`text-sm ${textMuted} max-w-sm`}>
                This enterprise module is currently syncing with global command.
                Full capabilities will be available shortly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl ${highContrast ? "bg-stone-900 border border-stone-800" : "bg-white"}`}
          >
            <div
              className={`p-4 border-b ${highContrast ? "border-stone-800" : "border-gray-100"} flex justify-between items-center`}
            >
              <h3 className={`text-lg font-black ${textMain}`}>
                Raise Support Ticket
              </h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors ${textMuted}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                >
                  Priority Level
                </label>
                <select
                  className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-blue-500 outline-none ${textMain}`}
                >
                  <option>Low - General Query</option>
                  <option>Medium - Minor Issue</option>
                  <option>High - System Degradation</option>
                  <option>Critical - Complete Outage</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                >
                  Issue Subject
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-blue-500 outline-none ${textMain}`}
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider ${textMuted} mb-1.5`}
                >
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide steps to reproduce..."
                  className={`w-full p-2.5 rounded-xl border ${inputBg} text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none ${textMain}`}
                ></textarea>
              </div>
              <button
                onClick={handleSubmitTicket}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${highContrast ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
