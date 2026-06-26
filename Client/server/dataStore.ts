import { randomUUID } from "crypto";

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  status: string;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  arrivalDate: string;
  medicalAlerts: string[];
  profileImage: string;
}

export interface Shelter {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  contactInfo: string;
  specializedCare: string[];
  staffAvailable: number;
  status: 'Normal' | 'Capacity Warning' | 'Medical Request';
}

export interface FamilyMatch {
  id: string;
  childId: string;
  matchName: string;
  relationship: string;
  confidenceScore: number;
  biometricMatch: number;
  voiceMatch: number;
  status: 'Pending Verification' | 'Interview Scheduled' | 'Approved' | 'Rejected';
  location: string;
}

export interface WellnessRecord {
  id: string;
  childId: string;
  physicalHealth: number;
  mentalHealth: number;
  nutrition: number;
  education: number;
  emotional: number;
  social: number;
  medicalAlerts: string[];
}

export interface JourneyMilestone {
  id: string;
  childId: string;
  title: string;
  status: 'Completed' | 'Current' | 'Pending';
  date: string;
  description: string;
  currentStage?: string;
  daysInCare?: number;
  progressPercentage?: number;
}

export interface Team {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'En Route' | 'Idle';
  location: { lat: number; lng: number };
  battery: number;
}

export interface Drone {
  id: string;
  name: string;
  status: string;
  altitude: number;
  battery: number;
  location: { lat: number; lng: number };
}

export interface Mission {
  id: string;
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  area: string;
  progress: number;
  status: 'Active' | 'Pending' | 'Completed';
  logs: string[];
}

