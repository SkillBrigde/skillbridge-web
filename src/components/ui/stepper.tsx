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
    <div className={cn("w-full py-2", className)}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step item */}
              <div className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-medium transition-all",
                    isCompleted
                      ? "bg-[#03BD84]/20 text-[#27C98F] border border-[#27C98F]/40"
                      : isCurrent
                      ? "bg-[#5E6AD2] text-white border border-[#5E6AD2] shadow-sm shadow-[#5E6AD2]/30"
                      : "bg-[#1F2022] text-[#5D6474] border border-white/[0.08]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      "text-[12px] font-medium leading-tight block",
                      isCurrent
                        ? "text-[#F0F2F5]"
                        : isCompleted
                        ? "text-[#27C98F]"
                        : "text-[#5D6474]"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-[10px] text-[#5D6474] hidden sm:block">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[1px] flex-1 -mt-5 transition-colors",
                    step.number < currentStep
                      ? "bg-[#27C98F]/50"
                      : "bg-white/[0.08]"
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
