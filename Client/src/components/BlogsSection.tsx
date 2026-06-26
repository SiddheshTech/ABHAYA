import React, { useState } from "react";
import { Language } from "../data/translations";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, ChevronRight, User, X, Clock, BookOpen, Share2, Check } from "lucide-react";

interface BlogsSectionProps {
  lang: Language;
  highContrast: boolean;
  textSize: "normal" | "large" | "extra-large";
}

interface BlogPost {
  id: string;
  imgUrl: string;
  titleEn: string;
  titleHi: string;
  excerptEn: string;
  excerptHi: string;
  fullContentEn: string;
  fullContentHi: string;
  publishDateEn: string;
  publishDateHi: string;
  tagEn: string;
  tagHi: string;
  authorEn: string;
  authorHi: string;
  readTime: string;
}

export default function BlogsSection({ lang, highContrast, textSize }: BlogsSectionProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Translations
  const t = {
    sectionTitle: lang === "en" ? "BLOGS" : "ब्लॉग",
    subtitle: lang === "en" ? (
      <>
        The ABHAYA blog brings to life how we are undeterred to India's commitment to child welfare, <span className="underline decoration-1 cursor-pointer hover:text-[#e31d23]">child protection</span>, and empowerment. It provides a glimpse into the stories of children who have seen their lives transform and communities uplifted. These narratives will help readers learn how you can contribute to creating bright futures.
      </>
    ) : (
      <>
        अभया (ABHAYA) ब्लॉग इस बात को जीवंत करता है कि हम बाल कल्याण, <span className="underline decoration-1 cursor-pointer hover:text-yellow-300">बाल संरक्षण</span> और सशक्तिकरण के प्रति भारत की प्रतिबद्धता के लिए कैसे अडिग हैं। यह उन बच्चों की कहानियों की झलक प्रदान करता है जिन्होंने अपने जीवन को बदलते और समुदायों को ऊपर उठते देखा है। ये कहानियाँ पाठकों को यह समझने में मदद करेंगी कि आप उज्ज्वल भविष्य बनाने में कैसे योगदान दे सकते हैं।
      </>
    ),
    searchPlaceholder: lang === "en" ? "Search blog posts..." : "ब्लॉग पोस्ट खोजें...",
    allTags: lang === "en" ? "All Stories" : "सभी कहानियाँ",
    readFull: lang === "en" ? "Read Full Article" : "पूरा लेख पढ़ें",
    closeBtn: lang === "en" ? "Back to Blogs" : "ब्लॉग पर वापस जाएं",
    writtenBy: lang === "en" ? "Written by:" : "लेखक:",
    duration: lang === "en" ? "Read Time" : "पढ़ने का समय",
    shared: lang === "en" ? "Link Copied!" : "लिंक कॉपी किया गया!",
    share: lang === "en" ? "Share Story" : "कहानी साझा करें"
  };

  const blogPosts: BlogPost[] = [
    {
      id: "csr_meaning",
      imgUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "What Is Corporate Social Responsibility? Meaning, Importance And Impact In India",
      titleHi: "कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) क्या है? भारत में अर्थ, महत्व और प्रभाव",
      excerptEn: "Understanding what corporate social responsibility entails is the first step toward collaborative nation-building. Through strategic CSR sponsorships, private entities and NGOs join hands to establish safe shelters, nutritional support networks, and modernized digital schools for rural development.",
      excerptHi: "कॉर्पोरेट सामाजिक उत्तरदायित्व में क्या शामिल है, इसे समझना सहयोगी राष्ट्र-निर्माण की दिशा में पहला कदम है। रणनीतिक सीएसआर प्रायोजनों के माध्यम से, निजी संस्थाएं और गैर सरकारी संगठन ग्रामीण विकास के लिए सुरक्षित आश्रय, पोषण सहायता नेटवर्क और आधुनिक डिजिटल स्कूल स्थापित करने के लिए हाथ मिलाते हैं।",
      fullContentEn: "Corporate Social Responsibility (CSR) in India has transitioned from volunteer philanthropy to a regulated, strategic framework under the Companies Act. This vital legislation mandates qualified businesses to invest a portion of their profits into addressing critical developmental deficits. ABHAYA serves as a trusted implementation partner, channeling corporate grants into deep-impact child defense networks, emergency flood responses, and robust early literacy setups across marginalized municipal neighborhoods. By aligning corporate values with grassroots realities, we don't just solve immediate hardships; we design sustainable, multi-generational change.",
      fullContentHi: "भारत में कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) कंपनी अधिनियम के तहत स्वैच्छिक परोपकार से एक विनियमित, रणनीतिक ढांचे में परिवर्तित हो गया है। यह महत्वपूर्ण कानून योग्य व्यवसायों के लिए अपने मुनाफे का एक हिस्सा महत्वपूर्ण विकासात्मक कमियों को दूर करने में निवेश करना अनिवार्य बनाता है। अभया (ABHAYA) एक विश्वसनीय कार्यान्वयन भागीदार के रूप में कार्य करता है, कॉर्पोरेट अनुदानों को गहरे प्रभाव वाले बाल संरक्षण नेटवर्क, आपातकालीन बाढ़ प्रतिक्रियाओं और हाशिए पर मौजूद नगरपालिका पड़ोस में मजबूत प्रारंभिक साक्षरता सेटअप में दिशा देता है।",
      publishDateEn: "June 14, 2026",
      publishDateHi: "14 जून, 2026",
      tagEn: "CSR Support",
      tagHi: "सीएसआर सहायता",
      authorEn: "CSR Strategy Desk",
      authorHi: "सीएसआर रणनीति डेस्क",
      readTime: "5 min"
    },
    {
      id: "ngo_how_works",
      imgUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "Non-Profit Organisation In India — How It Works And Why It Matters",
      titleHi: "भारत में गैर-लाभकारी संगठन — यह कैसे काम करता है और क्यों मायने रखता है",
      excerptEn: "In India, non-profit organisations play an indispensable role in supporting communities, bridging regulatory gaps, and establishing critical welfare checkpoints. By mobilizing public support and field resources, NGOs create structural safety nets safeguarding infants' basic rights.",
      excerptHi: "भारत में, गैर-लाभकारी संगठन समुदायों का समर्थन करने, नियामक अंतरालों को पाटने और महत्वपूर्ण कल्याणकारी चौकियों की स्थापना करने में एक अनिवार्य भूमिका निभाते हैं। जनसमर्थन और मैदानी संसाधनों को जुटाकर, गैर-सरकारी संगठन शिशुओं के मौलिक अधिकारों की रक्षा करने वाले सुरक्षा कवच बनाते हैं।",
      fullContentEn: "NGOs function as vital intermediaries between government policy and local implementation. Operating on the frontlines of developmental challenges, organizations like ABHAYA translate complex constitutional goals—such as the Right to Education or Child Protection Acts—into digestible daily safeguards. We deploy trained social workers, coordinate with district authorities, and set up temporary shelter homes. This systematic approach ensures that public welfare models don't just remain administrative documents, but actively protect the children who need them most.",
      fullContentHi: "एनजीओ सरकारी नीति और स्थानीय कार्यान्वयन के बीच महत्वपूर्ण मध्यस्थ के रूप में कार्य करते हैं। विकास संबंधी चुनौतियों के मोर्चे पर काम करते हुए, अभया (ABHAYA) जैसे संगठन जटिल संवैधानिक लक्ष्यों—जैसे शिक्षा का अधिकार या बाल संरक्षण अधिनियम—को सुपाच्य दैनिक सुरक्षा उपायों में बदलते हैं। हम प्रशिक्षित सामाजिक कार्यकर्ताओं को तैनात करते हैं, जिला अधिकारियों के साथ समन्वय करते हैं, और अस्थायी आश्रय गृह स्थापित करते हैं।",
      publishDateEn: "May 29, 2026",
      publishDateHi: "29 मई, 2026",
      tagEn: "Welfare",
      tagHi: "कल्याण",
      authorEn: "Advocacy Team",
      authorHi: "वकालत टीम",
      readTime: "4 min"
    },
    {
      id: "birthday_giving",
      imgUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "Donate On Your Birthday — How To Turn Your Special Day Into Social Impact",
      titleHi: "अपने जन्मदिन पर दान करें — अपने विशेष दिन को सामाजिक प्रभाव में कैसे बदलें",
      excerptEn: "Birthdays are often associated with celebrations, parties and gift-giving, but they can be transformed into a powerful catalyst for human dignity. Creating a custom fundraising campaign or setting aside birthday proceeds directly feeds hungry infants and shelters orphans.",
      excerptHi: "जन्मदिन अक्सर जश्न, पार्टियों और उपहार देने से जुड़े होते हैं, लेकिन उन्हें मानवीय गरिमा के लिए एक शक्तिशाली उत्प्रेरक में बदला जा सकता है। एक अनुकूलित धन संचय अभियान बनाकर या अपने विशेष दिन को समाज सेवा के लिए समर्पित कर हम अनाथों को आश्रय दे सकते हैं।",
      fullContentEn: "Pledge your birthday to safeguard India's children! Instead of traditional physical presents, inviting friends, colleagues, and family members to chip into child-protection projects can provide dry ration kits, customized school desk tables, or winter jerseys to marginalized clusters. Every rupee generated on your milestone day bypasses intermediate barriers and supports active, vetted campaigns instantly. This creates a legacy of compassion that outlasts transient paper decorations, giving a child the gift of a safe, nurtured future.",
      fullContentHi: "भारत के बच्चों की सुरक्षा के लिए अपने जन्मदिन को समर्पित करें! पारंपरिक भौतिक उपहारों के बजाय, दोस्तों, सहयोगियों और परिवार के सदस्यों को बाल-संरक्षण परियोजनाओं में योगदान करने के लिए आमंत्रित करना सूखा राशन किट, अनुकूलित स्कूल डेस्क टेबल, या हाशिए पर मौजूद समूहों को सर्दियों के स्वेटर प्रदान कर सकता है।",
      publishDateEn: "April 18, 2026",
      publishDateHi: "18 अप्रैल, 2026",
      tagEn: "Giving Ideas",
      tagHi: "दान विचार",
      authorEn: "Community Engagement",
      authorHi: "सामुदायिक जुड़ाव",
      readTime: "3 min"
    },
    {
      id: "digital_donation",
      imgUrl: "https://images.unsplash.com/photo-1598331668826-20cefb595b7a?auto=format&fit=crop&q=80&w=700&h=480",
      titleEn: "Digital Ways To Donate And Support NGOs From Anywhere",
      titleHi: "कहीं से भी गैर सरकारी संगठनों को दान और समर्थन देने के डिजिटल तरीके",
      excerptEn: "Online giving has transformed the way people support social causes across India. Integrated payment channels, secure mobile banking, and instant tax certificate generation have cleared friction, letting you protect lives with a single, quick tap from anywhere on earth.",
      excerptHi: "ऑनलाइन दान ने भारत भर में सामाजिक कारणों का समर्थन करने के तरीके को बदल दिया है। एकीकृत भुगतान चैनल, सुरक्षित मोबाइल बैंकिंग और तत्काल कर प्रमाण पत्र सृजन ने किसी भी स्थान से एक त्वरित क्लिक के साथ जीवनों की रक्षा करना आसान बना दिया है।",
      fullContentEn: "Digital technology has bridged geographical separations, uniting global donors with urgent welfare missions instantly. Through encrypted payment Gateways, automated recurring subscription pledges, or corporate matching platforms, you can directly sponsor vital child-welfare activities. Digital transactions also offer complete financial transparency, triggering immediate 80G tax receipts and detailed email progress notifications so you always know exactly which district and project your digital funds are strengthening.",
      fullContentHi: "डिजिटल तकनीक ने भौगोलिक दूरियों को पाट दिया है, जिससे वैश्विक दानदाता तत्काल आवश्यक कल्याणकारी मिशनों से जुड़ रहे हैं। एन्क्रिप्टेड भुगतान गेटवे, स्वचालित आवर्ती सदस्यता संकल्पों, या कॉर्पोरेट मिलान प्लेटफार्मों के माध्यम से, आप सीधे महत्वपूर्ण बाल-कल्याण गतिविधियों को प्रायोजित कर सकते हैं।",
      publishDateEn: "March 05, 2026",
      publishDateHi: "05 मार्च, 2026",
      tagEn: "Donation Tech",
      tagHi: "दान तकनीक",
      authorEn: "Digital Innovation Unit",
      authorHi: "डिजिटल अनुसंधान इकाई",
      readTime: "4 min"
    }
  ];

  const categories = ["all", "CSR Support", "Welfare", "Giving Ideas", "Donation Tech"];

  const filteredPosts = blogPosts.filter(post => {
    const postTitle = lang === "en" ? post.titleEn.toLowerCase() : post.titleHi;
    const postTag = post.tagEn;
    const matchesSearch = postTitle.includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === "all" || postTag === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}#blog-${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 xl:px-12 flex flex-col items-center">
      
      {/* 1. White Header Section mimicking home page block layout perfectly */}
      <div className="w-full max-w-7xl mx-auto text-center space-y-4 mb-10">
        <h2 
          className={`font-black tracking-tight text-center transition-all ${
            textSize === "large" 
              ? "text-3xl md:text-4.5xl" 
              : textSize === "extra-large" 
              ? "text-4xl md:text-5xl" 
              : "text-2xl md:text-[34px] md:leading-10"
          } ${highContrast ? "text-yellow-600 font-extrabold" : "text-[#D11E26]"}`}
          id="blogs-main-heading"
        >
          {t.sectionTitle}
        </h2>
        
        <p 
          className={`max-w-6xl mx-auto leading-relaxed text-center font-sans ${
            textSize === "large" 
              ? "text-lg" 
              : textSize === "extra-large" 
              ? "text-xl" 
              : "text-xs md:text-[14.5px] text-[#27272a]"
          } ${highContrast ? "text-white" : "text-[#111827]"}`}
        >
          {t.subtitle}
        </p>

        {/* 2. Enhanced Filter & Interactive Search Track */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-6 max-w-6xl mx-auto">
          {/* Quick Tags row */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? (highContrast ? "bg-yellow-300 border-yellow-300 text-black font-black" : "bg-[#D11E26] border-[#D11E26] text-white shadow-xs")
                      : (highContrast ? "border-stone-800 hover:bg-stone-900 text-yellow-100" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  {cat === "all" ? t.allTags : cat}
                </button>
              );
            })}
          </div>

          {/* Search box overlay */}
          <div className="relative w-full md:w-64 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs font-medium outline-hidden border transition-all ${
                highContrast 
                  ? "bg-black border-yellow-300 text-yellow-300 focus:ring-1 focus:ring-yellow-300" 
                  : "bg-slate-50 border-slate-200 focus:border-slate-400 focus:bg-white text-slate-800"
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4 Cards Grid - same to same layout from the screenshot (fully wide responsive grid) */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {filteredPosts.map((post) => (
          <article 
            key={post.id}
            onClick={() => setSelectedBlog(post)}
            className={`flex flex-col group rounded-[25px] overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
              highContrast 
                ? "bg-black text-yellow-300 border-yellow-300" 
                : "bg-white border-slate-100/90"
            }`}
          >
            {/* Top rounded image container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[25px] m-1">
              <img 
                src={post.imgUrl} 
                alt={lang === "en" ? post.titleEn : post.titleHi}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Category tag */}
              <span className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                highContrast 
                  ? "bg-yellow-300 text-black border border-yellow-300" 
                  : "bg-black/75 text-white backdrop-blur-xs"
              }`}>
                {lang === "en" ? post.tagEn : post.tagHi}
              </span>
            </div>

            {/* Content info */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                {/* Meta Row */}
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-red-500" />
                    {lang === "en" ? post.publishDateEn : post.publishDateHi}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 
                  className={`font-extrabold tracking-tight mb-2.5 leading-snug group-hover:underline transition-colors ${
                    textSize === "large" 
                      ? "text-base md:text-lg" 
                      : textSize === "extra-large" 
                      ? "text-lg md:text-xl" 
                      : "text-sm md:text-[14.5px]"
                  } ${highContrast ? "text-yellow-300 font-black" : "text-[#D11E26]"}`}
                >
                  {lang === "en" ? post.titleEn : post.titleHi}
                </h3>
              </div>

              {/* Excerpt text in elegant dark font */}
              <p 
                className={`line-clamp-3 mb-4 leading-relaxed font-sans ${
                  textSize === "large" 
                    ? "text-sm" 
                    : textSize === "extra-large" 
                    ? "text-base" 
                    : "text-[12.5px] text-[#475569]"
                } ${highContrast ? "text-white" : ""}`}
              >
                {lang === "en" ? post.excerptEn : post.excerptHi}
              </p>

              {/* Action indicators */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  highContrast ? "text-yellow-300" : "text-[#D11E26]"
                }`}>
                  {t.readFull} <ChevronRight className="w-3 h-3" />
                </span>
                
                <button
                  type="button"
                  onClick={(e) => handleShare(post.id, e)}
                  className={`p-1.5 rounded-lg border hover:bg-slate-50 transition-colors ${
                    highContrast ? "border-yellow-300 text-yellow-300" : "border-slate-200 text-slate-500"
                  }`}
                  title={t.share}
                >
                  {copiedId === post.id ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Share2 className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

          </article>
        ))}
      </div>

      {/* FULLY DETAILED READING DIALOG BOX */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
              onClick={() => setSelectedBlog(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl z-10 ${
                highContrast ? "bg-black border-yellow-300 text-yellow-300" : "bg-white text-slate-900 border-slate-100"
              }`}
            >
              {/* Cover Banner Image with full width and height */}
              <div className="relative h-64 md:h-80 w-full">
                <img 
                  src={selectedBlog.imgUrl} 
                  alt={lang === "en" ? selectedBlog.titleEn : selectedBlog.titleHi}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual shade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Floating tags */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-red-600 text-white shadow-sm mb-3 inline-block">
                    {lang === "en" ? selectedBlog.tagEn : selectedBlog.tagHi}
                  </span>
                  <h3 className="font-extrabold text-lg md:text-2xl text-white tracking-tight leading-tight mb-2">
                    {lang === "en" ? selectedBlog.titleEn : selectedBlog.titleHi}
                  </h3>
                </div>

                {/* Close Button overlay */}
                <button 
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Close Dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Text portion */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Metadata details row */}
                <div className={`flex flex-wrap gap-4 items-center text-[11px] font-mono border-b pb-4 ${
                  highContrast ? "border-yellow-300/40" : "border-slate-100"
                }`}>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>{t.writtenBy}</strong> {lang === "en" ? selectedBlog.authorEn : selectedBlog.authorHi}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    {lang === "en" ? selectedBlog.publishDateEn : selectedBlog.publishDateHi}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <strong>{t.duration}:</strong> {selectedBlog.readTime}
                  </span>
                </div>

                {/* Fully translated article content blocks */}
                <div className="space-y-4">
                  {/* Lead excerpt focus highlighted paragraph */}
                  <p className={`font-medium tracking-tight border-l-4 pl-4 font-sans text-sm md:text-base leading-relaxed ${
                    highContrast 
                      ? "border-yellow-300" 
                      : "border-red-500 text-slate-700 bg-slate-50/50 py-1"
                  }`}>
                    {lang === "en" ? selectedBlog.excerptEn : selectedBlog.excerptHi}
                  </p>

                  <p className={`font-sans leading-relaxed text-xs md:text-sm ${
                    highContrast ? "text-white" : "text-slate-600"
                  }`}>
                    {lang === "en" ? selectedBlog.fullContentEn : selectedBlog.fullContentHi}
                  </p>

                  <p className={`font-sans leading-relaxed text-xs md:text-sm ${
                    highContrast ? "text-white" : "text-slate-600"
                  }`}>
                    {lang === "en" 
                      ? "By continuing to read our journals, corporate teams and public citizens gain transparency into the strategic pipeline that handles direct child safety operations. We stand alongside local institutions to scale our foster networks and promote structural reform."
                      : "हमारे पत्रिकाओं को पढ़ना जारी रखकर, कॉर्पोरेट टीमें और सामान्य नागरिक उस रणनीतिक पाइपलाइन में पारदर्शिता हासिल करते हैं जो सीधे बाल सुरक्षा कार्यों को संभालती है। हम अपने पालक नेटवर्क को बढ़ाने और संरचनात्मक सुधार को बढ़ावा देने के लिए स्थानीय संस्थानों के साथ खड़े हैं।"}
                  </p>
                </div>

                {/* Footer buttons of details dialog */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6">
                  {/* Social share actions inside lightbox */}
                  <button
                    type="button"
                    onClick={(e) => handleShare(selectedBlog.id, e)}
                    className={`px-4 py-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      highContrast 
                        ? "border-yellow-300 text-yellow-300 hover:bg-stone-900" 
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#D11E26]" />
                    {copiedId === selectedBlog.id ? t.shared : t.share}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedBlog(null)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                      highContrast 
                        ? "bg-yellow-300 text-black hover:bg-yellow-400" 
                        : "bg-[#D11E26] text-white hover:bg-[#b0161d]"
                    }`}
                  >
                    {t.closeBtn}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
