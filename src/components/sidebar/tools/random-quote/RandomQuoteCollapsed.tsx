import { Quote } from 'lucide-react';

interface RandomQuoteCollapsedProps {
  currentQuote: string;
  onRefresh: () => void;
}

export function RandomQuoteCollapsed({ currentQuote, onRefresh }: RandomQuoteCollapsedProps) {
  return (
    <div className="flex justify-center">
      <button 
        onClick={onRefresh}
        className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
        title={currentQuote}
      >
        <Quote className="h-4 w-4" />
      </button>
    </div>
  );
}