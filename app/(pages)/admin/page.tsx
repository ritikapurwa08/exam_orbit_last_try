"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { SubjectManagement } from "@/components/admin/subject-management";
import { TopicManagement } from "@/components/admin/topic-management";
import { QuestionUpload } from "@/components/admin/question-upload";

export default function AdminPage() {
  // State
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Queries (just for loading check)
  const subjects = useQuery(api.admin.getSubjects);

  if (subjects === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage subjects, topics, and upload quiz content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SubjectManagement
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          setSelectedTopic={setSelectedTopic}
        />

        <TopicManagement
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      </div>

      <QuestionUpload
        selectedSubject={selectedSubject}
        selectedTopic={selectedTopic}
      />
    </div>
  );
}
