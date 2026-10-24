"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  checkSession,
  getMe,
  logout as logoutRequest,
} from "@/lib/api/clientApi";
import useAuthStore from "@/lib/store/authStore";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const session = await checkSession();

      if (!session.success) {
        clearIsAuthenticated();
        return false;
      }

      const currentUser = await getMe();
      setUser(currentUser);

      return true;
    } catch {
      clearIsAuthenticated();
      return false;
    }
  }, [clearIsAuthenticated, setUser]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearIsAuthenticated();
      router.replace("/sign-in");
      router.refresh();
    }
  }, [clearIsAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    checkAuth,
    logout,
    setUser,
    clearIsAuthenticated,
  };
}
