import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Award, Lock, CheckCircle2 } from "lucide-react";
import { ACHIEVEMENTS, ACHIEVEMENT_ICONS } from "@/lib/constants";
import type { UserStats } from "@shared/schema";

export default function Achievements() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        </div>
      </div>
    );
  }

  const unlockedIds = new Set(stats?.unlockedAchievements || []);
  const unlockedCount = unlockedIds.size;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Logros</h1>
          <p className="text-muted-foreground">
            Desbloquea logros mientras aprendes y progresas
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progreso General</CardTitle>
              <Badge variant="secondary" className="text-base">
                {unlockedCount}/{totalCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={completionPercent} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {completionPercent.toFixed(0)}% de logros desbloqueados
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const canUnlock = stats ? achievement.condition(stats) : false;
            const Icon = ACHIEVEMENT_ICONS[achievement.icon as keyof typeof ACHIEVEMENT_ICONS];

            return (
              <Card
                key={achievement.id}
                className={`group hover-elevate transition-all ${
                  isUnlocked ? '' : 'opacity-60'
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-3 rounded-lg ${isUnlocked ? 'bg-achievement/10' : 'bg-muted'}`}>
                          <Icon className={`h-8 w-8 ${isUnlocked ? 'text-achievement' : 'text-muted-foreground'}`} />
                        </div>
                        {isUnlocked && (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <CardTitle className="text-lg mb-1">
                        {achievement.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {achievement.description}
                      </CardDescription>
                    </div>
                    {!isUnlocked && (
                      <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={isUnlocked ? "default" : "outline"} className="font-mono">
                      +{achievement.xpReward} XP
                    </Badge>
                    {isUnlocked && (
                      <span className="text-xs font-medium text-success">
                        Desbloqueado
                      </span>
                    )}
                    {!isUnlocked && canUnlock && (
                      <span className="text-xs font-medium text-warning">
                        Casi desbloqueado
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
