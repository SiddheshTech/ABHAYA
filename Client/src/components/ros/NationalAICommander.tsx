import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, Radio, Terminal, AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";

interface NationalAICommanderProps {
  highContrast?: boolean;
}

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  isCustomReport?: boolean;
  reportData?: any;
}

export default function NationalAICommander({ highContrast }: NationalAICommanderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Awaiting authentication... Secure link active. I am Rakshak Commander. Ask me any predictive analysis, state performance, or national intelligence query.",
      timestamp: "SYSTEM READY",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/98 backdrop-blur-md border-stone-800 text-stone-100";
  const textMain = highContrast ? "text-yellow-300" : "text-emerald-400";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const presetQueries = [
    { label: "Show highest-risk district", query: "Show highest-risk district." },
    { label: "Which network is growing fastest?", query: "Which network is growing fastest?" },
    { label: "Generate national briefing", query: "Generate national briefing." },
    { label: "Predict next trafficking hotspot", query: "Predict next trafficking hotspot." },
    { label: "Show state performance rankings", query: "Show state performance rankings." },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Dynamic responses representing a real high-intelligence platform
    setTimeout(() => {
      let replyText = "";
      let reportData: any = null;
      let isCustomReport = false;

      const normalized = text.toLowerCase();
      if (normalized.includes("risk") || normalized.includes("hotspot")) {
        replyText = "AI PREDICTIVE REPORT: Analyzing multi-vector demographic, monsoon displacements, and railway ticketing feeds. Identifying highest vulnerability points.";
        isCustomReport = true;
        reportData = {
          title: "TRAFFICKING RISK ELEVATION REPORT",
          items: [
            { label: "Critical District", val: "Dhubri, Assam (Confidence: 89%)" },
            { label: "Key Hotspot Vector", val: "Pune Junction Overpass, Maharashtra" },
            { label: "Seasonal Catalyst", val: "Agricultural migration spike + Monsoon displacement" },
            { label: "Recommended Countermeasure", val: "Deploy 2 additional CW Patrol Units & Alert local RPF (Railway Police)" }
          ]
        };
      } else if (normalized.includes("network") || normalized.includes("growing")) {
        replyText = "INTELLIGENCE ENGINE: Cross-referencing facial recognition sighting vectors and biometric duplicates. Sighting cluster mutation alert.";
        isCustomReport = true;
        reportData = {
          title: "GENOME NETWORK MUTATION PROFILE",
          items: [
            { label: "Fastest Growing Network", val: "Cluster G12 (Transit hubs focus)" },
            { label: "Active Corridor", val: "Indore to Patna Transit Corridor" },
            { label: "New Sighting Nodes", val: "+14 in last 48 hours" },
            { label: "Primary Kingpin Profile", val: "Linked to alias 'Ustad' syndicate (unresolved cases: 34)" }
          ]
        };
      } else if (normalized.includes("briefing") || normalized.includes("national")) {
        replyText = "NATIONAL SECURITY BRIEFING: Generated on hourly telemetry sync. Complete child protection overview compiled below.";
        isCustomReport = true;
        reportData = {
          title: "RO-SITREP (SITUATION REPORT)",
          items: [
            { label: "Active Tracking State", val: "17 Children Recovered in current cycle" },
            { label: "Network Neutralizations", val: "2 Criminal Networks identified (Cluster G12 & G18)" },
            { label: "Emergency Zone Deployments", val: "4 High-Risk Districts (Delhi Sector 3, Pune Central, Dhubri, Patna Hub)" },
            { label: "National Rescue Rate", val: "94.2% Success Rating" }
          ]
        };
      } else if (normalized.includes("ranking") || normalized.includes("performance") || normalized.includes("state")) {
        replyText = "STATE COORDINATION METRICS: Evaluating response latency and rescue success ratings across India command nodes.";
        isCustomReport = true;
        reportData = {
          title: "STATE COMMAND PERFORMANCE RANKINGS",
          items: [
            { label: "Rank 1: Delhi-NCR Command", val: "96.4% success, average 9m dispatch latency" },
            { label: "Rank 2: Tamil Nadu Node", val: "95.0% success, average 12m dispatch latency" },
            { label: "Rank 3: Maharashtra Command", val: "94.2% success, average 14m dispatch latency" },
            { label: "Under Surveillance Area", val: "Bihar Hub (88.1% success, 26m average latency)" }
          ]
        };
      } else {
        replyText = "INSTRUCTION UNRESOLVED. Please query system diagnostics, state rankings, national briefings, trafficking risk, or network activity reports.";
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: replyText,
          timestamp: "SECURE INFERENCE",
          isCustomReport,
          reportData,
        },
      ]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all cursor-pointer group flex items-center gap-2 border ${
          highContrast 
            ? "bg-stone-900 border-yellow-300 text-yellow-300" 
            : "bg-emerald-950/95 hover:bg-emerald-900 text-emerald-400 border-emerald-500/30 shadow-emerald-950/20"
        } hover:scale-105 active:scale-95 animate-bounce`}
        title="⚡ Ask Rakshak AI Commander"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-bold text-xs tracking-wider uppercase hidden sm:inline">Ask AI Commander</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </button>

      {/* AI Commander Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg h-[580px] rounded-2xl border flex flex-col shadow-2xl relative overflow-hidden ${bgCard}`}>
            
            {/* Header HUD */}
            <div className="p-4 border-b border-stone-850 bg-stone-950/60 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-900/50">
                  <Radio className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <h3 className="font-black text-sm tracking-wider uppercase text-white flex items-center gap-2">
                    Rakshak Commander <span className="text-[10px] text-emerald-500 bg-emerald-950 border border-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest">LIVE INFERENCE</span>
                  </h3>
                  <p className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">National AI Intelligence Core</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-850 text-stone-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/10">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${
                    m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center h-8 w-8 ${
                    m.sender === "user" 
                      ? "bg-stone-800 text-stone-300" 
                      : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40"
                  }`}>
                    {m.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-stone-800 text-stone-100"
                        : "bg-stone-900 border border-stone-800 text-stone-200"
                    }`}>
                      <p>{m.text}</p>

                      {/* Display beautiful interactive report if present */}
                      {m.isCustomReport && m.reportData && (
                        <div className="mt-3 p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-[11px] font-mono animate-in fade-in duration-300">
                          <div className="flex justify-between items-center pb-1.5 border-b border-stone-850">
                            <span className="text-emerald-400 font-bold tracking-wider">{m.reportData.title}</span>
                            <span className="text-[9px] text-stone-500">RO-SECURED</span>
                          </div>
                          {m.reportData.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between gap-4 py-1 border-b border-stone-900/50 last:border-0">
                              <span className="text-stone-500">{item.label}:</span>
                              <span className="text-stone-300 text-right font-semibold">{item.val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={textMuted}>{m.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 shrink-0 h-8 w-8 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 text-xs text-stone-400 font-mono">
                    Querying neural node databases...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets HUD */}
            <div className="p-3 border-t border-stone-850 bg-stone-950/50 space-y-2">
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest px-1">Suggested AI Commands</p>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {presetQueries.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset.query)}
                    className="text-[10px] font-bold px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-emerald-400 rounded-lg border border-stone-800 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Terminal className="w-3 h-3 text-stone-500" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-stone-850 bg-stone-950 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Commander: 'Predict next trafficking hotspot'..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-800 bg-stone-900 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent placeholder-stone-550"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
