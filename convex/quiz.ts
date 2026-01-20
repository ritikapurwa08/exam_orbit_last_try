import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getQuestions = query({
  args: {
    topicId: v.id("topics"),
    set: v.number(),
  },
  handler: async (ctx, args) => {
    // Fetch questions for this topic and set
    // We shuffle them on the client or server? Server is better but Convex queries are deterministic.
    // For now, return as is.
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_topic_set", (q) =>
        q.eq("topicId", args.topicId).eq("set", args.set)
      )
      .collect();

    // We shouldn't return correctOption to the client ideally if we want to be secure,
    // but for a simple app sending it is fine.
    // If user wants cheat-proof, we'd need a separate "checkAnswer" action or strip it here.
    // Assuming trust-the-client for now as per previous code style.
    return questions;
  },
});

// 3 Days in Milliseconds
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

export const submitAttempt = mutation({
  args: {
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    set: v.number(),
    score: v.number(),
    totalQuestions: v.number(),
    answers: v.string(), // JSON string
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // 1. Log the attempt unconditionally
    const attemptId = await ctx.db.insert("attempts", {
      userId,
      topicId: args.topicId,
      subejctId: args.subjectId,
      set: args.set,
      score: args.score,
      totalQuestions: args.totalQuestions,
      answers: args.answers,
      completedAt: Date.now(),
    });

    // 2. Check & Update User Progress (Cooldown Logic)
    const existingProgress = await ctx.db
        .query("user_progress")
        .withIndex("by_user_topic_set", (q) =>
            q.eq("userId", userId).eq("topicId", args.topicId).eq("set", args.set)
        )
        .first();

    const now = Date.now();
    let isPractice = false;

    if (existingProgress) {
        if (now < existingProgress.nextValidAttemptAt) {
            // It's a practice run (Cooldown active)
            isPractice = true;
        } else {
            // Valid run after cooldown
            await ctx.db.patch(existingProgress._id, {
                highScore: Math.max(existingProgress.highScore, args.score),
                lastAttemptAt: now,
                nextValidAttemptAt: now + COOLDOWN_MS,
            });
        }
    } else {
        // First ever attempt
        await ctx.db.insert("user_progress", {
            userId,
            topicId: args.topicId,
            set: args.set,
            highScore: args.score,
            lastAttemptAt: now,
            nextValidAttemptAt: now + COOLDOWN_MS,
        });
    }

    // 3. Update User Overall Stats (XP) Only if NOT practice
    if (!isPractice) {
        const stats = await ctx.db
            .query("user_stats")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        const xpEarned = args.score * 10; // 10 XP per point

        if (stats) {
            await ctx.db.patch(stats._id, {
                totalXp: stats.totalXp + xpEarned,
                quizzesTaken: stats.quizzesTaken + 1,
                lastActive: now,
                // Simple average update (approx)
                averageScore: (stats.averageScore * stats.quizzesTaken + args.score) / (stats.quizzesTaken + 1)
            });
        } else {
            await ctx.db.insert("user_stats", {
                userId,
                totalXp: xpEarned,
                quizzesTaken: 1,
                averageScore: args.score, // Corrected logic
                lastActive: now,
            });
        }
    }

    return { attemptId, isPractice };
  },
});

export const getDashboard = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null; // Or handle public view if needed

        const subjects = await ctx.db.query("subjects").collect();
        const topics = await ctx.db.query("topics").collect();

        // Fetch User Progress
        // Optimization: Fetch all progress for user in one go
        const progress = await ctx.db
            .query("user_progress")
            .withIndex("by_user_topic_set", (q) => q.eq("userId", userId))
            .collect();

        // Enrich topics
        const enrichedSubjects = subjects.map(sub => {
            const subTopics = topics.filter(t => t.subjectId === sub._id);
            return {
                ...sub,
                topics: subTopics.map(topic => {
                    const topicProgress = progress.filter(p => p.topicId === topic._id);
                    return {
                        ...topic,
                        userProgress: topicProgress
                    };
                })
            };
        });

        // Get User Stats
        const userStats = await ctx.db
            .query("user_stats")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        return { subjects: enrichedSubjects, stats: userStats };
    }
});

export const getAttempt = query({
  args: { attemptId: v.id("attempts") },
  handler: async (ctx, args) => {
    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt) return null;

    // Also fetch the questions content so we can show review
    // This is optional if client already has them, but good for direct link access
    const questions = await ctx.db
        .query("questions")
        .withIndex("by_topic_set", (q) =>
            q.eq("topicId", attempt.topicId).eq("set", attempt.set)
        )
        .collect();

    // Fetch Subject and Topic names
    const subject = await ctx.db.get(attempt.subejctId);
    const topic = await ctx.db.get(attempt.topicId);

    return {
        ...attempt,
        questions,
        subjectName: subject?.name,
        topicName: topic?.name
    };
  },
});

export const getUserHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const attempts = await ctx.db
      .query("attempts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc") // Most recent first
      .take(50); // Limit to 50 for now

    // Enrich with names
    const history = await Promise.all(
      attempts.map(async (attempt) => {
        const subject = await ctx.db.get(attempt.subejctId);
        const topic = await ctx.db.get(attempt.topicId);
        return {
          ...attempt,
          subjectName: subject?.name || "Unknown Subject",
          topicName: topic?.name || "Unknown Topic",
        };
      })
    );

    return history;
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const stats = await ctx.db
      .query("user_stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return stats;
  },
});
