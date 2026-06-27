import { create } from 'zustand';

export interface Recovery {
    _id: string;
    child: string;
    sector: string;
    status: string;
    time: string;
}

export interface MajorCase {
    _id: string;
    name: string;
    priority: string;
    status: string;
}

export interface StateData {
    _id: string;
    name: string;
    missingCases: number;
    recoveredCases: number;
    networksDetected: number;
    riskIndex: string;
    activeOperations: number;
    coordinates: { lat: number; lng: number };
}

export interface Network {
    _id: string;
    clusterId: string;
    growthStatus: string;
    threatLevel: string;
}

export interface Prediction {
    _id: string;
    targetState: string;
    expectedSpike: string;
    confidenceScore: number;
    forecastPeriod: string;
}

export interface Organization {
    _id: string;
    type: string;
    name: string;
    casesHandled: number;
}

interface DashboardTopBar {
    missingChildren: number;
    recoveredChildren: number;
    networksDetected: number;
    riskDistricts: number;
    activeSearches: number;
    rescueSuccessRate: string;
    threatIndex: string;
}

interface RosStore {
    recoveries: Recovery[];
    majorCases: MajorCase[];
    states: StateData[];
    networks: Network[];
    predictions: Prediction[];
    organizations: Organization[];
    dashboard: DashboardTopBar | null;
    isLoading: boolean;
    error: string | null;

    fetchRosData: () => Promise<void>;
}

export const useRosStore = create<RosStore>((set, get) => ({
    recoveries: [],
    majorCases: [],
    states: [],
    networks: [],
    predictions: [],
    organizations: [],
    dashboard: null,
    isLoading: false,
    error: null,

    fetchRosData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [
                recoveriesRes,
                casesRes,
                statesRes,
                networksRes,
                predictionsRes,
                orgsRes,
                dashboardRes
            ] = await Promise.all([
                fetch('/api/command/recoveries').then(r => r.json()),
                fetch('/api/command/majorCases').then(r => r.json()),
                fetch('/api/nation/states').then(r => r.json()),
                fetch('/api/genome/networks').then(r => r.json()),
                fetch('/api/forecasts/predictions').then(r => r.json()),
                fetch('/api/organizations').then(r => r.json()),
                fetch('/api/command/dashboard').then(r => r.json())
            ]);

            set({
                recoveries: recoveriesRes || [],
                majorCases: casesRes || [],
                states: statesRes || [],
                networks: networksRes || [],
                predictions: predictionsRes || [],
                organizations: orgsRes || [],
                dashboard: dashboardRes?.topBar || null,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    }
}));
