import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to check if user is admin (Basic check for now)
// In a real app, you'd check a "role" field on the user or a list of admin emails.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkAdmin = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db.get(userId);
  if (user?.role !== "admin") {
    throw new Error("Admin access required");
  }

  return userId;
};

export const createSubject = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const existing = await ctx.db
      .query("subjects")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    if (existing) throw new Error("Subject already exists");
    return await ctx.db.insert("subjects", { name: args.name });
  },
});

export const getSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});

export const createTopic = mutation({
  args: { name: v.string(), subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const existing = await ctx.db
      .query("topics")
      .filter((q) =>
        q.and(
          q.eq(q.field("name"), args.name),
          q.eq(q.field("subjectId"), args.subjectId)
        )
      )
      .first();
    if (existing) throw new Error("Topic already exists in this subject");
    return await ctx.db.insert("topics", { name: args.name, subjectId: args.subjectId });
  },
});

export const getTopics = query({
    args: { subjectId: v.optional(v.string()) }, // accepting string because it might come from select value
    handler: async (ctx, args) => {
      if (!args.subjectId) return [];
      // Cast string to id if needed, but usually v.id() expects actual ID type.
      // Safe to assume we pass a valid ID string.
      return await ctx.db
        .query("topics")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((q) => q.eq(q.field("subjectId"), args.subjectId as any))
        .collect();
    },
  });

export const uploadQuestions = mutation({
  args: {
    topicId: v.id("topics"),
    questions: v.array(
      v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctOption: v.number(),
        explanation: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    // 1. Get current count of questions for this topic to determine continuity
    // We don't have a direct count, so we scan. (For very large datasets, keep a counter in 'topics' table)
    const existingQuestions = await ctx.db
        .query("questions")
        .filter((q) => q.eq(q.field("topicId"), args.topicId))
        .collect();

    let currentCount = existingQuestions.length;

    // 2. Insert new questions with calculated set number
    for (const q of args.questions) {
      // 0-19 -> Set 1
      // 20-39 -> Set 2
      const set = Math.floor(currentCount / 20) + 1;

      await ctx.db.insert("questions", {
        topicId: args.topicId,
        text: q.text,
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation,
        set: set,
      });

      currentCount++;
    }

    // Update Topic's totalSets
    const maxSet = Math.floor(currentCount / 20) + (currentCount % 20 > 0 ? 1 : 0);
    await ctx.db.patch(args.topicId, { totalSets: maxSet });

    return {
        success: true,
        message: `Uploaded ${args.questions.length} questions. Now total ${currentCount}.`
    };
  },
});
