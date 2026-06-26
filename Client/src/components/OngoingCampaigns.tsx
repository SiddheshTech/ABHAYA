import React, { useState } from "react";
import { Language } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { Heart, CreditCard, Sparkles, X, Gift, Check, ArrowRight, Share2, Award } from "lucide-react";

interface OngoingCampaignsProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

interface Campaign {
  id: string;
  imgUrl: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  btnTextEn: string;
  btnTextHi: string;
  themeColor: string; // Tailwind bg color for button
  accentColor: string; // Hex color for icons
  btnBg: string; // Hex code for direct SVG rendering
  hoverColor: string;
  badgeEn: string;
  badgeHi: string;
  suggestedAmount: number[];
  statEn: string;
  statHi: string;
  index: number;
}

export default function OngoingCampaigns({ lang, highContrast, textSize }: OngoingCampaignsProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Translation bundle
  const t = {
    sectionTitle: lang === "en" ? "ONGOING CAMPAIGNS WHICH NEED YOUR SUPPORT" : "चल रहे अभियान जिन्हें आपके सहयोग की आवश्यकता है",
    donateNow: lang === "en" ? "Donate Now" : "अभी दान करें",
    modalTitle: lang === "en" ? "Secure Donation Portal" : "सुरक्षित दान पोर्टल",
    presetLabel: lang === "en" ? "Select Donation Amount (INR):" : "दान राशि चुनें (INR):",
    customLabel: lang === "en" ? "Or Enter Custom Amount (INR):" : "या वैकल्पिक राशि दर्ज करें (INR):",
    namePlace: lang === "en" ? "Your Full Name" : "आपका पूरा नाम",
    emailPlace: lang === "en" ? "Your Email Address" : "आपका ईमेल पता",
    submitBtn: lang === "en" ? "Complete Contribution" : "योगदान पूरा करें",
    thankYou: lang === "en" ? "Thank You for Your Generous Support!" : "आपके उदार सहयोग के लिए धन्यवाद!",
    successDesc: lang === "en" 
      ? "Your pledge is received successfully. A Certificate of Appreciation is being processed for you."
      : "आपका संकल्प सफलतापूर्वक प्राप्त हो गया है। आपके लिए एक प्रशंसा प्रमाण पत्र तैयार किया जा रहा है।",
    paymentMode: lang === "en" ? "Simulated Secure Payment" : "सिम्युलेटेड सुरक्षित भुगतान",
    closeBtn: lang === "en" ? "Close" : "बंद करें",
    shareCampaign: lang === "en" ? "Copy Share Link" : "शेयर लिंक कॉपी करें",
    copied: lang === "en" ? "Copied!" : "कॉपी किया गया!",
    taxExempt: lang === "en" ? "All donations are 50% tax exempt under Section 80G." : "धारा 80G के तहत सभी दान 50% कर मुक्त हैं।"
  };

  const campaigns: Campaign[] = [
    {
      id: "edu_child",
      imgUrl: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "Every child deserves to learn. Help them thrive.",
      titleHi: "हर बच्चे को सीखने का अधिकार है। उन्हें आगे बढ़ने में मदद करें।",
      descEn: "Education empowers every future. Donate to ABHAYA and support quality learning for children everywhere. Together, let's ensure no child is left behind.",
      descHi: "शिक्षा हर भविष्य को सशक्त बनाती है। अभया (ABHAYA) को दान करें और हर जगह बच्चों के लिए गुणवत्तापूर्ण शिक्षा का समर्थन करें। आइए मिलकर सुनिश्चित करें कि कोई भी बच्चा पीछे न छूटे।",
      btnTextEn: "Donate Now",
      btnTextHi: "अभी दान करें",
      themeColor: "bg-[#01AABF]",
      btnBg: "#01AABF",
      hoverColor: "hover:bg-[#018e9f]",
      accentColor: "#01AABF",
      badgeEn: "Education Outreach",
      badgeHi: "शिक्षा पहुंच",
      suggestedAmount: [500, 1000, 2500, 5000],
      statEn: "🎯 Goal: 25,000 Schools",
      statHi: "🎯 लक्ष्य: 25,000 स्कूल",
      index: 1
    },
    {
      id: "diff_make",
      imgUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "Join us in making a difference.",
      titleHi: "बदलाव लाने में हमारे साथ जुड़ें।",
      descEn: "Since 2004, we have partnered with the Government of India to empower over 10 million children. Your support allows us to reach even more children and ensure they can access a safe and nurturing environment.",
      descHi: "2004 से, हमने 1 करोड़ से अधिक बच्चों को सशक्त बनाने के लिए भारत सरकार के साथ भागीदारी की है। आपका समर्थन हमें और भी अधिक बच्चों तक पहुँचने और सुरक्षित वातावरण सुनिश्चित करने की अनुमति देता है।",
      btnTextEn: "Donate Now",
      btnTextHi: "अभी दान करें",
      themeColor: "bg-[#F38B95]",
      btnBg: "#F38B95",
      hoverColor: "hover:bg-[#e07580]",
      accentColor: "#F38B95",
      badgeEn: "Child Protection",
      badgeHi: "बाल सुरक्षा",
      suggestedAmount: [800, 1500, 3000, 6000],
      statEn: "❤️ Impacted: 10M+ Kids",
      statHi: "❤️ प्रभावित: 1 करोड़+ बच्चे",
      index: 2
    },
    {
      id: "tech_ignite",
      imgUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "Let's use technology to ignite young minds.",
      titleHi: "आइए युवा दिमागों को प्रज्वलित करने के लिए तकनीक का उपयोग करें।",
      descEn: "Join us in creating vibrant learning hubs for children nationwide. Donate to the \"Making Schools Smart\" project and equip 50 schools with STEM labs and smart classrooms, fostering scientific thinking and empowering future generations.",
      descHi: "देश भर में बच्चों के लिए जीवंत शिक्षा केंद्र बनाने में हमारे साथ जुड़ें। 'मेकिंग स्कूल्स स्मार्ट' परियोजना को दान करें और 50 स्कूलों को एसटीईएम लैब और स्मार्ट क्लासरूम से लैस करें।",
      btnTextEn: "Donate Now",
      btnTextHi: "अभी दान करें",
      themeColor: "bg-[#54C38E]",
      btnBg: "#54C38E",
      hoverColor: "hover:bg-[#43ad7b]",
      accentColor: "#54C38E",
      badgeEn: "Smart Classroom Initiative",
      badgeHi: "स्मार्ट क्लासरूम पहल",
      suggestedAmount: [1000, 2000, 5000, 10000],
      statEn: "🚀 Tech Lab Goal: 50 Hubs",
      statHi: "🚀 तकनीकी लैब लक्ष्य: 50 केंद्र",
      index: 3
    }
  ];

  const handleOpenModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDonationAmount(campaign.suggestedAmount[1]);
    setCustomAmount("");
    setDonorName("");
    setDonorEmail("");
    setIsSubmitted(false);
  };

  const handlePresetSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setDonationAmount(0);
  };

  const currentFinalAmount = customAmount ? parseFloat(customAmount) || 0 : donationAmount;

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || currentFinalAmount <= 0) return;
    setIsSubmitted(true);
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 xl:px-12 flex flex-col items-center">
      
      {/* Red, Bold Header Section mimicking ABHAYA style */}
      <div className="w-full max-w-7xl mx-auto text-center mb-12">
        <h2 
          className={`font-black tracking-tight text-center transition-all ${
            textSize === "large" 
              ? "text-3xl md:text-4.5xl" 
              : textSize === "extra-large" 
              ? "text-4xl md:text-5xl" 
              : "text-2xl md:text-[34px] md:leading-10"
          } ${highContrast ? "text-yellow-600 font-extrabold" : "text-[#D11E26]"}`}
          id="ongoing-campaigns-heading"
        >
          {t.sectionTitle}
        </h2>
        {/* Subtle decorative bottom accent bar */}
        <div className="w-24 h-1.5 bg-[#EF4444] mx-auto mt-4 rounded-full opacity-90" />
      </div>

      {/* Campaigns grid container */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        
        {campaigns.map((camp) => (
          <div 
            key={camp.id}
            className={`flex flex-col rounded-[22px] overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
              highContrast 
                ? "bg-black text-yellow-300 border-yellow-300" 
                : "bg-[#F1F5F9] border-slate-200/90"
            }`}
          >
            {/* Top Image area with rounded top corners */}
            <div className="relative aspect-[16/11] overflow-hidden group">
              <img 
                src={camp.imgUrl} 
                alt={lang === "en" ? camp.titleEn : camp.titleHi} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Floating Badge Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-md ${
                  highContrast 
                    ? "bg-yellow-300 text-black border border-yellow-300" 
                    : "bg-[#1E293B] text-white"
                }`}>
                  {lang === "en" ? camp.badgeEn : camp.badgeHi}
                </span>
              </div>

              {/* Goal stats floating indicator */}
              <div className="absolute bottom-3 right-3 z-10">
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-black/75 text-white backdrop-blur-xs font-mono">
                  {lang === "en" ? camp.statEn : camp.statHi}
                </span>
              </div>
            </div>

            {/* Campaign info section */}
            <div className="p-6 md:p-7 flex-grow flex flex-col justify-between">
              <div>
                <h3 
                  className={`font-black tracking-tight mb-4 ${
                    textSize === "large" 
                      ? "text-xl md:text-2xl" 
                      : textSize === "extra-large" 
                      ? "text-2xl md:text-3xl" 
                      : "text-lg md:text-[20px] md:leading-7"
                  } ${highContrast ? "text-yellow-300 font-extrabold" : "text-slate-900"}`}
                >
                  {lang === "en" ? camp.titleEn : camp.titleHi}
                </h3>
                
                <p 
                  className={`leading-relaxed mb-6 font-sans ${
                    textSize === "large" 
                      ? "text-base" 
                      : textSize === "extra-large" 
                      ? "text-lg" 
                      : "text-[13.5px] leading-6"
                  } ${highContrast ? "text-white" : "text-[#475569]"}`}
                >
                  {lang === "en" ? camp.descEn : camp.descHi}
                </p>
              </div>

              {/* Redesigned interactive direct button matching the mock screenshot perfectly */}
              <button
                type="button"
                onClick={() => handleOpenModal(camp)}
                className={`w-full relative h-[50px] overflow-hidden rounded-xl transition-all font-sans font-black tracking-wide text-sm active:scale-97 cursor-pointer hover:shadow-md ${
                  highContrast 
                    ? "bg-yellow-300 text-black font-extrabold hover:bg-yellow-400" 
                    : `${camp.themeColor} ${camp.hoverColor} text-white`
                }`}
              >
                {/* Visual split matching the hand graphic from Bal Raksha Bharat */}
                <div className="absolute inset-0 flex items-center justify-between px-6 z-10 pointer-events-none">
                  <span className="uppercase tracking-wider">{lang === "en" ? camp.btnTextEn : camp.btnTextHi}</span>
                  
                  {/* Customized icon representational elements in white for standard, contrasting for HC */}
                  <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 fill-white stroke-none opacity-90 animate-pulse" />
                    <svg className="w-7 h-7 fill-white opacity-85" viewBox="0 0 24 24">
                      {camp.index === 1 && (
                        /* Child education hand */
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      )}
                      {camp.index === 2 && (
                        /* Heart hand path */
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      )}
                      {camp.index === 3 && (
                        /* Trophy / Ignite */
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                      )}
                    </svg>
                  </div>
                </div>

                {/* Right hand portion background curve overlay */}
                <span className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-4 transition-transform group-hover:scale-105" />
              </button>
            </div>
            
          </div>
        ))}

      </div>

      {/* 50% Tax Exemption Footnote */}
      <div className={`mt-8 py-3 px-5 rounded-lg text-center text-xs max-w-2xl font-mono border ${
        highContrast 
          ? "bg-black border-yellow-300 text-yellow-300" 
          : "bg-slate-50 text-[#64748B] border-slate-100"
      }`}>
        🛡️ <strong className={highContrast ? "text-white" : "text-slate-700"}>{t.taxExempt}</strong>
      </div>

      {/* FULLY FUNCTIONAL SECURE DONATION FLOW DIALOG modal overlay */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop black layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setSelectedCampaign(null)}
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden border z-10 ${
                highContrast 
                  ? "bg-black border-yellow-300 text-yellow-300" 
                  : "bg-white text-slate-900 border-slate-100"
              }`}
            >
              {/* Header colored banner */}
              <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: selectedCampaign.btnBg }} />

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-full border transition-colors cursor-pointer ${
                  highContrast 
                    ? "border-yellow-300 hover:bg-yellow-300 hover:text-black" 
                    : "border-slate-200 hover:bg-slate-100 text-slate-500"
                }`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSubmitted ? (
                /* Form State */
                <form onSubmit={handleSubmitDonation} className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-500 block mb-1">
                      {lang === "en" ? selectedCampaign.badgeEn : selectedCampaign.badgeHi}
                    </span>
                    <h3 className={`font-black tracking-tight text-xl ${highContrast ? "text-yellow-300" : "text-slate-900"}`}>
                      {t.modalTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === "en" ? selectedCampaign.titleEn : selectedCampaign.titleHi}
                    </p>
                  </div>

                  {/* Preset Amounts list selectors */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider uppercase text-slate-400 block">
                      {t.presetLabel}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedCampaign.suggestedAmount.map((amt) => {
                        const isChosen = donationAmount === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handlePresetSelect(amt)}
                            className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                              isChosen
                                ? (highContrast ? "bg-yellow-300 border-yellow-300 text-black" : "bg-red-500 border-red-500 text-white shadow-md")
                                : (highContrast ? "border-stone-800 hover:bg-stone-900" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700")
                            }`}
                          >
                            ₹{amt.toLocaleString()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom input input amount */}
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase text-slate-400 block mb-2">
                      {t.customLabel}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input 
                        type="number"
                        min="1"
                        placeholder="e.g. 5000"
                        value={customAmount}
                        onChange={handleCustomChange}
                        className={`w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-bold font-mono outline-hidden border transition-all ${
                          highContrast 
                            ? "bg-stone-950 border-yellow-300 focus:ring-1 focus:ring-yellow-300 text-yellow-300" 
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-red-500/50 focus:bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Donor Contact Details section */}
                  <div className="space-y-3">
                    <input 
                      type="text"
                      required
                      placeholder={t.namePlace}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-hidden transition-all ${
                        highContrast 
                          ? "bg-stone-950 border-yellow-300 focus:ring-1 focus:ring-yellow-300 text-yellow-300" 
                          : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-slate-400"
                      }`}
                    />
                    <input 
                      type="email"
                      required
                      placeholder={t.emailPlace}
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium border outline-hidden transition-all ${
                        highContrast 
                          ? "bg-stone-950 border-yellow-300 focus:ring-1 focus:ring-yellow-300 text-yellow-300" 
                          : "bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-slate-400"
                      }`}
                    />
                  </div>

                  {/* Total summary and submit submit */}
                  <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                    highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-emerald-500/5 border-emerald-500/10 text-slate-700"
                  }`}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs font-bold font-mono tracking-wider uppercase">{t.paymentMode}</span>
                    </div>
                    <span className="text-lg font-black font-mono text-emerald-600">
                      ₹{currentFinalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleShare}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        highContrast 
                          ? "border-yellow-300 text-yellow-300 hover:bg-stone-900" 
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      {copiedLink ? t.copied : t.shareCampaign}
                    </button>
                    <button
                      type="submit"
                      className={`flex-grow py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                        highContrast 
                          ? "bg-yellow-300 text-black hover:bg-yellow-400" 
                          : "bg-[#D11E26] hover:bg-[#b0161d] text-white"
                      }`}
                    >
                      {t.submitBtn}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success State with certificate preview style */
                <div className="text-center py-6 space-y-6">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    highContrast ? "bg-yellow-300/20 text-yellow-300" : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-black text-2xl tracking-tight ${highContrast ? "text-yellow-300" : "text-slate-900"}`}>
                      {t.thankYou}
                    </h3>
                    <p className="text-xs text-slate-500 px-4 leading-relaxed">
                      {t.successDesc}
                    </p>
                  </div>

                  {/* Appreciation Certificate dynamic card preview */}
                  <div className={`p-6 rounded-2xl border text-left font-serif relative overflow-hidden shadow-inner ${
                    highContrast ? "bg-stone-950 border-yellow-300/40 text-yellow-300" : "bg-amber-50/20 border-amber-200/50 text-slate-800"
                  }`}>
                    <div className="absolute top-0 right-0 p-3 opacity-30">
                      <Award className="w-16 h-16 text-yellow-600" />
                    </div>
                    <div className="text-center font-sans uppercase tracking-widest text-[9px] text-[#A27B00]">
                      Certificate of Philanthropy
                    </div>
                    <div className="mt-4 text-xs font-medium leading-relaxed">
                      Presented to <strong className={`${highContrast ? "text-white" : "text-slate-900"} font-bold`}>{donorName}</strong> for supporting the vital mission of <strong className="text-red-500 font-bold">{lang === "en" ? selectedCampaign.badgeEn : selectedCampaign.badgeHi}</strong>.
                    </div>
                    <div className="mt-5 flex justify-between items-end text-[10px] font-sans text-slate-400 font-mono">
                      <div>
                        Amount: <strong className="text-emerald-500">₹{currentFinalAmount.toLocaleString()}</strong>
                      </div>
                      <div>
                        Status: <strong className="text-emerald-500">PAID (DEMO)</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCampaign(null)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      highContrast 
                        ? "border-yellow-300 text-yellow-300 hover:bg-stone-900" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {t.closeBtn}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
