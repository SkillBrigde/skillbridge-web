"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  shortcutHint?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Tìm kiếm chuyên gia, kỹ năng, lĩnh vực...",
  shortcutHint = "Ctrl+K",
  suggestions,
  onSuggestionClick,
  className,
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value);
  }

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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b919f]" />
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 bg-white border border-[#e5e2de] rounded-xl pl-10 pr-20 text-sm text-[#27252d] placeholder:text-[#9b919f] font-sans transition-all outline-none hover:border-[#d4c3e7] focus:border-[#6551a4] focus:ring-2 focus:ring-[#ece5f5]"
        />
        {shortcutHint && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center rounded bg-[#f1efea] border border-[#e5e2de] px-2 py-0.5 text-[10px] font-mono text-[#5e5866] select-none">
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
              className="inline-flex items-center rounded-full bg-white border border-[#e5e2de] px-3 py-1 text-xs text-[#5e5866] hover:text-[#6551a4] hover:border-[#d4c3e7] hover:bg-[#ece5f5]/30 transition-all cursor-pointer select-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
