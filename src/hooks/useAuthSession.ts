"use client";

import { useSession, useAppState, actions } from "@/lib/store";
import { getAccessToken } from "@/lib/api-client";
import { type Role } from "@/lib/domain";

/**
 * Custom hook to access authenticated session, role, JWT token,
 * and user state management actions.
 */
export function useAuthSession() {
  const session = useSession();
  const state = useAppState();

  const isAuthenticated = !!session.user;
  const token = typeof window !== "undefined" ? getAccessToken() : null;

  const loginAs = (userId: string) => actions.loginAs(userId);
  const logout = () => actions.logout();
  const switchRole = (role: Role) => actions.switchRole(role);
  const upgradeToMentor = () => actions.upgradeToMentor();

  return {
    user: session.user,
    role: session.role,
    mentor: session.mentor,
    wallet: session.wallet,
    token,
    isAuthenticated,
    users: state.users,
    loginAs,
    logout,
    switchRole,
    upgradeToMentor,
  };
}

export { useAuthSession as default };
