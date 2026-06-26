import React, { useState } from "react";
import { 
  X, Mail, Send, Trash2, ArrowUpRight, Inbox, Search, 
  Sparkles, Check, ChevronRight, User, ShieldAlert, FileText, CheckCircle
} from "lucide-react";
import { useOverlayStore, Message } from "../../lib/overlayStore";
import { useToastStore } from "../../lib/store";

interface SecureMailModalProps {
  highContrast?: boolean;
}

export default function SecureMailModal({ highContrast }: SecureMailModalProps) {
  const { 
    isMailOpen, 
    setMailOpen, 
    messages, 
    addMessage, 
    markMessageRead, 
    deleteMessage 
  } = useOverlayStore();
  
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "compose">("inbox");
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(messages[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");

  // Compose state
  const [recipient, setRecipient] = useState("All Agencies");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isMailOpen) return null;

  const bgCard = highContrast ? "bg-stone-950 border-stone-800" : "bg-stone-900 text-stone-100 border-stone-800";
  const bgPanel = highContrast ? "bg-stone-900 border-stone-800" : "bg-stone-950/80 border-stone-800/60";
  const textMuted = highContrast ? "text-stone-400" : "text-stone-400 font-mono text-[11px]";

  const filteredMessages = messages.filter((msg) => {
    // Inbox shows received (not sent by client, or just everything except explicitly marked sent for normal view)
    const isSentTab = activeTab === "sent";
    const matchTab = isSentTab ? msg.sent === true : msg.sent !== true;
    
    const matchSearch = 
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchTab && matchSearch;
  });

  const selectedMessage = messages.find((m) => m.id === selectedMsgId);

  const handleSelectMessage = (id: string) => {
    setSelectedMsgId(id);
    markMessageRead(id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      addMessage(recipient, "Field Intelligence Unit", subject, content);
      addToast("Secure encrypted message transmitted!", "success");
      setIsSending(false);
      setSubject("");
      setContent("");
      setActiveTab("sent");
      setSelectedMsgId(null);
    }, 1200);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMessage(id);
    addToast("Message deleted from ledger cache", "warning");
    if (selectedMsgId === id) {
      setSelectedMsgId(null);
    }
  };

  const unreadCount = messages.filter(m => !m.read && !m.sent).length;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-5xl h-[600px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden relative ${bgCard}`}>
        
        {/* Header HUD banner */}
        <div className="flex justify-between items-center bg-stone-950 p-4 border-b border-stone-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-900/50">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                <h2 className="text-xs font-black tracking-widest text-purple-400 font-mono uppercase">
                  ABHAYA SECURE DISPATCH CORRIDOR
                </h2>
              </div>
              <p className="text-[10px] text-stone-500 font-mono uppercase mt-0.5">
                ENCRYPTED TRANSIT PORT: 3000 • CHIP SECURITY MATRIX ACTIVE
              </p>
            </div>
          </div>

          <button 
            onClick={() => setMailOpen(false)}
            className="p-1.5 rounded-full bg-stone-900 hover:bg-stone-800 transition-colors text-stone-400 hover:text-white cursor-pointer border border-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Navigation and list sidebar */}
          <div className="w-80 border-r border-stone-850 flex flex-col bg-stone-950/40">
            
            {/* Inbox, Sent, Compose toggle */}
            <div className="p-3 grid grid-cols-3 gap-1.5 border-b border-stone-850 bg-stone-950/80">
              <button
                onClick={() => { setActiveTab("inbox"); setSelectedMsgId(null); }}
                className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold font-mono transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === "inbox" 
                    ? "bg-purple-950/60 border border-purple-800 text-purple-400" 
                    : "border border-stone-900 text-stone-400 hover:text-stone-100"
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>INBOX {unreadCount > 0 && `(${unreadCount})`}</span>
              </button>

              <button
                onClick={() => { setActiveTab("sent"); setSelectedMsgId(null); }}
                className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold font-mono transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === "sent" 
                    ? "bg-purple-950/60 border border-purple-800 text-purple-400" 
                    : "border border-stone-900 text-stone-400 hover:text-stone-100"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>SENT</span>
              </button>

              <button
                onClick={() => setActiveTab("compose")}
                className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold font-mono transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  activeTab === "compose" 
                    ? "bg-emerald-950/60 border border-emerald-850 text-emerald-400" 
                    : "border border-stone-900 text-stone-400 hover:text-stone-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>COMPOSE</span>
              </button>
            </div>

            {/* Search filter */}
            {activeTab !== "compose" && (
              <div className="p-3 border-b border-stone-850 bg-stone-950/20 relative">
                <Search className="w-3.5 h-3.5 absolute left-6 top-1/2 -translate-y-1/2 text-stone-500" />
                <input 
                  type="text" 
                  placeholder="Filter dispatches..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-950 pl-9 pr-3 py-1.5 rounded-lg text-[11px] font-mono border border-stone-850 text-white placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
            )}

            {/* Messages list */}
            {activeTab !== "compose" ? (
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 font-mono text-xs">
                    No encrypted logs found
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMsgId === msg.id
                          ? "bg-stone-850/60 border-purple-800 text-white shadow-md"
                          : "bg-stone-950/40 border-stone-900 hover:border-stone-850 text-stone-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate flex items-center gap-1.5">
                            {!msg.read && !msg.sent && (
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                            )}
                            {msg.sender}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate mt-0.5">{msg.role}</p>
                        </div>
                        <span className="text-[9px] font-mono text-stone-500 whitespace-nowrap">{msg.timestamp.split(",")[0]}</span>
                      </div>
                      <h4 className={`text-[11px] font-bold mt-2 truncate ${msg.read ? "text-stone-350" : "text-purple-300"}`}>{msg.subject}</h4>
                      <p className="text-[10px] text-stone-400 line-clamp-2 mt-1 leading-relaxed">{msg.content}</p>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-900">
                        <span className="text-[9px] font-mono text-stone-500 uppercase">PROV: {msg.id}</span>
                        <button 
                          onClick={(e) => handleDelete(msg.id, e)}
                          className="p-1 rounded hover:bg-stone-900 text-stone-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-4 space-y-4 text-xs font-mono text-stone-400 bg-stone-950/30 flex-1">
                <p className="text-[11px] uppercase text-stone-500 font-bold border-b border-stone-900 pb-2">ENCRYPTED TELEMETRY DISPATCH</p>
                <p className="leading-relaxed text-[11px]">You are composing an authenticated directive. Dispatches are securely broadcasted to state agency nodes and hashed directly onto the Rakshak Ledger network trail.</p>
                <div className="p-3 bg-purple-950/15 border border-purple-900/30 rounded-xl space-y-1 text-[11px]">
                  <p className="text-purple-400 font-bold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Ledger Signing Key</p>
                  <p className="font-mono text-[10px] text-stone-500 break-all">ABH-KEY-F981X02C</p>
                </div>
              </div>
            )}

          </div>

          {/* Detailed View Panel */}
          <div className="flex-1 flex flex-col bg-stone-950/20">
            {activeTab === "compose" ? (
              <form onSubmit={handleSendMessage} className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="border-b border-stone-850 pb-2">
                    <h3 className="font-black text-xs uppercase tracking-widest text-emerald-400 font-mono">
                      Compose secure agency message
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">TARGET SECURITY SEGMENT</label>
                      <select 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full bg-stone-950 p-2.5 rounded-lg text-xs font-mono border border-stone-850 text-white focus:outline-none"
                      >
                        <option value="All Agencies">All Sync Nodes (Police + NGO + CWC)</option>
                        <option value="Police State Hubs">Police State Hubs</option>
                        <option value="Juvenile CWC Units">Juvenile CWC Units</option>
                        <option value="National Child Protection Agency">Child Protection Agency</option>
                        <option value="Sankalp Safe Shelter">Sankalp Safe Shelter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">AUTHORITY SIGN-OFF LEVEL</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="Command Director Sanjay Deshmukh (ROS)"
                        className="w-full bg-stone-900 p-2.5 rounded-lg text-xs font-mono border border-stone-850 text-stone-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">SUBJECT / ACTION OBJECTIVE</label>
                    <input 
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="e.g. Mandatory audit sign-off for biometric index updates"
                      className="w-full bg-stone-950 p-2.5 rounded-lg text-xs font-mono border border-stone-850 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 uppercase mb-1 font-mono">MESSAGE BODY (ENCRYPTED TEXT)</label>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      rows={8}
                      placeholder="Enter encrypted directive here..."
                      className="w-full bg-stone-950 p-3 rounded-lg text-xs font-mono border border-stone-850 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-900 flex justify-end gap-3 font-mono">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab("inbox")}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 rounded-xl text-xs font-bold border border-stone-850 text-stone-300 transition-all cursor-pointer"
                  >
                    DISCARD
                  </button>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
                  >
                    {isSending ? (
                      <>
                        <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>HASHING DISPATCH...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>TRANSMIT DIRECTIVE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : selectedMessage ? (
              <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in">
                <div className="space-y-4">
                  {/* Subject and tags */}
                  <div className="border-b border-stone-850 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded bg-purple-950/50 text-purple-400 border border-purple-900/50 text-[10px] font-bold font-mono uppercase tracking-widest">
                        SECURE LOG CACHE: {selectedMessage.id}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">{selectedMessage.timestamp}</span>
                    </div>
                    <h2 className="text-lg font-black text-white leading-snug">{selectedMessage.subject}</h2>
                  </div>

                  {/* Sender Profile block */}
                  <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-900">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-200">{selectedMessage.sender}</h4>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">{selectedMessage.role}</p>
                    </div>
                  </div>

                  {/* Actual content */}
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-900">
                    <p className="text-xs font-mono text-stone-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-900 flex justify-between items-center font-mono">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> SECURE DECRYPTION COMPLETE
                  </span>
                  <button 
                    onClick={(e) => handleDelete(selectedMessage.id, e)}
                    className="px-4 py-2 border border-red-900/40 hover:bg-red-950/20 text-red-400 hover:border-red-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE FROM CACHE</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-500 font-mono">
                <Mail className="w-12 h-12 text-stone-700 animate-pulse mb-3" />
                <p className="text-xs">Select an encrypted dispatch log from the inbox</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
