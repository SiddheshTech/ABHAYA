import { create } from 'zustand';

export interface AIReconstruction {
    _id: string;
    caseId: string;
    photoUrl?: string;
    voiceSampleUrl?: string;
    predictedOrigin?: {
        state: string;
        district: string;
        confidence: number;
    };
    villageCluster?: string[];
    potentialFamilies: number;
    reasoning?: string[];
}

export interface Genome {
    _id: string;
    networkId: string;
    mutationProbability: number;
    expectedShift: string;
    predictedExpansion: string;
    kingpinDetected: boolean;
    networkStrength: number;
    collapsePoint: string;
    nodes: string[];
}

export interface Prediction {
    _id: string;
    id: string;
    timeframe: string;
    timestamp: string;
    migrationRisk?: any;
    floodRisk?: any;
    economicDistress?: any;
    socialUnrest?: any;
    predictedCases?: any;
    expectedLocations?: any[];
    threatProbability?: any;
    confidenceScore?: any;
    aiExplanation?: string;
}

export interface CriminalProfile {
    _id: string;
    id: string;
    name?: string;
    alias?: string;
    [key: string]: any;
}

interface ForensicStore {
    reconstructions: AIReconstruction[];
    genomes: Genome[];
    predictionsHistory: Prediction[];
    criminalProfiles: CriminalProfile[];
    dashboardStats: any;
    isLoading: boolean;
    error: string | null;
    
    fetchForensicData: () => Promise<void>;
}

export const useForensicStore = create<ForensicStore>((set) => ({
    reconstructions: [],
    genomes: [],
    predictionsHistory: [],
    criminalProfiles: [],
    dashboardStats: null,
    isLoading: false,
    error: null,

    fetchForensicData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [
                reconstructionsRes,
                genomesRes,
                predictionsRes,
                profilesRes,
                statsRes
            ] = await Promise.all([
                fetch('http://localhost:5004/api/reconstructions').then(r => r.json()),
                fetch('http://localhost:5004/api/network-genomes').then(r => r.json()),
                fetch('http://localhost:5004/api/predictions/history').then(r => r.json()),
                fetch('http://localhost:5004/api/criminal/search').then(r => r.json()),
                fetch('http://localhost:5004/api/dashboard/stats').then(r => r.json())
            ]);

            set({
                reconstructions: reconstructionsRes || [],
                genomes: genomesRes || [],
                predictionsHistory: predictionsRes || [],
                criminalProfiles: profilesRes || [],
                dashboardStats: statsRes || null,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    }
}));
