import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  Scale,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
  Zap,
  Terminal,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { MentorCard } from "@/components/mentor-card";

/* ------------------------------------------------------------------ */
/*  FEATURED MENTORS DATA                                             */
/* ------------------------------------------------------------------ */
const FEATURED_MENTORS = [
  {
    id: "mentor-an-nguyen",
    name: "Nguyễn Văn An",
    role: "Tech Lead @ VNG • 9 YOE",
    rating: 4.98,
    reviews: 142,
    sessions: 218,
    verified: true,
    online: true,
    services: [
      { label: "Review CV", price: "300k" },
      { label: "Mock Interview", price: "450k" },
      { label: "Lộ Trình 1 Tháng", price: "2Tr" },
    ],
    availableSlot: "Trống 19:30 Thứ 6",
  },
  {
    id: "mentor-hoang-nam",
    name: "Lê Hoàng Nam",
    role: "Staff Engineer @ Techcombank • 12 YOE",
    rating: 4.95,
    reviews: 89,
    sessions: 156,
    verified: true,
    online: false,
    services: [
      { label: "Review System Design", price: "500k" },
      { label: "Career Coaching", price: "400k" },
      { label: "Mentoring 1 Tháng", price: "1.8Tr" },
    ],
    availableSlot: "Trống 09:00 Thứ 7",
  },
  {
    id: "mentor-thanh-tung",
    name: "Trần Thanh Tùng",
    role: "Principal Cloud Architect @ AWS • 10 YOE",
    rating: 4.99,
    reviews: 204,
    sessions: 312,
    verified: true,
    online: true,
    services: [
      { label: "AWS Architecture", price: "600k" },
      { label: "K8s Production", price: "550k" },
      { label: "Gói Cố Vấn Quý", price: "5Tr" },
    ],
    availableSlot: "Trống 20:00 Thứ 5",
  },
];

