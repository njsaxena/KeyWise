// HowItWorksTimeline.tsx

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    id: 1,
    title: "Upload Your Home",
    subtitle: "Give us the raw details",
    items: ["Photos", "Square footage", "Bedrooms & bathrooms", "Property details"],
  },
  {
    id: 2,
    title: "We Analyze Your Property",
    subtitle: "AI does the heavy lifting",
    items: ["Generate descriptions", "Marketing content", "Staging recommendations", "Pricing insights"],
  },
  {
    id: 3,
    title: "Review & Publish",
    subtitle: "You stay in control",
    items: ["Edit everything", "Ask chatbot questions", "Stay in control", "Publish when ready"],
  },
];

export function HowItWorksTimeline() {
  const [activeId, setActiveId] = useState<number>(1);
  const [visitedIds, setVisitedIds] = useState<number[]>([1]);

  const handleClick = (id: number) => {
    setActiveId(id);
    setVisitedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold kw-text mb-2">
            How It Works
          </h2>
          <p className="kw-muted text-sm md:text-base">
            Follow a simple, guided timeline from raw photos to a polished listing.
          </p>
        </header>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative mb-10">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-kw-border to-transparent pointer-events-none" />
            <div className="grid grid-cols-3 gap-6">
              {steps.map((step) => {
                const isActive = step.id === activeId;
                const isPast = step.id < activeId;
                const isVisited = visitedIds.includes(step.id);

                return (
                  <div key={step.id} className="flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleClick(step.id)}
                      className="relative z-10 flex flex-col items-center gap-3 focus:outline-none"
                    >
                      {/* Dot */}
                      <div className="flex items-center justify-center">
                        <div
                          className={[
                            "relative flex items-center justify-center transition-transform duration-200",
                            isActive ? "scale-125" : "scale-100",
                          ].join(" ")}
                        >
                          <div
                          className="rounded-full transition-colors duration-200 border"
                          style={{
                            width: isActive ? "22px" : "16px",
                            height: isActive ? "22px" : "16px",
                            backgroundColor: isActive
                              ? "var(--primary)"
                              : isPast
                                ? "color-mix(in srgb, var(--primary) 10%, white)"
                                : "white",
                            borderColor: isActive ? "var(--primary)" : "#000",
                            borderWidth: "2px",
                          }}
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs uppercase tracking-wide kw-muted-2 mb-0.5">
                          Step {step.id}
                        </div>
                        <div
                          className={[
                            "text-sm font-medium",
                            isActive ? "kw-text" : "kw-muted",
                          ].join(" ")}
                        >
                          {step.title}
                        </div>
                      </div>
                    </button>

                    {isVisited && (
                      <Card
                        className={[
                          "w-full max-w-sm rounded-xl border kw-border kw-card p-6",
                          "flex flex-col justify-between h-52",
                          isActive ? "shadow-md shadow-kw-primary/10" : "shadow-sm",
                        ].join(" ")}
                      >
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold kw-text mb-1">
                            {step.title}
                          </h3>
                          <p className="kw-muted text-sm">{step.subtitle}</p>
                        </div>

                        <ul className="space-y-2 kw-muted text-sm overflow-hidden">
                          {step.items.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-kw-primary/70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-5 mt-4">
          {steps.map((step, index) => {
            const isActive = step.id === activeId;

            return (
              <div key={step.id} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 border-l border-dashed border-kw-border/60" />
                )}

                <button
                  type="button"
                  onClick={() => handleClick(step.id)}
                  className={[
                    "relative z-10 w-full text-left flex gap-4",
                    "active:scale-[0.99] transition-transform duration-150",
                  ].join(" ")}
                >
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? "var(--primary)" : "white",
                        color: isActive ? "white" : "var(--text)",
                        borderColor: isActive ? "var(--primary)" : "#000",
                        borderWidth: "2px",
                        transform: isActive ? "scale(1.12)" : "scale(1)",
                      }}
                    >
                      {step.id}
                    </div>
                  </div>

                  <Card
                    className={[
                      "flex-1 rounded-xl border kw-border kw-card p-5 transition-shadow duration-200",
                      isActive ? "shadow-md shadow-kw-primary/10" : "shadow-sm",
                    ].join(" ")}
                  >
                    <h3 className="text-base font-semibold kw-text mb-1">
                      {step.title}
                    </h3>
                    <p className="kw-muted text-xs mb-3">{step.subtitle}</p>
                    <ul className="space-y-1.5 kw-muted text-xs">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-kw-primary/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
