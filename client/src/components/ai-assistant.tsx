import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { 
  Sparkles, 
  Send, 
  Lightbulb,
  MessageCircle,
  Bot
} from "lucide-react";
import type { Exercise, HintResponse } from "@shared/schema";

interface AIAssistantProps {
  exercise?: Exercise;
  userCode: string;
  errorMessage?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant({ exercise, userCode, errorMessage }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);

  const hintMutation = useMutation({
    mutationFn: async (level: 1 | 2 | 3) => {
      return apiRequest('POST', '/api/hint', {
        exercisePrompt: exercise?.prompt || '',
        userCode,
        errorMessage,
        hintLevel: level,
      });
    },
    onSuccess: (data: HintResponse) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.hint }]);
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('POST', '/api/chat', {
        message,
        context: {
          exercise: exercise?.prompt,
          code: userCode,
          error: errorMessage,
        },
      });
    },
    onSuccess: (data: { response: string }) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    },
  });

  const handleRequestHint = () => {
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `Solicito pista de nivel ${hintLevel}` 
    }]);
    hintMutation.mutate(hintLevel);
    if (hintLevel < 3) setHintLevel(prev => (prev + 1) as 1 | 2 | 3);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    chatMutation.mutate(input);
    setInput("");
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Asistente IA</CardTitle>
            <CardDescription className="text-xs">
              Powered by Gemini
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Acciones Rápidas
          </p>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestHint}
              disabled={hintMutation.isPending || !exercise}
              className="justify-start"
              data-testid="button-hint"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Pista Nivel {hintLevel}
            </Button>
            {errorMessage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMessages(prev => [...prev, { 
                    role: 'user', 
                    content: '¿Por qué mi código tiene un error?' 
                  }]);
                  chatMutation.mutate('Explícame por qué mi código tiene este error: ' + errorMessage);
                }}
                disabled={chatMutation.isPending}
                className="justify-start"
                data-testid="button-explain-error"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Explicar Error
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                ¿Necesitas ayuda? Solicita una pista o haz una pregunta.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
          {(hintMutation.isPending || chatMutation.isPending) && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="min-h-[60px] max-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            data-testid="input-ai-message"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim() || chatMutation.isPending}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
