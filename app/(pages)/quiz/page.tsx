"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2,
  Flame,
  Quote,
  BookOpen,
  Atom,
  Microscope,
  Calculator,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SetSelector } from "@/components/quiz/set-selector";

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
  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("bio")) return Microscope;
    if (lower.includes("phy")) return Atom;
    if (lower.includes("math")) return Calculator;
    return BookOpen;
  };

  // Filter topics based on active subject
  const filteredTopics = activeSubject
    ? subjects.find((s) => s._id === activeSubject)?.topics || []
    : subjects.flatMap((s) => s.topics);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Desktop Wrapper / Container */}
      <div className="container mx-auto px-4 md:px-6 py-6 pb-24 max-w-7xl">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="relative group">
              <Avatar className="size-12 md:size-14 border-2 border-primary/20 transition-transform group-hover:scale-105">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
            </Link>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                Good Evening, User
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest font-medium">
                  Explorer Rank
                </p>
                <div className="flex items-center justify-center rounded-md h-5 bg-primary/10 border border-primary/20 text-primary gap-1 px-2">
                  <Flame className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-bold">
                    {stats?.totalXp || 0} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Quote - More prominent on desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative overflow-hidden glass-card rounded-xl p-6 flex flex-col justify-center bg-linear-to-r from-primary/10 via-transparent to-transparent w-full">
              <p className="text-white/90 text-lg font-medium italic">
                &quot;The beautiful thing about learning is that no one can take
                it away from you.&quot;
              </p>
            </div>
          </div>
        </header>

        {/* Mobile Quote (kept for mobile view) */}
        <div className="md:hidden mb-8">
          <div className="relative overflow-hidden glass-card rounded-xl p-6 min-h-40 flex flex-col justify-end bg-linear-to-br from-primary/20 via-transparent to-transparent">
            <div className="absolute top-0 right-0 p-4 text-white/10">
              <Quote className="w-10 h-10 fill-current" />
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <p className="text-white tracking-tight text-lg font-semibold leading-snug">
                &quot;The beautiful thing about learning is that no one can take
                it away from you.&quot;
              </p>
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-primary"></span>
                <p className="text-primary text-xs font-bold uppercase tracking-wider">
                  Daily Motivation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters / Stats Row */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Subject Tabs */}
          <div className="w-full overflow-hidden">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Subjects</h3>
              {activeSubject && (
                <button
                  onClick={() => setActiveSubject(null)}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  View All
                </button>
              )}
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar mask-gradient-right">
              <button
                onClick={() => setActiveSubject(null)}
                className={`flex items-center justify-center px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${!activeSubject ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                <p className="text-sm font-bold">All</p>
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject._id}
                  onClick={() => setActiveSubject(subject._id)}
                  className={`flex items-center justify-center px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${activeSubject === subject._id ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"}`}
                >
                  <p className="text-sm font-bold">{subject.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              {activeSubject
                ? subjects.find((s) => s._id === activeSubject)?.name
                : "All Active Topics"}
            </h2>
            <span className="text-sm text-white/40">
              {filteredTopics.length} topics found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTopics.map((topic) => {
              // We need to find the subject for this topic if we are in "All" view to get the correct icon
              // Since filteredTopics is flat, we might lose subject ref if we didn't preserve it.
              // But in the "All" view we flatMap. Let's look up subject name roughly or pass it down.
              // Optimization: Use matching topic ID from full tree.
              const parentSubject = subjects.find((s) =>
                s.topics.some((t) => t._id === topic._id),
              );
              const SubjectIcon = getSubjectIcon(parentSubject?.name || "");

              const progress =
                topic.userProgress && topic.userProgress.length > 0
                  ? (topic.userProgress.length / (topic.totalSets || 10)) * 100
                  : 0;

              return (
                <div
                  key={topic._id}
                  className="group relative flex items-center gap-4 glass-card p-4 rounded-2xl border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#111] overflow-hidden"
                >
                  {/* Icon */}
                  <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-12 group-hover:scale-110 transition-transform duration-300">
                    <SubjectIcon className="w-6 h-6" />
                  </div>

                  {/* Content & Progress */}
                  <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                    <div className="flex flex-col">
                      <h4 className="text-white text-base font-bold leading-tight truncate group-hover:text-primary transition-colors">
                        {topic.name}
                      </h4>
                      <p className="text-white/40 text-[10px] font-medium truncate">
                        {parentSubject?.name} • {topic.totalSets || 20} Sets
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-linear-to-r from-primary to-fuchsia-500 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(5, progress)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Open Button */}
                  <button
                    onClick={() =>
                      setSelectedTopic({
                        id: topic._id,
                        name: topic.name,
                        subjectId: parentSubject?._id as string,
                        totalSets: topic.totalSets || 0,
                        userProgress: topic.userProgress,
                      })
                    }
                    className="shrink-0 flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary hover:text-white transition-all p-1  active:scale-95"
                  >
                    open
                  </button>
                </div>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center gap-4 text-white/30 border-2 border-dashed border-white/5 rounded-3xl">
              <BookOpen className="w-16 h-16 opacity-20" />
              <p className="text-xl font-medium">
                No topics found for this subject.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Set Selection Dialog */}
      <Dialog
        open={!!selectedTopic}
        onOpenChange={(open) => !open && setSelectedTopic(null)}
      >
        <DialogContent className="bg-[#0f0f0f] border-white/10 m-2 p-2  text-white max-w-4xl h-[80vh] flex flex-col  gap-0">
          <DialogHeader className="p-6 pb-2 border-b border-white/5">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-primary">{selectedTopic?.name}</span>
              <span className="text-white/40 font-normal text-lg">/ Sets</span>
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Select a set to begin your attempt. Completed sets show your high
              score.
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
  );
}
