import React, { useState } from "react";
import { translations, Language } from "../data/translations";
import { PortalActiveTab, PapsSubPage, GuidelinesSubPage, GrievanceSubPage } from "../types";
import { Menu, X, ChevronDown, ShieldCheck, HelpCircle, LogOut } from "lucide-react";
import { useAuthStore } from "../lib/authStore";
interface NavbarProps {
  lang: Language;
  activeTab: PortalActiveTab;
  setActiveTab: (tab: PortalActiveTab) => void;
  setActivePapsSubPage?: (page: PapsSubPage) => void;
  setActiveGuidelinesSubPage?: (page: GuidelinesSubPage) => void;
  setActiveGrievanceSubPage?: (page: GrievanceSubPage) => void;
  onStakeholderLoginClick: () => void;
  highContrast: boolean;
}

export default function Navbar({
  lang,
  activeTab,
  setActiveTab,
  setActivePapsSubPage,
  setActiveGuidelinesSubPage,
  setActiveGrievanceSubPage,
  onStakeholderLoginClick,
  highContrast,
}: NavbarProps) {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<PortalActiveTab | null>(null);
  const { isAuthenticated, logout } = useAuthStore();

  const papsSubItems: { labelEn: string; labelHi: string; value: PapsSubPage }[] = [
    { labelEn: "Eligibility Check", labelHi: "पात्रता जांच", value: "eligibility" },
    { labelEn: "Adoption Process", labelHi: "गोद लेने की प्रक्रिया", value: "timeline" },
    { labelEn: "Documents Checklist", labelHi: "दस्तावेज़ चेकलिस्ट", value: "documents" },
    { labelEn: "Post-Adoption", labelHi: "गोद लेने के बाद", value: "post_adoption" },
    { labelEn: "Financial Aid", labelHi: "वित्तीय सहायता", value: "financial" },
    { labelEn: "FAQs for PAPs", labelHi: "PAPs के लिए अक्सर पूछे जाने वाले प्रश्न", value: "faqs" }
  ];

  const guidelinesSubItems: { labelEn: string; labelHi: string; value: GuidelinesSubPage }[] = [
    { labelEn: "Financial Aid & Grants", labelHi: "वित्तीय सहायता और अनुदान", value: "financial" },
    { labelEn: "DCPU Protocols", labelHi: "DCPU प्रोटोकॉल", value: "dcpu" },
    { labelEn: "Safe Shelter & CCIs", labelHi: "सुरक्षित आश्रय और CCIs", value: "cci" },
    { labelEn: "Adoption & Foster Rules", labelHi: "गोद लेने और पालक नियम", value: "adoption" }
  ];

  const grievanceSubItems: { labelEn: string; labelHi: string; value: GrievanceSubPage }[] = [
    { labelEn: "Lodge Grievance", labelHi: "शिकायत दर्ज करें", value: "lodge" },
    { labelEn: "Track Status", labelHi: "स्थिति ट्रैक करें", value: "track" },
    { labelEn: "SOP & Workflow", labelHi: "एसओपी और कार्यप्रवाह", value: "sop" },
    { labelEn: "SLA & Timelines", labelHi: "SLA और समय-सीमा", value: "sla" },
    { labelEn: "Whistleblower Protection", labelHi: "व्हिसिलब्लोअर सुरक्षा", value: "whistleblower" }
  ];

  const mediaSubItems = [
    { labelEn: "Press Releases", labelHi: "प्रेस विज्ञप्ति", value: "press" },
    { labelEn: "Photo Gallery", labelHi: "फोटो गैलरी", value: "photos" },
    { labelEn: "Video Gallery", labelHi: "वीडियो गैलरी", value: "videos" },
    { labelEn: "Success Stories", labelHi: "सफलता की कहानियां", value: "stories" }
  ];

  const citizenSubItems = [
    { labelEn: "Volunteer Registration", labelHi: "स्वयंसेवक पंजीकरण", value: "volunteer" },
    { labelEn: "Donor Outreach", labelHi: "दाता आउटरीच", value: "donor" },
    { labelEn: "Help Desk Directory", labelHi: "हेल्प डेस्क निर्देशिका", value: "helpdesk" },
    { labelEn: "Public Advisories", labelHi: "सार्वजनिक सलाह", value: "advisories" }
  ];

  const trackChildSubItems = [
    { labelEn: "National Tracking Database", labelHi: "राष्ट्रीय ट्रैकिंग डेटाबेस", value: "national" },
    { labelEn: "Report Missing Child", labelHi: "लापता बच्चे की रिपोर्ट", value: "report" },
    { labelEn: "State Coordinator Directory", labelHi: "राज्य समन्वयक निर्देशिका", value: "coordinators" }
  ];

  const relatedLinkSubItems = [
    { labelEn: "Ministry of WCD Portal", labelHi: "महिला एवं बाल विकास मंत्रालय पोर्टल", value: "mwcd" },
    { labelEn: "CARA Adoption Portal", labelHi: "सीएआरए गोद लेने का पोर्टल", value: "cara" },
    { labelEn: "NCPCR Website", labelHi: "एनसीपीसीआर वेबसाइट", value: "ncpcr" },
    { labelEn: "Childline India 1098", labelHi: "चाइल्डलाइन इंडिया 1098", value: "childline" }
  ];

  const menuItems = [
    { label: t.home, value: PortalActiveTab.HOME, hasDropdown: false },
    { label: t.actAndRules, value: PortalActiveTab.ACT_AND_RULES, hasDropdown: false },
    { label: t.paps, value: PortalActiveTab.PAPS, hasDropdown: true, subItems: papsSubItems },
    { label: t.guidelines, value: PortalActiveTab.GUIDELINES, hasDropdown: true, subItems: guidelinesSubItems },
    { label: t.bestPractices, value: PortalActiveTab.BEST_PRACTICES, hasDropdown: false },
    { label: t.grievance, value: PortalActiveTab.GRIEVANCE, hasDropdown: true, subItems: grievanceSubItems },
    { label: t.media, value: PortalActiveTab.MEDIA, hasDropdown: true, subItems: mediaSubItems },
    { label: t.citizenCorner, value: PortalActiveTab.CITIZEN_CORNER, hasDropdown: true, subItems: citizenSubItems },
    { label: t.trackChild, value: PortalActiveTab.TRACK_CHILD, hasDropdown: true, subItems: trackChildSubItems },
    { label: t.pmCares, value: PortalActiveTab.PM_CARES, hasDropdown: false },
    { label: t.relatedLink, value: PortalActiveTab.RELATED_LINK, hasDropdown: true, subItems: relatedLinkSubItems },
    { label: t.contactUs, value: PortalActiveTab.CONTACT_US, hasDropdown: false },
  ];

  // Helper to handle submenu clicks
  const handleSubItemClick = (mainTab: PortalActiveTab, subItemVal: string) => {
    setActiveTab(mainTab);
    
    // PAPs routing
    if (mainTab === PortalActiveTab.PAPS && setActivePapsSubPage) {
      setActivePapsSubPage(subItemVal as PapsSubPage);
    } 
    // Guidelines routing
    else if (mainTab === PortalActiveTab.GUIDELINES && setActiveGuidelinesSubPage) {
      setActiveGuidelinesSubPage(subItemVal as GuidelinesSubPage);
    } 
    // Grievance routing
    else if (mainTab === PortalActiveTab.GRIEVANCE && setActiveGrievanceSubPage) {
      setActiveGrievanceSubPage(subItemVal as GrievanceSubPage);
    }
    // Related Link external portal routing
    else if (mainTab === PortalActiveTab.RELATED_LINK) {
      let url = "";
      if (subItemVal === "mwcd") url = "https://wcd.nic.in";
      else if (subItemVal === "cara") url = "https://cara.wcd.gov.in";
      else if (subItemVal === "ncpcr") url = "https://ncpcr.gov.in";
      else if (subItemVal === "childline") url = "https://www.childlineindia.org";
      if (url) window.open(url, "_blank");
    }
    // Track Child scrolling routing
    else if (mainTab === PortalActiveTab.TRACK_CHILD) {
      setTimeout(() => {
        if (subItemVal === "report") {
          const el = document.getElementById("report-missing-form") || document.querySelector("form");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (subItemVal === "national") {
          const el = document.getElementById("track-child-search-form") || document.querySelector("form");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

  return (
    <nav className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
      highContrast 
        ? "bg-stone-950 text-yellow-300 border-yellow-300" 
        : "bg-white text-gray-800 border-gray-100 shadow-xs"
    }`}>
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Menu items for desktop */}
          <div className="hidden xl:flex items-center space-x-1 select-none py-1 flex-wrap">
            {menuItems.map((item) => {
              const isActive = activeTab === item.value;
              return (
                <div key={item.value} className="relative group">
                  <button
                    onClick={() => {
                      setActiveTab(item.value);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-md transition-all whitespace-nowrap focus:outline-hidden cursor-pointer ${
                      isActive
                        ? highContrast
                          ? "bg-yellow-300 text-black font-bold"
                          : "text-amber-700 bg-amber-50/80 border-b-2 border-amber-600 rounded-b-none"
                        : highContrast
                        ? "text-yellow-300 hover:bg-stone-800"
                        : "text-gray-700 hover:text-amber-800 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Desktop Dropdown for items with subItems */}
                  {item.hasDropdown && item.subItems && (
                    <div className={`absolute left-0 top-full mt-1 w-56 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top border ${
                      highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-white border-gray-200 text-gray-800"
                    }`}>
                      <div className="py-2">
                        {item.subItems?.map((subItem) => (
                          <button
                            key={subItem.value}
                            onClick={() => {
                              handleSubItemClick(item.value, subItem.value);
                              setMobileMenuOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                              highContrast 
                                ? "hover:bg-yellow-300 hover:text-black" 
                                : "hover:bg-amber-50 hover:text-amber-800"
                            }`}
                          >
                            {lang === "en" ? subItem.labelEn : subItem.labelHi}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Slogan/Title for smaller layouts when menu is collapsed */}
          <div className="xl:hidden flex items-center font-bold text-amber-800 text-sm">
            <span>{translations[lang].title}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Stakeholder Login / Dashboard button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onStakeholderLoginClick}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full shadow-xs transition-all cursor-pointer ${
                    highContrast
                      ? "bg-yellow-300 text-black hover:bg-yellow-400"
                      : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  title="Logout"
                  className={`flex items-center justify-center w-9 h-9 rounded-full shadow-xs transition-all cursor-pointer ${
                    highContrast
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onStakeholderLoginClick}
                className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full shadow-xs transition-all cursor-pointer ${
                  highContrast
                    ? "bg-yellow-300 text-black hover:bg-yellow-400"
                    : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.stakeholderLogin}</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-stone-900 focus:outline-hidden cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className={`xl:hidden border-t px-4 py-3 space-y-1 transition-all max-h-[70vh] overflow-y-auto ${
          highContrast ? "bg-stone-950 text-yellow-300 border-yellow-300" : "bg-white shadow-lg border-gray-100"
        }`}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.value;
            const isExpanded = mobileExpandedTab === item.value;
            return (
              <div key={item.value}>
                <button
                  onClick={() => {
                    if (item.hasDropdown && item.subItems) {
                      setMobileExpandedTab(isExpanded ? null : item.value);
                    } else {
                      setActiveTab(item.value);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                    isActive
                      ? highContrast
                        ? "bg-yellow-300 text-black font-bold"
                        : "bg-amber-50 text-amber-800 font-semibold"
                      : highContrast
                      ? "text-yellow-300 hover:bg-stone-900"
                      : "text-gray-700 hover:bg-gray-50 hover:text-amber-800"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  )}
                </button>
                
                {/* Mobile Sub-menu */}
                {isExpanded && item.subItems && (
                  <div className={`mt-1 ml-4 border-l-2 pl-2 space-y-1 ${highContrast ? "border-yellow-300/30" : "border-amber-200"}`}>
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.value}
                        onClick={() => {
                          handleSubItemClick(item.value, subItem.value);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                          highContrast 
                            ? "text-yellow-300 hover:bg-stone-800" 
                            : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
                        }`}
                      >
                        {lang === "en" ? subItem.labelEn : subItem.labelHi}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
