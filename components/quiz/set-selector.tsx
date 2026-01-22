"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Lock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Doc } from "@/convex/_generated/dataModel";

type userProgressType = Doc<"user_progress">;
interface SetSelectorProps {
  topicId: string;
  subjectId: string;
  totalSets: number;
  userProgress: userProgressType[]; // Type this properly if possible
}

export function SetSelector({
  topicId,
  subjectId,
  totalSets,
  userProgress,
}: SetSelectorProps) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState warning
    const rafId = requestAnimationFrame(() => setNow(Date.now()));
    const interval = setInterval(() => setNow(Date.now()), 60000); // Update every minute
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  const handleStartSet = (set: number) => {
    router.push(
      `/quiz/quiz-ongoing?subject=${subjectId}&topic=${topicId}&set=${set}`,
    );
  };

  // If totalSets is 0 or undefined, maybe show at least 1 set or show "No sets"?
  // Admin upload updates totalSets, so we trust it. Default to 1 if missing for dev.
  const setsCount = totalSets || 0;
  const sets = Array.from({ length: setsCount }, (_, i) => i + 1);

  if (setsCount === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No sets available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {sets.map((set) => {
        const progress = userProgress.find((p) => p.set === set);
        const isCompleted = !!progress;
        const score = progress?.highScore;

        // Cooldown Logic
        // If nextValidAttemptAt > now, then it's in cooldown
        const isCooldown =
          now &&
          progress?.nextValidAttemptAt &&
          progress.nextValidAttemptAt > now;
        const cooldownText =
          isCooldown && progress?.nextValidAttemptAt
            ? formatDistanceToNow(progress.nextValidAttemptAt)
            : null;

        return (
          <Button
            key={set}
            variant="outline"
            className={cn(
              "h-auto aspect-video md:aspect-auto md:h-24 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden border transition-all hover:bg-accent hover:border-primary/50",
              isCompleted
                ? "border-green-500/20 bg-green-500/5 hover:bg-green-500/10"
                : "border-white/10 bg-white/5",
              isCooldown && "opacity-75 cursor-not-allowed",
            )}
            onClick={() => !isCooldown && handleStartSet(set)}
            disabled={!!isCooldown && !isCompleted}
          >
            <span className="text-xl font-bold">Set {set}</span>

            {isCompleted ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                  <CheckCircle className="w-3 h-3" />
                  <span>{score} Pts</span>
                </div>
                {isCooldown && (
                  <div className="flex items-center gap-1 text-[10px] text-orange-500 font-medium bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span>{cooldownText}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Start
              </div>
            )}

            {/* Completion Indicator Bar */}
            {isCompleted && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20">
                <div
                  className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
}
