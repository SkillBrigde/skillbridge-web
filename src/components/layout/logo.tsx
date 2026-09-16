import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 32, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="48" height="48" rx="12" fill="#14171D" />
        <path
          d="M14 17C14 15.3431 15.3431 14 17 14H31C32.6569 14 34 15.3431 34 17V20C34 21.6569 32.6569 23 31 23H20C18.3431 23 17 24.3431 17 26V31C17 32.6569 18.3431 34 20 34H34"
          stroke="#5E6AD2"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="34" r="2.5" fill="#27C98F" />
        <circle cx="14" cy="14" r="2.5" fill="#5E6AD2" />
      </svg>
      {showText && (
        <span className="font-semibold text-[17px] tracking-tight text-[#F0F2F5]">
          SkillBridge
        </span>
      )}
    </div>
  );
}
