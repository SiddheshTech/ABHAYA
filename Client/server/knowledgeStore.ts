import { randomUUID } from "crypto";

export interface KnowledgeEntity {
  id: string;
  type: 'Case' | 'Suspect' | 'Victim' | 'Child' | 'Evidence' | 'Network' | 'Vehicle' | 'Location' | 'Prediction' | 'Officer' | 'Document' | 'Organization';
  name: string;
  status: string;
  riskScore: number;
  details: Record<string, any>;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  confidence: number;
  strength: number; // 1-10
  details: Record<string, any>;
}

export interface RecentIntelligenceItem {
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

export interface SavedReport {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'CSV' | 'PPT' | 'Excel' | 'AI Report' | 'Summary' | 'Evidence Package';
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

export interface FavoriteCase {
  id: string; // matches Case ID
  title: string;
  tags: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  personalNotes: string;
  reminderDate?: string;
  assignedOfficer: string;
  lastUpdated: string;
  timeline: Array<{ date: string; event: string; officer: string }>;
}

export interface WatchlistItem {
  id: string;
  type: 'Suspect' | 'Vehicle' | 'Organization' | 'Network' | 'Child' | 'Location' | 'Phone Number' | 'Account' | 'Social Profile' | 'Financial Record' | 'Evidence';
  value: string;
  status: 'MONITORING' | 'TRIGGERED' | 'SUSPENDED';
  addedDate: string;
  alertCount: number;
  tags: string[];
  riskScore: number;
  lastMatch?: string;
}

export interface KnowledgeStats {
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
  apiHealth: 'EXCELLENT' | 'STABLE' | 'DEGRADED';
  serverStatus: 'OPERATIONAL' | 'MAINTENANCE' | 'ALERT';
  storageUsage: string; // e.g., "74.8 TB / 120 TB"
  latency: number; // ms
  lastSync: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  type: 'connection' | 'route' | 'behavior' | 'prediction' | 'anomaly' | 'missing_evidence';
  confidence: number;
  why: string;
  supportingEvidence: string[];
  recommendedAction: string;
  reasoning: string;
}

export interface RelatedRecord {
  id: string;
  targetId: string;
  targetName: string;
  type: 'Case' | 'Suspect' | 'Victim' | 'Evidence' | 'Network' | 'Location' | 'Device' | 'Vehicle' | 'Phone Number' | 'Financial Activity';
  similarity: number;
  confidence: number;
  sharedAttributes: string[];
  lastActivity: string;
}

export class KnowledgeStore {
  entities: KnowledgeEntity[] = [
    {
      id: "CASE-992",
      type: "Case",
      name: "Siliguri Corridor Child Trafficking Interdiction",
      status: "UNDER INVESTIGATION",
      riskScore: 92,
      details: {
        firNumber: "FIR-2024-88A",
        district: "Siliguri",
        policeStation: "Pradhan Nagar PS",
        leadOfficer: "Inspector Devendra Sharma",
        ngoPartner: "Bachpan Bachao Andolan",
        shelter: "SafeHaven, Mumbai",
        timeline: "2026-06-10 to 2026-06-26",
        description: "Operation targeting cross-border trafficking channels routing minors through northern tea estates into domestic industries."
      }
    },
    {
      id: "CASE-1042",
      type: "Case",
      name: "Latehar Tribal Minor Exploitation Ring",
      status: "UNDER INVESTIGATION",
      riskScore: 88,
      details: {
        firNumber: "FIR-2025-104",
        district: "Latehar",
        policeStation: "Latehar Town PS",
        leadOfficer: "ASP Sandeep Kujur",
        ngoPartner: "CINI India",
        shelter: "Hope Center, Delhi",
        timeline: "2026-05-15 to 2026-06-26",
        description: "Drought exploitation ring targetting children of distressed farm laborers, providing fake educational promises."
      }
    },
    {
      id: "CASE-203",
      type: "Case",
      name: "Eastern Sector Financial Coercion Sweep",
      status: "OPEN",
      riskScore: 78,
      details: {
        firNumber: "FIR-2026-203",
        district: "Katihar",
        policeStation: "Katihar Junction PS",
        leadOfficer: "DSP Arundhati Sen",
        ngoPartner: "Childline India",
        shelter: "Aashray, Pune",
        timeline: "2026-06-01 to 2026-06-26",
        description: "Investigation into Hawala transactions funding transit safe houses and logistics across Bihar borderlands."
      }
    },
    {
      id: "CR-8824",
      type: "Suspect",
      name: "Raman Kalra",
      status: "CRITICAL",
      riskScore: 94,
      details: {
        alias: "Slick",
        aadhaar: "4520 8891 1024",
        passport: "PP-IND-8824-X",
        phone: "+91 98124 55321",
        email: "r.kalra@shadowmail.net",
        vehicle: "DL-3C-AQ-8824",
        imei: "IMEI-8824-00192",
        deviceId: "DEV-MOTO-8824",
        ipAddress: "192.168.4.120",
        faceMatch: "92% match in airport CCTV",
        fingerprint: "FP-990-A8824",
        voiceprint: "VP-INDIA-8824",
        dnaProfile: "DNA-MHA-8824",
        criminalNetwork: "Route 66 Group",
        behavioralProfile: "Extremely manipulative, exploits meteorological crises, avoids train terminals, communicates via cyclic burner SMS."
      }
    },
    {
      id: "CR-4029",
      type: "Suspect",
      name: "Vijay Singh",
      status: "HIGH ALERT",
      riskScore: 82,
      details: {
        alias: "The Recruiter",
        aadhaar: "9824 1002 5590",
        passport: "PP-IND-4029-Y",
        phone: "+91 91234 88761",
        email: "vijay.singh@protonmail.com",
        vehicle: "BR-11-FA-4029",
        imei: "IMEI-4029-77129",
        deviceId: "DEV-IPHONE-4029",
        ipAddress: "103.45.201.88",
        faceMatch: "89% match in bus depot",
        fingerprint: "FP-884-X4029",
        voiceprint: "VP-INDIA-4029",
        dnaProfile: "DNA-MHA-4029",
        criminalNetwork: "Syndicate A",
        behavioralProfile: "Camouflages in Bhojpuri local dialects, presents counterfeit vocational school programs, utilizes agricultural cargo."
      }
    },
    {
      id: "NET-R66",
      type: "Network",
      name: "Route 66 Group",
      status: "ACTIVE",
      riskScore: 90,
      details: {
        hq: "Siliguri Suburbs",
        memberCount: 45,
        routeCovered: "Bihar - West Bengal - Bangladesh Border",
        fundingSource: "Unvetted commodity trade remittances",
        primaryModus: "Recruits from monsoon-hit areas using administrative NGO cover."
      }
    },
    {
      id: "NET-SYNA",
      type: "Network",
      name: "Syndicate A",
      status: "ACTIVE",
      riskScore: 85,
      details: {
        hq: "Patna - Katihar Axis",
        memberCount: 30,
        routeCovered: "Nepal Border - Northern Bihar Corridor",
        fundingSource: "Local brick kiln loans coercion",
        primaryModus: "Provides cash advances to farming families to contract child apprentices."
      }
    },
    {
      id: "EVI-992-A",
      type: "Evidence",
      name: "Burner Nokia 105 Device",
      status: "SECURED IN VAULT",
      riskScore: 75,
      details: {
        evidenceId: "EVI-992-A",
        caseId: "CASE-992",
        recoveredFrom: "Safehouse near NH-31",
        officer: "Inspector Devendra Sharma",
        contentSummary: "Contains pre-dawn coordinates dispatched to cross-border drivers. Cryptic SMS patterns.",
        fingerprintMatch: "Matched Raman Kalra (CR-8824)"
      }
    },
    {
      id: "EVI-104-D",
      type: "Evidence",
      name: "Counterfeit Welfare Badges",
      status: "FORENSICS LAB",
      riskScore: 80,
      details: {
        evidenceId: "EVI-104-D",
        caseId: "CASE-1042",
        recoveredFrom: "Latehar School Grounds",
        officer: "ASP Sandeep Kujur",
        contentSummary: "Counterfeit ID cards reading 'Ministry of Rural Education Auxiliary'. High quality offset printing.",
        fingerprintMatch: "Matched Vijay Singh (CR-4029)"
      }
    },
    {
      id: "RC-2041",
      type: "Child",
      name: "Ananya",
      status: "RECOVERED / IN REHAB",
      riskScore: 35,
      details: {
        age: 7,
        gender: "Female",
        origin: "Latehar Rural Suburbs",
        shelter: "Hope Center, Delhi",
        arrivalDate: "2026-06-10",
        guardians: "Sibu Soren (Father), Malati Devi (Mother)"
      }
    },
    {
      id: "RC-2042",
      type: "Child",
      name: "Rahul",
      status: "FAMILY MATCHED",
      riskScore: 40,
      details: {
        age: 12,
        gender: "Male",
        origin: "Katihar Highway Sector",
        shelter: "SafeHaven, Mumbai",
        arrivalDate: "2026-06-20",
        guardians: "Geeta Devi (Grandmother)"
      }
    },
    {
      id: "LOC-SILIGURI",
      type: "Location",
      name: "Siliguri Junction Transit Point",
      status: "HIGH SURVEILLANCE",
      riskScore: 85,
      details: {
        coordinates: "26.7271° N, 88.3953° E",
        district: "Darjeeling, WB",
        chokePoint: "Intersection of NH-31 and rail terminals",
        recentAlerts: "3 unauthorized minor transits blocked in past fortnight"
      }
    }
  ];

