import type { Business } from "@/entities/business";
import { create } from "zustand";

export interface IUser {
  id: number;
  email: string;
  phone: string;
  businesses: Business[];
}

interface ISessionStore {
  user: IUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: IUser) => void;
  setInitializing: (isInitializing: boolean) => void;
  clearSession: () => void;
}

export const useSessionStore = create<ISessionStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) =>
    set({ user, isAuthenticated: true, isInitializing: false }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}));
