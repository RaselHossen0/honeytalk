import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setAuth: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setAuth: (token, refreshToken) => set({ token, refreshToken }),
      clearAuth: () => set({ token: null, refreshToken: null }),
    }),
    { name: 'agency-auth' }
  )
);
