import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, RefreshCw } from 'lucide-react';

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Life is what happens to you while you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
];

export function RandomQuote() {
  const [currentQuote, setCurrentQuote] = useState('');

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  const displayQuote = currentQuote.length > 40 
    ? currentQuote.substring(0, 37) + '...' 
    : currentQuote;

  return (
    <Card className="border-0 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground flex-1 min-w-0" title={currentQuote}>
            {displayQuote}
          </span>
          <button 
            onClick={getRandomQuote}
            className="opacity-60 hover:opacity-100 hover:rotate-180 transition-all duration-300"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}