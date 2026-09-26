"use client";

import React from "react";
import { Zap, Crown, Rocket, Plus, X, Save, Check } from "lucide-react";
import { Badge, Button, Card, Input, Currency } from "@/components/ui";

const TIERS_INIT = [
  {
    tier: 1, icon: Zap, label: "Tier 1 — Quick Win", name: "Review CV & Tối Ưu Portfolio", duration: "45 phút", price: "300000", featured: false,
    deliverables: ["1-on-1 Deep Dive 45m", "Notion Checklist sửa từng dòng", "Template Senior Markdown"],
  },
  {
    tier: 2, icon: Crown, label: "Tier 2 — High Impact", name: "Mock Interview System Design & .NET", duration: "60 phút", price: "450000", featured: true,
    deliverables: ["Mô phỏng FAANG 60m", "Rubric 10 tiêu chí PDF", "Video ghi hình", "Bản thiết kế mẫu"],
  },
  {
    tier: 3, icon: Rocket, label: "Tier 3 — Transformation", name: "Lộ Trình Software Architect", duration: "1 Tháng (4 Buổi)", price: "2000000", featured: false,
    deliverables: ["4 buổi 1-on-1 hàng tuần", "Review PR GitHub", "Telegram Q&A"],
  },
];

export default function StudioPage() {
  const [tiers] = React.useState(TIERS_INIT);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight mb-1">
        Studio Đóng Gói Dịch Vụ — Thiết lập 3 Gói Cố Định
      </h1>
      <p className="text-xs text-[#9BA1B0] mb-6">
        Thay vì tính tiền theo giờ mơ hồ, hãy định nghĩa rõ cam kết đầu ra cho học viên.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {tiers.map((t) => {
          const IconComp = t.icon;
          return (
            <Card key={t.tier} className={`p-5 ${t.featured ? "ring-1 ring-[#5E6AD2]/30" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${t.featured ? "bg-[#5E6AD2]/15 text-[#BDC2FF]" : "bg-[#1F2022] text-[#9BA1B0]"}`}>
                    <IconComp className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">{t.label}</span>
                </div>
                {t.featured && <Badge variant="brand">Top Pick</Badge>}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5D6474]">Tên gói</label>
                  <Input defaultValue={t.name} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#5D6474]">Thời lượng</label>
                    <Input defaultValue={t.duration} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#5D6474]">Giá (₫)</label>
                    <Input defaultValue={t.price} className="font-mono" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#5D6474]">Cam kết đầu ra</label>
                  {t.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-[#27C98F] flex-shrink-0" />
                      <Input defaultValue={d} className="h-8 text-xs" />
                      <button type="button" className="text-[#5D6474] hover:text-[#FF5C5C] cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <button type="button" className="flex items-center gap-1 text-[11px] text-[#5E6AD2] hover:text-[#BDC2FF] cursor-pointer mt-1">
                    <Plus className="h-3 w-3" /> Thêm cam kết
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button variant="primary" size="lg" className="w-full">
        <Save className="h-4 w-4" />
        Lưu & Xuất Bản 3 Gói Dịch Vụ
      </Button>
    </div>
  );
}
