import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface IWRMetrics {
  activeCases: number;
  escalatedCases: number;
  childrenRescuedToday: number;
  openOperations: number;
}

export interface IWRState {
  metrics: IWRMetrics;
  priorityQueues: any[];
  liveFeeds: any[];
  categories: any[];
  cases: any[];
  emergingNetworks: any[];
  highActivityNetworks: any[];
  suspects: any[];
  leads: any[];
  socket: Socket | null;
  
  init: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchCases: () => Promise<void>;
  fetchGenome: () => Promise<void>;
  fetchLeads: () => Promise<void>;
}

export const useIWRStore = create<IWRState>((set, get) => ({
  metrics: {
    activeCases: 0,
    escalatedCases: 0,
    childrenRescuedToday: 0,
    openOperations: 0
  },
  priorityQueues: [],
  liveFeeds: [],
  categories: [],
  cases: [],
  emergingNetworks: [],
  highActivityNetworks: [],
  suspects: [],
  leads: [],
  socket: null,

  init: async () => {
    // Initial fetches
    await Promise.all([
      get().fetchSummary(),
      get().fetchCases(),
      get().fetchGenome(),
      get().fetchLeads()
    ]);

    // Setup Socket.io connection to Port 5003
    if (!get().socket) {
      const socket = io('http://localhost:5003');
      socket.on('connect', () => console.log('Connected to IWR socket'));
      
      socket.on('update', (message) => {
        if (message.type === 'cases') get().fetchCases();
        if (message.type === 'summary') get().fetchSummary();
        if (message.type === 'leads') get().fetchLeads();
      });

      set({ socket });
    }
  },

  fetchSummary: async () => {
    try {
      const res = await fetch('http://localhost:5003/api/v1/dashboard/summary');
      if (res.ok) {
        const data = await res.json();
        set({
          metrics: data.metrics,
          priorityQueues: data.priorityQueues,
          liveFeeds: data.liveFeeds
        });
      }
    } catch (e) {
      console.error('Failed to fetch IWR summary', e);
    }
  },

  fetchCases: async () => {
    try {
      const res = await fetch('http://localhost:5003/api/v1/dashboard/cases');
      if (res.ok) {
        const data = await res.json();
        set({
          categories: data.categories,
          cases: data.cases
        });
      }
    } catch (e) {
      console.error('Failed to fetch IWR cases', e);
    }
  },

  fetchGenome: async () => {
    try {
      const res = await fetch('http://localhost:5003/api/v1/dashboard/genome');
      if (res.ok) {
        const data = await res.json();
        set({
          emergingNetworks: data.emergingNetworks,
          highActivityNetworks: data.highActivityNetworks,
          suspects: data.suspects
        });
      }
    } catch (e) {
      console.error('Failed to fetch IWR genome data', e);
    }
  },

  fetchLeads: async () => {
    try {
      const res = await fetch('http://localhost:5003/api/v1/dashboard/leads');
      if (res.ok) {
        const data = await res.json();
        set({
          leads: data.leads
        });
      }
    } catch (e) {
      console.error('Failed to fetch IWR leads', e);
    }
  }
}));
