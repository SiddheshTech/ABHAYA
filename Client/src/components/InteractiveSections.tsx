import React, { useState } from "react";
import { Language, translations } from "../data/translations";
import { PortalActiveTab, ChildCase, GrievanceReport, FosterRegistration, PapsSubPage, GuidelinesSubPage, GrievanceSubPage } from "../types";
import ActsAndRulesSection from "./ActsAndRulesSection";
import PapsSection from "./PapsSection";
import GuidelinesSection from "./GuidelinesSection";
import { 
  Users, MapPin, Search, Calendar, FileText, CheckCircle, 
  User, ShieldAlert, Award, AlertTriangle, Send, RefreshCw, 
  Heart, Calculator, Download, Plus, Check, Compass, Eye,
  ShieldCheck, FileWarning, ClipboardList, BookOpen, Activity, AlertOctagon
} from "lucide-react";
import { useToastStore } from "../lib/store";

interface InteractiveSectionsProps {
  lang: Language;
  activeTab: PortalActiveTab;
  setActiveTab: (tab: PortalActiveTab) => void;
  activePapsSubPage: PapsSubPage;
  setActivePapsSubPage: (page: PapsSubPage) => void;
  activeGuidelinesSubPage: GuidelinesSubPage;
  setActiveGuidelinesSubPage: (page: GuidelinesSubPage) => void;
  activeGrievanceSubPage: GrievanceSubPage;
  setActiveGrievanceSubPage: (page: GrievanceSubPage) => void;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

// Initial Mock Child Database for TrackChild
const initialChildDatabase: ChildCase[] = [
  { id: "MV-3928", name: "Aarav Sharma", gender: "Male", age: 9, missingFrom: "Haridwar, Uttarakhand", missingDate: "2026-04-12", status: "Recovered", state: "Uttarakhand", reportingOfficer: "Insp. S. Negi" },
  { id: "MV-8102", name: "Priya Patel", gender: "Female", age: 7, missingFrom: "Mehsana, Gujarat", missingDate: "2026-05-19", status: "In Rehabilitation", state: "Gujarat", reportingOfficer: "Sub-Insp. K. Parmar" },
  { id: "MV-4421", name: "Rahul Kumar", gender: "Male", age: 11, missingFrom: "Patna, Bihar", missingDate: "2026-02-05", status: "Missing", state: "Bihar", reportingOfficer: "Insp. R. Paswan" },
  { id: "MV-5091", name: "Ananya Das", gender: "Female", age: 5, missingFrom: "Howrah, West Bengal", missingDate: "2026-06-01", status: "Recovered", state: "West Bengal", reportingOfficer: "Officer M. Bose" },
  { id: "MV-6771", name: "Aditya Hegde", gender: "Male", age: 12, missingFrom: "Hubli, Karnataka", missingDate: "2026-03-24", status: "Missing", state: "Karnataka", reportingOfficer: "Insp. T. Gowda" },
  { id: "MV-1290", name: "Kajal Meena", gender: "Female", age: 10, missingFrom: "Alwar, Rajasthan", missingDate: "2026-05-30", status: "Missing", state: "Rajasthan", reportingOfficer: "Sub-Insp. J. Singh" },
];

export default function InteractiveSections({
  lang,
  activeTab,
  setActiveTab,
  activePapsSubPage,
  setActivePapsSubPage,
  activeGuidelinesSubPage,
  setActiveGuidelinesSubPage,
  activeGrievanceSubPage,
  setActiveGrievanceSubPage,
  highContrast,
  textSize,
}: InteractiveSectionsProps) {
  const t = translations[lang];
  const { addToast } = useToastStore();

  // Sizing styles
  const textClass = textSize === "large" ? "text-lg" : textSize === "extra-large" ? "text-xl" : "text-sm";
  const headingClass = textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-xl font-bold";

  // State Management for Interactive sections
  const [childSearchQuery, setChildSearchQuery] = useState("");
  const [queriedChildren, setQueriedChildren] = useState<ChildCase[]>(initialChildDatabase);
  const [hasSearched, setHasSearched] = useState(false);



  // Grievance filing state
  const [gName, setGName] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gPhone, setGPhone] = useState("");
  const [gState, setGState] = useState("");
  const [gDist, setGDist] = useState("");
  const [gSubject, setGSubject] = useState("");
  const [gDesc, setGDesc] = useState("");
  const [filedGrievances, setFiledGrievances] = useState<GrievanceReport[]>([]);
  const [grievanceSearchId, setGrievanceSearchId] = useState("");
  const [checkedGrievance, setCheckedGrievance] = useState<GrievanceReport | null>(null);

