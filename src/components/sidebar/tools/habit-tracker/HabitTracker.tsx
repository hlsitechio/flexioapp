import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Check, Plus, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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

export function HabitTracker() {
  const { state } = useSidebar();
  const { toast } = useToast();
  const isCollapsed = state === 'collapsed';
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

  if (isCollapsed) {
    const completedToday = habits.filter(habit => isHabitCompletedToday(habit.id)).length;
    const totalHabits = habits.length;
    
    return (
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-2 rounded-lg border bg-card text-card-foreground"
        >
          <div className="flex flex-col items-center space-y-1">
            <Target className="h-4 w-4 text-primary" />
            <div className="text-xs font-medium text-center">
              {completedToday}/{totalHabits}
            </div>
            <div className="text-[10px] text-muted-foreground text-center">
              Today
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
        >
          <Target className="h-3 w-3" />
          <span>Habit Tracker</span>
        </motion.h3>
      </AnimatePresence>
      
      <div className="space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="px-2 space-y-3"
          >
            {/* Add new habit */}
            <div className="flex space-x-1">
              <Input
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="New habit..."
                className="h-7 text-xs"
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
              <Button
                onClick={addHabit}
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0"
                disabled={!newHabitName.trim()}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Habits list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {loading ? (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Loading habits...
                </div>
              ) : habits.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-2">
                  No habits yet. Add one above!
                </div>
              ) : (
                habits.map((habit) => {
                  const completed = isHabitCompletedToday(habit.id);
                  return (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-2 p-2 rounded-md bg-muted/50"
                    >
                      <Checkbox
                        checked={completed}
                        onCheckedChange={() => toggleHabitCompletion(habit.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate ${completed ? 'line-through text-muted-foreground' : ''}`}>
                          {habit.name}
                        </div>
                        {habit.streak_count > 0 && (
                          <div className="flex items-center space-x-1 mt-0.5">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="text-[10px] text-muted-foreground">
                              {habit.streak_count} day{habit.streak_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}