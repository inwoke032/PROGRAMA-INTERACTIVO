import type { Achievement } from "./schema";

export const XP_PER_LEVEL = 1000;

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getXPForNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  return currentLevel * XP_PER_LEVEL;
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * XP_PER_LEVEL;
  const xpForNextLevel = currentLevel * XP_PER_LEVEL;
  const current = totalXP - xpForCurrentLevel;
  const needed = xpForNextLevel - xpForCurrentLevel;
  const percentage = (current / needed) * 100;
  
  return { current, needed, percentage };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'Primeros Pasos',
    description: 'Completa tu primer ejercicio',
    icon: 'Target',
    xpReward: 50,
    condition: (stats) => stats.exercisesCompleted >= 1,
  },
  {
    id: 'streak_3',
    title: 'Constancia',
    description: 'Mantén una racha de 3 días',
    icon: 'Flame',
    xpReward: 100,
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Dedicación',
    description: 'Mantén una racha de 7 días',
    icon: 'Zap',
    xpReward: 250,
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'completed_10',
    title: 'Aprendiz',
    description: 'Completa 10 ejercicios',
    icon: 'BookOpen',
    xpReward: 150,
    condition: (stats) => stats.exercisesCompleted >= 10,
  },
  {
    id: 'completed_50',
    title: 'Practicante',
    description: 'Completa 50 ejercicios',
    icon: 'GraduationCap',
    xpReward: 500,
    condition: (stats) => stats.exercisesCompleted >= 50,
  },
  {
    id: 'completed_100',
    title: 'Experto',
    description: 'Completa 100 ejercicios',
    icon: 'Trophy',
    xpReward: 1000,
    condition: (stats) => stats.exercisesCompleted >= 100,
  },
  {
    id: 'section_complete',
    title: 'Maestro de Sección',
    description: 'Completa todos los ejercicios de una sección',
    icon: 'Star',
    xpReward: 750,
    condition: (stats) => {
      const sectionCounts = new Map<string, number>();
      Object.values(stats.exerciseProgress).forEach((progress) => {
        if (progress.completed) {
          sectionCounts.set(progress.sectionId, (sectionCounts.get(progress.sectionId) || 0) + 1);
        }
      });
      return Array.from(sectionCounts.values()).some(count => count >= 100);
    },
  },
  {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Completa 10 ejercicios en el primer intento',
    icon: 'Gem',
    xpReward: 300,
    condition: (stats) => {
      return Object.values(stats.exerciseProgress).filter(
        p => p.completed && p.attempts === 1
      ).length >= 10;
    },
  },
];
