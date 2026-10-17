"use client";

import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Modal,
  Input,
  NoticeBanner,
} from "@/components/ui";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import { RequireRole } from "@/components/auth/require-role";
import { WalletTransactionTable } from "../components/WalletTransactionTable";
import { useAppState, useSession, actions, menteeEscrowSummary } from "@/lib/store";
import { vnd, slotDateLabel } from "@/lib/domain";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Clock } from "lucide-react";

export function WalletDashboardView() {
  const state = useAppState();
  const session = useSession();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1_000_000);
  const [depositGateway, setDepositGateway] = useState<"PayOS" | "VNPAY">("PayOS");
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const userId = session.user?.id || "";
  const summary = useMemo(() => menteeEscrowSummary(state, userId), [state, userId]);

  const ledgerEntries = useMemo(() => {
    return state.ledger
      .filter((e) => e.menteeId === userId)
      .filter((e) => {
        if (filterType === "all") return true;
        if (filterType === "deposit") return e.type === "Deposit";
        if (filterType === "escrow") return e.type.includes("Escrow");
        return true;
      })
      .sort((a, b) => b.ts - a.ts);
  }, [state.ledger, userId, filterType]);

  const handleDeposit = () => {
    if (depositAmount <= 0) return;
    const res = actions.deposit(depositAmount, depositGateway);
    if (res.ok) {
      setDepositSuccess(true);
      setTimeout(() => {
        setDepositSuccess(false);
        setDepositModalOpen(false);
      }, 1200);
    }
  };

  return (
    <RequireRole role="mentee" title="Ví Cá Nhân &amp; Escrow" description="Đăng nhập để xem số dư và lịch sử giao dịch ký quỹ.">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
              Ví Cá Nhân &amp; Lịch Sử Ký Quỹ
            </h1>
            <p className="text-xs text-[#9BA1B0] mt-1">
              Quản lý số dư, tiền nạp và theo dõi các khoản bảo chứng học phí 100% qua Smart Escrow
            </p>
          </div>
          <Button variant="primary" onClick={() => setDepositModalOpen(true)}>
            <ArrowDownToLine className="h-4 w-4" />
            Nạp Tiền Vào Ví
          </Button>
        </div>

        {/* ── Top Metrics ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Số dư ví khả dụng"
            value={vnd(session.wallet)}
            icon={<Wallet className="h-4 w-4" />}
            variant="emerald"
            sublabel="Có thể dùng đặt lịch tức thì"
          />
          <StatCard
            label="Tiền đang ký quỹ (Escrow Locked)"
            value={vnd(summary.holding)}
            icon={<ShieldCheck className="h-4 w-4" />}
            variant="amber"
            sublabel="Đang giữ an toàn trong Vault"
          />
          <StatCard
            label="Tổng tiền đã chi tiêu"
            value={vnd(summary.spent)}
            icon={<ArrowUpFromLine className="h-4 w-4" />}
            variant="default"
            sublabel="Đã hoàn tất nghiệm thu"
          />
        </div>

        {/* ── Transaction Ledger Table ── */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-semibold text-[#F0F2F5] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#5E6AD2]" />
              Sổ Cái Giao Dịch ({ledgerEntries.length})
            </h2>

            {/* Filter pills */}
            <div className="flex gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filterType === "all"
                    ? "bg-[#1F2022] text-[#F0F2F5] border-white/[0.14]"
                    : "bg-[#0D0E10] text-[#9BA1B0] border-white/[0.06]"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilterType("deposit")}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filterType === "deposit"
                    ? "bg-[#1F2022] text-[#F0F2F5] border-white/[0.14]"
                    : "bg-[#0D0E10] text-[#9BA1B0] border-white/[0.06]"
                }`}
              >
                Nạp tiền
              </button>
              <button
                type="button"
                onClick={() => setFilterType("escrow")}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  filterType === "escrow"
                    ? "bg-[#1F2022] text-[#F0F2F5] border-white/[0.14]"
                    : "bg-[#0D0E10] text-[#9BA1B0] border-white/[0.06]"
                }`}
              >
                Escrow
              </button>
            </div>
          </div>

          <WalletTransactionTable entries={ledgerEntries} />
        </section>

        {/* Deposit Modal */}
        <Modal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          title="Nạp Tiền Vào Ví Escrow"
        >
          <div className="space-y-4 py-2">
            {depositSuccess ? (
              <NoticeBanner
                variant="success"
                message={`Đã nạp thành công ${vnd(depositAmount)} vào ví SkillBridge!`}
              />
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#9BA1B0] mb-2">
                    Chọn nhanh số tiền nạp:
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[500_000, 1_000_000, 2_000_000, 5_000_000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`rounded-lg py-2 text-xs font-mono font-medium border transition-colors ${
                          depositAmount === amt
                            ? "bg-[#5E6AD2]/20 border-[#5E6AD2] text-white"
                            : "bg-[#0D0E10] border-white/[0.08] text-[#9BA1B0] hover:text-white"
                        }`}
                      >
                        {vnd(amt)}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9BA1B0] mb-2">
                    Cổng thanh toán demo:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositGateway("PayOS")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-colors ${
                        depositGateway === "PayOS"
                          ? "bg-[#27C98F]/15 border-[#27C98F] text-[#27C98F]"
                          : "bg-[#0D0E10] border-white/[0.08] text-[#9BA1B0]"
                      }`}
                    >
                      PayOS VietQR
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositGateway("VNPAY")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-colors ${
                        depositGateway === "VNPAY"
                          ? "bg-[#5E6AD2]/15 border-[#5E6AD2] text-[#7C87ED]"
                          : "bg-[#0D0E10] border-white/[0.08] text-[#9BA1B0]"
                      }`}
                    >
                      VNPAY Sandbox
                    </button>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleDeposit}
                >
                  Xác Nhận Nạp {vnd(depositAmount)}
                </Button>
              </>
            )}
          </div>
        </Modal>
      </div>
    </RequireRole>
  );
}

export { WalletDashboardView as default };
