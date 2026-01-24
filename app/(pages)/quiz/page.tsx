"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SetSelector } from "@/components/quiz/set-selector";
import { DashboardHeader } from "@/components/quiz/dashboard/dashboard-header";
import { SubjectTabs } from "@/components/quiz/dashboard/subject-tabs";
import { TopicGrid } from "@/components/quiz/dashboard/topic-grid";

export default function QuizDashboardPage() {
  const dashboardData = useQuery(api.quiz.getDashboard);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
    subjectId: string;
    totalSets: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userProgress: any;
  } | null>(null);

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

  const { subjects, stats } = dashboardData;

  // Helper to get icon for subject

  // Filter topics based on active subject
  const filteredTopics = activeSubject
    ? subjects.find((s) => s._id === activeSubject)?.topics || []
    : subjects.flatMap((s) => s.topics);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Desktop Wrapper / Container */}
      <div className="container mx-auto px-4 md:px-6 py-6 pb-24 max-w-7xl">
        <DashboardHeader stats={stats} />

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <SubjectTabs
            subjects={subjects}
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
          />
        </div>

        <TopicGrid
          activeSubject={activeSubject}
          filteredTopics={filteredTopics}
          subjects={subjects}
          onSelectTopic={setSelectedTopic}
        />
      </div>

      {/* Set Selection Dialog */}
      <div className="m-2">
        <Dialog
          open={!!selectedTopic}
          onOpenChange={(open) => !open && setSelectedTopic(null)}
        >
          <DialogContent className="bg-[#0f0f0f] border-white/10 m-2 p-2  text-white max-w-4xl h-[80vh] flex flex-col  gap-0">
            <DialogHeader className="p-6 pb-2 border-b border-white/5">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-primary">{selectedTopic?.name}</span>
                <span className="text-white/40 font-normal text-lg">
                  / Sets
                </span>
              </DialogTitle>
              <DialogDescription className="text-white/50">
                Select a set to begin your attempt. Completed sets show your
                high score.
              </DialogDescription>
            </DialogHeader>

            {selectedTopic && (
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <SetSelector
                  topicId={selectedTopic.id}
                  subjectId={selectedTopic.subjectId}
                  totalSets={selectedTopic.totalSets}
                  userProgress={selectedTopic.userProgress}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
