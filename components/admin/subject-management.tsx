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

interface SubjectManagementProps {
  selectedSubject: string;
  setSelectedSubject: (id: string) => void;
  setSelectedTopic: (id: string) => void;
}

export function SubjectManagement({
  selectedSubject,
  setSelectedSubject,
  setSelectedTopic,
}: SubjectManagementProps) {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const subjects = useQuery(api.admin.getSubjects);
  const createSubject = useMutation(api.admin.createSubject);

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

  return (
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
  );
}
