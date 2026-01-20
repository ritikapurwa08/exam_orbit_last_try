"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, BookOpen } from "lucide-react";

interface UserStatsDisplayProps {
  totalXp: number;
  quizzesTaken: number;
  averageScore: number;
}

export function UserStatsDisplay({
  totalXp,
  quizzesTaken,
  averageScore,
}: UserStatsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Total XP
            </p>
            <h3 className="text-3xl font-bold text-indigo-500">
              {totalXp.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-500">
            <Zap className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-green-500/10 to-teal-500/10 border-green-500/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Average Score
            </p>
            <h3 className="text-3xl font-bold text-green-500">
              {Math.round(averageScore)}%
            </h3>
          </div>
          <div className="p-3 bg-green-500/10 rounded-full text-green-500">
            <Target className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Quizzes Taken
            </p>
            <h3 className="text-3xl font-bold text-pink-500">{quizzesTaken}</h3>
          </div>
          <div className="p-3 bg-pink-500/10 rounded-full text-pink-500">
            <BookOpen className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
