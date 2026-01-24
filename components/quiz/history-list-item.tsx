import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryItemProps {
  item: {
    _id: string;
    score: number;
    totalQuestions: number;
    subjectName: string;
    topicName: string;
    set: number;
    completedAt: number;
  };
}

export const HistoryListItem = ({ item }: HistoryItemProps) => {
  const router = useRouter();
  const percentage = Math.round((item.score / item.totalQuestions) * 100);

  return (
    <div
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
};
