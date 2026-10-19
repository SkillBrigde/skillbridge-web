"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Input,
  NoticeBanner,
} from "@/components/ui";
import { Select } from "@/components/ui/select";
import { Package, Plus, X, Sparkles } from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { useSession, actions } from "@/lib/store";
import { vnd, type MentorRec } from "@/lib/domain";
import type { MentorServiceTier } from "@/types";

const DURATION_OPTIONS = [
  { value: "30 phút", label: "30 phút" },
  { value: "45 phút", label: "45 phút" },
  { value: "60 phút", label: "60 phút" },
  { value: "90 phút", label: "90 phút" },
  { value: "1 Tháng (4 Buổi)", label: "1 Tháng (4 Buổi)" },
];

export function MentorStudioDashboardView() {
  const { mentor } = useSession();
  return <MentorStudioDashboardContent key={mentor?.id || "guest"} mentor={mentor} />;
}

function MentorStudioDashboardContent({ mentor }: { mentor: MentorRec | null }) {
  const [services, setServices] = useState<MentorServiceTier[]>(mentor?.services || []);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const updateService = (index: number, updates: Partial<MentorServiceTier>) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  };

  const addDeliverable = (serviceIndex: number) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === serviceIndex
          ? {
            ...s,
            deliverables: [...s.deliverables, "Bàn giao mới..."],
          }
          : s
      )
    );
  };

  const updateDeliverable = (serviceIndex: number, delIndex: number, text: string) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === serviceIndex
          ? {
            ...s,
            deliverables: s.deliverables.map((d, di) => (di === delIndex ? text : d)),
          }
          : s
      )
    );
  };

  const removeDeliverable = (serviceIndex: number, delIndex: number) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === serviceIndex
          ? {
            ...s,
            deliverables: s.deliverables.filter((_, di) => di !== delIndex),
          }
          : s
      )
    );
  };

  const handleSave = () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!mentor) {
      setErrorMsg("Không tìm thấy hồ sơ mentor.");
      return;
    }

    // Validation
    for (const s of services) {
      if (!s.name.trim()) {
        setErrorMsg("Tên gói dịch vụ không được để trống.");
        return;
      }
      if (s.priceVnd <= 0) {
        setErrorMsg("Giá gói dịch vụ phải lớn hơn 0 ₫.");
        return;
      }
      if (s.deliverables.length === 0) {
        setErrorMsg(`Gói "${s.name}" cần có ít nhất 1 cam kết đầu ra (deliverable).`);
        return;
      }
    }

    setSaving(true);
    const res = actions.saveServices(services, true);
    setSaving(false);

    if (!res.ok) {
      setErrorMsg(res.error || "Lưu gói dịch vụ thất bại.");
    } else {
      setSuccessMsg("Đã lưu và cập nhật 3 gói dịch vụ thành công!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <RequireRole role="mentor" title="Studio Gói Dịch Vụ" description="Đăng nhập tài khoản mentor để cấu hình các gói dịch vụ đóng gói.">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Package className="h-5 w-5 text-[#5E6AD2]" />
              <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
                Studio Đóng Gói Dịch Vụ — Thiết Lập 3 Gói Cố Định
              </h1>
            </div>
            <p className="text-sm text-[#9BA1B0]">
              Thay vì tính tiền theo giờ mơ hồ, hãy định nghĩa rõ cam kết đầu ra (deliverables) minh bạch cho học viên.
            </p>
          </div>

          <Button variant="primary" disabled={saving} onClick={handleSave}>
            Lưu Thay Đổi Gói
          </Button>
        </div>

        {errorMsg && <div className="mb-6"><NoticeBanner variant="error" message={errorMsg} /></div>}
        {successMsg && (
          <div className="mb-6">
            <NoticeBanner variant="success" message={successMsg} />
          </div>
        )}

        {/* ── 3 Service Editor Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className={`rounded-xl border p-5 flex flex-col justify-between ${service.isFeatured
                ? "bg-[#14171D] border-[#5E6AD2]/40 ring-1 ring-[#5E6AD2]/20"
                : "bg-[#14171D] border-white/[0.08]"
                }`}
            >
              <div>
                {/* Tier label */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={service.isFeatured ? "brand" : "neutral"}>
                    Tier {service.tierNumber} • {service.category}
                  </Badge>
                  {service.tierNumber === 2 && (
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-[#5E6AD2]" />
                      <span className="text-[10px] text-[#7C87ED] font-mono">
                        TOP PICK
                      </span>
                    </div>
                  )}
                </div>

                {/* Package name */}
                <div className="mb-4">
                  <label className="block text-xs text-[#9BA1B0] mb-1 font-medium">
                    Tên gói dịch vụ
                  </label>
                  <Input
                    value={service.name}
                    onChange={(e) => updateService(idx, { name: e.target.value })}
                  />
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <Select
                    label="Thời lượng buổi học"
                    options={DURATION_OPTIONS}
                    value={service.durationLabel}
                    onChange={(val) => {
                      const mins = val.includes("30")
                        ? 30
                        : val.includes("45")
                          ? 45
                          : val.includes("60")
                            ? 60
                            : val.includes("90")
                              ? 90
                              : 240;
                      updateService(idx, {
                        durationLabel: val,
                        durationMinutes: mins,
                        totalSessions: val.includes("Tháng") ? 4 : 1,
                      });
                    }}
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-xs text-[#9BA1B0] mb-1 font-medium">
                    Giá dịch vụ (VND)
                  </label>
                  <Input
                    type="number"
                    value={service.priceVnd}
                    onChange={(e) =>
                      updateService(idx, { priceVnd: Number(e.target.value) })
                    }
                    className="font-mono"
                  />
                  <span className="text-[11px] text-[#27C98F] font-mono mt-1 block">
                    Hiển thị: {vnd(service.priceVnd)}
                  </span>
                </div>

                {/* Deliverables list */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-[#9BA1B0] font-medium">
                      Cam kết đầu ra ({service.deliverables.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => addDeliverable(idx)}
                      className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] flex items-center gap-1 transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Thêm cam kết
                    </button>
                  </div>

                  <div className="space-y-2">
                    {service.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-1.5">
                        <Input
                          value={del}
                          onChange={(e) => updateDeliverable(idx, dIdx, e.target.value)}
                          className="text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeDeliverable(idx, dIdx)}
                          className="p-1.5 text-[#5D6474] hover:text-[#FF5C5C] transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom preview */}
              <div className="pt-4 border-t border-white/[0.06] text-xs text-[#5D6474]">
                Học phí giải phóng qua Escrow từng buổi học
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireRole>
  );
}

export { MentorStudioDashboardView as default };
