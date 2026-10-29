import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  number: number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full py-3", className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-2 z-10 flex-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-medium transition-all",
                    isCompleted
                      ? "bg-[#e8f5ed] text-[#1e7e45] border border-[#bde6ca]"
                      : isCurrent
                      ? "bg-[#6551a4] text-white border border-[#6551a4] shadow-sm"
                      : "bg-[#f1efea] text-[#9b919f] border border-[#e5e2de]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      "text-xs font-medium leading-tight block",
                      isCurrent
                        ? "text-[#6551a4] font-semibold"
                        : isCompleted
                        ? "text-[#1e7e45]"
                        : "text-[#5e5866]"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-[10px] text-[#9b919f] hidden sm:block mt-0.5">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] flex-1 -mt-6 transition-colors",
                    step.number < currentStep
                      ? "bg-[#1e7e45]"
                      : "bg-[#e5e2de]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
