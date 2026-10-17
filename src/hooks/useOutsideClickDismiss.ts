"use client";

import { useEffect, RefObject } from "react";

/**
 * Custom hook that triggers a callback when clicking outside of the referenced element.
 * Domain-prefixed and self-descriptive naming for debugging & stack traces.
 */
export function useOutsideClickDismiss<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  active: boolean = true
) {
  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains((event.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, active]);
}

export { useOutsideClickDismiss as default };
