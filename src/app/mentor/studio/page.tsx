"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Input,
} from "@/components/ui";
import { Select } from "@/components/ui/select";
import { Package, Plus, X, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

interface Deliverable {
  id: string;
  label: string;
}

interface ServiceTier {
  tier: 1 | 2 | 3;
  tierLabel: string;
  name: string;
  duration: string;
  price: string;
  featured: boolean;
  deliverables: Deliverable[];
}

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const DURATION_OPTIONS = [
  { value: "30", label: "30 phút" },
  { value: "45", label: "45 phút" },
  { value: "60", label: "60 phút" },
  { value: "90", label: "90 phút" },
  { value: "1month", label: "1 Tháng (4 Buổi)" },
];

const INITIAL_TIERS: ServiceTier[] = [
  {
    tier: 1,
    tierLabel: "Tier 1 — Quick Win",
    name: "Review CV & Tối Ưu Portfolio",
    duration: "45",
    price: "300.000",
    featured: false,
    deliverables: [
      { id: "d1-1", label: "1-on-1 Deep Dive 45 phút" },
      { id: "d1-2", label: "Notion Checklist sửa từng dòng" },
      { id: "d1-3", label: "Template Senior Markdown" },
    ],
  },
  {
    tier: 2,
    tierLabel: "Tier 2 — High Impact",
    name: "Mock Interview System Design & .NET",
    duration: "60",
    price: "450.000",
    featured: true,
    deliverables: [
      { id: "d2-1", label: "Mô phỏng phỏng vấn FAANG 60 phút" },
      { id: "d2-2", label: "Rubric 10 tiêu chí chấm điểm PDF" },
      { id: "d2-3", label: "Video ghi hình toàn bộ buổi học" },
      { id: "d2-4", label: "Bản thiết kế kiến trúc mẫu" },
    ],
  },
  {
    tier: 3,
    tierLabel: "Tier 3 — Transformation",
    name: "Lộ Trình Software Architect",
    duration: "1month",
    price: "2.000.000",
    featured: false,
    deliverables: [
      { id: "d3-1", label: "4 buổi 1-on-1 hàng tuần" },
      { id: "d3-2", label: "Review PR GitHub thực tế" },
      { id: "d3-3", label: "Telegram Async Q&A 24/7" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function StudioPage() {
  const [tiers, setTiers] = useState(INITIAL_TIERS);

  const updateTier = (index: number, updates: Partial<ServiceTier>) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...updates } : t))
    );
  };

  const addDeliverable = (tierIndex: number) => {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? {
              ...t,
              deliverables: [
                ...t.deliverables,
                { id: `d${Date.now()}`, label: "" },
              ],
            }
          : t
      )
    );
  };

  const removeDeliverable = (tierIndex: number, delId: string) => {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? { ...t, deliverables: t.deliverables.filter((d) => d.id !== delId) }
          : t
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-1">
        <Package className="h-5 w-5 text-[#5E6AD2]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Studio Đóng Gói Dịch Vụ — Thiết lập 3 Gói Cố Định
        </h1>
      </div>
      <p className="text-sm text-[#9BA1B0] mb-8">
        Thay vì tính tiền theo giờ mơ hồ, hãy định nghĩa rõ cam kết đầu ra cho
        học viên.
      </p>

      {/* ── 3 Service Editor Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        {tiers.map((tier, idx) => (
          <div
            key={tier.tier}
            className={`rounded-xl border p-5 ${
              tier.featured
                ? "bg-[#14171D] border-[#5E6AD2]/40 ring-1 ring-[#5E6AD2]/20"
                : "bg-[#14171D] border-white/[0.08]"
            }`}
          >
            {/* Tier label */}
            <div className="flex items-center justify-between mb-4">
              <Badge variant={tier.featured ? "brand" : "neutral"}>
                {tier.tierLabel}
              </Badge>
              {tier.tier === 2 && (
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#5E6AD2]" />
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <span className="text-[10px] text-[#9BA1B0]">
                      Top Pick
                    </span>
                    <div
                      className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${
                        tier.featured ? "bg-[#5E6AD2]" : "bg-[#1F2022]"
                      }`}
                      onClick={() =>
                        updateTier(idx, { featured: !tier.featured })
                      }
                    >
                      <div
                        className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          tier.featured ? "translate-x-3.5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-xs text-[#5D6474] mb-1">
                Tên gói
              </label>
              <Input
                value={tier.name}
                onChange={(e) => updateTier(idx, { name: e.target.value })}
              />
            </div>

            {/* Duration + Price */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Select
                label="Thời lượng"
                options={DURATION_OPTIONS}
                value={tier.duration}
                onChange={(v) => updateTier(idx, { duration: v })}
              />
              <div>
                <label className="block text-xs text-[#5D6474] mb-1">
                  Giá (₫)
                </label>
                <Input
                  value={tier.price}
                  onChange={(e) => updateTier(idx, { price: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-2">
                Cam kết đầu ra
              </label>
              <div className="space-y-2">
                {tier.deliverables.map((del) => (
                  <div key={del.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#27C98F] flex-shrink-0" />
                    <Input
                      value={del.label}
                      onChange={(e) => {
                        setTiers((prev) =>
                          prev.map((t, i) =>
                            i === idx
                              ? {
                                  ...t,
                                  deliverables: t.deliverables.map((d) =>
                                    d.id === del.id
                                      ? { ...d, label: e.target.value }
                                      : d
                                  ),
                                }
                              : t
                          )
                        );
                      }}
                      className="flex-1 h-8 text-xs"
                    />
                    <button
                      onClick={() => removeDeliverable(idx, del.id)}
                      className="text-[#5D6474] hover:text-[#FF5C5C] transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addDeliverable(idx)}
                className="flex items-center gap-1.5 mt-2 text-xs text-[#5E6AD2] hover:text-[#BDC2FF] transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Thêm cam kết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Save ── */}
      <div className="flex justify-end">
        <Button variant="primary" size="lg">
          Lưu &amp; Xuất Bản 3 Gói Dịch Vụ
        </Button>
      </div>
    </div>
  );
}
