export interface ArchetypeMetric {
  id: string;
  score: number;
  confidence: number;
  trend: "rising" | "stable" | "declining";
  history: number[];
}

export interface BehavioralHistoryEvent {
  id: string;
  title: string;
  year: string;
  description: string;
  location: string;
  evidence: string;
  associatedCases: string[];
  confidence: number;
  officerNotes: string;
  image?: string;
  document?: string;
}

export interface AssociatedCase {
  id: string;
  title: string;
  similarityScore: number;
  status: "Open" | "Closed" | "Under Investigation";
  linkedFirs: string[];
  investigationReports: string[];
  knownAssociates: string[];
  victims: string[];
  witnesses: string[];
  evidence: string[];
}

export interface PrimaryDeduction {
  id: string;
  title: string;
  description: string;
  type: "pattern" | "similarity" | "alert";
}

export interface LikelyBehaviorItem {
  id: string;
  category: "Transport" | "Communication" | "Victim Selection" | "Operational Hours" | "Technology Usage" | "Movement Radius" | "Leadership" | "Financial Pattern" | "Recruitment Strategy" | "Safe Houses";
  title: string;
  description: string;
  icon: string;
  why: string;
}

export interface BehavioralForecast {
  primaryDeductions: string[];
  likelyActions: string[];
  likelyLocations: string[];
  likelyTargets: string[];
  recruitmentPattern: string;
  communicationPattern: string;
  escapeRoutes: string[];
  futureCrimes: string[];
  predictedTimeline: string;
  behaviorConfidence: number;
  explanation: string;
}

export interface CriminalProfile {
  id: string; // e.g. CR-8824
  name: string;
  alias: string;
  phone: string;
  email: string;
  aadhaar: string;
  vehicle: string;
  faceMatchScore: number;
  fingerprintId: string;
  voiceId: string;
  firNumber: string;
  investigationId: string;
  status: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  statusText: string;
  lastUpdated: string;
  dominantArchetype: string;
  archetypeDistribution: ArchetypeMetric[];
  
  // Metrics
  similarityScore: number;
  similarityReason: string;
  riskLevel: number; // Percentage
  violencePotential: number; // Percentage
  reoffendingProbability: number; // Percentage
  manipulationIndex: number; // Percentage
  influenceScore: number; // Percentage
  networkValue: number; // Percentage
  psychologicalStability: number; // Percentage
  escalationProbability: number; // Percentage
  threatTimeline: string;
  confidence: number; // Percentage
  
  behaviorHistory: BehavioralHistoryEvent[];
  associatedCases: AssociatedCase[];
  primaryDeductions: PrimaryDeduction[];
  likelyBehavior: LikelyBehaviorItem[];
  behavioralForecast: BehavioralForecast;
}

