"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Check, X, Award, } from "lucide-react";
import { QuizLayout } from "@/components/quiz/quiz-layout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper to parse answers JSON safely
const parseAnswers = (jsonStr: string) => {
  try {
    return JSON.parse(jsonStr) as Record<string, number>;
  } catch {
    return {};
  }
};

interface ReviewPageProps {
  params: Promise<{ attemptId: string }>;
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const { attemptId } = use(params);
  const router = useRouter();

  const attempt = useQuery(api.quiz.getAttempt, {
    attemptId: attemptId as Id<"attempts">,
  });

  if (attempt === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (attempt === null) {
    return <div className="p-8 text-center">Attempt not found.</div>;
  }

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const answers = parseAnswers(attempt.answers);

  return (
    <QuizLayout>
      {/* Header Section */}
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
          {attempt.subjectName} • {attempt.topicName}
        </p>
      </div>

      {/* Stats Cards */}
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
              {attempt.score}/{attempt.totalQuestions}
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase">
              Score
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          className="flex-1 rounded-xl"
          onClick={() => router.push("/quiz")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
        </Button>
        {/* Optional: Retry button if we want to allow immediate retry */}
      </div>

      {/* Question Analysis */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold mb-4">Detailed Analysis</h2>

        {attempt.questions.map((q, idx) => {
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
                  {q.options.map((opt, optIdx) => {
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
    </QuizLayout>
  );
}
