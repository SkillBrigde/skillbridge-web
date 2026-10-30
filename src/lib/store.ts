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
let current: AppState = typeof window !== "undefined" ? buildSeed(Date.now()) : EMPTY_STATE;
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
  const defaultUser = state.users.find((u) => u.id === "u-linh") ?? state.users[0] ?? null;
  const user = s ? (state.users.find((u) => u.id === s.userId) ?? defaultUser) : defaultUser;
  const mentor = user
    ? (state.mentors.find((m) => m.userId === user.id) ?? (state.mentors.find((m) => m.id === "mentor-an-nguyen") ?? null))
    : null;
  return {
    user,
    role: s?.role ?? (user?.roles[0] ?? "mentee"),
    mentor,
    wallet: user ? (state.wallets[user.id] ?? 2_500_000) : 2_500_000,
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

  startBooking(mentorId: string, serviceId: string): Result<{ bookingId: string }> {
    const mentor = current.mentors.find((m) => m.id === mentorId);
    const service = mentor?.services.find((s) => s.id === serviceId) || mentor?.services[0];
    const user = current.session ? current.users.find((u) => u.id === current.session?.userId) : current.users[0];
    const id = "bk-" + Date.now().toString(36);
    const code = "SB" + Math.floor(10000 + Math.random() * 90000);
    const priceVnd = service?.priceVnd || 1_500_000;
    const newBooking: BookingRec = {
      id,
      code,
      menteeId: user?.id || "u-linh",
      menteeName: user?.name || "Linh Nguyễn",
      mentorId,
      mentorName: mentor?.fullName || "Chuyên gia SkillBridge",
      serviceId,
      serviceName: service?.name || "Gói Tư Vấn Kỹ Thuật",
      durationLabel: service?.durationLabel || "60 phút",
      priceVnd,
      totalSessions: 1,
      completedSessions: 0,
      status: "Draft",
      createdAt: Date.now(),
      paidAt: undefined,
      escrow: {
        state: "Holding",
        heldVnd: priceVnd,
        mentorPaidVnd: 0,
        feeVnd: 0,
        refundedVnd: 0,
      },
      intake: undefined,
      slotId: undefined,
      startMs: undefined,
      endMs: undefined,
      lockExpiresAt: Date.now() + 10 * 60 * 1000,
      scratchpad: "",
      attendance: {},
    };
    commit({ ...current, bookings: [newBooking, ...current.bookings] });
    return { ok: true, bookingId: id };
  },

  lockSlot(bookingId: string, slotId: string, intake: { coreIssue: string; link: string; expectation: string }): Result {
    const slot = current.slots.find((s) => s.id === slotId);
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        slotId,
        startMs: slot ? slot.startMs : Date.now() + 86400000,
        endMs: slot ? slot.endMs : Date.now() + 86400000 + 3600000,
        intake: {
          coreIssue: intake.coreIssue,
          link: intake.link,
          expectation: intake.expectation,
        },
        lockExpiresAt: Date.now() + 10 * 60 * 1000,
      };
    });
    const updatedSlots = current.slots.map((s) => {
      if (s.id !== slotId) return s;
      return { ...s, status: "Held" as const, bookingId, heldUntil: Date.now() + 10 * 60 * 1000 };
    });
    commit({ ...current, bookings: updatedBookings, slots: updatedSlots });
    return { ok: true };
  },

  expireBooking(bookingId: string): Result {
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return { ...b, status: "Cancelled" as const };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  payBooking(bookingId: string, method: "PayOS" | "VNPAY" | "Wallet"): Result {
    const b = current.bookings.find((item) => item.id === bookingId);
    if (!b) return { ok: false, error: "Không tìm thấy đơn đặt lịch." };
    const menteeWallet = current.wallets[b.menteeId] ?? 2_500_000;
    if (method === "Wallet" && menteeWallet < b.priceVnd) {
      return { ok: false, error: "Số dư ví không đủ để thanh toán đơn này." };
    }
    const updatedWallets = {
      ...current.wallets,
      [b.menteeId]: method === "Wallet" ? menteeWallet - b.priceVnd : menteeWallet,
    };
    const updatedBookings = current.bookings.map((item) => {
      if (item.id !== bookingId) return item;
      return {
        ...item,
        status: "Confirmed" as const,
        paidAt: Date.now(),
        startedAt: Date.now(),
        paymentMethod: method,
        escrow: { ...item.escrow, state: "Holding" as const },
      };
    });
    commit({ ...current, wallets: updatedWallets, bookings: updatedBookings });
    return { ok: true };
  },

  cancelBooking(bookingId: string): Result {
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return { ...b, status: "Cancelled" as const };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  rescheduleBooking(bookingId: string, newSlotId: string): Result {
    const slot = current.slots.find((s) => s.id === newSlotId);
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        slotId: newSlotId,
        startMs: slot ? slot.startMs : b.startMs,
        endMs: slot ? slot.endMs : b.endMs,
      };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  joinSession(bookingId: string, _role: string): Result {
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return { ...b, status: "InProgress" as const, startedAt: b.startedAt || Date.now() };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  leaveSession(_bookingId: string, _role: string): Result {
    return { ok: true };
  },

  submitProof(bookingId: string, _proof: { files: string[]; note: string }): Result {
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return { ...b, status: "AwaitingAcceptance" as const };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  acceptSession(bookingId: string): Result {
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: "Completed" as const,
        escrow: { ...b.escrow, state: "Released" as const, mentorPaidVnd: b.priceVnd },
      };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  sendMessage(bookingId: string, text: string): Result {
    const user = current.session ? current.users.find((u) => u.id === current.session?.userId) : current.users[0];
    const newMsg: MessageRec = {
      id: "msg-" + Date.now().toString(36),
      bookingId,
      senderId: user?.id || "u-linh",
      senderName: user?.name || "Linh Nguyễn",
      role: current.session?.role || "mentee",
      text,
      ts: Date.now(),
      flagged: false,
    };
    commit({ ...current, messages: [...current.messages, newMsg] });
    return { ok: true };
  },

  setScratchpad(bookingId: string, content: string): Result {
    const updatedBookings = current.bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return { ...b, scratchpad: content };
    });
    commit({ ...current, bookings: updatedBookings });
    return { ok: true };
  },

  openDispute(data: { bookingId: string; reasonKey: string; statement: string; wish: string; files: string[] }): Result<{ disputeId: string }> {
    const id = "disp-" + Date.now().toString(36);
    const b = current.bookings.find((item) => item.id === data.bookingId);
    const newDispute: DisputeRec = {
      id,
      bookingId: data.bookingId,
      bookingCode: b?.code || "SB9999",
      menteeId: b?.menteeId || "u-linh",
      menteeName: b?.menteeName || "Linh Nguyễn",
      mentorId: b?.mentorId || "mentor-an-nguyen",
      mentorName: b?.mentorName || "An Nguyễn",
      reason: (data.reasonKey as DisputeReason) || "other",
      reasonLabel: data.reasonKey,
      menteeStatement: data.statement,
      menteeWish: (data.wish === "reschedule" ? "reschedule" : "full_refund") as "full_refund" | "reschedule",
      menteeEvidence: data.files,
      amountVnd: b?.priceVnd || 1_500_000,
      mentorStatement: undefined,
      mentorEvidence: [],
      status: "PendingReview",
      createdAt: Date.now(),
      mentorDueAt: Date.now() + 24 * 3600 * 1000,
      slaExpiresAt: Date.now() + 48 * 3600 * 1000,
      events: [],
      resolvedAt: undefined,
    };
    const updatedBookings = current.bookings.map((item) => {
      if (item.id !== data.bookingId) return item;
      return { ...item, status: "Disputed" as const, disputeId: id };
    });
    commit({ ...current, disputes: [newDispute, ...current.disputes], bookings: updatedBookings });
    return { ok: true, disputeId: id };
  },

  respondDispute(disputeId: string, data: { statement?: string; files?: string[]; proposal?: string } | string): Result {
    const statement = typeof data === "string" ? data : data?.statement || "";
    const files = typeof data === "object" && Array.isArray(data?.files) ? data.files : [];
    const updatedDisputes = current.disputes.map((d) => {
      if (d.id !== disputeId) return d;
      return { ...d, mentorStatement: statement, mentorEvidence: files };
    });
    commit({ ...current, disputes: updatedDisputes });
    return { ok: true };
  },

  ruleDispute(disputeId: string, resolution: DisputeRuling, note?: string): Result {
    const updatedDisputes = current.disputes.map((d) => {
      if (d.id !== disputeId) return d;
      return {
        ...d,
        status: "Resolved" as const,
        ruling: resolution,
        rulingNote: note,
        resolvedAt: Date.now(),
      };
    });
    commit({ ...current, disputes: updatedDisputes });
    return { ok: true };
  },

  submitReview(bookingId: string, review: { ratings: { technicalDepth: number; communication: number; valueDelivered: number; overallSatisfaction: number }; comment: string; isPublic: boolean }): Result {
    const b = current.bookings.find((item) => item.id === bookingId);
    const newRev: ReviewRec = {
      id: "rev-" + Date.now().toString(36),
      bookingId,
      menteeId: b?.menteeId || "u-linh",
      menteeName: b?.menteeName || "Linh Nguyễn",
      mentorId: b?.mentorId || "mentor-an-nguyen",
      serviceName: b?.serviceName || "Gói Tư Vấn",
      ratings: review.ratings,
      averageRating: (review.ratings.technicalDepth + review.ratings.communication + review.ratings.valueDelivered + review.ratings.overallSatisfaction) / 4,
      comment: review.comment,
      isPublic: review.isPublic,
      mentorReply: undefined,
      createdAt: new Date().toISOString(),
      isEscrowVerified: true,
      isAnonymous: false,
    };
    commit({ ...current, reviews: [newRev, ...current.reviews] });
    return { ok: true };
  },

  replyReview(reviewId: string, reply: string): Result {
    const updatedReviews = current.reviews.map((r) => {
      if (r.id !== reviewId) return r;
      return { ...r, mentorReply: reply, mentorReplyAt: new Date().toISOString() };
    });
    commit({ ...current, reviews: updatedReviews });
    return { ok: true };
  },

  deposit(amount: number, _gateway: "PayOS" | "VNPAY"): Result {
    const userId = current.session?.userId || current.users[0]?.id || "u-linh";
    const currentBalance = current.wallets[userId] ?? 2_500_000;
    const updatedWallets = { ...current.wallets, [userId]: currentBalance + amount };
    commit({ ...current, wallets: updatedWallets });
    return { ok: true };
  },

  issueOtp(): Result<{ code: string }> {
    return { ok: true, code: "123456" };
  },

  confirmPayout(_amount: number, _otp: string): Result {
    return { ok: true };
  },

  saveServices(services: MentorProfile["services"], _published?: boolean): Result {
    const mentor = current.mentors[0];
    if (mentor) {
      const updatedMentors = current.mentors.map((m, idx) => {
        if (idx !== 0) return m;
        return { ...m, services };
      });
      commit({ ...current, mentors: updatedMentors });
    }
    return { ok: true };
  },

  saveAvailability(rules: MentorRec["rules"], defaults: Partial<MentorRec["defaults"]>): Result {
    const mentor = current.mentors[0];
    if (mentor) {
      const updatedMentors = current.mentors.map((m, idx) => {
        if (idx !== 0) return m;
        return { ...m, rules, defaults: { ...m.defaults, ...defaults } };
      });
      commit({ ...current, mentors: updatedMentors });
    }
    return { ok: true };
  },

  mentorCancel(bookingId: string): Result {
    return actions.cancelBooking(bookingId);
  },

  submitKyc(_data: unknown): Result {
    return { ok: true };
  },

  reviewKyc(kycId: string, status: "approve" | "need_more" | "reject", _note?: string): Result {
    const updatedKyc = current.kyc.map((k) => {
      if (k.id !== kycId) return k;
      return { ...k, status: status === "approve" ? "Approved" as const : "Rejected" as const };
    });
    commit({ ...current, kyc: updatedKyc });
    return { ok: true };
  },

  reconcile(): Result {
    return { ok: true };
  },
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
