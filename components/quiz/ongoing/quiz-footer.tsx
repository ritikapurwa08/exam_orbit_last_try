"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface QuizFooterProps {
  currentIndex: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function QuizFooter({
  currentIndex,
  totalQuestions,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}: QuizFooterProps) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="w-32 rounded-xl"
      >
        Previous
      </Button>

      {currentIndex === totalQuestions - 1 ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-32 rounded-xl"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      ) : (
        <Button onClick={onNext} className="w-32 rounded-xl" disabled={false}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
