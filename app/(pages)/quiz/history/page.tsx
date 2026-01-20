"use client";

import { HistoryList } from "@/components/quiz/history-list";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans pb-24">
      <main className="px-5 pb-8 space-y-4 max-w-lg mx-auto w-full mt-4">
        <h1 className="text-2xl font-bold text-center  text-white mb-6">
          Recent Activity
        </h1>
        <HistoryList />
      </main>
    </div>
  );
}
