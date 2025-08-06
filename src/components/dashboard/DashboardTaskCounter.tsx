
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardTaskCounter() {
  const [taskCount, setTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  const addTask = () => {
    setTaskCount(prev => prev + 1);
  };

  const completeTask = () => {
    if (taskCount > 0) {
      setTaskCount(prev => prev - 1);
      setCompletedTasks(prev => prev + 1);
    }
  };

  const resetTasks = () => {
    setTaskCount(0);
    setCompletedTasks(0);
  };

  const totalTasks = taskCount + completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card className="h-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Task Counter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {taskCount}
            </div>
            <p className="text-sm text-muted-foreground">Active Tasks</p>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={addTask}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={completeTask}
              size="sm"
              variant="default"
              className="px-4"
              disabled={taskCount === 0}
            >
              <Minus className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Completed: {completedTasks} ({completionRate}%)
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <Button
            onClick={resetTasks}
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
