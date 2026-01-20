"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2,
  Zap,
  Trophy,
  Target,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";


export default function StatsPage() {
  const stats = useQuery(api.quiz.getUserStats);


  if (stats === undefined) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  // Handle case where stats might be null (new user)
  const safeStats = stats || {
    totalXp: 0,
    quizzesTaken: 0,
    averageScore: 0,
    lastActive: 0,
  };

  const statItems = [
    {
      label: "Total XP",
      value: safeStats.totalXp.toLocaleString(),
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Quizzes Taken",
      value: safeStats.quizzesTaken,
      icon: Trophy,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Avg. Score",
      value: `${Math.round(safeStats.averageScore)}%`,
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Last Active",
      value: safeStats.lastActive
        ? formatDistanceToNow(safeStats.lastActive) + " ago"
        : "N/A",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <main className="px-5 space-y-6 mt-4">
        <h1 className="text-2xl font-bold mb-6">Your Statistics</h1>

        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#111111] border border-white/5 rounded-3xl p-5 flex flex-col gap-4"
            >
              <div
                className={`size-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-white tracking-tight">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for Chart if needed later */}
        {/* <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 h-64 flex items-center justify-center text-slate-600 font-medium border-dashed">
          Performance Chart Coming Soon
        </div> */}
      </main>
    </div>
  );
}
