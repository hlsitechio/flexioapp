import { Quote } from 'lucide-react';
import { useGenericTool } from '@/hooks/useGenericTool';
import { ToolContainer } from '@/components/shared/ToolContainer';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

interface RandomQuoteState {
  currentQuote: Quote;
  history: Quote[];
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
];

const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const initialState: RandomQuoteState = {
  currentQuote: getRandomQuote(),
  history: [],
};

export function RandomQuote() {
  const { data: state, updateData: setState } = useGenericTool(initialState, 'random-quote');

  const getNewQuote = () => {
    const newQuote = getRandomQuote();
    setState(prev => ({
      currentQuote: newQuote,
      history: [prev.currentQuote, ...prev.history.slice(0, 9)], // Keep last 10
    }));
  };

  const CollapsedContent = () => (
    <div className="flex flex-col items-center space-y-1">
      <Quote className="h-4 w-4 text-primary" />
      <div className="text-xs font-medium text-center">
        Quote
      </div>
      <div className="text-[10px] text-muted-foreground text-center">
        Daily
      </div>
    </div>
  );

  return (
    <ToolContainer 
      title="Random Quote" 
      icon={Quote}
      collapsedContent={<CollapsedContent />}
    >
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <blockquote className="text-sm italic text-foreground leading-relaxed">
            "{state.currentQuote.text}"
          </blockquote>
          <cite className="text-xs text-muted-foreground font-medium">
            — {state.currentQuote.author}
          </cite>
        </div>

        <Button
          onClick={getNewQuote}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Quote
        </Button>

        {state.history.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Recent quotes: {state.history.length}</div>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {state.history.slice(0, 3).map((quote, index) => (
                <div key={index} className="truncate">
                  "{quote.text.slice(0, 40)}..." — {quote.author}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolContainer>
  );
}