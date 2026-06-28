import React from "react";
import { translations, Language } from "../data/translations";
import { Accessibility, HelpCircle, PhoneCall, Globe, Sparkles } from "lucide-react";
import IndiaEmblem from "../assets/india.svg";

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  textSize: "normal" | "large" | "extra-large";
  setTextSize: (size: "normal" | "large" | "extra-large") => void;
}

export default function Header({
  lang,
  setLang,
  highContrast,
  setHighContrast,
  textSize,
  setTextSize,
}: HeaderProps) {
  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(lang === "en" ? "hi" : "en");
  };

  const handleAccessibilityConfig = () => {
    setHighContrast(!highContrast);
  };

  const cycleTextSize = () => {
    if (textSize === "normal") setTextSize("large");
    else if (textSize === "large") setTextSize("extra-large");
    else setTextSize("normal");
  };

  return (
    <header className={`border-b ${highContrast ? "bg-black text-yellow-300 border-yellow-300" : "bg-white text-gray-800 border-gray-200"} py-3 px-4 md:px-8 transition-colors duraton-200`}>
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left Side: National Emblem + ABHAYA Logo */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-center lg:justify-start">
          {/* Indian Emblem Icon */}
          <div className="flex items-center justify-center pt-1" id="national-emblem">
            <svg
              className={`w-14 h-20 ${highContrast ? "fill-yellow-300" : "fill-amber-800"}`}
              viewBox="0 0 100 150"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified highly semantic vector of State Emblem of India */}
              <path d="M 50 15 C 45 15, 42 20, 42 25 C 42 32, 50 42, 50 42 C 50 42, 58 32, 58 25 C 58 20, 55 15, 50 15 Z M 48 24 A 2 2 0 1 1 52 24 A 2 2 0 1 1 48 24" />
              <path d="M 32 30 C 28 30, 25 35, 25 40 C 25 48, 35 55, 35 55 C 35 55, 42 48, 42 40 C 42 35, 38 30, 32 30 Z" />
              <path d="M 68 30 C 64 30, 58 35, 58 40 C 58 48, 65 55, 65 55 C 65 55, 75 48, 75 40 C 75 35, 72 30, 68 30 Z" />
              {/* Ashoka Pillar capital support lines */}
              <rect x="36" y="55" width="28" height="6" rx="2" className={`${highContrast ? "fill-yellow-300" : "fill-amber-900"}`} />
              {/* Ashoka Chakra */}
              <circle cx="50" cy="72" r="10" strokeWidth="2.5" fill="none" className={highContrast ? "stroke-yellow-300" : "stroke-blue-800"} />
              <circle cx="50" cy="72" r="2.5" className={highContrast ? "fill-yellow-300" : "fill-blue-800"} />
              {/* Spokes */}
              <line x1="50" y1="62" x2="50" y2="82" strokeWidth="1" className={highContrast ? "stroke-yellow-300" : "stroke-blue-800"} />
              <line x1="40" y1="72" x2="60" y2="72" strokeWidth="1" className={highContrast ? "stroke-yellow-300" : "stroke-blue-800"} />
              <line x1="43" y1="65" x2="57" y2="79" strokeWidth="0.8" className={highContrast ? "stroke-yellow-300" : "stroke-blue-800"} />
              <line x1="57" y1="65" x2="43" y2="79" strokeWidth="0.8" className={highContrast ? "stroke-yellow-300" : "stroke-blue-800"} />
              {/* Base support elements */}
              <path d="M 28 85 L 72 85 C 72 85, 70 95, 50 95 C 30 95, 28 85, 28 85 Z" className={highContrast ? "fill-yellow-300" : "fill-amber-700"} />
              <text x="50" y="112" textAnchor="middle" fontSize="10" fontWeight="bold" className={`font-sans tracking-widest ${highContrast ? "fill-yellow-300" : "fill-gray-800"}`}>सत्यमेव जयते</text>
            </svg>
          </div>

          {/* SAA/ABHAYA graphic icon & logo */}
          <div className="flex items-center gap-3 border-l pl-4 border-gray-300" id="abhaya-logo">
            <div className="w-12 h-12 rounded-full border border-gray-200 bg-white/90 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={IndiaEmblem}
                alt="ABHAYA emblem"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div>
              <div className="flex flex-col">
                <span className={`text-xl md:text-2xl font-extrabold tracking-tight ${highContrast ? "text-yellow-300" : "text-amber-800"}`}>
                  {lang === "en" ? "अभया" : "ABHAYA"}
                </span>
                <span className={`text-base font-bold tracking-wider leading-none ${highContrast ? "text-yellow-400" : "text-gray-900"}`}>
                  {lang === "en" ? "ABHAYA" : "अभया"}
                </span>
                <span className="text-[10px] md:text-xs font-semibold text-gray-500 mt-1 uppercase max-w-xs md:max-w-md">
                  {lang === "en" ? t.subtitle : t.hindiSubtitle}
                </span>
                <span className="text-[10px] md:text-xs font-extrabold tracking-wider mt-1 text-amber-700 dark:text-yellow-300 uppercase">
                  {lang === "en" ? "SATYAMEVA JAYATE" : "सत्यमेव जयते"}
                </span>
              </div>
            </div>
          </div>

          {/* Lion Capital logo mark */}
          <div className="flex items-center gap-3 border-l pl-4 border-gray-300" id="lion-capital-logo">
            <div className="w-12 h-12 rounded-full border border-gray-200 bg-white/90 overflow-hidden shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M 20 70 C 20 50, 30 40, 40 40 C 50 40, 50 55, 50 55" />
                  <path d="M 80 70 C 80 50, 70 40, 60 40 C 50 40, 50 55, 50 55" />
                  <path d="M 36 28 C 38 18, 44 14, 50 14 C 56 14, 62 18, 64 28" />
                  <path d="M 30 50 C 35 60, 45 62, 50 60 C 55 62, 65 60, 70 50" />
                  <path d="M 24 70 L 76 70" strokeLinecap="round" />
                  <path d="M 28 74 L 72 74" strokeLinecap="round" />
                  <path d="M 38 78 L 62 78" strokeLinecap="round" />
                </g>
                <g fill="currentColor">
                  <circle cx="50" cy="45" r="3" />
                </g>
              </svg>
            </div>

            <div className="flex flex-col leading-tight">
              <span className={`text-sm font-bold ${highContrast ? "text-yellow-300" : "text-gray-800"}`}>Lion Capital</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500">India Emblem</span>
            </div>
          </div>
        </div>

        {/* Right Side: Mann Ki Baat Promo and Utilities */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
          
          {/* PM Mann Ki Baat promo banner */}
          <div 
            onClick={() => window.open("https://www.pmindia.gov.in/en/mann-ki-baat/", "_blank")}
            style={{ cursor: "pointer" }}
            className={`flex items-center gap-3 p-2 rounded-lg border max-w-sm md:max-w-md transition-all hover:shadow-md ${
              highContrast 
                ? "bg-stone-900 border-yellow-300 text-yellow-300" 
                : "bg-linear-to-r from-orange-50 to-amber-50 border-orange-200 text-gray-800"
            }`}
            id="mann-ki-baat-banner"
          >
            {/* PM Portrait simulator */}
            <div className="relative w-14 h-12 rounded bg-orange-200 overflow-hidden shrink-0 flex items-center justify-center">
              {/* Vector representation of Indian Flag background + PM speaking representation */}
              <div className="absolute inset-0 bg-linear-to-b from-orange-400 via-white to-green-600 opacity-40" />
              <div className="z-10 text-center leading-none">
                <span className="font-extrabold text-[9px] uppercase tracking-tighter text-orange-800 block">Mann Ki</span>
                <span className="font-extrabold text-xs uppercase text-blue-900 block">Baat</span>
                <span className="text-[8px] text-gray-700 block font-bold">28 June 25</span>
              </div>
            </div>
            
            <div className="text-left text-xs">
              <p className="font-bold text-orange-900 leading-tight">
                {t.mannKiBaat}
              </p>
              <p className="text-[10px] text-gray-600 font-medium leading-normal line-clamp-1">
                {t.mannKiBaatSub}
              </p>
            </div>
            
            <span className="text-[9px] font-bold uppercase py-1 px-2 rounded-md bg-orange-600 text-white shrink-0 hover:bg-orange-700">
              {t.clickHere}
            </span>
          </div>

          {/* Quick Utility Controls */}
          <div className="flex items-center gap-2">
            
            {/* Font Resize Control */}
            <button
              onClick={cycleTextSize}
              title="A+ Font Size"
              className={`p-1.5 rounded-full border text-xs font-bold w-9 h-9 flex items-center justify-center transition-all cursor-pointer ${
                highContrast 
                  ? "border-yellow-300 hover:bg-yellow-300 hover:text-black" 
                  : "border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              A{textSize === "normal" ? "" : textSize === "large" ? "+" : "++"}
            </button>

            {/* Accessibility Toggle */}
            <button
              onClick={handleAccessibilityConfig}
              title="Toggle Accessibility High Contrast Mode"
              className={`p-1.5 rounded-full border w-9 h-9 flex items-center justify-center transition-all cursor-pointer ${
                highContrast 
                  ? "bg-yellow-300 text-black border-yellow-300" 
                  : "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
              }`}
            >
              <Accessibility className="w-5 h-5" />
            </button>

            {/* Hindi Language Toggle button as seen in image */}
            <button
              onClick={toggleLanguage}
              className={`font-semibold py-1 px-4 text-sm rounded-full transition-all border cursor-pointer ${
                highContrast
                  ? "border-yellow-300 hover:bg-yellow-300 hover:text-black"
                  : "border-amber-600 text-amber-700 hover:bg-amber-50"
              }`}
            >
              {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
