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
  isValidHttpUrl,
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
  v: 0,
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

let current: AppState | null = null;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined" || !current) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* storage full / blocked: keep in-memory state */
  }
}

function readStorage(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    return parsed?.v === STATE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function ensureLoaded(): AppState {
  if (current) return current;
  if (typeof window === "undefined") return EMPTY_STATE;
  const stored = readStorage();
  current = stored ?? buildSeed(Date.now());
  if (!stored) persist();

  // Initialize auth state from localStorage so the user stays logged in after page refresh (F5)
  try {
    const storedUserJson = window.localStorage.getItem("user");
    const storedToken = window.localStorage.getItem("accessToken");
    if (storedUserJson && storedToken) {
      const storedAuthUser = JSON.parse(storedUserJson) as AuthUser;
      const matchedUser = current.users.find((u) => u.id === storedAuthUser.id);
      if (matchedUser) {
        current.session = {
          userId: matchedUser.id,
          role: (storedAuthUser.role && matchedUser.roles.includes(storedAuthUser.role))
            ? storedAuthUser.role
            : matchedUser.roles[0],
        };
      }
    } else if (current.session) {
      const user = current.users.find((u) => u.id === current?.session?.userId);
      if (user && current.session.role) {
        buildAuthResponse(current, user, current.session.role);
      }
    }
  } catch {}

  if (!storageListenerAttached) {
    storageListenerAttached = true;
    window.addEventListener("storage", (e) => {
      if (e.key === "accessToken" && !e.newValue) {
        if (current) current.session = null;
        listeners.forEach((l) => l());
        return;
      }
      if (e.key !== STORAGE_KEY && e.key !== "user") return;
      const next = readStorage();
      if (next) {
        current = next;
        listeners.forEach((l) => l());
      }
    });
  }
  return current;
}

let storageListenerAttached = false;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function commit(next: AppState) {
  current = next;
  persist();
  listeners.forEach((l) => l());
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, ensureLoaded, () => EMPTY_STATE);
}

/** False during SSR / first hydration pass, true once client state is available. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
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
  const user = s ? state.users.find((u) => u.id === s.userId) ?? null : null;
  const mentor = user ? state.mentors.find((m) => m.userId === user.id) ?? null : null;
  return {
    user,
    role: user && s ? s.role : null,
    mentor,
    wallet: user ? state.wallets[user.id] ?? 0 : 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Transaction runner                                                */
/* ------------------------------------------------------------------ */

class Fail extends Error {}

function need(cond: unknown, message: string): asserts cond {
  if (!cond) throw new Fail(message);
}

function run<T extends object>(fn: (d: AppState, now: number) => T): Result<T> {
  const d = structuredClone(ensureLoaded());
  try {
    const out = fn(d, Date.now());
    commit(d);
    return { ok: true, ...out };
  } catch (e) {
    if (e instanceof Fail) return { ok: false, error: e.message };
    throw e;
  }
}

function uid(d: AppState, prefix: string) {
  d.seq += 1;
  return `${prefix}-${d.seq}`;
}

function me(d: AppState, role?: Role) {
  need(d.session, "Bạn cần đăng nhập để thực hiện thao tác này.");
  const user = d.users.find((u) => u.id === d.session!.userId);
  need(user, "Phiên đăng nhập không hợp lệ.");
  if (role) need(d.session!.role === role, "Tài khoản hiện tại không có quyền thực hiện thao tác này.");
  return user;
}

function myMentor(d: AppState) {
  const user = me(d, "mentor");
  const m = d.mentors.find((x) => x.userId === user.id);
  need(m, "Không tìm thấy hồ sơ Mentor của bạn.");
  return m;
}

function getBooking(d: AppState, id: string) {
  const b = d.bookings.find((x) => x.id === id);
  need(b, "Không tìm thấy booking.");
  return b;
}

function lastWord(name: string) {
  return name.trim().split(/\s+/).pop() ?? name;
}

function menteeAcct(d: AppState, userId: string) {
  const u = d.users.find((x) => x.id === userId);
  return `Mentee Wallet (${u ? lastWord(u.name) : userId})`;
}

function mentorAcct(d: AppState, mentorId: string) {
  const m = d.mentors.find((x) => x.id === mentorId);
  return `Mentor Wallet (${m ? lastWord(m.fullName) : mentorId})`;
}

function ledgerPush(
  d: AppState,
  ts: number,
  type: LedgerEntry["type"],
  debit: string,
  credit: string,
  amountVnd: number,
  extra: Partial<LedgerEntry> = {}
) {
  const dt = new Date(ts + 7 * 3_600_000);
  const stamp = `${dt.getUTCFullYear()}${String(dt.getUTCMonth() + 1).padStart(2, "0")}${String(dt.getUTCDate()).padStart(2, "0")}`;
  const id = `ESC-${stamp}-${String(d.ledger.length + 1).padStart(3, "0")}`;
  d.ledger.push({ id, ts, type, debit, credit, amountVnd, hash: fakeHash(id + amountVnd + type + ts), note: "", ...extra });
}

function freeSlot(d: AppState, slotId?: string) {
  if (!slotId) return;
  const s = d.slots.find((x) => x.id === slotId);
  if (s) {
    s.status = "Available";
    delete s.heldBy;
    delete s.heldUntil;
    delete s.bookingId;
  }
}

