
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, Circle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHabitTracker() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink Water', completed: true },
    { id: 2, name: 'Exercise', completed: false },
    { id: 3, name: 'Read', completed: true },
    { id: 4, name: 'Meditate', completed: false },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(habit => habit.completed).length;
  const completionRate = Math.round((completedCount / habits.length) * 100);

  return (
    <Card className="h-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
          Habit Tracker
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {completedCount}/{habits.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {completionRate}% completed today
            </p>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            {habits.map((habit) => (
              <div 
                key={habit.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                onClick={() => toggleHabit(habit.id)}
              >
                {habit.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${habit.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {habit.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
