import React, { useState } from "react";
import { Language } from "../data/translations";
import { PortalActiveTab } from "../types";
import { ShieldAlert, Compass, Search, AlertTriangle, RefreshCw, Download, ChevronDown, CheckCircle, BookOpen, FileText, PhoneCall } from "lucide-react";
import { scenarios, detailedActs, legalQuiz } from "../data/actsRulesData";

interface ActsAndRulesSectionProps {
  lang: Language;
  highContrast: boolean;
  setActiveTab: (tab: PortalActiveTab) => void;
}

export default function ActsAndRulesSection({ lang, highContrast, setActiveTab }: ActsAndRulesSectionProps) {
  // Advanced Page Interactive States
  const [actsSearchQuery, setActsSearchQuery] = useState("");
  const [actsCategory, setActsCategory] = useState("all");
  const [selectedScenarioId, setSelectedScenarioId] = useState("scenario_1");
  const [expandedActId, setExpandedActId] = useState<string | null>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, boolean | null>>({});

  const filteredActs = detailedActs.filter(act => {
    const matchCategory = actsCategory === "all" || act.category === actsCategory;
    const searchLower = actsSearchQuery.toLowerCase();
    const matchSearch = act.titleEn.toLowerCase().includes(searchLower) || 
                        act.titleHi.toLowerCase().includes(searchLower) ||
                        act.sectionsEn.toLowerCase().includes(searchLower) ||
                        act.descEn.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  return (
    <div className="space-y-8 w-full max-w-none animate-fadeIn">
      {/* Top Banner */}
      <div className={`p-6 md:p-8 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        highContrast ? "bg-black border-yellow-300 text-yellow-300" : "bg-gradient-to-r from-amber-850 via-rose-900 to-stone-900 text-white shadow-lg"
      }`}>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {lang === "en" ? "Acts & Rules Portal" : "अधिनियम और नियम पोर्टल"}
          </h2>
          <p className="text-sm md:text-base opacity-90 max-w-2xl">
            {lang === "en" 
              ? "Comprehensive repository of constitutional safeguards, statutory guidelines, and punitive laws designed to protect child rights across India." 
              : "भारत भर में बाल अधिकारों की रक्षा के लिए डिज़ाइन किए गए संवैधानिक सुरक्षा उपायों, वैधानिक दिशानिर्देशों और दंडात्मक कानूनों का व्यापक भंडार।"}
          </p>
        </div>
        <Compass className="w-16 h-16 opacity-20 shrink-0" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Library */}
        <div className="xl:col-span-2 space-y-6">
          <div className={`rounded-xl border p-5 ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white shadow-sm"}`}>
            <h3 className="font-extrabold text-lg md:text-xl mb-4 text-rose-900 dark:text-yellow-300">
              {lang === "en" ? "Digital Law Library" : "डिजिटल कानून पुस्तकालय"}
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={lang === "en" ? "Search by act name, year or section..." : "अधिनियम के नाम, वर्ष या धारा द्वारा खोजें..."}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-stone-800 border rounded-lg text-sm text-gray-900 dark:text-gray-100"
                  value={actsSearchQuery}
                  onChange={e => setActsSearchQuery(e.target.value)}
                />
              </div>
              <select 
                value={actsCategory}
                onChange={e => setActsCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-stone-800 border rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200"
              >
                <option value="all">{lang === "en" ? "All Categories" : "सभी श्रेणियां"}</option>
                <option value="jj">{lang === "en" ? "Juvenile Justice" : "किशोर न्याय"}</option>
                <option value="pocso">{lang === "en" ? "POCSO & Sexual Offences" : "POCSO और यौन अपराध"}</option>
                <option value="labor">{lang === "en" ? "Child Labour & Trafficking" : "बाल श्रम और तस्करी"}</option>
                <option value="cara">{lang === "en" ? "Adoption Rules (CARA)" : "दत्तक ग्रहण नियम"}</option>
                <option value="other">{lang === "en" ? "Education & Marriage" : "शिक्षा और विवाह"}</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredActs.map(act => (
                <div key={act.id} className="border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden transition-all duration-200">
                  <div 
                    className={`p-4 cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-gray-100 dark:bg-stone-800 dark:hover:bg-stone-700 ${expandedActId === act.id ? "bg-white dark:bg-black border-b border-gray-200 dark:border-stone-700" : ""}`}
                    onClick={() => setExpandedActId(expandedActId === act.id ? null : act.id)}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-1 block">
                        {act.year} &middot; {lang === "en" ? "Statutory Act" : "वैधानिक अधिनियम"}
                      </span>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                        {lang === "en" ? act.titleEn : act.titleHi}
                      </h4>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedActId === act.id ? "rotate-180" : ""}`} />
                  </div>
                  
                  {expandedActId === act.id && (
                    <div className="p-4 bg-white dark:bg-transparent space-y-4 animate-fadeIn">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {lang === "en" ? act.descEn : act.descHi}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-rose-50 dark:bg-stone-800 rounded border border-rose-100 dark:border-stone-700">
                          <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold uppercase block mb-1">
                            {lang === "en" ? "Competent Authority" : "सक्षम प्राधिकारी"}
                          </span>
                          <span className="text-xs text-gray-900 dark:text-gray-200">
                            {lang === "en" ? act.authorityEn : act.authorityHi}
                          </span>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-stone-800 rounded border border-blue-100 dark:border-stone-700">
                          <span className="text-[10px] text-blue-800 dark:text-blue-300 font-bold uppercase block mb-1">
                            {lang === "en" ? "Key Sections" : "प्रमुख धाराएं"}
                          </span>
                          <span className="text-xs text-gray-900 dark:text-gray-200">
                            {lang === "en" ? act.sectionsEn : act.sectionsHi}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                          {lang === "en" ? "Critical Provisions:" : "महत्वपूर्ण प्रावधान:"}
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          {(lang === "en" ? act.keyPointsEn : act.keyPointsHi).map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3 flex justify-end">
                        <button className="flex items-center gap-2 px-4 py-2 bg-rose-800 text-white rounded text-xs font-bold hover:bg-rose-900 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          {lang === "en" ? `Download Gazette PDF (${act.sizeBook})` : `राजपत्र पीडीएफ डाउनलोड करें (${act.sizeBook})`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredActs.length === 0 && (
                <div className="text-center p-8 bg-gray-50 dark:bg-stone-800 border border-dashed rounded-lg">
                  <ShieldAlert className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
                    {lang === "en" ? "No acts found" : "कोई अधिनियम नहीं मिला"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {lang === "en" ? "Try adjusting your search query or category filter." : "अपनी खोज क्वेरी या श्रेणी फ़िल्टर को समायोजित करने का प्रयास करें।"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Scenario Tester & Quiz */}
        <div className="space-y-6">
          <div className={`rounded-xl border p-5 ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-gradient-to-b from-slate-50 to-white shadow-sm"}`}>
             <h3 className="font-extrabold text-blue-900 dark:text-yellow-300 text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {lang === "en" ? "Violation Scenarios Engine" : "उल्लंघन परिदृश्य इंजन"}
             </h3>
             <select 
               className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm font-medium bg-white dark:bg-stone-800 dark:text-white"
               value={selectedScenarioId}
               onChange={e => setSelectedScenarioId(e.target.value)}
             >
               {scenarios.map(sc => (
                 <option key={sc.id} value={sc.id}>{lang === "en" ? sc.labelEn : sc.labelHi}</option>
               ))}
             </select>

             <div className="space-y-4">
               <div>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                   {lang === "en" ? "Applicable Section" : "लागू धारा"}
                 </span>
                 <p className="text-sm text-red-700 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                   {lang === "en" ? activeScenario.sectionEn : activeScenario.sectionHi}
                 </p>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-gray-100 dark:bg-stone-800 p-2 rounded">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                     {lang === "en" ? "Nature of Offence" : "अपराध की प्रकृति"}
                   </span>
                   <p className="text-xs font-medium mt-1 dark:text-gray-200">
                     {lang === "en" ? activeScenario.offenceTypeEn : activeScenario.offenceTypeHi}
                   </p>
                 </div>
                 <div className="bg-gray-100 dark:bg-stone-800 p-2 rounded">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                     {lang === "en" ? "Maximum Penalty" : "अधिकतम दंड"}
                   </span>
                   <p className="text-xs font-medium text-red-800 dark:text-red-400 mt-1">
                     {lang === "en" ? activeScenario.penaltyEn : activeScenario.penaltyHi}
                   </p>
                 </div>
               </div>
               <div>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block mb-1">
                   {lang === "en" ? "Mandatory Protocol" : "अनिवार्य प्रोटोकॉल"}
                 </span>
                 <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                   {lang === "en" ? activeScenario.protocolEn : activeScenario.protocolHi}
                 </p>
               </div>
               <div>
                 <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide block mb-1">
                   {lang === "en" ? "State Rehabilitation Duty" : "राज्य पुनर्वास कर्तव्य"}
                 </span>
                 <p className="text-xs text-green-900 dark:text-green-300 leading-relaxed bg-green-50 dark:bg-green-900/20 p-3 rounded flex items-start gap-2">
                   <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                   {lang === "en" ? activeScenario.stateActionEn : activeScenario.stateActionHi}
                 </p>
               </div>
             </div>
          </div>

          <div className={`rounded-xl border p-5 ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-purple-900 text-white shadow-sm"}`}>
             <h3 className="font-extrabold text-lg flex items-center gap-2 mb-4">
               <RefreshCw className="w-5 h-5 text-purple-200" />
               {lang === "en" ? "Legal Awareness Quiz" : "कानूनी जागरूकता प्रश्नोत्तरी"}
             </h3>
             <div className="space-y-6">
                {legalQuiz.map((q, qIdx) => {
                  const hasAnswered = userQuizAnswers[qIdx] !== undefined;
                  const isCorrect = userQuizAnswers[qIdx] === true;
                  return (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-sm font-medium leading-relaxed">
                        <span className="text-purple-300 font-bold mr-2">Q{qIdx+1}:</span> 
                        {lang === "en" ? q.qEn : q.qHi}
                      </p>
                      
                      {!hasAnswered ? (
                        <div className="space-y-2">
                          {(lang === "en" ? q.optionsEn : q.optionsHi).map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => setUserQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx === q.correctIdx }))}
                              className="w-full text-left px-3 py-2 rounded bg-purple-800 hover:bg-purple-700 text-xs transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className={`p-3 rounded text-xs ${isCorrect ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
                          <div className="font-bold flex items-center gap-1.5 mb-2">
                            {isCorrect ? <CheckCircle className="w-4 h-4 text-green-400" /> : <ShieldAlert className="w-4 h-4 text-red-400" />}
                            <span className={isCorrect ? "text-green-300" : "text-red-300"}>
                              {lang === "en" ? (isCorrect ? "Correct!" : "Incorrect!") : (isCorrect ? "सही!" : "गलत!")}
                            </span>
                          </div>
                          <p className="text-purple-100 leading-relaxed">
                            {lang === "en" ? q.explanationEn : q.explanationHi}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

      </div>
      
      {/* Additional Lengthy Section: Important Guidelines & SOPs */}
      <div className="mt-12 space-y-6 animate-fadeIn">
        <h3 className={`text-xl md:text-2xl font-black ${highContrast ? "text-yellow-300" : "text-gray-900"}`}>
          {lang === "en" ? "Important Guidelines & Standard Operating Procedures (SOPs)" : "महत्वपूर्ण दिशानिर्देश और मानक संचालन प्रक्रियाएं (SOPs)"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              titleEn: "SOP for Care & Protection of Children in Street Situations (CISS)",
              titleHi: "सड़क की स्थिति में बच्चों की देखभाल और सुरक्षा के लिए SOP",
              descEn: "Issued by NCPCR to rehabilitate children living on streets through Bal Swaraj portal.",
              descHi: "बाल स्वराज पोर्टल के माध्यम से सड़कों पर रहने वाले बच्चों के पुनर्वास के लिए NCPCR द्वारा जारी किया गया।"
            },
            {
              titleEn: "Guidelines for Sponsorship and Foster Care",
              titleHi: "प्रायोजन और फॉस्टर केयर के लिए दिशानिर्देश",
              descEn: "Standardized protocols for providing non-institutional family-based care to children.",
              descHi: "बच्चों को गैर-संस्थागत परिवार-आधारित देखभाल प्रदान करने के लिए मानकीकृत प्रोटोकॉल।"
            },
            {
              titleEn: "SOP on Runaway, Missing and Abandoned Children",
              titleHi: "भागे हुए, लापता और लावारिस बच्चों पर SOP",
              descEn: "Detailed action plan for Police, DCPU, and CWCs in coordination with TrackChild portal.",
              descHi: "ट्रैकचाइल्ड पोर्टल के समन्वय में पुलिस, DCPU और CWCs के लिए विस्तृत कार्य योजना।"
            },
            {
              titleEn: "Guidelines for Child Care Institutions (CCIs)",
              titleHi: "बाल देखभाल संस्थानों (CCIs) के लिए दिशानिर्देश",
              descEn: "Infrastructure, nutrition, and staffing mandates for registered children's homes under JJ Act.",
              descHi: "जेजे अधिनियम के तहत पंजीकृत बाल गृहों के लिए बुनियादी ढांचा, पोषण और कर्मचारियों के आदेश।"
            }
          ].map((sop, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300 text-white" : "bg-white border-gray-200 shadow-xs hover:shadow-md transition-shadow"}`}>
              <BookOpen className={`w-8 h-8 mb-4 ${highContrast ? "text-yellow-300" : "text-rose-700"}`} />
              <h4 className="font-bold text-sm mb-2">{lang === "en" ? sop.titleEn : sop.titleHi}</h4>
              <p className={`text-xs ${highContrast ? "text-gray-300" : "text-gray-600"} mb-4 leading-relaxed`}>
                {lang === "en" ? sop.descEn : sop.descHi}
              </p>
              <button className={`flex items-center gap-1.5 text-xs font-bold ${highContrast ? "text-yellow-300" : "text-blue-700 hover:text-blue-800"}`}>
                <FileText className="w-4 h-4" />
                {lang === "en" ? "Read Document" : "दस्तावेज़ पढ़ें"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Resources Banner */}
      <div className={`mt-8 p-6 md:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 ${highContrast ? "bg-black border border-red-500" : "bg-red-50 border border-red-100"}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className={`text-lg md:text-xl font-black ${highContrast ? "text-red-500" : "text-red-900"}`}>
              {lang === "en" ? "Child Helpline - 1098" : "चाइल्ड हेल्पलाइन - 1098"}
            </h4>
            <p className={`text-sm ${highContrast ? "text-gray-300" : "text-red-700"} mt-1 max-w-xl`}>
              {lang === "en" 
                ? "If you witness any child rights violation, abuse, or find an abandoned child, call the national toll-free 24x7 emergency helpline immediately."
                : "यदि आप किसी बाल अधिकार उल्लंघन, दुर्व्यवहार को देखते हैं, या कोई लावारिस बच्चा पाते हैं, तो तुरंत राष्ट्रीय टोल-फ्री 24x7 आपातकालीन हेल्पलाइन पर कॉल करें।"}
            </p>
          </div>
        </div>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shrink-0 transition-colors shadow-lg shadow-red-600/30">
          {lang === "en" ? "Report Violation Online" : "ऑनलाइन उल्लंघन की रिपोर्ट करें"}
        </button>
      </div>

    </div>
  );
}
