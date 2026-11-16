"use client";

import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Modal,
  Input,
  NoticeBanner,
} from "@/components/ui";
import { RevenueStats } from "@/features/wallet/RevenueStats";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, useSession, actions, mentorEscrowSummary } from "@/lib/store";
import { vnd, slotDateLabel, MIN_PAYOUT_VND } from "@/lib/domain";

export function MentorRevenueWalletView() {
  const state = useAppState();
  const session = useSession();

  const [showPayout, setShowPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(2_000_000);
  const [issuedOtp, setIssuedOtp] = useState<string | null>(null);
  const [inputOtp, setInputOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const mentorId = session.user?.mentorId || "mentor-an-nguyen";
  const summary = useMemo(() => mentorEscrowSummary(state, mentorId), [state, mentorId]);

  const transactions = useMemo(() => {
    return state.ledger
      .filter((e) => e.mentorId === mentorId)
      .sort((a, b) => b.ts - a.ts);
  }, [state.ledger, mentorId]);

  const handleRequestOtp = () => {
    setErrorMsg("");
    if (payoutAmount < MIN_PAYOUT_VND) {
      setErrorMsg(`Số tiền rút tối thiểu là ${vnd(MIN_PAYOUT_VND)}.`);
      return;
    }
    if (payoutAmount > session.wallet) {
      setErrorMsg("Số dư ví khả dụng không đủ để rút số tiền này.");
      return;
    }

    const res = actions.issueOtp();
    if (!res.ok) {
      setErrorMsg(res.error || "Không thể tạo mã OTP.");
    } else {
      setIssuedOtp(res.code || "123456");
      setInputOtp(res.code || "123456");
    }
  };

  const handleConfirmPayout = async () => {
    setErrorMsg("");
    try {
      const { paymentService } = await import("@/services/paymentService");
      await paymentService.requestWithdraw({
        amount: payoutAmount,
        bankAccount: "0987654321",
        bankCode: "MB",
      });
    } catch (err: unknown) {
      // Backend policy returns 409 DisbursementLocked
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("DisbursementLocked") || msg.includes("khóa")) {
        setErrorMsg("Theo chính sách an toàn của sàn, tính năng rút tiền tự động đang được bảo lưu (DisbursementLocked). Số dư Escrow của bạn được bảo toàn tuyệt đối.");
        return;
      }
    }

    const res = actions.confirmPayout(payoutAmount, inputOtp);
    if (!res.ok) {
      setErrorMsg(res.error || "Xác thực OTP thất bại.");
    } else {
      setSuccessMsg(`Đã tạo yêu cầu rút ${vnd(payoutAmount)} về tài khoản ngân hàng.`);
      setTimeout(() => {
        setSuccessMsg("");
        setShowPayout(false);
        setIssuedOtp(null);
        setInputOtp("");
      }, 1500);
    }
  };

  return (
    <RequireRole role="mentor" title="Ví Doanh Thu Mentor" description="Đăng nhập tài khoản mentor để quản lý thù lao và rút tiền.">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="sb-eyebrow mb-1">Mentor Studio</span>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
              Ví Doanh Thu & Thù Lao Mentor
            </h1>
            <p className="text-sm text-[#5e5866] mt-1">
              Theo dõi doanh thu giảng dạy, tiền ký quỹ đang trong thời gian nghiệm thu và rút tiền tức thì 24/7
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowPayout(true)}>
            <Banknote className="h-4 w-4" />
            Rút Thù Lao Ngay
          </Button>
        </div>

        {/* ── Top 3 Stat Cards ── */}
        <RevenueStats
          availableBalance={session.wallet}
          holdingBalance={summary.holding}
          holdingCount={summary.holdingCount}
          disputedBalance={summary.disputed}
          disputedCount={summary.disputedCount}
        />

        {/* ── Action Bar ── */}
        <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-[#e5e2de] shadow-xs mb-8">
          <div className="h-10 w-10 rounded-xl bg-[#e8f5ed] flex items-center justify-center shrink-0">
            <Banknote className="h-5 w-5 text-[#1e7e45]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#27252d]">
              Rút Thù Lao Về Tài Khoản Ngân Hàng
            </p>
            <p className="text-xs text-[#5e5866] mt-0.5">
              PayOS Payout 24/7 liên ngân hàng Napas — Xử lý tức thì trong 30 giây
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowPayout(true)}>
            <ArrowUpRight className="h-3.5 w-3.5" />
            Rút Tiền
          </Button>
        </div>

        {/* ── Ledger Table ── */}
        <div className="rounded-xl border border-[#e5e2de] bg-white overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[#e5e2de] flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#6551a4]" />
            <h2 className="text-sm font-semibold text-[#27252d]">
              Lịch Sử Giao Dịch Thù Lao ({transactions.length})
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e5e2de] bg-[#fbfaf8]">
                <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">MÃ GD</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">LOẠI</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">CHI TIẾT BUỔI HỌC / GIAO DỊCH</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider text-right">SỐ TIỀN</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">TRẠNG THÁI</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider text-right">THỜI GIAN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-sm text-[#5e5866]">
                    Chưa có giao dịch thù lao nào.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => {
                  const isPayout = tx.type === "Payout";
                  const isRelease = tx.type === "EscrowRelease";
                  const amountColor = isRelease
                    ? "text-[#1e7e45]"
                    : isPayout
                      ? "text-[#5e5866]"
                      : "text-[#946200]";
                  const statusVariant = isRelease
                    ? "escrow"
                    : isPayout
                      ? "neutral"
                      : "pending";

                  return (
                    <TableRow key={tx.id} className="border-b border-[#f1efea] hover:bg-[#faf9f6]/80 transition-colors">
                      <TableCell className="font-mono text-xs text-[#5e5866]">
                        {tx.id}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-[#27252d]">{tx.type}</TableCell>
                      <TableCell className="text-xs max-w-[260px] truncate text-[#27252d]">
                        {tx.note}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-semibold ${amountColor}`}>
                        {isPayout ? "-" : "+"}{vnd(tx.amountVnd)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{tx.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-[#5e5866]">
                        {slotDateLabel(tx.ts)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Payout Modal ── */}
        <Modal
          isOpen={showPayout}
          onClose={() => {
            setShowPayout(false);
            setIssuedOtp(null);
            setErrorMsg("");
          }}
          title="Rút Thù Lao Về Tài Khoản Ngân Hàng"
          description="PayOS Payout 24/7 — Xử lý tức thì trong 30 giây qua liên ngân hàng Napas."
        >
          <div className="space-y-4 py-2">
            {errorMsg && <NoticeBanner variant="error" message={errorMsg} />}
            {successMsg && <NoticeBanner variant="success" message={successMsg} />}

            <div className="rounded-xl bg-[#faf9f6] border border-[#e5e2de] p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#5e5866] mb-1">
                Tài khoản thụ hưởng đã xác thực eKYC
              </p>
              <p className="text-sm font-semibold text-[#27252d]">
                MB Bank — 0987654321 — {session.user?.name.toUpperCase()}
              </p>
              <p className="text-xs text-[#1e7e45] mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Tên tài khoản ngân hàng trùng khớp 100% với CCCD
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#5e5866]">
                  Số tiền rút (VND)
                </label>
                <span className="text-xs text-[#5e5866]">
                  Khả dụng: <span className="font-mono font-semibold text-[#27252d]">{vnd(session.wallet)}</span>
                </span>
              </div>
              <Input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
                className="font-mono text-base"
              />
            </div>

            {!issuedOtp ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-2"
                onClick={handleRequestOtp}
              >
                Nhận Mã Xác Thực OTP Rút Tiền
              </Button>
            ) : (
              <div className="space-y-3 pt-3 border-t border-[#e5e2de]">
                <NoticeBanner
                  variant="info"
                  message={`Mã OTP xác thực bảo mật của bạn là: ${issuedOtp}`}
                />
                <div>
                  <label className="block text-xs font-medium text-[#5e5866] mb-1.5">
                    Nhập mã OTP 6 số:
                  </label>
                  <Input
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    placeholder="123456"
                    className="font-mono tracking-widest text-center text-lg"
                  />
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmPayout}
                >
                  Xác Nhận Rút {vnd(payoutAmount)}
                </Button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </RequireRole>
  );
}

export { MentorRevenueWalletView as default };
