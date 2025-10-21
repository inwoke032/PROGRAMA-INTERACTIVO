import { type User, type InsertUser, type UserStats, type ExerciseProgress, type LeaderboardEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User stats and progress
  getUserStats(userId: string): Promise<UserStats>;
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;
  updateExerciseProgress(userId: string, exerciseId: string, progress: ExerciseProgress): Promise<void>;
  unlockAchievement(userId: string, achievementId: string): Promise<void>;

  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userStats: Map<string, UserStats>;

  constructor() {
    this.users = new Map();
    this.userStats = new Map();
    this.initializeDemoUser();
  }

  private initializeDemoUser() {
    const demoUserId = "demo-user-1";
    const demoUser: User = {
      id: demoUserId,
      username: "demo",
      password: "demo",
    };
    this.users.set(demoUserId, demoUser);

    const now = new Date().toISOString();
    const demoStats: UserStats = {
      userId: demoUserId,
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: now,
      exercisesCompleted: 0,
      totalTimeSpent: 0,
      exerciseProgress: {},
      unlockedAchievements: [],
    };
    this.userStats.set(demoUserId, demoStats);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);

    // Initialize stats for new user
    const now = new Date().toISOString();
    const initialStats: UserStats = {
      userId: id,
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: now,
      exercisesCompleted: 0,
      totalTimeSpent: 0,
      exerciseProgress: {},
      unlockedAchievements: [],
    };
    this.userStats.set(id, initialStats);

    return user;
  }

  async getUserStats(userId: string): Promise<UserStats> {
    let stats = this.userStats.get(userId);
    if (!stats) {
      const now = new Date().toISOString();
      stats = {
        userId,
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: now,
        exercisesCompleted: 0,
        totalTimeSpent: 0,
        exerciseProgress: {},
        unlockedAchievements: [],
      };
      this.userStats.set(userId, stats);
    }
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const current = await this.getUserStats(userId);
    const updated = { ...current, ...updates };
    this.userStats.set(userId, updated);
    return updated;
  }

  async updateExerciseProgress(userId: string, exerciseId: string, progress: ExerciseProgress): Promise<void> {
    const stats = await this.getUserStats(userId);
    stats.exerciseProgress[exerciseId] = progress;
    this.userStats.set(userId, stats);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const stats = await this.getUserStats(userId);
    if (!stats.unlockedAchievements.includes(achievementId)) {
      stats.unlockedAchievements.push(achievementId);
      this.userStats.set(userId, stats);
    }
  }

  async getLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    const entries: LeaderboardEntry[] = [];

    for (const [userId, stats] of this.userStats.entries()) {
      const user = await this.getUser(userId);
      if (user) {
        entries.push({
          userId,
          username: user.username,
          totalXP: stats.totalXP,
          level: stats.level,
          exercisesCompleted: stats.exercisesCompleted,
          rank: 0, // Will be set after sorting
        });
      }
    }

    entries.sort((a, b) => b.totalXP - a.totalXP);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, limit);
  }
}

export const storage = new MemStorage();
