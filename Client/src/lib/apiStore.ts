import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

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
}

interface ApiState {
  children: Child[];
  shelters: Shelter[];
  familyMatches: FamilyMatch[];
  wellnessRecords: WellnessRecord[];
  journeyMilestones: JourneyMilestone[];
  stats: any;
  socket: Socket | null;
  fetchInitialData: () => Promise<void>;
  initSocket: () => void;
  updateChildStatus: (id: string, status: string) => Promise<void>;
}

export const useApiStore = create<ApiState>((set, get) => ({
  children: [],
  shelters: [],
  familyMatches: [],
  wellnessRecords: [],
  journeyMilestones: [],
  stats: {
    totalChildren: 0,
    newRescues: 0,
    familyMatches: 0,
    medicalCases: 0,
    successRate: 0,
    urgentCases: 0
  },
  socket: null,

  fetchInitialData: async () => {
    try {
      const [children, shelters, familyMatches, wellnessRecords, journeyMilestones, stats] = await Promise.all([
        fetch('/api/children').then(r => r.json()),
        fetch('/api/shelters').then(r => r.json()),
        fetch('/api/family-matches').then(r => r.json()),
        fetch('/api/wellness').then(r => r.json()),
        fetch('/api/journeys').then(r => r.json()),
        fetch('/api/stats').then(r => r.json())
      ]);

      set({
        children,
        shelters,
        familyMatches,
        wellnessRecords,
        journeyMilestones,
        stats
      });
    } catch (error) {
      console.error("Error fetching initial data", error);
    }
  },

  initSocket: () => {
    if (get().socket) return;
    const socket = io();
    
    socket.on('update', ({ type, data }) => {
      if (type === 'children') set({ children: data });
      if (type === 'shelters') set({ shelters: data });
      if (type === 'family-matches') set({ familyMatches: data });
      // Fetch stats again
      fetch('/api/stats').then(r => r.json()).then(stats => set({ stats }));
    });

    set({ socket });
  },

  updateChildStatus: async (id: string, status: string) => {
    try {
      await fetch(`/api/children/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error(e);
    }
  }
}));