export class DataStore {
  children: Child[] = [
    { id: "RC-2041", name: "Ananya", age: 7, gender: "Female", location: "Hope Center, Delhi", status: "Recovering", riskLevel: "Low Risk", arrivalDate: "2026-06-10", medicalAlerts: [], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
    { id: "RC-2042", name: "Rahul", age: 12, gender: "Male", location: "SafeHaven, Mumbai", status: "Medical Check", riskLevel: "High Risk", arrivalDate: "2026-06-20", medicalAlerts: ["Malnutrition"], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
    { id: "RC-2043", name: "Priya", age: 5, gender: "Female", location: "Aashray, Pune", status: "Family Matched", riskLevel: "Low Risk", arrivalDate: "2026-05-15", medicalAlerts: [], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    { id: "RC-2044", name: "Amit", age: 9, gender: "Male", location: "Hope Center, Delhi", status: "Rescued", riskLevel: "Medium Risk", arrivalDate: "2026-06-24", medicalAlerts: ["Anxiety"], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" },
    { id: "RC-2045", name: "Unknown", age: 4, gender: "Female", location: "Care Home, Bangalore", status: "Verification", riskLevel: "High Risk", arrivalDate: "2026-06-22", medicalAlerts: ["Speech Delay"], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown" },
    { id: "RC-2046", name: "Suresh", age: 14, gender: "Male", location: "SafeHaven, Mumbai", status: "Reintegrating", riskLevel: "Low Risk", arrivalDate: "2026-02-10", medicalAlerts: [], profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh" }
  ];

  shelters: Shelter[] = [
    { id: "S-1", name: "Hope Center, Delhi", capacity: 150, occupancy: 120, contactInfo: "+91 9876543210", specializedCare: ["Trauma Therapy", "Education"], staffAvailable: 24, status: "Normal" },
    { id: "S-2", name: "SafeHaven, Mumbai", capacity: 100, occupancy: 95, contactInfo: "+91 9876543211", specializedCare: ["Medical Recovery"], staffAvailable: 15, status: "Capacity Warning" },
    { id: "S-3", name: "Aashray, Pune", capacity: 50, occupancy: 20, contactInfo: "+91 9876543212", specializedCare: ["Early Childhood"], staffAvailable: 10, status: "Normal" },
    { id: "S-4", name: "Care Home, Bangalore", capacity: 200, occupancy: 150, contactInfo: "+91 9876543213", specializedCare: ["Special Needs", "Rehabilitation"], staffAvailable: 30, status: "Medical Request" }
  ];

  familyMatches: FamilyMatch[] = [
    { id: "M-1", childId: "RC-2042", matchName: "Geeta Devi", relationship: "Grandmother", confidenceScore: 95, biometricMatch: 98, voiceMatch: 85, status: "Pending Verification", location: "Pune Rural" },
    { id: "M-2", childId: "RC-2043", matchName: "Rajesh Kumar", relationship: "Father", confidenceScore: 99, biometricMatch: 99, voiceMatch: 95, status: "Approved", location: "Mumbai" },
    { id: "M-3", childId: "RC-2046", matchName: "Sita", relationship: "Aunt", confidenceScore: 82, biometricMatch: 80, voiceMatch: 75, status: "Interview Scheduled", location: "Delhi" }
  ];

  wellnessRecords: WellnessRecord[] = [
    { id: "W-1", childId: "RC-2041", physicalHealth: 80, mentalHealth: 70, nutrition: 85, education: 60, emotional: 75, social: 80, medicalAlerts: [] },
    { id: "W-2", childId: "RC-2042", physicalHealth: 40, mentalHealth: 50, nutrition: 30, education: 40, emotional: 45, social: 50, medicalAlerts: ["Malnutrition"] },
    { id: "W-3", childId: "RC-2043", physicalHealth: 90, mentalHealth: 85, nutrition: 90, education: 80, emotional: 90, social: 85, medicalAlerts: [] },
    { id: "W-4", childId: "RC-2044", physicalHealth: 70, mentalHealth: 40, nutrition: 80, education: 50, emotional: 40, social: 60, medicalAlerts: ["Anxiety"] }
  ];

  journeyMilestones: JourneyMilestone[] = [
    { id: "J-1", childId: "RC-2042", title: "Rescued", status: "Completed", date: "2026-06-20", description: "Child safely recovered from station.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-2", childId: "RC-2042", title: "Medical Assessment", status: "Completed", date: "2026-06-21", description: "Initial health checkup completed.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-3", childId: "RC-2042", title: "Identity Verification", status: "Current", date: "2026-06-22", description: "Cross-referencing database.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-4", childId: "RC-2042", title: "Family Matching", status: "Pending", date: "", description: "Awaiting biometric results.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 },
    { id: "J-5", childId: "RC-2042", title: "Reintegration", status: "Pending", date: "", description: "Final stage before going home.", currentStage: "Medical Assessment", daysInCare: 5, progressPercentage: 40 }
  ];

  teams: Team[] = [
    { id: "T-1", name: "Team Alpha", type: "Ground", status: "Active", location: { lat: 34.05, lng: -118.25 }, battery: 85 },
    { id: "T-2", name: "Team Bravo", type: "Ground", status: "En Route", location: { lat: 34.06, lng: -118.24 }, battery: 92 },
    { id: "T-3", name: "K9 Unit Delta", type: "K9", status: "Active", location: { lat: 34.04, lng: -118.26 }, battery: 100 },
  ];

  drones: Drone[] = [
    { id: "D-1", name: "Air-1", status: "Searching", altitude: 120, battery: 74, location: { lat: 34.055, lng: -118.255 } },
    { id: "D-2", name: "Air-2", status: "Hovering", altitude: 80, battery: 45, location: { lat: 34.045, lng: -118.245 } },
  ];

  missions: Mission[] = [
    { id: "OP-DELTA", title: "Sector 4 Sweep", priority: "Critical", area: "8 km", progress: 45, status: "Active", logs: ["Target identified", "Moving to intercept"] },
    { id: "OP-ECHO", title: "River Zone Search", priority: "High", area: "3.5 km", progress: 80, status: "Active", logs: ["K9 unit deployed", "Scent picked up"] },
    { id: "OP-NOVA", title: "Downtown Patrol", priority: "Medium", area: "12 km", progress: 15, status: "Active", logs: ["Routine check", "No anomalies"] },
  ];

  emergencyAlerts: string[] = [];
  emergencyModeActive: boolean = false;

  predictionHistory: any[] = [
    {
      id: "SIM-2026-06-25-01",
      timeframe: "72 Hours",
      timestamp: "2026-06-25T14:30:00Z",
      migrationRisk: {
        level: "High",
        trend: "increasing (+14% spike)",
        confidence: 90,
        reasoning: "Seasonal agricultural slowdown paired with high localized flooding is driving families towards transport corridors.",
        factors: ["Monsoon displacement", "Harvest delay", "Unofficial rail agents"],
        regions: ["Assam Sector 4", "Siliguri Corridor"],
        timeline: "Peaking in 48-72 hours",
        actions: "Establish permanent police desk at railway platforms and coordinate with local NGOs for shelter."
      },
      floodRisk: {
        probability: 85,
        rainfall: "140mm",
        riverLevels: "+1.4m above critical baseline",
        satelliteData: "Overcast (88% cloud density over northern borders)",
        districts: ["Dhubri", "Cachar", "Karimganj"],
        forecast: "Intermittent heavy showers next 4 days",
        impactAssessment: "Flooded agricultural roads will redirect movement to the Siliguri and Katihar rail transit points."
      },
      economicDistress: {
        vulnerabilityScore: 60,
        employment: "Seasonal job index down 12%",
        migration: "Rural-to-urban transit up 25%",
        inflation: "Basic staples index at 8.2%",
        foodSupply: "Ration centers experiencing high queue delays",
        povertyIndex: "41.5",
        trendCharts: [20, 25, 32, 45, 52, 60]
      },
      socialUnrest: {
        riskScore: 35,
        socialMedia: "Recruitment keywords 'unskilled work' up 42% on local platforms",
        crimeReports: "2 incidents of unregistered child labor reported near railway yard",
        protestMonitoring: "Calm. Minor civic protests resolved in Katihar",
        sentimentAnalysis: "-0.45 (Moderate distress)",
        communityAlerts: "Transit watch volunteers flagged suspicious vehicle activity in area 4"
      },
      predictedCases: {
        value: 114,
        changePercent: "+36%",
        confidence: 86,
        historicalComparison: "Average of 84 cases over last month",
        weeklyForecast: [72, 85, 94, 102, 114, 120, 128],
        monthlyForecast: [114, 145, 178, 210]
      },
      expectedLocations: [
        { name: "Assam Sector 4", probability: 85, confidence: 90, expectedTime: "24-48 Hours", distance: "32 km", lastActivity: "Ad-hoc bus hub crowd surge detected", details: "Highest risk of coordinated network staging." },
        { name: "Siliguri Corridor", probability: 62, confidence: 85, expectedTime: "12-24 Hours", distance: "88 km", lastActivity: "Suspicious vehicle flagged at NH-31 toll plaza", details: "Key choke point for inter-state transit." },
        { name: "Katihar Junction", probability: 48, confidence: 80, expectedTime: "48-72 Hours", distance: "145 km", lastActivity: "Increased unreserved ticket booking trends", details: "Major rail junction linking northern sectors." }
      ],
      threatProbability: {
        gaugeValue: 72,
        trend: "Rising sharply due to rainfall blockades",
        forecast: "Peak intensity predicted on weekend transit cycles",
        riskContributors: ["Unmonitored evening bus departures", "Shortage of female protection officers"],
        mitigationSuggestions: "Mandatory ID checks at private bus counters."
      },
      confidenceScore: {
        accuracy: "92.4% historical match",
        freshness: "Generated 24h ago",
        level: "High",
        reliability: "Stable Model Calibration",
        quality: "Grade-A Government Standard",
        modelVersion: "SecCopilot v3.8.4-pro"
      },
      aiExplanation: "Historical anomalies combined with current weather patterns indicate child trafficking networks are exploiting the localized flood panic. Due to road closures in Sector 4, transit is funneling into major rail checkpoints. Immediate resource deployment is advised."
    },
    {
      id: "SIM-2026-06-23-01",
      timeframe: "Today",
      timestamp: "2026-06-23T09:15:00Z",
      migrationRisk: {
        level: "Medium",
        trend: "stable (+4% fluctuation)",
        confidence: 94,
        reasoning: "Normal agricultural activity. Minor cross-border movement is standard for seasonal labor swaps.",
        factors: ["Routine border permits", "Adequate local supply"],
        regions: ["Border Sector 1"],
        timeline: "Next 12-24 hours",
        actions: "Maintain standard alert status and regular patrol rotations."
      },
      floodRisk: {
        probability: 25,
        rainfall: "20mm",
        riverLevels: "Safe thresholds",
        satelliteData: "Clear sky (12% cloud density over borders)",
        districts: ["Karimganj"],
        forecast: "Light scattered showers",
        impactAssessment: "No impact on transit infrastructure."
      },
      economicDistress: {
        vulnerabilityScore: 35,
        employment: "Seasonal job index stable",
        migration: "Standard urban transit",
        inflation: "Food price index 4.1%",
        foodSupply: "Sufficient reserves",
        povertyIndex: "38.2",
        trendCharts: [15, 20, 22, 28, 30, 35]
      },
      socialUnrest: {
        riskScore: 12,
        socialMedia: "No abnormal patterns",
        crimeReports: "0 transit incidents",
        protestMonitoring: "No events reported",
        sentimentAnalysis: "0.15 (Neutral-positive)",
        communityAlerts: "Routine safety checks active"
      },
      predictedCases: {
        value: 24,
        changePercent: "-12%",
        confidence: 94,
        historicalComparison: "Baseline remains low under local patrol vigilance",
        weeklyForecast: [24, 26, 28, 25, 24, 23, 22],
        monthlyForecast: [24, 30, 35, 40]
      },
      expectedLocations: [
        { name: "Border Sector 1", probability: 45, confidence: 95, expectedTime: "Today", distance: "12 km", lastActivity: "Routine patrol check-in", details: "Border post operating at normal capacity." }
      ],
      threatProbability: {
        gaugeValue: 28,
        trend: "Minor decrease",
        forecast: "Low threat window",
        riskContributors: ["Occasional late border passings"],
        mitigationSuggestions: "Standard monitoring procedures."
      },
      confidenceScore: {
        accuracy: "96.1% historical match",
        freshness: "Generated 3 days ago",
        level: "Optimal",
        reliability: "Very high confidence",
        quality: "Grade-A Government Standard",
        modelVersion: "SecCopilot v3.8.4-pro"
      },
      aiExplanation: "Current baseline observations match typical summer patterns. The low threat probability indicates that local surveillance and administrative stability are suppressing illegal trafficking corridors."
    }
  ];

  auditLogs: any[] = [
    {
      id: "AUD-1004",
      timestamp: "2026-06-25T14:31:02Z",
      userId: "smith.kadam25@sakec.ac.in",
      userEmail: "smith.kadam25@sakec.ac.in",
      action: "Run Simulation",
      details: "Triggered 72 Hours Future Intelligence Forecast. Confidence: 90%. Detected 114 high-risk cases."
    },
    {
      id: "AUD-1003",
      timestamp: "2026-06-23T09:16:00Z",
      userId: "smith.kadam25@sakec.ac.in",
      userEmail: "smith.kadam25@sakec.ac.in",
      action: "Generate Prediction",
      details: "Simulated short-term scenario (Today). Risk levels assessed as Low-Medium."
    }
  ];
}

export const db = new DataStore();
