import { create } from 'zustand';

export interface Broadcast {
    _id: string;
    sender: string;
    msg: string;
    time: string;
    level: string;
}

export interface Patrol {
    _id: string;
    patrolId: string;
    area: string;
    volunteers: number;
    status: string;
    lastPing: string;
}

export interface Incident {
    _id: string;
    incidentId: string;
    title: string;
    loc: string;
    status: string;
    time: string;
}

export interface Alert {
    _id: string;
    photoUrl: string;
    name: string;
    age: number;
    gender: string;
    location: string;
    coordinates: { lat: number; lng: number };
    lastSeenDate: string;
    riskLevel: string;
    status: string;
    shares: number;
}

interface CWStore {
    broadcasts: Broadcast[];
    patrols: Patrol[];
    incidents: Incident[];
    alerts: Alert[];
    isLoading: boolean;
    error: string | null;

    fetchCWData: () => Promise<void>;
    addBroadcast: (broadcast: Omit<Broadcast, '_id' | 'time'>) => Promise<void>;
}

export const useCWStore = create<CWStore>((set, get) => ({
    broadcasts: [],
    patrols: [],
    incidents: [],
    alerts: [],
    isLoading: false,
    error: null,

    fetchCWData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [broadcastsRes, patrolsRes, incidentsRes, alertsRes] = await Promise.all([
                fetch('http://localhost:5006/api/cw/broadcasts').then(r => r.json()),
                fetch('http://localhost:5006/api/cw/patrols').then(r => r.json()),
                fetch('http://localhost:5006/api/cw/incidents').then(r => r.json()),
                fetch('http://localhost:5006/api/alerts').then(r => r.json()),
            ]);

            set({
                broadcasts: broadcastsRes || [],
                patrols: patrolsRes || [],
                incidents: incidentsRes || [],
                alerts: alertsRes || [],
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addBroadcast: async (broadcast) => {
        try {
            const res = await fetch('/api/cw/broadcasts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(broadcast)
            });
            const newBroadcast = await res.json();
            set(state => ({ broadcasts: [newBroadcast, ...state.broadcasts] }));
        } catch (error: any) {
            console.error("Failed to add broadcast", error);
        }
    },

    init: async () => {
        get().fetchCWData();

        // Connect websocket
        if (!get().socket) {
            const socket = io('http://localhost:5006');
            socket.on('connect', () => console.log('Connected to CW socket'));
      
            socket.on('update', (message) => {
                console.log('CW real-time update:', message);
                get().fetchCWData();
            });

            set({ socket });
        }
    }
}));
