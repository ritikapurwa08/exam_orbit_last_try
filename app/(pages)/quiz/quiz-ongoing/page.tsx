"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { QuizLayout } from "@/components/quiz/quiz-layout";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizHeader } from "@/components/quiz/ongoing/quiz-header";
import { QuizProgress } from "@/components/quiz/ongoing/quiz-progress";
import { QuizFooter } from "@/components/quiz/ongoing/quiz-footer";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject");
  const topicId = searchParams.get("topic");
  const set = searchParams.get("set");

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const questions = useQuery(
    api.quiz.getQuestions,
    subjectId && topicId && set
      ? { topicId: topicId as Id<"topics">, set: Number(set) }
      : "skip",
  );

  // Mutation
  const submitAttempt = useMutation(api.quiz.submitAttempt);

  // Derived
  const totalQuestions = questions?.length || 0;
  const currentQuestion = questions?.[currentIndex];
  // Calculate progress for progress bar
  const progress =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Handlers
  const handleSelectOption = (optIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: optIndex, // Store by Question ID for robustness
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Logic for last question handled in UI mostly, but safe guard
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!questions || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Calculate Score Locally (Optimistic)
      let score = 0;
      questions.forEach((q) => {
        const selected = answers[q._id];
        if (selected === q.correctOption) score++;
      });

      // Serialize answers for DB
      const answersString = JSON.stringify(answers);

      // Call Mutation
      const { attemptId } = await submitAttempt({
        topicId: topicId as Id<"topics">,
        subjectId: subjectId as Id<"subjects">,
        set: Number(set),
        score,
        totalQuestions,
        answers: answersString,
      });

      toast.success("Quiz Submitted!");
      router.replace(`/quiz/review/${attemptId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz.");
      setIsSubmitting(false);
    }
  };

  // Loading States
  if (questions === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (questions === null || questions.length === 0) {
    return (
      <QuizLayout>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-xl font-bold">No questions found</h2>
          <p className="text-muted-foreground mt-2">
            This set might be empty or invalid.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </QuizLayout>
    );
  }

  return (
    <QuizLayout>
      <QuizHeader onTimeUp={handleSubmit} />

      <QuizProgress progress={progress} />

      {/* Main Card */}
      <div className="flex-1 flex flex-col justify-center min-h-100">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            currentQIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedOption={answers[currentQuestion._id]}
            onSelectOption={handleSelectOption}
          />
        )}
      </div>

      <QuizFooter
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
        onPrevious={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </QuizLayout>
  );
}

export default function QuizOngoingPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
