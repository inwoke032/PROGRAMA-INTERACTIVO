import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import type { LeaderboardEntry } from "@shared/schema";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-xp" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-warning" />;
    return null;
  };

  const getRankBadgeVariant = (rank: number): "default" | "secondary" | "outline" => {
    if (rank === 1) return "default";
    if (rank <= 3) return "secondary";
    return "outline";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-16 w-full" />
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Tabla de Clasificación</h1>
          <p className="text-muted-foreground">
            Compite con otros estudiantes y alcanza la cima
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Estudiantes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {leaderboard?.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 hover-elevate transition-all ${
                    index < 3 ? 'bg-muted/30' : ''
                  }`}
                  data-testid={`leaderboard-entry-${index}`}
                >
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(entry.rank) || (
                      <span className="text-lg font-bold text-muted-foreground">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {entry.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{entry.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.exercisesCompleted} ejercicios completados
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <Badge variant={getRankBadgeVariant(entry.rank)} className="font-mono">
                      Nivel {entry.level}
                    </Badge>
                    <p className="text-sm font-medium text-xp">
                      {entry.totalXP.toLocaleString()} XP
                    </p>
                  </div>
                </div>
              ))}

              {(!leaderboard || leaderboard.length === 0) && (
                <div className="p-12 text-center">
                  <Award className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aún no hay clasificaciones. ¡Sé el primero!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
