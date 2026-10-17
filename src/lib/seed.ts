import type { MentorServiceTier } from "@/types";
import {
  type AppState,
  type AvailabilityRules,
  type BookingRec,
  type DisputeRec,
  type KycApp,
  type LedgerEntry,
  type MentorRec,
  type ReviewRec,
  type Slot,
  type User,
  emptyRules,
  fakeHash,
  generateSlots,
  platformFeePercent,
} from "./domain";

const H = 3_600_000;
const D = 24 * H;

export const STATE_VERSION = 1;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function rules(
  spec: Partial<Record<keyof AvailabilityRules, [string, string][]>>
): AvailabilityRules {
  const r = emptyRules();
  for (const key of Object.keys(spec) as (keyof AvailabilityRules)[]) {
    const wins = spec[key] ?? [];
    r[key] = { enabled: wins.length > 0, windows: wins.map(([start, end]) => ({ start, end })) };
  }
  return r;
}

function tier(
  mentorId: string,
  n: 1 | 2 | 3,
  name: string,
  durationMinutes: number,
  durationLabel: string,
  priceVnd: number,
  deliverables: string[],
  totalSessions = 1
): MentorServiceTier {
  return {
    id: `svc-${mentorId}-tier-${n}`,
    tierNumber: n,
    name,
    durationMinutes,
    durationLabel,
    priceVnd,
    deliverables,
    isFeatured: n === 2,
    category: n === 1 ? "QUICK_WIN" : n === 2 ? "FEATURED" : "TRANSFORMATION",
    totalSessions,
  };
}

interface MentorSeed {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  company: string;
  yoe: number;
  rating: number;
  reviews: number;
  sessions: number;
  satisfaction: number;
  sla: string;
  skills: string[];
  bio: string;
  verified: boolean;
  online: boolean;
  categories: string[];
  services: MentorServiceTier[];
  rules: AvailabilityRules;
}

function mentorFromSeed(s: MentorSeed): MentorRec {
  return {
    id: s.id,
    fullName: s.fullName,
    title: s.title,
    company: s.company,
    yearsOfExperience: s.yoe,
    avatarUrl: "",
    ratingAverage: s.rating,
    reviewCount: s.reviews,
    totalSessions: s.sessions,
    satisfactionRate: s.satisfaction,
    slaResponseTime: s.sla,
    skills: s.skills,
    bio: s.bio,
    isVerified: s.verified,
    isOnline: s.online,
    services: s.services,
    categories: s.categories,
    userId: s.userId,
    published: true,
    strikes: 0,
    rules: s.rules,
    defaults: { durationMin: 60, bufferMin: 15, leadHours: 1 },
  };
}

const PW = "12345678";

/* ------------------------------------------------------------------ */
/*  Seed                                                              */
/* ------------------------------------------------------------------ */

