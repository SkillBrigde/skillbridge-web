"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { DisputeReason, DisputeRuling, MentorServiceTier } from "@/types";
import {
  ACCEPT_WINDOW_MS,
  DISPUTE_MENTOR_MS,
  DISPUTE_SLA_MS,
  MIN_PAYOUT_VND,
  SLOT_LOCK_SECONDS,
  type AppState,
  type AvailabilityRules,
  type BookingRec,
  type DisputeRec,
  type GatewayKind,
  type KycApp,
  type LedgerEntry,
  type MentorRec,
  type Result,
  type ReviewRec,
  type Role,
  type Slot,
  type User,
  cancelQuote,
  emptyRules,
  fakeHash,
  fmtDuration,
  generateSlots,
  isValidWindow,
  looksLikeContactLeak,
  normalizeName,
  platformFeePercent,
} from "./domain";
import { STATE_VERSION, buildSeed } from "./seed";

/* ------------------------------------------------------------------ */
/*  External store (localStorage-backed, SSR-safe)                    */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "skillbridge.state.v1";

const EMPTY_STATE: AppState = {
  v: 1,
  seq: 0,
  users: [],
  session: null,
  mentors: [],
  slots: [],
  bookings: [],
  ledger: [],
  wallets: {},
  disputes: [],
  reviews: [],
  kyc: [],
  messages: [],
  payouts: [],
  payments: [],
  otp: null,
};
let current = EMPTY_STATE;
let sessionRequest: Promise<void> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function commit(next: AppState) {
  current = next;
  listeners.forEach((listener) => listener());
}
export function clearAuthSession() {
  commit(EMPTY_STATE);
}

function applyUser(user: SessionUser | null) {
  if (!user) {
    clearAuthSession();
    return;
  }
  const account: User = {
    id: user.id,
    name: user.fullName,
    email: user.email,
    roles: [user.role],
    createdAt: user.createdAt ? Date.parse(user.createdAt) : 0,
  };
  commit({
    ...EMPTY_STATE,
    users: [account],
    session: { userId: user.id, role: user.role },
  });
}

export async function bootstrapSession() {
  if (sessionRequest) return sessionRequest;
  sessionRequest = (async () => {
    // Discard credentials and records written by previous prototype versions.
    for (const key of ["skillbridge.state.v1", "accessToken", "user"]) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* Storage may be blocked. */
      }
    }
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (response.ok) applyUser((await response.json()).user);
    } catch {
      /* Public pages remain available when the account service is offline. */
    }
  })().finally(() => {
    sessionRequest = null;
  });
  return sessionRequest;
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => EMPTY_STATE,
  );
}
const subscribeHydration = () => () => {};
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
}

/* ---- Clocks ---- */

