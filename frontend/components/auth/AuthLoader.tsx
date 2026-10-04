"use client";

import { ReactNode, useEffect } from "react";

import { useCurrentUser } from "@/queries/auth/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";

interface AuthLoaderProps {
  children: ReactNode;
}

export default function AuthLoader({ children }: AuthLoaderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  const { data: user, isLoading, isError, isSuccess } = useCurrentUser();

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (isSuccess && user) {
      setUser(user);
      return;
    }

    if (isError) {
      clearAuth();
    }
  }, [isLoading, isSuccess, isError, user, setUser, clearAuth, setLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
