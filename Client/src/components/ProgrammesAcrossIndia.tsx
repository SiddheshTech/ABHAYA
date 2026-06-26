import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Search, 
  Users, 
  Layers, 
  Building, 
  CheckCircle2, 
  Download, 
  Globe, 
  ChevronRight, 
  Sparkles,
  Database
} from "lucide-react";
import { Language } from "../data/translations";

interface StateData {
  id: string;
  name: string;
  nameHi: string;
  capital: string;
  capitalHi: string;
  x: number; // Percent from left (0-100)
  y: number; // Percent from top (0-100)
  livesImpacted: number;
  projectsCount: number;
  districtsCovered: number;
  fieldUnits: number;
  initiatives: string[];
  initiativesHi: string[];
}

const STATES_DATA: StateData[] = [
  {
    id: "IN-DL",
    name: "Delhi NCR",
    nameHi: "दिल्ली एनसीआर",
    capital: "New Delhi",
    capitalHi: "नई दिल्ली",
    x: 41,
    y: 29,
    livesImpacted: 320000,
    projectsCount: 45,
    districtsCovered: 11,
    fieldUnits: 28,
    initiatives: [
      "Integrated Digital Child Tracking & Foster Linkage Hub",
      "Mobile Healthcare and Nutrition Units",
      "Urban Homeless Rehabilitation & Kinship Support Program"
    ],
    initiativesHi: [
      "एकीकृत डिजिटल बाल ट्रैकिंग और पालक संपर्क हब",
      "मोबाइल स्वास्थ्य सेवा और पोषण इकाइयाँ",
      "शहरी बेघर पुनर्वास और रिश्तेदारी सहायता कार्यक्रम"
    ]
  },
  {
    id: "IN-MH",
    name: "Maharashtra",
    nameHi: "महाराष्ट्र",
    capital: "Mumbai",
    capitalHi: "मुंबई",
    x: 32,
    y: 56,
    livesImpacted: 480000,
    projectsCount: 62,
    districtsCovered: 24,
    fieldUnits: 55,
    initiatives: [
      "Rural De-institutionalization & Kinship Care Initiative",
      "Community Foster Training Workshops across Distrcts",
      "Empowerment & Livelihood Training for Migrant Families"
    ],
    initiativesHi: [
      "ग्रामीण गैर-संस्थीकरण और रिश्तेदारी देखभाल पहल",
      "जिलों में सामुदायिक पालक प्रशिक्षण कार्यशालाएं",
      "प्रवासी परिवारों के लिए सशक्तिकरण और आजीविका प्रशिक्षण"
    ]
  },
  {
    id: "IN-KA",
    name: "Karnataka",
    nameHi: "कर्नाटक",
    capital: "Bengaluru",
    capitalHi: "बेंगलुरु",
    x: 38,
    y: 75,
    livesImpacted: 390000,
    projectsCount: 42,
    districtsCovered: 18,
    fieldUnits: 36,
    initiatives: [
      "Sponsorship & Care Support for Semi-Urban Children",
      "Digital Foster Matchmaking Platforms Integration",
      "Capacity Building for Child Welfare Committee (CWC)"
    ],
    initiativesHi: [
      "अर्द्ध-शहरी बच्चों के लिए प्रायोजन और देखभाल सहायता",
      "डिजिटल पालक मिलान प्लेटफार्मों का एकीकरण",
      "बाल कल्याण समिति (सीडब्ल्यूसी) के लिए क्षमता निर्माण"
    ]
  },
  {
    id: "IN-TN",
    name: "Tamil Nadu",
    nameHi: "तमिलनाडु",
    capital: "Chennai",
    capitalHi: "चेन्नई",
    x: 44,
    y: 81,
    livesImpacted: 350000,
    projectsCount: 38,
    districtsCovered: 15,
    fieldUnits: 30,
    initiatives: [
      "Coastal Community Child Protections Networks",
      "Formal Foster Placement Framework with local NGOs",
      "Primary Education Sponsorship and Healing Support"
    ],
    initiativesHi: [
      "तटीय सामुदायिक बाल संरक्षण नेटवर्क",
      "स्थानीय गैर सरकारी संगठनों के साथ औपचारिक पालक व्यवस्था ढांचा",
      "प्राथमिक शिक्षा प्रायोजन और चिकित्सा सहायता"
    ]
  },
  {
    id: "IN-UP",
    name: "Uttar Pradesh",
    nameHi: "उत्तर प्रदेश",
    capital: "Lucknow",
    capitalHi: "लखनऊ",
    x: 52,
    y: 33,
    livesImpacted: 650000,
    projectsCount: 88,
    districtsCovered: 42,
    fieldUnits: 104,
    initiatives: [
      "Sankalp - Village Child Rights & Foster Awareness Drives",
      "Kinship Care Subsidy Support Scheme",
      "Adoption-to-Foster Smooth Gateway Operations"
    ],
    initiativesHi: [
      "संकल्प - ग्राम बाल अधिकार और पालक जागरूकता अभियान",
      "रिश्तेदारी देखभाल उपदान सहायता योजना",
      "दत्तक-ग्रहण से पालक देखभाल सुचारू प्रवेश द्वार संचालन"
    ]
  },
  {
    id: "IN-WB",
    name: "West Bengal",
    nameHi: "पश्चिम बंगाल",
    capital: "Kolkata",
    capitalHi: "कोलकाता",
    x: 74,
    y: 44,
    livesImpacted: 290000,
    projectsCount: 31,
    districtsCovered: 12,
    fieldUnits: 25,
    initiatives: [
      "Re-entry & Kinship Reunification in Tea Estates",
      "Child Protection & Vigilance inside Slum Settlements",
      "State-wise Model Foster Parent Network Creation"
    ],
    initiativesHi: [
      "चाय बागानों में पुनः प्रवेश और रिश्तेदारी पुनर्मिलन",
      "मलिन बस्तियों के भीतर बाल संरक्षण और सतर्कता",
      "राज्य-वार मॉडल पालक माता-पिता नेटवर्क निर्माण"
    ]
  },
  {
    id: "IN-RJ",
    name: "Rajasthan",
    nameHi: "राजस्थान",
    capital: "Jaipur",
    capitalHi: "जयपुर",
    x: 29,
    y: 36,
    livesImpacted: 270000,
    projectsCount: 29,
    districtsCovered: 14,
    fieldUnits: 22,
    initiatives: [
      "Desert Region Child Welfare Committees Mobile Support",
      "Kinship Sponsorships for Orphaned Girls",
      "Anti-Child-Labour Rehabilitation Camps"
    ],
    initiativesHi: [
      "मरुस्थल क्षेत्र बाल कल्याण समितियों के लिए मोबाइल सहायता",
      "अनाथ बालिकाओं के लिए रिश्तेदारी प्रायोजन",
      "बाल श्रम विरोधी पुनर्वास शिविर"
    ]
  },
  {
    id: "IN-GJ",
    name: "Gujarat",
    nameHi: "गुजरात",
    capital: "Gandhinagar",
    capitalHi: "गांधीनगर",
    x: 18,
    y: 48,
    livesImpacted: 310000,
    projectsCount: 35,
    districtsCovered: 16,
    fieldUnits: 28,
    initiatives: [
      "Industrial Belt Child Care Protection Clinics",
      "Kinship Support & Skill Development Program for Foster Mothers",
      "Nourishment Schemes in Remote Tribal Pockets"
    ],
    initiativesHi: [
      "औद्योगिक क्षेत्र बाल गृह संरक्षण क्लीनिक",
      "पालक माताओं के लिए रिश्तेदारी सहायता और कौशल विकास कार्यक्रम",
      "दूरदराज के आदिवासी क्षेत्रों में पोषण योजनाएं"
    ]
  },
  {
    id: "IN-TG",
    name: "Telangana",
    nameHi: "तेलंगाना",
    capital: "Hyderabad",
    capitalHi: "हैदराबाद",
    x: 44,
    y: 62,
    livesImpacted: 260000,
    projectsCount: 28,
    districtsCovered: 10,
    fieldUnits: 20,
    initiatives: [
      "Sponsorship Schemes for Single-Mother Household Infants",
      "Tech-Enabled Kinship Identification and Verification Engine",
      "Pediatric Care Assistance & Institutional Backout Schemes"
    ],
    initiativesHi: [
      "एकल माता वाले परिवारों के शिशुओं के लिए प्रायोजन योजनाएं",
      "तकनीक-सक्षम रिश्तेदारी पहचान और सत्यापन इंजन",
      "बाल चिकित्सा देखभाल सहायता और संस्थागत समर्थन वापसी योजनाएं"
    ]
  },
  {
    id: "IN-BR",
    name: "Bihar",
    nameHi: "बिहार",
    capital: "Patna",
    capitalHi: "पटना",
    x: 64,
    y: 35,
    livesImpacted: 410000,
    projectsCount: 46,
    districtsCovered: 22,
    fieldUnits: 38,
    initiatives: [
      "Flood-Displaced Orphan Care and Foster Mapping",
      "Community Child Protection & Kinship Foster Forums",
      "Alternative Non-Institutional Care Policy Advocacy"
    ],
    initiativesHi: [
      "बाढ़-विस्थापित अनाथ बच्चों की देखभाल और पालक मानचित्रण",
      "सामुदायिक बाल संरक्षण और रिश्तेदारी पालक मंच",
      "वैकल्पिक गैर-संस्थागत देखभाल नीति वकालत"
    ]
  }
];