function releaseToMentor(
  d: AppState,
  b: BookingRec,
  amount: number,
  now: number,
  opts: { noFee?: boolean; note?: string } = {}
) {
  const amt = Math.min(amount, b.escrow.heldVnd);
  if (amt <= 0) return 0;
  const prior = d.bookings
    .filter((x) => x.menteeId === b.menteeId && x.mentorId === b.mentorId)
    .reduce((n, x) => n + x.completedSessions, 0);
  const pct = opts.noFee ? 0 : platformFeePercent(prior);
  const fee = Math.round((amt * pct) / 100);
  const net = amt - fee;
  const mentor = d.mentors.find((m) => m.id === b.mentorId);
  if (mentor?.userId) d.wallets[mentor.userId] = (d.wallets[mentor.userId] ?? 0) + net;
  b.escrow.heldVnd -= amt;
  b.escrow.mentorPaidVnd += net;
  b.escrow.feeVnd += fee;
  const common = { bookingId: b.id, bookingCode: b.code, menteeId: b.menteeId, mentorId: b.mentorId };
  ledgerPush(d, now, "EscrowRelease", "Escrow Pool", mentorAcct(d, b.mentorId), net, { ...common, note: opts.note ?? `${b.serviceName} — ${b.menteeName}` });
  ledgerPush(d, now + 1, "PlatformFee", "Escrow Pool", "Platform Revenue", fee, { ...common, note: pct ? `Phí sàn ${pct}%` : "Không thu phí (phán quyết chia đôi)" });
  return amt;
}

function refundToMentee(d: AppState, b: BookingRec, amount: number, now: number, note: string) {
  const amt = Math.min(amount, b.escrow.heldVnd);
  if (amt <= 0) return 0;
  d.wallets[b.menteeId] = (d.wallets[b.menteeId] ?? 0) + amt;
  b.escrow.heldVnd -= amt;
  b.escrow.refundedVnd += amt;
  ledgerPush(d, now, "Refund", "Escrow Pool", menteeAcct(d, b.menteeId), amt, {
    bookingId: b.id, bookingCode: b.code, menteeId: b.menteeId, mentorId: b.mentorId, note,
  });
  return amt;
}

function finalizeEscrow(b: BookingRec) {
  if (b.escrow.heldVnd > 0) return;
  const { mentorPaidVnd, feeVnd, refundedVnd } = b.escrow;
  const toMentor = mentorPaidVnd + feeVnd > 0;
  b.escrow.state = refundedVnd > 0 && toMentor ? "Split" : refundedVnd > 0 ? "Refunded" : "Released";
}

function doAccept(d: AppState, b: BookingRec, now: number, auto: boolean) {
  const per = Math.round(b.priceVnd / b.totalSessions);
  const isLast = b.completedSessions + 1 >= b.totalSessions;
  const amount = isLast ? b.escrow.heldVnd : per;
  releaseToMentor(d, b, amount, now, {
    note: auto ? `${b.serviceName} — tự động giải ngân sau 24h` : `${b.serviceName} — ${b.menteeName}`,
  });
  b.completedSessions += 1;
  const mentor = d.mentors.find((m) => m.id === b.mentorId);
  if (mentor) mentor.totalSessions += 1;
  if (isLast) {
    b.status = "Completed";
    finalizeEscrow(b);
  } else {
    // Milestone escrow: next session is scheduled one week later.
    b.status = "Confirmed";
    const week = 7 * 24 * 3_600_000;
    b.startMs = (b.startMs ?? now) + week;
    b.endMs = (b.endMs ?? now) + week;
    b.slotId = undefined;
    b.proof = undefined;
    b.startedAt = undefined;
    b.attendance = {};
    b.note = `Buổi ${b.completedSessions + 1}/${b.totalSessions}`;
  }
  return { completed: isLast };
}

function kycForUser(d: AppState, userId: string) {
  return [...d.kyc].filter((k) => k.userId === userId).sort((a, b) => b.submittedAt - a.submittedAt)[0];
}

function slugify(s: string) {
  return normalizeName(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function createMentorRecord(d: AppState, user: User): MentorRec {
  const id = user.mentorId ?? `mentor-${slugify(user.name)}-${d.seq + 1}`;
  user.mentorId = id;
  const rec: MentorRec = {
    id, fullName: user.name, title: "Chuyên gia công nghệ", company: "", yearsOfExperience: 0, avatarUrl: "",
    ratingAverage: 0, reviewCount: 0, totalSessions: 0, satisfactionRate: 0, slaResponseTime: "< 60 phút",
    skills: [], bio: "Hồ sơ đang được cập nhật.", isVerified: false, isOnline: false, services: [],
    categories: ["Backend"], userId: user.id, published: false, strikes: 0, rules: emptyRules(),
    defaults: { durationMin: 60, bufferMin: 15, leadHours: 24 },
  };
  d.mentors.push(rec);
  return rec;
}

/* ------------------------------------------------------------------ */
/*  Public actions                                                    */
/* ------------------------------------------------------------------ */

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
  balance: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

function base64UrlEncode(str: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  return Buffer.from(str).toString("base64url");
}

export function generateJwtToken(user: { id: string; email: string; role: Role; name: string }): string {
  const header = { alg: "HS256", typ: "JWT" };
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: nowSec,
    exp: nowSec + 86400 * 7,
    iss: "skillbridge-auth",
  };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sig = base64UrlEncode(`skillbridge_sig_${user.id}_${nowSec}`);
  return `${headerB64}.${payloadB64}.${sig}`;
}

export function buildAuthResponse(d: AppState, user: User, role: Role): AuthResponse {
  const mentor = user.mentorId ? d.mentors.find((m) => m.id === user.mentorId) : null;
  const balance = d.wallets[user.id] ?? 0;
  const authUser: AuthUser = {
    id: user.id,
    fullName: user.name,
    email: user.email,
    role,
    avatar: mentor?.avatarUrl,
    balance,
  };
  const accessToken = generateJwtToken({
    id: user.id,
    email: user.email,
    role,
    name: user.name,
  });
  const refreshToken = generateJwtToken({
    id: user.id,
    email: user.email,
    role,
    name: user.name,
  });

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("user", JSON.stringify(authUser));
    } catch {}
  }

  return {
    accessToken,
    refreshToken,
    user: authUser,
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "mentee" | "mentor";
}

