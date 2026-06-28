import React, { useState, useEffect } from "react";
import { Language } from "../data/translations";
import { motion } from "motion/react";

// Import the generated children impact image
import kidsImpactImg from "../assets/images/happy_indian_kids_impact_1782112437304.jpg";

interface LivesImpactedProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

// Simple helper component to animate count up nicely
function CountUpNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  // Format with Indian style comma formatting (e.g., 4,29,753 or 1,16,276)
  const formatIndianNumber = (num: number): string => {
    const s = num.toString();
    if (s.length <= 3) return s;
    const lastThree = s.substring(s.length - 3);
    const otherParts = s.substring(0, s.length - 3);
    const formatted = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    return formatted;
  };

  return <span>{formatIndianNumber(count)}</span>;
}

export default function LivesImpacted({ lang, highContrast, textSize }: LivesImpactedProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [impactData, setImpactData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/impact-stories')
      .then(res => res.json())
      .then(data => {
        setImpactData(data);
      })
      .catch(e => console.error("Failed to fetch impact stories", e));
  }, []);

  // Render original vector icon overlays matching the specific colors exactly
  const renderFloatingIcon = (type: string, accentColor: string) => {
    switch (type) {
      case "shield":
        return (
          <svg className="w-14 h-14 drop-shadow-md transform -rotate-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 50 15 C 72 17, 85 24, 80 55 C 75 80, 52 90, 50 90 C 48 90, 25 80, 20 55 C 15 24, 28 17, 50 15 Z"
              fill={accentColor}
            />
            {/* Tiny white decorative dots exactly as in the mock */}
            <circle cx="38" cy="40" r="3" fill="#ffffff" />
            <circle cx="50" cy="52" r="3.5" fill="#ffffff" />
            <circle cx="62" cy="40" r="3" fill="#ffffff" />
            <circle cx="50" cy="32" r="3" fill="#ffffff" />
          </svg>
        );
      case "trophy":
        return (
          <svg className="w-14 h-14 drop-shadow-md transform rotate-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g fill={accentColor}>
              {/* Cup bowl */}
              <path d="M 30 22 L 70 22 C 70 45, 62 58, 50 61 C 38 58, 30 45, 30 22 Z" />
              {/* Stem */}
              <rect x="46" y="61" width="8" height="15" rx="1" />
              {/* Base */}
              <path d="M 35 76 L 65 76 C 65 76, 62 82, 50 82 C 38 82, 35 76, 35 76 Z" />
              {/* Left Handle */}
              <path d="M 30 31 C 18 31, 20 45, 30 45" stroke={accentColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
              {/* Right Handle */}
              <path d="M 70 31 C 82 31, 80 45, 70 45" stroke={accentColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        );
      case "education":
        return (
          <svg className="w-14 h-14 drop-shadow-md transform -rotate-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g fill={accentColor}>
              <rect x="22" y="26" width="30" height="30" rx="6" opacity="0.9" />
              <rect x="45" y="38" width="30" height="30" rx="6" />
              <rect x="45" y="38" width="30" height="30" rx="6" fill="none" stroke="#ffffff" strokeWidth="2" />
              <text x="37" y="47" fill="#ffffff" fontSize="17" fontWeight="900" textAnchor="middle">A</text>
              <text x="60" y="59" fill="#ffffff" fontSize="17" fontWeight="900" textAnchor="middle">B</text>
            </g>
          </svg>
        );
      case "rocket":
        return (
          <svg className="w-14 h-14 drop-shadow-md transform -rotate-45 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Hand-drawn puffy rocket flying up right */}
            <g fill={accentColor}>
              {/* Rocket body */}
              <path d="M 40 85 C 38 60, 48 35, 75 25 C 65 52, 40 62, 40 85 Z" />
              {/* Wing left */}
              <path d="M 41 68 C 30 72, 22 84, 25 88 C 30 88, 38 80, 41 68" />
              {/* Wing right */}
              <path d="M 52 57 C 56 46, 68 38, 72 41 C 72 46, 64 54, 52 57" />
              {/* Fuel Fire */}
              <path d="M 33 83 C 25 90, 20 95, 23 98 C 26 98, 31 93, 38 86 Z" fill="#fbc02d" />
            </g>
          </svg>
        );
      case "lightning":
        return (
          <svg className="w-14 h-14 drop-shadow-md transform rotate-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 58 12 L 25 55 L 48 55 L 35 88 L 75 42 L 50 42 Z"
              fill={accentColor}
            />
          </svg>
        );
      case "leaf":
        return (
          <svg className="w-14 h-14 subpixel-antialiased drop-shadow-md transform rotate-12 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g fill={accentColor}>
              <path d="M 50 85 C 48 70, 45 50, 45 15" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 45 15 C 35 15, 25 25, 45 35 C 55 25, 45 15, 45 15" />
              <path d="M 46 38 C 25 35, 20 50, 46 55 C 55 50, 46 38, 46 38" />
              <path d="M 48 60 C 28 60, 26 75, 48 75 C 55 70, 48 60, 48 60" />
              <path d="M 48 26 C 65 24, 72 38, 48 43" />
              <path d="M 47 48 C 68 45, 75 60, 47 65" />
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const dynamicNumberClass = textSize === "large" ? "text-6xl" : textSize === "extra-large" ? "text-7xl" : "text-5xl md:text-6xl";
  const dynamicBodyTextClass = textSize === "large" ? "text-lg" : textSize === "extra-large" ? "text-xl" : "text-sm";

  return (
    <section 
      className={`w-full py-16 px-4 md:px-8 transition-colors duration-300 relative overflow-hidden ${
        highContrast 
          ? "bg-black text-white border-b border-yellow-300" 
          : "bg-[#f8f9fa] border-b border-gray-150"
      }`} 
      id="lives-impacted-section"
    >
      {/* Background Subtle Wave Texture */}
      {!highContrast && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00acbc_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Summary and Cutout Organic Photograph (4 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-start items-start text-left space-y-6">
          <div className="space-y-2">
            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs md:text-sm font-mono flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block animate-ping" />
              {lang === "en" ? "YEAR OVER YEAR PROGRESS" : "वार्षिक प्रगति विवरण"}
            </p>
            
            <h3 className="text-gray-800 dark:text-gray-200 font-extrabold text-2xl md:text-3xl leading-snug">
              {lang === "en" ? "Lives of" : "हमारा जमीनी असर:"}
            </h3>
            
            {/* Magnificent Large Impact Indicator Number with animated CountUp */}
            <div className={`font-black tracking-tight text-red-650 leading-none ${dynamicNumberClass} select-none`}>
              <CountUpNumber target={429753} />
              <span className="text-rose-500 animate-pulse inline-block ml-1">*</span>
            </div>

            <p className="text-gray-700 font-extrabold text-base md:text-lg lg:text-xl leading-relaxed mt-3">
              {lang === "en" 
                ? "children changed through our work last year" 
                : "बच्चे पिछले वर्ष हमारे समर्पित प्रयासों से लाभान्वित हुए।"}
            </p>
          </div>

          {/* Organic photographic banner image of children laughing */}
          <div className="w-full relative group">
            {/* Back Accent Card border */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-200 to-rose-200 rounded-[2.2rem] blur-md opacity-40 group-hover:opacity-70 transition-all duration-505" />
            
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-xl aspect-16/10">
              <img
                src={kidsImpactImg}
                alt={lang === "en" ? "Happy laughing Indian pupils" : "खुश भारतीय बच्चे"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Floating cute aesthetic badge on image */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                ❤ {lang === "en" ? "Real Transformative Love" : "सच्चा बदलाव और स्नेह"}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-450 font-medium font-mono mt-2">
            * {lang === "en" ? "Data certified from April 2025 to March 2026" : "प्रमाणित डेटा: अप्रैल २०२५ से मार्च २०२६"}
          </div>
        </div>

        {/* Right Side: Grid of 6 beautiful premium domain tiles (7 columns) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative">
          
          {impactData.map((data) => {
            const isHovered = hoveredCard === data.id;
            
            return (
              <div
                key={data.id}
                onMouseEnter={() => setHoveredCard(data.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group p-6 rounded-2xl flex flex-col justify-between text-white transition-all duration-300 overflow-visible min-h-[190px] ${data.bgColor} ${
                  highContrast 
                    ? "bg-transparent border-2 border-yellow-300 text-yellow-300"
                    : "shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
                }`}
                style={{
                  boxShadow: isHovered && !highContrast ? `0 12px 24px -6px ${data.badgeColor}40` : ""
                }}
              >
                
                {/* Floating Vector Icon at top left as shown in the mockup */}
                <div className="absolute -top-6 -left-4 z-20 pointer-events-none select-none">
                  {renderFloatingIcon(data.iconType, highContrast ? "#facc15" : "#ffffff")}
                </div>

                {/* Spacer to prevent text collision with floating icon */}
                <div className="h-4 w-full" />

                {/* Domain Stats */}
                <div className="mt-2 space-y-1">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight block drop-shadow-xs font-mono">
                    <CountUpNumber target={data.targetNum} />
                  </span>
                  
                  <div className="h-0.5 w-12 bg-white/40 group-hover:w-16 transition-all duration-300 rounded-full" />
                </div>

                {/* Subtitle Details */}
                <p className={`font-medium ${dynamicBodyTextClass} leading-snug mt-4 text-white/95 group-hover:text-white transition-all`}>
                  {lang === "en" ? data.textEn : data.textHi}
                </p>

                {/* Bottom Card Decorative Stripe */}
                <div className="absolute bottom-1 right-3 opacity-20 text-[10px] font-mono tracking-widest uppercase select-none">
                  ★ BRB
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
