import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import MarqueeNotice from "./components/MarqueeNotice";
import SocialSideDock from "./components/SocialSideDock";
import FieldsOfWork from "./components/FieldsOfWork";
import LivesImpacted from "./components/LivesImpacted";
import ProgrammesAcrossIndia from "./components/ProgrammesAcrossIndia";
import RecentAwards from "./components/RecentAwards";
import OngoingCampaigns from "./components/OngoingCampaigns";
import BlogsSection from "./components/BlogsSection";
import TakeActionSection from "./components/TakeActionSection";
import CorporatePartnerships from "./components/CorporatePartnerships";
import OngoingMissionSection from "./components/OngoingMissionSection";
import FaqsSection from "./components/FaqsSection";
import InteractiveSections from "./components/InteractiveSections";
import StakeholderLoginModal from "./components/StakeholderLoginModal";
import LandingModal from "./components/LandingModal";
import IWRDashboard from "./components/IWRDashboard";
import AIForensicDashboard from "./components/AIForensicDashboard";
import MissionControlDashboard from "./components/MissionControlDashboard";
import SystemDashboard from "./components/SystemDashboard";

import { Language } from "./data/translations";
import { PortalActiveTab, PapsSubPage, GuidelinesSubPage, GrievanceSubPage } from "./types";
import { Calendar, HelpCircle, Phone, Info, ShieldCheck, Heart, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageSquare } from "lucide-react";
import { useApiStore } from "./lib/apiStore";
import { useToastStore } from "./lib/store";
import { useAuthStore } from "./lib/authStore";

// Import the generated foster family banner image
import fosterFamilyBanner from "./assets/images/foster_family_banner_1782108634548.jpg";

