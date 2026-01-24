import { Filter, History } from "lucide-react";

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
import { HistoryListItem } from "./history-list-item";
export function HistoryList() {
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
        {sortedHistory.map((item) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <HistoryListItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
