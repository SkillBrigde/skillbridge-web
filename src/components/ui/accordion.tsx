"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple panels open at once */
  multiple?: boolean;
  /** IDs of initially expanded items */
  defaultOpenIds?: string[];
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpenIds = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    new Set(defaultOpenIds)
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <div key={item.id} className="bg-[#14171D]">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-[#E3E2E5] hover:bg-[#171A21] transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{item.trigger}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[#5D6474] transition-transform duration-200 flex-shrink-0 ml-2",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-4 pb-4 pt-1 text-sm text-[#9BA1B0] border-t border-white/[0.04]">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
