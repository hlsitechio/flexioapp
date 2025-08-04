import { useState, useEffect } from 'react';
import { Target, Plus, Flame, Check, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  name: string;
  description?: string;
  target_frequency: number;
  streak_count: number;
  longest_streak: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  notes?: string;
}

export function DashboardHabitTracker() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('completed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      if (habitsError) throw habitsError;
      if (logsError) throw logsError;

      setHabits(habitsData || []);
      setHabitLogs(logsData || []);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: user.user.id,
          name: newHabitName.trim(),
          target_frequency: 1
        }])
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [data, ...prev]);
      setNewHabitName('');
      toast({
        title: "Success",
        description: "Habit added successfully!",
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      });
    }
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const today = new Date().toISOString().split('T')[0];
      const existingLog = habitLogs.find(log => 
        log.habit_id === habitId && 
        log.completed_at.startsWith(today)
      );

      if (existingLog) {
        // Remove completion
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('id', existingLog.id);

        if (error) throw error;

        setHabitLogs(prev => prev.filter(log => log.id !== existingLog.id));
        
        // Update streak
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const { error: updateError } = await supabase
            .from('habits')
            .update({ streak_count: Math.max(0, habit.streak_count - 1) })
            .eq('id', habitId);

          if (updateError) throw updateError;
          
          setHabits(prev => prev.map(h => 
            h.id === habitId 
              ? { ...h, streak_count: Math.max(0, h.streak_count - 1) }
              : h
          ));
        }
      } else {
        // Add completion
        const { data, error } = await supabase
          .from('habit_logs')
          .insert([{
            user_id: user.user.id,
            habit_id: habitId
          }])
          .select()
          .single();

        if (error) throw error;

        setHabitLogs(prev => [...prev, data]);
        
        // Update streak
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const newStreak = habit.streak_count + 1;
          const newLongestStreak = Math.max(habit.longest_streak, newStreak);
          
          const { error: updateError } = await supabase
            .from('habits')
            .update({ 
              streak_count: newStreak,
              longest_streak: newLongestStreak
            })
            .eq('id', habitId);

          if (updateError) throw updateError;
          
          setHabits(prev => prev.map(h => 
            h.id === habitId 
              ? { ...h, streak_count: newStreak, longest_streak: newLongestStreak }
              : h
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    }
  };

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return habitLogs.some(log => 
      log.habit_id === habitId && 
      log.completed_at.startsWith(today)
    );
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const completedToday = habits.filter(habit => isHabitCompletedToday(habit.id)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <span>Habit Tracker</span>
          <Badge variant="secondary" className="ml-auto">
            {completedToday}/{totalHabits}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Today's Progress</span>
            <span className="text-muted-foreground">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Add new habit */}
        <div className="flex space-x-2">
          <Input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button
            onClick={addHabit}
            size="sm"
            disabled={!newHabitName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Habits list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              Loading habits...
            </div>
          ) : habits.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No habits yet. Add one above to get started!
            </div>
          ) : (
            habits.map((habit) => {
              const completed = isHabitCompletedToday(habit.id);
              return (
                <div
                  key={habit.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border bg-muted"
                >
                  <Checkbox
                    checked={completed}
                    onCheckedChange={() => toggleHabitCompletion(habit.id)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${completed ? 'line-through text-muted-foreground' : ''}`}>
                      {habit.name}
                    </div>
                    {habit.streak_count > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          {habit.streak_count} day streak
                        </span>
                        {habit.longest_streak > habit.streak_count && (
                          <span className="text-xs text-muted-foreground">
                            (best: {habit.longest_streak})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {completed && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        {habits.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedToday}</div>
              <div className="text-xs text-muted-foreground">Completed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {Math.max(...habits.map(h => h.streak_count), 0)}
              </div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}