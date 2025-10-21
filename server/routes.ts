import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAllExercises } from "./exercises";
import { getHint, chatWithAI } from "./gemini";
import { ACHIEVEMENTS, calculateLevel } from "@shared/constants";
import { hintRequestSchema, submitCodeSchema } from "@shared/schema";
import type { HintRequest, HintResponse, SubmitCodeRequest } from "@shared/schema";

const DEMO_USER_ID = "demo-user-1";
const exercisesMap = getAllExercises();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all exercises for a section
  app.get("/api/exercises/:sectionId", async (req, res) => {
    try {
      const { sectionId } = req.params;
      const exercises = exercisesMap.get(sectionId);
      
      if (!exercises) {
        return res.status(404).json({ error: "Section not found" });
      }

      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: "Failed to get exercises" });
    }
  });

  // Get user stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(DEMO_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // Submit code for verification
  app.post("/api/submit", async (req, res) => {
    try {
      const validation = submitCodeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const { exerciseId, sectionId, code, timeSpent } = validation.data;

      const exercises = exercisesMap.get(sectionId);
      const exercise = exercises?.find(e => e.id === exerciseId);

      if (!exercise) {
        return res.status(404).json({ error: "Exercise not found" });
      }

      const stats = await storage.getUserStats(DEMO_USER_ID);
      const existingProgress = stats.exerciseProgress[exerciseId];
      const isFirstCompletion = !existingProgress?.completed;
      const attempts = (existingProgress?.attempts || 0) + 1;

      // Simple code verification (in production, would use Pyodide)
      let correct = false;
      let message = "";

      // Extract the result variable from code
      const resultMatch = code.match(/resultado\s*=\s*(.+)/);
      if (!resultMatch) {
        message = "No se encontró la variable 'resultado' en tu código. Asegúrate de guardar tu respuesta en una variable llamada 'resultado'.";
      } else {
        const userResult = resultMatch[1].trim();
        const expectedStr = String(exercise.expectedResult);
        
        // Basic comparison (would be more sophisticated with Pyodide)
        if (userResult.includes(expectedStr) || userResult === expectedStr) {
          correct = true;
          message = "¡Excelente trabajo! Tu solución es correcta.";
        } else {
          message = `El resultado no es correcto. Se esperaba: ${expectedStr}, pero tu código produce un resultado diferente.`;
        }
      }

      if (correct) {
        // Calculate XP reward
        let xpEarned = 10; // Base XP
        if (isFirstCompletion) {
          xpEarned = 50; // First time bonus
          if (attempts === 1) {
            xpEarned = 100; // Perfect score bonus
          }
        }

        // Update exercise progress
        const now = new Date().toISOString();
        await storage.updateExerciseProgress(DEMO_USER_ID, exerciseId, {
          exerciseId,
          sectionId,
          completed: true,
          attempts,
          lastAttemptDate: now,
          timeSpent: (existingProgress?.timeSpent || 0) + timeSpent,
          codeSubmitted: code,
        });

        // Update user stats
        const completedCount = Object.values(stats.exerciseProgress).filter(p => p.completed).length + (isFirstCompletion ? 1 : 0);
        const newTotalXP = stats.totalXP + xpEarned;
        const newLevel = calculateLevel(newTotalXP);

        // Update streak
        const today = new Date().toDateString();
        const lastActive = new Date(stats.lastActiveDate).toDateString();
        let newStreak = stats.currentStreak;
        
        if (today !== lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = new Date(stats.lastActiveDate).toDateString() === yesterday.toDateString();
          
          newStreak = wasYesterday ? stats.currentStreak + 1 : 1;
        }

        await storage.updateUserStats(DEMO_USER_ID, {
          totalXP: newTotalXP,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: Math.max(stats.longestStreak, newStreak),
          lastActiveDate: now,
          exercisesCompleted: completedCount,
          totalTimeSpent: stats.totalTimeSpent + timeSpent,
        });

        // Check and unlock achievements
        const updatedStats = await storage.getUserStats(DEMO_USER_ID);
        for (const achievement of ACHIEVEMENTS) {
          if (!updatedStats.unlockedAchievements.includes(achievement.id) && achievement.condition(updatedStats)) {
            await storage.unlockAchievement(DEMO_USER_ID, achievement.id);
            await storage.updateUserStats(DEMO_USER_ID, {
              totalXP: updatedStats.totalXP + achievement.xpReward,
            });
            xpEarned += achievement.xpReward;
          }
        }

        res.json({ correct: true, message, xpEarned });
      } else {
        // Update attempts without completing
        const now = new Date().toISOString();
        await storage.updateExerciseProgress(DEMO_USER_ID, exerciseId, {
          exerciseId,
          sectionId,
          completed: false,
          attempts,
          lastAttemptDate: now,
          timeSpent: (existingProgress?.timeSpent || 0) + timeSpent,
          codeSubmitted: code,
        });

        res.json({ correct: false, message });
      }
    } catch (error) {
      console.error("Submit error:", error);
      res.status(500).json({ error: "Failed to submit code" });
    }
  });

  // Get AI hint
  app.post("/api/hint", async (req, res) => {
    try {
      const validation = hintRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const { exercisePrompt, userCode, errorMessage, hintLevel } = validation.data;

      const hint = await getHint(exercisePrompt, userCode, errorMessage, hintLevel);

      const response: HintResponse = {
        hint,
        explanation: "Intenta aplicar esta pista a tu código.",
      };

      res.json(response);
    } catch (error) {
      console.error("Hint error:", error);
      res.status(500).json({ error: "Failed to get hint" });
    }
  });

  // Chat with AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Invalid message" });
      }

      const response = await chatWithAI(message, context || {});

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to chat with AI" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard(20);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
