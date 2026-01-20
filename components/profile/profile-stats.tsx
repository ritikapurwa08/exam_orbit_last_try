import { Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Doc } from "@/convex/_generated/dataModel";

interface ProfileStatsProps {
  user: Doc<"users"> | null | undefined;
  // We can add actual stats props here later
}

export function ProfileStats({ user }: ProfileStatsProps) {
  // Mock data or derive from props
  const joinedDate = user?._creationTime
    ? format(new Date(user._creationTime), "MMM yyyy")
    : "Jan 2024";

  return (
    <section className="grid grid-cols-2 gap-3 mt-8">
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
        <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
            Joined
          </p>
          <p className="text-sm font-bold text-white">{joinedDate}</p>
        </div>
      </div>
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
        <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
            Total Tests
          </p>
          <p className="text-sm font-bold text-white">
            0 Exams {/* Placeholder */}
          </p>
        </div>
      </div>
    </section>
  );
}
