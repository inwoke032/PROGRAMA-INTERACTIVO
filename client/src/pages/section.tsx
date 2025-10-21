import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Play, 
  Send, 
  Lightbulb, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { SECTIONS, SECTION_ICONS } from "@/lib/constants";
import type { Exercise, UserStats, HintResponse } from "@shared/schema";
import { CodeEditor } from "@/components/code-editor";
import { AIAssistant } from "@/components/ai-assistant";

export default function SectionPage() {
  const [, params] = useRoute("/section/:sectionId");
  const sectionId = params?.sectionId as 'variables' | 'colecciones' | 'bucles' | 'funciones';
  const section = SECTIONS.find(s => s.id === sectionId);
  const Icon = section ? SECTION_ICONS[section.icon as keyof typeof SECTION_ICONS] : null;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const { data: exercises, isLoading: loadingExercises } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises', sectionId],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
  });

  const currentExercise = exercises?.[currentExerciseIndex];

  useEffect(() => {
    if (currentExercise) {
      setCode(currentExercise.starterCode);
      setOutput(null);
      setStartTime(Date.now());
    }
  }, [currentExercise]);

  const submitMutation = useMutation({
    mutationFn: async (userCode: string) => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      return apiRequest('POST', '/api/submit', {
        exerciseId: currentExercise!.id,
        sectionId,
        code: userCode,
        timeSpent,
      });
    },
    onSuccess: (data: { correct: boolean; message: string; xpEarned?: number }) => {
      if (data.correct) {
        setOutput({ type: 'success', message: data.message });
        toast({
          title: "¡Correcto!",
          description: `Has ganado ${data.xpEarned || 0} XP`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
        
        setTimeout(() => {
          if (currentExerciseIndex < (exercises?.length || 0) - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
          }
        }, 2000);
      } else {
        setOutput({ type: 'error', message: data.message });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo verificar la solución",
        variant: "destructive",
      });
    },
  });

  const handleRunCode = () => {
    submitMutation.mutate(code);
  };

  const goToNext = () => {
    if (currentExerciseIndex < (exercises?.length || 0) - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  if (!section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sección no encontrada</h1>
          <Link href="/">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loadingExercises) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const completedInSection = stats 
    ? Object.values(stats.exerciseProgress).filter(
        p => p.sectionId === sectionId && p.completed
      ).length 
    : 0;
  const progressPercent = (completedInSection / section.totalExercises) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              {Icon && (
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground">{section.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Ejercicio {currentExerciseIndex + 1} de {exercises?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progreso Total</p>
                <p className="text-sm font-medium">{completedInSection}/{section.totalExercises}</p>
              </div>
              <Progress value={progressPercent} className="w-32 h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Exercise Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Exercise Prompt */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      Desafío {currentExerciseIndex + 1}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {currentExercise?.prompt}
                    </CardDescription>
                  </div>
                  <Badge variant={currentExercise?.difficulty === 'easy' ? 'secondary' : currentExercise?.difficulty === 'medium' ? 'default' : 'destructive'}>
                    {currentExercise?.difficulty === 'easy' ? 'Fácil' : currentExercise?.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Editor de Código</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAI(!showAI)}
                      data-testid="button-toggle-ai"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Asistente IA
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language="python"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentExerciseIndex === 0}
                  data-testid="button-previous"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={goToNext}
                  disabled={currentExerciseIndex >= (exercises?.length || 0) - 1}
                  data-testid="button-next"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <Button
                size="lg"
                onClick={handleRunCode}
                disabled={submitMutation.isPending}
                data-testid="button-submit"
                className="min-w-32"
              >
                {submitMutation.isPending ? (
                  "Verificando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Verificar
                  </>
                )}
              </Button>
            </div>

            {/* Output */}
            {output && (
              <Card className={output.type === 'success' ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {output.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium mb-1 ${output.type === 'success' ? 'text-success' : 'text-destructive'}`}>
                        {output.type === 'success' ? '¡Correcto!' : 'Incorrecto'}
                      </p>
                      <p className="text-sm text-foreground">{output.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Assistant Sidebar */}
          <div className={`${showAI ? 'block' : 'hidden lg:block'}`}>
            <AIAssistant
              exercise={currentExercise}
              userCode={code}
              errorMessage={output?.type === 'error' ? output.message : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