export default function App() {
  const { fetchInitialData, initSocket } = useApiStore();
  const { addToast } = useToastStore();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    fetchInitialData();
    initSocket();
    checkAuth();
  }, [fetchInitialData, initSocket, checkAuth]);

  // Global States
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<PortalActiveTab>(PortalActiveTab.HOME);
  const [activePapsSubPage, setActivePapsSubPage] = useState<PapsSubPage>("eligibility");
  const [activeGuidelinesSubPage, setActiveGuidelinesSubPage] = useState<GuidelinesSubPage>("financial");
  const [activeGrievanceSubPage, setActiveGrievanceSubPage] = useState<GrievanceSubPage>("lodge");
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<"normal" | "large" | "extra-large">("normal");
  const [stakeholderLoginOpen, setStakeholderLoginOpen] = useState(false);
  const [iwrDashboardOpen, setIwrDashboardOpen] = useState(false);
  const [aiflDashboardOpen, setAiflDashboardOpen] = useState(false);
  const [missionControlDashboardOpen, setMissionControlDashboardOpen] = useState(false);
  const [systemDashboardRole, setSystemDashboardRole] = useState<string | null>(null);

  const handleStakeholderLoginClick = () => {
    if (isAuthenticated && user) {
      if (user.role === "IWR") setIwrDashboardOpen(true);
      else if (user.role === "AIFL") setAiflDashboardOpen(true);
      else if (user.role === "MC") setMissionControlDashboardOpen(true);
      else if (["CRC", "CW", "ROS"].includes(user.role)) setSystemDashboardRole(user.role);
    } else {
      setStakeholderLoginOpen(true);
    }
  };

  // Dynamic class adjustments based on text sizes
  const appFontClass = textSize === "large" ? "text-lg" : textSize === "extra-large" ? "text-xl" : "text-sm";

  if (iwrDashboardOpen) {
    return <IWRDashboard onLogout={() => setIwrDashboardOpen(false)} highContrast={highContrast} />;
  }

  if (aiflDashboardOpen) {
    return <AIForensicDashboard onLogout={() => setAiflDashboardOpen(false)} highContrast={highContrast} />;
  }

  if (missionControlDashboardOpen) {
    return <MissionControlDashboard onLogout={() => setMissionControlDashboardOpen(false)} highContrast={highContrast} />;
  }

  if (systemDashboardRole) {
    return <SystemDashboard role={systemDashboardRole} onLogout={() => setSystemDashboardRole(null)} highContrast={highContrast} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      highContrast ? "bg-black text-yellow-300 font-bold" : "bg-[#f8fafc] text-gray-800"
    } ${appFontClass}`}>
      
      {/* 1. Portal Header */}
      <Header 
        lang={lang} 
        setLang={setLang} 
        highContrast={highContrast} 
        setHighContrast={setHighContrast}
        textSize={textSize}
        setTextSize={setTextSize}
      />

      {/* 2. Directory Navigation Bar */}
      <Navbar 
        lang={lang} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        setActivePapsSubPage={setActivePapsSubPage}
        setActiveGuidelinesSubPage={setActiveGuidelinesSubPage}
        setActiveGrievanceSubPage={setActiveGrievanceSubPage}
        onStakeholderLoginClick={handleStakeholderLoginClick}
        highContrast={highContrast}
      />

      {/* 3. Hero Slide Stage with translucent overlays */}
      <HeroSlider 
        lang={lang} 
        highContrast={highContrast}
        onActionClick={() => {
          if (activeTab === PortalActiveTab.HOME) {
            // Smoothly navigate parameters to prospective adoptive parenthood calculation panel!
            setActiveTab(PortalActiveTab.PAPS);
          } else {
            setActiveTab(PortalActiveTab.HOME);
          }
        }}
        fosterFamilyBannerUrl={fosterFamilyBanner}
      />

      {/* 4. Scroll Ticker Notification Panel */}
      <MarqueeNotice lang={lang} highContrast={highContrast} />

      {/* 5. Main Content Grid Sections */}
      <main className="flex-grow">
        {activeTab === PortalActiveTab.HOME && (
          <>
            <FieldsOfWork 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <LivesImpacted 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <ProgrammesAcrossIndia 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <RecentAwards 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <OngoingCampaigns 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <BlogsSection 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <TakeActionSection 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <CorporatePartnerships 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <OngoingMissionSection 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
            <FaqsSection 
              lang={lang} 
              highContrast={highContrast} 
              textSize={textSize}
            />
          </>
        )}
        <InteractiveSections 
          lang={lang} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          activePapsSubPage={activePapsSubPage}
          setActivePapsSubPage={setActivePapsSubPage}
          activeGuidelinesSubPage={activeGuidelinesSubPage}
          setActiveGuidelinesSubPage={setActiveGuidelinesSubPage}
          activeGrievanceSubPage={activeGrievanceSubPage}
          setActiveGrievanceSubPage={setActiveGrievanceSubPage}
          highContrast={highContrast}
          textSize={textSize}
        />
      </main>

      {/* 6. Same-to-Same Authentic Footer Block */}
      <footer className={`transition-colors duration-200 ${
        highContrast 
          ? "bg-black text-yellow-300 border-t-2 border-yellow-300" 
          : "bg-[#1c1c1c] text-gray-300 border-t border-stone-800"
      } font-sans pt-12 pb-8 px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Newsletter section */}
          <div className="border-b border-stone-800 pb-10 mb-10">
            <h3 className="text-white text-xs md:text-sm font-extrabold tracking-wider uppercase mb-6">
              {lang === "en" ? "SIGN UP FOR THE NEWSLETTER HERE:" : "न्यूज़लेटर के लिए यहां साइन अप करें:"}
            </h3>
            <form className="flex flex-col md:flex-row items-end gap-6 md:gap-8" onSubmit={(e) => { e.preventDefault(); addToast(lang === "en" ? "Successfully subscribed to newsletter!" : "न्यूज़लेटर की सदस्यता सफलतापूर्वक ली गई!", "success"); }}>
              <div className="flex-1 w-full">
                <input 
                  type="text" 
                  placeholder={lang === "en" ? "Name" : "नाम"} 
                  required
                  className="w-full bg-transparent border-b border-stone-700 focus:border-white text-white py-2.5 outline-hidden text-sm placeholder:text-gray-500 font-sans tracking-wide"
                />
              </div>
              <div className="flex-1 w-full">
                <input 
                  type="email" 
                  placeholder={lang === "en" ? "Email" : "ईमेल"} 
                  required
                  className="w-full bg-transparent border-b border-stone-700 focus:border-white text-white py-2.5 outline-hidden text-sm placeholder:text-gray-500 font-sans tracking-wide"
                />
              </div>
              <button 
                type="submit" 
                className="w-full md:w-auto bg-white text-black hover:bg-gray-100 transition-all px-12 py-3.5 text-xs font-black tracking-widest uppercase shrink-0 cursor-pointer"
              >
                {lang === "en" ? "SUBSCRIBE" : "सदस्यता लें"}
              </button>
            </form>
          </div>

          {/* Core sitemaps and columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 xl:gap-12 pb-12">
            
            {/* Column 1: Logo & Social Links */}
            <div className="flex flex-col space-y-5">
              <div className="flex items-start gap-3">
                {/* Child illustration white logo emblem matching Bal Raksha Bharat concept */}
                <div className="w-12 h-12 rounded-full border border-white/25 bg-white/5 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="3" />
                    <path d="M12 11c-3.1 0-5.5 2.1-5.9 5h11.8c-.4-2.9-2.8-5-5.9-5z" />
                    <path d="M6 18c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V17H6v1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-black text-xl md:text-2xl tracking-tighter leading-none">
                    ABHAYA
                  </h3>
                  <div className="text-stone-400 font-sans text-[11px] font-bold mt-1 tracking-wide">
                    Bal Raksha Bharat
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                    {lang === "en" ? "Also known as Save the Children" : "सेव द चिल्ड्रेन के रूप में भी जाना जाता है"}
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400 block mb-3">
                  Follow us on
                </span>
                <div className="flex items-center gap-2.5">
                  <a href="#facebook" className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#instagram" className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#twitter" className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#linkedin" className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#youtube" className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: ABOUT US */}
            <div>
              <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wide mb-4">
                {lang === "en" ? "ABOUT US" : "हमारे बारे में"}
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#mission" className="hover:text-white transition-colors">Mission & Vision</a></li>
                <li><a href="#council" className="hover:text-white transition-colors">Governing Council</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#award" className="hover:text-white transition-colors">Award and Recognition</a></li>
                <li><a href="#certificates" className="hover:text-white transition-colors">Certificates</a></li>
                <li><a href="#financials" className="hover:text-white transition-colors">Financials</a></li>
              </ul>
            </div>

            {/* Column 3: WHAT WE DO? */}
            <div>
              <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wide mb-4">
                {lang === "en" ? "WHAT WE DO?" : "हम क्या करते हैं?"}
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#strategy" className="hover:text-white transition-colors">Our Strategy</a></li>
                <li><a href="#presence" className="hover:text-white transition-colors">Our Presence</a></li>
                <li><a href="#education" className="hover:text-white transition-colors">Education</a></li>
                <li><a href="#health" className="hover:text-white transition-colors">Health and Nutrition</a></li>
                <li><a href="#wellbeing" className="hover:text-white transition-colors">Economic well being</a></li>
                <li><a href="#protection" className="hover:text-white transition-colors">Child Protection</a></li>
                <li><a href="#humanitarian" className="hover:text-white transition-colors">Humanitarian</a></li>
                <li><a href="#resilience" className="hover:text-white transition-colors">Resilience</a></li>
              </ul>
            </div>

            {/* Column 4: TAKE ACTION */}
            <div>
              <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wide mb-4">
                {lang === "en" ? "TAKE ACTION" : "कदम उठाएं"}
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#donate" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#volunteer" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#receipt" className="hover:text-white transition-colors">Donation Receipt</a></li>
                <li><a href="#ways" className="hover:text-white transition-colors">Other Ways To Help</a></li>
                <li><a href="#gifting" className="hover:text-white transition-colors">High Value Gifting</a></li>
                <li><a href="#safeguarding" className="hover:text-white transition-colors">Child Safeguarding</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#receipt2" className="hover:text-white transition-colors">Donation Receipt</a></li>
              </ul>
            </div>

            {/* Column 5: RESOURCES */}
            <div>
              <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wide mb-4">
                {lang === "en" ? "RESOURCES" : "संसाधन"}
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#blog" className="hover:text-white transition-colors">Latest Blog</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press Coverage</a></li>
                <li><a href="#news" className="hover:text-white transition-colors">News</a></li>
                <li><a href="#reports" className="hover:text-white transition-colors">Reports</a></li>
                <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#webstories" className="hover:text-white transition-colors">Webstories</a></li>
              </ul>
            </div>

          </div>

          {/* Popular Searches section under border-t */}
          <div className="border-t border-stone-850 pt-8 mt-4">
            <h5 className="text-white font-extrabold text-xs uppercase mb-3.5 tracking-wider">
              Popular Searches
            </h5>
            <p className="text-[11px] leading-relaxed text-gray-500 font-sans tracking-tight text-justify select-none break-words">
              {[
                "Income Tax Exemption", "Education Donation", "Online Donation", "Corporate NGO Partnerships", 
                "Child Protection", "Gender Equality", "Child Welfare In India", "Child Nutrition", 
                "Education NGO", "child resilience program", "Disaster relief organisations in India", 
                "Child Poverty", "Child Champion", "Daan Utsav", "NGO Volunteer", "Helping Poor Children", 
                "Child Participation", "Child Safeguarding", "Education empowers", "Prevention of Child Labour", 
                "Fundamental Rights Of Children", "How To Help Street Children", "80G Income Tax", 
                "Child Abuse In India", "Causes Of Gender Inequality", "Marginalization In Education", 
                "Importance Of Girl Child Education", "Help Underpriviledged Children", "Child Protection Policy", 
                "RTE Act", "NGO Working For Education", "Role Of NGO In Education", "Donations Tax Exemption", 
                "Charity Donation Tax Deduction", "Section 80g Of Income Tax Act", "How To Donate", 
                "Right To Education", "Donate For Girl Child Education", "Ways To Donate"
              ].map((term, index, array) => (
                <span key={index} className="inline-block">
                  <a href={`#search-${term.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-stone-300 transition-colors">{term}</a>
                  {index < array.length - 1 && <span className="text-stone-800 px-1.5 select-none">|</span>}
                </span>
              ))}
            </p>
          </div>

          {/* Swachh Bharat details & SAA NIC declaration at bottom */}
          <div className="border-t border-stone-850 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left select-none">
              <p>
                Copyright © 2026 Ministry of Women & Child Development, Government of India. All rights reserved.
              </p>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-stone-800">|</span>
                <span className="text-gray-600 font-mono">ABHAYA - Bal Raksha Code Corridor</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] select-none text-gray-500">
              <span className="hover:underline cursor-pointer">Hyperlink Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Same-to-Same Widgets from the Image (Feedback right-edge bar, WhatsApp, Chat pill) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none select-none hidden md:block">
        <button 
          onClick={() => addToast(lang === "en" ? "Opening interactive feedback desk..." : "इंटरैक्टिव फीडबैक डेस्क खोल रहा है...", "info")}
          className="bg-[#555] hover:bg-neutral-800 text-white text-xs font-black tracking-widest px-3 py-6 rounded-l-md border-y border-l border-stone-600 shadow-2xl pointer-events-auto cursor-pointer flex flex-col items-center justify-center transition-all"
          style={{ writingMode: "vertical-rl" }}
        >
          FEEDBACK
        </button>
      </div>

      {/* Persistent floating action widgets (WhatsApp & Red Chat Button) in bottom-right corner */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Green Circle WhatsApp Button */}
        <a 
          href="https://wa.me/911098" 
          target="_blank" 
          rel="noreferrer" 
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all outline-hidden cursor-pointer"
          title="WhatsApp Helpdesk"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.372a9.936 9.936 0 0 0 4.779 1.218h.004c5.506 0 9.99-4.478 9.99-9.984a9.99 9.99 0 0 0-9.998-9.862zm0 1.794a8.04 8.04 0 0 1 8.045 8.043 8.04 8.04 0 0 1-8.04 8.048c-1.578 0-3.111-.462-4.433-1.336l-.317-.21L4.1 19.16l.84-3.13-.228-.363A8.025 8.025 0 0 1 3.805 11.984a8.04 8.04 0 0 1 8.207-7.989z" />
          </svg>
        </a>

        {/* Red Pill Chat Button */}
        <button 
          onClick={() => addToast(lang === "en" ? "Spawning real-time support agent... Let us know how we can protect child lives." : "वास्तविक समय सहायता एजेंट शुरू हो रहा है... कृपया हमें बताएं कि हम बच्चों की सुरक्षा कैसे कर सकते हैं।", "success")}
          className="bg-[#D11E26] hover:bg-neutral-900 border border-red-500/10 hover:border-stone-700 text-white text-xs font-black tracking-widest px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white text-[#D11E26]" />
          <span>CHAT</span>
        </button>
      </div>

      {/* 7. Floating Social Action side-bar DOCK */}
      <SocialSideDock 
        highContrast={highContrast} 
        setHighContrast={setHighContrast}
        textSize={textSize}
        setTextSize={setTextSize}
      />

      {/* 8. Stakeholder Access Control Modal */}
      <StakeholderLoginModal 
        lang={lang}
        isOpen={stakeholderLoginOpen}
        onClose={() => setStakeholderLoginOpen(false)}
        highContrast={highContrast}
        onIWRLogin={() => {
          setStakeholderLoginOpen(false);
          setIwrDashboardOpen(true);
        }}
        onAIFLLogin={() => {
          setStakeholderLoginOpen(false);
          setAiflDashboardOpen(true);
        }}
        onMCLogin={() => {
          setStakeholderLoginOpen(false);
          setMissionControlDashboardOpen(true);
        }}
        onSystemLogin={(role) => {
          setStakeholderLoginOpen(false);
          setSystemDashboardRole(role);
        }}
      />

      {/* 9. Landing Announcement Auto Modal Popup */}
      <LandingModal 
        lang={lang} 
        highContrast={highContrast} 
      />

    </div>
  );
}
