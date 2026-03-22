"use client";

import { Button } from "@app/components/ui/button";
import { ArrowRight, Flag } from "lucide-react";

type Step = {
  instruction: string;
  distanceText?: string;
};

type NavigationPanelActiveContentProps = {
  currentStep?: Step;
  nextStep?: Step;
  etaText?: string;
  isExpanded?: boolean;
  onEndNavigation?: () => void;
};

export function NavigationPanelActiveContent({
  currentStep = {
    instruction: "Idź prosto",
    distanceText: "20 m",
  },
  nextStep = {
    instruction: "Skręć w prawo",
  },
  etaText = "2 min",
  isExpanded = false,
  onEndNavigation,
}: NavigationPanelActiveContentProps) {
  return (
    <div className="flex min-h-0 flex-col gap-4 pb-1">
      {/* Primary step (always visible) */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Następny krok
        </p>
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          {currentStep.instruction}
        </h2>
        {currentStep.distanceText && (
          <p className="text-sm font-medium text-muted-foreground">
            {currentStep.distanceText}
          </p>
        )}
      </div>

      {/* Expanded-only content */}
      {isExpanded && (
        <div className="flex flex-col gap-3">
          {nextStep && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <ArrowRight className="mt-0.5 size-4 shrink-0" />
              <span>{nextStep.instruction}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">ETA</p>
            <p className="text-sm font-semibold text-foreground">{etaText}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="grid grid-cols-1 gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-11 rounded-xl px-4 text-sm font-medium"
          onClick={onEndNavigation}
        >
          <Flag className="mr-2 size-4" />
          Zakończ nawigację
        </Button>
      </div>
    </div>
  );
}