interface RegionData {
  id: string;
  name: string;
  nameHi: string;
  color: string;
  glowColor: string;
  points: string;
  totalLives: number;
  activeProjects: number;
  statesList: string[];
  highlights: string[];
  highlightsHi: string[];
}

const REGIONS_DATA: RegionData[] = [
  {
    id: "north",
    name: "North Region",
    nameHi: "उत्तरी क्षेत्र",
    color: "fill-blue-500/10 stroke-blue-500/40 hover:fill-blue-500/25 hover:stroke-blue-400",
    glowColor: "shadow-blue-500/50",
    points: "180,35 280,20 370,105 380,200 320,240 210,245 170,180",
    totalLives: 1240000,
    activeProjects: 162,
    statesList: ["IN-DL", "IN-UP", "IN-RJ"],
    highlights: [
      "Sankalp Foster Awareness campaigns covered 400+ remote villages",
      "Specialized Child Protection networks in desert and mountainous belts"
    ],
    highlightsHi: [
      "संकल्प पालक जागरूकता अभियानों ने 400+ दूरदराज के गांवों को कवर किया",
      "रेगिस्तानी और पहाड़ी क्षेत्रों में विशेष बाल संरक्षण नेटवर्क"
    ]
  },
  {
    id: "west",
    name: "West Region",
    nameHi: "पश्चिमी क्षेत्र",
    color: "fill-amber-500/10 stroke-amber-500/40 hover:fill-amber-500/25 hover:stroke-amber-400",
    glowColor: "shadow-amber-500/50",
    points: "75,245 170,230 210,245 190,345 140,390 65,335 50,275",
    totalLives: 790000,
    activeProjects: 97,
    statesList: ["IN-MH", "IN-GJ"],
    highlights: [
      "De-institutionalization support workshops in rural tribal clusters",
      "Industrial belt safety clinics Safeguarding migrant laborers' infants"
    ],
    highlightsHi: [
      "ग्रामीण जनजातीय समूहों में गैर-संस्थीकरण सहायता कार्यशालाएं",
      "प्रवासी श्रमिकों के शिशुओं की सुरक्षा के लिए औद्योगिक बेल्ट सुरक्षा क्लीनिक"
    ]
  },
  {
    id: "central",
    name: "Central Region",
    nameHi: "मध्य क्षेत्र",
    color: "fill-purple-500/10 stroke-purple-500/40 hover:fill-purple-500/25 hover:stroke-purple-400",
    glowColor: "shadow-purple-500/50",
    points: "210,245 320,240 340,310 310,370 210,375 190,345",
    totalLives: 560000,
    activeProjects: 65,
    statesList: [],
    highlights: [
      "Sponsorship matching platforms integrated with Child Welfare Committees (CWCs)",
      "Dedicated foster training panels in underserved districts"
    ],
    highlightsHi: [
      "बाल कल्याण समितियों (सीडब्ल्यूसी) के साथ एकीकृत प्रायोजन मिलान प्लेटफॉर्म",
      "कम सेवा वाले जिलों में समर्पित पालक प्रशिक्षण पैनल"
    ]
  },
  {
    id: "east",
    name: "East Region",
    nameHi: "पूर्वी क्षेत्र",
    color: "fill-emerald-500/10 stroke-emerald-500/40 hover:fill-emerald-500/25 hover:stroke-emerald-400",
    glowColor: "shadow-emerald-500/50",
    points: "320,240 405,240 435,290 375,370 310,370",
    totalLives: 700000,
    activeProjects: 77,
    statesList: ["IN-WB", "IN-BR"],
    highlights: [
      "Flood-displaced child care tracking system implemented in high-risk zones",
      "Tea estate kinship reunion networks supporting vulnerable families"
    ],
    highlightsHi: [
      "उच्च जोखिम वाले क्षेत्रों में लागू की गई बाढ़-विस्थापित बाल देखभाल ट्रैकिंग प्रणाली",
      "कमजोर परिवारों की सहायता करने वाले चाय बागान रिश्तेदारी पुनर्मिलन नेटवर्क"
    ]
  },
  {
    id: "south",
    name: "South Region",
    nameHi: "दक्षिणी क्षेत्र",
    color: "fill-indigo-500/10 stroke-indigo-500/40 hover:fill-indigo-500/25 hover:stroke-indigo-400",
    glowColor: "shadow-indigo-500/50",
    points: "190,345 310,370 300,455 250,545 190,505 160,420",
    totalLives: 1000000,
    activeProjects: 108,
    statesList: ["IN-KA", "IN-TN", "IN-TG"],
    highlights: [
      "Coastal community vigilance child protection safety hubs",
      "Formal foster matchmaking matching platforms for single parent systems"
    ],
    highlightsHi: [
      "तटीय सामुदायिक सतर्कता बाल संरक्षण सुरक्षा हब",
      "एकल अभिभावक प्रणालियों के लिए औपचारिक पालक मिलान मंच"
    ]
  },
  {
    id: "northeast",
    name: "Northeast Region",
    nameHi: "पूर्वोत्तर क्षेत्र",
    color: "fill-rose-500/10 stroke-rose-500/40 hover:fill-rose-500/25 hover:stroke-rose-400",
    glowColor: "shadow-rose-500/50",
    points: "405,215 475,215 490,250 445,300 405,280",
    totalLives: 320000,
    activeProjects: 40,
    statesList: [],
    highlights: [
      "Cross-border smuggling deterrence monitoring checkpoints",
      "Localized tribal kinship child care supports setup"
    ],
    highlightsHi: [
      "सीमा पार तस्करी निरोधक निगरानी चौकियां",
      "स्थानीयकृत आदिवासी रिश्तेदारी बाल देखभाल सहायता सेटअप"
    ]
  }
];

interface ProgrammesAcrossIndiaProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

export default function ProgrammesAcrossIndia({ lang, highContrast, textSize }: ProgrammesAcrossIndiaProps) {
  const [selectedState, setSelectedState] = useState<StateData>(STATES_DATA[1]); // Default to Maharashtra
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(REGIONS_DATA[1]); // Default to West Region
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [activeTab, setActiveTab] = useState<"state" | "region">("state");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCoverageFilter, setActiveCoverageFilter] = useState<"all" | "high" | "medium">("all");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all");

  const t = {
    title: lang === "en" ? "Programs & Impact Across India" : "भारत में कार्यक्रम और प्रभाव",
    subtitle: lang === "en" 
      ? "Interactive GIS Dashboard mapping region-wise and state-wise de-institutionalization progress, foster families, and lives impacted." 
      : "इंटरैक्टिव जीआईएस डैशबोर्ड क्षेत्रवार और राज्यवार गैर-संस्थीकरण प्रगति, पालक परिवारों और प्रभावित जीवनों का विवरण देता है।",
    searchPlaceholder: lang === "en" ? "Search states / UTs..." : "राज्यों / केंद्र शासित प्रदेशों को खोजें...",
    selectedStateHeader: lang === "en" ? "State Profile Dashboard" : "राज्य प्रोफ़ाइल डैशबोर्ड",
    selectedRegionHeader: lang === "en" ? "Regional Outreach Profile" : "क्षेत्रीय आउटरीच प्रोफ़ाइल",
    capitalLabel: lang === "en" ? "Operational Hub / Capital" : "परिचालन केंद्र / राजधानी",
    livesImpacted: lang === "en" ? "Lives Transformed" : "बदले गए जीवन",
    activeProjects: lang === "en" ? "Active Care Projects" : "सक्रिय बाल सुरक्षा परियोजनाएं",
    districtsCovered: lang === "en" ? "Districts Safeguarded" : "सुरक्षित किए गए जिले",
    fieldUnits: lang === "en" ? "Active Field Units" : "सक्रिय क्षेत्र इकाइयाँ",
    keyInitiatives: lang === "en" ? "Key Regional Initiatives" : "प्रमुख क्षेत्रीय पहलें",
    selectPrompt: lang === "en" ? "Tap a pulsing capital beacon on the map or select from the list below to explore data." : "डेटा देखने के लिए मानचित्र पर स्पंदित राजधानी बीकन को स्पर्श करें या नीचे दी गई सूची से चयन करें।",
    exportData: lang === "en" ? "Export State Impact CSV" : "राज्य प्रभाव डेटा निर्यात करें (CSV)",
    gisLive: lang === "en" ? "GEOSPATIAL GIS MAP DATA LIVE" : "भू-स्थानिक जीआईएस मानचित्र डेटा लाइव",
    legendTitle: lang === "en" ? "Map Legend" : "मानचित्र कुंजी",
    heavyFootprint: lang === "en" ? "High Footprint (>350k Lives)" : "उच्च प्रभाव (>3.5 लाख जीवन)",
    medFootprint: lang === "en" ? "Medium Footprint (<350k Lives)" : "मध्यम प्रभाव (<3.5 लाख जीवन)"
  };

  // Filter states based on search query, footprint category, and selected region
  const filteredStates = useMemo(() => {
    return STATES_DATA.filter(state => {
      const stateName = lang === "en" ? state.name.toLowerCase() : state.nameHi;
      const queryMatch = stateName.includes(searchQuery.toLowerCase());
      
      let regionMatch = true;
      if (selectedRegionId !== "all") {
        const regionObj = REGIONS_DATA.find(r => r.id === selectedRegionId);
        regionMatch = regionObj ? regionObj.statesList.includes(state.id) : true;
      }
      
      if (activeCoverageFilter === "all") return queryMatch && regionMatch;
      if (activeCoverageFilter === "high") return queryMatch && regionMatch && state.livesImpacted >= 350000;
      if (activeCoverageFilter === "medium") return queryMatch && regionMatch && state.livesImpacted < 350000;
      return queryMatch && regionMatch;
    });
  }, [searchQuery, activeCoverageFilter, selectedRegionId, lang]);

  const handleExportCSV = (state: StateData) => {
    const headers = "State,Capital,Lives Impacted,Active Projects,Districts Covered,Field Units\n";
    const row = `"${state.name}","${state.capital}",${state.livesImpacted},${state.projectsCount},${state.districtsCovered},${state.fieldUnits}\n`;
    
    const blob = new Blob([headers + row], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Kinship_Foster_Impact_${state.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section 
      id="gis-map-dashboard-section"
      className={`w-full py-16 transition-colors duration-200 border-t border-b ${
        highContrast 
          ? "bg-black text-yellow-300 border-yellow-300" 
          : "bg-[#0f172a] text-slate-100 border-[#1e293b]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                highContrast 
                  ? "bg-stone-900 border border-yellow-300 text-yellow-300" 
                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              }`}>
                <Database className="w-3.5 h-3.5 animate-pulse" />
                {t.gisLive}
              </span>
            </div>
            <h2 className={`font-sans tracking-tight leading-tight ${
              textSize === "large" ? "text-4xl" : textSize === "extra-large" ? "text-5xl" : "text-3xl md:text-4xl"
            } font-bold ${highContrast ? "text-yellow-300" : "text-white"}`}>
              {t.title}
            </h2>
            <p className={`mt-3 ${
              textSize === "large" ? "text-lg" : textSize === "extra-large" ? "text-xl" : "text-sm md:text-base"
            } ${highContrast ? "text-white" : "text-slate-400"}`}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* GIS Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Interactive Map Simulator Panel (7 Columns) */}
          <div className={`lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl relative shadow-2xl transition-colors duration-200 border ${
            highContrast 
              ? "bg-stone-950 border-yellow-300" 
              : "bg-slate-900/60 border-slate-800"
          }`}>
            
            {/* Map Dashboard Floating Controller */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 shadow-lg ${
                highContrast ? "bg-stone-900 border border-yellow-300 text-yellow-300" : "bg-slate-950/90 border border-slate-800 text-slate-300"
              }`}>
                <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
                <span>INDEXED: <strong className="text-white">{activeTab === "state" ? selectedState.name : selectedRegion.name}</strong></span>
              </div>
              
              {/* Tab Selector Buttons */}
              <div className={`flex rounded-lg p-0.5 border ${
                highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/80 border-slate-800"
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveTab("state")}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    activeTab === "state"
                      ? (highContrast ? "bg-yellow-300 text-black font-bold" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30")
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang === "en" ? "State View" : "राज्य दृश्य"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("region")}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    activeTab === "region"
                      ? (highContrast ? "bg-yellow-300 text-black font-bold" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30")
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lang === "en" ? "Region View" : "क्षेत्रीय दृश्य"}
                </button>
              </div>
            </div>

            {/* Simulated Interactive Vector Map Canvas of India */}
            <div className="w-full relative aspect-[4/5] max-w-[500px] mt-10 md:mt-4">
              
              {/* Interactive SVG Regions Layer Map */}
              <div className="w-full h-full absolute inset-0 z-0 flex items-center justify-center p-2">
                <svg className="w-full h-full max-h-[500px]" viewBox="0 0 500 600" fill="none">
                  {/* Outer map backdrop grid */}
                  <g className="opacity-10">
                    <circle cx="250" cy="300" r="220" className={highContrast ? "stroke-yellow-300" : "stroke-slate-800"} strokeWidth="1" strokeDasharray="5,5" />
                    <circle cx="250" cy="300" r="140" className={highContrast ? "stroke-yellow-300" : "stroke-slate-800"} strokeWidth="1" strokeDasharray="5,5" />
                  </g>

                  {/* Draw SVG Regions Polygons */}
                  <g className="transition-all duration-300">
                    {REGIONS_DATA.map((region) => {
                      const isSelected = selectedRegion.id === region.id;
                      const isHovered = hoveredRegion?.id === region.id;
                      
                      return (
                        <polygon
                          key={region.id}
                          points={region.points}
                          className={`cursor-pointer transition-all duration-300 stroke-[2] ${region.color} ${
                            isSelected 
                              ? (highContrast ? "fill-yellow-300/30 stroke-yellow-300 stroke-[3]" : "fill-cyan-500/25 stroke-cyan-400 stroke-[3.5]") 
                              : ""
                          }`}
                          onMouseEnter={() => setHoveredRegion(region)}
                          onMouseLeave={() => setHoveredRegion(null)}
                          onClick={() => {
                            setSelectedRegion(region);
                            setActiveTab("region");
                            setSelectedRegionId(region.id); // Filter the list to only states in this region!
                          }}
                        />
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Hand-drawn geographical visual backdrop representation of India */}
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none p-4 mix-blend-screen opacity-15">
                <div 
                  className={`w-[90%] h-[90%] transition-transform duration-300 object-contain ${
                    highContrast ? "invert" : ""
                  }`}
                  style={{
                    backgroundImage: `url('https://mapsicon.com/master/all/in/vector.svg')`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>

              {/* Hovered Regional Tooltip overlay inside the map area */}
              {hoveredRegion && (
                <div className={`absolute bottom-4 left-4 right-4 z-30 p-3 rounded-xl border shadow-2xl transition-all duration-300 pointer-events-none ${
                  highContrast ? "bg-black border-yellow-300 text-yellow-300" : "bg-slate-950/95 border-slate-800 text-white"
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{lang === "en" ? hoveredRegion.name : hoveredRegion.nameHi}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      highContrast ? "bg-stone-900 border border-yellow-300" : "bg-cyan-500/10 text-cyan-400"
                    }`}>
                      {lang === "en" ? "Interactive Region" : "इंटरैक्टिव क्षेत्र"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div>{lang === "en" ? "Lives Impacted" : "प्रभावित जीवन"}: <strong className="text-emerald-400">{hoveredRegion.totalLives.toLocaleString()}+</strong></div>
                    <div>{lang === "en" ? "Active Projects" : "सुरक्षित परियोजनाएं"}: <strong className="text-white">{hoveredRegion.activeProjects}</strong></div>
                  </div>
                  <div className="mt-1.5 text-[9px] text-slate-400 line-clamp-1">
                    {lang === "en" ? "Click to view regional outreach dashboard & filter states" : "क्षेत्रीय आउटरीच डैशबोर्ड और फ़िल्टर राज्य देखने के लिए क्लिक करें"}
                  </div>
                </div>
              )}

              {/* Plot the Beacons dynamically over the percentage grid */}
              {STATES_DATA.map((state) => {
                const isActive = selectedState.id === state.id;
                const isHeavy = state.livesImpacted >= 350000;

                return (
                  <button
                    key={state.id}
                    onClick={() => {
                      setSelectedState(state);
                      setActiveTab("state");
                      // Find parent region list
                      const parentRegion = REGIONS_DATA.find(r => r.statesList.includes(state.id));
                      if (parentRegion) {
                        setSelectedRegion(parentRegion);
                      }
                    }}
                    className="absolute group z-10 focus:outline-none transition-transform active:scale-90"
                    style={{ 
                      left: `${state.x}%`, 
                      top: `${state.y}%`,
                      transform: "translate(-50%, -50%)" 
                    }}
                    title={lang === "en" ? `${state.name} (${state.capital})` : state.nameHi}
                  >
                    {/* Pulsing Glow Rings */}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-60 ${
                        isActive 
                          ? (highContrast ? "bg-yellow-300" : "bg-cyan-500") 
                          : (isHeavy ? "bg-emerald-500" : "bg-[#f59e0b]")
                      }`} />
                    </span>

                    {/* Operational Core Bead Point */}
                    <span className={`relative flex h-4 w-4 rounded-full border-2 transition-all duration-300 shadow-md ${
                      isActive 
                        ? (highContrast ? "bg-black border-yellow-300 scale-125" : "bg-white border-cyan-400 scale-125 shadow-cyan-400/50") 
                        : (isHeavy 
                            ? (highContrast ? "bg-yellow-300 border-white" : "bg-emerald-500 border-slate-900 group-hover:scale-110") 
                            : (highContrast ? "bg-stone-500 border-white" : "bg-amber-500 border-slate-900 group-hover:scale-110"))
                    }`} />

                    {/* Tooltip Hover Overlay on State pins */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                      <div className={`px-2 py-1 rounded text-xs font-sans shadow-lg font-medium border flex flex-col leading-tight ${
                        highContrast 
                          ? "bg-black border-yellow-300 text-yellow-300" 
                          : "bg-slate-950 border-slate-800 text-white"
                      }`}>
                        <span>{lang === "en" ? state.name : state.nameHi}</span>
                        <span className="text-[10px] opacity-75">
                          {t.livesImpacted}: {state.livesImpacted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

            </div>

            {/* Map Legend Overlay Card */}
            <div className={`w-full mt-6 p-4 rounded-xl border flex flex-wrap gap-4 items-center justify-between text-xs font-sans ${
              highContrast ? "bg-stone-900/60 border-yellow-300" : "bg-slate-950/40 border-slate-800"
            }`}>
              <div className="font-semibold tracking-wider">{t.legendTitle}:</div>
              
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full border ${highContrast ? "bg-yellow-300 border-yellow-300" : "bg-cyan-500 border-cyan-400"}`} />
                <span className="opacity-85 font-medium">{lang === "en" ? "Currently Active Hub" : "वर्तमान सक्रिय केन्द"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-sm opacity-25 border ${highContrast ? "bg-yellow-300/30 border-yellow-300" : "bg-cyan-500/25 border-cyan-400"}`} />
                <span className="opacity-85">{lang === "en" ? "GIS Outreach Regions" : "जीआईएस पहुंच क्षेत्र"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full border ${highContrast ? "bg-stone-300 border-yellow-300" : "bg-emerald-500 border-emerald-400"}`} />
                <span className="opacity-85">{t.heavyFootprint}</span>
              </div>
            </div>

          </div>

          {/* RIGHT: High Fidelity State / Region Profile & Bento Data Card (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Selected State or Region profile card */}
            <AnimatePresence mode="wait">
              {activeTab === "state" ? (
                <motion.div
                  key={`state-${selectedState.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-colors duration-200 ${
                    highContrast 
                      ? "bg-black text-yellow-300 border-yellow-300" 
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  {/* Decorative ambient state badge inside bento */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`text-[10px] font-mono tracking-widest uppercase ${
                        highContrast ? "text-yellow-300" : "text-cyan-400"
                      }`}>
                        {t.selectedStateHeader}
                      </span>
                      <h3 className={`font-semibold tracking-tight ${
                        textSize === "large" ? "text-3xl" : textSize === "extra-large" ? "text-4xl" : "text-2xl"
                      } ${highContrast ? "text-yellow-300" : "text-white"}`}>
                        {lang === "en" ? selectedState.name : selectedState.nameHi}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                        <MapPin className={`w-3.5 h-3.5 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className={highContrast ? "text-white" : "text-slate-300"}>
                          {t.capitalLabel}: <strong>{lang === "en" ? selectedState.capital : selectedState.capitalHi}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExportCSV(selectedState)}
                      className={`p-2.5 rounded-lg border transition-all active:scale-95 flex items-center gap-2 text-xs font-medium cursor-pointer ${
                        highContrast 
                          ? "bg-stone-900 border-yellow-300 text-yellow-300 hover:bg-stone-850" 
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300"
                      }`}
                      title={t.exportData}
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">CSV</span>
                    </button>
                  </div>

                  {/* Quantitative Impact Bento Cells */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    
                    {/* Stat Cell 1: Lives Impacted */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className={`w-4 h-4 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className="text-[11px] font-medium tracking-wider uppercase">{t.livesImpacted}</span>
                      </div>
                      <div className={`mt-2 font-bold tracking-tight select-none ${
                          textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-lg md:text-xl"
                        } ${highContrast ? "text-yellow-300" : "text-emerald-400"}`}>
                          {selectedState.livesImpacted.toLocaleString()}+
                      </div>
                    </div>

                    {/* Stat Cell 2: Projects Count */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-2 text-slate-400">
                        <CheckCircle2 className={`w-4 h-4 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className="text-[11px] font-medium tracking-wider uppercase">{t.activeProjects}</span>
                      </div>
                      <div className={`mt-2 font-bold tracking-tight select-none ${
                          textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-lg md:text-xl"
                        } ${highContrast ? "text-yellow-300" : "text-white"}`}>
                          {selectedState.projectsCount}
                      </div>
                    </div>

                    {/* Stat Cell 3: Districts Covered */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Layers className={`w-4 h-4 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className="text-[11px] font-medium tracking-wider uppercase">{t.districtsCovered}</span>
                      </div>
                      <div className={`mt-2 font-bold tracking-tight select-none ${
                          textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-lg md:text-xl"
                        } ${highContrast ? "text-yellow-300" : "text-white"}`}>
                          {selectedState.districtsCovered}
                      </div>
                    </div>

                    {/* Stat Cell 4: Field Units */}
                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Building className={`w-4 h-4 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className="text-[11px] font-medium tracking-wider uppercase">{t.fieldUnits}</span>
                      </div>
                      <div className={`mt-2 font-bold tracking-tight select-none ${
                          textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-lg md:text-xl"
                        } ${highContrast ? "text-yellow-300" : "text-white"}`}>
                          {selectedState.fieldUnits}
                      </div>
                    </div>

                  </div>

                  {/* Key Initiatives Bullet list */}
                  <div className={`p-4 rounded-xl border ${
                    highContrast ? "bg-stone-950 border-yellow-300" : "bg-slate-950/40 border-slate-800"
                  }`}>
                    <h4 className="text-xs font-bold tracking-wider uppercase text-slate-300 mb-3 flex items-center gap-2">
                      <Sparkles className={`w-3.5 h-3.5 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                      {t.keyInitiatives}
                    </h4>
                    <ul className="space-y-3">
                      {(lang === "en" ? selectedState.initiatives : selectedState.initiativesHi).map((init, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 block shrink-0 ${highContrast ? "bg-yellow-300" : "bg-cyan-400"}`} />
                          <span className={highContrast ? "text-white" : "text-slate-300"}>{init}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key={`region-${selectedRegion.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-colors duration-200 ${
                    highContrast 
                      ? "bg-black text-yellow-300 border-yellow-300" 
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`text-[10px] font-mono tracking-widest uppercase ${
                        highContrast ? "text-yellow-300" : "text-indigo-400"
                      }`}>
                        {t.selectedRegionHeader}
                      </span>
                      <h3 className={`font-semibold tracking-tight ${
                        textSize === "large" ? "text-3xl" : textSize === "extra-large" ? "text-4xl" : "text-2xl"
                      } ${highContrast ? "text-yellow-300" : "text-white"}`}>
                        {lang === "en" ? selectedRegion.name : selectedRegion.nameHi}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                        <Globe className={`w-3.5 h-3.5 ${highContrast ? "text-yellow-300" : "text-indigo-400"}`} />
                        <span className={highContrast ? "text-white" : "text-slate-300"}>
                          {lang === "en" ? "ABHAYA Regional Hub" : "अभया क्षेत्रीय हब"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Impact Bento Cells for Regions */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    
                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className={`w-4 h-4 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className="text-[11px] font-medium tracking-wider uppercase">{lang === "en" ? "Regional Impact" : "क्षेत्रीय प्रभाव"}</span>
                      </div>
                      <div className={`mt-2 font-bold tracking-tight select-none ${
                        textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-lg md:text-xl"
                      } ${highContrast ? "text-yellow-300" : "text-emerald-400"}`}>
                        {selectedRegion.totalLives.toLocaleString()}+
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <div className="flex items-center gap-2 text-slate-400">
                        <CheckCircle2 className={`w-4 h-4 ${highContrast ? "text-yellow-300" : "text-cyan-400"}`} />
                        <span className="text-[11px] font-medium tracking-wider uppercase">{lang === "en" ? "Regional Projects" : "क्षेत्रीय योजनाएं"}</span>
                      </div>
                      <div className={`mt-2 font-bold tracking-tight select-none ${
                        textSize === "large" ? "text-2xl" : textSize === "extra-large" ? "text-3xl" : "text-lg md:text-xl"
                      } ${highContrast ? "text-yellow-300" : "text-white"}`}>
                        {selectedRegion.activeProjects}
                      </div>
                    </div>

                    {/* States Covered in Region display */}
                    <div className={`p-4 rounded-xl border col-span-2 ${
                      highContrast ? "bg-stone-900 border-yellow-300" : "bg-slate-950/50 border-slate-800/80"
                    }`}>
                      <span className="text-[11px] font-medium tracking-wider uppercase text-slate-400 block mb-2">
                        {lang === "en" ? "Indexed Key States" : "अनुक्रमित प्रमुख राज्य"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedRegion.statesList.length > 0 ? (
                          selectedRegion.statesList.map(stateId => {
                            const stObj = STATES_DATA.find(s => s.id === stateId);
                            if (!stObj) return null;
                            return (
                              <button
                                key={stateId}
                                type="button"
                                onClick={() => {
                                  setSelectedState(stObj);
                                  setActiveTab("state");
                                }}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                                  highContrast 
                                    ? "bg-stone-950 border-yellow-300 text-yellow-300 hover:bg-stone-900" 
                                    : "bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200"
                                }`}
                              >
                                {lang === "en" ? stObj.name : stObj.nameHi}
                              </button>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-400">{lang === "en" ? "Tribal & remote territory initiatives" : "आदिवासी और सुदूर क्षेत्र की पहलें"}</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Regional Key Outreach Initiatives */}
                  <div className={`p-4 rounded-xl border ${
                    highContrast ? "bg-stone-950 border-yellow-300" : "bg-slate-950/40 border-slate-800"
                  }`}>
                    <h4 className="text-xs font-bold tracking-wider uppercase text-slate-300 mb-3 flex items-center gap-2">
                      <Sparkles className={`w-3.5 h-3.5 ${highContrast ? "text-yellow-300" : "text-indigo-400"}`} />
                      {lang === "en" ? "Regional ABHAYA Achievements" : "क्षेत्रीय अभया उपलब्धियां"}
                    </h4>
                    <ul className="space-y-3">
                      {(lang === "en" ? selectedRegion.highlights : selectedRegion.highlightsHi).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 block shrink-0 ${highContrast ? "bg-yellow-300" : "bg-indigo-400"}`} />
                          <span className={highContrast ? "text-white" : "text-slate-300"}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* State Search & Picker Panel */}
            <div className={`p-5 rounded-2xl border shadow-lg ${
              highContrast ? "bg-stone-950 border-yellow-300" : "bg-slate-900/60 border-slate-800/80"
            }`}>
              
              {/* Filters header and search input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-2">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs transition-colors focus:ring-1 focus:outline-none ${
                      highContrast 
                        ? "bg-stone-900 text-yellow-300 border border-yellow-300 focus:ring-yellow-300" 
                        : "bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 focus:ring-cyan-500"
                    }`}
                  />
                </div>

                {/* Map state foot-print intensity picker */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveCoverageFilter("all")}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-medium border cursor-pointer ${
                      activeCoverageFilter === "all"
                        ? (highContrast ? "bg-yellow-300 text-black border-yellow-300" : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30")
                        : (highContrast ? "bg-stone-900 text-yellow-300 border-stone-800" : "bg-slate-950 text-slate-400 border-slate-900")
                    }`}
                  >
                    {lang === "en" ? "All" : "सभी"}
                  </button>

                  <button
                    onClick={() => setActiveCoverageFilter("high")}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-medium border cursor-pointer ${
                      activeCoverageFilter === "high"
                        ? (highContrast ? "bg-yellow-300 text-black border-yellow-300" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30")
                        : (highContrast ? "bg-stone-900 text-yellow-300 border-stone-800" : "bg-slate-950 text-slate-400 border-slate-900")
                    }`}
                  >
                    {lang === "en" ? "High" : "उच्च"}
                  </button>

                  <button
                    onClick={() => setActiveCoverageFilter("medium")}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-medium border cursor-pointer ${
                      activeCoverageFilter === "medium"
                        ? (highContrast ? "bg-yellow-300 text-black border-yellow-300" : "bg-amber-500/20 text-amber-400 border-amber-500/30")
                        : (highContrast ? "bg-stone-900 text-yellow-300 border-stone-800" : "bg-slate-950 text-slate-400 border-slate-900")
                    }`}
                  >
                    {lang === "en" ? "Med" : "मध्यम"}
                  </button>
                </div>
              </div>

              {/* Active Region filter pill */}
              {selectedRegionId !== "all" && (
                <div className="flex items-center gap-1.5 mb-3 px-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">{lang === "en" ? "Active Region:" : "सक्रिय क्षेत्र:"}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    highContrast ? "bg-stone-900 border-yellow-300 text-yellow-300" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                  }`}>
                    {REGIONS_DATA.find(r => r.id === selectedRegionId)?.name || selectedRegionId}
                    <button 
                      type="button"
                      className="hover:text-red-400 text-slate-400 transition-colors ml-1 cursor-pointer text-xs"
                      onClick={() => setSelectedRegionId("all")}
                      title="Clear Region Filter"
                    >
                      &times;
                    </button>
                  </span>
                </div>
              )}

              {/* State Scrolling Grid List */}
              <div className="max-h-52 overflow-y-auto pr-1 divide-y divide-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredStates.length > 0 ? (
                  filteredStates.map((state) => {
                    const active = selectedState.id === state.id;
                    return (
                      <button
                        key={state.id}
                        onClick={() => setSelectedState(state)}
                        className={`w-full py-3.5 px-3 flex items-center justify-between text-left transition-colors cursor-pointer rounded-lg ${
                          active 
                            ? (highContrast ? "bg-stone-900 text-yellow-100" : "bg-slate-950/60 text-white") 
                            : (highContrast ? "hover:bg-stone-900 text-white" : "hover:bg-slate-950/20 text-slate-300")
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            active 
                              ? (highContrast ? "bg-yellow-300 animate-pulse" : "bg-cyan-400 animate-pulse") 
                              : (state.livesImpacted >= 350000 ? "bg-emerald-500" : "bg-amber-500")
                          }`} />
                          <div>
                            <span className="text-xs font-semibold block leading-tight">
                              {lang === "en" ? state.name : state.nameHi}
                            </span>
                            <span className="text-[10px] opacity-70">
                              {lang === "en" ? "Capital" : "राजधानी"}: {lang === "en" ? state.capital : state.capitalHi}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono block">
                              {state.livesImpacted.toLocaleString()}
                            </span>
                            <span className="text-[9px] opacity-60 block leading-tight uppercase font-mono">
                              {lang === "en" ? "Lives" : "प्रभाव"}
                            </span>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${active ? "translate-x-1" : "opacity-40"}`} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 font-sans tracking-wide">
                    {lang === "en" ? "No states found matching filter" : "फिल्टर से मेल खाता कोई राज्य नहीं मिला"}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