export function buildSeed(now: number): AppState {
  const users: User[] = [
    { id: "u-linh", name: "Hoàng Thùy Linh", email: "linh.hoang@gmail.com", password: PW, roles: ["mentee"], createdAt: now - 60 * D },
    { id: "u-tuan", name: "Trần Minh Tuấn", email: "tuan.tran@gmail.com", password: PW, roles: ["mentee"], createdAt: now - 50 * D },
    { id: "u-an", name: "Nguyễn Văn An", email: "an.nguyen@vng.com.vn", password: PW, roles: ["mentor"], mentorId: "mentor-an-nguyen", createdAt: now - 120 * D },
    { id: "u-nam", name: "Lê Hoàng Nam", email: "nam.le@techcombank.vn", password: PW, roles: ["mentor"], mentorId: "mentor-hoang-nam", createdAt: now - 110 * D },
    { id: "u-tung", name: "Trần Thanh Tùng", email: "tung.tran@fpt.com", password: PW, roles: ["mentor"], mentorId: "mentor-thanh-tung", createdAt: now - 100 * D },
    { id: "u-chau", name: "Phạm Minh Châu", email: "chau.pham@momo.vn", password: PW, roles: ["mentor"], mentorId: "mentor-minh-chau", createdAt: now - 90 * D },
    { id: "u-ducanh", name: "Vũ Đức Anh", email: "ducanh.vu@vinai.io", password: PW, roles: ["mentor"], mentorId: "mentor-duc-anh", createdAt: now - 80 * D },
    { id: "u-thuha", name: "Ngô Thu Hà", email: "thuha.ngo@tiki.vn", password: PW, roles: ["mentor"], mentorId: "mentor-thu-ha", createdAt: now - 70 * D },
    { id: "u-long", name: "Vũ Hải Long", email: "long.vu@shopee.com", password: PW, roles: ["mentor"], mentorId: "mentor-hai-long", createdAt: now - 65 * D },
    { id: "u-klinh", name: "Bùi Khánh Linh", email: "khanhlinh.bui@grab.com", password: PW, roles: ["mentor"], mentorId: "mentor-khanh-linh", createdAt: now - 60 * D },
    { id: "u-admin", name: "Quản Trị Viên", email: "admin@skillbridge.vn", password: PW, roles: ["admin"], createdAt: now - 200 * D },
    { id: "u-huy", name: "Đặng Quốc Huy", email: "huy.dang@gmail.com", password: PW, roles: ["mentor"], mentorId: "mentor-quoc-huy", createdAt: now - 2 * D },
  ];

  const eveningRules = rules({ mon: [["19:30", "22:00"]], wed: [["19:30", "22:00"]], fri: [["19:30", "22:00"]], sat: [["09:00", "12:00"]] });

  const mentorSeeds: MentorSeed[] = [
    {
      id: "mentor-an-nguyen", userId: "u-an", fullName: "Nguyễn Văn An", title: "Tech Lead @ VNG", company: "VNG Corporation",
      yoe: 9, rating: 4.98, reviews: 142, sessions: 218, satisfaction: 99.1, sla: "< 15 phút",
      skills: ["Distributed Systems", ".NET 10", "Microservices", "PostgreSQL", "Kafka"],
      bio: "Chuyên sâu Kiến trúc Hệ thống Phân tán, .NET 10, Microservices. Đã mentor 200+ kỹ sư từ Junior tới Staff level qua các buổi 1-on-1 chuyên sâu.",
      verified: true, online: true, categories: ["Backend"],
      services: [
        tier("mentor-an-nguyen", 1, "Review CV & Tối Ưu Portfolio", 45, "45 phút", 300000, ["1-on-1 Deep Dive 45 phút", "Notion Checklist sửa từng dòng CV", "Template Senior Markdown chuẩn FAANG"]),
        tier("mentor-an-nguyen", 2, "Mock Interview System Design & .NET", 60, "60 phút", 450000, ["Mô phỏng phỏng vấn FAANG 60 phút", "Rubric 10 tiêu chí chấm điểm PDF", "Video ghi hình toàn bộ buổi học", "Bản thiết kế kiến trúc mẫu (Draw.io)"]),
        tier("mentor-an-nguyen", 3, "Lộ Trình Software Architect", 60, "1 Tháng (4 Buổi)", 2000000, ["4 buổi 1-on-1 hàng tuần (60 phút/buổi)", "Review PR GitHub thực tế", "Telegram Async Q&A 24/7"], 4),
      ],
      rules: eveningRules,
    },
    {
      id: "mentor-hoang-nam", userId: "u-nam", fullName: "Lê Hoàng Nam", title: "Staff Engineer @ Techcombank", company: "Techcombank",
      yoe: 12, rating: 4.95, reviews: 89, sessions: 156, satisfaction: 98.4, sla: "< 30 phút",
      skills: ["System Design", "Java", "Spring Boot", "Career Coaching"],
      bio: "12 năm xây dựng hệ thống core banking quy mô lớn. Giúp bạn thiết kế hệ thống chịu tải cao và định hướng sự nghiệp lên Staff.",
      verified: true, online: false, categories: ["Backend", "Data Engineering"],
      services: [
        tier("mentor-hoang-nam", 1, "Review System Design", 45, "45 phút", 500000, ["Phản biện kiến trúc bạn đang làm", "Danh sách rủi ro & đề xuất cải thiện", "Tài liệu tham khảo chọn lọc"]),
        tier("mentor-hoang-nam", 2, "Career Coaching", 60, "60 phút", 400000, ["Phân tích lộ trình Senior → Staff", "Kế hoạch 90 ngày", "Mock negotiation lương"]),
        tier("mentor-hoang-nam", 3, "Mentoring 1 Tháng", 60, "1 Tháng (4 Buổi)", 1800000, ["4 buổi 1-on-1 hàng tuần", "Review tài liệu kiến trúc", "Hỗ trợ Q&A qua chat"], 4),
      ],
      rules: rules({ tue: [["20:00", "22:00"]], thu: [["20:00", "22:00"]], sat: [["09:00", "12:00"]] }),
    },
    {
      id: "mentor-thanh-tung", userId: "u-tung", fullName: "Trần Thanh Tùng", title: "Cloud Architect @ FPT Software", company: "FPT Software",
      yoe: 8, rating: 4.92, reviews: 67, sessions: 124, satisfaction: 97.6, sla: "< 20 phút",
      skills: ["AWS", "Kubernetes", "Terraform", "DevOps"],
      bio: "AWS Certified Solutions Architect Professional. Chuyên thiết kế hạ tầng cloud production, CI/CD và tối ưu chi phí.",
      verified: true, online: true, categories: ["Cloud & DevOps"],
      services: [
        tier("mentor-thanh-tung", 1, "AWS Solutions", 60, "60 phút", 550000, ["Review kiến trúc AWS hiện tại", "Sơ đồ kiến trúc đề xuất", "Checklist bảo mật & chi phí"]),
        tier("mentor-thanh-tung", 2, "DevOps Pipeline", 60, "60 phút", 450000, ["Thiết kế CI/CD end-to-end", "Mẫu pipeline GitHub Actions", "Hướng dẫn rollout an toàn"]),
        tier("mentor-thanh-tung", 3, "Cloud Migration", 60, "1 Tháng (4 Buổi)", 2500000, ["Lộ trình migrate 4 tuần", "Review IaC Terraform", "Hỗ trợ cutover"], 4),
      ],
      rules: rules({ wed: [["20:00", "22:00"]], fri: [["20:00", "22:00"]], sun: [["09:00", "12:00"]] }),
    },
    {
      id: "mentor-minh-chau", userId: "u-chau", fullName: "Phạm Minh Châu", title: "Engineering Manager @ Momo", company: "Momo",
      yoe: 10, rating: 4.89, reviews: 53, sessions: 98, satisfaction: 96.8, sla: "< 45 phút",
      skills: ["Leadership", "Hiring", "Mock Interview", "Backend"],
      bio: "Quản lý đội 25 kỹ sư. Luyện phỏng vấn và coaching kỹ năng lãnh đạo cho Senior muốn lên Tech Lead / EM.",
      verified: false, online: false, categories: ["Backend"],
      services: [
        tier("mentor-minh-chau", 1, "Mock Interview", 60, "60 phút", 400000, ["Phỏng vấn thử kỹ thuật + hành vi", "Bảng điểm chi tiết", "Gợi ý cải thiện"]),
        tier("mentor-minh-chau", 2, "Leadership Coaching", 60, "60 phút", 600000, ["Xây dựng kế hoạch chuyển đổi sang quản lý", "Mẫu 1-on-1 & feedback", "Q&A tình huống thực tế"]),
        tier("mentor-minh-chau", 3, "Lộ Trình Tech Lead", 60, "1 Tháng (4 Buổi)", 2400000, ["4 buổi coaching hàng tuần", "Review OKR đội nhóm", "Hỗ trợ qua chat"], 4),
      ],
      rules: rules({ sat: [["14:00", "17:00"]], sun: [["14:00", "17:00"]] }),
    },
    {
      id: "mentor-duc-anh", userId: "u-ducanh", fullName: "Vũ Đức Anh", title: "Senior ML Engineer @ VinAI", company: "VinAI",
      yoe: 6, rating: 4.96, reviews: 45, sessions: 82, satisfaction: 98.9, sla: "< 20 phút",
      skills: ["Machine Learning", "PyTorch", "MLOps", "Research"],
      bio: "Nghiên cứu & triển khai mô hình ML quy mô lớn. Hỗ trợ thiết kế ML system, review paper và định hướng sự nghiệp AI.",
      verified: true, online: true, categories: ["AI/ML"],
      services: [
        tier("mentor-duc-anh", 1, "Research Paper Review", 45, "45 phút", 350000, ["Đọc & phản biện paper của bạn", "Gợi ý hướng thí nghiệm", "Danh sách tài liệu liên quan"]),
        tier("mentor-duc-anh", 2, "ML System Design", 60, "60 phút", 500000, ["Thiết kế pipeline ML end-to-end", "Trade-off serving & monitoring", "Sơ đồ kiến trúc mẫu"]),
        tier("mentor-duc-anh", 3, "AI Career Path", 60, "1 Tháng (4 Buổi)", 1500000, ["Lộ trình 4 tuần theo mục tiêu", "Review portfolio & dự án", "Mock phỏng vấn ML"], 4),
      ],
      rules: rules({ thu: [["19:00", "22:00"]], sun: [["19:00", "22:00"]] }),
    },
    {
      id: "mentor-thu-ha", userId: "u-thuha", fullName: "Ngô Thu Hà", title: "Mobile Lead @ Tiki", company: "Tiki",
      yoe: 7, rating: 4.91, reviews: 38, sessions: 71, satisfaction: 97.2, sla: "< 30 phút",
      skills: ["Flutter", "Swift", "Kotlin", "App Architecture"],
      bio: "Dẫn dắt đội mobile 12 người, 20M+ lượt cài đặt. Review kiến trúc app, hiệu năng và quy trình release.",
      verified: true, online: false, categories: ["Mobile"],
      services: [
        tier("mentor-thu-ha", 1, "Flutter Review", 45, "45 phút", 300000, ["Review codebase Flutter", "Danh sách vấn đề hiệu năng", "Gợi ý refactor"]),
        tier("mentor-thu-ha", 2, "App Architecture", 60, "60 phút", 450000, ["Thiết kế kiến trúc app (MVVM / Clean)", "Chiến lược state management", "Sơ đồ module"]),
        tier("mentor-thu-ha", 3, "Lộ Trình Mobile Senior", 60, "1 Tháng (4 Buổi)", 1900000, ["4 buổi coaching hàng tuần", "Review PR thực tế", "Mock phỏng vấn mobile"], 4),
      ],
      rules: rules({ sat: [["10:00", "13:00"]], sun: [["10:00", "13:00"]] }),
    },
    {
      id: "mentor-hai-long", userId: "u-long", fullName: "Vũ Hải Long", title: "Senior Frontend @ Shopee", company: "Shopee",
      yoe: 8, rating: 4.9, reviews: 31, sessions: 60, satisfaction: 97.0, sla: "< 30 phút",
      skills: ["React", "Next.js", "TypeScript", "Web Performance"],
      bio: "Tối ưu hiệu năng web cho hàng chục triệu người dùng. Hỗ trợ review code React/Next.js và lộ trình lên Senior Frontend.",
      verified: true, online: true, categories: ["Frontend"],
      services: [
        tier("mentor-hai-long", 1, "Review Code React", 45, "45 phút", 300000, ["Review PR/codebase React", "Checklist hiệu năng", "Gợi ý cấu trúc thư mục"]),
        tier("mentor-hai-long", 2, "Frontend System Design", 60, "60 phút", 450000, ["Thiết kế kiến trúc micro-frontend", "Chiến lược caching & SSR", "Sơ đồ kiến trúc mẫu"]),
        tier("mentor-hai-long", 3, "Lộ Trình Senior Frontend", 60, "1 Tháng (4 Buổi)", 1700000, ["4 buổi coaching hàng tuần", "Review dự án cá nhân", "Mock phỏng vấn frontend"], 4),
      ],
      rules: rules({ mon: [["20:00", "22:00"]], thu: [["20:00", "22:00"]], sat: [["14:00", "17:00"]] }),
    },
    {
      id: "mentor-khanh-linh", userId: "u-klinh", fullName: "Bùi Khánh Linh", title: "Data Engineer @ Grab", company: "Grab",
      yoe: 7, rating: 4.93, reviews: 27, sessions: 52, satisfaction: 98.0, sla: "< 25 phút",
      skills: ["Spark", "Airflow", "dbt", "Data Modeling"],
      bio: "Xây dựng data platform xử lý hàng tỷ sự kiện mỗi ngày. Review pipeline, mô hình dữ liệu và lộ trình lên Senior Data Engineer.",
      verified: true, online: false, categories: ["Data Engineering"],
      services: [
        tier("mentor-khanh-linh", 1, "Review Data Pipeline", 45, "45 phút", 350000, ["Review DAG Airflow / Spark job", "Danh sách điểm nghẽn", "Gợi ý tối ưu chi phí"]),
        tier("mentor-khanh-linh", 2, "Data Modeling Workshop", 60, "60 phút", 480000, ["Thiết kế mô hình dimensional", "Chiến lược dbt", "Sơ đồ mẫu"]),
        tier("mentor-khanh-linh", 3, "Lộ Trình Data Engineer", 60, "1 Tháng (4 Buổi)", 1800000, ["4 buổi coaching hàng tuần", "Review dự án", "Mock phỏng vấn data"], 4),
      ],
      rules: rules({ tue: [["20:00", "22:00"]], fri: [["20:00", "22:00"]], sun: [["09:00", "12:00"]] }),
    },
  ];

  const mentors: MentorRec[] = mentorSeeds.map(mentorFromSeed);

  // Pending mentor candidate (unpublished until KYC approved)
  mentors.push({
    id: "mentor-quoc-huy", fullName: "Đặng Quốc Huy", title: "Senior Backend Engineer", company: "Freelance",
    yearsOfExperience: 6, avatarUrl: "", ratingAverage: 0, reviewCount: 0, totalSessions: 0, satisfactionRate: 0,
    slaResponseTime: "< 60 phút", skills: ["Go", "PostgreSQL", "gRPC"],
    bio: "Senior Backend Engineer 6 năm kinh nghiệm Go & PostgreSQL.", isVerified: false, isOnline: false,
    services: [], categories: ["Backend"], userId: "u-huy", published: false, strikes: 0,
    rules: emptyRules(), defaults: { durationMin: 60, bufferMin: 15, leadHours: 24 },
  });

  /* ---- Slots ---- */
  const slots: Slot[] = [];
  for (const m of mentors) {
    if (m.published) slots.push(...generateSlots(m.id, m.rules, m.defaults, now));
  }

  /* ---- Bookings, ledger, disputes, reviews ---- */
  const bookings: BookingRec[] = [];
  const ledger: LedgerEntry[] = [];
  const reviews: ReviewRec[] = [];
  const disputes: DisputeRec[] = [];
  let ledgerSeq = 0;
  const mentorOf = (id: string) => mentors.find((m) => m.id === id)!;
  const userOf = (id: string) => users.find((u) => u.id === id)!;

  const pushLedger = (
    ts: number,
    type: LedgerEntry["type"],
    debit: string,
    credit: string,
    amountVnd: number,
    extra: Partial<LedgerEntry> = {}
  ) => {
    ledgerSeq++;
    const d = new Date(ts + 7 * H);
    const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
    const id = `ESC-${stamp}-${String(ledgerSeq).padStart(3, "0")}`;
    ledger.push({ id, ts, type, debit, credit, amountVnd, hash: fakeHash(id + amountVnd + type), note: "", ...extra });
  };

  function addBooking(opts: {
    id: string; menteeId: string; mentorId: string; tierN: 1 | 2 | 3; status: BookingRec["status"];
    startMs: number; gateway: "PayOS" | "VNPAY"; intake: BookingRec["intake"];
    proofDeadline?: number; completed?: boolean; disputed?: boolean;
  }) {
    const m = mentorOf(opts.mentorId);
    const svc = m.services.find((s) => s.tierNumber === opts.tierN)!;
    const mentee = userOf(opts.menteeId);
    const durMs = (svc.durationMinutes || 60) * 60_000;
    const paidAt = opts.startMs - 3 * D;
    const b: BookingRec = {
      id: opts.id, code: `#${opts.id.toUpperCase()}`, menteeId: opts.menteeId, menteeName: mentee.name,
      mentorId: m.id, mentorName: m.fullName, serviceId: svc.id, serviceName: svc.name, durationLabel: svc.durationLabel,
      priceVnd: svc.priceVnd, totalSessions: svc.totalSessions ?? 1, completedSessions: 0,
      startMs: opts.startMs, endMs: opts.startMs + durMs, status: opts.status, intake: opts.intake,
      gateway: opts.gateway, paidAt,
      escrow: { state: "Holding", heldVnd: svc.priceVnd, mentorPaidVnd: 0, feeVnd: 0, refundedVnd: 0 },
      attendance: {}, createdAt: paidAt - H,
    };
    const bookedSlotId = `slot-${m.id}-${opts.startMs}`;
    const dupIdx = slots.findIndex((s) => s.id === bookedSlotId);
    if (dupIdx >= 0) slots.splice(dupIdx, 1);
    slots.push({ id: bookedSlotId, mentorId: m.id, startMs: opts.startMs, endMs: b.endMs!, status: "Booked", bookingId: b.id });
    b.slotId = `slot-${m.id}-${opts.startMs}`;

    const gwName = opts.gateway === "PayOS" ? "PayOS Gateway" : "VNPAY Gateway";
    pushLedger(paidAt, "Deposit", gwName, `Mentee Wallet (${mentee.name.split(" ").pop()})`, svc.priceVnd, { gateway: opts.gateway, bookingId: b.id, bookingCode: b.code, menteeId: mentee.id, mentorId: m.id, note: `Nạp tiền qua ${opts.gateway}` });
    pushLedger(paidAt + 1000, "EscrowHold", `Mentee Wallet (${mentee.name.split(" ").pop()})`, "Escrow Pool", svc.priceVnd, { bookingId: b.id, bookingCode: b.code, menteeId: mentee.id, mentorId: m.id, note: `${svc.name} — ${m.fullName}` });

    if (opts.completed) {
      const pct = platformFeePercent(0);
      const fee = Math.round((svc.priceVnd * pct) / 100);
      const net = svc.priceVnd - fee;
      b.escrow = { state: "Released", heldVnd: 0, mentorPaidVnd: net, feeVnd: fee, refundedVnd: 0 };
      b.completedSessions = 1;
      b.startedAt = opts.startMs;
      const rel = opts.startMs + durMs + 2 * H;
      pushLedger(rel, "EscrowRelease", "Escrow Pool", `Mentor Wallet (${m.fullName.split(" ").pop()})`, net, { bookingId: b.id, bookingCode: b.code, menteeId: mentee.id, mentorId: m.id, note: `${svc.name} — ${mentee.name}` });
      pushLedger(rel + 1, "PlatformFee", "Escrow Pool", "Platform Revenue", fee, { bookingId: b.id, bookingCode: b.code, menteeId: mentee.id, mentorId: m.id, note: `Phí sàn ${pct}%` });
    }
    if (opts.proofDeadline) {
      b.proof = {
        files: ["webrtc_session_proof.png", "rubric_feedback.pdf"],
        note: "Đã cover đầy đủ nội dung. Rubric chi tiết đính kèm, bạn nên luyện thêm phần cache invalidation.",
        submittedAt: opts.proofDeadline - 24 * H,
        deadlineAt: opts.proofDeadline,
        durationLabel: "55m 12s",
      };
      b.startedAt = opts.startMs;
    }
    bookings.push(b);
    return b;
  }

  // 1) Upcoming confirmed: Linh ↔ An
  addBooking({ id: "sb-2026-98124", menteeId: "u-linh", mentorId: "mentor-an-nguyen", tierN: 2, status: "Confirmed", startMs: Math.ceil((now + 2 * D) / (15 * 60_000)) * 15 * 60_000, gateway: "PayOS",
    intake: { coreIssue: "Chuẩn bị phỏng vấn Senior Backend, muốn luyện thiết kế kiến trúc phân tán thanh toán 10k RPS.", link: "https://github.com/linh-hoang/microservices-demo", expectation: "Nắm chắc rubric chấm điểm của FAANG." } });

  // 2) Awaiting acceptance: Linh ↔ Nam
  addBooking({ id: "sb-2026-97500", menteeId: "u-linh", mentorId: "mentor-hoang-nam", tierN: 2, status: "AwaitingAcceptance", startMs: now - 6 * H, gateway: "VNPAY", proofDeadline: now + 18 * H,
    intake: { coreIssue: "Review lộ trình phát triển lên Senior .NET và cách chuẩn bị CV.", link: "https://drive.google.com/linh-cv", expectation: "Có kế hoạch 90 ngày rõ ràng." } });

  // 3) Completed + reviewed: Linh ↔ Tùng
  const b3 = addBooking({ id: "sb-2026-96100", menteeId: "u-linh", mentorId: "mentor-thanh-tung", tierN: 1, status: "Completed", startMs: now - 6 * D, gateway: "PayOS", completed: true,
    intake: { coreIssue: "Review kiến trúc AWS cho hệ thống thanh toán, cần tối ưu chi phí và bảo mật.", link: "https://github.com/linh-hoang/aws-infra", expectation: "Có sơ đồ kiến trúc đề xuất." } });
  reviews.push({
    id: "rev-96100", bookingId: b3.id, mentorId: b3.mentorId, menteeId: "u-linh", menteeName: "Hoàng Thùy Linh",
    ratings: { technicalDepth: 5, communication: 5, valueDelivered: 5, overallSatisfaction: 5 }, averageRating: 5,
    comment: "Anh Tùng chỉ ra nhiều điểm tối ưu chi phí mà em chưa nghĩ tới. Sơ đồ kiến trúc rất rõ ràng.",
    isEscrowVerified: true, isAnonymous: false, createdAt: new Date(now - 5 * D).toISOString(), isPublic: true, serviceName: b3.serviceName,
  });
  b3.reviewId = "rev-96100";

  // 4) Awaiting acceptance: Tuấn ↔ An
  addBooking({ id: "sb-2026-97800", menteeId: "u-tuan", mentorId: "mentor-an-nguyen", tierN: 1, status: "AwaitingAcceptance", startMs: now - 5 * H, gateway: "PayOS", proofDeadline: now + 20 * H,
    intake: { coreIssue: "Muốn tối ưu CV để apply vị trí Senior .NET tại Techcombank.", link: "https://drive.google.com/cv-tuan", expectation: "CV đạt chuẩn Senior, có feedback cụ thể từng section." } });

  // 5) Completed history: Tuấn ↔ An (+ reviews of An)
  const b5 = addBooking({ id: "sb-2026-95400", menteeId: "u-tuan", mentorId: "mentor-an-nguyen", tierN: 2, status: "Completed", startMs: now - 12 * D, gateway: "PayOS", completed: true,
    intake: { coreIssue: "Luyện system design cho vòng phỏng vấn Senior với trọng tâm cache và DB.", link: "https://github.com/tuan-tran/system-design", expectation: "Hiểu rubric và điểm yếu cần cải thiện." } });
  reviews.push({
    id: "rev-95400", bookingId: b5.id, mentorId: "mentor-an-nguyen", menteeId: "u-tuan", menteeName: "Trần Minh Tuấn",
    ratings: { technicalDepth: 5, communication: 5, valueDelivered: 5, overallSatisfaction: 5 }, averageRating: 5,
    comment: "Anh An review rất sâu, chỉ đúng các điểm yếu về cache invalidation và deadlock trong PostgreSQL mà em hay bị vướng khi phỏng vấn Senior. Rubric chấm điểm cực kỳ chi tiết.",
    mentorReply: "Cảm ơn Tuấn nhé, chúc em tự tin pass vòng System Design tuần tới!",
    isEscrowVerified: true, isAnonymous: false, createdAt: new Date(now - 11 * D).toISOString(), isPublic: true, serviceName: b5.serviceName,
  });
  b5.reviewId = "rev-95400";
  reviews.push({
    id: "rev-seed-nam", bookingId: "sb-2026-94100", mentorId: "mentor-an-nguyen", menteeId: "u-ext-1", menteeName: "Lê Hoàng Nam",
    ratings: { technicalDepth: 5, communication: 4, valueDelivered: 5, overallSatisfaction: 5 }, averageRating: 4.75,
    comment: "CV sau khi được anh An review đã giúp em nhận được 3 lời mời phỏng vấn từ các công ty lớn chỉ trong tuần đầu tiên. Template Markdown rất chuyên nghiệp.",
    isEscrowVerified: true, isAnonymous: false, createdAt: new Date(now - 20 * D).toISOString(), isPublic: true, serviceName: "Review CV & Tối Ưu Portfolio",
  });

  // 6) Dispute already answered by mentor (waiting for admin): Linh ↔ An
  const b6 = addBooking({ id: "sb-2026-97990", menteeId: "u-linh", mentorId: "mentor-an-nguyen", tierN: 2, status: "Disputed", startMs: now - 30 * H, gateway: "PayOS",
    intake: { coreIssue: "Luyện thiết kế hệ thống thanh toán chịu tải 10k RPS.", link: "https://github.com/linh-hoang/payment", expectation: "Nắm chắc cách giải bài toán System Design." } });
  b6.startedAt = b6.startMs;
  b6.escrow.state = "Disputed";
  b6.attendance = { menteeJoin: b6.startMs!, mentorJoin: b6.startMs! + 11 * 60_000, mentorLeave: b6.startMs! + 46 * 60_000, menteeLeave: b6.startMs! + 47 * 60_000 };
  const d6c = now - 20 * H;
  const d6: DisputeRec = {
    id: "DISP-97990", bookingId: b6.id, bookingCode: b6.code, menteeId: "u-linh", menteeName: "Hoàng Thùy Linh",
    mentorId: "mentor-an-nguyen", mentorName: "Nguyễn Văn An", reason: "MentorLate", reasonLabel: "Kết thúc sớm > 20 phút so với thời lượng cam kết",
    menteeStatement: "Mentor vào muộn 15 phút, giải thích qua loa rồi out sớm sau 30 phút. Chưa cover hết nội dung System Design như cam kết gói 60 phút.",
    menteeWish: "full_refund", menteeEvidence: ["chat_log_screenshot.png"], amountVnd: b6.priceVnd,
    mentorStatement: "Tôi có mặt lúc 19:40 do sự cố kỹ thuật. Đã chuẩn bị sẵn tài liệu rubric và gửi cho Mentee qua email sau buổi học. Đề xuất dạy bù miễn phí.",
    mentorProposal: "compensate", mentorEvidence: ["email_rubric_sent.pdf"], mentorRespondedAt: now - 10 * H,
    status: "UnderAdminReview", mentorDueAt: d6c + 24 * H, slaExpiresAt: d6c + 48 * H, createdAt: d6c,
    events: [
      { ts: d6c, actor: "System", title: "Khiếu nại #DISP-97990 được tạo", description: "Mentee Hoàng Thùy Linh khởi tạo khiếu nại. Escrow 450.000 ₫ đóng băng.", variant: "error" },
      { ts: now - 10 * H, actor: "Mentor", title: "Nguyễn Văn An gửi giải trình", description: "Đề xuất dạy bù 1 buổi 60 phút miễn phí.", variant: "brand" },
      { ts: now - 8 * H, actor: "Admin", title: "Admin bắt đầu thẩm định", description: "Kiểm tra WebRTC attendance log và bằng chứng hai bên.", variant: "warning" },
    ],
  };
  disputes.push(d6);
  b6.disputeId = d6.id;

  // 7) Dispute waiting for mentor response: Tuấn ↔ An
  const b7 = addBooking({ id: "sb-2026-98002", menteeId: "u-tuan", mentorId: "mentor-an-nguyen", tierN: 1, status: "Disputed", startMs: now - 8 * H, gateway: "VNPAY",
    intake: { coreIssue: "Review CV Senior .NET và tối ưu portfolio để apply các công ty lớn.", link: "https://drive.google.com/tuan-cv-2", expectation: "CV đạt chuẩn ATS, có feedback từng dòng." } });
  b7.startedAt = b7.startMs;
  b7.escrow.state = "Disputed";
  b7.attendance = { menteeJoin: b7.startMs!, mentorJoin: b7.startMs! + 3 * 60_000, mentorLeave: b7.startMs! + 38 * 60_000, menteeLeave: b7.startMs! + 38 * 60_000 };
  const d7c = now - 2 * H;
  const d7: DisputeRec = {
    id: "DISP-98002", bookingId: b7.id, bookingCode: b7.code, menteeId: "u-tuan", menteeName: "Trần Minh Tuấn",
    mentorId: "mentor-an-nguyen", mentorName: "Nguyễn Văn An", reason: "WrongContent", reasonLabel: "Nội dung không đúng cam kết của gói dịch vụ",
    menteeStatement: "Buổi học chủ yếu nói chung chung, không sửa từng dòng CV và không có Notion checklist như cam kết gói Review CV.",
    menteeWish: "reschedule", menteeEvidence: ["cv_goc.pdf", "ghi_chu_buoi_hoc.png"], amountVnd: b7.priceVnd,
    mentorEvidence: [], status: "PendingReview", mentorDueAt: d7c + 24 * H, slaExpiresAt: d7c + 48 * H, createdAt: d7c,
    events: [{ ts: d7c, actor: "System", title: "Khiếu nại #DISP-98002 được tạo", description: "Mentee Trần Minh Tuấn khởi tạo khiếu nại. Escrow 300.000 ₫ đóng băng.", variant: "error" }],
  };
  disputes.push(d7);
  b7.disputeId = d7.id;

  /* ---- Other ledger history (deposits / payouts) ---- */
  pushLedger(now - 3 * D, "Deposit", "PayOS Gateway", "Mentee Wallet (Linh)", 1_000_000, { gateway: "PayOS", menteeId: "u-linh", note: "Nạp tiền qua PayOS VietQR" });
  pushLedger(now - 9 * D, "Deposit", "VNPAY Gateway", "Mentee Wallet (Linh)", 2_000_000, { gateway: "VNPAY", menteeId: "u-linh", note: "Nạp tiền qua VNPAY" });
  pushLedger(now - 4 * D, "Payout", "Mentor Wallet (An)", "MB Bank ****4321", 2_000_000, { mentorId: "mentor-an-nguyen", note: "Rút tiền về MB Bank" });
  pushLedger(now - 15 * D, "Refund", "Escrow Pool", "Mentee Wallet (Tuấn)", 450_000, { menteeId: "u-tuan", note: "Hoàn tiền khiếu nại" });

  ledger.sort((a, b) => a.ts - b.ts);

  const kyc: KycApp[] = [
    {
      id: "KYC-8812", userId: "u-huy", mentorId: "mentor-quoc-huy", name: "Đặng Quốc Huy", email: "huy.dang@gmail.com",
      phone: "0912 345 678", company: "Freelance — Senior Backend Engineer", linkedin: "https://linkedin.com/in/quoc-huy-dang",
      bank: { code: "mbbank", name: "MB Bank", account: "0912345678", holder: "DANG QUOC HUY" },
      idFront: "cccd_mat_truoc.jpg", idBack: "cccd_mat_sau.jpg", certFiles: ["aws_solutions_architect.pdf", "bang_dai_hoc_bach_khoa.pdf"],
      certUrl: "https://www.credly.com/badges/quoc-huy", issuer: "AWS, Đại học Bách Khoa",
      status: "Pending", submittedAt: now - 5 * H,
    },
    {
      id: "KYC-8701", userId: "u-an", mentorId: "mentor-an-nguyen", name: "Nguyễn Văn An", email: "an.nguyen@vng.com.vn",
      phone: "0987 654 321", company: "VNG — Tech Lead", linkedin: "https://linkedin.com/in/an-nguyen-vng",
      bank: { code: "mbbank", name: "MB Bank", account: "0987654321", holder: "NGUYEN VAN AN" },
      idFront: "cccd_front.png", idBack: "cccd_back.png", certFiles: ["aws_sa_pro.pdf"], certUrl: "", issuer: "AWS",
      status: "Approved", submittedAt: now - 120 * D, reviewedAt: now - 119 * D,
    },
  ];

  const wallets: Record<string, number> = {
    "u-linh": 2_500_000,
    "u-tuan": 800_000,
    "u-an": 6_200_000,
    "u-nam": 3_100_000,
    "u-tung": 1_450_000,
    "u-chau": 900_000,
    "u-ducanh": 2_200_000,
    "u-thuha": 1_000_000,
    "u-long": 800_000,
    "u-klinh": 1_300_000,
    "u-huy": 0,
  };

  return {
    v: STATE_VERSION,
    seq: 98200,
    users,
    session: null,
    mentors,
    slots,
    bookings,
    ledger,
    wallets,
    disputes,
    reviews,
    kyc,
    messages: [
      { id: "msg-1", bookingId: "sb-2026-98124", senderId: "u-an", senderName: "Nguyễn Văn An", role: "mentor", text: "Chào Linh, anh đã đọc xong Intake Form. Mình sẽ đi thẳng vào bài toán thanh toán 10k RPS nhé.", ts: now - 3 * H, flagged: false },
    ],
    payouts: [],
    payments: [],
    otp: null,
  };
}
