import React from "react";
import { translations, Language } from "../data/translations";
import { AlertCircle } from "lucide-react";

interface MarqueeNoticeProps {
  lang: Language;
  highContrast: boolean;
}

export default function MarqueeNotice({ lang, highContrast }: MarqueeNoticeProps) {
  const t = translations[lang];

  return (
    <div className={`relative border-y py-2.5 overflow-hidden flex items-center select-none ${
      highContrast
        ? "bg-stone-900 border-yellow-300 text-yellow-300"
        : "bg-white border-red-100 text-red-600"
    }`}>
      {/* Alert badge on the left to secure attention */}
      <div className={`relative z-10 flex items-center gap-1.5 px-4 md:px-6 font-bold text-xs md:text-sm uppercase tracking-wide shrink-0 font-sans border-r shadow-xs ${
        highContrast ? "bg-stone-900 text-yellow-300 border-yellow-300" : "bg-white text-rose-700 border-red-200"
      }`}>
        <AlertCircle className="w-4 h-4 animate-pulse text-red-600" />
        <span className="hidden sm:inline">{lang === "en" ? "IMPORTANT NOTICE" : "महत्वपूर्ण सूचना"}:</span>
        <span className="sm:hidden">{lang === "en" ? "ALERT" : "सूचना"}:</span>
      </div>

      {/* Marquee Container wrapper */}
      <div className="w-full relative overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap text-xs md:text-sm font-extrabold tracking-wide px-4">
          <span>{t.scrollingNotice}</span>
          <span className="mx-24 font-normal">|</span>
          <span>{t.scrollingNotice}</span>
        </div>
      </div>

      {/* Custom Styles Injector for smooth Marquee marquee without rendering additional dependencies */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
