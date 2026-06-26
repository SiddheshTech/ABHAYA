import React, { useState, useEffect } from "react";
import { translations, Language } from "../data/translations";
import { ChevronLeft, ChevronRight, Play, Eye, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroSliderProps {
  lang: Language;
  highContrast: boolean;
  onActionClick: () => void;
  fosterFamilyBannerUrl: string;
}

export default function HeroSlider({
  lang,
  highContrast,
  onActionClick,
  fosterFamilyBannerUrl,
}: HeroSliderProps) {
  const t = translations[lang];
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t.fosterTitle,
      subtitle: t.fosterSubtitle,
      description: t.heroDescription,
      bg: fosterFamilyBannerUrl,
      accentColor: "from-blue-900/90 via-blue-950/80 to-transparent",
      actionText: t.registerFoster,
    },
    {
      title: lang === "en" ? "Track Child Platform" : "ट्रैक चाइल्ड प्लेटफॉर्म",
      subtitle: lang === "en" ? "Securing Innocence" : "मासूमियत को सुरक्षित रखना",
      description: lang === "en" 
        ? "Consolidated child tracking system to monitor non-institutional and institutional child progress."
        : "संस्थागत और गैर-संस्थागत बाल प्रगति की निगरानी के लिए समेकित बाल ट्रैकिंग प्रणाली।",
      bg: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop",
      accentColor: "from-rose-900/90 via-rose-950/80 to-transparent",
      actionText: lang === "en" ? "Launch TrackChild Search" : "ट्रैकचाइल्ड सर्च शुरू करें",
    },
    {
      title: lang === "en" ? "PM CARES For Children" : "पीएम केयर्स योजना बच्चों के लिए",
      subtitle: lang === "en" ? "Supporting Education & Future" : "शिक्षा और भविष्य का समर्थन",
      description: lang === "en"
        ? "Assistance platform providing dynamic educational support, stipends, and medical insurance to orphaned children."
        : "अनाथ बच्चों को गतिशील शैक्षिक सहायता, वजीफा और चिकित्सा बीमा प्रदान करने वाला सहायता मंच।",
      bg: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop",
      accentColor: "from-amber-900/90 via-amber-950/80 to-transparent",
      actionText: lang === "en" ? "Explore PM CARES Rules" : "पीएम केयर्स नियमों की जाँच करें",
    },
  ];

  // Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className={`relative w-full h-[380px] md:h-[500px] overflow-hidden select-none ${
      highContrast ? "border-b border-yellow-300 bg-stone-950" : "bg-gray-100"
    }`} id="hero-slider-stage">
      
      {/* Background Image transitions using Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Main Background Image */}
          <img
            src={activeSlide.bg}
            alt="Foster family"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* SAA Blue color gradient Overlay exactly like the portal image */}
          <div className={`absolute inset-0 bg-linear-to-r ${
            highContrast 
              ? "from-black via-black/85 to-transparent" 
              : activeSlide.accentColor
          }`} />
        </motion.div>
      </AnimatePresence>

      {/* Hero content */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center h-full z-10 text-white">
        <div className="max-w-xl md:max-w-2xl text-left">
          
          {/* Category mini badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest py-1 px-2.5 rounded-full ${
              highContrast ? "bg-yellow-300 text-black" : "bg-amber-500/95 text-white"
            }`}>
              {lang === "en" ? "GOVERNMENT INITIATIVE" : "सरकारी पहल"}
            </span>
            <div className="w-12 h-[1px] bg-white/50" />
            <span className="text-[10px] md:text-xs tracking-wider opacity-90 font-mono">
              ★ {lang === "en" ? "Child Welfare System" : "बाल कल्याण प्रणाली"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              {/* Giant display typography styling identical to image */}
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md leading-tight">
                {activeSlide.title}
              </h1>
              <h2 className="text-3xl md:text-5xl font-black text-amber-400 drop-shadow-xs mt-1 leading-none">
                {activeSlide.subtitle}
              </h2>
              
              <p className="mt-4 text-sm md:text-base text-gray-200 font-medium leading-relaxed max-w-lg drop-shadow-xs">
                {activeSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <button
              onClick={onActionClick}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 ${
                highContrast 
                  ? "bg-yellow-300 text-black hover:bg-yellow-400" 
                  : "bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{activeSlide.actionText}</span>
            </button>

            <button
              onClick={onActionClick}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all border border-white/30 backdrop-blur-xs hover:bg-white/10 ${
                highContrast ? "border-yellow-300 text-yellow-300" : ""
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.learnMore}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Left/Right Manual Controls */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white transition-all backdrop-blur-xs"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white transition-all backdrop-blur-xs"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Customized slide indicators matching the layout of the portal precisely */}
      <div className="absolute bottom-6 left-4 md:left-8 z-20 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 ${
              idx === currentSlide
                ? "w-10 h-1.5 rounded-full bg-white"
                : "w-2.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70"
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
