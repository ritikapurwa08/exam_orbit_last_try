"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface TopicManagementProps {
  selectedSubject: string;
  selectedTopic: string;
  setSelectedTopic: (id: string) => void;
}

export function TopicManagement({
  selectedSubject,
  selectedTopic,
  setSelectedTopic,
}: TopicManagementProps) {
  const [newTopicName, setNewTopicName] = useState("");
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const topics = useQuery(api.admin.getTopics, {
    subjectId: selectedSubject || undefined,
  });
  const createTopic = useMutation(api.admin.createTopic);

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

  return (
    <Card className={!selectedSubject ? "opacity-50 pointer-events-none" : ""}>
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
  );
}
