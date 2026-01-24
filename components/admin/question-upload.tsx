"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Copy, Check, Upload } from "lucide-react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface QuestionUploadProps {
  selectedSubject: string;
  selectedTopic: string;
}

export function QuestionUpload({
  selectedSubject,
  selectedTopic,
}: QuestionUploadProps) {
  const [questionsJson, setQuestionsJson] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const subjects = useQuery(api.admin.getSubjects);
  const topics = useQuery(api.admin.getTopics, {
    subjectId: selectedSubject || undefined,
  });
  const uploadQuestions = useMutation(api.admin.uploadQuestions);

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

  if (!selectedSubject || !selectedTopic) return null;

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Upload Questions</CardTitle>
        <CardDescription>
          Generate questions using AI and paste the JSON below. Questions will
          be automatically segmented into sets of 20.
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
  );
}