function makeClock(intervalMs: number) {
  let value = 0;
  const subs = new Set<() => void>();
  let timer: ReturnType<typeof setInterval> | null = null;
  return {
    subscribe(cb: () => void) {
      subs.add(cb);
      if (!timer) {
        value = Date.now();
        timer = setInterval(() => {
          value = Date.now();
          subs.forEach((s) => s());
        }, intervalMs);
      }
      return () => {
        subs.delete(cb);
        if (subs.size === 0 && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
    },
    get() {
      if (!timer) value = Date.now();
      return value;
    },
  };
}

const clockSecond = makeClock(1000);
const clockMinute = makeClock(30_000);

/** Current epoch ms, ticking every second or every 30s. Returns 0 on the server. */
export function useNow(precision: "second" | "minute" = "minute"): number {
  const clock = precision === "second" ? clockSecond : clockMinute;
  return useSyncExternalStore(clock.subscribe, clock.get, () => 0);
}

/* ---- Session helpers ---- */

export interface SessionInfo {
  user: User | null;
  role: Role | null;
  mentor: MentorRec | null;
  wallet: number;
}

export function useSession(): SessionInfo {
  const state = useAppState();
  return useMemo(() => sessionInfo(state), [state]);
}

export function sessionInfo(state: AppState): SessionInfo {
  const s = state.session;
  const user = s ? (state.users.find((u) => u.id === s.userId) ?? null) : null;
  const mentor = user
    ? (state.mentors.find((m) => m.userId === user.id) ?? null)
    : null;
  return {
    user,
    role: user && s ? s.role : null,
    mentor,
    wallet: user ? (state.wallets[user.id] ?? 0) : 0,
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "mentee" | "mentor";
}

async function authenticate(
  action: "login" | "register",
  input: { email: string; password: string; name?: string; role?: Role },
): Promise<Result<{ role: Role }>> {
  try {
    const response = await fetch("/api/auth/" + action, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!response.ok || !data.user)
      return {
        ok: false,
        error: data.error || "Không thể thực hiện yêu cầu. Vui lòng thử lại.",
      };
    applyUser(data.user);
    return { ok: true, role: data.user.role };
  } catch {
    return {
      ok: false,
      error: "Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.",
    };
  }
}

export const actions = {
  login: (email: string, password: string) =>
    authenticate("login", { email, password }),
  register: (input: RegisterInput) => authenticate("register", input),
  async logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      /* Clear the visible session even if the network is unavailable. */
    } finally {
      clearAuthSession();
    }
  },
  switchRole(role: Role) {
    const user = current.users.find(
      (item) => item.id === current.session?.userId,
    );
    if (!user?.roles.includes(role))
      return { ok: false, error: "Tài khoản không có quyền truy cập." };
    commit({ ...current, session: { userId: user.id, role } });
    return { ok: true };
  },
  // These interfaces remain available to existing views, but server-owned
  // operations cannot succeed until their API integrations are implemented.
  startBooking: unavailableAction,
  lockSlot: unavailableAction,
  expireBooking: unavailableAction,
  payBooking: unavailableAction,
  cancelBooking: unavailableAction,
  rescheduleBooking: unavailableAction,
  joinSession: unavailableAction,
  leaveSession: unavailableAction,
  submitProof: unavailableAction,
  acceptSession: unavailableAction,
  sendMessage: unavailableAction,
  setScratchpad: unavailableAction,
  openDispute: unavailableAction,
  respondDispute: unavailableAction,
  ruleDispute: unavailableAction,
  submitReview: unavailableAction,
  replyReview: unavailableAction,
  deposit: unavailableAction,
  issueOtp: unavailableAction,
  confirmPayout: unavailableAction,
  saveServices: unavailableAction,
  saveAvailability: unavailableAction,
  mentorCancel: unavailableAction,
  submitKyc: unavailableAction,
  reviewKyc: unavailableAction,
  reconcile: unavailableAction,
};

export function availableSlots(
  state: AppState,
  mentorId: string,
  now: number,
  limit = 12,
): Slot[] {
  return state.slots
    .filter((s) => {
      if (s.mentorId !== mentorId || s.startMs <= now) return false;
      if (s.status === "Available") return true;
      return s.status === "Held" && (s.heldUntil ?? 0) <= now;
    })
    .sort((a, b) => a.startMs - b.startMs)
    .slice(0, limit);
}

export function mentorSlotsForPicker(
  state: AppState,
  mentorId: string,
  bookingId: string,
  now: number,
  limit = 12,
) {
  return state.slots
    .filter((s) => s.mentorId === mentorId && s.startMs > now)
    .sort((a, b) => a.startMs - b.startMs)
    .map((s) => {
      const heldByMe = s.status === "Held" && s.bookingId === bookingId;
      const heldExpired = s.status === "Held" && (s.heldUntil ?? 0) <= now;
      const available = s.status === "Available" || heldByMe || heldExpired;
      return { slot: s, available };
    })
    .slice(0, limit);
}

export function menteeEscrowSummary(state: AppState, userId: string) {
  let holding = 0;
  let spent = 0;
  for (const b of state.bookings) {
    if (b.menteeId !== userId || !b.paidAt) continue;
    if (b.escrow.state === "Holding" || b.escrow.state === "Disputed")
      holding += b.escrow.heldVnd;
    spent += b.priceVnd - b.escrow.refundedVnd;
  }
  return { holding, spent };
}

export function mentorEscrowSummary(state: AppState, mentorId: string) {
  let holding = 0;
  let disputed = 0;
  let holdingCount = 0;
  let disputedCount = 0;
  for (const b of state.bookings) {
    if (b.mentorId !== mentorId || !b.paidAt) continue;
    if (b.escrow.state === "Holding" && b.escrow.heldVnd > 0) {
      holding += b.escrow.heldVnd;
      if (b.status === "AwaitingAcceptance") holdingCount += 1;
    }
    if (b.escrow.state === "Disputed") {
      disputed += b.escrow.heldVnd;
      disputedCount += 1;
    }
  }
  return { holding, disputed, holdingCount, disputedCount };
}

export function publishedMentors(state: AppState): MentorRec[] {
  return state.mentors.filter((m) => m.published && m.services.length > 0);
}
