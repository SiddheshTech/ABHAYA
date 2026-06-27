import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
  badgeNumber?: string;
  rank?: string;
  organization?: string;
  department?: string;
  designation?: string;
  phone?: string;
  emergencyContact?: string;
  bio?: string;
  avatarSeed?: string;
  recoveryPrefs?: any;
  aiConfig?: any;
  privacyConfig?: any;
}

export interface SecurityLog {
  _id: string;
  event: string;
  ip: string;
  status: string;
  type: string;
  createdAt: string;
}

export interface Passkey {
  _id: string;
  name: string;
  added: string;
}

export interface SystemMetrics {
  ping: number;
  activeTransactions: number;
  wsPacketsSent: number;
  wsPacketsReceived: number;
  aiLoad: number;
  aiRequestCount: number;
  storageUsed: number;
  cacheUsed: number;
  networkSpeed: string;
  isOnline: boolean;
}

export interface Preferences {
  theme: string;
  language: string;
  timeZone: string;
  dateFormat: string;
  accessibility: boolean;
  alerts: {
    rescue: boolean;
    emergency: boolean;
    predictive: boolean;
    verification: boolean;
    medical: boolean;
    capacity: boolean;
    psychological: boolean;
  };
  routing: {
    browserPush: boolean;
    emailDigest: boolean;
    smsGateway: boolean;
    localSystem: boolean;
  };
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  isCurrent: boolean;
  createdAt: string;
}

interface SettingsState {
  profile: UserProfile | null;
  preferences: Preferences | null;
  sessions: Session[];
  securityLogs: SecurityLog[];
  passkeys: Passkey[];
  systemMetrics: SystemMetrics | null;
  isLoading: boolean;
  error: string | null;

  init: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (updates: Partial<Preferences>) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  profile: null,
  preferences: null,
  sessions: [],
  securityLogs: [],
  passkeys: [],
  systemMetrics: null,
  isLoading: true,
  error: null,

  init: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const [meRes, sessionsRes, logsRes, passkeysRes, metricsRes] = await Promise.all([
        fetch('/api/auth/me').then(r => r.json()),
        fetch('/api/auth/sessions').then(r => r.json()),
        fetch('/api/auth/security-logs').then(r => r.json()),
        fetch('/api/auth/passkeys').then(r => r.json()),
        fetch('/api/auth/system-metrics').then(r => r.json())
      ]);

      if (meRes.user) {
        const { preferences, ...profileObj } = meRes.user;
        set({
          profile: profileObj,
          preferences: preferences,
          sessions: sessionsRes.sessions || [],
          securityLogs: logsRes.securityLogs || [],
          passkeys: passkeysRes.passkeys || [],
          systemMetrics: metricsRes.systemMetrics || null
        });
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const current = get().profile;
      if (!current) return;
      
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.id, ...updates })
      }).then(r => r.json());
      
      if (res.user) {
        const { preferences, ...profileObj } = res.user;
        set({ profile: profileObj });
      }
    } catch (err: any) {
      console.error(err);
    }
  },

  updatePreferences: async (updates: Partial<Preferences>) => {
    try {
      const currentProfile = get().profile;
      const currentPrefs = get().preferences;
      if (!currentProfile || !currentPrefs) return;
      
      const newPrefs = { ...currentPrefs, ...updates };
      
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentProfile.id, preferences: newPrefs })
      }).then(r => r.json());
      
      if (res.user) {
        set({ preferences: res.user.preferences });
      }
    } catch (err: any) {
      console.error(err);
    }
  },

  revokeSession: async (sessionId: string) => {
    try {
      // Optimistic UI update
      set(state => ({
        sessions: state.sessions.filter(s => s.id !== sessionId)
      }));
      // We don't actually call the backend for demo since we're using mock sessions sometimes,
      // but in real world we'd do a DELETE to /api/auth/sessions/:sessionId
    } catch (err: any) {
      console.error(err);
    }
  }
}));
