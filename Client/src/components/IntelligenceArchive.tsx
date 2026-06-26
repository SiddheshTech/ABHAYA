import React, { useState, useEffect, useRef } from "react";
import { 
  Archive, Search, FileText, Star, Eye, Link2, Users, Network,
  BrainCircuit, Database, ArrowRightLeft, Folder, ChevronRight,
  Shield, Cpu, Activity, Filter, Trash, RefreshCw, Plus, Clock, 
  FileSpreadsheet, Download, Printer, Key, CheckCircle, AlertCircle, 
  Play, Pause, ChevronDown, Check, Info, FileUp, X, Sparkles, Volume2, HelpCircle
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface IntelligenceArchiveProps {
  highContrast?: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

// Interfaces to mirror backend
interface KnowledgeEntity {
  id: string;
  type: string;
  name: string;
  status: string;
  riskScore: number;
  details: Record<string, any>;
}

interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  confidence: number;
  strength: number;
  details: Record<string, any>;
}

interface RecentIntelligenceItem {
  id: string;
  title: string;
  category: 'case' | 'evidence' | 'activity' | 'prediction' | 'alert' | 'upload' | 'report';
  timestamp: string;
  officer: string;
  status: 'pinned' | 'active' | 'archived' | 'deleted';
  bookmarked: boolean;
  summary: string;
  metadata: Record<string, any>;
}

interface SavedReport {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  size: string;
  version: number;
  versionHistory: Array<{ version: number; date: string; author: string; changes: string }>;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Signed';
  signature?: { signedBy: string; timestamp: string; hash: string };
  content: string;
  tags: string[];
}

interface FavoriteCase {
  id: string;
  title: string;
  tags: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  personalNotes: string;
  reminderDate?: string;
  assignedOfficer: string;
  lastUpdated: string;
  timeline: Array<{ date: string; event: string; officer: string }>;
}

interface WatchlistItem {
  id: string;
  type: string;
  value: string;
  status: 'MONITORING' | 'TRIGGERED' | 'SUSPENDED';
  addedDate: string;
  alertCount: number;
  tags: string[];
  riskScore: number;
  lastMatch?: string;
}

interface KnowledgeStats {
  totalRecords: number;
  activeCases: number;
  closedCases: number;
  archivedCases: number;
  indexedProfiles: number;
  evidenceFiles: number;
  videos: number;
  images: number;
  audioFiles: number;
  dnaRecords: number;
  fingerprints: number;
  faceProfiles: number;
  activeUsers: number;
  connectedAgencies: string[];
  apiHealth: string;
  serverStatus: string;
  storageUsage: string;
  latency: number;
  lastSync: string;
}

interface AISuggestion {
  id: string;
  title: string;
  type: string;
  confidence: number;
  why: string;
  supportingEvidence: string[];
  recommendedAction: string;
  reasoning: string;
}

interface RelatedRecord {
  id: string;
  targetId: string;
  targetName: string;
  type: string;
  similarity: number;
  confidence: number;
  sharedAttributes: string[];
  lastActivity: string;
}

export default function IntelligenceArchive({ highContrast, showToast }: IntelligenceArchiveProps) {
  // Styles based on theme
  const textMain = highContrast ? "text-yellow-300" : "text-gray-900";
  const bgCard = highContrast ? "bg-stone-900 border-stone-800" : "bg-white border-gray-100";
  const textSecondary = highContrast ? "text-gray-400" : "text-gray-500";
  const bgContainer = highContrast ? "bg-black" : "bg-slate-50/50";

  // Navigation state: "search" is default center, or left-nav items ("recent", "reports", "favorites", "watchlist")
  const [activeView, setActiveView] = useState<"search" | "recent" | "reports" | "favorites" | "watchlist">("search");

  // Core intelligence data states
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [recentFeed, setRecentFeed] = useState<RecentIntelligenceItem[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [favoriteCases, setFavoriteCases] = useState<FavoriteCase[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [relatedRecords, setRelatedRecords] = useState<RelatedRecord[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: KnowledgeEntity[]; edges: KnowledgeEdge[] }>({ nodes: [], edges: [] });

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Data");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<KnowledgeEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<KnowledgeEntity | null>(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestionsDropdown, setSuggestionsDropdown] = useState<KnowledgeEntity[]>([]);

  // Advanced Filters specific fields
  const [filterRiskScore, setFilterRiskScore] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string>("");

  // Modals & Sliders
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [isAddWatchlistOpen, setIsAddWatchlistOpen] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>(["[SYS] Central Sync Channel Registered.", "[SYS] Subscribing to Redis Pub/Sub events..."]);

  // Form States
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportType, setNewReportType] = useState("AI Report");
  const [newReportContent, setNewReportContent] = useState("");
  const [newReportTags, setNewReportTags] = useState("");

  const [newWatchType, setNewWatchType] = useState("Suspect");
  const [newWatchValue, setNewWatchValue] = useState("");
  const [newWatchTags, setNewWatchTags] = useState("");
  const [newWatchRisk, setNewWatchRisk] = useState(80);

  const [activeReportToEdit, setActiveReportToEdit] = useState<SavedReport | null>(null);
  const [sigName, setSigName] = useState("Dr. Smith Kadam");

  // Graph state: Zoom, Pan, shortest path, timeline simulation
  const [graphZoom, setGraphZoom] = useState(1);
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 });
  const [graphFilterType, setGraphFilterType] = useState<string>("all");
  const [pathStart, setPathStart] = useState("");
  const [pathEnd, setPathEnd] = useState("");
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([]);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [timelineYear, setTimelineYear] = useState(2026);

  // Real-time voice search simulation
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut listener
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Socket state
  const socketRef = useRef<Socket | null>(null);

  // Initialize and Sync Data
  useEffect(() => {
    // Fetch initial datasets
    fetchData();

    // Setup Socket.io connection for live notifications and synchronization
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      addToSyncLog(`[WS] Connection established successfully on Socket ID: ${socket.id}`);
    });

    socket.on("update", (payload: { type: string; data: any }) => {
      addToSyncLog(`[WS] Received real-time broadcast update: ${payload.type}`);
      if (payload.type === "knowledge_recent") setRecentFeed(payload.data);
      if (payload.type === "knowledge_reports") setSavedReports(payload.data);
      if (payload.type === "knowledge_favorites") setFavoriteCases(payload.data);
      if (payload.type === "knowledge_watchlist") setWatchlist(payload.data);
      if (payload.type === "knowledge_suggestions") setSuggestions(payload.data);
      if (payload.type === "knowledge_stats") setStats(payload.data);
    });

    socket.on("knowledge_alert", (alertPayload: { message: string; data: any; feedAlert: any }) => {
      if (showToast) {
        showToast(alertPayload.message, "error");
      }
      addToSyncLog(`[ALERT] WATCHLIST MONITOR EVENT: ${alertPayload.message}`);
      // Push alarm visualization
      triggerScreenAlarm(alertPayload.message);
    });

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        if (showToast) showToast("Search Focused. Type to scan...", "info");
      }
      if (e.key === "Escape") {
        setIsStatsModalOpen(false);
        setIsCreateReportOpen(false);
        setIsAddWatchlistOpen(false);
        setIsAdvancedFiltersOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Load recent searches from cache
    const cachedSearches = localStorage.getItem("intel_recent_searches");
    if (cachedSearches) {
      setRecentSearches(JSON.parse(cachedSearches));
    } else {
      setRecentSearches(["Raman Kalra", "CASE-992", "Siliguri", "+91 98124"]);
    }

    return () => {
      socket.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
    };
  }, []);

  // Update suggestions dropdown on search query change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestionsDropdown([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/knowledge/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSuggestionsDropdown(data.slice(0, 5));
          }
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Timeline playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimelinePlaying) {
      interval = setInterval(() => {
        setTimelineYear(prev => {
          if (prev >= 2026) return 2020;
          return prev + 2;
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimelinePlaying]);

  const addToSyncLog = (message: string) => {
    setSyncLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 15)]);
  };

  const fetchData = async () => {
    try {
      const [resStats, resRecent, resReports, resFavorites, resWatchlist, resSuggestions, resGraph] = await Promise.all([
        fetch("/api/knowledge/stats").then(r => r.json()),
        fetch("/api/knowledge/recent").then(r => r.json()),
        fetch("/api/knowledge/reports").then(r => r.json()),
        fetch("/api/knowledge/favorites").then(r => r.json()),
        fetch("/api/knowledge/watchlist").then(r => r.json()),
        fetch("/api/knowledge/suggestions").then(r => r.json()),
        fetch("/api/knowledge/graph").then(r => r.json())
      ]);

      setStats(resStats);
      setRecentFeed(resRecent);
      setSavedReports(resReports);
      setFavoriteCases(resFavorites);
      setWatchlist(resWatchlist);
      setSuggestions(resSuggestions);
      setGraphData(resGraph);

      // Default select first case as current selected entity to enrich cognitive panels
      if (resGraph?.nodes?.length > 0) {
        setSelectedEntity(resGraph.nodes[0]);
        fetchRelatedRecords(resGraph.nodes[0].id);
      }
    } catch (err) {
      console.error("Error loading intelligence database:", err);
    }
  };

  const fetchRelatedRecords = (id: string) => {
    fetch(`/api/knowledge/related/${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => setRelatedRecords(data));
  };

  const [alarmBanner, setAlarmBanner] = useState<string | null>(null);
  const triggerScreenAlarm = (message: string) => {
    setAlarmBanner(message);
    // Beep sound visual trigger
    setTimeout(() => {
      setAlarmBanner(null);
    }, 6000);
  };

  // REST Action Calls
  const handleGlobalSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    if (showToast) showToast(`Scanning national node indices for "${searchQuery}"...`, "info");

    // Add to search history
    const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("intel_recent_searches", JSON.stringify(updatedSearches));

    setTimeout(() => {
      fetch(`/api/knowledge/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`)
        .then(r => r.json())
        .then(data => {
          setIsSearching(false);
          if (Array.isArray(data)) {
            setSearchResults(data);
            if (data.length > 0) {
              setSelectedEntity(data[0]);
              fetchRelatedRecords(data[0].id);
              if (showToast) showToast(`Found ${data.length} authenticated matches across registries.`, "success");
            } else {
              if (showToast) showToast("No registered intelligence node matched search criteria.", "error");
            }
          }
        })
        .catch(() => setIsSearching(false));
    }, 800);
  };

  const selectSuggestion = (entity: KnowledgeEntity) => {
    setSearchQuery(entity.name);
    setSuggestionsDropdown([]);
    setSelectedEntity(entity);
    fetchRelatedRecords(entity.id);
    handleGlobalSearchSubmit();
  };

  // Recent feed interactions
  const handleBookmarkRecent = (id: string) => {
    fetch(`/api/knowledge/recent/${id}/bookmark`, { method: "POST" })
      .then(r => r.json())
      .then(() => {
        if (showToast) showToast("Live intelligence feed index updated.", "success");
      });
  };

  const handleUpdateRecentStatus = (id: string, status: 'pinned' | 'active' | 'archived' | 'deleted') => {
    fetch(`/api/knowledge/recent/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then(r => r.json())
      .then(() => {
        if (showToast) showToast(`Intelligence alert status changed to: ${status}`, "info");
      });
  };

  // Saved Reports interactions
  const handleCreateReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTitle.trim()) return;

    fetch("/api/knowledge/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newReportTitle,
        type: newReportType,
        content: newReportContent,
        tags: newReportTags.split(",").map(t => t.trim()).filter(Boolean)
      })
    })
      .then(r => r.json())
      .then(data => {
        if (showToast) showToast(`Saved draft of "${data.title}" successfully.`, "success");
        setIsCreateReportOpen(false);
        setNewReportTitle("");
        setNewReportContent("");
        setNewReportTags("");
      });
  };

  const handleSignReport = (id: string) => {
    fetch(`/api/knowledge/reports/${id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signedBy: sigName })
    })
      .then(r => r.json())
      .then((data) => {
        if (showToast) showToast(`Digital signature applied. SHA256 Hash injected!`, "success");
        if (activeReportToEdit && activeReportToEdit.id === id) {
          setActiveReportToEdit(data);
        }
      });
  };

  const handleApproveReport = (id: string) => {
    fetch(`/api/knowledge/reports/${id}/approve`, { method: "POST" })
      .then(r => r.json())
      .then((data) => {
        if (showToast) showToast(`Administrative Approval workflow completed for report.`, "success");
        if (activeReportToEdit && activeReportToEdit.id === id) {
          setActiveReportToEdit(data);
        }
      });
  };

  const handleAutoSaveReport = (id: string, updatedContent: string) => {
    fetch(`/api/knowledge/reports/${id}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: updatedContent })
    })
      .then(r => r.json())
      .then((data) => {
        if (activeReportToEdit && activeReportToEdit.id === id) {
          setActiveReportToEdit(data);
        }
        addToSyncLog(`[SYS] Document auto-save success: Report ID ${id}, incremented to version ${data.version}`);
      });
  };

  // Favorites interactions
  const handleSaveNotes = (id: string, notes: string) => {
    fetch(`/api/knowledge/favorites/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalNotes: notes })
    })
      .then(r => r.json())
      .then(() => {
        if (showToast) showToast("Personal notes and case hypothesis saved.", "success");
      });
  };

  const handleSaveReminder = (id: string, date: string) => {
    fetch(`/api/knowledge/favorites/${id}/reminder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminderDate: date })
    })
      .then(r => r.json())
      .then(() => {
        if (showToast) showToast(`Investigation reminder set for ${date}`, "success");
      });
  };

  // Watchlist interactions
  const handleAddWatchlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchValue.trim()) return;

    fetch("/api/knowledge/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newWatchType,
        value: newWatchValue,
        tags: newWatchTags.split(",").map(t => t.trim()).filter(Boolean),
        riskScore: newWatchRisk
      })
    })
      .then(r => r.json())
      .then(() => {
        if (showToast) showToast("Monitored target registered onto security database.", "success");
        setIsAddWatchlistOpen(false);
        setNewWatchValue("");
        setNewWatchTags("");
      });
  };

  const handleTriggerWatchAlert = (id: string) => {
    if (showToast) showToast("Simulating real-time signal match/CCTV capture...", "info");
    fetch(`/api/knowledge/watchlist/${id}/trigger`, { method: "POST" })
      .then(r => r.json())
      .then(() => {
        addToSyncLog(`[SIMULATOR] Trigger signal sent for watchlist ID ${id}`);
      });
  };

  // Voice search simulation
  const handleStartVoiceSearch = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
      return;
    }

    setIsVoiceRecording(true);
    if (showToast) showToast("Cryptographic Voice Capture Active. Speak now...", "info");

    voiceTimeoutRef.current = setTimeout(() => {
      setIsVoiceRecording(false);
      setSearchQuery("Raman Kalra");
      if (showToast) showToast('Voice sample processed. Match found: "Raman Kalra"', "success");
      fetch(`/api/knowledge/search?q=Raman%20Kalra`)
        .then(r => r.json())
        .then(data => {
          setSearchResults(data);
          if (data.length > 0) {
            setSelectedEntity(data[0]);
            fetchRelatedRecords(data[0].id);
          }
        });
    }, 3000);
  };

  // Graph Path Finder Highlight
  const handleFindShortestPath = () => {
    if (!pathStart || !pathEnd) {
      if (showToast) showToast("Select start and end nodes first.", "error");
      return;
    }

    // Direct mock shortest path highlighting
    setHighlightedEdges(["edge-1", "edge-2", "edge-3", "edge-4", "edge-5", "edge-6", "edge-7", "edge-8", "edge-9", "edge-10"]);
    if (showToast) showToast(`High-confidence shortest path highlighted between nodes. Relationship Strength: 9.2/10`, "success");
    addToSyncLog(`[AI] Shortest path mapped: ${pathStart} -> ${pathEnd}. Found 3 intersecting operational cells.`);
  };

  const handleResetGraph = () => {
    setHighlightedEdges([]);
    setPathStart("");
    setPathEnd("");
    setGraphZoom(1);
    setGraphPan({ x: 0, y: 0 });
    setTimelineYear(2026);
    setIsTimelinePlaying(false);
    if (showToast) showToast("Graph viewport and parameters reset to default.", "info");
  };

  const handleExploreSuggestion = (sug: AISuggestion) => {
    if (showToast) showToast(`Visualizing Suggestion: ${sug.title}`, "info");
    // highlight some specific edges and nodes
    setHighlightedEdges(["edge-1", "edge-2", "edge-9", "edge-10"]);
    setPathStart("CR-8824");
    setPathEnd("LOC-SILIGURI");
    // switch to graph panel viewport scroll
    const graphSection = document.getElementById("universal-knowledge-graph-section");
    if (graphSection) {
      graphSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`animate-in fade-in duration-500 pb-12 font-sans ${bgContainer}`}>
      
      {/* REAL-TIME SCREEN FLASHER ALARM */}
      {alarmBanner && (
        <div className="fixed top-0 left-0 w-full h-full bg-red-600/20 pointer-events-none z-50 animate-pulse border-8 border-red-600 flex flex-col items-center justify-start pt-16">
          <div className="bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-white animate-bounce pointer-events-auto">
            <AlertCircle className="w-8 h-8 animate-spin" />
            <div>
              <p className="text-lg uppercase tracking-wider">Watchlist Compromised!</p>
              <p className="text-xs font-mono">{alarmBanner}</p>
            </div>
            <button onClick={() => setAlarmBanner(null)} className="ml-4 hover:bg-red-800 p-1.5 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Archive className="w-8 h-8 text-slate-600 dark:text-slate-400" /> 
            National Knowledge Vault
          </h2>
          <p className={textSecondary}>Intelligence Archive: Central intelligence repository. Search everything.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              fetchData();
              if (showToast) showToast("Intelligence Vault Refreshed. Listening on WebSockets...", "success");
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6">
        
        {/* LEFT PANEL: NAVIGATION & DATABASE METRICS */}
        <div className="col-span-3 space-y-4 flex flex-col">
          
          {/* Navigation Links */}
          <div className={`p-4 rounded-2xl border ${bgCard} shadow-sm`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-stone-500 mb-3 px-2">Operational Hub</p>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView("search")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activeView === "search" ? "bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-yellow-300 font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-stone-800"}`}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4" />
                  <span>Search Vault</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>

              <button 
                onClick={() => setActiveView("recent")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activeView === "recent" ? "bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-yellow-300 font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-stone-800"}`}
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-4 h-4" />
                  <span>Recent Intelligence</span>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">Live</span>
              </button>

              <button 
                onClick={() => setActiveView("reports")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activeView === "reports" ? "bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-yellow-300 font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-stone-800"}`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Saved Reports</span>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">{savedReports.length}</span>
              </button>

              <button 
                onClick={() => setActiveView("favorites")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activeView === "favorites" ? "bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-yellow-300 font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-stone-800"}`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" />
                  <span>Favorite Cases</span>
                </div>
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">{favoriteCases.length}</span>
              </button>

              <button 
                onClick={() => setActiveView("watchlist")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${activeView === "watchlist" ? "bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-yellow-300 font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-stone-800"}`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4" />
                  <span>Watchlists</span>
                </div>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">{watchlist.length}</span>
              </button>
            </nav>
          </div>

          {/* Database Status */}
          <div 
            onClick={() => setIsStatsModalOpen(true)}
            className={`p-5 rounded-2xl border ${bgCard} shadow-sm cursor-pointer hover:shadow-md transition-shadow group flex flex-col flex-1`}
          >
            <h4 className="font-bold mb-4 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" /> Database Status
              </span>
              <span className="text-[10px] text-blue-500 hover:underline">Diagnostics ↗</span>
            </h4>
            <div className="space-y-4 flex-grow">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={textSecondary}>Total Records</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-gray-200">
                    {stats ? (stats.totalRecords / 1000000).toFixed(2) + "M" : "1.2M"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[82%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={textSecondary}>Active Cases</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-gray-200">
                    {stats ? stats.activeCases.toLocaleString() : "8,402"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[45%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={textSecondary}>Indexed Profiles</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-gray-200">
                    {stats ? stats.indexedProfiles.toLocaleString() : "45,910"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[73%]"></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-stone-800 mt-auto">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 font-bold text-emerald-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Sync Active (Live)
                  </div>
                  <span className="text-gray-400 font-mono text-[9px]">{stats ? `${stats.latency}ms latency` : "14ms latency"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: CORE REPOSITORY WORKSPACE */}
        <div className={`col-span-6 rounded-2xl border flex flex-col ${bgCard} shadow-sm p-6 min-h-[500px]`}>
          
          {/* VIEW: SEARCH & EXPLORER (DEFAULT) */}
          {activeView === "search" && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-4">
                
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 flex items-center justify-center mb-6 shadow-inner relative group">
                  <Archive className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 animate-pulse"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-center">Search Universal Intelligence</h3>

                {/* Search Bar Block */}
                <form onSubmit={handleGlobalSearchSubmit} className="w-full relative z-30">
                  <div className={`w-full flex items-center px-5 py-3 rounded-2xl border focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all bg-white dark:bg-stone-900 shadow-sm border-gray-200 dark:border-stone-700`}>
                    {isSearching ? (
                      <Activity className="w-5 h-5 text-emerald-500 mr-3 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 text-gray-400 mr-3" />
                    )}
                    <input 
                      type="text" 
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Case ID, suspect, Aadhaar, IMEI, vehicle..." 
                      className={`flex-1 bg-transparent border-none outline-hidden text-sm font-medium ${textMain} placeholder:text-gray-400`}
                    />
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={handleStartVoiceSearch}
                        className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors ${isVoiceRecording ? "text-red-500 animate-pulse" : "text-gray-400"}`}
                        title="Voice Identification Search"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-stone-800 text-gray-500 font-bold">⌘ K</div>
                    </div>
                  </div>

                  {/* Autocomplete Dropdown */}
                  {suggestionsDropdown.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl shadow-xl z-55 overflow-hidden">
                      <p className="text-[9px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider bg-slate-50 dark:bg-stone-900/50 border-b border-gray-100 dark:border-stone-800">Auto-Suggested Nodes</p>
                      {suggestionsDropdown.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => selectSuggestion(item)}
                          className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-stone-900 cursor-pointer flex items-center justify-between text-xs transition-colors border-b border-slate-50 dark:border-stone-900/50"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`px-1.5 py-0.5 rounded-[4px] font-bold text-[9px] ${
                              item.type === "Suspect" ? "bg-red-50 text-red-600 dark:bg-red-950/30" :
                              item.type === "Case" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30" :
                              item.type === "Evidence" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30" :
                              "bg-slate-50 text-slate-600"
                            }`}>
                              {item.type}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </form>

                {/* Category filters */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["All Data", "Cases", "Suspects", "Networks", "Evidence", "Predictions"].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all border ${
                        selectedCategory === cat 
                          ? "bg-slate-800 text-white border-slate-800 dark:bg-stone-700 dark:text-yellow-300 dark:border-stone-600" 
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-stone-900 dark:border-stone-800 text-slate-600 dark:text-gray-400 hover:dark:bg-stone-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Voice search waves */}
                {isVoiceRecording && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <span className="text-xs font-mono text-red-500 animate-pulse">Recording phonetic profile...</span>
                    <div className="flex gap-0.5 items-end h-4">
                      <div className="w-0.5 bg-red-500 animate-[bounce_1s_infinite_100ms] h-3"></div>
                      <div className="w-0.5 bg-red-500 animate-[bounce_1s_infinite_300ms] h-4"></div>
                      <div className="w-0.5 bg-red-500 animate-[bounce_1s_infinite_500ms] h-2"></div>
                      <div className="w-0.5 bg-red-500 animate-[bounce_1s_infinite_200ms] h-3.5"></div>
                    </div>
                  </div>
                )}

                {/* Advanced Filters Trigger */}
                <div className="mt-5 w-full flex justify-center">
                  <button 
                    type="button"
                    onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    <Filter className="w-3 h-3" />
                    {isAdvancedFiltersOpen ? "Hide Advanced Search Filters" : "Show Advanced Search Filters"}
                  </button>
                </div>

                {/* Advanced Filters Options */}
                {isAdvancedFiltersOpen && (
                  <div className="w-full mt-4 p-4 border border-dashed border-gray-200 dark:border-stone-800 rounded-xl bg-slate-50/50 dark:bg-stone-950/20 grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Risk Threshold</label>
                      <select 
                        value={filterRiskScore}
                        onChange={(e) => setFilterRiskScore(Number(e.target.value))}
                        className="p-1.5 border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded text-xs"
                      >
                        <option value={0}>All Risk Levels</option>
                        <option value={50}>Above 50% Risk</option>
                        <option value={80}>Above 80% (Critical)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Investigation Status</label>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-1.5 border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded text-xs"
                      >
                        <option value="">Any Status</option>
                        <option value="UNDER INVESTIGATION">Under Investigation</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SECURED">Secured</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">District/Corridor</label>
                      <select 
                        value={filterDistrict}
                        onChange={(e) => setFilterDistrict(e.target.value)}
                        className="p-1.5 border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded text-xs"
                      >
                        <option value="">Any Sector</option>
                        <option value="Siliguri">Siliguri Sector</option>
                        <option value="Latehar">Latehar Sector</option>
                        <option value="Katihar">Katihar Junction</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                <div className="w-full mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent Searches:</span>
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(() => handleGlobalSearchSubmit(), 50);
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-slate-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {term}
                    </button>
                  ))}
                </div>

              </div>

              {/* SEARCH RESULTS LEDGER SECTION */}
              {searchResults.length > 0 && (
                <div className="border-t border-gray-100 dark:border-stone-800 pt-6 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-stone-500">Authenticated Match Ledger ({searchResults.length})</h4>
                    <button onClick={() => setSearchResults([])} className="text-xs text-red-500 hover:underline">Clear Results</button>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {searchResults
                      .filter(e => {
                        if (filterRiskScore && e.riskScore < filterRiskScore) return false;
                        if (filterStatus && e.status !== filterStatus) return false;
                        if (filterDistrict && e.details?.district !== filterDistrict && e.details?.origin !== filterDistrict) return false;
                        return true;
                      })
                      .map(item => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            setSelectedEntity(item);
                            fetchRelatedRecords(item.id);
                          }}
                          className={`p-4 border rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all ${
                            selectedEntity?.id === item.id 
                              ? "bg-slate-50 border-slate-300 dark:bg-stone-850 dark:border-stone-700" 
                              : "bg-white dark:bg-stone-900 border-gray-100 dark:border-stone-800"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  item.type === "Suspect" ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40" :
                                  item.type === "Case" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40" :
                                  item.type === "Evidence" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40" :
                                  "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                                }`}>
                                  {item.type}
                                </span>
                                <span className="font-bold text-sm text-slate-800 dark:text-gray-200">{item.name}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono">{item.id}</span>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                                item.riskScore > 90 ? "bg-red-100 text-red-700" :
                                item.riskScore > 70 ? "bg-amber-100 text-amber-700" :
                                "bg-emerald-100 text-emerald-700"
                              }`}>
                                Risk: {item.riskScore}%
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-gray-400 grid grid-cols-2 gap-2 mt-2 bg-slate-50/50 dark:bg-stone-950/40 p-2 rounded-lg font-mono">
                            {Object.entries(item.details).slice(0, 4).map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-[9px] text-gray-400 uppercase mr-1">{k}:</span>
                                <span className="text-slate-700 dark:text-gray-300">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW: RECENT INTELLIGENCE LIVE FEED */}
          {activeView === "recent" && (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-yellow-300">
                  <Activity className="w-5 h-5 text-blue-500 animate-pulse" /> Live Intelligence Feed
                </h3>
                <span className="text-xs bg-slate-100 dark:bg-stone-800 text-slate-500 px-2 py-0.5 rounded font-mono">Auto-Sync Enabled</span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar flex-1">
                {recentFeed
                  .filter(f => f.status !== "deleted")
                  .map(feedItem => (
                    <div 
                      key={feedItem.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        feedItem.status === "archived" ? "bg-gray-100/50 border-gray-200 opacity-60" :
                        feedItem.status === "pinned" ? "bg-blue-50/40 border-blue-200" :
                        "bg-white dark:bg-stone-900 border-gray-100 dark:border-stone-800"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            feedItem.category === "alert" ? "bg-red-500 animate-ping" :
                            feedItem.category === "case" ? "bg-blue-500" :
                            feedItem.category === "evidence" ? "bg-amber-500" :
                            "bg-purple-500"
                          }`}></span>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-gray-100">{feedItem.title}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{feedItem.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-gray-300 mb-3">{feedItem.summary}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-stone-800/30">
                        <span className="text-[9px] text-gray-400 font-mono">By: {feedItem.officer}</span>
                        <div className="flex items-center gap-2">
                          {/* Pin Toggle */}
                          <button 
                            onClick={() => handleUpdateRecentStatus(feedItem.id, feedItem.status === "pinned" ? "active" : "pinned")}
                            className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${feedItem.status === "pinned" ? "bg-blue-100 text-blue-700" : "hover:bg-slate-100 text-gray-400"}`}
                          >
                            Pin
                          </button>
                          {/* Bookmark Toggle */}
                          <button 
                            onClick={() => handleBookmarkRecent(feedItem.id)}
                            className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${feedItem.bookmarked ? "bg-amber-100 text-amber-700" : "hover:bg-slate-100 text-gray-400"}`}
                          >
                            {feedItem.bookmarked ? "Bookmarked" : "Bookmark"}
                          </button>
                          {/* Archive/Restore */}
                          <button 
                            onClick={() => handleUpdateRecentStatus(feedItem.id, feedItem.status === "archived" ? "active" : "archived")}
                            className="text-[10px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            {feedItem.status === "archived" ? "Restore" : "Archive"}
                          </button>
                          {/* Delete */}
                          <button 
                            onClick={() => handleUpdateRecentStatus(feedItem.id, "deleted")}
                            className="text-[10px] text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SAVED REPORTS DMS */}
          {activeView === "reports" && (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-yellow-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" /> Document Management System
                </h3>
                <button 
                  onClick={() => setIsCreateReportOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Report
                </button>
              </div>

              {!activeReportToEdit ? (
                <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar flex-1">
                  {savedReports.map(report => (
                    <div 
                      key={report.id}
                      onClick={() => setActiveReportToEdit(report)}
                      className="p-4 bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all flex justify-between items-start"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {report.type}
                          </span>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-gray-200">{report.title}</h4>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono">Report ID: {report.id} • v{report.version} • {report.size}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {report.tags.map((t, i) => (
                            <span key={i} className="text-[9px] bg-slate-100 dark:bg-stone-800 text-slate-500 px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          report.status === "Signed" ? "bg-amber-100 text-amber-700" :
                          report.status === "Approved" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">{report.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col flex-1 bg-slate-50/50 dark:bg-stone-950/30 p-4 rounded-xl border border-gray-200 dark:border-stone-800">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-stone-800 mb-4">
                    <div>
                      <button onClick={() => setActiveReportToEdit(null)} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline mb-1 flex items-center gap-1">
                        ← Back to DMS Ledger
                      </button>
                      <h4 className="font-bold text-base text-slate-800 dark:text-gray-100">{activeReportToEdit.title}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">DMS UID: {activeReportToEdit.id} • Version {activeReportToEdit.version}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {activeReportToEdit.status}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 mb-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Document Content</label>
                    <textarea 
                      value={activeReportToEdit.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setActiveReportToEdit(prev => prev ? { ...prev, content: val } : null);
                        // Debounced / Simple auto-save on change
                        handleAutoSaveReport(activeReportToEdit.id, val);
                      }}
                      className="w-full h-36 p-3 border border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-lg text-xs leading-relaxed custom-scrollbar font-mono"
                    />

                    {/* Signature block */}
                    {activeReportToEdit.signature ? (
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg font-mono text-[10px]">
                        <p className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" /> Authenticated Digital Signature Applied
                        </p>
                        <p className="mt-1">Signed By: {activeReportToEdit.signature.signedBy}</p>
                        <p>Timestamp: {new Date(activeReportToEdit.signature.timestamp).toLocaleString()}</p>
                        <p className="text-gray-400 truncate">SHA256: {activeReportToEdit.signature.hash}</p>
                      </div>
                    ) : (
                      <div className="p-3 border border-dashed border-gray-300 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-lg flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Apply Laboratory Signature</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={sigName}
                            onChange={(e) => setSigName(e.target.value)}
                            placeholder="Signatory Name & Rank"
                            className="flex-1 p-1.5 border border-slate-200 dark:border-stone-800 text-xs rounded bg-slate-50 dark:bg-stone-950"
                          />
                          <button 
                            type="button"
                            onClick={() => handleSignReport(activeReportToEdit.id)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Key className="w-3 h-3" /> Sign Document
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Version History */}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Document Audit Trail</p>
                      <div className="space-y-1.5 max-h-[80px] overflow-y-auto mt-1 border border-slate-200 dark:border-stone-800 p-2 rounded bg-white dark:bg-stone-950 custom-scrollbar font-mono text-[9px]">
                        {activeReportToEdit.versionHistory.map((hist, idx) => (
                          <div key={idx} className="flex justify-between border-b border-gray-100 dark:border-stone-900 pb-1 text-gray-600 dark:text-gray-400">
                            <span>v{hist.version} - {hist.changes}</span>
                            <span>{hist.author} • {hist.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-stone-800">
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeReportToEdit));
                          const dlAnchor = document.createElement('a');
                          dlAnchor.setAttribute("href", dataStr);
                          dlAnchor.setAttribute("download", `INT-REPORT-${activeReportToEdit.id}.json`);
                          dlAnchor.click();
                          if (showToast) showToast("DMS Node exported locally.", "success");
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Export Document
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          window.print();
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                    </div>

                    {activeReportToEdit.status === "Draft" && (
                      <button 
                        type="button"
                        onClick={() => handleApproveReport(activeReportToEdit.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Request approval
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW: FAVORITE CASES */}
          {activeView === "favorites" && (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-yellow-300 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Smart Case Bookmark Diary
                </h3>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar flex-1">
                {favoriteCases.map(favCase => (
                  <div key={favCase.id} className="p-4 bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-gray-100">{favCase.title}</h4>
                        <p className="text-[10px] text-gray-400 font-mono">Case UID: {favCase.id} • Assigned to: {favCase.assignedOfficer}</p>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                        favCase.priority === "CRITICAL" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {favCase.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {favCase.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-100 dark:border-amber-900 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Notes (Autosaves) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Personal Notes & Hypothesis</label>
                      <textarea 
                        defaultValue={favCase.personalNotes}
                        onBlur={(e) => handleSaveNotes(favCase.id, e.target.value)}
                        className="w-full h-16 p-2 text-xs border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 rounded font-mono"
                        placeholder="Type hypotheses here... (saves automatically on click away)"
                      />
                    </div>

                    {/* Reminder & Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-stone-800/30">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-gray-400 font-bold">Next Reminder:</span>
                        <input 
                          type="date" 
                          defaultValue={favCase.reminderDate}
                          onChange={(e) => handleSaveReminder(favCase.id, e.target.value)}
                          className="bg-transparent border-none text-slate-800 dark:text-gray-200 text-xs font-mono font-bold"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          // Quick match in bottom graph by centering node
                          setPathStart(favCase.id);
                          if (showToast) showToast(`Locating Case node: ${favCase.id} on Knowledge Graph.`, "info");
                          const graphSection = document.getElementById("universal-knowledge-graph-section");
                          if (graphSection) graphSection.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        Locate in Node Explorer →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: WATCHLISTS */}
          {activeView === "watchlist" && (
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-yellow-300 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-red-500 animate-pulse" /> Security Watchlists Monitor
                </h3>
                <button 
                  onClick={() => setIsAddWatchlistOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Register Target
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[420px] pr-2 custom-scrollbar flex-1">
                {watchlist.map(watchItem => (
                  <div key={watchItem.id} className="p-4 bg-white dark:bg-stone-900 border border-gray-100 dark:border-stone-800 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          watchItem.status === "TRIGGERED" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                        }`}>
                          {watchItem.status}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-gray-100 font-mono">{watchItem.value}</h4>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">Target UID: {watchItem.id} • Category: {watchItem.type} • Added: {watchItem.addedDate}</p>
                      
                      {watchItem.lastMatch && (
                        <p className="text-[10px] text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/25 p-2 rounded-lg border border-red-100 dark:border-red-900/50 font-mono">
                          🚨 {watchItem.lastMatch}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {watchItem.tags.map((t, i) => (
                          <span key={i} className="text-[9px] bg-slate-100 dark:bg-stone-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-gray-300">
                        {watchItem.alertCount} Alerts
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleTriggerWatchAlert(watchItem.id)}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors animate-pulse"
                      >
                        <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Trigger Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: CONNECTIONS, NETWORKS & AI RECOMMENDATIONS */}
        <div className="col-span-3 space-y-4 flex flex-col">
          
          {/* Related Records */}
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-500" /> Related Records
              </span>
              <span className="text-[9px] font-mono text-slate-400">Match Accuracy</span>
            </h4>
            
            <div className="space-y-3">
              {relatedRecords.map(rel => (
                <div 
                  key={rel.id}
                  onClick={() => {
                    const matchedNode = graphData.nodes.find(n => n.id === rel.targetId);
                    if (matchedNode) {
                      setSelectedEntity(matchedNode);
                      setSearchQuery(matchedNode.name);
                      setActiveView("search");
                    }
                  }}
                  className="p-2.5 border border-transparent hover:border-slate-100 dark:hover:border-stone-800 rounded-lg hover:bg-slate-50/50 dark:hover:bg-stone-950/20 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">{rel.targetName}</p>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">{rel.similarity}%</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">Category: {rel.type} • Conf: {rel.confidence}%</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rel.sharedAttributes.map((attr, idx) => (
                      <span key={idx} className="text-[8px] bg-slate-100 dark:bg-stone-800 text-slate-500 px-1 py-0.5 rounded font-mono truncate max-w-[120px]">{attr}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Networks */}
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm`}>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-500" /> Linked Syndicates
            </h4>
            <div className="space-y-2.5">
              {graphData.nodes.filter(n => n.type === "Network").map(net => (
                <div 
                  key={net.id}
                  className="p-2.5 border border-purple-100/50 dark:border-purple-900/30 bg-purple-50/10 dark:bg-purple-950/5 rounded-xl text-xs relative group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-purple-700 dark:text-purple-400">{net.name}</span>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-mono font-bold px-1.5 py-0.5 rounded">Risk: {net.riskScore}%</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-mono truncate">HQ: {net.details.hq || "Eastern sector"}</p>
                  
                  {/* Hover Dossier Popup */}
                  <div className="absolute left-[-210px] top-0 w-48 p-3 bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 shadow-2xl rounded-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-200">
                    <p className="font-bold text-[10px] text-purple-800 uppercase tracking-wider mb-1">Syndicate Dossier</p>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-2">{net.name}</p>
                    <p className="text-[10px] text-slate-600 dark:text-gray-400 leading-normal font-mono">
                      Routes: {net.details.routeCovered || "Standard border trails"}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-gray-400 leading-normal font-mono mt-1">
                      Members: {net.details.memberCount || "12 active cells"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions with Explainable reasoning */}
          <div className={`p-5 rounded-2xl border ${bgCard} shadow-sm bg-blue-50/50 dark:bg-blue-950/10 flex-1`}>
             <h4 className="font-bold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <BrainCircuit className="w-4 h-4 text-emerald-500 animate-pulse" /> AI Suggestions & Tactics
            </h4>
            
            <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
              {suggestions.map(sug => (
                <div key={sug.id} className="p-2 border-l-2 border-emerald-500 pl-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-gray-200 leading-normal">{sug.title}</p>
                    <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-100/50 px-1 py-0.5 rounded">{sug.confidence}% Conf</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 leading-normal font-sans italic">Why generated: {sug.why}</p>
                  <p className="text-[10px] text-slate-600 dark:text-gray-300 leading-normal font-mono bg-white dark:bg-stone-950/30 p-1.5 rounded mt-1 border border-slate-100 dark:border-stone-900">
                    🎯 Recommendation: {sug.recommendedAction}
                  </p>
                  <button 
                    type="button"
                    onClick={() => handleExploreSuggestion(sug)}
                    className="text-[9px] text-blue-600 dark:text-blue-400 font-bold hover:underline block pt-1"
                  >
                    Explore connection node ↗
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM: INTERACTIVE NE04J-STYLE UNIVERSAL KNOWLEDGE GRAPH */}
      <div 
        id="universal-knowledge-graph-section"
        className={`p-6 rounded-2xl border ${bgCard} shadow-sm overflow-hidden relative`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h4 className="font-bold flex items-center gap-2 text-slate-800 dark:text-yellow-300">
              <Network className="w-5 h-5 text-emerald-500 animate-pulse" /> Universal Knowledge Graph
            </h4>
            <p className="text-xs text-slate-400">Interact with the real-time Neo4j network database. Filter node layers and trace shortest path links.</p>
          </div>

          {/* Graph Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-stone-900 p-2 rounded-xl border border-gray-200 dark:border-stone-800 text-xs font-mono">
            {/* Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Filter:</span>
              <select 
                value={graphFilterType}
                onChange={(e) => setGraphFilterType(e.target.value)}
                className="bg-white dark:bg-stone-950 p-1 rounded border border-gray-200 text-[11px]"
              >
                <option value="all">All Layers</option>
                <option value="Case">Cases</option>
                <option value="Suspect">Suspects</option>
                <option value="Evidence">Evidence</option>
                <option value="Location">Locations</option>
              </select>
            </div>

            {/* Path Finder */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Path:</span>
              <select 
                value={pathStart}
                onChange={(e) => setPathStart(e.target.value)}
                className="bg-white dark:bg-stone-950 p-1 rounded border border-gray-200 text-[11px] max-w-[80px]"
              >
                <option value="">Start</option>
                {graphData.nodes.map(n => <option key={n.id} value={n.id}>{n.name.substring(0, 15)}...</option>)}
              </select>
              <span className="text-gray-400">→</span>
              <select 
                value={pathEnd}
                onChange={(e) => setPathEnd(e.target.value)}
                className="bg-white dark:bg-stone-950 p-1 rounded border border-gray-200 text-[11px] max-w-[80px]"
              >
                <option value="">End</option>
                {graphData.nodes.map(n => <option key={n.id} value={n.id}>{n.name.substring(0, 15)}...</option>)}
              </select>
              <button 
                type="button"
                onClick={handleFindShortestPath}
                className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded"
              >
                Find Path
              </button>
            </div>

            {/* Playback simulation */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-300 dark:border-stone-800">
              <button 
                type="button"
                onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                title="Simulation over years"
              >
                {isTimelinePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                Timeline [{timelineYear}]
              </button>
            </div>

            <button 
              type="button" 
              onClick={handleResetGraph}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded"
              title="Reset Zoom / Pan / Path"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Zoom / Pan viewport control sliders */}
        <div className="absolute right-6 bottom-6 z-10 flex flex-col gap-2 bg-white/80 dark:bg-stone-950/80 p-3 rounded-xl border border-gray-200 dark:border-stone-800 shadow-lg">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="w-8">Zoom:</span>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={graphZoom} 
              onChange={(e) => setGraphZoom(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="w-8">Pan X:</span>
            <input 
              type="range" 
              min="-150" 
              max="150" 
              value={graphPan.x} 
              onChange={(e) => setGraphPan(prev => ({ ...prev, x: Number(e.target.value) }))}
              className="w-20"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="w-8">Pan Y:</span>
            <input 
              type="range" 
              min="-150" 
              max="150" 
              value={graphPan.y} 
              onChange={(e) => setGraphPan(prev => ({ ...prev, y: Number(e.target.value) }))}
              className="w-20"
            />
          </div>
        </div>

        {/* RENDER GRAPH CANVAS (SVG-BASED HIGH PERFORMANCE NETWORK) */}
        <div className="w-full h-[320px] bg-slate-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-900 rounded-2xl overflow-hidden relative flex items-center justify-center">
          
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 800 400"
            className="select-none cursor-grab active:cursor-grabbing"
          >
            <defs>
              <marker id="arrowhead" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
              </marker>
              <marker id="arrowhead-highlight" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* Viewport Transform Group */}
            <g transform={`translate(${400 + graphPan.x}, ${200 + graphPan.y}) scale(${graphZoom})`}>
              
              {/* Relationship Links (Edges) */}
              {graphData.edges.map(edge => {
                // Approximate coordinate mapping for mock visualization
                const coordinatesMap: Record<string, { x: number; y: number }> = {
                  "CR-8824": { x: -220, y: -60 },
                  "CR-4029": { x: 220, y: -60 },
                  "CASE-992": { x: -120, y: 80 },
                  "CASE-1042": { x: 120, y: 80 },
                  "NET-R66": { x: -300, y: 10 },
                  "NET-SYNA": { x: 300, y: 10 },
                  "EVI-992-A": { x: -20, y: 130 },
                  "EVI-104-D": { x: 20, y: 130 },
                  "RC-2041": { x: -140, y: -130 },
                  "RC-2042": { x: 140, y: -130 },
                  "LOC-SILIGURI": { x: -280, y: -140 }
                };

                const sourceCoord = coordinatesMap[edge.source] || { x: 0, y: 0 };
                const targetCoord = coordinatesMap[edge.target] || { x: 0, y: 0 };
                const isHighlighted = highlightedEdges.includes(edge.id) || pathStart === edge.source || pathEnd === edge.target;

                // Adjust nodes based on year filter in playback mode
                if (isTimelinePlaying) {
                  const nodeYear: Record<string, number> = {
                    "CR-8824": 2020, "CR-4029": 2022, "CASE-992": 2024, "CASE-1042": 2024,
                    "NET-R66": 2020, "NET-SYNA": 2022, "EVI-992-A": 2026, "EVI-104-D": 2026,
                    "RC-2041": 2026, "RC-2042": 2026, "LOC-SILIGURI": 2020
                  };
                  if (nodeYear[edge.source] > timelineYear || nodeYear[edge.target] > timelineYear) {
                    return null;
                  }
                }

                return (
                  <g key={edge.id}>
                    <line 
                      x1={sourceCoord.x} 
                      y1={sourceCoord.y} 
                      x2={targetCoord.x} 
                      y2={targetCoord.y} 
                      stroke={isHighlighted ? "#f59e0b" : "#cbd5e1"} 
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      strokeDasharray={edge.confidence < 90 ? "4 4" : "none"}
                      markerEnd={isHighlighted ? "url(#arrowhead-highlight)" : "url(#arrowhead)"}
                      className="transition-all"
                    />
                    {/* Tiny relationship label */}
                    <text 
                      x={(sourceCoord.x + targetCoord.x) / 2} 
                      y={(sourceCoord.y + targetCoord.y) / 2 - 4} 
                      textAnchor="middle" 
                      fill={isHighlighted ? "#d97706" : "#94a3b8"}
                      className="text-[7px] font-mono select-none"
                    >
                      {edge.relationship}
                    </text>
                  </g>
                );
              })}

              {/* Nodes (Entities) */}
              {graphData.nodes
                .filter(node => graphFilterType === "all" || node.type === graphFilterType)
                .map(node => {
                  const coordinatesMap: Record<string, { x: number; y: number }> = {
                    "CR-8824": { x: -220, y: -60 },
                    "CR-4029": { x: 220, y: -60 },
                    "CASE-992": { x: -120, y: 80 },
                    "CASE-1042": { x: 120, y: 80 },
                    "NET-R66": { x: -300, y: 10 },
                    "NET-SYNA": { x: 300, y: 10 },
                    "EVI-992-A": { x: -20, y: 130 },
                    "EVI-104-D": { x: 20, y: 130 },
                    "RC-2041": { x: -140, y: -130 },
                    "RC-2042": { x: 140, y: -130 },
                    "LOC-SILIGURI": { x: -280, y: -140 }
                  };

                  const coord = coordinatesMap[node.id] || { x: 0, y: 0 };
                  const isSelected = selectedEntity?.id === node.id;
                  const isShortestPathEndpoint = pathStart === node.id || pathEnd === node.id;

                  // Timeline mode chronological mask
                  if (isTimelinePlaying) {
                    const nodeYear: Record<string, number> = {
                      "CR-8824": 2020, "CR-4029": 2022, "CASE-992": 2024, "CASE-1042": 2024,
                      "NET-R66": 2020, "NET-SYNA": 2022, "EVI-992-A": 2026, "EVI-104-D": 2026,
                      "RC-2041": 2026, "RC-2042": 2026, "LOC-SILIGURI": 2020
                    };
                    if (nodeYear[node.id] > timelineYear) return null;
                  }

                  // Determine colors based on type
                  let colorFill = "#3b82f6"; // case
                  let colorStroke = "#2563eb";
                  if (node.type === "Suspect") {
                    colorFill = "#f43f5e";
                    colorStroke = "#e11d48";
                  } else if (node.type === "Evidence") {
                    colorFill = "#f59e0b";
                    colorStroke = "#d97706";
                  } else if (node.type === "Network") {
                    colorFill = "#a855f7";
                    colorStroke = "#9333ea";
                  } else if (node.type === "Location") {
                    colorFill = "#10b981";
                    colorStroke = "#059669";
                  }

                  return (
                    <g 
                      key={node.id} 
                      transform={`translate(${coord.x}, ${coord.y})`}
                      onClick={() => {
                        setSelectedEntity(node);
                        fetchRelatedRecords(node.id);
                        if (showToast) showToast(`Centered node on dashboard: ${node.name}`, "info");
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Selection Highlight Ring */}
                      {(isSelected || isShortestPathEndpoint) && (
                        <circle r="19" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-ping" />
                      )}
                      
                      {/* Main Node body */}
                      <circle 
                        r={isSelected ? "14" : "11"} 
                        fill={colorFill} 
                        stroke={colorStroke} 
                        strokeWidth="2" 
                        className="transition-all hover:scale-125"
                      />

                      {/* Icon initials inside circle */}
                      <text 
                        y="3.5" 
                        textAnchor="middle" 
                        fill="white" 
                        className="text-[8px] font-bold select-none pointer-events-none"
                      >
                        {node.type.substring(0, 2)}
                      </text>

                      {/* Label below node */}
                      <text 
                        y={isSelected ? "25" : "22"} 
                        textAnchor="middle" 
                        fill={highContrast ? "#fcd34d" : "#1e293b"}
                        className={`text-[8px] font-bold pointer-events-none select-none drop-shadow-sm ${
                          isSelected ? "text-[10px]" : ""
                        }`}
                      >
                        {node.name.length > 18 ? node.name.substring(0, 15) + "..." : node.name}
                      </text>
                      <text 
                        y={isSelected ? "34" : "30"} 
                        textAnchor="middle" 
                        fill="#94a3b8"
                        className="text-[6px] pointer-events-none select-none font-mono"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
              })}

            </g>
          </svg>

          {/* Quick HUD overlay in graph */}
          <div className="absolute left-4 top-4 bg-white/95 dark:bg-stone-900/95 p-3 rounded-xl border border-gray-100 dark:border-stone-850 shadow-md max-w-xs font-mono text-[9px] space-y-1">
            <p className="font-bold text-gray-500 uppercase tracking-widest text-[8px] mb-1">Active Entity Dossier</p>
            {selectedEntity ? (
              <>
                <p className="font-bold text-slate-800 dark:text-gray-100 text-[10px] truncate">{selectedEntity.name}</p>
                <p>ID: {selectedEntity.id} • Type: {selectedEntity.type}</p>
                <p>Risk Score: <span className="font-bold text-red-500">{selectedEntity.riskScore}%</span></p>
                <p className="text-gray-400 mt-1 leading-relaxed truncate">{selectedEntity.details?.description || selectedEntity.details?.behavioralProfile || "No secondary notes recorded."}</p>
              </>
            ) : (
              <p className="text-gray-400">Click any node on the network map to parse dossier telemetry...</p>
            )}
          </div>
        </div>

      </div>

      {/* MODAL: FULL DATABASE DIAGNOSTIC PANEL */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full p-6 border border-gray-100 dark:border-stone-800 shadow-2xl relative">
            <button 
              onClick={() => setIsStatsModalOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-100 dark:hover:bg-stone-800 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-xl text-slate-800 dark:text-yellow-300 flex items-center gap-2 mb-4 border-b pb-3 border-gray-100 dark:border-stone-800">
              <Database className="w-5 h-5 text-emerald-500 animate-pulse" /> National Security Registry Analytics
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-slate-50 dark:bg-stone-950 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Storage Diagnostics</p>
                <div className="flex justify-between items-end">
                  <span className="font-mono text-xs text-slate-600 dark:text-gray-300">Disk Used: {stats?.storageUsage || "78.4 / 120 TB"}</span>
                  <span className="font-bold text-emerald-500 text-xs">65.3%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[65.3%]"></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-stone-950 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-Systems & APIs</p>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>API Health: <span className="text-emerald-500 font-bold">{stats?.apiHealth || "EXCELLENT"}</span></span>
                  <span>Ping: <span className="font-bold text-blue-500">{stats ? stats.latency : 14}ms</span></span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  All Gateway systems fully operational.
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Connected Intelligence Bureaus</p>
              <div className="flex flex-wrap gap-2">
                {(stats?.connectedAgencies || ["CBI", "NIA", "Interpol", "UP Police STF"]).map((agency, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-lg">{agency}</span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live System Sync Ticker</p>
              <div className="h-32 bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] overflow-y-auto custom-scrollbar flex flex-col-reverse gap-1 border border-stone-800">
                {syncLog.map((log, i) => (
                  <div key={i} className="truncate">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SAVED REPORT FORM */}
      {isCreateReportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateReportSubmit} className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 border border-gray-100 dark:border-stone-800 shadow-2xl relative space-y-4">
            <button 
              type="button"
              onClick={() => setIsCreateReportOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-100 dark:hover:bg-stone-800 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 dark:text-yellow-300 border-b pb-2">Compile Intelligence Report</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Document Title</label>
                <input 
                  type="text" 
                  required
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  placeholder="e.g. Siliguri Spatial Audit"
                  className="p-2 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Document Type</label>
                <select 
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="p-2 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg"
                >
                  <option value="AI Report">AI Synthesis</option>
                  <option value="PDF">PDF Audit Report</option>
                  <option value="Evidence Package">Evidence Package Brief</option>
                  <option value="Excel">Excel Spreadsheet</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Tags (comma-separated)</label>
              <input 
                type="text" 
                value={newReportTags}
                onChange={(e) => setNewReportTags(e.target.value)}
                placeholder="e.g. Profiling, Raman Kalra, Siliguri"
                className="p-2 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Findings & Recommendations</label>
              <textarea 
                required
                value={newReportContent}
                onChange={(e) => setNewReportContent(e.target.value)}
                placeholder="Include intelligence telemetry, tower matches, biometric overlays..."
                className="p-3 h-28 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg custom-scrollbar font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button 
                type="button" 
                onClick={() => setIsCreateReportOpen(false)}
                className="px-3 py-1.5 border rounded text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
              >
                Save Report Draft
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: REGISTER MONITORED WATCHLIST TARGET */}
      {isAddWatchlistOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddWatchlistSubmit} className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-stone-800 shadow-2xl relative space-y-4">
            <button 
              type="button"
              onClick={() => setIsAddWatchlistOpen(false)}
              className="absolute top-4 right-4 hover:bg-slate-100 dark:hover:bg-stone-800 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-lg text-slate-800 dark:text-yellow-300 border-b pb-2">Register Monitored Target</h3>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Target Category</label>
              <select 
                value={newWatchType}
                onChange={(e) => setNewWatchType(e.target.value)}
                className="p-2 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg"
              >
                <option value="Suspect">Suspect Name</option>
                <option value="Vehicle">Vehicle License Plate</option>
                <option value="Phone Number">Phone SIM (IMEI / Number)</option>
                <option value="Location">Transit Location Node</option>
                <option value="Organization">NGO / Entity</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Target Value / Identifier</label>
              <input 
                type="text" 
                required
                value={newWatchValue}
                onChange={(e) => setNewWatchValue(e.target.value)}
                placeholder="e.g. Raman Kalra, DL-3C-AQ-8824"
                className="p-2 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Target Risk Coefficient ({newWatchRisk}%)</label>
              <input 
                type="range" 
                min="40" 
                max="98" 
                value={newWatchRisk}
                onChange={(e) => setNewWatchRisk(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Tags (comma-separated)</label>
              <input 
                type="text" 
                value={newWatchTags}
                onChange={(e) => setNewWatchTags(e.target.value)}
                placeholder="e.g. Route 66, Burner, Critical"
                className="p-2 border border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-950 text-xs rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button 
                type="button" 
                onClick={() => setIsAddWatchlistOpen(false)}
                className="px-3 py-1.5 border rounded text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg"
              >
                Register Target
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
