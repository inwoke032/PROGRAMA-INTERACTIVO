import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Trophy, 
  Flame, 
  Clock,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import { getXPProgress, calculateLevel } from "@/lib/constants";
import type { UserStats } from "@shared/schema";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Profile() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    );
  }

  const xpProgress = stats ? getXPProgress(stats.totalXP) : { current: 0, needed: 1000, percentage: 0 };
  const level = stats ? calculateLevel(stats.totalXP) : 1;

  // Calculate section progress
  const sectionProgress = SECTIONS.map(section => {
    const completed = stats 
      ? Object.values(stats.exerciseProgress).filter(
          p => p.sectionId === section.id && p.completed
        ).length 
      : 0;
    return {
      name: section.title.split(' ')[0],
      completados: completed,
      total: section.totalExercises,
    };
  });

  // Mock time data (would come from backend in real app)
  const weeklyData = [
    { day: 'Lun', minutos: 45 },
    { day: 'Mar', minutos: 60 },
    { day: 'Mié', minutos: 30 },
    { day: 'Jue', minutos: 75 },
    { day: 'Vie', minutos: 50 },
    { day: 'Sáb', minutos: 90 },
    { day: 'Dom', minutos: 40 },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 flex-wrap">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  PY
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">
                    Estudiante Python
                  </h1>
                  <p className="text-muted-foreground">
                    Miembro desde {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="default" className="text-base px-4 py-2">
                    <Trophy className="w-4 h-4 mr-2" />
                    Nivel {level}
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {stats?.totalXP || 0} XP
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    <Flame className="w-4 h-4 mr-2" />
                    {stats?.currentStreak || 0} días
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {stats?.unlockedAchievements.length || 0} logros
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso al siguiente nivel</span>
                    <span className="font-medium">
                      {xpProgress.current}/{xpProgress.needed} XP
                    </span>
                  </div>
                  <Progress value={xpProgress.percentage} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Progreso por Sección
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sectionProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="completados" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Actividad Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minutos" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--success))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Section Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Sección</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sectionProgress}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="completados"
                  >
                    {sectionProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-chart-1" />
                  <span className="text-sm font-medium">Tiempo total</span>
                </div>
                <span className="font-bold">{Math.floor((stats?.totalTimeSpent || 0) / 3600)}h {Math.floor(((stats?.totalTimeSpent || 0) % 3600) / 60)}m</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-chart-2" />
                  <span className="text-sm font-medium">Precisión</span>
                </div>
                <span className="font-bold">
                  {stats?.exercisesCompleted 
                    ? Math.round((stats.exercisesCompleted / Object.keys(stats.exerciseProgress).length) * 100)
                    : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-chart-3" />
                  <span className="text-sm font-medium">Días activos</span>
                </div>
                <span className="font-bold">{stats?.currentStreak || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-chart-4" />
                  <span className="text-sm font-medium">Logros</span>
                </div>
                <span className="font-bold">{stats?.unlockedAchievements.length || 0}/8</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
