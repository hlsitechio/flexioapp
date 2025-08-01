import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Life is what happens to you while you're busy making other plans. - John Lennon", 
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your limitation—it's only your imagination.",
];

export function DashboardRandomQuote() {
  const [currentQuote, setCurrentQuote] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  const [quoteText, author] = currentQuote.split(' - ');

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Quote className="h-5 w-5 text-primary" />
          Daily Inspiration
          <Button 
            onClick={getRandomQuote}
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
        <div className="text-center space-y-4">
          <blockquote className="text-base italic text-foreground leading-relaxed">
            "{quoteText}"
          </blockquote>
          {author && (
            <cite className="text-sm text-muted-foreground font-medium">
              — {author}
            </cite>
          )}
        </div>
      </CardContent>
    </Card>
  );
}