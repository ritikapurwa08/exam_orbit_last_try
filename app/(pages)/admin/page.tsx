"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Copy, Check, Upload, Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminPage() {
  // State
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [questionsJson, setQuestionsJson] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Loading States
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Queries
  const subjects = useQuery(api.admin.getSubjects);
  const topics = useQuery(api.admin.getTopics, {
    subjectId: selectedSubject || undefined,
  });

  // Mutations
  const createSubject = useMutation(api.admin.createSubject);
  const createTopic = useMutation(api.admin.createTopic);
  const uploadQuestions = useMutation(api.admin.uploadQuestions);

  // Handlers
  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) return;
    setIsCreatingSubject(true);
    try {
      await createSubject({ name: newSubjectName });
      toast.success("Subject created");
      setNewSubjectName("");
    } catch (error) {
      toast.error(`Failed to create subject ${error}`);
    } finally {
      setIsCreatingSubject(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!newTopicName.trim() || !selectedSubject) return;
    setIsCreatingTopic(true);
    try {
      await createTopic({
        name: newTopicName,
        subjectId: selectedSubject as Id<"subjects">,
      });
      toast.success("Topic created");
      setNewTopicName("");
    } catch (error) {
      toast.error(`Failed to create topic ${error}`);
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const handleCopyPrompt = () => {
    const subjectName =
      subjects?.find((s) => s._id === selectedSubject)?.name || "Subject";
    const topicName =
      topics?.find((t) => t._id === selectedTopic)?.name || "Topic";

    const prompt = `Create a JSON array of 20 multiple choice questions for the topic '${topicName}' in the subject '${subjectName}'.
Each question object should be strictly in this format:
{
  "text": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctOption": 0, // Index of the correct option (0-3)
  "explanation": "Brief explanation of the answer."
}
Only return the valid JSON array, no markdown formatting or other text.`;

    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Prompt copied to clipboard");
  };

  const handleUpload = async () => {
    if (!selectedTopic || !questionsJson) return;
    setIsUploading(true);
    try {
      const parsed = JSON.parse(questionsJson);
      if (!Array.isArray(parsed)) throw new Error("Not an array");

      await uploadQuestions({
        topicId: selectedTopic as Id<"topics">,
        questions: parsed,
      });
      toast.success("Questions uploaded successfully!");
      setQuestionsJson("");
    } catch (error) {
      toast.error("Invalid JSON or Upload Failed");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

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
        {/* Subject Management */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Management</CardTitle>
            <CardDescription>Select or create a new subject.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Subject</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic("");
                }}
              >
                <option value="" disabled>
                  Select a subject...
                </option>
                {subjects?.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <Input
                placeholder="New Subject Name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                disabled={isCreatingSubject}
              />
              <Button
                onClick={handleCreateSubject}
                size="icon"
                disabled={isCreatingSubject}
              >
                {isCreatingSubject ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Topic Management */}
        <Card
          className={!selectedSubject ? "opacity-50 pointer-events-none" : ""}
        >
          <CardHeader>
            <CardTitle>Topic Management</CardTitle>
            <CardDescription>
              Select or create a new topic for the chosen subject.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Topic</Label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedSubject}
              >
                <option value="" disabled>
                  Select a topic...
                </option>
                {topics?.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
              <Input
                placeholder="New Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                disabled={!selectedSubject || isCreatingTopic}
              />
              <Button
                onClick={handleCreateTopic}
                size="icon"
                disabled={!selectedSubject || isCreatingTopic}
              >
                {isCreatingTopic ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Upload Section */}
      {selectedSubject && selectedTopic && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle>Upload Questions</CardTitle>
            <CardDescription>
              Generate questions using AI and paste the JSON below. Questions
              will be automatically segmented into sets of 20.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg flex items-start justify-between gap-4">
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">AI Prompt</p>
                <p>Use this prompt to generate compatible JSON content.</p>
              </div>
              <Button
                variant={isCopied ? "default" : "outline"}
                size="sm"
                onClick={handleCopyPrompt}
                className="shrink-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied ? "Copied" : "Copy Prompt"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>JSON Content</Label>
              <Textarea
                placeholder='[ { "text": "...", "options": [...], "correctOption": 0, "explanation": "..." } ]'
                className="min-h-75 font-mono text-xs"
                value={questionsJson}
                onChange={(e) => setQuestionsJson(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                className="w-full sm:w-auto"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
