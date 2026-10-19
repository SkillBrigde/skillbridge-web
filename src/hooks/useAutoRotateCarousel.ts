"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseAutoRotateCarouselOptions {
  totalItems: number;
  autoPlayInterval?: number;
  responsiveBreakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/**
 * Custom hook for infinite/paginated carousel with auto-rotation,
 * pause on hover, touch swipe gestures, and responsive breakpoint handling.
 */
export function useAutoRotateCarousel({
  totalItems,
  autoPlayInterval = 4000,
  responsiveBreakpoints = { mobile: 1, tablet: 2, desktop: 3 },
}: UseAutoRotateCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(responsiveBreakpoints.desktop || 3);
  const touchStartX = useRef<number | null>(null);

  // Responsive itemsPerPage calculation
  useEffect(() => {
    function updateItemsPerPage() {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setItemsPerPage(responsiveBreakpoints.mobile || 1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(responsiveBreakpoints.tablet || 2);
      } else {
        setItemsPerPage(responsiveBreakpoints.desktop || 3);
      }
    }

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [responsiveBreakpoints]);

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

<<<<<<< HEAD
  // Bounds check when itemsPerPage changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);
=======
  // Clamp before rendering when the viewport or item count changes.
  if (currentIndex > maxIndex) {
    setCurrentIndex(maxIndex);
  }
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  // Auto-play timer with hover pause
  useEffect(() => {
    if (isPaused || totalItems <= itemsPerPage) return;
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalItems, itemsPerPage, autoPlayInterval]);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return {
    currentIndex,
    setCurrentIndex,
    itemsPerPage,
    maxIndex,
    dotCount: maxIndex + 1,
    isPaused,
    setIsPaused,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTouchStart,
    handleTouchEnd,
  };
}

export { useAutoRotateCarousel as default };