  edges: KnowledgeEdge[] = [
    {
      id: "edge-1",
      source: "CR-8824",
      target: "CASE-992",
      relationship: "PRIMARY_SUSPECT_IN",
      confidence: 94,
      strength: 9,
      details: { basis: "Forenisc biometrics on burner Nokia and traveler logs in Siliguri." }
    },
    {
      id: "edge-2",
      source: "CR-8824",
      target: "NET-R66",
      relationship: "COORDINATOR_OF",
      confidence: 90,
      strength: 8,
      details: { basis: "Encrypted signals cell dump towers overlap on Route 66 hq." }
    },
    {
      id: "edge-3",
      source: "CR-4029",
      target: "CASE-1042",
      relationship: "PRIMARY_SUSPECT_IN",
      confidence: 91,
      strength: 9,
      details: { basis: "Fingerprints matched on forged educational cards at school." }
    },
    {
      id: "edge-4",
      source: "CR-4029",
      target: "NET-SYNA",
      relationship: "OPERATIVE_OF",
      confidence: 88,
      strength: 7,
      details: { basis: "Financial Hawala accounts ledger references." }
    },
    {
      id: "edge-5",
      source: "EVI-992-A",
      target: "CASE-992",
      relationship: "EVIDENCE_IN",
      confidence: 99,
      strength: 10,
      details: { basis: "Logged from NH-31 safehouse audit." }
    },
    {
      id: "edge-6",
      source: "EVI-104-D",
      target: "CASE-1042",
      relationship: "EVIDENCE_IN",
      confidence: 99,
      strength: 10,
      details: { basis: "Recovered from Latehar primary school gate during active probe." }
    },
    {
      id: "edge-7",
      source: "RC-2041",
      target: "CASE-1042",
      relationship: "VICTIM_RESCUED_IN",
      confidence: 100,
      strength: 10,
      details: { basis: "Found during search sweep OP-RESCUE-99." }
    },
    {
      id: "edge-8",
      source: "RC-2042",
      target: "CASE-992",
      relationship: "VICTIM_RESCUED_IN",
      confidence: 100,
      strength: 10,
      details: { basis: "Intercepted at Siliguri toll terminal." }
    },
    {
      id: "edge-9",
      source: "CR-8824",
      target: "LOC-SILIGURI",
      relationship: "FREQUENTS",
      confidence: 85,
      strength: 8,
      details: { basis: "Automatic facial recognitions trigger records in Darjeeling." }
    },
    {
      id: "edge-10",
      source: "NET-R66",
      target: "LOC-SILIGURI",
      relationship: "HQ_IN",
      confidence: 95,
      strength: 9,
      details: { basis: "Consolidated intelligence mappings." }
    }
  ];

