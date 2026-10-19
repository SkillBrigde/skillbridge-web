import type {
  DisputeReason,
  DisputeRuling,
  DisputeStatus,
  MentorProfile,
  SessionReview,
} from "@/types";

export type { DisputeReason, DisputeRuling, DisputeStatus, MentorProfile, SessionReview };

/* ------------------------------------------------------------------ */
/*  Core domain types                                                 */
/* ------------------------------------------------------------------ */

export type Role = "mentee" | "mentor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
<<<<<<< HEAD
  password: string;
=======
  password?: string;
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
  roles: Role[];
  mentorId?: string;
  createdAt: number;
}

export interface Session {
  userId: string;
  role: Role;
}

export type WeekdayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface TimeWindow {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface DayRule {
  enabled: boolean;
  windows: TimeWindow[];
}

export type AvailabilityRules = Record<WeekdayId, DayRule>;

export interface MentorRec extends MentorProfile {
  categories: string[];
  userId?: string;
  published: boolean;
  strikes: number;
  rules: AvailabilityRules;
  defaults: { durationMin: number; bufferMin: number; leadHours: number };
}

export interface Slot {
  id: string;
  mentorId: string;
  startMs: number;
  endMs: number;
  status: "Available" | "Held" | "Booked";
  heldBy?: string;
  heldUntil?: number;
  bookingId?: string;
}

export type BookingStatusRec =
  | "Draft"
  | "PendingPayment"
  | "Confirmed"
  | "InProgress"
  | "AwaitingAcceptance"
  | "Completed"
  | "Cancelled"
  | "Refunded"
  | "Disputed"
  | "Expired";

export type BookingStatus = BookingStatusRec;
export type Booking = BookingRec;

export type EscrowState =
  | "None"
  | "Holding"
  | "Released"
  | "Refunded"
  | "Split"
  | "Disputed";

export type GatewayKind = "PayOS" | "VNPAY" | "Wallet";

export interface BookingRec {
  id: string;
  code: string;
  menteeId: string;
  menteeName: string;
  mentorId: string;
  mentorName: string;
  serviceId: string;
  serviceName: string;
  durationLabel: string;
  priceVnd: number;
  totalSessions: number;
  completedSessions: number;
  slotId?: string;
  startMs?: number;
  endMs?: number;
  status: BookingStatusRec;
  lockExpiresAt?: number;
  intake?: { coreIssue: string; link: string; expectation: string };
  gateway?: GatewayKind;
  paidAt?: number;
  escrow: {
    state: EscrowState;
    heldVnd: number;
    mentorPaidVnd: number;
    feeVnd: number;
    refundedVnd: number;
  };
  startedAt?: number;
  proof?: {
    files: string[];
    note: string;
    submittedAt: number;
    deadlineAt: number;
    durationLabel: string;
  };
  attendance: {
    menteeJoin?: number;
    menteeLeave?: number;
    mentorJoin?: number;
    mentorLeave?: number;
  };
  scratchpad?: string;
  reviewId?: string;
  disputeId?: string;
  note?: string;
  createdAt: number;
}

export type LedgerType =
  | "Deposit"
  | "EscrowHold"
  | "EscrowRelease"
  | "PlatformFee"
  | "Payout"
  | "Refund";

export interface LedgerEntry {
  id: string;
  ts: number;
  type: LedgerType;
  debit: string;
  credit: string;
  amountVnd: number;
  hash: string;
  gateway?: "PayOS" | "VNPAY";
  bookingId?: string;
  bookingCode?: string;
  menteeId?: string;
  mentorId?: string;
  note: string;
}

export type TransactionType = LedgerType;
export type LedgerTransaction = LedgerEntry;
export type WalletTransactionRecord = LedgerEntry;
export type DisputeRecord = DisputeRec;
export type UserAccount = User;

export interface DisputeEvent {
  ts: number;
  actor: "System" | "Mentee" | "Mentor" | "Admin";
  title: string;
  description: string;
  variant: "error" | "brand" | "warning" | "success";
}

export interface DisputeRec {
  id: string;
  bookingId: string;
  bookingCode: string;
  menteeId: string;
  menteeName: string;
  mentorId: string;
  mentorName: string;
  reason: DisputeReason;
  reasonLabel: string;
  menteeStatement: string;
  menteeWish: "full_refund" | "reschedule";
  menteeEvidence: string[];
  amountVnd: number;
  mentorStatement?: string;
  mentorProposal?: "compensate" | "split" | "reject";
  mentorEvidence: string[];
  mentorRespondedAt?: number;
  status: DisputeStatus;
  ruling?: DisputeRuling;
  rulingNote?: string;
  resolvedAt?: number;
  createdAt: number;
  mentorDueAt: number;
  slaExpiresAt: number;
  events: DisputeEvent[];
}

export interface ReviewRec extends SessionReview {
  isPublic: boolean;
  serviceName: string;
}

export interface MessageRec {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  role: Role;
  text: string;
  ts: number;
  flagged: boolean;
}

export interface PayoutRec {
  id: string;
  code: string;
  mentorId: string;
  amountVnd: number;
  bankFeeVnd: number;
  netVnd: number;
  bankName: string;
  account: string;
  holder: string;
  status: "Completed";
  otpVerified: boolean;
  ts: number;
}

export interface PaymentRec {
  id: string;
  bookingId: string;
  gateway: GatewayKind;
  gatewayTxnId: string;
  amountVnd: number;
  status: "Completed" | "Failed";
  ts: number;
}

export type KycStatus = "Pending" | "Approved" | "Rejected" | "NeedMore";

export interface KycApp {
  id: string;
  userId: string;
  mentorId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  linkedin: string;
  bank: { code: string; name: string; account: string; holder: string };
  idFront: string;
  idBack: string;
  certFiles: string[];
  certUrl: string;
  issuer: string;
  status: KycStatus;
  adminNote?: string;
  submittedAt: number;
  reviewedAt?: number;
}

export interface AppState {
  v: number;
  seq: number;
  users: User[];
  session: Session | null;
  mentors: MentorRec[];
  slots: Slot[];
  bookings: BookingRec[];
  ledger: LedgerEntry[];
  wallets: Record<string, number>;
  disputes: DisputeRec[];
  reviews: ReviewRec[];
  kyc: KycApp[];
  messages: MessageRec[];
  payouts: PayoutRec[];
  payments: PaymentRec[];
  otp: { userId: string; code: string; expiresAt: number } | null;
  reconciledAt?: number;
}

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/* ------------------------------------------------------------------ */
/*  Constants & policy                                                */
/* ------------------------------------------------------------------ */

export const SLOT_LOCK_SECONDS = 600;
export const ACCEPT_WINDOW_MS = 24 * 60 * 60 * 1000;
export const DISPUTE_MENTOR_MS = 24 * 60 * 60 * 1000;
export const DISPUTE_SLA_MS = 48 * 60 * 60 * 1000;
export const MIN_PAYOUT_VND = 50_000;
export const VNPAY_TEST_CARD = {
  number: "9704198526191432198",
  holder: "NGUYEN VAN A",
  issueDate: "07/15",
};
export const VNPAY_TEST_OTP = "123456";

export const WEEKDAYS: { id: WeekdayId; label: string; dow: number }[] = [
  { id: "mon", label: "Thứ 2", dow: 1 },
  { id: "tue", label: "Thứ 3", dow: 2 },
  { id: "wed", label: "Thứ 4", dow: 3 },
  { id: "thu", label: "Thứ 5", dow: 4 },
  { id: "fri", label: "Thứ 6", dow: 5 },
  { id: "sat", label: "Thứ 7", dow: 6 },
  { id: "sun", label: "Chủ nhật", dow: 0 },
];

/** Platform fee tiers: 15% (sessions 1-3), 8% (4-6), 5% (7+) per mentee-mentor pair. */
export function platformFeePercent(previousAcceptedSessions: number): number {
  if (previousAcceptedSessions < 3) return 15;
  if (previousAcceptedSessions < 6) return 8;
  return 5;
}

export interface CancelQuote {
  hoursLeft: number;
  tier: "free" | "partial" | "none";
  refundPercent: number;
  label: string;
}

/** Cancellation matrix for mentees (doc §7.1). */
export function cancelQuote(startMs: number, now: number): CancelQuote {
  const hoursLeft = (startMs - now) / 3_600_000;
  if (hoursLeft > 24) {
    return { hoursLeft, tier: "free", refundPercent: 100, label: "Hủy trước 24h — hoàn 100% về ví" };
  }
  if (hoursLeft >= 2) {
    return { hoursLeft, tier: "partial", refundPercent: 65, label: "Hủy trong 2h–24h — phạt 35%, hoàn 65% về ví" };
  }
  return { hoursLeft, tier: "none", refundPercent: 0, label: "Hủy dưới 2h / No-show — mất 100% tiền buổi học" };
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                        */
/* ------------------------------------------------------------------ */

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DOW_LABEL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function vn(ms: number) {
  return new Date(ms + VN_OFFSET_MS);
}

const p2 = (n: number) => String(n).padStart(2, "0");

export function fmtTime(ms: number): string {
  const d = vn(ms);
  return `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`;
}

export function fmtDayMonth(ms: number): string {
  const d = vn(ms);
  return `${p2(d.getUTCDate())}/${p2(d.getUTCMonth() + 1)}`;
}

export function fmtFullDate(ms: number): string {
  const d = vn(ms);
  return `${p2(d.getUTCDate())}/${p2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

export function fmtDateTime(ms: number): string {
  return `${fmtDayMonth(ms)} ${fmtTime(ms)}`;
}

export function fmtDow(ms: number): string {
  return DOW_LABEL[vn(ms).getUTCDay()];
}

/** "Thứ 6, 18/09" */
export function slotDateLabel(ms: number): string {
  return `${fmtDow(ms)}, ${fmtDayMonth(ms)}`;
}

/** "19:30 - 20:30" */
export function slotTimeLabel(startMs: number, endMs: number): string {
  return `${fmtTime(startMs)} - ${fmtTime(endMs)}`;
}

/** "19:30 - 20:30 (Thứ 6, 18/09)" */
export function slotFullLabel(startMs: number, endMs: number): string {
  return `${slotTimeLabel(startMs, endMs)} (${slotDateLabel(startMs)})`;
}

/** "19:30 Thứ 6, 18/09/2026" or "19:30–20:30 • Thứ 6, 18/09/2026" */
export function bookingTimeLabel(startMs: number, endMs?: number): string {
  if (endMs) {
    return `${slotTimeLabel(startMs, endMs)} • ${fmtDow(startMs)}, ${fmtFullDate(startMs)}`;
  }
  return `${fmtTime(startMs)} ${fmtDow(startMs)}, ${fmtFullDate(startMs)}`;
}

export function relativeFuture(targetMs: number, now: number): string {
  const diff = targetMs - now;
  if (diff <= 0) return "Đã tới giờ";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `Còn ${Math.max(mins, 1)}p`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Còn ${hours}h`;
  return `Còn ${Math.floor(hours / 24)} ngày`;
}

export function fmtDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}h ${p2(m)}m ${p2(sec)}s` : `${p2(m)}m ${p2(sec)}s`;
}

export function fmtCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${p2(m)}m ${p2(sec)}s`;
}

