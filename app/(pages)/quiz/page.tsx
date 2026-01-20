"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SetSelector } from "@/components/quiz/set-selector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function QuizDashboardPage() {
  const dashboardData = useQuery(api.quiz.getDashboard);

  if (dashboardData === undefined) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Please log in to view quizzes.
      </div>
    );
  }

  const { subjects } = dashboardData;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="px-5 py-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Select a subject and topic to start practicing.
        </p>
      </header>

      <div className="px-5 space-y-6">
        {subjects.length === 0 ? (
          <div className="text-center p-8 border border-white/10 rounded-2xl text-slate-500 bg-[#111]">
            No subjects available yet. Check back later!
          </div>
        ) : (
          subjects.map((subject) => (
            <div key={subject._id} className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs px-1">
                <BookOpen className="w-4 h-4" />
                {subject.name}
              </div>

              <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  {subject.topics.map((topic) => (
                    <AccordionItem
                      key={topic._id}
                      value={topic._id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-white/5 px-6 py-4 transition-colors">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm text-white">
                            {topic.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-slate-300 hover:bg-white/20 border-0"
                          >
                            {/* Assuming topic.totalSets exists on topic object from dashboardData,
                                but types might say optional. Fallback 0. */}
                            {/* The schema says totalSets is on topic, and dashboardData returns enriched topics. */}
                            {topic.totalSets || 0} Sets
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2 bg-black/20">
                        <SetSelector
                          topicId={topic._id}
                          subjectId={subject._id}
                          totalSets={topic.totalSets || 0}
                          userProgress={topic.userProgress}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
