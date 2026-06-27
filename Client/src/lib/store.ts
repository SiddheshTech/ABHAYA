import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  sessions: any[];
  login: () => void;
  logout: () => void;
  fetchSessions: () => Promise<void>;
  updatePreferences: (prefs: any) => Promise<void>;
  revokeSession: (id: string) => Promise<void>;
}

// Temporary demo credentials until full login flow is implemented
const defaultUser = {
  id: "temp-id",
  name: "Commander",
  email: "commander@ops.gov",
  role: "admin",
  phone: "+1 (555) 019-2834",
  assignedUnits: { primary: 'Tactical Operations Div.', secondary: 'Emergency Response Team' },
  preferences: {
    theme: 'System Default',
    language: 'English (US)',
    timeZone: 'UTC (Coordinated Universal Time)',
    dateFormat: 'YYYY-MM-DD (24hr)',
    accessibility: true
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: true, 
  user: defaultUser,
  sessions: [
    { _id: "s1", device: "MacBook Pro 16\"", os: "macOS", browser: "Safari", ipAddress: "192.168.1.1", location: "San Francisco, CA", isCurrent: true },
    { _id: "s2", device: "iPhone 14 Pro", os: "iOS", browser: "App", ipAddress: "10.0.0.45", location: "San Francisco, CA", isCurrent: false }
  ],
  login: () => set({ isAuthenticated: true, user: defaultUser }),
  logout: () => set({ isAuthenticated: false, user: null }),
  
  // Note: These methods use the local state for demonstration if the API is unreachable, 
  // but they are wired to hit the real endpoints if the token was real.
  fetchSessions: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        set({ sessions: data.sessions });
      }
    } catch (e) {
      console.error(e);
    }
  },
  
  updatePreferences: async (prefs: any) => {
    const { user } = get();
    if (!user) return;
    
    // Optimistic UI update
    set({ user: { ...user, preferences: { ...user.preferences, ...prefs } } });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(prefs)
      });
    } catch (e) {
      console.error(e);
    }
  },
  
  revokeSession: async (id: string) => {
    // Optimistic UI update
    set({ sessions: get().sessions.filter(s => s._id !== id) });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`/api/auth/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
  }
}));

interface SystemState {
  status: any;
  fetchStatus: () => Promise<void>;
}

export const useSystemStore = create<SystemState>((set) => ({
  status: null,
  fetchStatus: async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        set({ status: data });
      }
    } catch (e) {
      console.error(e);
    }
  }
}));

export { useMissionStore } from './missionStore';
