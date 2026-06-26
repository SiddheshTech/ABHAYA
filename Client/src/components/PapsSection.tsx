import React, { useState } from "react";
import { Language } from "../data/translations";
import { PortalActiveTab, PapsSubPage } from "../types";
import { Calculator, CheckCircle, Clock, FileText, Info, HelpCircle, HeartHandshake, ShieldCheck, ShieldAlert, BadgeIndianRupee } from "lucide-react";

interface PapsSectionProps {
  lang: Language;
  highContrast: boolean;
  setActiveTab: (tab: PortalActiveTab) => void;
  subPage: PapsSubPage;
  setSubPage: (page: PapsSubPage) => void;
}

export default function PapsSection({ lang, highContrast, setActiveTab, subPage, setSubPage }: PapsSectionProps) {
  // Adoptive Parents Eligibility State
  const [adoptAge, setAdoptAge] = useState(35);
  const [maritalStatus, setMaritalStatus] = useState("married");
  const [marriedYears, setMarriedYears] = useState(3);
  const [singleGender, setSingleGender] = useState("female");
  const [income, setIncome] = useState(650000);
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    let eligible = true;
    const reasons: string[] = [];

    // General CARA Adoptive Rules
    if (adoptAge < 25) {
      eligible = false;
      reasons.push(lang === "en" ? "Minimum age must be 25 years." : "न्यूनतम आयु 25 वर्ष होनी चाहिए।");
    }
    if (adoptAge > 55) {
      eligible = false;
      reasons.push(lang === "en" ? "Maximum age limit exceeded (55 years)." : "अधिकतम आयु सीमा पार हो गई है (55 वर्ष)।");
    }

    if (maritalStatus === "married") {
      if (marriedYears < 2) {
        eligible = false;
        reasons.push(lang === "en" ? "Must have at least 2 years of stable marriage." : "कम से कम 2 साल की स्थिर शादी होनी चाहिए।");
      }
    } else {
      if (singleGender === "male") {
        reasons.push(lang === "en" ? "A single male cannot adopt a girl child (CARA regulation)." : "एक एकल पुरुष लड़की को गोद नहीं ले सकता है (कारा नियम)।");
      }
    }

    if (income < 300000) {
      eligible = false;
      reasons.push(lang === "en" ? "Minimum annual income criteria not met to provide stable housing." : "स्थिर आवास प्रदान करने के लिए न्यूनतम वार्षिक आय मानदंड पूरे नहीं हुए।");
    }

    setEligibilityResult({
      status: eligible ? "eligible" : "ineligible",
      childAgeGroup: eligible 
        ? (adoptAge <= 45 ? "0-4 years" : adoptAge <= 50 ? "4-8 years" : "8-18 years")
        : "-",
      reasons
    });
  };

  const navItems: { id: PapsSubPage; icon: any; titleEn: string; titleHi: string }[] = [
    { id: "eligibility", icon: Calculator, titleEn: "Eligibility Check", titleHi: "पात्रता जांच" },
    { id: "timeline", icon: Clock, titleEn: "Adoption Process", titleHi: "गोद लेने की प्रक्रिया" },
    { id: "documents", icon: FileText, titleEn: "Documents Checklist", titleHi: "दस्तावेज़ चेकलिस्ट" },
    { id: "post_adoption", icon: HeartHandshake, titleEn: "Post-Adoption", titleHi: "गोद लेने के बाद" },
    { id: "financial", icon: BadgeIndianRupee, titleEn: "Financial Aid", titleHi: "वित्तीय सहायता" },
    { id: "faqs", icon: HelpCircle, titleEn: "FAQs for PAPs", titleHi: "PAPs के लिए अक्सर पूछे जाने वाले प्रश्न" },
  ];

  const renderContent = () => {
    switch (subPage) {
      case "eligibility":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Calculator Column */}
            <div className={`p-6 rounded-xl border lg:col-span-2 ${
              highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
            }`}>
              <div className="flex items-center gap-2.5 mb-4 border-b pb-3">
                <Calculator className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-[#9e27b0] text-sm md:text-base">
                  {lang === "en" ? "CARA Eligibility Calculator" : "कारा पात्रता कैलकुलेटर"}
                </h3>
              </div>

              <form onSubmit={checkEligibility} className="space-y-4">
                {/* Age Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    {lang === "en" ? "Applicant Age (Primary):" : "आवेदक की आयु (प्राथमिक):"} {adoptAge} years
                  </label>
                  <input 
                    type="range" 
                    min="18" 
                    max="65" 
                    value={adoptAge} 
                    onChange={(e) => setAdoptAge(parseInt(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>18</span>
                    <span>35</span>
                    <span>65</span>
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    {lang === "en" ? "Marital Status:" : "वैवाहिक स्थिति:"}
                  </label>
                  <select 
                    value={maritalStatus} 
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-stone-900 text-sm border rounded-md"
                  >
                    <option value="married">{lang === "en" ? "Stable Marriage" : "स्थिर विवाह"}</option>
                    <option value="single">{lang === "en" ? "Single / Unmarried" : "गैर शादीशुदा"}</option>
                  </select>
                </div>

                {/* Conditional fields */}
                {maritalStatus === "married" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      {lang === "en" ? "Years of stable marriage:" : "स्थिर विवाह के वर्ष:"} {marriedYears} years
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      max="30" 
                      value={marriedYears} 
                      onChange={(e) => setMarriedYears(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white dark:bg-stone-900 text-sm border rounded-md"
                    />
                  </div>
                )}
                {maritalStatus === "single" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      {lang === "en" ? "Applicant Gender:" : "आवेदक का लिंग:"}
                    </label>
                    <div className="flex gap-4 text-sm mt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="gender" value="female" checked={singleGender === "female"} onChange={() => setSingleGender("female")} />
                        Female (महिला)
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="gender" value="male" checked={singleGender === "male"} onChange={() => setSingleGender("male")} />
                        Male (पुरुष)
                      </label>
                    </div>
                  </div>
                )}

                {/* Income */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    {lang === "en" ? "Annual Income (INR):" : "वार्षिक आय (₹):"} ₹{income.toLocaleString("en-IN")}
                  </label>
                  <input 
                    type="range" 
                    min="100000" 
                    max="2000000" 
                    step="50000"
                    value={income} 
                    onChange={(e) => setIncome(parseInt(e.target.value))}
                    className="w-full accent-green-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>₹1L</span>
                    <span>₹20L+</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#9e27b0] hover:bg-[#7b1fa2] text-white py-3 rounded-md text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  {lang === "en" ? "Run Verification" : "सत्यापन चलाएं"}
                </button>
              </form>

              {/* Calculator Results */}
              {eligibilityResult && (
                <div className={`mt-5 p-4 rounded-lg border ${
                  eligibilityResult.status === "eligible" 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${
                    eligibilityResult.status === "eligible" ? "text-green-800" : "text-red-800"
                  }`}>
                    {eligibilityResult.status === "eligible" 
                      ? <CheckCircle className="w-5 h-5 shrink-0" />
                      : <ShieldAlert className="w-5 h-5 shrink-0" />
                    }
                    {eligibilityResult.status === "eligible" 
                      ? (lang === "en" ? "Provisional Eligibility Met" : "अनंतिम पात्रता पूरी हुई")
                      : (lang === "en" ? "Ineligible based on inputs" : "अपात्र")}
                  </h4>
                  
                  {eligibilityResult.status === "eligible" && (
                    <div className="text-sm text-green-900 space-y-1">
                      <p><strong>{lang === "en" ? "Permitted Child Age Group:" : "अनुमत बच्चे की आयु समूह:"}</strong> {eligibilityResult.childAgeGroup}</p>
                      <p className="text-xs text-green-700 mt-2">
                        {lang === "en" 
                          ? "Note: This is a preliminary assessment. The final decision rests with the specialized adoption committee upon home study validation." 
                          : "नोट: यह एक प्रारंभिक मूल्यांकन है। अंतिम निर्णय गृह अध्ययन सत्यापन पर विशेष गोद लेने वाली समिति के पास है।"}
                      </p>
                    </div>
                  )}

                  {eligibilityResult.reasons.length > 0 && (
                    <ul className="list-disc pl-5 text-xs text-red-800 space-y-1">
                      {eligibilityResult.reasons.map((r: string, id: number) => (
                        <li key={id}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className={`p-6 rounded-xl border lg:col-span-3 ${
              highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
            }`}>
              <h3 className="font-extrabold text-blue-800 text-lg md:text-xl mb-4 border-b pb-3 border-blue-100">
                {lang === "en" ? "Detailed Eligibility Guidelines" : "विस्तृत पात्रता दिशानिर्देश"}
              </h3>
              
              <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                <p>
                  {lang === "en"
                    ? "Under the Juvenile Justice (Care and Protection of Children) Act, 2015, and the corresponding CARA Regulations, prospective adoptive parents (PAPs) must satisfy several physical, mental, and financial criteria to ensure the holistic well-being of the adopted child."
                    : "किशोर न्याय अधिनियम 2015, और CARA विनियमों के तहत, भावी दत्तक माता-पिता (PAPs) को बच्चे के समग्र कल्याण को सुनिश्चित करने के लिए कई मानदंडों को पूरा करना चाहिए।"}
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 mb-1">{lang === "en" ? "1. Age Criteria & Composite Parameters" : "1. आयु मानदंड और समग्र पैरामीटर"}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-blue-800 text-xs">
                      <li>{lang === "en" ? "For a child up to 4 years: Maximum composite age of couple is 90 years. Single parent max age 45." : "4 वर्ष तक के बच्चे के लिए: युगल की अधिकतम समग्र आयु 90 वर्ष। एकल माता-पिता की अधिकतम आयु 45।"}</li>
                      <li>{lang === "en" ? "For child between 4 to 8 years: Maximum composite age 100 years. Single parent max age 50." : "4 से 8 वर्ष तक के बच्चे के लिए: अधिकतम समग्र आयु 100 वर्ष। एकल माता-पिता 50।"}</li>
                      <li>{lang === "en" ? "For child between 8 to 18 years: Maximum composite age 110 years. Single parent max age 55." : "8 से 18 वर्ष तक के बच्चे के लिए: अधिकतम समग्र आयु 110 वर्ष। एकल माता-पिता 55।"}</li>
                      <li>{lang === "en" ? "PAPs above 55 years of age are not permitted to adopt, except under relative adoption clauses." : "55 वर्ष से अधिक आयु के लोगों को गोद लेने की अनुमति नहीं है (रिश्तेदार गोद लेने के अलावा)।"}</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-900 mb-1">{lang === "en" ? "2. Marital Status & Stable Relations" : "2. वैवाहिक स्थिति और स्थिर संबंध"}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-purple-800 text-xs">
                      <li>{lang === "en" ? "Married couples must have completed at least two years of stable marital relationship." : "विवाहित जोड़ों को कम से कम दो साल का स्थिर वैवाहिक संबंध पूरा करना चाहिए।"}</li>
                      <li>{lang === "en" ? "Both spouses must consent to the adoption." : "दोनों पति-पत्नी को गोद लेने के लिए सहमति देनी चाहिए।"}</li>
                      <li>{lang === "en" ? "A single female can adopt a child of any gender." : "एक एकल महिला किसी भी लिंग के बच्चे को गोद ले सकती है।"}</li>
                      <li>{lang === "en" ? "A single male is strictly not eligible to adopt a girl child." : "एक एकल पुरुष को लड़की गोद लेने की अनुमति नहीं है।"}</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500">
                    <h4 className="font-bold text-amber-900 mb-1">{lang === "en" ? "3. Biological Children & Composition" : "3. जैविक बच्चे और संरचना"}</h4>
                    <ul className="list-disc pl-5 space-y-1 text-amber-800 text-xs">
                      <li>{lang === "en" ? "Couples with three or more children are not eligible for adoption unless adopting special needs, relative's, or hard-to-place children." : "तीन या अधिक बच्चों वाले युगल गोद लेने के पात्र नहीं हैं, जब तक कि विशेष आवश्यकता वाले बच्चे न हों।"}</li>
                      <li>{lang === "en" ? "The parents must be physically, mentally, and financially capable of bearing the upbringing." : "माता-पिता को शारीरिक, मानसिक और आर्थिक रूप से सक्षम होना चाहिए।"}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className={`p-6 rounded-xl border ${
            highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-100 shadow-md"
          }`}>
            <h3 className="font-extrabold text-gray-900 text-lg md:text-xl mb-6 border-b pb-3">
              {lang === "en" ? "The 6-Step End-to-End Adoption Lifecycle" : "6-चरणीय गोद लेने का जीवनचक्र"}
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {[
                { 
                  step: 1, 
                  title: "Registration & Profile Creation", 
                  timeline: "Day 1",
                  desc: "PAPs register online on CARINGS portal. Upload demographic details, marital status, and initial preferences. A minimal registration fee is submitted."
                },
                { 
                  step: 2, 
                  title: "Home Study Report (HSR)", 
                  timeline: "Within 30-60 Days",
                  desc: "A Specialized Adoption Agency (SAA) or empanelled social worker conducts a meticulous house visit. They assess financial stability, emotional readiness, safe housing, and interview extended family. HSR is uploaded to CARINGS."
                },
                { 
                  step: 3, 
                  title: "Child Profile Matching & Referral", 
                  timeline: "Variable (6 months to 2+ years)",
                  desc: "Based on seniority in the queue and preferences, the system triggers a referral. PAPs are shown profiles (medical reports, CSR) of up to 3 children. They have 48 hours to accept or decline."
                },
                { 
                  step: 4, 
                  title: "Pre-Adoption Foster Care & Assessment", 
                  timeline: "Within 20 Days of Acceptance",
                  desc: "Upon acceptance, PAPs travel to the SAA. They interact with the child. If comfortable, they sign the child study and medical reports. The child is handed over in pre-adoption foster care, pending final court order."
                },
                { 
                  step: 5, 
                  title: "Filing Petition & Legal Court Order", 
                  timeline: "Within 2 Months",
                  desc: "The SAA files an adoption petition in the competent court (usually District Magistrate under the 2021 JJ Amendment). The DM reviews documents, issues the legal adoption order, and seals the process."
                },
                { 
                  step: 6, 
                  title: "Birth Certificate & Post-Adoption Follow-ups", 
                  timeline: "Next 2 Years",
                  desc: "A new birth certificate is issued reflecting PAPs as parents. The SAA conducts mandatory post-adoption follow-ups every 6 months for 2 years to ensure the child is adjusting well."
                }
              ].map((stage, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#9e27b0] text-white font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 transform -translate-x-1/2">
                    {stage.step}
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-[3rem] md:ml-0 p-5 rounded-lg border bg-gray-50 shadow-sm relative group-odd:ml-0 md:group-odd:text-right group-odd:pr-[3rem] md:group-odd:pr-5 group-even:pl-[3rem] md:group-even:pl-5">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-sm inline-block mb-2">
                       {stage.timeline}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1">{stage.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900" : "bg-white border-gray-100 shadow-md"}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="text-blue-600 w-5 h-5"/> 
                {lang === "en" ? "Mandatory Document Uploads" : "अनिवार्य दस्तावेज़ अपलोड"}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {lang === "en" ? "All documents must be notarized and digitally uploaded on the CARINGS portal in PDF format (Max 2MB each)." : "सभी दस्तावेज़ों को नोटरीकृत किया जाना चाहिए और CARINGS पोर्टल पर अपलोड किया जाना चाहिए।"}
              </p>
              
              <ul className="space-y-3">
                {[
                  "Current family photograph or couple's photograph",
                  "PAN Card and Aadhaar Card (Proof of Identity)",
                  "Proof of Residence (Utility bill, Passport, Domicile certificate)",
                  "Proof of Income (Last 3 years Income Tax Returns & Salary Slips)",
                  "Medical Fitness Certificate (From a registered medical practitioner)",
                  "Marriage Certificate (if applicable)",
                  "Divorce Decree or Death Certificate of spouse (if applicable)",
                  "Two Reference Letters (from persons who know the family well, not direct relatives)"
                ].map((doc, i) => (
                  <li key={i} className="flex gap-3 text-sm p-3 bg-gray-50 border rounded-md">
                    <CheckCircle className="text-green-600 w-4 h-4 mt-0.5 shrink-0" />
                    <span className="text-gray-800">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900" : "bg-white border-gray-100 shadow-md"}`}>
              <h3 className="font-bold text-lg mb-4 text-purple-800">
                {lang === "en" ? "Special Category Requirements" : "विशेष श्रेणी आवश्यकताएं"}
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-900 text-sm">NRI / OCI / Foreign Prospective Parents</h4>
                  <p className="text-xs text-purple-800 mt-1">Must provide Police Clearance Certificate (PCC) and a No Objection Certificate from their respective diplomatic mission or Central Authority of the receiving country.</p>
                </div>
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500">
                  <h4 className="font-bold text-amber-900 text-sm">Single Parents (Divorced/Widowed)</h4>
                  <p className="text-xs text-amber-800 mt-1">Strict legal documentation validating the custody of any existing biological children, and an undertaking from a relative willing to take guardianship of the adopted child in case of unforeseen emergencies.</p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-900 text-sm">Older Children Adoption</h4>
                  <p className="text-xs text-blue-800 mt-1">Consent of older children (above age 5) is legally documented. PAPs must undergo specific counseling certificates proving readiness to handle transition trauma.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "post_adoption":
        return (
          <div className={`p-6 md:p-8 rounded-xl border ${highContrast ? "bg-stone-900" : "bg-white border-gray-100 shadow-md"}`}>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <HeartHandshake className="w-12 h-12 text-[#9e27b0] mx-auto mb-3" />
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
                {lang === "en" ? "Post-Adoption Support & Follow-Ups" : "गोद लेने के बाद की सहायता और अनुवर्ती कार्रवाइयां"}
              </h2>
              <p className="text-sm text-gray-600">
                {lang === "en" 
                  ? "Adoption is a legal event, but parenting is a lifelong journey. CARA mandates strict post-adoption procedures to safeguard child welfare." 
                  : "गोद लेना एक कानूनी घटना है, लेकिन पालन-पोषण एक आजीवन यात्रा है। CARA बाल कल्याण की सुरक्षा के लिए सख्त प्रक्रियाएँ अनिवार्य करता है।"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Mandatory Reporting</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Upon receiving the final adoption order from the District Magistrate, the Specialized Adoption Agency (SAA) is legally mandated to upload Post-Adoption Follow-Up Reports to the CARINGS portal.
                </p>
                <div className="bg-gray-50 border p-4 rounded-lg">
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <strong>Report 1:</strong> Sixth Month from placement
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <strong>Report 2:</strong> Twelfth Month from placement
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <strong>Report 3:</strong> Eighteenth Month from placement
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <strong>Report 4:</strong> Twenty-fourth Month from placement
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Root Search & Counseling</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  As per Section 98 of the JJ Act rules, adopted children have a legal right to "Root Search" (finding their biological origins) when they turn 18, or younger, if facilitated jointly by adoptive parents and authorities.
                </p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-bold text-amber-900 text-xs mb-1">State Counseling Provisions</h4>
                  <p className="text-xs text-amber-800">
                    District Child Protection Units (DCPUs) provide free post-adoption counseling pipelines for parents handling transition anxiety, identity crises in teenagers, or scholastic adjustments. Contact your local DCPU clinic for appointments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "financial":
        return (
          <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900" : "bg-white border-gray-100 shadow-md"}`}>
             <h3 className="font-extrabold text-green-800 text-lg md:text-xl mb-4 border-b pb-3 border-green-100 flex items-center gap-2">
                <BadgeIndianRupee className="w-6 h-6" />
                {lang === "en" ? "Financial Rules & State Aid" : "वित्तीय नियम और राज्य सहायता"}
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="col-span-1 md:col-span-2 space-y-5 text-sm text-gray-700">
                 <p>
                   Child welfare frameworks strictly prohibit the exchange of significant money in adoption processes. Adoption is NOT a transaction, and commercial procurement of children is heavily penalized under human trafficking acts.
                 </p>
                 <div className="p-4 bg-gray-50 border rounded-lg">
                   <h4 className="font-bold text-gray-900 mb-2">Approved Financial Transactions (CARA Scale)</h4>
                   <ul className="space-y-2 text-xs">
                     <li className="flex justify-between border-b pb-1">
                       <span>Registration Fee</span>
                       <span className="font-bold">₹1,000 (Approx)</span>
                     </li>
                     <li className="flex justify-between border-b pb-1">
                       <span>Home Study Report (HSR) charge</span>
                       <span className="font-bold">₹6,000</span>
                     </li>
                     <li className="flex justify-between border-b pb-1">
                       <span>Child Care Corpus Maintenance</span>
                       <span className="font-bold">₹40,000 (Max)</span>
                     </li>
                     <li className="flex justify-between">
                       <span>Post-Adoption Follow-ups (4 visits)</span>
                       <span className="font-bold">₹8,000</span>
                     </li>
                   </ul>
                   <p className="text-[10px] text-gray-500 mt-2 mt-3 italic">*PAPs are not required to pay anything apart from these officially receipted SAA charges. Report any bribe demands immediately to the grievance registry.</p>
                 </div>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-bold text-green-900 text-sm mb-1">State Foster Grants</h4>
                    <p className="text-xs text-green-800">
                      While Adoption means total financial assumption by parents, <strong>Foster Care</strong> families receive a state stipend of ₹4,000/month per child to cover essential nutritional and scholastic needs under the Vatsalya scheme.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-900 text-sm mb-1">Tax Benefits</h4>
                    <p className="text-xs text-blue-800">
                      Adoptive parents mapping their adopted children legally qualify for all standard dependents' deductions under Section 80C and medical insurance deductions under 80D of the Income Tax Act.
                    </p>
                  </div>
               </div>
             </div>
          </div>
        );

      case "faqs":
        return (
          <div className={`p-6 rounded-xl border ${highContrast ? "bg-stone-900" : "bg-white border-gray-100 shadow-md"}`}>
             <h3 className="font-extrabold text-indigo-900 text-lg md:text-xl mb-6 border-b pb-3">
                {lang === "en" ? "Frequently Asked Questions" : "पूछे जाने वाले प्रश्न"}
             </h3>
             <div className="space-y-4">
               {[
                 {
                   q: "Can I choose the specific child I want to adopt?",
                   a: "No. You cannot choose a specific child from the registry. You can specify broad preferences (age group, gender, health status), and the CARINGS algorithm refers profiles based on seniority. You have the right to decline and wait for a new referral."
                 },
                 {
                   q: "What if I face demands for bribes from authorities?",
                   a: "Adoption in India is highly regulated. Do not pay bribes. Instantly raise a ticket on the Grievance Redressal Registry on this portal or report to the National Commission for Protection of Child Rights (NCPCR)."
                 },
                 {
                   q: "Are NRIs considered equal to resident Indians in the queue?",
                   a: "NRIs holding Indian passports are treated at par with resident Indians for referrals. Overseas Citizens of India (OCI) and Foreign prospective parents face a different, usually longer, inter-country queue prioritizing special needs or older children."
                 },
                 {
                   q: "Can maternity/paternity leave be availed for adoption?",
                   a: "Yes. Under Indian labor laws, adoptive mothers of children below 3 months of age are entitled to 12 weeks of paid maternity leave. Many corporates now offer adoption leaves extended up to 6 months irrespective of the child's age."
                 }
               ].map((faq, fi) => (
                 <div key={fi} className="p-4 bg-gray-50 dark:bg-stone-800 border rounded-lg">
                   <h4 className="font-bold text-sm text-gray-900 mb-1 flex gap-2">
                     <span className="text-indigo-600">Q:</span> {faq.q}
                   </h4>
                   <p className="text-xs text-gray-700 leading-relaxed ml-6">
                     <span className="font-bold text-gray-500 mr-2">A:</span> {faq.a}
                   </p>
                 </div>
               ))}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full animate-fadeIn max-w-7xl mx-auto">
      
      {/* Header Area */}
      <div className={`mb-8 p-6 lg:p-8 rounded-2xl ${
        highContrast ? "bg-stone-900 border border-yellow-300" : "bg-gradient-to-br from-[#f8f0fc] to-[#e8f0fe] border border-[#e1bee7]"
      }`}>
        <h2 className={`text-2xl md:text-3xl font-black tracking-tight mb-3 ${highContrast ? "text-yellow-300" : "text-[#4a148c]"}`}>
          {lang === "en" ? "Prospective Adoptive Parents (PAPs) Hub" : "भावी दत्तक माता-पिता (PAPs) हब"}
        </h2>
        <p className={`text-sm md:text-base max-w-3xl leading-relaxed ${highContrast ? "text-yellow-100" : "text-gray-700"}`}>
          {lang === "en" 
            ? "Your complete digital assistant for navigating the legal, financial, and emotional journey of adoption under the Central Adoption Resource Authority (CARA) frameworks." 
            : "केंद्रीय दत्तक ग्रहण संसाधन प्राधिकरण (CARA) ढांचे के तहत गोद लेने की कानूनी, वित्तीय और भावनात्मक यात्रा को नेविगेट करने के लिए आपका संपूर्ण डिजिटल सहायक।"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side Navigation Pane */}
        <div className="w-full md:w-64 shrink-0">
          <div className={`sticky top-24 flex flex-col space-y-1 p-2 rounded-xl border ${
            highContrast ? "bg-stone-900 border-yellow-300" : "bg-white shadow-sm"
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = subPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSubPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-[#9e27b0] text-white shadow-md shadow-purple-200" 
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {lang === "en" ? item.titleEn : item.titleHi}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Content Pane */}
        <div className="flex-1 min-w-0">
          {renderContent()}
          
          {/* Universal Footer Action */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setActiveTab(PortalActiveTab.HOME)}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold uppercase tracking-widest rounded-md transition-colors"
            >
              {lang === "en" ? "Back to Dashboard" : "डैशबोर्ड पर वापस जाएं"}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
