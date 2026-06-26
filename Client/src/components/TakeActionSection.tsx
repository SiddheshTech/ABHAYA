import React, { useState } from "react";
import { Language } from "../data/translations";
import { 
  Heart, Gift, Award, Sparkles, Smile, Star, 
  X, Check, DollarSign, Users, Mail, Phone, MapPin, Download, Share2
} from "lucide-react";
import { useToastStore } from "../lib/store";

interface TakeActionSectionProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

export default function TakeActionSection({
  lang,
  highContrast,
  textSize,
}: TakeActionSectionProps) {
  const { addToast } = useToastStore();
  // Modal states
  const [activeModal, setActiveModal] = useState<"supporter" | "donate" | null>(null);
  
  // Supporter Form states
  const [supName, setSupName] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supRole, setSupRole] = useState("vocational");
  const [supMessage, setSupMessage] = useState("");
  const [supSubmitted, setSupSubmitted] = useState(false);
  const [generatedSupporterId, setGeneratedSupporterId] = useState("");

  // Donation Form states
  const [donAmount, setDonAmount] = useState("1000");
  const [donCustomAmount, setDonCustomAmount] = useState("");
  const [donFrequency, setDonFrequency] = useState<"one-time" | "monthly">("one-time");
  const [donName, setDonName] = useState("");
  const [donEmail, setDonEmail] = useState("");
  const [donPhone, setDonPhone] = useState("");
  const [donPan, setDonPan] = useState("");
  const [donSuccess, setDonSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  // Font size utilities
  const textClass = textSize === "large" ? "text-lg md:text-xl" : textSize === "extra-large" ? "text-xl md:text-2xl" : "text-sm md:text-base";
  const labelClass = textSize === "large" ? "text-sm" : textSize === "extra-large" ? "text-base" : "text-xs font-bold";
  const btnTextClass = textSize === "large" ? "text-lg font-bold" : textSize === "extra-large" ? "text-xl font-bold" : "text-sm md:text-base font-bold";

  // Quick Translations
  const trans = {
    en: {
      takeAction: "TAKE ACTION",
      becomeSupporter: "Become a Supporter",
      giveTimeOrMonthly: "Give one time or monthly",
      supporterTitle: "Register as an ABHAYA Supporter",
      supporterSub: "Your time, skills, and mentor assistance can create a thriving world of safety for children in distress.",
      fullname: "Full Name",
      email: "Email Address",
      phone: "Mobile Number",
      role: "How would you like to assist?",
      roleOption1: "Vocational Mentoring & Skills Training",
      roleOption2: "Educational Tutoring & Homework Support",
      roleOption3: "Organizing Art/Sport/Recreational Workshops",
      roleOption4: "Material Coordinator (Distribution of Kits)",
      roleOption5: "Child Helpline Digital Support Agent",
      message: "Why would you like to volunteer? (Briefly explain your vision)",
      submit: "Submit Registration",
      close: "Close",
      successTitle: "Registration Submitted!",
      successMessage: "Thank you for registering. Our District Child Protection Unit (DCPU) officer will review your application and contact you soon.",
      supporterIdLabel: "Volunteer Candidate ID:",
      
      donateTitle: "Support Children in Difficult Circumstances",
      donateSub: "Contributions are 100% transparent and qualify for 80G tax exemptions under the juvenile relief framework.",
      frequency: "Donation Frequency",
      frequencyOneTime: "One-Time Contribution",
      frequencyMonthly: "Monthly Pledge",
      chooseAmt: "Choose Contribution Amount",
      customAmt: "Or enter custom amount (₹)",
      pan: "PAN Number (For 100% Tax Deductions under 80G)",
      contributeBtn: "Secure Contribution",
      donSuccessTitle: "Contribution Completed!",
      donSuccessMsg: "Thank you for your generous contribution. Together we are securing child protection and rehabilitation across the country.",
      receiptLabel: "80G Certificate Receipt No:",
      downloadReceipt: "Download Certificate & Receipt",
      impactCalculator: "Estimated Impact",
      impact500: "🔬 Will support educational notebooks, stationary, and pencil kits for 2 children for a month.",
      impact1000: "📚 Will support full health screening, textbooks, and nutrition for 1 distressed child for a month.",
      impact2500: "🏡 Will support child counselling therapy, clothing, and care packages for 3 shelter-home children.",
      impact5000: "🛡️ Will secure specialized legal aid, continuous nutrition, and foster care setup for a child in need.",
      impactCustom: "💖 Every single rupee directly empowers child rehabilitation, foster care support, and emergency help corridors."
    },
    hi: {
      takeAction: "सुझाव और कदम (TAKE ACTION)",
      becomeSupporter: "समर्थक बनें (Become a Supporter)",
      giveTimeOrMonthly: "एक बार या मासिक योगदान दें (Give one time or monthly)",
      supporterTitle: "अभया (ABHAYA) समर्थक के रूप में पंजीकरण करें",
      supporterSub: "आपका समय, कौशल और मार्गदर्शन संकट में फँसे बच्चों के लिए एक सुरक्षित वातावरण का निर्माण कर सकता है।",
      fullname: "पूरा नाम",
      email: "ईमेल आईडी",
      phone: "मोबाइल नंबर",
      role: "आप किस प्रकार सहायता करना चाहेंगे?",
      roleOption1: "व्यावसायिक मार्गदर्शन और कौशल प्रशिक्षण",
      roleOption2: "शैक्षणिक ट्यूशन और गृहकार्य सहायता",
      roleOption3: "कला/खेल/मनोरंजक कार्यशालाओं का आयोजन",
      roleOption4: "सामग्री समन्वयक (किटों का वितरण)",
      roleOption5: "चाइल्ड हेल्प डेस्क डिजिटल सपोर्ट एजेंट",
      message: "आप स्वयंसेवक क्यों बनना चाहते हैं? (संक्षेप में समझाएं)",
      submit: "पंजीकरण जमा करें",
      close: "बंद करें",
      successTitle: "पंजीकरण सफलतापूर्वक हुआ!",
      successMessage: "पंजीकरण के लिए धन्यवाद। जिला बाल संरक्षण इकाई (DCPU) के अधिकारी जल्द ही आपकी आवेदन की समीक्षा करेंगे और आपसे संपर्क करेंगे।",
      supporterIdLabel: "स्वयंसेवक संदर्भ आईडी:",
      
      donateTitle: "कठिन परिस्थितियों में बच्चों का समर्थन करें",
      donateSub: "प्रदान किया गया योगदान 100% पारदर्शी है और किशोर न्याय कल्याण नीतियों के तहत 80G कर छूट के योग्य है।",
      frequency: "कंट्रीब्यूशन आवृत्ति",
      frequencyOneTime: "एक-बारगी योगदान",
      frequencyMonthly: "मासिक संकल्प",
      chooseAmt: "योगदान राशि चुनें",
      customAmt: "या कस्टम राशि दर्ज करें (₹)",
      pan: "पैन नंबर (80G के तहत 100% कर कटौती के लिए)",
      contributeBtn: "सुरक्षित योगदान दें",
      donSuccessTitle: "योगदान पूर्ण हुआ!",
      donSuccessMsg: "आपके उदार योगदान के लिए धन्यवाद। साथ मिलकर हम देश भर में बच्चों की सुरक्षा और पुनर्वास सुनिश्चित कर रहे हैं।",
      receiptLabel: "80G प्रमाणपत्र रसीद संख्या:",
      downloadReceipt: "रसीद एवं प्रमाणपत्र डाउनलोड करें",
      impactCalculator: "अनुमानित प्रभाव",
      impact500: "🔬 एक महीने के लिए 2 बच्चों को शैक्षणिक पाठ्यपुस्तकें और स्टेशनरी किट प्रदान की जाएगी।",
      impact1000: "📚 एक महीने के लिए 1 जरूरतमंद बच्चे को चिकित्सा जांच, पाठ्यपुस्तकें और पोषण मिलेगा।",
      impact2500: "🏡 शेल्टर होम में रहने वाले 3 बच्चों को काउंसलिंग थेरेपी, कपड़े और चिकित्सा सहायता मिलेगी।",
      impact5000: "🛡️ एक बेसहारा बच्चे की कानूनी सहायता, विशेष सुरक्षा और विशिष्ट देखभाल गृह के खर्च सुरक्षित होंगे।",
      impactCustom: "💖 योगदान का प्रत्येक रुपया बच्चों के पुनर्वास, पालक पोषण और आपातकालीन चाइल्डलाइन सहायता को संचालित करता है।"
    }
  };

  const t = trans[lang];

  // Helper to generate IDs
  const openSupporterModal = () => {
    setActiveModal("supporter");
    setSupSubmitted(false);
  };

  const openDonateModal = () => {
    setActiveModal("donate");
    setDonSuccess(false);
  };

  const handleSupporterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supEmail || !supPhone) {
      addToast(lang === "en" ? "Please fill in all required fields." : "कृपया सभी आवश्यक फ़ील्ड भरें।", "error");
      return;
    }
    const randId = "MV-VOL-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedSupporterId(randId);
    setSupSubmitted(true);
    addToast(lang === "en" ? "Successfully registered as a supporter!" : "समर्थक के रूप में सफलतापूर्वक पंजीकृत!", "success");
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donName || !donEmail || !donPhone) {
      addToast(lang === "en" ? "Please fill in all required fields." : "कृपया सभी आवश्यक फ़ील्ड भरें।", "error");
      return;
    }
    const amt = donCustomAmount ? donCustomAmount : donAmount;
    if (parseFloat(amt) <= 0 || isNaN(parseFloat(amt))) {
      addToast(lang === "en" ? "Please enter a valid amount." : "कृपया एक मान्य राशि दर्ज करें।", "error");
      return;
    }
    const receipt = "MV-80G-" + Math.floor(10000000 + Math.random() * 90000000);
    setReceiptNumber(receipt);
    setDonSuccess(true);
    addToast(lang === "en" ? "Thank you! Donation of ₹" + amt + " processed." : "धन्यवाद! ₹" + amt + " का दान संसाधित हुआ।", "success");
  };

  // Get current impact description
  const getImpactMessage = () => {
    const activeAmt = donCustomAmount ? donCustomAmount : donAmount;
    if (activeAmt === "500") return t.impact500;
    if (activeAmt === "1000") return t.impact1000;
    if (activeAmt === "2500") return t.impact2500;
    if (activeAmt === "5000") return t.impact5000;
    return t.impactCustom;
  };

  // Static Assets Paths we generated
  const imgFence = "/src/assets/images/children_fence_1782149463533.jpg";
  const imgJoyful = "/src/assets/images/children_joyful_1782149481532.jpg";

  return (
    <section 
      id="take-action-section"
      className={`relative w-full overflow-hidden py-16 px-4 md:px-12 transition-colors duration-300 ${
        highContrast 
          ? "bg-black border-y-4 border-yellow-300 text-yellow-300" 
          : "bg-[#FFFBEB]/50 border-y border-[#F3EAD3]"
      }`}
    >
      
      {/* Playful Doodles Vector SVG Accents Scattered in background (only when not in high contrast) */}
      {!highContrast && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-15">
          {/* Flower Doodle Top Left */}
          <svg className="absolute top-8 left-[8%] w-16 h-16 text-[#F9A825] fill-current" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 0-3 3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3v2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0 3 3h2a3 3 0 0 0 3-3 3 3 0 0 0-3-3v-2a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3h-2a3 3 0 0 0 0-6zm-1 6H9V6a1 1 0 0 1 1-1 1 1 0 0 1 1 1zm2 0V6a1 1 0 0 1 1-1 1 1 0 0 1 1 1v2zM9 14h2v2a1 1 0 0 1-1 1 1 1 0 0 1-1-1zm6 0a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-2h2z" />
          </svg>
          {/* Trophy Bottom Left */}
          <svg className="absolute bottom-10 left-[15%] w-20 h-20 text-[#2E7D32]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3-3h.75a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-.75M16.5 18.75V16.5L12 14.25m0 0L7.5 16.5v2.25m4.5-4.5V3m0 0l2.25 2.25M12 3L9.75 5.25" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          {/* Heart/Ribbon Center Top */}
          <svg className="absolute top-10 left-[48%] w-12 h-12 text-[#E53935] fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {/* Smiling Face Top Right */}
          <svg className="absolute top-12 right-[12%] w-16 h-16 text-[#0288D1] fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path strokeLinecap="round" d="M9 10.5h.01M15 10.5h.01" strokeWidth="2" />
          </svg>
          {/* Star Bottom Right */}
          <svg className="absolute bottom-12 right-[8%] w-20 h-20 text-[#FF8F00] fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto z-10 flex flex-col items-center">
        
        {/* Title "TAKE ACTION" */}
        <h2 
          className={`text-center font-extrabold tracking-widest uppercase mb-10 ${
            highContrast ? "text-yellow-300 text-3xl md:text-4xl" : "text-[#D32F2F] text-3xl md:text-4.5xl leading-tight"
          }`}
          style={{ fontFamily: "unset" }} 
        >
          {t.takeAction}
        </h2>

        {/* Outer Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-11 w-full max-w-6xl">
          
          {/* Card 1: Become a Supporter */}
          <div 
            onClick={openSupporterModal}
            className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.015] transition-all duration-350 flex flex-col aspect-[4/3] md:aspect-[1.5/1] ${
              highContrast ? "border-4 border-yellow-300 bg-stone-950" : "bg-white"
            }`}
          >
            {/* Background Image of children on wooden fence */}
            <img 
              src={imgFence} 
              alt="Become a Supporter - Happy Children"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Visual gradient overlay to ensure text/button pop contextually */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

            {/* Overlaid Button Pill centered at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap">
              <button 
                id="btn-become-supporter"
                className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-full shadow-lg ${
                  highContrast 
                    ? "bg-yellow-300 text-black font-extrabold border-2 border-black" 
                    : "bg-[#E53935] hover:bg-[#D32F2F] text-white active:scale-95 duration-150 transform transition-all"
                }`}
              >
                <span className={btnTextClass}>{t.becomeSupporter}</span>
                <span className="text-lg">➔</span>
              </button>
            </div>
          </div>

          {/* Card 2: Give one time or monthly */}
          <div 
            onClick={openDonateModal}
            className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.015] transition-all duration-350 flex flex-col aspect-[4/3] md:aspect-[1.5/1] ${
              highContrast ? "border-4 border-yellow-300 bg-stone-950" : "bg-white"
            }`}
          >
            {/* Background Image of happy laughing school children */}
            <img 
              src={imgJoyful} 
              alt="Give one time or monthly - Smiling Children"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Visual gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

            {/* Overlaid Button Pill centered at bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap">
              <button 
                id="btn-give-contribution"
                className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-full shadow-lg ${
                  highContrast 
                    ? "bg-yellow-300 text-black font-extrabold border-2 border-black" 
                    : "bg-[#E53935] hover:bg-[#D32F2F] text-white active:scale-95 duration-150 transform transition-all"
                }`}
              >
                <span className={btnTextClass}>{t.giveTimeOrMonthly}</span>
                <span className="text-lg">➔</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL WINDOW 1: BECOME A SUPPORTER                      */}
      {/* ======================================================== */}
      {activeModal === "supporter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div 
            className={`relative w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto ${
              highContrast ? "bg-stone-950 border-2 border-yellow-300 text-yellow-300" : "bg-white text-gray-800"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${highContrast ? "text-yellow-300" : "text-gray-900"}`}>
                <Users className="w-5 h-5 text-amber-500" />
                <span>{t.supporterTitle}</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className={`p-1 rounded-full ${highContrast ? "hover:bg-amber-100/20" : "hover:bg-gray-100"}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Form or Success */}
            {!supSubmitted ? (
              <form onSubmit={handleSupporterSubmit} className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t.supporterSub}
                </p>

                {/* Name */}
                <div>
                  <label className={`block uppercase mb-1 ${labelClass}`}>{t.fullname} <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={supName} 
                    onChange={e => setSupName(e.target.value)}
                    placeholder="e.g., Rajesh Kumar" 
                    className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-amber-500 outline-hidden ${
                      highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block uppercase mb-1 ${labelClass}`}>{t.email} <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      required 
                      value={supEmail} 
                      onChange={e => setSupEmail(e.target.value)}
                      placeholder="e.g., rajesh@gmail.com" 
                      className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-amber-500 outline-hidden ${
                        highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block uppercase mb-1 ${labelClass}`}>{t.phone} <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required 
                      value={supPhone} 
                      onChange={e => setSupPhone(e.target.value)}
                      placeholder="e.g., +91 98765 43210" 
                      className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-amber-500 outline-hidden ${
                        highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Primary Support Type Selection */}
                <div>
                  <label className={`block uppercase mb-1 ${labelClass}`}>{t.role} <span className="text-red-500">*</span></label>
                  <select 
                    value={supRole} 
                    onChange={e => setSupRole(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-amber-500 outline-hidden ${
                      highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200 text-gray-800"
                    }`}
                  >
                    <option value="vocational">{t.roleOption1}</option>
                    <option value="tutoring">{t.roleOption2}</option>
                    <option value="art">{t.roleOption3}</option>
                    <option value="materials">{t.roleOption4}</option>
                    <option value="helpline">{t.roleOption5}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className={`block uppercase mb-1 ${labelClass}`}>{t.message}</label>
                  <textarea 
                    value={supMessage} 
                    onChange={e => setSupMessage(e.target.value)}
                    rows={3}
                    placeholder={lang === "en" ? "My skills include..." : "मेरा अनुभव..."}
                    className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-amber-500 outline-hidden ${
                      highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-100"
                  >
                    {lang === "en" ? "Cancel" : "रद्द करें"}
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                  >
                    {t.submit}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-emerald-600">{t.successTitle}</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {t.successMessage}
                </p>

                {/* Candidate Volunteer Badge Reference Card */}
                <div className={`p-4 rounded-xl border max-w-sm mx-auto flex flex-col items-center shadow-xs ${
                  highContrast ? "border-yellow-300 bg-stone-900" : "bg-[#F9FBE7] border-lime-200 text-lime-900"
                }`}>
                  <Award className="w-7 h-7 text-amber-500 mb-1" />
                  <span className="text-[10px] tracking-wider uppercase font-extrabold text-amber-600">ABHAYA ADVOCATE</span>
                  <span className="text-base font-extrabold mt-1">{supName}</span>
                  <div className="text-[11px] font-mono text-gray-500 mt-2 bg-white/70 px-2 py-0.5 rounded-sm">
                    {t.supporterIdLabel} {generatedSupporterId}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL WINDOW 2: MOCK CONTRIBUTION SECURE PORTAL          */}
      {/* ======================================================== */}
      {activeModal === "donate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div 
            className={`relative w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto ${
              highContrast ? "bg-stone-950 border-2 border-yellow-300 text-yellow-300" : "bg-white text-gray-800"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${highContrast ? "text-yellow-300" : "text-gray-900"}`}>
                <Heart className="w-5 h-5 text-red-500" />
                <span>{t.donateTitle}</span>
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className={`p-1 rounded-full ${highContrast ? "hover:bg-yellow-105/20" : "hover:bg-gray-100"}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Form or Success */}
            {!donSuccess ? (
              <form onSubmit={handleDonateSubmit} className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t.donateSub}
                </p>

                {/* Donation Type Mode Toggle */}
                <div>
                  <label className={`block uppercase mb-1.5 ${labelClass}`}>{t.frequency}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setDonFrequency("one-time")}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        donFrequency === "one-time" 
                          ? "bg-red-500 text-white border-red-500" 
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t.frequencyOneTime}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDonFrequency("monthly")}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        donFrequency === "monthly" 
                          ? "bg-red-500 text-white border-red-500" 
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t.frequencyMonthly}
                    </button>
                  </div>
                </div>

                {/* Choose preset donation amount */}
                <div>
                  <label className={`block uppercase mb-1.5 ${labelClass}`}>{t.chooseAmt}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["500", "1000", "2500", "5000"].map((amt) => (
                      <button 
                        key={amt}
                        type="button"
                        onClick={() => {
                          setDonAmount(amt);
                          setDonCustomAmount("");
                        }}
                        className={`p-2 rounded-lg text-sm font-bold border transition-all ${
                          donAmount === amt && !donCustomAmount
                            ? "bg-amber-500 text-white border-amber-500" 
                            : "bg-gray-50 text-gray-750 hover:bg-gray-100"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className={`block uppercase mb-1 ${labelClass}`}>{t.customAmt}</label>
                  <input 
                    type="number" 
                    value={donCustomAmount}
                    onChange={(e) => {
                      setDonCustomAmount(e.target.value);
                      setDonAmount("");
                    }}
                    placeholder="e.g., 1500" 
                    className={`w-full p-2 border text-sm rounded-lg focus:ring-2 focus:ring-red-400 outline-hidden ${
                      highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>

                {/* Interactive Dynamic calculated impact box */}
                <div className={`p-4 rounded-xl border flex gap-3 ${
                  highContrast ? "border-yellow-300 bg-stone-900" : "bg-rose-50/50 border-rose-100"
                }`}>
                  <div className="shrink-0 p-1.5 bg-red-100 rounded-lg h-9 w-9 flex items-center justify-center text-red-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-red-800">{t.impactCalculator}</h5>
                    <p className="text-[11px] text-gray-600 mt-1 italic">
                      {getImpactMessage()}
                    </p>
                  </div>
                </div>

                {/* Contributor Information */}
                <div className="space-y-3 pt-2 border-t">
                  {/* Name */}
                  <div>
                    <label className={`block uppercase mb-1 ${labelClass}`}>{t.fullname} <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={donName} 
                      onChange={e => setDonName(e.target.value)}
                      placeholder="e.g., Sneha Sharma" 
                      className={`w-full p-2 rounded-lg border text-sm ${
                        highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Grid Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block uppercase mb-1 ${labelClass}`}>{t.email} <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        required 
                        value={donEmail} 
                        onChange={e => setDonEmail(e.target.value)}
                        placeholder="e.g., sneha@gmail.com" 
                        className={`w-full p-2 rounded-lg border text-sm ${
                          highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block uppercase mb-1 ${labelClass}`}>{t.phone} <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        required 
                        value={donPhone} 
                        onChange={e => setDonPhone(e.target.value)}
                        placeholder="e.g., +91 91111 22222" 
                        className={`w-full p-2 rounded-lg border text-sm ${
                          highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50"
                        }`}
                      />
                    </div>
                  </div>

                  {/* PAN Details */}
                  <div>
                    <label className={`block uppercase mb-1 ${labelClass}`}>{t.pan}</label>
                    <input 
                      type="text" 
                      maxLength={10}
                      value={donPan} 
                      onChange={e => setDonPan(e.target.value.toUpperCase())}
                      placeholder="e.g., ABCDE1234F" 
                      className={`w-full p-2 rounded-lg border text-sm font-mono uppercase ${
                        highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Submit Block */}
                <div className="flex gap-4 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-100"
                  >
                    {lang === "en" ? "Cancel" : "रद्द करें"}
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white active:scale-95 duration-100 shadow-sm"
                  >
                    {t.contributeBtn} (₹{donCustomAmount ? donCustomAmount : donAmount})
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-emerald-600">{t.donSuccessTitle}</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {t.donSuccessMsg}
                </p>

                {/* Certificate Appreciation Receipt */}
                <div className={`p-5 rounded-2xl border text-left max-w-md mx-auto shadow-sm space-y-3 relative overflow-hidden ${
                  highContrast ? "border-yellow-300 bg-stone-900" : "bg-amber-50/40 border-amber-200"
                }`}>
                  
                  {/* Watermark Govt Emblem */}
                  <div className="absolute right-3 top-3 opacity-10">
                    <Heart className="w-20 h-20 text-red-500" />
                  </div>

                  <div className="text-center border-b pb-2">
                    <span className="text-[10px] tracking-wider uppercase font-extrabold text-[#9c27b0]">MINISTRY OF WOMEN & CHILD DEVELOPMENT</span>
                    <h5 className="font-serif text-[#ca2c2c] text-sm font-bold">{lang === "en" ? "CERTIFICATE OF APPRECIATION" : "सराहना प्रमाणपत्र"}</h5>
                  </div>

                  <p className="text-xs text-center leading-relaxed font-sans text-gray-700 italic">
                    "{lang === "en" ? "This certifies and acknowledges with immense gratitude the philanthropic contribution towards foster care, healthcare assistance, and rehabilitation of India's children." : "यह प्रमाण पत्र बहुत कृतज्ञता के साथ भारतीय बच्चों के पालन-पोषण, स्वास्थ्य सेवा सहायता और पुनर्वास के प्रति आपके परोपकारी योगदान को प्रमाणित करता है।"}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t font-sans">
                    <div>
                      <span className="block text-gray-400 font-semibold">{lang === "en" ? "CONTRIBUTOR" : "योगदानकर्ता"}:</span>
                      <span className="font-bold text-gray-800">{donName}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-semibold">{lang === "en" ? "CONTRIBUTION" : "योगदान राशि"}:</span>
                      <span className="font-bold text-[#2e7d32]">₹{donCustomAmount ? donCustomAmount : donAmount} ({donFrequency})</span>
                    </div>
                  </div>

                  {donPan && (
                    <div className="text-[11px] font-sans">
                      <span className="text-gray-400 font-semibold">{lang === "en" ? "PAN NUMBER" : "पैन संख्या"}:</span> <span className="font-bold font-mono text-gray-800">{donPan}</span>
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-gray-500 text-center pt-2 bg-white/70 rounded-md">
                    {t.receiptLabel} {receiptNumber}
                  </div>
                </div>

                {/* Print button & Close */}
                <div className="flex justify-center gap-3 pt-4">
                  <button 
                    onClick={() => {
                        window.print();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 hover:bg-gray-100 border text-gray-800 text-xs font-bold rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>PDF Certificate</span>
                  </button>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-6 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold rounded-lg"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
