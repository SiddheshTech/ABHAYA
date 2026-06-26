import React, { useState } from "react";
import { Language } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, HelpCircle, Mail, Phone, Clock, FileText } from "lucide-react";

interface FaqsSectionProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

interface FaqItem {
  id: number;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
}

export default function FaqsSection({
  lang,
  highContrast,
  textSize,
}: FaqsSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const faqItems: FaqItem[] = [
    {
      id: 1,
      questionEn: "ARE THERE ANY TAX BENEFITS INVOLVED WHILE DONATING TO ABHAYA?",
      questionHi: "अभया (ABHAYA) को दान देते समय क्या कोई कर लाभ शामिल हैं?",
      answerEn: "Yes, all donations made to ABHAYA are eligible for a 50% tax exemption under Section 80G of the Income Tax Act, 1961. Upon successful transaction clearance, a digitally signed receipt along with the 80G tax certificate will be immediately dispatched to your registered email address.",
      answerHi: "हाँ, अभया (ABHAYA) को दिए गए सभी दान आयकर अधिनियम, 1961 की धारा 80जी के तहत 50% कर छूट के पात्र हैं। भुगतान पूरा होने के तुरंत बाद आपके पंजीकृत ईमेल पर एक डिजिटल हस्ताक्षरित रसीद और 80जी प्रमाण पत्र भेजा जाता है।"
    },
    {
      id: 2,
      questionEn: "WHAT IS THE PROCESS TO AVAIL TAX EXEMPTION CERTIFICATE?",
      questionHi: "कर छूट प्रमाण पत्र प्राप्त करने की प्रक्रिया क्या है?",
      answerEn: "The tax exemption certificate (Form 10BE) is automatically prepared and submitted by ABHAYA directly to the Income Tax Department at the end of the financial year. A verifiable soft copy is also emailed to you instantly so you can claim your deduction smoothly during tax filing.",
      answerHi: "आयकर विभाग के दिशानिर्देशों के तहत वित्तीय वर्ष के अंत में अभया (ABHAYA) द्वारा स्वतः कर छूट प्रमाण पत्र (फॉर्म 10BE) जारी किया जाता है। दानदाताओं की सुविधा के लिए डिजिटल कॉपी ईमेल पर भी तुरंत भेज दी जाती है।"
    },
    {
      id: 3,
      questionEn: "HOW CAN I DONATE ONLINE?",
      questionHi: "मैं ऑनलाइन दान कैसे कर सकता हूँ?",
      answerEn: "Online contributions are streamlined for ease and convenience. You can transact using secure UPI pathways (GPay, Paytm, PhonePe), net banking infrastructure, leading credit/debit card operators (Visa, Mastercard, RuPay), or secure corporate wire systems on our website portals.",
      answerHi: "ऑनलाइन योगदान अत्यंत सरल और सुरक्षित है। आप वेबसाइट के मुख्य दान पोर्टल पर जाकर यूपीआई (UPI), नेट बैंकिंग, या सभी प्रमुख डेबिट व क्रेडिट कार्ड का उपयोग करके सेकंडों में सुरक्षित दान कर सकते हैं।"
    },
    {
      id: 4,
      questionEn: "IS THERE ANY ADVANTAGE TO DONATING ONLINE?",
      questionHi: "ऑनलाइन दान करने का कोई विशेष लाभ है?",
      answerEn: "Online avenues allow for immediate receipt generation, and significantly mitigate administrative billing overhead. This ensures that the maximum proportion of your funds is directed straight to regional child-welfare schemes, health deployments, emergency nutritional support, and digital classrooms.",
      answerHi: "ऑनलाइन दान तुरंत संसाधित होकर सीधे राहत कार्यक्रमों में लग जाता है, जिससे लेखांकन और प्रशासनिक विलंब टल जाता है। इसके अलावा, इसकी सुरक्षित रसीदें और ऑडिट ट्रेल्स आपको रियल-टाइम सुरक्षा प्रदान करते हैं।"
    },
    {
      id: 5,
      questionEn: "IS IT SAFE TO GIVE MY CREDIT CARD DETAILS ONLINE?",
      questionHi: "क्या अपना क्रेडिट कार्ड विवरण ऑनलाइन देना सुरक्षित है?",
      answerEn: "Completely safe. Our platform is protected with advanced 256-bit Secure Sockets Layer (SSL) encryption architecture certified by globally recognized digital trust brands. All financial transactions comply thoroughly with the highest standards of Payment Card Industry Data Security Standards (PCI-DSS). We never archive your credentials on localized drives.",
      answerHi: "पूरी तरह सुरक्षित है। हमारा भुगतान प्रवेश द्वार विश्व-स्तरीय 256-बिट एसएसएल (SSL) सुरक्षा एन्क्रिप्शन से सुरक्षित है और पूरी तरह पीसीआई-डीएसएस (PCI-DSS) का अनुपालन करता है। आपकी वित्तीय साख कभी भी हमारे लोकल सर्वर पर संग्रहीत नहीं होती।"
    },
    {
      id: 6,
      questionEn: "HOW DO I CONTACT YOU REGARDING MY DONATION?",
      questionHi: "मैं अपने दान के संबंध में आपसे कैसे संपर्क करूँ?",
      answerEn: "For queries, support, or customized corporate CSR partnerships, you can easily connect with our dedicated Donor Care Division via mail at donor.relations@abhaya.org or dial our National Support helpline: 1800-102-1234 (Available Mon-Sat, 9:30 AM to 6:30 PM).",
      answerHi: "दान सहायता, सुधार या सीएसआर (CSR) साझेदारी के लिए आप हमारी हेल्पलाइन 1800-102-1234 पर कॉल कर सकते हैं (सोम-शनि सुबह 9:30 से शाम 6:30) या donor.relations@abhaya.org पर बेझिझक ईमेल भेज सकते हैं।"
    },
    {
      id: 7,
      questionEn: "IS IT COMPLICATED TO MAKE A DONATION ONLINE?",
      questionHi: "क्या ऑनलाइन दान करना जटिल है?",
      answerEn: "No, we have configured a frictionless user-interface. The transaction takes just three intuitive inputs: specify any tier of help amount, declare basic identity markers for tax benefit tracking, and authorize payment through your comfortable channel. It takes less than 50 seconds.",
      answerHi: "नहीं, हमारा दान पोर्टल अत्यंत सुगम है। केवल तीन आसान कदमों में दान पूर्ण होता है: अपनी पसंद की सहायता राशि चुनें, 80जी कर छूट प्राप्ति हेतु मूल विवरण भरें और मनचाहे चैनल से भुगतान को अधिकृत करें।"
    },
    {
      id: 8,
      questionEn: "HOW SAFE IS MY PERSONAL INFORMATION WITH ABHAYA?",
      questionHi: "अभया (ABHAYA) के पास मेरी व्यक्तिगत जानकारी कितनी सुरक्षित है?",
      answerEn: "We maintain absolute confidentiality in alignment with the Information Technology Rules and Digital Personal Data Protection Act. ABHAYA holds a strict zero-spam compliance policy. Your registration logs are never distributed, sold, or shared with external advertising agents or brokers.",
      answerHi: "आपकी संप्रभु जानकारी की सुरक्षा हमारी सर्वोच्च प्राथमिकता है। हम आईटी अधिनियम और व्यक्तिगत डेटा सुरक्षा कानून (DPDP) का सौ प्रतिशत अनुपालन करते हैं। हम तृतीय-पक्ष विज्ञापनदाताओं के साथ कभी भी दान दाता का विवरण साझा नहीं करते हैं।"
    }
  ];

  // Language based header strings
  const t = {
    en: {
      sectionTitle: "FAQs",
      taxBadge: "80G Certified tax deductions",
      supportDesk: "For urgent financial support queries, email us at support@abhaya.org",
      contactInfo: "Toll-Free Help Desk: 1800-102-1234",
    },
    hi: {
      sectionTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQs)",
      taxBadge: "80G प्रमाणित आयकर छूट",
      supportDesk: "वित्तीय प्रश्नोत्तरी सहायता के लिए ईमेल करें: support@abhaya.org",
      contactInfo: "राष्ट्रीय सहायता केंद्र: 1800-102-1234",
    }
  }[lang];

  // Font sizing responsive classes
  const headerSizeClass = textSize === "large" 
    ? "text-4xl md:text-5xl" 
    : textSize === "extra-large" 
    ? "text-5xl md:text-6xl" 
    : "text-[38px] md:text-[44px]";

  const questionSizeClass = textSize === "large" 
    ? "text-[14.5px] md:text-[15.5px]" 
    : textSize === "extra-large" 
    ? "text-[16px] md:text-[18px]" 
    : "text-[12.8px] md:text-[13.8px]";

  const answerSizeClass = textSize === "large" 
    ? "text-sm md:text-base" 
    : textSize === "extra-large" 
    ? "text-base md:text-lg" 
    : "text-[12.5px] md:text-[13.5px]";

  return (
    <section 
      id="faqs-section"
      className={`relative w-full overflow-hidden transition-colors duration-300 ${
        highContrast 
          ? "bg-black border-y-4 border-yellow-300 text-yellow-300" 
          : "bg-[#FFFFFF] text-slate-900"
      }`}
      style={{
        backgroundImage: highContrast 
          ? "radial-gradient(#F59E0B 1px, transparent 1.2px)" 
          : "radial-gradient(#E2E8F0 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px"
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12 xl:px-16 pt-16 pb-20 relative">
        
        {/* ========================================================= */}
        {/* LIGHT GRAY "???" GRAPHIC AT TOP RIGHT CORNER             */}
        {/* ========================================================= */}
        <div className="absolute right-6 md:right-16 top-6 md:top-10 opacity-30 select-none pointer-events-none">
          <svg 
            width="170" 
            height="90" 
            viewBox="0 0 170 90" 
            className={`${highContrast ? "stroke-yellow-300" : "stroke-slate-350"}`}
            fill="none" 
            strokeWidth="1.8"
          >
            {/* Outline Question Mark 1 */}
            <path d="M25,50 C18,30 38,20 48,32 C54,40 43,48 40,55 L40,62 M40,70 L40,72" />
            {/* Outline Question Mark 2 */}
            <path d="M75,50 C68,30 88,20 98,32 C104,40 93,48 90,55 L90,62 M90,70 L90,72" />
            {/* Outline Question Mark 3 */}
            <path d="M125,50 C118,30 138,20 148,32 C154,40 143,48 140,55 L140,62 M140,70 L140,72" />
            {/* Visual small box grid ticks as seen in the photo */}
            <rect x="36" y="78" width="8" height="8" strokeDasharray="2,2" />
            <rect x="86" y="78" width="8" height="8" strokeDasharray="2,2" />
            <rect x="136" y="78" width="8" height="8" strokeDasharray="2,2" />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: 2-COLUMN STRUCTURE                             */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          
          {/* LEFT: THE COHERENT QUESTION MARK INTEGRATED ARTWORK     */}
          <div className="lg:col-span-5 flex justify-center items-center h-full pt-10 lg:pt-4">
            
            {/* Interactive Vector Art of the Big Red Outline Question Mark */}
            <div className="relative w-full max-w-[340px] md:max-w-[420px] h-auto select-none">
              <svg 
                viewBox="0 0 380 430" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Thick double/outline stroke style that beautifully replicates the photo */}
                <g className={highContrast ? "stroke-yellow-300" : "stroke-[#D11E26]"}>
                  {/* The curve of the question mark */}
                  <path 
                    d="M60 150 C60 50, 320 50, 320 150 C320 230, 195 240, 195 320" 
                    strokeWidth="28" 
                    strokeLinecap="square"
                    className="fill-none"
                  />
                  {/* Gap for spacing the stem dot */}
                  <path 
                    d="M195 365 L195 430" 
                    strokeWidth="28" 
                    strokeLinecap="square"
                    className="fill-none"
                  />
                </g>
                
                {/* Decorative inner hollow element to make it same to same outline */}
                <g className="stroke-white" style={{ strokeWidth: "6" }}>
                  <path 
                    d="M60 150 C60 50, 320 50, 320 150 C320 230, 195 240, 195 320" 
                    strokeLinecap="square"
                    className="fill-none"
                  />
                  <path 
                    d="M195 365 L195 430" 
                    strokeLinecap="square"
                    className="fill-none"
                  />
                </g>
              </svg>

              {/* Little custom details hovering around the big question mark */}
              <div className="absolute top-[35%] left-[20%] w-3 h-3 bg-red-600 rounded-full animate-ping opacity-75 hidden md:block" />
            </div>

          </div>

          {/* RIGHT: THE DETAILED FAQs ACCORDION LIST                  */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
            
            <div>
              {/* Header Title: "FAQs" in Red with custom bold display styling */}
              <h2 
                className={`font-black tracking-tight font-sans text-left leading-none uppercase ${headerSizeClass} ${
                  highContrast ? "text-yellow-300" : "text-[#D11E26]"
                }`}
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
              >
                {t.sectionTitle}
              </h2>
              {/* Fine support tags */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className={`px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase rounded-md tracking-wider ${
                  highContrast 
                    ? "bg-yellow-300 text-black" 
                    : "bg-[#D11E26]/10 text-[#D11E26]"
                }`}>
                  {t.taxBadge}
                </span>
                <span className="text-[11.5px] text-gray-400 font-mono">
                  ABHAYA India Relief Corridor
                </span>
              </div>
            </div>

            {/* Accordion Questions loop */}
            <div className="space-y-4">
              {faqItems.map((item) => {
                const isExpanded = expandedId === item.id;
                const questionText = lang === "en" ? item.questionEn : item.questionHi;
                const answerText = lang === "en" ? item.answerEn : item.answerHi;

                return (
                  <div 
                    key={item.id}
                    className={`border-b transition-all duration-300 ${
                      highContrast 
                        ? "border-yellow-300 bg-stone-950 text-yellow-300" 
                        : "border-gray-200/90 hover:bg-slate-50/50"
                    } ${isExpanded ? "pb-4" : "pb-3"}`}
                  >
                    {/* Trigger Button with + sign */}
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="w-full flex items-start gap-4 text-left py-2.5 group cursor-pointer focus:outline-hidden"
                      aria-expanded={isExpanded}
                    >
                      {/* Plus icon exactly as styled in the screenshot */}
                      <span className="shrink-0 mt-1 transition-transform duration-300">
                        {isExpanded ? (
                          <span className={`text-[19px] md:text-[21px] font-black ${
                            highContrast ? "text-yellow-300" : "text-[#D11E26]"
                          }`}>
                            −
                          </span>
                        ) : (
                          <span className={`text-[18px] md:text-[20px] font-black group-hover:scale-110 block transition-transform ${
                            highContrast ? "text-yellow-300" : "text-[#D11E26]"
                          }`}>
                            +
                          </span>
                        )}
                      </span>

                      {/* Question Content */}
                      <span 
                        className={`font-extrabold tracking-wide font-sans leading-relaxed transition-colors ${questionSizeClass} ${
                          isExpanded 
                            ? highContrast ? "text-yellow-400" : "text-[#D11E26]"
                            : highContrast ? "text-yellow-101" : "text-stone-900 group-hover:text-stone-950"
                        }`}
                      >
                        {questionText}
                      </span>
                    </button>

                    {/* Animated Collapsible Answer Block */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden pl-8"
                        >
                          <div className={`mt-2 font-sans leading-relaxed text-left max-w-2xl ${answerSizeClass} ${
                            highContrast ? "text-yellow-200" : "text-slate-600"
                          }`}>
                            <p>{answerText}</p>
                            
                            {/* Decorative call to action suggestions or quick badges to look premium */}
                            {item.id === 6 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <a 
                                  href="mailto:donor.relations@abhaya.org"
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 transition-colors"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email Support</span>
                                </a>
                                <a 
                                  href="tel:18001021234"
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-gray-800 rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Call Helpline</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Quick Helper micro contact details on bottom */}
            <div className={`pt-6 border-t ${highContrast ? "border-yellow-300" : "border-gray-200/50"} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left`}>
              <p className="text-[11.5px] text-gray-400 font-sans leading-tight">
                {t.supportDesk}
              </p>
              <span className={`text-[12px] font-mono font-bold tracking-wider ${
                highContrast ? "text-yellow-101" : "text-[#D11E26]"
              }`}>
                {t.contactInfo}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* THICK SOLID HORIZONTAL RED BAR LINKED AT THE BOTTOM      */}
      {/* ========================================================= */}
      <div 
        className={`w-full h-2.5 md:h-3.5 ${
          highContrast ? "bg-yellow-300" : "bg-[#D11E26]"
        }`} 
      />

    </section>
  );
}
