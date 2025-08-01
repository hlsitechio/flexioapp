import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare, Plus, Minus } from 'lucide-react';

export function TaskCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));

  return (
    <Card className="border-0 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {count} tasks
          </span>
          <div className="ml-auto flex gap-1">
            <button 
              onClick={decrement}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button 
              onClick={increment}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}