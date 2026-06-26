import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface Location {
  lat: number;
  lng: number;
}

interface TeamMember {
  id: string;
  name: string;
  type: string;
  status: "Active" | "Idle" | "En Route" | "Emergency";
  location: Location;
  battery?: number;
}

interface Drone {
  id: string;
  name: string;
  status: "Airborne" | "Charging" | "Deploying" | "Searching" | "Hovering" | "Maintenance";
  location: Location;
  battery: number;
  altitude: number;
}

interface Mission {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "Active" | "Pending" | "Completed" | "Aborted";
  assignedTeam?: string[];
  area: string;
  progress: number;
  logs: string[];
}

interface MissionStore {
  teams: TeamMember[];
  drones: Drone[];
  missions: Mission[];
  kpis: {
    activeMissions: number;
    officersDeployed: number;
    dronesAirborne: number;
    searchRadiusKm: number;
  };
  emergencyMode: boolean;
  emergencyAlerts: string[];
  socket: Socket | null;
  activeSector: string;

  init: () => Promise<void>;
  activateEmergency: () => Promise<void>;
  deactivateEmergency: () => void;
  broadcastEmergency: (message: string) => Promise<void>;
  assignTeam: (missionId: string, memberId: string) => void;
  updateMissionProgress: (missionId: string, progress: number) => void;
  addMissionLog: (missionId: string, log: string) => void;
  simulateRealtime: () => void;
  setActiveSector: (sector: string) => void;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  teams: [],
  drones: [],
  missions: [],
  kpis: {
    activeMissions: 0,
    officersDeployed: 0,
    dronesAirborne: 0,
    searchRadiusKm: 0,
  },
  emergencyMode: false,
  emergencyAlerts: [],
  socket: null,
  activeSector: "Sector D",

  init: async () => {
    if (get().socket) return; // already initialized

    try {
      const [teamsData, dronesData, missionsData, statsData] = await Promise.all([
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/drones').then(r => r.json()),
        fetch('/api/missions').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ]);

      set({
        teams: teamsData,
        drones: dronesData,
        missions: missionsData,
        kpis: {
          activeMissions: statsData.activeMissions || 0,
          officersDeployed: statsData.officersDeployed || 0,
          dronesAirborne: statsData.activeDrones || 0,
          searchRadiusKm: statsData.searchRadiusKm || 0,
        }
      });

      const socket = io();
      
      socket.on('update', async ({ type, data }) => {
        if (type === 'teams') set({ teams: data });
        if (type === 'drones') set({ drones: data });
        if (type === 'missions') set({ missions: data });
        if (type === 'emergency') {
          set({ emergencyMode: data.active, emergencyAlerts: data.alerts });
        }
        
        // Refresh stats
        try {
          const stats = await fetch('/api/stats').then(r => r.json());
          set({
            kpis: {
              activeMissions: stats.activeMissions || 0,
              officersDeployed: stats.officersDeployed || 0,
              dronesAirborne: stats.activeDrones || 0,
              searchRadiusKm: stats.searchRadiusKm || 0,
            }
          });
        } catch(e) {}
      });

      set({ socket });

    } catch (e) {
      console.error("Error initializing Mission store:", e);
    }
  },

  setActiveSector: (sector) => set({ activeSector: sector }),

  activateEmergency: async () => {
    try {
      await fetch('/api/emergency', {
        method: 'POST',
      });
    } catch(e) {
      console.error("Failed to activate emergency", e);
    }
  },

  deactivateEmergency: () => set({ emergencyMode: false, emergencyAlerts: [] }),
  
  broadcastEmergency: async (message: string) => {
    try {
      await fetch('/api/emergency/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
    } catch(e) {
      console.error("Failed to broadcast emergency", e);
    }
  },

  assignTeam: (missionId: string, memberId: string) => set((state) => ({
    missions: state.missions.map(m => m.id === missionId ? { ...m, assignedTeam: [...new Set([...(m.assignedTeam||[]), memberId])] } : m)
  })),

  updateMissionProgress: (missionId: string, progress: number) => set((state) => ({
    missions: state.missions.map(m => m.id === missionId ? { ...m, progress } : m)
  })),

  addMissionLog: (missionId: string, log: string) => set((state) => ({
    missions: state.missions.map(m => m.id === missionId ? { ...m, logs: [log, ...m.logs] } : m)
  })),

  simulateRealtime: () => {} // we use websocket instead
}));
