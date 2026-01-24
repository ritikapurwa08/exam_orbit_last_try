"use client";

import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewHeaderProps {
  percentage: number;
  subjectName?: string;
  topicName?: string;
}

export function ReviewHeader({
  percentage,
  subjectName,
  topicName,
}: ReviewHeaderProps) {
  return (
    <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="mb-4 inline-flex items-center justify-center p-3 rounded-full bg-slate-100 dark:bg-slate-800">
        <Award
          className={cn(
            "w-8 h-8",
            percentage >= 80
              ? "text-yellow-500"
              : percentage >= 50
                ? "text-blue-500"
                : "text-slate-400",
          )}
        />
      </div>
      <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
      <p className="text-muted-foreground">
        {subjectName} • {topicName}
      </p>
    </div>
  );
}
