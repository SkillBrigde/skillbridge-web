"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRightIcon } from "lucide-react";
import { MentorCard } from "@/components/mentor-card";
import { Button } from "@/components/ui/button";
import { useAutoRotateCarousel } from "@/hooks/useAutoRotateCarousel";
import { ALL_FEATURED_MENTORS, FeaturedMentorItem } from "@/constants/featuredMentors";

export function FeaturedMentorsCarousel() {
  const [mentors, setMentors] = useState<FeaturedMentorItem[]>(ALL_FEATURED_MENTORS);

  // Fair rotation: Randomize on mount to give equal visibility
  useEffect(() => {
    const randomOffset = Math.floor(Math.random() * ALL_FEATURED_MENTORS.length);
    const rotated = [
      ...ALL_FEATURED_MENTORS.slice(randomOffset),
      ...ALL_FEATURED_MENTORS.slice(0, randomOffset),
    ];
    setMentors(rotated);
  }, []);

  const {
    currentIndex,
    setCurrentIndex,
    itemsPerPage,
    dotCount,
    setIsPaused,
    nextSlide,
    prevSlide,
    handleTouchStart,
    handleTouchEnd,
  } = useAutoRotateCarousel({
    totalItems: mentors.length,
    autoPlayInterval: 4000,
    responsiveBreakpoints: { mobile: 1, tablet: 2, desktop: 3 },
  });

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top action controls (Previous / Next + View All) */}
      <div className="flex items-center justify-end mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          {/* Subtle Prev / Next Buttons */}
          <div className="flex items-center gap-1 bg-[#14171D] border border-white/[0.08] p-0.5 rounded-xl">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Mentor trước"
              className="p-1.5 rounded-lg text-[#9BA1B0] hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-white/[0.08]" />
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Mentor tiếp theo"
              className="p-1.5 rounded-lg text-[#9BA1B0] hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link href="/mentors">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
              Xem tất cả 50+ Mentors
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Carousel Track Viewport */}
      <div
        className="overflow-hidden -mx-3 px-3 py-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out items-stretch"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="flex-shrink-0 px-3 flex flex-col"
              style={{ width: `${100 / itemsPerPage}%` }}
            >
              <Link href={`/mentors/${mentor.id}`} className="block h-full">
                <MentorCard
                  name={mentor.name}
                  role={mentor.role}
                  rating={mentor.rating}
                  reviewCount={mentor.reviews}
                  sessionCount={mentor.sessions}
                  verified={mentor.verified}
                  online={mentor.online}
                  services={mentor.services}
                  availableSlot={mentor.availableSlot}
                  className="h-full flex flex-col justify-between"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots at Bottom */}
      <div className="flex items-center justify-center gap-1.5 mt-8">
        {Array.from({ length: dotCount }).map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Trang mentor ${idx + 1}`}
              className={`transition-all rounded-full h-1.5 ${
                isActive ? "w-6 bg-[#5E6AD2]" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