export const initialCriminalProfiles: CriminalProfile[] = [
  {
    id: "CR-8824",
    name: "Raman Kalra",
    alias: "Slick",
    phone: "+91 98124 55321",
    email: "r.kalra@shadowmail.net",
    aadhaar: "4520 8891 1024",
    vehicle: "DL-3C-AQ-8824",
    faceMatchScore: 92,
    fingerprintId: "FP-990-A8824",
    voiceId: "VP-INDIA-8824",
    firNumber: "FIR-2024-88A",
    investigationId: "INV-8824-SECTOR-4",
    status: "CRITICAL",
    statusText: "High Priority",
    lastUpdated: "Profile updated 2 hours ago",
    dominantArchetype: "Recruiter",
    similarityScore: 87,
    similarityReason: "Matches profile of known recruiters in Eastern sector.",
    riskLevel: 90,
    violencePotential: 45,
    reoffendingProbability: 88,
    manipulationIndex: 78,
    influenceScore: 82,
    networkValue: 69,
    psychologicalStability: 40,
    escalationProbability: 74,
    threatTimeline: "Imminent threat within next 48 hours in Siliguri transit point.",
    confidence: 91,
    archetypeDistribution: [
      { id: "Manipulator", score: 65, confidence: 88, trend: "rising", history: [58, 60, 62, 65] },
      { id: "Recruiter", score: 92, confidence: 94, trend: "rising", history: [80, 85, 90, 92] },
      { id: "Transporter", score: 45, confidence: 75, trend: "stable", history: [45, 46, 45, 45] },
      { id: "Scout", score: 58, confidence: 82, trend: "declining", history: [70, 65, 60, 58] },
      { id: "Leader", score: 72, confidence: 85, trend: "rising", history: [60, 64, 68, 72] },
      { id: "Coordinator", score: 80, confidence: 89, trend: "rising", history: [72, 75, 78, 80] },
      { id: "Financier", score: 30, confidence: 70, trend: "stable", history: [30, 30, 30, 30] },
      { id: "Communicator", score: 85, confidence: 91, trend: "rising", history: [78, 80, 83, 85] }
    ],
    behaviorHistory: [
      {
        id: "EV-001",
        title: "Targeted Schools",
        year: "2024",
        description: "Shifted focus to rural educational institutions under guise of skill-development programs.",
        location: "Latehar Rural Suburbs",
        evidence: "Pamphlets, fake enrollment records",
        associatedCases: ["#OP-RESCUE-99"],
        confidence: 94,
        officerNotes: "Identified recruiting from tribal residential schools during monsoon closures. Handed out minor advances to parents.",
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400",
        document: "INF-REPORT-2024-09.pdf"
      },
      {
        id: "EV-002",
        title: "Used Bus Routes",
        year: "2022",
        description: "Avoided high-surveillance train stations, exclusively utilized unregulated private bus lines.",
        location: "Katihar Border Highway",
        evidence: "CCTV logs from NH-31 toll plaza",
        associatedCases: ["#CASE-2019-B"],
        confidence: 89,
        officerNotes: "Subject was seen coordinating boarding of 6 minors onto late-night long-haul private coaches. Falsified guardian receipts.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400",
        document: "CCTV-TRANSIT-LOG.xlsx"
      },
      {
        id: "EV-003",
        title: "Disaster Scouting",
        year: "2020",
        description: "Active in river flood relief zones, targetting displaced families.",
        location: "Dhubri Flood Shelter Alpha",
        evidence: "Visitor ledger entry, eye-witness testimonies",
        associatedCases: ["#R-8422"],
        confidence: 76,
        officerNotes: "Infiltrated relief camps pretending to run a family tracing charity. Disappeared before audit team arrived.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400",
        document: "CAMP-VISITOR-LEDGER.pdf"
      }
    ],
    associatedCases: [
      {
        id: "#OP-RESCUE-99",
        title: "Latehar Minor Interception",
        similarityScore: 82,
        status: "Closed",
        linkedFirs: ["FIR-2024-12", "FIR-2024-15"],
        investigationReports: ["IR-LATEHAR-009-A"],
        knownAssociates: ["Birsa Soren", "Amitabh Singh"],
        victims: ["Ananya", "Amit"],
        witnesses: ["School Headmaster Som Soren"],
        evidence: ["Burner Nokia device", "INR 45,000 unverified cash ledger"]
      },
      {
        id: "#CASE-2019-B",
        title: "Siliguri Staging Hub Raid",
        similarityScore: 95,
        status: "Under Investigation",
        linkedFirs: ["FIR-2019-902B"],
        investigationReports: ["IR-SILIGURI-881"],
        knownAssociates: ["Karan Murmu", "The Ghost"],
        victims: ["Priya", "Rahul"],
        witnesses: ["Bus driver Ram Sharan"],
        evidence: ["Falsified birth certificates", "Digital map logs with transit coordinates"]
      },
      {
        id: "#R-8422",
        title: "Dhubri Border Transit Incident",
        similarityScore: 45,
        status: "Open",
        linkedFirs: ["FIR-2022-842"],
        investigationReports: ["IR-DHUBRI-04"],
        knownAssociates: ["Sujata Mahato"],
        victims: ["Unknown Victim Female (Age 4)"],
        witnesses: ["Camp volunteer Geeta Sen"],
        evidence: ["Fake NGO credential card ('Hope Child Trust')"]
      }
    ],
    primaryDeductions: [
      {
        id: "PD-1",
        title: "Matches 2019 Pattern",
        description: "Strong correlation with historical data of child-funneling patterns during regional flood panics.",
        type: "pattern"
      },
      {
        id: "PD-2",
        title: "87% Similarity",
        description: "Matches behavioral thumbprint, timing offset, and communication vectors of Subject #CASE-2019-B.",
        type: "similarity"
      },
      {
        id: "PD-3",
        title: "Extreme Weather Synergy",
        description: "Activity spikes 12-24 hours after river levels breach danger marks. Subject leverages localized panic.",
        type: "alert"
      }
    ],
    likelyBehavior: [
      {
        id: "LB-1",
        category: "Transport",
        title: "Moves Victims at Night",
        description: "Historical data shows 90% of transport activity occurs between 01:00 and 04:00.",
        icon: "Activity",
        why: "To exploit reduced police checkpoints on interstate boundaries."
      },
      {
        id: "LB-2",
        category: "Communication",
        title: "Uses Dual Burners",
        description: "Switches between two separate localized burner SIM cards within same transit windows.",
        icon: "GitMerge",
        why: "Evades network tower cell-dump tracking algorithms used by investigative units."
      },
      {
        id: "LB-3",
        category: "Victim Selection",
        title: "Targets Disaster Zones",
        description: "High probability of recruitment in areas recently affected by flooding or severe economic shock.",
        icon: "ShieldAlert",
        why: "Capitalizes on families losing livelihoods, presenting false promises of safe city education."
      },
      {
        id: "LB-4",
        category: "Operational Hours",
        title: "Pre-Dawn Coordinates",
        description: "Staging and final handoff coordinates are exclusively dispatched between 03:30 AM and 05:00 AM.",
        icon: "Clock",
        why: "Exploits the lowest wakefulness cycle of surveillance personnel."
      },
      {
        id: "LB-5",
        category: "Technology Usage",
        title: "Unencrypted SMS Nodes",
        description: "Uses encrypted chat for coordination, but sends final dispatch commands via standard SMS using cipher codes.",
        icon: "Fingerprint",
        why: "Blends in with high-density commercial spam traffic."
      },
      {
        id: "LB-6",
        category: "Movement Radius",
        title: "80km Inter-State Bounds",
        description: "Restricts active custody of victims to an 80km radius before transferring to secondary transporters.",
        icon: "Target",
        why: "Prevents a single arrest from compromising the entire multi-tiered transit chain."
      },
      {
        id: "LB-7",
        category: "Leadership",
        title: "Cellular Insulation",
        description: "Does not establish direct physical contact with recruiters; operates as an insulated node.",
        icon: "Zap",
        why: "Ensures legal insulation under standard interrogation practices."
      },
      {
        id: "LB-8",
        category: "Financial Pattern",
        title: "Hawala Remittances",
        description: "Funds are routed via local commodity traders in agricultural hubs rather than bank accounts.",
        icon: "TrendingUp",
        why: "Bypasses central financial intelligence Unit tracking systems."
      },
      {
        id: "LB-9",
        category: "Recruitment Strategy",
        title: "NGO Impersonation",
        description: "Subject claims registration under legitimate child welfare boards, carrying realistic counterfeit IDs.",
        icon: "FileText",
        why: "Bypasses early suspicions from village authorities and school headmasters."
      },
      {
        id: "LB-10",
        category: "Safe Houses",
        title: "Abandoned Brick Kilns",
        description: "Coordinates holdovers exclusively in disused, off-season brick kilns adjacent to highways.",
        icon: "AlertTriangle",
        why: "Provides quick emergency escape vectors into surrounding agricultural cover."
      }
    ],
    behavioralForecast: {
      primaryDeductions: [
        "Highly adaptive response to border patrols.",
        "Monsoon-correlated transit cycles.",
        "Severe exploitation of crop damage distress."
      ],
      likelyActions: [
        "Establishment of temporary shelter adjacent to NH-31 within 48h.",
        "Coordination of a 4-minor handoff to a West Bengal transport vehicle.",
        "Acquisition of new local SIM cards from Katihar commercial markets."
      ],
      likelyLocations: [
        "Katihar Junction Platform 4 Environs",
        "NH-31 Toll Plaza Lay-bys",
        "Siliguri Tea Estate Labor Colonies"
      ],
      likelyTargets: [
        "Separated children under age 10",
        "Displaced flood families with more than 3 minors",
        "Schools currently closed due to water inundation"
      ],
      recruitmentPattern: "Subject offers advance monetary relief (INR 5000-10000) disguised as government-approved educational stipends.",
      communicationPattern: "Dispatches cryptic location coordinates via burner SMS, switching devices every 12 hours.",
      escapeRoutes: [
        "Siliguri bypass toward Nepal border corridor",
        "State Highway 10 via agricultural tractor lanes",
        "Local cargo trains heading towards eastern ports"
      ],
      futureCrimes: [
        "Inter-state transit of undocumented minors (predicted high probability)",
        "Biometrics bypass using forged state certificates"
      ],
      predictedTimeline: "Peak activity window calculated between 2026-06-27 01:00 AM and 04:00 AM.",
      behaviorConfidence: 94.2,
      explanation: "Predictive neural models map a 94.2% behavioral alignment with the 2019 Siliguri transit case. The convergence of heavy monsoons in Dhubri and crop harvest delays in Latehar forces an inevitable transit bottleneck through Siliguri, which Raman Kalra has historically exploited."
    }
  },
  {
    id: "CR-4029",
    name: "Vijay Singh",
    alias: "The Recruiter",
    phone: "+91 91234 88761",
    email: "vijay.singh@protonmail.com",
    aadhaar: "9824 1002 5590",
    vehicle: "BR-11-FA-4029",
    faceMatchScore: 89,
    fingerprintId: "FP-884-X4029",
    voiceId: "VP-INDIA-4029",
    firNumber: "FIR-2023-402",
    investigationId: "INV-4029-SECTOR-2",
    status: "HIGH",
    statusText: "High Alert",
    lastUpdated: "Profile updated 5 hours ago",
    dominantArchetype: "Manipulator",
    similarityScore: 91,
    similarityReason: "Highly matches child recruitment profiles using educational pretenses in Bihar.",
    riskLevel: 82,
    violencePotential: 30,
    reoffendingProbability: 92,
    manipulationIndex: 95,
    influenceScore: 78,
    networkValue: 84,
    psychologicalStability: 55,
    escalationProbability: 60,
    threatTimeline: "Staging recruitment drive in north Bihar districts next 72 hours.",
    confidence: 88,
    archetypeDistribution: [
      { id: "Manipulator", score: 95, confidence: 92, trend: "rising", history: [88, 90, 93, 95] },
      { id: "Recruiter", score: 85, confidence: 89, trend: "stable", history: [85, 84, 85, 85] },
      { id: "Transporter", score: 20, confidence: 60, trend: "declining", history: [40, 30, 25, 20] },
      { id: "Scout", score: 75, confidence: 84, trend: "rising", history: [65, 70, 72, 75] },
      { id: "Leader", score: 60, confidence: 78, trend: "stable", history: [58, 60, 60, 60] },
      { id: "Coordinator", score: 78, confidence: 85, trend: "rising", history: [70, 74, 76, 78] },
      { id: "Financier", score: 45, confidence: 72, trend: "stable", history: [45, 45, 45, 45] },
      { id: "Communicator", score: 90, confidence: 93, trend: "rising", history: [82, 85, 88, 90] }
    ],
    behaviorHistory: [
      {
        id: "EV-101",
        title: "Relief Camp Exploitation",
        year: "2023",
        description: "Posed as dry-ration distributor to gain access to vulnerable families in displacement centers.",
        location: "Katihar Flood Zone",
        evidence: "Ration inventory logs with forged donor stamps",
        associatedCases: ["#CASE-2019-B"],
        confidence: 91,
        officerNotes: "Subject leveraged connections with local suppliers to secure access. Documented tracing reports verified 3 missing kids connected to him.",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400",
        document: "KAT-REPORT-RECON.pdf"
      }
    ],
    associatedCases: [
      {
        id: "#CASE-2019-B",
        title: "Siliguri Staging Hub Raid",
        similarityScore: 91,
        status: "Under Investigation",
        linkedFirs: ["FIR-2019-902B"],
        investigationReports: ["IR-SILIGURI-881"],
        knownAssociates: ["Raman Kalra", "Sujata Mahato"],
        victims: ["Priya", "Rahul"],
        witnesses: ["Ram Sharan"],
        evidence: ["Falsified birth records"]
      }
    ],
    primaryDeductions: [
      {
        id: "PD- Singh-1",
        title: "Linguistic Camouflage",
        description: "Uses highly sophisticated local Bhojpuri dialects to quickly establish trust with village elders.",
        type: "pattern"
      },
      {
        id: "PD-Singh-2",
        title: "Fake Vocational Scheme",
        description: "Presents forged papers from a fictitious government institute in Patna ('Bihar Skill Development Auxiliary').",
        type: "similarity"
      }
    ],
    likelyBehavior: [
      {
        id: "LB- Singh-1",
        category: "Communication",
        title: "Encrypted Voice Proxy",
        description: "Uses custom voice modulation software over Signal/WhatsApp to disguise vocal age markers during staging.",
        icon: "Activity",
        why: "To confuse regional digital voice-printing intelligence layers."
      },
      {
        id: "LB-Singh-2",
        category: "Transport",
        title: "Decoy Cargo Packing",
        description: "Packs victims into compartments of agricultural produce trucks.",
        icon: "GitMerge",
        why: "Evades visual inspection at standard highway border terminals."
      }
    ],
    behavioralForecast: {
      primaryDeductions: [
        "Prefers administrative cover.",
        "Utilizes localized flood blockades to slow investigation responses."
      ],
      likelyActions: [
        "Filing of false travel coordinates under local agro-trading license.",
        "Staging of a temporary recruitment hub near Katihar suburbs."
      ],
      likelyLocations: [
        "Darbhanga Rural Centers",
        "Patna Transit Junctions"
      ],
      likelyTargets: [
        "Boys aged 12-14 for brick kiln labor forces",
        "Families with active agricultural debt"
      ],
      recruitmentPattern: "Promises guaranteed vocational training with monthly stipend returned directly to maternal bank accounts.",
      communicationPattern: "Voice calls only via secure internet gateways with strict 2-minute timeouts.",
      escapeRoutes: [
        "Nepal border border checkpoint via farm lanes",
        "State Highway 2 towards Jharkhand"
      ],
      futureCrimes: [
        "Illegal inter-district transfer under forged trading papers"
      ],
      predictedTimeline: "Elevated threat window calculated over the upcoming weekend.",
      behaviorConfidence: 91.5,
      explanation: "Calculated with 91.5% confidence against historical Katihar transit vectors. The subject exploits structural administrative gaps by setting up fake skill workshops immediately following monsoon crop failures."
    }
  }
];
