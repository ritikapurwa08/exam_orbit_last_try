"use client";

import {
  BookOpen,
  Microscope,
  Atom,
  Calculator,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface TopicWithProgress extends Doc<"topics"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userProgress?: any[];
  totalSets?: number;
}

interface TopicGridProps {
  activeSubject: string | null;
  filteredTopics: TopicWithProgress[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subjects: any[]; // Using any to avoid complex type reconstruction for embedded topics
  onSelectTopic: (topic: {
    id: string;
    name: string;
    subjectId: string;
    totalSets: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userProgress: any;
  }) => void;
}

export function TopicGrid({
  activeSubject,
  filteredTopics,
  subjects,
  onSelectTopic,
}: TopicGridProps) {
  // Helper to get icon for subject
  const getSubjectIcon = (name: string): LucideIcon => {
    const lower = name.toLowerCase();
    if (lower.includes("bio")) return Microscope;
    if (lower.includes("phy")) return Atom;
    if (lower.includes("math")) return Calculator;
    return BookOpen;
  };

  return (
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
          const parentSubject = subjects.find((s) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            s.topics.some((t: any) => t._id === topic._id),
          );
          const SubjectIcon = getSubjectIcon(parentSubject?.name || "");

          const progress =
            topic.userProgress && topic.userProgress.length > 0
              ? (topic.userProgress.length / (topic.totalSets || 10)) * 100
              : 0;

          return (
            <div
              key={topic._id}
              className="group relative flex items-center gap-3 glass-card p-4 rounded-2xl border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#111] overflow-hidden"
            >
              {/* Icon */}
              <div className="text-primary flex items-center justify-center rounded-xl bg-primary/10 shrink-0 size-10 group-hover:scale-110 transition-transform duration-300">
                <SubjectIcon className="w-5 h-5" />
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
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onSelectTopic({
                    id: topic._id,
                    name: topic.name,
                    subjectId: parentSubject?._id as string,
                    totalSets: topic.totalSets || 0,
                    userProgress: topic.userProgress,
                  })
                }
                className="shrink-0 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary hover:text-white transition-all px-4 h-9 active:scale-95 font-bold text-xs"
              >
                Open
              </Button>
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
  );
}