  recentFeed: RecentIntelligenceItem[] = [
    {
      id: "FEED-01",
      title: "New Biometric Match: Raman Kalra",
      category: "activity",
      timestamp: "10 mins ago",
      officer: "System Gateway",
      status: "active",
      bookmarked: false,
      summary: "AI CCTV terminal at Patna Junction flagged alias 'Slick' with 92% facial confidence score.",
      metadata: { location: "Patna Terminal 1", deviceId: "CCTV-AIS-0012" }
    },
    {
      id: "FEED-02",
      title: "Case Updated: Siliguri Interdiction",
      category: "case",
      timestamp: "1 hour ago",
      officer: "Inspector D. Sharma",
      status: "pinned",
      bookmarked: true,
      summary: "Burner mobile phone EVI-992-A forensic dump complete. Added 12 encrypted SMS coordinates to evidence timeline.",
      metadata: { caseId: "CASE-992", dumpType: "Cellular SMS Extraction" }
    },
    {
      id: "FEED-03",
      title: "New AI Threat Forecast Generated",
      category: "prediction",
      timestamp: "2 hours ago",
      officer: "SecCopilot v3.8.4",
      status: "active",
      bookmarked: false,
      summary: "Calculated High Risk spike (90% confidence) in Siliguri transit point due to heavy monsoons within 72h window.",
      metadata: { predictionId: "SIM-2026-06-25-01", trendValue: "+14%" }
    },
    {
      id: "FEED-04",
      title: "Critical Evidence Uploaded: UP-32-DK-4021 Log",
      category: "upload",
      timestamp: "4 hours ago",
      officer: "ASP S. Kujur",
      status: "active",
      bookmarked: false,
      summary: "Toll plaza log uploaded indicating vehicle UP-32-DK-4021 crossed border NH-2 boundaries twice in 24 hours.",
      metadata: { evidenceId: "EVI-104-D", transitPoint: "NH-2 Toll" }
    },
    {
      id: "FEED-05",
      title: "Forensic Report Saved: Latehar Coercion Summary",
      category: "report",
      timestamp: "5 hours ago",
      officer: "ASP S. Kujur",
      status: "active",
      bookmarked: false,
      summary: "Saved draft of full psychological profiling for Vijay Singh (CR-4029) into document repo.",
      metadata: { reportId: "REP-4029-A", format: "PDF" }
    }
  ];

