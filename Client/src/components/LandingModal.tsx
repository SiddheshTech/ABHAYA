import React, { useState, useEffect } from "react";
import { Language } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Award, Flame, Download, CheckCircle, ShieldAlert } from "lucide-react";

// Import the generated children honors image
import balPuraskarBanner from "../assets/images/bal_puraskar_modal_banner_1782150817809.jpg";

interface LandingModalProps {
  lang: Language;
  highContrast: boolean;
}

export default function LandingModal({ lang, highContrast }: LandingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto trigger the popup on page mount (every new session/load)
  useEffect(() => {
    // We want to show it immediately on first time landing.
    const hasSeenPopup = sessionStorage.getItem("hasSeenAbhayaLandingPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800); // Small professional delay for great UX feel
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenAbhayaLandingPopup", "true");
  };

  // Re-open for user convenience if they want to access it from the notice trigger
  const forceOpen = () => {
    setIsOpen(true);
    setCurrentSlide(0);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? 1 : prev - 1));
  };

  // Custom detailed vector QR code simulation
  const CustomQrCode = () => (
    <div className="flex flex-col items-center justify-center p-2.5 bg-white border border-gray-200 rounded-xl shadow-xs max-w-[125px] mx-auto">
      <svg
        width="90"
        height="90"
        viewBox="0 0 100 100"
        className="text-slate-905 fill-current"
      >
        {/* Core Detection Markers Top Left */}
        <rect x="0" y="0" width="30" height="30" rx="3" className="text-stone-900" />
        <rect x="6" y="6" width="18" height="18" rx="1" fill="white" />
        <rect x="11" y="11" width="8" height="8" rx="0.5" className="text-stone-900" />

        {/* Core Detection Markers Top Right */}
        <rect x="70" y="0" width="30" height="30" rx="3" className="text-stone-900" />
        <rect x="76" y="6" width="18" height="18" rx="1" fill="white" />
        <rect x="81" y="11" width="8" height="8" rx="0.5" className="text-stone-900" />

        {/* Core Detection Markers Bottom Left */}
        <rect x="0" y="70" width="30" height="30" rx="3" className="text-stone-900" />
        <rect x="6" y="76" width="18" height="18" rx="1" fill="white" />
        <rect x="11" y="81" width="8" height="8" rx="0.5" className="text-stone-900" />

        {/* Alignment marker near bottom right */}
        <rect x="75" y="75" width="10" height="10" rx="1" className="text-stone-900" />
        <rect x="78" y="78" width="4" height="4" fill="white" />

        {/* Random QR high density payload matrix pixels simulation */}
        <path d="M 35 2 L 35 15 L 42 15 L 42 5 L 50 5 L 50 18 L 40 18 L 40 25 L 35 25 L 35 30 L 52 30" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 58 0 L 58 10 L 65 10 L 65 24 L 54 24 L 54 30 L 68 30" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 2 35 L 18 35 L 18 50 L 30 50 L 30 35 L 45 35 L 45 42 L 55 42 L 55 55" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 70 35 L 82 35 L 82 45 L 88 45 L 88 58 L 98 58" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 35 58 L 48 58 L 48 70 L 35 70 L 35 85 L 48 85 L 48 98" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 55 70 L 65 70 L 65 82 L 58 82 L 58 98 L 70 98" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 70 65 L 70 72 L 95 72" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 88 88 L 98 88 L 98 95" stroke="currentColor" strokeWidth="3" fill="none" />

        {/* Center alignment support spot */}
        <rect x="47" y="47" width="6" height="6" rx="1" className="text-[#D11E26]" />
      </svg>
      <span className="text-[8px] font-sans font-bold tracking-tight text-slate-500 mt-1.5 select-none leading-none">
        (Scan here for more details)
      </span>
    </div>
  );

  return (
    <>
      {/* Invisible triggering helper (will attach event listener globally or render a micro button on header if wanted,
          but the instructions are just to show same to same when first coming on page). 
          We also provide a hidden anchor so users can recheck it when they want. */}
      {sessionStorage.getItem("hasSeenAbhayaLandingPopup") && (
        <button
          onClick={forceOpen}
          className="fixed bottom-24 right-5 z-40 bg-white/95 text-[#D11E26] hover:bg-red-500 hover:text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-red-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          title="Re-open National Campaign Announcement"
        >
          <Award className="w-4 h-4 text-amber-500 fill-amber-100" />
          <span>National Announcement</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex justify-center items-start py-6 md:py-10 px-4">
            
            {/* Dark blur ambient high quality backdrop overlay */}
            <div 
              className="fixed inset-0 cursor-pointer"
              onClick={closePopup}
            />

            {/* Carousel Modal Wrapper */}
            <div className="relative w-full max-w-[440px] mx-auto z-10 flex flex-col items-center my-auto">
              
              {/* SLIDER CONTROLS: LEFT NAVIGATION ARROW */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-[-45px] top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none hidden sm:block"
                aria-label="Previous Announcement"
              >
                <ChevronLeft className="w-8 h-8 stroke-[2.5px]" />
              </button>

              {/* SLIDER CONTROLS: RIGHT NAVIGATION ARROW */}
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-[-45px] top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none hidden sm:block"
                aria-label="Next Announcement"
              >
                <ChevronRight className="w-8 h-8 stroke-[2.5px]" />
              </button>

              {/* CARD CONTAINER */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className={`w-full overflow-hidden rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border relative transition-colors duration-300 ${
                  highContrast 
                    ? "bg-black border-yellow-300 text-yellow-300" 
                    : "bg-white border-slate-100 text-slate-800"
                }`}
              >
                
                {/* Micro close X in top right of card for standard accessibility */}
                <button
                  type="button"
                  onClick={closePopup}
                  className="absolute top-3 right-3 z-30 p-1 rounded-full bg-black/5 hover:bg-black/15 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Close Campaign Announcement"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <AnimatePresence mode="wait">
                  {currentSlide === 0 ? (
                    
                    /* ========================================================= */
                    /* SLIDE 1: DETAILED BAL PURASKAR CAMPAIGN - EXACT REPLICA  */
                    /* ========================================================= */
                    <motion.div
                      key="slide-puraskar"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      
                      {/* Sub Header: National authentic corporate identity line */}
                      <header className="p-3 md:py-3 md:px-4 flex items-center justify-between border-b border-rose-50/80 bg-linear-to-b from-rose-50/20 to-white">
                        
                        {/* Gov left logo seal */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-9 select-none opacity-90 text-stone-900 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full fill-current" viewBox="0 0 40 50">
                              <path d="M20 2C15.6 2 12 5.6 12 10C12 11.2 12.3 12.3 12.8 13.3C11.1 14.3 10 16 10 18C10 21.3 12.7 24 16 24V25C13.2 25.3 11 27.7 11 30.6V38H29V30.6C29 27.7 26.8 25.3 24 25V24C27.3 24 30 21.3 30 18C30 16 28.9 14.3 27.2 13.3C27.7 12.3 28 11.2 28 10C28 5.6 24.4 2 20 2ZM20 20C18.9 20 18 19.1 18 18C18 16.9 18.9 16 20 16C21.1 16 22 16.9 22 18C22 19.1 21.1 20 20 20Z" />
                              <rect x="14" y="40" width="12" height="2" />
                              <circle fill="#15803d" cx="20" cy="45" r="2.5" />
                            </svg>
                          </div>

                          <div className="flex flex-col text-left leading-none">
                            <span className="text-[8.5px] font-black text-slate-700 tracking-wide">
                              महिला एवं बाल विकास मंत्रालय
                            </span>
                            <span className="text-[7.5px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">
                              MINISTRY OF WOMEN AND
                            </span>
                            <span className="text-[7.5px] uppercase font-bold text-slate-500 tracking-wider">
                              CHILD DEVELOPMENT
                            </span>
                          </div>
                        </div>

                        {/* ABHAYA right logo emblem seal */}
                        <div className="flex items-center gap-1 bg-sky-50/50 py-0.5 px-2 rounded-full border border-sky-100">
                          <div className="w-4 h-4 rounded-full bg-amber-500 select-none flex items-center justify-center font-black text-[7.5px] text-white">
                            ॐ
                          </div>
                          <span className="text-[8.5px] font-extrabold tracking-widest text-[#0284c7]">
                            अभया
                          </span>
                        </div>

                      </header>

                      {/* Main Campaign Centerpiece visuals with optimized layout */}
                      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden select-none">
                        
                        <img
                          src={balPuraskarBanner}
                          alt="Pradhan Mantri Rashtriya Bal Puraskar honors"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Delicate top overlay details */}
                        <div className="absolute top-2.5 left-3 bg-white/75 backdrop-blur-xs px-2 py-0.5 rounded-sm text-[7.5px] font-mono font-black text-stone-800 border border-white/40 shadow-xs">
                          CAMP-DIV/REF-2026
                        </div>
                      </div>

                      {/* Explicit text content with refined compact padding */}
                      <div className="p-4 md:py-4 md:px-5 text-center space-y-3">
                        
                        <div className="space-y-1">
                          <h3 className="text-[17px] md:text-[19px] font-[1000] text-center leading-tight text-[#D11E26] tracking-tight uppercase">
                            PRADHAN MANTRI RASHTRIYA
                            <span className="block mt-0.5 text-[#D11E26]">BAL PURASKAR 2026</span>
                          </h3>
                          <p className="text-[10.5px] font-black uppercase text-slate-800 tracking-wider">
                            Nominations Are Now Open
                          </p>
                          <div className="w-12 h-0.5 bg-[#D11E26] mx-auto rounded-full my-1.5" />
                        </div>

                        {/* Interactive dynamic QR Section content (compact size) */}
                        <div className="py-1 flex items-center justify-center">
                          <div className="flex flex-col items-center justify-center p-2 bg-white border border-gray-150 rounded-lg shadow-xs max-w-[100px] mx-auto">
                            <svg width="68" height="68" viewBox="0 0 100 100" className="text-stone-900 fill-current">
                              {/* Core Detection Markers Top Left */}
                              <rect x="0" y="0" width="30" height="30" rx="3" />
                              <rect x="6" y="6" width="18" height="18" fill="white" />
                              <rect x="11" y="11" width="8" height="8" />

                              {/* Core Detection Markers Top Right */}
                              <rect x="70" y="0" width="30" height="30" rx="3" />
                              <rect x="76" y="6" width="18" height="18" fill="white" />
                              <rect x="81" y="11" width="8" height="8" />

                              {/* Core Detection Markers Bottom Left */}
                              <rect x="0" y="70" width="30" height="30" rx="3" />
                              <rect x="6" y="76" width="18" height="18" fill="white" />
                              <rect x="11" y="81" width="8" height="8" />

                              {/* Alignment marker near bottom right */}
                              <rect x="75" y="75" width="10" height="10" rx="1" />
                              <rect x="78" y="78" width="4" height="4" fill="white" />

                              {/* Random QR pixels simulation */}
                              <path d="M 35 2 L 35 15 L 42 15 L 42 5 L 50 5 L 50 18 L 40 18 L 40 25 L 35 25 L 35 30 L 52 30" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 58 0 L 58 10 L 65 10 L 65 24 L 54 24 L 54 30 L 68 30" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 2 35 L 18 35 L 18 50 L 30 50 L 30 35 L 45 35 L 45 42 L 55 42 L 55 55" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 70 35 L 82 35 L 82 45 L 88 45 L 88 58 L 98 58" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 35 58 L 48 58 L 48 70 L 35 70 L 35 85 L 48 85 L 48 98" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 55 70 L 65 70 L 65 82 L 58 82 L 58 98 L 70 98" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 70 65 L 70 72 L 95 72" stroke="currentColor" strokeWidth="3" fill="none" />
                              <path d="M 88 88 L 98 88 L 98 95" stroke="currentColor" strokeWidth="3" fill="none" />
                              <rect x="47" y="47" width="6" height="6" rx="1" className="text-[#D11E26]" />
                            </svg>
                            <span className="text-[7.5px] font-sans font-bold text-slate-500 mt-1 select-none leading-none">
                              (Scan for details)
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] md:text-[10.5px] text-slate-500 leading-relaxed font-semibold px-2">
                          {lang === "en" 
                            ? "Nominations of outstanding child achievement profiles under innovation, social service, scholastic capability, arts & culture, sports, and bravery are currently welcomed."
                            : "नवाचार, समाज सेवा, शैक्षिक योग्यता, कला और संस्कृति, खेल, और वीरता के तहत उत्कृष्ट बाल उपलब्धि विवरणों के नामांकन का स्वागत किया जाता है।"}
                        </p>

                      </div>

                      {/* Vibrant blue Solid campaign footer */}
                      <footer className="w-full bg-[#0284c7] text-white py-2.5 px-5 flex items-center justify-center text-center select-none font-sans font-extrabold text-[11.5px] tracking-wide border-t border-sky-400">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-300 rotate-12 shrink-0 mr-1.5 animate-pulse" />
                        <span>Last date to apply - 31st July 2026</span>
                      </footer>

                    </motion.div>
                  ) : (
                    
                    /* ========================================================= */
                    /* SLIDE 2: ABHAYA PORTAL REGISTRATION NOTIFICATION*/
                    /* ========================================================= */
                    <motion.div
                      key="slide-abhaya"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col text-left"
                    >
                      <header className="p-3 md:py-3 md:px-4 flex items-center justify-between border-b border-orange-50 bg-linear-to-b from-orange-50/20 to-white">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-orange-600" />
                          <span className="text-[8.5px] uppercase font-bold tracking-widest text-slate-500">
                            Digital Citizen Announcement
                          </span>
                        </div>
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 py-0.5 px-2 rounded-full border border-emerald-100 font-sans font-bold">
                          Active Notice
                        </span>
                      </header>

                      {/* Body Content with compact spacing */}
                      <div className="p-4 md:p-5 space-y-4">
                        
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1 text-[9px] font-bold font-mono tracking-wider text-[#D11E26] uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                            Immediate Compliance Request
                          </div>
                          <h4 className="text-[15px] md:text-[17px] font-black text-slate-900 tracking-tight leading-snug">
                            {lang === "en" 
                              ? "Profile Synchronization Mandate for Registered Stakeholders" 
                              : "पंजीकृत हितधारकों के लिए प्रोफ़ाइल सिंक्रनाइज़ेशन जनादेश"}
                          </h4>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                          {lang === "en"
                            ? "All District Child Protection Units (DCPU), Specialised Adoption Agencies (SAA), Child Welfare Committees (CWC), and Child Care Institutions (CCIs) throughout Indian municipal corridors must immediately synchronize active registration folders using their government token log."
                            : "सभी जिला बाल संरक्षण इकाइयों (DCPU), विशिष्ट दत्तक ग्रहण एजेंसियों (SAA), बाल कल्याण समितियों (CWC), और बाल गृह संस्थानों (CCIs) को सलाह दी जाती है कि वे अपने पोर्टल लॉगिन के माध्यम से प्रोफ़ाइल विवरणों को तुरंत सिंक्रनाइज़ और सत्यापित करें।"}
                        </p>

                        <div className="p-3 rounded-lg bg-orange-50/50 border border-orange-100 space-y-2">
                          <h5 className="text-[10px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
                            Verifiable Action Checklist:
                          </h5>
                          
                          <ul className="space-y-1.5 text-[10px] text-slate-600 font-semibold">
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-605 font-sans">✓</span>
                              <span>Authenticate local Child Placement Registers with state server</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-605 font-sans">✓</span>
                              <span>Configure dual-factor OTP keys on district mobile logs</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-605 font-sans">✓</span>
                              <span>Confirm absolute anonymity compliance for protected minor files</span>
                            </li>
                          </ul>
                        </div>

                        {/* Interactive Action simulated trigger buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              closePopup();
                              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                            }}
                            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black text-white text-[10.5px] font-bold rounded-lg transition-all text-center cursor-pointer"
                          >
                            Update Profiling logs
                          </button>
                          
                          <a
                            href="https://wcd.nic.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10.5px] font-extrabold rounded-lg transition-all text-center border border-slate-200 block"
                          >
                            State Portal
                          </a>
                        </div>

                      </div>

                      <footer className="w-full bg-[#f8fafc] text-slate-455 py-2.5 px-5 flex justify-between items-center text-[9px] font-mono border-t border-slate-100">
                        <span>NOTICE ID: WCD_REG-892_V2</span>
                        <span className="text-[#D11E26] font-bold">National Compliance Directives</span>
                      </footer>

                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SLIDER DOTS NAVIGATION */}
                <div className={`p-2 flex justify-center items-center gap-1.5 border-t ${
                  highContrast ? "border-yellow-300 bg-black" : "border-slate-50 bg-slate-50/40"
                }`}>
                  <button
                    onClick={() => setCurrentSlide(0)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === 0 
                        ? "bg-[#D11E26] w-4" 
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    title="Pradhan Mantri National Award Notice"
                  />
                  <button
                    onClick={() => setCurrentSlide(1)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === 1 
                        ? "bg-[#D11E26] w-4" 
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    title="ABHAYA Portal Profiling Directive"
                  />
                </div>

              </motion.div>

              {/* BELOW-CARD CENTERED SOLID CLOSE BUTTON */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-6 py-2 rounded-md bg-[#5C6B73] hover:bg-[#4A555C] text-white text-xs font-semibold shadow-md hover:scale-103 active:scale-97 transition-all cursor-pointer tracking-wide"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
