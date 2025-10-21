import { Section } from "@shared/schema";
import { Code2, Database, GitBranch, FunctionSquare, Target, Flame, Zap, BookOpen, GraduationCap, Trophy, Star, Gem } from "lucide-react";
export { ACHIEVEMENTS, calculateLevel, getXPForNextLevel, getXPProgress, XP_PER_LEVEL } from "@shared/constants";

export const SECTIONS: Section[] = [
  {
    id: 'variables',
    title: 'Variables Fundamentales',
    description: 'Domina enteros, flotantes, cadenas y operaciones básicas',
    icon: 'Code2',
    totalExercises: 100,
    estimatedTime: '2-3 horas',
  },
  {
    id: 'colecciones',
    title: 'Colecciones de Datos',
    description: 'Listas, diccionarios y manipulación de estructuras',
    icon: 'Database',
    totalExercises: 100,
    estimatedTime: '3-4 horas',
  },
  {
    id: 'bucles',
    title: 'Bucles y Condicionales',
    description: 'Control de flujo con for, if, else y while',
    icon: 'GitBranch',
    totalExercises: 100,
    estimatedTime: '3-4 horas',
  },
  {
    id: 'funciones',
    title: 'Funciones',
    description: 'Definición, parámetros, return y scope',
    icon: 'FunctionSquare',
    totalExercises: 100,
    estimatedTime: '4-5 horas',
  },
];

export const SECTION_ICONS = {
  Code2,
  Database,
  GitBranch,
  FunctionSquare,
};

export const ACHIEVEMENT_ICONS = {
  Target,
  Flame,
  Zap,
  BookOpen,
  GraduationCap,
  Trophy,
  Star,
  Gem,
};
