import { create } from "zustand";

export type UserType = "TRAVELER" | "AIRLINE_USER" | "AIRLINE_STAFF";

export type UserRole = "TRAVELER" | "ADMIN" | "STAFF";

export interface AuthUser {
  id: string;
  userType: UserType;
  role: UserRole;
  email?: string;
  airlineId?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),
}));
