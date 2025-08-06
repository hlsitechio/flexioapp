
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const prompts = [
  "Write a compelling product description for a smart fitness tracker",
  "Create a social media strategy for a local coffee shop",
  "Draft an email to reconnect with a former colleague",
  "Brainstorm creative team building activities for remote workers",
  "Design a morning routine for improved productivity",
  "Write a thank you message for excellent customer service",
  "Create a list of interview questions for hiring a developer",
  "Plan a surprise birthday party on a budget",
];

export function DashboardPromptsGallery() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const getRandomPrompt = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setCurrentPrompt(prompts[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  const copyPrompt = async () => {
    if (currentPrompt) {
      await navigator.clipboard.writeText(currentPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Prompt Ideas
          <Button 
            onClick={getRandomPrompt}
            size="sm"
            variant="ghost"
            className="ml-auto h-8 w-8 p-0"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentPrompt ? (
            <>
              <div className="p-3 bg-background/50 rounded-md border border-border/50">
                <p className="text-sm text-foreground leading-relaxed">
                  {currentPrompt}
                </p>
              </div>
              <Button
                onClick={copyPrompt}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </Button>
            </>
          ) : (
            <div 
              className="min-h-[100px] p-3 rounded-md border border-input bg-background/50 cursor-pointer hover:bg-accent transition-colors flex items-center justify-center"
              onClick={getRandomPrompt}
            >
              <p className="text-sm text-muted-foreground italic text-center">
                Click refresh to get a creative prompt idea...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
