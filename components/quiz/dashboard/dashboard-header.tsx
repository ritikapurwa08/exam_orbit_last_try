"use client";

import { Flame, Quote } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <>
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
    </>
  );
}
