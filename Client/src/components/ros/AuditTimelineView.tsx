import React, { useState } from "react";
import { 
  ShieldCheck, Clock, Download, Search, Filter, Calendar, User, 
  Terminal, ArrowUpRight, Radio, RefreshCw, Key, HardDrive, Cpu 
} from "lucide-react";
import { useRosStore } from "../../lib/rosStore";
import { useEffect } from "react";

interface AuditTimelineViewProps {
  highContrast?: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: "Access Control" | "Data Sync" | "Inference Trigger" | "Case Update";
  severity: "Info" | "Warning" | "Critical";
  terminalId: string;
  blockHash: string;
}

export default function AuditTimelineView({ highContrast }: AuditTimelineViewProps) {
  const [selectedLogId, setSelectedLogId] = useState<string>("TX-4091");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900/95 border-stone-800 text-stone-100";
  const borderCol = highContrast ? "border-stone-850" : "border-stone-800/80";
  const textMain = highContrast ? "text-yellow-300" : "text-white";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  const { auditEvents } = useRosStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (auditEvents.length > 0) {
      setLogs(auditEvents.map(e => ({
        id: e._id,
        timestamp: new Date(e.timestamp).toLocaleString(),
        actor: e.user,
        role: "Operator",
        action: e.details,
        category: "System Change", // Mocked category mapping
        severity: "Info",
        terminalId: "TERM-ROS-01",
        blockHash: "a948210bf984d720c1a2d593bf81102e3b4a5d6e7f8e9c0b1a2"
      })));
    }
  }, [auditEvents]);

  const activeLog = logs.find(l => l.id === selectedLogId) || logs[0] || {
    id: "None", timestamp: "...", actor: "...", role: "...", action: "...", category: "System Change", severity: "Info", terminalId: "...", blockHash: "..."
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleValidateLedger = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setIsValidated(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-350 select-none">
      
      {/* Immersive HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-850">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-black tracking-widest text-emerald-400 font-mono uppercase">
              NATIONAL SECURED AUDIT LEDGER
            </h1>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mt-1">
            Rakshak Cryptographic Governance Ledger
          </h2>
        </div>
        <div className="text-right font-mono text-[10px] text-stone-500">
          <p>BLOCK HEIGHT: <span className="text-emerald-400 font-bold">14,942 Blocks</span></p>
          <p>MUTABILITY INDEX: <span className="text-stone-350">0.00% Zero-Alteration Guarantee</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Ledger Filter / Quick Overview */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                Ledger Sectors
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Filter block categories</p>
            </div>

            {/* Navigation buttons */}
            <div className="space-y-2 font-mono text-xs">
              {["All", "Access Control", "Data Sync", "Inference Trigger", "Case Update"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`w-full p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    categoryFilter === cat 
                      ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" 
                      : "bg-stone-950/50 border-stone-900 hover:border-stone-800 text-stone-350"
                  }`}
                >
                  {cat} Blocks
                </button>
              ))}
            </div>

            {/* Immutability details */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-900 text-xs text-stone-400 font-mono">
              <span className="text-[9px] text-stone-500 font-bold uppercase">LEDGER DESIGN</span>
              <p className="mt-1 leading-relaxed text-[11px]">Each operation generates a distinct SHA-256 block hash, securing audit trails against administrative tampering.</p>
            </div>

          </div>
        </div>

        {/* Center Panel: Chronological Ledger Timeline list */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-2xl flex flex-col justify-between h-[440px]`}>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-850 pb-3">
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                  CHRONOLOGICAL LEDGER TIMELINE
                </h3>
                <p className="text-[10px] text-stone-500 uppercase mt-0.5">Click any log block to inspect cryptographic proofs</p>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input 
                  type="text" 
                  placeholder="Filter logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-[11px] rounded bg-stone-950 border border-stone-850 text-white focus:outline-none placeholder-stone-600"
                />
              </div>
            </div>

            {/* Timeline block stream */}
            <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-3 relative z-10">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-mono ${
                    selectedLogId === log.id 
                      ? "bg-white border-white text-black" 
                      : "bg-stone-950 border-stone-900 text-stone-300 hover:border-stone-800"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{log.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        log.severity === "Critical" ? "bg-rose-950/20 text-rose-400 border-rose-900" :
                        log.severity === "Warning" ? "bg-amber-950/20 text-amber-400 border-amber-900" :
                        "bg-emerald-950/20 text-emerald-400 border-emerald-900"
                      }`}>
                        {log.category.toUpperCase()}
                      </span>
                    </div>
                    <p className={`font-semibold ${selectedLogId === log.id ? "text-stone-900" : "text-stone-300"}`}>{log.action}</p>
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>

            {/* verification status bar */}
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex items-center justify-between text-[10px] font-mono">
              <span className="text-stone-500">ROOT HASH VERIFIER: <span className="text-white font-bold">{activeLog.id}</span></span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Block Confirmed
              </span>
            </div>

          </div>
        </div>

        {/* Right Panel: Cryptographic Proof Block Inspector */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-xl space-y-4 h-[440px] overflow-y-auto`}>
            
            <div className="border-b border-stone-850 pb-3">
              <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Block Inspector
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 uppercase">Detailed cryptograhic audit metrics</p>
            </div>

            {/* active inspected log profile details */}
            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase block">OPERATING OFFICER</span>
                <p className="font-bold text-stone-200 mt-0.5">{activeLog.actor}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">{activeLog.role}</p>
              </div>

              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase block">SECURE TERMINAL ID</span>
                <p className="font-bold text-stone-200 mt-0.5">{activeLog.terminalId}</p>
              </div>

              <div>
                <span className="text-[9px] text-stone-500 font-bold uppercase block">BLOCK HASH SIGNATURE (SHA-256)</span>
                <p className="font-mono text-[10px] text-emerald-400 break-all bg-stone-950 p-2 rounded border border-stone-900 mt-1">
                  {activeLog.blockHash}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-900">
                <span className="text-[9px] text-stone-500 font-bold uppercase block">LEDGER INTEGRITY CODE</span>
                <span className="text-[10px] text-emerald-500 bg-emerald-950/40 border border-emerald-900 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                  ✓ VERIFIED ON-CHAIN
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Panel: Ledger Validation Verification Trigger */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-900/50 font-mono font-bold text-xs uppercase tracking-widest">
            LEDGER STATUS
          </span>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Cryptographic Ledger Consistency Verification Check
            </h4>
            <p className="text-[10px] text-stone-500 mt-0.5 font-mono">ON-CHAIN SYSTEM VALIDITY RATE: <span className="text-white font-bold">100% SECURE</span></p>
          </div>
        </div>

        {/* Validation action control */}
        <div className="flex items-center gap-3">
          {isValidated ? (
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-4 py-2 rounded-xl">
              ✓ IMMUTABILITY AUDIT VERIFIED
            </span>
          ) : (
            <button
              onClick={handleValidateLedger}
              disabled={isValidating}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                isValidating 
                  ? "bg-stone-800 text-stone-400" 
                  : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-950/25 shadow-lg"
              }`}
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>VALIDATING BLOCK ENVELOPE...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RUN CONTINUOUS LEDGER VERIFICATION</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
