import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, BookOpen, MessageSquare, PhoneCall, HelpCircle, 
  FileText, ArrowRight, ChevronDown, CheckCircle2, AlertTriangle,
  Upload, PlayCircle, Lightbulb, Clock, Ticket, Lock, X, Play, Pause,
  Volume2, Trash2, Heart, RefreshCw, Send, Loader2, Star, Printer,
  VolumeX, Copy, Check, ShieldAlert, Phone, Users, Activity, Cpu, FileCheck, Map
} from 'lucide-react';

interface HelpPageProps {
  highContrast?: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  icon: any;
  content: string;
  steps: string[];
}

interface TicketRecord {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: "Open" | "Investigating" | "Resolved";
  created: string;
  messages: { sender: string; text: string; time: string }[];
}

export default function HelpPage({ highContrast, showToast }: HelpPageProps) {
  // Navigation & View Tabs
  const [activeTab, setActiveTab] = useState("Documentation");
  
  // Theme & Styles
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900 dark:text-stone-100";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white dark:bg-stone-900 border-gray-100 dark:border-stone-800";
  const textSecondary = highContrast ? "text-gray-400" : "text-gray-500 dark:text-stone-400";
  const borderClass = highContrast ? "border-stone-800" : "border-gray-200 dark:border-stone-800";

  // 1. Search Engine state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(["Aadhaar Match Protocol", "Malnutrition Recovery Plan", "Shelter API Limits"]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // 2. Knowledge Base & Reader View States
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [readerFontSize, setReaderFontSize] = useState("text-sm");
  const [isCopied, setIsCopied] = useState(false);

  // 3. FAQs and Bookmark states
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("All");
  const [bookmarkedFaqs, setBookmarkedFaqs] = useState<number[]>([]);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  // 4. Video Tutorial & Progress States
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string; length: string } | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // 0-100
  const [videoCompleted, setVideoCompleted] = useState<string[]>([]); // list of completed video IDs
  const [videoMuted, setVideoMuted] = useState(false);

  // 5. Support & Chat States
  const [chatMessages, setChatMessages] = useState([
    { sender: "AI Support", text: "Namaste, Officer! I am your Technical Support Assistant for ABHAYA. How can I guide your field operations or software queries today?", time: "11:00 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Raise Ticket Form States
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Technical Issue");
  const [ticketPriority, setTicketPriority] = useState("Medium");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketFiles, setTicketFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [ticketReply, setTicketReply] = useState("");

  // Fetch tickets on mount
  useEffect(() => {
    fetch('/api/help/tickets')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Map backend id to ticketId
          const formatted = data.map(t => ({
            id: t.ticketId,
            subject: t.subject,
            category: t.category,
            priority: t.priority,
            status: t.status,
            created: t.created,
            messages: t.messages
          }));
          setTickets(formatted);
        }
      })
      .catch(console.error);
  }, []);

  // 6. Bug Reporting Form States
  const [bugCategory, setBugCategory] = useState("UI/UX Bug");
  const [bugPriority, setBugPriority] = useState("Medium");
  const [bugDesc, setBugDesc] = useState("");
  const [bugLogs, setBugLogs] = useState("");
  const [isBugSubmitting, setIsBugSubmitting] = useState(false);
  const [bugSuccessRef, setBugSuccessRef] = useState<string | null>(null);

  // 7. VoIP Dialing / VoIP Modal States
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [dialingContact, setDialingContact] = useState<{ name: string; number: string } | null>(null);
  const [dialerStatus, setDialerStatus] = useState("Connecting...");

  // 8. Live System Monitoring States
  const [healthCheckTimer, setHealthCheckTimer] = useState(30);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    auth: "Healthy",
    database: "Healthy",
    api: "Healthy",
    ai: "Healthy",
    notif: "Healthy",
    realtime: "Healthy",
    storage: "Warning",
    websockets: "Healthy"
  });

  // Dynamic countdown timer for health check
  useEffect(() => {
    const clock = setInterval(() => {
      setHealthCheckTimer(prev => {
        if (prev <= 1) {
          setTimeout(() => {
            triggerHealthCheck();
          }, 0);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  const triggerHealthCheck = () => {
    setIsRefreshingHealth(true);
    setTimeout(() => {
      setIsRefreshingHealth(false);
      setSystemHealth(prev => ({
        ...prev,
        storage: Math.random() > 0.3 ? "Warning" : "Healthy",
        api: Math.random() > 0.9 ? "Warning" : "Healthy"
      }));
      setHealthCheckTimer(30);
      if (showToast) showToast("System status and services updated successfully.", "info");
    }, 1000);
  };

  // Video Progress Timer Simulation
  useEffect(() => {
    let playInterval: NodeJS.Timeout;
    if (videoPlaying && activeVideo) {
      playInterval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setVideoPlaying(false);
            if (!videoCompleted.includes(activeVideo.id)) {
              setVideoCompleted(c => [...c, activeVideo.id]);
              if (showToast) showToast(`Tutorial Completed: "${activeVideo.title}"! Progress logged.`, "success");
            }
            return 100;
          }
          return prev + 2.5;
        });
      }, 500);
    }
    return () => clearInterval(playInterval);
  }, [videoPlaying, activeVideo, videoCompleted]);

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      const added = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }));
      setTicketFiles(prev => [...prev, ...added]);
      if (showToast) showToast("Files queued successfully.", "info");
    }
  };

  const removeFile = (idx: number) => {
    setTicketFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const triggerSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
    setShowSuggestions(false);
    if (showToast) showToast(`Searching database for: "${query}"`, "info");
  };

  // Article Database
  const articles: Article[] = [
    {
      id: "art-1",
      title: "Interpreting Aadhaar & Fingerprint Matched Files",
      category: "Family Matching",
      icon: Users,
      content: `The National Family Reunification Engine utilizes direct cryptographic handshake requests with the Central Identity Repository (UIDAI) to establish biometric verification.

When matching files of rescued children:
1. Review the Match Likelihood Score: A score above 85% suggests strong sibling/parent correspondence.
2. Coordinate with regional state authorities to secure physical custody handovers.
3. Keep all record access logged under WCAG tracking controls.`,
      steps: ["Select potential match cards", "Inspect verification percentage logs", "Click 'Dispatch Match' to notify local Child Welfare Committees"]
    },
    {
      id: "art-2",
      title: "Counselling & Mental Health Tracking Procedures",
      category: "Wellness",
      icon: Heart,
      content: `Child recovery is deeply dependent on mental trauma rehabilitation. This platform utilizes continuous wellness tracking indicators.

Rules of Rehabilitation Engagement:
1. Check-ins should be entered every 48 hours for immediate post-rescue victims.
2. Utilize Gemini AI recommendations to craft trauma-informed coping mechanisms.
3. If anxiety parameters exceed threshold 70, immediately schedule an offline psychiatric intervention.`,
      steps: ["Go to the Wellness views", "Identify children under critical mental stress flags", "Click 'Schedule Counselling' to alert licensed mental health staff"]
    },
    {
      id: "art-3",
      title: "Managing Shelter Outflows & Capacity Overloads",
      category: "Shelters",
      icon: BookOpen,
      content: `Shelter capacities are real-time constraints across the Indian state networks. This sub-system calculates grid routing variables.

Capacity Best Practices:
1. Keep the occupancy rate at or below 85% to maintain healthcare standards.
2. If regional shelters register 100% load, request immediate cross-border transfers.
3. Use the Interactive Map layer to find nearest low-occupancy sanctuaries.`,
      steps: ["Filter map layers by 'Capacity'", "Click on green marked hubs", "Initiate emergency transit requests"]
    },
    {
      id: "art-4",
      title: "Advanced Gemini AI Predicitons Configuration",
      category: "AI",
      icon: Lightbulb,
      content: `The ABHAYA portal hosts the Gemini 3.5 Flash Model for smart predictive tracking.

Capabilities of the LLM:
1. Dynamic translation of local dialects during search.
2. Auto-completion of unstructured incident files.
3. Pre-empting missing child trajectories based on transport hubs.`,
      steps: ["Enable 'Recovery AI' in Settings", "Set predictive accuracy parameters", "Review suggestions inside individual child logs"]
    }
  ];

  // Suggestions for search auto-complete
  const suggestions = articles
    .map(a => a.title)
    .concat(["Aadhaar matching rules", "Critical wellness checks", "National Helpline numbers", "Shelter relocation steps"])
    .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  // FAQs Database
  const faqs = [
    { q: "Is the child biometric database connected to Aadhaar?", category: "Security", a: "Yes. In accordance with government child tracking laws, verified operators can send secure lookup requests with biometric fingerprint parameters to the central Aadhaar repository." },
    { q: "How do I register a child under critical emergency flags?", category: "Recovery Center", a: "Inside the 'Children' directory, select the child log file, click the edit button, toggle high priority, and write a descriptive emergency comment. This immediately pings regional rescue squads." },
    { q: "Can I use the chat assistant to draft judicial transfer warrants?", category: "AI Assistant", a: "Yes. You can instruct the Gemini powered Recovery AI Assistant to draft template transfer warrants in compliance with state rules. However, always verify legal wording before submitting." },
    { q: "What should I do if the system registers an offline state?", category: "Notifications", a: "The ABHAYA platform features standard service worker background caches. You can edit records, write logs, and manage lists entirely offline. The system will synchronize once connectivity is restored." }
  ];

  // Video Tutorials Database
  const videos = [
    { id: "vid-1", title: "Getting Started with ABHAYA Platform", length: "4:15", category: "Basics" },
    { id: "vid-2", title: "Managing Children & Field Rescue Logs", length: "6:40", category: "Operations" },
    { id: "vid-3", title: "Orchestrating Biometric Aadhaar Matching", length: "5:20", category: "Family Matching" },
    { id: "vid-4", title: "Wellness Indexes & AI Intervention Scheduling", length: "8:05", category: "Wellness" }
  ];

  // Smart Interactive Support Chatbot Reply Simulator
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "You", text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatTyping(true);

    setTimeout(() => {
      let replyText = "Understood, Officer. I'm reviewing the state registries.";
      const query = chatInput.toLowerCase();
      if (query.includes("aadhaar") || query.includes("match")) {
        replyText = "The Aadhaar matching sub-system is fully operational. To run biometric queries, go to 'Family Matching', select a rescued child, and trigger the fingerprint lookup.";
      } else if (query.includes("shelter") || query.includes("full")) {
        replyText = "If Mumbai Shelter exceeds capacity, navigate to the Shelters panel. The interactive map will display available vacant beds at Thane and Pune hubs.";
      } else if (query.includes("wellness") || query.includes("counselling")) {
        replyText = "Counselling schedules can be updated inside 'Wellness'. Simply click the 'Schedule Counselling' action on any child's profile to trigger automated psychiatric alerts.";
      } else if (query.includes("offline") || query.includes("disconnect")) {
        replyText = "No worries! The portal is built with service workers supporting offline queues. All changes autosave locally and push back when you reconnect.";
      } else {
        replyText = `Thank you for your report. Under Mission Vatsalya directives, I have logged this query under Category: Support. For direct technical help, you can raise an official system ticket under the 'Raise Ticket' tab above.`;
      }

      setChatMessages(prev => [...prev, { sender: "AI Support", text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsChatTyping(false);
    }, 1200);
  };

  // Raised Ticket handler
  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      if (showToast) showToast("Please write a subject and description.", "error");
      return;
    }
    const newId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTk: TicketRecord = {
      id: newId,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      status: "Open",
      created: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [{ sender: "System", text: "Ticket raised successfully.", time: "Just Now" }, { sender: "User", text: ticketDesc, time: "Just Now" }]
    };
    setTickets([newTk, ...tickets]);
    setTicketSubject("");
    setTicketDesc("");
    setTicketFiles([]);
    if (showToast) showToast(`Support Ticket ${newId} initialized. Tracking active.`, "success");
  };

  // Submit Bug Report Handler
  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDesc.trim()) {
      if (showToast) showToast("Please explain the steps to reproduce.", "error");
      return;
    }
    setIsBugSubmitting(true);
    setTimeout(() => {
      setIsBugSubmitting(false);
      const bugRef = `BUG-${Math.floor(100000 + Math.random() * 900000)}`;
      setBugSuccessRef(bugRef);
      setBugDesc("");
      setBugLogs("");
      if (showToast) showToast(`Bug Report logged successfully. ID: ${bugRef}`, "success");
    }, 1500);
  };

  // VoIP Dialer trigger
  const handleVoipCall = (contact: { name: string; number: string }) => {
    setDialingContact(contact);
    setIsDialerOpen(true);
    setDialerStatus("Connecting SIP protocol...");
    setTimeout(() => setDialerStatus("Ringing secure channel..."), 1200);
    setTimeout(() => setDialerStatus("Officer unavailable (Out of coverage range)."), 4500);
  };

  // FAQ bookmark helper
  const toggleBookmark = (idx: number) => {
    setBookmarkedFaqs(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Read article aloud
  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.0;
      speech.pitch = 1.0;
      window.speechSynthesis.speak(speech);
      if (showToast) showToast("Synthesizing guidelines text...", "info");
    } else {
      if (showToast) showToast("Web Speech API not supported on this device.", "error");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-16 font-sans">
      
      {/* Global Header Search Banner */}
      <div className={`rounded-2xl border ${bgCard} p-8 flex flex-col items-center justify-center text-center shadow-xs mb-8 relative overflow-visible`}>
        <h2 className={`text-3xl font-black ${textMain} tracking-tight mb-3`}>ABHAYA Assistance Hub</h2>
        <p className={`text-sm ${textSecondary} max-w-lg mb-6`}>Find regulatory articles, watch operational video training, launch interactive support chats, or monitor node diagnostics.</p>
        
        {/* Instant Search Bar */}
        <div className="w-full max-w-xl relative overflow-visible">
          <div className={`flex items-center px-4 py-3 rounded-xl border-2 focus-within:border-[#115e3b] transition-all shadow-xs ${highContrast ? "bg-stone-950 border-stone-700" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800"}`}>
            <Search className="w-5 h-5 text-stone-400 mr-2 shrink-0" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onKeyDown={(e) => e.key === 'Enter' && triggerSearch(searchQuery)}
              placeholder="Search guides, video categories, FAQs, biometrics..."
              className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${textMain} placeholder:text-stone-400`}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Auto Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={`absolute left-0 right-0 mt-1.5 rounded-xl border shadow-xl z-50 text-left overflow-hidden ${highContrast ? "bg-stone-950 border-stone-800 text-yellow-300" : "bg-white dark:bg-stone-900 border-gray-100 dark:border-stone-800"}`}>
              <div className="p-2 border-b dark:border-stone-800/50 bg-stone-50 dark:bg-stone-950 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Search Suggestions</div>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerSearch(sug)}
                  className="w-full px-4 py-2 text-xs text-left font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular searches / History */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[10px] font-bold">
          <span className={textSecondary}>Recent Queries:</span>
          {searchHistory.map((h, i) => (
            <button 
              key={i} 
              onClick={() => triggerSearch(h)}
              className={`px-2 py-1 rounded bg-stone-50 dark:bg-stone-800 border ${borderClass} text-stone-500 hover:text-[#115e3b] dark:hover:text-yellow-300 transition-all`}
            >
              {h}
            </button>
          ))}
          {searchHistory.length > 0 && (
            <button onClick={() => setSearchHistory([])} className="text-red-500 hover:underline">Clear</button>
          )}
        </div>
      </div>

      {/* Main Tab Routing Buttons */}
      <div className="flex gap-2 border-b dark:border-stone-800 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: "Documentation", label: "Guides & Docs", icon: BookOpen },
          { id: "FAQs", label: "Searchable FAQs", icon: HelpCircle },
          { id: "Videos", label: "Video Tutorials", icon: PlayCircle },
          { id: "Support", label: "Interactive Support", icon: Ticket },
          { id: "Report", label: "Anomalies & Bugs", icon: AlertTriangle },
          { id: "Emergency", label: "Helplines", icon: PhoneCall },
          { id: "Health", label: "System Health", icon: Activity }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedArticle(null);
              setSelectedTicket(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
              activeTab === tab.id
                ? highContrast
                  ? "bg-stone-800 text-yellow-300 border border-yellow-300"
                  : "bg-[#115e3b] text-white shadow-xs"
                : `bg-stone-50 hover:bg-stone-100 dark:bg-stone-900/50 ${textSecondary} dark:hover:bg-stone-800/80`
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER TAB CONTENTS */}
      <div className="max-w-5xl mx-auto">
        
        {/* TAB 1: DOCUMENTATION */}
        {activeTab === "Documentation" && !selectedArticle && (
          <div className="space-y-6">
            <h3 className={`text-xl font-black ${textMain}`}>Mission Vatsalya Policy Docs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div 
                  key={art.id} 
                  onClick={() => {
                    setSelectedArticle(art);
                    if (!recentlyViewed.includes(art.title)) {
                      setRecentlyViewed(prev => [art.title, ...prev.slice(0, 3)]);
                    }
                  }}
                  className={`p-5 rounded-2xl border ${bgCard} shadow-xs hover:shadow-md transition-shadow cursor-pointer group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#115e3b]/10 dark:bg-stone-800 text-[#115e3b] dark:text-yellow-300 flex items-center justify-center shrink-0">
                      <art.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-[#115e3b] dark:text-yellow-300 uppercase tracking-widest">{art.category}</span>
                      <h4 className={`font-extrabold text-sm ${textMain} group-hover:text-[#115e3b] dark:group-hover:text-yellow-300 transition-colors`}>{art.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-2">{art.content}</p>
                      <p className="text-[10px] text-indigo-500 font-bold flex items-center gap-1 pt-2">
                        Open Guidelines Reader <ArrowRight className="w-3.5 h-3.5" />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recentlyViewed.length > 0 && (
              <div className="pt-6 border-t dark:border-stone-800">
                <p className={`text-xs font-bold ${textSecondary} mb-2`}>Recently Viewed Guides:</p>
                <div className="flex gap-2">
                  {recentlyViewed.map((item, idx) => (
                    <span key={idx} className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded font-bold text-stone-500">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DOCUMENTATION INLINE READER VIEWER */}
        {activeTab === "Documentation" && selectedArticle && (
          <div className={`p-6 rounded-2xl border ${bgCard} shadow-md space-y-6 animate-in fade-in duration-300`}>
            {/* Reader Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4 dark:border-stone-800">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-stone-400 hover:text-stone-600 flex items-center gap-1.5"
              >
                ← Return to Documents
              </button>
              
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => handleReadAloud(selectedArticle.content)}
                  className="px-2.5 py-1 text-[10px] rounded border font-bold hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-500 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                </button>
                <button 
                  onClick={() => {
                    const text = `${selectedArticle.title}\n\n${selectedArticle.content}`;
                    navigator.clipboard.writeText(text);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 text-[10px] rounded border font-bold hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-500 flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied" : "Copy"}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-2.5 py-1 text-[10px] rounded border font-bold hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-500 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <div className="flex border rounded-lg overflow-hidden text-[10px] font-bold">
                  <button onClick={() => setReaderFontSize("text-xs")} className={`px-2 py-1 ${readerFontSize === 'text-xs' ? 'bg-[#115e3b] text-white' : 'hover:bg-stone-50 text-stone-500'}`}>A-</button>
                  <button onClick={() => setReaderFontSize("text-sm")} className={`px-2 py-1 ${readerFontSize === 'text-sm' ? 'bg-[#115e3b] text-white' : 'hover:bg-stone-50 text-stone-500'}`}>A</button>
                  <button onClick={() => setReaderFontSize("text-base")} className={`px-2 py-1 ${readerFontSize === 'text-base' ? 'bg-[#115e3b] text-white' : 'hover:bg-stone-50 text-stone-500'}`}>A+</button>
                </div>
              </div>
            </div>

            {/* Content body */}
            <div className="space-y-4 font-sans">
              <span className="text-xs font-black text-[#115e3b] dark:text-yellow-300 uppercase tracking-widest">{selectedArticle.category}</span>
              <h3 className={`text-2xl font-black ${textMain}`}>{selectedArticle.title}</h3>
              <div className={`leading-relaxed border-l-2 border-[#115e3b] pl-4 dark:border-stone-700 whitespace-pre-wrap ${readerFontSize} ${textMain}`}>
                {selectedArticle.content}
              </div>
            </div>

            {/* Action checklist */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border space-y-2">
              <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider">Mandatory Operating Procedures</h4>
              <div className="space-y-2">
                {selectedArticle.steps.map((st, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEARCHABLE FAQS */}
        {activeTab === "FAQs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Searchable FAQ Ledger</h3>
                <p className={`text-xs ${textSecondary}`}>Frequently asked operational queries under national guidelines.</p>
              </div>

              {/* FAQ filters */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {["All", "Security", "Recovery Center", "AI Assistant", "Notifications"].map(cf => (
                  <button
                    key={cf}
                    onClick={() => setFaqCategoryFilter(cf)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      faqCategoryFilter === cf
                        ? "bg-[#115e3b] text-white border-transparent"
                        : "bg-white dark:bg-stone-900 text-stone-500 dark:border-stone-800"
                    }`}
                  >
                    {cf}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Inline Search */}
            <input 
              type="text"
              placeholder="Filter FAQs by keyword..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
            />

            {/* FAQ List */}
            <div className="space-y-4">
              {faqs
                .filter(f => faqCategoryFilter === "All" || f.category === faqCategoryFilter)
                .filter(f => f.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || f.a.toLowerCase().includes(faqSearchQuery.toLowerCase()))
                .map((faq, idx) => {
                  const isBookmarked = bookmarkedFaqs.includes(idx);
                  return (
                    <div key={idx} className={`rounded-xl border ${bgCard} overflow-hidden transition-all duration-300`}>
                      <div className="w-full px-5 py-4 flex items-center justify-between text-left">
                        <button 
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="flex-1 flex items-start text-left gap-2"
                        >
                          <ChevronDown className={`w-5 h-5 text-stone-400 shrink-0 mt-0.5 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                          <span className={`font-bold text-xs ${textMain}`}>{faq.q}</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            toggleBookmark(idx);
                            if(showToast) showToast(isBookmarked ? "Bookmark removed." : "FAQ bookmarked.", "success");
                          }}
                          className="p-1 text-stone-400 hover:text-amber-500 shrink-0"
                        >
                          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === idx ? 'max-h-96 border-t dark:border-stone-800/60 pb-5 p-5 bg-stone-50/40 dark:bg-stone-950/20' : 'max-h-0 opacity-0'}`}>
                        <p className={`text-xs ${textSecondary} leading-relaxed`}>{faq.a}</p>
                        <span className="inline-block mt-3 text-[9px] font-bold text-[#115e3b] dark:text-yellow-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded uppercase">Category: {faq.category}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: VIDEO TUTORIALS */}
        {activeTab === "Videos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>Video Briefings & Training</h3>
                <p className={`text-xs ${textSecondary}`}>Step-by-step masterclasses for active portal field officers.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400">Lessons Completed:</span>
                <span className={`text-xs font-black text-[#115e3b] dark:text-yellow-300 bg-[#115e3b]/10 dark:bg-stone-800 px-2.5 py-1 rounded-full`}>
                  {videoCompleted.length} / {videos.length}
                </span>
              </div>
            </div>

            {/* Embedded Player mockup */}
            {activeVideo ? (
              <div className={`p-4 rounded-2xl border ${bgCard} shadow-md space-y-4 animate-in zoom-in-95 duration-200`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-black text-sm text-[#115e3b] dark:text-yellow-300`}>Playing: {activeVideo.title}</h4>
                  <button onClick={() => { setActiveVideo(null); setVideoPlaying(false); }} className="text-stone-400 hover:text-stone-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Simulated Canvas video body */}
                <div className="relative aspect-video w-full rounded-xl bg-stone-950 flex flex-col items-center justify-center text-white overflow-hidden">
                  <PlayCircle className={`w-16 h-16 text-white/50 animate-pulse ${videoPlaying ? 'hidden' : ''}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-xs font-bold font-mono tracking-wide text-stone-300">GOVERNMENT SECURED TRAINING STREAM</p>
                    <p className="text-lg font-black">{activeVideo.title}</p>
                    <div className="w-full bg-white/20 h-1 rounded-full mt-4 overflow-hidden relative">
                      <div className="h-full bg-[#115e3b] dark:bg-yellow-300 absolute left-0" style={{ width: `${videoProgress}%` }} />
                    </div>
                    
                    {/* Controls row */}
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setVideoPlaying(!videoPlaying)} className="hover:text-stone-300">
                          {videoPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>
                        <button onClick={() => setVideoMuted(!videoMuted)} className="hover:text-stone-300">
                          {videoMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="font-mono">{Math.floor((videoProgress / 100) * parseInt(activeVideo.length))}m / {activeVideo.length}m</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map(vid => {
                  const isFinished = videoCompleted.includes(vid.id);
                  return (
                    <div key={vid.id} className={`p-4 rounded-xl border ${bgCard} shadow-xs flex items-start justify-between`}>
                      <div className="flex gap-3">
                        <PlayCircle className="w-10 h-10 text-stone-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-stone-400 uppercase">{vid.category} • {vid.length}</span>
                          <h4 className={`font-extrabold text-xs ${textMain}`}>{vid.title}</h4>
                          <button 
                            onClick={() => {
                              setActiveVideo(vid);
                              setVideoProgress(0);
                              setVideoPlaying(true);
                            }}
                            className="text-[10px] font-extrabold text-[#115e3b] dark:text-yellow-300 hover:underline pt-2 block"
                          >
                            LAUNCH LESSON
                          </button>
                        </div>
                      </div>
                      {isFinished && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 px-2 py-0.5 rounded font-bold flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3" /> DONE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INTERACTIVE SUPPORT CENTER */}
        {activeTab === "Support" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Live Support Chat Bot */}
            <div className={`md:col-span-2 rounded-2xl border ${bgCard} p-5 flex flex-col h-[520px] shadow-sm`}>
              <div className="flex items-center gap-3 border-b pb-3.5 dark:border-stone-800">
                <div className="w-9 h-9 rounded-full bg-[#115e3b] dark:bg-yellow-300 flex items-center justify-center text-white dark:text-black">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className={`font-black text-xs ${textMain}`}>Secured Support Agent (Gemini Core)</h4>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">🟢 Connected to Regional Server</p>
                </div>
              </div>

              {/* Chat screen */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2 py-4 text-xs">
                {chatMessages.map((msg, mIdx) => (
                  <div key={mIdx} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-xl max-w-[85%] ${msg.sender === 'You' ? 'bg-[#115e3b] text-white rounded-tr-none' : 'bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 rounded-tl-none'}`}>
                      <p className="font-bold text-[10px] opacity-75 mb-1">{msg.sender}</p>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-[8px] opacity-50 block text-right mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {isChatTyping && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-[10px] font-bold text-stone-400">Analysing operational protocols...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Prompts */}
              <div className="flex flex-wrap gap-2 border-t pt-3.5 dark:border-stone-800 text-[10px] font-bold">
                {[
                  "Aadhaar biometric protocols?",
                  "Shelter occupancy thresholds?",
                  "Offline client synchronizations?"
                ].map(prompt => (
                  <button 
                    key={prompt} 
                    onClick={() => {
                      setChatInput(prompt);
                    }}
                    className={`px-2 py-1.5 rounded border ${borderClass} hover:border-[#115e3b] dark:hover:border-yellow-300 transition-colors text-stone-500`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input section */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex gap-2 pt-3"
              >
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Support AI anything..."
                  className={`flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#115e3b] text-xs ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                />
                <button type="submit" className={`px-4 py-2 font-bold text-xs rounded-xl ${highContrast ? "bg-yellow-300 text-black" : "bg-[#115e3b] hover:bg-[#0d4c2f] text-white"}`}>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Raise Support Ticket */}
            <div className={`rounded-2xl border ${bgCard} p-5 shadow-sm space-y-4`}>
              <h4 className={`font-black text-xs uppercase tracking-wider ${textSecondary}`}>Create Support Ticket</h4>
              
              <form onSubmit={handleRaiseTicket} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Ticket Category</label>
                  <select 
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800"}`}
                  >
                    <option>Technical Issue</option>
                    <option>Biometric Match Failure</option>
                    <option>Account Credentials Problem</option>
                    <option>Government Database Sync Lag</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Priority Rating</label>
                  <select 
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800"}`}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Core Subject</label>
                  <input 
                    type="text" 
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief headline..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800"}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Incident Explanation</label>
                  <textarea 
                    rows={3}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Explain steps, errors, or constraints..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs resize-none focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800"}`}
                  />
                </div>

                {/* Drag and Drop attachments */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-3 text-center transition-all cursor-pointer ${isDragging ? 'border-[#115e3b] bg-[#115e3b]/5' : 'border-stone-200 dark:border-stone-800'}`}
                >
                  <Upload className="w-5 h-5 mx-auto text-stone-400 mb-1" />
                  <p className="text-[9px] font-bold text-stone-400">Drag & Drop Logs or Screenshots</p>
                  <p className="text-[8px] text-stone-400">Accepts system logs, jpg, png</p>
                </div>

                {ticketFiles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {ticketFiles.map((tf, i) => (
                      <div key={i} className="flex items-center justify-between bg-stone-50 dark:bg-stone-950 p-1.5 rounded text-[10px]">
                        <span className="font-mono text-stone-500 max-w-[180px] truncate">{tf.name}</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-red-500">Remove</button>
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" className={`w-full py-2 font-bold text-xs rounded-lg shadow-sm ${highContrast ? "bg-yellow-300 text-black" : "bg-[#115e3b] hover:bg-[#0d4c2f] text-white"}`}>
                  Initialize Support Ticket
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: REPORT ANOMALIES & BUGS */}
        {activeTab === "Report" && (
          <div className="max-w-2xl mx-auto">
            {bugSuccessRef ? (
              <div className={`p-6 rounded-2xl border text-center space-y-4 ${bgCard} animate-in zoom-in-95 duration-200`}>
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className={`text-xl font-black ${textMain}`}>Bug Report Registered</h3>
                <p className="text-xs text-stone-400">Under standard civil service rules, technical anomalies are logged into regional queue. Here is your tracking reference:</p>
                <p className={`font-mono font-black text-lg text-indigo-500 bg-stone-100 dark:bg-stone-800 py-2 rounded-xl`}>{bugSuccessRef}</p>
                <button 
                  onClick={() => setBugSuccessRef(null)}
                  className={`px-4 py-2 font-bold text-xs rounded-lg text-white bg-[#115e3b] hover:bg-[#0d4c2f] transition-all`}
                >
                  Log Another Anomaly
                </button>
              </div>
            ) : (
              <div className={`p-6 rounded-2xl border ${bgCard} shadow-sm space-y-6`}>
                <div>
                  <h3 className={`text-xl font-black ${textMain}`}>Report System Anomaly or Bug</h3>
                  <p className={`text-xs ${textSecondary}`}>Track technical crashes, AI matching false-positives, or UI constraints directly.</p>
                </div>

                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Anomaly Type</label>
                      <select 
                        value={bugCategory}
                        onChange={(e) => setBugCategory(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800"}`}
                      >
                        <option>UI/UX Layout Glitch</option>
                        <option>Biometric Database Match Anomaly</option>
                        <option>Performance Lag (Delay above 1000ms)</option>
                        <option>AI Assistant False-Positive</option>
                        <option>Security/Authorization Concern</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Emergency Severity</label>
                      <select 
                        value={bugPriority}
                        onChange={(e) => setBugPriority(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-900 border-gray-200 dark:border-stone-800"}`}
                      >
                        <option>Low (Cosmetic)</option>
                        <option>Medium (Disruptive but works)</option>
                        <option>High (Blocking critical operations)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Explain steps to replicate glitch</label>
                    <textarea 
                      rows={4}
                      value={bugDesc}
                      onChange={(e) => setBugDesc(e.target.value)}
                      placeholder="e.g. 1. Click family matching\n2. Run fingerprint verification\n3. Client hangs on loading state..."
                      className={`w-full px-3 py-2 rounded-lg border text-xs resize-none focus:outline-none ${highContrast ? "bg-stone-800 border-stone-700 text-white" : "bg-white dark:bg-stone-950 border-gray-200 dark:border-stone-800 text-stone-900 dark:text-white"}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Diagnostic Logs (Console/Network dump)</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const mockLogs = `[DEBUG] ${new Date().toISOString()} - Core handshaker initiated.\n[WARN] Fingerprint parameter length mismatch.\n[ERROR] Latency limits exceeded on server side core lookup. Code: 504.`;
                          setBugLogs(mockLogs);
                          if(showToast) showToast("Diagnostic dump generated.", "info");
                        }}
                        className="text-[9px] font-extrabold text-[#115e3b] dark:text-yellow-300 hover:underline"
                      >
                        GENERATE DIAGNOSTIC BUNDLE
                      </button>
                    </div>
                    <textarea 
                      rows={3}
                      value={bugLogs}
                      onChange={(e) => setBugLogs(e.target.value)}
                      placeholder="Paste browser console logs, or drag dump here..."
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono resize-none focus:outline-none bg-stone-50 dark:bg-stone-950 dark:border-stone-800"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      disabled={isBugSubmitting}
                      className={`px-5 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 ${highContrast ? "bg-yellow-300 text-black" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    >
                      {isBugSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submission Pending...
                        </>
                      ) : (
                        <>
                          Submit Secure Bug Report <AlertTriangle className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: EMERGENCY HELPLINES */}
        {activeTab === "Emergency" && (
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-black ${textMain}`}>National SOS Helplines</h3>
              <p className={`text-xs ${textSecondary}`}>One-click operational triggers for urgent child recovery assistance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "National Child Helpline", phone: "1098", icon: PhoneCall, desc: "Direct 24/7 child abuse/protection emergency pipeline." },
                { name: "Police Emergency Service", phone: "112", icon: ShieldAlert, desc: "Direct coordinate dispatch with local law enforcement teams." },
                { name: "Child Welfare Committee (CWC) Central", phone: "011-23363000", icon: FileCheck, desc: "Judicial escalation, warrants, and legal dispute channels." },
                { name: "Medical Trauma Emergency Support", phone: "102", icon: Heart, desc: "Emergency medical transport, doctors, and trauma ambulances." },
                { name: "Delhi Regional Rescue Office", phone: "+91 11 98989 89898", icon: Map, desc: "Inter-state tactical operations base for Northern India." },
                { name: "Mumbai Shelter Liaison Officer", phone: "+91 22 90123 45678", icon: HelpCircle, desc: "Coordinate immediate shelter placement slots." }
              ].map((contact, cIdx) => (
                <div key={cIdx} className={`p-5 rounded-2xl border ${bgCard} shadow-xs flex items-start justify-between`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-extrabold text-sm ${textMain}`}>{contact.name}</h4>
                      <p className="text-xs text-stone-400">{contact.desc}</p>
                      <p className={`font-mono font-black text-xs text-red-500`}>{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(contact.phone);
                        if(showToast) showToast("Number copied to clipboard.", "success");
                      }}
                      className="text-[10px] font-bold text-stone-400 hover:text-stone-600 border px-2 py-1 rounded"
                    >
                      COPY
                    </button>
                    <button 
                      onClick={() => handleVoipCall({ name: contact.name, number: contact.phone })}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 border border-red-500/30 px-2 py-1 rounded bg-red-500/5"
                    >
                      DIAL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LIVE SYSTEM HEALTH MONITORING */}
        {activeTab === "Health" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className={`text-xl font-black ${textMain}`}>National System Status</h3>
                <p className={`text-xs ${textSecondary}`}>Monitor database connections, biometrics, API nodes, and auto-refresh channels.</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-400">Refresh in {healthCheckTimer}s</span>
                <button 
                  onClick={triggerHealthCheck}
                  disabled={isRefreshingHealth}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${borderClass}`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingHealth ? 'animate-spin' : ''}`} />
                  Check Now
                </button>
              </div>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: "auth", name: "Stakeholder Authentication", desc: "Two-Factor & biometric validators", status: systemHealth.auth },
                { id: "database", name: "Primary Cloud SQL Shards", desc: "Vatsalya core data clusters", status: systemHealth.database },
                { id: "api", name: "Central Portal APIs", desc: "Government gateway handshakes", status: systemHealth.api },
                { id: "ai", name: "Gemini AI Core Services", desc: "Cognitive recommendations load", status: systemHealth.ai },
                { id: "notif", name: "SMS & Email alert dispatchers", desc: "Emergency priority relays", status: systemHealth.notif },
                { id: "realtime", name: "Socket Real-time Sync", desc: "Live dashboard updates", status: systemHealth.realtime },
                { id: "storage", name: "Secure media files vault", desc: "Aadhaar photo indexes", status: systemHealth.storage },
                { id: "websockets", name: "WebSocket Handshaker", desc: "System live communication lines", status: systemHealth.websockets }
              ].map(item => (
                <div key={item.id} className={`p-4 rounded-xl border ${bgCard} shadow-xs space-y-3`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sub-System</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "Healthy" 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : item.status === "Warning" 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-red-500/10 text-red-500'
                    }`}>
                      {item.status === "Healthy" ? "🟢 HEALTHY" : item.status === "Warning" ? "🟡 WARNING" : "🔴 CRITICAL"}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`font-extrabold text-xs ${textMain}`}>{item.name}</h4>
                    <p className="text-[10px] text-stone-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SECURE VOIP CALL DIALER MODAL */}
      {isDialerOpen && dialingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`max-w-xs w-full rounded-2xl border ${bgCard} p-6 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200`}>
            <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8 fill-white" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">SECURE VOIP COMM NETWORK</p>
              <h4 className={`text-base font-black ${textMain}`}>{dialingContact.name}</h4>
              <p className="text-xs text-stone-400">{dialingContact.phone}</p>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border">
              <p className="text-xs font-mono font-bold text-stone-400">{dialerStatus}</p>
            </div>

            <button 
              onClick={() => {
                setIsDialerOpen(false);
                setDialingContact(null);
              }}
              className="w-full py-2 text-xs font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              DISCONNECT SIP CALL
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
