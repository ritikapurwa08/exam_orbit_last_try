import { ChevronRight, History, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function HistoryList() {
  const router = useRouter();
  const history = useQuery(api.quiz.getUserHistory);
  const [sortBy, setSortBy] = useState<"recent" | "score_asc" | "score_desc">(
    "recent",
  );

  if (history === undefined) {
    return <div className="text-center text-slate-500 py-12">Loading...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <History className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm font-medium">No quiz history yet.</p>
        <p className="text-xs opacity-70">Complete a quiz to see it here.</p>
      </div>
    );
  }

  // Filter & Sort
  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === "recent") return b.completedAt - a.completedAt;
    if (sortBy === "score_asc")
      return a.score / a.totalQuestions - b.score / b.totalQuestions;
    if (sortBy === "score_desc")
      return b.score / b.totalQuestions - a.score / a.totalQuestions;
    return 0;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {history.length} Attempts
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-white/10 bg-[#111] text-xs font-medium hover:bg-[#222] hover:text-white transition-colors"
            >
              <Filter className="w-3.5 h-3.5 mr-2" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 bg-[#111] border-white/10 text-slate-300"
          >
            <DropdownMenuItem
              onClick={() => setSortBy("recent")}
              className="focus:bg-white/10 focus:text-white cursor-pointer"
            >
              Most Recent
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("score_asc")}
              className="focus:bg-white/10 focus:text-white cursor-pointer"
            >
              Lowest Score
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("score_desc")}
              className="focus:bg-white/10 focus:text-white cursor-pointer"
            >
              Highest Score
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
        {sortedHistory.map((item) => {
          const percentage = Math.round(
            (item.score / item.totalQuestions) * 100,
          );
          return (
            <div
              key={item._id}
              onClick={() => router.push(`/quiz/review/${item._id}`)}
              className="p-4 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-full sm:text-xs text-center text-base flex items-center justify-center font-bold   ${
                    percentage >= 80
                      ? "bg-green-500/20 text-green-500"
                      : percentage >= 50
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {percentage}%
                </div>
                <div>
                  <p className="font-bold text-sm text-white line-clamp-1">
                    {item.subjectName} • {item.topicName}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Set {item.set} • {formatDistanceToNow(item.completedAt)} ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex h-8 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                >
                  Review
                </Button>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