export interface IntakeInput {
  coreIssue: string;
  link: string;
  expectation: string;
}

export const REASON_MAP: Record<string, { reason: DisputeReason; label: string }> = {
  absent: { reason: "NoShow", label: "Mentor vắng mặt hoặc không tham gia buổi học" },
  early_end: { reason: "MentorLate", label: "Kết thúc sớm > 20 phút so với thời lượng cam kết" },
  wrong_content: { reason: "WrongContent", label: "Nội dung không đúng cam kết của gói dịch vụ" },
  tech_issue: { reason: "TechnicalIssue", label: "Sự cố kỹ thuật từ phía Mentor (mất kết nối lâu)" },
};

export const actions = {
  /* ---------------- Auth ---------------- */
  login(email: string, password: string) {
    return run((d) => {
      const user = d.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      need(user && user.password === password, "Email hoặc mật khẩu không chính xác.");
      const role = user.roles[0] as Role;
      d.session = { userId: user.id, role };
      const auth = buildAuthResponse(d, user, role);
      return { ...auth, role };
    });
  },

  loginAs(userId: string) {
    return run((d) => {
      const user = d.users.find((u) => u.id === userId);
      need(user, "Không tìm thấy tài khoản demo.");
      const role = user.roles[0] as Role;
      d.session = { userId: user.id, role };
      const auth = buildAuthResponse(d, user, role);
      return { ...auth, role };
    });
  },

  logout() {
    return run((d) => {
      d.session = null;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("user");
        } catch {}
      }
      return {};
    });
  },

  register(input: RegisterInput) {
    return run((d, now) => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();
      need(name.length >= 2, "Vui lòng nhập họ và tên đầy đủ.");
      need(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Email không hợp lệ.");
      need(input.password.length >= 8, "Mật khẩu phải có tối thiểu 8 ký tự.");
      need(!d.users.some((u) => u.email.toLowerCase() === email), "Email này đã được đăng ký. Hãy đăng nhập.");
      const user: User = {
        id: uid(d, "u"), name, email, password: input.password, roles: [input.role], createdAt: now,
      };
      d.users.push(user);
      d.wallets[user.id] = 0;
      if (input.role === "mentor") createMentorRecord(d, user);
      d.session = { userId: user.id, role: input.role };
      const auth = buildAuthResponse(d, user, input.role);
      return { ...auth, role: input.role as Role };
    });
  },

  loginWithGoogleDemo(role: "mentee" | "mentor") {
    return run((d, now) => {
      const email = role === "mentor" ? "demo.mentor@gmail.com" : "demo.mentee@gmail.com";
      let user = d.users.find((u) => u.email === email);
      if (!user) {
        user = { id: uid(d, "u"), name: role === "mentor" ? "Demo Mentor (Google)" : "Demo Mentee (Google)", email, password: "google-oauth", roles: [role], createdAt: now };
        d.users.push(user);
        d.wallets[user.id] = 0;
        if (role === "mentor") createMentorRecord(d, user);
      }
      const activeRole = user.roles[0] as Role;
      d.session = { userId: user.id, role: activeRole };
      const auth = buildAuthResponse(d, user, activeRole);
      return { ...auth, role: activeRole };
    });
  },

  switchRole(role: Role) {
    return run((d) => {
      const user = me(d);
      need(user.roles.includes(role), "Tài khoản của bạn chưa có vai trò này.");
      d.session = { userId: user.id, role };
      buildAuthResponse(d, user, role);
      return {};
    });
  },

  upgradeToMentor() {
    return run((d) => {
      const user = me(d);
      if (!user.roles.includes("mentor")) user.roles.push("mentor");
      if (!d.mentors.find((m) => m.userId === user.id)) createMentorRecord(d, user);
      d.session = { userId: user.id, role: "mentor" };
      return {};
    });
  },

  /* ---------------- Booking flow ---------------- */
  startBooking(mentorId: string, serviceId: string) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const mentor = d.mentors.find((m) => m.id === mentorId && m.published);
      need(mentor, "Mentor không tồn tại hoặc chưa mở nhận lịch.");
      need(mentor.userId !== user.id, "Bạn không thể đặt lịch với chính mình.");
      const svc = mentor.services.find((s) => s.id === serviceId);
      need(svc, "Gói dịch vụ không tồn tại.");
      const existing = d.bookings.find(
        (b) => b.menteeId === user.id && b.mentorId === mentorId && b.serviceId === serviceId && b.status === "Draft"
      );
      if (existing) return { bookingId: existing.id };
      const id = `sb-2026-${d.seq + 1}`;
      d.seq += 1;
      d.bookings.push({
        id, code: `#${id.toUpperCase()}`, menteeId: user.id, menteeName: user.name, mentorId, mentorName: mentor.fullName,
        serviceId, serviceName: svc.name, durationLabel: svc.durationLabel, priceVnd: svc.priceVnd,
        totalSessions: svc.totalSessions ?? 1, completedSessions: 0, status: "Draft",
        escrow: { state: "None", heldVnd: 0, mentorPaidVnd: 0, feeVnd: 0, refundedVnd: 0 },
        attendance: {}, createdAt: now,
      });
      return { bookingId: id };
    });
  },

  /** Atomic slot lock (Redis `SET lock:slot:{id} NX EX 600` equivalent) + intake submit. */
  lockSlot(bookingId: string, slotId: string, intake?: IntakeInput) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      need(["Draft", "Expired", "PendingPayment"].includes(b.status), "Booking đã được thanh toán hoặc đã đóng.");
      const finalIntake = intake ?? b.intake;
      need(finalIntake, "Bạn cần hoàn thành khảo sát Intake trước khi khóa slot.");
      const slot = d.slots.find((s) => s.id === slotId && s.mentorId === b.mentorId);
      need(slot, "Khung giờ không tồn tại.");
      const heldByOther = slot.status === "Held" && slot.bookingId !== b.id && (slot.heldUntil ?? 0) > now;
      need(slot.status !== "Booked" && !heldByOther, "Khung giờ này vừa được người khác khóa hoặc đặt. Vui lòng chọn khung giờ khác.");
      need(slot.startMs > now, "Khung giờ đã trôi qua.");
      if (b.slotId && b.slotId !== slot.id) freeSlot(d, b.slotId);
      slot.status = "Held";
      slot.heldBy = user.id;
      slot.bookingId = b.id;
      slot.heldUntil = now + SLOT_LOCK_SECONDS * 1000;
      b.slotId = slot.id;
      b.startMs = slot.startMs;
      b.endMs = slot.endMs;
      b.intake = finalIntake;
      b.status = "PendingPayment";
      b.lockExpiresAt = slot.heldUntil;
      return { lockExpiresAt: slot.heldUntil };
    });
  },

  expireBooking(bookingId: string) {
    return run((d, now) => {
      const b = getBooking(d, bookingId);
      if (b.status === "PendingPayment" && (b.lockExpiresAt ?? 0) <= now + 500) {
        b.status = "Expired";
        freeSlot(d, b.slotId);
      }
      return {};
    });
  },

  payBooking(bookingId: string, gateway: GatewayKind) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      if (b.status === "Confirmed" && b.paidAt) return { duplicate: true };
      need(b.status === "PendingPayment", "Booking không ở trạng thái chờ thanh toán.");
      need((b.lockExpiresAt ?? 0) > now, "Khóa slot đã hết hạn. Vui lòng chọn lại khung giờ.");
      const price = b.priceVnd;
      const txnPrefix = gateway === "PayOS" ? "PAYOS" : gateway === "VNPAY" ? "VNP" : "WAL";
      if (gateway === "Wallet") {
        need((d.wallets[user.id] ?? 0) >= price, "Số dư ví không đủ để thanh toán.");
      } else {
        d.wallets[user.id] = (d.wallets[user.id] ?? 0) + price;
        ledgerPush(d, now, "Deposit", `${gateway} Gateway`, menteeAcct(d, user.id), price, {
          gateway, bookingId: b.id, bookingCode: b.code, menteeId: user.id, mentorId: b.mentorId, note: `Thanh toán qua ${gateway}`,
        });
      }
      d.wallets[user.id] -= price;
      ledgerPush(d, now + 1, "EscrowHold", menteeAcct(d, user.id), "Escrow Pool", price, {
        bookingId: b.id, bookingCode: b.code, menteeId: user.id, mentorId: b.mentorId, note: `${b.serviceName} — ${b.mentorName}`,
      });
      d.payments.push({
        id: uid(d, "pay"), bookingId: b.id, gateway, gatewayTxnId: `${txnPrefix}${Date.now()}`, amountVnd: price, status: "Completed", ts: now,
      });
      b.status = "Confirmed";
      b.gateway = gateway;
      b.paidAt = now;
      b.lockExpiresAt = undefined;
      b.escrow = { state: "Holding", heldVnd: price, mentorPaidVnd: 0, feeVnd: 0, refundedVnd: 0 };
      const slot = d.slots.find((s) => s.id === b.slotId);
      if (slot) {
        slot.status = "Booked";
        delete slot.heldUntil;
        delete slot.heldBy;
        slot.bookingId = b.id;
      }
      return { duplicate: false };
    });
  },

  cancelBooking(bookingId: string) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      need(b.status === "Confirmed" && b.startMs, "Chỉ có thể hủy buổi học đã xác nhận và chưa bắt đầu.");
      const q = cancelQuote(b.startMs, now);
      const refund = Math.round((b.escrow.heldVnd * q.refundPercent) / 100);
      refundToMentee(d, b, refund, now, `Hoàn ${q.refundPercent}% do hủy lịch ${b.code}`);
      if (b.escrow.heldVnd > 0) releaseToMentor(d, b, b.escrow.heldVnd, now, { note: `Đền bù hủy muộn — ${b.menteeName}` });
      finalizeEscrow(b);
      b.status = q.refundPercent === 100 ? "Refunded" : "Cancelled";
      b.note = q.label;
      if (b.startMs > now) freeSlot(d, b.slotId);
      return { refundVnd: refund, quote: q };
    });
  },

  rescheduleBooking(bookingId: string, newSlotId: string) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      need(b.status === "Confirmed" && b.startMs, "Chỉ có thể dời lịch buổi học đã xác nhận.");
      need(cancelQuote(b.startMs, now).tier === "free", "Chỉ được dời lịch trước giờ học hơn 24 giờ.");
      const slot = d.slots.find((s) => s.id === newSlotId && s.mentorId === b.mentorId);
      need(slot && slot.status === "Available" && slot.startMs > now, "Khung giờ mới không còn trống.");
      freeSlot(d, b.slotId);
      slot.status = "Booked";
      slot.bookingId = b.id;
      b.slotId = slot.id;
      b.startMs = slot.startMs;
      b.endMs = slot.endMs;
      return {};
    });
  },

  /* ---------------- Live session ---------------- */
  joinSession(bookingId: string, as: "mentee" | "mentor") {
    return run((d, now) => {
      const user = me(d);
      const b = getBooking(d, bookingId);
      need(as === "mentee" ? b.menteeId === user.id : d.mentors.find((m) => m.id === b.mentorId)?.userId === user.id, "Bạn không phải thành viên của phòng học này.");
      if (b.status === "Confirmed") {
        b.status = "InProgress";
        b.startedAt = now;
      }
      if (b.status === "InProgress") {
        if (as === "mentee") b.attendance.menteeJoin ??= now;
        else b.attendance.mentorJoin ??= now;
      }
      return {};
    });
  },

  leaveSession(bookingId: string, as: "mentee" | "mentor") {
    return run((d, now) => {
      const b = getBooking(d, bookingId);
      if (b.status === "InProgress") {
        if (as === "mentee") b.attendance.menteeLeave = now;
        else b.attendance.mentorLeave = now;
      }
      return {};
    });
  },

  submitProof(bookingId: string, input: { files: string[]; note: string }) {
    return run((d, now) => {
      const mentor = myMentor(d);
      const b = getBooking(d, bookingId);
      need(b.mentorId === mentor.id, "Buổi học này không thuộc về bạn.");
      need(b.status === "InProgress" || b.status === "Confirmed", "Buổi học không ở trạng thái có thể nộp bằng chứng.");
      need(input.files.length > 0, "Vui lòng tải lên ít nhất 1 ảnh chụp màn hình buổi học.");
      need(input.note.trim().length >= 10, "Ghi chú tóm tắt cần tối thiểu 10 ký tự.");
      const started = b.startedAt ?? now;
      b.attendance.mentorJoin ??= started;
      b.attendance.mentorLeave = now;
      b.startedAt = started;
      b.proof = {
        files: input.files, note: input.note.trim(), submittedAt: now, deadlineAt: now + ACCEPT_WINDOW_MS,
        durationLabel: fmtDuration((now - started) / 1000),
      };
      b.status = "AwaitingAcceptance";
      return { deadlineAt: now + ACCEPT_WINDOW_MS };
    });
  },

  acceptSession(bookingId: string) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      need(b.status === "AwaitingAcceptance", "Buổi học chưa ở trạng thái chờ nghiệm thu.");
      return doAccept(d, b, now, false);
    });
  },

  sendMessage(bookingId: string, text: string) {
    return run((d, now) => {
      const user = me(d);
      const b = getBooking(d, bookingId);
      const mentorUser = d.mentors.find((m) => m.id === b.mentorId)?.userId;
      need(user.id === b.menteeId || user.id === mentorUser, "Bạn không thuộc cuộc trò chuyện này.");
      const clean = text.trim();
      need(clean.length > 0, "Tin nhắn không được để trống.");
      need(clean.length <= 1000, "Tin nhắn tối đa 1000 ký tự.");
      d.messages.push({
        id: uid(d, "msg"), bookingId, senderId: user.id, senderName: user.name, role: d.session!.role, text: clean,
        ts: now, flagged: looksLikeContactLeak(clean),
      });
      return {};
    });
  },

  setScratchpad(bookingId: string, text: string) {
    return run((d) => {
      me(d);
      getBooking(d, bookingId).scratchpad = text;
      return {};
    });
  },

  /* ---------------- Disputes ---------------- */
  openDispute(input: { bookingId: string; reasonKey: string; statement: string; wish: "full_refund" | "reschedule"; files: string[] }) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, input.bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      need(["Confirmed", "InProgress", "AwaitingAcceptance"].includes(b.status), "Chỉ có thể khiếu nại buổi học chưa nghiệm thu.");
      need(b.escrow.heldVnd > 0, "Không còn tiền ký quỹ để khiếu nại.");
      const reason = REASON_MAP[input.reasonKey];
      need(reason, "Vui lòng chọn lý do khiếu nại.");
      need(input.statement.trim().length >= 30, "Mô tả sự việc cần tối thiểu 30 ký tự.");
      const id = `DISP-${d.seq + 1}`;
      d.seq += 1;
      const dispute: DisputeRec = {
        id, bookingId: b.id, bookingCode: b.code, menteeId: user.id, menteeName: user.name, mentorId: b.mentorId,
        mentorName: b.mentorName, reason: reason.reason, reasonLabel: reason.label, menteeStatement: input.statement.trim(),
        menteeWish: input.wish, menteeEvidence: input.files, amountVnd: b.escrow.heldVnd, mentorEvidence: [],
        status: "PendingReview", createdAt: now, mentorDueAt: now + DISPUTE_MENTOR_MS, slaExpiresAt: now + DISPUTE_SLA_MS,
        events: [{ ts: now, actor: "System", title: `Khiếu nại #${id} được tạo`, description: `Mentee ${user.name} khởi tạo khiếu nại. Escrow ${new Intl.NumberFormat("vi-VN").format(b.escrow.heldVnd)} ₫ đóng băng.`, variant: "error" }],
      };
      d.disputes.push(dispute);
      b.status = "Disputed";
      b.disputeId = id;
      b.escrow.state = "Disputed";
      b.proof = b.proof ? { ...b.proof } : undefined;
      return { disputeId: id };
    });
  },

  respondDispute(disputeId: string, input: { statement: string; proposal: "compensate" | "split" | "reject"; files: string[] }) {
    return run((d, now) => {
      const mentor = myMentor(d);
      const disp = d.disputes.find((x) => x.id === disputeId);
      need(disp && disp.mentorId === mentor.id, "Không tìm thấy khiếu nại.");
      need(disp.status === "PendingReview", "Khiếu nại này đã được giải trình.");
      need(input.statement.trim().length >= 20, "Ý kiến giải trình cần tối thiểu 20 ký tự.");
      disp.mentorStatement = input.statement.trim();
      disp.mentorProposal = input.proposal;
      disp.mentorEvidence = input.files;
      disp.mentorRespondedAt = now;
      disp.status = "UnderAdminReview";
      const label = input.proposal === "compensate" ? "Đề xuất dạy bù 1 buổi 60 phút miễn phí." : input.proposal === "split" ? "Đề xuất chia đôi 50/50 tiền ký quỹ." : "Bác bỏ khiếu nại, yêu cầu Admin xem lại log máy chủ.";
      disp.events.push({ ts: now, actor: "Mentor", title: `${mentor.fullName} gửi giải trình`, description: label, variant: "brand" });
      disp.events.push({ ts: now + 1, actor: "Admin", title: "Chuyển hồ sơ cho Admin thẩm định", description: "Kiểm tra WebRTC attendance log và bằng chứng hai bên.", variant: "warning" });
      return {};
    });
  },

  ruleDispute(disputeId: string, ruling: DisputeRuling, note?: string) {
    return run((d, now) => {
      me(d, "admin");
      const disp = d.disputes.find((x) => x.id === disputeId);
      need(disp, "Không tìm thấy khiếu nại.");
      need(disp.status !== "Resolved", "Khiếu nại này đã được phán quyết.");
      const b = getBooking(d, disp.bookingId);
      const held = b.escrow.heldVnd;
      let description = "";
      switch (ruling) {
        case "FullRefund": {
          refundToMentee(d, b, held, now, `Phán quyết hoàn 100% — ${disp.id}`);
          finalizeEscrow(b);
          b.status = "Refunded";
          const mentor = d.mentors.find((m) => m.id === b.mentorId);
          if (mentor) mentor.strikes += 1;
          description = "Hoàn 100% cho Mentee, trừ điểm uy tín Mentor (1 gậy phạt).";
          break;
        }
        case "Split5050": {
          const half = Math.floor(held / 2);
          refundToMentee(d, b, half, now, `Phán quyết chia đôi — ${disp.id}`);
          releaseToMentor(d, b, b.escrow.heldVnd, now, { noFee: true, note: `Phán quyết chia đôi — ${disp.id}` });
          finalizeEscrow(b);
          b.status = "Completed";
          b.completedSessions = b.totalSessions;
          description = "Chia đôi Escrow 50/50 giữa hai bên.";
          break;
        }
        case "MakeUpSession": {
          b.status = "Confirmed";
          b.escrow.state = "Holding";
          b.startMs = (b.startMs ?? now) + 7 * 24 * 3_600_000;
          b.endMs = (b.endMs ?? now) + 7 * 24 * 3_600_000;
          b.slotId = undefined;
          b.startedAt = undefined;
          b.proof = undefined;
          b.attendance = {};
          b.note = "Học bù miễn phí theo phán quyết";
          description = "Giữ nguyên Escrow, Mentor dạy bù 1 buổi miễn phí trong 7 ngày.";
          break;
        }
        case "ReleaseMentor": {
          releaseToMentor(d, b, held, now);
          finalizeEscrow(b);
          b.status = "Completed";
          b.completedSessions = b.totalSessions;
          description = "Bác khiếu nại, giải phóng tiền cho Mentor.";
          break;
        }
      }
      disp.status = "Resolved";
      disp.ruling = ruling;
      disp.rulingNote = note;
      disp.resolvedAt = now;
      disp.events.push({ ts: now, actor: "Admin", title: "Admin ban hành phán quyết", description: note ? `${description} Ghi chú: ${note}` : description, variant: "success" });
      return {};
    });
  },

  /* ---------------- Reviews ---------------- */
  submitReview(bookingId: string, input: { ratings: ReviewRec["ratings"]; comment: string; isPublic: boolean }) {
    return run((d, now) => {
      const user = me(d, "mentee");
      const b = getBooking(d, bookingId);
      need(b.menteeId === user.id, "Booking này không thuộc về bạn.");
      need(b.status === "Completed", "Chỉ có thể đánh giá buổi học đã hoàn tất.");
      need(!b.reviewId, "Bạn đã đánh giá buổi học này.");
      need(input.comment.trim().length >= 20, "Nhận xét cần tối thiểu 20 ký tự.");
      const r = input.ratings;
      const avg = Math.round(((r.technicalDepth + r.communication + r.valueDelivered + r.overallSatisfaction) / 4) * 100) / 100;
      const id = uid(d, "rev");
      d.reviews.push({
        id, bookingId: b.id, mentorId: b.mentorId, menteeId: user.id, menteeName: user.name, ratings: r, averageRating: avg,
        comment: input.comment.trim(), isEscrowVerified: true, isAnonymous: false, createdAt: new Date(now).toISOString(),
        isPublic: input.isPublic, serviceName: b.serviceName,
      });
      b.reviewId = id;
      const mentor = d.mentors.find((m) => m.id === b.mentorId);
      if (mentor) {
        mentor.ratingAverage = Math.round(((mentor.ratingAverage * mentor.reviewCount + avg) / (mentor.reviewCount + 1)) * 100) / 100;
        mentor.reviewCount += 1;
      }
      return { reviewId: id };
    });
  },

  replyReview(reviewId: string, text: string) {
    return run((d) => {
      const mentor = myMentor(d);
      const r = d.reviews.find((x) => x.id === reviewId && x.mentorId === mentor.id);
      need(r, "Không tìm thấy đánh giá.");
      need(text.trim().length > 0, "Phản hồi không được để trống.");
      r.mentorReply = text.trim();
      return {};
    });
  },

  /* ---------------- Wallet ---------------- */
  deposit(amountVnd: number, gateway: "PayOS" | "VNPAY") {
    return run((d, now) => {
      const user = me(d, "mentee");
      need(Number.isFinite(amountVnd) && amountVnd >= 50_000, "Số tiền nạp tối thiểu là 50.000 ₫.");
      need(amountVnd <= 50_000_000, "Số tiền nạp tối đa mỗi lần là 50.000.000 ₫.");
      d.wallets[user.id] = (d.wallets[user.id] ?? 0) + amountVnd;
      ledgerPush(d, now, "Deposit", `${gateway} Gateway`, menteeAcct(d, user.id), amountVnd, {
        gateway, menteeId: user.id, note: `Nạp tiền qua ${gateway === "PayOS" ? "PayOS VietQR" : "VNPAY"}`,
      });
      return {};
    });
  },

  issueOtp() {
    return run((d, now) => {
      const user = me(d, "mentor");
      const code = String(Math.floor(100000 + Math.random() * 900000));
      d.otp = { userId: user.id, code, expiresAt: now + 5 * 60_000 };
      return { code, expiresAt: now + 5 * 60_000 };
    });
  },

  confirmPayout(amountVnd: number, otp: string) {
    return run((d, now) => {
      const mentor = myMentor(d);
      const user = me(d, "mentor");
      const app = [...d.kyc].filter((k) => k.userId === user.id && k.status === "Approved").sort((a, b) => b.submittedAt - a.submittedAt)[0];
      need(app, "Bạn cần hoàn tất xác minh KYC (có tài khoản ngân hàng) trước khi rút tiền.");
      need(normalizeName(app.bank.holder) === normalizeName(app.name), "Tên chủ tài khoản ngân hàng không khớp với CCCD đã duyệt KYC.");
      need(Number.isFinite(amountVnd) && amountVnd >= MIN_PAYOUT_VND, `Số tiền rút tối thiểu là ${new Intl.NumberFormat("vi-VN").format(MIN_PAYOUT_VND)} ₫.`);
      need(amountVnd <= (d.wallets[user.id] ?? 0), "Số tiền rút vượt quá số dư khả dụng.");
      need(d.otp && d.otp.userId === user.id && d.otp.expiresAt > now, "Mã OTP đã hết hạn. Vui lòng gửi lại mã.");
      need(d.otp.code === otp.trim(), "Mã OTP không chính xác.");
      d.wallets[user.id] -= amountVnd;
      d.otp = null;
      const code = `PO-${d.seq + 1}`;
      d.seq += 1;
      d.payouts.push({
        id: uid(d, "payout"), code, mentorId: mentor.id, amountVnd, bankFeeVnd: 0, netVnd: amountVnd, bankName: app.bank.name,
        account: app.bank.account, holder: app.bank.holder, status: "Completed", otpVerified: true, ts: now,
      });
      ledgerPush(d, now, "Payout", mentorAcct(d, mentor.id), `${app.bank.name} ****${app.bank.account.slice(-4)}`, amountVnd, {
        mentorId: mentor.id, note: `Rút tiền về ${app.bank.name}`,
      });
      return { code };
    });
  },

  /* ---------------- Mentor studio & schedule ---------------- */
  saveServices(services: MentorServiceTier[], publish: boolean) {
    return run((d) => {
      const mentor = myMentor(d);
      for (const s of services) {
        need(s.name.trim().length >= 3, `Tên gói Tier ${s.tierNumber} cần tối thiểu 3 ký tự.`);
        need(s.priceVnd >= 50_000, `Giá gói Tier ${s.tierNumber} tối thiểu 50.000 ₫.`);
        need(s.deliverables.some((x) => x.trim()), `Gói Tier ${s.tierNumber} cần ít nhất 1 cam kết đầu ra.`);
      }
      if (publish) need(mentor.published || mentor.isVerified, "Hồ sơ cần được Admin duyệt KYC trước khi xuất bản gói dịch vụ.");
      mentor.services = services.map((s) => ({ ...s, deliverables: s.deliverables.filter((x) => x.trim()) }));
      if (publish) mentor.published = true;
      return { published: mentor.published };
    });
  },

  saveAvailability(rules: AvailabilityRules, defaults: MentorRec["defaults"]) {
    return run((d, now) => {
      const mentor = myMentor(d);
      for (const day of Object.values(rules)) {
        for (const w of day.windows) need(isValidWindow(w), "Khoảng giờ không hợp lệ (giờ kết thúc phải sau giờ bắt đầu).");
      }
      mentor.rules = rules;
      mentor.defaults = defaults;
      const keep = d.slots.filter((s) => s.mentorId !== mentor.id || s.status !== "Available");
      const taken = new Set(keep.filter((s) => s.mentorId === mentor.id).map((s) => s.id));
      const fresh: Slot[] = generateSlots(mentor.id, rules, defaults, now).filter((s) => !taken.has(s.id));
      d.slots = [...keep, ...fresh];
      return { generated: fresh.length };
    });
  },

  mentorCancel(bookingId: string) {
    return run((d, now) => {
      const mentor = myMentor(d);
      const b = getBooking(d, bookingId);
      need(b.mentorId === mentor.id && b.status === "Confirmed", "Không thể hủy buổi học này.");
      refundToMentee(d, b, b.escrow.heldVnd, now, `Mentor hủy lịch ${b.code} — hoàn 100%`);
      finalizeEscrow(b);
      b.status = "Refunded";
      b.note = "Mentor hủy đột xuất";
      mentor.strikes += 1;
      freeSlot(d, b.slotId);
      return {};
    });
  },

  /* ---------------- KYC ---------------- */
  submitKyc(input: Omit<KycApp, "id" | "userId" | "mentorId" | "status" | "submittedAt" | "reviewedAt" | "adminNote" | "name" | "email"> & { name?: string }) {
    return run((d, now) => {
      const user = me(d, "mentor");
      const mentor = myMentor(d);
      need(input.idFront && input.idBack, "Vui lòng tải lên CCCD đủ 2 mặt.");
      need(input.bank.code && /^\d{8,16}$/.test(input.bank.account), "Số tài khoản ngân hàng phải gồm 8–16 chữ số.");
      need(input.bank.holder.trim().length >= 3, "Vui lòng nhập tên chủ tài khoản.");
      const prev = kycForUser(d, user.id);
      const id = prev && prev.status !== "Approved" ? prev.id : `KYC-${d.seq + 1}`;
      if (!prev || prev.status === "Approved") d.seq += 1;
      d.kyc = d.kyc.filter((k) => k.id !== id);
      d.kyc.push({
        ...input, id, userId: user.id, mentorId: mentor.id, name: input.name?.trim() || user.name, email: user.email,
        status: "Pending", submittedAt: now,
      });
      return { kycId: id };
    });
  },

  reviewKyc(kycId: string, decision: "approve" | "need_more" | "reject", note?: string) {
    return run((d, now) => {
      me(d, "admin");
      const k = d.kyc.find((x) => x.id === kycId);
      need(k, "Không tìm thấy hồ sơ KYC.");
      need(k.status === "Pending", "Hồ sơ này đã được xử lý.");
      if (decision !== "approve") need((note ?? "").trim().length >= 5, "Vui lòng nhập lý do/yêu cầu bổ sung (tối thiểu 5 ký tự).");
      k.status = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "NeedMore";
      k.adminNote = note?.trim();
      k.reviewedAt = now;
      if (decision === "approve") {
        const mentor = d.mentors.find((m) => m.id === k.mentorId);
        if (mentor) {
          mentor.isVerified = true;
          mentor.fullName = k.name;
          if (k.company) mentor.company = k.company;
          if (mentor.services.length > 0) mentor.published = true;
        }
      }
      return {};
    });
  },

  reconcile() {
    return run((d, now) => {
      me(d, "admin");
      d.reconciledAt = now;
      return {};
    });
  },

  /** Scheduled-job equivalent (Quartz): expire slot locks, auto-release escrow after 24h. */
  runMaintenance() {
    const s = ensureLoaded();
    const now = Date.now();
    const needsWork =
      s.bookings.some(
        (b) =>
          (b.status === "PendingPayment" && (b.lockExpiresAt ?? 0) <= now) ||
          (b.status === "AwaitingAcceptance" && (b.proof?.deadlineAt ?? Infinity) <= now)
      ) || s.slots.some((x) => x.status === "Held" && (x.heldUntil ?? 0) <= now);
    if (!needsWork) return;
    run((d, t) => {
      for (const b of d.bookings) {
        if (b.status === "PendingPayment" && (b.lockExpiresAt ?? 0) <= t) {
          b.status = "Expired";
          freeSlot(d, b.slotId);
        }
        if (b.status === "AwaitingAcceptance" && (b.proof?.deadlineAt ?? Infinity) <= t) {
          doAccept(d, b, t, true);
        }
      }
      for (const sl of d.slots) {
        if (sl.status === "Held" && (sl.heldUntil ?? 0) <= t) freeSlot(d, sl.id);
      }
      return {};
    });
  },

  resetDemoData() {
    commit(buildSeed(Date.now()));
  },
};

/* ------------------------------------------------------------------ */
/*  Selectors                                                         */
/* ------------------------------------------------------------------ */

export function availableSlots(state: AppState, mentorId: string, now: number, limit = 12): Slot[] {
  return state.slots
    .filter((s) => {
      if (s.mentorId !== mentorId || s.startMs <= now) return false;
      if (s.status === "Available") return true;
      return s.status === "Held" && (s.heldUntil ?? 0) <= now;
    })
    .sort((a, b) => a.startMs - b.startMs)
    .slice(0, limit);
}

export function mentorSlotsForPicker(state: AppState, mentorId: string, bookingId: string, now: number, limit = 12) {
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
    if (b.escrow.state === "Holding" || b.escrow.state === "Disputed") holding += b.escrow.heldVnd;
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
