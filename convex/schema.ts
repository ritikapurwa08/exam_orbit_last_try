import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  subjects: defineTable({
    name: v.string(),
  }),
  topics: defineTable({
    name: v.string(),
    subjectId: v.id("subjects"),
    totalSets: v.optional(v.number()), // Optional for backward compatibility, init to 0
  }),
  questions: defineTable({
    text: v.string(),
    options: v.array(v.string()),
    correctOption: v.number(),
    topicId: v.id("topics"),
    explanation: v.optional(v.string()),
    set: v.number(),
  }).index("by_topic_set", ["topicId", "set"]),
  attempts: defineTable({
    userId: v.id("users"),
    topicId: v.id("topics"),
    subejctId: v.id("subjects"),
    set: v.number(),
    score: v.number(),
    totalQuestions: v.number(),
    answers: v.string(),
    completedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_user_topic", ["userId", "topicId"]),
  user_stats: defineTable({
    userId: v.id("users"),
    totalXp: v.number(),
    quizzesTaken: v.number(),
    averageScore: v.number(),
    lastActive: v.number(),
  }).index("by_user", ["userId"]),
  user_progress: defineTable({
    userId: v.id("users"),
    topicId: v.id("topics"),
    set: v.number(),
    highScore: v.number(),
    lastAttemptAt: v.number(),
    nextValidAttemptAt: v.number(),
  }).index("by_user_topic_set", ["userId", "topicId", "set"]),
});

export default schema;
