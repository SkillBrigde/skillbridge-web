"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { goals } from "../content/home-content";
export function HomeGoalSelector() {
  const [goal, setGoal] = useState(0);
  const selected = goals[goal];
  const GoalIcon = selected.icon;
  return (
    <div className="sb-goal-card">
      <div
        className="sb-goal-tabs"
        role="tablist"
        aria-label="Mục tiêu của bạn"
      >
        {goals.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            id={"goal-tab-" + index}
            aria-controls="goal-panel"
            aria-selected={goal === index}
            tabIndex={goal === index ? 0 : -1}
            onKeyDown={(event) => {
              const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? goals.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        goals.length) %
                      goals.length;
              setGoal(next);
              event.currentTarget.parentElement
                ?.querySelectorAll("button")
                [next]?.focus();
            }}
            onClick={() => setGoal(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="sb-goal-content"
        id="goal-panel"
        role="tabpanel"
        aria-labelledby={"goal-tab-" + goal}
        aria-live="polite"
        key={goal}
      >
        <div className="sb-goal-icon">
          <GoalIcon size={21} />
        </div>
        <div>
          <h2>{selected.title}</h2>
          <p>{selected.text}</p>
        </div>
        <Link
          href={"/mentors?q=" + selected.query}
          aria-label={"Tìm mentor: " + selected.label}
        >
          <ArrowUpRight size={21} />
        </Link>
      </div>
    </div>
  );
}
