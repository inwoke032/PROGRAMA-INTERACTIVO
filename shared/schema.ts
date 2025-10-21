import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Exercise data structure (in-memory, not in DB)
export interface Exercise {
  id: string;
  sectionId: 'variables' | 'colecciones' | 'bucles' | 'funciones';
  prompt: string;
  starterCode: string;
  expectedResult: any;
  resultType: 'integer' | 'float' | 'string' | 'boolean' | 'list' | 'dict';
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  explanation: string;
}

// User progress for each exercise
export interface ExerciseProgress {
  exerciseId: string;
  sectionId: string;
  completed: boolean;
  attempts: number;
  lastAttemptDate: string;
  timeSpent: number; // in seconds
  codeSubmitted?: string;
}

// User statistics
export interface UserStats {
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  exercisesCompleted: number;
  totalTimeSpent: number; // in seconds
  exerciseProgress: Record<string, ExerciseProgress>; // key: exerciseId
  unlockedAchievements: string[];
}

// Achievement structure
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (stats: UserStats) => boolean;
}

// Section metadata
export interface Section {
  id: 'variables' | 'colecciones' | 'bucles' | 'funciones';
  title: string;
  description: string;
  icon: string;
  totalExercises: number;
  estimatedTime: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalXP: number;
  level: number;
  exercisesCompleted: number;
  rank: number;
}

// AI hint request/response
export interface HintRequest {
  exercisePrompt: string;
  userCode: string;
  errorMessage?: string;
  hintLevel: 1 | 2 | 3;
}

export interface HintResponse {
  hint: string;
  explanation?: string;
}

// Zod schemas for API validation
export const exerciseProgressSchema = z.object({
  exerciseId: z.string(),
  sectionId: z.enum(['variables', 'colecciones', 'bucles', 'funciones']),
  completed: z.boolean(),
  attempts: z.number().int().min(0),
  lastAttemptDate: z.string(),
  timeSpent: z.number().min(0),
  codeSubmitted: z.string().optional(),
});

export const userStatsSchema = z.object({
  userId: z.string(),
  totalXP: z.number().int().min(0),
  level: z.number().int().min(1),
  currentStreak: z.number().int().min(0),
  longestStreak: z.number().int().min(0),
  lastActiveDate: z.string(),
  exercisesCompleted: z.number().int().min(0),
  totalTimeSpent: z.number().min(0),
  exerciseProgress: z.record(z.string(), exerciseProgressSchema),
  unlockedAchievements: z.array(z.string()),
});

export const hintRequestSchema = z.object({
  exercisePrompt: z.string(),
  userCode: z.string(),
  errorMessage: z.string().optional(),
  hintLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export const submitCodeSchema = z.object({
  exerciseId: z.string(),
  sectionId: z.enum(['variables', 'colecciones', 'bucles', 'funciones']),
  code: z.string(),
  timeSpent: z.number().min(0),
});

export type SubmitCodeRequest = z.infer<typeof submitCodeSchema>;