  savedReports: SavedReport[] = [
    {
      id: "REP-01",
      title: "Siliguri Hub Spatial Audit Q2 2026",
      type: "PDF",
      author: "Inspector Devendra Sharma",
      date: "2026-06-24",
      size: "4.2 MB",
      version: 2,
      versionHistory: [
        { version: 1, date: "2026-06-20", author: "Inspector D. Sharma", changes: "Initial compilation" },
        { version: 2, date: "2026-06-24", author: "Inspector D. Sharma", changes: "Injected GIS tower overlap data" }
      ],
      status: "Approved",
      signature: { signedBy: "Commander D.S. Rawat", timestamp: "2026-06-25T10:30:00Z", hash: "SHA256:7e8a9f...b83a" },
      content: "This report audits the high-risk transit channels intersecting NH-31 and Siliguri rail networks. Tower overlap telemetry indicates that Route 66 operatives congregate in off-season tea labor quarters during heavy rain surges.",
      tags: ["Siliguri", "Audit", "Spatial Telemetry"]
    },
    {
      id: "REP-02",
      title: "Raman Kalra Behavioral & Psych Profile",
      type: "AI Report",
      author: "SecCopilot Analyzer",
      date: "2026-06-25",
      size: "1.8 MB",
      version: 1,
      versionHistory: [
        { version: 1, date: "2026-06-25", author: "SecCopilot Analyzer", changes: "AI Generative compilation" }
      ],
      status: "Signed",
      signature: { signedBy: "Dr. Smith Kadam (Lab Director)", timestamp: "2026-06-25T14:45:00Z", hash: "SHA256:4d12c9...ee12" },
      content: "Multimodal psychological assessment maps Subject CR-8824 to high-vulnerability exploitation behaviors. Recruiter archetype exhibits 94.2% structural alignment with 2019 Eastern Corridor syndicates.",
      tags: ["Profiling", "Raman Kalra", "Explainable AI"]
    },
    {
      id: "REP-03",
      title: "Eastern Sector Financial Ledger Audit",
      type: "Excel",
      author: "DSP Arundhati Sen",
      date: "2026-06-22",
      size: "14.5 MB",
      version: 3,
      versionHistory: [
        { version: 1, date: "2026-06-15", author: "DSP Arundhati Sen", changes: "Drafting accounts" },
        { version: 2, date: "2026-06-18", author: "Audit Team Beta", changes: "Consolidated commercial logs" },
        { version: 3, date: "2026-06-22", author: "DSP Arundhati Sen", changes: "Injected Hawala matching ledger entries" }
      ],
      status: "Pending Approval",
      content: "Financial spreadsheet mapping 45 distinct accounts distributing minor sums disguised as agricultural seeds grants. Co-signatory links suspect Vijay Singh's shell business.",
      tags: ["Ledger", "Hawala", "Audit"]
    }
  ];

