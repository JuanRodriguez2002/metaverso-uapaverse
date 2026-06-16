'use client';

import { create } from 'zustand';

import { defaultStands } from '../services/metaversoData';
import type { StandData } from '../types';

interface MetaversoState {
  stands: StandData[];
  activeStand: StandData | null;
  isModalOpen: boolean;
  setStands: (stands: StandData[]) => void;
  setActiveStand: (stand: StandData | null) => void;
  setIsModalOpen: (open: boolean) => void;
}

export const useMetaversoStore = create<MetaversoState>((set) => ({
  stands: defaultStands,
  activeStand: null,
  isModalOpen: false,
  setStands: (stands) => set({ stands }),
  setActiveStand: (activeStand) => set({ activeStand }),
  setIsModalOpen: (isModalOpen) => set({ isModalOpen })
}));

export type { StandData };
