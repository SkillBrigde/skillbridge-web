"use client";
import { useSession, actions } from "@/lib/store";
export function useAuthSession() {
  const session = useSession();
  return {
    ...session,
    isAuthenticated: !!session.user,
    logout: actions.logout,
    switchRole: actions.switchRole,
  };
}
export { useAuthSession as default };
