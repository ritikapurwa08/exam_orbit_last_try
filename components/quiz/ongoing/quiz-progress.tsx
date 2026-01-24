"use client";

interface QuizProgressProps {
  progress: number;
}

export function QuizProgress({ progress }: QuizProgressProps) {
  return (
    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