/* ------------------------------------------------------------------ */
/*  CATEGORIES                                                        */
/* ------------------------------------------------------------------ */
const POPULAR_DOMAINS = [
  { name: "System Design & Architecture", mentors: "28 Mentors", icon: Zap },
  { name: "Cloud, DevOps & Kubernetes", mentors: "34 Mentors", icon: Terminal },
  { name: "Backend (.NET, Go, Java, Node)", mentors: "45 Mentors", icon: ShieldCheck },
  { name: "AI / ML & Data Engineering", mentors: "22 Mentors", icon: Sparkles },
  { name: "Frontend & Fullstack Next.js", mentors: "30 Mentors", icon: Award },
  { name: "Mock Interview & CV Tuning", mentors: "38 Mentors", icon: Users },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#0B0C0E] pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Ambient Gradient Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[700px] rounded-full bg-gradient-to-b from-[#5E6AD2]/15 via-[#27C98F]/10 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-[#27C98F] animate-fade-in">
            <ShieldCheck className="h-4 w-4" />
            <span>Cơ Chế Bảo Chứng Escrow 100% • Next-Gen Mentorship</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F0F2F5] max-w-4xl mx-auto leading-[1.15]">
            Kết Nối 1-on-1 Với{" "}
            <span className="bg-gradient-to-r from-[#5E6AD2] via-[#818cf8] to-[#27C98F] bg-clip-text text-transparent">
              Tech Lead & Chuyên Gia
            </span>{" "}
            Thực Chiến
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#9BA1B0] max-w-2xl mx-auto leading-relaxed">
            Đặt lịch cố vấn chuyên sâu cùng các Senior, Staff & Principal Engineer từ các công ty công nghệ hàng đầu. Học phí được bảo chứng an toàn trong <strong className="text-[#E3E2E5]">Escrow Vault</strong> và chỉ giải ngân sau khi bạn đã nghiệm thu buổi học.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/mentors" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 h-12">
                Khám Phá Mentors Ngay
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/mentor/onboarding" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 text-base h-12">
                Đăng Ký Làm Mentor
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/[0.08]">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-[#9BA1B0]">
              <CheckCircle2 className="h-4 w-4 text-[#27C98F] flex-shrink-0" />
              <span>Chuyên gia KYC danh tính & kinh nghiệm</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-[#9BA1B0]">
              <Lock className="h-4 w-4 text-[#5E6AD2] flex-shrink-0" />
              <span>Khóa slot Redis thời gian thực (10 phút)</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-[#9BA1B0]">
              <Scale className="h-4 w-4 text-[#F5A623] flex-shrink-0" />
              <span>Hỗ trợ phân xử khiếu nại SLA 48h</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ── */}
      <section className="border-b border-white/[0.08] bg-[#14171D]/40 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14171D]">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F0F2F5]">99.4%</div>
              <div className="text-xs text-[#9BA1B0] mt-1 font-medium">Tỷ Lệ Mentee Hài Lòng</div>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14171D]">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#27C98F]">100%</div>
              <div className="text-xs text-[#9BA1B0] mt-1 font-medium">Bảo Chứng Ký Quỹ Escrow</div>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14171D]">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#5E6AD2]">&lt; 15m</div>
              <div className="text-xs text-[#9BA1B0] mt-1 font-medium">Tốc Độ Mentor Phản Hồi</div>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14171D]">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5A623]">24 Giờ</div>
              <div className="text-xs text-[#9BA1B0] mt-1 font-medium">Cửa Sổ Nghiệm Thu Bàn Giao</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED MENTORS ── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#5E6AD2] mb-2 flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Chuyên Gia Hàng Đầu
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F0F2F5] tracking-tight">
                Mentors Nổi Bật Được Đánh Giá Cao
              </h2>
              <p className="text-sm text-[#9BA1B0] mt-1">
                Các chuyên gia kỹ thuật dày dạn kinh nghiệm sẵn sàng đồng hành cùng bạn.
              </p>
            </div>
            <Link href="/mentors">
              <Button variant="outline" size="sm" className="gap-1.5">
                Xem tất cả 50+ Mentors
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_MENTORS.map((mentor) => (
              <Link key={mentor.id} href={`/mentors/${mentor.id}`}>
                <MentorCard
                  name={mentor.name}
                  role={mentor.role}
                  rating={mentor.rating}
                  reviewCount={mentor.reviews}
                  sessionCount={mentor.sessions}
                  verified={mentor.verified}
                  online={mentor.online}
                  services={mentor.services}
                  availableSlot={mentor.availableSlot}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW ESCROW PROTECTS YOU ── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08] bg-[#0F1115]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="escrow" className="mb-3">
              Quy Trình Minh Bạch 4 Bước
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F0F2F5] tracking-tight">
              Cơ Chế Bảo Chứng Escrow Hoạt Động Thế Nào?
            </h2>
            <p className="text-sm text-[#9BA1B0] mt-2">
              Khác với các hình thức chuyển khoản trực tiếp nhiều rủi ro, SkillBridge áp dụng mô hình bảo vệ dòng tiền 2 chiều giữa Mentee và Mentor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-white/[0.08] bg-[#14171D] p-6 relative">
              <div className="h-10 w-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 text-[#5E6AD2] flex items-center justify-center font-mono font-bold mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-[#F0F2F5] mb-2">Chọn Mentor & Gói Học</h3>
              <p className="text-xs text-[#9BA1B0] leading-relaxed">
                Khám phá dịch vụ đóng gói rõ ràng: Review CV, Mock Interview hoặc Lộ trình 1 tháng với giá niêm yết minh bạch.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#14171D] p-6 relative">
              <div className="h-10 w-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] flex items-center justify-center font-mono font-bold mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-[#F0F2F5] mb-2">Khóa Slot 10 Phút</h3>
              <p className="text-xs text-[#9BA1B0] leading-relaxed">
                Gửi trước câu hỏi qua Intake Form. Hệ thống dùng Redis khóa tạm thời slot học để chống trùng lịch trong khi bạn thanh toán.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#14171D] p-6 relative">
              <div className="h-10 w-10 rounded-lg bg-[#27C98F]/10 border border-[#27C98F]/30 text-[#27C98F] flex items-center justify-center font-mono font-bold mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-[#F0F2F5] mb-2">Ký Quỹ Escrow Vault</h3>
              <p className="text-xs text-[#9BA1B0] leading-relaxed">
                Học phí được tạm giữ an toàn trong tài khoản đảm bảo Escrow. Mentor chỉ nhận được tiền khi buổi học hoàn tất thỏa đáng.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#14171D] p-6 relative">
              <div className="h-10 w-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 text-[#5E6AD2] flex items-center justify-center font-mono font-bold mb-4">
                04
              </div>
              <h3 className="text-base font-semibold text-[#F0F2F5] mb-2">Học & Nghiệm Thu 24h</h3>
              <p className="text-xs text-[#9BA1B0] leading-relaxed">
                Tham gia phòng học trực tuyến, nhận tài liệu bàn giao. Bạn có 24 giờ để bấm duyệt giải ngân hoặc yêu cầu hoàn tiền nếu có sự cố.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. POPULAR DOMAINS ── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F0F2F5] tracking-tight">
              Lĩnh Vực Chuyên Môn Phổ Biến
            </h2>
            <p className="text-sm text-[#9BA1B0] mt-1.5">
              Chọn lĩnh vực bạn đang muốn nâng cấp để tìm mentor phù hợp nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_DOMAINS.map((domain) => {
              const IconComp = domain.icon;
              return (
                <Link key={domain.name} href={`/mentors?category=${encodeURIComponent(domain.name)}`}>
                  <Card hoverable className="p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F1115] border border-white/[0.08] text-[#5E6AD2] group-hover:border-[#5E6AD2]/40 transition-colors">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#F0F2F5] group-hover:text-[#5E6AD2] transition-colors">
                          {domain.name}
                        </div>
                        <div className="text-xs text-[#5D6474] font-mono mt-0.5">
                          {domain.mentors}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#5D6474] group-hover:text-[#F0F2F5] transition-colors" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. CALL TO ACTION ── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08] bg-gradient-to-b from-[#14171D] to-[#0B0C0E]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-white/[0.12] bg-[#14171D] p-8 sm:p-12 relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#5E6AD2]/20 blur-3xl" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F0F2F5] tracking-tight">
              Sẵn Sàng Nâng Tầm Sự Nghiệp Công Nghệ?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#9BA1B0] max-w-xl mx-auto">
              Nhận tư vấn trực tiếp từ các kỹ sư đầu ngành, giải quyết triệt để vấn đề kiến trúc và tự tin chinh phục các nấc thang nghề nghiệp mới.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/mentors" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                  Đặt Lịch 1-on-1 Ngay
                </Button>
              </Link>
              <Link href="/mentor/onboarding" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Trở Thành Chuyên Gia Cố Vấn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
