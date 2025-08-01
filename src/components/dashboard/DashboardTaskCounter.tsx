import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardTaskCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckSquare className="h-5 w-5 text-primary" />
          Task Counter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-3xl font-bold text-primary mb-1">{count}</div>
            <div className="text-sm text-muted-foreground">
              {count === 1 ? 'task' : 'tasks'} completed
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Button 
              onClick={increment}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              onClick={decrement}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}