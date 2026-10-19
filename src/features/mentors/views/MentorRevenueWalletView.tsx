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

  const handleConfirmPayout = () => {
    setErrorMsg("");
    const res = actions.confirmPayout(payoutAmount, inputOtp);
    if (!res.ok) {
      setErrorMsg(res.error || "Xác thực OTP thất bại.");
    } else {
      setSuccessMsg(`Đã chuyển thành công ${vnd(payoutAmount)} về tài khoản ngân hàng của bạn qua Napas 24/7.`);
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
            <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
              Ví Doanh Thu &amp; Thù Lao Mentor
            </h1>
            <p className="text-xs text-[#9BA1B0] mt-1">
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
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#14171D] border border-white/[0.08] mb-8">
          <Banknote className="h-5 w-5 text-[#27C98F]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#F0F2F5]">
              Rút Thù Lao Về Tài Khoản Ngân Hàng
            </p>
            <p className="text-xs text-[#9BA1B0]">
              PayOS Payout 24/7 liên ngân hàng Napas — Xử lý tức thì trong 30 giây
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowPayout(true)}>
            <ArrowUpRight className="h-3.5 w-3.5" />
            Rút Tiền
          </Button>
        </div>

        {/* ── Ledger Table ── */}
        <div className="rounded-xl border border-white/[0.08] bg-[#14171D] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MÃ GD</TableHead>
                <TableHead>LOẠI</TableHead>
                <TableHead>CHI TIẾT BUỔI HỌC / GIAO DỊCH</TableHead>
                <TableHead className="text-right">SỐ TIỀN</TableHead>
                <TableHead>TRẠNG THÁI</TableHead>
                <TableHead className="text-right">THỜI GIAN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-[#5D6474]">
                    Chưa có giao dịch thù lao nào.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => {
                  const isPayout = tx.type === "Payout";
                  const isRelease = tx.type === "EscrowRelease";
                  const amountColor = isRelease
                    ? "text-[#27C98F]"
                    : isPayout
                      ? "text-[#9BA1B0]"
                      : "text-[#F5A623]";
                  const statusVariant = isRelease
                    ? "escrow"
                    : isPayout
                      ? "neutral"
                      : "pending";

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-[#5D6474]">
                        {tx.id}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{tx.type}</TableCell>
                      <TableCell className="text-xs max-w-[260px] truncate text-[#E3E2E5]">
                        {tx.note}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-medium ${amountColor}`}>
                        {isPayout ? "-" : "+"}{vnd(tx.amountVnd)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{tx.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-[#5D6474]">
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

            <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] p-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-1">
                Tài khoản thụ hưởng đã xác thực eKYC
              </p>
              <p className="text-sm font-medium text-[#F0F2F5]">
                MB Bank — 0987654321 — {session.user?.name.toUpperCase()}
              </p>
              <p className="text-xs text-[#27C98F] mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Tên tài khoản ngân hàng trùng khớp 100% với CCCD
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-[#E3E2E5]">
                  Số tiền rút (VND)
                </label>
                <span className="text-xs text-[#9BA1B0]">
                  Khả dụng: <span className="font-mono text-white">{vnd(session.wallet)}</span>
                </span>
              </div>
              <Input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
                className="font-mono text-lg"
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
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <NoticeBanner
                  variant="info"
                  message={`Mã OTP demo của bạn là: ${issuedOtp}`}
                />
                <div>
                  <label className="block text-xs font-medium text-[#E3E2E5] mb-1.5">
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