  // Missing child reporter tool state
  const [mName, setMName] = useState("");
  const [mAge, setMAge] = useState("");
  const [mGender, setMGender] = useState("Male");
  const [mPlace, setMPlace] = useState("");
  const [mDate, setMDate] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);



  // Statistics
  const statistics = [
    { title: t.childrenTracked, value: "1,42,891", change: "+14.3%", icon: Users, color: "bg-blue-500/10 text-blue-600" },
    { title: t.activeFosterHomes, value: "18,490", change: "+8.2%", icon: Heart, color: "bg-red-500/10 text-red-600" },
    { title: t.rehabilitated, value: "94,208", change: "+11.1%", icon: CheckCircle, color: "bg-green-500/10 text-green-600" },
    { title: t.casesSolved, value: "98.4%", change: "+0.5%", icon: Award, color: "bg-amber-500/10 text-amber-600" },
  ];

  // Handle Child Search
  const handleChildSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!childSearchQuery.trim()) {
      setQueriedChildren(initialChildDatabase);
      return;
    }
    const filtered = initialChildDatabase.filter(
      (child) =>
        child.id.toLowerCase().includes(childSearchQuery.toLowerCase()) ||
        child.name.toLowerCase().includes(childSearchQuery.toLowerCase()) ||
        child.state.toLowerCase().includes(childSearchQuery.toLowerCase())
    );
    setQueriedChildren(filtered);
  };

  // Handle Grievance File Submit
  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gName || !gEmail || !gPhone || !gSubject) return;

    const randomID = "MV-GR-" + Math.floor(100000000 + Math.random() * 900000000);
    const newGrievance: GrievanceReport = {
      id: randomID,
      name: gName,
      email: gEmail,
      phone: gPhone,
      state: gState || "N/A",
      district: gDist || "N/A",
      subject: gSubject,
      description: gDesc,
      status: "Submitted",
      submissionDate: new Date().toISOString().split("T")[0]
    };

    setFiledGrievances([newGrievance, ...filedGrievances]);
    addToast(lang === "en" ? `Grievance registered successfully! Your tracking ID is: ${randomID}` : `शिकायत सफलतापूर्वक दर्ज की गई! आपकी ट्रैकिंग आईडी है: ${randomID}`, "success");
    
    // Clear inputs
    setGName("");
    setGEmail("");
    setGPhone("");
    setGState("");
    setGDist("");
    setGSubject("");
    setGDesc("");
  };

  // Check grievance status
  const handleCheckGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const found = filedGrievances.find(g => g.id.trim().toLowerCase() === grievanceSearchId.trim().toLowerCase());
    
    // If not found in dynamic state, check if they typed a mock default one or search
    if (found) {
      setCheckedGrievance(found);
    } else {
      // Mock random answer if they type something to make it look active
      if (grievanceSearchId.startsWith("MV-GR-")) {
        setCheckedGrievance({
          id: grievanceSearchId,
          name: "Anonymous Citizen",
          email: "citizen@example.com",
          phone: "91XXXXXX",
          state: "Delhi",
          district: "New Delhi",
          subject: "Inquiry on childcare shelters",
          description: "Details regarding child care guidelines implementation.",
          status: "Reviewing",
          submissionDate: "2026-06-18"
        });
      } else {
        setCheckedGrievance(null);
      }
    }
  };

  // Missing Child Submission Alert
  const handleReportMissing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mAge || !mPlace) return;

    const randomChildID = "MV-" + Math.floor(1000 + Math.random() * 9000);
    const newCase: ChildCase = {
      id: randomChildID,
      name: mName,
      gender: mGender as any,
      age: parseInt(mAge) || 8,
      missingFrom: mPlace,
      missingDate: mDate || new Date().toISOString().split("T")[0],
      status: "Missing",
      state: "State Level",
      reportingOfficer: `Assigned on Duty (${reporterName})`
    };

    initialChildDatabase.unshift(newCase);
    setQueriedChildren([...initialChildDatabase]);
    setReportSuccess(true);
    
    // reset
    setMName("");
    setMAge("");
    setMPlace("");
    setMDate("");
    setReporterName("");
    setReporterPhone("");
  };

  return (
    <div className={`w-full ${activeTab === PortalActiveTab.ACT_AND_RULES ? "max-w-none px-4 md:px-12" : "max-w-7xl mx-auto px-4 md:px-8"} py-8 transition-all duration-300 ${highContrast ? "bg-black text-yellow-300" : "bg-gray-50/50"}`}>
      
      {/* Dynamic Heading based on high-level state */}
      <div className="mb-6 border-b pb-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
            {lang === "en" ? "ABHAYA" : "अभया"} ● PORTAL SERVICES
          </span>
          <h2 className={`${headingClass} capitalize ${highContrast ? "text-yellow-300" : "text-gray-900"}`}>
            {activeTab === PortalActiveTab.HOME && (lang === "en" ? "Overview & Analytics" : "अवलोकन और विश्लेषिकी")}
            {activeTab === PortalActiveTab.ACT_AND_RULES && (lang === "en" ? "Constitutional Acts and Welfare Rules" : "संवैधानिक अधिनियम और कल्याण नियम")}
            {activeTab === PortalActiveTab.PAPS && (lang === "en" ? "Prospective Adoptive Parents (PAPs) Portal" : "भावी दत्तक माता-पिता (PAPs) पोर्टल")}
            {activeTab === PortalActiveTab.GUIDELINES && (lang === "en" ? "Implementation Guidelines" : "कार्यान्वयन दिशानिर्देश")}
            {activeTab === PortalActiveTab.BEST_PRACTICES && (lang === "en" ? "National Best Practices Showcase" : "राष्ट्रीय सर्वोत्तम प्रथाएं")}
            {activeTab === PortalActiveTab.GRIEVANCE && (lang === "en" ? "National Grievance Redressal Registry" : "राष्ट्रीय शिकायत निवारण रजिस्ट्री")}
            {activeTab === PortalActiveTab.MEDIA && (lang === "en" ? "Press Releases & Gallery" : "प्रेस विज्ञप्ति और गैलरी")}
            {activeTab === PortalActiveTab.CITIZEN_CORNER && (lang === "en" ? "Citizen Corner & Feedback" : "नागरिक कॉर्नर और प्रतिक्रिया")}
            {activeTab === PortalActiveTab.TRACK_CHILD && (lang === "en" ? "Integrated Child Protection Tracking System (TrackChild)" : "एकीकृत बाल संरक्षण ट्रैकिंग प्रणाली (TrackChild)")}
            {activeTab === PortalActiveTab.PM_CARES && (lang === "en" ? "PM CARES for Children Assistance Portal" : "बच्चों के लिए पीएम केयर्स सहायता पोर्टल")}
            {activeTab === PortalActiveTab.RELATED_LINK && (lang === "en" ? "Related Government Directories" : "संबंधित सरकारी निर्देशिकाएँ")}
            {activeTab === PortalActiveTab.CONTACT_US && (lang === "en" ? "Contact Department Desk & Support" : "विभाग डेस्क और सहायता से संपर्क करें")}
          </h2>
        </div>

        {/* Back to Home Button if not in Home view */}
        {activeTab !== PortalActiveTab.HOME && (
          <button 
            onClick={() => setActiveTab(PortalActiveTab.HOME)}
            className={`px-4 py-1.5 text-xs font-bold rounded-md border ${
              highContrast 
                ? "border-yellow-300 hover:bg-yellow-300 hover:text-black" 
                : "border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            ← {lang === "en" ? "Back to Dashboard" : "वापस मुख्य पृष्ठ"}
          </button>
        )}
      </div>

      {/* =================================_________ */}
      {/* 1. HOME VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.HOME && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statistics.map((stat, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-xl border flex items-center justify-between transition-all hover:shadow-xs ${
                  highContrast 
                    ? "bg-stone-900 border-yellow-300 text-yellow-300"
                    : "bg-white border-gray-100 shadow-xs"
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className={`text-2xl mt-1.5 font-extrabold ${highContrast ? "text-yellow-300" : "text-gray-900"}`}>{stat.value}</p>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {stat.change} vs Last Year
                  </span>
                </div>
                <div className={`p-3.5 rounded-lg ${highContrast ? "bg-stone-800" : stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick action 1: Calculator */}
            <div 
              onClick={() => setActiveTab(PortalActiveTab.PAPS)}
              className={`p-6 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] flex gap-4 ${
                highContrast ? "bg-stone-900 border-yellow-300" : "bg-linear-to-br from-amber-50 to-orange-50 border-orange-100"
              }`}
            >
              <div className="p-3 bg-amber-500 text-white rounded-lg h-12 w-12 flex items-center justify-center shrink-0 shadow-sm">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-base">{lang === "en" ? "Adoption Eligibility Checker" : "दत्तक ग्रहण पात्रता कैलकुलेटर"}</h3>
                <p className="text-xs text-gray-600 mt-1 lines-clamp-3">
                  {lang === "en" ? "Are you planning to adopt? Input parameters to analyze marital, income, and age constraints online." : "क्या आप गोद लेने की योजना बना रहे हैं? वैवाहिक, आय और आयु सीमाओं का ऑनलाइन विश्लेषण करें।"}
                </p>
                <span className="inline-block text-amber-700 text-xs font-semibold mt-3">Try Tool →</span>
              </div>
            </div>

            {/* Quick action 2: Track child status */}
            <div 
              onClick={() => setActiveTab(PortalActiveTab.TRACK_CHILD)}
              className={`p-6 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] flex gap-4 ${
                highContrast ? "bg-stone-900 border-yellow-300" : "bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100"
              }`}
            >
              <div className="p-3 bg-blue-500 text-white rounded-lg h-12 w-12 flex items-center justify-center shrink-0 shadow-sm">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-base">{lang === "en" ? "TrackChild Search Registry" : "ट्रैकचाइल्ड खोज रजिस्ट्री"}</h3>
                <p className="text-xs text-gray-600 mt-1 lines-clamp-3">
                  {lang === "en" ? "Instant lookup for matching child codes. Check recovery status, reporting agencies, and submit notifications." : "मिलान करने वाले बाल कोड के लिए त्वरित लुकअप। पुनर्प्राप्ति स्थिति और रिपोर्टिंग एजेंसियों की जांच करें।"}
                </p>
                <span className="inline-block text-blue-700 text-xs font-semibold mt-3">Search Child ID →</span>
              </div>
            </div>

            {/* Quick action 3: Lodged status */}
            <div 
              onClick={() => setActiveTab(PortalActiveTab.GRIEVANCE)}
              className={`p-6 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] flex gap-4 ${
                highContrast ? "bg-stone-900 border-yellow-300" : "bg-linear-to-br from-red-50 to-rose-50 border-red-100"
              }`}
            >
              <div className="p-3 bg-red-500 text-white rounded-lg h-12 w-12 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-base">{lang === "en" ? "Lodge Urgent Grievance" : "तत्काल शिकायत दर्ज करें"}</h3>
                <p className="text-xs text-gray-600 mt-1 lines-clamp-3">
                  {lang === "en" ? "Lodge or investigate grievance progress. State-level monitors act synchronously for child safety issues." : "शिकायत प्रगति दर्ज करें या जांचें। राज्य स्तर के मॉनिटर बाल सुरक्षा मुद्दों के लिए प्रतिक्रिया करते हैं।"}
                </p>
                <span className="inline-block text-red-700 text-xs font-semibold mt-3">File Grievance →</span>
              </div>
            </div>
          </div>

          {/* Interactive State-Wise Statistics Grid / SVG graphical charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left 3 columns: Interactive Analytics chart */}
            <div className={`p-6 rounded-xl border lg:col-span-3 ${
              highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-xs"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {lang === "en" ? "State-wise Recovery Outcomes (2026)" : "राज्य-वार पुनर्प्राप्ति परिणाम (2026)"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Top performing states in ABHAYA support networks</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-xs" />
                    <span>Recovered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded-xs" />
                    <span>In Rehab</span>
                  </div>
                </div>
              </div>

              {/* Graphic Representation bar chart */}
              <div className="space-y-4">
                {[
                  { state: "Uttar Pradesh", recovered: 12400, rehab: 5900, total: 18300 },
                  { state: "Maharashtra", recovered: 10200, rehab: 4800, total: 15000 },
                  { state: "Gujarat", recovered: 9100, rehab: 3200, total: 12300 },
                  { state: "West Bengal", recovered: 8500, rehab: 6100, total: 14600 },
                  { state: "Karnataka", recovered: 7800, rehab: 2900, total: 10700 },
                  { state: "Rajasthan", recovered: 6400, rehab: 4100, total: 10500 },
                ].map((item, i) => {
                  const maxTotal = 19000;
                  const recoveredPct = (item.recovered / maxTotal) * 100;
                  const rehabPct = (item.rehab / maxTotal) * 100;

                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs font-bold w-24 truncate text-gray-600">{item.state}</span>
                      <div className="w-full bg-gray-100 dark:bg-stone-800 rounded-full h-4 relative flex overflow-hidden">
                        <div 
                          style={{ width: `${recoveredPct}%` }} 
                          className="bg-emerald-500 h-full transition-all"
                          title={`Recovered: ${item.recovered}`}
                        />
                        <div 
                          style={{ width: `${rehabPct}%` }} 
                          className="bg-amber-400 h-full transition-all"
                          title={`In Rehab: ${item.rehab}`}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-500 w-14 text-right">
                        {(item.recovered + item.rehab).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t mt-6 pt-4 text-center">
                <span className="text-[11px] text-gray-400">
                  ⚠️ This represent provisional statistics calculated on continuous dynamic DCPU integration updates.
                </span>
              </div>
            </div>

            {/* Right 2 columns: Mission info & Video tutorial link */}
            <div className={`p-6 rounded-xl border lg:col-span-2 flex flex-col justify-between ${
              highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-xs"
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 bg-rose-500/10 text-rose-600 rounded-md">
                    <Compass className="w-5 h-5" />
                  </span>
                  <h3 className="font-bold text-gray-900 text-base">{lang === "en" ? "Mission Statement" : "मिशन वक्तव्य"}</h3>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed">
                  {lang === "en" ? (
                    "ABHAYA child protection services scheme was launched to align with child welfare targets, build responsive safety pipelines, support children in distress environments, restore family links, and provide educational aid via robust collaborative frameworks."
                  ) : (
                    "बाल संरक्षण सेवाओं की योजना को बाल कल्याण लक्ष्यों के साथ संरेखित करने, संकटपूर्ण वातावरण में बच्चों का समर्थन करने, पारिवारिक संबंधों को बहाल करने और मजबूत सहयोगी ढांचे के माध्यम से शैक्षिक सहायता प्रदान करने के लिए शुरू किया गया था।"
                  )}
                </p>

                <div className="space-y-2 mt-4">
                  {[
                    "Decentralized operations with state-level child safety panels.",
                    "Strengthening foster care regulatory mechanisms (CARA, SAA).",
                    "Emergency help desk with instant tracking updates.",
                    "Sponsorship assistance policies."
                  ].map((bullet, k) => (
                    <div key={k} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <button 
                  onClick={() => setActiveTab(PortalActiveTab.GUIDELINES)}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 border text-gray-800 text-xs font-bold rounded-lg transition-all"
                >
                  {lang === "en" ? "Explore Digital Resource Center" : "डिजिटल संसाधन केंद्र देखें"}
                </button>
              </div>
            </div>

          </div>

          {/* Interactive FAQs */}
          <div className="mt-8">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4 text-center">
              {lang === "en" ? "Frequently Asked Questions (FAQ)" : "अक्सर पूछे जाने वाले प्रश्न (FAQ)"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: lang === "en" ? "What is the primary role of ABHAYA?" : "अभया (ABHAYA) की प्राथमिक भूमिका क्या है?",
                  a: lang === "en" ? "ABHAYA acts as an umbrella scheme for child protection and welfare initiatives of India, supporting foster systems, juvenile justice frameworks, and safety guidelines implementation." : "अभया (ABHAYA) भारत के बाल संरक्षण और कल्याण पहलों के लिए एक प्रमुख योजना के रूप में कार्य करता है, जो पालक प्रणालियों, किशोर न्याय ढांचे और सुरक्षा दिशानिर्देशों के कार्यान्वयन का समर्थन करता है।"
                },
                {
                  q: lang === "en" ? "Who are PAPs under CARA guidelines?" : "कारा दिशानिर्देशों के तहत भावी दत्तक माता-पिता (PAPs) कौन हैं?",
                  a: lang === "en" ? "Prospective Adoptive Parents are individuals registered legally for child adoption through authorized portals. Track parameters under our calculator panel." : "भावी दत्तक माता-पिता राष्ट्रीय दत्तक प्राधिकरण (CARA) के माध्यम से बच्चे को गोद लेने के लिए कानूनी रूप से पंजीकृत व्यक्ति हैं।"
                },
                {
                  q: lang === "en" ? "How can I report a child who is lost or missing?" : "मैं खोए हुए बच्चे की रिपोर्ट कैसे कर सकता हूँ?",
                  a: lang === "en" ? "Visit the TrackChild section. Submit verified information including age, state, and reporting guardian contact details. This propagates alerts instantly to regional police coordinators." : "ट्रैकचाइल्ड अनुभाग पर जाएँ। आयु, राज्य और रिपोर्टिंग अभिभावक के संपर्क विवरण सहित सत्यापित जानकारी जमा करें।"
                },
                {
                  q: lang === "en" ? "Can single males register for adoption?" : "क्या एकल पुरुष गोद लेने के लिए पंजीकरण कर सकते हैं?",
                  a: lang === "en" ? "Under current Indian CARA regulations, single males are not eligible to adopt a female child. Single females are fully eligible to adopt children of any gender." : "वर्तमान भारतीय कारा नियमों के तहत एकल पुरुष बालिका को गोद लेने के पात्र नहीं हैं। एकल महिलाएं किसी भी लिंग के बच्चे को गोद ले सकती हैं।"
                }
              ].map((faq, index) => (
                <div key={index} className={`p-4 rounded-lg border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-2xs"}`}>
                  <h4 className="font-bold text-sm text-amber-800 flex items-start gap-1.5">
                    <span>Q:</span> {faq.q}
                  </h4>
                  <p className="text-xs text-gray-600 mt-2 pl-4 leading-normal">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =================================_________ */}
      {/* 2. ACT AND RULES VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.ACT_AND_RULES && (
        <ActsAndRulesSection lang={lang} highContrast={highContrast} setActiveTab={setActiveTab} />
      )}

      {/* ========================================== */}
      {/* 3. PAPS VIEW & CONSTRAINTS */}
      {/* ========================================== */}
      {activeTab === PortalActiveTab.PAPS && (
        <PapsSection lang={lang} highContrast={highContrast} setActiveTab={setActiveTab} subPage={activePapsSubPage} setSubPage={setActivePapsSubPage} />
      )}

      {/* ========================================== */}
      {/* 4. GUIDELINES VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.GUIDELINES && (
        <GuidelinesSection lang={lang} highContrast={highContrast} setActiveTab={setActiveTab} subPage={activeGuidelinesSubPage} setSubPage={setActiveGuidelinesSubPage} />
      )}

      {/* =================================_________ */}
      {/* 5. BEST PRACTICES VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.BEST_PRACTICES && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-gray-900">National Award Showcases & Case Studies</h3>
            <p className="text-xs text-gray-500 mt-1">
              Highlighting district child welfare units demonstrating exemplary results in Rehabilitation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="text-2xl font-black text-amber-600 mb-1">45+</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Districts Awarded</div>
            </div>
            <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="text-2xl font-black text-emerald-600 mb-1">12,500</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Children Rehabilitated</div>
            </div>
            <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
              <div className="text-2xl font-black text-blue-600 mb-1">99%</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Audit Compliance</div>
            </div>
          </div>

          {[
            {
              district: "Mehsana, Gujarat",
              award: "Presidents Excellence Badge for Foster Integration",
              study: "Zero Institution Waiting Loop Model",
              description: "Through collaborative local community drives, Mehsana district transitioned 85% of institutionalized orphaned infants into loving foster care structures within record six month bounds, demonstrating efficient social mobilization.",
              outcome: "98.7% stable HSR study outcome rating."
            },
            {
              district: "Haridwar, Uttarakhand",
              award: "National Award for Dynamic Reconciliation",
              study: "Rapid State-Border TrackChild System",
              description: "Utilizing immediate notification structures, dynamic emergency coordination, and integrated police desk lines, Haridwar reconciled and recovered 451 missing children within year 2025 bounds using the TrackChild platform.",
              outcome: "Median response time reduced under 4 hours."
            },
            {
              district: "Hubli, Karnataka",
              award: "Inclusive Welfare Platform Distinction",
              study: "Digital Counseling Center Initiative",
              description: "Set up localized multi-lingual youth psychotherapist and social worker clinics inside urban high-risk circles, boosting emotional recovery quotients and providing immediate access to PM CARES educational grants.",
              outcome: "Supported 1,200+ distressed children."
            },
            {
              district: "Ernakulam, Kerala",
              award: "Best Post-Adoption Follow-up Program",
              study: "Continuous Digital Monitoring System",
              description: "Implemented a streamlined process using a custom dashboard to track and record post-placement monitoring for in-country adoptions. This enabled 100% compliance with CARA regulations and early detection of adjustment issues.",
              outcome: "Zero placement disruption over a 3-year period."
            },
            {
              district: "Pune, Maharashtra",
              award: "Innovation in CCI Infrastructure",
              study: "Smart & Green Shelter Transformation",
              description: "Redesigned local Child Care Institutions (CCIs) with eco-friendly infrastructure, solar power, and advanced psychological play-therapy zones, substantially improving the mental health metrics of the residents.",
              outcome: "40% reduction in behavioral incidents among children."
            },
            {
              district: "Ranchi, Jharkhand",
              award: "Rural Child Protection Champion",
              study: "Village Child Protection Committees (VCPC) Empowerment",
              description: "Focused on training and empowering grassroots level VCPCs. Created an alert network that identified and prevented over 300 instances of child trafficking and early marriages in remote villages.",
              outcome: "Community intervention rate increased by 215%."
            },
            {
              district: "Indore, Madhya Pradesh",
              award: "Corporate Partnership Excellence",
              study: "Corporate-Sponsored Vocational Training",
              description: "Bridged the gap between Aftercare youth and employment by partnering with 15 local IT and manufacturing companies to offer dedicated apprenticeships, mentorship, and guaranteed placement schemes.",
              outcome: "85% employment rate for youth exiting care."
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-xl border relative overflow-hidden ${
                highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-white border-gray-100 shadow-2xs"
              }`}
            >
              {/* Decorative side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {item.district}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">
                    🏆 {item.award}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-extrabold text-gray-950 leading-tight">
                  Study: {item.study}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 bg-gray-50 dark:bg-stone-800 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Outcome: {item.outcome}</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* =================================_________ */}
      {/* 6. GRIEVANCE REDRESSAL VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.GRIEVANCE && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveGrievanceSubPage("lodge")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeGrievanceSubPage === "lodge"
                  ? highContrast ? "bg-yellow-300 text-black" : "bg-[#cd201f] text-white"
                  : highContrast ? "bg-stone-800 text-stone-300 border border-stone-600 hover:border-yellow-300" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-[#cd201f]"
              }`}
            >
              Lodge Grievance
            </button>
            <button
              onClick={() => setActiveGrievanceSubPage("track")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeGrievanceSubPage === "track"
                  ? highContrast ? "bg-yellow-300 text-black" : "bg-[#cd201f] text-white"
                  : highContrast ? "bg-stone-800 text-stone-300 border border-stone-600 hover:border-yellow-300" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-[#cd201f]"
              }`}
            >
              Track Status
            </button>
            <button
              onClick={() => setActiveGrievanceSubPage("sop")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeGrievanceSubPage === "sop"
                  ? highContrast ? "bg-yellow-300 text-black" : "bg-[#cd201f] text-white"
                  : highContrast ? "bg-stone-800 text-stone-300 border border-stone-600 hover:border-yellow-300" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-[#cd201f]"
              }`}
            >
              SOP & Workflow
            </button>
            <button
              onClick={() => setActiveGrievanceSubPage("sla")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeGrievanceSubPage === "sla"
                  ? highContrast ? "bg-yellow-300 text-black" : "bg-[#cd201f] text-white"
                  : highContrast ? "bg-stone-800 text-stone-300 border border-stone-600 hover:border-yellow-300" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-[#cd201f]"
              }`}
            >
              SLA & Timelines
            </button>
            <button
              onClick={() => setActiveGrievanceSubPage("whistleblower")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeGrievanceSubPage === "whistleblower"
                  ? highContrast ? "bg-yellow-300 text-black" : "bg-[#cd201f] text-white"
                  : highContrast ? "bg-stone-800 text-stone-300 border border-stone-600 hover:border-yellow-300" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-[#cd201f]"
              }`}
            >
              Whistleblower Protection
            </button>
          </div>

          {activeGrievanceSubPage === "lodge" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* Left 3 columns: Filing form */}
                <div className={`p-6 rounded-xl border lg:col-span-3 ${
                  highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
                }`}>
                  <h3 className="font-extrabold text-[#cd201f] text-base mb-4 border-b pb-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>{lang === "en" ? "Lodge Urgent Portal Grievance" : "तत्काल पोर्टल शिकायत दर्ज करें"}</span>
              </h3>

              <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">YOUR FULL NAME *</label>
                    <input 
                      type="text" 
                      required
                      value={gName}
                      onChange={(e) => setGName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">EMAIL ADDRESS *</label>
                    <input 
                      type="email" 
                      required
                      value={gEmail}
                      onChange={(e) => setGEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">PHONE NUMBER *</label>
                    <input 
                      type="tel" 
                      required
                      value={gPhone}
                      onChange={(e) => setGPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">REGIONAL STATE *</label>
                    <input 
                      type="text" 
                      value={gState}
                      onChange={(e) => setGState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">DISTRICT *</label>
                    <input 
                      type="text" 
                      value={gDist}
                      onChange={(e) => setGDist(e.target.value)}
                      placeholder="e.g. Pune"
                      className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">SUBJECT *</label>
                  <input 
                    type="text" 
                    required
                    value={gSubject}
                    onChange={(e) => setGSubject(e.target.value)}
                    placeholder="e.g. Delay in HSR study report approvals"
                    className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">DETAILED ANALYSIS & EVIDENCE DESC</label>
                  <textarea 
                    rows={4}
                    value={gDesc}
                    onChange={(e) => setGDesc(e.target.value)}
                    placeholder="Provide full brief of child protection or stakeholder grievance parameters..."
                    className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg font-sans"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Lodge Official Grievance</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* New Extensive Content: Key Reporting Categories */}
              <div className={`p-6 rounded-xl border h-full ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
                <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">
                  Grievance Categories
                </h4>
                <div className="space-y-4">
                  <div className="relative overflow-hidden border p-3 rounded-lg bg-gray-50 dark:bg-stone-800">
                    <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">CRITICAL</div>
                    <h5 className="font-bold text-gray-900 text-xs mb-1 mt-1">Child Abuse / Exploitation</h5>
                    <p className="text-[10px] text-gray-600">Physical, emotional, or sexual abuse reported within Child Care Institutions, foster homes, or under community care.</p>
                  </div>
                  <div className="relative overflow-hidden border p-3 rounded-lg bg-gray-50 dark:bg-stone-800">
                    <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">HIGH</div>
                    <h5 className="font-bold text-gray-900 text-xs mb-1 mt-1">Institutional Non-Compliance</h5>
                    <p className="text-[10px] text-gray-600">Failure of CCIs to adhere to Juvenile Justice Act guidelines (e.g. overcrowding, poor nutrition).</p>
                  </div>
                  <div className="relative overflow-hidden border p-3 rounded-lg bg-gray-50 dark:bg-stone-800">
                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">MEDIUM</div>
                    <h5 className="font-bold text-gray-900 text-xs mb-1 mt-1">Administrative Delays</h5>
                    <p className="text-[10px] text-gray-600">Unjustified delays in processing foster care applications or disbursal of funds.</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className={`mt-8 p-6 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-6 border-b pb-2">
              Before You Lodge a Grievance: Preparatory Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-lg border">
                <div className="text-amber-600 mb-3"><BookOpen className="w-5 h-5" /></div>
                <h5 className="font-bold text-gray-900 text-xs mb-2">1. Gather Evidence</h5>
                <p className="text-[10px] text-gray-600">While you can submit a grievance without initial evidence, having photographs, scanned written complaints, or audio recordings significantly expedites the Triage & Registration process.</p>
              </div>
              <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-lg border">
                <div className="text-amber-600 mb-3"><ClipboardList className="w-5 h-5" /></div>
                <h5 className="font-bold text-gray-900 text-xs mb-2">2. Identify the Subject</h5>
                <p className="text-[10px] text-gray-600">Ensure you have the exact name, district, and address of the Child Care Institution (CCI), Specialized Adoption Agency (SAA), or the official against whom the complaint is being lodged.</p>
              </div>
              <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-lg border">
                <div className="text-amber-600 mb-3"><FileWarning className="w-5 h-5" /></div>
                <h5 className="font-bold text-gray-900 text-xs mb-2">3. False Reporting Penalty</h5>
                <p className="text-[10px] text-gray-600">Under the IT Act, filing intentionally fabricated or malicious grievances to harass officials may result in tracking of the IP address and subsequent legal penalization.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeGrievanceSubPage === "track" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lookup card */}
            <div className={`p-6 rounded-xl border ${
              highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
            }`}>
              <h3 className="font-extrabold text-gray-900 text-sm mb-3">Check Grievance Progress</h3>
              
              <form onSubmit={handleCheckGrievance} className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Enter Track ID (e.g., MV-GR-392812)"
                    value={grievanceSearchId}
                    onChange={(e) => setGrievanceSearchId(e.target.value)}
                    className="w-full p-2.5 text-sm bg-white dark:bg-stone-900 border rounded-lg uppercase font-mono"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all"
                >
                  Investigate Status
                </button>
              </form>

              {/* Checked Grievance Render */}
              {checkedGrievance ? (
                <div className="mt-5 p-4 rounded-lg bg-gray-50 border whitespace-pre-line text-xs">
                  <p className="font-extrabold text-amber-800">📌 Track ID: {checkedGrievance.id}</p>
                  <p className="mt-2 text-gray-500"><strong>Filed by:</strong> {checkedGrievance.name}</p>
                  <p className="text-gray-500"><strong>Subject:</strong> {checkedGrievance.subject}</p>
                  <p className="text-gray-500"><strong>Date:</strong> {checkedGrievance.submissionDate}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-gray-600"><strong>Status:</strong></span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      checkedGrievance.status === "Submitted" ? "bg-blue-100 text-blue-800" :
                      checkedGrievance.status === "Reviewing" ? "bg-amber-1100 bg-amber-100 text-amber-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {checkedGrievance.status}
                    </span>
                  </div>
                </div>
              ) : grievanceSearchId ? (
                <div className="mt-5 p-4 rounded-lg bg-yellow-50 border border-yellow-250 text-[11px] text-amber-900">
                  No registry match for that code in local state yet. Register or verify tracking query parameters! Check format is correct (e.g. MV-GR-xxxxxxxxx).
                </div>
              ) : null}
            </div>

            {/* Dynamic state list */}
            {filedGrievances.length > 0 && (
              <div className={`p-4 rounded-xl border ${
                highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"
              }`}>
                <h4 className="font-bold text-xs text-gray-500 uppercase mb-3">Dynamic Registered State</h4>
                <div className="space-y-2 select-text h-64 overflow-y-auto pr-2">
                  {filedGrievances.map((g, gi) => (
                    <div key={gi} className="p-2 border rounded-md text-[11px] bg-gray-50/50">
                      <div className="flex justify-between font-bold">
                        <span>{g.id}</span>
                        <span className="text-blue-600 font-normal">{g.status}</span>
                      </div>
                      <p className="text-gray-500 mt-1 truncate">{g.subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* New Extensive Content: Evidence Upload & Tracking Lifecycle */}
          <div className={`mt-8 p-6 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-6 border-b pb-2">
              Case Tracking Lifecycle & Audit Framework
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h5 className="font-bold text-gray-900 text-xs mb-3">Understanding Your Timeline Status</h5>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0"><Activity className="w-3 h-3" /></div>
                    <div>
                      <p className="font-bold text-[11px] text-gray-900">1. Registered in Registry (T+0)</p>
                      <p className="text-[10px] text-gray-600 leading-snug mt-0.5">Your grievance is assigned a tracking hash and placed into the unified portal queue. Data is encrypted.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><CheckCircle className="w-3 h-3" /></div>
                    <div>
                      <p className="font-bold text-[11px] text-gray-900">2. Forwarded to DCPU (T+24 Hrs)</p>
                      <p className="text-[10px] text-gray-600 leading-snug mt-0.5">District Child Protection Unit retrieves the file. The local nodal officer assumes jurisdiction and schedules field inspection.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Search className="w-3 h-3" /></div>
                    <div>
                      <p className="font-bold text-[11px] text-gray-900">3. Under Active Investigation (T+3 Days)</p>
                      <p className="text-[10px] text-gray-600 leading-snug mt-0.5">Field reports, witness accounts, and CCI compliance logs are actively being uploaded to the central vault by the investigating officer.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><FileText className="w-3 h-3" /></div>
                    <div>
                      <p className="font-bold text-[11px] text-gray-900">4. Action Taken Report (ATR) Filed</p>
                      <p className="text-[10px] text-gray-600 leading-snug mt-0.5">A binding directive is issued. The ATR is published directly to your tracking dashboard for your review.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-stone-800 p-5 rounded-lg border border-gray-100">
                <h5 className="font-bold text-gray-900 text-xs mb-3 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-500" /> Disputed Resolutions
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  If the Action Taken Report (ATR) provided by the district authorities is unsatisfactory, complainants hold the legal right to challenge the closure of the grievance.
                </p>
                <ul className="text-[10px] text-gray-500 space-y-2 list-disc pl-4">
                  <li><strong>Appeal Window:</strong> You must trigger an appeal within 15 days of the ATR publication on this dashboard.</li>
                  <li><strong>State Escalation:</strong> The file is automatically removed from the DCPU's jurisdiction and transferred to the State Commission for Protection of Child Rights (SCPCR).</li>
                  <li><strong>Hearing:</strong> You may be summoned (virtually or physically) for a confidential deposition to present secondary evidence.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeGrievanceSubPage === "sop" && (
        <div className="space-y-8 animate-fadeIn">
          <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">
              Standard Operating Procedure (SOP)
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h5 className="font-bold text-xs text-gray-900 uppercase">Triage & Registration</h5>
                  <p className="text-xs text-gray-600 mt-1">Grievances are automatically assigned a unique MV-GR tracking ID and routed to the respective district nodal officer within 24 hours of submission.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h5 className="font-bold text-xs text-gray-900 uppercase">Field Investigation</h5>
                  <p className="text-xs text-gray-600 mt-1">If the grievance involves child safety or non-compliance of CWC directives, a local child protection officer (DCPO) conducts a physical verification within 3 working days.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h5 className="font-bold text-xs text-gray-900 uppercase">Action & Rectification</h5>
                  <p className="text-xs text-gray-600 mt-1">Notice is served to the concerned Child Care Institution or agency. Mandated corrective action must be uploaded to the portal with photographic evidence.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h5 className="font-bold text-xs text-gray-900 uppercase">Final Resolution & Closure</h5>
                  <p className="text-xs text-gray-600 mt-1">The grievance is marked as closed only after the complainant confirms satisfaction or the State Commission for Protection of Child Rights (SCPCR) approves the action taken report.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeGrievanceSubPage === "sla" && (
        <div className="space-y-8 animate-fadeIn">
          <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
              <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">
                Service Level Agreements (SLA) & Timelines
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b">
                      <th className="p-2 font-bold uppercase">Grievance Category</th>
                      <th className="p-2 font-bold uppercase">Initial Response</th>
                      <th className="p-2 font-bold uppercase">Resolution Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="p-2 font-medium">Child Abuse / Endangerment</td>
                      <td className="p-2 text-red-600 font-bold">Immediate (2 Hours)</td>
                      <td className="p-2">24 Hours</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Infrastructure/Hygiene Deficiencies</td>
                      <td className="p-2">48 Hours</td>
                      <td className="p-2">7 Days</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Fund Disbursement Delays</td>
                      <td className="p-2">3 Working Days</td>
                      <td className="p-2">15 Days</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Adoption/Foster Process Delays</td>
                      <td className="p-2">5 Working Days</td>
                      <td className="p-2">30 Days</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Staff Misconduct in CCI</td>
                      <td className="p-2">24 Hours</td>
                      <td className="p-2">7 Days (Subject to inquiry)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-red-50 text-red-800 p-4 rounded-lg text-xs">
                <p className="font-bold flex items-center gap-1 mb-1"><AlertTriangle className="w-4 h-4" /> Escalation Matrix</p>
                <p>If your grievance is not resolved within the SLA timeline, it is automatically escalated to the Central Grievance Redressal Officer (CGRO) at the Ministry of Women and Child Development.</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-gray-50 border-gray-200"}`}>
              <h4 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4">
                State Nodal Officers for Grievance Redressal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { state: "Maharashtra", officer: "Smt. Kavita Patil", email: "nodal.mh@abhaya.gov.in", phone: "022-2435XXXX" },
                { state: "Delhi (NCT)", officer: "Shri. Rajesh Sharma", email: "nodal.dl@abhaya.gov.in", phone: "011-2334XXXX" },
                { state: "Karnataka", officer: "Dr. Meenakshi Iyer", email: "nodal.ka@abhaya.gov.in", phone: "080-2223XXXX" },
                { state: "Uttar Pradesh", officer: "Shri. Anil Kumar", email: "nodal.up@abhaya.gov.in", phone: "0522-223XXXX" }
              ].map((nodal, idx) => (
                <div key={idx} className="bg-white dark:bg-stone-800 p-3 rounded-lg shadow-xs border text-xs">
                  <div className="font-bold text-gray-900 mb-1">{nodal.state}</div>
                  <div className="text-gray-600 mb-2">{nodal.officer}</div>
                  <div className="flex flex-col gap-1 text-gray-500 font-mono text-[10px]">
                    <span>📧 {nodal.email}</span>
                    <span>📞 {nodal.phone}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-4 text-center">For states not listed here, please contact the National Toll-Free Helpline at 1098.</p>
          </div>
        </div>
      )}

      {activeGrievanceSubPage === "sop" && (
        <div className="space-y-8 animate-fadeIn">
          {/* New Extensive Content: Key Reporting Categories */}
          <div>
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-6 border-b pb-2">
              Categorization of Grievances & Priority Levels
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">CRITICAL</div>
                <h5 className="font-bold text-gray-900 text-xs mb-2 mt-2">Child Abuse / Exploitation</h5>
                <p className="text-xs text-gray-600 mb-3">Any form of physical, emotional, or sexual abuse reported within Child Care Institutions, foster homes, or under community care.</p>
                <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                  <li>Unexplained injuries or trauma</li>
                  <li>Coercion or forced labor</li>
                  <li>Withholding of essential medical care</li>
                </ul>
              </div>
              <div className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">HIGH</div>
                <h5 className="font-bold text-gray-900 text-xs mb-2 mt-2">Institutional Non-Compliance</h5>
                <p className="text-xs text-gray-600 mb-3">Failure of CCIs to adhere to the Juvenile Justice (Care and Protection of Children) Act, 2015 guidelines regarding infrastructure and hygiene.</p>
                <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                  <li>Overcrowding beyond sanctioned capacity</li>
                  <li>Unsanitary living conditions or poor nutrition</li>
                  <li>Lack of segregated facilities</li>
                </ul>
              </div>
              <div className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">MEDIUM</div>
                <h5 className="font-bold text-gray-900 text-xs mb-2 mt-2">Administrative Delays</h5>
                <p className="text-xs text-gray-600 mb-3">Unjustified delays in processing foster care applications, adoption home studies, or disbursal of sponsorship funds.</p>
                <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                  <li>Home Study Report (HSR) pending &gt; 30 days</li>
                  <li>Sponsorship funds not credited</li>
                  <li>Non-issuance of orphan certificates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeGrievanceSubPage === "whistleblower" && (
        <div className="space-y-8 animate-fadeIn">
          {/* New Extensive Content: Whistleblower Protection */}
          <div>
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-6 border-b pb-2">
              Whistleblower Protection & Confidentiality Framework
            </h4>
            <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-amber-50 border-amber-200"}`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 h-full">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-gray-900 text-sm mb-2">Absolute Anonymity</h5>
                    <p className="text-xs text-gray-600">Complainants can elect to mask their identities. In such cases, contact details are encrypted and only accessible by the State Nodal Officer via one-time-password (OTP) verification.</p>
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    The Ministry of Women and Child Development strictly adheres to a zero-retaliation policy for all whistleblowers, including CCI staff, social workers, and community members.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">Protection from Retaliation</span>
                        <span className="text-xs text-gray-600">Any institutional staff reporting malpractices are protected under the Whistle Blowers Protection Act. Harassment or termination based on filing a grievance will invite strict penal action against the CCI management.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">Secure Document Vault</span>
                        <span className="text-xs text-gray-600">Evidentiary documents, photographs, or audio recordings uploaded during the grievance registration are stored in a highly secure, non-tamperable state-run cloud server.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">Legal Aid Support</span>
                        <span className="text-xs text-gray-600">If a grievance escalates into a criminal investigation under the POCSO Act or Juvenile Justice Act, the state will provide free legal counsel to the complainant or the victimized child through the District Legal Services Authority (DLSA).</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* New Extensive Content: Real-time Redressal Dashboard stats */}
          <div className="mt-8">
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-6 border-b pb-2">
              National Grievance Redressal Dashboard (Current Quarter)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="text-3xl font-black text-gray-900 mb-1">14,205</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Grievances Received</div>
              </div>
              <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="text-3xl font-black text-emerald-600 mb-1">94.2%</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resolution Rate</div>
              </div>
              <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="text-3xl font-black text-amber-600 mb-1">4.5 Days</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Average Resolution Time</div>
              </div>
              <div className={`p-4 rounded-xl border text-center ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="text-3xl font-black text-blue-600 mb-1">823</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Investigations</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-extrabold text-amber-800 text-sm uppercase tracking-wider mb-6 border-b pb-2">
              Frequently Asked Questions (Grievance Redressal)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: "Who can file a grievance on this portal?",
                  a: "Any citizen, NGO, child protection officer, or a child themselves can file a grievance regarding child rights violations, delays in adoption/foster processes, or institutional deficiencies."
                },
                {
                  q: "Can I file a grievance anonymously?",
                  a: "Yes. While contact details are requested to provide you with status updates, you can choose to hide your identity in the public registry. Your details will only be visible to the investigating nodal officer."
                },
                {
                  q: "What if my grievance is against a CWC member or DCPO?",
                  a: "Grievances flagged against district-level officials are automatically routed to the State Commission for Protection of Child Rights (SCPCR) to ensure an unbiased investigation."
                },
                {
                  q: "How do I upload evidence like photos or documents?",
                  a: "Once your grievance is registered and you receive a Track ID, you can use the 'Investigate Status' panel to upload supplemental files securely to your case record."
                },
                {
                  q: "What happens if a Child Care Institution (CCI) is found guilty?",
                  a: "Depending on the severity, actions range from financial penalties and mandatory staff retraining to immediate suspension of the CCI's license and relocation of the children to a safe facility."
                },
                {
                  q: "Can a closed grievance be reopened?",
                  a: "Yes, if you are unsatisfied with the resolution, you have a 15-day window to appeal the decision, which elevates the case to the Central Grievance Redressal Officer."
                }
              ].map((faq, idx) => (
                <div key={idx} className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-sm"}`}>
                  <h5 className="font-bold text-gray-900 text-xs mb-2 flex gap-2 items-start">
                    <span className="text-amber-600">Q.</span> {faq.q}
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed ml-5">
                    <span className="font-bold text-gray-400 mr-1">A.</span> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      </div>
      )}

      {/* =================================_________ */}
      {/* 7. MEDIA VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.MEDIA && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Launch of Foster Parent Registration Week 2026",
                date: "14 June 2026",
                desc: "The Ministry announced simplified document checklist schemas to scale adoptive registrations across states.",
                img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "National Seminar on De-institutionalization",
                date: "05 June 2026",
                desc: "State directors resolved to construct comprehensive safety plans. Highlighting regional best studies.",
                img: "https://images.unsplash.com/photo-1471971405611-48c0a2a1b55f?q=80&w=600&auto=format&fit=crop"
              },
              {
                title: "Upgrade of TrackChild 2.5 Integrated Suite",
                date: "28 May 2026",
                desc: "Integrated child protection units launched digital case study tracking frameworks to streamline workflows.",
                img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop"
              },
            ].map((news, ni) => (
              <div 
                key={ni} 
                className={`rounded-xl border overflow-hidden ${
                  highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                <img 
                  src={news.img} 
                  alt={news.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover" 
                />
                
                <div className="p-4 space-y-2">
                  <span className="text-[10px] text-amber-600 font-bold uppercase">{news.date}</span>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight line-clamp-2">
                    {news.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {news.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =================================_________ */}
      {/* 8. CITIZEN CORNER VIEW */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.CITIZEN_CORNER && (
        <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto text-center">
          
          <div className="space-y-4">
            <Heart className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
            <h3 className="text-2xl font-black text-gray-900">
              {lang === "en" ? "Become an ABHAYA Guardian" : "अभया रक्षक बनें"}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Every child deserves a secure home, guidance, and primary nourishment. Help us champion non-institutionalized foster welfare structures in your district!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mt-8">
            <div className={`p-5 rounded-lg border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-xs"}`}>
              <h4 className="font-bold text-amber-800 text-sm">Volunteer Counseling</h4>
              <p className="text-xs text-gray-500 mt-1">Provide psychological recovery care sessions to kids at regional shelters.</p>
              <button 
                onClick={() => addToast("Volunteer registration form is scheduled in next release bundle!", "info")}
                className="mt-3 text-xs font-bold text-amber-600 hover:underline"
              >
                Register Interest →
              </button>
            </div>

            <div className={`p-5 rounded-lg border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-xs"}`}>
              <h4 className="font-bold text-amber-800 text-sm">Sponsorship Donations</h4>
              <p className="text-xs text-gray-500 mt-1">Sponsor educational kits, physical books, or diagnostic checks for kids in need.</p>
              <button 
                onClick={() => addToast("Sponsorship framework operates on state-direct guidelines. Contact nearest DCPU!", "info")}
                className="mt-3 text-xs font-bold text-amber-600 hover:underline"
              >
                View Guidelines →
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =================================_________ */}
      {/* 9. TRACK CHILD SYSTEM (Integrated platform) */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.TRACK_CHILD && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main search card */}
          <div className={`p-6 rounded-xl border ${
            highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-blue-900 text-base">{lang === "en" ? "Integrated Child Protection Tracking System" : "एकीकृत बाल संरक्षण ट्रैकिंग सिस्टम"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Query national database immediately to verify state of missing or recovered child registries.</p>
              </div>
              <div className="text-xs font-bold text-gray-500">
                ⭐ ACTIVE DATA SOURCES: 32 States & Union Territories
              </div>
            </div>

            <form id="track-child-search-form" onSubmit={handleChildSearch} className="flex gap-2">
              <div className="relative w-full">
                <span className="absolute left-3.5 top-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  value={childSearchQuery}
                  onChange={(e) => setChildSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border text-sm rounded-lg"
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-all"
              >
                {t.searchBtn}
              </button>
            </form>

            {/* Results Table */}
            <div className="mt-6 overflow-x-auto select-text">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 uppercase font-bold bg-gray-50 dark:bg-stone-800">
                    <th className="p-3">Child ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Age/Gender</th>
                    <th className="p-3">Last Seen / Origin</th>
                    <th className="p-3">Reporting Date</th>
                    <th className="p-3">Welfare State</th>
                    <th className="p-3">Responsible Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {queriedChildren.length > 0 ? (
                    queriedChildren.map((child) => (
                      <tr 
                        key={child.id} 
                        className="border-b hover:bg-gray-50/50 dark:hover:bg-stone-900 transition-all"
                      >
                        <td className="p-3 font-mono font-bold text-blue-800">{child.id}</td>
                        <td className="p-3 font-semibold text-gray-900">{child.name}</td>
                        <td className="p-3 text-gray-600">{child.age} yrs / {child.gender}</td>
                        <td className="p-3 text-gray-600">{child.missingFrom}</td>
                        <td className="p-3 text-gray-500 font-mono">{child.missingDate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            child.status === "Recovered" ? "bg-green-100 text-green-800" :
                            child.status === "In Rehabilitation" ? "bg-amber-100 text-amber-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {child.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">{child.reportingOfficer}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                        {t.noRecords}
                        <button 
                          onClick={() => {
                            setChildSearchQuery("");
                            setQueriedChildren(initialChildDatabase);
                            setHasSearched(false);
                          }}
                          className="mt-3 block mx-auto text-xs font-bold text-blue-600 underline"
                        >
                          Clear custom search filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing Child Alert Submission form */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Form */}
            <div className={`p-6 rounded-xl border lg:col-span-3 ${
              highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
            }`}>
              <h3 className="font-extrabold text-[#cd201f] text-base mb-4 border-b pb-3 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" />
                <span>{lang === "en" ? "Report Missing Child Emergency alert" : "लापता बच्चे की आपातकालीन रिपोर्ट दर्ज करें"}</span>
              </h3>

              {reportSuccess ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center text-green-800 space-y-3">
                  <h4 className="font-bold text-lg">Case Lodged Successfully in Local States Database!</h4>
                  <p className="text-xs">
                    Your details and missing report are distributed in the TrackChild coordinator system. Check case files under general logs above!
                  </p>
                  <button 
                    onClick={() => setReportSuccess(false)}
                    className="py-1.5 px-4 bg-green-700 text-white font-bold text-xs rounded-md"
                  >
                    Lodge New Case
                  </button>
                </div>
              ) : (
                <form id="report-missing-form" onSubmit={handleReportMissing} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">CHILD NAME *</label>
                      <input 
                        type="text" 
                        required 
                        value={mName}
                        onChange={(e) => setMName(e.target.value)}
                        placeholder="e.g. Ramesh"
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">AGE *</label>
                      <input 
                        type="number" 
                        required 
                        value={mAge}
                        onChange={(e) => setMAge(e.target.value)}
                        placeholder="e.g. 8"
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">GENDER *</label>
                      <select 
                        value={mGender} 
                        onChange={(e) => setMGender(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">LAST SEEN PLACE / LOCATION *</label>
                      <input 
                        type="text" 
                        required 
                        value={mPlace}
                        onChange={(e) => setMPlace(e.target.value)}
                        placeholder="e.g. Pune Station, Maharashtra"
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">DATE OF EVENT *</label>
                      <input 
                        type="date" 
                        required 
                        value={mDate}
                        onChange={(e) => setMDate(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-650 mb-1">REPORTER NAME *</label>
                      <input 
                        type="text" 
                        required 
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="e.g. S. Patel (Parent)"
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-650 mb-1">REPORTER CONTACT NUMBER *</label>
                      <input 
                        type="tel" 
                        required 
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        placeholder="e.g. 917281928"
                        className="w-full p-2 bg-white dark:bg-stone-900 border text-xs rounded"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg uppercase shadow-md"
                  >
                    Emit National Missing Alert
                  </button>
                </form>
              )}
            </div>

            {/* Quick guidance column */}
            <div className={`p-6 rounded-xl border lg:col-span-2 flex flex-col justify-between ${
              highContrast ? "bg-stone-900 border-yellow-300 font-bold" : "bg-white border-gray-100 shadow-sm"
            }`}>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Police Coordinator Network Alerts</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Reporting alerts propagate dynamically to:
                </p>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600">✔</span> Special Juvenile Police Units (SJPUs)
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600">✔</span> District Child Protection Coordinators (DCPUs)
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600">✔</span> Border Security Force Checkpoints (BSF)
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600">✔</span> Railway Protection Force (RPF) Desks
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <p className="text-[10px] text-gray-400">
                  ⚠️ Providing deliberately fraudulent child tracking or parental alerts faces high statutory prosecution charges under Section 74 of JJ Act.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =================================_________ */}
      {/* 10. PM CARES */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.PM_CARES && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn select-text">
          
          <div className="p-6 rounded-xl bg-linear-to-r from-orange-400/10 via-amber-200/10 to-green-600/10 border text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-850">
              PM CARES SCHEME FOR CHILDREN (ESTABLISHED 2021)
            </span>
            <h3 className="text-2xl font-black text-gray-900">Education, Health, and Monthly Sustenance support</h3>
            <p className="text-xs text-sm max-w-2xl mx-auto text-gray-600 leading-relaxed">
              Designed to support and nurture children who lost both parents, surviving parents, legal guardians, or adoptive parents due to the pandemic, ensuring stable upbringing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-lg border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-2xs"}`}>
              <h4 className="font-bold text-orange-900 text-sm">Monthly Stipend</h4>
              <p className="text-xs text-gray-500 mt-2">Provides regular financial grants after attaining 18 years to fund high educational tuition or business resources.</p>
            </div>
            <div className={`p-5 rounded-lg border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-2xs"}`}>
              <h4 className="font-bold text-amber-900 text-sm">Primary Education</h4>
              <p className="text-xs text-gray-500 mt-2">Mandatory free school enrollment at Kendrick Vidyalayas, covering books, uniforms, and diagnostic costs.</p>
            </div>
            <div className={`p-5 rounded-lg border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-2xs"}`}>
              <h4 className="font-bold text-emerald-950 text-sm">₹5 Lakh Insurance</h4>
              <p className="text-xs text-gray-500 mt-2">Dynamic free medical cards under Ayushman Bharat (PM-JAY) covering medical checkups and treatments.</p>
            </div>
          </div>

          <div className="border-t pt-4 text-center">
            <button 
              onClick={() => addToast("Redirecting to PM CARES verification portal - PM Cares features require state-level secure token details.", "info")}
              className="py-2 px-6 bg-amber-500 text-white rounded-md text-xs font-bold shadow-xs hover:bg-amber-600"
            >
              Apply on PM CARES Gateway
            </button>
          </div>

        </div>
      )}

      {/* =================================_________ */}
      {/* 11. RELATED LINKS */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.RELATED_LINK && (
        <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn select-text">
          
          <ul className="space-y-3">
            {[
              { name: "CARA (Central Adoption Resource Authority)", link: "http://cara.nic.in" },
              { name: "National Commission for Protection of Child Rights (NCPCR)", link: "http://ncpcr.gov.in" },
              { name: "Ministry of Women and Child Development", link: "http://wcd.nic.in" },
              { name: "Khoya-Paya Portal (Missing Children Registry)", link: "http://khoyapaya.gov.in" },
              { name: "PM CARES Children Portal", link: "https://pmcaresforchildren.in" },
            ].map((link, lK) => (
              <li key={lK} className="p-3 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                <span className="font-bold text-xs text-amber-800">{link.name}</span>
                <span className="text-[10px] text-gray-400 hover:underline cursor-pointer" onClick={() => addToast(`Opening Official Directory: ${link.link}`, "info")}>
                  Open Official Directory ↗
                </span>
              </li>
            ))}
          </ul>

        </div>
      )}

      {/* =================================_________ */}
      {/* 12. CONTACT US */}
      {/* =================================_________ */}
      {activeTab === PortalActiveTab.CONTACT_US && (
        <div className="space-y-6 max-w-xl mx-auto animate-fadeIn text-center select-text">
          
          <div className={`p-6 rounded-xl border ${highContrast ? "border-yellow-300 bg-stone-900" : "bg-white border-gray-100 shadow-sm"}`}>
            <h3 className="font-extrabold text-gray-900 text-base mb-4">Ministry Support & Desk lines</h3>
            
            <div className="text-left space-y-4 text-xs text-gray-600">
              <p><strong>Desk Office:</strong> Section Coordinator, ABHAYA Division, Shastri Bhawan, New Delhi - 110001</p>
              <p><strong>General Support Contacts:</strong> +91-11-23386000 / +91-11-23381654</p>
              <p><strong>Childline Support Helpline helpline:</strong> 1098 (Available 24/7 anywhere in India)</p>
              <p><strong>Desk Email desk:</strong> support-abhaya@gov.in</p>
            </div>

            <div className="border-t mt-6 pt-4">
              <button 
                onClick={() => addToast("Connecting to Helpdesk support line...", "success")}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-md"
              >
                Trigger Portal Chat Support
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
