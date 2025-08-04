import { CheckSquare, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenericTool } from '@/hooks/useGenericTool';

interface TaskCounterState {
  count: number;
  today: number;
  total: number;
  lastReset: string;
}

const initialState: TaskCounterState = {
  count: 0,
  today: 0,
  total: 0,
  lastReset: new Date().toDateString(),
};

export function DashboardTaskCounter() {
  const { data: state, updateData: setState } = useGenericTool(initialState, 'dashboard-task-counter');

  // Reset daily counter if it's a new day
  const today = new Date().toDateString();
  if (state.lastReset !== today) {
    setState(prev => ({
      ...prev,
      today: 0,
      lastReset: today,
    }));
  }

  const increment = () => {
    setState(prev => ({
      ...prev,
      count: prev.count + 1,
      today: prev.today + 1,
      total: prev.total + 1,
    }));
  };

  const decrement = () => {
    setState(prev => ({
      ...prev,
      count: Math.max(0, prev.count - 1),
      today: Math.max(0, prev.today - 1),
    }));
  };

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
            <div className="text-3xl font-bold text-primary mb-1">{state.count}</div>
            <div className="text-sm text-muted-foreground">
              {state.count === 1 ? 'task' : 'tasks'} completed
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Today: {state.today} • Total: {state.total}
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