export function vnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " ₫";
}

export function vndShort(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1).replace(".", ",")}Tr`;
  }
  return `${Math.round(amount / 1000)}k`;
}

export function parseVnd(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function fakeHash(seed: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + c, 0x85ebca6b) >>> 0;
  }
  const a = h1.toString(16).padStart(8, "0");
  const b = h2.toString(16).padStart(8, "0");
  return `0x${a.slice(0, 6)}...${b.slice(2, 8)}`;
}

export function normalizeName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

const LEAK_PATTERNS = [
  /(?:\+?84|0)\s?\d{2,3}[\s.-]?\d{3}[\s.-]?\d{3,4}/,
  /\bzalo\b/i,
  /\b(?:stk|số tài khoản|so tai khoan)\b/i,
  /\b\d{9,16}\b/,
];

export function looksLikeContactLeak(text: string): boolean {
  return LEAK_PATTERNS.some((re) => re.test(text));
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Slot generation (Asia/Ho_Chi_Minh)                                */
/* ------------------------------------------------------------------ */

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function isValidWindow(w: TimeWindow): boolean {
  return /^\d{2}:\d{2}$/.test(w.start) && /^\d{2}:\d{2}$/.test(w.end) && toMinutes(w.end) > toMinutes(w.start);
}

export function windowLabel(w: TimeWindow): string {
  return `${w.start} - ${w.end}`;
}

export function generateSlots(
  mentorId: string,
  rules: AvailabilityRules,
  defaults: { durationMin: number; bufferMin: number; leadHours: number },
  now: number,
  days = 14
): Slot[] {
  const vnMidnight = Math.floor((now + VN_OFFSET_MS) / DAY_MS) * DAY_MS - VN_OFFSET_MS;
  const earliest = now + defaults.leadHours * 3_600_000;
  const out: Slot[] = [];

  for (let d = 0; d < days; d++) {
    const dayStart = vnMidnight + d * DAY_MS;
    const dow = vn(dayStart).getUTCDay();
    const dayId = WEEKDAYS.find((w) => w.dow === dow)!.id;
    const rule = rules[dayId];
    if (!rule?.enabled) continue;

    for (const win of rule.windows) {
      if (!isValidWindow(win)) continue;
      const winEnd = toMinutes(win.end);
      let cursor = toMinutes(win.start);
      while (cursor + defaults.durationMin <= winEnd) {
        const startMs = dayStart + cursor * 60_000;
        const endMs = startMs + defaults.durationMin * 60_000;
        if (startMs >= earliest) {
          out.push({
            id: `slot-${mentorId}-${startMs}`,
            mentorId,
            startMs,
            endMs,
            status: "Available",
          });
        }
        cursor += defaults.durationMin + defaults.bufferMin;
      }
    }
  }
  return out.sort((a, b) => a.startMs - b.startMs);
}

export function emptyRules(): AvailabilityRules {
  return {
    mon: { enabled: false, windows: [] },
    tue: { enabled: false, windows: [] },
    wed: { enabled: false, windows: [] },
    thu: { enabled: false, windows: [] },
    fri: { enabled: false, windows: [] },
    sat: { enabled: false, windows: [] },
    sun: { enabled: false, windows: [] },
  };
}

export function displayStatus(
  b: BookingRec
): "pending_payment" | "confirmed" | "pending_review" | "completed" | "disputed" | "cancelled" {
  switch (b.status) {
    case "Draft":
    case "PendingPayment":
      return "pending_payment";
    case "Confirmed":
    case "InProgress":
      return "confirmed";
    case "AwaitingAcceptance":
      return "pending_review";
    case "Completed":
      return "completed";
    case "Disputed":
      return "disputed";
    default:
      return "cancelled";
  }
}

export interface StatusDisplayInfo {
  label: string;
  variant: "escrow" | "pending" | "neutral" | "dispute" | "brand";
}

export function getBookingStatusInfo(status: string): StatusDisplayInfo {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "inprogress":
      return { label: "Đã xác nhận", variant: "escrow" };
    case "awaitingacceptance":
    case "pending_review":
      return { label: "Chờ Nghiệm Thu Escrow", variant: "pending" };
    case "completed":
      return { label: "Đã Hoàn Tất", variant: "neutral" };
    case "disputed":
      return { label: "Đang Khiếu Nại", variant: "dispute" };
    case "draft":
    case "pendingpayment":
    case "pending_payment":
      return { label: "Chờ Thanh Toán", variant: "pending" };
    case "cancelled":
    case "expired":
      return { label: "Đã Hủy", variant: "neutral" };
    case "refunded":
      return { label: "Đã Hoàn Tiền", variant: "neutral" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function getLedgerTypeInfo(type: string): StatusDisplayInfo {
  switch (type) {
    case "Deposit":
      return { label: "Thành Công", variant: "escrow" };
    case "EscrowRelease":
      return { label: "Hoàn Tất", variant: "escrow" };
    case "EscrowHold":
      return { label: "Đang Ký Quỹ", variant: "pending" };
    case "Refund":
    case "DisputeHold":
      return { label: "Hoàn Tiền", variant: "dispute" };
    case "PlatformFee":
      return { label: "Phí Sàn", variant: "brand" };
    case "Payout":
      return { label: "Rút Tiền", variant: "neutral" };
    default:
      return { label: type, variant: "neutral" };
  }
}

