"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizTimer } from "@/components/quiz/quiz-timer";

interface QuizHeaderProps {
  onTimeUp: () => void;
}

export function QuizHeader({ onTimeUp }: QuizHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Quit
      </Button>

      <QuizTimer duration={600} onTimeUp={onTimeUp} />
    </div>
  );
}
