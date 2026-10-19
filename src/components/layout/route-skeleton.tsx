import React from "react";
import Link from "next/link";
import { ArrowLeft, Layers, Terminal } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

interface RouteSkeletonProps {
  screenId: string;
  screenTitle: string;
  module: string;
  actor: "Mentee" | "Mentor" | "Super Admin" | "All Actors";
  description: string;
  features: string[];
  children?: React.ReactNode;
}

export function RouteSkeleton({
  screenId,
  screenTitle,
  module,
  actor,
  description,
  features,
  children,
}: RouteSkeletonProps) {
  const actorBadgeVariant = {
    Mentee: "brand",
    Mentor: "escrow",
    "Super Admin": "dispute",
    "All Actors": "neutral",
  } as const;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb Ribbon */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Về Danh Mục 24 Màn Hình</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={actorBadgeVariant[actor]}>{actor}</Badge>
          <Badge variant="neutral">{screenId}</Badge>
        </div>
      </div>

      {/* Screen Overview Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5E6AD2] mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span>MODULE: {module.toUpperCase()}</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl">{screenTitle}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9BA1B0] flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-[#27C98F]" />
              Quy Chuẩn Kỹ Thuật (Stitch Design Specification):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg bg-[#0F1115] border border-white/[0.04] p-3 text-xs text-[#E3E2E5]"
                >
                  <span className="text-[#27C98F] font-mono">0{idx + 1}.</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Content / Interactive Slot */}
      {children}
    </div>
  );
}
