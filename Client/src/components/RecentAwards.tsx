import React, { useState, useEffect } from "react";
import { Language } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { Award, Trophy, Bookmark, Globe, Star, ArrowLeft, ArrowRight } from "lucide-react";

interface RecentAwardsProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

interface AwardItem {
  id: number;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  svgIcon: React.ReactNode;
}

export default function RecentAwards({ lang, highContrast, textSize }: RecentAwardsProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Translate labels
  const t = {
    sectionTitle: lang === "en" ? "RECENT AWARDS AND RECOGNITIONS" : "हालिया पुरस्कार और मान्यताएं",
    subtitle: lang === "en" ? (
      <>
        From allyship to health outreach, awards won by ABHAYA continue to recognise our unrelenting efforts to transform young lives. The ever-expanding list of recognition for our work reflects our deepening national footprint and impact - reaching and <span className="underline decoration-1 cursor-pointer hover:text-[#e31d23] transition-colors font-semibold">uplifting marginalized children</span> across cities to rural hinterlands. Strengthened by public support, our quest to ensure India's future generations can thrive, continues.
      </>
    ) : (
      <>
        गठबंधन से लेकर स्वास्थ्य पहुंच तक, अभया (ABHAYA) द्वारा जीते गए पुरस्कार हमारे युवा जीवन को बदलने के निरंतर प्रयासों को मान्यता देते हैं। हमारे काम के लिए मान्यता की लगातार बढ़ती सूची हमारे बढ़ते राष्ट्रीय पदचिह्न और प्रभाव को दर्शाती है - शहरों से लेकर ग्रामीण इलाकों तक <span className="underline decoration-1 cursor-pointer hover:text-yellow-300 transition-colors font-semibold">हाशिए पर मौजूद बच्चों के उत्थान</span> तक पहुंचना। जनसमर्थन से मजबूत, भारत की भावी पीढ़ियाँ फल-फूल सकें, यह सुनिश्चित करने की हमारी खोज जारी है।
      </>
    ),
    carouselAlt: lang === "en" ? "Interactive Carousel" : "इंटरैक्टिव हिंडोला"
  };

  const awards: AwardItem[] = [
    {
      id: 1,
      titleEn: "CSR Times Awards 2024",
      titleHi: "सीएसआर टाइम्स पुरस्कार 2024",
      descEn: "Wins Silver for Best NGO in Rural Development and Infrastructure",
      descHi: "ग्रामीण विकास और बुनियादी ढांचे में सर्वश्रेष्ठ एनजीओ के लिए रजत जीता",
      svgIcon: (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          {/* Inner ring */}
          <circle cx="60" cy="58" r="38" fill="#F9FAFB" />
          {/* Base pedestal for the award */}
          <path d="M42,90 L78,90 L74,96 L46,96 Z" fill="#9CA3AF" />
          <rect x="36" y="96" width="48" height="6" rx="1.5" fill="#374151" />
          <rect x="44" y="91" width="32" height="5" fill="#E5E7EB" />
          
          {/* Silver award shield body */}
          <circle cx="60" cy="48" r="30" fill="url(#silverGradient)" stroke="#9CA3AF" strokeWidth="1" />
          
          {/* Segmented colors ring */}
          <path d="M60,22 A26,26 0 0,1 82,37" stroke="#EF4444" strokeWidth="4" fill="none" />
          <path d="M82,37 A26,26 0 0,1 77,63" stroke="#F59E0B" strokeWidth="4" fill="none" />
          <path d="M77,63 A26,26 0 0,1 50,72" stroke="#10B981" strokeWidth="4" fill="none" />
          <path d="M50,72 A26,26 0 0,1 38,51" stroke="#06B6D4" strokeWidth="4" fill="none" />
          <path d="M38,51 A26,26 0 0,1 60,22" stroke="#EC4899" strokeWidth="4" fill="none" />
          
          {/* Inner white circle */}
          <circle cx="60" cy="48" r="21" fill="#FFFFFF" />
          
          {/* Text inside */}
          <text x="60" y="44" fontSize="4.5" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" fill="#111827">CSR TIMES</text>
          <text x="60" y="49" fontSize="3.8" fontFamily="Inter, sans-serif" fontWeight="700" textAnchor="middle" fill="#EF4444">AWARD</text>
          
          <rect x="48" y="53" width="24" height="6" rx="1.5" fill="#9CA3AF" />
          <text x="60" y="57.5" fontSize="4" fontFamily="Inter, sans-serif" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">SILVER</text>
          
          <defs>
            <linearGradient id="silverGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#D1D5DB" />
              <stop offset="100%" stopColor="#9CA3AF" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 2,
      titleEn: "ET Shark Awards 2024",
      titleHi: "ईटी शार्क पुरस्कार 2024",
      descEn: "Wins Bronze in The Plants Projects",
      descHi: "द प्लांट्स प्रोजेक्ट्स में कांस्य जीता",
      svgIcon: (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          {/* Base shadow reflection */}
          <ellipse cx="60" cy="94" rx="32" ry="6" fill="#D1D5DB" opacity="0.6" />
          {/* Base Pedestal */}
          <path d="M36,88 L84,88 L78,96 L42,96 Z" fill="#4B3621" />
          <path d="M34,84 L86,84 L84,88 L36,88 Z" fill="#60462B" />
          <rect x="28" y="94" width="64" height="5" rx="1" fill="#301F11" />
          {/* Shark Fin Clear Red Crystal */}
          <path d="M42,84 C47,56 53,38 74,27 C72,46 76,61 78,84 Z" fill="url(#finRed)" stroke="#B91C1C" strokeWidth="1" />
          {/* Reflections */}
          <path d="M45,81 C48,59 54,43 70,32" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          {/* Little Star etch */}
          <path d="M60,40 L61,43 L64,43 L62,45 L63,48 L60,46 L57,48 L58,45 L56,43 L59,43 Z" fill="#FBBF24" />
          
          <text x="60" y="80" fontSize="4.2" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" fill="#FFFFFF">SHARK</text>
          
          <defs>
            <linearGradient id="finRed" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 3,
      titleEn: "Ministry of Health Profile",
      titleHi: "स्वास्थ्य मंत्रालय प्रोफ़ाइल",
      descEn: "Certificate of Appreciation for providing valuable support to People with TB.",
      descHi: "टीबी पीड़ित लोगों को बहुमूल्य सहायता प्रदान करने के लिए सराहना प्रमाण पत्र।",
      svgIcon: (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          {/* Soft document background */}
          <rect x="28" y="16" width="64" height="84" rx="2" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
          {/* Golden borders */}
          <rect x="32" y="20" width="56" height="76" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="300" />
          
          {/* Stylized Emblem of India liones representation */}
          <g transform="translate(60, 31) scale(0.55)">
            <path d="M-6,-8 L6,-8 L5,-3 L-5,-3 Z" fill="#D4AF37" />
            <circle cx="0" cy="1" r="4.5" fill="#D4AF37" />
            <path d="M-8,10 C-8,14 8,14 8,10 Z" fill="#D4AF37" />
            <line x1="-10" y1="16" x2="10" y2="16" stroke="#D4AF37" strokeWidth="1" />
          </g>
          
          {/* Texts */}
          <text x="60" y="46" fontSize="4.5" fontFamily="Inter, sans-serif" fontWeight="800" textAnchor="middle" fill="#111827">Ministry of Health</text>
          <text x="60" y="50.5" fontSize="4" fontFamily="Inter, sans-serif" fontWeight="700" textAnchor="middle" fill="#374151">and Family Welfare</text>
          <text x="60" y="54" fontSize="3" fontFamily="Inter, sans-serif" textAnchor="middle" fill="#6B7280">Government of India</text>
          
          {/* Golden badge overlay */}
          <circle cx="60" cy="70" r="7" fill="#D4AF37" />
          <path d="M57,75 L54,86 L60,82 L66,86 L63,75" fill="#D4AF37" opacity="0.85" />
          <circle cx="60" cy="70" r="5" fill="#FFFFFF" />
          {/* Little checkmark inside */}
          <path d="M58.5,70 L60,71.5 L62,68.5" stroke="#D4AF37" strokeWidth="1" fill="none" />
          
          {/* Signatures placeholders */}
          <line x1="38" y1="88" x2="48" y2="88" stroke="#9CA3AF" strokeWidth="0.5" />
          <line x1="72" y1="88" x2="82" y2="88" stroke="#9CA3AF" strokeWidth="0.5" />
        </svg>
      )
    },
    {
      id: 4,
      titleEn: "5th ICC Social Impact Awards",
      titleHi: "पांचवां आईसीसी सामाजिक प्रभाव पुरस्कार",
      descEn: "5th ICC Social Impact Awards 2023 - Runners up in Large Project category",
      descHi: "पांचवां आईसीसी सामाजिक प्रभाव पुरस्कार 2023 - बड़ी परियोजना श्रेणी में उपविजेता",
      svgIcon: (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          {/* Pedestal base in matte silver */}
          <rect x="28" y="90" width="64" height="10" rx="1" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="0.5" />
          <line x1="30" y1="91" x2="90" y2="91" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
          {/* Blue frosted plaque body */}
          <rect x="34" y="22" width="52" height="68" rx="3" fill="url(#bluePlaque)" stroke="#2563EB" strokeWidth="1.2" />
          
          <path d="M35,23 L85,23 L75,44 L35,44 Z" fill="#FFFFFF" opacity="0.1" />
          
          {/* Graphic Hands/Flora in yellow */}
          <g transform="translate(60, 42) scale(0.6)">
            <circle cx="0" cy="-4" r="5" fill="#FBBF24" />
            <path d="M-8,4 C-6,0 6,0 8,4 C5,8 -5,8 -8,4" fill="#FBBF24" />
            <circle cx="-10" cy="2" r="1.5" fill="#FBBF24" />
            <circle cx="10" cy="2" r="1.5" fill="#FBBF24" />
          </g>
          
          {/* Text block box */}
          <rect x="39" y="56" width="42" height="26" rx="1.5" fill="#1E40AF" />
          <text x="60" y="62" fontSize="4.5" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" fill="#FFFFFF">5th ICC</text>
          <text x="60" y="68.5" fontSize="4.2" fontFamily="Inter, sans-serif" fontWeight="800" textAnchor="middle" fill="#FBBF24">SOCIO-IMPACT</text>
          <text x="60" y="74.5" fontSize="3.5" fontFamily="Inter, sans-serif" textAnchor="middle" fill="#FFFFFF">SUMMIT 2023</text>
          <text x="60" y="79" fontSize="2.2" fontFamily="Inter, sans-serif" fontWeight="bold" textAnchor="middle" fill="#93C5FD">RUNNERS UP</text>
          
          <defs>
            <linearGradient id="bluePlaque" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 5,
      titleEn: "Radio City Delhi Icon Award",
      titleHi: "रेडियो सिटी दिल्ली आइकन अवार्ड",
      descEn: "Radio City Delhi Icon Award 2023: Youth Skilling and Vocational Training for Livelihoods",
      descHi: "रेडियो सिटी दिल्ली आइकन अवार्ड 2023: आजीविका के लिए युवा कौशल और व्यावसायिक प्रशिक्षण",
      svgIcon: (
        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
          {/* Main solid circle with premium deep navy background wrapper */}
          <circle cx="60" cy="54" r="38" fill="#0B132A" stroke="#EA580C" strokeWidth="2" />
          <circle cx="60" cy="54" r="35" fill="none" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3,3" />
          
          {/* Stylized background golden rays */}
          <g opacity="0.4">
            <line x1="60" y1="16" x2="60" y2="92" stroke="#F59E0B" strokeWidth="0.5" />
            <line x1="22" y1="54" x2="98" y2="54" stroke="#F59E0B" strokeWidth="0.5" />
            <line x1="33" y1="27" x2="87" y2="81" stroke="#F59E0B" strokeWidth="0.5" />
            <line x1="87" y1="27" x2="33" y2="81" stroke="#F59E0B" strokeWidth="0.5" />
          </g>
          
          {/* India Gate / Skyline Silhouette in Yellow */}
          <g transform="translate(60, 66) scale(0.62)" fill="#FBBF24">
            <path d="M-15,10 L-15,-6 L-10,-6 L-10,1 L10,1 L10,-6 L15,-6 L15,10 Z M-10,-6 L-10,-12 L10,-12 L10,-6 Z M-6,-12 L6,-12 L4,-15 L-4,-15 Z" />
            <rect x="-22" y="10" width="44" height="2" />
          </g>
          
          {/* Top Radio City star medallion */}
          <g transform="translate(60, 36)">
            <circle cx="0" cy="0" r="14" fill="#FBBF24" />
            <circle cx="0" cy="0" r="12.5" fill="#EF4444" />
            <text x="0" y="-1.5" fontSize="3.5" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" fill="#FFFFFF">Radio City</text>
            <text x="0" y="3.5" fontSize="3.2" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" fill="#FBBF24">DELHI</text>
            <text x="0" y="7" fontSize="2.2" fontFamily="Inter, sans-serif" textAnchor="middle" fill="#FFFFFF">ICON AWARD</text>
          </g>
          
          {/* Winner Text Plate */}
          <rect x="28" y="78" width="64" height="13" rx="2.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="0.8" />
          <text x="60" y="84" fontSize="4" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle" fill="#FFFFFF">WINNER</text>
          <text x="60" y="89" fontSize="3.2" fontFamily="Inter, sans-serif" fontWeight="700" textAnchor="middle" fill="#FBBF24">DELHI ICON 2023</text>
        </svg>
      )
    }
  ];

  // For responsive slider, we split into 2 pages on mobile-tablet or allow simple swiping.
  // Page 0: items 1, 2, 3
  // Page 1: items 4, 5
  // Or, let's create a perfect horizontal track scrolling, with dots corresponding to each of the 5.
  // Whenever currentPage changes, they slide!
  const dotCount = 2; // Exact 2 dots shown in the user picture!
  // Dot 1 shows the first 3 items (or indices 0,1,2).
  // Dot 2 shows the remaining 2 items (or indices 3,4).
  // This exactly clones the layout of the user image which had 5 slots showing, but with a page indicator of 2 dots! That is perfect.

  return (
    <section className="w-full bg-[#f8fafc] border-t border-gray-100 flex flex-col items-center">
      
      {/* 1. Header Portion with pure white background */}
      <div className="w-full bg-white py-12 px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h2 
            className={`font-bold tracking-tight text-center transition-all ${
              textSize === "large" 
                ? "text-3xl md:text-4.5xl" 
                : textSize === "extra-large" 
                ? "text-4xl md:text-5xl" 
                : "text-2xl md:text-3.5xl"
            } ${highContrast ? "text-yellow-600 font-extrabold" : "text-[#D11E26]"}`}
          >
            {t.sectionTitle}
          </h2>
          
          <p 
            className={`max-w-6xl mx-auto leading-relaxed text-center font-sans ${
              textSize === "large" 
                ? "text-lg" 
                : textSize === "extra-large" 
                ? "text-xl" 
                : "text-sm md:text-[15.5px]"
            } ${highContrast ? "text-white" : "text-[#475569]"}`}
          >
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Full-Width Teal Section */}
      <div 
        className={`w-full py-12 md:py-16 px-4 md:px-12 flex flex-col items-center justify-between transition-colors duration-200 ${
          highContrast ? "bg-black text-yellow-300" : "bg-[#01AABF]"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto relative">
          
          {/* Desktop view (shows all 5 side by side instantly) */}
          <div className="hidden lg:grid grid-cols-5 gap-6 xl:gap-8 items-start w-full">
            {awards.map((award) => (
              <div 
                key={award.id} 
                className="flex flex-col items-center group transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Yellow Ring Wrapper */}
                <div 
                  className={`relative p-1 rounded-full border-[5px] transition-all duration-300 ${
                    highContrast 
                      ? "border-yellow-400 bg-stone-900" 
                      : "border-[#FEDD00] bg-white hover:border-[#ffe733] hover:shadow-xl"
                  } w-[160px] h-[160px] xl:w-[175px] xl:h-[175px] flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative p-1">
                    {award.svgIcon}
                  </div>
                </div>

                {/* Subtitle / Text Description details below */}
                <p 
                  className={`mt-5 text-center font-sans font-medium text-xs xl:text-[13px] leading-relaxed max-w-[190px] ${
                    highContrast ? "text-yellow-300" : "text-white"
                  }`}
                >
                  {lang === "en" ? award.descEn : award.descHi}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile & Tablet Slider view (uses the pages) */}
          <div className="lg:hidden w-full overflow-hidden px-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: currentPage === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentPage === 0 ? 30 : -30 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center items-start justify-items-center w-full"
              >
                {(currentPage === 0 ? awards.slice(0, 3) : awards.slice(3, 5)).map((award) => (
                  <div 
                    key={award.id} 
                    className="flex flex-col items-center max-w-[220px]"
                  >
                    {/* Yellow Ring Wrapper */}
                    <div 
                      className={`relative p-1 rounded-full border-[5px] ${
                        highContrast ? "border-yellow-400 bg-stone-900" : "border-[#FEDD00] bg-white"
                      } w-[165px] h-[165px] flex items-center justify-center shrink-0 shadow-lg`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative p-1">
                        {award.svgIcon}
                      </div>
                    </div>

                    {/* Description beneath */}
                    <p 
                      className={`mt-4 text-center font-sans font-semibold text-xs leading-relaxed ${
                        highContrast ? "text-yellow-300" : "text-white"
                      }`}
                    >
                      {lang === "en" ? award.descEn : award.descHi}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Dot indicators matching EXACTLY the screenshot style (red active, grey/white inactive) */}
          <div className="flex justify-center items-center gap-3 mt-10 md:mt-12 w-full">
            {Array.from({ length: dotCount }).map((_, idx) => {
              const isActive = currentPage === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer ${
                    isActive 
                      ? (highContrast ? "bg-yellow-400 scale-110" : "bg-[#EF4444] scale-115") 
                      : (highContrast ? "bg-stone-700" : "bg-[#D1D5DB] hover:bg-gray-300")
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                  title={`Go to page ${idx + 1}`}
                />
              );
            })}
          </div>

        </div>
      </div>

    </section>
  );
}
