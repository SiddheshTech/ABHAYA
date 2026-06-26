import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { db } from "./server/dataStore";
import { GoogleGenAI } from "@google/genai";
import { initialCriminalProfiles, CriminalProfile } from "./server/criminalStore";
import { knowledgeDb } from "./server/knowledgeStore";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function activeTimeframeOffset(timeframe: string): number {
  switch (timeframe) {
    case "Today": return 0;
    case "24 Hours": return 1;
    case "72 Hours": return 2;
    case "1 Week": return 3;
    case "1 Month": return 4;
    default: return 2;
  }
}

function generateProceduralPrediction(timeframe: string, customPrompt?: string) {
  const randOffset = Math.floor(Math.random() * 10) - 5;
  const timestamp = new Date().toISOString();
  const id = `SIM-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000)}`;

  let cases = 114;
  let riskLevel = "High";
  let probVal = 72;
  let confidenceVal = 86;
  let explanation = "Procedural AI models have calculated threat vectors based on localized monsoons and transit flow rates.";

  if (timeframe === "Today") {
    cases = 24 + randOffset;
    riskLevel = "Medium";
    probVal = 28 + Math.floor(Math.random() * 6);
    confidenceVal = 94;
    explanation = "The today forecast indicates stable regional activity with slight elevation due to seasonal border adjustments. Surveillance points in Border Sector 1 report standard compliance.";
  } else if (timeframe === "24 Hours") {
    cases = 58 + randOffset;
    riskLevel = "Medium";
    probVal = 48 + Math.floor(Math.random() * 10);
    confidenceVal = 91;
    explanation = "A 24-hour lookahead reveals gathering convective activity and heavy initial downpours in northern sectors, triggering localized distress migration towards low-lying transit lines.";
  } else if (timeframe === "72 Hours") {
    cases = 114 + randOffset;
    riskLevel = "High";
    probVal = 72 + Math.floor(Math.random() * 10);
    confidenceVal = 86;
    explanation = "Critical 72-hour forecast: Rising river levels are blocking major road lanes, funneling regional movement into railway networks at Katihar and Siliguri corridor. Risk of exploitation spikes significantly.";
  } else if (timeframe === "1 Week") {
    cases = 245 + randOffset;
    riskLevel = "High";
    probVal = 84 + Math.floor(Math.random() * 8);
    confidenceVal = 80;
    explanation = "1-Week strategic horizon: Extensive waterlogging forces administrative delays. Sub-surface intelligence flags coordinated placement of unvetted agents near regional relief camps.";
  } else if (timeframe === "1 Month") {
    cases = 912 + randOffset;
    riskLevel = "Critical";
    probVal = 91 + Math.floor(Math.random() * 5);
    confidenceVal = 72;
    explanation = "1-Month systemic lookahead: Relentless socio-economic pressure from harvest damage leads to a projected 32% increase in rural-to-urban transit. Persistent monitoring and preventive NGO placement are critical.";
  }

  if (customPrompt) {
    explanation += ` [Query Focus: ${customPrompt}]`;
  }

  const offset = activeTimeframeOffset(timeframe);

  return {
    id,
    timeframe,
    timestamp,
    migrationRisk: {
      level: riskLevel,
      trend: timeframe === "Today" ? "stable (+4%)" : `escalating (+${10 + offset * 6}% trend)`,
      confidence: confidenceVal,
      reasoning: `Socio-economic indicators and seasonal shifts indicate that ${timeframe === "Today" ? "baseline" : "escalating"} stress is driving migration toward border sectors.`,
      factors: [
        "Monsoon Displacement",
        timeframe === "1 Month" ? "Extreme Economic Distress" : "Harvest Delay",
        "Transit Corridors Activity"
      ],
      regions: [timeframe === "Today" ? "Border Sector 1" : "Assam Sector 4", "Siliguri Corridor"],
      timeline: timeframe === "Today" ? "Immediate" : `Peaking in ${timeframe}`,
      actions: `Increase personnel at major railway terminals and deploy emergency counseling desks.`
    },
    floodRisk: {
      probability: timeframe === "Today" ? 25 : timeframe === "24 Hours" ? 50 : timeframe === "72 Hours" ? 85 : 92,
      rainfall: timeframe === "Today" ? "20mm" : timeframe === "24 Hours" ? "65mm" : "140mm",
      riverLevels: timeframe === "Today" ? "Normal" : timeframe === "24 Hours" ? "+0.5m" : "+1.4m above critical baseline",
      satelliteData: timeframe === "Today" ? "Scattered clouds" : "Severe cloud coverage (above 85% density)",
      districts: ["Dhubri", "Cachar", "Karimganj"],
      forecast: timeframe === "Today" ? "Light scattered rain" : "Sustained heavy monsoons and convective rain bands",
      impactAssessment: "Flooded agricultural roads will redirect movement to Siliguri and Katihar rail transit points."
    },
    economicDistress: {
      vulnerabilityScore: timeframe === "Today" ? 35 : timeframe === "24 Hours" ? 45 : 60,
      employment: timeframe === "Today" ? "Stable" : "Seasonal job availability index down by 14%",
      migration: timeframe === "Today" ? "Standard" : "+22% outflow from farming districts",
      inflation: "Food supply index is up 8.5%",
      foodSupply: "Ration centers experiencing high queue delays due to localized floods",
      povertyIndex: "41.5",
      trendCharts: Array.from({ length: 6 }, (_, i) => 20 + i * (timeframe === "Today" ? 3 : 8))
    },
    socialUnrest: {
      riskScore: timeframe === "Today" ? 12 : timeframe === "24 Hours" ? 22 : 35 + Math.floor(Math.random() * 10),
      socialMedia: "Unverified transit ads and 'help wanted' border posts increased by 38%",
      crimeReports: timeframe === "Today" ? "None reported" : "2 complaints of child labor near transit junctions",
      protestMonitoring: "Civic protest resolved in adjacent districts",
      sentimentAnalysis: timeframe === "Today" ? "Neutral (0.12)" : "Distressed (-0.54)",
      communityAlerts: "Transit watch volunteers flagged unvetted transport vans operating near station gates."
    },
    predictedCases: {
      value: cases,
      changePercent: timeframe === "Today" ? "-12%" : `+${12 + offset * 12}%`,
      confidence: confidenceVal,
      historicalComparison: `Baseline of 84 cases over previous weeks is projected to ${timeframe === "Today" ? "decrease" : "increase"}.`,
      weeklyForecast: Array.from({ length: 7 }, (_, i) => Math.floor(cases * (0.6 + i * 0.1))),
      monthlyForecast: Array.from({ length: 4 }, (_, i) => Math.floor(cases * (1 + i * 0.3)))
    },
    expectedLocations: [
      { name: timeframe === "Today" ? "Border Sector 1" : "Assam Sector 4", probability: timeframe === "Today" ? 45 : 85, confidence: confidenceVal, expectedTime: "24-48 Hours", distance: "32 km", lastActivity: "Ad-hoc bus hub crowd surge detected", details: "Highest risk of coordinated network staging." },
      { name: "Siliguri Corridor", probability: timeframe === "Today" ? 30 : 62, confidence: confidenceVal - 5, expectedTime: "12-24 Hours", distance: "88 km", lastActivity: "Suspicious vehicle flagged at toll plaza", details: "Key choke point for inter-state transit." },
      { name: "Katihar Junction", probability: timeframe === "Today" ? 15 : 48, confidence: confidenceVal - 10, expectedTime: "48-72 Hours", distance: "145 km", lastActivity: "Increased unreserved ticket booking trends", details: "Major rail junction linking northern sectors." }
    ],
    threatProbability: {
      gaugeValue: probVal,
      trend: timeframe === "Today" ? "Stable" : "Rising steeply due to severe rainfall blockades",
      forecast: "Peak intensity predicted on weekend transit cycles",
      riskContributors: ["Unmonitored evening departures", "Shortage of border protection officers"],
      mitigationSuggestions: "Mandatory biometrics validation at private terminals."
    },
    confidenceScore: {
      accuracy: timeframe === "Today" ? "96.1% historical match" : "92.4% historical match",
      freshness: "Generated just now",
      level: timeframe === "Today" ? "Optimal" : "High",
      reliability: "Stable Model Calibration",
      quality: "Grade-A Government Standard",
      modelVersion: "SecCopilot v3.8.4-pro"
    },
    aiExplanation: explanation
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  app.use(express.json());

  // Initialize criminal profiles in db if not present
  if (!(db as any).criminalProfiles) {
    (db as any).criminalProfiles = [...initialCriminalProfiles];
  }

  // Criminal Intelligence Platform API Endpoints
  app.get("/api/criminal/search", (req, res) => {
    const q = (req.query.q as string || "").toLowerCase().trim();
    const profiles: CriminalProfile[] = (db as any).criminalProfiles || initialCriminalProfiles;
    
    if (!q) {
      res.json(profiles);
      return;
    }
    
    const results = profiles.filter(p => {
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.alias.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.aadhaar.toLowerCase().includes(q) ||
        p.vehicle.toLowerCase().includes(q) ||
        p.fingerprintId.toLowerCase().includes(q) ||
        p.voiceId.toLowerCase().includes(q) ||
        p.firNumber.toLowerCase().includes(q) ||
        p.investigationId.toLowerCase().includes(q) ||
        p.dominantArchetype.toLowerCase().includes(q)
      );
    });
    
    res.json(results);
  });

  app.get("/api/criminal/profile/:id", (req, res) => {
    const id = req.params.id;
    const profiles: CriminalProfile[] = (db as any).criminalProfiles || initialCriminalProfiles;
    const found = profiles.find(p => p.id.toLowerCase() === id.toLowerCase() || p.name.toLowerCase().includes(id.toLowerCase()) || p.alias.toLowerCase().includes(id.toLowerCase()));
    if (found) {
      res.json(found);
    } else {
      res.status(404).json({ error: `Subject ${id} not found.` });
    }
  });

  app.post("/api/criminal/profiler", async (req, res) => {
    try {
      const { profileId, customSeed } = req.body;
      const profiles: CriminalProfile[] = (db as any).criminalProfiles || initialCriminalProfiles;
      
      let profile = profiles.find(p => p.id === profileId);
      
      const key = process.env.GEMINI_API_KEY;
      
      if (key) {
        try {
          const ai = getGeminiClient();
          
          const systemInstruction = `You are "Behavioral Intelligence Copilot", a world-class AI profiling, forecasting, and crime-predictive system utilized by the National Investigation Agency (NIA) and national security bureaus.
          Your task is to generate or enrich a comprehensive criminal profiling payload using multimodal intelligence vectors.`;
          
          const prompt = `Perform complete deep psychological and behavioral profiling for Subject ID "${profileId || "CR-8824"}" (Context seed: "${customSeed || "standard investigation"}").
          Your output must be a single, valid JSON object matching this EXACT structure:
          {
            "id": "string",
            "name": "string",
            "alias": "string",
            "phone": "string",
            "email": "string",
            "aadhaar": "string",
            "vehicle": "string",
            "faceMatchScore": number,
            "fingerprintId": "string",
            "voiceId": "string",
            "firNumber": "string",
            "investigationId": "string",
            "status": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
            "statusText": "string",
            "dominantArchetype": "string",
            "similarityScore": number,
            "similarityReason": "string",
            "riskLevel": number,
            "violencePotential": number,
            "reoffendingProbability": number,
            "manipulationIndex": number,
            "influenceScore": number,
            "networkValue": number,
            "psychologicalStability": number,
            "escalationProbability": number,
            "threatTimeline": "string",
            "confidence": number,
            "archetypeDistribution": [
              { "id": "string", "score": number, "confidence": number, "trend": "rising"|"stable"|"declining", "history": [number, number, number, number] }
            ],
            "behaviorHistory": [
              { "id": "string", "title": "string", "year": "string", "description": "string", "location": "string", "evidence": "string", "associatedCases": ["string"], "confidence": number, "officerNotes": "string", "image": "string", "document": "string" }
            ],
            "associatedCases": [
              { "id": "string", "title": "string", "similarityScore": number, "status": "Open"|"Closed"|"Under Investigation", "linkedFirs": ["string"], "investigationReports": ["string"], "knownAssociates": ["string"], "victims": ["string"], "witnesses": ["string"], "evidence": ["string"] }
            ],
            "primaryDeductions": [
              { "id": "string", "title": "string", "description": "string", "type": "pattern"|"similarity"|"alert" }
            ],
            "likelyBehavior": [
              { "id": "string", "category": "Transport"|"Communication"|"Victim Selection"|"Operational Hours"|"Technology Usage"|"Movement Radius"|"Leadership"|"Financial Pattern"|"Recruitment Strategy"|"Safe Houses", "title": "string", "description": "string", "icon": "string", "why": "string" }
            ],
            "behavioralForecast": {
              "primaryDeductions": ["string"],
              "likelyActions": ["string"],
              "likelyLocations": ["string"],
              "likelyTargets": ["string"],
              "recruitmentPattern": "string",
              "communicationPattern": "string",
              "escapeRoutes": ["string"],
              "futureCrimes": ["string"],
              "predictedTimeline": "string",
              "behaviorConfidence": number,
              "explanation": "string"
            }
          }
          
          Fill out all fields completely. Ensure there is absolutely NO placeholder content. The names, districts (such as Siliguri, Latehar, Katihar, Dhubri), details and cases must feel highly professional and aligned with national security registries. Output ONLY valid parseable JSON.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0.4
            }
          });
          
          const text = response?.text;
          if (text) {
            const parsedProfile = JSON.parse(text.trim()) as CriminalProfile;
            
            // Check if profile exists, update it. If not, insert it.
            const index = profiles.findIndex(p => p.id === parsedProfile.id || p.id === profileId);
            if (index !== -1) {
              profiles[index] = { ...profiles[index], ...parsedProfile };
              profile = profiles[index];
            } else {
              profiles.unshift(parsedProfile);
              profile = parsedProfile;
            }
            
            (db as any).criminalProfiles = profiles;
            
            // Notify WebSocket clients
            io.emit("update", { type: "criminal_profiles", data: profiles });
            
            res.json({ success: true, source: "gemini", data: profile });
            return;
          }
        } catch (geminiErr) {
          console.error("Gemini failed to generate profile, switching to fallback:", geminiErr);
        }
      }
      
      // Fallback
      if (!profile) {
        // Create dummy / new profile
        const newId = profileId || `CR-${Math.floor(1000 + Math.random() * 9000)}`;
        const seedProfile: CriminalProfile = {
          id: newId,
          name: "Amitabh Sharma",
          alias: "The Director",
          phone: "+91 94311 00293",
          email: "a.sharma@indiaprotect.org",
          aadhaar: "8821 4452 9011",
          vehicle: "UP-32-DK-4021",
          faceMatchScore: 84,
          fingerprintId: "FP-102-Y9921",
          voiceId: "VP-INDIA-9921",
          firNumber: "FIR-2025-99B",
          investigationId: "INV-9921-BIHAR",
          status: "HIGH",
          statusText: "High Alert",
          lastUpdated: "Profile generated just now",
          dominantArchetype: "Manipulator",
          similarityScore: 81,
          similarityReason: "Matches high-vulnerability financial coercion operations in northern sectors.",
          riskLevel: 78,
          violencePotential: 25,
          reoffendingProbability: 75,
          manipulationIndex: 91,
          influenceScore: 86,
          networkValue: 80,
          psychologicalStability: 65,
          escalationProbability: 58,
          threatTimeline: "Strategic staging predicted within 72 hours.",
          confidence: 85,
          archetypeDistribution: [
            { id: "Manipulator", score: 91, confidence: 88, trend: "rising", history: [80, 85, 89, 91] },
            { id: "Recruiter", score: 70, confidence: 80, trend: "stable", history: [70, 70, 70, 70] },
            { id: "Transporter", score: 35, confidence: 65, trend: "declining", history: [45, 40, 38, 35] },
            { id: "Scout", score: 62, confidence: 75, trend: "rising", history: [55, 58, 60, 62] },
            { id: "Leader", score: 80, confidence: 84, trend: "rising", history: [72, 75, 78, 80] },
            { id: "Coordinator", score: 75, confidence: 82, trend: "stable", history: [75, 75, 75, 75] },
            { id: "Financier", score: 85, confidence: 89, trend: "rising", history: [78, 80, 83, 85] },
            { id: "Communicator", score: 82, confidence: 85, trend: "stable", history: [82, 82, 82, 82] }
          ],
          behaviorHistory: [
            {
              id: "EV-991",
              title: "Fake Job Camps",
              year: "2025",
              description: "Conducted unregistered youth technical workshops in drought districts, logging minor details.",
              location: "Gaya Technical Annex",
              evidence: "Attendance logs, fake job letters",
              associatedCases: ["#OP-RESCUE-99"],
              confidence: 85,
              officerNotes: "Subject operated small training center offering quick computer certifications. Used this to profile families.",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
              document: "GAYA-EDU-AUDIT.pdf"
            }
          ],
          associatedCases: [
            {
              id: "#OP-RESCUE-99",
              title: "Latehar Minor Interception",
              similarityScore: 81,
              status: "Closed",
              linkedFirs: ["FIR-2024-12"],
              investigationReports: ["IR-LATEHAR-009-A"],
              knownAssociates: ["Birsa Soren"],
              victims: ["Ananya"],
              witnesses: ["Som Soren"],
              evidence: ["Counterfeit educational registration ID"]
            }
          ],
          primaryDeductions: [
            {
              id: "PD-Sharma-1",
              title: "High manipulation mesh",
              description: "Relies on trust and financial contracts rather than physical coercion.",
              type: "pattern"
            }
          ],
          likelyBehavior: [
            {
              id: "LB-Sharma-1",
              category: "Technology Usage",
              title: "Encrypted Chat Matrix",
              description: "Operates decentralized coordination nodes via Telegram and Session applications.",
              icon: "Zap",
              why: "Prevents central surveillance taps from identifying his staging assets."
            }
          ],
          behavioralForecast: {
            primaryDeductions: ["Prefers urban hubs for recruitment campaigns.", "Operates through trusted educational agents."],
            likelyActions: ["Establishment of digital recruitment site.", "Relocation of operations to Patna sector."],
            likelyLocations: ["Patna University outer sectors", "Darbhanga central transit"],
            likelyTargets: ["Unemployed youth", "Separated children seeking scholarship funds"],
            recruitmentPattern: "Offers full boarding school sponsorships in metropolitan centers.",
            communicationPattern: "Decentralized messaging under aliases.",
            escapeRoutes: ["National Highway 2 via express bus", "Patna-Kolkata rail line"],
            futureCrimes: ["Digital identity fraud", "Coerced recruitment transit"],
            predictedTimeline: "Active window next week during university admissions.",
            behaviorConfidence: 89.2,
            explanation: "Analytical models identify a high-risk alignment with youth recruitment trends. The subject's digital fingerprints place him near transit nodes during peak admissions cycles."
          }
        };
        
        profiles.unshift(seedProfile);
        profile = seedProfile;
        (db as any).criminalProfiles = profiles;
      } else {
        // Slightly randomize values to simulate "live running" / updates
        profile.riskLevel = Math.min(100, Math.max(10, profile.riskLevel + Math.floor(Math.random() * 7) - 3));
        profile.violencePotential = Math.min(100, Math.max(10, profile.violencePotential + Math.floor(Math.random() * 7) - 3));
        profile.reoffendingProbability = Math.min(100, Math.max(10, profile.reoffendingProbability + Math.floor(Math.random() * 7) - 3));
        profile.similarityScore = Math.min(100, Math.max(10, profile.similarityScore + Math.floor(Math.random() * 5) - 2));
        profile.lastUpdated = `Profile updated just now`;
      }
      
      io.emit("update", { type: "criminal_profiles", data: profiles });
      
      res.json({ success: true, source: "procedural", data: profile });
    } catch (err: any) {
      console.error("Profiler endpoint error:", err);
      res.status(500).json({ error: err.message || "Failed to run AI profiling" });
    }
  });

  // API Routes for Dashboard
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/stats", (req, res) => {
    const totalChildren = db.children.length;
    const newRescues = db.children.filter(c => c.status === "Rescued" || c.status === "Verification").length;
    const familyMatches = db.familyMatches.filter(m => m.status === "Approved" || m.status === "Interview Scheduled").length;
    const medicalCases = db.children.filter(c => c.medicalAlerts.length > 0).length;
    const successRate = 94; // Example
    const urgentCases = db.children.filter(c => c.riskLevel === "High Risk").length;
    
    // Mission specific stats
    const activeMissions = db.missions.filter(m => m.status === "Active").length;
    const officersDeployed = db.teams.reduce((acc, t) => acc + (t.status !== 'Idle' ? 4 : 0), 0); // approx
    const activeDrones = db.drones.length;
    const searchRadiusKm = db.missions.reduce((acc, m) => acc + parseInt(m.area) || 0, 0);

    res.json({ 
      totalChildren, newRescues, familyMatches, medicalCases, successRate, urgentCases,
      activeMissions, officersDeployed, activeDrones, searchRadiusKm
    });
  });

  app.get("/api/children", (req, res) => {
    res.json(db.children);
  });

  app.put("/api/children/:id", (req, res) => {
    const childId = req.params.id;
    const index = db.children.findIndex(c => c.id === childId);
    if (index !== -1) {
      db.children[index] = { ...db.children[index], ...req.body };
      io.emit("update", { type: "children", data: db.children });
      res.json(db.children[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/shelters", (req, res) => {
    res.json(db.shelters);
  });

  app.put("/api/shelters/:id", (req, res) => {
    const shelterId = req.params.id;
    const index = db.shelters.findIndex(s => s.id === shelterId);
    if (index !== -1) {
      db.shelters[index] = { ...db.shelters[index], ...req.body };
      io.emit("update", { type: "shelters", data: db.shelters });
      res.json(db.shelters[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/family-matches", (req, res) => {
    res.json(db.familyMatches);
  });

  app.put("/api/family-matches/:id", (req, res) => {
    const matchId = req.params.id;
    const index = db.familyMatches.findIndex(m => m.id === matchId);
    if (index !== -1) {
      const updatedMatch = { ...db.familyMatches[index], ...req.body };
      db.familyMatches[index] = updatedMatch;
      io.emit("update", { type: "family-matches", data: db.familyMatches });

      // Auto-advance milestones if the match is Approved!
      if (updatedMatch.status === "Approved") {
        db.journeyMilestones = db.journeyMilestones.map(j => {
          if (j.childId === updatedMatch.childId) {
            if (j.title === "Identity Verification" || j.title === "Family Matching") {
              return { ...j, status: "Completed", progressPercentage: 80, currentStage: "Reintegration" };
            }
            if (j.title === "Reintegration") {
              return { ...j, status: "Current", progressPercentage: 80, currentStage: "Reintegration" };
            }
            return { ...j, progressPercentage: 80, currentStage: "Reintegration" };
          }
          return j;
        });
        io.emit("update", { type: "journeys", data: db.journeyMilestones });
      }

      res.json(db.familyMatches[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/wellness", (req, res) => {
    res.json(db.wellnessRecords);
  });

  app.put("/api/wellness/:id", (req, res) => {
    const id = req.params.id;
    const index = db.wellnessRecords.findIndex(w => w.id === id);
    if (index !== -1) {
      db.wellnessRecords[index] = { ...db.wellnessRecords[index], ...req.body };
      io.emit("update", { type: "wellness", data: db.wellnessRecords });
      res.json(db.wellnessRecords[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array" });
        return;
      }

      const activeChildrenStr = db.children.map(c => 
        `- ID: ${c.id}, Name: ${c.name}, Age: ${c.age}, Gender: ${c.gender}, Location: ${c.location}, Status: ${c.status}, Risk: ${c.riskLevel}, Arrival: ${c.arrivalDate}`
      ).join("\n");

      const sheltersStr = db.shelters.map(s => 
        `- ID: ${s.id}, Name: ${s.name}, Capacity: ${s.capacity}, Occupancy: ${s.occupancy}, Status: ${s.status}, Specialized Care: ${s.specializedCare.join(", ")}`
      ).join("\n");

      const matchesStr = db.familyMatches.map(m => 
        `- Match ID: ${m.id}, Child ID: ${m.childId}, Parent/Relative: ${m.matchName}, Relationship: ${m.relationship}, Confidence: ${m.confidenceScore}%, Biometric Match: ${m.biometricMatch}%, Voice Match: ${m.voiceMatch}%, Status: ${m.status}, Region: ${m.location}`
      ).join("\n");

      const wellnessStr = db.wellnessRecords.map(w => 
        `- Child ID: ${w.childId}, Physical Health: ${w.physicalHealth}/100, Mental Health: ${w.mentalHealth}/100, Nutrition: ${w.nutrition}/100, Education: ${w.education}/100, Emotional Recovery: ${w.emotional}/100, Social Development: ${w.social}/100, Alerts: ${w.medicalAlerts.join(", ")}`
      ).join("\n");

      const milestonesStr = db.journeyMilestones.map(j => 
        `- Child ID: ${j.childId}, Stage: ${j.title}, Status: ${j.status}, Date: ${j.date}, Description: ${j.description}, Progress: ${j.progressPercentage}%`
      ).join("\n");

      const ai = getGeminiClient();
      const systemInstruction = `You are "Recovery AI", an empathetic, highly capable social worker and child rehabilitation specialist assistant for the ABHAYA Mission Vatsalya Portal of the Government of India.
Your role is to help Child Welfare Officers, counsellors, and shelter operators track recovery milestones and plan reintegration journeys.

Every screen on our portal emotionally communicates: "Every child is on a journey home."

Here is the current LIVE database of children, shelters, wellness, and family matches under our care. Answer user queries by citing names, scores, and details from this data when relevant:

### ACTIVE CHILDREN:
${activeChildrenStr}

### SHELTER OPERATIONS:
${sheltersStr}

### POTENTIAL FAMILY MATCHES:
${matchesStr}

### CHILD WELLNESS RECORDS:
${wellnessStr}

### RECOVERY JOURNEY MILESTONES:
${milestonesStr}

Use this data to answer questions such as:
1. Which children require urgent support? (Look for high-risk, low wellness scores like Rahul who has severe malnutrition, or Amit with anxiety)
2. Who is closest to family reunification? (Look for Approved matches or high confidence scores like Rajesh Kumar for Priya)
3. Show likely family matches and explain why they exist using DNA, voice, language and regional correlations.
4. Predict reintegration readiness based on wellness metrics and completed milestone stages.
5. Recommend counselling (e.g., trauma-informed therapy) or medical interventions (e.g. nutrition planning, pediatrician checkups) for specific children.
6. Explain AI predictions or give daily briefs.

Keep your answers directly actionable, concise, formatted with nice markdown list bullets, and with an empathetic and professional tone. Highlight child wellness metrics and reintegration guidelines under India's Mission Vatsalya.`;

      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to contact Gemini AI" });
    }
  });

  app.get("/api/journeys", (req, res) => {
    res.json(db.journeyMilestones);
  });

  app.put("/api/journeys/:id", (req, res) => {
    const journeyId = req.params.id;
    const index = db.journeyMilestones.findIndex(j => j.id === journeyId);
    if (index !== -1) {
      db.journeyMilestones[index] = { ...db.journeyMilestones[index], ...req.body };
      io.emit("update", { type: "journeys", data: db.journeyMilestones });
      res.json(db.journeyMilestones[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // National Knowledge Vault API Endpoints
  app.get("/api/knowledge/stats", (req, res) => {
    const dynamicStats = {
      ...knowledgeDb.stats,
      latency: Math.max(5, Math.min(60, knowledgeDb.stats.latency + Math.floor(Math.random() * 7) - 3)),
      lastSync: "Just now"
    };
    res.json(dynamicStats);
  });

  app.get("/api/knowledge/search", (req, res) => {
    const q = (req.query.q as string || "").toLowerCase().trim();
    const category = (req.query.category as string || "All Data").toLowerCase();

    let entities = knowledgeDb.entities;

    if (category !== "all data") {
      entities = entities.filter(e => e.type.toLowerCase() + "s" === category || e.type.toLowerCase() === category);
    }

    if (!q) {
      res.json(entities);
      return;
    }

    const results = entities.filter(e => {
      const isIdMatch = e.id.toLowerCase().includes(q);
      const isNameMatch = e.name.toLowerCase().includes(q);
      const isStatusMatch = e.status.toLowerCase().includes(q);
      
      const detailsMatch = Object.entries(e.details).some(([key, val]) => {
        if (typeof val === "string") {
          return val.toLowerCase().includes(q);
        }
        if (typeof val === "number") {
          return val.toString().includes(q);
        }
        if (Array.isArray(val)) {
          return val.some(v => v.toString().toLowerCase().includes(q));
        }
        return false;
      });

      return isIdMatch || isNameMatch || isStatusMatch || detailsMatch;
    });

    res.json(results);
  });

  app.get("/api/knowledge/recent", (req, res) => {
    res.json(knowledgeDb.recentFeed);
  });

  app.post("/api/knowledge/recent/:id/bookmark", (req, res) => {
    const id = req.params.id;
    const item = knowledgeDb.recentFeed.find(f => f.id === id);
    if (item) {
      item.bookmarked = !item.bookmarked;
      io.emit("update", { type: "knowledge_recent", data: knowledgeDb.recentFeed });
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });

  app.post("/api/knowledge/recent/:id/status", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const item = knowledgeDb.recentFeed.find(f => f.id === id);
    if (item) {
      item.status = status;
      io.emit("update", { type: "knowledge_recent", data: knowledgeDb.recentFeed });
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });

  app.get("/api/knowledge/reports", (req, res) => {
    res.json(knowledgeDb.savedReports);
  });

  app.post("/api/knowledge/reports", (req, res) => {
    const { title, type, author, content, tags } = req.body;
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      title: title || "Untitled AI Analysis",
      type: type || "AI Report",
      author: author || "Dr. Smith Kadam",
      date: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      version: 1,
      versionHistory: [
        { version: 1, date: new Date().toISOString().split('T')[0], author: author || "Dr. Smith Kadam", changes: "Created document" }
      ],
      status: "Draft" as const,
      content: content || "No content provided.",
      tags: tags || []
    };
    knowledgeDb.savedReports.unshift(newReport);
    io.emit("update", { type: "knowledge_reports", data: knowledgeDb.savedReports });
    res.json(newReport);
  });

  app.post("/api/knowledge/reports/:id/save", (req, res) => {
    const id = req.params.id;
    const { content, title } = req.body;
    const report = knowledgeDb.savedReports.find(r => r.id === id);
    if (report) {
      report.content = content || report.content;
      report.title = title || report.title;
      report.version += 1;
      report.versionHistory.unshift({
        version: report.version,
        date: new Date().toISOString().split('T')[0],
        author: report.author,
        changes: "Auto-saved updates"
      });
      io.emit("update", { type: "knowledge_reports", data: knowledgeDb.savedReports });
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  });

  app.post("/api/knowledge/reports/:id/sign", (req, res) => {
    const id = req.params.id;
    const { signedBy } = req.body;
    const report = knowledgeDb.savedReports.find(r => r.id === id);
    if (report) {
      report.status = "Signed";
      report.signature = {
        signedBy: signedBy || "Dr. Smith Kadam (Lab Director)",
        timestamp: new Date().toISOString(),
        hash: `SHA256:${Math.random().toString(16).substr(2, 16)}...`
      };
      io.emit("update", { type: "knowledge_reports", data: knowledgeDb.savedReports });
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  });

  app.post("/api/knowledge/reports/:id/approve", (req, res) => {
    const id = req.params.id;
    const report = knowledgeDb.savedReports.find(r => r.id === id);
    if (report) {
      report.status = "Approved";
      io.emit("update", { type: "knowledge_reports", data: knowledgeDb.savedReports });
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  });

  app.get("/api/knowledge/favorites", (req, res) => {
    res.json(knowledgeDb.favoriteCases);
  });

  app.post("/api/knowledge/favorites/:id/notes", (req, res) => {
    const id = req.params.id;
    const { personalNotes } = req.body;
    const fav = knowledgeDb.favoriteCases.find(f => f.id === id);
    if (fav) {
      fav.personalNotes = personalNotes;
      fav.lastUpdated = "Just now";
      fav.timeline.unshift({
        date: new Date().toISOString().split('T')[0],
        event: "Updated personal logs & hypotheses",
        officer: "Dr. Smith Kadam"
      });
      io.emit("update", { type: "knowledge_favorites", data: knowledgeDb.favoriteCases });
      res.json(fav);
    } else {
      res.status(404).json({ error: "Favorite case not found" });
    }
  });

  app.post("/api/knowledge/favorites/:id/reminder", (req, res) => {
    const id = req.params.id;
    const { reminderDate } = req.body;
    const fav = knowledgeDb.favoriteCases.find(f => f.id === id);
    if (fav) {
      fav.reminderDate = reminderDate;
      fav.lastUpdated = "Just now";
      io.emit("update", { type: "knowledge_favorites", data: knowledgeDb.favoriteCases });
      res.json(fav);
    } else {
      res.status(404).json({ error: "Favorite case not found" });
    }
  });

  app.get("/api/knowledge/watchlist", (req, res) => {
    res.json(knowledgeDb.watchlist);
  });

  app.post("/api/knowledge/watchlist", (req, res) => {
    const { type, value, tags, riskScore } = req.body;
    const newItem = {
      id: `WATCH-${Math.floor(100 + Math.random() * 900)}`,
      type: type || "Suspect",
      value: value || "Unknown target",
      status: "MONITORING" as const,
      addedDate: new Date().toISOString().split('T')[0],
      alertCount: 0,
      tags: tags || [],
      riskScore: riskScore || 50
    };
    knowledgeDb.watchlist.unshift(newItem);
    io.emit("update", { type: "knowledge_watchlist", data: knowledgeDb.watchlist });
    res.json(newItem);
  });

  app.post("/api/knowledge/watchlist/:id/trigger", (req, res) => {
    const id = req.params.id;
    const item = knowledgeDb.watchlist.find(w => w.id === id);
    if (item) {
      item.status = "TRIGGERED";
      item.alertCount += 1;
      item.lastMatch = `Simulated real-time trigger event at ${new Date().toLocaleTimeString()} by automated network monitoring.`;
      
      const newAlert = {
        id: `FEED-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `WATCHLIST ALERT: ${item.type} [${item.value}]`,
        category: "alert" as const,
        timestamp: "Just now",
        officer: "System Automated Linkage",
        status: "active" as const,
        bookmarked: false,
        summary: `Watchlist target of type ${item.type} [${item.value}] was triggered by live telemetric updates. Conf score ${item.riskScore}%.`,
        metadata: { watchlistId: item.id }
      };
      knowledgeDb.recentFeed.unshift(newAlert);

      io.emit("knowledge_alert", {
        message: `ALERT: Watchlist trigger for ${item.type} [${item.value}]!`,
        data: item,
        feedAlert: newAlert
      });
      io.emit("update", { type: "knowledge_watchlist", data: knowledgeDb.watchlist });
      io.emit("update", { type: "knowledge_recent", data: knowledgeDb.recentFeed });
      res.json(item);
    } else {
      res.status(404).json({ error: "Watchlist item not found" });
    }
  });

  app.get("/api/knowledge/suggestions", (req, res) => {
    res.json(knowledgeDb.suggestions);
  });

  app.get("/api/knowledge/graph", (req, res) => {
    res.json({
      nodes: knowledgeDb.entities,
      edges: knowledgeDb.edges
    });
  });

  app.get("/api/knowledge/related/:id", (req, res) => {
    const id = req.params.id;
    res.json(knowledgeDb.getRelatedRecords(id));
  });

  // Predictions History
  app.get("/api/predictions/history", (req, res) => {
    res.json((db as any).predictionHistory || []);
  });

  // Predictions Audit Logs
  app.get("/api/predictions/audit", (req, res) => {
    res.json((db as any).auditLogs || []);
  });

  // Generate / Run a customized simulation or timeline prediction
  app.post("/api/predictions/generate", async (req, res) => {
    try {
      const { timeframe, customPrompt, userEmail } = req.body;
      if (!timeframe) {
        res.status(400).json({ error: "Timeframe is required" });
        return;
      }

      let predictionResult: any = null;
      const key = process.env.GEMINI_API_KEY;

      if (key) {
        try {
          const ai = getGeminiClient();
          const prompt = `You are "Future Intelligence Simulator Pro", an advanced crime-forecasting, spatial analysis, and population movement model used by the Government of India's Ministry of Home Affairs and National Law Enforcement for predicting child trafficking and missing-child risks.
          
          Generate a detailed future intelligence simulation based on the following:
          Timeframe: "${timeframe}"
          Custom Prompt / Focus: "${customPrompt || "Focusing on monsoon flooding and rural economic migration factors"}"
          
          Provide your response in JSON format matching this EXACT schema:
          {
            "migrationRisk": {
              "level": "High" | "Medium" | "Low",
              "trend": "string",
              "confidence": number,
              "reasoning": "string",
              "factors": ["string"],
              "regions": ["string"],
              "timeline": "string",
              "actions": "string"
            },
            "floodRisk": {
              "probability": number,
              "rainfall": "string",
              "riverLevels": "string",
              "satelliteData": "string",
              "districts": ["string"],
              "forecast": "string",
              "impactAssessment": "string"
            },
            "economicDistress": {
              "vulnerabilityScore": number,
              "employment": "string",
              "migration": "string",
              "inflation": "string",
              "foodSupply": "string",
              "povertyIndex": "string",
              "trendCharts": [number, number, number, number, number, number]
            },
            "socialUnrest": {
              "riskScore": number,
              "socialMedia": "string",
              "crimeReports": "string",
              "protestMonitoring": "string",
              "sentimentAnalysis": "string",
              "communityAlerts": "string"
            },
            "predictedCases": {
              "value": number,
              "changePercent": "string",
              "confidence": number,
              "historicalComparison": "string",
              "weeklyForecast": [number, number, number, number, number, number, number],
              "monthlyForecast": [number, number, number, number]
            },
            "expectedLocations": [
              {
                "name": "string",
                "probability": number,
                "confidence": number,
                "expectedTime": "string",
                "distance": "string",
                "lastActivity": "string",
                "details": "string"
              }
            ],
            "threatProbability": {
              "gaugeValue": number,
              "trend": "string",
              "forecast": "string",
              "riskContributors": ["string"],
              "mitigationSuggestions": "string"
            },
            "confidenceScore": {
              "accuracy": "string",
              "freshness": "string",
              "level": "string",
              "reliability": "string",
              "quality": "string",
              "modelVersion": "string"
            },
            "aiExplanation": "string"
          }
          
          Output ONLY valid, parseable JSON and absolutely nothing else. Keep the data highly realistic, aligning with North-Eastern border regions like Assam, Bihar, and West Bengal (Siliguri Corridor). Ensure cases match standard time-series limits.`;

          const geminiResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3
            }
          });

          const responseText = geminiResponse.text;
          if (responseText) {
            predictionResult = JSON.parse(responseText.trim());
            // Inject random dynamic fields
            predictionResult.id = `SIM-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 10000)}`;
            predictionResult.timeframe = timeframe;
            predictionResult.timestamp = new Date().toISOString();
          }
        } catch (geminiError) {
          console.error("Gemini model generation failed, switching to high-fidelity procedural generator:", geminiError);
        }
      }

      // Procedural fallback if Gemini is absent or failed
      if (!predictionResult) {
        predictionResult = generateProceduralPrediction(timeframe, customPrompt);
      }

      // Add to database in memory
      if (!(db as any).predictionHistory) {
        (db as any).predictionHistory = [];
      }
      (db as any).predictionHistory.unshift(predictionResult);

      // Keep history to 20 items
      if ((db as any).predictionHistory.length > 20) {
        (db as any).predictionHistory.pop();
      }

      // Add to audit logs
      const auditLog = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        userId: userEmail || "smith.kadam25@sakec.ac.in",
        userEmail: userEmail || "smith.kadam25@sakec.ac.in",
        action: "Run Simulation",
        details: `Generated ${timeframe} Future Intelligence Simulation. Cases predicted: ${predictionResult.predictedCases.value}. Risk: ${predictionResult.migrationRisk.level}.`
      };

      if (!(db as any).auditLogs) {
        (db as any).auditLogs = [];
      }
      (db as any).auditLogs.unshift(auditLog);

      // Broadcast update to all connected dashboard pages
      io.emit("update", { type: "predictions", data: (db as any).predictionHistory });
      io.emit("update", { type: "audit", data: (db as any).auditLogs });

      res.json({ prediction: predictionResult, audit: auditLog });
    } catch (err: any) {
      console.error("Simulation generation endpoint error:", err);
      res.status(500).json({ error: err.message || "Failed to generate simulation predictions" });
    }
  });

  // Helper functions for AI Forensic Identity Reconstruction
  function generateProceduralReconstruction(input: any) {
    const { age, height, weight, features, language, files } = input;
    
    const names = ["Aarav Soren", "Rahul Mandi", "Sujata Mahato", "Deepak Kisku", "Sunita Marandi", "Jyoti Oraon", "Birsa Tudu", "Karan Murmu"];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const caseId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;

    const detectedAge = age || "8-10 years";
    const estimatedHeight = height || "120 cm";
    const estimatedWeight = weight || "22 kg";
    const facialDesc = features || "Birthmark on left shoulder. Scars on right knee.";
    const languageDesc = language || "Speaks a mix of Hindi and an unidentified tribal dialect.";

    return {
      caseId,
      biometricAnalysis: {
        detectedAge: `${detectedAge} (Est. 9.1 yrs)`,
        ageConfidence: 94.2,
        estimatedHeight: `${estimatedHeight} (Percentile 45th)`,
        heightConfidence: 91.5,
        estimatedWeight: `${estimatedWeight} (Percentile 38th)`,
        weightConfidence: 89.0,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        genderConfidence: 98.4,
        facialFeatures: facialDesc + " Ocular distance 62mm, prominent chin, high symmetric cheekbones.",
        facialConfidence: 95.6,
        bodyMarks: "Minor birthmark on the back of the neck.",
        marksConfidence: 85.0,
        scars: "Faint horizontal scar on right knee.",
        birthmarks: "Dark brown birthmark on left shoulder.",
        skinTone: "Medium-Dark / Olive (Fitzpatrick Type V)",
        eyeColor: "Dark Brown (Hex #2a1b14)",
        hairColor: "Black (Hex #050505)",
        hairTexture: "Coarse / Straight",
        facialStructure: "Mesoprosopic facial index (Oval structural boundary)",
        bodyProportions: "Ectomorphic development index (Sustained nutrition lag detected)",
        medicalIndicators: ["Slight nutrient deficiency (low body-fat index)", "Dermatitis on wrists"],
        biometricOverallConfidence: 93.8
      },
      voiceAnalysis: {
        noiseReductionPercent: 92.5,
        accentDetected: "Chhota Nagpur Plateau regional accent",
        dialectRecognized: "Lari Santali / Sadri vocal influence",
        languageIdentified: "Santali / Eastern Indo-Aryan fusion",
        emotionDetected: "Apprehensive / Guarded vocal tone",
        ageEstimatedByVoice: "8.5 - 10.0 years",
        genderEstimatedByVoice: "Peak frequency 245Hz (Juvenile Male)",
        speechPatternMatched: "Tribal linguistic influence with standard regional Hindi vernacular",
        voiceprintSignature: "VP-IND-774A92-M",
        voiceConfidence: 88.5
      },
      reconstructedIdentity: {
        possibleName: selectedName,
        overallConfidence: 91.2,
        region: "Jharkhand Borderlands",
        district: "Latehar / Dumka Sector",
        village: "Amrapara Tribal Village Group",
        language: "Santali / Sadri",
        likelyParents: [
          { name: "Sibu Soren", relation: "Father", confidence: 92 },
          { name: "Malati Devi", relation: "Mother", confidence: 89 }
        ],
        potentialRelatives: [
          { name: "Birsa Soren", relation: "Uncle (Paternal)", confidence: 78 },
          { name: "Rani Soren", relation: "Sister (Older)", confidence: 84 }
        ],
        schoolMatches: [
          { schoolName: "Amrapara Government Primary School", location: "Dumka", grade: "Class 3", matchScore: 91 }
        ],
        medicalMatches: [
          { condition: "Neonatal BCG Scar Match", hospitalName: "Dumka Rural Sub-center", recordDate: "2018-04-12", matchScore: 89 }
        ],
        governmentMatches: [
          { databaseName: "UIDAI State Enrolment Auxiliary", recordId: "EUX-882109-JH", status: "Incomplete Enrolment (Biometrics pending)", matchScore: 93 }
        ],
        similarities: {
          photo: 94.2,
          voice: 89.1,
          dna: 99.4,
          facial: 95.8
        },
        timeline: [
          { date: "2026-06-12", event: "First reported missing or separated near Dumka transit hub", location: "Dumka Railway Environs" },
          { date: "2026-06-18", event: "Identified by field protection unit near inter-state highway", location: "Katihar Highway Junction" },
          { date: "2026-06-26", event: "Multi-modal AI reconstruction pipeline executed at Ghost Center", location: "AI Forensics Lab" }
        ],
        explainableAI: {
          acousticPhonemes: "Vocal frequency peaks at 245Hz with nasal vowels characteristic of Latehar tribal dialects, ruling out urban Bihar origins.",
          facialStructure: "Ocular ratio and age-progression meshes map to Dumka demographic databases with 95.8% geometric congruence.",
          geographicSocioEconomic: "Underlying drought displacement maps directly correlate with the family's migration path, validating the Latehar clustering."
        }
      }
    };
  }

  // AI Identity Reconstruction Endpoint
  app.post("/api/reconstruct", async (req, res) => {
    try {
      const { age, height, weight, features, language, files, userEmail } = req.body;
      
      let reconstructionResult: any = null;
      const key = process.env.GEMINI_API_KEY;

      if (key) {
        try {
          const ai = getGeminiClient();
          const prompt = `You are "Ghost Reconstruction AI", a state-of-the-art multi-modal forensic reconstruction agent used by India's National Forensic Sciences University and security bureaus to reconstruct identities for undocumented, separated, or missing children.
          
          Based on the user's forensic input parameters below:
          - Stated/Observed Age Estimate: "${age || "8-10 years"}"
          - Stated/Observed Height: "${height || "120 cm"}"
          - Stated/Observed Weight: "${weight || "22 kg"}"
          - Physical markings/features: "${features || "Birthmark on left shoulder. Scars on right knee."}"
          - Language/vocal speech sample notes: "${language || "Speaks a mix of Hindi and an unidentified tribal dialect."}"
          - Uploaded Biometrics: "${files ? files.join(", ") : "Photo and Voice sample"}"

          Your goal is to perform a detailed forensic multi-modal analysis simulating facial recognition, OCR analysis, speech pattern matching, DNA probability, and village-level demographic matching.
          
          Provide your response in JSON format matching this EXACT schema:
          {
            "caseId": "string",
            "biometricAnalysis": {
              "detectedAge": "string",
              "ageConfidence": number,
              "estimatedHeight": "string",
              "heightConfidence": number,
              "estimatedWeight": "string",
              "weightConfidence": number,
              "gender": "string",
              "genderConfidence": number,
              "facialFeatures": "string",
              "facialConfidence": number,
              "bodyMarks": "string",
              "marksConfidence": number,
              "scars": "string",
              "birthmarks": "string",
              "skinTone": "string",
              "eyeColor": "string",
              "hairColor": "string",
              "hairTexture": "string",
              "facialStructure": "string",
              "bodyProportions": "string",
              "medicalIndicators": ["string"],
              "biometricOverallConfidence": number
            },
            "voiceAnalysis": {
              "noiseReductionPercent": number,
              "accentDetected": "string",
              "dialectRecognized": "string",
              "languageIdentified": "string",
              "emotionDetected": "string",
              "ageEstimatedByVoice": "string",
              "genderEstimatedByVoice": "string",
              "speechPatternMatched": "string",
              "voiceprintSignature": "string",
              "voiceConfidence": number
            },
            "reconstructedIdentity": {
              "possibleName": "string",
              "overallConfidence": number,
              "region": "string",
              "district": "string",
              "village": "string",
              "language": "string",
              "likelyParents": [
                {"name": "string", "relation": "string", "confidence": number}
              ],
              "potentialRelatives": [
                {"name": "string", "relation": "string", "confidence": number}
              ],
              "schoolMatches": [
                {"schoolName": "string", "location": "string", "grade": "string", "matchScore": number}
              ],
              "medicalMatches": [
                {"condition": "string", "hospitalName": "string", "recordDate": "string", "matchScore": number}
              ],
              "governmentMatches": [
                {"databaseName": "string", "recordId": "string", "status": "string", "matchScore": number}
              ],
              "similarities": {
                "photo": number,
                "voice": number,
                "dna": number,
                "facial": number
              },
              "timeline": [
                {"date": "string", "event": "string", "location": "string"}
              ],
              "explainableAI": {
                "acousticPhonemes": "string",
                "facialStructure": "string",
                "geographicSocioEconomic": "string"
              }
            }
          }

          Output ONLY valid, parseable JSON and absolutely nothing else. Ensure the outputs are rich, professional, highly detailed, realistic, and contain no generic boilerplate. Coordinate with real regional Indian demographics, linguistic patterns, and state auxiliary records.`;

          const geminiResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3
            }
          });

          const responseText = geminiResponse.text;
          if (responseText) {
            reconstructionResult = JSON.parse(responseText.trim());
          }
        } catch (geminiError) {
          console.error("Gemini reconstruction generation failed, falling back:", geminiError);
        }
      }

      if (!reconstructionResult) {
        reconstructionResult = generateProceduralReconstruction(req.body);
      }

      // Add ID and timestamp if missing
      reconstructionResult.id = reconstructionResult.caseId || `REC-${Math.floor(1000 + Math.random() * 9000)}`;
      reconstructionResult.timestamp = new Date().toISOString();

      // Store in DB in memory
      if (!(db as any).reconstructionHistory) {
        (db as any).reconstructionHistory = [];
      }
      (db as any).reconstructionHistory.unshift(reconstructionResult);

      // Create a matching "rescued/unidentified child" entry in the database so that it integrates with the rest of the app's tables/maps!
      const isExistingChild = db.children.some(c => c.name === reconstructionResult.reconstructedIdentity.possibleName);
      if (!isExistingChild) {
        const newChildId = `RC-${Math.floor(2047 + Math.random() * 1000)}`;
        const newChild = {
          id: newChildId,
          name: reconstructionResult.reconstructedIdentity.possibleName,
          age: parseInt(age) || 9,
          gender: reconstructionResult.biometricAnalysis.gender || "Male",
          location: `Hope Center, ${reconstructionResult.reconstructedIdentity.region || "Delhi"}`,
          status: "Verification",
          riskLevel: "High Risk" as const,
          arrivalDate: new Date().toISOString().split("T")[0],
          medicalAlerts: reconstructionResult.biometricAnalysis.medicalIndicators || ["Slight Nutrition Deficiency"],
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reconstructionResult.reconstructedIdentity.possibleName}`
        };
        db.children.unshift(newChild);

        // Also create a potential family match!
        const primaryRelative = reconstructionResult.reconstructedIdentity.likelyParents[0];
        if (primaryRelative) {
          db.familyMatches.unshift({
            id: `M-${Math.floor(4 + Math.random() * 1000)}`,
            childId: newChildId,
            matchName: primaryRelative.name,
            relationship: primaryRelative.relation,
            confidenceScore: primaryRelative.confidence,
            biometricMatch: Math.floor(reconstructionResult.reconstructedIdentity.similarities.facial || 95),
            voiceMatch: Math.floor(reconstructionResult.reconstructedIdentity.similarities.voice || 89),
            status: "Pending Verification",
            location: reconstructionResult.reconstructedIdentity.district || "Latehar Sector"
          });
        }
      }

      // Store in audit logs
      const auditLog = {
        id: `AUD-${Math.floor(2000 + Math.random() * 8000)}`,
        timestamp: new Date().toISOString(),
        userId: userEmail || "smith.kadam25@sakec.ac.in",
        userEmail: userEmail || "smith.kadam25@sakec.ac.in",
        action: "Identity Reconstruction",
        details: `Reconstructed identity of Case ${reconstructionResult.id}. Identified as ${reconstructionResult.reconstructedIdentity.possibleName} with ${reconstructionResult.reconstructedIdentity.overallConfidence}% overall confidence. Persisted to central NFSU database.`
      };

      if (!(db as any).forensicAuditLogs) {
        (db as any).forensicAuditLogs = [];
      }
      (db as any).forensicAuditLogs.unshift(auditLog);

      // Broadcast changes via Websockets
      io.emit("update", { type: "children", data: db.children });
      io.emit("update", { type: "family-matches", data: db.familyMatches });
      io.emit("update", { type: "reconstructions", data: (db as any).reconstructionHistory });
      io.emit("update", { type: "forensic_audit_logs", data: (db as any).forensicAuditLogs });

      res.json({ reconstruction: reconstructionResult, audit: auditLog });
    } catch (err: any) {
      console.error("Identity reconstruction error:", err);
      res.status(500).json({ error: err.message || "Failed to execute identity reconstruction" });
    }
  });

  // Get reconstructions history
  app.get("/api/reconstructions", (req, res) => {
    res.json((db as any).reconstructionHistory || []);
  });

  // Get forensic audit logs
  app.get("/api/reconstructions/audit", (req, res) => {
    res.json((db as any).forensicAuditLogs || []);
  });

  // Consolidated Search Endpoint supporting case ID, victim, region, district, officer, simulation, prediction, location
  app.get("/api/search", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase().trim();
    if (!query) {
      res.json([]);
      return;
    }

    const results: any[] = [];

    // Search Children (Victims, Cases)
    db.children.forEach(child => {
      if (child.id.toLowerCase().includes(query) || child.name.toLowerCase().includes(query) || child.location.toLowerCase().includes(query)) {
        results.push({
          id: child.id,
          title: child.name === "Unknown" ? `Unidentified Child (${child.id})` : child.name,
          subtitle: `Case ID: ${child.id} | Age: ${child.age} | ${child.location}`,
          type: "case",
          details: child
        });
      }
    });

    // Search Missions (Region/Districts)
    db.missions.forEach(m => {
      if (m.id.toLowerCase().includes(query) || m.title.toLowerCase().includes(query) || m.area.toLowerCase().includes(query)) {
        results.push({
          id: m.id,
          title: m.title,
          subtitle: `Mission ID: ${m.id} | Priority: ${m.priority} | Area: ${m.area}`,
          type: "mission",
          details: m
        });
      }
    });

    // Search Teams (Officers)
    db.teams.forEach(t => {
      if (t.id.toLowerCase().includes(query) || t.name.toLowerCase().includes(query) || t.type.toLowerCase().includes(query)) {
        results.push({
          id: t.id,
          title: t.name,
          subtitle: `Officer Unit: ${t.type} | Status: ${t.status}`,
          type: "officer",
          details: t
        });
      }
    });

    // Search Simulations/Predictions in history
    const history = (db as any).predictionHistory || [];
    history.forEach((sim: any) => {
      if (sim.id.toLowerCase().includes(query) || sim.timeframe.toLowerCase().includes(query) || (sim.aiExplanation && sim.aiExplanation.toLowerCase().includes(query))) {
        results.push({
          id: sim.id,
          title: `Simulation: ${sim.timeframe}`,
          subtitle: `ID: ${sim.id} | Cases Predicted: ${sim.predictedCases?.value || 0}`,
          type: "simulation",
          details: sim
        });
      }
    });

    // Region/District hotspots search
    const hotspots = [
      { name: "Assam Sector 4", region: "Assam Border", desc: "Critical transit choke point under high risk" },
      { name: "Siliguri Corridor", region: "West Bengal", desc: "Narrow strategic neck prone to child trafficking networks" },
      { name: "Katihar Junction", region: "Bihar Border", desc: "Major rail hub linking northern sectors" },
      { name: "Border Sector 1", region: "North-East Boundary", desc: "Standard entry checkpoint with regular monitoring" }
    ];

    hotspots.forEach(loc => {
      if (loc.name.toLowerCase().includes(query) || loc.region.toLowerCase().includes(query)) {
        results.push({
          id: `LOC-${loc.name.replace(/\s+/g, "-")}`,
          title: loc.name,
          subtitle: `Region: ${loc.region} | ${loc.desc}`,
          type: "location",
          details: loc
        });
      }
    });

    res.json(results.slice(0, 10));
  });

  // Missions
  app.get("/api/missions", (req, res) => {
    res.json(db.missions);
  });

  // Teams
  app.get("/api/teams", (req, res) => {
    res.json(db.teams);
  });

  // Drones
  app.get("/api/drones", (req, res) => {
    res.json(db.drones);
  });

  app.post("/api/emergency", (req, res) => {
    db.emergencyModeActive = true;
    db.emergencyAlerts.unshift("EMERGENCY MODE ACTIVATED");
    io.emit("update", { type: "emergency", data: { active: true, alerts: db.emergencyAlerts } });
    res.json({ success: true });
  });

  app.post("/api/emergency/broadcast", (req, res) => {
    const { message } = req.body;
    db.emergencyAlerts.unshift(message);
    io.emit("update", { type: "emergency", data: { active: db.emergencyModeActive, alerts: db.emergencyAlerts } });
    res.json({ success: true });
  });

  app.post("/api/auth/login", (req, res) => {
    res.json({ token: "fake-jwt-token", user: { role: "admin", name: "Commander" } });
  });

  // Simulation Loop for Missions
  setInterval(() => {
    // move teams a little
    db.teams = db.teams.map(t => ({
      ...t,
      location: { lat: t.location.lat + (Math.random() - 0.5) * 0.005, lng: t.location.lng + (Math.random() - 0.5) * 0.005 }
    }));
    db.drones = db.drones.map(d => ({
      ...d,
      location: { lat: d.location.lat + (Math.random() - 0.5) * 0.01, lng: d.location.lng + (Math.random() - 0.5) * 0.01 }
    }));
    db.missions = db.missions.map(m => {
      if (m.status === 'Active' && m.progress < 100) {
        return { ...m, progress: Math.min(100, m.progress + Math.floor(Math.random() * 5)) };
      }
      return m;
    });

    io.emit("update", { type: "teams", data: db.teams });
    io.emit("update", { type: "drones", data: db.drones });
    io.emit("update", { type: "missions", data: db.missions });
  }, 3000);

  // WebSocket
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Initial data sync
    socket.emit("update", { type: "children", data: db.children });
    socket.emit("update", { type: "shelters", data: db.shelters });
    socket.emit("update", { type: "family-matches", data: db.familyMatches });
    socket.emit("update", { type: "journeys", data: db.journeyMilestones });
    socket.emit("update", { type: "teams", data: db.teams });
    socket.emit("update", { type: "drones", data: db.drones });
    socket.emit("update", { type: "missions", data: db.missions });
    socket.emit("update", { type: "emergency", data: { active: db.emergencyModeActive, alerts: db.emergencyAlerts } });
    socket.emit("update", { type: "predictions", data: (db as any).predictionHistory || [] });
    socket.emit("update", { type: "audit", data: (db as any).auditLogs || [] });
    socket.emit("update", { type: "reconstructions", data: (db as any).reconstructionHistory || [] });
    socket.emit("update", { type: "forensic_audit_logs", data: (db as any).forensicAuditLogs || [] });
    socket.emit("update", { type: "criminal_profiles", data: (db as any).criminalProfiles || initialCriminalProfiles });
    
    // Knowledge Vault emissions
    socket.emit("update", { type: "knowledge_recent", data: knowledgeDb.recentFeed });
    socket.emit("update", { type: "knowledge_reports", data: knowledgeDb.savedReports });
    socket.emit("update", { type: "knowledge_favorites", data: knowledgeDb.favoriteCases });
    socket.emit("update", { type: "knowledge_watchlist", data: knowledgeDb.watchlist });
    socket.emit("update", { type: "knowledge_suggestions", data: knowledgeDb.suggestions });
    socket.emit("update", { type: "knowledge_stats", data: knowledgeDb.stats });
    
    socket.on("action", (data) => {
      console.log("Received action:", data);
      io.emit("system_alert", { message: "System status updated globally." });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
