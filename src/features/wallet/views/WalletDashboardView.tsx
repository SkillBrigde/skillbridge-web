"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  NoticeBanner,
} from "@/components/ui";
import { StatCard } from "@/components/ui/stat-card";
import { RequireRole } from "@/components/auth/require-role";
import { WalletTransactionTable } from "../components/WalletTransactionTable";
import { useAppState, useSession, actions, menteeEscrowSummary } from "@/lib/store";
import { vnd } from "@/lib/domain";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Clock } from "lucide-react";

export function WalletDashboardView() {
  const state = useAppState();
  const session = useSession();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1_000_000);
  const [depositGateway, setDepositGateway] = useState<"PayOS" | "VNPAY">("PayOS");
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [walletInfo, setWalletInfo] = useState<{ availableBalance: number; heldBalance: number } | null>(null);

  useEffect(() => {
    import("@/services/paymentService").then(({ paymentService }) => {
      paymentService.getWallet().then(setWalletInfo).catch(() => null);
    });
  }, []);

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
    <RequireRole role="mentee" title="Ví Cá Nhân & Ký Quỹ" description="Đăng nhập để xem số dư và lịch sử giao dịch ký quỹ.">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="sb-eyebrow mb-1">Fintech & Escrow</span>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
              Ví Cá Nhân & Lịch Sử Ký Quỹ
            </h1>
            <p className="text-sm text-[#5e5866] mt-1">
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
            value={vnd(walletInfo?.availableBalance ?? session.wallet)}
            icon={<Wallet className="h-4 w-4" />}
            variant="emerald"
            sublabel="Có thể dùng đặt lịch tức thì"
          />
          <StatCard
            label="Tiền đang ký quỹ (Escrow Locked)"
            value={vnd(walletInfo?.heldBalance ?? summary.holding)}
            icon={<ShieldCheck className="h-4 w-4" />}
            variant="amber"
            sublabel="Đang giữ an toàn trong Smart Vault"
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
            <h2 className="text-base font-semibold text-[#27252d] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#6551a4]" />
              Sổ Cái Giao Dịch ({ledgerEntries.length})
            </h2>

            {/* Filter pills */}
            <div className="flex gap-1.5 text-xs bg-[#f1efea] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === "all"
                    ? "bg-white text-[#27252d] shadow-xs"
                    : "text-[#5e5866] hover:text-[#27252d]"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilterType("deposit")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === "deposit"
                    ? "bg-white text-[#27252d] shadow-xs"
                    : "text-[#5e5866] hover:text-[#27252d]"
                }`}
              >
                Nạp tiền
              </button>
              <button
                type="button"
                onClick={() => setFilterType("escrow")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === "escrow"
                    ? "bg-white text-[#27252d] shadow-xs"
                    : "text-[#5e5866] hover:text-[#27252d]"
                }`}
              >
                Ký quỹ (Escrow)
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
          description="Nạp tiền tức thì để thanh toán dịch vụ cố vấn mà không cần nhập lại thẻ."
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
                  <label className="block text-xs font-medium text-[#5e5866] mb-2">
                    Chọn nhanh số tiền nạp:
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[500_000, 1_000_000, 2_000_000, 5_000_000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`rounded-xl py-2 px-1 text-xs font-mono font-medium border transition-all ${
                          depositAmount === amt
                            ? "bg-[#ece5f5] border-[#6551a4] text-[#6551a4] shadow-xs"
                            : "bg-[#faf9f6] border-[#e5e2de] text-[#5e5866] hover:border-[#6551a4]/40 hover:text-[#27252d]"
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
                  <label className="block text-xs font-medium text-[#5e5866] mb-2">
                    Phương thức nạp tiền:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositGateway("PayOS")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                        depositGateway === "PayOS"
                          ? "bg-[#e8f5ed] border-[#1e7e45] text-[#1e7e45] shadow-xs font-semibold"
                          : "bg-white border-[#e5e2de] text-[#5e5866] hover:border-[#27252d]/20"
                      }`}
                    >
                      PayOS VietQR 24/7
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositGateway("VNPAY")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                        depositGateway === "VNPAY"
                          ? "bg-[#ece5f5] border-[#6551a4] text-[#6551a4] shadow-xs font-semibold"
                          : "bg-white border-[#e5e2de] text-[#5e5866] hover:border-[#27252d]/20"
                      }`}
                    >
                      VNPAY Cổng Quốc Nội
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
