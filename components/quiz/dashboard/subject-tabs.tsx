"use client";

import { LayoutGrid } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface SubjectTabsProps {
  subjects: Doc<"subjects">[];
  activeSubject: string | null;
  setActiveSubject: (id: string | null) => void;
}

export function SubjectTabs({
  subjects,
  activeSubject,
  setActiveSubject,
}: SubjectTabsProps) {
  return (
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
  );
}
