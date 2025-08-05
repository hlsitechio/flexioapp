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
    <Card className="animate-fade-in relative overflow-hidden bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-blue-500/15 border-purple-300/30 backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-violet-600/5 pointer-events-none" />
      
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg">
            <CheckSquare className="h-4 w-4 text-white" />
          </div>
          <span className="text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text font-semibold">
            Task Counter
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-br from-purple-600 via-violet-500 to-blue-500 bg-clip-text mb-1 drop-shadow-sm">
              {state.count}
            </div>
            <div className="text-sm text-muted-foreground">
              {state.count === 1 ? 'task' : 'tasks'} completed
            </div>
            <div className="text-xs text-muted-foreground mt-2 p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-300/20">
              Today: <span className="text-purple-600 font-medium">{state.today}</span> • Total: <span className="text-violet-600 font-medium">{state.total}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Button 
              onClick={increment}
              size="sm"
              className="h-9 w-9 p-0 bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
            <Button 
              onClick={decrement}
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 border-purple-300/50 hover:bg-purple-500/10 hover:border-purple-400/60 transition-all duration-200"
            >
              <Minus className="h-4 w-4 text-purple-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}