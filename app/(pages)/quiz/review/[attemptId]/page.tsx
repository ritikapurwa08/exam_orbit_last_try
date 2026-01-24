"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { QuizLayout } from "@/components/quiz/quiz-layout";
import { ReviewHeader } from "@/components/quiz/review/review-header";
import { ReviewStats } from "@/components/quiz/review/review-stats";
import { QuestionAnalysis } from "@/components/quiz/review/question-analysis";

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
      <ReviewHeader
        percentage={percentage}
        subjectName={attempt.subjectName}
        topicName={attempt.topicName}
      />

      <ReviewStats
        percentage={percentage}
        score={attempt.score}
        totalQuestions={attempt.totalQuestions}
      />

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          className="flex-1 rounded-xl"
          onClick={() => router.push("/quiz")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
        </Button>
      </div>

      <QuestionAnalysis questions={attempt.questions} answers={answers} />
    </QuizLayout>
  );
}
