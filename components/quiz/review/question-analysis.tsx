"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionAnalysisProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  answers: Record<string, number>;
}

export function QuestionAnalysis({
  questions,
  answers,
}: QuestionAnalysisProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Detailed Analysis</h2>

      {questions.map((q, idx) => {
        const userAns = answers[q._id];
        const isCorrect = userAns === q.correctOption;
        const isSkipped = userAns === undefined;

        return (
          <Card
            key={q._id}
            className={cn(
              "overflow-hidden border-l-4",
              isCorrect
                ? "border-l-green-500"
                : isSkipped
                  ? "border-l-slate-400"
                  : "border-l-red-500",
            )}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">
                  Q{idx + 1}
                </span>
                {isCorrect ? (
                  <Badge className="bg-green-500 hover:bg-green-600 border-none">
                    <Check className="w-3 h-3 mr-1" /> Correct
                  </Badge>
                ) : isSkipped ? (
                  <Badge variant="secondary">Skipped</Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="w-3 h-3 mr-1" /> Incorrect
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-semibold mb-4">{q.text}</h3>

              <div className="space-y-2 text-sm">
                {q.options.map((opt: string, optIdx: number) => {
                  const isKey = optIdx === q.correctOption;
                  const isSelected = optIdx === userAns;

                  let style =
                    "p-3 rounded-lg border flex items-center justify-between ";
                  if (isKey)
                    style +=
                      "bg-green-50/50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300";
                  else if (isSelected)
                    style +=
                      "bg-red-50/50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300";
                  else
                    style +=
                      "bg-background/50 text-muted-foreground border-transparent";

                  return (
                    <div key={optIdx} className={style}>
                      <span>{opt}</span>
                      {isKey && <Check className="w-4 h-4" />}
                      {isSelected && !isKey && <X className="w-4 h-4" />}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="mt-4 pt-3 border-t text-sm text-muted-foreground">
                  <span className="font-semibold text-primary block mb-1">
                    Explanation:
                  </span>
                  {q.explanation}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
