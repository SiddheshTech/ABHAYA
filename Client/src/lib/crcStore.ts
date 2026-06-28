import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface ChildInfo {
  id: string;
  name: string;
  age: number;
  shelter: string;
  status: string;
  risk: 'Low' | 'Medium' | 'High';
  photo?: string;
  officerNotes?: string;
  caseWorker?: string;
}

export interface ShelterInfo {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  availableBeds: number;
  staff: number;
  medicalKits: number;
  safeRooms: number;
  status: 'Active' | 'Warning' | 'Critical';
  doctors?: string;
  counsellors?: string;
  inspectionHistory?: string;
  performanceScore?: string;
  fundingStatus?: string;
  supplyStatus?: string;
  details?: string;
}

export interface FamilyMatchInfo {
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

export interface WellnessInfo {
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

export interface JourneyMilestoneInfo {
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

interface CRCState {
  childrenUnderCare: number;
  newRescues: number;
  familyMatches: number;
  medicalCases: number;
  successRate: number;
  urgentCases: number;

  priorityQueue: { label: string; count: number; type: string }[];
  recoveryPipeline: { stage: string; active: boolean; count: number }[];
  schedule: { label: string; time: string; iconName: string }[];
  dailyBrief: { label: string; value: string }[];

  childrenList: ChildInfo[];
  sheltersList: ShelterInfo[];
  matchesList: FamilyMatchInfo[];
  wellnessList: WellnessInfo[];
  journeysList: JourneyMilestoneInfo[];

  socket: Socket | null;

  // Actions
  init: () => Promise<void>;
  updateChildStatus: (id: string, newStatus: string) => Promise<void>;
  updateFamilyMatchStatus: (id: string, status: string) => Promise<void>;
  updateJourneyMilestone: (id: string, updates: Partial<JourneyMilestoneInfo>) => Promise<void>;
  updateWellnessRecord: (id: string, updates: Partial<WellnessInfo>) => Promise<void>;
  addScheduleItem: (label: string, time: string, iconName: string) => void;
  allocateResource: (type: string) => void;
}

export const useCRCStore = create<CRCState>((set, get) => ({
  childrenUnderCare: 0,
  newRescues: 0,
  familyMatches: 0,
  medicalCases: 0,
  successRate: 94,
  urgentCases: 0,

  priorityQueue: [],
  recoveryPipeline: [],
  schedule: [],
  dailyBrief: [],

  childrenList: [],
  sheltersList: [],
  matchesList: [],
  wellnessList: [],
  journeysList: [],
  socket: null,

  init: async () => {
    if (get().socket) return; // already initialized

    try {
      const [childrenData, sheltersData, matchesData, wellnessData, journeysData, statsData] = await Promise.all([
        fetch('http://localhost:5000/api/children').then(r => r.json()),
        fetch('http://localhost:5000/api/shelters').then(r => r.json()),
        fetch('http://localhost:5000/api/family-matches').then(r => r.json()),
        fetch('http://localhost:5000/api/wellness').then(r => r.json()),
        fetch('http://localhost:5000/api/journeys').then(r => r.json()),
        fetch('http://localhost:5000/api/stats').then(r => r.json())
      ]);

      const mapChildren = (data: any[]): ChildInfo[] => data.map(c => ({
        id: c.id,
        name: c.name,
        age: c.age,
        shelter: c.location,
        status: c.status,
        risk: c.riskLevel ? c.riskLevel.replace(' Risk', '') as any : 'Low',
        photo: c.profileImage,
        officerNotes: c.officerNotes,
        caseWorker: c.caseWorker
      }));

      const mapShelters = (data: any[]): ShelterInfo[] => data.map(s => ({
        id: s.id,
        name: s.name,
        capacity: s.capacity,
        occupancy: s.occupancy,
        availableBeds: s.capacity - s.occupancy,
        staff: s.staffAvailable,
        medicalKits: Math.floor(s.capacity / 5),
        safeRooms: Math.floor(s.capacity / 15),
        status: s.status === 'Normal' ? 'Active' : s.status === 'Capacity Warning' ? 'Warning' : 'Critical',
        doctors: s.doctors,
        counsellors: s.counsellors,
        inspectionHistory: s.inspectionHistory,
        performanceScore: s.performanceScore,
        fundingStatus: s.fundingStatus,
        supplyStatus: s.supplyStatus,
        details: s.details
      }));

      set({
        childrenList: mapChildren(childrenData),
        sheltersList: mapShelters(sheltersData),
        matchesList: matchesData,
        wellnessList: wellnessData,
        journeysList: journeysData,
        childrenUnderCare: statsData.totalChildren,
        newRescues: statsData.newRescues,
        familyMatches: statsData.familyMatches,
        medicalCases: statsData.medicalCases,
        urgentCases: statsData.urgentCases,
        successRate: statsData.successRate,
        priorityQueue: statsData.priorityQueue || [],
        recoveryPipeline: statsData.recoveryPipeline || [],
        schedule: statsData.schedule || [],
        dailyBrief: statsData.dailyBrief || []
      });

      const socket = io('http://localhost:5000');
      
      socket.on('update', async ({ type, data }) => {
        if (type === 'children') set({ childrenList: mapChildren(data) });
        if (type === 'shelters') set({ sheltersList: mapShelters(data) });
        if (type === 'family-matches') set({ matchesList: data });
        if (type === 'wellness') set({ wellnessList: data });
        if (type === 'journeys') set({ journeysList: data });
        
        // Refresh stats
        const stats = await fetch('http://localhost:5000/api/stats').then(r => r.json());
        set({
          childrenUnderCare: stats.totalChildren,
          newRescues: stats.newRescues,
          familyMatches: stats.familyMatches,
          medicalCases: stats.medicalCases,
          urgentCases: stats.urgentCases,
          successRate: stats.successRate,
          priorityQueue: stats.priorityQueue || [],
          recoveryPipeline: stats.recoveryPipeline || [],
          schedule: stats.schedule || [],
          dailyBrief: stats.dailyBrief || []
        });
      });

      set({ socket });

    } catch (e) {
      console.error("Error initializing CRC store:", e);
    }
  },

  updateChildStatus: async (id, newStatus) => {
    try {
       await fetch(`/api/children/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  },

  updateFamilyMatchStatus: async (id, status) => {
    try {
      await fetch(`/api/family-matches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error("Failed to update family match status", e);
    }
  },

  updateJourneyMilestone: async (id, updates) => {
    try {
      await fetch(`/api/journeys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error("Failed to update journey milestone", e);
    }
  },

  updateWellnessRecord: async (id, updates) => {
    try {
      await fetch(`/api/wellness/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error("Failed to update wellness record", e);
    }
  },

  addScheduleItem: (label, time, iconName) => {
    set((state) => ({
      schedule: [
        { label, time, iconName },
        ...state.schedule
      ]
    }));
  },

  allocateResource: (type) => {
    console.log("Allocating resource:", type);
  }
}));
