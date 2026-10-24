"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import useAuth from "@/lib/hooks/useAuth";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  return children;
}
