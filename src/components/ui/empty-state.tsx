import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode | { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const renderAction = () => {
    if (!action) return null;
    if (React.isValidElement(action)) return action;
    if (typeof action === "object" && "label" in action && "onClick" in action && typeof action.onClick === "function") {
      return (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      );
    }
    return action as React.ReactNode;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl bg-white border border-[#e5e2de] shadow-sm",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edf8] border border-[#d4c3e7] text-[#6551a4] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#27252d] tracking-tight mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#5e5866] max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{renderAction()}</div>}
    </div>
  );
}
