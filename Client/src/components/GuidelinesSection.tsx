import React from "react";
import { Language } from "../data/translations";
import { PortalActiveTab, GuidelinesSubPage } from "../types";
import { BookOpen, FileText, Download, ShieldCheck, Banknote, Building2, HeartHandshake, Users, AlertTriangle } from "lucide-react";

interface GuidelinesSectionProps {
  lang: Language;
  highContrast: boolean;
  setActiveTab: (tab: PortalActiveTab) => void;
  subPage: GuidelinesSubPage;
  setSubPage: (page: GuidelinesSubPage) => void;
}

export default function GuidelinesSection({ lang, highContrast, setActiveTab, subPage, setSubPage }: GuidelinesSectionProps) {
  
  const subPageOptions: { id: GuidelinesSubPage; icon: React.ReactNode; labelEn: string; labelHi: string }[] = [
    { id: "financial", icon: <Banknote className="w-5 h-5" />, labelEn: "Financial Aid", labelHi: "वित्तीय सहायता" },
    { id: "dcpu", icon: <ShieldCheck className="w-5 h-5" />, labelEn: "DCPU Protocols", labelHi: "DCPU प्रोटोकॉल" },
    { id: "cci", icon: <Building2 className="w-5 h-5" />, labelEn: "CCI Standards", labelHi: "CCI मानक" },
    { id: "adoption", icon: <HeartHandshake className="w-5 h-5" />, labelEn: "Adoption Rules", labelHi: "गोद लेने के नियम" }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Dynamic Sub-navigation Bar */}
      <div className={`p-2 rounded-xl flex flex-wrap gap-2 shadow-xs border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-amber-100"}`}>
        {subPageOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSubPage(opt.id)}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
              subPage === opt.id
                ? highContrast
                  ? "bg-yellow-300 text-black shadow-inner"
                  : "bg-amber-100 text-amber-900 shadow-inner"
                : highContrast
                ? "bg-transparent text-gray-400 hover:text-yellow-300 hover:bg-stone-800"
                : "bg-transparent text-gray-500 hover:bg-amber-50 hover:text-amber-700"
            }`}
          >
            {opt.icon}
            {lang === "en" ? opt.labelEn : opt.labelHi}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`p-6 md:p-10 rounded-2xl border shadow-xs ${
        highContrast ? "bg-black border-yellow-300" : "bg-white border-gray-100"
      }`}>
        {subPage === "financial" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b pb-6 border-gray-200 dark:border-stone-800">
              <h2 className={`text-2xl md:text-3xl font-black mb-4 ${highContrast ? "text-yellow-300" : "text-amber-900"}`}>
                {lang === "en" ? "Financial Aid & Institutional Grants Guideline" : "वित्तीय सहायता और संस्थागत अनुदान दिशानिर्देश"}
              </h2>
              <p className={`text-base leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-600"}`}>
                {lang === "en" 
                  ? "Detailed frameworks and mandates regarding the allocation of funds to Child Care Institutions (CCIs), foster families, and individual child sponsorships under the Mission Vatsalya scheme."
                  : "मिशन वात्सल्य योजना के तहत बाल देखभाल संस्थानों (CCIs), पालक परिवारों और व्यक्तिगत बाल प्रायोजन को धन के आवंटन के संबंध में विस्तृत ढांचे और जनादेश।"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Banknote className="w-6 h-6" /> Sponsorship Grants
                </h3>
                <ul className={`list-disc pl-5 space-y-3 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                  <li>Monthly stipend of ₹4,000 per child allocated for educational, nutritional, and health needs.</li>
                  <li>Direct Benefit Transfer (DBT) routed directly into the joint bank account of the child and guardian.</li>
                  <li>Eligibility: Children from families with annual income not exceeding ₹72,000 (rural) or ₹96,000 (urban).</li>
                  <li>Maximum of two children per family can avail of the sponsorship.</li>
                  <li>Mandatory quarterly review by the Sponsorship and Foster Care Approval Committee (SFCAC).</li>
                  <li>Priority given to children of widows, divorced or abandoned mothers, orphans, and child victims of natural calamities.</li>
                  <li>Incentive for continuing education: Support suspended if child's attendance in school falls below 75%.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Building2 className="w-6 h-6" /> Institutional Grants (CCIs)
                </h3>
                <ul className={`list-disc pl-5 space-y-3 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                  <li>Maintenance grant of ₹3,000 per child per month for NGOs managing CCIs.</li>
                  <li>Infrastructure upgrade grants up to ₹50 Lakhs for state-run CCIs requiring renovations.</li>
                  <li>Specific allocations for bedding, clothing, and hygiene kits calculated annually at ₹2,500 per child.</li>
                  <li>Emergency medical funds set at ₹10,000 per child per year for non-empanelled treatments.</li>
                  <li>Contingency fund of ₹1,00,000 per annum per CCI for unforeseen operational expenses.</li>
                  <li>Salaries for specialized staff (counsellors, educators) partially matched by central funding.</li>
                  <li>Skill development fund: Additional ₹1,000 per adolescent child per month for vocational training.</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-stone-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <HeartHandshake className="w-6 h-6 text-rose-600 dark:text-rose-400" /> 
                Foster Care & Aftercare Financial Support
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl ${highContrast ? "bg-stone-900 border border-stone-700" : "bg-rose-50"}`}>
                  <h4 className="font-bold text-lg mb-3 text-rose-900 dark:text-rose-300">Foster Care Support</h4>
                  <p className={`text-sm mb-4 leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    Financial assistance provided to families who take in children temporarily, aiming to provide a family environment rather than institutional care.
                  </p>
                  <ul className={`list-disc pl-5 text-sm space-y-2 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    <li>Foster Care Maintenance: ₹4,000 per month per child.</li>
                    <li>Transferred directly to the bank account of the foster parents.</li>
                    <li>Subject to monthly monitoring reports submitted by DCPU caseworkers.</li>
                    <li>Additional medical allowances available for children with special needs (up to ₹2,000 extra per month).</li>
                  </ul>
                </div>

                <div className={`p-6 rounded-xl ${highContrast ? "bg-stone-900 border border-stone-700" : "bg-purple-50"}`}>
                  <h4 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-300">Aftercare Fund (18-21 years)</h4>
                  <p className={`text-sm mb-4 leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    Support for young adults transitioning out of institutional care upon reaching the age of 18, helping them integrate into mainstream society.
                  </p>
                  <ul className={`list-disc pl-5 text-sm space-y-2 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    <li>Monthly stipend of ₹4,000 for a maximum period of 3 years.</li>
                    <li>Mandatory requirement: The youth must be enrolled in a vocational training program, higher education, or actively seeking employment.</li>
                    <li>One-time establishment grant of ₹25,000 upon successful completion of the aftercare period to help start an independent life.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl mt-8 ${highContrast ? "bg-stone-900 border border-yellow-300" : "bg-amber-50 border border-amber-200"}`}>
              <h4 className="font-bold text-lg mb-2">Important Notice on Fund Utilization</h4>
              <p className="text-sm leading-relaxed mb-4">
                All CCIs and district authorities must submit Utilization Certificates (UCs) via the PFMS (Public Financial Management System) portal before the release of subsequent installments. Failure to provide audited UCs within the stipulated 90-day period will result in a freeze of the state pipeline grants.
              </p>
              
              <h4 className="font-bold text-lg mb-2 mt-6">Audit and Transparency</h4>
              <p className="text-sm leading-relaxed mb-4">
                To maintain complete transparency, the Ministry mandates a dual-audit system. Internal audits must be conducted bi-annually by empanelled Chartered Accountants, while external social audits must be facilitated annually involving members of the civil society, local academia, and the gram panchayat to ensure funds directly impact the targeted child demographics.
              </p>
              
              <button className={`flex items-center gap-2 text-sm font-bold px-4 py-2 mt-6 rounded-lg ${highContrast ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-amber-600 text-white hover:bg-amber-700"}`}>
                <Download className="w-4 h-4" /> Download Full Financial Manual PDF (2.4 MB)
              </button>
            </div>
          </div>
        )}

        {subPage === "dcpu" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b pb-6 border-gray-200 dark:border-stone-800">
              <h2 className={`text-2xl md:text-3xl font-black mb-4 ${highContrast ? "text-yellow-300" : "text-amber-900"}`}>
                {lang === "en" ? "District Child Protection Unit (DCPU) Protocol" : "जिला बाल संरक्षण इकाई (DCPU) प्रोटोकॉल"}
              </h2>
              <p className={`text-base leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-600"}`}>
                {lang === "en" 
                  ? "Standard Operating Procedures (SOPs) for the functioning of DCPUs, ensuring effective child protection mechanisms at the grassroots level across all districts."
                  : "सभी जिलों में जमीनी स्तर पर प्रभावी बाल संरक्षण तंत्र सुनिश्चित करने वाले DCPU के कामकाज के लिए मानक संचालन प्रक्रियाएं (SOPs)।"}
              </p>
            </div>

            <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
              <h3>Core Responsibilities of the DCPU</h3>
              <p>The District Child Protection Unit (DCPU) is the fundamental unit for implementing the Mission Vatsalya scheme at the district level. It is headed by the District Child Protection Officer (DCPO), who works under the direct supervision of the District Magistrate.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className={`p-5 rounded-lg border ${highContrast ? "border-stone-700" : "border-gray-200 bg-gray-50"}`}>
                  <h4 className="mt-0">1. Institutional Care Oversight</h4>
                  <ul className="mb-0">
                    <li>Ensure registration of all Child Care Institutions (CCIs) under the Juvenile Justice (Care and Protection of Children) Act, 2015.</li>
                    <li>Conduct monthly inspections of CCIs to monitor standards of care, nutrition, and safety.</li>
                    <li>Identify unregistered CCIs and take legal action for closure or mandatory registration.</li>
                    <li>Facilitate the rehabilitation and social integration of children leaving institutional care.</li>
                  </ul>
                </div>
                
                <div className={`p-5 rounded-lg border ${highContrast ? "border-stone-700" : "border-gray-200 bg-gray-50"}`}>
                  <h4 className="mt-0">2. Non-Institutional Care Promotion</h4>
                  <ul className="mb-0">
                    <li>Identify vulnerable children and families for sponsorship and foster care programs.</li>
                    <li>Process applications and present them before the Sponsorship and Foster Care Approval Committee (SFCAC).</li>
                    <li>Monitor the progress and well-being of children placed in foster care through regular field visits.</li>
                    <li>Maintain a roster of approved foster families and organize training programs for them.</li>
                  </ul>
                </div>
              </div>

              <h3>Coordination and Convergence Structure</h3>
              <p>The DCPU does not work in isolation. It is the central nervous system of child protection at the district level, connecting various statutory bodies:</p>
              
              <ul>
                <li><strong>Child Welfare Committees (CWCs):</strong> DCPU must provide administrative support, office space, and staff to the CWCs. The DCPU executes the orders passed by the CWC regarding children in need of care and protection.</li>
                <li><strong>Juvenile Justice Boards (JJBs):</strong> Similar to CWCs, the DCPU supports the JJBs in handling cases of children in conflict with the law, ensuring legal aid and probation officers are available.</li>
                <li><strong>Special Juvenile Police Unit (SJPU):</strong> Coordination with the police is vital for rescuing child laborers, victims of trafficking, and handling missing child reports (TrackChild portal).</li>
                <li><strong>Village Child Protection Committees (VCPC):</strong> DCPU is responsible for forming and training VCPCs at the panchayat level to act as the first line of defense against child marriage, labor, and abuse.</li>
              </ul>

              <h3>Vulnerability Mapping and Data Management</h3>
              <p>A key proactive duty of the DCPU is to conduct regular vulnerability mapping of the district to identify hotspots for child labor, trafficking, and child marriage. They must maintain a district-level database of children in need of care and protection (CNCP) and children in conflict with the law (CCL).</p>
            </div>
            
            <div className={`p-6 rounded-xl mt-8 ${highContrast ? "bg-stone-900 border border-yellow-300" : "bg-blue-50 border border-blue-200"}`}>
              <h4 className="font-bold text-lg mb-2">Quarterly Audit Mandate</h4>
              <p className="text-sm leading-relaxed">
                DCPUs are mandated to submit a comprehensive quarterly performance report to the State Child Protection Society (SCPS). This report must include metrics on cases resolved, funds disbursed, and inspections conducted. Non-compliance affects district funding ratings.
              </p>

              <h4 className="font-bold text-lg mb-2 mt-6">Crisis Intervention Centers (CIC)</h4>
              <p className="text-sm leading-relaxed">
                As per the latest 2025 guidelines, every DCPU must operate a 24x7 Crisis Intervention Center equipped with an emergency response vehicle, a duty officer, a medical professional on call, and a clinical psychologist. The CIC acts as the immediate first-responder for distress calls escalated from the 1098 Childline or local police stations regarding abandoned infants or rescued child laborers.
              </p>
            </div>
          </div>
        )}

        {subPage === "cci" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b pb-6 border-gray-200 dark:border-stone-800">
              <h2 className={`text-2xl md:text-3xl font-black mb-4 ${highContrast ? "text-yellow-300" : "text-amber-900"}`}>
                {lang === "en" ? "Safe Shelter & Infrastructure Standards (CCIs)" : "सुरक्षित आश्रय और बुनियादी ढांचा मानक (CCIs)"}
              </h2>
              <p className={`text-base leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-600"}`}>
                {lang === "en" 
                  ? "Rigorous infrastructure, safety, and operational mandates for Child Care Institutions to ensure a protective, nurturing, and secure environment for every child."
                  : "प्रत्येक बच्चे के लिए एक सुरक्षात्मक, पोषण और सुरक्षित वातावरण सुनिश्चित करने के लिए बाल देखभाल संस्थानों के लिए कठोर बुनियादी ढांचे, सुरक्षा और परिचालन जनादेश।"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-200"}`}>
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-indigo-800 dark:text-indigo-300">Space & Layout</h3>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Minimum 40 sq. ft. of dormitory space per child.</li>
                  <li>Separate dormitories for different age groups (0-6, 7-11, 12-18).</li>
                  <li>Strict separation of facilities for boys and girls.</li>
                  <li>Dedicated study rooms, library, and indoor recreation areas.</li>
                  <li>1 bathroom for every 10 children, properly ventilated.</li>
                  <li>Barrier-free access for children with disabilities (ramps, adapted toilets).</li>
                </ul>
              </div>

              <div className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-200"}`}>
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold text-teal-700 dark:text-teal-300">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-teal-800 dark:text-teal-300">Safety & Security</h3>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <li>CCTV cameras mandatory in all common areas and perimeters (not in dorms/bathrooms).</li>
                  <li>Fire safety clearance from local authorities renewed annually.</li>
                  <li>24x7 security guards and secure compound walls with guarded entry/exit.</li>
                  <li>Mandatory police verification and psychological evaluation for all staff members.</li>
                  <li>Strict visitor log maintenance and designated visiting areas.</li>
                  <li>Child Protection Policy document to be signed by every staff member.</li>
                </ul>
              </div>

              <div className={`p-5 rounded-xl border ${highContrast ? "bg-stone-900 border-yellow-300" : "bg-white border-gray-200"}`}>
                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold text-rose-700 dark:text-rose-300">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-rose-800 dark:text-rose-300">Nutrition & Health</h3>
                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Dietary chart approved by a certified nutritionist, catering to local food habits.</li>
                  <li>Four nutritious meals per day including milk/eggs/fruits/green vegetables.</li>
                  <li>Quarterly comprehensive medical check-ups for all children, with individual health files.</li>
                  <li>First-aid kits, isolation room for contagious illnesses, and tie-ups with nearest hospitals.</li>
                  <li>RO water purifiers and regular testing of drinking water quality.</li>
                  <li>Mandatory psychological counseling sessions available for all children.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${highContrast ? "border-stone-700" : "bg-orange-50 border-orange-100"}`}>
                <h3 className="text-lg font-bold mb-3 text-orange-900 dark:text-orange-400">Types of CCIs (Registration Mandates)</h3>
                <p className={`text-sm mb-4 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                  Under the JJ Act, an institution must be specifically registered under one of these categories depending on the children they house:
                </p>
                <ul className={`list-disc pl-5 text-sm space-y-2 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                  <li><strong>Children's Home:</strong> For children in need of care and protection (orphans, abandoned).</li>
                  <li><strong>Observation Home:</strong> Temporary reception of children in conflict with law during inquiry.</li>
                  <li><strong>Special Home:</strong> For rehabilitation of children found guilty of an offence.</li>
                  <li><strong>Place of Safety:</strong> For children above 16 years accused/convicted of heinous offences.</li>
                  <li><strong>Specialized Adoption Agency (SAA):</strong> For infants and young children awaiting adoption.</li>
                </ul>
              </div>
              
              <div className={`p-6 rounded-xl border ${highContrast ? "border-stone-700" : "bg-sky-50 border-sky-100"}`}>
                <h3 className="text-lg font-bold mb-3 text-sky-900 dark:text-sky-400">Rehabilitation & Reintegration</h3>
                <p className={`text-sm mb-4 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                  CCIs are not meant to be permanent destinations. The ultimate goal is restoration to family or society.
                </p>
                <ul className={`list-disc pl-5 text-sm space-y-2 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                  <li><strong>Individual Care Plan (ICP):</strong> Must be developed for every child within one month of admission, outlining their educational, health, and psychological goals.</li>
                  <li><strong>Education:</strong> All children must be enrolled in formal schooling. Tutors must be arranged for remedial classes.</li>
                  <li><strong>Skill Development:</strong> Mandatory vocational training for children above 14 years.</li>
                  <li><strong>Recreation:</strong> Provisions for sports, cultural activities, and outdoor excursions.</li>
                </ul>
              </div>
            </div>

            <div className={`p-6 rounded-xl mt-6 border ${highContrast ? "border-emerald-700 bg-emerald-950/30" : "bg-emerald-50 border-emerald-100"}`}>
               <h3 className="text-lg font-bold mb-3 text-emerald-900 dark:text-emerald-400">Exit Policy & De-institutionalization</h3>
               <p className={`text-sm mb-4 leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                 The Mission Vatsalya framework strongly advocates for de-institutionalization. A child should only remain in a CCI as a measure of last resort.
               </p>
               <p className={`text-sm leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                 For children whose families cannot be traced or rehabilitated within two years, the CCI administration is legally obligated to declare them "legally free for adoption" through the CWC and transfer them to a Specialized Adoption Agency. For older adolescents, the transition phase begins at age 17, mapping them to Aftercare programs to secure housing and employment.
               </p>
            </div>

            <div className="mt-8 border-t pt-6 border-gray-200 dark:border-stone-800">
              <h3 className="text-lg font-bold mb-4">Staffing Pattern Mandates</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className={`text-xs uppercase ${highContrast ? "bg-stone-800 text-yellow-300" : "bg-gray-50 text-gray-700"}`}>
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Designation</th>
                      <th className="px-4 py-3">Capacity (per 50 children)</th>
                      <th className="px-4 py-3 rounded-tr-lg">Qualification Requirement</th>
                    </tr>
                  </thead>
                  <tbody className={highContrast ? "text-gray-200" : "text-gray-600"}>
                    <tr className="border-b dark:border-stone-800">
                      <td className="px-4 py-3 font-medium">Superintendent / Person-in-charge</td>
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">Master's in Social Work / Psychology</td>
                    </tr>
                    <tr className="border-b dark:border-stone-800">
                      <td className="px-4 py-3 font-medium">Counsellor</td>
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">Master's in Psychology / Clinical Psych.</td>
                    </tr>
                    <tr className="border-b dark:border-stone-800">
                      <td className="px-4 py-3 font-medium">Child Welfare Officer / Caseworker</td>
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3">Degree in Social Work / Sociology</td>
                    </tr>
                    <tr className="border-b dark:border-stone-800">
                      <td className="px-4 py-3 font-medium">House Mother / Father</td>
                      <td className="px-4 py-3">4 (in shifts)</td>
                      <td className="px-4 py-3">Graduate with child care experience</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {subPage === "adoption" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b pb-6 border-gray-200 dark:border-stone-800">
              <h2 className={`text-2xl md:text-3xl font-black mb-4 ${highContrast ? "text-yellow-300" : "text-amber-900"}`}>
                {lang === "en" ? "Adoption & Foster Placement Oversight" : "गोद लेना और पालक प्लेसमेंट निरीक्षण"}
              </h2>
              <p className={`text-base leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-600"}`}>
                {lang === "en" 
                  ? "Guidelines regulating the CARA state-coordination policies, pre-adoption assessments, and post-placement monitoring to ensure the child's best interests."
                  : "CARA राज्य-समन्वय नीतियों, गोद लेने से पूर्व आकलन, और बच्चे के सर्वोत्तम हितों को सुनिश्चित करने के लिए प्लेसमेंट के बाद की निगरानी को विनियमित करने वाले दिशानिर्देश।"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Home Study Report (HSR) Regulations
                </h3>
                <div className={`p-5 rounded-xl text-sm leading-relaxed space-y-3 ${highContrast ? "bg-stone-900" : "bg-gray-50 border border-gray-100"}`}>
                  <p>The Home Study Report is the foundation of the adoption process. It must be conducted by a qualified social worker affiliated with a Specialized Adoption Agency (SAA).</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Timeline:</strong> The HSR must be completed and uploaded to CARINGS within 30 days from the date of registration by the PAPs.</li>
                    <li><strong>Validity:</strong> An approved HSR is valid for 3 years and needs to be updated if there are significant changes in the family.</li>
                    <li><strong>Assessment Parameters:</strong> Financial stability, emotional readiness, marital harmony, motivation for adoption, medical history, and community support systems.</li>
                    <li><strong>Interviews:</strong> Must include joint and individual interviews of the Prospective Adoptive Parents (PAPs), and interviews with older children residing in the home to gauge their acceptance.</li>
                    <li><strong>Rejection:</strong> If rejected, reasons must be clearly documented. PAPs can appeal to the State Adoption Resource Agency (SARA).</li>
                  </ul>
                </div>

                <h3 className="text-lg font-bold mb-4 mt-8 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Matching & Child Referral
                </h3>
                <div className={`p-5 rounded-xl text-sm leading-relaxed space-y-3 ${highContrast ? "bg-stone-900" : "bg-gray-50 border border-gray-100"}`}>
                  <p>Once approved, parents are placed in the seniority list. Referrals are made strictly based on seniority and parent preferences.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Referral Cycle:</strong> PAPs receive profiles of up to 3 children based on their criteria.</li>
                    <li><strong>Decision Time:</strong> Parents have 48 hours to accept or reject a referral.</li>
                    <li><strong>Medical Examination Report (MER):</strong> Parents have the right to review the child's detailed MER and have it evaluated by their own physician before accepting.</li>
                    <li><strong>Meeting the Child:</strong> After acceptance, parents must visit the SAA within 15 days to meet the child and complete matching formalities.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  Post-Placement Monitoring
                </h3>
                <div className={`p-5 rounded-xl text-sm leading-relaxed space-y-3 ${highContrast ? "bg-stone-900" : "bg-gray-50 border border-gray-100"}`}>
                  <p>After a child is placed in pre-adoption foster care (and eventually legally adopted), the agency is mandated to conduct follow-up visits to ensure the child is adjusting well to their new family.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>In-country Adoption:</strong> Six post-placement reports must be filed online in the CARINGS portal (monthly for the first six months, then quarterly for the next eighteen months).</li>
                    <li><strong>Inter-country Adoption:</strong> Six post-placement reports over a period of two years (quarterly for the first year, half-yearly for the second year). These are conducted by Authorized Foreign Adoption Agencies (AFAAs).</li>
                    <li><strong>Content of Reports:</strong> Assessing the child's health, nutritional status, schooling, attachment with parents, and overall psychological well-being.</li>
                    <li><strong>Disruption/Dissolution:</strong> If the placement breaks down, the SAA and DCPU must immediately intervene to retrieve the child, provide psychological counselling, and initiate the process of finding an alternate family.</li>
                  </ul>
                </div>

                <div className={`p-5 rounded-xl mt-8 border ${highContrast ? "border-red-500 bg-red-950" : "border-red-200 bg-red-50"}`}>
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Root Search Guidelines
                  </h4>
                  <p className="text-xs leading-relaxed text-red-900 dark:text-red-200">
                    Under the new regulations, adopted children above 18 years have the legal right to seek their biological roots. Agencies must preserve adoption records permanently and provide counseling to the adoptee before sharing information. If biological parents had requested anonymity, the agency must seek their consent before revealing identities.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-stone-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> 
                Surrender & Abandonment Protocols
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl ${highContrast ? "bg-stone-900 border border-stone-700" : "bg-indigo-50 border border-indigo-100"}`}>
                  <h4 className="font-bold text-lg mb-3 text-indigo-900 dark:text-indigo-300">Surrendered Children</h4>
                  <p className={`text-sm mb-4 leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    When biological parents wish to surrender their child due to physical, emotional, or social factors beyond their control, a stringent protocol is followed to ensure no coercion is involved.
                  </p>
                  <ul className={`list-disc pl-5 text-sm space-y-2 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    <li><strong>Deed of Surrender:</strong> Must be executed before the Child Welfare Committee (CWC).</li>
                    <li><strong>Reconsideration Period:</strong> The parents are given 60 days to reconsider their decision. During this period, the child is placed in a Specialized Adoption Agency.</li>
                    <li><strong>Legally Free Status:</strong> If not reclaimed after 60 days, the CWC declares the child legally free for adoption.</li>
                    <li><strong>Anonymity:</strong> The identity of surrendering parents is kept strictly confidential to prevent societal stigma.</li>
                  </ul>
                </div>

                <div className={`p-6 rounded-xl ${highContrast ? "bg-stone-900 border border-stone-700" : "bg-amber-50 border border-amber-100"}`}>
                  <h4 className="font-bold text-lg mb-3 text-amber-900 dark:text-amber-300">Abandoned & Orphaned Children</h4>
                  <p className={`text-sm mb-4 leading-relaxed ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    For children found abandoned or without legal guardians, a thorough trace is required before initiating the adoption process.
                  </p>
                  <ul className={`list-disc pl-5 text-sm space-y-2 ${highContrast ? "text-gray-300" : "text-gray-700"}`}>
                    <li><strong>FIR Registration:</strong> Immediate filing of an FIR/missing person report with the local police station.</li>
                    <li><strong>Trace Efforts:</strong> Police must submit a non-traceable report after one month of publishing the child's photograph in a national and a local newspaper, and broadcasting on local television.</li>
                    <li><strong>Declaration:</strong> Once the non-traceable report is received, the CWC declares the child legally free for adoption.</li>
                    <li><strong>Age Determination:</strong> If age is unknown, a medical age-determination test (Ossification test) is conducted within 15 days of admission to the CCI.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl mt-8 flex flex-col md:flex-row items-center justify-between gap-6 ${highContrast ? "bg-black border border-yellow-300" : "bg-amber-600 text-white"}`}>
              <div>
                <h4 className={`font-bold text-xl ${highContrast ? "text-yellow-300" : "text-white"}`}>
                  CARA Complete Regulations (2022)
                </h4>
                <p className={`text-sm mt-1 max-w-2xl ${highContrast ? "text-gray-300" : "text-amber-100"}`}>
                  Access the complete, legally binding gazette notification governing all adoption procedures in India.
                </p>
              </div>
              <button className={`shrink-0 px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${highContrast ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-white text-amber-900 hover:bg-amber-50"}`}>
                <Download className="w-5 h-5" />
                Download Gazette PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
