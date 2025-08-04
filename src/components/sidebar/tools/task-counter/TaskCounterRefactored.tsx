import { CheckSquare } from 'lucide-react';
import { useGenericTool } from '@/hooks/useGenericTool';
import { ToolContainer } from '@/components/shared/ToolContainer';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

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

export function TaskCounter() {
  const { data: state, updateData: setState } = useGenericTool(initialState, 'task-counter');

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

  const reset = () => {
    setState(prev => ({
      ...prev,
      count: 0,
    }));
  };

  const CollapsedContent = () => (
    <div className="flex flex-col items-center space-y-1">
      <CheckSquare className="h-4 w-4 text-primary" />
      <div className="text-xs font-medium text-center">
        {state.count}
      </div>
      <div className="text-[10px] text-muted-foreground text-center">
        Tasks
      </div>
    </div>
  );

  return (
    <ToolContainer 
      title="Task Counter" 
      icon={CheckSquare}
      collapsedContent={<CollapsedContent />}
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">{state.count}</div>
          <div className="text-sm text-muted-foreground">
            {state.count === 1 ? 'task' : 'tasks'} completed
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <Button 
            onClick={decrement}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button 
            onClick={increment}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <div>Today: {state.today}</div>
          <div>Total: {state.total}</div>
        </div>

        {state.count > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="w-full"
          >
            Reset Counter
          </Button>
        )}
      </div>
    </ToolContainer>
  );
}