  favoriteCases: FavoriteCase[] = [
    {
      id: "CASE-992",
      title: "Siliguri Corridor Interdiction",
      tags: ["Monsoon-Transit", "Raman Kalra", "Siliguri"],
      priority: "CRITICAL",
      personalNotes: "Raman Kalra is active again. Check cell tower coordinates at NH-31 toll gate daily. Coordinate with local WB border checkpoint.",
      reminderDate: "2026-06-27",
      assignedOfficer: "Inspector D. Sharma",
      lastUpdated: "2 hours ago",
      timeline: [
        { date: "2026-06-10", event: "Case registered under FIR-2024-88A", officer: "System Auto-Ingest" },
        { date: "2026-06-18", event: "Nokia burner secured from safehouse near toll gates", officer: "Inspector D. Sharma" },
        { date: "2026-06-25", event: "CCTV AI Match triggered for Slick at airport", officer: "CCTV-AIS-0012" }
      ]
    },
    {
      id: "CASE-1042",
      title: "Latehar Tribal Minor Ring",
      tags: ["School-Recruitment", "Vijay Singh", "Latehar"],
      priority: "HIGH",
      personalNotes: "Focus on fake educational auxiliary credentials. Verify list of computer centers in Dumka sector.",
      reminderDate: "2026-06-29",
      assignedOfficer: "ASP Sandeep Kujur",
      lastUpdated: "5 hours ago",
      timeline: [
        { date: "2026-05-15", event: "Initial rescue of 2 minors at town borders", officer: "ASP S. Kujur" },
        { date: "2026-06-12", event: "Forged student auxiliary ID badges seized at gate", officer: "ASP S. Kujur" }
      ]
    }
  ];

  watchlist: WatchlistItem[] = [
    {
      id: "WATCH-01",
      type: "Suspect",
      value: "Raman Kalra",
      status: "TRIGGERED",
      addedDate: "2026-06-01",
      alertCount: 14,
      tags: ["Recruiter", "Route 66"],
      riskScore: 94,
      lastMatch: "Face Match 92% at Patna Junction CCTV Terminal 1"
    },
    {
      id: "WATCH-02",
      type: "Vehicle",
      value: "BR-11-FA-4029 (White Mahindra)",
      status: "MONITORING",
      addedDate: "2026-06-12",
      alertCount: 3,
      tags: ["Decoy Cargo", "Vijay Singh"],
      riskScore: 82,
      lastMatch: "RFID Toll Trigger on Katihar Border Highway"
    },
    {
      id: "WATCH-03",
      type: "Phone Number",
      value: "+91 98124 55321",
      status: "TRIGGERED",
      addedDate: "2026-06-18",
      alertCount: 22,
      tags: ["Burner", "SMS Commands"],
      riskScore: 90,
      lastMatch: "Cell Tower registration overlap at NH-31"
    },
    {
      id: "WATCH-04",
      type: "Location",
      value: "Siliguri Junction Tea Quarters",
      status: "MONITORING",
      addedDate: "2026-06-20",
      alertCount: 1,
      tags: ["Choke Point", "Safehouse"],
      riskScore: 85,
      lastMatch: "WIFI router login for associated suspect device"
    }
  ];

