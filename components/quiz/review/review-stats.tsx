"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ReviewStatsProps {
  percentage: number;
  score: number;
  totalQuestions: number;
}

export function ReviewStats({
  percentage,
  score,
  totalQuestions,
}: ReviewStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {percentage}%
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase">
            Accuracy
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {score}/{totalQuestions}
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase">
            Score
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
