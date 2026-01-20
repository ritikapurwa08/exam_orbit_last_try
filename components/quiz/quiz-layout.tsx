"use client";

import { ReactNode } from "react";

export function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="fixed top-0 inset-x-0 h-96 bg-primary/5 rounded-b-[50%] blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 py-6 max-w-2xl flex-1 flex flex-col relative z-0">
        {children}
      </div>
    </div>
  );
}
