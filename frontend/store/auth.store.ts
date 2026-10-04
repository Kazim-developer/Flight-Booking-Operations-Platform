import { create } from "zustand";

export type UserType = "TRAVELER" | "AIRLINE" | "AIRLINE_STAFF";

export type UserRole = "TRAVELER" | "AIRLINE_ADMIN" | "AIRLINE_STAFF";

export interface AuthUser {
  id: string;
  role: UserRole;
  userType: UserType;
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
