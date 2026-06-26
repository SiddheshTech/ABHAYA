import React, { useState, useEffect } from "react";
import { Language } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, ArrowRight, Play, Award, Heart, CheckCircle2, 
  HelpCircle, Sparkles, Volume2, Bookmark, X, Star, FileText 
} from "lucide-react";

interface CorporatePartnershipsProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

interface Partner {
  id: number;
  name: string;
  logo: React.ReactNode;
  descEn: string;
  descHi: string;
  impactEn: string;
  impactHi: string;
}

interface Testimonial {
  id: string;
  titleEn: string;
  titleHi: string;
  categoryEn: string;
  categoryHi: string;
  narratorEn: string;
  narratorHi: string;
  locationEn: string;
  locationHi: string;
  videoThumbUrl: string;
  duration: string;
  transcriptEn: string;
  transcriptHi: string;
  statsEn: string;
  statsHi: string;
}

export default function CorporatePartnerships({ lang, highContrast, textSize }: CorporatePartnershipsProps) {
  const [activeDot, setActiveDot] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Auto scroll partnerships for micro-interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const partners: Partner[] = [
    {
      id: 0,
      name: "Harish & Bina Shah Foundation",
      logo: (
        <svg className="w-full h-full max-h-16" viewBox="0 0 280 120" fill="none">
          {/* Elegant Monogram */}
          <g transform="translate(140, 42) scale(1.15)">
            <ellipse cx="0" cy="0" rx="16" ry="24" stroke="#9A1B29" strokeWidth="1.5" fill="none" />
            <path d="M-8,-10 L-8,10 M8,-10 L8,10 M-8,0 L8,0" stroke="#9A1B29" strokeWidth="2" />
            <path d="M-3,-16 C1,-16 4,-12 4,-8 C4,-4 0,-2 -4,-2 L-8,-2" stroke="#9A1B29" strokeWidth="1.8" fill="none" />
            <path d="M0,0 C4,0 7,3 7,7 C7,11 4,14 0,14" stroke="#9A1B29" strokeWidth="1.8" fill="none" />
            <circle cx="0" cy="0" r="1.5" fill="#9A1B29" />
          </g>
          {/* Foundation Text */}
          <text x="140" y="88" fontSize="13.2" fontFamily="'Inter', sans-serif" fontWeight="800" letterSpacing="2.8" fill="#1e293b" textAnchor="middle">
            HARISH & BINA SHAH
          </text>
          <text x="140" y="103" fontSize="8.8" fontFamily="'Inter', sans-serif" fontWeight="500" letterSpacing="4.5" fill="#64748b" textAnchor="middle">
            FOUNDATION
          </text>
        </svg>
      ),
      descEn: "Key sponsor facilitating national healthcare facilities alignment and critical nutrition.",
      descHi: "राष्ट्रीय स्वास्थ्य व्यवस्थाओं और महत्वपूर्ण पोषण सुरक्षा के सूत्रधार प्रमुख प्रायोजक।",
      impactEn: "🏥 Enabled pediatric treatment resources inside 40 government host facilities.",
      impactHi: "🏥 40 सरकारी मेजबान केंद्रों में बाल चिकित्सा उपचार संसाधन प्रदान किए गए।"
    },
    {
      id: 1,
      name: "Sattva Consulting",
      logo: (
        <svg className="w-full h-full max-h-16" viewBox="0 0 280 100" fill="none">
          <g transform="translate(30, 20)">
            {/* Geometric green origami icon */}
            <path d="M22,5 L48,18 L32,38 L8,24 Z" fill="#4CAF50" opacity="0.85" />
            <path d="M32,38 L48,18 L44,48 L18,52 Z" fill="#2E7D32" />
            <path d="M8,24 L32,38 L18,52 L2,32 Z" fill="#81C784" />
            <path d="M22,5 L32,38 L8,24 Z" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
            <path d="M32,38 L44,48 L18,52 Z" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />
          </g>
          <text x="96" y="52" fontSize="26" fontFamily="'Outfit', sans-serif" fontWeight="900" letterSpacing="0.8" fill="#2E7D32">
            SATTVA
          </text>
          <text x="96" y="68" fontSize="9.5" fontFamily="'Inter', sans-serif" fontWeight="600" letterSpacing="1.2" fill="#475569">
            Delivering High Impact.
          </text>
        </svg>
      ),
      descEn: "Strategic advisory powering structural evaluation model across digital classrooms.",
      descHi: "स्मार्ट डिजिटल कक्षाओं का मूल्यांकन और संरचनात्मक प्रगति सुनिश्चित करने वाली संस्था।",
      impactEn: "📈 Powered analytical auditing models for 1.2M children's literacy logs.",
      impactHi: "📈 12 लाख बच्चों के शैक्षणिक रिकॉर्ड का गुणात्मक विश्लेषण मॉडल पूरा किया।"
    },
    {
      id: 2,
      name: "Zee Entertainment",
      logo: (
        <svg className="w-full h-full max-h-16" viewBox="0 0 280 100" fill="none">
          <g transform="translate(140, 50)">
            {/* Circle Purple background */}
            <circle cx="0" cy="0" r="34" fill="#6A1B9A" />
            <circle cx="0" cy="0" r="31" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.3" />
            {/* White bold 'ZEE' */}
            <text x="0" y="8" fontSize="21" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="1.5">
              ZEE
            </text>
          </g>
        </svg>
      ),
      descEn: "Content dissemination partner focusing child helpline numbers and safety awareness campaigns.",
      descHi: "चाइल्ड हेल्प डेस्क जागरूकता और संकटकालीन सुरक्षा अभियानों के प्रसार का डिजिटल मीडिया सहयोगी।",
      impactEn: "📺 Reached 45M households with localized safety broadcasts and call hotlines.",
      impactHi: "📺 बाल सुरक्षा संदेशों के साथ 4.5 करोड़ घरों तक सीधा प्रसार किया।"
    },
    {
      id: 3,
      name: "Tata BlueScope Steel",
      logo: (
        <svg className="w-full h-full max-h-16" viewBox="0 0 280 100" fill="none">
          {/* Steel blue organic waves lines */}
          <path d="M40,56 C60,42 75,54 95,44 C115,34 130,46 150,32" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M45,62 C65,48 80,60 100,50 C120,40 135,52 155,38" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M50,68 C70,54 85,66 105,56 C125,46 140,58 160,44" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          
          <text x="140" y="65" fontSize="13.5" fontFamily="'Outfit', sans-serif" fontWeight="900" fill="#1E3A8A" letterSpacing="0.8" textAnchor="middle">
            TATA BLUESCOPE
          </text>
          <text x="140" y="80" fontSize="12.5" fontFamily="'Outfit', sans-serif" fontWeight="800" fill="#2563EB" letterSpacing="3.5" textAnchor="middle">
            STEEL
          </text>
        </svg>
      ),
      descEn: "Infrastructure funding empowering high-durability roofing and stem lab foundations.",
      descHi: "दुर्गम इलाकों में अत्यंत सुरक्षित स्कूल भवनों की छत और अत्याधुनिक स्टेम कक्षाओं का सह-विकासक।",
      impactEn: "🏢 Gifted safe modern classroom infrastructure modules to over 48 coastal zones.",
      impactHi: "🏢 48 तटीय क्षेत्रों में बच्चों के लिए मजबूत आपदा-प्रतिरोधी भवनों का बुनियादी ढांचा बनाया।"
    },
    {
      id: 4,
      name: "Procter & Gamble (P&G)",
      logo: (
        <svg className="w-full h-full max-h-16" viewBox="0 0 280 100" fill="none">
          <g transform="translate(140, 50)">
            {/* P&G Blue round logo sphere gradient style */}
            <circle cx="0" cy="0" r="34" fill="url(#blueSphere)" />
            <circle cx="-12" cy="-12" r="20" fill="#FFFFFF" opacity="0.08" />
            <text x="0" y="8" fontSize="23" fontFamily="'Inter', sans-serif" fontWeight="900" fontStyle="italic" fill="#FFFFFF" textAnchor="middle">
              P&G
            </text>
          </g>
          <defs>
            <linearGradient id="blueSphere" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      ),
      descEn: "WASH (Water, Sanitation, Hygiene) corporate sponsors establishing safe washroom setups.",
      descHi: "स्वच्छता और स्वच्छ जलापूर्ति (WASH) समर्थन प्रायोजक, विद्यालयों में सुरक्षित प्रसाधन के प्रणेता।",
      impactEn: "💧 Setup clean hygienic private restrooms inside 92 community secondary institutions.",
      impactHi: "💧 92 माध्यमिक विद्यालयों में स्वच्छ एवं पृथक प्रसाधन और पेयजल इकाइयों की स्थापना की।"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: "vid_rajasthan",
      titleEn: "Reclaiming My Notebooks: Pooja's Journey Out of Child Labour",
      titleHi: "अपनी कॉपियों को वापस पाना: बाल श्रम से बाहर निकली पूजा का सफर",
      categoryEn: "Education Reach",
      categoryHi: "शिक्षा पहुंच",
      narratorEn: "Pooja, 11 Years old",
      narratorHi: "पूजा, उम्र 11 वर्ष",
      locationEn: "Brick Kilns Cluster, Rajasthan",
      locationHi: "ईंट भट्ठा समूह, राजस्थान",
      videoThumbUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=640&h=480",
      duration: "3:42 Min",
      statsEn: "🔥 2,500 children liberated from brick kilns across Northern India.",
      statsHi: "🔥 उत्तर भारत में ईंट भट्ठों से 2,500 बच्चों को बाल श्रम से मुक्त किया गया।",
      transcriptEn: `"I used to spend 11 hours daily shifting hot bricks. I didn't know what letters were. One day, an ABHAYA learning coordinator came. They persuaded my father about my education. Today I write numbers on blackboard and want to become a science teacher!"`,
      transcriptHi: `"मैं रोज 11 घंटे गरम ईंटें उठाने का काम करती थी। मुझे अक्षरों का ज्ञान नहीं था। एक दिन अभया (ABHAYA) के शिक्षक आए। उन्होंने मेरे पिताजी को मनाया। आज मैं ब्लैकबोर्ड पर लिखती हूँ और बड़ी होकर विज्ञान की टीचर बनना चाहती हूँ!"`
    },
    {
      id: "vid_mumbai",
      titleEn: "Safeguarding Slum Corridors: How Mobile Clinics Restored Infant Hopes",
      titleHi: "तंग बस्तियों में स्वास्थ्य क्रांति: मोबाइल क्लीनिक ने नवजात को दिया नया जीवन",
      categoryEn: "Healthcare & Nutrition",
      categoryHi: "स्वास्थ्य और पोषण",
      narratorEn: "Dr. Alok Sen, Field Coordinator",
      narratorHi: "डॉ. आलोक सेन, मैदानी समन्वयक",
      locationEn: "Dharavi Housing Segment, Mumbai",
      locationHi: "धारावी आवास क्षेत्र, मुंबई",
      videoThumbUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=640&h=480",
      duration: "4:05 Min",
      statsEn: "🍼 12,000+ severe malnourishment indicators resolved via mobile clinical labs.",
      statsHi: "🍼 मोबाइल क्लीनिकों के माध्यम से 12,000 से अधिक बच्चों को कुपोषण से सुरक्षित किया गया।",
      transcriptEn: `"We encounter severe infantile respiratory issues inside cramped damp rooms. Our partnership deployed robust mobile assessment units with pediatric medicines. Seeing a smiling mother carrying a fully recuperated newborn is our highest award."`,
      transcriptHi: `"हम मुंबई की तंग बस्तियों में गंभीर रूप से अस्वस्थ शिशुओं से मिलते थे। साझेदारी के तहत हमने मोबाइल क्लीनिक तैनात किए। आज स्वस्थ शिशुओं को देखकर दिल को सुकून मिलता है।"`
    },
    {
      id: "vid_assam",
      titleEn: "Reuniting Flooded Hearts: Rescue Logistics under ABHAYA guidelines",
      titleHi: "बाढ़ की विभीषिका में जीवन रक्षा: अभया (ABHAYA) के तहत सुरक्षित बचाव अभियान",
      categoryEn: "Child Emergency Safety",
      categoryHi: "बाल आपातकाल सुरक्षा",
      narratorEn: "Ananya Saikia, Rescue Lead",
      narratorHi: "अनन्या सैकिया, बचाव प्रमुख",
      locationEn: "Majuli Island, Brahmaputra River",
      locationHi: "माजुली द्वीप, ब्रह्मपुत्र नदी",
      videoThumbUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=640&h=480",
      duration: "5:12 Min",
      statsEn: "🛶 400 vulnerable infants reunited securely with guardians during floods.",
      statsHi: "🛶 प्राकृतिक आपदाओं के दौरान 400 नवजातों को उनके अभिभावकों से सुरक्षित मिलाया गया।",
      transcriptEn: `"Brahmaputra floods sweeps everything. Families panic and infants get stranded. Using boat counseling units and digital satellite trace beacons, we securely safeguard children and set infant relief care shelters with hot meals."`,
      transcriptHi: `"ब्रह्मपुत्र की बाढ़ में सब कुछ बह जाता है। बच्चे अपने माता-पिता से बिछड़ जाते हैं। डिजिटल ट्रैकिंग और सुरक्षा नौका चिकित्सा के जरिए हमने सैकड़ों मासूमों को बचाया और उन्हें भोजन प्रदान किया।"`
    }
  ];

  const handlePartnerClick = (idx: number) => {
    setActiveDot(idx);
  };

  const handleTestimonialClick = (test: Testimonial) => {
    setSelectedTestimonial(test);
    setIsPlaying(false);
  };

  const currentPartner = partners[activeDot];

  return (
    <section className="w-full bg-[#FFFFFF]">
      
      {/* ========================================== */}
      {/* PART 1: CORPORATE PARTNERSHIP              */}
      {/* ========================================== */}
      <div className="w-full py-16 px-4 md:px-8 border-b border-gray-100 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto text-center space-y-4">
          <h2 
            className={`font-black tracking-tight text-center transition-all ${
              textSize === "large" 
                ? "text-3xl md:text-4.5xl" 
                : textSize === "extra-large" 
                ? "text-4xl md:text-5xl" 
                : "text-2xl md:text-[34px] md:leading-10"
            } ${highContrast ? "text-yellow-600 font-extrabold" : "text-[#D11E26]"}`}
            id="corporate-partnership-heading"
          >
            {lang === "en" ? "CORPORATE PARTNERSHIP" : "कॉर्पोरेट भागीदारी"}
          </h2>
          
          <div className="w-24 h-1.5 bg-[#EF4444] mx-auto mt-2 rounded-full opacity-90" />
        </div>

        {/* Carousel Visual Area */}
        <div className="w-full max-w-7xl mx-auto mt-11 relative">
          
          {/* Static list in desktop (grid list) */}
          <div className="hidden lg:grid grid-cols-5 gap-6 xl:gap-8 items-center justify-content-center py-6 w-full px-4 border border-teal-50/50 bg-[#F8FAFC]/50 rounded-[2rem]">
            {partners.map((p, idx) => {
              const isSelected = activeDot === idx;
              return (
                <div 
                  key={p.id}
                  onClick={() => handlePartnerClick(idx)}
                  className={`flex flex-col items-center justify-center p-5 rounded-[22px] transition-all duration-350 cursor-pointer ${
                    isSelected 
                      ? (highContrast ? "bg-stone-900 border-2 border-yellow-300 shadow-xl" : "bg-white border border-[#E2E8F0] shadow-md scale-102") 
                      : "hover:bg-slate-50 opacity-75 hover:opacity-100 border border-transparent"
                  }`}
                >
                  <div className="w-full max-w-[190px] h-14 xl:h-16 flex items-center justify-center">
                    {p.logo}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider for Mobile/Tablet */}
          <div className="lg:hidden w-full max-w-md mx-auto flex flex-col items-center justify-center p-6 bg-[#F8FAFC]/70 rounded-[2rem] border border-slate-100">
            <div className="w-full h-24 flex items-center justify-center p-3 rounded-xl bg-white shadow-xs">
              {partners[activeDot].logo}
            </div>
            
            <p className="mt-4 text-center font-bold text-xs text-slate-800">
              {partners[activeDot].name}
            </p>
          </div>

          {/* Interactive Dots matching exactly the red / gray dot carousel indicator styling */}
          <div className="flex justify-center items-center gap-3 mt-8 md:mt-10">
            {partners.map((_, idx) => {
              const isActive = activeDot === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePartnerClick(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? (highContrast ? "bg-yellow-400 scale-110" : "bg-[#EF4444] scale-110") 
                      : (highContrast ? "bg-stone-700" : "bg-[#D1D5DB] hover:bg-gray-300")
                  }`}
                  aria-label={`Go to partner ${idx + 1}`}
                  title={partners[idx].name}
                />
              );
            })}
          </div>

          {/* Explanatory partner details segment underneath */}
          <div className="w-full max-w-4xl mx-auto mt-8 px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDot}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-6 rounded-2xl text-center border shadow-xs ${
                  highContrast 
                    ? "bg-black border-yellow-300 text-yellow-300" 
                    : "bg-[#F1F5F9]/50 border-slate-100"
                }`}
              >
                <div className="text-xs uppercase tracking-widest font-black text-[#EF4444] mb-2 font-sans">
                  {lang === "en" ? "Partner Impact Initiative" : "साझेदार प्रभाव पहल"}
                </div>
                <h4 className="text-sm font-bold block mb-2">{currentPartner.name}</h4>
                <p className="text-[13px] leading-relaxed max-w-2xl mx-auto mb-4 text-[#475569] font-sans">
                  {lang === "en" ? currentPartner.descEn : currentPartner.descHi}
                </p>
                <div className="inline-flex gap-2 items-center justify-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 font-mono text-xs font-bold text-emerald-600">
                  <span>{lang === "en" ? currentPartner.impactEn : currentPartner.impactHi}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* PART 2: THE RAKSHAKS OF CHILDREN'S FUTURE   */}
      {/* ========================================== */}
      <div 
        className={`w-full py-16 px-4 md:px-8 flex flex-col items-center justify-center transition-colors duration-200 ${
          highContrast ? "bg-black text-yellow-300" : "bg-[#F8FAFC]"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto space-y-6">
          
          {/* Commitment Title */}
          <div className="text-center space-y-4">
            <h2 
              className={`font-black tracking-tight text-center uppercase mx-auto max-w-4xl transition-all ${
                textSize === "large" 
                  ? "text-2xl md:text-3.5xl" 
                  : textSize === "extra-large" 
                  ? "text-3xl md:text-4xl" 
                  : "text-xl md:text-[28px] md:leading-9"
              } ${highContrast ? "text-yellow-300 font-black" : "text-[#D11E26]"}`}
            >
              {lang === "en" ? "OUR COMMITMENT TO BE THE RAKSHAKS OF CHILDREN'S FUTURE" : "बच्चों के भविष्य के रक्षक बनने की हमारी प्रतिबद्धता"}
            </h2>
            <div className="w-24 h-1.5 bg-[#EF4444] mx-auto rounded-full opacity-90" />
          </div>

          {/* Narrative Paragraph */}
          <p 
            className={`max-w-6xl mx-auto leading-relaxed text-center font-sans ${
              textSize === "large" 
                ? "text-base md:text-lg" 
                : textSize === "extra-large" 
                ? "text-lg md:text-xl" 
                : "text-[14px] md:text-[14.8px] text-[#475569]"
            } ${highContrast ? "text-white" : ""}`}
          >
            {lang === "en" ? (
              <>
                We invite you behind the scenes to witness the transformations made possible by donors like you. Through poignant video testimonials, you'll see the tangible impact your compassion has already made in the lives of underprivileged children in India. Watch their eyes light up as they gain access to education, medical care, and safety - opportunities to learn, grow, and dream. Hear them speak about their hopes for the future, fuelled by the chance you've given them. These are more than inspiring stories;
              </>
            ) : (
              <>
                हम आपको आपके जैसे दाताओं द्वारा संभव बनाए गए बदलावों को देखने के लिए आमंत्रित करते हैं। मार्मिक वीडियो प्रशंसापत्रों के माध्यम से, आप उस वास्तविक प्रभाव को देखेंगे जो आपकी करुणा ने भारत में वंचित बच्चों के जीवन में पहले ही डाला है। जब वे शिक्षा, चिकित्सा देखभाल और सुरक्षा तक पहुँच प्राप्त करते हैं, तो उनकी आँखों में चमक आ जाती है - सीखने, बढ़ने और सपने देखने के अवसर। उन्हें भविष्य के लिए अपनी आशाओं के बारे में बोलते हुए सुनें, जो आपके द्वारा दिए गए अवसर से प्रेरित है। ये केवल प्रेरणादायक कहानियाँ नहीं हैं;
              </>
            )}
          </p>

          {/* Testimonial Documentary Player Grid - 100% full screen width utilization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-stretch pt-4">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                onClick={() => handleTestimonialClick(test)}
                className={`flex flex-col rounded-[22px] overflow-hidden border cursor-pointer hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 ${
                  highContrast 
                    ? "bg-stone-950 border-yellow-300 text-yellow-300" 
                    : "bg-white border-slate-200/60 shadow-sm"
                }`}
              >
                {/* Simulated Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img 
                    src={test.videoThumbUrl} 
                    alt={lang === "en" ? test.titleEn : test.titleHi} 
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Backdrop red gradient layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  {/* Floating duration tag */}
                  <div className="absolute top-3 right-3 bg-black/75 px-2 py-0.5 rounded-md text-[10px] font-bold text-white font-mono">
                    {test.duration}
                  </div>

                  {/* Play circle emblem centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 font-extrabold text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                      <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Floating narrator description */}
                  <div className="absolute bottom-3 left-3 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444] font-sans">
                      {test.narratorEn}
                    </span>
                    <span className="text-[11px] font-medium text-white font-sans">
                      📍 {lang === "en" ? test.locationEn : test.locationHi}
                    </span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest block mb-2 ${
                      highContrast ? "text-yellow-300" : "text-slate-400"
                    }`}>
                      {lang === "en" ? test.categoryEn : test.categoryHi}
                    </span>
                    <h3 className={`font-black tracking-tight mb-4 ${
                      textSize === "large" ? "text-base" : "text-sm md:text-[15px] leading-snug"
                    } ${highContrast ? "text-yellow-300" : "text-slate-900 hover:text-red-600 transition-colors"}`}>
                      {lang === "en" ? test.titleEn : test.titleHi}
                    </h3>
                    <p className="text-xs italic text-gray-500 line-clamp-3 mb-4 font-serif leading-relaxed">
                      {lang === "en" ? test.transcriptEn : test.transcriptHi}
                    </p>
                  </div>

                  {/* Stat Badge */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono text-emerald-600">
                      {lang === "en" ? test.statsEn : test.statsHi}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* DETAILED LIGHTBOX TESTIMONIAL VIDEO PLAYER */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedTestimonial && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
              onClick={() => setSelectedTestimonial(null)}
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl z-10 ${
                highContrast ? "bg-black border-yellow-300 text-yellow-300" : "bg-white text-slate-900 border-slate-100"
              }`}
            >
              {/* Cover Header Graphic Player */}
              <div className="relative aspect-[16/9] w-full bg-black">
                {isPlaying ? (
                  /* Simulated documentary media interactive screen with scanning lines */
                  <div className="absolute inset-0 flex flex-col justify-between p-6 bg-linear-to-b from-black/50 via-transparent to-black/90">
                    {/* Top running indicator */}
                    <div className="flex justify-between items-center w-full">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-red-600 text-white animate-pulse">
                        ● LIVE PLAYBACK
                      </span>
                      <span className="text-[11px] font-mono text-white/80">
                        {selectedTestimonial.duration}
                      </span>
                    </div>

                    {/* Dynamic floating subtitle lyrics matching video speech */}
                    <div className="bg-black/75 p-4 rounded-xl text-center self-center max-w-xl border border-white/10">
                      <p className="text-sm font-bold text-white leading-relaxed font-sans">
                        {lang === "en" ? selectedTestimonial.transcriptEn : selectedTestimonial.transcriptHi}
                      </p>
                    </div>

                    {/* Bottom controls panel */}
                    <div className="flex justify-between items-center w-full">
                      <button 
                        onClick={() => setIsPlaying(false)}
                        className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-mono text-xs font-bold transition-all"
                      >
                        ⏸ PAUSE DOCUMENTARY
                      </button>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-all"
                      >
                        {isMuted ? "🔇 UNMUTE" : "🔊 MUTED: OFF"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Preview Frame prior to playing */
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                    <img 
                      src={selectedTestimonial.videoThumbUrl} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                      alt="Story Preview Thumbnail"
                    />
                    <div className="absolute inset-0 bg-black/60" />

                    <div className="relative z-10 space-y-4">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl hover:scale-105 duration-150 transform mx-auto cursor-pointer"
                      >
                        <Play className="w-7 h-7 fill-white translate-x-0.5" />
                      </button>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-red-500">
                          {selectedTestimonial.narratorEn}
                        </span>
                        <h4 className="text-white text-base md:text-lg font-black tracking-tight px-4">
                          {lang === "en" ? selectedTestimonial.titleEn : selectedTestimonial.titleHi}
                        </h4>
                      </div>
                    </div>
                  </div>
                )}

                {/* Close Button overlay */}
                <button 
                  type="button"
                  onClick={() => setSelectedTestimonial(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer z-20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informative block beneath the player */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] tracking-wider uppercase font-mono text-slate-400">
                      📍 {lang === "en" ? selectedTestimonial.locationEn : selectedTestimonial.locationHi}
                    </span>
                    <h5 className="font-extrabold text-sm">{selectedTestimonial.narratorEn}</h5>
                  </div>
                  <span className="text-xs font-bold text-red-500 uppercase font-mono">
                    {lang === "en" ? selectedTestimonial.categoryEn : selectedTestimonial.categoryHi}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {lang === "en" 
                    ? "Through these verified video testimonials, ABHAYA remains accountable to the humanitarian support provided by corporate CSR partnerships. Daily rescue efforts, mobile clinical logistics, and foster units operate around the clock to translate constitutional mandates into child safety."
                    : "इन सत्यापित वीडियो प्रशंसापत्रों के माध्यम से, अभया (ABHAYA) कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) भागीदारी द्वारा प्रदान किए गए मानवीय सहयोग के प्रति उत्तरदायी बना हुआ है। दैनिक बचाव कार्य, मोबाइल चिकित्सा सुविधाएं और पुनर्वास इकाइयां चौबीसों घंटे काम करती हैं।"}
                </p>

                {/* Success Stat Card */}
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 font-mono">
                    {lang === "en" ? selectedTestimonial.statsEn : selectedTestimonial.statsHi}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setSelectedTestimonial(null)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                      highContrast ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {lang === "en" ? "Back to Documentary Hub" : "वापस जाएं"}
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
