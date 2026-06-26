import React, { useState } from "react";
import { Language } from "../data/translations";
import { 
  Play, Volume2, VolumeX, Shield, Heart, Info, Bell, CheckCircle, 
  X, Sparkles, AlertCircle, Award, Target, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OngoingMissionSectionProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

export default function OngoingMissionSection({
  lang,
  highContrast,
  textSize,
}: OngoingMissionSectionProps) {
  // Interactive modal states
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showDonationSuccess, setShowDonationSuccess] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("1000");
  const [customDonationAmount, setCustomDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [hasSubscribedEmail, setHasSubscribedEmail] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState("");

  // Video state variables
  const [videoPlayState, setVideoPlayState] = useState<"playing" | "paused">("playing");
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);

  // Subtitles sequence for simulated documentary
  const videoSubtitles = [
    { time: "0:02", textEn: "Every child possesses a distinct sparkle in their eyes...", textHi: "हर बच्चे की आँखों में एक अनोखी चमक होती है..." },
    { time: "0:06", textEn: "But progress is unevenly distributed across our communities.", textHi: "लेकिन तरक्की का पहिया हमारी बस्तियों में गैर-बराबर घूमता है।" },
    { time: "0:12", textEn: "Through proper educational aid, we break the shackles of forced labour.", textHi: "सही शिक्षा योजना के जरिए, हम बाल श्रम की बेड़ियों को तोड़ते हैं।" },
    { time: "0:18", textEn: "Join India's largest community-led relief corridor today.", textHi: "आज ही देश के सबसे बड़े जन-सुरक्षा गलियारे से जुड़ें।" },
  ];

  // Font size styles
  const titleTextClass = textSize === "large" 
    ? "text-2xl md:text-3xl lg:text-[34px] leading-tight" 
    : textSize === "extra-large" 
    ? "text-3xl md:text-4xl lg:text-[40px] leading-tight" 
    : "text-xl md:text-[25px] lg:text-[29px] leading-[36px]";

  const bodyTextClass = textSize === "large" 
    ? "text-base md:text-lg" 
    : textSize === "extra-large" 
    ? "text-lg md:text-xl" 
    : "text-[13.8px] md:text-[14.5px] leading-relaxed text-[#334155]";

  const labelClass = textSize === "large" ? "text-sm" : textSize === "extra-large" ? "text-base" : "text-xs font-bold";

  // Slogan text
  const sloganLines = [
    { line: "तरक्की की पटरी", color: "text-white" },
    { line: "हर बस्ती से नहीं गुजरती", color: "text-white/95" },
    { line: "", color: "" }, // Spacing
    { line: "मौकों की बारिश", color: "text-white" },
    { line: "बराबर नहीं बरसती", color: "text-white/95" }
  ];

  // Translations
  const t = {
    en: {
      heading: "ABHAYA's Ongoing Mission to Empower 4 Million Children!",
      para1: "At ABHAYA, we believe in creating a secure future by ensuring every child has a secure childhood. Our ongoing mission is to empower 4 million children, and we are committed to making this vision a reality.",
      para2_prefix: "India's children possess immense potential, yet they face numerous challenges and limited opportunities. Our mission recognizes that similar efforts may not yield the same results for every child, and we are dedicated to tailoring our support to meet their unique needs ",
      para2_link: "online donation india",
      para2_suffix: ".",
      para3: "Join us in building a world where every child has access to equal opportunities and can grow with confidence. Together, we can create a brighter, more equitable future for all children.",
      playTooltip: "Play ABHAYA Documentary Video",
      supportEmpowerment: "Support Empowerment",
      subscribeHeading: "Get Urgent Mission Updates",
      subscribePlaceholder: "Enter your email for security briefings",
      subscribeBtn: "Subscribe",
      subsSuccess: "Subscribed! You will receive verified district-level reports.",
      quickDonateTitle: "Urgent Relief Support Portal",
      quickDonateDesc: "Your secure contribution underwrite child hygiene kits, warm meals, and legal rehabilitation frameworks.",
      donorNameLabel: "Full Name",
      donorEmailLabel: "Email Address",
      donateAmountLabel: "Select Contribution Sum",
      submitDonation: "Execute Secure Contribution",
      donationComplete: "Contribution Fully Processed!",
      donationCompleteDesc: "Thank you for securing foster care. A voucher has been dispatched to your email address.",
      activeSubtitles: "Documentary Captions"
    },
    hi: {
      heading: "4 मिलियन बालकों को सशक्त बनाने का अभया (ABHAYA) का निरंतर अभियान!",
      para1: "अभया (ABHAYA) में, हम हर बच्चे का एक सुरक्षित बचपन सुनिश्चित करके एक सुरक्षित भविष्य बनाने में विश्वास करते हैं। हमारा निरंतर मिशन 4 मिलियन बच्चों को सशक्त बनाना है, और हम इस दृष्टिकोण को वास्तविकता बनाने के लिए प्रतिबद्ध हैं।",
      para2_prefix: "भारत के बच्चों में अपार क्षमता है, फिर भी वे कई चुनौतियों और सीमित अवसरों का सामना करते हैं। हमारा मिशन यह मानता है कि समान प्रयास हर बच्चे के लिए समान परिणाम नहीं दे सकते हैं, और हम उनकी अनूठी जरूरतों को पूरा करने के लिए अपने सहयोग को तैयार करने के लिए समर्पित हैं ",
      para2_link: "ऑनलाइन डोनेशन इंडिया",
      para2_suffix: "।",
      para3: "आइए हमारे साथ एक ऐसी दुनिया बनाने में शामिल हों जहां हर बच्चे को समान अवसर मिले और वे आत्मविश्वास के साथ बढ़ सकें। साथ मिलकर, हम सभी बच्चों के लिए एक उज्जवल, अधिक न्यायसंगत भविष्य बना सकते हैं।",
      playTooltip: "अभया (ABHAYA) वृत्तचित्र वीडियो चलाएं",
      supportEmpowerment: "सशक्तिकरण का समर्थन",
      subscribeHeading: "तत्काल अभियान अपडेट प्राप्त करें",
      subscribePlaceholder: "सुरक्षा रिपोर्ट के लिए ईमेल दर्ज करें",
      subscribeBtn: "सदस्यता लें",
      subsSuccess: "सफलतापूर्वक सदस्य बने! आपको जिला-स्तरीय रिपोर्ट प्राप्त होंगी।",
      quickDonateTitle: "तत्काल सहायता और राहत पोर्टल",
      quickDonateDesc: "आपका सुरक्षित योगदान बच्चों के लिए स्वच्छता किट, पौष्टिक भोजन और कानूनी पुनर्वास प्रणालियों को सुनिश्चित करता है।",
      donorNameLabel: "पूरा नाम",
      donorEmailLabel: "ईमेल पता",
      donateAmountLabel: "योगदान राशि चुनें",
      submitDonation: "सुरक्षित योगदान जमा करें",
      donationComplete: "योगदान सफलतापूर्वक दर्ज हुआ!",
      donationCompleteDesc: "अनाथ एवं जरूरतमंद बाल कल्याण कोष में योगदान देने के लिए धन्यवाद। विवरण ईमेल पर भेजा गया है।",
      activeSubtitles: "वृत्तचित्र उपशीर्षक"
    }
  }[lang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail || !subscriberEmail.includes("@")) return;
    setHasSubscribedEmail(true);
    setTimeout(() => {
      setHasSubscribedEmail(false);
      setSubscriberEmail("");
    }, 4000);
  };

  const handleQuickDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail) return;
    setShowDonationSuccess(true);
  };

  return (
    <section 
      id="ongoing-mission-section"
      className={`relative w-full py-16 px-4 md:px-12 xl:px-16 transition-colors duration-300 overflow-hidden ${
        highContrast 
          ? "bg-black border-y-4 border-yellow-300 text-yellow-300" 
          : "bg-white text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: THE DETAILED SAME TO SAME PLAYABLE CARD AREA */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div 
            className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:scale-[1.01] ${
              highContrast ? "border-4 border-yellow-300" : "bg-slate-900 border border-slate-100"
            }`}
          >
            {/* Aspect Ratio perfectly mimics the screenshot video card */}
            <div className="relative aspect-[16/10] w-full">
              
              {/* Background Thumbnail Image of Smiling Children (the asset we generated) */}
              <img 
                src="/src/assets/images/mission_children_cover_1782150000031.jpg" 
                alt="ABHAYA children looking happy" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />

              {/* Red-tinted / dark ambient vignette overlay so the text pops exactly as in the photo */}
              <div className="absolute inset-0 bg-radial-to-t from-black/85 via-black/45 to-black/20" />

              {/* ========================================== */}
              {/* BRANDING OVERLAY TOP RIGHT: BAL RAKSHA BHARAT */}
              {/* ========================================== */}
              <div className="absolute top-4 right-5 flex items-center gap-2 select-none">
                <div className="flex flex-col text-right">
                  <span className="text-[12px] font-black tracking-wider text-white font-sans leading-none drop-shadow-sm">
                    बाल रक्षा
                  </span>
                  <span className="text-[10.5px] font-bold tracking-widest text-white/90 font-sans leading-none drop-shadow-sm">
                    भारत
                  </span>
                </div>
                {/* Save the Children Logo burst circle white silhouette icon */}
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-sm">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M12,2A10,10,0,0,0,4.65,18.76l.1.13a10,10,0,0,0,14.49,0l.1-.13A10,10,0,0,0,12,2Zm3.1,4.9a1.1,1.1,0,1,1-1.1,1.1A1.1,1.1,0,0,1,15.1,6.9ZM9.1,7.8A1.1,1.1,0,1,1,8,6.7,1.1,1.1,0,0,1,9.1,7.8Zm2.9.2A1.4,1.4,0,1,1,10.6,6.6,1.4,1.4,0,0,1,12,8Zm4.8,6.5c-1.1,1.5-2.9,2.4-4.8,2.4s-3.7-.9-4.8-2.4a.5.5,0,0,1,.8-.6C9,15.2,10.4,16,12,16s3-.8,4-2.1a.5.5,0,0,1,.8.6Z" />
                    <circle cx="12" cy="11" r="1.3" className="fill-white" />
                  </svg>
                </div>
              </div>

              {/* ========================================== */}
              {/* DIALECTIC ADVOCACY TYPOGRAPHY (LEFT SIDE) */}
              {/* ========================================== */}
              <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 flex flex-col space-y-1 md:space-y-1.5 select-none text-left">
                {sloganLines.map((chunk, index) => {
                  if (chunk.line === "") {
                    return <div key={index} className="h-2.5 md:h-4" />;
                  }
                  return (
                    <span 
                      key={index} 
                      className={`text-[19px] md:text-[23px] lg:text-[26px] font-black tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-sans ${chunk.color}`}
                    >
                      {chunk.line}
                    </span>
                  );
                })}
              </div>

              {/* ========================================== */}
              {/* PLAY BUTTON (CENTER RIGHT PORTFOLIO AREA) */}
              {/* ========================================== */}
              <div className="absolute right-[22%] top-[55%] -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center border border-white/60 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group-hover:border-red-500/80 cursor-pointer`}
                  title={t.playTooltip}
                  aria-label={t.playTooltip}
                >
                  <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white translate-x-0.5" />
                </button>
              </div>

              {/* ========================================== */}
              {/* RED NOTIFICATION BELL (BOTTOM RIGHT CORNER) */}
              {/* ========================================== */}
              <div className="absolute bottom-5 right-5">
                <button
                  type="button"
                  onClick={() => setShowNotificationToast(true)}
                  className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 animate-bounce cursor-pointer"
                  title="Subscribe for Instant Distress Alerts"
                >
                  <Bell className="w-4 h-4 fill-white" />
                </button>
              </div>

            </div>
          </div>

          {/* Quick interactive alert if bell triggered */}
          <AnimatePresence>
            {showNotificationToast && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`mt-4 p-4 rounded-2xl border flex gap-3 items-start justify-between shadow-md ${
                  highContrast 
                    ? "bg-stone-900 border-yellow-300 text-yellow-300" 
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex gap-3">
                  <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
                    <Bell className="w-5 h-5 fill-red-200" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-bold text-xs">{t.subscribeHeading}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Receive verified ground situational updates from rescue teams during distress crises.
                    </p>
                    
                    {!hasSubscribedEmail ? (
                      <form onSubmit={handleSubscribe} className="flex gap-2 mt-2 w-full max-w-sm">
                        <input 
                          type="email"
                          required
                          value={subscriberEmail}
                          onChange={(e) => setSubscriberEmail(e.target.value)}
                          placeholder={t.subscribePlaceholder}
                          className="px-2.5 py-1 border rounded-lg text-[11px] w-48 text-gray-800 focus:outline-[#ef4444]"
                        />
                        <button 
                          type="submit"
                          className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700"
                        >
                          {t.subscribeBtn}
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{t.subsSuccess}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setShowNotificationToast(false)}
                  className="p-1 hover:bg-gray-200/50 rounded-full text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: REPLICATING PARAGRAPHS EXACTLY AS IN PHOTO */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left">
          
          {/* Main Slogan Head Title with Red/Orange Color */}
          <h2 
            className={`font-black font-sans leading-tight tracking-tight uppercase ${titleTextClass} ${
              highContrast ? "text-yellow-300" : "text-[#D11E26]"
            }`}
          >
            {t.heading}
          </h2>

          {/* Under-title visual line */}
          <div className="w-16 h-1 bg-[#EF4444] rounded-full" />

          {/* Three sequential paragraphs fully matching the details */}
          <div className="space-y-4 font-sans text-slate-700">
            {/* Paragraph 1 */}
            <p className={bodyTextClass}>
              {t.para1}
            </p>

            {/* Paragraph 2 - featuring the styled interactive underline "online donation india" anchor */}
            <p className={bodyTextClass}>
              <span>{t.para2_prefix}</span>
              <button
                type="button"
                onClick={() => setShowDonationModal(true)}
                className={`underline font-bold text-[#E53935] hover:text-[#D32F2F] cursor-pointer inline transition-colors focus:ring-1 focus:ring-red-300 rounded-sm`}
                title="Open Secure Donation Wizard"
              >
                {t.para2_link}
              </button>
              <span>{t.para2_suffix}</span>
            </p>

            {/* Paragraph 3 */}
            <p className={bodyTextClass}>
              {t.para3}
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* FULL-SCREEN IMMERSIVE SIMUALTED DOCUMENTARY MEDIA LIGHTBOX */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPlayingVideo && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsPlayingVideo(false)}
            />

            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-20 ${
                highContrast ? "bg-black border-2 border-yellow-300 text-yellow-300" : "bg-stone-950 text-white"
              }`}
            >
              
              {/* Main Simulated Screen Player */}
              <div className="relative aspect-[16/9] w-full bg-black flex items-center justify-center">
                
                {videoPlayState === "playing" ? (
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    {/* Streaming header metrics */}
                    <div className="flex justify-between items-center z-10">
                      <span className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider text-white select-none animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                        LIVE STREAMING
                      </span>
                      <span className="text-xs font-mono text-white/50 tracking-wider">
                        0:08 / 3:15 MIN
                      </span>
                    </div>

                    {/* Simulating motion/video clip via elegant shifting background */}
                    <div className="absolute inset-0 select-none overflow-hidden">
                      <img 
                        src="/src/assets/images/mission_children_cover_1782150000031.jpg"
                        alt="Simulated live video background frames"
                        className="w-full h-full object-cover scale-110 filter brightness-[0.35] blur-[1px] animate-pulse"
                        referrerPolicy="no-referrer"
                      />
                      {/* Scan lines & flickering effect overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
                    </div>

                    {/* SUBTITLE LYRIC WRAPPER (DYNAMIC SIMULATION) */}
                    <div className="z-10 bg-black/80 px-5 py-3 border border-white/5 rounded-2xl max-w-lg mx-auto text-center shadow-lg transition-all">
                      <span className="block text-[9px] uppercase font-bold tracking-widest text-[#EF4444] mb-1">
                        {t.activeSubtitles}
                      </span>
                      <p className="text-sm font-bold text-white tracking-wide">
                        {lang === "en" 
                          ? videoSubtitles[activeSubtitleIndex].textEn 
                          : videoSubtitles[activeSubtitleIndex].textHi
                        }
                      </p>
                    </div>

                    {/* Timeline Interactive Progress simulation bar */}
                    <div className="w-full z-10 flex flex-col gap-2">
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-600 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${(activeSubtitleIndex + 1) * 25}%` }}
                        />
                      </div>

                      {/* Manual subtitle step simulation buttons to play with speech captions */}
                      <div className="flex justify-between items-center text-[11px] font-mono mt-1">
                        <div className="flex gap-1.5">
                          {videoSubtitles.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveSubtitleIndex(i)}
                              className={`px-2 py-0.5 rounded-md border text-[10px] transition-all cursor-pointer ${
                                activeSubtitleIndex === i 
                                  ? "bg-white text-black font-extrabold" 
                                  : "bg-white/10 text-white/70 hover:bg-white/20"
                              }`}
                            >
                              Frame {i + 1}
                            </button>
                          ))}
                        </div>
                        <span className="text-white/60">Seek Frame</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Paused Cover Frame state */
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center select-none z-10">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#EF4444] font-bold">
                      Playback Paused
                    </span>
                  </div>
                )}

                {/* Floating Absolute Cross dismiss x button */}
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 hover:scale-105 duration-100 cursor-pointer z-30"
                  title="Close Lightbox Player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Narratives information block underneath video */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#EF4444] font-mono">
                      ABHAYA Core Broadcast
                    </span>
                    <h3 className="text-base font-extrabold tracking-tight mt-0.5">
                      {lang === "en" ? "India's Forgotten Margins: Reclaiming Potential" : "भूली हुई सीमाएँ: बच्चों की क्षमता को पुनः स्थापित करना"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVideoPlayState(videoPlayState === "playing" ? "paused" : "playing")}
                      className={`px-4 py-2 font-bold text-xs rounded-xl border cursor-pointer ${
                        highContrast ? "border-yellow-300 text-yellow-300" : "bg-slate-900 border-slate-700 text-white hover:bg-slate-850"
                      }`}
                    >
                      {videoPlayState === "playing" ? "⏸ Pause" : "▶ Play"}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-xl border cursor-pointer ${
                        highContrast ? "border-yellow-300" : "bg-slate-900 border-slate-700"
                      }`}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
                    </button>
                  </div>
                </div>

                <p className="text-[12px] text-gray-400 font-sans leading-relaxed text-left">
                  {lang === "en" 
                    ? "Our video documentary catalogs the deployment of digital smart classes and child rescue taskforce interventions throughout vulnerable district locations. By addressing structural needs with micro-calibrated aid, ABHAYA serves as the secure shelter framework."
                    : "हमारा वृत्तचित्र संवेदनशील जिलों में डिजिटल स्मार्ट कक्षाओं और बाल राहत सुरक्षा टीमों की गतिविधियों को दर्शाता है। सूक्ष्म-कैलिब्रेटेड राहत के साथ आवश्यक आवश्यकताओं को पूरा करते हुए, अभया (ABHAYA) बाल विकास की नींव रखता है।"}
                </p>

                {/* Secure certificate reassurance block */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex gap-3 items-center">
                  <Shield className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-[11.5px] font-bold text-left text-gray-300 leading-snug">
                    Verified Broadcast Certificate: Compliance aligned with Juvenile Justice Act and National Commission for Protection of Child Rights guidelines.
                  </span>
                </div>

                {/* Actions bottom footer */}
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-[10px] text-gray-500">Documentary ID: MV-89-DOC-90</span>
                  <button
                    onClick={() => {
                      setIsPlayingVideo(false);
                      setShowDonationModal(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{t.supportEmpowerment}</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* LOCAL QUICK DONATION DRAWER/MODAL FOR "online donation india" */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showDonationModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-xs"
              onClick={() => setShowDonationModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 25 }}
              className={`relative w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 z-10 ${
                highContrast ? "bg-stone-950 border-2 border-yellow-300 text-yellow-300" : "bg-white text-slate-800"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${highContrast ? "text-yellow-300" : "text-gray-900"}`}>
                  <Heart className="w-5 h-5 text-red-500 fill-red-100 animate-pulse" />
                  <span>{t.quickDonateTitle}</span>
                </h3>
                <button 
                  onClick={() => setShowDonationModal(false)}
                  className={`p-1 rounded-full ${highContrast ? "hover:bg-yellow-101/20" : "hover:bg-gray-100"}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!showDonationSuccess ? (
                <form onSubmit={handleQuickDonationSubmit} className="space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed text-left">
                    {t.quickDonateDesc}
                  </p>

                  {/* Preset Amount selector */}
                  <div>
                    <label className={`block uppercase mb-1.5 ${labelClass}`}>{t.donateAmountLabel}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["500", "1000", "2000", "5000"].map((sum) => (
                        <button 
                          key={sum}
                          type="button"
                          onClick={() => {
                            setDonationAmount(sum);
                            setCustomDonationAmount("");
                          }}
                          className={`p-2 rounded-lg text-sm font-bold border transition-all ${
                            donationAmount === sum && !customDonationAmount
                              ? "bg-red-500 text-white border-red-500" 
                              : "bg-gray-50 text-gray-750 hover:bg-gray-100"
                          }`}
                        >
                          ₹{sum}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Sum Input */}
                  <div>
                    <label className={`block uppercase mb-1 ${labelClass}`}>Or Custom Sum (₹)</label>
                    <input 
                      type="number"
                      value={customDonationAmount}
                      onChange={(e) => {
                        setCustomDonationAmount(e.target.value);
                        setDonationAmount("");
                      }}
                      placeholder="e.g., 1500"
                      className={`w-full p-2 border text-sm rounded-lg focus:ring-2 focus:ring-red-400 outline-hidden ${
                        highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>

                  {/* Donor Info */}
                  <div className="space-y-3 pt-2 border-t text-left">
                    <div>
                      <label className={`block uppercase mb-1 ${labelClass}`}>{t.donorNameLabel} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g., Sneha Patel" 
                        className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-red-400 outline-hidden ${
                          highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block uppercase mb-1 ${labelClass}`}>{t.donorEmailLabel} <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        required
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="e.g., sneha@gmail.com" 
                        className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-red-400 outline-hidden ${
                          highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex gap-4 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowDonationModal(false)}
                      className="px-4 py-2 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                      {lang === "en" ? "Cancel" : "रद्द करें"}
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white active:scale-95 duration-100 shadow-sm"
                    >
                      {t.submitDonation} (₹{customDonationAmount ? customDonationAmount : donationAmount})
                    </button>
                  </div>

                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-600">{t.donationComplete}</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {t.donationCompleteDesc}
                  </p>

                  <div className={`p-4 rounded-xl border text-left max-w-sm mx-auto ${
                    highContrast ? "border-yellow-300 bg-stone-900" : "bg-[#F9FBE7] border-lime-200 text-lime-900"
                  }`}>
                    <Award className="w-7 h-7 text-amber-500 mb-1" />
                    <span className="text-[10px] font-extrabold text-amber-600 uppercase block tracking-wider">ABHAYA Contributor</span>
                    <span className="text-base font-black text-gray-800 block mt-1">{donorName}</span>
                    <span className="text-xs text-gray-500">Contribution sum: ₹{customDonationAmount ? customDonationAmount : donationAmount}</span>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        setShowDonationModal(false);
                        setShowDonationSuccess(false);
                        setDonorName("");
                        setDonorEmail("");
                      }}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg"
                    >
                      Dismiss Window
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
