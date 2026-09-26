import { Wallet, ShieldCheck, TrendingDown, Plus } from "lucide-react";
import { Badge, Button, Card, Currency } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/data-table";

const TX_ROWS = [
  { id: "TX-98124", type: "Escrow Hold", desc: "Mock Interview (.NET) - Nguyễn Văn An", amount: -450000, status: "Đang Ký Quỹ", statusColor: "pending" as const, time: "18/09 19:30" },
  { id: "TX-97500", type: "Deposit", desc: "Nạp tiền qua PayOS VietQR", amount: 1000000, status: "Thành Công", statusColor: "escrow" as const, time: "17/09 14:00" },
  { id: "TX-96100", type: "Escrow Released", desc: "Review CV (Lê Hoàng Nam)", amount: -300000, status: "Hoàn Tất", statusColor: "neutral" as const, time: "15/09 20:00" },
  { id: "TX-95800", type: "Deposit", desc: "Nạp tiền qua VNPAY", amount: 2000000, status: "Thành Công", statusColor: "escrow" as const, time: "12/09 10:30" },
];

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight mb-6">Ví Cá Nhân & Ký Quỹ Escrow</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#27C98F]/10 text-[#27C98F]">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">Số dư ví hiện tại</span>
          </div>
          <Currency amount={2500000} highlight="emerald" size="xl" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5A623]/10 text-[#F5A623]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">Tiền đang ký quỹ (Escrow)</span>
          </div>
          <Currency amount={450000} highlight="amber" size="xl" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F2022] text-[#9BA1B0]">
              <TrendingDown className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">Tổng đã chi tiêu</span>
          </div>
          <Currency amount={4800000} size="xl" />
        </Card>
      </div>

      {/* Top-up */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
        <p className="text-xs text-[#9BA1B0]">Nạp tiền qua PayOS VietQR hoặc VNPAY</p>
        <Button variant="primary" size="sm">
          <Plus className="h-3.5 w-3.5" />
          Nạp Tiền Vào Ví
        </Button>
      </div>

      {/* Transaction Ledger */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã GD</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Dịch vụ / Mentor</TableHead>
            <TableHead className="text-right">Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TX_ROWS.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs text-[#5E6AD2]">{tx.id}</TableCell>
              <TableCell className="text-xs">{tx.type}</TableCell>
              <TableCell className="text-xs max-w-[200px] truncate">{tx.desc}</TableCell>
              <TableCell className="text-right">
                <Currency
                  amount={Math.abs(tx.amount)}
                  highlight={tx.amount > 0 ? "emerald" : "default"}
                  size="sm"
                />
                {tx.amount > 0 && <span className="text-[10px] text-[#27C98F] ml-1">+</span>}
                {tx.amount < 0 && <span className="text-[10px] text-[#9BA1B0] ml-1">−</span>}
              </TableCell>
              <TableCell>
                <Badge variant={tx.statusColor}>{tx.status}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-[#5D6474]">{tx.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
