import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  TrendingUp,
  Award,
  CheckCircle2,
  LockIcon
} from "lucide-react";
import { SECTIONS, SECTION_ICONS, getXPProgress, calculateLevel } from "@/lib/constants";
import type { UserStats } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  const xpProgress = stats ? getXPProgress(stats.totalXP) : { current: 0, needed: 1000, percentage: 0 };
  const level = stats ? calculateLevel(stats.totalXP) : 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 md:p-12">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
              ¡Bienvenido a PyMaster!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Tu plataforma interactiva para dominar Python. Practica con ejercicios reales, 
              obtén ayuda de IA y sube de nivel mientras aprendes.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="default" className="text-base px-4 py-2">
                Nivel {level}
              </Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                {stats?.totalXP || 0} XP
              </Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">
                <Flame className="w-4 h-4 mr-2" />
                {stats?.currentStreak || 0} días
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ejercicios Completados
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.exercisesCompleted || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                de 400 totales
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Experiencia Total
              </CardTitle>
              <Trophy className="h-5 w-5 text-xp" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.totalXP || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {xpProgress.current}/{xpProgress.needed} para nivel {level + 1}
              </p>
              <Progress value={xpProgress.percentage} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Racha Actual
              </CardTitle>
              <Flame className="h-5 w-5 text-streak" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.currentStreak || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Récord: {stats?.longestStreak || 0} días
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tiempo Total
              </CardTitle>
              <Clock className="h-5 w-5 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {Math.floor((stats?.totalTimeSpent || 0) / 3600)}h
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.floor(((stats?.totalTimeSpent || 0) % 3600) / 60)}m practicando
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sections Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Secciones de Aprendizaje
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECTIONS.map((section, index) => {
              const Icon = SECTION_ICONS[section.icon as keyof typeof SECTION_ICONS];
              const completedInSection = stats 
                ? Object.values(stats.exerciseProgress).filter(
                    p => p.sectionId === section.id && p.completed
                  ).length 
                : 0;
              const progressPercent = (completedInSection / section.totalExercises) * 100;
              const isLocked = index > 0 && completedInSection === 0 && (
                Object.values(stats?.exerciseProgress || {}).filter(
                  p => p.sectionId === SECTIONS[index - 1].id && p.completed
                ).length === 0
              );

              return (
                <Card key={section.id} className="group hover-elevate transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1">{section.title}</CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </div>
                      </div>
                      {isLocked && (
                        <LockIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium text-foreground">
                          {completedInSection}/{section.totalExercises}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{section.estimatedTime}</span>
                      </div>
                      <Link href={`/section/${section.id}`}>
                        <Button 
                          disabled={isLocked}
                          data-testid={`button-start-${section.id}`}
                        >
                          {completedInSection > 0 ? 'Continuar' : 'Comenzar'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        {stats && stats.unlockedAchievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-achievement" />
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.unlockedAchievements.slice(-4).map((achId) => (
                  <div 
                    key={achId}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50"
                  >
                    <span className="text-4xl mb-2">🏆</span>
                    <p className="text-sm font-medium text-foreground">Logro</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
