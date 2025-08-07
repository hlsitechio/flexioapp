import { useState } from 'react';
import { CheckSquare, Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetShell } from './WidgetShell';

export function DashboardTaskCounter() {
  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const addTask = () => setTaskCount((prev) => prev + 1);

  const completeTask = () => {
    if (taskCount > 0) {
      setTaskCount((prev) => prev - 1);
      setCompletedTasks((prev) => prev + 1);
    }
  };

  const resetTasks = () => {
    setTaskCount(0);
    setCompletedTasks(0);
  };

  const totalTasks = taskCount + completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isEmpty = totalTasks === 0;

  return (
    <WidgetShell
      title="Task Counter"
      icon={<CheckSquare className="h-5 w-5 text-primary" />}
      actions={
        <Button onClick={resetTasks} size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      }
      variant="subtle"
      status={isEmpty ? 'empty' : 'default'}
      size="md"
    >
      {!isEmpty && (
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">{taskCount}</div>
            <p className="text-sm text-muted-foreground">Active Tasks</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button onClick={addTask} size="sm" variant="outline" className="h-8 w-8 p-0" aria-label="Add task">
              <Plus className="h-4 w-4" />
            </Button>

            <Button onClick={completeTask} size="sm" variant="default" className="px-4" disabled={taskCount === 0} aria-label="Complete task">
              <Minus className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Completed: {completedTasks} ({completionRate}%)</div>
            <div className="w-full bg-secondary rounded-full h-2" role="progressbar" aria-valuenow={completionRate} aria-valuemin={0} aria-valuemax={100} aria-label="Completion rate">
              <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
