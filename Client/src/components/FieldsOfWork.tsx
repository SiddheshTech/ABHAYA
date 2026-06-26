import React, { useState } from "react";
import { Language, translations } from "../data/translations";
import { Heart, MessageSquare, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToastStore } from "../lib/store";

// Import the generated children education image
import childrenEduImg from "../assets/images/indian_schoolchildren_field_1782110572077.jpg";

interface FieldsOfWorkProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

interface FieldItem {
  id: string;
  labelEn: string;
  labelHi: string;
  colorClass: string;
  accentHex: string;
  activeBgClass: string;
  headingEn: string;
  headingHi: string;
  descriptionEn: string;
  descriptionHi: string;
  image: string;
}

export default function FieldsOfWork({ lang, highContrast, textSize }: FieldsOfWorkProps) {
  const [activeTab, setActiveTab] = useState<string>("education");
  const { addToast } = useToastStore();

  const fields: FieldItem[] = [
    {
      id: "education",
      labelEn: "EDUCATION",
      labelHi: "शिक्षा",
      colorClass: "text-[#00acc1]",
      accentHex: "#00acc1",
      activeBgClass: "bg-cyan-50/80 border-[#00acc1]",
      headingEn: "SHIKSHA KI RAKSHA, BHAVISHYA KI RAKSHA!",
      headingHi: "शिक्षा की रक्षा, भविष्य की रक्षा!",
      descriptionEn: "From early childhood to adolescence, quality education unlocks human potential. ABHAYA champions the cause of India's underserved since 2004, aligning inclusive learning with national ethos. Safe classrooms, girls' participation, digital access - our interventions remove barriers spanning from urban slums to rural communities. Uplifting over 80,000 students, we have seeded future innovation and powered sustainable solutions. Click here to learn more about its transformative impact on our children.",
      descriptionHi: "प्रारंभिक बाल्यावस्था से लेकर किशोरावस्था तक, गुणवत्तापूर्ण शिक्षा मानव क्षमता को उजागर करती है। अभया (ABHAYA) २००४ से भारत के वंचित बच्चों के लिए कार्य कर रहा है, जो समावेशी शिक्षा को राष्ट्रीय लोकाचार के साथ संरेखित करता है। सुरक्षित कक्षाएँ, लड़कियों की भागीदारी, डिजिटल पहुँच - उनके हस्तक्षेप शहरी मलिन बस्तियों से लेकर ग्रामीण समुदायों तक फैली बाधाओं को दूर करते हैं। ८०,००० से अधिक छात्रों को सशक्त बनाकर, हमने भविष्य के नवाचारों और सतत समाधानों की नींव रखी है।",
      image: childrenEduImg
    },
    {
      id: "health",
      labelEn: "HEALTH",
      labelHi: "स्वास्थ्य",
      colorClass: "text-[#ec407a]",
      accentHex: "#ec407a",
      activeBgClass: "bg-rose-50/80 border-[#ec407a]",
      headingEn: "SWASTHYA SE SAMRIDDHI, HAR BACHE KI BHALAI!",
      headingHi: "स्वास्थ्य से समृद्धि, हर बच्चे की भलाई!",
      descriptionEn: "Every child deserves a healthy start in life. Our infant healthcare and nutrition programs identify acute malnutrition, treat critical seasonal illnesses, and set up sanitized wellness rooms in primary schools. By distributing hygiene toolkits, providing dynamic mental health counselling, and conducting pediatric camps, we ensure optimal development. Over 1,50,000 rural children have been integrated into regular health tracking systems, building a vital generation.",
      descriptionHi: "प्रत्येक बच्चे को जीवन में एक स्वस्थ शुरुआत की आवश्यकता होती है। हमारे शिशु स्वास्थ्य और पोषण कार्यक्रम तीव्र कुपोषण की पहचान करते हैं, गंभीर मौसमी बीमारियों का इलाज करते हैं और प्राथमिक विद्यालयों में स्वच्छ कल्याण कक्ष स्थापित करते हैं। स्वच्छता टूलकिट वितरित करके, गतिशील मानसिक स्वास्थ्य परामर्श प्रदान करके और बाल चिकित्सा शिविर आयोजित करके, हम इष्टतम विकास सुनिश्चित करते हैं।",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "resilience",
      labelEn: "RESILIENCE",
      labelHi: "लचीलापन",
      colorClass: "text-[#fbc02d]",
      accentHex: "#fbc02d",
      activeBgClass: "bg-amber-50/80 border-[#fbc02d]",
      headingEn: "DRIDH SANKALP, HAR CHIRAAG KI ROSHNI!",
      headingHi: "दृढ़ संकल्प, हर चिराग की रोशनी!",
      descriptionEn: "Deepening resilience prepares vulnerable child protection networks to absorb stress from socioeconomic shocks and natural crises. We empower children with leadership opportunities, vocational learning tracks, and disaster safety training modules. This instills psychological confidence, enables them to raise voices against forced labor, and encourages active participation in constructing children's parliaments at panchayat levels.",
      descriptionHi: "लचीलापन मजबूत करने से कमजोर बाल संरक्षण नेटवर्क सामाजिक-आर्थिक झटकों और प्राकृतिक संकटों से निपटने के लिए तैयार होते हैं। हम बच्चों को नेतृत्व के अवसर, व्यावसायिक शिक्षण ट्रैक और आपदा सुरक्षा प्रशिक्षण मॉड्यूल प्रदान करते हैं। यह मनोवैज्ञानिक आत्मविश्वास पैदा करता है, उन्हें बाल श्रम के खिलाफ आवाज उठाने के लिए सक्षम बनाता है।",
      image: "https://images.unsplash.com/photo-1540747737956-fd7c21b8837a?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "livelihood",
      labelEn: "LIVELIHOOD",
      labelHi: "आजीविका",
      colorClass: "text-[#2e7d32]",
      accentHex: "#2e7d32",
      activeBgClass: "bg-emerald-50/80 border-[#2e7d32]",
      headingEn: "SWAVALAMBAN, PARIVAR KO SHAKTI!",
      headingHi: "स्वावलंबन, परिवार को शक्ति!",
      descriptionEn: "Sustaining families' livelihoods acts as the primary barrier against distress child migration and forced labor. When families achieve financial safety, children are naturally shielded and enrolled in educational streams. By supporting women self-help organic cooperatives, facilitating micro-finance directories, and seeding small manufacturing setups, we boost double-income viability. Over 35,000 households now live with dignity and independence.",
      descriptionHi: "परिवारों की आजीविका को बनाए रखना संकटग्रस्त बाल पलायन और जबरन श्रम के खिलाफ प्राथमिक रक्षक के रूप में काम करता है। जब परिवार वित्तीय सुरक्षा प्राप्त करते हैं, तो बच्चे स्वाभाविक रूप से सुरक्षित होते हैं और शैक्षिक धाराओं में नामांकित होते हैं। महिलाओं के स्वयं सहायता जैविक सहकारी समितियों का समर्थन करके हम आजीविका सुरक्षा बढ़ाते हैं।",
      image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "protection",
      labelEn: "PROTECTION",
      labelHi: "सुरक्षा",
      colorClass: "text-[#d84315]",
      accentHex: "#d84315",
      activeBgClass: "bg-orange-50/80 border-[#d84315]",
      headingEn: "SURAKSHIT BACHPAN, SURAKSHIT BHARAT!",
      headingHi: "सुरक्षित बचपन, सुरक्षित भारत!",
      descriptionEn: "Our deepest commitment lies in protecting children from neglect, early forced marriages, and severe exploitation. Working in active coordination with District Child Protection Units (DCPU) and the state-level Special Juvenile Police Unit (SJPU), we provide modern shelter infrastructure, instant rescue operations, legal assistance, and safe transitions into accredited, loving foster homes that enable overall child rehabilitation.",
      descriptionHi: "हमारा सबसे गहरा संकल्प बच्चों को उपेक्षा, शुरुआती जबरन विवाह और गंभीर शोषण से बचाना है। जिला बाल संरक्षण इकाइयों (DCPU) और राज्य स्तरीय विशेष किशोर पुलिस इकाई (SJPU) के साथ सक्रिय समन्वय में काम करते हुए, हम आधुनिक आश्रय बुनियादी ढांचा, तत्काल बचाव अभियान और कानूनी सहायता प्रदान करते हैं।",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "humanitarian",
      labelEn: "HUMANITARIAN",
      labelHi: "मानवीय",
      colorClass: "text-[#8e24aa]",
      accentHex: "#8e24aa",
      activeBgClass: "bg-purple-50/80 border-[#8e24aa]",
      headingEn: "AAPADA MEIN SEVA, HAR BACHE KA SAHARA!",
      headingHi: "आपदा में सेवा, हर बच्चे का सहारा!",
      descriptionEn: "During humanitarian crises, children suffer the most. Our active emergency relief teams coordinate rapid distributions of pediatric health kits, install child-friendly safe zones in refugee centers, and prevent structural child-family separations. Through emergency psychosocial counselling and academic tracking systems, we assist in restoring normalcy to displaced communities under difficult circumstances.",
      descriptionHi: "मानवीय संकटों के दौरान बच्चे सबसे अधिक पीड़ित होते हैं। हमारी सक्रिय आपातकालीन राहत टीमें बाल चिकित्सा स्वास्थ्य किटों के तेजी से वितरण का समन्वय करती हैं, राहत शिविरों में बच्चों के अनुकूल सुरक्षित क्षेत्र स्थापित करती हैं और संरचनात्मक बाल-परिवार अलगाव को रोकती हैं।",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  const activeField = fields.find(f => f.id === activeTab) || fields[0];

  const drawIcon = (id: string, active: boolean, accent: string) => {
    switch (id) {
      case "education":
        return (
          <svg className={`w-16 h-16 transition-transform duration-300 ${active ? "scale-110" : "hover:scale-105"}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g fill={accent} transform="rotate(-12 50 50)">
              {/* Left block holding "A" */}
              <rect x="20" y="25" width="30" height="30" rx="6" opacity="0.9" />
              {/* Right block holding "B" */}
              <rect x="44" y="38" width="30" height="30" rx="6" />
              {/* Overlap cut / shadow */}
              <rect x="44" y="38" width="30" height="30" rx="6" fill="none" stroke="#ffffff" strokeWidth="2" />
              {/* White Letter A */}
              <text x="35" y="46" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle">A</text>
              {/* White Letter B */}
              <text x="59" y="59" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle">B</text>
            </g>
          </svg>
        );
      case "health":
        return (
          <svg className={`w-16 h-16 transition-transform duration-300 ${active ? "scale-110 animate-pulse" : "hover:scale-105"}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Puffy pink hand-drawn cross symbol */}
            <path
              d="M 50 15 C 55 15, 60 20, 60 28 L 60 40 L 72 40 C 80 40, 85 45, 85 50 C 85 55, 80 60, 72 60 L 60 60 L 60 72 C 60 80, 55 85, 50 85 C 45 85, 40 80, 40 72 L 40 60 L 28 60 C 20 60, 15 55, 15 50 C 15 45, 20 40, 28 40 L 40 40 L 40 28 C 40 20, 45 15, 50 15 Z"
              fill={accent}
            />
          </svg>
        );
      case "resilience":
        return (
          <svg className={`w-16 h-16 transition-transform duration-300 ${active ? "scale-110" : "hover:scale-105"}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Chubby lightning bolt tilted */}
            <path
              d="M 58 10 L 25 55 L 48 55 L 35 90 L 75 42 L 50 42 Z"
              fill={accent}
              transform="rotate(-5 50 50)"
            />
          </svg>
        );
      case "livelihood":
        return (
          <svg className={`w-16 h-16 transition-transform duration-300 ${active ? "scale-110" : "hover:scale-105"}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Green branch with leaves */}
            <g fill={accent} transform="rotate(15 50 50)">
              {/* Stem */}
              <path d="M 50 85 C 48 70, 45 50, 45 15" stroke={accent} strokeWidth="6" strokeLinecap="round" />
              {/* Leaves */}
              <path d="M 45 15 C 35 15, 25 25, 45 35 C 55 25, 45 15, 45 15" />
              <path d="M 46 38 C 25 35, 20 50, 46 55 C 55 50, 46 38, 46 38" />
              <path d="M 48 60 C 28 60, 26 75, 48 75 C 55 70, 48 60, 48 60" />
              {/* Right side leaves */}
              <path d="M 48 26 C 65 24, 72 38, 48 43" />
              <path d="M 47 48 C 68 45, 75 60, 47 65" />
            </g>
          </svg>
        );
      case "protection":
        return (
          <svg className={`w-16 h-16 transition-transform duration-300 ${active ? "scale-110" : "hover:scale-105"}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Orange organic rustic shield with small white spots */}
            <g transform="rotate(10 50 50)">
              <path
                d="M 50 15 C 72 17, 85 24, 80 55 C 75 80, 52 90, 50 90 C 48 90, 25 80, 20 55 C 15 24, 28 17, 50 15 Z"
                fill={accent}
              />
              {/* White spots */}
              <circle cx="38" cy="40" r="4" fill="#ffffff" />
              <circle cx="50" cy="52" r="4.5" fill="#ffffff" />
              <circle cx="62" cy="40" r="4" fill="#ffffff" />
              <circle cx="50" cy="32" r="4" fill="#ffffff" />
            </g>
          </svg>
        );
      case "humanitarian":
        return (
          <svg className={`w-16 h-16 transition-transform duration-300 ${active ? "scale-110" : "hover:scale-105"}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Purple stylized award trophy */}
            <g fill={accent} transform="rotate(-15 50 50)">
              {/* Cup bowl */}
              <path d="M 30 20 L 70 20 C 70 45, 62 60, 50 63 C 38 60, 30 45, 30 20 Z" />
              {/* Base stem */}
              <rect x="46" y="63" width="8" height="18" rx="2" />
              {/* Base plate */}
              <path d="M 35 81 L 65 81 C 65 81, 62 88, 50 88 C 38 88, 35 81, 35 81 Z" />
              {/* Left Handle */}
              <path d="M 30 30 C 18 30, 20 48, 30 48" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Right Handle */}
              <path d="M 70 30 C 82 30, 80 48, 70 48" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Star on Cup */}
              <path d="M 50 30 L 52 35 L 57 35 L 53 38 L 55 43 L 50 40 L 45 43 L 47 38 L 43 35 L 48 35 Z" fill="#ffffff" />
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const dynamicLabelClass = textSize === "large" ? "text-sm" : textSize === "extra-large" ? "text-base" : "text-xs";
  const dynamicHeadingClass = textSize === "large" ? "text-3xl" : textSize === "extra-large" ? "text-4xl" : "text-2xl md:text-3xl";

  return (
    <section className={`w-full py-12 ${highContrast ? "bg-black text-yellow-300 border-y border-yellow-300" : "bg-white"}`} id="fields-of-work-section">
      <div className="w-full px-4 md:px-8">
        
        {/* Upper Title Section */}
        <div className="text-center mb-10">
          <h2 className="text-rose-600 font-extrabold text-3xl md:text-4xl tracking-wider select-none">
            {lang === "en" ? "OUR FIELDS OF WORK" : "हमारे कार्य क्षेत्र"}
          </h2>
          <div className="h-1 w-24 bg-rose-600 mx-auto mt-3 rounded-full" />
        </div>

        {/* Categories Grid - 6 columns across full screen width */}
        <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6 justify-center items-center select-none py-4 border-b border-gray-100">
          {fields.map((f) => {
            const isActive = activeTab === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer border ${
                  isActive 
                    ? highContrast 
                      ? "border-yellow-300 bg-stone-900" 
                      : "bg-[#e0f7fa]/30 border-cyan-100 shadow-2xs"
                    : "border-transparent opacity-85 hover:opacity-100"
                }`}
              >
                {/* Visual Graphic representation */}
                <div className="mb-3 transform transition-all duration-300 hover:scale-105 flex items-center justify-center h-20 w-full">
                  {drawIcon(f.id, isActive, highContrast ? "#facc15" : f.accentHex)}
                </div>

                {/* Typography label */}
                <span 
                  style={{ color: highContrast ? "#facc15" : f.accentHex }}
                  className={`${dynamicLabelClass} font-black tracking-widest text-center uppercase`}
                >
                  {lang === "en" ? f.labelEn : f.labelHi}
                </span>

                {/* Animated Light cyan indicator caret pointing UP from card underneath */}
                {isActive && !highContrast && (
                  <div className="absolute -bottom-4 z-20 hidden md:block">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[14px] border-b-cyan-50/95" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Spotlight Card below */}
        <div className="max-w-7xl mx-auto mt-6 relative" id="spotlight-stage">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className={`grid grid-cols-1 lg:grid-cols-12 rounded-2xl md:rounded-3xl overflow-hidden border ${
                highContrast 
                  ? "bg-stone-950 border-yellow-300" 
                  : "bg-[#e0f7fa]/40 border-cyan-100 shadow-md"
              }`}
            >
              {/* Left Column: Photograph (takes 5 cols) */}
              <div className="lg:col-span-5 h-[280px] md:h-[400px] relative overflow-hidden shrink-0">
                <img
                  src={activeField.image}
                  alt={activeField.labelEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                
                {/* High Contrast info badge overlay */}
                <div className="absolute top-4 left-4 py-1 px-3 bg-black/75 backdrop-blur-xs text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                  ★ {lang === "en" ? activeField.labelEn : activeField.labelHi}
                </div>
              </div>

              {/* Right Column: Detailed Context Text (takes 7 cols) */}
              <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between items-start text-left relative min-h-[300px]">
                
                <div className="space-y-4 w-full">
                  {/* Category breadcrumb */}
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
                    <span className="text-xs font-bold text-gray-450 uppercase tracking-widest font-mono">
                      {lang === "en" ? "Interactive Focus Domain" : "सक्रिय कार्य क्षेत्र"}
                    </span>
                  </div>

                  <h3 
                    style={{ color: highContrast ? "#facc15" : "#00acc1" }}
                    className={`${dynamicHeadingClass} font-black tracking-tight uppercase leading-tight md:max-w-xl`}
                  >
                    {lang === "en" ? activeField.headingEn : activeField.headingHi}
                  </h3>

                  <p className={`text-gray-600 leading-relaxed font-normal ${textSize === "large" ? "text-base" : textSize === "extra-large" ? "text-lg" : "text-sm"} md:max-w-2xl`}>
                    {lang === "en" ? activeField.descriptionEn : activeField.descriptionHi}
                  </p>
                </div>

                {/* Submitting buttons and Persistent Chat floats */}
                <div className="mt-8 flex flex-wrap gap-4 items-center justify-between w-full">
                  <button
                    onClick={() => {
                      addToast(`${lang === "en" ? "Expanding info file on" : "जानकारी फ़ाइल खोल रहा है:"} ${lang === "en" ? activeField.labelEn : activeField.labelHi}...`, "info");
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold shadow-xs transition-all hover:opacity-90 cursor-pointer ${
                      highContrast 
                        ? "bg-yellow-300 text-black" 
                        : "bg-cyan-600 text-white hover:bg-cyan-700"
                    }`}
                  >
                    <span>{lang === "en" ? "Know More" : "अधिक जानें"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Interactive localized indicators inside spotlight */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1">
                    <Check className="w-4 h-4 text-emerald-650 shrink-0" />
                    <span>State Level Direct Action Protocol</span>
                  </div>
                </div>

                {/* Persistent interactive floating chat buttons exactly on the bottom right of the card inside spotlight */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10 hidden sm:flex">
                  {/* WhatsApp Floating button */}
                  <a 
                    href="https://wa.me/911098" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                    title="WhatsApp Emergency Help Desk"
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.372a9.936 9.936 0 0 0 4.779 1.218h.004c5.506 0 9.99-4.478 9.99-9.984a9.99 9.99 0 0 0-9.998-9.862zm0 1.794a8.04 8.04 0 0 1 8.045 8.043 8.04 8.04 0 0 1-8.04 8.048c-1.578 0-3.111-.462-4.433-1.336l-.317-.21L4.1 19.16l.84-3.13-.228-.363A8.025 8.025 0 0 1 3.805 11.984a8.04 8.04 0 0 1 8.207-7.989z" />
                    </svg>
                  </a>

                  {/* Red Chat pill button */}
                  <button 
                    onClick={() => addToast(lang === "en" ? "Spawning central NIC chatbot assistant..." : "केंद्रीय एनआईसी चैटबॉट सहायक शुरू हो रहा है...", "success")}
                    className="flex items-center gap-1.5 bg-red-650 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 shrink-0 grow-0 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-red-650" />
                    <span>Chat</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