  suggestions: AISuggestion[] = [
    {
      id: "SUG-01",
      title: "Raman Kalra & Vijay Singh Shared Network Node",
      type: "connection",
      confidence: 94.2,
      why: "Historical travel overlays and co-signing transactions indicate structural collusion.",
      supportingEvidence: ["FIR-2019-902B", "Siliguri Hawala Ledger matches", "Patna Junction GPS cell dumps"],
      recommendedAction: "Establish a combined tactical surveillance squad targeting the Katihar border road junction.",
      reasoning: "Predictive behavioral analytics mapping the 2019 Siliguri staging raid matches Kalra's travel frequency and Singh's recruit profiles with 94.2% accuracy. Collusion point is calculated to occur next weekend."
    },
    {
      id: "SUG-02",
      title: "Potential Traffic Route Shift Detected",
      type: "route",
      confidence: 88.0,
      why: "Heavy flooding waterlogged NH-31 bypasses, funneling transit into minor district tractor trails.",
      supportingEvidence: ["Satellite cloud cover data (88%)", "State Highway 10 patrol reports", "Agricultural vehicle RFID tags"],
      recommendedAction: "Redirect ground drone teams Bravo and Delta to monitor State Highway 10 unreserved trails.",
      reasoning: "River levels at Dhubri are +1.4m above critical baseline. 82% of commercial freight vehicles have diverted to NH-2 secondary pathways, escaping standard checkpoints."
    },
    {
      id: "SUG-03",
      title: "Missing Evidence Warning: Case #CASE-1042",
      type: "missing_evidence",
      confidence: 81.5,
      why: "Subject Vijay Singh has no recorded state biometric profile, yet UIDAI registers duplicate incomplete records.",
      supportingEvidence: ["UIDAI enrolments state auxiliary", "Patna computer center database records"],
      recommendedAction: "Submit formal biometric audit request to State ID agency.",
      reasoning: "Subject leverages incomplete school registrations to issue duplicate birth credentials. Securing state biometric database link is crucial to block border exit profiles."
    }
  ];

  stats: KnowledgeStats = {
    totalRecords: 1250482,
    activeCases: 8402,
    closedCases: 42019,
    archivedCases: 112500,
    indexedProfiles: 45910,
    evidenceFiles: 89410,
    videos: 3120,
    images: 45210,
    audioFiles: 1254,
    dnaRecords: 892,
    fingerprints: 12450,
    faceProfiles: 28904,
    activeUsers: 145,
    connectedAgencies: ["NIA (National Investigation Agency)", "CBI", "Interpol Bureau Delhi", "IB (Intelligence Bureau)", "UP Police STF"],
    apiHealth: "EXCELLENT",
    serverStatus: "OPERATIONAL",
    storageUsage: "78.4 TB / 120 TB",
    latency: 14,
    lastSync: "Just now"
  };

  getRelatedRecords(id: string): RelatedRecord[] {
    // Return mock records based on ID or custom similarity
    return [
      {
        id: "REL-01",
        targetId: "CR-8824",
        targetName: "Raman Kalra (Slick)",
        type: "Suspect",
        similarity: 94.2,
        confidence: 91,
        sharedAttributes: ["NH-31 Cell overlaps", "Disaster Scouting MO", "SMS commands cipher"],
        lastActivity: "Face match पटना 10m ago"
      },
      {
        id: "REL-02",
        targetId: "CASE-1042",
        targetName: "Latehar Tribal Minor Exploitation",
        type: "Case",
        similarity: 87.5,
        confidence: 88,
        sharedAttributes: ["Co-suspect Vijay Singh", "Drought recruiting targetting"],
        lastActivity: "Seized school documents 5h ago"
      },
      {
        id: "REL-03",
        targetId: "LOC-SILIGURI",
        targetName: "Siliguri Junction Transit Point",
        type: "Location",
        similarity: 82.0,
        confidence: 85,
        sharedAttributes: ["Route 66 Group HQ", "NH-31 toll CCTV gate"],
        lastActivity: "RFID trigger monitored 1h ago"
      }
    ];
  }
}

export const knowledgeDb = new KnowledgeStore();
