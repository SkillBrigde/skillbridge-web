"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Keyboard shortcut hint text */
  shortcutHint?: string;
  /** Auto-complete suggestion chips */
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Tìm kiếm mentor, kỹ năng...",
  shortcutHint = "Ctrl+K",
  suggestions,
  onSuggestionClick,
  className,
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = React.useState(value);

  // Sync with external value
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Ctrl+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(internalValue);
  };

  return (
    <div className={cn("w-full space-y-2.5", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D6474]" />
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 bg-[#0F1115] border border-white/[0.08] rounded-xl pl-10 pr-20 text-sm text-[#F0F2F5] placeholder:text-[#5D6474] font-sans transition-all outline-none hover:border-white/[0.16] focus:border-[#5E6AD2]/80 focus:ring-1 focus:ring-[#5E6AD2]/50"
        />
        {shortcutHint && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center rounded bg-[#1F2022] border border-white/[0.1] px-1.5 py-0.5 text-[10px] font-mono text-[#5D6474] select-none">
            {shortcutHint}
          </kbd>
        )}
      </form>

      {/* Suggestion chips */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                onSuggestionClick?.(suggestion);
                handleChange(suggestion);
              }}
              className="inline-flex items-center rounded-full bg-[#14171D] border border-white/[0.08] px-2.5 py-1 text-xs text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#1F2022] hover:border-white/[0.14] transition-all cursor-pointer select-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
