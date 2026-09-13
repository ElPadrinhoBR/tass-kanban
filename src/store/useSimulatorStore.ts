import { create } from 'zustand';

interface SimState {
  isActive: boolean;
  tutorialStep: number;
  setTutorialStep: (step: number) => void;
  startSimulation: () => void;
}

export const useSimulatorStore = create<SimState>((set) => ({
  isActive: false,
  tutorialStep: 0,
  setTutorialStep: (step) => set({ tutorialStep: step }),
  startSimulation: () => set({ isActive: true })
}));