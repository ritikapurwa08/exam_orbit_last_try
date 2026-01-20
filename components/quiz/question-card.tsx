"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  _id: string;
  text: string;
  options: string[];
};

interface QuestionCardProps {
  question: Question;
  currentQIndex: number;
  totalQuestions: number;
  selectedOption: number | undefined;
  onSelectOption: (index: number) => void;
}

export function QuestionCard({
  question,
  currentQIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-end">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Question {currentQIndex + 1}{" "}
          <span className="text-muted-foreground/50">/ {totalQuestions}</span>
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectOption(idx)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group",
                  selectedOption === idx
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-card hover:border-primary/30",
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={cn(
                      "size-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      selectedOption === idx
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-slate-300 dark:border-slate-700 text-transparent",
                    )}
                  >
                    {selectedOption === idx && (
                      <div className="size-2.5 bg-current rounded-full" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-base font-medium",
                      selectedOption === idx
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {option}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
