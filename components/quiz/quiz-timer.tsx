"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  className?: string; // Add className prop
}

export function QuizTimer({ duration, onTimeUp, className }: QuizTimerProps) {
  // Use state to track time left, initialize with duration
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // If time runs out, call onTimeUp
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Set up the interval
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval on unmount or when dependencies change
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]); // Depend on timeLeft and onTimeUp

  // Format time as mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Calculate specific warning colors
  const isWarning = timeLeft < 60;
  const isCritical = timeLeft < 10;

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-sm font-bold px-3 py-1.5 rounded-full border bg-background/50 backdrop-blur-sm",
        isCritical
          ? "text-red-500 border-red-200 bg-red-50/50"
          : isWarning
            ? "text-amber-500 border-amber-200 bg-amber-50/50"
            : "text-muted-foreground border-slate-200 dark:border-slate-800",
        className,
      )}
    >
      <Clock className="w-4 h-4" />
      <span>{formattedTime}</span>
    </div>
  );
}
