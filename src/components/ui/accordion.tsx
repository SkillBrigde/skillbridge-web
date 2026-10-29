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
  multiple?: boolean;
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
        "rounded-xl border border-[#e5e2de] bg-white divide-y divide-[#e5e2de] overflow-hidden shadow-sm",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <div key={item.id} className="bg-white">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between w-full px-5 py-4 text-left text-sm font-semibold text-[#27252d] hover:bg-[#faf9f6] transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{item.trigger}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[#5e5866] transition-transform duration-200 flex-shrink-0 ml-2",
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
              <div className="px-5 pb-5 pt-1 text-sm text-[#5e5866] leading-relaxed border-t border-[#f1efea]">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
